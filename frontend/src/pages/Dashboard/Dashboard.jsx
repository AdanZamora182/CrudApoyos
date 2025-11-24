import React from "react";
import DashboardCards from "./Cards";
import GraphBars from "./GraphBars";
import DashboardTables from "./Tables";
import {
  DashboardContainer,
  CardsGrid
} from '../../components/dashboard/Dashboard.styles';

const Dashboard = () => {
  return (
    <DashboardContainer>
      <CardsGrid>
        <DashboardCards />
      </CardsGrid>
      <GraphBars />
      <DashboardTables />
    </DashboardContainer>
  );
};

export default Dashboard;