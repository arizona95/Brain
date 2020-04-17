import { ConnectedRouter } from 'connected-react-router';

import AppLayout from 'layout/default';
import PropTypes from 'prop-types';
import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Routes } from 'routes';

const AppClient = (props) => {
  return (
    <Provider store={props.store}>
      <PersistGate loading={null} persistor={props.persistor}>
        <BrowserRouter>
          <ConnectedRouter history={props.history}>
            <AppLayout>
              <Routes/>
            </AppLayout>
          </ConnectedRouter>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

AppClient.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default hot(module)(AppClient);
