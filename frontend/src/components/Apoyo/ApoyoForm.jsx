import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ApoyoForm.css";
import { createApoyo, buscarCabezasCirculo, buscarIntegrantesCirculo } from "../../api";

const ApoyoForm = ({ hideHeader = false }) => {
  const navigate = useNavigate();

  const initialFormState = {
    cantidad: "",
    tipoApoyo: "",
    fechaEntrega: "",
    beneficiarioId: null, // ID of the selected beneficiary
    beneficiarioTipo: "", // Type of beneficiary: "cabeza" or "integrante"
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search input for beneficiaries
  const [beneficiarios, setBeneficiarios] = useState([]); // Search results
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null); // Selected beneficiary
  const [hideHeaderState] = useState(hideHeader); // Control from props

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict input for specific fields
    const numericFields = ["cantidad"];
    if (numericFields.includes(name) && value !== "" && !/^\d*$/.test(value)) {
      return; // Prevent non-numeric input
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors while typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateField = (name, value) => {
    let error = "";
    const mandatoryFields = ["fechaEntrega", "tipoApoyo", "cantidad"];

    if (mandatoryFields.includes(name) && !value) {
      error = "Este campo es obligatorio.";
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
    if (!selectedBeneficiario) {
      formIsValid = false;
      newErrors.beneficiarioId = "Debe seleccionar un beneficiario.";
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSearchBeneficiarios = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const [cabezas, integrantes] = await Promise.all([
          buscarCabezasCirculo(query),
          buscarIntegrantesCirculo(query),
        ]);
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

  const handleSelectBeneficiario = (beneficiario) => {
    setSelectedBeneficiario(beneficiario);
    setFormData({
      ...formData,
      beneficiarioId: beneficiario.id, // Correctly set the ID of the selected beneficiary
      beneficiarioTipo: beneficiario.tipo, // Correctly set the type of the selected beneficiary
    });
    setSearchQuery(""); // Clear the search query after selection
    setBeneficiarios([]);
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
        cantidad: formData.cantidad ? parseInt(formData.cantidad, 10) : null,
        tipoApoyo: formData.tipoApoyo === "Otro" ? formData.tipoApoyo.trim() : formData.tipoApoyo.trim(),
        fechaEntrega: formData.fechaEntrega,
        persona: formData.beneficiarioTipo === "integrante" ? { id: formData.beneficiarioId } : null, // Match "persona" for Persona_id
        cabeza: formData.beneficiarioTipo === "cabeza" ? { id: formData.beneficiarioId } : null, // Match "cabeza" for Cabeza_id
      };

      console.log("Datos enviados al backend:", apoyoData);

      await createApoyo(apoyoData);

      setMessage({
        type: "success",
        text: "Apoyo registrado exitosamente.",
      });

      setFormData(initialFormState); // Clear form
      setErrors({});
      setSelectedBeneficiario(null); // Clear selected beneficiary
      setSearchQuery(""); // Clear search input

      // Set a timeout to clear the success message after 8 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 8000);
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
    setSelectedBeneficiario(null);
    setSearchQuery("");
  };

  return (
    <div className={`form-container ${hideHeaderState ? "integrated-form compact-ui" : ""}`}>
      {!hideHeaderState && (
        <div className="form-header">
          <h1 className="form-title">Registro de Apoyo</h1>
        </div>
      )}

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
                autoComplete="off"
              />
              {errors.cantidad && <span className="error-text">{errors.cantidad}</span>}
            </div>
            <div className="form-col">
              <label>Tipo de Apoyo</label>
              <select
                name="tipoApoyo"
                value={formData.tipoApoyo}
                onChange={handleChange}
                className={errors.tipoApoyo ? "input-error" : ""}
              >
                <option value="">Seleccione una opción</option>
                {predefinedOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {formData.tipoApoyo === "Otro" && (
                <div className="custom-input-container">
                  <input
                    type="text"
                    name="tipoApoyoCustom"
                    placeholder="Especifique el tipo de apoyo"
                    value={formData.tipoApoyoCustom || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipoApoyoCustom: e.target.value,
                      })
                    }
                    className={`custom-input ${errors.tipoApoyo ? "input-error" : ""}`}
                    autoComplete="off"
                  />
                </div>
              )}
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
                autoComplete="off"
              />
              {errors.fechaEntrega && <span className="error-text">{errors.fechaEntrega}</span>}
            </div>
          </div>
        </div>

        {/* Replace the Asociar Beneficiario section with this fixed-height version */}
        <div className="form-section">
          <h3 className="form-section-title">Asociar Beneficiario</h3>
          <div className="beneficiary-container">
            <div className="form-row">
              <div className="form-col" style={{ position: "relative" }}>
                <label>Buscar Beneficiario</label>
                <input
                  type="text"
                  placeholder="Nombre o Clave de Elector"
                  value={searchQuery}
                  onChange={handleSearchBeneficiarios}
                  autoComplete="off"
                />
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

            <div className="selected-beneficiary-container">
              {selectedBeneficiario ? (
                <div className="form-row">
                  <div className="form-col">
                    <label>Beneficiario Seleccionado</label>
                    <input
                      type="text"
                      value={`${selectedBeneficiario.nombre} ${selectedBeneficiario.apellidoPaterno} ${selectedBeneficiario.apellidoMaterno} - ${selectedBeneficiario.claveElector}`}
                      readOnly
                      className="selected-beneficiary"
                    />
                  </div>
                </div>
              ) : (
                <div className="empty-beneficiary-placeholder">
                  {/* Removed the placeholder text */}
                </div>
              )}
            </div>

            {errors.beneficiarioId && <span className="error-text">{errors.beneficiarioId}</span>}
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