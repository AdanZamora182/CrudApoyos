import React from 'react';
import './IntegranteCirculo.css';

const IntegranteCirculoView = ({ integrante, onClose }) => {
  // Función para formatear fechas en formato YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!integrante) return null;

  return (
    <div className="neumorphic-modal" onClick={onClose}>
      <div className="neumorphic-modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalles Completos</h3>
          <button 
            className="close" 
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="details-container">
          {/* Información del Integrante de Círculo */}
          <div className="details-section">
            <h4 className="section-title">Información del Integrante de Círculo</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{integrante.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Nombre Completo:</span>
                <span className="detail-value">
                  {`${integrante.nombre} ${integrante.apellidoPaterno} ${integrante.apellidoMaterno}`}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha de Nacimiento:</span>
                <span className="detail-value">{formatDate(integrante.fechaNacimiento)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Teléfono:</span>
                <span className="detail-value">{integrante.telefono}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Dirección:</span>
                <span className="detail-value">
                  {`${integrante.calle} ${integrante.noExterior}${integrante.noInterior ? `, Int. ${integrante.noInterior}` : ''}, ${integrante.colonia}, C.P. ${integrante.codigoPostal}`}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Clave de Elector:</span>
                <span className="detail-value">{integrante.claveElector}</span>
              </div>
            </div>
          </div>
          
          {/* Información del Líder (Cabeza de Círculo) */}
          {integrante.lider ? (
            <div className="details-section">
              <h4 className="section-title">Información del Líder (Cabeza de Círculo)</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{integrante.lider.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nombre Completo:</span>
                  <span className="detail-value">
                    {`${integrante.lider.nombre} ${integrante.lider.apellidoPaterno} ${integrante.lider.apellidoMaterno}`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha de Nacimiento:</span>
                  <span className="detail-value">{formatDate(integrante.lider.fechaNacimiento)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teléfono:</span>
                  <span className="detail-value">{integrante.lider.telefono}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dirección:</span>
                  <span className="detail-value">
                    {`${integrante.lider.calle} ${integrante.lider.noExterior}${integrante.lider.noInterior ? `, Int. ${integrante.lider.noInterior}` : ''}, ${integrante.lider.colonia}, C.P. ${integrante.lider.codigoPostal}${integrante.lider.municipio ? `, ${integrante.lider.municipio}` : ''}`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Clave de Elector:</span>
                  <span className="detail-value">{integrante.lider.claveElector}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{integrante.lider.email || "-"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Redes Sociales:</span>
                  <span className="detail-value">
                    {integrante.lider.facebook ? `Facebook: ${integrante.lider.facebook}` : ''}
                    {integrante.lider.facebook && integrante.lider.otraRedSocial ? ' | ' : ''}
                    {integrante.lider.otraRedSocial ? `Otra: ${integrante.lider.otraRedSocial}` : ''}
                    {!integrante.lider.facebook && !integrante.lider.otraRedSocial ? '-' : ''}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estructura Territorial:</span>
                  <span className="detail-value">{integrante.lider.estructuraTerritorial || "-"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Posición en Estructura:</span>
                  <span className="detail-value">{integrante.lider.posicionEstructura || "-"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="details-section">
              <h4 className="section-title">Información del Líder</h4>
              <p className="no-leader-message">Este integrante no tiene un líder (Cabeza de Círculo) asignado.</p>
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

export default IntegranteCirculoView;
