import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { destinationService, recommendationService, itineraryService } from '@/services';

import HeroSection from '@/components/organisms/HeroSection';
import TabNavigation from '@/components/organisms/TabNavigation';
import ItineraryDisplay from '@/components/organisms/ItineraryDisplay';
import PackingChecklist from '@/components/organisms/PackingChecklist';
import RecommendationCard from '@/components/molecules/RecommendationCard';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import ApperIcon from '@/components/ApperIcon'; // Needed for direct use in recommendation empty state

const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [itinerary, setItinerary] = useState({ days: 3, activities: [] });
  const [packingList, setPackingList] = useState([]);
  const [isCreatingItinerary, setIsCreatingItinerary] = useState(false);

  const loadDestinationData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [destData, recData] = await Promise.all([
        destinationService.getById(id),
        recommendationService.getAll()
      ]);
      
      setDestination(destData);
      setRecommendations(recData.filter(rec => rec.destinationId === id));
      generatePackingList(destData);
      generateItinerary(destData);
    } catch (err) {
      setError(err.message || 'Failed to load destination');
      toast.error('Failed to load destination');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDestinationData();
  }, [loadDestinationData]);

  const generatePackingList = (dest) => {
    const baseItems = [
      { item: 'Passport and travel documents', category: 'Documents', checked: false },
      { item: 'Camera and extra batteries', category: 'Electronics', checked: false },
      { item: 'First aid kit', category: 'Health', checked: false },
      { item: 'Local currency', category: 'Money', checked: false }
    ];

    const activityItems = [];
    if (dest.interests.includes('hiking')) {
      activityItems.push(
        { item: 'Hiking boots', category: 'Footwear', checked: false },
        { item: 'Backpack', category: 'Gear', checked: false },
        { item: 'Water bottle', category: 'Gear', checked: false }
      );
    }
    if (dest.interests.includes('beaches')) {
      activityItems.push(
        { item: 'Swimwear', category: 'Clothing', checked: false },
        { item: 'Sunscreen', category: 'Health', checked: false },
        { item: 'Beach towel', category: 'Accessories', checked: false }
      );
    }
    if (dest.interests.includes('cultural')) {
      activityItems.push(
        { item: 'Modest clothing', category: 'Clothing', checked: false },
        { item: 'Comfortable walking shoes', category: 'Footwear', checked: false }
      );
    }

    setPackingList([...baseItems, ...activityItems]);
  };

  const generateItinerary = (dest) => {
    const sampleItinerary = {
      days: 3,
      activities: [
        {
          day: 1,
          title: 'Arrival & Orientation',
          activities: [
            { time: '09:00', activity: 'Airport pickup and check-in', type: 'logistics' },
            { time: '14:00', activity: 'Local orientation walk', type: 'cultural' },
            { time: '18:00', activity: 'Welcome dinner at local restaurant', type: 'cultural' }
          ]
        },
        {
          day: 2,
          title: 'Main Adventure',
          activities: [
            { time: '08:00', activity: `${dest.interests[0]} adventure`, type: dest.interests[0] },
            { time: '12:00', activity: 'Local lunch break', type: 'cultural' },
            { time: '15:00', activity: 'Explore hidden gems', type: 'cultural' },
            { time: '19:00', activity: 'Sunset viewing', type: 'scenic' }
          ]
        },
        {
          day: 3,
          title: 'Cultural Immersion',
          activities: [
            { time: '09:00', activity: 'Local market visit', type: 'cultural' },
            { time: '13:00', activity: 'Traditional cooking class', type: 'cultural' },
            { time: '16:00', activity: 'Departure preparation', type: 'logistics' }
          ]
        }
      ]
    };
    setItinerary(sampleItinerary);
  };

  const handleCreateItinerary = async () => {
    if (!destination) return;
    setIsCreatingItinerary(true);
    try {
      const newItinerary = {
        destinationId: destination.id,
        days: itinerary.activities,
        packingList: packingList.map(item => item.item)
      };
      
      await itineraryService.create(newItinerary);
      toast.success('Itinerary created successfully!');
      navigate('/my-trips');
    } catch (error) {
      toast.error('Failed to create itinerary');
    } finally {
      setIsCreatingItinerary(false);
    }
  };

  const handleSaveDestination = () => {
    if (!destination) return;
    const savedIds = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
    if (!savedIds.includes(destination.id)) {
      savedIds.push(destination.id);
      localStorage.setItem('savedDestinations', JSON.stringify(savedIds));
      toast.success('Destination saved!');
    } else {
      toast.info('Destination already saved');
    }
  };

  const togglePackingItem = (index) => {
    setPackingList(prev => prev.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };

  if (loading) {
    return <LoadingState type="page" />;
  }

  if (error || !destination) {
    return (
      <ErrorState 
        message={error || 'The destination you\'re looking for doesn\'t exist.'} 
        onRetry={() => navigate('/discover')} 
        actionText="Back to Discover"
      />
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
    { id: 'recommendations', label: 'Local Tips', icon: 'MapPin' },
    { id: 'packing', label: 'Packing', icon: 'Package' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <HeroSection 
        image={destination.heroImage}
        name={destination.name}
        country={destination.country}
        onBack={() => navigate(-1)}
        onSaveDestination={handleSaveDestination}
      />

      <div className="px-4 py-6 max-w-4xl mx-auto">
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-surface rounded-xl p-6 topographic-bg">
                <h2 className="text-xl font-semibold text-secondary mb-4">About this destination</h2>
                <p className="text-secondary/80 mb-6">{destination.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <ApperIcon name="Calendar" className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-secondary">Best Time</h3>
                    <p className="text-sm text-secondary/70">{destination.bestMonths.join(', ')}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <ApperIcon name="TrendingUp" className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-secondary">Difficulty</h3>
                    <p className="text-sm text-secondary/70">{destination.difficulty}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <ApperIcon name="Heart" className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-secondary">Interests</h3>
                    <p className="text-sm text-secondary/70">{destination.interests.length} activities</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {destination.interests.map(interest => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'itinerary' && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <ItineraryDisplay 
                itinerary={itinerary} 
                onCreateTrip={handleCreateItinerary} 
                isCreatingItinerary={isCreatingItinerary}
              />
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {recommendations.length === 0 ? (
                <div className="bg-surface rounded-xl p-8 text-center topographic-bg">
                  <ApperIcon name="MapPin" className="w-12 h-12 text-primary/60 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-secondary mb-2">No recommendations yet</h3>
                  <p className="text-secondary/70">Local tips and recommendations will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec, index) => (
                    <RecommendationCard key={rec.id} recommendation={rec} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'packing' && (
            <motion.div
              key="packing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <PackingChecklist packingList={packingList} onToggleItem={togglePackingItem} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DestinationDetailPage;