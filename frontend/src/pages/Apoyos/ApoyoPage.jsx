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
            {activeSection === "form" && <ApoyoForm hideHeader={true} />}
            {activeSection === "crud" && <ApoyoCRUD />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApoyoPage;
