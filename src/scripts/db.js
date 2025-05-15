import { openDB } from 'idb';

const dbPromise = openDB('stories', 1, {
  upgrade(database) {
    database.createObjectStore('archived-stories', { keyPath: 'id' });
  },
});

const StoriesDB = {
  async getArchivedStories() {
    return (await dbPromise).getAll('archived-stories');
  },

  async getArchivedStory(id) {
    return (await dbPromise).get('archived-stories', id);
  },

  async putArchivedStory(story) {
    return (await dbPromise).put('archived-stories', story);
  },

  async deleteArchivedStory(id) {
    return (await dbPromise).delete('archived-stories', id);
  },
};

export default StoriesDB; 