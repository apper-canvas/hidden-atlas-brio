import React from 'react';
import InterestPill from '@/components/molecules/InterestPill';

const interestsData = [
  { id: 'hiking', label: 'Hiking', icon: 'Mountain', color: 'bg-green-100 text-green-700' },
  { id: 'cultural', label: 'Cultural', icon: 'Users', color: 'bg-purple-100 text-purple-700' },
  { id: 'beaches', label: 'Hidden Beaches', icon: 'Waves', color: 'bg-blue-100 text-blue-700' },
  { id: 'wildlife', label: 'Wildlife', icon: 'TreePine', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'history', label: 'History', icon: 'Castle', color: 'bg-amber-100 text-amber-700' },
  { id: 'adventure', label: 'Adventure Sports', icon: 'Zap', color: 'bg-red-100 text-red-700' }
];

const InterestSelector = ({ selectedInterests, onToggleInterest }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-secondary">What adventure calls to you?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {interestsData.map((interest, index) => (
          <InterestPill
            key={interest.id}
            interest={interest}
            isSelected={selectedInterests.includes(interest.id)}
            onClick={() => onToggleInterest(interest.id)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};

export default InterestSelector;