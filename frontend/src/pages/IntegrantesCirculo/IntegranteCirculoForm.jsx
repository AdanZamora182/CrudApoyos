import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createIntegranteCirculo, buscarCabezasCirculo, buscarMunicipioPorCP, buscarColoniasPorCP } from "../../api";
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
  LeaderSection,
  LeaderPlaceholder,
  SearchResults,
  SearchResultItem,
  SelectedLiderContainer,
  SelectedBeneficiaryInput,
  RemoveLiderButton,
  PrimaryButton,
  SecondaryButton,
  ButtonContainer
} from '../../components/forms/FormSections.styles';

const IntegranteCirculoForm = ({ hideHeader = false }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToaster();
  
  // Estado inicial del formulario con todos los campos requeridos
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
    municipio: "",
    claveElector: "",
    telefono: "",
    lider: "",
  };

  // Estados del componente para manejo del formulario
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cabezasCirculo, setCabezasCirculo] = useState([]);
  const [selectedLider, setSelectedLider] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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

    // Limpiar errores cuando el usuario comience a escribir
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
    const optionalFields = ["noInterior", "lider"];

    // Verificar campos obligatorios
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

  // Función para buscar cabezas de círculo disponibles
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

  // Función para seleccionar un líder de la lista de búsqueda
  const handleSelectLider = (cabeza) => {
    setSelectedLider(cabeza);
    setFormData({ ...formData, lider: cabeza.id });
    setSearchQuery("");
    setCabezasCirculo([]);
  };

  // Función para remover el líder seleccionado
  const handleRemoveLider = () => {
    setSelectedLider(null);
    setFormData({ ...formData, lider: "" });
  };

  // Función para procesar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!validateForm()) {
      showWarning("Por favor, complete correctamente todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar al backend
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
        municipio: formData.municipio,
        claveElector: formData.claveElector,
        telefono: parseInt(formData.telefono, 10),
        lider: formData.lider ? { id: parseInt(formData.lider, 10) } : null,
      };
      
      console.log("Datos a enviar al backend:", integranteData);

      // Enviar datos al backend
      await createIntegranteCirculo(integranteData);

      // Mostrar toast de éxito
      showSuccess("Integrante de círculo registrado exitosamente.");

      // Limpiar formulario después del éxito
      setFormData(initialFormState);
      setErrors({});
      setSelectedLider(null);
    } catch (error) {
      console.error("Error al registrar integrante de círculo:", error);
      
      // Manejar errores del backend
      const backendErrorMessage = error.response?.data?.message || "Error al registrar integrante de círculo. Verifique los datos e inténtelo de nuevo.";
      const displayMessage = Array.isArray(backendErrorMessage) ? backendErrorMessage.join(', ') : backendErrorMessage;
      
      // Detectar si es error de clave de elector duplicada
      if (displayMessage.toLowerCase().includes('clave') || displayMessage.toLowerCase().includes('existe') || displayMessage.toLowerCase().includes('duplicad') || displayMessage.toLowerCase().includes('unique')) {
        showError("Clave de elector duplicada, verifique la información.");
      } else {
        showError(displayMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar el formulario
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setSelectedLider(null);
    setSearchQuery("");
    setCabezasCirculo([]);
    setColonias([]);
    setShowColoniaDropdown(false);
  };

  return (
    <FormContainer className={`container mt-3 mb-4`}>
      {/* Estilos globales para el formulario */}
      <FormGlobalStyles />
      
      {/* Mostrar encabezado si no está oculto */}
      {!hideHeaderState && (
        <div className="mb-4">
          <h1 className="h4 text-primary">Registro de Integrante de Círculo</h1>
        </div>
      )}

      {/* Formulario principal */}
      <form onSubmit={handleSubmit}>
        {/* Sección: Información Personal */}
        <FormSection>
          <SectionHeading>Información Personal</SectionHeading>
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
        </FormSection>
        
        {/* Sección: Dirección */}
        <FormSection>
          <SectionHeading>Dirección</SectionHeading>
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
        
        {/* Sección: Información Electoral */}
        <FormSection>
          <SectionHeading>Información Electoral</SectionHeading>
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
          </div>
        </FormSection>

        {/* Sección: Asociar Cabeza de Círculo */}
        <FormSection>
          <SectionHeading>Asociar Cabeza de Círculo</SectionHeading>
          <LeaderSection>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Buscar Cabeza de Círculo</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Nombre o Clave de Elector"
                    value={searchQuery}
                    onChange={handleSearchCabezas}
                    autoComplete="off"
                  />
                  {cabezasCirculo.length > 0 && (
                    <SearchResults>
                      {cabezasCirculo.map((cabeza) => (
                        <SearchResultItem
                          key={cabeza.id}
                          onClick={() => handleSelectLider(cabeza)}
                        >
                          {`${cabeza.nombre} ${cabeza.apellidoPaterno} ${cabeza.apellidoMaterno} - ${cabeza.claveElector}`}
                        </SearchResultItem>
                      ))}
                    </SearchResults>
                  )}
                </div>
              </div>
            </div>
            
            {selectedLider ? (
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Cabeza de Círculo Seleccionada</label>
                  <SelectedLiderContainer>
                    <SelectedBeneficiaryInput
                      type="text"
                      className="form-control form-control-sm"
                      value={`${selectedLider.nombre} ${selectedLider.apellidoPaterno} ${selectedLider.apellidoMaterno} - ${selectedLider.claveElector}`}
                      readOnly
                    />
                    <RemoveLiderButton
                      type="button"
                      onClick={handleRemoveLider}
                      title="Quitar selección"
                    >
                      <i className="bi bi-x"></i>
                    </RemoveLiderButton>
                  </SelectedLiderContainer>
                </div>
              </div>
            ) : (
              <LeaderPlaceholder />
            )}
          </LeaderSection>
        </FormSection>

        {/* Botones de acción del formulario */}
        <ButtonContainer>
          <SecondaryButton type="button" onClick={handleReset}>
            Limpiar
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </PrimaryButton>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default IntegranteCirculoForm;