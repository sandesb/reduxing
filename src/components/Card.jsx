import React, { useState } from "react";
import { Plus, NotebookPen, X, Check } from "lucide-react";
import { useSpring, animated } from "react-spring";
import { showToast } from "../utils/toast";
import { showPromiseToast } from '../utils/toast';
import { MessageCircleHeart } from 'lucide-react'; // Import the icon
import ChapterSlider from './ChapterSlider'; // Import the new ChapterSlider component

const Card = ({
  id,
  title,
  progress,
  icon,
  bgColor,
  onPlusClick,
  onEditClick,
  onDeleteClick,
  onTitleClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedIcon, setEditedIcon] = useState(icon);
  const [editedProgress, setEditedProgress] = useState(progress);

  const { x } = useSpring({
    x: isEditing ? 1 : 0,
    config: { tension: 20, friction: 16 },
  });

  const handleAddToCart = () => {
    console.log("Add to cart clicked:", { id, title, icon }); // Debugging
    
    // Create a dummy promise for demo purposes
    const addToCartPromise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 500); // Simulate a half second delay for adding to cart
    });
  
    // Trigger the promise toast
    showPromiseToast(addToCartPromise, {
      loading: 'Adding to list...',
      success: (
        <div className="flex items-center gap-2">
          {title} has been added to your list!
          <MessageCircleHeart className="w-6 h-6 text-gray-600" /> {/* Icon included here */}
        </div>
      ),
      error: 'Failed to add to cart.',
    });
  
    // Your add to cart logic
    onPlusClick({ id, title, icon });
  };

  const handleEditClick = () => {
    console.log("Edit clicked:", id); // Debugging
    if (isEditing) {
      const updatedCourse = {
        id,
        title: editedTitle,
        icon: editedIcon,
        progress: editedProgress,
        bgColor,
      };
      console.log("Updated course:", updatedCourse); // Debugging
      onEditClick(updatedCourse);
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked:", id); // Debugging
    onDeleteClick(id);
  };

  const handleTitleClick = () => {
    console.log(`Card ID: ${id}`); // Debugging
    onTitleClick(id); // Trigger the dialog for this item
  };

  const handleSliderChange = (newProgress) => {
    setEditedProgress(newProgress); // Update the progress based on slider value
  };

  return (
    <animated.div
      style={{
        transform: x
          .to({
            range: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            output: [0, -2, 2, -2, 2, -2, 2, 0],
          })
          .to((x) => `translate3d(${x}px, 0px, 0px)`),
      }}
      className="relative p-4 rounded-xl shadow-lg bg-gradient-to-br from-[#E0F2FF] via-[#EAF3F8] to-[#F6F7FB]"
    >
      <div className=" font-lato flex justify-between items-start ">
        {isEditing ? (
          <input
            type="text"
            value={editedIcon}
            onChange={(e) => setEditedIcon(e.target.value)}
            className="text-2xl text-teal-600 p-2 border border-gray-300 rounded"
            style={{
              width: "60px",
              height: "40px",
              textAlign: "center",
              borderRadius: "8px",
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
            {isEditing ? (
              <Check className="w-5 h-5" />
            ) : (
              <NotebookPen className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <h2
        className="text-base font-semibold mt-4 text-gray-700 cursor-pointer"
        onClick={handleTitleClick} // Handle title click
      >
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
          <ChapterSlider
            progress={editedProgress}
            maxChapters={parseInt(progress.split(' / ')[1])} // Set max chapters
            onChange={handleSliderChange} // Handle slider value change
          />
        ) : (
          "Chapters: " + progress
        )}
      </div>

      {!isEditing && (
        <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
          <div
            className="h-full bg-gradient-to-r from-blue-200 to-blue-400 rounded-full"
            style={{
              width: `${(parseFloat(editedProgress.split(" / ")[0]) / parseFloat(editedProgress.split(" / ")[1])) * 100}%`,
            }}
          ></div>
        </div>
      )}
    
    </animated.div>
  );
};

export default Card;
