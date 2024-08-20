import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiReducer';
import coursesApi from './coursesApi';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [coursesApi.reducerPath]: coursesApi.reducer, // Add the coursesApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coursesApi.middleware), // Add the coursesApi middleware
});
