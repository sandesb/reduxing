import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { logout } from '../redux/userSlice'; // Import logout action
import { useNavigate } from 'react-router-dom'; // Import for navigation
import dp from "../assets/logo/user.png"; // Import the user image

const PopOver = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Access the user's name, matric number, and email from Redux store
  const { name, matricNo, email, semester } = useSelector((state) => state.user);

  // Handle the logout action
  const handleLogout = () => {
    // Clear the session
    dispatch(logout()); // Clear Redux state
    localStorage.removeItem('isAuthenticated'); // Remove session from localStorage
    localStorage.removeItem('matricNo'); // Remove matricNo from localStorage
    navigate('/'); // Redirect to the login page
    onClose(); // Close the popover after logout
  };

  if (!open) return null; // If the popover is not open, don't render anything

  return (
    <div
      className="z-50 absolute max-w-[12rem] whitespace-normal break-words rounded-lg border border-blue-gray-50 bg-slate-50 p-4 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none "
      style={{ top: '50px', left: '20px', zIndex: '30' }} // Adjust the position
    >
      <div className="flex items-center justify-between gap-4 mb-2">
      <img src={dp} alt={name} className="relative inline-block object-cover object-center w-12 h-12 rounded-full" />
        <button
          className="select-none rounded-lg bg-blue-400 py-2 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          type="button"
          onClick={handleLogout} // Trigger logout on click
        >
          Logout
        </button>
      </div>
      <h6 className="flex items-center gap-2 mb-2 font-sans text-base antialiased font-medium leading-relaxed tracking-normal text-blue-gray-900">
        <span>{name}</span> •{" "}
        <a className="text-sm text-blue-gray-700" href="#">
          @{semester}
        </a>
      </h6>
      <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700">
        Matric No: {matricNo}
      </p>
    </div>
  );
};

export default PopOver;
