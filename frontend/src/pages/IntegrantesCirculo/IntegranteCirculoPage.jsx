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
    <div className="container-fluid p-0">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button 
              className="neumorphic-button home-button"
              style={{ fontSize: '0.95rem', padding: '4px 12px', height: '32px', minHeight: 'unset' }}
              onClick={() => navigate('/menu')}
            >
              🏠 <span className="d-none d-sm-inline">Inicio</span>
            </button>
            <div className="tabs-container">
              <button
                className={`neumorphic-tab${activeSection === "form" ? " active" : ""}`}
                style={{ fontSize: '0.95rem', padding: '4px 12px', height: '32px', minHeight: 'unset' }}
                onClick={() => handleTabChange("form")}
              >
                ➕ <span className="d-none d-sm-inline">Registrar</span>
              </button>
              <button
                className={`neumorphic-tab${activeSection === "crud" ? " active" : ""}`}
                style={{ fontSize: '0.95rem', padding: '4px 12px', height: '32px', minHeight: 'unset' }}
                onClick={() => handleTabChange("crud")}
              >
                📋 <span className="d-none d-sm-inline">Gestionar</span>
              </button>
            </div>
          </div>
          <div className="mt-3">
            {activeSection === "form" && <IntegranteCirculoForm hideHeader={true} />}
            {activeSection === "crud" && <IntegranteCirculoCRUD />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegranteCirculoPage;
