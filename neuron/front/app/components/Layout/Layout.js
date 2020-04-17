import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router';
import _ from 'lodash';

import { LayoutContent } from './LayoutContent';
import { LayoutNavbar } from './LayoutNavbar';
import { PageConfigContext } from './PageConfigContext';
import config from './../../../config';

const findChildByType = (children, targetType) => {
  let result;

  React.Children.forEach(children, (child) => {
    if (child.type.layoutPartName === targetType.layoutPartName) {
      result = child;
    }
  });

  return result;
};
const findChildrenByType = (children, targetType) => {
  return _.filter(React.Children.toArray(children), (child) =>
    child.type.layoutPartName === targetType.layoutPartName);
};

const responsiveBreakpoints = {
  'xs': { max: 575.8 },
  'sm': { min: 576, max: 767.8 },
  'md': { min: 768, max: 991.8 },
  'lg': { min: 992, max: 1199.8 },
  'xl': { min: 1200 },
};

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    favIcons: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      footerHidden: false,
      screenSize: '',
      animationsDisabled: true,

      pageTitle: null,
      pageDescription: config.siteDescription,
      pageKeywords: config.siteKeywords,
    };

    this.containerRef = React.createRef();
  }

  componentDidMount() {
    // Determine the current window size
    // and set it up in the context state
    const layoutAdjuster = () => {
      const { screenSize } = this.state;
      let currentScreenSize;

      _.forOwn(responsiveBreakpoints, (value, key) => {
        const queryParts = [
          `${ _.isUndefined(value.min) ? '' : `(min-width: ${value.min}px)` }`,
          `${ _.isUndefined(value.max) ? '' : `(max-width: ${value.max}px)`}`,
        ];
        const query = _.compact(queryParts).join(' and ');

        if (window.matchMedia(query).matches) {
          currentScreenSize = key;
        }
      });

      if (screenSize !== currentScreenSize) {
        this.setState({ screenSize: currentScreenSize });
      }
    };

    // Add window initialization
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        setTimeout(layoutAdjuster.bind(this), 0);
      });

      layoutAdjuster();

      window.requestAnimationFrame(() => {
        this.setState({ animationsDisabled: false });
      });
    }
    // Add document initialization
    if (typeof document !== 'undefined') {
      this.bodyElement = document.body;
      this.documentElement = document.documentElement;
    }
  }

  componentDidUpdate(prevProps) {
    // After location change
    if (prevProps.location.pathname !== this.props.location.pathname) {
      // Scroll to top
      if (this.bodyElement && this.documentElement) {
        this.documentElement.scrollTop = this.bodyElement.scrollTop = 0;
      }
    }

    // Update positions of STICKY navbars
    this.updateNavbarsPositions();
  }
  updateNavbarsPositions() {
    // eslint-disable-next-line react/no-find-dom-node
    const containerElement = ReactDOM.findDOMNode(this.containerRef.current);
    if (containerElement) {
      const navbarElements = containerElement.querySelectorAll(':scope .layout__navbar');

      // Calculate and update style.top of each navbar
      let totalNavbarsHeight = 0;
      navbarElements.forEach((navbarElement) => {
        const navbarBox = navbarElement.getBoundingClientRect();
        navbarElement.style.top = `${totalNavbarsHeight}px`;
        totalNavbarsHeight += navbarBox.height;
      });
    }
  }

  setElementsVisibility(elements) {
    this.setState(_.pick(elements, ['footerHidden']));
  }

  render() {
    const { children, favIcons } = this.props;
    const navbars = findChildrenByType(children, LayoutNavbar);
    const content = findChildByType(children, LayoutContent);
    const layoutClass = classNames('layout');

    return (
      <PageConfigContext.Provider
        value={ {
          ...this.state,
          setElementsVisibility: this.setElementsVisibility.bind(this),
          changeMeta: (metaData) => {
            this.setState(metaData);
          },
        } }
      >
        <Helmet>
          <meta charSet="utf-8"/>
          <title>{ config.siteTitle + (this.state.pageTitle ? ` - ${this.state.pageTitle}` : '') }</title>
          <link rel="canonical" href={ config.siteCannonicalUrl }/>
          <meta name="description" content={ this.state.pageDescription }/>
          {
            _.map(favIcons, (favIcon, index) => (
              <link { ...favIcon } key={ index }/>
            ))
          }
        </Helmet>
        <div className={ layoutClass } ref={ this.containerRef }>
          <div className="layout__wrap">
            { navbars }
            { content }
          </div>
        </div>
      </PageConfigContext.Provider>
    );
  }
}

const routedLayout = withRouter(Layout);

export { routedLayout as Layout };
