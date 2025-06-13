import React from 'react';

const Input = ({ type = 'text', className = '', placeholder, value, onChange, ...rest }) => {
  return (
    <input
      type={type}
      className={`
        w-full px-4 py-3 border border-primary/20 rounded-lg bg-surface
        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
        ${className}
      `}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Input;