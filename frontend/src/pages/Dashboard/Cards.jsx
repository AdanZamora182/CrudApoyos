import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from 'react-bootstrap';
import { Users, UserCheck, Gift, TrendingUp } from 'lucide-react';
import {
  StyledCard,
  CardHeader,
  CardTitle,
  CardIconWrapper,
  CardValue,
  CardSubtext,
  LoadingWrapper,
  ErrorText
} from '../../components/dashboard/Cards.styles';
import { getDashboardStats } from '../../api/dashboardApi';

const MetricCard = ({ title, value, subtext, icon: Icon, bgColor, iconColor, shadowColor, accentColor, loading, error }) => (
  <StyledCard $accentColor={accentColor}>
    <CardHeader>
      <div>
        <CardTitle>{title}</CardTitle>
      </div>
      <CardIconWrapper $bgColor={bgColor} $iconColor={iconColor} $shadowColor={shadowColor}>
        <Icon />
      </CardIconWrapper>
    </CardHeader>
    
    {loading ? (
      <LoadingWrapper>
        <Spinner animation="border" role="status" style={{ color: iconColor, width: '2rem', height: '2rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </LoadingWrapper>
    ) : error ? (
      <ErrorText>{error}</ErrorText>
    ) : (
      <>
        <CardValue>{value}</CardValue>
        {subtext && <CardSubtext>{subtext}</CardSubtext>}
      </>
    )}
  </StyledCard>
);

const DashboardCards = () => {
  const [currentYear] = useState(new Date().getFullYear());

  // Usar TanStack Query para obtener las estadísticas
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats', currentYear],
    queryFn: () => getDashboardStats(currentYear),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const cardsConfig = [
    {
      title: 'Cabezas de Círculo',
      value: stats?.cabezasCirculo || 0,
      subtext: 'Total registrado',
      icon: Users,
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      iconColor: '#ffffff',
      shadowColor: 'rgba(102, 126, 234, 0.4)',
      accentColor: '#667eea',
    },
    {
      title: 'Integrantes de Círculo',
      value: stats?.integrantesCirculo || 0,
      subtext: 'Total registrado',
      icon: UserCheck,
      bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      iconColor: '#ffffff',
      shadowColor: 'rgba(240, 147, 251, 0.4)',
      accentColor: '#f093fb',
    },
    {
      title: 'Apoyos Entregados',
      value: stats?.apoyosTotal || 0,
      subtext: `En el año ${currentYear}`,
      icon: Gift,
      bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      iconColor: '#ffffff',
      shadowColor: 'rgba(79, 172, 254, 0.4)',
      accentColor: '#4facfe',
    },
    {
      title: 'Promedio Mensual',
      value: stats?.apoyosPromedio || 0,
      subtext: `Apoyos por mes en ${currentYear}`,
      icon: TrendingUp,
      bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      iconColor: '#ffffff',
      shadowColor: 'rgba(67, 233, 123, 0.4)',
      accentColor: '#43e97b',
    },
  ];

  return (
    <>
      {cardsConfig.map((card, index) => (
        <MetricCard
          key={index}
          {...card}
          loading={isLoading}
          error={isError ? 'Error al cargar datos' : null}
        />
      ))}
    </>
  );
};

export default DashboardCards;
