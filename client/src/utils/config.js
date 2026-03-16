// ============================================================
// Central API Base URL Configuration
// Local par: http://localhost:5000
// Hostinger par: https://farmliv.in  (same origin, auto detect)
// ============================================================

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// Hostinger par Server aur Frontend ek hi domain par hain
// isliye window.location.origin hi backend ka URL hai
export const API_BASE = isLocalhost 
  ? 'http://localhost:5000' 
  : window.location.origin;

export const API_URL = `${API_BASE}/api`;

export default API_BASE;
