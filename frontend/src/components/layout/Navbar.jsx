import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { NavbarContainer, NavbarTitle, UserWelcome } from './Navbar.styles';

const Navbar = ({ title, user, onToggleSidebar, collapsed }) => {
  const { isMobile, getResponsiveValue } = useResponsive();

  return (
    <NavbarContainer $isMobile={isMobile}>
      {/* Botón de menú hamburguesa para móviles */}
      {isMobile && (
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginRight: '10px',
            color: '#5c6bc0',
          }}
        >
          <i className="bi bi-list"></i>
        </button>
      )}
      
      <NavbarTitle>
        {getResponsiveValue(
          title.length > 50 ? title.substring(0, 15) + '...' : title,
          title.length > 50 ? title.substring(0, 25) + '...' : title,
          title
        )}
      </NavbarTitle>
      
      {!isMobile && (
        <UserWelcome>
          Bienvenid@, {user?.nombre}
        </UserWelcome>
      )}
    </NavbarContainer>
  );
};

export default Navbar;
