import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const TOKEN_EXPIRY_TIME = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getStoredAuthData = () => {
  const token = localStorage.getItem('token');
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  return { token, tokenTimestamp: tokenTimestamp ? parseInt(tokenTimestamp, 10) : null };
};

const setStoredAuthData = (token: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('tokenTimestamp', Date.now().toString());
};

const clearStoredAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenTimestamp');
};

const isTokenExpired = () => {
  const { tokenTimestamp } = getStoredAuthData();
  if (!tokenTimestamp) return true;
  return Date.now() - tokenTimestamp > TOKEN_EXPIRY_TIME;
};

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const { token } = getStoredAuthData();
    if (token) {
      if (isTokenExpired()) {
        clearStoredAuthData();
        window.location.href = '/login?expired=true';
        return Promise.reject('Token expired');
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuthData();
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    setStoredAuthData(token);
    return { user, token };
  },
  validateToken: async () => {
    const { token } = getStoredAuthData();
    if (!token || isTokenExpired()) {
      throw new Error('Token is invalid or expired');
    }
    const response = await api.get('/users/profile');
    return response.data;
  },
  logout: () => {
    clearStoredAuthData();
  }
};

export default api; 