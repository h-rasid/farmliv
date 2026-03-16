import axios from 'axios';
import { API_URL } from './config';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

API.interceptors.request.use((config) => {
  // DIAGNOSTIC CORE: Detect if any request is literal ':id' or malformed
  if (config.url && config.url.includes(':id')) {
    console.error(`DIAGNOSTIC ALERT: API call to literal path detected: ${config.url}`);
    console.groupCollapsed('Diagnostic Stack Trace');
    console.trace();
    console.groupEnd();
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
