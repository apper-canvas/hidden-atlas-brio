import React from 'react';
import { AnimatePresence } from 'framer-motion';
import DestinationCard from '@/components/molecules/DestinationCard';
import EmptyState from '@/components/organisms/EmptyState';

const DestinationGrid = ({
  destinations,
  selectedInterests,
  onViewDetails,
  onQuickItinerary,
  calculateMatch,
  showUnsaveButton = false,
  showQuickItineraryButton = true,
  onUnsave,
  onSave,
}) => {
  return (
    <AnimatePresence mode="wait">
      {destinations.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title="No destinations found"
          message="Try adjusting your interests or search terms"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {destinations.map((destination, index) => {
            const matchPercentage = selectedInterests.length > 0 ? calculateMatch(destination) : 0;
            return (
              <DestinationCard
                key={destination.id}
                destination={destination}
                matchPercentage={matchPercentage}
                onViewDetails={onViewDetails}
                onQuickItinerary={onQuickItinerary}
                onUnsave={onUnsave}
                onSave={onSave}
                showUnsaveButton={showUnsaveButton}
                showMatchPercentage={selectedInterests.length > 0}
                showQuickItineraryButton={showQuickItineraryButton}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
};

export default DestinationGrid;