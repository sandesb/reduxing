// src/redux/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.email = action.payload.email;
      state.isAuthenticated = true;
      // Store in localStorage with the correct key
      localStorage.setItem('adminIsAuthenticated', 'true');
      localStorage.setItem('adminEmail', action.payload.email);
    },
    logout: (state) => {
      state.email = null;
      state.isAuthenticated = false;
      // Remove from localStorage
      localStorage.removeItem('adminIsAuthenticated');
      localStorage.removeItem('adminEmail');
    },
  },
});

export const { loginSuccess, logout } = adminSlice.actions;
export default adminSlice.reducer;
