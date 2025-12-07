import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from 'react-bootstrap';
import { Users, UserCheck, Gift, Activity} from 'lucide-react';
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

const MetricCard = ({ title, value, subtext, icon: Icon, bgColor, iconColor, iconBgColor, textColor, loading, error }) => (
  <StyledCard $bgColor={bgColor}>
    <CardHeader>
      <div>
        <CardTitle $textColor={textColor}>{title}</CardTitle>
      </div>
      <CardIconWrapper $bgColor={iconBgColor} $iconColor={iconColor}>
        <Icon />
      </CardIconWrapper>
    </CardHeader>
    
    {loading ? (
      <LoadingWrapper>
        <Spinner animation="border" role="status" style={{ color: textColor || '#667eea', width: '2rem', height: '2rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </LoadingWrapper>
    ) : error ? (
      <ErrorText>{error}</ErrorText>
    ) : (
      <>
        <CardValue $textColor={textColor}>{value}</CardValue>
        {subtext && <CardSubtext $textColor={textColor ? 'rgba(255,255,255,0.85)' : undefined}>{subtext}</CardSubtext>}
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
      bgColor: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      iconBgColor: 'rgba(255, 255, 255, 0.2)',
      iconColor: '#ffffff',
      textColor: '#ffffff',
    },
    {
      title: 'Integrantes de Círculo',
      value: stats?.integrantesCirculo || 0,
      subtext: 'Total registrado',
      icon: UserCheck,
      bgColor: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      iconBgColor: 'rgba(255, 255, 255, 0.2)',
      iconColor: '#ffffff',
      textColor: '#ffffff',
    },
    {
      title: 'Apoyos Entregados',
      value: stats?.apoyosTotal || 0,
      subtext: `En el año ${currentYear}`,
      icon: Gift,
      bgColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      iconBgColor: 'rgba(255, 255, 255, 0.2)',
      iconColor: '#ffffff',
      textColor: '#ffffff',
    },
    {
      title: 'Promedio Mensual',
      value: stats?.apoyosPromedio || 0,
      subtext: `Apoyos por mes en ${currentYear}`,
      icon: Activity,
      bgColor: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
      iconBgColor: 'rgba(255, 255, 255, 0.2)',
      iconColor: '#ffffff',
      textColor: '#ffffff',
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
