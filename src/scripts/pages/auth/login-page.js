// src/scripts/pages/auth/login-page.js
import AuthModel from '../../models/auth-model';
import LoginView from '../../views/login-view';
import LoginPresenter from '../../presenters/login-presenter';

let view;

const LoginPage = {
  async render() {
    view = new LoginView();
    return view.render();
  },

  async afterRender() {
    const model = new AuthModel();
    new LoginPresenter(model, view);
  }
};

export default LoginPage;