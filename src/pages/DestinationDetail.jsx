import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { destinationService, recommendationService, itineraryService } from '../services';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [itinerary, setItinerary] = useState({
    days: 3,
    activities: []
  });
  const [packingList, setPackingList] = useState([]);
  const [isCreatingItinerary, setIsCreatingItinerary] = useState(false);

  useEffect(() => {
    loadDestinationData();
  }, [id]);

  const loadDestinationData = async () => {
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
  };

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
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-64 md:h-96 bg-primary/20"></div>
          <div className="px-4 py-6 max-w-4xl mx-auto">
            <div className="h-8 bg-primary/20 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-primary/20 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-surface rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary mb-2">Destination not found</h2>
          <p className="text-secondary/70 mb-4">{error || 'The destination you\'re looking for doesn\'t exist.'}</p>
          <motion.button
            onClick={() => navigate('/discover')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Discover
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <div className="relative h-64 md:h-96">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="p-6 text-white w-full">
            <h1 className="text-3xl md:text-4xl font-display mb-2">{destination.name}</h1>
            <p className="text-xl opacity-90">{destination.country}</p>
          </div>
        </div>
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ApperIcon name="ArrowLeft" className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={handleSaveDestination}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ApperIcon name="Bookmark" className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-surface rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: 'Info' },
            { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
            { id: 'recommendations', label: 'Local Tips', icon: 'MapPin' },
            { id: 'packing', label: 'Packing', icon: 'Package' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-secondary hover:bg-primary/10'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
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
              <div className="bg-surface rounded-xl p-6 topographic-bg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-secondary">Suggested Itinerary</h2>
                  <motion.button
                    onClick={handleCreateItinerary}
                    disabled={isCreatingItinerary}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isCreatingItinerary ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Plus" className="w-4 h-4" />
                        <span>Create Trip</span>
                      </>
                    )}
                  </motion.button>
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
                          <div key={actIndex} className="flex items-center space-x-3 text-sm">
                            <span className="font-medium text-primary min-w-[60px]">{activity.time}</span>
                            <span className="text-secondary/80">{activity.activity}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-surface rounded-xl p-4 shadow-sm topographic-bg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-secondary">{rec.name}</h3>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Star" className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-secondary/70">{rec.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-secondary/80 mb-2">{rec.description}</p>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {rec.type}
                      </span>
                    </motion.div>
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
              <div className="bg-surface rounded-xl p-6 topographic-bg">
                <h2 className="text-xl font-semibold text-secondary mb-6">Packing Checklist</h2>
                
                <div className="space-y-4">
                  {Object.entries(
                    packingList.reduce((acc, item) => {
                      if (!acc[item.category]) acc[item.category] = [];
                      acc[item.category].push(item);
                      return acc;
                    }, {})
                  ).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-medium text-secondary border-b border-primary/20 pb-1">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {items.map((item, index) => {
                          const itemIndex = packingList.findIndex(i => i === item);
                          return (
                            <motion.label
                              key={itemIndex}
                              className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-white/50 transition-colors"
                              whileHover={{ x: 4 }}
                            >
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => togglePackingItem(itemIndex)}
                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                              />
                              <span className={`text-sm ${
                                item.checked 
                                  ? 'text-secondary/50 line-through' 
                                  : 'text-secondary'
                              }`}>
                                {item.item}
                              </span>
                            </motion.label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-secondary/70">
                    <ApperIcon name="CheckCircle" className="w-4 h-4" />
                    <span>
                      {packingList.filter(item => item.checked).length} of {packingList.length} items packed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(packingList.filter(item => item.checked).length / packingList.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DestinationDetail;