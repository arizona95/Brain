import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

import { Layout } from './../components';

import { getNavbars } from './../routes';

import './../styles/bootstrap.scss';
import './../styles/main.scss';
import './../styles/plugins/plugins.css';
import './../styles/plugins/plugins.scss';

const favIcons = [
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: require('./../images/favicons/apple-touch-icon.png'),
  },

  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: require('./../images/favicons/android-chrome-192x192.png'),
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '256x256',
    href: require('./../images/favicons/android-chrome-256x256.png'),
  },

  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: require('./../images/favicons/favicon-32x32.png'),
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: require('./../images/favicons/favicon-16x16.png'),
  },
];

class AppLayout extends React.Component {
  render() {
    const { children, location } = this.props;

    return (
      <Layout favIcons={favIcons}>

        {/* -------- Content ------------*/}
        <Layout.Content>
          {children}
        </Layout.Content>
      </Layout>
    );
  }
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(AppLayout);
