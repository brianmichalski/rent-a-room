import { Button } from "@headlessui/react";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import React, { useState } from "react";
import { SelectOption } from "../../../types/forms";
import { CityResult } from "../../../types/results";
import Dropdown from "../input/dropdown/dropdown";
import CityFilter from "./city-filter";

interface FilterAndSortProps {
  sortOptions: SelectOption[];
}

const typeOptions: SelectOption[] = [
  { description: "Individual", value: "I" },
  { description: "Shared", value: "S" },
];

const genderOptions: SelectOption[] = [
  { description: "Any", value: "X" },
  { description: "Female", value: "F" },
  { description: "Male", value: "M" },
];

interface FilterAndSortProps {
  city: CityResult | undefined;
  priceRange: number[];
  type: string;
  gender: string;
  sortBy: string;
  onCityChange: (city: CityResult | undefined) => void;
  onPriceChange: (priceRange: number[]) => void;
  onTypeChange: (type: string) => void;
  onGenderChange: (gender: string) => void;
  onSortChange: (sortBy: string) => void;
  handleReset: () => void;
  sortOptions: SelectOption[];
}

const FilterAndSort: React.FC<FilterAndSortProps> = ({
  city,
  priceRange,
  type,
  gender,
  sortBy,
  onCityChange,
  onPriceChange,
  onTypeChange,
  onGenderChange,
  onSortChange,
  handleReset,
  sortOptions,
}) => {
  const [citySearch, setCitySearch] = useState<string>("");
  const [minPrice, maxPrice] = [0, 1000];
  const [localPriceRange, setLocalPriceRange] = useState<number[]>(priceRange);

  const handlePriceRangeChanged = (value: number[]) => {
    onPriceChange(localPriceRange);
  }

  const resetFilters = () => {
    handleReset();
    setCitySearch("");
    setLocalPriceRange([0, 1000]);
  }

  return (
    <div className="flex justify-between gap-x-4 items-stretch py-4 bg-white border-b border-gray-300">
      {/* City Filter */}
      <div className="flex flex-grow px-2">
        <CityFilter
          citySearch={citySearch}
          onCitySearch={setCitySearch}
          city={city}
          onCityChange={onCityChange}
        />
      </div>

      {/* Price Range Slider */}
      <div className="flex flex-col flex-grow px-2">
        <label className="mr-2">Price Range:</label>
        <div className="w-full max-w-lg mx-auto space-y-4">
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            value={localPriceRange}
            onChange={(value) => setLocalPriceRange(value as number[])}
            onChangeComplete={(value) => handlePriceRangeChanged(value as number[])}
            allowCross={false}
            trackStyle={{
              backgroundColor: '#4CAF50',
              height: 8,
              borderRadius: '999px',
            }}
            handleStyle={{
              borderColor: '#4CAF50',
              backgroundColor: '#fff',
              borderRadius: '50%',
              width: 20,
              height: 20,
              boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.2)',
            }}
          />
          <div className="flex justify-between text-gray-700">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Room Type Dropdown */}
      <div className="flex flex-grow px-2">
        <Dropdown
          label="Room Type"
          value={type}
          onChange={onTypeChange}
          options={typeOptions}
        />
      </div>

      {/* Gender Dropdown */}
      <div className="flex flex-grow px-2">
        <Dropdown
          label="Gender"
          value={gender}
          onChange={onGenderChange}
          options={genderOptions}
        />
      </div>

      {/* Sort Options */}
      <div className="flex flex-grow px-2">
        <Dropdown
          label="Sort By"
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
        />
      </div>

      {/* Reset Button */}
      <div className="flex flex-grow px-2">
        <Button onClick={() => resetFilters()} className="bg-red-500 text-white px-4 py-2 rounded">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterAndSort;
