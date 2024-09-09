import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from './redux/userSlice'; // Import loginSuccess action
import { toggleHelpPopup } from "./redux/uiActions";
import { useGetStudentsQuery } from './redux/studentsApi'; // Import the students API query

import BodyLayout from './theme/BodyLayout';
import MyCourses from './pages/MyCourses';
import Messages from './pages/Messages';
import HelpCenter from './pages/HelpCenter';
import HomePage from './pages/HomePage';
import Notes from './pages/Notes';
import Repositories from './pages/Repositories';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const { data: students } = useGetStudentsQuery(); // Fetch all students from Supabase

  useEffect(() => {
    // Check for session on app load
    const savedMatricNo = localStorage.getItem('matricNo');
    const savedIsAuthenticated = localStorage.getItem('isAuthenticated');

    if (savedIsAuthenticated === 'true' && savedMatricNo && students) {
      // Find the student's name based on matricNo
      const student = students.find((s) => s.matric === savedMatricNo);

      if (student) {
        // Dispatch the student's actual name and matricNo to Redux
        dispatch(loginSuccess({ matricNo: savedMatricNo, name: student.name }));
      }
    }

    // Handle Help Popup logic
    const isHelpPopupShown = localStorage.getItem('helpPopupShown');
    if (!isHelpPopupShown) {
      const timer = setTimeout(() => {
        dispatch(toggleHelpPopup());
        localStorage.setItem('helpPopupShown', 'true');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [dispatch, students]); // Add `students` as a dependency to ensure it triggers when data is available

  return (
    <>
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
        <Route element={<BodyLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/notes/:id" element={<Notes />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
