import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import LogInput from "../components/LogInput";
import { useGetStudentsQuery } from '../redux/studentsApi'; // Import studentsApi hook

const Login = () => {
  const [matricNo, setMatricNo] = useState(''); // State for Matric No.
  const [error, setError] = useState(''); // State for login error
  const navigate = useNavigate(); // Hook for redirection
  const { data: students } = useGetStudentsQuery(); // Fetch students data

  // Handler for login button click
  const doLogin = (e) => {
    e.preventDefault();

    // Check if the matric number matches any student in the database
    const student = students?.find((s) => s.matric.toString() === matricNo);

    if (student) {
      localStorage.setItem('isAuthenticated', 'true'); // Set authenticated flag
      localStorage.setItem('matricNo', matricNo); // Store matricNo in localStorage
      navigate('/home'); // Redirect to home page
    } else {
      setError('Matric No. not available'); // Set error message if no match is found
    }
  };

  // Handler for guest login button click
  const handleGuestLogin = () => {
    localStorage.setItem('isAuthenticated', 'true'); // Set guest authenticated flag
    navigate('/home'); // Redirect to home page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary-bg">
      <div id="login" className="p-8 rounded max-w-sm text-center">
      <img className="logo1 mb-4 inline-flex w-20" src="src/assets/logo/colorized.png" alt="Logo" />

        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">Sign In</h1>
        
        <form onSubmit={doLogin}>
          <LogInput
            title="Matric No."
            name="matricNo"
            placeholder="Enter your Matric No."
            value={matricNo}
            onChange={(e) => setMatricNo(e.target.value)} // Handle input change
            className="mb-4 p-2 w-full border rounded bg-slate-50"
          />

          {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-400 text-white p-2 rounded hover:bg-blue-500 mb-4"
          >
            Sign in
          </button>

          {/* Guest Button */}
          <button
            type="button"
            className="w-full bg-[#7F9CEA] text-white p-2 rounded hover:bg-[#6a87d5]"
            onClick={handleGuestLogin} // Guest login handler
          >
            I'm A Guest
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
