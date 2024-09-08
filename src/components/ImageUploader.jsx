import React, { useState } from 'react';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';  // Your existing Cloudinary upload function
import { useUpdateContentMutation } from '../redux/coursesApi';

const ImageUploader = ({ db_id, itemName, noteData }) => {
  const [imageUrl, setImageUrl] = useState(null);  // Store the uploaded image URL
  const [uploadImage, { isLoading }] = useUpdateContentMutation();  // Use the mutation for updating content in Supabase

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadImageToCloudinary(file);  // Upload image to Cloudinary
        setImageUrl(url);

        // Prepare the new content to include the uploaded image URL in the note's JSON
        const updatedNote = {
          ...noteData,  // Keep the existing note data
          blocks: [
            ...noteData.blocks,  // Add new image block to the blocks
            {
              type: 'image',
              data: {
                file: { url: url },  // Add the image URL to the note
              },
            },
          ],
        };

        // Trigger the mutation to update Supabase with the new content
        await uploadImage({
          db_id,  // The note ID in Supabase
          content: updatedNote,  // Updated note with image URL
          name: itemName,  // Name of the note (if required)
        });

        console.log('Image URL saved to Supabase:', url);
      } catch (error) {
        console.error('Error uploading or saving the image:', error);
      }
    }
  };

  return (
    <div className="image-uploader  mb-4 px-4">
      {imageUrl && (
        <div className="mt-4 mb-4">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-80 rounded-md border-4 border-[#7F9CEA] shadow-lg"
          />
        </div>
      )}

      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"  // Hide the input and trigger it with the button
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="bg-[#7F9CEA]  text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </label>
    </div>
  );
};

export default ImageUploader;
