import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';

const Discover = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
            Discover Hidden Gems
          </h1>
          <p className="text-secondary/80">
            Find unique destinations tailored to your adventure style
          </p>
        </div>
        
        <MainFeature />
      </div>
    </motion.div>
  );
};

export default Discover;