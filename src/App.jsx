import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess as adminLoginSuccess } from './redux/adminSlice'; // Admin login success action
import { loginSuccess as userLoginSuccess } from './redux/userSlice'; // Client-side login success action
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
import AdminLayout from './admin/theme/AdminLayout'; // Admin Layout with Sidebar
import Tasks from './admin/pages/tasks';
import { StudentEntry } from './admin/pages/dashboard/components/StudentEntry';

function App() {
  const dispatch = useDispatch();
  
  // Get authentication status for both client and admin
  const adminIsAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  const userIsAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    // Check for admin session in localStorage
    const adminEmail = localStorage.getItem('adminEmail');
    const adminAuthenticated = localStorage.getItem('adminIsAuthenticated');
    
    // Check for user (client) session in localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userAuthenticated = localStorage.getItem('userIsAuthenticated');

    // Admin authentication
    if (adminAuthenticated === 'true' && adminEmail) {
      dispatch(adminLoginSuccess({ email: adminEmail }));
    }

    // Client (user) authentication
    if (userAuthenticated === 'true' && userEmail) {
      dispatch(userLoginSuccess({ email: userEmail }));
    }
  }, [dispatch]);

  return (
    <>
      <Toaster position="bottom-center" />
      <Routes>
        {/* Client-side routes */}
        <Route path="/" element={userIsAuthenticated ? <Navigate to="/home" /> : <Login />} />
        <Route element={<BodyLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/notes/:id" element={<Notes />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={adminIsAuthenticated ? <AdminLayout /> : <SignIn />}>
          {/* These routes are under the AdminLayout */}
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="tasks" element={<Tasks/> }/>
          <Route path="student-edit/:id" element={<StudentEntry />} /> {/* Add Student Edit Route */}

          <Route path="apps" element={<div>Apps Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>

        {/* Catch-all route to redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
