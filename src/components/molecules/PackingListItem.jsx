import React from 'react';
import { motion } from 'framer-motion';

const PackingListItem = ({ item, index, onToggle }) => {
  return (
    <motion.label
      key={index}
      className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-white/50 transition-colors"
      whileHover={{ x: 4 }}
    >
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggle(index)}
        className="w-4 h-4 text-primary rounded focus:ring-primary"
      />
      <span className={`text-sm ${
        item.checked 
          ? 'text-secondary/50 line-through' 
          : 'text-secondary'
      }`}>
        {item.item}
      </span>
    </motion.label>
  );
};

export default PackingListItem;