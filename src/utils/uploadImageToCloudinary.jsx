import axios from 'axios';
import cloudinary from '../config/cloudinary';

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  // Determine the resource type based on file type (PDF will use raw, images will use auto)
  const fileType = file.type.includes('pdf') ? 'raw' : 'auto';

  try {
    // Upload the file using Axios and Cloudinary API
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/${fileType}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.secure_url;  // Return the Cloudinary URL for the uploaded file
  } catch (error) {
    console.error('Error uploading file to Cloudinary: ', error);
    return null;
  }
};
