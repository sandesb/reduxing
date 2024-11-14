import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetReposQuery, useDeleteRepoMutation } from '../redux/repoApi';
import nlp from 'compromise';

const RepoDetails = () => {
  const { id } = useParams();
  const { data: repositories, isLoading, error } = useGetReposQuery();
  const [deleteRepo] = useDeleteRepoMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tags, setTags] = useState([]);
  const [repoDetails, setRepoDetails] = useState(null); // Define repoDetails in state
  const navigate = useNavigate();

  const matricNo = localStorage.getItem('matricNo');

  useEffect(() => {
    if (!repositories || repositories.length === 0) return;
  
    // Log entire repositories data
    console.log("Fetched repositories data:", repositories);
  
    // Find and set the specific repository by ID
    const foundRepo = repositories.find((repo) => repo.id === id);
    if (!foundRepo) return;
  
    console.log("Found repo details:", foundRepo); // Log specific repository details
  
    setRepoDetails(foundRepo); // Set repoDetails in state
  
    // Process abstract to extract tags using compromise
    const doc = nlp(foundRepo.abstract);
    const techWords = doc.nouns().out('array').concat(doc.adjectives().out('array'));
    const selectedTags = techWords.slice(3, 8);
    setTags(selectedTags);
  }, [repositories, id]);
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading repository details.</p>;
  if (!repoDetails) return <p>Repository not found.</p>;

  const isOwner = repoDetails.matric === matricNo;

  const handleDownload = (project_report_url, project_source_code_url) => {
    if (isOwner) {
      window.open(project_report_url, '_blank');
      window.open(project_source_code_url, '_blank');
    } else {
      alert('You are not eligible to download this project.');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-repo/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRepo(id);
      setShowDeleteConfirm(false);
      navigate('/repositories');
    } catch (error) {
      console.error('Failed to delete repository:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex flex-col lg:flex-row p-8 gap-12">
      {/* Left Section with Image and Buttons */}
      <div className="w-full lg:w-1/3 flex flex-col items-start gap-4">
        <img
          src={repoDetails.image_url || 'https://via.placeholder.com/400'}
          alt={repoDetails.title}
          className="rounded-lg shadow-lg mb-4 object-cover"
        />
        <p className="text-sm text-gray-600 mb-2">Created by {repoDetails.source_name}</p>

        {isOwner && (
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={handleEdit}
              className="w-full text-white bg-blue-300 hover:bg-blue-400 font-medium py-2 rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-white bg-red-400 hover:bg-red-600 font-medium py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full mt-4">
          <button
            onClick={() => handleDownload(repoDetails.project_report_url, repoDetails.project_source_code_url)}
            className="w-full text-white bg-blue-400 hover:bg-blue-600 font-medium py-2 rounded-lg"
          >
            Download Project Report
          </button>
          <button
            onClick={() => {
              console.log("project_source_code_url:", repoDetails.project_source_code_url);
              if (repoDetails.project_source_code_url) {
                const url = repoDetails.project_source_code_url;
                const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
                window.open(formattedUrl, '_blank', 'noopener,noreferrer');
              } else {
                alert("Source code URL is not available.");
              }
            }}
            className="w-full text-white bg-[#7F9CEA] hover:bg-blue-400 font-medium py-2 rounded-lg text-center"
          >
            View Source Code
          </button>
        </div>
      </div>

      {/* Right Section with Title, Tags, and Abstract */}
      <div className="w-full lg:w-2/3">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{repoDetails.title}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200"
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No tags available</p>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed text-base">{repoDetails.abstract}</p>
      </div>

      {/* Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="text-lg mb-4 text-gray-800">Are you sure you want to delete this repository?</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
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
