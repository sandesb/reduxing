import React, { useState } from 'react';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';  // Cloudinary upload function
import { useUpdateContentMutation } from '../redux/coursesApi';

const ImageUploader = ({ db_id, itemName, noteData }) => {
  const [fileUrl, setFileUrl] = useState(null);  // Store the uploaded file URL
  const [fileType, setFileType] = useState(null);  // Store the file type (image or PDF)
  const [uploadFile, { isLoading }] = useUpdateContentMutation();  // Use mutation for updating content in Supabase

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // Check if the file is a PDF or an image
        if (fileExtension === 'pdf') {
          setFileType('pdf');
        } else {
          setFileType('image');
        }

        const url = await uploadImageToCloudinary(file);  // Upload file to Cloudinary
        setFileUrl(url);

        // Prepare new content to include the uploaded file URL in the note's JSON
        const updatedNote = {
          ...noteData,  // Keep existing note data
          blocks: [
            ...noteData.blocks,  // Add new file block to the blocks
            {
              type: fileType === 'pdf' ? 'file' : 'image',
              data: {
                file: { url: url },  // Add the file URL to the note
              },
            },
          ],
        };

        // Trigger the mutation to update Supabase with the new content
        await uploadFile({
          db_id,  // The note ID in Supabase
          content: updatedNote,  // Updated note with file URL
          name: itemName,  // Name of the note (if required)
        });

        console.log('File URL saved to Supabase:', url);
      } catch (error) {
        console.error('Error uploading or saving the file:', error);
      }
    }
  };

  return (
    <div className="file-uploader mb-4 px-4">
      {/* Display image or PDF based on file type */}
      {fileUrl && fileType === 'image' && (
        <div className="mt-4 mb-4">
          <img
            src={fileUrl}
            alt="Uploaded"
            className="w-80 rounded-md border-4 border-[#7F9CEA] shadow-lg"
          />
        </div>
      )}

      {fileUrl && fileType === 'pdf' && (
        <div className="mt-4 mb-4">
          {/* Download PDF button */}
          <a
            href={fileUrl}
            download
            className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Download PDF
          </a>
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
        className="bg-[#7F9CEA] text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        {isLoading ? 'Uploading...' : 'Upload File'}
      </label>
    </div>
  );
};

export default ImageUploader;

