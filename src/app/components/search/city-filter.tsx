import { MapPinIcon } from "@heroicons/react/24/outline";
import React, { useMemo, useState } from "react";
import { CityResult } from "../../../types/results";
import { debounce } from "../../../utils/ui";

interface CityFilterProps {
  city: CityResult | undefined;
  citySearch: string;
  onCitySearch: (value: string) => void;
  onCityChange: (value: CityResult | undefined) => void;
}

const CityFilter: React.FC<CityFilterProps> = ({ city, citySearch, onCitySearch, onCityChange }) => {
  const [showCityOptions, setShowCityOptions] = useState<boolean>(false);
  const [cities, setCities] = useState<CityResult[]>([]);
  if (city) {
    onCitySearch(`${city.name}, ${city.province}`);
  }

  const fetchCities = async (query: string) => {
    const res = await fetch(`/api/city?query=${query}`);
    const data = await res.json();
    setCities(data);
  };

  const debouncedFetchCities = useMemo(() => debounce(fetchCities, 500), []);

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onCitySearch(value);
    setShowCityOptions(true);
    debouncedFetchCities(value);
  };

  const handleCitySelect = (_city: CityResult | undefined) => {
    if (_city) {
      onCitySearch(`${_city.name}, ${_city.province}`);
      onCityChange(_city);
    }
    setShowCityOptions(false);
  };

  const hideCityList = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setShowCityOptions(false);
      if (!city) {
        e.target.value = '';
        onCityChange(undefined);
      }
    }, 200);
  }

  return (
    <div className="relative flex flex-grow items-center gap-2">
      <MapPinIcon className={`h-8 w-8 ${city ? "text-blue-600" : "text-gray-400"}`} strokeWidth={1.2} />
      <input
        placeholder="Select a location..."
        value={citySearch}
        onChange={handleCityChange}
        onFocus={(e) => e.target.select()}
        onBlur={(e) => hideCityList(e)}
        className="border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
      />
      {showCityOptions && (
        <ul className="absolute top-16 left-10 w-full bg-white border shadow-md rounded-md max-h-48 overflow-auto z-10">
          {cities.map((_city, idx) => (
            <li
              key={idx}
              onMouseDown={() => handleCitySelect(_city)}
              className="cursor-pointer py-2 px-3 hover:bg-gray-200"
            >
              {`${_city.name}, ${_city.province}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityFilter;
