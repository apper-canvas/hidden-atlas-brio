import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { motion } from 'framer-motion';

const RecommendationCard = ({ recommendation, index, ...rest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-surface rounded-xl p-4 shadow-sm topographic-bg"
      {...rest}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-secondary">{recommendation.name}</h3>
        <div className="flex items-center space-x-1">
          <ApperIcon name="Star" className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm text-secondary/70">{recommendation.rating}</span>
        </div>
      </div>
      <p className="text-sm text-secondary/80 mb-2">{recommendation.description}</p>
      <Badge className="bg-primary/10 text-primary">
        {recommendation.type}
      </Badge>
    </motion.div>
  );
};

export default RecommendationCard;