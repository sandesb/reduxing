import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import clsx from 'clsx';
import dp from "../assets/dp.jpg"; // Import the image
import { showPromiseToast } from '../utils/toast'; // Ensure correct import
import { useUpdateNoteMutation, useLoadNoteQuery } from '../redux/subjectsApi';
import { useNavigate } from 'react-router-dom';
import { useAddContentCopyMutation } from '../redux/subjectsApi'; // Ensure correct import
import supabase from '../config/supabaseClient';
const ItemDialog = ({ isOpen, onClose, item }) => {
  const { data: loadedNote, isLoading } = useLoadNoteQuery(item?.id, {
    skip: !item?.id || !isOpen,
  });

  const [updateNote] = useUpdateNoteMutation();
  const [addContentCopy] = useAddContentCopyMutation(); // Mutation hook

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
      const postPromise = updateNote({ id: item.id, note: comment }).unwrap();
  
      // Trigger the promise toast with dynamic position
      showPromiseToast(postPromise, {
        loading: 'Your comment is saving...',
        success: `Your comment "${comment}" has been posted.`,
        error: 'Failed to post your comment.',
      }, 'bottom-center'); // Pass 'bottom-center' position
  
      try {
        await postPromise;
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

  const handleStudyClick = async () => {
    const matricNo = localStorage.getItem('matricNo'); // Get matric no from local storage
    const isGuest = !matricNo; // Check if the user is a guest
  
    try {
      if (isGuest) {
        // Guest Mode: Show content where matric is NULL
        console.log('Guest mode: Fetching content where matric is NULL for subject_id:', item.id);
  
        // Fetch the original content where matric is NULL
        const { data: guestContent, error: guestError } = await supabase
          .from('content')
          .select('*')
          .eq('subjects_id', item.id)
          .is('matric', null); // Fetch content with NULL matric for guests
  
        console.log('Guest Fetch Error:', guestError);
        console.log('Guest Content:', guestContent);
  
        if (guestError) {
          console.error('Error fetching guest content:', guestError);
          return;
        }
  
        if (!guestContent || guestContent.length === 0) {
          console.error('No original content found for guest mode with subject_id:', item.id);
          return;
        }
  
        // Proceed to navigate to the notes page with guest content
        console.log('Navigating to notes page with guest content.');
        navigate(`/notes/${item.id}`, { state: { title: item.title, content: guestContent } });
        return;
      }
  
      // For logged-in users (i.e., matricNo exists)
      console.log('Checking if content for subject_id:', item.id, 'and matric:', matricNo, 'already exists.');
  
      // Check if content for the current subject and matric_no already exists
      const { data: existingContent, error: checkError } = await supabase
        .from('content')
        .select('*')
        .eq('subjects_id', item.id)
        .eq('matric', matricNo); // Check if content for this student already exists
  
      console.log('Check Error:', checkError);
      console.log('Existing Content:', existingContent);
  
      if (checkError) {
        console.error('Error checking existing content:', checkError);
        return;
      }
  
      if (existingContent && existingContent.length > 0) {
        // Content already exists for this subject and matric number
        console.log('Content already copied for subject_id:', item.id, 'and matric:', matricNo);
      } else {
        // Proceed to fetch and copy if no content exists for this subject and matric
        console.log('No existing content found, proceeding with copying.');
  
        // Fetch the original content data to copy
        const { data: originalContent, error: fetchError } = await supabase
          .from('content')
          .select('note')
          .eq('subjects_id', item.id)
          .is('matric', null); // Fetch the admin's original data (where matric is null)
  
        console.log('Fetch Error:', fetchError);
        console.log('Original Content Fetched:', originalContent);
  
        if (fetchError) {
          console.error('Error fetching original content:', fetchError);
          return;
        }
  
        if (!originalContent || originalContent.length === 0) {
          console.error('No original content found to copy for subject_id:', item.id);
          return;
        }
  
        const copiedNote = originalContent[0].note; // Get the original note content
        console.log('Copying this note:', copiedNote);
  
        // Create the new content object
        const newContent = {
          subjects_id: item.id,  // Same subject ID
          name: item.title,      // Subject's title/name
          note: copiedNote,      // Copy the original note content
          matric: matricNo       // Set the matric number for the student
        };
  
        console.log('Inserting new content:', newContent);
  
        // Use the mutation to insert the content copy
        try {
          const { data, error: insertError } = await addContentCopy(newContent).unwrap();
  
          console.log('Insert Error:', insertError);
          console.log('Inserted Content:', data);
  
          if (insertError) {
            console.error('Error copying content:', insertError);
          } else {
            console.log('Content copy created successfully:', data);
          }
        } catch (err) {
          console.error('Error inserting new content:', err);
        }
      }
  
      // Navigate to the notes page regardless of whether copying happened
      navigate(`/notes/${item.id}`, { state: { title: item.title } });
    } catch (err) {
      console.error('Error during copy operation:', err);
      // Ensure navigation happens even if there is an error
      navigate(`/notes/${item.id}`, { state: { title: item.title } });
    }
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
                  className="bg-[#7F9CEA] text-white px-4 py-2 rounded-lg"
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
