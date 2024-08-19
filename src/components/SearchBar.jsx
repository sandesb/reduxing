// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults } from '../redux/uiActions';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const results = useSelector((state) => state.ui.searchResults);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    console.log('User input:', value); // Log the user's input

    if (value.length > 0) {
      dispatch(setSearchResults(value));
    } else {
      dispatch(setSearchResults([])); // Clear results if query is empty
    }
  };

  useEffect(() => {
    console.log('Search results:', results); // Log the search results
  }, [results]);

  return (
    <div className="relative">
      <div className="flex items-center border rounded-full bg-gray-50 shadow-inner px-4 py-2">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Type In..."
          value={query}
          onChange={handleSearch}
          className="w-full bg-transparent focus:outline-none"
        />
      </div>
      {/* Dropdown Results */}
      {results.length > 0 && (
        <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          <ul>
            {results.map((result) => (
              <li key={result.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                {result.title} (ID: {result.id})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
