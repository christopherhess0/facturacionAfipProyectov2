import {
    Add as AddIcon,
    CloudDownload as CloudDownloadIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
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

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEdificios());
    }
  }, [status, dispatch]);

  const handleImportar = async () => {
    try {
      setIsSubmitting(true);
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
            {edificios.map((edificio) => (
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
            {edificios.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay edificios registrados.
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