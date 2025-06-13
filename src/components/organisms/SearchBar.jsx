import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/60 w-5 h-5" />
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4"
      />
    </div>
  );
};

export default SearchBar;