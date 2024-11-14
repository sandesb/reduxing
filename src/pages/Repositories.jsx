import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RepoCard from "../components/RepoCard";
import { useGetReposQuery } from "../redux/repoApi";
import Filter from "../components/Filter";
import { Search } from "lucide-react";

const Repositories = () => {
  const navigate = useNavigate();
  const { data: repositories, error, isLoading } = useGetReposQuery();
  const [filterState, setFilterState] = useState({
    frontend: [],
    backend: [],
    database: [],
    searchTerm: "",
  });

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
    if (!abstract) return "";
    const words = abstract.split(" ");
    return words.length <= 12 ? abstract : words.slice(0, 12).join(" ") + "...";
  };

  const handleCardClick = (id) => {
    navigate(`/repo/${id}`);
  };

  const filteredRepositories = repositories?.filter((repo) => {
    const { frontend, backend, database, searchTerm } = filterState;
    const techStack = repo.tech_stack || {};

    const matchesFrontend =
      frontend.length === 0 || frontend.includes(techStack.frontend);
    const matchesBackend =
      backend.length === 0 || backend.includes(techStack.backend);
    const matchesDatabase =
      database.length === 0 || database.includes(techStack.database);
    const matchesSearchTerm = repo.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      matchesFrontend && matchesBackend && matchesDatabase && matchesSearchTerm
    );
  });

  if (isLoading) return <p>Loading repositories...</p>;
  if (error) return <p>Error fetching repositories: {error.message}</p>;

  const handleAddRepoClick = () => {
    navigate('/add-repo');
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Repositories
      </h1>

      {/* Search, Filters, and Add Button container */}
      <div className="flex justify-between items-center mb-6 mr-20">
        {/* Search Input on the left */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Type In..."
            value={filterState.searchTerm}
            onChange={handleSearchChange}
            className="rounded-full px-5 py-2 pl-10 bg-gray-50 text-gray-500 placeholder-gray-400 shadow-sm border-none w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Filters and Add Button on the right */}
        <div className="flex items-center space-x-10">
          {/* Filters */}
          <Filter
            title="Frontend"
            options={["React", "Angular", "Vue.js", "Svelte"]}
            selectedOptions={filterState.frontend}
            onSelect={(selectedOptions) =>
              handleFilterSelect("frontend", selectedOptions)
            }
          />
          <Filter
            title="Backend"
            options={["Node.js", "Django", "Flask"]}
            selectedOptions={filterState.backend}
            onSelect={(selectedOptions) =>
              handleFilterSelect("backend", selectedOptions)
            }
          />
          <Filter
            title="Database"
            options={["MySQL", "PostgreSQL", "MongoDB"]}
            selectedOptions={filterState.database}
            onSelect={(selectedOptions) =>
              handleFilterSelect("database", selectedOptions)
            }
          />

          {/* Add Button */}
          <button
            onClick={handleAddRepoClick}
            className="bg-blue-100 text-blue-500 px-4 h-9 rounded-md flex items-center border border-blue-200"
            style={{ borderRadius: "10px" }}
          >
            <span className="mr-2 text-blue-500">+</span> Add
          </button>
        </div>
      </div>

      {/* Repository Cards */}
      <div className="repository-cards grid sm:grid-cols-1 lg:grid-cols-2">
        {filteredRepositories?.map((repo, index) => (
          <RepoCard
            key={index}
            title={repo.title}
            description={getShortDescription(repo.abstract)}
            creator={repo.source_name}
            imageUrl={repo.image_url}
            onCardClick={() => handleCardClick(repo.id)}
          />
        ))}
        {filteredRepositories?.length === 0 && (
          <p>No matching repositories found.</p>
        )}
      </div>
    </div>
  );
};

export default Repositories;
