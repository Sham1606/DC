import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response;
  },
  register: async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  initiatePasswordReset: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { email });
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('No account found with this email address');
      }
      throw error;
    }
  },
  verifyOTP: (email: string, otp: string) => {
    return axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
  },
  resetPassword: (email: string, newPassword: string) => {
    return axios.post(`${API_URL}/auth/reset-password-complete`, { email, new_password: newPassword });
  },
  oauthLogin: (token: string) => {
    return axios.get(`${API_URL}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default authService;

