import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ErrorImage,
    HomeButton,
    NotFoundContainer,
    NotFoundContent,
    NotFoundSubtitle,
    NotFoundText,
    NotFoundTitle
} from './styles/NotFound.styles';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <NotFoundContent>
        <ErrorImage>🚫</ErrorImage>
        <NotFoundTitle>404</NotFoundTitle>
        <NotFoundSubtitle>¡Ups! Página no encontrada</NotFoundSubtitle>
        <NotFoundText>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
          ¿Quizás te gustaría volver al inicio?
        </NotFoundText>
        <HomeButton onClick={() => navigate('/')}>
          🏠 Volver al inicio
        </HomeButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound; 