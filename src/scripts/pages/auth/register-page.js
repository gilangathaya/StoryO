// src/scripts/pages/auth/register-page.js
import AuthModel from '../../models/auth-model';
import RegisterView from '../../views/register-view';
import RegisterPresenter from '../../presenters/register-presenter';

let view;

const RegisterPage = {
  async render() {
    view = new RegisterView();
    return view.render();
  },

  async afterRender() {
    const model = new AuthModel();
    new RegisterPresenter(model, view);
  }
};

export default RegisterPage;