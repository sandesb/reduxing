import React, { useState } from 'react';
import { Plus, NotebookPen, X, Check } from 'lucide-react';

const Card = ({ id, title, progress, icon, bgColor, onPlusClick, onEditClick, onDeleteClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedIcon, setEditedIcon] = useState(icon);
  const [editedProgress, setEditedProgress] = useState(progress);

  const handleAddToCart = () => {
    onPlusClick({ title, icon });
  };

  const handleEditClick = () => {
    if (isEditing) {
      const updatedCourse = {
        id,
        title: editedTitle,
        icon: editedIcon,
        progress: editedProgress,
        bgColor,
      };
      onEditClick(updatedCourse);
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteClick = () => {
    onDeleteClick(id);
  };

  return (
    <div className="relative p-4 rounded-xl shadow-lg bg-gradient-to-br from-[#E0F2FF] via-[#EAF3F8] to-[#F6F7FB]">
      <div className="flex justify-between items-start">
        {isEditing ? (
          <input
            type="text"
            value={editedIcon}
            onChange={(e) => setEditedIcon(e.target.value)}
            className="text-3xl text-teal-600 p-2 border border-gray-300 rounded"
            style={{
              width: '60px',
              height: '40px',
              textAlign: 'center',
              borderRadius: '8px',
            }}
            autoFocus
          />
        ) : (
          <span className="text-3xl text-teal-600">{icon}</span>
        )}
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            className="text-gray-400 hover:text-gray-600"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={handleEditClick}
            className="text-gray-400 hover:text-gray-600"
          >
            {isEditing ? <Check className="w-5 h-5" /> : <NotebookPen className="w-5 h-5" />}
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <h2 className="text-lg font-semibold mt-4 text-gray-800">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ) : (
          title
        )}
      </h2>
      <div className="mt-2 text-sm text-gray-600">
        {isEditing ? (
          <input
            type="text"
            value={editedProgress}
            onChange={(e) => setEditedProgress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ) : (
          progress
        )}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
        <div
          className="h-full bg-gradient-to-r from-blue-200 to-blue-400 rounded-full"
          style={{ width: `${(parseFloat(editedProgress.split(' h / ')[0]) / parseFloat(editedProgress.split(' h / ')[1])) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Card;
