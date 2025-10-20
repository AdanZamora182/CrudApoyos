import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IntegranteCirculo.css";
import { createIntegranteCirculo, buscarCabezasCirculo, buscarMunicipioPorCP, buscarColoniasPorCP } from "../../api";

const IntegranteCirculoForm = ({ hideHeader = false }) => {
  const navigate = useNavigate();
  
  // Estado inicial del formulario con todos los campos requeridos
  const initialFormState = {
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    calle: "",
    noExterior: "",
    noInterior: "",
    colonia: "",
    codigoPostal: "",
    municipio: "",
    claveElector: "",
    telefono: "",
    lider: "",
  };

  // Estados del componente para manejo del formulario
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [cabezasCirculo, setCabezasCirculo] = useState([]);
  const [selectedLider, setSelectedLider] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideHeaderState, setHideHeader] = useState(hideHeader);

  // Estados para el dropdown de colonias
  const [colonias, setColonias] = useState([]);
  const [showColoniaDropdown, setShowColoniaDropdown] = useState(false);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restricción de entrada para campos numéricos específicos
    const numericFields = ["telefono", "noExterior", "noInterior", "codigoPostal"];
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

    // Manejar cambios en el código postal para autocompletado
    if (name === "codigoPostal") {
      if (value.length === 5) {
        // Autocompletar municipio y obtener colonias cuando el código postal esté completo
        handleCodigoPostalChange(value);
      } else {
        // Limpiar municipio y colonias cuando el código postal esté incompleto
        setFormData(prevData => ({
          ...prevData,
          codigoPostal: value,
          municipio: "",
          colonia: ""
        }));
        setColonias([]);
        setShowColoniaDropdown(false);
      }
    }
    
    // Ocultar dropdown de colonias al seleccionar una
    if (name === "colonia") {
      setShowColoniaDropdown(false);
    }
  };

  // Función para manejar el autocompletado basado en código postal
  const handleCodigoPostalChange = async (codigoPostal) => {
    try {
      // Buscar tanto municipio como colonias en paralelo
      const [municipio, coloniasData] = await Promise.all([
        buscarMunicipioPorCP(codigoPostal),
        buscarColoniasPorCP(codigoPostal)
      ]);
      
      // Actualizar municipio si se encuentra
      if (municipio) {
        setFormData(prevData => ({
          ...prevData,
          municipio: municipio,
          colonia: "" // Limpiar colonia cuando cambia el código postal
        }));
      }
      
      // Actualizar lista de colonias si se encuentran
      if (coloniasData && coloniasData.length > 0) {
        // Ordenar colonias alfabéticamente
        const sortedColonias = coloniasData.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
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
    setFormData(prevData => ({
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

  // Función para validar un campo específico
  const validateField = (name, value) => {
    let error = "";
    const trimmedValue = value !== null && value !== undefined ? String(value).trim() : "";

    // Campos que son opcionales
    const optionalFields = ["noInterior", "lider"];

    // Verificar campos obligatorios
    if (!optionalFields.includes(name) && trimmedValue === "") {
      error = "Este campo es obligatorio.";
      return error;
    }

    // Validaciones específicas por tipo de campo
    switch (name) {
      case "telefono":
      case "noExterior":
      case "codigoPostal":
        if (trimmedValue !== "" && isNaN(Number(trimmedValue))) {
          error = "Debe ser un número válido.";
        } else if (trimmedValue !== "" && !/^\d+$/.test(trimmedValue)) {
          error = "Solo se admiten números.";
        }
        break;
      default:
        break;
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
    
    setErrors(newErrors);
    return formIsValid;
  };

  // Función para buscar cabezas de círculo disponibles
  const handleSearchCabezas = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      try {
        const results = await buscarCabezasCirculo(query);
        setCabezasCirculo(results);
      } catch (error) {
        console.error("Error al buscar cabezas de círculo:", error);
      }
    } else {
      setCabezasCirculo([]);
    }
  };

  // Función para seleccionar un líder de la lista de búsqueda
  const handleSelectLider = (cabeza) => {
    setSelectedLider(cabeza);
    setFormData({ ...formData, lider: cabeza.id });
    setSearchQuery("");
    setCabezasCirculo([]);
  };

  // Función para remover el líder seleccionado
  const handleRemoveLider = () => {
    setSelectedLider(null);
    setFormData({ ...formData, lider: "" });
  };

  // Función para procesar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Por favor, complete correctamente todos los campos obligatorios.",
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
      const integranteData = {
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        fechaNacimiento: formData.fechaNacimiento,
        calle: formData.calle,
        noExterior: formData.noExterior ? parseInt(formData.noExterior, 10) : null,
        noInterior: formData.noInterior ? parseInt(formData.noInterior, 10) : null,
        colonia: formData.colonia,
        codigoPostal: formData.codigoPostal ? parseInt(formData.codigoPostal, 10) : null,
        municipio: formData.municipio,
        claveElector: formData.claveElector,
        telefono: parseInt(formData.telefono, 10),
        lider: formData.lider ? { id: parseInt(formData.lider, 10) } : null,
      };
      
      console.log("Datos a enviar al backend:", integranteData);

      // Enviar datos al backend
      await createIntegranteCirculo(integranteData);

      // Mostrar mensaje de éxito
      setMessage({
        type: "success",
        text: "Integrante de círculo registrado exitosamente.",
      });

      // Limpiar formulario después del éxito
      setFormData(initialFormState);
      setErrors({});
      setSelectedLider(null);

      // Limpiar mensaje de éxito después de 8 segundos
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 8000);
    } catch (error) {
      console.error("Error al registrar integrante de círculo:", error);
      
      // Manejar errores del backend
      const backendErrorMessage = error.response?.data?.message || "Error al registrar integrante de círculo. Verifique los datos e inténtelo de nuevo.";
      const displayMessage = Array.isArray(backendErrorMessage) ? backendErrorMessage.join(', ') : backendErrorMessage;
      
      setMessage({
        type: "error",
        text: displayMessage,
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
    setSelectedLider(null);
    setSearchQuery("");
    setCabezasCirculo([]);
    setColonias([]);
    setShowColoniaDropdown(false);
  };

  return (
    <div className={`container mt-3 mb-4`}>
      {/* Mostrar encabezado si no está oculto */}
      {!hideHeaderState && (
        <div className="mb-4">
          <h1 className="h4 text-primary">Registro de Integrante de Círculo</h1>
        </div>
      )}

      {/* Mostrar mensajes al usuario */}
      {message.text && (
        message.text === "Por favor, complete correctamente todos los campos obligatorios." ? (
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
        {/* Sección: Información Personal */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Información Personal</h5>
          <div className="form-row">
            {/* Campos de nombre y apellidos */}
            <div className="form-col">
              <label>Nombre(s)</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.nombre ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.nombre && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.nombre}
                </span>
              )}
            </div>
            <div className="form-col">
              <label>Apellido Paterno</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.apellidoPaterno ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.apellidoPaterno && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.apellidoPaterno}
                </span>
              )}
            </div>
            <div className="form-col">
              <label>Apellido Materno</label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.apellidoMaterno ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.apellidoMaterno && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.apellidoMaterno}
                </span>
              )}
            </div>
          </div>
          <div className="form-row">
            {/* Campos de fecha de nacimiento y teléfono */}
            <div className="form-col">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.fechaNacimiento ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.fechaNacimiento && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.fechaNacimiento}
                </span>
              )}
            </div>
            <div className="form-col">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.telefono ? " is-invalid" : ""}`}
                maxLength="10"
                autoComplete="off"
              />
              {errors.telefono && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.telefono}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Sección: Dirección */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Dirección</h5>
          <div className="form-row">
            {/* Campo de calle */}
            <div className="form-col">
              <label>Calle</label>
              <input
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.calle ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.calle && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.calle}
                </span>
              )}
            </div>
            
            {/* Campo de colonia con dropdown de sugerencias */}
            <div className="form-col">
              <label>Colonia</label>
              <div style={{ position: "relative" }}>
                <div className="input-group">
                  <input
                    type="text"
                    name="colonia"
                    value={formData.colonia}
                    onChange={handleChange}
                    className={`form-control form-control-sm${errors.colonia ? " is-invalid" : ""}`}
                    autoComplete="off"
                    placeholder={colonias.length > 0 ? "Selecciona una colonia o escribe una nueva" : "Ingresa código postal primero"}
                  />
                  {/* Botón para mostrar/ocultar dropdown de colonias */}
                  {colonias.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={toggleColoniaDropdown}
                      title="Mostrar colonias disponibles"
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        fontSize: '12px',
                        padding: '4px 8px'
                      }}
                    >
                      <i className={`bi bi-chevron-${showColoniaDropdown ? 'up' : 'down'}`}></i>
                    </button>
                  )}
                </div>
                
                {/* Dropdown con lista de colonias */}
                {showColoniaDropdown && colonias.length > 0 && (
                  <ul className="colonia-dropdown">
                    {colonias.map((colonia, index) => (
                      <li
                        key={index}
                        onClick={() => handleColoniaSelect(colonia)}
                        className="colonia-dropdown-item"
                      >
                        {colonia}
                      </li>
                    ))}
                  </ul>
                )}
                {errors.colonia && (
                  <span className="invalid-feedback" style={{ display: "block" }}>
                    <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                    {errors.colonia}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-row">
            {/* Campos de números de casa y código postal */}
            <div className="form-col">
              <label>No. Exterior</label>
              <input
                type="text"
                name="noExterior"
                value={formData.noExterior}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.noExterior ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.noExterior && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.noExterior}
                </span>
              )}
            </div>
            <div className="form-col">
              <label>No. Interior (opcional)</label>
              <input
                type="text"
                name="noInterior"
                value={formData.noInterior}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.noInterior ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.noInterior && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.noInterior}
                </span>
              )}
            </div>
            <div className="form-col">
              <label>Código Postal</label>
              <input
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.codigoPostal ? " is-invalid" : ""}`}
                maxLength="5"
                autoComplete="off"
                placeholder="Ingresa 5 dígitos"
              />
              {errors.codigoPostal && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.codigoPostal}
                </span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            {/* Campo de municipio (autocompletado) */}
            <div className="form-col" style={{ flex: "0 0 50%" }}>
              <label>Municipio</label>
              <input
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.municipio ? " is-invalid" : ""}`}
                autoComplete="off"
                placeholder="Se autocompleta con el código postal"
              />
              {errors.municipio && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.municipio}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Sección: Información Electoral */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Información Electoral</h5>
          <div className="form-row">
            <div className="form-col" style={{ flex: "0 0 50%" }}>
              <label>Clave de Elector</label>
              <input
                type="text"
                name="claveElector"
                value={formData.claveElector}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.claveElector ? " is-invalid" : ""}`}
                maxLength="18"
                autoComplete="off"
              />
              {errors.claveElector && (
                <span className="invalid-feedback" style={{ display: "block" }}>
                  <i className="fa fa-exclamation-circle me-1" style={{ color: "#d32f2f" }}></i>
                  {errors.claveElector}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sección: Asociar Cabeza de Círculo */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Asociar Cabeza de Círculo</h5>
          <div className="leader-section">
            <div className="form-row">
              <div className="form-col" style={{ position: "relative", flex: "0 0 50%" }}>
                <label>Buscar Cabeza de Círculo</label>
                <input
                  type="text"
                  placeholder="Nombre o Clave de Elector"
                  value={searchQuery}
                  onChange={handleSearchCabezas}
                  autoComplete="off"
                />
                {/* Lista de resultados de búsqueda */}
                {cabezasCirculo.length > 0 && (
                  <ul className="search-results">
                    {cabezasCirculo.map((cabeza) => (
                      <li
                        key={cabeza.id}
                        onClick={() => handleSelectLider(cabeza)}
                        className="search-result-item"
                      >
                        {`${cabeza.nombre} ${cabeza.apellidoPaterno} ${cabeza.apellidoMaterno} - ${cabeza.claveElector}`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Mostrar líder seleccionado o placeholder */}
            {selectedLider ? (
              <div className="form-row">
                <div className="form-col" style={{ flex: "0 0 50%" }}>
                  <label>Cabeza de Círculo Seleccionada</label>
                  <div className="selected-lider-container">
                    <input
                      type="text"
                      value={`${selectedLider.nombre} ${selectedLider.apellidoPaterno} ${selectedLider.apellidoMaterno} - ${selectedLider.claveElector}`}
                      readOnly
                      className="selected-beneficiary"
                    />
                    <button
                      type="button"
                      className="remove-lider-btn"
                      onClick={handleRemoveLider}
                      title="Quitar selección"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="leader-placeholder"></div>
            )}
          </div>
        </div>

        {/* Botones de acción del formulario */}
        <div className="d-flex justify-content-end gap-2 mt-4 mb-5">
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

export default IntegranteCirculoForm;