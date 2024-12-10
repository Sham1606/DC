import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mealPlanReducer from './slices/mealPlanSlice';
import healthProfileReducer from './slices/healthProfileSlice';

export interface HealthProfile {
  dailySteps: number;
  activeMinutes: number;
  age: number;
  height: number;
  weight: number;
  name: string;
}

export interface MealPlan {
  id?: string;
  name: string;
  duration: number;
  createdAt: string;
  meals?: any[]; 
}

export interface MealPlanState {
  mealPlans: MealPlan[];
  currentPlan: MealPlan | null;
  isLoading: boolean;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mealPlan: mealPlanReducer,
    healthProfile: healthProfileReducer,
  },
});


export type RootState = {
  auth: {
    user: { name: string | null };
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    passwordResetStatus: 'INITIATED' | 'OTP_SENT' | 'OTP_VERIFIED' | null;
    passwordResetError: string | null;
  };
  mealPlan: MealPlanState;
  healthProfile: {
    profile: HealthProfile | null;
  };

}
export type AppDispatch = typeof store.dispatch;

