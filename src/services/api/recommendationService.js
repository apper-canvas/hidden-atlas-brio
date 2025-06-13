import recommendationData from '../mockData/recommendations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RecommendationService {
  async getAll() {
    await delay(300);
    return [...recommendationData];
  }

  async getById(id) {
    await delay(250);
    const recommendation = recommendationData.find(rec => rec.id === id);
    if (!recommendation) {
      throw new Error('Recommendation not found');
    }
    return { ...recommendation };
  }

  async getByDestinationId(destinationId) {
    await delay(300);
    return recommendationData.filter(rec => rec.destinationId === destinationId).map(rec => ({ ...rec }));
  }

  async create(recommendation) {
    await delay(400);
    const newRecommendation = {
      ...recommendation,
      id: Date.now().toString(),
      created: new Date().toISOString()
    };
    recommendationData.push(newRecommendation);
    return { ...newRecommendation };
  }

  async update(id, updates) {
    await delay(300);
    const index = recommendationData.findIndex(rec => rec.id === id);
    if (index === -1) {
      throw new Error('Recommendation not found');
    }
    recommendationData[index] = { ...recommendationData[index], ...updates };
    return { ...recommendationData[index] };
  }

  async delete(id) {
    await delay(250);
    const index = recommendationData.findIndex(rec => rec.id === id);
    if (index === -1) {
      throw new Error('Recommendation not found');
    }
    const deleted = recommendationData.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new RecommendationService();