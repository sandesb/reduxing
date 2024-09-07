import React from "react";
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import undrawImage from "../assets/undraw.png"; // Import the image
import { toggleHelpPopup } from "../redux/uiActions"; // Close action

const HelpPopup = () => {
  const isHelpPopupVisible = useSelector((state) => state.ui.isHelpPopupVisible);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemName = location.state?.title || 'Unknown Item';

  if (!isHelpPopupVisible) return null;

  const handleClose = () => {
    dispatch(toggleHelpPopup());
  };

  const handleStudyClick = () => {
    dispatch(toggleHelpPopup());

    navigate('/notes/0c7a740a-4675-404c-8453-73e71ef00a53', {
      state: { title: 'Exams' }, // Pass the title here
    });
  };
  return (
    <div className="p-5 fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Before your exams, you all <span className="text-blue-500">seek for Notes,</span> right?
        </h2>
        <p className="text-gray-600 mb-6">
          Here, you can easily <span className="text-green-500">add, share and update</span> your subject notes and keep track of your chapters. Explore around and happy learning!
        </p>
        <p className="text-gray-600 mb-6">
          Close this and Click on the<span className="text-[#7F9CEA]"> Name</span> of a subject. Or just click on <span className="text-[#7F9CEA]"> Study</span> for Demo.
        </p>

        <img src={undrawImage} alt="Study illustration" className="w-full mb-6" />

        <button 
          onClick={handleStudyClick} // Call the navigate function on click
          className="w-full bg-[#7F9CEA] text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Study
        </button>
      </div>
    </div>
  );
};

export default HelpPopup;
