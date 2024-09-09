// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiReducer';
import coursesApi from './coursesApi';
import studentsApi from './studentsApi';
import userReducer from './userSlice'; // Import the user slice

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    user: userReducer, // Add user reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(coursesApi.middleware)
      .concat(studentsApi.middleware),
});
