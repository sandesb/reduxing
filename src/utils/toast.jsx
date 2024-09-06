// src/utils/toast.js
import { toast } from 'react-hot-toast';

// Existing showToast function
export const showToast = (type, message) => {
  switch (type) {
    case 'success':
      toast.success(message, {
        style: {
          background: '#fff', // Green for success
          color: '#4CAF50',
        },
        position: 'top-center',
      });
      break;
    case 'error':
      toast(message, {
        style: {
          background: '#fff', // Red for errors
          color: '#F44336',
        },
        icon: '❌',
        position: 'top-center',
      });
      break;
    case 'update':
      toast(message, {
        style: {
          background: '#fff', // Blue for updates
          color: '#2196F3',
        },
        icon: '🔄',
        position: 'top-center',
      });
      break;
    default:
      toast(message, {
        style: {
          background: '#333', // Default color (dark)
          color: '#fff',
        },
        position: 'top-center',
      });
  }
};

// Updated promise-based toast with dynamic position
export const showPromiseToast = (promise, messages, position = 'top-center') => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: <b>{messages.success}</b>,
      error: <b>{messages.error}</b>,
    },
    {
      position, // Use dynamic position here
    }
  );
};
