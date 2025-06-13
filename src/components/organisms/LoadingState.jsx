import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const LoadingState = ({ type = 'page', message = 'Loading content...' }) => {
  if (type === 'page') {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-64 md:h-96 bg-primary/20"></div>
          <div className="px-4 py-6 max-w-4xl mx-auto">
            <div className="h-8 bg-primary/20 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-primary/20 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-surface rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generic full-screen spinner for other loading needs
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <ApperIcon name="Loader" className="w-16 h-16 text-primary/60 mx-auto mb-4" />
        </motion.div>
        <p className="text-lg text-secondary/80">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;