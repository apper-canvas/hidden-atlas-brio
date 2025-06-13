import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { itineraryService, destinationService } from '../services';
import { format } from 'date-fns';

const MyTrips = () => {
  const [itineraries, setItineraries] = useState([]);
  const [destinations, setDestinations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    setLoading(true);
    setError(null);
    try {
      const [itineraryData, destinationData] = await Promise.all([
        itineraryService.getAll(),
        destinationService.getAll()
      ]);
      
      setItineraries(itineraryData);
      
      // Create destination lookup object
      const destLookup = {};
      destinationData.forEach(dest => {
        destLookup[dest.id] = dest;
      });
      setDestinations(destLookup);
    } catch (err) {
      setError(err.message || 'Failed to load trips');
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      await itineraryService.delete(id);
      setItineraries(prev => prev.filter(trip => trip.id !== id));
      toast.success('Trip deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete trip');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-primary/20 rounded w-48 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface rounded-xl p-6 shadow-md">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-primary/20 rounded w-3/4"></div>
                  <div className="h-4 bg-primary/20 rounded w-1/2"></div>
                  <div className="h-20 bg-primary/20 rounded"></div>
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
            onClick={loadItineraries}
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
            My Trips
          </h1>
          <motion.button
            onClick={() => navigate('/discover')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>New Trip</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {itineraries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-surface rounded-xl topographic-bg"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="MapPin" className="w-16 h-16 text-primary/60 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-semibold text-secondary mb-2">No trips planned yet</h3>
              <p className="text-secondary/70 mb-6">Start exploring and create your first adventure!</p>
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
            <div className="space-y-4">
              {itineraries.map((trip, index) => {
                const destination = destinations[trip.destinationId];
                if (!destination) return null;

                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 topographic-bg"
                    whileHover={{ y: -2 }}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={destination.heroImage}
                          alt={destination.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-secondary mb-1">
                              {destination.name}
                            </h3>
                            <p className="text-secondary/70 text-sm">
                              {destination.country} • {trip.days.length} days
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => navigate(`/destination/${destination.id}`)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <ApperIcon name="Eye" className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteTrip(trip.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                            >
                              <ApperIcon name="Trash2" className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-secondary/80 text-sm line-clamp-2">
                            {destination.description}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-secondary/70">
                            <ApperIcon name="Calendar" className="w-4 h-4" />
                            <span>Created {format(new Date(trip.created), 'MMM d, yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-secondary/70">
                            <ApperIcon name="CheckSquare" className="w-4 h-4" />
                            <span>{trip.packingList.length} items to pack</span>
                          </div>

                          <div className="pt-2">
                            <h4 className="text-sm font-medium text-secondary mb-2">Day 1 Preview:</h4>
                            <div className="text-xs text-secondary/70 space-y-1">
                              {trip.days[0]?.activities.slice(0, 2).map((activity, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <span className="font-medium">{activity.time}</span>
                                  <span>{activity.activity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MyTrips;