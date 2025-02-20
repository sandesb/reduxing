// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  matricNo: null,
  name: null,
  semester: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.matricNo = action.payload.matricNo;
      state.name = action.payload.name;
      state.semester = action.payload.semester;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.matricNo = null;
      state.name = null;
      state.semester = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;

