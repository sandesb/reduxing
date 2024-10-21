import React from 'react';
import { useNavigate } from 'react-router-dom';
import RepoCard from '../components/RepoCard';
import { useGetReposQuery } from '../redux/repoApi'; // Import the query to fetch repositories
import nlp from 'compromise'; // Import NLP library

const Repositories = () => {
  const navigate = useNavigate();
  
  // Fetch repositories from Supabase
  const { data: repositories, error, isLoading } = useGetReposQuery();

  // Function to shorten the abstract using NLP
  const getShortDescription = (abstract) => {
    if (!abstract) return '';

    // Log the original abstract for debugging
    console.log('Original Abstract:', abstract);
    
    // Use NLP to break abstract into sentences and extract relevant parts
    const doc = nlp(abstract);
    const sentences = doc.sentences().out('text'); // Get sentences text

    // Log the NLP processed sentences
    console.log('NLP Processed Sentences:', sentences);
    
    // If abstract is already short, return it as is
    if (sentences.split(' ').length <= 12) {
      console.log('Short Abstract:', sentences);
      return sentences;
    }

    // Otherwise, truncate to 12 words
    const truncatedText = sentences.split(' ').slice(0, 12).join(' ') + '...';
    
    // Log the truncated result
    console.log('Truncated Abstract:', truncatedText);
    
    return truncatedText;
  };

  const handleCardClick = (id) => {
    navigate(`/repo/${id}`);
  };

  if (isLoading) return <p>Loading repositories...</p>;
  if (error) return <p>Error fetching repositories: {error.message}</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <h1 className="text-2xl font-medium mb-6 text-gray-700 text-center">Repositories</h1>

      {/* Render RepoCards horizontally using flex */}
      <div className="flex justify-center space-x-6">
        {repositories?.map((repo, index) => (
          <RepoCard
            key={index}
            title={repo.title}
            description={getShortDescription(repo.abstract)}  // Get the short description
            creator={repo.source_name}
            imageUrl={repo.image_url}
            onCardClick={() => handleCardClick(repo.id)}  // Pass the repo ID on click
          />
        ))}
      </div>
    </div>
  );
};

export default Repositories;
