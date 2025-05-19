import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CabezaCirculo.css";
import { createCabezaCirculo } from "../../api";

const CabezaCirculoForm = () => {
  const navigate = useNavigate();
  
  const initialFormState = {
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    telefono: "",
    calle: "",
    noExterior: "",
    noInterior: "", // Ahora es opcional
    colonia: "",
    codigoPostal: "",
    municipio: "",
    claveElector: "",
    email: "",
    facebook: "",
    otraRedSocial: "",
    estructuraTerritorial: "",
    posicionEstructura: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

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

    // Limpiar errores al escribir
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

    // Campos opcionales
    const optionalFields = ["noInterior", "municipio", "facebook", "otraRedSocial"];

    // Validar campos obligatorios
    if (!optionalFields.includes(name) && trimmedValue === "") {
      error = "Este campo es obligatorio.";
      return error;
    }

    // Validaciones específicas por campo
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
      case "email":
        if (trimmedValue !== "" && !/\S+@\S+\.\S+/.test(trimmedValue)) {
          error = "Formato de email inválido.";
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
      const cabezaData = {
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        fechaNacimiento: formData.fechaNacimiento,
        telefono: parseInt(formData.telefono, 10),
        calle: formData.calle,
        noExterior: parseInt(formData.noExterior, 10), // Obligatorio
        noInterior: formData.noInterior ? parseInt(formData.noInterior, 10) : null, // Opcional
        colonia: formData.colonia,
        codigoPostal: parseInt(formData.codigoPostal, 10),
        municipio: formData.municipio || null,
        claveElector: formData.claveElector,
        email: formData.email,
        facebook: formData.facebook || null,
        otraRedSocial: formData.otraRedSocial || null,
        estructuraTerritorial: formData.estructuraTerritorial,
        posicionEstructura: formData.posicionEstructura,
      };
      
      console.log("Datos a enviar al backend:", cabezaData);

      await createCabezaCirculo(cabezaData);

      setMessage({
        type: "success",
        text: "Cabeza de círculo registrada exitosamente.",
      });

      setFormData(initialFormState); // Limpiar formulario
      setErrors({}); // Limpiar errores
    } catch (error) {
      console.error("Error al registrar cabeza de círculo:", error);
      const backendErrorMessage = error.response?.data?.message || "Error al registrar cabeza de círculo. Verifique los datos e inténtelo de nuevo.";
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
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="header-logo">
          <h1 className="form-title">Registro de Cabeza de Círculo</h1>
        </div>
        <button className="back-button" onClick={() => navigate('/menu')}>
          Volver al Menú
        </button>
      </div>
      
      <p className="form-subtitle">Complete todos los campos para registrar un nuevo cabeza de círculo</p>

      {message.text && <div className={`form-message form-message-${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">Información Personal</h3>
          <div className="form-row">
            <div className="form-col">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? "input-error" : ""}
                autoComplete="off" // Desactiva el autocompletado
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
                autoComplete="off" // Desactiva el autocompletado
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
                autoComplete="off" // Desactiva el autocompletado
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
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.fechaNacimiento && <span className="error-text">{errors.fechaNacimiento}</span>}
            </div>
            <div className="form-col">
              <label>Teléfono</label>
              <input
                type="text" // Usar text para permitir validación más flexible, luego convertir a número
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={errors.telefono ? "input-error" : ""}
                maxLength="10" // Restrict length if needed
                autoComplete="off" // Desactiva el autocompletado
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
                autoComplete="off" // Desactiva el autocompletado
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
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.colonia && <span className="error-text">{errors.colonia}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>No. Exterior</label>
              <input
                type="text" // Usar text para permitir vacío y validación más flexible
                name="noExterior"
                value={formData.noExterior}
                onChange={handleChange}
                className={errors.noExterior ? "input-error" : ""}
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.noExterior && <span className="error-text">{errors.noExterior}</span>}
            </div>
            <div className="form-col">
              <label>No. Interior (opcional)</label> {/* Eliminado "(opcional)" */}
              <input
                type="text" // Usar text para permitir validación más flexible
                name="noInterior"
                value={formData.noInterior}
                onChange={handleChange}
                className={errors.noInterior ? "input-error" : ""}
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.noInterior && <span className="error-text">{errors.noInterior}</span>}
            </div>
            <div className="form-col">
              <label>Código Postal</label>
              <input
                type="text" // Usar text para permitir validación más flexible
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                className={errors.codigoPostal ? "input-error" : ""}
                maxLength="5" // Restrict to 5 characters
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.codigoPostal && <span className="error-text">{errors.codigoPostal}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Municipio (opcional)</label>
              <input
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className={errors.municipio ? "input-error" : ""}
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.municipio && <span className="error-text">{errors.municipio}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Información Electoral y Contacto</h3>
          <div className="form-row">
            <div className="form-col">
              <label>Clave de Elector</label>
              <input
                type="text"
                name="claveElector"
                value={formData.claveElector}
                onChange={handleChange}
                className={errors.claveElector ? "input-error" : ""}
                maxLength="18" // Restrict to 18 characters
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.claveElector && <span className="error-text">{errors.claveElector}</span>}
            </div>
            <div className="form-col">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Facebook (opcional)</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                autoComplete="off" // Desactiva el autocompletado
              />
            </div>
            <div className="form-col">
              <label>Otra Red Social (opcional)</label>
              <input
                type="text"
                name="otraRedSocial"
                value={formData.otraRedSocial}
                onChange={handleChange}
                autoComplete="off" // Desactiva el autocompletado
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Estructura</h3>
          <div className="form-row">
            <div className="form-col">
              <label>Estructura Territorial</label>
              <input
                type="text"
                name="estructuraTerritorial"
                value={formData.estructuraTerritorial}
                onChange={handleChange}
                className={errors.estructuraTerritorial ? "input-error" : ""}
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.estructuraTerritorial && <span className="error-text">{errors.estructuraTerritorial}</span>}
            </div>
            <div className="form-col">
              <label>Posición en Estructura</label>
              <input
                type="text"
                name="posicionEstructura"
                value={formData.posicionEstructura}
                onChange={handleChange}
                className={errors.posicionEstructura ? "input-error" : ""}
                autoComplete="off" // Desactiva el autocompletado
              />
              {errors.posicionEstructura && <span className="error-text">{errors.posicionEstructura}</span>}
            </div>
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

export default CabezaCirculoForm;