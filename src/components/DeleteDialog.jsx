import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { showToast } from '../utils/toast'; // Assuming this is the correct path for your toast

const DeleteDialog = ({ isOpen, onClose, onDelete }) => {
  const [inputValue, setInputValue] = useState('');
  
  // Access the password from environment variables
  const correctPassword = import.meta.env.VITE_ACADEMIX_PASS || 'defaultPassword'; 

  const handleDelete = () => {
    // Make the input case-insensitive by converting to lowercase
    if (inputValue.toLowerCase() === correctPassword.toLowerCase()) {
      // Call onDelete callback and show success toast
      onDelete();
      onClose();
    } else {
      // Show error toast if the input does not match
      showToast('error', 'Incorrect name.');
    }
  };

  // Handle Enter key press for confirmation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleDelete();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-200 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Confirm Deletion
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Sorry, Only The Creator, SuperAdmin can delete.
                  </p>
                </div>

                <input
                  className="w-full p-2 border border-gray-300 bg-slate-50 rounded-md mt-4"
                  type="text"
                  placeholder="Ask the password from Sandes🤧"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown} // Listen for Enter key
                />

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-400 text-white rounded-md"
                    onClick={handleDelete} // Handle delete on button click
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteDialog;
