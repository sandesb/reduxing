// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiReducer';
import coursesApi from './coursesApi';
import studentsApi from './studentsApi';
import adminApi from './adminApi'; // Import adminApi
import userReducer from './userSlice'; // Client-side user reducer
import adminReducer from './adminSlice'; // Admin-side user reducer

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer, // Add adminApi reducer
    user: userReducer, // Client-side
    admin: adminReducer, // Admin-side
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(coursesApi.middleware)
      .concat(studentsApi.middleware)
      .concat(adminApi.middleware), // Add adminApi middleware
});
