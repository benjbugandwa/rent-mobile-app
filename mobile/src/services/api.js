import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// L'IP 192.168.0.252 correspond à votre adresse IPv4 locale sur le réseau Wi-Fi
const API_URL = 'http://192.168.0.252:8000/api'; 

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('AsyncStorage Error:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
