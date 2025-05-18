import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ApoyoForm.css";
import { createApoyo } from "../../api";

const ApoyoForm = () => {
  const navigate = useNavigate();

  const initialFormState = {
    cantidad: "",
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
    if (!value && name !== "personaId" && name !== "cabezaId") {
      // Solo los campos distintos de personaId y cabezaId son obligatorios
      error = "Este campo es obligatorio.";
    } else if ((name === "personaId" || name === "cabezaId" || name === "cantidad") && value && isNaN(value)) {
      // Validar que sean números válidos si tienen valor
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
      // Ajustar los nombres de las claves para que coincidan con apoyo.entity.ts
      const apoyoData = {
        cantidad: formData.cantidad ? parseInt(formData.cantidad, 10) : null,
        tipoApoyo: formData.tipoApoyo.trim(),
        fechaEntrega: formData.fechaEntrega,
        persona: formData.personaId ? { id: parseInt(formData.personaId, 10) } : null, // Relación con persona
        cabeza: formData.cabezaId ? { id: parseInt(formData.cabezaId, 10) } : null,   // Relación con cabeza
      };

      console.log("Datos enviados al backend:", apoyoData);

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
              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className={errors.cantidad ? "input-error" : ""}
              />
              {errors.cantidad && <span className="error-text">{errors.cantidad}</span>}
            </div>
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
          </div>
          <div className="form-row">
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