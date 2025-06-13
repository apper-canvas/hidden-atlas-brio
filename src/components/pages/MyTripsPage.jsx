import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { itineraryService, destinationService } from '@/services';
import { format } from 'date-fns';

import EmptyState from '@/components/organisms/EmptyState';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';

const MyTripsPage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [destinations, setDestinations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadItineraries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itineraryData, destinationData] = await Promise.all([
        itineraryService.getAll(),
        destinationService.getAll()
      ]);
      
      setItineraries(itineraryData);
      
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
  }, []);

  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

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
    return <LoadingState type="page" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadItineraries} />;
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
          <Button
            onClick={() => navigate('/discover')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-accent text-white hover:bg-accent/90 flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>New Trip</span>
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {itineraries.length === 0 ? (
            <EmptyState
              icon="MapPin"
              title="No trips planned yet"
              message="Start exploring and create your first adventure!"
              actionText="Discover Destinations"
              onAction={() => navigate('/discover')}
              animated={true}
            />
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
                            <Button
                              onClick={() => navigate(`/destination/${destination.id}`)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                            >
                              <ApperIcon name="Eye" className="w-5 h-5" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteTrip(trip.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-error hover:bg-error/10 rounded-lg"
                            >
                              <ApperIcon name="Trash2" className="w-5 h-5" />
                            </Button>
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

export default MyTripsPage;