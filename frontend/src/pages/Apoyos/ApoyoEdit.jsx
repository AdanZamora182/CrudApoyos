import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateApoyo, buscarCabezasCirculo, buscarIntegrantesCirculo } from '../../api';
import { useToaster } from '../../components/ui/ToasterProvider';
import {
  FormSection,
  SectionHeading,
  PrimaryButton,
  SecondaryButton,
  SearchResults,
  SearchResultItem,
} from '../../components/forms/FormSections.styles';

const ApoyoEdit = ({ apoyo, onClose }) => {
  const [selectedApoyo, setSelectedApoyo] = useState(null);
  const [searchBeneficiarioQuery, setSearchBeneficiarioQuery] = useState("");
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [selectedNewBeneficiario, setSelectedNewBeneficiario] = useState(null);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToaster();

  // Opciones predefinidas de tipos de apoyo
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

  // Inicializar el estado con los datos del apoyo seleccionado
  useEffect(() => {
    if (apoyo) {
      setSelectedApoyo({ ...apoyo });
      setSelectedNewBeneficiario(null);
      setSearchBeneficiarioQuery("");
      setBeneficiarios([]);
    }
  }, [apoyo]);

  // Mutación para actualizar un registro de apoyo (MOVIDA DESDE ApoyoCrud.jsx)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateApoyo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apoyos'] });
      showSuccess('Apoyo actualizado exitosamente.');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating apoyo:', error);
      showError('Error al actualizar el apoyo.');
    },
  });

  // Función para manejar cambios en los campos del formulario con validaciones
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    // Validaciones específicas por campo
    switch (field) {
      case 'cantidad':
        if (value !== '' && !/^\d+$/.test(value)) {
          return;
        }
        break;
      default:
        break;
    }

    setSelectedApoyo({ ...selectedApoyo, [field]: value });
  };

  // Función para buscar beneficiarios (MOVIDA DESDE ApoyoCrud.jsx)
  const handleSearchBeneficiarios = async (e) => {
    const query = e.target.value;
    setSearchBeneficiarioQuery(query);
    
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

  // Función para seleccionar un nuevo beneficiario (MOVIDA DESDE ApoyoCrud.jsx)
  const handleSelectNewBeneficiario = (beneficiario) => {
    setSelectedNewBeneficiario(beneficiario);
    setSearchBeneficiarioQuery("");
    setBeneficiarios([]);
  };

  // Función para formatear fechas en formato YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Función para procesar y enviar la actualización del registro (MOVIDA DESDE ApoyoCrud.jsx)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    // Crear una copia del apoyo a actualizar
    const apoyoToUpdate = { ...selectedApoyo };
    
    // Si se seleccionó un nuevo beneficiario, actualizar los datos
    if (selectedNewBeneficiario) {
      apoyoToUpdate.persona = null;
      apoyoToUpdate.cabeza = null;
      
      if (selectedNewBeneficiario.tipo === "integrante") {
        apoyoToUpdate.persona = { id: selectedNewBeneficiario.id };
      } else if (selectedNewBeneficiario.tipo === "cabeza") {
        apoyoToUpdate.cabeza = { id: selectedNewBeneficiario.id };
      }
    }

    // Manejar tipo de apoyo personalizado si "Otro" está seleccionado
    if (apoyoToUpdate.tipoApoyo === "Otro" && apoyoToUpdate.tipoApoyoCustom) {
      apoyoToUpdate.tipoApoyo = apoyoToUpdate.tipoApoyoCustom.trim();
      delete apoyoToUpdate.tipoApoyoCustom;
    }

    // Asegurar que cantidad sea un número
    if (apoyoToUpdate.cantidad) {
      apoyoToUpdate.cantidad = parseInt(apoyoToUpdate.cantidad, 10);
    }

    updateMutation.mutate({ id: apoyoToUpdate.id, data: apoyoToUpdate });
  };

  if (!selectedApoyo) return null;

  return (
    <div className="neumorphic-modal">
      <div className="neumorphic-modal-content large-modal">
        {/* Cabecera del modal */}
        <div className="modal-header">
          <h3>Editar Apoyo</h3>
          <button className="close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        {/* Contenido del modal con formulario de edición */}
        <div className="modal-content-wrapper">
          <form onSubmit={handleUpdateSubmit}>
            {/* Sección: Información del Apoyo */}
            <FormSection>
              <SectionHeading>Información del Apoyo</SectionHeading>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={selectedApoyo.cantidad || ''}
                    onChange={(e) => setSelectedApoyo({ ...selectedApoyo, cantidad: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Tipo de Apoyo</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedApoyo.tipoApoyo || ''}
                    onChange={(e) => setSelectedApoyo({ ...selectedApoyo, tipoApoyo: e.target.value })}
                    required
                  >
                    <option value="">Seleccione una opción</option>
                    {predefinedOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {selectedApoyo.tipoApoyo === "Otro" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Especifique el tipo de apoyo"
                        value={selectedApoyo.tipoApoyoCustom || ''}
                        onChange={(e) => setSelectedApoyo({
                          ...selectedApoyo,
                          tipoApoyoCustom: e.target.value,
                        })}
                        className="form-control form-control-sm"
                        autoComplete="off"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Fecha de Entrega</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={formatDate(selectedApoyo.fechaEntrega) || ''}
                    onChange={(e) => setSelectedApoyo({ ...selectedApoyo, fechaEntrega: e.target.value })}
                    required
                  />
                </div>
              </div>
            </FormSection>
            
            {/* Sección: Beneficiario Actual */}
            <FormSection>
              <SectionHeading>Beneficiario Actual</SectionHeading>
              <div className="row">
                <div className="col-md-12 mb-2">
                  <p className="text-muted">
                    {selectedApoyo.persona
                      ? `${selectedApoyo.persona.nombre} ${selectedApoyo.persona.apellidoPaterno} ${selectedApoyo.persona.apellidoMaterno} - Integrante de Círculo`
                      : selectedApoyo.cabeza
                        ? `${selectedApoyo.cabeza.nombre} ${selectedApoyo.cabeza.apellidoPaterno} ${selectedApoyo.cabeza.apellidoMaterno} - Cabeza de Círculo`
                        : "No hay beneficiario asignado"}
                  </p>
                </div>
              </div>
            </FormSection>
            
            {/* Sección: Cambiar Beneficiario */}
            <FormSection>
              <SectionHeading>Cambiar Beneficiario</SectionHeading>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Buscar Nuevo Beneficiario</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Nombre o Clave de Elector"
                      value={searchBeneficiarioQuery}
                      onChange={handleSearchBeneficiarios}
                      autoComplete="off"
                    />
                    {beneficiarios.length > 0 && (
                      <SearchResults>
                        {beneficiarios.map((beneficiario) => (
                          <SearchResultItem
                            key={`${beneficiario.tipo}-${beneficiario.id}`}
                            onClick={() => handleSelectNewBeneficiario(beneficiario)}
                          >
                            {`${beneficiario.nombre} ${beneficiario.apellidoPaterno} ${beneficiario.apellidoMaterno} - ${beneficiario.claveElector} (${beneficiario.tipo === "cabeza" ? "Cabeza de Círculo" : "Integrante de Círculo"})`}
                          </SearchResultItem>
                        ))}
                      </SearchResults>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedNewBeneficiario && (
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Nuevo Beneficiario Seleccionado</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={`${selectedNewBeneficiario.nombre} ${selectedNewBeneficiario.apellidoPaterno} ${selectedNewBeneficiario.apellidoMaterno} - ${selectedNewBeneficiario.claveElector}`}
                      readOnly
                      style={{ backgroundColor: '#f3f6ff', borderLeft: '3px solid #5c6bc0', fontWeight: '500' }}
                    />
                  </div>
                </div>
              )}
            </FormSection>

            {/* Botones de acción del formulario */}
            <div className="d-flex justify-content-end gap-2 mt-3 mb-2">
              <SecondaryButton type="button" onClick={onClose}>
                <i className="bi bi-x-circle me-2"></i>Cancelar
              </SecondaryButton>
              <PrimaryButton 
                type="submit" 
                disabled={updateMutation.isPending}
              >
                <i className="bi bi-floppy me-2"></i>
                {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApoyoEdit;
