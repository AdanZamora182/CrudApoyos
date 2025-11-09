import React, { useState, useEffect } from "react";
import CabezaCirculoForm from "./CabezaCirculoForm";
import CabezaCirculoCRUD from "./CabezaCirculoCRUD";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../hooks/useTheme';
import * as S from './Cabezas.styles';

const CabezasCirculoPage = () => {
  const { theme } = useTheme();
  
  // Load the active tab from localStorage or use default ("form")
  const [activeSection, setActiveSection] = useState(() => {
    const savedTab = localStorage.getItem('cabezaCirculoActiveTab');
    return savedTab || "form";
  });
  
  const navigate = useNavigate();

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
    <S.PageContainer theme={theme}>
      <S.Header theme={theme}>
        <S.HomeButton 
          theme={theme}
          onClick={() => navigate('/menu')}
        >
          🏠 <span>Inicio</span>
        </S.HomeButton>
        
        <S.TabsGroup theme={theme}>
          <S.TabButton
            theme={theme}
            $active={activeSection === "form"}
            onClick={() => handleTabChange("form")}
          >
            ➕ <span>Registrar</span>
          </S.TabButton>
          <S.TabButton
            theme={theme}
            $active={activeSection === "crud"}
            onClick={() => handleTabChange("crud")}
          >
            📋 <span>Gestionar</span>
          </S.TabButton>
        </S.TabsGroup>
      </S.Header>

      <div>
        {activeSection === "form" && <CabezaCirculoForm hideHeader={true} />}
        {activeSection === "crud" && <CabezaCirculoCRUD />}
      </div>
    </S.PageContainer>
  );
};

export default CabezasCirculoPage;