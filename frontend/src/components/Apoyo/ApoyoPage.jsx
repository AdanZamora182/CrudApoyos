import React, { useState, useEffect } from "react";
import ApoyoForm from "./ApoyoForm";
import ApoyoCRUD from "./ApoyoCrud";
import { useNavigate } from "react-router-dom";
import "./ApoyoForm.css";

const ApoyoPage = () => {
  // Load the active tab from localStorage or use default ("form")
  const [activeSection, setActiveSection] = useState(() => {
    const savedTab = localStorage.getItem('apoyoActiveTab');
    return savedTab || "form";
  });
  
  const navigate = useNavigate();

  // Update localStorage when active tab changes
  useEffect(() => {
    localStorage.setItem('apoyoActiveTab', activeSection);
  }, [activeSection]);
  
  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveSection(tab);
    localStorage.setItem('apoyoActiveTab', tab);
  };

  return (
    <div className="integrated-container compact-ui">
      <div className="section-selector" style={{ background: 'none', boxShadow: 'none', border: 'none' }}>
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
        {activeSection === "form" && <ApoyoForm hideHeader={true} />}
        {activeSection === "crud" && <ApoyoCRUD />}
      </div>
    </div>
  );
};

export default ApoyoPage;
