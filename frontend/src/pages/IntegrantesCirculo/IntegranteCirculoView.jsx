import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { buscarIntegrantesCirculo } from '../../api';
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
  NoLeaderMessage,
  ViewModalFooter,
  CloseButton,
} from '../../components/view/RegisterView.styles';
import { LoaderContainer, Loader } from '../../components/tables/Table.styles';

const IntegranteCirculoView = ({ integranteId, integrante: initialIntegrante, onClose }) => {
  // Consulta para obtener los datos actualizados del integrante de círculo
  const {
    data: integranteData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["integranteCirculo", integranteId || initialIntegrante?.id],
    queryFn: async () => {
      const id = integranteId || initialIntegrante?.id;
      if (!id) return null;
      // Buscar por clave de elector para obtener datos frescos
      const results = await buscarIntegrantesCirculo(initialIntegrante?.claveElector || "");
      return results.find(i => i.id === id) || initialIntegrante;
    },
    initialData: initialIntegrante,
    staleTime: 1 * 60 * 1000, // Los datos se consideran frescos por 1 minuto
    enabled: !!(integranteId || initialIntegrante?.id),
  });

  // Usar los datos de la consulta o los iniciales
  const integrante = integranteData || initialIntegrante;

  // Función para formatear fechas en formato YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!integrante && !isLoading) return null;

  // Mostrar loader mientras carga
  if (isLoading && !integrante) {
    return (
      <ViewModalOverlay onClick={onClose}>
        <ViewModalContent onClick={(e) => e.stopPropagation()}>
          <LoaderContainer>
            <Loader />
            <p>Cargando datos...</p>
          </LoaderContainer>
        </ViewModalContent>
      </ViewModalOverlay>
    );
  }

  return (
    <ViewModalOverlay onClick={onClose}>
      <ViewModalContent className="large-modal" onClick={(e) => e.stopPropagation()}>
        <ViewModalHeader>
          <h3>Detalles Completos</h3>
          <ViewModalCloseButton onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </ViewModalCloseButton>
        </ViewModalHeader>
        
        <DetailsContainer>
          {/* Información del Integrante de Círculo */}
          <DetailsSection>
            <SectionTitle>Información del Integrante de Círculo</SectionTitle>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>ID:</DetailLabel>
                <DetailValue>{integrante.id}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Nombre Completo:</DetailLabel>
                <DetailValue>
                  {`${integrante.nombre} ${integrante.apellidoPaterno} ${integrante.apellidoMaterno}`}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Fecha de Nacimiento:</DetailLabel>
                <DetailValue>{formatDate(integrante.fechaNacimiento)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Teléfono:</DetailLabel>
                <DetailValue>{integrante.telefono}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Dirección:</DetailLabel>
                <DetailValue>
                  {`${integrante.calle} ${integrante.noExterior}${integrante.noInterior ? `, Int. ${integrante.noInterior}` : ''}
${integrante.colonia}
C.P. ${integrante.codigoPostal}`}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Clave de Elector:</DetailLabel>
                <DetailValue>{integrante.claveElector}</DetailValue>
              </DetailItem>
            </DetailsGrid>
          </DetailsSection>
          
          {/* Información del Líder (Cabeza de Círculo) */}
          {integrante.lider ? (
            <DetailsSection>
              <SectionTitle>Información del Líder (Cabeza de Círculo)</SectionTitle>
              <DetailsGrid>
                <DetailItem>
                  <DetailLabel>ID:</DetailLabel>
                  <DetailValue>{integrante.lider.id}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Nombre Completo:</DetailLabel>
                  <DetailValue>
                    {`${integrante.lider.nombre} ${integrante.lider.apellidoPaterno} ${integrante.lider.apellidoMaterno}`}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Fecha de Nacimiento:</DetailLabel>
                  <DetailValue>{formatDate(integrante.lider.fechaNacimiento)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Teléfono:</DetailLabel>
                  <DetailValue>{integrante.lider.telefono}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Dirección:</DetailLabel>
                  <DetailValue>
                    {`${integrante.lider.calle} ${integrante.lider.noExterior}${integrante.lider.noInterior ? `, Int. ${integrante.lider.noInterior}` : ''}
${integrante.lider.colonia}
C.P. ${integrante.lider.codigoPostal}${integrante.lider.municipio ? `, ${integrante.lider.municipio}` : ''}`}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Clave de Elector:</DetailLabel>
                  <DetailValue>{integrante.lider.claveElector}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Email:</DetailLabel>
                  <DetailValue>{integrante.lider.email || "-"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Redes Sociales:</DetailLabel>
                  <DetailValue>
                    {integrante.lider.facebook ? `Facebook: ${integrante.lider.facebook}` : ''}
                    {integrante.lider.facebook && integrante.lider.otraRedSocial ? ' | ' : ''}
                    {integrante.lider.otraRedSocial ? `Otra: ${integrante.lider.otraRedSocial}` : ''}
                    {!integrante.lider.facebook && !integrante.lider.otraRedSocial ? '-' : ''}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Estructura Territorial:</DetailLabel>
                  <DetailValue>{integrante.lider.estructuraTerritorial || "-"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Posición en Estructura:</DetailLabel>
                  <DetailValue>{integrante.lider.posicionEstructura || "-"}</DetailValue>
                </DetailItem>
              </DetailsGrid>
            </DetailsSection>
          ) : (
            <DetailsSection>
              <SectionTitle>Información del Líder</SectionTitle>
              <NoLeaderMessage>Este integrante no tiene un líder (Cabeza de Círculo) asignado.</NoLeaderMessage>
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

export default IntegranteCirculoView;
