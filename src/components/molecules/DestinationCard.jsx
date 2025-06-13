import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { motion } from 'framer-motion';

const defaultInterests = [
  { id: 'hiking', label: 'Hiking', icon: 'Mountain', color: 'bg-green-100 text-green-700' },
  { id: 'cultural', label: 'Cultural', icon: 'Users', color: 'bg-purple-100 text-purple-700' },
  { id: 'beaches', label: 'Hidden Beaches', icon: 'Waves', color: 'bg-blue-100 text-blue-700' },
  { id: 'wildlife', label: 'Wildlife', icon: 'TreePine', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'history', label: 'History', icon: 'Castle', color: 'bg-amber-100 text-amber-700' },
  { id: 'adventure', label: 'Adventure Sports', icon: 'Zap', color: 'bg-red-100 text-red-700' }
];

const DestinationCard = ({
  destination,
  matchPercentage,
  onViewDetails,
  onQuickItinerary,
  onUnsave,
  onSave, // For Saved page to allow saving random
  showUnsaveButton = false,
  showMatchPercentage = false,
  showQuickItineraryButton = true,
  className = '',
  ...rest
}) => {
  const handleViewDetails = () => onViewDetails(destination.id);
  const handleQuickItinerary = () => onQuickItinerary(destination);
  const handleUnsave = () => onUnsave(destination.id);
  const handleSave = () => onSave(destination);

  return (
    <motion.div
      className={`bg-surface rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 topographic-bg ${className}`}
      whileHover={{ y: -4 }}
      {...rest}
    >
      <div className="relative">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-48 object-cover"
        />
        {showMatchPercentage && matchPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Badge className="text-primary bg-transparent">{matchPercentage}% match</Badge>
          </div>
        )}
        {showUnsaveButton && (
          <Button
            onClick={handleUnsave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white"
          >
            <ApperIcon name="BookmarkMinus" className="w-5 h-5 text-error" />
          </Button>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Badge className="text-secondary bg-transparent">{destination.difficulty}</Badge>
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
          {destination.interests.slice(0, 3).map(interest => {
            const interestData = defaultInterests.find(i => i.id === interest);
            return (
              <Badge
                key={interest}
                className={interestData ? interestData.color : 'bg-gray-100 text-gray-600'}
              >
                {interestData ? interestData.label : interest}
              </Badge>
            );
          })}
          {destination.interests.length > 3 && (
            <Badge className="bg-gray-100 text-gray-600">
              +{destination.interests.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleViewDetails}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 px-4 border border-primary text-primary hover:bg-primary hover:text-white"
          >
            {showUnsaveButton ? 'View Details' : 'Explore'}
          </Button>
          {showQuickItineraryButton && (
            <Button
              onClick={handleQuickItinerary}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 px-4 bg-accent text-white hover:bg-accent/90"
            >
              Quick Itinerary
            </Button>
          )}
          {onSave && ( // Only show if onSave prop is provided (e.g., for Saved page's "Save Random")
            <Button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 px-4 bg-primary text-white hover:bg-primary/90"
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;