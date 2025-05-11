class BaseView {
  constructor() {
    if (this.constructor === BaseView) {
      throw new Error('BaseView is an abstract class and cannot be instantiated directly');
    }
  }

  showError(message) {
    throw new Error('showError() method must be implemented by child class');
  }

  render() {
    throw new Error('render() method must be implemented by child class');
  }
}

export default BaseView; 