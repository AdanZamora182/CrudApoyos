import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { buscarCabezasCirculo } from '../../api';
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
import { LoaderContainer, Loader } from '../../components/tables/Table.styles';

const CabezaCirculoView = ({ cabezaId, cabeza: initialCabeza, onClose }) => {
  // Consulta para obtener los datos actualizados de la cabeza de círculo
  const {
    data: cabezaData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cabezaCirculo", cabezaId || initialCabeza?.id],
    queryFn: async () => {
      const id = cabezaId || initialCabeza?.id;
      if (!id) return null;
      // Buscar por clave de elector para obtener datos frescos
      const results = await buscarCabezasCirculo(initialCabeza?.claveElector || "");
      return results.find(c => c.id === id) || initialCabeza;
    },
    initialData: initialCabeza,
    staleTime: 1 * 60 * 1000, // Los datos se consideran frescos por 1 minuto
    enabled: !!(cabezaId || initialCabeza?.id),
  });

  // Usar los datos de la consulta o los iniciales
  const cabeza = cabezaData || initialCabeza;

  // Función para formatear fechas en formato YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!cabeza && !isLoading) return null;

  // Mostrar loader mientras carga
  if (isLoading && !cabeza) {
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
          <h3>Detalles de Cabeza de Círculo</h3>
          <ViewModalCloseButton onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </ViewModalCloseButton>
        </ViewModalHeader>
        
        <DetailsContainer>
          {/* Información Personal */}
          <DetailsSection>
            <SectionTitle>Información Personal</SectionTitle>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>ID:</DetailLabel>
                <DetailValue>{cabeza.id}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Nombre Completo:</DetailLabel>
                <DetailValue>
                  {`${cabeza.nombre} ${cabeza.apellidoPaterno} ${cabeza.apellidoMaterno}`}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Fecha de Nacimiento:</DetailLabel>
                <DetailValue>{formatDate(cabeza.fechaNacimiento)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Clave de Elector:</DetailLabel>
                <DetailValue>{cabeza.claveElector}</DetailValue>
              </DetailItem>
            </DetailsGrid>
          </DetailsSection>

          {/* Información de Contacto */}
          <DetailsSection>
            <SectionTitle>Información de Contacto</SectionTitle>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Teléfono:</DetailLabel>
                <DetailValue>{cabeza.telefono}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Email:</DetailLabel>
                <DetailValue>{cabeza.email || "-"}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Facebook:</DetailLabel>
                <DetailValue>{cabeza.facebook || "-"}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Otra Red Social:</DetailLabel>
                <DetailValue>{cabeza.otraRedSocial || "-"}</DetailValue>
              </DetailItem>
            </DetailsGrid>
          </DetailsSection>

          {/* Dirección */}
          <DetailsSection>
            <SectionTitle>Dirección</SectionTitle>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Dirección Completa:</DetailLabel>
                <DetailValue>
                  {`${cabeza.calle} ${cabeza.noExterior}${cabeza.noInterior ? `, Int. ${cabeza.noInterior}` : ''}
${cabeza.colonia}
C.P. ${cabeza.codigoPostal}${cabeza.municipio ? `, ${cabeza.municipio}` : ''}`}
                </DetailValue>
              </DetailItem>
            </DetailsGrid>
          </DetailsSection>

          {/* Información Organizacional */}
          <DetailsSection>
            <SectionTitle>Información Organizacional</SectionTitle>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Estructura Territorial:</DetailLabel>
                <DetailValue>{cabeza.estructuraTerritorial || "-"}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Posición en Estructura:</DetailLabel>
                <DetailValue>{cabeza.posicionEstructura || "-"}</DetailValue>
              </DetailItem>
            </DetailsGrid>
          </DetailsSection>
          
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

export default CabezaCirculoView;
