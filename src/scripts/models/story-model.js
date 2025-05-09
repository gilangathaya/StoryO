import StoryAPI from '../data/api';

class StoryModel {
  async getStories() {
    try {
      const response = await StoryAPI.getStories();
      return response;
    } catch (error) {
      return { error: true, message: 'Failed to fetch stories' };
    }
  }

  async getStoryDetail(id) {
    try {
      const response = await StoryAPI.getStoryDetail(id);
      return response;
    } catch (error) {
      return { error: true, message: 'Failed to fetch story detail' };
    }
  }
}

export default StoryModel; 