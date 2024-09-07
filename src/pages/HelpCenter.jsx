import React from 'react';
import undrawImage from "../assets/undraw.png"; // Import the image

const HelpCenter = () => {
  return (
    <div>
    <h1 className="text-xl font-medium mb-4 text-gray-700 text-center">Help Center</h1>

    <div className="p-4 max-w-3xl mx-auto bg-sidebar-active rounded-lg shadow-md mb-5">

      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Before your exams, you all <span className="text-blue-500">seek for Notes,</span> right?
      </h2>

      <p className="text-gray-600 mb-4">
        Here, you can easily <span className="text-green-500">add, share and update</span> your subject notes and keep track of your chapters. Explore around and happy learning!
      </p>

      <p className="text-gray-600 mb-4">
        Close this and click on the<span className="text-[#7F9CEA]"> Name</span> of a subject.
      </p>

      <img src={undrawImage} alt="Study illustration" className="w-full mb-4 rounded-lg" />

      
    </div>
    </div>

  );
};

export default HelpCenter;
