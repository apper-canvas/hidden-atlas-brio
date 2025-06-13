import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background topographic-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <ApperIcon name="MapPin" className="w-20 h-20 text-primary/60 mx-auto mb-6" />
        <h1 className="text-4xl font-display text-primary mb-4">Lost in the wilderness?</h1>
        <p className="text-lg text-secondary/80 mb-8 max-w-md">
          Looks like you've wandered off the beaten path. Let's get you back to exploring!
        </p>
        <Button
          onClick={() => navigate('/discover')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary text-white hover:bg-primary/90"
        >
          Return to Discover
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;