import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import ConfiguracionFacturacion from './components/ConfiguracionFacturacion';

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
`;

const ContentContainer = styled(Container)`
  padding: 2rem;
`;

const ContentBox = styled(Box)`
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const TrabajosPage = () => {
  console.log('Renderizando TrabajosPage'); // Debug log

  return (
    <PageWrapper>
      <ConfiguracionFacturacion />
      
      <ContentContainer maxWidth="lg">
        <Typography variant="h4" component="h1" sx={{ mb: 4, color: '#1a237e' }}>
          Gestión de Trabajos de Destapación
        </Typography>

        <ContentBox>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Agregar Nuevo Trabajo
          </Typography>
          {/* ... formulario de trabajo ... */}
        </ContentBox>

        <ContentBox>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Lista de Trabajos
          </Typography>
          {/* ... lista de trabajos ... */}
        </ContentBox>
      </ContentContainer>
    </PageWrapper>
  );
};

export default TrabajosPage; 