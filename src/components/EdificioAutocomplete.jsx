import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

const EdificioAutocomplete = ({ edificios, value, onChange, placeholder = "Seleccione un edificio", style, isFilter = false }) => {
  return (
    <Autocomplete
      options={edificios}
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      getOptionLabel={(option) => option ? option.nombreEdificio || option.direccion || '' : ''}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          fullWidth
          style={style}
        />
      )}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option._id === value._id;
      }}
      style={{ width: '100%' }}
    />
  );
};

export default EdificioAutocomplete; 