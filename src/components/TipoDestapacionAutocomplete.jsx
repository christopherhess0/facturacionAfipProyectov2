import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const StyledAutocomplete = styled(Autocomplete)`
  .MuiOutlinedInput-root {
    background-color: white;
    border-radius: 6px;
    font-size: 1rem;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #3498db;
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3498db;
    }
  }

  .MuiAutocomplete-input {
    padding: 0.8rem !important;
  }
`;

const tiposDestapacion = [
  "Destapación de cocina",
  "Destapación de cocina y baño",
  "Destapación de cocina y pluvial",
  "Destapación de cocina y lavadero",
  "Destapación de columna de cocina",
  "Destapación de cocina y 2 baños",
  "Destapación de cloaca PB",
  "Destapación de pluvial largo",
  "Revisión y diagnóstico",
  "Servicio por Visita",
  "Destapación de Baño",
  "Destapación de inodoro",
  "Destapación de Baño y cocina",
  "Destapación de lavadero",
  "Destapación de pluvial",
  "Destapación de cloaca",
  "Destapación de pileta de patio",
  "Destapación de columna pluvial",
  "Destapación de columna cloacal",
  "Destapación de baño y lavadero",
  "Destapación de cocina y pileta de patio",
  "Destapación de baño y pluvial",
  "Destapación de 2 baños",
  "Destapación de 3 baños",
  "Destapación general",
];

const TipoDestapacionAutocomplete = ({ value, onChange }) => {
  return (
    <StyledAutocomplete
      options={tiposDestapacion}
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Seleccione tipo de destapación..."
          variant="outlined"
        />
      )}
      isOptionEqualToValue={(option, value) => option === value}
      noOptionsText="No se encontraron tipos de destapación"
      freeSolo
    />
  );
};

export default TipoDestapacionAutocomplete; 