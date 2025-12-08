import React from 'react';
import type { InputProps } from './Input.types';

export const Input: React.FC<InputProps> = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  className = '',
  ...rest
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
      {...rest}
    />
  );
};