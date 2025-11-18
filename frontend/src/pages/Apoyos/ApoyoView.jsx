import React from 'react';
import './ApoyoForm.css';

const ApoyoView = ({ apoyo, onClose }) => {
  // Función para formatear fechas en formato YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!apoyo) return null;

  return (
    <div className="neumorphic-modal">
      <div className="neumorphic-modal-content large-modal">
        <div className="modal-header">
          <h3>Detalles del Apoyo</h3>
          <button 
            className="close" 
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="details-container">
          {/* Información del Apoyo */}
          <div className="details-section">
            <h4>Información del Apoyo</h4>
            <div className="details-grid wide-grid">
              <div className="detail-item">
                <span className="detail-label">ID</span>
                <span className="detail-value">{apoyo.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tipo de Apoyo</span>
                <span className="detail-value">{apoyo.tipoApoyo}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cantidad</span>
                <span className="detail-value">{apoyo.cantidad}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha de Entrega</span>
                <span className="detail-value">{formatDate(apoyo.fechaEntrega)}</span>
              </div>
            </div>
          </div>
          
          {/* Información del Beneficiario */}
          <div className="details-section">
            <h4>Información del Beneficiario</h4>
            {apoyo.persona ? (
              <div className="details-grid wide-grid">
                <div className="detail-item">
                  <span className="detail-label">Tipo</span>
                  <span className="detail-value">Integrante de Círculo</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nombre Completo</span>
                  <span className="detail-value">
                    {`${apoyo.persona.nombre} ${apoyo.persona.apellidoPaterno} ${apoyo.persona.apellidoMaterno}`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Clave de Elector</span>
                  <span className="detail-value">{apoyo.persona.claveElector}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teléfono</span>
                  <span className="detail-value">{apoyo.persona.telefono}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dirección</span>
                  <span className="detail-value">
                    {`${apoyo.persona.calle} #${apoyo.persona.noExterior}
                     ${apoyo.persona.noInterior ? ", Int: " + apoyo.persona.noInterior : ""}, 
                     Col. ${apoyo.persona.colonia}, CP: ${apoyo.persona.codigoPostal}`}
                  </span>
                </div>
              </div>
            ) : apoyo.cabeza ? (
              <div className="details-grid wide-grid">
                <div className="detail-item">
                  <span className="detail-label">Tipo</span>
                  <span className="detail-value">Cabeza de Círculo</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nombre Completo</span>
                  <span className="detail-value">
                    {`${apoyo.cabeza.nombre} ${apoyo.cabeza.apellidoPaterno} ${apoyo.cabeza.apellidoMaterno}`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Clave de Elector</span>
                  <span className="detail-value">{apoyo.cabeza.claveElector}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teléfono</span>
                  <span className="detail-value">{apoyo.cabeza.telefono}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dirección</span>
                  <span className="detail-value">
                    {`${apoyo.cabeza.calle} #${apoyo.cabeza.noExterior}
                     ${apoyo.cabeza.noInterior ? ", Int: " + apoyo.cabeza.noInterior : ""}, 
                     Col. ${apoyo.cabeza.colonia}, CP: ${apoyo.cabeza.codigoPostal}`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estructura Territorial</span>
                  <span className="detail-value">{apoyo.cabeza.estructuraTerritorial || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Posición en Estructura</span>
                  <span className="detail-value">{apoyo.cabeza.posicionEstructura || "N/A"}</span>
                </div>
              </div>
            ) : (
              <p>No se encontró información del beneficiario</p>
            )}
          </div>
          
          {/* Mostrar Cabeza de Círculo si el beneficiario es un Integrante con líder */}
          {apoyo.persona && apoyo.persona.lider && (
            <div className="details-section">
              <h4>Cabeza de Círculo Asociada</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Nombre Completo</span>
                  <span className="detail-value">
                    {`${apoyo.persona.lider.nombre} ${apoyo.persona.lider.apellidoPaterno} ${apoyo.persona.lider.apellidoMaterno}`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Clave de Elector</span>
                  <span className="detail-value">{apoyo.persona.lider.claveElector}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teléfono</span>
                  <span className="detail-value">{apoyo.persona.lider.telefono}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estructura Territorial</span>
                  <span className="detail-value">{apoyo.persona.lider.estructuraTerritorial || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Posición en Estructura</span>
                  <span className="detail-value">{apoyo.persona.lider.posicionEstructura || "N/A"}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Footer del modal con botón de cerrar */}
          <div className="modal-footer">
            <button 
              className="close modal-close-button" 
              onClick={onClose}
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                borderRadius: '6px',
                padding: '8px 16px',
                width: 'auto',
                height: 'auto',
                fontSize: '14px'
              }}
            >
              <i className="bi bi-check-circle me-2"></i>Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApoyoView;
