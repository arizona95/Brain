import React from 'react';

import { Nav, Navbar, NavItem } from './../../components';

import { NavbarUser } from './NavbarUser';

export const MainNavbar = () => (
  <Navbar light color="black" expand="xs">
    <Nav navbar>
      <NavItem className="navbar-brand h5 mb-0">
        <i className="fa fa-bandcamp fa-fw text-primary"/>
        <span className="h5 mb-0 fw-900 ml-2">DOWOOME</span>
      </NavItem>
    </Nav>
    <Nav navbar className="ml-auto">
      <NavbarUser className="ml-2" />
    </Nav>
  </Navbar>
);
