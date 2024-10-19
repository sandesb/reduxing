import React from "react";

type SidebarFiltersProps = {
  filterOptions: Record<string, string[]>; // options for each filter (dynamic keys)
  appliedFilters: Record<string, string>;
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
};

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filterOptions = {}, // Ensure it falls back to an empty object
  appliedFilters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg ">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>

      {/* Dynamically render filters based on the filter options */}
      {Object.keys(filterOptions)?.map((filterType) => (
        <div key={filterType} className="mb-6">
          <h4 className="font-semibold mb-2">{filterType}</h4>
          <div className="space-y-2">
            {filterOptions[filterType]?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={filterType}
                  value={option}
                  checked={appliedFilters[filterType] === option}
                  onChange={(e) => onFilterChange(filterType, e.target.value)}
                  className="form-radio text-green-500 focus:ring-green-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Reset Button */}
      <div className="mt-6">
        <button
          onClick={onResetFilters}
          className="bg-red-100 text-red-600 py-2 px-4 rounded-full shadow-sm hover:bg-red-200 text-sm"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default SidebarFilters;
