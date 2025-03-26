const express = require('express');
const router = express.Router();
const Trabajo = require('../models/Trabajo');
const Edificio = require('../models/Edificio');
const { google } = require('googleapis');
const path = require('path');

// Configuración de Google Sheets
const SHEET_ID = '1i1_1Odmp00UF-rdp6hhGF1DMM7gTLx2qYIay6d8qWx4';
const RANGE = 'Trabajos - 2024!A2:L';
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Función para sincronizar datos desde Google Sheets
async function syncFromGoogleSheets() {
  try {
    console.log('Iniciando sincronización...');
    
    // Limpiar la base de datos antes de sincronizar
    console.log('Limpiando base de datos...');
    await Trabajo.deleteMany({});
    console.log('Base de datos limpiada');

    // Obtener todos los edificios de la base de datos para autocompletar información
    const edificiosDB = await Edificio.find({});
    const edificiosMap = new Map(edificiosDB.map(e => [e.direccion.toLowerCase(), e]));

    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    console.log('Obteniendo datos de la hoja...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    });

    if (!response.data || !response.data.values) {
      throw new Error('No se recibieron datos de Google Sheets');
    }

    console.log('Datos recibidos de Google Sheets:', {
      totalFilas: response.data.values.length
    });

    const trabajos = response.data.values
      .filter(row => {
        // Ignorar filas vacías o encabezados
        if (!row[1] || row[1] === 'Dirección del trabajo') {
          return false;
        }

        // Solo procesar trabajos que se facturan (columna H - índice 7)
        const seFactura = row[7]?.toString().toUpperCase() === 'SI';
        return seFactura;
      })
      .map((row, index) => {
        try {
          // Mapeo exacto según la estructura del Google Sheet:
          // B (1) -> Dirección del trabajo
          // C (2) -> CUIT/DNI
          // D (3) -> Tipo de trabajo
          // E (4) -> Depto/piso
          // F (5) -> Fecha
          // G (6) -> Valor trabajo
          // H (7) -> ¿Se factura?
          // I (8) -> Factura HECHA
          // K (10) -> Administración

          const direccion = row[1]?.toString().trim();
          if (!direccion) return null;

          // Buscar información del edificio en la base de datos
          const edificioInfo = edificiosMap.get(direccion.toLowerCase());
          
          return {
            edificio: direccion,
            cuit: edificioInfo?.cuit || row[2]?.toString().trim() || '',
            tipoDestapacion: row[3]?.toString().trim() || '',
            piso: row[4]?.toString().trim() || '',
            fecha: row[5]?.toString().trim() || '',
            importe: parseFloat(row[6]?.toString().replace('$', '').replace(',', '')) || 0,
            seFactura: true, // Ya filtrado arriba
            facturaHecha: row[8]?.toString().toUpperCase() === 'SI',
            administrador: edificioInfo?.administrador || row[10]?.toString().trim() || ''
          };
        } catch (err) {
          console.error(`Error procesando fila ${index + 2}:`, {
            error: err.message,
            fila: row
          });
          return null;
        }
      })
      .filter(trabajo => trabajo !== null);

    console.log('Trabajos procesados:', {
      total: trabajos.length,
      ejemplo: trabajos[0]
    });

    // Guardar trabajos en la base de datos
    let actualizados = 0;
    for (const trabajo of trabajos) {
      try {
        await Trabajo.create(trabajo);
        actualizados++;
      } catch (err) {
        console.error('Error guardando trabajo:', {
          edificio: trabajo.edificio,
          error: err.message
        });
      }
    }

    console.log('Sincronización completada:', {
      procesados: trabajos.length,
      actualizados
    });

    return {
      success: true,
      totalProcesados: trabajos.length,
      actualizados
    };
  } catch (error) {
    console.error('Error en sincronización:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// GET /api/trabajos - Obtener trabajos paginados
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || 'desc';
    const edificio = req.query.edificio;
    const facturaHecha = req.query.facturaHecha;

    console.log('Parámetros de búsqueda:', { page, limit, sort, edificio, facturaHecha });

    const query = {};
    if (edificio) {
      query.edificio = edificio;
    }
    if (facturaHecha !== undefined) {
      query.facturaHecha = facturaHecha === 'true';
    }

    console.log('Query final:', query);

    const trabajos = await Trabajo.aggregate([
      { $match: query },
      {
        $addFields: {
          fechaParseada: {
            $cond: {
              if: { $regexMatch: { input: "$fecha", regex: /^\d{2}\/\d{2}\/\d{2}$/ } },
              then: {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      "20",
                      { $substr: ["$fecha", 6, 2] },
                      "-",
                      { $substr: ["$fecha", 3, 2] },
                      "-",
                      { $substr: ["$fecha", 0, 2] }
                    ]
                  },
                  onError: "$fecha"
                }
              },
              else: {
                $dateFromString: {
                  dateString: "$fecha",
                  onError: "$fecha"
                }
              }
            }
          }
        }
      },
      { $sort: { fechaParseada: sort === 'desc' ? -1 : 1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { fechaParseada: 0 } }
    ]);

    const total = await Trabajo.countDocuments(query);

    console.log(`Se encontraron ${trabajos.length} trabajos de un total de ${total}`);
    if (trabajos.length > 0) {
      console.log('Primera fecha encontrada:', trabajos[0].fecha);
    }

    const hasMore = page * limit < total;

    res.json({
      trabajos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasMore,
        total
      }
    });
  } catch (error) {
    console.error('Error al obtener trabajos:', error);
    res.status(500).json({ message: 'Error al obtener los trabajos', error: error.message });
  }
});

// POST /api/trabajos - Crear nuevo trabajo
router.post('/', async (req, res) => {
  try {
    const nuevoTrabajo = new Trabajo(req.body);
    await nuevoTrabajo.save();
    res.status(201).json(nuevoTrabajo);
  } catch (error) {
    console.error('Error al crear trabajo:', error);
    res.status(400).json({ error: 'Error al crear el trabajo' });
  }
});

// PATCH /api/trabajos/:id - Actualizar trabajo
router.patch('/:id', async (req, res) => {
  try {
    const trabajo = await Trabajo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!trabajo) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }
    res.json(trabajo);
  } catch (error) {
    console.error('Error al actualizar trabajo:', error);
    res.status(400).json({ error: 'Error al actualizar el trabajo' });
  }
});

// DELETE /api/trabajos/:id - Eliminar trabajo
router.delete('/:id', async (req, res) => {
  try {
    const trabajo = await Trabajo.findByIdAndDelete(req.params.id);
    if (!trabajo) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }
    res.json({ message: 'Trabajo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar trabajo:', error);
    res.status(400).json({ error: 'Error al eliminar el trabajo' });
  }
});

// POST /api/trabajos/sync - Sincronizar con Google Sheets
router.post('/sync', async (req, res) => {
  try {
    console.log('Iniciando sincronización...');
    console.log('Verificando archivo de credenciales...');
    
    const fs = require('fs');
    const path = require('path');
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    
    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Archivo de credenciales no encontrado en: ${credentialsPath}`);
    }

    console.log('Credenciales encontradas, iniciando sincronización...');
    const result = await syncFromGoogleSheets();
    console.log('Resultado de sincronización:', result);
    
    res.json({ 
      message: 'Sincronización completada',
      result 
    });
  } catch (error) {
    console.error('Error detallado en sincronización:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.response?.data
    });
    res.status(500).json({ 
      error: 'Error en la sincronización',
      details: error.message
    });
  }
});

module.exports = router; 