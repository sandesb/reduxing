import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiReducer';
import subjectsApi from './subjectsApi';
import contentAdminApi from './contentAdminApi';
import studentsApi from './studentsApi';
import adminApi from './adminApi';
import repoApi from './repoApi'; 
import messagesApi from './messagesApi'; // Import repoApi
// Import repoApi
import userReducer from './userSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [subjectsApi.reducerPath]: subjectsApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [contentAdminApi.reducerPath]: contentAdminApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [repoApi.reducerPath]: repoApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer, // Add repoApi reducer
     // Add repoApi reducer
    user: userReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(subjectsApi.middleware)
      .concat(studentsApi.middleware)
      .concat(contentAdminApi.middleware)
      .concat(adminApi.middleware)
      .concat(repoApi.middleware)
      .concat(messagesApi.middleware), // Add repoApi middleware
});
