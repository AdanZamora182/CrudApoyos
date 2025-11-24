import React, { useState, useEffect } from 'react';
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
  <StyledCard accentColor={accentColor}>
    <CardHeader>
      <div>
        <CardTitle>{title}</CardTitle>
      </div>
      <CardIconWrapper bgColor={bgColor} iconColor={iconColor} shadowColor={shadowColor}>
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
  const [metrics, setMetrics] = useState({
    cabezasCirculo: { value: 0, loading: true, error: null },
    integrantesCirculo: { value: 0, loading: true, error: null },
    apoyosTotal: { value: 0, loading: true, error: null },
    apoyosPromedio: { value: 0, loading: true, error: null }
  });

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Obtener todas las estadísticas en una sola llamada
        const stats = await getDashboardStats(currentYear);
        
        setMetrics({
          cabezasCirculo: { value: stats.cabezasCirculo, loading: false, error: null },
          integrantesCirculo: { value: stats.integrantesCirculo, loading: false, error: null },
          apoyosTotal: { value: stats.apoyosTotal, loading: false, error: null },
          apoyosPromedio: { value: stats.apoyosPromedio, loading: false, error: null }
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        
        // En caso de error, marcar todas las métricas con error
        setMetrics({
          cabezasCirculo: { value: 0, loading: false, error: 'Error al cargar datos' },
          integrantesCirculo: { value: 0, loading: false, error: 'Error al cargar datos' },
          apoyosTotal: { value: 0, loading: false, error: 'Error al cargar datos' },
          apoyosPromedio: { value: 0, loading: false, error: 'Error al cargar datos' }
        });
      }
    };

    fetchMetrics();
  }, [currentYear]);

  return (
    <>
      <MetricCard
        title="Cabezas de Círculo"
        value={metrics.cabezasCirculo.value}
        subtext="Total registrado"
        icon={Users}
        bgColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        iconColor="#ffffff"
        shadowColor="rgba(102, 126, 234, 0.4)"
        accentColor="#667eea"
        loading={metrics.cabezasCirculo.loading}
        error={metrics.cabezasCirculo.error}
      />
      
      <MetricCard
        title="Integrantes de Círculo"
        value={metrics.integrantesCirculo.value}
        subtext="Total registrado"
        icon={UserCheck}
        bgColor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        iconColor="#ffffff"
        shadowColor="rgba(240, 147, 251, 0.4)"
        accentColor="#f093fb"
        loading={metrics.integrantesCirculo.loading}
        error={metrics.integrantesCirculo.error}
      />
      
      <MetricCard
        title="Apoyos Entregados"
        value={metrics.apoyosTotal.value}
        subtext={`En el año ${currentYear}`}
        icon={Gift}
        bgColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        iconColor="#ffffff"
        shadowColor="rgba(79, 172, 254, 0.4)"
        accentColor="#4facfe"
        loading={metrics.apoyosTotal.loading}
        error={metrics.apoyosTotal.error}
      />
      
      <MetricCard
        title="Promedio Mensual"
        value={metrics.apoyosPromedio.value}
        subtext={`Apoyos por mes en ${currentYear}`}
        icon={TrendingUp}
        bgColor="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        iconColor="#ffffff"
        shadowColor="rgba(67, 233, 123, 0.4)"
        accentColor="#43e97b"
        loading={metrics.apoyosPromedio.loading}
        error={metrics.apoyosPromedio.error}
      />
    </>
  );
};

export default DashboardCards;
