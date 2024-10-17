import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LogInput from "../components/LogInput";
import { useGetStudentsQuery } from '../redux/studentsApi';
import { loginSuccess } from '../redux/userSlice'; // Import the loginSuccess action
import dp from "../assets/logo/colorized.png"; // Import the image

const Login = () => {
  const [matricNo, setMatricNo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: students } = useGetStudentsQuery();

  // Check authentication status on component load
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      // Redirect the user to the home page if they are already authenticated
      navigate('/home');
    }
  }, [navigate]);

  const doLogin = (e) => {
    e.preventDefault();

    // Find the student based on matricNo
    const student = students?.find((s) => s.matric === matricNo);

    if (student) {
      // Dispatch loginSuccess to store matricNo, name, and mark the user as authenticated
      dispatch(loginSuccess({ matricNo: student.matric, name: student.name, semester: student.semester }));

      // Store the session in localStorage for persistence
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('matricNo', student.matric);
      localStorage.setItem('studentName', student.name); // Store the student's name as well

      // Redirect to home page
      navigate('/home');
    } else {
      setError('Matric No. not available');
    }
  };

  // Guest login handler
  const handleGuestLogin = () => {
    dispatch(loginSuccess({ matricNo: 'guest', name: 'Guest' })); // Set guest login state
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/home'); // Redirect to home page
  };

  const handleAdminLogin = () => {
    navigate('/admin'); // Redirect to admin page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary-bg">
      <div id="login" className="p-8 rounded max-w-sm text-center">
        <img className="logo1 mb-4 inline-flex w-20" src={dp} alt="Logo" />
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">Sign In</h1>
        <form onSubmit={doLogin}>
          <LogInput
            title="Matric No."
            name="matricNo"
            placeholder="Enter your Matric No."
            value={matricNo}
            onChange={(e) => setMatricNo(e.target.value)}
            className="mb-4 p-2 w-full border rounded bg-slate-50"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-500 mb-4">
            Sign in
          </button>

          {/* Guest Button */}
          <button type="button" className="w-full bg-[#7F9CEA] text-white p-2 rounded hover:bg-[#6a87d5]" onClick={handleGuestLogin}>
            I'm A Guest
          </button>

          <button type="button" className="w-full mt-4 bg-[#4f4f4f] text-white p-2 rounded hover:bg-[#6a87d5]" onClick={handleAdminLogin}>
            I'm Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
