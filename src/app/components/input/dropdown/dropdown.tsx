import React from "react";
import { SelectOption } from "../../../../types/forms";

interface DropdownProps {
  label: string;
  options: Record<string, string>;
  value: string;
  emptyOption?: boolean;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, emptyOption = true, onChange }) => (
  <div className="flex flex-grow flex-col gap-y-1">
    <span className="text-gray-800">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="py-2 pl-4 rounded w-full border-gray-300 bg-gray-100"
    >
      {emptyOption
        ? <option value="">Select an option</option>
        : ''
      }
      {Object.entries(options).map((option) => (
        <option key={option[0]} value={option[0]}>
          {option[1]}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
