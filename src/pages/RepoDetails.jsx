import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetReposQuery } from '../redux/repoApi'; // Fetch all repos

const RepoDetails = () => {
  const { id } = useParams(); // Get the repo ID from URL
  const { data: repositories, isLoading, error } = useGetReposQuery(); // Fetch all repositories

  // Assume matricNo is stored in localStorage
  const matricNo = localStorage.getItem('matricNo'); // Fetch matric from localStorage

  // Log matricNo from localStorage
  console.log('MatricNo from localStorage:', matricNo);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading repository details.</p>;

  if (!repositories || repositories.length === 0) return <p>No repositories found.</p>;

  // Check if the user has contributed to any repository (matric exists)
  const hasContributed = repositories.some((repo) => repo.matric === matricNo);

  // repo[0] because Supabase returns data in an array, assuming we still show repo details by ID
  const repoDetails = repositories.find((repo) => repo.id === id);

  // Function to check contribution eligibility and handle download
  const handleDownload = (project_report_url) => {
    console.log('Checking if user has contributed:');
    console.log('Has contributed:', hasContributed);

    if (hasContributed) {
      console.log('Eligible for download');
      // Allow download
      window.open(project_report_url, '_blank');
    } else {
      console.log('Not eligible for download');
      // Show alert if user hasn't contributed
      alert('You are not eligible to download this project.');
    }
  };

  if (!repoDetails) return <p>Repository not found.</p>;

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-8">
      {/* Left Section with Image */}
      <div className="w-full lg:w-1/3">
        <img
          src={repoDetails.image_url || 'https://via.placeholder.com/400'} // Placeholder image if not available
          alt={repoDetails.title}
          className="rounded-lg shadow-lg mb-4"
        />
        <p className="text-gray-500 mb-2">Created by {repoDetails.source_name}</p>
        
        {/* Buttons for download and project URL */}
        <div className="flex flex-col gap-4 mt-4">
          <button
            onClick={() => handleDownload(repoDetails.project_report_url)} // Check eligibility before download
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Project Report
          </button>
          <a
            href={repoDetails.project_source_code_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            View Project
          </a>
        </div>
      </div>

      {/* Right Section with Title and Details */}
      <div className="w-full lg:w-2/3">
        {/* Huge Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{repoDetails.title}</h1>

        {/* Tags (for now these are dummy tags, you can replace with real ones) */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">Tag 1</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">Tag 2</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">Tag 3</span>
        </div>

        {/* Full Abstract */}
        <p className="text-gray-700 leading-relaxed">{repoDetails.abstract}</p>
      </div>
    </div>
  );
};

export default RepoDetails;
