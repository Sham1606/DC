import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateHealthProfile = createAsyncThunk(
  'healthProfile/update',
  async (profileData: any, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await axios.put('http://localhost:5000/api/profile', profileData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHealthProfile = createAsyncThunk(
  'healthProfile/get',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const healthProfileSlice = createSlice({
  name: 'healthProfile',
  initialState: {
    profile: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateHealthProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateHealthProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateHealthProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getHealthProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHealthProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getHealthProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default healthProfileSlice.reducer;

