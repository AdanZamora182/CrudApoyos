import React, { useState, useEffect } from "react";
import CabezaCirculoForm from "./CabezaCirculoForm";
import CabezaCirculoCRUD from "./CabezaCirculoCRUD";
import { useNavigate, useLocation } from "react-router-dom";
import "./CabezaCirculo.css";

const CabezasCirculoPage = () => {
  // Load the active tab from localStorage or use default ("form")
  const [activeSection, setActiveSection] = useState(() => {
    const savedTab = localStorage.getItem('cabezaCirculoActiveTab');
    return savedTab || "form";
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Update localStorage when active tab changes
  useEffect(() => {
    localStorage.setItem('cabezaCirculoActiveTab', activeSection);
  }, [activeSection]);
  
  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveSection(tab);
    localStorage.setItem('cabezaCirculoActiveTab', tab);
  };

  return (
    <div className="integrated-container compact-ui">
      <div className="section-selector">
        <button 
          className="neumorphic-button home-button"
          onClick={() => navigate('/menu')}
        >
          🏠 Inicio
        </button>
        <div className="tabs-container">
          <button
            className={`neumorphic-tab ${activeSection === "form" ? "active" : ""}`}
            onClick={() => handleTabChange("form")}
          >
            ➕ Registrar
          </button>
          <button
            className={`neumorphic-tab ${activeSection === "crud" ? "active" : ""}`}
            onClick={() => handleTabChange("crud")}
          >
            📋 Gestionar
          </button>
        </div>
      </div>

      <div className="section-content">
        {activeSection === "form" && <CabezaCirculoForm hideHeader={true} />}
        {activeSection === "crud" && <CabezaCirculoCRUD />}
      </div>
    </div>
  );
};

export default CabezasCirculoPage;