import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap
import "./CabezaCirculo.css";
import { createCabezaCirculo } from "../../api";

const CabezaCirculoForm = ({ hideHeader = false }) => {
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
  const [hideHeaderState, setHideHeader] = useState(hideHeader); // Controlar desde props

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
      // Oculta el mensaje automáticamente después de 7 segundos solo para este error
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 7000);
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

      // Set a timeout to clear the success message after 8 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 8000);
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

  // En el render
  return (
    <div className={`container mt-3`}>
      {!hideHeaderState && (
        <div className="mb-4">
          <h1 className="h4 text-primary">Registro de Cabeza de Círculo</h1>
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
          <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-3`}>
            {message.text}
          </div>
        )
      )}
      <form onSubmit={handleSubmit}>
        {/* Información Personal */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Información Personal</h5>
          <div className="row">
            <div className="col-md-4 mb-2">
              <label className="form-label">Nombre(s)</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.nombre ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label">Apellido Paterno</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.apellidoPaterno ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.apellidoPaterno && <div className="invalid-feedback">{errors.apellidoPaterno}</div>}
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label">Apellido Materno</label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.apellidoMaterno ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.apellidoMaterno && <div className="invalid-feedback">{errors.apellidoMaterno}</div>}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.fechaNacimiento ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.telefono ? " is-invalid" : ""}`}
                maxLength="10"
                autoComplete="off"
              />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Dirección</h5>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Calle</label>
              <input
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.calle ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.calle && <div className="invalid-feedback">{errors.calle}</div>}
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">Colonia</label>
              <input
                type="text"
                name="colonia"
                value={formData.colonia}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.colonia ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.colonia && <div className="invalid-feedback">{errors.colonia}</div>}
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-2">
              <label className="form-label">No. Exterior</label>
              <input
                type="text"
                name="noExterior"
                value={formData.noExterior}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.noExterior ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.noExterior && <div className="invalid-feedback">{errors.noExterior}</div>}
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label">No. Interior (opcional)</label>
              <input
                type="text"
                name="noInterior"
                value={formData.noInterior}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.noInterior ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.noInterior && <div className="invalid-feedback">{errors.noInterior}</div>}
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label">Código Postal</label>
              <input
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.codigoPostal ? " is-invalid" : ""}`}
                maxLength="5"
                autoComplete="off"
              />
              {errors.codigoPostal && <div className="invalid-feedback">{errors.codigoPostal}</div>}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Municipio (opcional)</label>
              <input
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.municipio ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.municipio && <div className="invalid-feedback">{errors.municipio}</div>}
            </div>
          </div>
        </div>

        {/* Información Electoral y Contacto */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Información Electoral y Contacto</h5>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Clave de Elector</label>
              <input
                type="text"
                name="claveElector"
                value={formData.claveElector}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.claveElector ? " is-invalid" : ""}`}
                maxLength="18"
                autoComplete="off"
              />
              {errors.claveElector && <div className="invalid-feedback">{errors.claveElector}</div>}
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.email ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Facebook (opcional)</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="form-control form-control-sm"
                autoComplete="off"
              />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">Otra Red Social (opcional)</label>
              <input
                type="text"
                name="otraRedSocial"
                value={formData.otraRedSocial}
                onChange={handleChange}
                className="form-control form-control-sm"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {/* Estructura */}
        <div className="mb-3 bg-contrast rounded shadow-sm p-3">
          <h5 className="mb-2 heading-morado">Estructura</h5>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Estructura Territorial</label>
              <input
                type="text"
                name="estructuraTerritorial"
                value={formData.estructuraTerritorial}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.estructuraTerritorial ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.estructuraTerritorial && <div className="invalid-feedback">{errors.estructuraTerritorial}</div>}
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">Posición en Estructura</label>
              <input
                type="text"
                name="posicionEstructura"
                value={formData.posicionEstructura}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.posicionEstructura ? " is-invalid" : ""}`}
                autoComplete="off"
              />
              {errors.posicionEstructura && <div className="invalid-feedback">{errors.posicionEstructura}</div>}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4 mb-4">
          <button
            type="button"
            className="form-button form-button-secondary"
            onClick={handleReset}
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="form-button form-button-primary"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CabezaCirculoForm;