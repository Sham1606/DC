import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import authService from '../../services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  passwordResetStatus: 'INITIATED' | 'OTP_SENT' | 'OTP_VERIFIED' | 'PASSWORD_RESET' | null;
  passwordResetError: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  access_token: string;
  user: User;
}

interface ResetPasswordResponse {
  message: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: !!localStorage.getItem('token'),
  error: null,
  passwordResetStatus: null,
  passwordResetError: null,
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const register = createAsyncThunk<AuthResponse, { email: string; password: string; name: string; role: string }, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const login = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Invalid credentials');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const oauthLogin = createAsyncThunk<AuthResponse, string, { rejectValue: string }>(
  'auth/oauthLogin',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get<User>(`${API_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem('token', token);
      return { success: true, message: 'OAuth login successful', access_token: token, user: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'OAuth login failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const initiatePasswordReset = createAsyncThunk<ResetPasswordResponse, string, { rejectValue: string }>(
  'auth/initiatePasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.initiatePasswordReset(email);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Password reset initiation failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const verifyOTP = createAsyncThunk<ResetPasswordResponse, { email: string; otp: string }, { rejectValue: string }>(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(email, otp);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const resetPassword = createAsyncThunk<ResetPasswordResponse, { email: string; newPassword: string }, { rejectValue: string }>(
  'auth/resetPassword',
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(email, newPassword);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Password reset failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.passwordResetStatus = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isAuthenticated = true; 
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(oauthLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(oauthLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(oauthLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'OAuth login failed';
      })
      .addCase(initiatePasswordReset.pending, (state) => {
        state.isLoading = true;
        state.passwordResetError = null;
      })
      .addCase(initiatePasswordReset.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetStatus = 'OTP_SENT';
      })
      .addCase(initiatePasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.passwordResetError = action.payload as string;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetStatus = 'OTP_VERIFIED';
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'OTP verification failed';
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetStatus = 'PASSWORD_RESET';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Password reset failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
