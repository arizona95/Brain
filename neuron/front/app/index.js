import React from 'react';
import { render } from 'react-dom';

import { App } from './components';
import configureStore, { history } from './store';
import { signInByToken } from './actions/account';

let authenticationChecked = false;
const { store, persistor } = configureStore();

const renderAppWithAuth = () => {
  let token;
  if (!authenticationChecked) {
    authenticationChecked = true;
    token = localStorage.getItem('token');
  }

  if (token) {
    store.dispatch(signInByToken(token)).then(renderApp);
  } else {
    renderApp();
  }
};

const renderApp = () => {
  render(
    <App.Client store={store} persistor={persistor} history={history}/>,
    document.querySelector('#root'),
  );
};

store.subscribe(renderAppWithAuth);
renderAppWithAuth();
