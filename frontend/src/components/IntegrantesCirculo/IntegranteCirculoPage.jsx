import React, { useState, useEffect } from "react";
import IntegranteCirculoForm from "./IntegranteCirculoForm";
import IntegranteCirculoCRUD from "./IntegranteCirculoCRUD";
import { useNavigate, useLocation } from "react-router-dom";
import "./IntegranteCirculo.css";

const IntegranteCirculoPage = () => {
  // Load the active tab from localStorage or use default ("form")
  const [activeSection, setActiveSection] = useState(() => {
    const savedTab = localStorage.getItem('integranteCirculoActiveTab');
    return savedTab || "form";
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Update localStorage when active tab changes
  useEffect(() => {
    localStorage.setItem('integranteCirculoActiveTab', activeSection);
  }, [activeSection]);
  
  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveSection(tab);
    localStorage.setItem('integranteCirculoActiveTab', tab);
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
        {activeSection === "form" && <IntegranteCirculoForm hideHeader={true} />}
        {activeSection === "crud" && <IntegranteCirculoCRUD />}
      </div>
    </div>
  );
};

export default IntegranteCirculoPage;
