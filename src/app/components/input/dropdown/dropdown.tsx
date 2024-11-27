import React from "react";
import { SelectOption } from "../../../../types/forms";

interface DropdownProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => (
  <div className="flex flex-grow flex-col">
    <span className="text-gray-800">{label}:</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="py-2 pl-4 rounded w-full border-gray-300 bg-gray-100"
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.description}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
