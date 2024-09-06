import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import clsx from 'clsx';
import dp from "../assets/dp.jpg"; // Import the image

import { useUpdateNoteMutation, useLoadNoteQuery } from '../redux/coursesApi';
import { useNavigate } from 'react-router-dom';

const ItemDialog = ({ isOpen, onClose, item }) => {
  const { data: loadedNote, isLoading } = useLoadNoteQuery(item?.id, {
    skip: !item?.id || !isOpen,
  });

  const [updateNote] = useUpdateNoteMutation();
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (loadedNote && loadedNote.length > 0 && loadedNote[0].note) {
      setComment(loadedNote[0].note);
    } else {
      setComment('');
    }
  }, [loadedNote]);

  const handlePostClick = async () => {
    if (item && comment.trim() !== '') {
      try {
        await updateNote({ id: item.id, note: comment }).unwrap();
        console.log('Note updated:', comment);
      } catch (error) {
        console.error('Failed to update note:', error);
      }
    }
  };

  const calculateProgressWidth = (progress) => {
    if (!progress) return 0;
    const [current, total] = progress.split(' h / ').map(parseFloat);
    return (current / total) * 100;
  };

  const handleStudyClick = () => {
    navigate(`/notes/${item.id}`, { state: { title: item.title } }); // Pass the title via state
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="max-w-lg w-full space-y-4 bg-slate-100 p-6 rounded-lg shadow-xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <DialogTitle className="text-xl font-bold text-gray-900 ">Details</DialogTitle>
          {item ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{item.icon || '📦'}</span>
                <span className="text-lg font-semibold">{item.title || 'No Title'}</span>
              </div>
              {item.progress && (
                <>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
                    <div
                      className="h-full bg-gradient-to-r from-blue-200 to-blue-400 rounded-full"
                      style={{ width: `${calculateProgressWidth(item.progress)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Progress: {item.progress}</p>
                </>
              )}
              <div className="flex mt-4 space-x-4 items-start">
                <img
                  src={dp} // Profile picture
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)} // Handle textarea changes
                    className={clsx(
                      'block w-full rounded-lg border border-gray-300 bg-slate-100 py-2 px-3 text-sm text-gray-900',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y'
                    )}
                    rows={3}
                    placeholder="Add your comments..."
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={handleStudyClick} // Handle navigation to Notes page
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                >
                  Study
                </button>
                <button
                  onClick={handlePostClick} // Handle posting the note
                  className="bg-blue-400 text-white px-4 py-2 rounded-lg"
                  disabled={isLoading} // Disable the button while loading
                >
                  Post
                </button>
              </div>
            </>
          ) : (
            <p>No item selected.</p>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ItemDialog;
