import { useState, useEffect } from "react";

const sensors = [
  { id: 1, name: "Temperature", unit: "°C", min: 20, max: 35 },
  { id: 2, name: "Humidity", unit: "%", min: 40, max: 80 },
  { id: 3, name: "Pressure", unit: "hPa", min: 995, max: 1015 },
  { id: 4, name: "CO2 Level", unit: "ppm", min: 400, max: 800 },
  { id: 5, name: "Air Quality", unit: "AQI", min: 50, max: 200 },
];

function randomValue(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

function SensorCard({ sensor, isDarkMode }) {
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

  const bgColor =
    status === "warning"
      ? isDarkMode
        ? "#704000"
        : "#fff3cd"
      : isDarkMode
      ? "#1a3a1a"
      : "#d4edda";

  const textColor =
    status === "warning"
      ? isDarkMode
        ? "#ffb800"
        : "#856404"
      : isDarkMode
      ? "#4ade80"
      : "#155724";

  const cardTextColor = isDarkMode ? "#e0e0e0" : "#333";

  return (
    <div
      style={{
        background: bgColor,
        border: `2px solid ${status === "warning" ? "#ffc107" : "#28a745"}`,
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
        minWidth: "180px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      }}
    >
      <h3 style={{ margin: "0 0 10px", color: cardTextColor }}>{sensor.name}</h3>

      <p
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          margin: "0",
          color: textColor,
        }}
      >
        {value}
      </p>

      <p style={{ margin: "5px 0 0", color: isDarkMode ? "#b0b0b0" : "#666" }}>
        {sensor.unit}
      </p>

      <span
        style={{
          display: "inline-block",
          marginTop: "10px",
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "bold",
          background: status === "warning" ? "#ffc107" : "#28a745",
          color: "white",
        }}
      >
        {status === "warning" ? "⚠ Warning" : "✓ Normal"}
      </span>
    </div>
  );
}

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const bgColor = isDarkMode ? "#1a1a1a" : "#f0f2f5";
  const headerColor = isDarkMode ? "#0f172a" : "#2c3e50";
  const footerBgColor = isDarkMode ? "#2d2d2d" : "white";
  const footerTextColor = isDarkMode ? "#b0b0b0" : "#666";

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: bgColor,
        minHeight: "100vh",
        padding: "30px",
        transition: "background 0.3s",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            background: headerColor,
            color: "white",
            padding: "20px 30px",
            borderRadius: "12px",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "background 0.3s",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "1.8rem" }}>
              🌐 IoT Sensor Dashboard - Amulya H
            </h1>
            <p style={{ margin: "5px 0 0", opacity: 0.7 }}>
              KSIT — DevOps Workshop 2026
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "2px solid white",
                background: isDarkMode ? "#333" : "white",
                color: isDarkMode ? "white" : "#333",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.3s",
              }}
            >
              {isDarkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "1.2rem" }}>🕐 {time}</p>
              <p style={{ margin: "5px 0 0", opacity: 0.7, fontSize: "0.85rem" }}>
                Live Updates Every 2s
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {sensors.map((s) => (
            <SensorCard key={s.id} sensor={s} isDarkMode={isDarkMode} />
          ))}
        </div>

        <div
          style={{
            marginTop: "30px",
            background: footerBgColor,
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            color: footerTextColor,
            transition: "all 0.3s",
          }}
        >
          <p style={{ margin: 0 }}>
            📦 Containerized with Docker &nbsp;|&nbsp;
            ⚙️ CI/CD via Jenkins &nbsp;|&nbsp;
            ☸️ Deployed on Kubernetes
          </p>
        </div>
      </div>
    </div>
  );
}