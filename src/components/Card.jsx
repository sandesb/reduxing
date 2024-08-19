// src/components/Card.js
import React from 'react';
import { Plus } from 'lucide-react';

const Card = ({ title, progress, icon, bgColor, onPlusClick }) => {
  const handleAddToCart = () => {
    onPlusClick({ title, icon });
  };

  // Initialize current and total values to 0
  let current = 0, total = 0;

  if (typeof progress === 'string') {
    // Safely parse the progress string
    const parts = progress.split(' h / ');
    if (parts.length === 2) {
      current = parseFloat(parts[0]) || 0;
      total = parseFloat(parts[1]) || 0;
    }
  } else if (progress && typeof progress.current === 'number' && typeof progress.total === 'number') {
    current = progress.current;
    total = progress.total;
  }

  // Calculate the progress width
  const progressWidth = total > 0 ? `${(current / total) * 100}%` : '0%';

  return (
    <div className="relative p-4 rounded-xl shadow-lg bg-gradient-to-br from-[#E0F2FF] via-[#EAF3F8] to-[#F6F7FB]">
      <div className="flex justify-between items-start">
        <span className="text-3xl text-teal-600">{icon}</span>
        <button
          onClick={handleAddToCart}
          className="text-gray-400 hover:text-gray-600"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
      <h2 className="text-lg font-semibold mt-4 text-gray-800">{title}</h2>
      <div className="mt-2 text-sm text-gray-600">
        {`${current} h / ${total} h`}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
        <div
          className="h-full bg-gradient-to-r from-blue-200 to-blue-400 rounded-full"
          style={{ width: progressWidth }}
        ></div>
      </div>
    </div>
  );
};

export default Card;
