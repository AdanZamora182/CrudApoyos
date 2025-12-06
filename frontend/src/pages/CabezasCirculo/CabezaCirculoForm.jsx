import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabezaCirculo } from "../../api/cabezasApi";
import { buscarMunicipioPorCP, buscarColoniasPorCP } from "../../api/direccionesApi";
import { useToaster } from "../../components/ui/ToasterProvider";
import {
  FormGlobalStyles,
  FormContainer,
  FormSection,
  SectionHeading,
  ColoniaDropdownContainer,
  ColoniaDropdown,
  ColoniaDropdownItem,
  DropdownToggleButton,
  PrimaryButton,
  SecondaryButton,
  ButtonContainer
} from '../../components/forms/FormSections.styles';

const CabezaCirculoForm = ({ hideHeader = false }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToaster();
  const queryClient = useQueryClient();

  // Mutación para crear una cabeza de círculo
  const createMutation = useMutation({
    mutationFn: createCabezaCirculo,
    onSuccess: () => {
      // Invalidar el cache de cabezas de círculo para refrescar la tabla CRUD
      queryClient.invalidateQueries({ queryKey: ["cabezasCirculo"] });
      showSuccess("Cabeza de círculo registrada exitosamente.");
      // Limpiar formulario después del éxito
      setFormData(initialFormState);
      setErrors({});
      setColonias([]);
      setShowColoniaDropdown(false);
    },
    onError: (error) => {
      console.error("Error al registrar cabeza de círculo:", error);
      // Manejar errores del backend
      const backendErrorMessage = error.response?.data?.message || "Error al registrar cabeza de círculo. Verifique los datos e inténtelo de nuevo.";
      const displayMessage = Array.isArray(backendErrorMessage) ? backendErrorMessage.join(', ') : backendErrorMessage;
      // Detectar si es error de clave de elector duplicada
      if (displayMessage.toLowerCase().includes('clave') || displayMessage.toLowerCase().includes('existe') || displayMessage.toLowerCase().includes('duplicad') || displayMessage.toLowerCase().includes('unique')) {
        showError("Clave de elector duplicada, verifique la información.");
      } else {
        showError(displayMessage);
      }
    },
  });
  
  // Estado inicial del formulario con todos los campos requeridos
  const initialFormState = {
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    telefono: "",
    calle: "",
    noExterior: "",
    noInterior: "", // Campo opcional
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

  // Estados del componente
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({}); // Para manejar errores de validación
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

    // Limpiar errores cuando el usuario comienza a escribir
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
        
        // Limpiar errores de municipio y código postal al autocompletar
        setErrors(prevErrors => ({
          ...prevErrors,
          municipio: null,
          codigoPostal: null
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
    
    // Limpiar error del campo colonia si existe
    if (errors.colonia) {
      setErrors(prevErrors => ({
        ...prevErrors,
        colonia: null
      }));
    }
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
    const optionalFields = ["noInterior", "municipio", "facebook", "otraRedSocial"];

    // Validar campos obligatorios
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

  // Función para procesar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!validateForm()) {
      showWarning("Por favor, complete correctamente todos los campos obligatorios.");
      return;
    }

    // Formatear datos para enviar al backend
    const cabezaData = {
      nombre: formData.nombre,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      fechaNacimiento: formData.fechaNacimiento,
      telefono: parseInt(formData.telefono, 10),
      calle: formData.calle,
      noExterior: parseInt(formData.noExterior, 10), // Campo obligatorio
      noInterior: formData.noInterior ? parseInt(formData.noInterior, 10) : null, // Campo opcional
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

    // Enviar datos usando la mutación de react-query
    createMutation.mutate(cabezaData);
  };

  // Función para limpiar el formulario
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setColonias([]);
    setShowColoniaDropdown(false);
  };

  return (
    <FormContainer className={`container mt-3`}>
      {/* Estilos globales para el formulario */}
      <FormGlobalStyles />
      
      {/* Mostrar encabezado si no está oculto */}
      {!hideHeaderState && (
        <div className="mb-4">
          <h1 className="h4 text-primary">Registro de Cabeza de Círculo</h1>
        </div>
      )}

      {/* Formulario principal */}
      <form onSubmit={handleSubmit}>
        {/* Sección: Información Personal */}
        <FormSection>
          <SectionHeading>Información Personal</SectionHeading>
          <div className="row">
            {/* Campos de nombre y apellidos */}
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
            {/* Campos de fecha de nacimiento y teléfono */}
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
        </FormSection>

        {/* Sección: Dirección */}
        <FormSection>
          <SectionHeading>Dirección</SectionHeading>
          <div className="row">
            {/* Campo de calle */}
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
            
            {/* Campo de colonia con dropdown de sugerencias */}
            <div className="col-md-6 mb-2">
              <label className="form-label">Colonia</label>
              <ColoniaDropdownContainer>
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
                    <DropdownToggleButton
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={toggleColoniaDropdown}
                      title="Mostrar colonias disponibles"
                    >
                      <i className={`bi bi-chevron-${showColoniaDropdown ? 'up' : 'down'}`}></i>
                    </DropdownToggleButton>
                  )}
                </div>
                
                {/* Dropdown con lista de colonias */}
                {showColoniaDropdown && colonias.length > 0 && (
                  <ColoniaDropdown>
                    {colonias.map((colonia, index) => (
                      <ColoniaDropdownItem
                        key={index}
                        onClick={() => handleColoniaSelect(colonia)}
                      >
                        {colonia}
                      </ColoniaDropdownItem>
                    ))}
                  </ColoniaDropdown>
                )}
                {errors.colonia && <div className="invalid-feedback d-block">{errors.colonia}</div>}
              </ColoniaDropdownContainer>
            </div>
          </div>
          
          <div className="row">
            {/* Campos de números de casa y código postal */}
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
                placeholder="Ingresa 5 dígitos"
              />
              {errors.codigoPostal && <div className="invalid-feedback">{errors.codigoPostal}</div>}
            </div>
          </div>
          
          <div className="row">
            {/* Campo de municipio (autocompletado) */}
            <div className="col-md-6 mb-2">
              <label className="form-label">Municipio</label>
              <input
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className={`form-control form-control-sm${errors.municipio ? " is-invalid" : ""}`}
                autoComplete="off"
                placeholder="Se autocompleta con el código postal"
              />
              {errors.municipio && <div className="invalid-feedback">{errors.municipio}</div>}
            </div>
          </div>
        </FormSection>

        {/* Sección: Información Electoral y Contacto */}
        <FormSection>
          <SectionHeading>Información Electoral y Contacto</SectionHeading>
          <div className="row">
            {/* Campos de clave de elector y email */}
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
            {/* Campos de redes sociales (opcionales) */}
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
        </FormSection>

        {/* Sección: Estructura */}
        <FormSection>
          <SectionHeading>Estructura</SectionHeading>
          <div className="row">
            {/* Campos de estructura territorial y posición */}
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
        </FormSection>

        {/* Botones de acción del formulario */}
        <ButtonContainer>
          <SecondaryButton
            type="button"
            onClick={handleReset}
          >
            Limpiar
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Registrando..." : "Registrar"}
          </PrimaryButton>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default CabezaCirculoForm;