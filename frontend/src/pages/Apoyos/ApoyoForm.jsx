import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApoyo, buscarCabezasCirculo, buscarIntegrantesCirculo } from "../../api";
import { useToaster } from "../../components/ui/ToasterProvider";
import {
  FormGlobalStyles,
  FormContainer,
  FormSection,
  SectionHeading,
  ColoniaDropdown,
  ColoniaDropdownItem,
  DropdownToggleButton,
  BeneficiaryContainer,
  SearchResults,
  SearchResultItem,
  SelectedBeneficiaryContainer,
  SelectedBeneficiaryWrapper,
  SelectedBeneficiaryInput,
  BeneficiaryName,
  BeneficiaryClaveElector,
  BeneficiaryType,
  RemoveBeneficiaryButton,
  EmptyBeneficiaryPlaceholder,
  ErrorText,
  ButtonContainer,
  PrimaryButton,
  SecondaryButton
} from '../../components/forms/FormSections.styles';

const ApoyoForm = ({ hideHeader = false }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToaster();
  const queryClient = useQueryClient();

  // Mutación para crear un apoyo
  const createMutation = useMutation({
    mutationFn: createApoyo,
    onSuccess: () => {
      // Invalidar el cache de apoyos para refrescar la tabla CRUD
      queryClient.invalidateQueries({ queryKey: ["apoyos"] });
      showSuccess("Apoyo registrado exitosamente.");
      // Limpiar formulario después del éxito
      setFormData(initialFormState);
      setErrors({});
      setSelectedBeneficiario(null);
      setSearchQuery("");
      setShowTipoApoyoDropdown(false);
    },
    onError: (error) => {
      console.error("Error al registrar apoyo:", error);
      // Manejar errores del backend
      const backendErrorMessage = error.response?.data?.message || "Error al registrar apoyo. Verifique los datos e inténtelo de nuevo.";
      showError(backendErrorMessage);
    },
  });

  // Estado inicial del formulario con todos los campos requeridos
  const initialFormState = {
    cantidad: "",
    tipoApoyo: "",
    fechaEntrega: "",
    beneficiarioId: null,
    beneficiarioTipo: "",
  };

  // Estados del componente para manejo del formulario
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null);
  const [hideHeaderState] = useState(hideHeader);

  // Debounce para la búsqueda (300ms)
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Query para buscar beneficiarios con caché
  const { data: beneficiarios = [], isFetching: isSearching } = useQuery({
    queryKey: ['beneficiarios', 'search', debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.length <= 2) return [];
      
      // Buscar en ambas tablas en paralelo
      const [cabezas, integrantes] = await Promise.all([
        buscarCabezasCirculo(debouncedQuery),
        buscarIntegrantesCirculo(debouncedQuery),
      ]);
      
      // Combinar resultados y marcar el tipo
      return [
        ...cabezas.map((cabeza) => ({ ...cabeza, tipo: "cabeza" })),
        ...integrantes.map((integrante) => ({ ...integrante, tipo: "integrante" })),
      ];
    },
    enabled: debouncedQuery.length > 2, // Solo buscar si hay más de 2 caracteres
    staleTime: 2 * 60 * 1000, // 2 minutos de caché
    gcTime: 5 * 60 * 1000, // 5 minutos en memoria
  });

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

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ["cantidad"];
    if (numericFields.includes(name) && value !== "" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }

    if (name === "tipoApoyo") {
      setShowTipoApoyoDropdown(false);
    }
  };

  // Función para seleccionar un tipo de apoyo del dropdown
  const handleTipoApoyoSelect = (tipoSeleccionado) => {
    setFormData(prevData => ({
      ...prevData,
      tipoApoyo: tipoSeleccionado
    }));
    setShowTipoApoyoDropdown(false);
    
    // Limpiar error del campo tipoApoyo si existe
    if (errors.tipoApoyo) {
      setErrors(prevErrors => ({
        ...prevErrors,
        tipoApoyo: null
      }));
    }
  };

  // Función para alternar la visibilidad del dropdown de tipos de apoyo
  const toggleTipoApoyoDropdown = () => {
    setShowTipoApoyoDropdown(!showTipoApoyoDropdown);
  };

  // Función para validar un campo específico
  const validateField = (name, value) => {
    let error = "";
    const mandatoryFields = ["fechaEntrega", "tipoApoyo", "cantidad"];

    if (mandatoryFields.includes(name) && !value) {
      error = "Este campo es obligatorio.";
    }
    return error;
  };

  // Función para validar todo el formulario
  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    
    // Validar cada campo del formulario
    Object.keys(initialFormState).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        formIsValid = false;
        newErrors[field] = error;
      }
    });
    
    // Validar que se haya seleccionado un beneficiario
    if (!selectedBeneficiario) {
      formIsValid = false;
      newErrors.beneficiarioId = "Debe seleccionar un beneficiario.";
    }
    
    setErrors(newErrors);
    return formIsValid;
  };

  // Función para manejar cambios en el campo de búsqueda
  const handleSearchBeneficiarios = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Función para seleccionar un beneficiario de la lista de búsqueda
  const handleSelectBeneficiario = (beneficiario) => {
    setSelectedBeneficiario(beneficiario);
    setFormData({
      ...formData,
      beneficiarioId: beneficiario.id,
      beneficiarioTipo: beneficiario.tipo,
    });
    setSearchQuery(""); // Limpiar la consulta de búsqueda después de la selección
    setDebouncedQuery(""); // Limpiar también el debounced para ocultar el dropdown
    
    // Limpiar error del campo beneficiario si existe
    if (errors.beneficiarioId) {
      setErrors(prevErrors => ({
        ...prevErrors,
        beneficiarioId: null
      }));
    }
  };

  // Función para remover el beneficiario seleccionado
  const handleRemoveBeneficiario = () => {
    setSelectedBeneficiario(null);
    setFormData({
      ...formData,
      beneficiarioId: null,
      beneficiarioTipo: ""
    });
  };

  // Función para procesar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!validateForm()) {
      showWarning("Por favor, complete todos los campos obligatorios.");
      return;
    }

    // Preparar datos para enviar al backend
    const apoyoData = {
      cantidad: formData.cantidad ? parseInt(formData.cantidad, 10) : null,
      tipoApoyo: formData.tipoApoyo.trim(), // Ya no necesita validación de "Otro"
      fechaEntrega: formData.fechaEntrega,
      persona: formData.beneficiarioTipo === "integrante" ? { id: formData.beneficiarioId } : null,
      cabeza: formData.beneficiarioTipo === "cabeza" ? { id: formData.beneficiarioId } : null,
    };

    console.log("Datos enviados al backend:", apoyoData);

    // Enviar datos usando la mutación de react-query
    createMutation.mutate(apoyoData);
  };

  // Función para limpiar el formulario
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setSelectedBeneficiario(null);
    setSearchQuery("");
    setDebouncedQuery(""); // Limpiar el debounced para cerrar el dropdown
    setShowTipoApoyoDropdown(false);
  };

  return (
    <FormContainer className={`container mt-3`}>
      {/* Estilos globales para el formulario */}
      <FormGlobalStyles />
      
      {/* Mostrar encabezado si no está oculto */}
      {!hideHeaderState && (
        <div className="mb-4">
          <h1 className="h4 text-primary">Registro de Apoyo</h1>
        </div>
      )}

      {/* Formulario principal */}
      <form onSubmit={handleSubmit}>
        {/* Sección: Información del Apoyo */}
        <FormSection>
          <SectionHeading>Información del Apoyo</SectionHeading>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.cantidad ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}
            </div>
            
            <div className="col-md-6 mb-2">
              <label className="form-label">Tipo de Apoyo</label>
              <div style={{ position: "relative" }}>
                <div className="input-group">
                  <input
                    type="text"
                    name="tipoApoyo"
                    value={formData.tipoApoyo}
                    onChange={handleChange}
                    className={`form-control form-control-sm${errors.tipoApoyo ? " is-invalid" : ""}`}
                    autoComplete="off"
                    placeholder="Selecciona un tipo o escribe uno nuevo"
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
                {errors.tipoApoyo && <div className="invalid-feedback d-block">{errors.tipoApoyo}</div>}
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Fecha de Entrega</label>
              <input
                type="date"
                name="fechaEntrega"
                value={formData.fechaEntrega}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.fechaEntrega ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.fechaEntrega && <div className="invalid-feedback">{errors.fechaEntrega}</div>}
            </div>
          </div>
        </FormSection>

        {/* Sección: Asociar Beneficiario */}
        <FormSection>
          <SectionHeading>Asociar Beneficiario</SectionHeading>
          <BeneficiaryContainer>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Buscar Beneficiario</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Nombre o Clave de Elector"
                    value={searchQuery}
                    onChange={handleSearchBeneficiarios}
                    autoComplete="off"
                  />
                  {isSearching && searchQuery.length > 2 && (
                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <span className="spinner-border spinner-border-sm text-primary" role="status" />
                    </div>
                  )}
                  {beneficiarios.length > 0 && debouncedQuery.length > 2 && (
                    <SearchResults>
                      {beneficiarios.map((beneficiario) => (
                        <SearchResultItem
                          key={`${beneficiario.tipo}-${beneficiario.id}`}
                          onClick={() => handleSelectBeneficiario(beneficiario)}
                        >
                          {`${beneficiario.nombre} ${beneficiario.apellidoPaterno} ${beneficiario.apellidoMaterno} - ${beneficiario.claveElector} (${beneficiario.tipo === "cabeza" ? "Cabeza de Círculo" : "Integrante de Círculo"})`}
                        </SearchResultItem>
                      ))}
                    </SearchResults>
                  )}
                </div>
              </div>
            </div>

            <SelectedBeneficiaryContainer>
              {selectedBeneficiario ? (
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Beneficiario Seleccionado</label>
                    <SelectedBeneficiaryWrapper>
                      <SelectedBeneficiaryInput>
                        <BeneficiaryName>
                          {`${selectedBeneficiario.nombre} ${selectedBeneficiario.apellidoPaterno} ${selectedBeneficiario.apellidoMaterno}`}
                        </BeneficiaryName>
                        <BeneficiaryClaveElector>
                          {selectedBeneficiario.claveElector}
                        </BeneficiaryClaveElector>
                        <BeneficiaryType $tipo={selectedBeneficiario.tipo}>
                          {selectedBeneficiario.tipo === 'cabeza' ? 'Cabeza de Círculo' : 'Integrante de Círculo'}
                        </BeneficiaryType>
                      </SelectedBeneficiaryInput>
                      <RemoveBeneficiaryButton
                        type="button"
                        onClick={handleRemoveBeneficiario}
                        title="Quitar selección"
                      >
                        <i className="bi bi-x"></i>
                      </RemoveBeneficiaryButton>
                    </SelectedBeneficiaryWrapper>
                  </div>
                </div>
              ) : (
                <EmptyBeneficiaryPlaceholder />
              )}
            </SelectedBeneficiaryContainer>

            {errors.beneficiarioId && (
              <ErrorText>
                <i className="fa fa-exclamation-circle"></i>
                {errors.beneficiarioId}
              </ErrorText>
            )}
          </BeneficiaryContainer>
        </FormSection>

        {/* Botones de acción del formulario */}
        <ButtonContainer>
          <SecondaryButton type="button" onClick={handleReset}>
            Limpiar
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Registrando..." : "Registrar"}
          </PrimaryButton>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default ApoyoForm;