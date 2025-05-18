import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ApoyoForm.css";
import { createApoyo } from "../../api"; // Asegúrate de que esta función esté definida en tu archivo api.js

const ApoyoForm = () => {
  const navigate = useNavigate();

  const initialFormState = {
    tipoApoyo: "",
    fechaEntrega: "",
    personaId: "",
    cabezaId: "",
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
    if (!value) {
      error = "Este campo es obligatorio.";
    } else if ((name === "personaId" || name === "cabezaId") && isNaN(value)) {
      error = "Debe ser un número válido.";
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
        text: "Por favor, complete todos los campos obligatorios.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const apoyoData = {
        Tipo_Apoyo: formData.tipoApoyo.trim(),
        Fecha_Entrega: formData.fechaEntrega,
        Persona_id: formData.personaId ? parseInt(formData.personaId, 10) : null,
        Cabeza_id: formData.cabezaId ? parseInt(formData.cabezaId, 10) : null,
      };

      console.log("Datos enviados al backend:", apoyoData); // Para depuración

      await createApoyo(apoyoData);

      setMessage({
        type: "success",
        text: "Apoyo registrado exitosamente.",
      });

      setFormData(initialFormState); // Limpiar formulario
      setErrors({});
    } catch (error) {
      console.error("Error al registrar apoyo:", error);
      const backendErrorMessage = error.response?.data?.message || "Error al registrar apoyo. Verifique los datos e inténtelo de nuevo.";
      setMessage({
        type: "error",
        text: backendErrorMessage,
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
        <h1 className="form-title">Registro de Apoyo</h1>
        <button className="back-button" onClick={() => navigate('/menu')}>
          Volver al Menú
        </button>
      </div>

      {message.text && <div className={`form-message form-message-${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">Información del Apoyo</h3>
          <div className="form-row">
            <div className="form-col">
              <label>Tipo de Apoyo</label>
              <input
                type="text"
                name="tipoApoyo"
                value={formData.tipoApoyo}
                onChange={handleChange}
                className={errors.tipoApoyo ? "input-error" : ""}
              />
              {errors.tipoApoyo && <span className="error-text">{errors.tipoApoyo}</span>}
            </div>
            <div className="form-col">
              <label>Fecha de Entrega</label>
              <input
                type="date"
                name="fechaEntrega"
                value={formData.fechaEntrega}
                onChange={handleChange}
                className={errors.fechaEntrega ? "input-error" : ""}
              />
              {errors.fechaEntrega && <span className="error-text">{errors.fechaEntrega}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Relaciones</h3>
          <div className="form-row">
            <div className="form-col">
              <label>ID de la Persona</label>
              <input
                type="text"
                name="personaId"
                value={formData.personaId}
                onChange={handleChange}
                className={errors.personaId ? "input-error" : ""}
              />
              {errors.personaId && <span className="error-text">{errors.personaId}</span>}
            </div>
            <div className="form-col">
              <label>ID de la Cabeza</label>
              <input
                type="text"
                name="cabezaId"
                value={formData.cabezaId}
                onChange={handleChange}
                className={errors.cabezaId ? "input-error" : ""}
              />
              {errors.cabezaId && <span className="error-text">{errors.cabezaId}</span>}
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

export default ApoyoForm;