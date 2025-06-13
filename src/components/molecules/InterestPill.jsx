import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const InterestPill = ({ interest, isSelected, onClick }) => {
  return (
    <Button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-3 rounded-lg border-2 transition-all duration-200 
        ${isSelected
          ? 'border-primary bg-primary text-white shadow-md'
          : `border-primary/20 bg-surface hover:border-primary/40 hover:shadow-sm ${interest.color}`
        }`}
    >
      <div className="flex items-center space-x-2">
        <ApperIcon name={interest.icon} className="w-5 h-5" />
        <span className="font-medium text-sm">{interest.label}</span>
      </div>
    </Button>
  );
};

export default InterestPill;