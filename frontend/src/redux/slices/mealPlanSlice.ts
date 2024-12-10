import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createMealPlan = createAsyncThunk(
  'mealPlan/create',
  async (duration: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await axios.post('http://localhost:5000/api/meal-plan', { duration }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMealPlans = createAsyncThunk(
  'mealPlan/getAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await axios.get('http://localhost:5000/api/meal-plan', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState: {
    mealPlans: [],
    currentPlan: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMealPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload;
        state.mealPlans.push(action.payload);
      })
      .addCase(createMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getMealPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMealPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealPlans = action.payload;
      })
      .addCase(getMealPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default mealPlanSlice.reducer;

