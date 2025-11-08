import styled from 'styled-components';

// Layout principal que contiene sidebar y contenido
export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme?.colors?.light || '#f5f7fa'};
  width: 100%;
`;