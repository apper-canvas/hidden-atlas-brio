import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import ActivityItem from '@/components/molecules/ActivityItem';

const ItineraryDisplay = ({ itinerary, onCreateTrip, isCreatingItinerary }) => {
  return (
    <div className="bg-surface rounded-xl p-6 topographic-bg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-secondary">Suggested Itinerary</h2>
        <Button
          onClick={onCreateTrip}
          disabled={isCreatingItinerary}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-accent text-white hover:bg-accent/90 disabled:opacity-50 flex items-center space-x-2"
        >
          {isCreatingItinerary ? (
            <>
              <Spinner className="w-4 h-4" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Create Trip</span>
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {itinerary.activities.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-l-4 border-primary pl-6 relative"
          >
            <div className="absolute -left-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{day.day}</span>
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-3">{day.title}</h3>
            <div className="space-y-2">
              {day.activities.map((activity, actIndex) => (
                <ActivityItem key={actIndex} activity={activity} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;