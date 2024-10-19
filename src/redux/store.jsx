// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiReducer';
import subjectsApi from './subjectsApi';
import contentAdminApi from './contentAdminApi';

import studentsApi from './studentsApi';
import adminApi from './adminApi'; // Import adminApi
import userReducer from './userSlice'; // Client-side user reducer
import adminReducer from './adminSlice'; // Admin-side user reducer

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [subjectsApi.reducerPath]: subjectsApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [contentAdminApi.reducerPath]: contentAdminApi.reducer,

    [adminApi.reducerPath]: adminApi.reducer, // Add adminApi reducer
    user: userReducer, // Client-side
    admin: adminReducer, // Admin-side
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(subjectsApi.middleware)
      .concat(studentsApi.middleware)
      .concat(contentAdminApi.middleware)

      .concat(adminApi.middleware), // Add adminApi middleware
});
