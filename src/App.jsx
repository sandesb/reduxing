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
import Chat from './pages/Chat';

// Admin Imports
import SignIn from './admin/pages/auth/sign-in';
import Dashboard from './admin/pages/dashboard';
import AdminLayout from './admin/theme/AdminLayout'; // Admin Layout with Sidebar
import Tasks from './admin/pages/tasks';
import { StudentEntry } from './admin/pages/dashboard/components/StudentEntry';
import Content from './admin/pages/content/page';
import CompareNotes from './admin/pages/content/compare/compareNotes'; // Import CompareNotes component
import NotesBox from './admin/pages/content/compare/notesBox';
import AddRepositories from './pages/AddRepositories';
import RepoDetails from './pages/RepoDetails';
import Index from './landing-page/Index';
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
        {/* Root route now points to the Index component */}
        <Route
          path="/"
          element={
            userIsAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Index />
            )
          }
        />
        
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        <Route element={<BodyLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/add-repo" element={<AddRepositories />} />
          <Route path="/edit-repo/:id" element={<AddRepositories />} />
          <Route path="/repo/:id" element={<RepoDetails />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/ai" element={<Chat />} />

          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/notes/:id" element={<Notes />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            adminIsAuthenticated ? (
              <AdminLayout />
            ) : (
              <Navigate to="/admin/sign-in" replace />
            )
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="student-edit/:id" element={<StudentEntry />} />
          <Route path="content" element={<Content />} />
          <Route path="content/compare" element={<NotesBox />} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>

        {/* Admin sign-in page */}
        <Route
          path="/admin/sign-in"
          element={
            adminIsAuthenticated ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <SignIn />
            )
          }
        />

        {/* Catch-all route to redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </>
  );
}

export default App;

