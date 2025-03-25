const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const path = require('path');
const Edificio = require('../models/edificio');

// Configuración de Google Sheets
const getAuth = async () => {
  try {
    const keyFilePath = path.join(__dirname, '..', 'credentials.json');
    console.log('Intentando cargar credenciales desde:', keyFilePath);
    
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return auth;
  } catch (error) {
    console.error('Error al configurar la autenticación de Google:', error);
    throw error;
  }
};

// Ruta para importar edificios desde Google Sheets
router.post('/importar', async (req, res) => {
  try {
    console.log('Iniciando importación de edificios...');
    
    const auth = await getAuth();
    const client = await auth.getClient();
    console.log('Cliente de Google autenticado correctamente');
    
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    // Verificar ID de la hoja
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID no está configurado en las variables de entorno');
    }
    console.log('Usando spreadsheet ID:', spreadsheetId);
    
    // Obtener datos de la hoja de cálculo
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Edificios!A2:C', // Intentamos con el nombre de la pestaña 'Edificios'
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos en la hoja de cálculo' });
    }

    console.log(`Se encontraron ${rows.length} filas para procesar`);

    // Procesar cada fila y crear/actualizar edificios
    const resultados = await Promise.all(rows.map(async (row, index) => {
      try {
        if (!row[0] || !row[1]) {
          console.log(`Fila ${index + 2} ignorada por falta de datos requeridos`);
          return null;
        }
        
        const edificioData = {
          direccion: row[0].trim(),
          cuit: row[1].trim(),
          administrador: row[2] ? row[2].trim() : 'No especificado'
        };

        console.log(`Procesando edificio: ${edificioData.direccion}`);

        const edificio = await Edificio.findOneAndUpdate(
          { direccion: edificioData.direccion },
          edificioData,
          { upsert: true, new: true }
        );

        console.log(`Edificio procesado exitosamente: ${edificio.direccion}`);
        return edificio;
      } catch (err) {
        console.error(`Error al procesar fila ${index + 2}:`, err);
        return null;
      }
    }));

    const edificiosValidos = resultados.filter(r => r !== null);
    console.log(`Importación completada. ${edificiosValidos.length} edificios procesados correctamente`);

    res.json({
      message: `Se importaron ${edificiosValidos.length} edificios correctamente`,
      edificios: edificiosValidos
    });

  } catch (error) {
    console.error('Error al importar edificios:', error);
    res.status(500).json({ 
      message: 'Error al importar edificios', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Ruta para obtener todos los edificios
router.get('/', async (req, res) => {
  try {
    const edificios = await Edificio.find({}).sort({ direccion: 1 });
    res.json(edificios);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener edificios', 
      error: error.message 
    });
  }
});

// Ruta para crear un nuevo edificio
router.post('/', async (req, res) => {
  try {
    const { direccion, cuit, administrador } = req.body;
    
    // Validar datos requeridos
    if (!direccion || !cuit || !administrador) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos: direccion, cuit, administrador' 
      });
    }

    // Verificar si ya existe un edificio con la misma dirección
    const edificioExistente = await Edificio.findOne({ direccion });
    if (edificioExistente) {
      return res.status(400).json({ 
        message: 'Ya existe un edificio con esta dirección' 
      });
    }

    const nuevoEdificio = new Edificio({ direccion, cuit, administrador });
    await nuevoEdificio.save();

    res.status(201).json(nuevoEdificio);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al crear el edificio', 
      error: error.message 
    });
  }
});

// Ruta para actualizar un edificio
router.put('/:id', async (req, res) => {
  try {
    const { direccion, cuit, administrador } = req.body;
    
    // Validar datos requeridos
    if (!direccion || !cuit || !administrador) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos: direccion, cuit, administrador' 
      });
    }

    // Verificar si existe otro edificio con la misma dirección (excepto el actual)
    const edificioExistente = await Edificio.findOne({ 
      direccion, 
      _id: { $ne: req.params.id } 
    });
    
    if (edificioExistente) {
      return res.status(400).json({ 
        message: 'Ya existe otro edificio con esta dirección' 
      });
    }

    const edificioActualizado = await Edificio.findByIdAndUpdate(
      req.params.id,
      { direccion, cuit, administrador },
      { new: true }
    );

    if (!edificioActualizado) {
      return res.status(404).json({ message: 'Edificio no encontrado' });
    }

    res.json(edificioActualizado);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar el edificio', 
      error: error.message 
    });
  }
});

// Ruta para eliminar un edificio
router.delete('/:id', async (req, res) => {
  try {
    const edificioEliminado = await Edificio.findByIdAndDelete(req.params.id);
    
    if (!edificioEliminado) {
      return res.status(404).json({ message: 'Edificio no encontrado' });
    }

    res.json({ message: 'Edificio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al eliminar el edificio', 
      error: error.message 
    });
  }
});

module.exports = router; 