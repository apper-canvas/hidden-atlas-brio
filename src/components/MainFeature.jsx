import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { destinationService, itineraryService } from '../services';

const interests = [
  { id: 'hiking', label: 'Hiking', icon: 'Mountain', color: 'bg-green-100 text-green-700' },
  { id: 'cultural', label: 'Cultural', icon: 'Users', color: 'bg-purple-100 text-purple-700' },
  { id: 'beaches', label: 'Hidden Beaches', icon: 'Waves', color: 'bg-blue-100 text-blue-700' },
  { id: 'wildlife', label: 'Wildlife', icon: 'TreePine', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'history', label: 'History', icon: 'Castle', color: 'bg-amber-100 text-amber-700' },
  { id: 'adventure', label: 'Adventure Sports', icon: 'Zap', color: 'bg-red-100 text-red-700' }
];

const MainFeature = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [selectedInterests, searchTerm, destinations]);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const filterDestinations = () => {
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

    setFilteredDestinations(filtered);
  };

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

  const handleCreateItinerary = async (destination) => {
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

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Interest selector skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-primary/20 rounded w-48 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-surface rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Destinations skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface rounded-xl p-4 shadow-md"
            >
              <div className="h-48 bg-primary/20 rounded-lg mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 bg-primary/20 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-primary/20 rounded w-1/2 animate-pulse"></div>
                <div className="h-16 bg-primary/20 rounded animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interest Selector */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary">What adventure calls to you?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interests.map((interest, index) => (
            <motion.button
              key={interest.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleInterest(interest.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedInterests.includes(interest.id)
                  ? `border-primary bg-primary text-white shadow-md`
                  : `border-primary/20 bg-surface hover:border-primary/40 hover:shadow-sm ${interest.color}`
              }`}
            >
              <div className="flex items-center space-x-2">
                <ApperIcon name={interest.icon} className="w-5 h-5" />
                <span className="font-medium text-sm">{interest.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/60 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search destinations..."
          className="w-full pl-10 pr-4 py-3 border border-primary/20 rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {/* Destinations Grid */}
      <AnimatePresence mode="wait">
        {filteredDestinations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-surface rounded-xl"
          >
            <ApperIcon name="MapPin" className="w-16 h-16 text-primary/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary mb-2">No destinations found</h3>
            <p className="text-secondary/70">Try adjusting your interests or search terms</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDestinations.map((destination, index) => {
              const matchPercentage = calculateMatch(destination);
              return (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 topographic-bg"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative">
                    <img
                      src={destination.heroImage}
                      alt={destination.name}
                      className="w-full h-48 object-cover"
                    />
                    {selectedInterests.length > 0 && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="text-sm font-semibold text-primary">{matchPercentage}% match</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-secondary">{destination.difficulty}</span>
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
                        const interestData = interests.find(i => i.id === interest);
                        return (
                          <span
                            key={interest}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              interestData ? interestData.color : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {interestData ? interestData.label : interest}
                          </span>
                        );
                      })}
                      {destination.interests.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{destination.interests.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => navigate(`/destination/${destination.id}`)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2 px-4 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                      >
                        Explore
                      </motion.button>
                      <motion.button
                        onClick={() => handleCreateItinerary(destination)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
                      >
                        Quick Itinerary
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;