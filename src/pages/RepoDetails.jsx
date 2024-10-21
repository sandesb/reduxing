import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetReposQuery, useDeleteRepoMutation } from '../redux/repoApi'; // Fetch all repos
import nlp from 'compromise'; // Import compromise for NLP processing

const RepoDetails = () => {
  const { id } = useParams(); // Get the repo ID from URL
  const { data: repositories, isLoading, error } = useGetReposQuery(); // Fetch all repositories
  const [deleteRepo] = useDeleteRepoMutation(); // Hook to delete repository
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State to handle delete confirmation
  const [tags, setTags] = useState([]); // State for dynamic tags
  const navigate = useNavigate(); // Initialize the navigate hook

  // Assume matricNo is stored in localStorage
  const matricNo = localStorage.getItem('matricNo'); // Fetch matric from localStorage

  useEffect(() => {
    if (!repositories || repositories.length === 0) return;

    // Find the specific repository by ID
    const repoDetails = repositories.find((repo) => repo.id === id);
    if (!repoDetails) return;

    // Process abstract to extract tags using compromise
    const doc = nlp(repoDetails.abstract);
    const techWords = doc.nouns().out('array').concat(doc.adjectives().out('array'));

    // Select up to 5 tech-related words (we could refine the selection further)
    const selectedTags = techWords.slice(3, 8);
    setTags(selectedTags);
  }, [repositories, id]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading repository details.</p>;

  if (!repositories || repositories.length === 0) return <p>No repositories found.</p>;

  // Find the specific repository by ID
  const repoDetails = repositories.find((repo) => repo.id === id);

  if (!repoDetails) return <p>Repository not found.</p>;

  // Check if the logged-in user is the creator of the repository
  const isOwner = repoDetails.matric === matricNo;

  // Function to check contribution eligibility and handle download
  const handleDownload = (project_report_url) => {
    if (repoDetails.matric === matricNo) {
      // Allow download
      window.open(project_report_url, '_blank');
    } else {
      // Show alert if user hasn't contributed
      alert('You are not eligible to download this project.');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-repo/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true); // Show the confirmation dialog
  };

  const confirmDelete = async () => {
    try {
      await deleteRepo(id); // Perform the deletion
      setShowDeleteConfirm(false); // Close the dialog
      navigate('/repositories'); // Redirect back to home after deletion
    } catch (error) {
      console.error('Failed to delete repository:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false); // Close the confirmation dialog
  };

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

        {/* Show Edit and Delete buttons if the user is the owner */}
        {isOwner && (
          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={handleEdit}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        )}

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{repoDetails.title}</h1>

        {/* Dynamically generated tags based on abstract */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">
                {tag}
              </span>
            ))
          ) : (
            <p>No tags available</p>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed">{repoDetails.abstract}</p>
      </div>

      {/* Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <p className="text-lg mb-4">Are you sure you want to delete this repository?</p>
            <div className="flex gap-4 justify-end">
              <button onClick={cancelDelete} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
              <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoDetails;
