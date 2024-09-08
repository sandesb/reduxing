// src/utils/uploadImageToCloudinary.js
import axios from "axios";
// src/utils/uploadFileToCloudinary.js
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const fileExtension = file.name.split('.').pop().toLowerCase();

  let resourceType = 'auto'; // Default to auto, which works for both images and files
  if (fileExtension === 'pdf') {
    resourceType = 'auto'; // Keep as auto but handle PDF in the frontend
  }

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.secure_url; // Return Cloudinary file URL
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error('File upload failed');
  }
};

