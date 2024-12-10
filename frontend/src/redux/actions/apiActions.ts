import { createAsyncThunk } from '@reduxjs/toolkit'
import apiService from '../../services/apiService'

// Generic fetch action
export const fetchData = createAsyncThunk(
  'api/fetchData',
  async (endpoint: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get(endpoint)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

// Generic create action
export const createData = createAsyncThunk(
  'api/createData',
  async ({ endpoint, data }: { endpoint: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.post(endpoint, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

// Generic update action
export const updateData = createAsyncThunk(
  'api/updateData',
  async ({ endpoint, id, data }: { endpoint: string; id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`${endpoint}/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

// Generic delete action
export const deleteData = createAsyncThunk(
  'api/deleteData',
  async ({ endpoint, id }: { endpoint: string; id: string }, { rejectWithValue }) => {
    try {
      await apiService.delete(`${endpoint}/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

// Specific actions for different resources
export const fetchMealPlans = createAsyncThunk(
  'mealPlans/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/meal-plans')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetch',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/users/${userId}/profile`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'userProfile/update',
  async ({ userId, data }: { userId: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/users/${userId}/profile`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

export const logSymptom = createAsyncThunk(
  'symptoms/log',
  async (symptomData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/symptoms', symptomData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

export const fetchNutritionData = createAsyncThunk(
  'nutrition/fetchData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/users/${userId}/nutrition`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred')
    }
  }
)

