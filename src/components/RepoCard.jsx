import React from 'react';
import { ChevronRight } from 'lucide-react'; // Lucide icon

const RepoCard = ({ title, description, creator, imageUrl, onCardClick }) => {
  return (
    <div className="bg-white flex p-6 mb-6 w-96 cursor-pointer rounded-xl shadow-lg bg-gradient-to-br from-[#E0F2FF] via-[#EAF3F8] to-[#F6F7FB]">
      {/* Image Section */}
      <div className="w-1/4">
        <img
          src={imageUrl}
          alt="Repository"
          className="rounded-lg"
        />
      </div>

      {/* Content Section */}
      <div className="w-3/4 pl-4 flex flex-col justify-between">
        {/* Title and Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">
            {description}
          </p>
          <p className="text-sm text-gray-500 mt-2">Created by {creator}</p>
        </div>

        {/* Button Section */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onCardClick}
            className="text-blue-400 bg-white border border-primary-bg hover:bg-blue-400 hover:text-white rounded-full h-10 w-10 flex justify-center items-center"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
