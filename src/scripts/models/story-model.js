import StoryAPI from '../data/api';

class StoryModel {
  async getStories() {
    try {
      console.log('Fetching stories...');
      const response = await StoryAPI.getStories();
      console.log('Stories fetched:', response);
      return response;
    } catch (error) {
      console.error('Error fetching stories:', error);
      return { error: true, message: 'Failed to fetch stories' };
    }
  }

  async getStoryDetail(id) {
    try {
      console.log('Fetching story detail for id:', id);
      const response = await StoryAPI.getStoryDetail(id);
      console.log('Story detail fetched:', response);
      return response;
    } catch (error) {
      console.error('Error fetching story detail:', error);
      return { error: true, message: 'Failed to fetch story detail' };
    }
  }
}

export default StoryModel; 