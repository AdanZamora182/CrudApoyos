import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { LayoutContainer, MainContent } from './Layout.styles';

const Layout = ({ collapsed, onToggleSidebar, user, onLogout, title }) => {
  return (
    <ThemeProvider theme={theme}>
      <LayoutContainer>
        <Sidebar 
          collapsed={collapsed}
          onToggle={onToggleSidebar}
          user={user}
          onLogout={onLogout}
        />
        <MainContent $collapsed={collapsed}>
          <Navbar title={title} user={user} />
          <Outlet />
        </MainContent>
      </LayoutContainer>
    </ThemeProvider>
  );
};

export default Layout;
