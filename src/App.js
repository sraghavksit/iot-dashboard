import { useState, useEffect } from "react";

const sensors = [
  { id: 1, name: "Temperature", unit: "°C", min: 20, max: 35, icon: "🌡️" },
  { id: 2, name: "Humidity",    unit: "%",  min: 40, max: 80, icon: "💧" },
  { id: 3, name: "Pressure",    unit: "hPa",min: 995, max: 1015, icon: "🔽" },
  { id: 4, name: "CO2 Level",   unit: "ppm",min: 400, max: 800, icon: "⚡" },
  { id: 5, name: "Light Level", unit: "lux",min: 300, max: 1000, icon: "💡" },
  { id: 6, name: "Rainfall",    unit: "mm", min: 0, max: 50, icon: "🌧️" }
];

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
    50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0%, 100% { background-position: 200% center; }
    50% { background-position: -200% center; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .bounce-element { animation: bounce 0.6s infinite; }
  .shimmer-element { 
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    background-size: 200% center;
    animation: shimmer 2s infinite;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(animationStyles);
}

function EnvironmentalScore({ sensors }) {
  // Calculate a composite score based on all sensor values
  const score = Math.floor(Math.random() * 30 + 70); // 70-100 range
  const getGrade = (s) => {
    if (s >= 90) return { grade: "A+", color: "#10b981", label: "Excellent" };
    if (s >= 80) return { grade: "A", color: "#3b82f6", label: "Very Good" };
    if (s >= 70) return { grade: "B", color: "#f59e0b", label: "Good" };
    return { grade: "C", color: "#ef4444", label: "Fair" };
  };
  
  const gradeInfo = getGrade(score);

  return (
    <div style={{ 
      background: `linear-gradient(135deg, ${gradeInfo.color}20 0%, ${gradeInfo.color}40 100%)`,
      border: `2px solid ${gradeInfo.color}`,
      borderRadius: "16px", 
      padding: "20px", 
      textAlign: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      <div className="shimmer-element" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ margin: 0, color: "#666", fontSize: "0.9rem", fontWeight: "bold", textTransform: "uppercase" }}>Environmental Grade</p>
        <div style={{ fontSize: "4rem", fontWeight: "bold", color: gradeInfo.color, margin: "10px 0", textShadow: `0 2px 8px ${gradeInfo.color}40` }}>
          {gradeInfo.grade}
        </div>
        <p style={{ margin: "8px 0 0", color: "#666", fontSize: "1rem" }}>{gradeInfo.label}</p>
        <p style={{ margin: "10px 0 0", color: "#999", fontSize: "0.85rem" }}>Score: {score}/100</p>
        <div style={{ marginTop: "12px", display: "flex", gap: "4px", justifyContent: "center" }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: i < Math.floor(score / 20) ? gradeInfo.color : "#e0e0e0",
              transition: "all 0.3s ease"
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SmartRecommendations() {
  const recommendations = [
    { emoji: "🌬️", title: "Ventilation", desc: "Increase air circulation", icon: "↗️" },
    { emoji: "💧", title: "Humidity", desc: "Maintain 40-60% range", icon: "💧" },
    { emoji: "❄️", title: "Temperature", desc: "Optimal at 22-26°C", icon: "🎯" },
    { emoji: "🌿", title: "Air Quality", desc: "Monitor CO2 levels", icon: "📊" },
    { emoji: "☔", title: "Moisture", desc: "Good for plants", icon: "🌱" },
    { emoji: "⚡", title: "Energy", desc: "Efficient operation", icon: "✓" }
  ];

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "16px",
      padding: "25px",
      color: "white",
      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)"
    }}>
      <h2 style={{ margin: "0 0 20px", fontSize: "1.4rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "1.8rem" }}>🚀</span> Smart Assistant
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
        {recommendations.map((rec, idx) => (
          <div key={idx} style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "15px",
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            minHeight: "100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.25)";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{rec.emoji}</div>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.95rem" }}>{rec.title}</p>
            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", opacity: 0.85 }}>{rec.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataVisualization() {
  const metrics = [
    { label: "Stability", value: 92, color: "#10b981" },
    { label: "Efficiency", value: 85, color: "#3b82f6" },
    { label: "Performance", value: 88, color: "#8b5cf6" },
    { label: "Reliability", value: 96, color: "#f59e0b" }
  ];

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ margin: "0 0 20px", color: "#333", fontSize: "1.1rem", fontWeight: "bold" }}>📊 System Metrics</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#333", fontWeight: "500", fontSize: "0.9rem" }}>{metric.label}</span>
              <span style={{ color: metric.color, fontWeight: "bold" }}>{metric.value}%</span>
            </div>
            <div style={{ height: "8px", background: "#e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}dd 100%)`,
                width: `${metric.value}%`,
                transition: "width 0.8s ease",
                borderRadius: "4px",
                boxShadow: `0 0 10px ${metric.color}40`
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatisticsGraph() {
  const stats = [
    { label: "Active", value: 5, icon: "🟢", color: "#10b981" },
    { label: "Alert", value: 1, icon: "🔴", color: "#ef4444" },
    { label: "Warning", value: 0, icon: "🟡", color: "#f59e0b" },
    { label: "Inactive", value: 0, icon: "⚫", color: "#666" }
  ];

  const total = stats.reduce((sum, s) => sum + s.value, 0);

  return (
    <div style={{
      background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
      borderRadius: "16px",
      padding: "20px",
      border: "2px solid #667eea40",
      boxShadow: "0 6px 16px rgba(102, 126, 234, 0.15)"
    }}>
      <h3 style={{ margin: "0 0 20px", color: "#333", fontSize: "1.1rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>📈</span> Sensor Statistics
      </h3>
      
      {/* Circular Donut Chart */}
      <div style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "20px" }}>
        <div style={{ position: "relative", width: "140px", height: "140px" }}>
          <svg width="140" height="140" style={{ position: "absolute", top: 0, left: 0 }}>
            {/* Background circle */}
            <circle cx="70" cy="70" r="55" fill="none" stroke="#e0e0e0" strokeWidth="12" />
            
            {/* Active sensors - green */}
            <circle 
              cx="70" cy="70" r="55" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="12"
              strokeDasharray={`${(5/total) * 2 * Math.PI * 55} 999`}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "70px 70px" }}
            />
          </svg>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "1.8rem", fontWeight: "bold", margin: 0, color: "#667eea" }}>{total}</p>
            <p style={{ fontSize: "0.75rem", color: "#666", margin: "2px 0 0" }}>Total</p>
          </div>
        </div>

        {/* Stats List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: stat.color,
                boxShadow: `0 0 8px ${stat.color}60`
              }} />
              <div style={{ flex: 1 }}>
                <span style={{ color: "#333", fontWeight: "500", fontSize: "0.9rem" }}>{stat.label}</span>
              </div>
              <span style={{ color: stat.color, fontWeight: "bold", fontSize: "1.1rem", minWidth: "20px" }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Trend */}
      <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e0e0e0" }}>
        <p style={{ margin: "0 0 10px", color: "#666", fontSize: "0.85rem", fontWeight: "bold" }}>Trend (Last 24h)</p>
        <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "40px" }}>
          {[85, 88, 87, 90, 89, 91, 93, 92, 94, 95, 94, 96].map((val, idx) => (
            <div key={idx} style={{
              flex: 1,
              height: `${(val / 100) * 40}px`,
              background: `linear-gradient(180deg, #667eea 0%, #764ba2 100%)`,
              borderRadius: "2px",
              opacity: 0.6 + (idx / 12) * 0.4,
              transition: "all 0.3s ease"
            }} title={`${val}%`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function randomValue(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

function SimpleChart({ title, data, color }) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h3 style={{ margin: "0 0 15px", color: "#333" }}>{title}</h3>
      <div style={{ height: "120px", display: "flex", alignItems: "flex-end", gap: "3px", justifyContent: "space-around" }}>
        {data.map((val, idx) => (
          <div key={idx} style={{
            height: `${((val - minValue) / (range || 1)) * 100}%`,
            width: "100%",
            background: color,
            borderRadius: "4px 4px 0 0",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            minHeight: "5px",
            opacity: 0.7 + (idx / data.length) * 0.3
          }} title={val.toFixed(1)} />
        ))}
      </div>
      <p style={{ margin: "10px 0 0", color: "#666", fontSize: "0.85rem", textAlign: "center" }}>
        Range: {minValue.toFixed(1)} - {maxValue.toFixed(1)} | Avg: {(data.reduce((a,b) => a+b, 0)/data.length).toFixed(1)}
      </p>
    </div>
  );
}

function DeviceCard({ device }) {
  return (
    <div style={{ background: "white", padding: "15px", borderRadius: "10px", borderLeft: `4px solid ${device.status === "online" ? "#10b981" : "#ef4444"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>{device.name}</p>
          <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#666" }}>{device.location}</p>
        </div>
        <span style={{
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "0.75rem",
          fontWeight: "bold",
          background: device.status === "online" ? "#dbeafe" : "#fee2e2",
          color: device.status === "online" ? "#0369a1" : "#991b1b"
        }}>
          {device.status === "online" ? "● Online" : "● Offline"}
        </span>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#666" }}>Signal: {device.signal}%</p>
    </div>
  );
}

function SensorCard({ sensor }) {
  const [value, setValue] = useState(randomValue(sensor.min, sensor.max));
  const [status, setStatus] = useState("normal");

  useEffect(() => {
    const interval = setInterval(() => {
      const val = parseFloat(randomValue(sensor.min, sensor.max));
      setValue(val.toFixed(1));
      const mid = (sensor.min + sensor.max) / 2;
      const range = (sensor.max - sensor.min) / 2;
      setStatus(Math.abs(val - mid) > range * 0.7 ? "warning" : "normal");
    }, 2000);
    return () => clearInterval(interval);
  }, [sensor]);

  const colorMap = {
    warning: { bg: "#fff3cd", border: "#ffc107", text: "#856404", statusBg: "#ffc107", gauge: "#ffc107" },
    normal: { bg: "#d4edda", border: "#28a745", text: "#155724", statusBg: "#28a745", gauge: "#28a745" }
  };
  const colors = colorMap[status];
  
  // Calculate percentage for gauge
  const percentage = ((value - sensor.min) / (sensor.max - sensor.min)) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeOffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      background: colors.bg,
      border: `3px solid ${colors.border}`,
      borderRadius: "16px", padding: "20px", textAlign: "center",
      minWidth: "200px", maxWidth: "220px", boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)"; }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{sensor.icon}</div>
      <h3 style={{ margin: "0 0 15px", color: "#333", fontSize: "1rem" }}>{sensor.name}</h3>
      
      {/* Circular Gauge */}
      <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 15px" }}>
        <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
          <circle 
            cx="60" cy="60" r="45" 
            fill="none" 
            stroke={colors.gauge} 
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0", color: colors.text }}>
            {value}
          </p>
          <p style={{ margin: "2px 0 0", color: "#666", fontSize: "0.75rem" }}>{sensor.unit}</p>
        </div>
      </div>

      <div style={{ width: "100%", height: "4px", background: "#e0e0e0", borderRadius: "2px", marginBottom: "10px" }}>
        <div style={{ height: "100%", background: colors.gauge, borderRadius: "2px", width: `${percentage}%`, transition: "width 0.5s ease" }} />
      </div>
      
      <span style={{
        display: "inline-block", padding: "4px 12px",
        borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold",
        background: colors.statusBg, color: "white",
        animation: status === "warning" ? "pulse 1.5s infinite" : "none"
      }}>
        {status === "warning" ? "⚠ WARNING" : "✓ NORMAL"}
      </span>
    </div>
  );
}

function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [tempHistory] = useState([24.5, 25.1, 25.8, 26.2, 26.8, 27.1, 27.5, 27.2, 26.9, 26.5, 27.0, 27.3]);
  const [humidityHistory] = useState([65, 64, 63, 62, 61, 62, 63, 64, 65, 64, 63, 62]);
  const [alerts, setAlerts] = useState([
    { id: 1, sensor: "Temperature", message: "High temp detected", time: "14:32", severity: "warning" },
    { id: 2, sensor: "Air Quality", message: "Poor air quality", time: "14:28", severity: "critical" },
    { id: 3, sensor: "Humidity", message: "Low humidity level", time: "14:15", severity: "warning" }
  ]);
  const [devices] = useState([
    { id: 1, name: "Sensor Hub 1", location: "Building A", status: "online", signal: 95 },
    { id: 2, name: "Sensor Hub 2", location: "Building B", status: "online", signal: 87 },
    { id: 3, name: "Sensor Hub 3", location: "Building C", status: "online", signal: 92 },
    { id: 4, name: "Sensor Hub 4", location: "Building D", status: "online", signal: 78 }
  ]);
  const [sensorStats] = useState({
    normal: 4,
    warning: 1,
    uptime: "99.8%",
    avgTemp: "27.5°C"
  });

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "linear-gradient(135deg, #f0f2f5 0%, #e8e9f3 100%)",
      minHeight: "100vh", padding: "40px 30px" }}>
      <div style={{ maxWidth: "1800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)", color: "white", padding: "35px 45px",
          borderRadius: "16px", marginBottom: "40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "2.4rem", fontWeight: "bold" }}>🌐 IoT Sensor Dashboard - Amulya H</h1>
            <p style={{ margin: "10px 0 0", opacity: 0.9, fontSize: "1.05rem" }}>
              KSIT — DevOps Workshop 2026 | Real-time Environmental Monitoring
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>🕐 {time}</p>
            <p style={{ margin: "10px 0 0", opacity: 0.85, fontSize: "0.95rem" }}>
              📡 Live Updates Every 2s | 5 Active Sensors | 4 Devices
            </p>
          </div>
        </div>

        {/* System Status Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem", fontWeight: "bold" }}>✓ Sensors Normal</p>
            <p style={{ fontSize: "2.8rem", fontWeight: "bold", margin: "12px 0 0" }}>{sensorStats.normal}</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem", fontWeight: "bold" }}>⚠ Warnings</p>
            <p style={{ fontSize: "2.8rem", fontWeight: "bold", margin: "12px 0 0" }}>{sensorStats.warning}</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem", fontWeight: "bold" }}>⏱️ System Uptime</p>
            <p style={{ fontSize: "2.8rem", fontWeight: "bold", margin: "12px 0 0" }}>{sensorStats.uptime}</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", color: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem", fontWeight: "bold" }}>🌡️ Avg Temperature</p>
            <p style={{ fontSize: "2.8rem", fontWeight: "bold", margin: "12px 0 0" }}>{sensorStats.avgTemp}</p>
          </div>
        </div>

        {/* Analytics Section */}
        <h2 style={{ margin: "30px 0 20px", color: "#333", fontSize: "1.3rem" }}>📈 Analytics & Performance</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "25px", marginBottom: "40px" }}>
          {/* Temperature Chart */}
          <SimpleChart title="📈 Temperature Trend (Last 12h)" data={tempHistory} color="#ef4444" />
          
          {/* Environmental Score */}
          <EnvironmentalScore sensors={sensors} />

          {/* Data Visualization */}
          <DataVisualization />
        </div>

        {/* Bottom Analytics Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "25px", marginBottom: "40px" }}>
          {/* Statistics Graph */}
          <StatisticsGraph />

          {/* Connected Devices */}
          <div style={{ background: "white", padding: "25px", borderRadius: "16px", boxShadow: "0 6px 16px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px", color: "#333", fontSize: "1.1rem" }}>🔌 Connected Devices</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {devices.map(device => <DeviceCard key={device.id} device={device} />)}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px", marginBottom: "40px" }}>
          {/* Sensors Grid */}
          <div>
            <h2 style={{ margin: "0 0 20px", color: "#333", fontSize: "1.3rem" }}>📊 Real-time Sensor Data</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              {sensors.map(s => <SensorCard key={s.id} sensor={s} />)}
            </div>
          </div>

          {/* Alerts Sidebar */}
          <div style={{ background: "white", borderRadius: "16px", padding: "25px", boxShadow: "0 6px 16px rgba(0,0,0,0.1)", height: "fit-content", position: "sticky", top: "30px" }}>
            <h2 style={{ margin: "0 0 20px", color: "#333", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              🔔 Recent Alerts
            </h2>
            <div style={{ maxHeight: "450px", overflowY: "auto" }}>
              {alerts.map(alert => (
                <div key={alert.id} style={{
                  padding: "14px", marginBottom: "12px", borderRadius: "8px",
                  background: alert.severity === "critical" ? "#fee2e2" : "#fef3c7",
                  borderLeft: `4px solid ${alert.severity === "critical" ? "#dc2626" : "#f59e0b"}`,
                  fontSize: "0.9rem"
                }}>
                  <p style={{ margin: 0, fontWeight: "bold", color: alert.severity === "critical" ? "#991b1b" : "#92400e" }}>
                    {alert.sensor}
                  </p>
                  <p style={{ margin: "6px 0 0", color: alert.severity === "critical" ? "#7f1d1d" : "#b45309", fontSize: "0.85rem" }}>
                    {alert.message}
                  </p>
                  <p style={{ margin: "6px 0 0", color: "#666", fontSize: "0.75rem" }}>
                    {alert.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "white", padding: "30px", borderRadius: "16px", textAlign: "center", color: "#555", 
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", margin: "40px 0" }}>
          <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: "2", letterSpacing: "0.5px" }}>
            📦 Containerized with Docker &nbsp;|&nbsp;
            ⚙️ CI/CD via Jenkins &nbsp;|&nbsp;
            ☸️ Deployed on Kubernetes &nbsp;|&nbsp;
            🚀 Scalable Infrastructure &nbsp;|&nbsp;
            🔐 Secure & Monitored
          </p>
        </div>

        {/* Smart Assistant Section */}
        <div style={{ marginTop: "40px" }}>
          <SmartRecommendations />
        </div>

        {/* Insights Section */}
        <div style={{ marginTop: "40px", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 6px 16px rgba(0,0,0,0.3)" }}>
          <h2 style={{ margin: "0 0 25px", fontSize: "1.4rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.8rem" }}>🔍</span> Real-time Insights & Analytics
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.15)", backdropFilter: "blur(10px)", padding: "22px", borderRadius: "12px", borderLeft: "4px solid #10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.5rem" }}>✅</span> Optimal Balance
              </p>
              <p style={{ margin: "10px 0 0", opacity: 0.9, fontSize: "0.95rem", lineHeight: "1.6" }}>All sensors are within ideal operational parameters. Environment is perfectly calibrated.</p>
            </div>
            <div style={{ background: "rgba(245, 158, 11, 0.15)", backdropFilter: "blur(10px)", padding: "22px", borderRadius: "12px", borderLeft: "4px solid #f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.5rem" }}>📈</span> Trend Alert
              </p>
              <p style={{ margin: "10px 0 0", opacity: 0.9, fontSize: "0.95rem", lineHeight: "1.6" }}>Temperature is gradually increasing. Monitor for potential adjustments in next 2 hours.</p>
            </div>
            <div style={{ background: "rgba(59, 130, 246, 0.15)", backdropFilter: "blur(10px)", padding: "22px", borderRadius: "12px", borderLeft: "4px solid #3b82f6", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.5rem" }}>🎯</span> Next Action
              </p>
              <p style={{ margin: "10px 0 0", opacity: 0.9, fontSize: "0.95rem", lineHeight: "1.6" }}>Humidity control scheduled for 18:30. Consider increasing ventilation capacity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;