import classNames from 'classnames';
import React from 'react';
import ReactLoading from 'react-loading';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { DefaultNavbar } from '../layout/components/DefaultNavbar';
import { MainNavbar } from '../layout/components/MainNavbar';


import Home from './Home';

const Wrapper = styled.div`
.page {
  height: 100vh;
  padding: 1rem 2rem 5%;
  overflow-x: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  transition: transform .3s ease-in-out, box-shadow .3s ease-in-out;
}

.page-enter {
  transform: translate(-100%, 0);
}

.page-enter-active {
  transform: translate(0, 0);
}

.page-exit {
  box-shadow: 0 0 5em 0 rgba(0, 0, 0, .5) inset;
  transform: translate(-100%, 0);
}

.page--prev {
  &.page-enter {
    transform: translate(100%, 0);
  }
  &.page-enter-active {
    transform: translate(0, 0);
  }
  &.page-exit {
    transform: translate(100%, 0);
  }
}

.page-exit .page__inner {
  opacity: 0;
  transform: scale(0.9);
  transition: transform .3s ease-in-out, opacity .3s ease-in-out;
}

.page h1 {
  margin-top: 0;
}
`;
const Loader = styled.div`
#loader {
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  opacity: 0;
  visibility: hidden;
  transition: visibility .2s, opacity linear .2s;
  -webkit-box-pack: center;
  justify-content: center;
  align-content: center;
  
  &.loading {
    opacity: 1;
    visibility: visible;
    background-color: #222;
  }
  
  > .indicator {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
  }
}
`;

//------ Route Definitions --------
const getRoutes = (props) => {
  const { location, page } = props;
  const cx = classNames({
    page: true,
    'page--prev': location.state && location.state.prev,
  });
  return (
    <React.Fragment>
      <Loader>
        <div id="loader" className={page.loading ? 'loading' : ''}>
          <div className="indicator">
            <ReactLoading type="spin" color="#fff"/>
            <h3 className="mt-3 mb-0 white">Loading...</h3>
          </div>
        </div>
      </Loader>
      <Wrapper>
        <TransitionGroup className="transition-group">
          <CSSTransition
            key={location.pathname}
            timeout={{ enter: 300, exit: 300 }}
            classNames="page"
          >
            <section className={cx}>
              <Route location={location}>
                <Switch>
                  <Route exact path="/" component={Home}/>
                </Switch>
              </Route>
            </section>
          </CSSTransition>
        </TransitionGroup>
      </Wrapper>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  page: state.common.page,
});
const Routes = withRouter(connect(mapStateToProps)(getRoutes));

//------ Custom Layout Parts --------
const getNavbars = (pathname) => {
  const navbarComponent = pathname === '/' ? DefaultNavbar : MainNavbar;
  return (
    <Switch>
      <Route component={navbarComponent}/>
    </Switch>
  );
};

export {
  Routes,
  getNavbars,
};
