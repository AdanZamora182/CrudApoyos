import React, { useState, useEffect } from "react";
import { buscarIntegrantesCirculo, deleteIntegranteCirculo, updateIntegranteCirculo, buscarCabezasCirculo } from "../../api";
import "./IntegranteCirculo.css";

const IntegranteCirculoCRUD = () => {
  const [integrantesCirculo, setIntegrantesCirculo] = useState([]);
  const [filteredIntegrantes, setFilteredIntegrantes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntegrante, setSelectedIntegrante] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination states - update to use unique localStorage key and properly manage page across navigation
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('integranteCirculoCurrentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [recordsPerPage] = useState(12);

  // Ensure the pagination state is loaded when component mounts and whenever we return to this component
  useEffect(() => {
    const savedPage = localStorage.getItem('integranteCirculoCurrentPage');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  // Add these new state variables for leader search and selection
  const [searchLiderQuery, setSearchLiderQuery] = useState("");
  const [searchLiderResults, setSearchLiderResults] = useState([]);

  // Add new state for view details modal
  const [viewDetailsIntegrante, setViewDetailsIntegrante] = useState(null);

  useEffect(() => {
    fetchIntegrantesCirculo();
  }, []);

  const fetchIntegrantesCirculo = async () => {
    setIsLoading(true);
    try {
      const response = await buscarIntegrantesCirculo(""); // Fetch all records
      // Sort records by ID in descending order (newest first)
      const sortedRecords = response.sort((a, b) => b.id - a.id);
      setIntegrantesCirculo(sortedRecords);
      setFilteredIntegrantes(sortedRecords); // Inicialmente, todos los registros están visibles
    } catch (error) {
      console.error("Error fetching integrantes de círculo:", error);
      setMessage({ type: "error", text: "Error al cargar los datos." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este registro?")) {
      try {
        await deleteIntegranteCirculo(id);
        setMessage({ type: "success", text: "Registro eliminado exitosamente." });
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 5000);
        
        fetchIntegrantesCirculo(); // Refresh the list
      } catch (error) {
        console.error("Error deleting record:", error);
        setMessage({ type: "error", text: "Error al eliminar el registro." });
      }
    }
  };

  const handleEdit = (integrante) => {
    setSelectedIntegrante(integrante); // Abre el formulario de edición
  };

  // Input validation for specific fields
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    // Field-specific validations
    switch (field) {
      case 'telefono':
        // Only allow numbers, max 10 characters
        if (value !== '' && !/^\d+$/.test(value) || value.length > 10) {
          return;
        }
        break;
      case 'codigoPostal':
        // Only allow numbers, max 5 characters
        if (value !== '' && !/^\d+$/.test(value) || value.length > 5) {
          return;
        }
        break;
      case 'noExterior':
      case 'noInterior':
        // Only allow numbers
        if (value !== '' && !/^\d+$/.test(value)) {
          return;
        }
        break;
      case 'claveElector':
        // Max 18 characters
        if (value.length > 18) {
          return;
        }
        break;
      default:
        break;
    }

    // Update the state
    setSelectedIntegrante({ ...selectedIntegrante, [field]: value });
  };

  // Add this function to handle searching for Cabezas de Círculo
  const handleSearchLider = async (e) => {
    const query = e.target.value;
    setSearchLiderQuery(query);
    
    if (query.length > 2) {
      try {
        const results = await buscarCabezasCirculo(query);
        setSearchLiderResults(results);
      } catch (error) {
        console.error("Error al buscar cabezas de círculo:", error);
      }
    } else {
      setSearchLiderResults([]);
    }
  };

  // Add this function to handle selecting a new leader
  const handleSelectLider = (cabeza) => {
    setSelectedIntegrante({
      ...selectedIntegrante,
      lider: cabeza
    });
    setSearchLiderQuery("");
    setSearchLiderResults([]);
  };

  // Add this function to handle removing a leader
  const handleRemoveLider = () => {
    setSelectedIntegrante({
      ...selectedIntegrante,
      lider: null
    });
  };

  const handleUpdateSubmit = async (updatedIntegrante) => {
    try {
      // Parse numeric fields
      const formattedIntegrante = {
        ...updatedIntegrante,
        telefono: updatedIntegrante.telefono ? Number.parseInt(updatedIntegrante.telefono) : null,
        noExterior: updatedIntegrante.noExterior ? Number.parseInt(updatedIntegrante.noExterior) : null,
        noInterior: updatedIntegrante.noInterior ? Number.parseInt(updatedIntegrante.noInterior) : null,
        codigoPostal: updatedIntegrante.codigoPostal ? Number.parseInt(updatedIntegrante.codigoPostal) : null,
        // Properly format the lider field - if there's a lider object, keep only its id
        lider: updatedIntegrante.lider ? { id: updatedIntegrante.lider.id } : null
      };

      await updateIntegranteCirculo(formattedIntegrante.id, formattedIntegrante);
      setMessage({ type: "success", text: "Registro actualizado exitosamente." });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      
      setSelectedIntegrante(null); // Cierra el formulario de edición
      fetchIntegrantesCirculo(); // Refresca la lista
    } catch (error) {
      console.error("Error updating record:", error);
      setMessage({ type: "error", text: "Error al actualizar el registro." });
      
      // Clear error message after 10 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 10000);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = integrantesCirculo.filter((integrante) =>
      integrante.nombre?.toLowerCase().includes(query) ||
      integrante.apellidoPaterno?.toLowerCase().includes(query) ||
      integrante.apellidoMaterno?.toLowerCase().includes(query) ||
      integrante.claveElector?.toLowerCase().includes(query)
    );

    // Ensure filtered results are also sorted by ID in descending order
    const sortedFiltered = filtered.sort((a, b) => b.id - a.id);
    setFilteredIntegrantes(sortedFiltered);
  };

  // Format date for display (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredIntegrantes.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredIntegrantes.length / recordsPerPage);

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('integranteCirculoCurrentPage', currentPage.toString());
  }, [currentPage]);

  // Change page with localStorage persistence
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem('integranteCirculoCurrentPage', pageNumber.toString());
  };

  // Next page with localStorage persistence
  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      localStorage.setItem('integranteCirculoCurrentPage', newPage.toString());
    }
  };

  // Previous page with localStorage persistence
  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      localStorage.setItem('integranteCirculoCurrentPage', newPage.toString());
    }
  };

  // Reset to first page when search changes, but preserve in localStorage
  useEffect(() => {
    setCurrentPage(1);
    localStorage.setItem('integranteCirculoCurrentPage', '1');
  }, [searchQuery]);

  // Improved page number display logic for pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7; // Maximum number of page buttons to show
    
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than our max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`page-number ${currentPage === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Always show first page
      pageNumbers.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={`page-number ${currentPage === 1 ? 'active' : ''}`}
        >
          1
        </button>
      );

      // If current page is close to the beginning
      if (currentPage < maxVisiblePages - 2) {
        for (let i = 2; i < maxVisiblePages; i++) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => paginate(i)}
              className={`page-number ${currentPage === i ? 'active' : ''}`}
            >
              {i}
            </button>
          );
        }
        // Show ellipsis and last page
        pageNumbers.push(<span key="ellipsis-end" className="ellipsis">...</span>);
        pageNumbers.push(
          <button
            key={totalPages}
            onClick={() => paginate(totalPages)}
            className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
          >
            {totalPages}
          </button>
        );
      } 
      // If current page is close to the end
      else if (currentPage > totalPages - (maxVisiblePages - 3)) {
        // Show ellipsis after first page
        pageNumbers.push(<span key="ellipsis-start" className="ellipsis">...</span>);
        
        // Show the last several pages
        for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => paginate(i)}
              className={`page-number ${currentPage === i ? 'active' : ''}`}
            >
              {i}
            </button>
          );
        }
      } 
      // If current page is in the middle
      else {
        // Show ellipsis after first page
        pageNumbers.push(<span key="ellipsis-start" className="ellipsis">...</span>);
        
        // Show pages around current page
        const startPage = currentPage - 2;
        const endPage = currentPage + 2;
        
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => paginate(i)}
              className={`page-number ${currentPage === i ? 'active' : ''}`}
            >
              {i}
            </button>
          );
        }
        
        // Show ellipsis and last page
        pageNumbers.push(<span key="ellipsis-end" className="ellipsis">...</span>);
        pageNumbers.push(
          <button
            key={totalPages}
            onClick={() => paginate(totalPages)}
            className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
          >
            {totalPages}
          </button>
        );
      }
    }
    
    return pageNumbers;
  };

  // Add handler for viewing details
  const handleViewDetails = (integrante) => {
    setViewDetailsIntegrante(integrante);
  };

  return (
    <div className="neumorphic-crud-container responsive-container">
      <div className="neumorphic-controls responsive-controls">
        <div className="neumorphic-search responsive-search w-100 w-md-50 position-relative">
          <input
            type="text"
            placeholder="Buscar por Nombre o Clave de Elector..."
            value={searchQuery}
            onChange={handleSearch}
            className="neumorphic-input search-input responsive-input w-100 pe-5"
          />
          <span className="search-icon responsive-icon position-absolute end-0 top-50 translate-middle-y me-2">
            <i className="bi bi-search"></i>
          </span>
        </div>
        {/* New position for messages */}
        {message.text && (
          <div className="inline-message-container">
            <div className={`inline-message inline-message-${message.type}`}>
              {message.type === "success" ? "✅ " : "⚠️ "}
              {message.text}
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="neumorphic-loader-container">
          <div className="neumorphic-loader"></div>
          <p>Cargando datos...</p>
        </div>
      ) : filteredIntegrantes.length === 0 ? (
        <div className="neumorphic-empty-state">
          <span className="empty-icon">🔍</span>
          <p>No se encontraron registros que coincidan con su búsqueda</p>
        </div>
      ) : (
        <>
          <div className="neumorphic-table-container responsive-table-container">
            <table className="neumorphic-table responsive-table">
              <thead>
                <tr>
                  <th className="col-name responsive-column">Nombre</th>
                  <th className="col-apellido">Apellido Paterno</th>
                  <th className="col-apellido">Apellido Materno</th>
                  <th className="col-date">Fecha de Nacimiento</th>
                  <th className="col-address">Calle</th>
                  <th className="col-number">No. Exterior</th>
                  <th className="col-number">No. Interior</th>
                  <th className="col-address">Colonia</th>
                  <th className="col-number">Código Postal</th>
                  <th className="col-address">Clave de Elector</th>
                  <th className="col-number">Teléfono</th>
                  <th className="col-leader">Líder</th>
                  <th className="col-address">Clave de Elector Líder</th>
                  <th className="fixed-column responsive-column">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((integrante) => (
                  <tr key={integrante.id} className="responsive-row">
                    <td className="responsive-cell">{integrante.nombre}</td>
                    <td>{integrante.apellidoPaterno}</td>
                    <td>{integrante.apellidoMaterno}</td>
                    <td>{formatDate(integrante.fechaNacimiento)}</td>
                    <td>{integrante.calle}</td>
                    <td>{integrante.noExterior}</td>
                    <td>{integrante.noInterior || "-"}</td>
                    <td>{integrante.colonia}</td>
                    <td>{integrante.codigoPostal}</td>
                    <td>{integrante.claveElector}</td>
                    <td>{integrante.telefono}</td>
                    <td>
                      {integrante.lider ? 
                        `${integrante.lider.nombre} ${integrante.lider.apellidoPaterno} ${integrante.lider.apellidoMaterno}` : 
                        "-"}
                    </td>
                    <td>
                      {integrante.lider ? 
                        `${integrante.lider.claveElector}` : 
                        "-"}
                    </td>
                    <td className="fixed-column action-column responsive-action-column">
                      <button 
                        className="action-button view responsive-button"
                        onClick={() => handleViewDetails(integrante)}
                        title="Ver Detalles"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button 
                        className="action-button edit responsive-button"
                        onClick={() => handleEdit(integrante)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button 
                        className="action-button delete responsive-button"
                        onClick={() => handleDelete(integrante.id)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="pagination-container responsive-pagination-container" style={{ background: 'none', boxShadow: 'none' }}>
            <div className="pagination-info responsive-pagination-info">
              Mostrando {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredIntegrantes.length)} de {filteredIntegrantes.length} registros
            </div>
            <div className="pagination-controls responsive-pagination-controls">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1} 
                className="pagination-button responsive-pagination-button"
                title="Página anterior"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              
              {/* Show page numbers */}
              <div className="page-numbers responsive-page-numbers">
                {renderPageNumbers()}
              </div>
              
              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages} 
                className="pagination-button responsive-pagination-button"
                title="Página siguiente"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </>
      )}

      {selectedIntegrante && (
        <div className="neumorphic-modal">
          <div className="neumorphic-modal-content large-modal">
            <div className="modal-header">
              <h3>Editar Registro</h3>
              <button 
                className="neumorphic-button icon-button small close" 
                onClick={() => setSelectedIntegrante(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateSubmit(selectedIntegrante);
              }}
              className="edit-form"
            >
              <div className="modal-sections">
                <div className="modal-section">
                  <h4 className="section-title">Información Personal</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre(s)</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.nombre || ''}
                        onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido Paterno</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.apellidoPaterno || ''}
                        onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, apellidoPaterno: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido Materno</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.apellidoMaterno || ''}
                        onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, apellidoMaterno: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="neumorphic-input"
                        value={formatDate(selectedIntegrante.fechaNacimiento) || ''}
                        onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, fechaNacimiento: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.telefono || ''}
                        onChange={(e) => handleInputChange(e, 'telefono')}
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h4 className="section-title">Dirección</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Calle</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.calle || ''}
                        onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, calle: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Colonia</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.colonia || ''}
                        onChange={(e) => setSelectedIntegrante({ ...selectedIntegrante, colonia: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>No. Exterior</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.noExterior || ''}
                        onChange={(e) => handleInputChange(e, 'noExterior')}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>No. Interior</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.noInterior || ''}
                        onChange={(e) => handleInputChange(e, 'noInterior')}
                      />
                    </div>
                    <div className="form-group">
                      <label>Código Postal</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.codigoPostal || ''}
                        onChange={(e) => handleInputChange(e, 'codigoPostal')}
                        maxLength="5"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h4 className="section-title">Información Electoral</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Clave de Elector</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedIntegrante.claveElector || ''}
                        onChange={(e) => handleInputChange(e, 'claveElector')}
                        maxLength="18"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Add new Leader Section */}
                <div className="modal-section">
                  <h4 className="section-title">Cabeza de Círculo</h4>
                  <div className="form-row">
                    <div className="form-group" style={{ position: "relative" }}>
                      <label>Buscar Cabeza de Círculo</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        placeholder="Nombre o Clave de Elector"
                        value={searchLiderQuery}
                        onChange={handleSearchLider}
                        autoComplete="off"
                      />
                      {searchLiderResults.length > 0 && (
                        <ul className="search-results">
                          {searchLiderResults.map((cabeza) => (
                            <li
                              key={cabeza.id}
                              onClick={() => handleSelectLider(cabeza)}
                              className="search-result-item"
                            >
                              {`${cabeza.nombre} ${cabeza.apellidoPaterno} ${cabeza.apellidoMaterno} - ${cabeza.claveElector}`}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  
                  {selectedIntegrante.lider ? (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Cabeza de Círculo Seleccionada</label>
                        <div className="selected-lider-container">
                          <input
                            type="text"
                            className="neumorphic-input selected-lider"
                            value={`${selectedIntegrante.lider.nombre} ${selectedIntegrante.lider.apellidoPaterno} ${selectedIntegrante.lider.apellidoMaterno} - ${selectedIntegrante.lider.claveElector}`}
                            readOnly
                          />
                          <button 
                            type="button" 
                            className="remove-lider-btn"
                            onClick={handleRemoveLider}
                            title="Eliminar asociación"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="form-row">
                      <div className="form-group">
                        <p className="no-leader-text">Sin Cabeza de Círculo asignada</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="neumorphic-button cancel" onClick={() => setSelectedIntegrante(null)}>
                  <i className="bi bi-x-circle me-2"></i>Cancelar
                </button>
                <button type="submit" className="neumorphic-button primary">
                  <i className="bi bi-floppy me-2"></i>Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add new details view modal */}
      {viewDetailsIntegrante && (
        <div className="neumorphic-modal" onClick={() => setViewDetailsIntegrante(null)}>
          <div className="neumorphic-modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalles Completos</h3>
              <button 
                className="neumorphic-button icon-button small close" 
                onClick={() => setViewDetailsIntegrante(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="details-container">
              <div className="details-section">
                <h4 className="section-title">Información del Integrante de Círculo</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{viewDetailsIntegrante.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nombre Completo:</span>
                    <span className="detail-value">{`${viewDetailsIntegrante.nombre} ${viewDetailsIntegrante.apellidoPaterno} ${viewDetailsIntegrante.apellidoMaterno}`}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha de Nacimiento:</span>
                    <span className="detail-value">{formatDate(viewDetailsIntegrante.fechaNacimiento)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Teléfono:</span>
                    <span className="detail-value">{viewDetailsIntegrante.telefono}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Dirección:</span>
                    <span className="detail-value">
                      {`${viewDetailsIntegrante.calle} ${viewDetailsIntegrante.noExterior}${viewDetailsIntegrante.noInterior ? `, Int. ${viewDetailsIntegrante.noInterior}` : ''}, ${viewDetailsIntegrante.colonia}, C.P. ${viewDetailsIntegrante.codigoPostal}`}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Clave de Elector:</span>
                    <span className="detail-value">{viewDetailsIntegrante.claveElector}</span>
                  </div>
                </div>
              </div>
              
              {viewDetailsIntegrante.lider ? (
                <div className="details-section">
                  <h4 className="section-title">Información del Líder (Cabeza de Círculo)</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Nombre Completo:</span>
                      <span className="detail-value">{`${viewDetailsIntegrante.lider.nombre} ${viewDetailsIntegrante.lider.apellidoPaterno} ${viewDetailsIntegrante.lider.apellidoMaterno}`}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fecha de Nacimiento:</span>
                      <span className="detail-value">{formatDate(viewDetailsIntegrante.lider.fechaNacimiento)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.telefono}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dirección:</span>
                      <span className="detail-value">
                        {`${viewDetailsIntegrante.lider.calle} ${viewDetailsIntegrante.lider.noExterior}${viewDetailsIntegrante.lider.noInterior ? `, Int. ${viewDetailsIntegrante.lider.noInterior}` : ''}, ${viewDetailsIntegrante.lider.colonia}, C.P. ${viewDetailsIntegrante.lider.codigoPostal}${viewDetailsIntegrante.lider.municipio ? `, ${viewDetailsIntegrante.lider.municipio}` : ''}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Clave de Elector:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.claveElector}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.email || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Redes Sociales:</span>
                      <span className="detail-value">
                        {viewDetailsIntegrante.lider.facebook ? `Facebook: ${viewDetailsIntegrante.lider.facebook}` : ''}
                        {viewDetailsIntegrante.lider.facebook && viewDetailsIntegrante.lider.otraRedSocial ? ' | ' : ''}
                        {viewDetailsIntegrante.lider.otraRedSocial ? `Otra: ${viewDetailsIntegrante.lider.otraRedSocial}` : ''}
                        {!viewDetailsIntegrante.lider.facebook && !viewDetailsIntegrante.lider.otraRedSocial ? '-' : ''}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estructura Territorial:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.estructuraTerritorial || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Posición en Estructura:</span>
                      <span className="detail-value">{viewDetailsIntegrante.lider.posicionEstructura || "-"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="details-section">
                  <h4 className="section-title">Información del Líder</h4>
                  <p className="no-leader-message">Este integrante no tiene un líder (Cabeza de Círculo) asignado.</p>
                </div>
              )}
              
              <div className="modal-footer">
                <button 
                  className="neumorphic-button primary" 
                  onClick={() => setViewDetailsIntegrante(null)}
                >
                  <i className="bi bi-check-circle me-2"></i>Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegranteCirculoCRUD;
