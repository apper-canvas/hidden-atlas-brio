import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion';

const ErrorState = ({ message = 'Something went wrong', onRetry, actionText = 'Try Again' }) => {
  return (
    <div className="min-h-screen bg-background px-4 py-6 flex items-center justify-center">
      <div className="text-center">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-secondary mb-2">Error</h2>
        <p className="text-secondary/70 mb-4">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-primary text-white hover:bg-primary/90"
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;