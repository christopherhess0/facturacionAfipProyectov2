import {
    Add as AddIcon,
    CloudDownload as CloudDownloadIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    actualizarEdificio,
    clearError,
    crearEdificio,
    eliminarEdificio,
    fetchEdificios,
    importarEdificios
} from '../features/edificios/edificiosSlice';

const initialFormData = {
  direccion: '',
  cuit: '',
  administrador: ''
};

const EdificioDialog = ({ open, handleClose, edificio, handleSubmit }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (edificio) {
      setFormData({
        direccion: edificio.direccion || '',
        cuit: edificio.cuit || '',
        administrador: edificio.administrador || ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [edificio, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {edificio ? 'Editar Edificio' : 'Nuevo Edificio'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="direccion"
            label="Dirección"
            type="text"
            fullWidth
            value={formData.direccion}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="cuit"
            label="CUIT"
            type="text"
            fullWidth
            value={formData.cuit}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="administrador"
            label="Administrador"
            type="text"
            fullWidth
            value={formData.administrador}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {edificio ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const DeleteConfirmDialog = ({ open, handleClose, handleConfirm }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Confirmar Eliminación</DialogTitle>
    <DialogContent>
      <DialogContentText>
        ¿Está seguro que desea eliminar este edificio? Esta acción no se puede deshacer.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancelar</Button>
      <Button onClick={handleConfirm} color="error" variant="contained">
        Eliminar
      </Button>
    </DialogActions>
  </Dialog>
);

const AdminEdificios = () => {
  const dispatch = useDispatch();
  const { edificios, status, error } = useSelector((state) => state.edificios);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEdificio, setSelectedEdificio] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEdificios());
    }
    return () => {
      dispatch(clearError());
    };
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleImportar = async () => {
    try {
      setIsSubmitting(true);
      dispatch(clearError());
      await dispatch(importarEdificios()).unwrap();
      await dispatch(fetchEdificios()).unwrap();
    } catch (error) {
      console.error('Error al importar edificios:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDialog = (edificio = null) => {
    setSelectedEdificio(edificio);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedEdificio(null);
    setDialogOpen(false);
  };

  const handleOpenDeleteDialog = (edificio) => {
    setSelectedEdificio(edificio);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedEdificio(null);
    setDeleteDialogOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedEdificio) {
        await dispatch(actualizarEdificio({ 
          id: selectedEdificio._id, 
          ...formData 
        })).unwrap();
      } else {
        await dispatch(crearEdificio(formData)).unwrap();
      }
      await dispatch(fetchEdificios()).unwrap();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar edificio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await dispatch(eliminarEdificio(selectedEdificio._id)).unwrap();
      await dispatch(fetchEdificios()).unwrap();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error al eliminar edificio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para filtrar edificios
  const edificiosFiltrados = edificios.filter(edificio => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      edificio.direccion.toLowerCase().includes(searchTermLower) ||
      edificio.administrador.toLowerCase().includes(searchTermLower) ||
      edificio.cuit.includes(searchTerm)
    );
  });

  if (status === 'loading' || isSubmitting) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Administración de Edificios
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={handleImportar}
            sx={{ mr: 2 }}
            disabled={isSubmitting}
          >
            Importar desde Google Sheets
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={isSubmitting}
          >
            Nuevo Edificio
          </Button>
        </Box>
      </Box>

      {/* Campo de búsqueda */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por dirección, administrador o CUIT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Dirección</TableCell>
              <TableCell>CUIT</TableCell>
              <TableCell>Administrador</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {edificiosFiltrados.map((edificio) => (
              <TableRow key={edificio._id}>
                <TableCell>{edificio.direccion}</TableCell>
                <TableCell>{edificio.cuit}</TableCell>
                <TableCell>{edificio.administrador}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(edificio)}
                    size="small"
                    disabled={isSubmitting}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(edificio)}
                    size="small"
                    disabled={isSubmitting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {edificiosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {searchTerm ? 'No se encontraron edificios que coincidan con la búsqueda' : 'No hay edificios registrados'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <EdificioDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        edificio={selectedEdificio}
        handleSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleDelete}
      />
    </Box>
  );
};

export default AdminEdificios; 