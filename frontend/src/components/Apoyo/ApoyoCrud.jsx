import React, { useState, useEffect } from "react";
import { getApoyos, deleteApoyo, updateApoyo, buscarCabezasCirculo, buscarIntegrantesCirculo } from "../../api";
import "./ApoyoForm.css";

const ApoyoCRUD = () => {
  const [apoyos, setApoyos] = useState([]);
  const [filteredApoyos, setFilteredApoyos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApoyo, setSelectedApoyo] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [viewDetailsApoyo, setViewDetailsApoyo] = useState(null);
  const [searchBeneficiarioQuery, setSearchBeneficiarioQuery] = useState("");
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [selectedNewBeneficiario, setSelectedNewBeneficiario] = useState(null);
  
  // Pagination states - load from localStorage
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('apoyoCurrentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [recordsPerPage] = useState(12);

  // Ensure the pagination state is loaded when component mounts
  useEffect(() => {
    const savedPage = localStorage.getItem('apoyoCurrentPage');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  useEffect(() => {
    fetchApoyos();
  }, []);

  const fetchApoyos = async () => {
    setIsLoading(true);
    try {
      const response = await getApoyos();
      // Sort records by ID in descending order (newest first)
      const sortedRecords = response.sort((a, b) => b.id - a.id);
      setApoyos(sortedRecords);
      setFilteredApoyos(sortedRecords);
    } catch (error) {
      console.error("Error fetching apoyos:", error);
      setMessage({ type: "error", text: "Error al cargar los datos de apoyos." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este apoyo?")) {
      try {
        await deleteApoyo(id);
        setMessage({ type: "success", text: "Apoyo eliminado exitosamente." });
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 5000);
        
        fetchApoyos(); // Refresh the list
      } catch (error) {
        console.error("Error deleting apoyo:", error);
        setMessage({ type: "error", text: "Error al eliminar el apoyo." });
      }
    }
  };

  // Modified handleEdit function to reset the beneficiary search state
  const handleEdit = (apoyo) => {
    setSelectedApoyo(apoyo);
    setSelectedNewBeneficiario(null);
    setSearchBeneficiarioQuery("");
    setBeneficiarios([]);
  };

  // Input validation for specific fields
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    // Field-specific validations
    switch (field) {
      case 'cantidad':
        // Only allow numbers
        if (value !== '' && !/^\d+$/.test(value)) {
          return;
        }
        break;
      default:
        break;
    }

    // Update the state
    setSelectedApoyo({ ...selectedApoyo, [field]: value });
  };

  // Add this handler for beneficiary search when editing
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

  // Add handler for selecting a new beneficiary
  const handleSelectNewBeneficiario = (beneficiario) => {
    setSelectedNewBeneficiario(beneficiario);
    setSearchBeneficiarioQuery(""); // Clear the search query
    setBeneficiarios([]); // Clear the search results
  };

  // Add the predefined options list (same as in ApoyoForm)
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

  // Update handleUpdateSubmit function to handle custom tipo apoyo
  const handleUpdateSubmit = async (updatedApoyo) => {
    try {
      // Create a copy of the updated apoyo to modify
      const apoyoToUpdate = { ...updatedApoyo };
      
      // If a new beneficiary was selected, update the apoyo data
      if (selectedNewBeneficiario) {
        // Reset both beneficiary types first
        apoyoToUpdate.persona = null;
        apoyoToUpdate.cabeza = null;
        
        // Set the appropriate beneficiary based on type
        if (selectedNewBeneficiario.tipo === "integrante") {
          apoyoToUpdate.persona = { id: selectedNewBeneficiario.id };
        } else if (selectedNewBeneficiario.tipo === "cabeza") {
          apoyoToUpdate.cabeza = { id: selectedNewBeneficiario.id };
        }
      }

      // Handle custom tipo apoyo if "Otro" is selected
      if (apoyoToUpdate.tipoApoyo === "Otro" && apoyoToUpdate.tipoApoyoCustom) {
        apoyoToUpdate.tipoApoyo = apoyoToUpdate.tipoApoyoCustom.trim();
        delete apoyoToUpdate.tipoApoyoCustom; // Remove the custom field before sending to API
      }

      // Ensure cantidad is a number
      if (apoyoToUpdate.cantidad) {
        apoyoToUpdate.cantidad = parseInt(apoyoToUpdate.cantidad, 10);
      }

      await updateApoyo(apoyoToUpdate.id, apoyoToUpdate);
      setMessage({ type: "success", text: "Apoyo actualizado exitosamente." });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      
      setSelectedApoyo(null); // Close the edit form
      setSelectedNewBeneficiario(null); // Reset selected beneficiary
      fetchApoyos(); // Refresh the list
    } catch (error) {
      console.error("Error updating apoyo:", error);
      setMessage({ type: "error", text: "Error al actualizar el apoyo." });
      
      // Clear error message after 10 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 10000);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = apoyos.filter((apoyo) => {
      // Check if the apoyo matches the query in any of the relevant fields
      const matchesTipoApoyo = apoyo.tipoApoyo?.toLowerCase().includes(query);
      
      // Check beneficiary name (either persona or cabeza)
      const beneficiarioNombre = apoyo.persona 
        ? `${apoyo.persona.nombre} ${apoyo.persona.apellidoPaterno} ${apoyo.persona.apellidoMaterno}`
        : apoyo.cabeza
          ? `${apoyo.cabeza.nombre} ${apoyo.cabeza.apellidoPaterno} ${apoyo.cabeza.apellidoMaterno}`
          : "";
    
      const matchesBeneficiario = beneficiarioNombre.toLowerCase().includes(query);
    
      // Check clave de elector (either persona or cabeza)
      const claveElector = apoyo.persona 
        ? apoyo.persona.claveElector
        : apoyo.cabeza
          ? apoyo.cabeza.claveElector
          : "";
    
      const matchesClaveElector = claveElector.toLowerCase().includes(query);
    
      // Return true if any field matches
      return matchesTipoApoyo || matchesBeneficiario || matchesClaveElector;
    });

    setFilteredApoyos(filtered);
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
  const currentRecords = filteredApoyos.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredApoyos.length / recordsPerPage);

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('apoyoCurrentPage', currentPage.toString());
  }, [currentPage]);

  // Change page with localStorage persistence
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem('apoyoCurrentPage', pageNumber.toString());
  };

  // Next page with localStorage persistence
  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      localStorage.setItem('apoyoCurrentPage', newPage.toString());
    }
  };

  // Previous page with localStorage persistence
  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      localStorage.setItem('apoyoCurrentPage', newPage.toString());
    }
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
    localStorage.setItem('apoyoCurrentPage', '1');
  }, [searchQuery]);

  // Nueva función de salto rápido
  const jumpBack = () => {
    setCurrentPage((prev) => Math.max(1, prev - 6));
    localStorage.setItem('apoyoCurrentPage', Math.max(1, currentPage - 6).toString());
  };
  const jumpForward = () => {
    setCurrentPage((prev) => {
      const next = prev + 6;
      return next > totalPages ? totalPages : next;
    });
    localStorage.setItem('apoyoCurrentPage', Math.min(totalPages, currentPage + 6).toString());
  };

  const handleViewDetails = (apoyo) => {
    // Create a copy to avoid modifying the original
    const apoyoDetails = { ...apoyo };
    
    // For Integrantes de Circulo, fetch their associated Cabeza de Circulo
    if (apoyo.persona && apoyo.persona.lider) {
      // The persona's lider data is already included in the API response
      apoyoDetails.lider = apoyo.persona.lider;
    }
    
    setViewDetailsApoyo(apoyoDetails);
  };

  // Improved page number display logic for pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7;
    let startPage = 1;
    let endPage = Math.min(totalPages, maxVisiblePages);

    if (currentPage > 4 && totalPages > maxVisiblePages) {
      startPage = currentPage - 3;
      endPage = currentPage + 3;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

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
    return pageNumbers;
  };

  return (
    <div className="neumorphic-crud-container responsive-container">
      <div className="neumorphic-controls responsive-controls">
        <div className="neumorphic-search responsive-search w-100 w-md-50 position-relative">
          <input
            type="text"
            placeholder="Buscar por Tipo de Apoyo o Beneficiario..."
            value={searchQuery}
            onChange={handleSearch}
            className="neumorphic-input search-input responsive-input w-100 pe-5"
          />
          <span className="search-icon responsive-icon position-absolute end-0 top-50 translate-middle-y me-2">
            <i className="bi bi-search"></i>
          </span>
        </div>
        {/* Message display */}
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
      ) : filteredApoyos.length === 0 ? (
        <div className="neumorphic-empty-state">
          <span className="empty-icon">🔍</span>
          <p>No se encontraron apoyos que coincidan con su búsqueda</p>
        </div>
      ) : (
        <>
          <div className="neumorphic-table-container responsive-table-container">
            <table className="neumorphic-table responsive-table">
              <thead>
                <tr>
                  <th className="responsive-column">Tipo de Apoyo</th>
                  <th> cantidad</th>
                  <th>fecha de entrega</th>
                  <th>Beneficiario</th>
                  <th>Tipo de Beneficiario</th>
                  <th>Clave de Elector</th>
                  <th>Teléfono</th>
                  <th>Calle</th>
                  <th>No. Exterior</th>
                  <th>No. Interior</th>
                  <th>Colonia</th>
                  <th>Código Postal</th>
                  <th className="fixed-column responsive-column">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((apoyo) => (
                  <tr key={apoyo.id} className="responsive-row">
                    <td className="responsive-cell">{apoyo.tipoApoyo}</td>
                    <td>{apoyo.cantidad}</td>
                    <td>{formatDate(apoyo.fechaEntrega)}</td>
                    <td>
                      {apoyo.persona 
                        ? `${apoyo.persona.nombre} ${apoyo.persona.apellidoPaterno} ${apoyo.persona.apellidoMaterno}`
                        : apoyo.cabeza
                          ? `${apoyo.cabeza.nombre} ${apoyo.cabeza.apellidoPaterno} ${apoyo.cabeza.apellidoMaterno}`
                          : "No asignado"}
                    </td>
                    <td>
                      {apoyo.persona 
                        ? "Integrante de Círculo" 
                        : apoyo.cabeza 
                          ? "Cabeza de Círculo" 
                          : "-"}
                    </td>
                    <td>
                      {apoyo.persona 
                        ? apoyo.persona.claveElector 
                        : apoyo.cabeza 
                          ? apoyo.cabeza.claveElector 
                          : "-"}
                    </td>
                    <td>
                      {apoyo.persona 
                        ? apoyo.persona.telefono 
                        : apoyo.cabeza 
                          ? apoyo.cabeza.telefono 
                          : "-"}
                    </td>
                    <td>
                      {apoyo.persona 
                        ? apoyo.persona.calle 
                        : apoyo.cabeza 
                          ? apoyo.cabeza.calle 
                          : "-"}
                    </td>
                    <td>
                      {apoyo.persona 
                        ? apoyo.persona.noExterior 
                        : apoyo.cabeza 
                          ? apoyo.cabeza.noExterior 
                          : "-"}
                    </td>
                    <td>
                      {apoyo.persona 
                        ? (apoyo.persona.noInterior || "-") 
                        : apoyo.cabeza 
                          ? (apoyo.cabeza.noInterior || "-") 
                          : "-"}
                    </td>
                    <td>
                      {apoyo.persona 
                        ? apoyo.persona.colonia 
                        : apoyo.cabeza 
                          ? apoyo.cabeza.colonia 
                          : "-"}
                    </td>
                    <td>
                      {apoyo.persona 
                        ? apoyo.persona.codigoPostal 
                        : apoyo.cabeza 
                          ? apoyo.cabeza.codigoPostal 
                          : "-"}
                    </td>
                    <td className="fixed-column action-column responsive-action-column">
                      <button 
                        className="action-button view responsive-button" 
                        onClick={() => handleViewDetails(apoyo)}
                        title="Ver Detalles"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button 
                        className="action-button edit responsive-button" 
                        onClick={() => handleEdit(apoyo)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button 
                        className="action-button delete responsive-button" 
                        onClick={() => handleDelete(apoyo.id)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Rellenar filas vacías si hay menos de 12 resultados */}
                {Array.from({ length: recordsPerPage - currentRecords.length }).map((_, idx) => (
                  <tr key={`empty-row-${idx}`} className="responsive-row empty-row">
                    {Array.from({ length: 13 }).map((_, cellIdx) => (
                      <td key={cellIdx}>&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination controls */}
          <div className="pagination-container responsive-pagination-container" style={{ background: 'none', boxShadow: 'none' }}>
            <div className="pagination-info responsive-pagination-info">
              Mostrando {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredApoyos.length)} de {filteredApoyos.length} apoyos
            </div>
            <div className="pagination-controls responsive-pagination-controls flex-wrap justify-content-center">
              <button 
                onClick={jumpBack} 
                disabled={currentPage <= 6} 
                className="pagination-button responsive-pagination-button"
                title="Salto atrás"
              >
                <i className="bi bi-chevron-double-left"></i>
              </button>
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1} 
                className="pagination-button responsive-pagination-button"
                title="Página anterior"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
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
              <button 
                onClick={jumpForward} 
                disabled={currentPage === totalPages} 
                className="pagination-button responsive-pagination-button"
                title="Salto adelante"
              >
                <i className="bi bi-chevron-double-right"></i>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {selectedApoyo && (
        <div className="neumorphic-modal">
          <div className="neumorphic-modal-content large-modal">
            <div className="modal-header">
              <h3>Editar Apoyo</h3>
              <button 
                className="close" 
                onClick={() => setSelectedApoyo(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateSubmit(selectedApoyo);
                }}
                className="edit-form"
              >
                <div className="modal-sections">
                  <div className="modal-section">
                    <h4 className="section-title">Información del Apoyo</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Cantidad</label>
                        <input
                          type="number"
                          className="neumorphic-input"
                          value={selectedApoyo.cantidad || ''}
                          onChange={(e) => setSelectedApoyo({ ...selectedApoyo, cantidad: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Tipo de Apoyo</label>
                        <select
                          className="neumorphic-input"
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
                          <div className="custom-input-container">
                            <input
                              type="text"
                              placeholder="Especifique el tipo de apoyo"
                              value={selectedApoyo.tipoApoyoCustom || ''}
                              onChange={(e) => setSelectedApoyo({
                                ...selectedApoyo,
                                tipoApoyoCustom: e.target.value,
                              })}
                              className="custom-input"
                              autoComplete="off"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Fecha de Entrega</label>
                        <input
                          type="date"
                          className="neumorphic-input"
                          value={formatDate(selectedApoyo.fechaEntrega) || ''}
                          onChange={(e) => setSelectedApoyo({ ...selectedApoyo, fechaEntrega: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Current beneficiary information */}
                  <div className="modal-section">
                    <h4 className="section-title">Beneficiario Actual</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <p>
                          {selectedApoyo.persona
                            ? `${selectedApoyo.persona.nombre} ${selectedApoyo.persona.apellidoPaterno} ${selectedApoyo.persona.apellidoMaterno} - Integrante de Círculo`
                            : selectedApoyo.cabeza
                              ? `${selectedApoyo.cabeza.nombre} ${selectedApoyo.cabeza.apellidoPaterno} ${selectedApoyo.cabeza.apellidoMaterno} - Cabeza de Círculo`
                              : "No hay beneficiario asignado"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cambiar Beneficiario section with increased height */}
                  <div className="modal-section">
                    <h4 className="section-title">Cambiar Beneficiario</h4>
                    <div className="beneficiary-edit-section">
                      <div className="form-row">
                        <div className="form-group" style={{ position: "relative" }}>
                          <label>Buscar Nuevo Beneficiario</label>
                          <input
                            type="text"
                            className="neumorphic-input"
                            placeholder="Nombre o Clave de Elector"
                            value={searchBeneficiarioQuery}
                            onChange={handleSearchBeneficiarios}
                            autoComplete="off"
                          />
                          {beneficiarios.length > 0 && (
                            <ul className="search-results">
                              {beneficiarios.map((beneficiario) => (
                                <li
                                  key={`${beneficiario.tipo}-${beneficiario.id}`}
                                  onClick={() => handleSelectNewBeneficiario(beneficiario)}
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
                        {selectedNewBeneficiario && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Nuevo Beneficiario Seleccionado</label>
                              <input
                                type="text"
                                className="neumorphic-input selected-beneficiary"
                                value={`${selectedNewBeneficiario.nombre} ${selectedNewBeneficiario.apellidoPaterno} ${selectedNewBeneficiario.apellidoMaterno} - ${selectedNewBeneficiario.claveElector}`}
                                readOnly
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="neumorphic-button cancel" onClick={() => setSelectedApoyo(null)}>
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                  <button type="submit" className="neumorphic-button primary">
                    <i className="bi bi-floppy me-2"></i>Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetailsApoyo && (
        <div className="neumorphic-modal">
          <div className="neumorphic-modal-content large-modal">
            <div className="modal-header">
              <h3>Detalles del Apoyo</h3>
              <button 
                className="close" 
                onClick={() => setViewDetailsApoyo(null)}
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
                    <span className="detail-value">{viewDetailsApoyo.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tipo de Apoyo</span>
                    <span className="detail-value">{viewDetailsApoyo.tipoApoyo}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Cantidad</span>
                    <span className="detail-value">{viewDetailsApoyo.cantidad}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha de Entrega</span>
                    <span className="detail-value">{formatDate(viewDetailsApoyo.fechaEntrega)}</span>
                  </div>
                </div>
              </div>
              
              {/* Información del Beneficiario */}
              <div className="details-section">
                <h4>Información del Beneficiario</h4>
                {viewDetailsApoyo.persona ? (
                  <div className="details-grid wide-grid">
                    <div className="detail-item">
                      <span className="detail-label">Tipo</span>
                      <span className="detail-value">Integrante de Círculo</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Nombre Completo</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.persona.nombre} ${viewDetailsApoyo.persona.apellidoPaterno} ${viewDetailsApoyo.persona.apellidoMaterno}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Clave de Elector</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.claveElector}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.telefono}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dirección</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.persona.calle} #${viewDetailsApoyo.persona.noExterior}
                         ${viewDetailsApoyo.persona.noInterior ? ", Int: " + viewDetailsApoyo.persona.noInterior : ""}, 
                         Col. ${viewDetailsApoyo.persona.colonia}, CP: ${viewDetailsApoyo.persona.codigoPostal}`}
                      </span>
                    </div>
                  </div>
                ) : viewDetailsApoyo.cabeza ? (
                  <div className="details-grid wide-grid">
                    <div className="detail-item">
                      <span className="detail-label">Tipo</span>
                      <span className="detail-value">Cabeza de Círculo</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Nombre Completo</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.cabeza.nombre} ${viewDetailsApoyo.cabeza.apellidoPaterno} ${viewDetailsApoyo.cabeza.apellidoMaterno}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Clave de Elector</span>
                      <span className="detail-value">{viewDetailsApoyo.cabeza.claveElector}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono</span>
                      <span className="detail-value">{viewDetailsApoyo.cabeza.telefono}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dirección</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.cabeza.calle} #${viewDetailsApoyo.cabeza.noExterior}
                         ${viewDetailsApoyo.cabeza.noInterior ? ", Int: " + viewDetailsApoyo.cabeza.noInterior : ""}, 
                         Col. ${viewDetailsApoyo.cabeza.colonia}, CP: ${viewDetailsApoyo.cabeza.codigoPostal}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estructura Territorial</span>
                      <span className="detail-value">{viewDetailsApoyo.cabeza.estructuraTerritorial || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Posición en Estructura</span>
                      <span className="detail-value">{viewDetailsApoyo.cabeza.posicionEstructura || "N/A"}</span>
                    </div>
                  </div>
                ) : (
                  <p>No se encontró información del beneficiario</p>
                )}
              </div>
              
              {/* Show Cabeza de Círculo details if the beneficiary is an Integrante with a leader */}
              {viewDetailsApoyo.persona && viewDetailsApoyo.persona.lider && (
                <div className="details-section">
                  <h4>Cabeza de Círculo Asociada</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Nombre Completo</span>
                      <span className="detail-value">
                        {`${viewDetailsApoyo.persona.lider.nombre} ${viewDetailsApoyo.persona.lider.apellidoPaterno} ${viewDetailsApoyo.persona.lider.apellidoMaterno}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Clave de Elector</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.lider.claveElector}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.lider.telefono}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estructura Territorial</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.lider.estructuraTerritorial || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Posición en Estructura</span>
                      <span className="detail-value">{viewDetailsApoyo.persona.lider.posicionEstructura || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="modal-footer">
                <button 
                  className="close modal-close-button" 
                  onClick={() => setViewDetailsApoyo(null)}
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
      )}
    </div>
  );
};

export default ApoyoCRUD;
