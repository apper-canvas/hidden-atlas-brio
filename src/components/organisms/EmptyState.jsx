import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, message, actionText, onAction, animated = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 bg-surface rounded-xl topographic-bg"
    >
      {animated ? (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }} // Example animation
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <ApperIcon name={icon} className="w-16 h-16 text-primary/60 mx-auto mb-4" />
        </motion.div>
      ) : (
        <ApperIcon name={icon} className="w-16 h-16 text-primary/60 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-semibold text-secondary mb-2">{title}</h3>
      <p className="text-secondary/70 mb-6">{message}</p>
      {onAction && actionText && (
        <Button
          onClick={onAction}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary text-white hover:bg-primary/90"
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;