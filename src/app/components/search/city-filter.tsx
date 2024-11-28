import { MapPinIcon } from "@heroicons/react/24/outline";
import React, { useMemo, useState, useEffect, useRef } from "react";
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
  const [inputValue, setInputValue] = useState<string>(citySearch); // Local state for input value
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Track selected city by index
  const listRef = useRef<HTMLUListElement>(null); // Ref for the city list

  useEffect(() => {
    setInputValue(citySearch); // Sync with parent state (citySearch)
  }, [citySearch]); // Re-sync when citySearch prop changes

  const fetchCities = async (query: string) => {
    const res = await fetch(`/api/city?query=${query}`);
    const data = await res.json();
    setCities(data);
  };

  const debouncedFetchCities = useMemo(() => debounce(fetchCities, 500), []);

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value); // Update local input state
    onCitySearch(value); // Notify parent
    setShowCityOptions(true);
    debouncedFetchCities(value);
  };

  const handleCitySelect = (_city: CityResult | undefined) => {
    if (_city) {
      onCitySearch(`${_city.name}, ${_city.province}`);
      onCityChange(_city);
    }
    setShowCityOptions(false);
    setSelectedIndex(null); // Reset selected index on city select
  };

  const hideCityList = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setShowCityOptions(false);
      if (!city) {
        e.target.value = ''; // Clear input on blur
        setInputValue(''); // Clear local state
        onCityChange(undefined);
      }
    }, 200);
  };

  const clearSearch = (e: React.FocusEvent<HTMLInputElement>) => {
    setInputValue(''); // Clear local input value
    onCitySearch(''); // Notify parent
    e.target.select(); // Select text in input (optional)
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (selectedIndex === null || selectedIndex === cities.length - 1) {
        setSelectedIndex(0); // Loop back to the first city if at the end
      } else {
        setSelectedIndex(selectedIndex + 1); // Move down
      }
    } else if (e.key === "ArrowUp") {
      if (selectedIndex === null || selectedIndex === 0) {
        setSelectedIndex(cities.length - 1); // Loop to the last city if at the top
      } else {
        setSelectedIndex(selectedIndex - 1); // Move up
      }
    } else if (e.key === "Enter" && selectedIndex !== null) {
      handleCitySelect(cities[selectedIndex]); // Select city on Enter
    }
  };

  // Scroll the selected city into view
  useEffect(() => {
    if (listRef.current && selectedIndex !== null) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest", // Scroll the item into view if it's out of view
        });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="relative flex flex-grow items-center gap-2">
      <MapPinIcon className={`h-8 w-8 ${city ? "text-blue-600" : "text-gray-400"}`} strokeWidth={1.2} />
      <input
        placeholder="Select a location..."
        value={inputValue} // Use local state for input value
        onChange={handleCityChange}
        onFocus={(e) => clearSearch(e)}
        onBlur={(e) => hideCityList(e)}
        onKeyDown={handleKeyDown} // Add keyboard navigation handler
        className="border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
      />
      {showCityOptions && (
        <ul
          ref={listRef} // Reference to the list element
          className="absolute top-16 left-10 w-full bg-white border shadow-md rounded-md max-h-48 overflow-auto z-10"
        >
          {cities.map((_city, idx) => (
            <li
              key={idx}
              onMouseDown={() => handleCitySelect(_city)}
              className={`cursor-pointer py-2 px-3 hover:bg-gray-200 ${selectedIndex === idx ? 'bg-blue-100' : ''}`} // Highlight selected city
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
