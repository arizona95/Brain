import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  NavItem,
  NavLink,
  Row,
} from './../../components';

const NavbarUser = (props) => (
  <NavItem { ...props }>
    <Row>
      <NavLink tag={ Link } to="/">
        <i className="fa fa-power-off"/>
      </NavLink>
    </Row>
  </NavItem>
);
NavbarUser.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export { NavbarUser };
