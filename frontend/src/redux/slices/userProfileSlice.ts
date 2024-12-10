import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiService from '../../services/apiService'

export const fetchClients = createAsyncThunk(
  'userProfile/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/clients')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    clients: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false
        state.clients = action.payload
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default userProfileSlice.reducer

