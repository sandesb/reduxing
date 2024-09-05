import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleHelpPopup } from "./redux/uiActions"; // Import the action

import BodyLayout from './theme/BodyLayout';
import MyClasses from './pages/MyClasses';
import Account from './pages/Account';
import Messges from './pages/Messges';
import HelpCenter from './pages/HelpCenter';
import HomePage from './pages/HomePage';
import Notes from './pages/Notes'; // Import the Notes component
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the popup has already been shown
    const isHelpPopupShown = localStorage.getItem('helpPopupShown');

    if (!isHelpPopupShown) {
      // Show the popup and set a flag in localStorage to prevent future popups
      const timer = setTimeout(() => {
        dispatch(toggleHelpPopup());
        localStorage.setItem('helpPopupShown', 'true'); // Set flag to true
      }, 1200);  // 2-second delay

      return () => clearTimeout(timer);  // Cleanup the timeout
    }
  }, [dispatch]);  // Only run once when the app first loads

  return (
    <>
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={<BodyLayout />}>
          <Route index element={<HomePage />} />
          <Route path="my-classes" element={<MyClasses />} />
          <Route path="account" element={<Account />} />
          <Route path="messages" element={<Messges />} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="notes/:id" element={<Notes />} /> {/* Add this route */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
