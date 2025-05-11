class BasePresenter {
  constructor(model, view) {
    if (this.constructor === BasePresenter) {
      throw new Error('BasePresenter is an abstract class and cannot be instantiated directly');
    }
    this.model = model;
    this.view = view;
  }

  async init() {
    throw new Error('init() method must be implemented by child class');
  }

  showError(message) {
    this.view.showError(message);
  }
}

export default BasePresenter; 