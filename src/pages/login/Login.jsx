import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { validCredentials } from '../../data/credentials';
import { login } from '../../features/auth/authSlice';
import {
    Button,
    ErrorMessage,
    FormGroup,
    Input,
    Label,
    LoginContainer,
    LoginForm,
    LoginTitle
} from './styles/Login.styles';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.username || !credentials.password) {
      setError('Por favor complete todos los campos');
      return;
    }

    // Validar credenciales
    if (
      credentials.username === validCredentials.username &&
      credentials.password === validCredentials.password
    ) {
      dispatch(login({ username: credentials.username }));
      // Redirigir a la página que intentaba acceder o a inicio por defecto
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Iniciar Sesión</LoginTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label>Usuario</Label>
          <Input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Ingrese su usuario"
            autoComplete="username"
          />
        </FormGroup>
        <FormGroup>
          <Label>Contraseña</Label>
          <Input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
          />
        </FormGroup>
        <Button type="submit">
          Ingresar
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login; 