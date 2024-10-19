import React from "react";

type AppliedFiltersProps = {
  filters: Record<string, string>;
  onClearFilter: (filterType: string) => void;
  onResetFilters: () => void;
};

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  filters,
  onClearFilter,
  onResetFilters,
}) => {
  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-2">Filters applied:</h4>
      <div className="flex flex-wrap items-center space-x-2">
        {/* Dynamically render each applied filter */}
        {Object.keys(filters)
          .filter((filterType) => filters[filterType]) // Only show if filter is applied
          .map((filterType) => (
            <div
              key={filterType}
              className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full flex items-center text-sm"
            >
              {/* Show filterType: filterValue */}
              {`${filterType}: ${filters[filterType]}`}{" "}
              <button
                onClick={() => onClearFilter(filterType)}
                className="ml-2 text-red-500"
              >
                &times;
              </button>
            </div>
          ))}

        {/* Reset all filters button */}
        <button
          onClick={onResetFilters}
          className="bg-red-100 text-red-600 py-1 px-4 rounded-full shadow-sm hover:bg-red-200 ml-4 text-sm"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default AppliedFilters;
