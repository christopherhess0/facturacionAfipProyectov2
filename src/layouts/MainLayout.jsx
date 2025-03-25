import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import {
  Content,
  MainContainer,
  Navbar,
  NavLink,
  NavLinks,
  UserImage,
  UserName,
  UserSection
} from './styles/MainLayout.styles';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Solo redirigir si no está autenticado y está intentando acceder a rutas protegidas
  React.useEffect(() => {
    const protectedRoutes = ['administrar-edificios', 'trabajos'];
    const isProtectedRoute = protectedRoutes.some(route => location.pathname.includes(route));
    
    if (!isAuthenticated && isProtectedRoute) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <MainContainer>
      <Navbar>
        <NavLinks>
          <NavLink
            as={Link}
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            🏠 Inicio
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                as={Link}
                to="/administrar-edificios"
                className={location.pathname === '/administrar-edificios' ? 'active' : ''}
              >
                🏢 Administrar Edificios
              </NavLink>
              <NavLink
                as={Link}
                to="/trabajos"
                className={location.pathname === '/trabajos' ? 'active' : ''}
              >
                🔧 Trabajos de Destapación
              </NavLink>
            </>
          )}
        </NavLinks>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <UserSection>
                <UserImage
                  src="https://preview.redd.it/dite-una-cosa-buona-su-bombardiro-crocodilo-livello-v0-5qhujjqvxeqe1.png?auto=webp&s=7b5888a3e515917791842c9149fc4d11d170093a"
                  alt="Logo Hess"
                />
                <UserName>
                  {user?.username || 'Usuario'}
                </UserName>
              </UserSection>
              <NavLink
                as="button"
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                🚪 Cerrar Sesión
              </NavLink>
            </>
          ) : (
            <NavLink
              as={Link}
              to="/login"
              className={location.pathname === '/login' ? 'active' : ''}
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🔑 Iniciar Sesión
            </NavLink>
          )}
        </div>
      </Navbar>
      <Content>
        <Outlet />
      </Content>
    </MainContainer>
  );
};

export default MainLayout; 