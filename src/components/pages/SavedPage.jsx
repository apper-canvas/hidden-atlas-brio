import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import DestinationCard from '@/components/molecules/DestinationCard';
import { destinationService } from '@/services';

import EmptyState from '@/components/organisms/EmptyState';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';

const SavedPage = () => {
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadSavedDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allDestinations = await destinationService.getAll();
      const savedIds = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      const saved = allDestinations.filter(dest => savedIds.includes(dest.id));
      setSavedDestinations(saved);
    } catch (err) {
      setError(err.message || 'Failed to load saved destinations');
      toast.error('Failed to load saved destinations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedDestinations();
  }, [loadSavedDestinations]);

  const handleUnsave = (destinationId) => {
    const savedIds = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
    const newSavedIds = savedIds.filter(id => id !== destinationId);
    localStorage.setItem('savedDestinations', JSON.stringify(newSavedIds));
    setSavedDestinations(prev => prev.filter(dest => dest.id !== destinationId));
    toast.success('Destination removed from saved');
  };

  const handleSaveRandomDestination = async () => {
    try {
      const allDestinations = await destinationService.getAll();
      const savedIds = new Set(JSON.parse(localStorage.getItem('savedDestinations') || '[]'));
      const unsavedDestinations = allDestinations.filter(dest => !savedIds.has(dest.id));

      if (unsavedDestinations.length === 0) {
        toast.info('No more destinations to save!');
        return;
      }

      const randomDest = unsavedDestinations[Math.floor(Math.random() * unsavedDestinations.length)];
      
      savedIds.add(randomDest.id);
      localStorage.setItem('savedDestinations', JSON.stringify(Array.from(savedIds)));
      setSavedDestinations(prev => [...prev, randomDest]);
      toast.success('Random destination saved!');
    } catch (error) {
      toast.error('Failed to save destination');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/destination/${id}`);
  };

  // Quick itinerary for saved items can navigate to detail page for full generation
  const handleQuickItinerary = (destination) => {
    navigate(`/destination/${destination.id}`);
  };

  if (loading) {
    return <LoadingState type="page" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadSavedDestinations} />;
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
          <Button
            onClick={handleSaveRandomDestination}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-accent text-white hover:bg-accent/90 flex items-center space-x-2"
          >
            <ApperIcon name="BookmarkPlus" className="w-4 h-4" />
            <span>Save Random</span>
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {savedDestinations.length === 0 ? (
            <EmptyState
              icon="Bookmark"
              title="No saved destinations yet"
              message="Start exploring and save places you want to visit!"
              actionText="Discover Destinations"
              onAction={() => navigate('/discover')}
              animated={true}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onViewDetails={handleViewDetails}
                  onQuickItinerary={handleQuickItinerary}
                  onUnsave={handleUnsave}
                  showUnsaveButton={true}
                  showQuickItineraryButton={true} // Allow quick itinerary from saved page
                  showMatchPercentage={false} // No match % on saved page
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SavedPage;