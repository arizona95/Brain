import React from 'react';

import {
  Navbar,
  Nav,
} from './../../components';

import { NavbarUser } from './NavbarUser';

export const DefaultNavbar = () => (
  <Navbar light color="none" expand="xs">
    <Nav navbar className="ml-auto">
      <NavbarUser className="ml-2"/>
      dddd
    </Nav>
  </Navbar>
);
