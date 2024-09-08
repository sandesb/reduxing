import cloudinary from '../config/cloudinary';
import axios from 'axios';

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  try {
    // Use Axios to upload the image via Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image: ', error);
    return null;
  }
};
