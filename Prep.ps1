# ================================================================
# prep.ps1 — DevOps Workshop Session Preparation Script
# Prof. Raghavendra S | KSIT | Run this BEFORE every build session
# ================================================================
# HOW TO RUN:
#   Right-click prep.ps1 → Run with PowerShell
#   OR in PowerShell terminal: .\prep.ps1
# ================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DevOps Workshop — Session Prep Script " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── STEP 1: Check Docker Desktop is running ──────────────────────
Write-Host "Step 1: Checking Docker Desktop..." -ForegroundColor Yellow
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Docker Desktop is NOT running!" -ForegroundColor Red
    Write-Host "  → Open Docker Desktop and wait for the green whale icon." -ForegroundColor Red
    Write-Host "  → Then run this script again." -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Docker Desktop is running." -ForegroundColor Green
Write-Host ""

# ── STEP 2: Check minikube is running ────────────────────────────
Write-Host "Step 2: Checking Minikube..." -ForegroundColor Yellow
$minikubeStatus = minikube status 2>&1
if ($minikubeStatus -match "Running") {
    Write-Host "  ✅ Minikube is running." -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Minikube is not running. Starting it now..." -ForegroundColor Yellow
    minikube start --driver=docker
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Minikube failed to start. Check Docker Desktop is running first." -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✅ Minikube started successfully." -ForegroundColor Green
}
Write-Host ""

# ── STEP 3: Check Jenkins container is running ───────────────────
Write-Host "Step 3: Checking Jenkins container..." -ForegroundColor Yellow
$jenkinsRunning = docker ps --filter "name=jenkins" --filter "status=running" -q
if ($jenkinsRunning) {
    Write-Host "  ✅ Jenkins container is running." -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Jenkins is not running. Starting it now..." -ForegroundColor Yellow
    docker start jenkins
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Jenkins container not found." -ForegroundColor Red
        Write-Host "  → Run the full Jenkins setup from the Lab Guide first." -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✅ Jenkins started." -ForegroundColor Green
    Write-Host "  ⏳ Waiting 20 seconds for Jenkins to initialise..." -ForegroundColor Yellow
    Start-Sleep -Seconds 20
}
Write-Host ""

# ── STEP 4: Add jenkins user to docker group ─────────────────────
Write-Host "Step 4: Adding jenkins user to docker group..." -ForegroundColor Yellow
docker exec -u root jenkins bash -c "groupadd docker 2>/dev/null || true && usermod -aG docker jenkins" 2>&1 | Out-Null
Write-Host "  ✅ Done." -ForegroundColor Green
Write-Host ""

# ── STEP 5: Fix docker.sock permissions ──────────────────────────
# This is the CRITICAL step. Without it Stage 3 fails with:
# "permission denied while trying to connect to the Docker daemon socket"
Write-Host "Step 5: Fixing docker.sock permissions (chmod 666)..." -ForegroundColor Yellow
docker exec -u root jenkins chmod 666 /var/run/docker.sock
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ docker.sock permissions fixed." -ForegroundColor Green
} else {
    Write-Host "  ❌ Failed to fix docker.sock. Jenkins container may not be ready yet." -ForegroundColor Red
    Write-Host "  → Wait 30 seconds and run this script again." -ForegroundColor Red
    exit 1
}
Write-Host ""

# ── STEP 6: Verify Docker works INSIDE Jenkins ───────────────────
Write-Host "Step 6: Verifying Docker inside Jenkins..." -ForegroundColor Yellow
$dockerInJenkins = docker exec jenkins docker ps 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Docker is accessible inside Jenkins." -ForegroundColor Green
} else {
    Write-Host "  ❌ Docker NOT working inside Jenkins." -ForegroundColor Red
    Write-Host "  → Run the Docker CLI install command from the Lab Guide." -ForegroundColor Red
    Write-Host "  → docker exec -u root jenkins bash -c 'apt-get install -y docker.io'" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# ── STEP 7: Verify kubectl works INSIDE Jenkins ──────────────────
Write-Host "Step 7: Verifying kubectl inside Jenkins..." -ForegroundColor Yellow
$kubectlInJenkins = docker exec jenkins kubectl get nodes 2>&1
if ($kubectlInJenkins -match "Ready") {
    Write-Host "  ✅ kubectl is working. Minikube node is Ready." -ForegroundColor Green
} else {
    Write-Host "  ⚠️  kubectl could not reach minikube." -ForegroundColor Yellow
    Write-Host "  → Updating kubeconfig inside Jenkins..." -ForegroundColor Yellow

    # Fix kubeconfig — replace 127.0.0.1 with minikube's internal IP
    $minikubeIP = minikube ip
    kubectl config view --flatten --minify | Out-File -Encoding utf8 -FilePath "$env:TEMP\kubeconfig-flat.yaml"
    $config = Get-Content "$env:TEMP\kubeconfig-flat.yaml" -Raw
    # Replace localhost/127.0.0.1 with actual minikube IP
    $config = $config -replace 'https://127\.0\.0\.1:\d+', "https://${minikubeIP}:8443"
    $config | Out-File -Encoding utf8 -FilePath "$env:TEMP\kubeconfig-flat.yaml"

    docker exec -u root jenkins mkdir -p /var/jenkins_home/.kube
    docker cp "$env:TEMP\kubeconfig-flat.yaml" jenkins:/var/jenkins_home/.kube/config
    docker exec -u root jenkins chown jenkins:jenkins /var/jenkins_home/.kube/config
    docker exec -u root jenkins chmod 600 /var/jenkins_home/.kube/config

    # Verify again
    $retry = docker exec jenkins kubectl get nodes 2>&1
    if ($retry -match "Ready") {
        Write-Host "  ✅ kubeconfig fixed. kubectl now works inside Jenkins." -ForegroundColor Green
    } else {
        Write-Host "  ❌ kubectl still not working. Call faculty." -ForegroundColor Red
        Write-Host "  Output: $retry" -ForegroundColor Gray
    }
}
Write-Host ""

# ── STEP 8: Verify Node.js works INSIDE Jenkins ──────────────────
Write-Host "Step 8: Verifying Node.js inside Jenkins..." -ForegroundColor Yellow
$nodeInJenkins = docker exec jenkins node --version 2>&1
if ($nodeInJenkins -match "v") {
    Write-Host "  ✅ Node.js $nodeInJenkins is available inside Jenkins." -ForegroundColor Green
} else {
    Write-Host "  ❌ Node.js NOT found inside Jenkins." -ForegroundColor Red
    Write-Host "  → Run: docker exec -u root jenkins bash -c 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs'" -ForegroundColor Yellow
}
Write-Host ""

# ── FINAL SUMMARY ────────────────────────────────────────────────
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allContainers = docker ps --format "table {{.Names}}\t{{.Status}}" 2>&1
Write-Host "Running containers:" -ForegroundColor White
Write-Host $allContainers -ForegroundColor Gray
Write-Host ""

Write-Host "Jenkins URL  :  http://localhost:8090" -ForegroundColor White
Write-Host "Login        :  admin / Jenkins#123" -ForegroundColor White
Write-Host "Minikube IP  :  $(minikube ip)" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ ALL SYSTEMS READY — Happy Building! " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""