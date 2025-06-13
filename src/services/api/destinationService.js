import destinationData from '../mockData/destinations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DestinationService {
  async getAll() {
    await delay(300);
    return [...destinationData];
  }

  async getById(id) {
    await delay(250);
    const destination = destinationData.find(dest => dest.id === id);
    if (!destination) {
      throw new Error('Destination not found');
    }
    return { ...destination };
  }

  async create(destination) {
    await delay(400);
    const newDestination = {
      ...destination,
      id: Date.now().toString(),
      created: new Date().toISOString()
    };
    destinationData.push(newDestination);
    return { ...newDestination };
  }

  async update(id, updates) {
    await delay(300);
    const index = destinationData.findIndex(dest => dest.id === id);
    if (index === -1) {
      throw new Error('Destination not found');
    }
    destinationData[index] = { ...destinationData[index], ...updates };
    return { ...destinationData[index] };
  }

  async delete(id) {
    await delay(250);
    const index = destinationData.findIndex(dest => dest.id === id);
    if (index === -1) {
      throw new Error('Destination not found');
    }
    const deleted = destinationData.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new DestinationService();