// src/utils/toast.js
import { toast } from 'react-hot-toast';

export const showToast = (type, message) => {
  switch (type) {
    case 'success':
      toast.success(message, {
        style: {
          background: '#fff', // Green for success
          color: '#4CAF50',
        },
      });
      break;
    case 'error':
      toast(message, {
        style: {
          background: '#fff', // Red for errors
          color: '#F44336',
        },
        icon: '❌',
      });
      break;
    case 'update':
      toast(message, {
        style: {
          background: '#fff', // Blue for updates
          color: '#2196F3',
        },
        icon: '🔄',
      });
      break;
    default:
      toast(message, {
        style: {
          background: '#333', // Default color (dark)
          color: '#fff',
        },
      });
  }
};
