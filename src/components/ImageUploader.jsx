import React from 'react';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';  // Your existing Cloudinary upload function

const ImageUploader = ({ setFileUrl, setFileType, setPublicId, setFileExtension }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadImageToCloudinary(file);  // Upload to Cloudinary
        setFileUrl(url);

        // Extract publicId and extension from the Cloudinary URL
        const publicId = url.split('/').pop().split('.')[0];  // Example: extract 'uqcmfalfdlbwzj8jv0w6'
        const fileExtension = file.name.split('.').pop();  // Extract 'pdf', 'jpg', etc.

        // Set the file type based on the extension
        const fileType = fileExtension === 'pdf' ? 'pdf' : 'image';

        setPublicId(publicId);  // Set the public ID
        setFileExtension(fileExtension);  // Set file extension
        setFileType(fileType);  // Set file type
      } catch (error) {
        console.error('Error uploading the file:', error);
      }
    }
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="bg-[#7F9CEA] text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        Upload File
      </label>
    </div>
  );
};

export default ImageUploader;
