import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Remplacer par l'IP de votre machine locale (ex: 192.168.1.x au lieu de localhost pour mobile)
const API_URL = 'http://10.0.2.2:8000/api'; 

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
