// components/FilterAndSort.tsx
import {
  AdjustmentsHorizontalIcon,
  BarsArrowDownIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import React from 'react';
interface FilterAndSortProps {
  onFilter: (value: string) => void;
  onSort: (value: string) => void;
}

const FilterAndSort: React.FC<FilterAndSortProps> = ({ onFilter, onSort }) => {
  return (
    <div className="flex justify-between items-center gap-4 py-4 bg-white border-b border-gray-300">
      <div className="flex space-x-2">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <MapPinIcon
              className="glow h-8 w-8 text-gray-400"
              strokeWidth={1.2} />
            <input placeholder='Select a location...' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></input>
          </div>
        </div>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded inline-flex items-center">
          <AdjustmentsHorizontalIcon
            className="glow h-4 w-4 md:mr-2 lg:mr-2 text-blue-600"
            strokeWidth={1.2} />
          <span className="invisible md:visible lg:visible w-0 md:w-auto lg:w-auto">Filters</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <BarsArrowDownIcon
          className="glow h-6 w-6 text-gray-300"
          strokeWidth={1.2} />
        <select className="bg-gray-200 py-2 pl-4 rounded w-fit">
          <option value="">Sort by</option>
          <option value="price">Price</option>
          <option value="size">Size</option>
        </select>
      </div>
    </div>
  );
};

export default FilterAndSort;
