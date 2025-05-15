import BasePresenter from './base-presenter';
import { showLoading, hideLoading } from '../utils/loading-utils';
import StoriesDB from '../db';

class ArchivePresenter extends BasePresenter {
  constructor(model, view) {
    super(model, view);
    this.view.bindRemoveArchive(this.handleRemoveArchive.bind(this));
    this.init();
  }

  async init() {
    try {
      showLoading();
      const stories = await StoriesDB.getArchivedStories();
      hideLoading();
      this.view.showArchivedStories(stories);
    } catch (error) {
      hideLoading();
      this.showError('Gagal memuat cerita yang diarsipkan');
      console.error('Error loading archived stories:', error);
    }
  }

  async handleRemoveArchive(storyId) {
    try {
      showLoading();
      const story = await StoriesDB.getArchivedStory(storyId);
      await StoriesDB.deleteArchivedStory(storyId);
      
      // Show notification
      if ('serviceWorker' in navigator && 'Notification' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('Cerita Dihapus dari Arsip', {
          body: `Cerita "${story.name}" telah dihapus dari arsip`,
          icon: '/images/icons/icon-72x72.png',
          badge: '/images/icons/badge-72x72.png',
          vibrate: [100, 50, 100],
          data: {
            url: '#/'
          }
        });
      }
      
      const stories = await StoriesDB.getArchivedStories();
      hideLoading();
      this.view.showArchivedStories(stories);
    } catch (error) {
      hideLoading();
      this.showError('Gagal menghapus cerita dari arsip');
      console.error('Error removing archived story:', error);
    }
  }
}

export default ArchivePresenter; 