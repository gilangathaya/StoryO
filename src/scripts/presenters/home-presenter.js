import BasePresenter from './base-presenter';
import { showLoading, hideLoading } from '../utils/loading-utils';

class HomePresenter extends BasePresenter {
  constructor(model, view) {
    super(model, view);
    this.init();
  }

  async init() {
    try {
      showLoading();
      const response = await this.model.getStories();
      hideLoading();
      if (response.error) {
        this.showError(response.message);
        return;
      }
      this.view.displayStories(response.data);
    } catch (error) {
      hideLoading();
      this.showError('Gagal memuat data cerita');
      console.error(error);
    }
  }
}

export default HomePresenter; 