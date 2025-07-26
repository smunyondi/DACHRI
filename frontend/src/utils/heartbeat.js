import axios from "axios";

export function startHeartbeat() {
  const token = localStorage.getItem("token");
  if (!token) return;
  if (window.__dachriHeartbeat) return; // Prevent multiple intervals
  window.__dachriHeartbeat = setInterval(() => {
    axios.get("/api/auth/ping", {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
  }, 1000); // 1 second
}

export function stopHeartbeat() {
  if (window.__dachriHeartbeat) {
    clearInterval(window.__dachriHeartbeat);
    window.__dachriHeartbeat = null;
  }
}
