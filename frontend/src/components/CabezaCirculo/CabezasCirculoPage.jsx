import React, { useState } from "react";
import CabezaCirculoForm from "./CabezaCirculoForm";
import CabezaCirculoCRUD from "./CabezaCirculoCRUD";
import { useNavigate } from "react-router-dom";
import "./CabezaCirculo.css";

const CabezasCirculoPage = () => {
  const [activeSection, setActiveSection] = useState("form"); // "form" o "crud"
  const navigate = useNavigate();

  return (
    <div className="integrated-container">
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
            onClick={() => setActiveSection("form")}
          >
            ➕ Registrar
          </button>
          <button
            className={`neumorphic-tab ${activeSection === "crud" ? "active" : ""}`}
            onClick={() => setActiveSection("crud")}
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