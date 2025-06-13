import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import PackingListItem from '@/components/molecules/PackingListItem';

const PackingChecklist = ({ packingList, onToggleItem }) => {
  const groupedItems = packingList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const packedCount = packingList.filter(item => item.checked).length;
  const totalCount = packingList.length;
  const progressPercentage = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-surface rounded-xl p-6 topographic-bg">
      <h2 className="text-xl font-semibold text-secondary mb-6">Packing Checklist</h2>
      
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <h3 className="font-medium text-secondary border-b border-primary/20 pb-1">
              {category}
            </h3>
            <div className="space-y-1">
              {items.map((item, index) => {
                const itemIndex = packingList.findIndex(i => i === item); // Find original index for toggle
                return (
                  <PackingListItem 
                    key={itemIndex} // Use original index as key if it's stable
                    item={item} 
                    index={itemIndex} 
                    onToggle={onToggleItem} 
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-secondary/70">
          <ApperIcon name="CheckCircle" className="w-4 h-4" />
          <span>
            {packedCount} of {totalCount} items packed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PackingChecklist;