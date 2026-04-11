import { useState, useEffect } from "react";
import "./App.css";

const sensors = [
  { id: 1, name: "Temperature", unit: "°C", min: 20, max: 35 },
  { id: 2, name: "Humidity",    unit: "%",  min: 40, max: 80 },
  { id: 3, name: "Pressure",    unit: "hPa",min: 995, max: 1015 },
  { id: 4, name: "CO2 Level",   unit: "ppm",min: 400, max: 800 },
];

function randomValue(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function getSensorStatus(sensor, value) {
  const mid = (sensor.min + sensor.max) / 2;
  const range = (sensor.max - sensor.min) / 2;
  return Math.abs(value - mid) > range * 0.7 ? "warning" : "normal";
}

function SensorCard({ sensor }) {
  return (
    <article className={`sensor-card ${sensor.status === "warning" ? "sensor-card-warning" : "sensor-card-normal"}`}>
      <h3 className="sensor-name">{sensor.name}</h3>
      <p className="sensor-value">{sensor.value.toFixed(1)}</p>
      <p className="sensor-unit">{sensor.unit}</p>
      <span className={`sensor-chip ${sensor.status === "warning" ? "chip-warning" : "chip-normal"}`}>
        {sensor.status === "warning" ? "WARNING" : "NORMAL"}
      </span>
    </article>
  );
}

function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [sensorReadings, setSensorReadings] = useState(() =>
    sensors.map((sensor) => {
      const value = randomValue(sensor.min, sensor.max);
      return {
        ...sensor,
        value,
        status: getSensorStatus(sensor, value),
      };
    })
  );

  const warningSensors = sensorReadings.filter((sensor) => sensor.status === "warning");
  const hasWarning = warningSensors.length > 0;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorReadings((prev) =>
        prev.map((sensor) => {
          const value = randomValue(sensor.min, sensor.max);
          return {
            ...sensor,
            value,
            status: getSensorStatus(sensor, value),
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="dashboard">
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">IoT Sensor Dashboard</h1>
            <p className="dashboard-subtitle">
              KSIT — DevOps Workshop 2026
            </p>
          </div>
          <div className="dashboard-clock">
            <p className="clock-time">{time}</p>
            <p className="clock-hint">
              Live Updates Every 2s
            </p>
          </div>
        </header>
        {hasWarning && (
          <div className="warning-banner" role="alert" aria-live="assertive">
            ALERT: Warning detected in {warningSensors.map((sensor) => sensor.name).join(", ")}
          </div>
        )}
        <div className="sensor-grid">
          {sensorReadings.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
        <footer className="dashboard-footer">
          <p>
            📦 Containerized with Docker &nbsp;|&nbsp;
            ⚙️ CI/CD via Jenkins &nbsp;|&nbsp;
            ☸️ Deployed on Kubernetes
          </p>
        </footer>
      </section>
    </main>
  );
}

export default App;