import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ApoyoForm.css";
import { createApoyo, buscarCabezasCirculo, buscarIntegrantesCirculo } from "../../api";

const ApoyoForm = ({ hideHeader = false }) => {
  const navigate = useNavigate();

  // Estado inicial del formulario con todos los campos requeridos
  const initialFormState = {
    cantidad: "",
    tipoApoyo: "",
    fechaEntrega: "",
    beneficiarioId: null, // ID del beneficiario seleccionado
    beneficiarioTipo: "", // Tipo de beneficiario: "cabeza" o "integrante"
  };

  // Estados del componente para manejo del formulario
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Campo de búsqueda de beneficiarios
  const [beneficiarios, setBeneficiarios] = useState([]); // Resultados de búsqueda
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null); // Beneficiario seleccionado
  const [hideHeaderState] = useState(hideHeader); // Control desde props

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
    "Otro",
  ];

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restricción de entrada para campos numéricos específicos
    const numericFields = ["cantidad"];
    if (numericFields.includes(name) && value !== "" && !/^\d*$/.test(value)) {
      return; // Prevenir entrada no numérica
    }

    // Actualizar el estado del formulario
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar errores cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
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
        tipoApoyo: formData.tipoApoyo === "Otro" ? formData.tipoApoyo.trim() : formData.tipoApoyo.trim(),
        fechaEntrega: formData.fechaEntrega,
        persona: formData.beneficiarioTipo === "integrante" ? { id: formData.beneficiarioId } : null, // Corresponde a "persona" para Persona_id
        cabeza: formData.beneficiarioTipo === "cabeza" ? { id: formData.beneficiarioId } : null, // Corresponde a "cabeza" para Cabeza_id
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
  };

  return (
    <div className={`container mt-3`}>
      {/* Mostrar encabezado si no está oculto */}
      {!hideHeaderState && (
        <div className="mb-4">
          <h1 className="h4 text-primary">Registro de Apoyo</h1>
        </div>
      )}

      {/* Mostrar mensajes al usuario */}
      {message.text && (
        message.text === "Por favor, complete todos los campos obligatorios." ? (
          <div className="alert alert-danger py-1 px-2 mb-2 d-inline-block" style={{ fontSize: "0.95rem", borderRadius: "8px" }}>
            <small>
              <i className="fas fa-exclamation-circle me-2" style={{ color: "#d32f2f" }}></i>
              {message.text}
            </small>
          </div>
        ) : (
          <div className={`form-message form-message-${message.type}`}>
            {message.type === "error" && (
              <i className="fas fa-exclamation-circle me-2" style={{ color: "#d32f2f" }}></i>
            )}
            {message.text}
          </div>
        )
      )}

      {/* Formulario principal */}
      <form onSubmit={handleSubmit}>
        {/* Sección: Información del Apoyo */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Información del Apoyo</h5>
          <div className="form-row">
            {/* Campo de cantidad */}
            <div className="form-col" style={{ flex: "0 0 50%" }}>
              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.cantidad ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.cantidad && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  {errors.cantidad}
                </span>
              )}
            </div>
            
            {/* Campo de tipo de apoyo con opciones predefinidas */}
            <div className="form-col" style={{ flex: "0 0 50%" }}>
              <label>Tipo de Apoyo</label>
              <select
                name="tipoApoyo"
                value={formData.tipoApoyo}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.tipoApoyo ? " is-invalid" : ""}`}
              >
                <option value="">Seleccione una opción</option>
                {predefinedOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.tipoApoyo && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  {errors.tipoApoyo}
                </span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            {/* Campo de fecha de entrega */}
            <div className="form-col" style={{ flex: "0 0 50%" }}>
              <label>Fecha de Entrega</label>
              <input
                type="date"
                name="fechaEntrega"
                value={formData.fechaEntrega}
                onChange={handleChange}
                className={errors.fechaEntrega ? "input-error" : ""}
                autoComplete="off"
              />
              {errors.fechaEntrega && (
                <span className="error-text">
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.fechaEntrega}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sección: Asociar Beneficiario */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Asociar Beneficiario</h5>
          <div className="beneficiary-container">
            <div className="form-row">
              <div className="form-col" style={{ position: "relative", flex: "0 0 50%" }}>
                <label>Buscar Beneficiario</label>
                <input
                  type="text"
                  placeholder="Nombre o Clave de Elector"
                  value={searchQuery}
                  onChange={handleSearchBeneficiarios}
                  autoComplete="off"
                />
                {/* Lista de resultados de búsqueda */}
                {beneficiarios.length > 0 && (
                  <ul className="search-results">
                    {beneficiarios.map((beneficiario) => (
                      <li
                        key={`${beneficiario.tipo}-${beneficiario.id}`}
                        onClick={() => handleSelectBeneficiario(beneficiario)}
                        className="search-result-item"
                      >
                        {`${beneficiario.nombre} ${beneficiario.apellidoPaterno} ${beneficiario.apellidoMaterno} - ${beneficiario.claveElector} (${beneficiario.tipo === "cabeza" ? "Cabeza de Círculo" : "Integrante de Círculo"})`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Contenedor para el beneficiario seleccionado */}
            <div className="selected-beneficiary-container">
              {selectedBeneficiario ? (
                <div className="form-row">
                  <div className="form-col" style={{ flex: "0 0 50%" }}>
                    <label>Beneficiario Seleccionado</label>
                    <div className="selected-beneficiary-wrapper">
                      <input
                        type="text"
                        value={`${selectedBeneficiario.nombre} ${selectedBeneficiario.apellidoPaterno} ${selectedBeneficiario.apellidoMaterno} - ${selectedBeneficiario.claveElector}`}
                        readOnly
                        className="selected-beneficiary"
                      />
                      <button
                        type="button"
                        className="remove-beneficiary-btn"
                        onClick={handleRemoveBeneficiario}
                        title="Quitar selección"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-beneficiary-placeholder">
                </div>
              )}
            </div>

            {/* Mostrar error si no se ha seleccionado beneficiario */}
            {errors.beneficiarioId && (
              <span className="error-text">
                <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                {errors.beneficiarioId}
              </span>
            )}
          </div>
        </div>

        {/* Botones de acción del formulario */}
        <div className="form-actions">
          <button type="button" className="form-button form-button-secondary" onClick={handleReset}>
            Limpiar
          </button>
          <button type="submit" className="form-button form-button-primary" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApoyoForm;