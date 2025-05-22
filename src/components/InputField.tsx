import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  id?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
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
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            input-field 
            ${icon ? 'pl-11' : ''} 
            ${error ? 'border-error' : ''}
            placeholder:text-text-secondary/50
            placeholder:text-sm
          `}
        />
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;