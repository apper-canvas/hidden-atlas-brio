import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 mb-6 bg-surface rounded-lg p-1">
      {tabs.map(tab => (
        <Button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md 
            ${activeTab === tab.id
              ? 'bg-primary text-white'
              : 'text-secondary hover:bg-primary/10'
            }`}
        >
          <ApperIcon name={tab.icon} className="w-4 h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default TabNavigation;