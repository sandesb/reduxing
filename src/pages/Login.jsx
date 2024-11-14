import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LogInput from "../components/LogInput";
import { useGetStudentsQuery } from '../redux/studentsApi';
import { loginSuccess } from '../redux/userSlice';
import dp from "../assets/logo/colorized.png";

// Random placeholder images
const profileImages = [
  "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
  "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp",
  "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp",
  "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp",
  "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
];

const Login = () => {
  const [matricNo, setMatricNo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: students } = useGetStudentsQuery();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const doLogin = (e) => {
    e.preventDefault();
    const student = students?.find((s) => s.matric === matricNo);

    if (student) {
      dispatch(loginSuccess({ matricNo: student.matric, name: student.name, semester: student.semester }));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('matricNo', student.matric);
      localStorage.setItem('studentName', student.name);
      navigate('/home');
    } else {
      setError('Matric No. not available');
    }
  };

  const handleGuestLogin = () => {
    dispatch(loginSuccess({ matricNo: 'guest', name: 'Guest' }));
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/home');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-primary-bg bg-opacity-90 p-8 rounded-xl shadow-xl max-w-xs w-full text-center">
        <img className="mb-6 w-12 mx-auto" src={dp} alt="Logo" />
        <h1 className="text-3xl font-semibold mb-6 text-blue-500">Academix</h1>
        
        <form onSubmit={doLogin} className="space-y-4">
          <LogInput
            title="Matric No."
            name="matricNo"
            placeholder="Enter your Matric No."
            value={matricNo}
            onChange={(e) => setMatricNo(e.target.value)}
            className="w-full p-2  rounded-md focus:outline-none"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign in
          </button>

          <button
            type="button"
            className="w-full bg-[#7F9CEA] text-white py-2 rounded-md hover:bg-[#6a87d5] transition"
            onClick={handleGuestLogin}
          >
            I'm A Guest
          </button>
        </form>

        <p className="text-gray-400 mt-6 text-sm">
          Don’t have an account?{' '}
          <span className="text-blue-400 ">
            Contact Admin
          </span>
        </p>

        {/* User count section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Join over <span className="font-semibold text-blue-500">20</span> users
          </p>
          <div className="flex justify-center space-x-2">
            {profileImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Profile ${index + 1}`}
                className="w-8 h-8 rounded-full border border-gray-300"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
