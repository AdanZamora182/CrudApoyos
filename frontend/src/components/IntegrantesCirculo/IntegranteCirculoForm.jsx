import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IntegranteCirculo.css";
import { createIntegranteCirculo, buscarCabezasCirculo, buscarMunicipioPorCP, buscarColoniasPorCP } from "../../api";

const IntegranteCirculoForm = ({ hideHeader = false }) => {
  const navigate = useNavigate();
  
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
    municipio: "", // <-- Añadir aquí
    claveElector: "",
    telefono: "",
    lider: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [cabezasCirculo, setCabezasCirculo] = useState([]);
  const [selectedLider, setSelectedLider] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideHeaderState, setHideHeader] = useState(hideHeader); // Control from props

  // Add new state for colonies
  const [colonias, setColonias] = useState([]);
  const [showColoniaDropdown, setShowColoniaDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict input for specific fields
    const numericFields = ["telefono", "noExterior", "noInterior", "codigoPostal"];
    if (numericFields.includes(name) && value !== "" && !/^\d*$/.test(value)) {
      return; // Prevent non-numeric input
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }

    // Handle código postal changes
    if (name === "codigoPostal") {
      if (value.length === 5) {
        // Auto-complete Municipio and get Colonias when Código Postal is complete
        handleCodigoPostalChange(value);
      } else {
        // Clear municipio and colonias when código postal is incomplete or deleted
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
    
    // Handle colonia selection from dropdown
    if (name === "colonia") {
      setShowColoniaDropdown(false); // Hide dropdown after selection
    }
  };

  // Enhanced function to handle código postal autocomplete
  const handleCodigoPostalChange = async (codigoPostal) => {
    try {
      // Fetch both municipio and colonias
      const [municipio, coloniasData] = await Promise.all([
        buscarMunicipioPorCP(codigoPostal),
        buscarColoniasPorCP(codigoPostal)
      ]);
      
      if (municipio) {
        setFormData(prevData => ({
          ...prevData,
          municipio: municipio,
          colonia: "" // Clear colonia when postal code changes
        }));
      }
      
      if (coloniasData && coloniasData.length > 0) {
        // Sort colonies alphabetically
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

  // Handle colonia selection from dropdown
  const handleColoniaSelect = (coloniaSeleccionada) => {
    setFormData(prevData => ({
      ...prevData,
      colonia: coloniaSeleccionada
    }));
    setShowColoniaDropdown(false);
  };

  // New function to toggle dropdown visibility
  const toggleColoniaDropdown = () => {
    if (colonias.length > 0) {
      setShowColoniaDropdown(!showColoniaDropdown);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    const trimmedValue = value !== null && value !== undefined ? String(value).trim() : "";

    // Optional fields
    const optionalFields = ["noInterior", "lider"];

    // Check required fields
    if (!optionalFields.includes(name) && trimmedValue === "") {
      error = "Este campo es obligatorio.";
      return error;
    }

    // Field-specific validations
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

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    
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

  const handleSelectLider = (cabeza) => {
    setSelectedLider(cabeza);
    setFormData({ ...formData, lider: cabeza.id });
    setSearchQuery("");
    setCabezasCirculo([]);
  };

  // Add function to remove selected leader
  const handleRemoveLider = () => {
    setSelectedLider(null);
    setFormData({ ...formData, lider: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        municipio: formData.municipio, // <-- Asegúrate de incluir municipio aquí
        claveElector: formData.claveElector,
        telefono: parseInt(formData.telefono, 10),
        lider: formData.lider ? { id: parseInt(formData.lider, 10) } : null,
      };
      
      console.log("Datos a enviar al backend:", integranteData);

      await createIntegranteCirculo(integranteData);

      setMessage({
        type: "success",
        text: "Integrante de círculo registrado exitosamente.",
      });

      setFormData(initialFormState); // Clear form
      setErrors({}); // Clear errors
      setSelectedLider(null); // Clear selected leader

      // Set a timeout to clear the success message after 8 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 8000);
    } catch (error) {
      console.error("Error al registrar integrante de círculo:", error);
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

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setMessage({ type: "", text: "" });
    setSelectedLider(null);
    setSearchQuery("");
    setCabezasCirculo([]);
    // Clear colonies state
    setColonias([]);
    setShowColoniaDropdown(false);
  };

  return (
    <div className={`container mt-3 mb-4`}> {/* Added mb-4 for bottom margin */}
      {!hideHeaderState && (
        <div className="mb-4">
          <h1 className="h4 text-primary">Registro de Integrante de Círculo</h1>
        </div>
      )}

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

      <form onSubmit={handleSubmit}>
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Información Personal</h5>
          <div className="form-row">
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
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Dirección</h5>
          <div className="form-row">
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

        <div className="d-flex justify-content-end gap-2 mt-4 mb-5"> {/* Changed from mb-4 to mb-5 */}
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