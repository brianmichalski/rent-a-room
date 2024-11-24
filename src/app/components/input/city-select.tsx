// components/CitySelect.tsx
import React from 'react';
import useCities from './hooks/useCities';

interface CitySelectProps {
  provinceId: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  error: boolean
}

const CitySelect: React.FC<CitySelectProps> = ({ provinceId, value, onChange, disabled, error }) => {

  const { cities, isLoading } = useCities(provinceId);

  return (
    <div>
      <label className="block text-gray-700">City:</label>
      <select
        name="cityId"
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded-md"
        disabled={disabled || isLoading}
      >
        <option value="">Select a city</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">City is required</p>}
    </div>
  );
};

export default CitySelect;
