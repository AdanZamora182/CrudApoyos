import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateApoyo, buscarCabezasCirculo, buscarIntegrantesCirculo } from '../../api';
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
  BeneficiaryContainer,
  EmptyBeneficiaryPlaceholder,
  MobileBeneficiaryContainer,
  BeneficiaryName,
  BeneficiaryClaveElector,
  BeneficiaryType,
  ResponsiveBeneficiaryWrapper,
  ColoniaDropdownContainer,
  ColoniaDropdown,
  ColoniaDropdownItem,
  DropdownToggleButton,
} from '../../components/forms/FormSections.styles';

const ApoyoEdit = ({ apoyo, onClose }) => {
  const [selectedApoyo, setSelectedApoyo] = useState(null);
  const [searchBeneficiarioQuery, setSearchBeneficiarioQuery] = useState("");
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [selectedNewBeneficiario, setSelectedNewBeneficiario] = useState(null);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToaster();

  // Estado para el dropdown de tipos de apoyo
  const [showTipoApoyoDropdown, setShowTipoApoyoDropdown] = useState(false);

  // Opciones predefinidas de tipos de apoyo
  const predefinedOptions = [
    "Tinaco",
    "Silla de ruedas",
    "Calentador Solar",
    "Muletas",
    "Bastón",
    "Jitomate",
    "Pepino",
    "Juguete",
    "Despensa",
    "Oxímetro",
    "Baumanómetro",
    "Frijol",
    "Ropa",
    "Calzado",
  ];

  // Inicializar el estado con los datos del apoyo seleccionado
  useEffect(() => {
    if (apoyo) {
      setSelectedApoyo({ ...apoyo });
      setSelectedNewBeneficiario(null);
      setSearchBeneficiarioQuery("");
      setBeneficiarios([]);
      setShowTipoApoyoDropdown(false);
    }
  }, [apoyo]);

  // Mutación para actualizar un registro de apoyo (MOVIDA DESDE ApoyoCrud.jsx)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateApoyo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apoyos'] });
      showSuccess('Apoyo actualizado exitosamente.');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating apoyo:', error);
      showError('Error al actualizar el apoyo.');
    },
  });

  // Función para manejar cambios en los campos del formulario con validaciones
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    // Validaciones específicas por campo
    switch (field) {
      case 'cantidad':
        if (value !== '' && !/^\d+$/.test(value)) {
          return;
        }
        break;
      default:
        break;
    }

    setSelectedApoyo({ ...selectedApoyo, [field]: value });
  };

  // Función para buscar beneficiarios (MOVIDA DESDE ApoyoCrud.jsx)
  const handleSearchBeneficiarios = async (e) => {
    const query = e.target.value;
    setSearchBeneficiarioQuery(query);
    
    if (query.length > 2) {
      try {
        const [cabezas, integrantes] = await Promise.all([
          buscarCabezasCirculo(query),
          buscarIntegrantesCirculo(query),
        ]);
        setBeneficiarios([
          ...cabezas.map((cabeza) => ({ ...cabeza, tipo: "cabeza" })),
          ...integrantes.map((integrante) => ({ ...integrante, tipo: "integrante" })),
        ]);
      } catch (error) {
        console.error("Error al buscar beneficiarios:", error);
      }
    } else {
      setBeneficiarios([]);
    }
  };

  // Función para seleccionar un nuevo beneficiario (MOVIDA DESDE ApoyoCrud.jsx)
  const handleSelectNewBeneficiario = (beneficiario) => {
    setSelectedNewBeneficiario(beneficiario);
    setSearchBeneficiarioQuery("");
    setBeneficiarios([]);
  };

  // Función para formatear fechas en formato YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Función para procesar y enviar la actualización del registro (MOVIDA DESDE ApoyoCrud.jsx)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    // Crear una copia del apoyo a actualizar
    const apoyoToUpdate = { ...selectedApoyo };
    
    // Si se seleccionó un nuevo beneficiario, actualizar los datos
    if (selectedNewBeneficiario) {
      apoyoToUpdate.persona = null;
      apoyoToUpdate.cabeza = null;
      
      if (selectedNewBeneficiario.tipo === "integrante") {
        apoyoToUpdate.persona = { id: selectedNewBeneficiario.id };
      } else if (selectedNewBeneficiario.tipo === "cabeza") {
        apoyoToUpdate.cabeza = { id: selectedNewBeneficiario.id };
      }
    }

    // Manejar tipo de apoyo personalizado si "Otro" está seleccionado
    if (apoyoToUpdate.tipoApoyo === "Otro" && apoyoToUpdate.tipoApoyoCustom) {
      apoyoToUpdate.tipoApoyo = apoyoToUpdate.tipoApoyoCustom.trim();
      delete apoyoToUpdate.tipoApoyoCustom;
    }

    // Asegurar que cantidad sea un número
    if (apoyoToUpdate.cantidad) {
      apoyoToUpdate.cantidad = parseInt(apoyoToUpdate.cantidad, 10);
    }

    updateMutation.mutate({ id: apoyoToUpdate.id, data: apoyoToUpdate });
  };

  // Función para formatear el nombre completo del beneficiario para móviles
  const formatBeneficiarioDisplay = (beneficiario, tipo) => {
    const nombreCompleto = `${beneficiario.nombre} ${beneficiario.apellidoPaterno} ${beneficiario.apellidoMaterno}`;
    const claveElector = beneficiario.claveElector;
    const tipoBeneficiario = tipo === "cabeza" ? "Cabeza de Círculo" : "Integrante de Círculo";
    
    // Para desktop: formato en una línea
    const desktopFormat = `${nombreCompleto} - ${claveElector} (${tipoBeneficiario})`;
    
    // Para móvil: formato en dos líneas (simulado con salto)
    const mobileFormat = `${nombreCompleto} - ${claveElector}\n(${tipoBeneficiario})`;
    
    return { desktopFormat, mobileFormat };
  };

  // Función para seleccionar un tipo de apoyo del dropdown
  const handleTipoApoyoSelect = (tipoSeleccionado) => {
    setSelectedApoyo(prevData => ({
      ...prevData,
      tipoApoyo: tipoSeleccionado
    }));
    setShowTipoApoyoDropdown(false);
  };

  // Función para alternar la visibilidad del dropdown de tipos de apoyo
  const toggleTipoApoyoDropdown = () => {
    setShowTipoApoyoDropdown(!showTipoApoyoDropdown);
  };

  if (!selectedApoyo) return null;

  return (
    <div className="neumorphic-modal">
      <div className="neumorphic-modal-content large-modal">
        {/* Cabecera del modal */}
        <div className="modal-header">
          <h3>Editar Apoyo</h3>
          <button className="close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        {/* Contenido del modal con formulario de edición */}
        <div className="modal-content-wrapper">
          <form onSubmit={handleUpdateSubmit}>
            {/* Sección: Información del Apoyo */}
            <FormSection>
              <SectionHeading>Información del Apoyo</SectionHeading>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={selectedApoyo.cantidad || ''}
                    onChange={(e) => setSelectedApoyo({ ...selectedApoyo, cantidad: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Tipo de Apoyo</label>
                  <ColoniaDropdownContainer>
                    <div className="input-group">
                      <input
                        type="text"
                        name="tipoApoyo"
                        value={selectedApoyo.tipoApoyo || ''}
                        onChange={(e) => {
                          setSelectedApoyo({ ...selectedApoyo, tipoApoyo: e.target.value });
                          setShowTipoApoyoDropdown(false);
                        }}
                        className="form-control form-control-sm"
                        autoComplete="off"
                        placeholder="Selecciona un tipo o escribe uno nuevo"
                        required
                      />
                      <DropdownToggleButton
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={toggleTipoApoyoDropdown}
                        title="Mostrar tipos de apoyo disponibles"
                      >
                        <i className={`bi bi-chevron-${showTipoApoyoDropdown ? 'up' : 'down'}`}></i>
                      </DropdownToggleButton>
                    </div>
                    
                    {showTipoApoyoDropdown && predefinedOptions.length > 0 && (
                      <ColoniaDropdown>
                        {predefinedOptions.map((tipo, index) => (
                          <ColoniaDropdownItem
                            key={index}
                            onClick={() => handleTipoApoyoSelect(tipo)}
                          >
                            {tipo}
                          </ColoniaDropdownItem>
                        ))}
                      </ColoniaDropdown>
                    )}
                  </ColoniaDropdownContainer>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Fecha de Entrega</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={formatDate(selectedApoyo.fechaEntrega) || ''}
                    onChange={(e) => setSelectedApoyo({ ...selectedApoyo, fechaEntrega: e.target.value })}
                    required
                  />
                </div>
              </div>
            </FormSection>
            
            {/* Sección: Beneficiario */}
            <FormSection>
              <SectionHeading>Beneficiario</SectionHeading>
              <BeneficiaryContainer>
                <div className="row">
                  <div className="col-12 col-md-10 col-lg-8 mb-2">
                    <label className="form-label">Buscar Nuevo Beneficiario</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nombre o Clave de Elector"
                        value={searchBeneficiarioQuery}
                        onChange={handleSearchBeneficiarios}
                        autoComplete="off"
                      />
                      {beneficiarios.length > 0 && (
                        <SearchResults>
                          {beneficiarios.map((beneficiario) => (
                            <SearchResultItem
                              key={`${beneficiario.tipo}-${beneficiario.id}`}
                              onClick={() => handleSelectNewBeneficiario(beneficiario)}
                            >
                              <div className="d-flex flex-column">
                                <span className="fw-medium">
                                  {`${beneficiario.nombre} ${beneficiario.apellidoPaterno} ${beneficiario.apellidoMaterno}`}
                                </span>
                                <small className="text-muted">
                                  {`${beneficiario.claveElector} • ${beneficiario.tipo === "cabeza" ? "Cabeza de Círculo" : "Integrante de Círculo"}`}
                                </small>
                              </div>
                            </SearchResultItem>
                          ))}
                        </SearchResults>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Mostrar beneficiario actual o nuevo seleccionado */}
                {(selectedNewBeneficiario || selectedApoyo.persona || selectedApoyo.cabeza) ? (
                  <div className="row">
                    <div className="col-12 col-md-10 col-lg-8 mb-2">
                      <label className="form-label">
                        {selectedNewBeneficiario ? 'Nuevo Beneficiario Seleccionado' : 'Beneficiario Actual'}
                      </label>
                      <SelectedLiderContainer>
                        <ResponsiveBeneficiaryWrapper>
                          {/* Vista para desktop */}
                          <div className="desktop-view">
                            <SelectedBeneficiaryInput
                              type="text"
                              className="form-control form-control-sm"
                              value={
                                selectedNewBeneficiario
                                  ? formatBeneficiarioDisplay(selectedNewBeneficiario, selectedNewBeneficiario.tipo).desktopFormat
                                  : selectedApoyo.persona
                                    ? formatBeneficiarioDisplay(selectedApoyo.persona, "integrante").desktopFormat
                                    : formatBeneficiarioDisplay(selectedApoyo.cabeza, "cabeza").desktopFormat
                              }
                              readOnly
                            />
                          </div>
                          
                          {/* Vista para móvil */}
                          <div className="mobile-view">
                            <MobileBeneficiaryContainer className="form-control form-control-sm">
                              {selectedNewBeneficiario ? (
                                <>
                                  <BeneficiaryName>
                                    {`${selectedNewBeneficiario.nombre} ${selectedNewBeneficiario.apellidoPaterno} ${selectedNewBeneficiario.apellidoMaterno}`}
                                  </BeneficiaryName>
                                  <BeneficiaryClaveElector>
                                    {selectedNewBeneficiario.claveElector}
                                  </BeneficiaryClaveElector>
                                  <BeneficiaryType>
                                    ({selectedNewBeneficiario.tipo === "cabeza" ? "Cabeza de Círculo" : "Integrante de Círculo"})
                                  </BeneficiaryType>
                                </>
                              ) : selectedApoyo.persona ? (
                                <>
                                  <BeneficiaryName>
                                    {`${selectedApoyo.persona.nombre} ${selectedApoyo.persona.apellidoPaterno} ${selectedApoyo.persona.apellidoMaterno}`}
                                  </BeneficiaryName>
                                  <BeneficiaryClaveElector>
                                    {selectedApoyo.persona.claveElector}
                                  </BeneficiaryClaveElector>
                                  <BeneficiaryType>
                                    (Integrante de Círculo)
                                  </BeneficiaryType>
                                </>
                              ) : (
                                <>
                                  <BeneficiaryName>
                                    {`${selectedApoyo.cabeza.nombre} ${selectedApoyo.cabeza.apellidoPaterno} ${selectedApoyo.cabeza.apellidoMaterno}`}
                                  </BeneficiaryName>
                                  <BeneficiaryClaveElector>
                                    {selectedApoyo.cabeza.claveElector}
                                  </BeneficiaryClaveElector>
                                  <BeneficiaryType>
                                    (Cabeza de Círculo)
                                  </BeneficiaryType>
                                </>
                              )}
                            </MobileBeneficiaryContainer>
                          </div>
                          
                          {selectedNewBeneficiario && (
                            <RemoveLiderButton
                              type="button"
                              onClick={() => setSelectedNewBeneficiario(null)}
                              title="Quitar selección"
                              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                            >
                              <i className="bi bi-x"></i>
                            </RemoveLiderButton>
                          )}
                        </ResponsiveBeneficiaryWrapper>
                      </SelectedLiderContainer>
                    </div>
                  </div>
                ) : (
                  <EmptyBeneficiaryPlaceholder />
                )}
              </BeneficiaryContainer>
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

export default ApoyoEdit;
