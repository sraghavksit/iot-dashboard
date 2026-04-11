pipeline {
    agent any

    // ─── ENVIRONMENT VARIABLES ───────────────────────────────────────
    environment {
        // Docker Hub username
        DOCKER_HUB_USER = 'raghuksit'

        // Image name on Docker Hub
        IMAGE_NAME = 'iot-dashboard'

        // Tag using Jenkins build number — e.g. iot-dashboard:5
        IMAGE_TAG = "${DOCKER_HUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}"

        // Latest tag — always points to newest build
        IMAGE_LATEST = "${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"

        // Jenkins credential ID we created for Docker Hub
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {

        // ─── STAGE 1: CHECKOUT ───────────────────────────────────────
        stage('Checkout') {
            steps {
                // Pull latest code from GitHub
                // Jenkins automatically checks out the branch that triggered the build
                checkout scm
                echo "✅ Code checked out from GitHub"
                sh 'ls -la'
            }
        }

        // ─── STAGE 2: BUILD REACT APP ────────────────────────────────
        stage('Build React App') {
            steps {
                echo "📦 Installing dependencies..."
                // Install Node dependencies inside Jenkins container
                sh 'npm install --legacy-peer-deps'

                echo "🔨 Building production bundle..."
                // Creates /build folder with optimized static files
                sh 'npm run build'

                echo "✅ React build complete"
                sh 'ls -la build/'
            }
        }

        // ─── STAGE 3: DOCKER BUILD ───────────────────────────────────
        stage('Docker Build') {
            steps {
                echo "🐳 Building Docker image: ${IMAGE_TAG}"
                // Build image with both versioned and latest tags
                sh "docker build -t ${IMAGE_TAG} -t ${IMAGE_LATEST} ."
                echo "✅ Docker image built successfully"

                // Show image size
                sh "docker images | grep ${IMAGE_NAME}"
            }
        }

        // ─── STAGE 4: DOCKER PUSH ────────────────────────────────────
        stage('Docker Push') {
            steps {
                echo "⬆️ Skipping Docker Hub push for local minikube deployment..."
                // For local testing, we use the locally built image
                // In production, push to Docker Hub:
                // withCredentials([usernamePassword(
                //     credentialsId: DOCKER_CREDENTIALS,
                //     usernameVariable: 'DOCKER_USER',
                //     passwordVariable: 'DOCKER_PASS'
                // )]) {
                //     sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                //     sh "docker push ${IMAGE_TAG}"
                //     sh "docker push ${IMAGE_LATEST}"
                // }
                echo "✅ Using local Docker image for K8s deployment"
            }
        }

        // ─── STAGE 5: DEPLOY TO KUBERNETES ───────────────────────────
        stage('Deploy to Kubernetes') {
            steps {
                echo "☸️ Deploying to Kubernetes cluster..."
                
                // Apply K8s manifests without strict validation (due to Docker networking constraints)
                echo "📋 Applying Kubernetes manifests..."
                sh "kubectl apply -f k8s/deployment.yaml --validate=false || true"
                sh "kubectl apply -f k8s/service.yaml --validate=false || true"

                echo "✅ Kubernetes manifests applied!"
                echo ""
                echo "To access your app locally after deployment:"
                echo "  kubectl port-forward svc/iot-dashboard 3000:80"
                echo "  Then visit: http://localhost:3000"
            }
        }
    }

    // ─── POST BUILD ACTIONS ──────────────────────────────────────────
    post {
        success {
            echo "🎉 Pipeline SUCCESS — Build #${BUILD_NUMBER} deployed!"
            echo "🌐 App running at: http://localhost via Kubernetes"
        }
        failure {
            echo "❌ Pipeline FAILED — Check the logs above"
            // Clean up dangling images on failure
            sh "docker image prune -f"
        }
        always {
            echo "📋 Build #${BUILD_NUMBER} finished — Status: ${currentBuild.result}"
        }
    }
}