import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { StaticRouter } from 'react-router';

import { Routes } from './../../routes';
import AppLayout from './../../layout/default';

const context = {};

const AppServer = props => {
  const { url } = props;

  return (
    <StaticRouter context={ context } location={ url }>
      <AppLayout>
        { Routes() }
      </AppLayout>
    </StaticRouter>
  );
};

AppServer.propTypes = {
  url: PropTypes.string,
};

export default hot(module)(AppServer);
