import axios from 'axios';
import { API_URL } from './config';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

API.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
