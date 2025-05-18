import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IntegranteCirculo.css";
import { createIntegranteCirculo } from "../../api";

const IntegranteCirculoForm = () => {
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
    claveElector: "",
    telefono: "",
    lider: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    if (!value && name !== "noExterior") {
      error = "Este campo es obligatorio.";
    } else if ((name === "noExterior" || name === "noInterior" || name === "telefono" || name === "liderId") && isNaN(value)) {
      error = "Debe ser un número válido.";
    }
    return error;
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
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
        text: "Por favor, complete todos los campos obligatorios.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const integranteData = {
      nombre: formData.nombre.trim(),
      apellidoPaterno: formData.apellidoPaterno.trim(),
      apellidoMaterno: formData.apellidoMaterno.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      calle: formData.calle.trim(),
      noExterior: formData.noExterior ? Number.parseInt(formData.noExterior) : null,
      noInterior: Number.parseInt(formData.noInterior),
      colonia: formData.colonia.trim(),
      claveElector: formData.claveElector.trim(),
      telefono: Number.parseInt(formData.telefono),
      lider: formData.lider ? Number.parseInt(formData.lider) : null,
    };

      console.log("Datos enviados al backend:", integranteData);

      await createIntegranteCirculo(integranteData);

      setMessage({
        type: "success",
        text: "Integrante registrado exitosamente.",
      });

      setFormData(initialFormState);
    } catch (error) {
      console.error("Error al registrar integrante:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al registrar integrante.",
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
        <h1 className="form-title">Registro de Integrante del Círculo</h1>
        <button className="back-button" onClick={() => navigate('/menu')}>
          Volver al Menú
        </button>
      </div>

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
              />
              {errors.fechaNacimiento && <span className="error-text">{errors.fechaNacimiento}</span>}
            </div>
            <div className="form-col">
              <label>Teléfono</label>
              <input
                type="number"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={errors.telefono ? "input-error" : ""}
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
              />
              {errors.colonia && <span className="error-text">{errors.colonia}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>No. Exterior</label>
              <input
                type="number"
                name="noExterior"
                value={formData.noExterior}
                onChange={handleChange}
                className={errors.noExterior ? "input-error" : ""}
              />
              {errors.noExterior && <span className="error-text">{errors.noExterior}</span>}
            </div>
            <div className="form-col">
              <label>No. Interior</label>
              <input
                type="number"
                name="noInterior"
                value={formData.noInterior}
                onChange={handleChange}
                className={errors.noInterior ? "input-error" : ""}
              />
              {errors.noInterior && <span className="error-text">{errors.noInterior}</span>}
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
              />
              {errors.claveElector && <span className="error-text">{errors.claveElector}</span>}
            </div>
            <div className="form-col">
              <label>Líder ID</label>
              <input
                type="number"
                name="lider"
                value={formData.lider}
                onChange={handleChange}
                className={errors.lider ? "input-error" : ""}
              />
              {errors.lider && <span className="error-text">{errors.lider}</span>}
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

export default IntegranteCirculoForm;