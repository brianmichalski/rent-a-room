import { Button } from "@headlessui/react";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import React, { useState } from "react";
import { CityResult } from "../../../types/results";
import { GenderDescriptions, RoomTypeDescriptions } from "../../helper/enum.helper";
import Dropdown from "../input/dropdown/dropdown";
import CityFilter from "./city-filter";

export const DEFAULT_SORT = 'price.asc';

const sortOptions: Record<string, string> = {
  DEFAULT_SORT: 'Price - low to high',
  'price.desc': 'Price - high to low',
  'size.asc': 'Size - smaller first',
  'size.desc': 'Size - bigger first'
};

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
  handleReset
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
      <div className="flex flex-col flex-grow px-2 gap-y-1">
        <label className="mr-2">Price Range</label>
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
          options={RoomTypeDescriptions}
        />
      </div>

      {/* Gender Dropdown */}
      <div className="flex flex-grow px-2">
        <Dropdown
          label="Gender"
          value={gender}
          onChange={onGenderChange}
          options={GenderDescriptions}
        />
      </div>

      {/* Sort Options */}
      <div className="flex flex-grow px-2">
        <Dropdown
          label="Sort By"
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          emptyOption={false}
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
