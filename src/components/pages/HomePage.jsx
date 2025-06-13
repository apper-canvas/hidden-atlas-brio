import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to discover page after a brief moment
    const timer = setTimeout(() => {
      navigate('/discover');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface topographic-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center px-6"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <ApperIcon name="Map" className="w-24 h-24 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-display text-primary mb-4">
            Hidden Atlas
          </h1>
          <p className="text-lg md:text-xl text-secondary font-medium">
            Discover the world's hidden gems
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-secondary/60"
        >
          <p className="mb-4">Your adventure awaits...</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;