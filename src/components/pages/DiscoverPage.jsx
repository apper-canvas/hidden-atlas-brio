import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { destinationService, itineraryService } from '@/services';

import InterestSelector from '@/components/organisms/InterestSelector';
import SearchBar from '@/components/organisms/SearchBar';
import DestinationGrid from '@/components/organisms/DestinationGrid';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';

const DiscoverPage = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (err) {
      setError(err.message || 'Failed to load destinations');
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

useEffect(() => {
    let filtered = destinations;

    if (searchTerm) {
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedInterests.length > 0) {
      filtered = filtered.filter(dest =>
        selectedInterests.some(interest => dest.interests.includes(interest))
      );
    }

    // Sort by match percentage (highest first)
    filtered = filtered.sort((a, b) => {
      const matchA = calculateMatch(a);
      const matchB = calculateMatch(b);
      return matchB - matchA;
    });

    setFilteredDestinations(filtered);
  }, [selectedInterests, searchTerm, destinations]);

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const calculateMatch = (destination) => {
    if (selectedInterests.length === 0) return 0;
    const matchCount = selectedInterests.filter(interest => 
      destination.interests.includes(interest)
    ).length;
    return Math.round((matchCount / selectedInterests.length) * 100);
  };

  const handleQuickItinerary = async (destination) => {
    try {
      const newItinerary = {
        destinationId: destination.id,
        days: [
          {
            day: 1,
            activities: [
              { time: '09:00', activity: 'Arrival and check-in', type: 'logistics' },
              { time: '14:00', activity: 'Local orientation walk', type: 'cultural' },
              { time: '18:00', activity: 'Traditional dinner', type: 'cultural' }
            ]
          },
          {
            day: 2,
            activities: [
              { time: '08:00', activity: 'Main adventure activity', type: selectedInterests[0] || 'adventure' },
              { time: '12:00', activity: 'Local lunch', type: 'cultural' },
              { time: '15:00', activity: 'Explore hidden gems', type: 'cultural' }
            ]
          },
          {
            day: 3,
            activities: [
              { time: '09:00', activity: 'Secondary activity', type: selectedInterests[1] || 'cultural' },
              { time: '13:00', activity: 'Farewell lunch', type: 'cultural' },
              { time: '16:00', activity: 'Departure preparation', type: 'logistics' }
            ]
          }
        ],
        packingList: [
          'Comfortable hiking boots',
          'Weather-appropriate clothing',
          'Camera and extra batteries',
          'First aid kit',
          'Local currency',
          'Travel documents'
        ]
      };

      await itineraryService.create(newItinerary);
      toast.success('Itinerary created successfully!');
      navigate('/my-trips');
    } catch (error) {
      toast.error('Failed to create itinerary');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/destination/${id}`);
  };

  if (loading) {
    return <LoadingState type="page" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDestinations} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
            Discover Hidden Gems
          </h1>
          <p className="text-secondary/80">
            Find unique destinations tailored to your adventure style
          </p>
        </div>
        
        <div className="space-y-6">
          <InterestSelector 
            selectedInterests={selectedInterests} 
            onToggleInterest={toggleInterest} 
          />
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            placeholder="Search destinations..." 
          />
          <DestinationGrid 
            destinations={filteredDestinations}
            selectedInterests={selectedInterests}
            onViewDetails={handleViewDetails}
            onQuickItinerary={handleQuickItinerary}
            calculateMatch={calculateMatch}
            showUnsaveButton={false} // This is discover page, no unsave here
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoverPage;