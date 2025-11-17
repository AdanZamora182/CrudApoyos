import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateCabezaCirculo } from '../../api/cabezasApi';
import { buscarMunicipioPorCP, buscarColoniasPorCP } from '../../api/direccionesApi';
import { useToaster } from '../../components/ui/ToasterProvider';
import {
  FormSection,
  SectionHeading,
  ColoniaDropdownContainer,
  ColoniaDropdown,
  ColoniaDropdownItem,
  DropdownToggleButton,
  PrimaryButton,
  SecondaryButton,
} from '../../components/forms/FormSections.styles';


const CabezaCirculoEdit = ({ cabeza, onClose }) => {
  const [selectedCabeza, setSelectedCabeza] = useState(null);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToaster();

  // Estados para el dropdown de colonias
  const [colonias, setColonias] = useState([]);
  const [showColoniaDropdown, setShowColoniaDropdown] = useState(false);

  // Inicializar el estado con los datos del cabeza seleccionado
  useEffect(() => {
    if (cabeza) {
      setSelectedCabeza({ ...cabeza });
      
      // Si ya existe un código postal de 5 dígitos, cargar las colonias
      if (cabeza.codigoPostal && String(cabeza.codigoPostal).length === 5) {
        loadColoniasByCP(String(cabeza.codigoPostal));
      }
    }
  }, [cabeza]);

  // Función auxiliar para cargar colonias sin afectar municipio
  const loadColoniasByCP = async (codigoPostal) => {
    try {
      const coloniasData = await buscarColoniasPorCP(codigoPostal);
      
      if (coloniasData && coloniasData.length > 0) {
        const sortedColonias = coloniasData.sort((a, b) => 
          a.localeCompare(b, 'es', { sensitivity: 'base' })
        );
        setColonias(sortedColonias);
      } else {
        setColonias([]);
      }
    } catch (error) {
      console.error("Error al cargar colonias iniciales:", error);
      setColonias([]);
    }
  };

  // Mutación para actualizar un registro de cabeza de círculo
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCabezaCirculo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabezasCirculo'] });
      showSuccess('Registro actualizado exitosamente.');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating record:', error);
      showError('Error al actualizar el registro.');
    },
  });

  // Función para manejar el autocompletado basado en código postal
  const handleCodigoPostalChange = async (codigoPostal) => {
    try {
      const [municipio, coloniasData] = await Promise.all([
        buscarMunicipioPorCP(codigoPostal),
        buscarColoniasPorCP(codigoPostal)
      ]);
      
      if (municipio) {
        setSelectedCabeza(prevData => ({
          ...prevData,
          municipio: municipio
        }));
      }
      
      if (coloniasData && coloniasData.length > 0) {
        const sortedColonias = coloniasData.sort((a, b) => 
          a.localeCompare(b, 'es', { sensitivity: 'base' })
        );
        setColonias(sortedColonias);
        setShowColoniaDropdown(true);
      } else {
        setColonias([]);
        setShowColoniaDropdown(false);
      }
    } catch (error) {
      console.error("Error al buscar datos por código postal:", error);
      setColonias([]);
      setShowColoniaDropdown(false);
    }
  };

  // Función para seleccionar una colonia del dropdown
  const handleColoniaSelect = (coloniaSeleccionada) => {
    setSelectedCabeza(prevData => ({
      ...prevData,
      colonia: coloniaSeleccionada
    }));
    setShowColoniaDropdown(false);
  };

  // Función para alternar la visibilidad del dropdown de colonias
  const toggleColoniaDropdown = () => {
    if (colonias.length > 0) {
      setShowColoniaDropdown(!showColoniaDropdown);
    }
  };

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
        // Autocompletar cuando el código postal esté completo
        if (value.length === 5) {
          handleCodigoPostalChange(value);
        } else {
          setSelectedCabeza(prevData => ({
            ...prevData,
            municipio: "",
            colonia: ""
          }));
          setColonias([]);
          setShowColoniaDropdown(false);
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

    setSelectedCabeza({ ...selectedCabeza, [field]: value });
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
    const formattedCabeza = {
      ...selectedCabeza,
      telefono: selectedCabeza.telefono ? Number.parseInt(selectedCabeza.telefono) : null,
      noExterior: selectedCabeza.noExterior ? Number.parseInt(selectedCabeza.noExterior) : null,
      noInterior: selectedCabeza.noInterior ? Number.parseInt(selectedCabeza.noInterior) : null,
      codigoPostal: selectedCabeza.codigoPostal ? Number.parseInt(selectedCabeza.codigoPostal) : null,
    };

    updateMutation.mutate({ id: formattedCabeza.id, data: formattedCabeza });
  };

  if (!selectedCabeza) return null;

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
                    value={selectedCabeza.nombre || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label">Apellido Paterno</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.apellidoPaterno || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, apellidoPaterno: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label">Apellido Materno</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.apellidoMaterno || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, apellidoMaterno: e.target.value })}
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
                    value={formatDate(selectedCabeza.fechaNacimiento) || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, fechaNacimiento: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.telefono || ''}
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
                    value={selectedCabeza.calle || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, calle: e.target.value })}
                    required
                  />
                </div>
                
                {/* Campo de colonia con dropdown de sugerencias */}
                <div className="col-md-6 mb-2">
                  <label className="form-label">Colonia</label>
                  <ColoniaDropdownContainer>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedCabeza.colonia || ''}
                        onChange={(e) => {
                          setSelectedCabeza({ ...selectedCabeza, colonia: e.target.value });
                          setShowColoniaDropdown(false);
                        }}
                        placeholder={colonias.length > 0 ? "Selecciona una colonia o escribe una nueva" : "Ingresa código postal primero"}
                        required
                      />
                      {colonias.length > 0 && (
                        <DropdownToggleButton
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={toggleColoniaDropdown}
                          title="Mostrar colonias disponibles"
                        >
                          <i className={`bi bi-chevron-${showColoniaDropdown ? 'up' : 'down'}`}></i>
                        </DropdownToggleButton>
                      )}
                    </div>
                    
                    {showColoniaDropdown && colonias.length > 0 && (
                      <ColoniaDropdown>
                        {colonias.map((colonia, index) => (
                          <ColoniaDropdownItem
                            key={index}
                            onClick={() => handleColoniaSelect(colonia)}
                          >
                            {colonia}
                          </ColoniaDropdownItem>
                        ))}
                      </ColoniaDropdown>
                    )}
                  </ColoniaDropdownContainer>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">No. Exterior</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.noExterior || ''}
                    onChange={(e) => handleInputChange(e, 'noExterior')}
                    required
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label">No. Interior (opcional)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.noInterior || ''}
                    onChange={(e) => handleInputChange(e, 'noInterior')}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label">Código Postal</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.codigoPostal || ''}
                    onChange={(e) => handleInputChange(e, 'codigoPostal')}
                    maxLength="5"
                    placeholder="Ingresa 5 dígitos"
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Municipio</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.municipio || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, municipio: e.target.value })}
                    placeholder="Se autocompleta con el código postal"
                  />
                </div>
              </div>
            </FormSection>

            {/* Sección: Información Electoral y Contacto */}
            <FormSection>
              <SectionHeading>Información Electoral y Contacto</SectionHeading>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Clave de Elector</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.claveElector || ''}
                    onChange={(e) => handleInputChange(e, 'claveElector')}
                    maxLength="18"
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    value={selectedCabeza.email || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Facebook (opcional)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.facebook || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, facebook: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Otra Red Social (opcional)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.otraRedSocial || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, otraRedSocial: e.target.value })}
                  />
                </div>
              </div>
            </FormSection>

            {/* Sección: Estructura */}
            <FormSection>
              <SectionHeading>Estructura</SectionHeading>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Estructura Territorial</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.estructuraTerritorial || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, estructuraTerritorial: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Posición en Estructura</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={selectedCabeza.posicionEstructura || ''}
                    onChange={(e) => setSelectedCabeza({ ...selectedCabeza, posicionEstructura: e.target.value })}
                    required
                  />
                </div>
              </div>
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

export default CabezaCirculoEdit;
