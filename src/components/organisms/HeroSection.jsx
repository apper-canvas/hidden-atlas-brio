import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion';

const HeroSection = ({ image, name, country, onBack, onSaveDestination }) => {
  return (
    <div className="relative h-64 md:h-96">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-end">
        <div className="p-6 text-white w-full">
          <h1 className="text-3xl md:text-4xl font-display mb-2">{name}</h1>
          <p className="text-xl opacity-90">{country}</p>
        </div>
      </div>
      <Button
        onClick={onBack}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
      >
        <ApperIcon name="ArrowLeft" className="w-6 h-6" />
      </Button>
      <Button
        onClick={onSaveDestination}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
      >
        <ApperIcon name="Bookmark" className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default HeroSection;