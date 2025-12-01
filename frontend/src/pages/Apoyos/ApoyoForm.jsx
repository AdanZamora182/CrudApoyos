import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createApoyo, buscarCabezasCirculo, buscarIntegrantesCirculo } from "../../api";
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
  RemoveBeneficiaryButton,
  EmptyBeneficiaryPlaceholder,
  ErrorText,
  ButtonContainer,
  PrimaryButton,
  SecondaryButton,
  CompactAlert
} from '../../components/forms/FormSections.styles';

const ApoyoForm = ({ hideHeader = false }) => {
  const navigate = useNavigate();

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
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null);
  const [hideHeaderState] = useState(hideHeader);

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

  // Función para buscar beneficiarios (cabezas e integrantes de círculo)
  const handleSearchBeneficiarios = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      try {
        // Buscar en ambas tablas en paralelo
        const [cabezas, integrantes] = await Promise.all([
          buscarCabezasCirculo(query),
          buscarIntegrantesCirculo(query),
        ]);
        
        // Combinar resultados y marcar el tipo
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

  // Función para seleccionar un beneficiario de la lista de búsqueda
  const handleSelectBeneficiario = (beneficiario) => {
    setSelectedBeneficiario(beneficiario);
    setFormData({
      ...formData,
      beneficiarioId: beneficiario.id, // Establecer correctamente el ID del beneficiario seleccionado
      beneficiarioTipo: beneficiario.tipo, // Establecer correctamente el tipo del beneficiario seleccionado
    });
    setSearchQuery(""); // Limpiar la consulta de búsqueda después de la selección
    setBeneficiarios([]);
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
      setMessage({
        type: "error",
        text: "Por favor, complete todos los campos obligatorios.",
      });
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 7000);
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Preparar datos para enviar al backend
      const apoyoData = {
        cantidad: formData.cantidad ? parseInt(formData.cantidad, 10) : null,
        tipoApoyo: formData.tipoApoyo.trim(), // Ya no necesita validación de "Otro"
        fechaEntrega: formData.fechaEntrega,
        persona: formData.beneficiarioTipo === "integrante" ? { id: formData.beneficiarioId } : null,
        cabeza: formData.beneficiarioTipo === "cabeza" ? { id: formData.beneficiarioId } : null,
      };

      console.log("Datos enviados al backend:", apoyoData);

      // Enviar datos al backend
      await createApoyo(apoyoData);

      // Mostrar mensaje de éxito
      setMessage({
        type: "success",
        text: "Apoyo registrado exitosamente.",
      });

      // Limpiar formulario después del éxito
      setFormData(initialFormState);
      setErrors({});
      setSelectedBeneficiario(null);
      setSearchQuery("");

      // Limpiar mensaje de éxito después de 8 segundos
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 8000);
    } catch (error) {
      console.error("Error al registrar apoyo:", error);
      
      // Manejar errores del backend
      const backendErrorMessage = error.response?.data?.message || "Error al registrar apoyo. Verifique los datos e inténtelo de nuevo.";
      setMessage({
        type: "error",
        text: backendErrorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar el formulario
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setMessage({ type: "", text: "" });
    setSelectedBeneficiario(null);
    setSearchQuery("");
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

      {/* Mostrar mensajes al usuario */}
      {message.text && (
        message.text === "Por favor, complete todos los campos obligatorios." ? (
          <CompactAlert>
            <small>
              <i className="fas fa-exclamation-circle me-2 alert-icon"></i>
              {message.text}
            </small>
          </CompactAlert>
        ) : (
          <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-3`}>
            {message.text}
          </div>
        )
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
                  {beneficiarios.length > 0 && (
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
                      <SelectedBeneficiaryInput
                        type="text"
                        className="form-control form-control-sm"
                        value={`${selectedBeneficiario.nombre} ${selectedBeneficiario.apellidoPaterno} ${selectedBeneficiario.apellidoMaterno} - ${selectedBeneficiario.claveElector}`}
                        readOnly
                      />
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
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </PrimaryButton>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default ApoyoForm;