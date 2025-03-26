import {
    AppBar,
    Box,
    Button,
    Container,
    Toolbar,
    Typography
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Facturación
          </Typography>
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/trabajos"
            >
              Trabajos
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/edificios"
            >
              Edificios
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/facturacion"
            >
              Facturación
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation; 