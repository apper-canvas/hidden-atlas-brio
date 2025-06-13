import React from 'react';

const ActivityItem = ({ activity }) => {
  return (
    <div className="flex items-center space-x-3 text-sm">
      <span className="font-medium text-primary min-w-[60px]">{activity.time}</span>
      <span className="text-secondary/80">{activity.activity}</span>
    </div>
  );
};

export default ActivityItem;