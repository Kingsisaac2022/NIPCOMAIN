import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
  id?: string;
  icon?: React.ReactNode;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
  required = false,
  error,
  id,
  icon
}) => {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="mb-4">
      <label htmlFor={fieldId} className="label">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </div>
        )}
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            input-field appearance-none
            ${icon ? 'pl-11' : ''} 
            ${error ? 'border-error' : ''}
          `}
        >
          <option value="" className="text-text-secondary">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
          <ChevronDown size={20} />
        </div>
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;