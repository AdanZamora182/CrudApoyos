import React from 'react';
import {
  ViewModalOverlay,
  ViewModalContent,
  ViewModalHeader,
  ViewModalCloseButton,
  DetailsContainer,
  DetailsSection,
  SectionTitle,
  DetailsGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  ViewModalFooter,
  CloseButton,
} from '../../components/view/RegisterView.styles';

const ApoyoView = ({ apoyo, onClose }) => {
  // Función para formatear fechas en formato YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!apoyo) return null;

  return (
    <ViewModalOverlay onClick={onClose}>
      <ViewModalContent className="large-modal" onClick={(e) => e.stopPropagation()}>
        <ViewModalHeader>
          <h3>Detalles del Apoyo</h3>
          <ViewModalCloseButton onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </ViewModalCloseButton>
        </ViewModalHeader>
        
        <DetailsContainer>
          {/* Información del Apoyo */}
          <DetailsSection>
            <SectionTitle>Información del Apoyo</SectionTitle>
            <DetailsGrid className="wide-grid">
              <DetailItem>
                <DetailLabel>ID</DetailLabel>
                <DetailValue>{apoyo.id}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Tipo de Apoyo</DetailLabel>
                <DetailValue>{apoyo.tipoApoyo}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Cantidad</DetailLabel>
                <DetailValue>{apoyo.cantidad}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Fecha de Entrega</DetailLabel>
                <DetailValue>{formatDate(apoyo.fechaEntrega)}</DetailValue>
              </DetailItem>
            </DetailsGrid>
          </DetailsSection>
          
          {/* Información del Beneficiario */}
          <DetailsSection>
            <SectionTitle>Información del Beneficiario</SectionTitle>
            {apoyo.persona ? (
              <DetailsGrid className="wide-grid">
                <DetailItem>
                  <DetailLabel>Tipo</DetailLabel>
                  <DetailValue>Integrante de Círculo</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Nombre Completo</DetailLabel>
                  <DetailValue>
                    {`${apoyo.persona.nombre} ${apoyo.persona.apellidoPaterno} ${apoyo.persona.apellidoMaterno}`}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Clave de Elector</DetailLabel>
                  <DetailValue>{apoyo.persona.claveElector}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Teléfono</DetailLabel>
                  <DetailValue>{apoyo.persona.telefono}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Dirección</DetailLabel>
                  <DetailValue>
                    {`${apoyo.persona.calle} ${apoyo.persona.noExterior}${apoyo.persona.noInterior ? `, Int. ${apoyo.persona.noInterior}` : ''}
${apoyo.persona.colonia}
C.P. ${apoyo.persona.codigoPostal}`}
                  </DetailValue>
                </DetailItem>
              </DetailsGrid>
            ) : apoyo.cabeza ? (
              <DetailsGrid className="wide-grid">
                <DetailItem>
                  <DetailLabel>Tipo</DetailLabel>
                  <DetailValue>Cabeza de Círculo</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Nombre Completo</DetailLabel>
                  <DetailValue>
                    {`${apoyo.cabeza.nombre} ${apoyo.cabeza.apellidoPaterno} ${apoyo.cabeza.apellidoMaterno}`}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Clave de Elector</DetailLabel>
                  <DetailValue>{apoyo.cabeza.claveElector}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Teléfono</DetailLabel>
                  <DetailValue>{apoyo.cabeza.telefono}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Dirección</DetailLabel>
                  <DetailValue>
                    {`${apoyo.cabeza.calle} ${apoyo.cabeza.noExterior}${apoyo.cabeza.noInterior ? `, Int. ${apoyo.cabeza.noInterior}` : ''}
${apoyo.cabeza.colonia}
C.P. ${apoyo.cabeza.codigoPostal}`}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Estructura Territorial</DetailLabel>
                  <DetailValue>{apoyo.cabeza.estructuraTerritorial || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Posición en Estructura</DetailLabel>
                  <DetailValue>{apoyo.cabeza.posicionEstructura || "N/A"}</DetailValue>
                </DetailItem>
              </DetailsGrid>
            ) : (
              <p>No se encontró información del beneficiario</p>
            )}
          </DetailsSection>
          
          {/* Mostrar Cabeza de Círculo si el beneficiario es un Integrante con líder */}
          {apoyo.persona && apoyo.persona.lider && (
            <DetailsSection>
              <SectionTitle>Cabeza de Círculo Asociada</SectionTitle>
              <DetailsGrid>
                <DetailItem>
                  <DetailLabel>Nombre Completo</DetailLabel>
                  <DetailValue>
                    {`${apoyo.persona.lider.nombre} ${apoyo.persona.lider.apellidoPaterno} ${apoyo.persona.lider.apellidoMaterno}`}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Clave de Elector</DetailLabel>
                  <DetailValue>{apoyo.persona.lider.claveElector}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Teléfono</DetailLabel>
                  <DetailValue>{apoyo.persona.lider.telefono}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Estructura Territorial</DetailLabel>
                  <DetailValue>{apoyo.persona.lider.estructuraTerritorial || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Posición en Estructura</DetailLabel>
                  <DetailValue>{apoyo.persona.lider.posicionEstructura || "N/A"}</DetailValue>
                </DetailItem>
              </DetailsGrid>
            </DetailsSection>
          )}
          
          {/* Footer del modal con botón de cerrar */}
          <ViewModalFooter>
            <CloseButton onClick={onClose}>
              <i className="bi bi-check-circle"></i>
              Cerrar
            </CloseButton>
          </ViewModalFooter>
        </DetailsContainer>
      </ViewModalContent>
    </ViewModalOverlay>
  );
};

export default ApoyoView;
