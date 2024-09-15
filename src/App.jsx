import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from './redux/adminSlice'; // Import admin loginSuccess
import BodyLayout from './theme/BodyLayout';
import MyCourses from './pages/MyCourses';
import Messages from './pages/Messages';
import HelpCenter from './pages/HelpCenter';
import HomePage from './pages/HomePage';
import Notes from './pages/Notes';
import Repositories from './pages/Repositories';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';

// Admin Imports
import SignIn from './admin/pages/auth/sign-in';
import Dashboard from './admin/pages/dashboard';
import AdminLayout from './admin/theme/AdminLayout';

function App() {
  const dispatch = useDispatch();
  const adminIsAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  useEffect(() => {
    // Check for admin session in localStorage
    const savedEmail = localStorage.getItem('adminEmail');
    const savedIsAuthenticated = localStorage.getItem('adminIsAuthenticated');

    if (savedIsAuthenticated === 'true' && savedEmail) {
      dispatch(loginSuccess({ email: savedEmail }));
    }
  }, [dispatch]);

  return (
    <>
      <Toaster position="bottom-center" />
      <Routes>
        {/* Client-side routes */}
        <Route path="/" element={adminIsAuthenticated ? <Navigate to="/home" /> : <Login />} />
        <Route element={<BodyLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/notes/:id" element={<Notes />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin" element={adminIsAuthenticated ? <Navigate to="/admin/dashboard" /> : <SignIn />} />
        <Route path="/admin/dashboard" element={adminIsAuthenticated ? <AdminLayout /> : <Navigate to="/admin" />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Catch-all route to redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
