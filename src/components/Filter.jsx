import React, { useState } from 'react';

const Filter = ({ title, options, selectedOptions, onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle selecting a checkbox option for multiple selections
  const handleOptionSelect = (event) => {
    const { value, checked } = event.target;
    let updatedSelections;

    if (checked) {
      updatedSelections = [...selectedOptions, value]; // Add selected option
    } else {
      updatedSelections = selectedOptions.filter((option) => option !== value); // Remove unselected option
    }

    onSelect(updatedSelections); // Update parent with new selections
  };

  return (
    <div className="relative inline-block text-left mr-4">
      {/* Dropdown button */}
      <div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
        <button
          type="button"
          className="border-e px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700"
          onClick={toggleDropdown}
        >
          {title}
        </button>

      
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-56 rounded-md border bg-white shadow-lg">
          <div className="p-2">
            <strong className="block p-2 text-xs font-medium uppercase text-gray-400"> Options </strong>

            {options.map((option) => (
              <label key={option} className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  name={title}
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={handleOptionSelect}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>

          {/* "Others" text field */}
          <div className="p-2">
            <strong className="block p-2 text-xs font-medium uppercase text-gray-400"> Others </strong>
            <input
              type="text"
              placeholder="Other tech stack"
              className="block w-full rounded-lg border-gray-300 px-4 py-2 text-sm text-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
