import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { destinationService } from '../services';

const Saved = () => {
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedDestinations();
  }, []);

  const loadSavedDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate saved destinations by getting all and marking first 2 as saved
      const allDestinations = await destinationService.getAll();
      // In a real app, this would come from user's saved list
      const savedIds = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      const saved = allDestinations.filter(dest => savedIds.includes(dest.id));
      setSavedDestinations(saved);
    } catch (err) {
      setError(err.message || 'Failed to load saved destinations');
      toast.error('Failed to load saved destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (destinationId) => {
    const savedIds = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
    const newSavedIds = savedIds.filter(id => id !== destinationId);
    localStorage.setItem('savedDestinations', JSON.stringify(newSavedIds));
    setSavedDestinations(prev => prev.filter(dest => dest.id !== destinationId));
    toast.success('Destination removed from saved');
  };

  const handleSaveDestination = async () => {
    try {
      const allDestinations = await destinationService.getAll();
      const randomDest = allDestinations[Math.floor(Math.random() * allDestinations.length)];
      
      const savedIds = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      if (!savedIds.includes(randomDest.id)) {
        savedIds.push(randomDest.id);
        localStorage.setItem('savedDestinations', JSON.stringify(savedIds));
        setSavedDestinations(prev => [...prev, randomDest]);
        toast.success('Destination saved!');
      }
    } catch (error) {
      toast.error('Failed to save destination');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-primary/20 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/20 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-primary/20 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-primary/20 rounded w-1/2 animate-pulse"></div>
                  <div className="h-16 bg-primary/20 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary mb-2">Something went wrong</h2>
          <p className="text-secondary/70 mb-4">{error}</p>
          <motion.button
            onClick={loadSavedDestinations}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-display text-primary">
            Saved Destinations
          </h1>
          <motion.button
            onClick={handleSaveDestination}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="BookmarkPlus" className="w-4 h-4" />
            <span>Save Random</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {savedDestinations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-surface rounded-xl topographic-bg"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <ApperIcon name="Bookmark" className="w-16 h-16 text-primary/60 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-semibold text-secondary mb-2">No saved destinations yet</h3>
              <p className="text-secondary/70 mb-6">Start exploring and save places you want to visit!</p>
              <motion.button
                onClick={() => navigate('/discover')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Discover Destinations
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedDestinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 topographic-bg"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative">
                    <img
                      src={destination.heroImage}
                      alt={destination.name}
                      className="w-full h-48 object-cover"
                    />
                    <motion.button
                      onClick={() => handleUnsave(destination.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <ApperIcon name="BookmarkMinus" className="w-5 h-5 text-error" />
                    </motion.button>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-secondary">{destination.difficulty}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-secondary">{destination.name}</h3>
                      <span className="text-sm text-secondary/70">{destination.country}</span>
                    </div>
                    
                    <p className="text-secondary/80 text-sm mb-3 line-clamp-2">
                      {destination.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {destination.interests.slice(0, 3).map(interest => (
                        <span
                          key={interest}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {interest}
                        </span>
                      ))}
                      {destination.interests.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{destination.interests.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => navigate(`/destination/${destination.id}`)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2 px-4 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        onClick={() => navigate('/discover')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
                      >
                        Plan Trip
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Saved;