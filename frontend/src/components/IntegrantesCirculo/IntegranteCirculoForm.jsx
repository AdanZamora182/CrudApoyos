import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IntegranteCirculo.css";
import { createIntegranteCirculo, buscarCabezasCirculo } from "../../api";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Por favor, complete correctamente todos los campos obligatorios.",
      });
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
  };

  return (
    <div className={`form-container ${hideHeaderState ? "integrated-form compact-ui" : ""}`}>
      {!hideHeaderState && (
        <div className="form-header">
          <h1 className="form-title">Registro de Integrante de Círculo</h1>
        </div>
      )}
      
      {message.text && <div className={`form-message form-message-${message.type}`}>{message.text}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">Información Personal</h3>
          <div className="form-row">
            <div className="form-col">
              <label>Nombre(s)</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? "input-error" : ""}
                autoComplete="off"
              />
              {errors.nombre && <span className="error-text">{errors.nombre}</span>}
            </div>
            <div className="form-col">
              <label>Apellido Paterno</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className={errors.apellidoPaterno ? "input-error" : ""}
                autoComplete="off"
              />
              {errors.apellidoPaterno && <span className="error-text">{errors.apellidoPaterno}</span>}
            </div>
            <div className="form-col">
              <label>Apellido Materno</label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                className={errors.apellidoMaterno ? "input-error" : ""}
                autoComplete="off"
              />
              {errors.apellidoMaterno && <span className="error-text">{errors.apellidoMaterno}</span>}
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
                className={errors.fechaNacimiento ? "input-error" : ""}
                autoComplete="off"
              />
              {errors.fechaNacimiento && <span className="error-text">{errors.fechaNacimiento}</span>}
            </div>
            <div className="form-col">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={errors.telefono ? "input-error" : ""}
                maxLength="10"
                autoComplete="off"
              />
              {errors.telefono && <span className="error-text">{errors.telefono}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Dirección</h3>
          <div className="form-row">
            <div className="form-col">
              <label>Calle</label>
              <input
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                className={errors.calle ? "input-error" : ""}
                autoComplete="off"
              />
              {errors.calle && <span className="error-text">{errors.calle}</span>}
            </div>
            <div className="form-col">
              <label>Colonia</label>
              <input
                type="text"
                name="colonia"
                value={formData.colonia}
                onChange={handleChange}
                className={errors.colonia ? "input-error" : ""}
                autoComplete="off"
              />
              {errors.colonia && <span className="error-text">{errors.colonia}</span>}
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
                className={errors.noExterior ? "input-error" : ""}
                autoComplete="off"
              />
              {errors.noExterior && <span className="error-text">{errors.noExterior}</span>}
            </div>
            <div className="form-col">
              <label>No. Interior (opcional)</label>
              <input
                type="text"
                name="noInterior"
                value={formData.noInterior}
                onChange={handleChange}
                className={errors.noInterior ? "input-error" : ""}
                autoComplete="off"
              />
              {errors.noInterior && <span className="error-text">{errors.noInterior}</span>}
            </div>
            <div className="form-col">
              <label>Código Postal</label>
              <input
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                className={errors.codigoPostal ? "input-error" : ""}
                maxLength="5"
                autoComplete="off"
              />
              {errors.codigoPostal && <span className="error-text">{errors.codigoPostal}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Información Electoral</h3>
          <div className="form-row">
            <div className="form-col">
              <label>Clave de Elector</label>
              <input
                type="text"
                name="claveElector"
                value={formData.claveElector}
                onChange={handleChange}
                className={errors.claveElector ? "input-error" : ""}
                maxLength="18"
                autoComplete="off"
              />
              {errors.claveElector && <span className="error-text">{errors.claveElector}</span>}
            </div>
          </div>
        </div>

        {/* Replace the Asociar Cabeza de Círculo section with this updated version */}
        <div className="form-section">
          <h3 className="form-section-title">Asociar Cabeza de Círculo</h3>
          <div className="leader-section">
            <div className="form-row">
              <div className="form-col" style={{ position: "relative" }}>
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
                <div className="form-col">
                  <label>Cabeza de Círculo Seleccionada</label>
                  <input
                    type="text"
                    value={`${selectedLider.nombre} ${selectedLider.apellidoPaterno} ${selectedLider.apellidoMaterno} - ${selectedLider.claveElector}`}
                    readOnly
                    className="selected-lider"
                  />
                </div>
              </div>
            ) : (
              <div className="leader-placeholder"></div>
            )}
          </div>
        </div>

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

export default IntegranteCirculoForm;