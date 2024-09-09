import React from 'react';

const DownloadButton = ({ publicId, fileExtension }) => {
  // Construct the Cloudinary URL dynamically using the cloud name and public ID
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const downloadUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}.${fileExtension}`;

  return (
    <div>
      <a
        href={downloadUrl}
        download
        className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        Download PDF
      </a>
    </div>
  );
};

export default DownloadButton;
