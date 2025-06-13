import itineraryData from '../mockData/itineraries.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ItineraryService {
  async getAll() {
    await delay(300);
    return [...itineraryData];
  }

  async getById(id) {
    await delay(250);
    const itinerary = itineraryData.find(item => item.id === id);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }
    return { ...itinerary };
  }

  async create(itinerary) {
    await delay(400);
    const newItinerary = {
      ...itinerary,
      id: Date.now().toString(),
      created: new Date().toISOString()
    };
    itineraryData.push(newItinerary);
    return { ...newItinerary };
  }

  async update(id, updates) {
    await delay(300);
    const index = itineraryData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Itinerary not found');
    }
    itineraryData[index] = { ...itineraryData[index], ...updates };
    return { ...itineraryData[index] };
  }

  async delete(id) {
    await delay(250);
    const index = itineraryData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Itinerary not found');
    }
    const deleted = itineraryData.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new ItineraryService();