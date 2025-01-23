import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { logout, loginSuccess } from '../redux/userSlice'; // Import logout action and login action
import { useNavigate } from 'react-router-dom'; // Import for navigation
import dp from "../assets/logo/user.png"; // Import the user image

const PopOver = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user data from Redux store
  const { name, matricNo, email, semester } = useSelector((state) => state.user);
  
  // Local state to persist data
  const [userData, setUserData] = useState({
    name: '',
    matricNo: '',
    email: '',
    semester: '',
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    if (!name || !matricNo || !email || !semester) {
      const storedName = localStorage.getItem('studentName');
      const storedMatricNo = localStorage.getItem('matricNo');
      const storedEmail = localStorage.getItem('email');
      const storedSemester = localStorage.getItem('semester');

      if (storedName && storedMatricNo && storedEmail && storedSemester) {
        // Store in local state
        setUserData({
          name: storedName,
          matricNo: storedMatricNo,
          email: storedEmail,
          semester: storedSemester,
        });

        // Dispatch to Redux store to persist state
        dispatch(loginSuccess({
          name: storedName,
          matricNo: storedMatricNo,
          email: storedEmail,
          semester: storedSemester,
        }));
      }
    } else {
      setUserData({ name, matricNo, email, semester });
    }
  }, [dispatch, name, matricNo, email, semester]);

  // Handle the logout action
  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state

    // Remove data from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('matricNo');
    localStorage.removeItem('studentName');
    localStorage.removeItem('email');
    localStorage.removeItem('semester');

    navigate('/login'); // Redirect to login page
    onClose(); // Close the popover after logout
  };

  if (!open) return null; // If the popover is not open, don't render anything

  return (
    <div
      className="z-50 absolute max-w-[12rem] whitespace-normal break-words rounded-lg border border-blue-gray-50 bg-slate-50 p-4 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
      style={{ top: '50px', left: '20px', zIndex: '30' }}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <img src={dp} alt={userData.name} className="relative inline-block object-cover object-center w-12 h-12 rounded-full" />
        <button
          className="select-none rounded-lg bg-blue-400 py-2 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <h6 className="flex items-center gap-2 mb-2 font-sans text-base antialiased font-medium leading-relaxed tracking-normal text-blue-gray-900">
        <span>{userData.name}</span> •{" "}
        <a className="text-sm text-blue-gray-700" href="#">
          @{userData.semester}
        </a>
      </h6>
      <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700">
        Matric No: {userData.matricNo}
      </p>
    </div>
  );
};

export default PopOver;
