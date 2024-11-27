import { AdjustmentsHorizontalIcon, BarsArrowDownIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React, { useMemo, useState } from 'react';
import { SelectOption } from "../../../types/forms";
import { CityResult } from "../../../types/results";
import { debounce } from "../../../utils/ui";

interface FilterAndSortProps {
  sortOptions: SelectOption[],
  onFilter: (value: string) => void;
  onSort: (value: string) => void;
  onCityChange: (value: CityResult | undefined) => void;
}

const FilterAndSort: React.FC<FilterAndSortProps> = ({ onFilter, onSort, onCityChange, sortOptions }) => {
  const [showCityOptions, setShowCityOptions] = useState<boolean>(false);
  const [citySearch, setCitySearch] = useState<string>("");
  const [cities, setCities] = useState<CityResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityResult>();

  const fetchCities = async (query: string) => {
    const res = await fetch(`/api/city?query=${query}`);
    const data = await res.json();
    setCities(data);
  };

  const debouncedFetchCities = useMemo(() => debounce(fetchCities, 500), []);

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setShowCityOptions(true);
    setCitySearch(value);
    debouncedFetchCities(value);
    setSelectedCity(undefined);
  };

  const handleCitySelect = (city: CityResult | undefined) => {
    if (city) {
      setCitySearch(`${city.name}, ${city.province}`);
    }
    setShowCityOptions(false);
    setSelectedCity(city);
    onCityChange(city);
  };

  return (
    <div className="flex justify-between items-center gap-4 py-4 bg-white border-b border-gray-300">
      <div className="flex space-x-2">
        <div className=" relative flex items-center">
          <MapPinIcon className={`glow h-8 w-8 ${selectedCity ? 'text-blue-600' : 'text-gray-400'}`} strokeWidth={1.2} />
          <input
            placeholder="Select a location..."
            value={citySearch}
            onFocus={(e) => e.target.select()}
            onChange={handleCityChange}
            onBlur={() => {
              setTimeout(() => {
                setShowCityOptions(false);
              }, 200);
            }}
            className="border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {showCityOptions
            ? <ul className="absolute top-9 left-8 w-full bg-white mt-2 max-h-48 overflow-auto border shadow-md rounded-md z-10">
              {cities?.map((city, idx) => (
                <li onMouseDown={() => { handleCitySelect(city) }}
                  key={idx}
                  className="py-2 px-3 hover:bg-gray-200 cursor-pointer">
                  {`${city.name}, ${city.province}`}
                </li>
              ))}
            </ul>
            : ''}
        </div>

        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded inline-flex items-center">
          <AdjustmentsHorizontalIcon className="glow h-4 w-4 text-blue-600" strokeWidth={1.2} />
          <span className="hidden sm:block">Filters</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <BarsArrowDownIcon className="glow h-6 w-6 text-gray-300" strokeWidth={1.2} />
        <select
          onChange={(e) => onSort(e.target.value)}
          className="bg-gray-200 py-2 pl-4 rounded w-fit"
        >
          {sortOptions.map(option =>
            <option key={option.value} value={option.value}>{option.description}</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default FilterAndSort;
