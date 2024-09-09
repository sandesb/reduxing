import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Use Navigate for redirection
import { useDispatch } from 'react-redux';
import { toggleHelpPopup } from "./redux/uiActions"; // Import the action

import BodyLayout from './theme/BodyLayout';
import MyCourses from './pages/MyCourses';
import Messages from './pages/Messages';
import HelpCenter from './pages/HelpCenter';
import HomePage from './pages/HomePage';
import Notes from './pages/Notes';
import Repositories from './pages/Repositories';
import Login from './pages/Login'; // Import the Login page
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();
  
  // Handle Help Popup logic on app load
  useEffect(() => {
    const isHelpPopupShown = localStorage.getItem('helpPopupShown');

    if (!isHelpPopupShown) {
      const timer = setTimeout(() => {
        dispatch(toggleHelpPopup());
        localStorage.setItem('helpPopupShown', 'true'); // Set flag to true
      }, 1200);  // 2-second delay

      return () => clearTimeout(timer);  // Cleanup the timeout
    }
  }, [dispatch]);

  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Check authentication status

  return (
    <>
      <Toaster position="bottom-center" />
      <Routes>
        {/* Root route to display Login by default */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} /> {/* Redirect to Home if authenticated */}

        <Route path="/home" element={<BodyLayout />}>
          <Route index element={<HomePage />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="messages" element={<Messages />} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="notes/:id" element={<Notes />} /> {/* Add this route */}
        </Route>

        {/* Fallback route in case of unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
