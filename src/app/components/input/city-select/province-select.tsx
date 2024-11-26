// components/ProvinceSelect.tsx
import React from 'react';
import useProvinces from './hooks/useProvinces';
interface ProvinceSelectProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProvinceSelect: React.FC<ProvinceSelectProps> = ({ value, onChange }) => {
  const { provinces, isLoading } = useProvinces();

  return (
    <div>
      <label className="block text-gray-700">Province:</label>
      <select
        name="provinceId"
        value={value}
        onChange={onChange}
        disabled={isLoading}
        className="w-full mt-1 p-2 border rounded-md"
      >
        <option value="">Select a province</option>
        {provinces.map((province) => (
          <option key={province.id} value={province.id}>
            {province.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProvinceSelect;
