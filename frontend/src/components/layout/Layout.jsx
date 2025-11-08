import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { LayoutContainer } from './Layout.styles';
import { MainContent, ContentBody } from './Navbar.styles';

const Layout = ({ collapsed, onToggleSidebar, user, onLogout, title, children }) => {
  const { isMobile } = useResponsive();

  return (
    <LayoutContainer>
      {/* Overlay para móviles cuando el sidebar está abierto */}
      {isMobile && !collapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => onToggleSidebar()}
          aria-label="Cerrar menú"
        />
      )}

      <Sidebar 
        collapsed={collapsed}
        onToggle={onToggleSidebar}
        user={user}
        onLogout={onLogout}
      />
      <MainContent $collapsed={collapsed}>
        <Navbar 
          title={title} 
          user={user} 
          onToggleSidebar={onToggleSidebar}
          collapsed={collapsed}
        />
        <ContentBody>
          {children}
        </ContentBody>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
