import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiReducer';
import coursesApi from './coursesApi';
import studentsApi from './studentsApi';
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [coursesApi.reducerPath]: coursesApi.reducer, // Existing coursesApi reducer
    [studentsApi.reducerPath]: studentsApi.reducer, // Add the studentsApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(coursesApi.middleware) // Existing coursesApi middleware
      .concat(studentsApi.middleware), // Add the studentsApi middleware
});
