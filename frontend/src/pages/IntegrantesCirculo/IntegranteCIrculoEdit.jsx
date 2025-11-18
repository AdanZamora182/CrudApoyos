import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateIntegranteCirculo, buscarCabezasCirculo } from '../../api';
import { useToaster } from '../../components/ui/ToasterProvider';
import {
  FormSection,
  SectionHeading,
  PrimaryButton,
  SecondaryButton,
  SearchResults,
  SearchResultItem,
  SelectedLiderContainer,
  SelectedBeneficiaryInput,
  RemoveLiderButton,
} from '../../components/forms/FormSections.styles';

const IntegranteCirculoEdit = ({ integrante, onClose }) => {
  const [selectedIntegrante, setSelectedIntegrante] = useState(null);
  const [searchLiderQuery, setSearchLiderQuery] = useState("");
  const [searchLiderResults, setSearchLiderResults] = useState([]);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToaster();

  // Inicializar el estado con los datos del integrante seleccionado
  useEffect(() => {
    if (integrante) {
      setSelectedIntegrante({ ...integrante });
    }
  }, [integrante]);

  // Mutación para actualizar un registro de integrante de círculo
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateIntegranteCirculo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrantesCirculo'] });
      showSuccess('Registro actualizado exitosamente.');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating record:', error);
      showError('Error al actualizar el registro.');
    },
  });

  // Función para manejar cambios en los campos del formulario con validaciones
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    // Validaciones específicas por campo
    switch (field) {
      case 'telefono':
        if (value !== '' && (!/^\d+$/.test(value) || value.length > 10)) {
          return;
        }
        break;
      case 'codigoPostal':
        if (value !== '' && (!/^\d+$/.test(value) || value.length > 5)) {
          return;
        }
        break;
      case 'noExterior':
      case 'noInterior':
        if (value !== '' && !/^\d+$/.test(value)) {
          return;
        }
        break;
      case 'claveElector':
        if (value.length > 18) {
          return;
        }
        break;
      default:
        break;
    }

    setSelectedIntegrante({ ...selectedIntegrante, [field]: value });
  };

  // Función para buscar cabezas de círculo
  const handleSearchLider = async (e) => {
    const query = e.target.value;
    setSearchLiderQuery(query);
    
    if (query.length > 2) {
      try {
        const results = await buscarCabezasCirculo(query);
        setSearchLiderResults(results);
      } catch (error) {
        console.error("Error al buscar cabezas de círculo:", error);
      }
    } else {
      setSearchLiderResults([]);
    }
  };

  // Función para seleccionar un nuevo líder
  const handleSelectLider = (cabeza) => {
    setSelectedIntegrante({
      ...selectedIntegrante,
      lider: cabeza
    });
    setSearchLiderQuery("");
    setSearchLiderResults([]);
  };

  // Función para remover el líder
  const handleRemoveLider = () => {
    setSelectedIntegrante({
      ...selectedIntegrante,
      lider: null
    });
  };

  // Función para formatear fechas en formato YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Función para procesar y enviar la actualización del registro
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    // Formatear campos numéricos antes de enviar al backend
    const formattedIntegrante = {
      ...selectedIntegrante,
      telefono: selectedIntegrante.telefono ? Number.parseInt(selectedIntegrante.telefono) : null,
      noExterior: selectedIntegrante.noExterior ? Number.parseInt(selectedIntegrante.noExterior) : null,
      noInterior: selectedIntegrante.noInterior ? Number.parseInt(selectedIntegrante.noInterior) : null,
      codigoPostal: selectedIntegrante.codigoPostal ? Number.parseInt(selectedIntegrante.codigoPostal) : null,
      lider: selectedIntegrante.lider ? { id: selectedIntegrante.lider.id } : null
    };

    updateMutation.mutate({ id: formattedIntegrante.id, data: formattedIntegrante });
  };

  if (!selectedIntegrante) return null;

  return (
    <div className="neumorphic-modal">
      <div className="neumorphic-modal-content large-modal">
        {/* Cabecera del modal */}
        <div className="modal-header">
          <h3>Editar Registro</h3>
          <button className="close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        {/* Contenido del modal con formulario de edición */}
        <div className="modal-content-wrapper">
          <form onSubmit={handleUpdateSubmit}>
            {/* Sección: Información Personal */}
            <FormSection>
              <SectionHeading>Información Personal</SectionHeading>
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">Nombre(s)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.nombre || ''}
                    onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label">Apellido Paterno</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.apellidoPaterno || ''}
                    onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, apellidoPaterno: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label">Apellido Materno</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.apellidoMaterno || ''}
                    onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, apellidoMaterno: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={formatDate(selectedIntegrante.fechaNacimiento) || ''}
                    onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, fechaNacimiento: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.telefono || ''}
                    onChange={(e) => handleInputChange(e, 'telefono')}
                    maxLength="10"
                    required
                  />
                </div>
              </div>
            </FormSection>

            {/* Sección: Dirección */}
            <FormSection>
              <SectionHeading>Dirección</SectionHeading>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Calle</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.calle || ''}
                    onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, calle: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Colonia</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.colonia || ''}
                    onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, colonia: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">No. Exterior</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.noExterior || ''}
                    onChange={(e) => handleInputChange(e, 'noExterior')}
                    required
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label">No. Interior (opcional)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.noInterior || ''}
                    onChange={(e) => handleInputChange(e, 'noInterior')}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label">Código Postal</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.codigoPostal || ''}
                    onChange={(e) => handleInputChange(e, 'codigoPostal')}
                    maxLength="5"
                    required
                  />
                </div>
              </div>
            </FormSection>

            {/* Sección: Información Electoral */}
            <FormSection>
              <SectionHeading>Información Electoral</SectionHeading>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Clave de Elector</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedIntegrante.claveElector || ''}
                    onChange={(e) => handleInputChange(e, 'claveElector')}
                    maxLength="18"
                    required
                  />
                </div>
              </div>
            </FormSection>

            {/* Sección: Cabeza de Círculo */}
            <FormSection>
              <SectionHeading>Cabeza de Círculo</SectionHeading>
              <div className="row">
                <div className="col-md-6 mb-2" style={{ position: "relative" }}>
                  <label className="form-label">Buscar Cabeza de Círculo</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Nombre o Clave de Elector"
                    value={searchLiderQuery}
                    onChange={handleSearchLider}
                    autoComplete="off"
                  />
                  {searchLiderResults.length > 0 && (
                    <SearchResults>
                      {searchLiderResults.map((cabeza) => (
                        <SearchResultItem
                          key={cabeza.id}
                          onClick={() => handleSelectLider(cabeza)}
                        >
                          {`${cabeza.nombre} ${cabeza.apellidoPaterno} ${cabeza.apellidoMaterno} - ${cabeza.claveElector}`}
                        </SearchResultItem>
                      ))}
                    </SearchResults>
                  )}
                </div>
              </div>
              
              {selectedIntegrante.lider ? (
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Cabeza de Círculo Seleccionada</label>
                    <SelectedLiderContainer>
                      <SelectedBeneficiaryInput
                        type="text"
                        className="form-control form-control-sm"
                        value={`${selectedIntegrante.lider.nombre} ${selectedIntegrante.lider.apellidoPaterno} ${selectedIntegrante.lider.apellidoMaterno} - ${selectedIntegrante.lider.claveElector}`}
                        readOnly
                      />
                      <RemoveLiderButton
                        type="button"
                        onClick={handleRemoveLider}
                        title="Quitar selección"
                      >
                        <i className="bi bi-x"></i>
                      </RemoveLiderButton>
                    </SelectedLiderContainer>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <p className="text-muted small">Sin Cabeza de Círculo asignada</p>
                  </div>
                </div>
              )}
            </FormSection>

            {/* Botones de acción del formulario */}
            <div className="d-flex justify-content-end gap-2 mt-3 mb-2">
              <SecondaryButton type="button" onClick={onClose}>
                <i className="bi bi-x-circle me-2"></i>Cancelar
              </SecondaryButton>
              <PrimaryButton 
                type="submit" 
                disabled={updateMutation.isPending}
              >
                <i className="bi bi-floppy me-2"></i>
                {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IntegranteCirculoEdit;
