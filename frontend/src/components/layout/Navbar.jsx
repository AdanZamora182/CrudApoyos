import React from 'react';
import { NavbarContainer, NavbarTitle, UserWelcome } from './Navbar.styles';

const Navbar = ({ title, user }) => {
  return (
    <NavbarContainer>
      <NavbarTitle>{title}</NavbarTitle>
      <UserWelcome>
        Bienvenid@, {user?.nombre}
      </UserWelcome>
    </NavbarContainer>
  );
};

export default Navbar;
