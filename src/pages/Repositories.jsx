import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RepoCard from '../components/RepoCard';
import { useGetReposQuery } from '../redux/repoApi'; // Import the query to fetch repositories
import Filter from '../components/Filter'; // Import the Filter component

const Repositories = () => {
  const navigate = useNavigate();
  const { data: repositories, error, isLoading } = useGetReposQuery();
  
  // Define the filter state for frontend, backend, database, and search term
  const [filterState, setFilterState] = useState({
    frontend: [],
    backend: [],
    database: [],
    searchTerm: '', // State for search input
  });

  // Handle tech stack filter selection and search input change
  const handleFilterSelect = (key, selectedOptions) => {
    setFilterState((prevState) => ({
      ...prevState,
      [key]: selectedOptions,
    }));
  };

  const handleSearchChange = (e) => {
    setFilterState((prevState) => ({
      ...prevState,
      searchTerm: e.target.value,
    }));
  };

  const getShortDescription = (abstract) => {
    if (!abstract) return '';
    const words = abstract.split(' ');
    if (words.length <= 12) {
      return abstract;
    }
    return words.slice(0, 12).join(' ') + '...';
  };

  const handleCardClick = (id) => {
    navigate(`/repo/${id}`);
  };

  // Filtering logic based on tech stack and search term
  const filteredRepositories = repositories?.filter((repo) => {
    const { frontend, backend, database, searchTerm } = filterState;
    const techStack = repo.tech_stack || {};

    // Check if the repository matches the selected tech stack
    const matchesFrontend = frontend.length === 0 || frontend.includes(techStack.frontend);
    const matchesBackend = backend.length === 0 || backend.includes(techStack.backend);
    const matchesDatabase = database.length === 0 || database.includes(techStack.database);

    // Check if the repository title matches the search term
    const matchesSearchTerm = repo.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Return true if it matches both the tech stack filters and the search term
    return matchesFrontend && matchesBackend && matchesDatabase && matchesSearchTerm;
  });

  if (isLoading) return <p>Loading repositories...</p>;
  if (error) return <p>Error fetching repositories: {error.message}</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <h1 className="text-2xl font-medium mb-6 text-gray-700 text-center">Repositories</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title..."
        value={filterState.searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full max-w-md"
      />

      {/* Tech Stack Filters */}
      <div className="flex mb-4 space-x-4">
        {/* Frontend Tech Filter */}
        <Filter
          title="Frontend Tech Stack"
          options={['React', 'Angular', 'Vue.js', 'Svelte', 'Tailwind CSS', 'Bootstrap']}
          selectedOptions={filterState.frontend}
          onSelect={(selectedOptions) => handleFilterSelect('frontend', selectedOptions)}
        />

        {/* Backend Tech Filter */}
        <Filter
          title="Backend Tech Stack"
          options={['Node.js', 'Django', 'Flask', 'Express', 'Ruby on Rails', 'Spring Boot']}
          selectedOptions={filterState.backend}
          onSelect={(selectedOptions) => handleFilterSelect('backend', selectedOptions)}
        />

        {/* Database Filter */}
        <Filter
          title="Database"
          options={['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'SQLite']}
          selectedOptions={filterState.database}
          onSelect={(selectedOptions) => handleFilterSelect('database', selectedOptions)}
        />
      </div>

      {/* Render RepoCards horizontally using flex */}
      <div className="flex justify-center space-x-6 flex-wrap">
        {filteredRepositories?.map((repo, index) => (
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
      
      {filteredRepositories?.length === 0 && (
        <p>No repositories match the selected tech stack or search criteria.</p>
      )}
    </div>
  );
};

export default Repositories;
