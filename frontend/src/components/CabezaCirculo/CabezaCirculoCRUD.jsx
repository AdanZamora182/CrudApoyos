import React, { useState, useEffect } from "react";
import { buscarCabezasCirculo, deleteCabezaCirculo, updateCabezaCirculo } from "../../api";
import "./CabezaCirculo.css";

const CabezaCirculoCRUD = () => {
  const [cabezasCirculo, setCabezasCirculo] = useState([]);
  const [filteredCabezas, setFilteredCabezas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCabeza, setSelectedCabeza] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(12);

  useEffect(() => {
    fetchCabezasCirculo();
  }, []);

  const fetchCabezasCirculo = async () => {
    setIsLoading(true);
    try {
      const response = await buscarCabezasCirculo(""); // Fetch all records
      setCabezasCirculo(response);
      setFilteredCabezas(response); // Inicialmente, todos los registros están visibles
    } catch (error) {
      console.error("Error fetching cabezas de círculo:", error);
      setMessage({ type: "error", text: "Error al cargar los datos." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este registro?")) {
      try {
        await deleteCabezaCirculo(id);
        setMessage({ type: "success", text: "Registro eliminado exitosamente." });
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 5000);
        
        fetchCabezasCirculo(); // Refresh the list
      } catch (error) {
        console.error("Error deleting record:", error);
        setMessage({ type: "error", text: "Error al eliminar el registro." });
      }
    }
  };

  const handleEdit = (cabeza) => {
    setSelectedCabeza(cabeza); // Abre el formulario de edición
  };

  // Add this function inside the component before the return statement
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
    setSelectedCabeza({ ...selectedCabeza, [field]: value });
  };

  const handleUpdateSubmit = async (updatedCabeza) => {
    try {
      // Parse numeric fields
      const formattedCabeza = {
        ...updatedCabeza,
        telefono: updatedCabeza.telefono ? Number.parseInt(updatedCabeza.telefono) : null,
        noExterior: updatedCabeza.noExterior ? Number.parseInt(updatedCabeza.noExterior) : null,
        noInterior: updatedCabeza.noInterior ? Number.parseInt(updatedCabeza.noInterior) : null,
        codigoPostal: updatedCabeza.codigoPostal ? Number.parseInt(updatedCabeza.codigoPostal) : null,
      };

      await updateCabezaCirculo(formattedCabeza.id, formattedCabeza);
      setMessage({ type: "success", text: "Registro actualizado exitosamente." });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      
      setSelectedCabeza(null); // Cierra el formulario de edición
      fetchCabezasCirculo(); // Refresca la lista
    } catch (error) {
      console.error("Error updating record:", error);
      setMessage({ type: "error", text: "Error al actualizar el registro." });
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = cabezasCirculo.filter((cabeza) =>
      cabeza.nombre?.toLowerCase().includes(query) ||
      cabeza.apellidoPaterno?.toLowerCase().includes(query) ||
      cabeza.apellidoMaterno?.toLowerCase().includes(query) ||
      cabeza.claveElector?.toLowerCase().includes(query)
    );

    setFilteredCabezas(filtered);
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
  const currentRecords = filteredCabezas.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCabezas.length / recordsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
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

  return (
    <div className="neumorphic-crud-container full-screen">
      <div className="neumorphic-controls">
        <div className="neumorphic-search">
          <input
            type="text"
            placeholder="Buscar por Nombre o Clave de Elector..."
            value={searchQuery}
            onChange={handleSearch}
            className="neumorphic-input search-input"
          />
          <span className="search-icon">🔍</span>
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
      ) : filteredCabezas.length === 0 ? (
        <div className="neumorphic-empty-state">
          <span className="empty-icon">🔍</span>
          <p>No se encontraron registros que coincidan con su búsqueda</p>
        </div>
      ) : (
        <>
          <div className="neumorphic-table-container full-width">
            <table className="neumorphic-table">
              <thead>
                <tr>
                  <th className="fixed-column">Acciones</th>
                  <th className="col-name">Nombre</th>
                  <th className="col-apellido">Apellido Paterno</th>
                  <th className="col-apellido">Apellido Materno</th>
                  <th className="col-date">Fecha de Nacimiento</th>
                  <th className="col-number">Teléfono</th>
                  <th className="col-address">Calle</th>
                  <th className="col-number">No. Exterior</th>
                  <th className="col-number">No. Interior</th>
                  <th className="col-address">Colonia</th>
                  <th className="col-number">Código Postal</th>
                  <th className="col-address">Municipio</th>
                  <th className="col-address">Clave de Elector</th>
                  <th className="col-email">Email</th>
                  <th className="col-address">Facebook</th>
                  <th className="col-address">Otra Red Social</th>
                  <th className="col-address">Estructura Territorial</th>
                  <th className="col-address">Posición Estructura</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((cabeza) => (
                  <tr key={cabeza.id}>
                    <td className="fixed-column action-column">
                      <button 
                        className="action-button edit" 
                        onClick={() => handleEdit(cabeza)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-button delete" 
                        onClick={() => handleDelete(cabeza.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                    <td>{cabeza.nombre}</td>
                    <td>{cabeza.apellidoPaterno}</td>
                    <td>{cabeza.apellidoMaterno}</td>
                    <td>{formatDate(cabeza.fechaNacimiento)}</td>
                    <td>{cabeza.telefono}</td>
                    <td>{cabeza.calle}</td>
                    <td>{cabeza.noExterior}</td>
                    <td>{cabeza.noInterior || "-"}</td>
                    <td>{cabeza.colonia}</td>
                    <td>{cabeza.codigoPostal}</td>
                    <td>{cabeza.municipio || "-"}</td>
                    <td>{cabeza.claveElector}</td>
                    <td>{cabeza.email}</td>
                    <td>{cabeza.facebook || "-"}</td>
                    <td>{cabeza.otraRedSocial || "-"}</td>
                    <td>{cabeza.estructuraTerritorial}</td>
                    <td>{cabeza.posicionEstructura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="pagination-container">
            <div className="pagination-info">
              Mostrando {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredCabezas.length)} de {filteredCabezas.length} registros
            </div>
            <div className="pagination-controls">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1} 
                className="pagination-button"
                title="Página anterior"
              >
                ◀
              </button>
              
              {/* Show page numbers */}
              <div className="page-numbers">
                {renderPageNumbers()}
              </div>
              
              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages} 
                className="pagination-button"
                title="Página siguiente"
              >
                ▶
              </button>
            </div>
          </div>
        </>
      )}

      {selectedCabeza && (
        <div className="neumorphic-modal">
          <div className="neumorphic-modal-content large-modal">
            <div className="modal-header">
              <h3>Editar Registro</h3>
              <button 
                className="neumorphic-button icon-button small close" 
                onClick={() => setSelectedCabeza(null)}
              >
                ❌
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateSubmit(selectedCabeza);
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
                        value={selectedCabeza.nombre || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido Paterno</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.apellidoPaterno || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, apellidoPaterno: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido Materno</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.apellidoMaterno || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, apellidoMaterno: e.target.value })}
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
                        value={formatDate(selectedCabeza.fechaNacimiento) || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, fechaNacimiento: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.telefono || ''}
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
                        value={selectedCabeza.calle || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, calle: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Colonia</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.colonia || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, colonia: e.target.value })}
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
                        value={selectedCabeza.noExterior || ''}
                        onChange={(e) => handleInputChange(e, 'noExterior')}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>No. Interior</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.noInterior || ''}
                        onChange={(e) => handleInputChange(e, 'noInterior')}
                      />
                    </div>
                    <div className="form-group">
                      <label>Código Postal</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.codigoPostal || ''}
                        onChange={(e) => handleInputChange(e, 'codigoPostal')}
                        maxLength="5"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Municipio</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.municipio || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, municipio: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h4 className="section-title">Información Electoral y Contacto</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Clave de Elector</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.claveElector || ''}
                        onChange={(e) => handleInputChange(e, 'claveElector')}
                        maxLength="18"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className="neumorphic-input"
                        value={selectedCabeza.email || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Facebook</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.facebook || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, facebook: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Otra Red Social</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.otraRedSocial || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, otraRedSocial: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h4 className="section-title">Estructura</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Estructura Territorial</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.estructuraTerritorial || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, estructuraTerritorial: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Posición en Estructura</label>
                      <input
                        type="text"
                        className="neumorphic-input"
                        value={selectedCabeza.posicionEstructura || ''}
                        onChange={(e) => setSelectedCabeza({ ...selectedCabeza, posicionEstructura: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="neumorphic-button cancel" onClick={() => setSelectedCabeza(null)}>
                  ❌ Cancelar
                </button>
                <button type="submit" className="neumorphic-button primary">
                  💾 Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabezaCirculoCRUD;