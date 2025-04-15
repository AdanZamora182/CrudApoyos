import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CabezaCirculo.css";
import { createCabezaCirculo } from "../../api";
import logoApoyos from '../../assets/logoApoyos.png';

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
    noInterior: "",
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value && name !== "noInterior" && name !== "facebook" && name !== "otraRedSocial") {
      error = "Este campo es obligatorio.";
    }
    return error;
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};

    // Validar campos obligatorios
    Object.keys(formData).forEach((field) => {
      if (field === "noInterior" || field === "facebook" || field === "otraRedSocial") {
        return; // Estos campos no son obligatorios
      }
      
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
      // Formatear datos para enviar al backend
      const cabezaData = {
        Nombre: formData.nombre,
        Apellido_Paterno: formData.apellidoPaterno,
        Apellido_Materno: formData.apellidoMaterno,
        Fecha_Nacimiento: formData.fechaNacimiento,
        Telefono: formData.telefono,
        Calle: formData.calle,
        No_Exterior: formData.noExterior ? Number.parseInt(formData.noExterior) : null,
        No_Interior: formData.noInterior ? Number.parseInt(formData.noInterior) : null,
        Colonia: formData.colonia,
        Codigo_Postal: Number.parseInt(formData.codigoPostal),
        Municipio: formData.municipio,
        Clave_Elector: formData.claveElector,
        Email: formData.email,
        Facebook: formData.facebook,
        Otra_RedSocial: formData.otraRedSocial,
        Estructura_Territorial: formData.estructuraTerritorial,
        Posicion_Estructura: formData.posicionEstructura,
      };

      await createCabezaCirculo(cabezaData);

      setMessage({
        type: "success",
        text: "Cabeza de círculo registrada exitosamente.",
      });

      // Limpiar formulario
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error al registrar cabeza de círculo:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al registrar cabeza de círculo.",
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
          <img src={logoApoyos} alt="Logo Apoyos" className="apoyos-logo" />
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
                type="text"
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
              <label>No. Interior (opcional)</label>
              <input
                type="number"
                name="noInterior"
                value={formData.noInterior}
                onChange={handleChange}
              />
            </div>
            <div className="form-col">
              <label>Código Postal</label>
              <input
                type="number"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                className={errors.codigoPostal ? "input-error" : ""}
              />
              {errors.codigoPostal && <span className="error-text">{errors.codigoPostal}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Municipio</label>
              <input
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className={errors.municipio ? "input-error" : ""}
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
              />
            </div>
            <div className="form-col">
              <label>Otra Red Social (opcional)</label>
              <input
                type="text"
                name="otraRedSocial"
                value={formData.otraRedSocial}
                onChange={handleChange}
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