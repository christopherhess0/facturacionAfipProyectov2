const Afip = require('@afipsdk/afip.js');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

class AfipService {
  constructor() {
    console.log('=== Iniciando construcción de AfipService ===');
    try {
      const CUIT = process.env.AFIP_CUIT;
      console.log('Leyendo CUIT de variables de entorno:', CUIT);
      console.log('Todas las variables de entorno:', {
        MONGODB_URI: process.env.MONGODB_URI ? 'Configurado' : 'No configurado',
        GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? 'Configurado' : 'No configurado',
        AFIP_CUIT: process.env.AFIP_CUIT ? 'Configurado' : 'No configurado',
        NODE_ENV: process.env.NODE_ENV
      });
      
      if (!CUIT) {
        throw new Error('AFIP_CUIT no está configurado en las variables de entorno');
      }

      console.log('=== Verificando rutas de certificados ===');
      const certPath = path.resolve(process.cwd(), 'certificates', 'cert.pem');
      const keyPath = path.resolve(process.cwd(), 'certificates', 'key.pem');

      console.log('Rutas absolutas de certificados:');
      console.log('- Certificado:', certPath);
      console.log('- Clave:', keyPath);
      console.log('- Directorio actual:', process.cwd());

      console.log('=== Verificando existencia de archivos ===');
      if (!fs.existsSync(certPath)) {
        console.error('Error: Certificado no encontrado');
        console.log('Contenido del directorio certificates:', fs.readdirSync(path.resolve(process.cwd(), 'certificates')));
        throw new Error(`No se encuentra el certificado en: ${certPath}`);
      }

      if (!fs.existsSync(keyPath)) {
        console.error('Error: Clave privada no encontrada');
        console.log('Contenido del directorio certificates:', fs.readdirSync(path.resolve(process.cwd(), 'certificates')));
        throw new Error(`No se encuentra la clave privada en: ${keyPath}`);
      }

      console.log('=== Leyendo contenido de certificados ===');
      const certContent = fs.readFileSync(certPath, 'utf8');
      const keyContent = fs.readFileSync(keyPath, 'utf8');

      console.log('Validando formato de certificado...');
      if (!certContent.includes('BEGIN CERTIFICATE')) {
        console.error('Error: Formato de certificado inválido');
        console.log('Primeras líneas del certificado:', certContent.split('\n').slice(0, 3));
        throw new Error('El archivo de certificado no parece ser válido');
      }

      console.log('Validando formato de clave privada...');
      if (!keyContent.includes('BEGIN PRIVATE KEY')) {
        console.error('Error: Formato de clave privada inválido');
        console.log('Primeras líneas de la clave:', keyContent.split('\n').slice(0, 3));
        throw new Error('El archivo de clave privada no parece ser válido');
      }

      console.log('=== Configurando carpeta de recursos ===');
      const resFolderPath = path.resolve(process.cwd(), 'certificates');
      console.log('Carpeta de recursos:', resFolderPath);

      if (!fs.existsSync(resFolderPath)) {
        console.log('Creando carpeta de recursos...');
        fs.mkdirSync(resFolderPath, { recursive: true });
      }

      console.log('=== Creando instancia de AFIP ===');
      const config = {
        CUIT: CUIT,
        cert: certPath,
        key: keyPath,
        production: false,
        res_folder: resFolderPath,
        ta_folder: resFolderPath
      };
      console.log('Configuración de AFIP:', JSON.stringify(config, null, 2));

      try {
        this.afip = new Afip(config);
        console.log('Instancia de AFIP creada exitosamente');
      } catch (error) {
        console.error('Error al crear instancia de AFIP:', error);
        console.error('Stack trace:', error.stack);
        throw error;
      }

    } catch (error) {
      console.error('=== ERROR EN CONSTRUCTOR ===');
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  async testConnection() {
    try {
      console.log('=== Iniciando prueba de conexión con AFIP ===');
      
      console.log('1. Intentando obtener estado del servidor...');
      try {
        const auth = await this.afip.ElectronicBilling.getServerStatus();
        console.log('Estado del servidor recibido:', JSON.stringify(auth, null, 2));
      } catch (error) {
        console.error('Error al obtener estado del servidor:');
        console.error('- Mensaje:', error.message);
        console.error('- Respuesta:', error.response?.data);
        console.error('- URL:', error.config?.url);
        console.error('- Método:', error.config?.method);
        throw error;
      }

      console.log('2. Intentando obtener último comprobante...');
      console.log('Parámetros: Punto de venta = 1, Tipo de comprobante = 6');
      let lastVoucher;
      try {
        lastVoucher = await this.afip.ElectronicBilling.getLastVoucher(1, 6);
        console.log('Último comprobante recibido:', lastVoucher);
      } catch (error) {
        console.error('Error al obtener último comprobante:');
        console.error('- Mensaje:', error.message);
        console.error('- Respuesta:', error.response?.data);
        console.error('- URL:', error.config?.url);
        console.error('- Método:', error.config?.method);
        throw error;
      }

      console.log('=== Prueba de conexión completada con éxito ===');
      return {
        success: true,
        message: 'Conexión exitosa con AFIP',
        serverStatus: auth,
        lastVoucher
      };
    } catch (error) {
      console.error('=== ERROR EN TEST DE CONEXIÓN ===');
      console.error('Tipo de error:', error.constructor.name);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      console.error('Detalles de la respuesta:', error.response?.data);
      console.error('URL de la petición:', error.config?.url);
      console.error('Método de la petición:', error.config?.method);
      console.error('Headers de la petición:', error.config?.headers);
      console.error('Datos enviados:', error.config?.data);
      
      return {
        success: false,
        message: 'Error al conectar con AFIP',
        error: error.message,
        details: {
          errorType: error.constructor.name,
          response: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          requestData: error.config?.data
        },
        stack: error.stack
      };
    }
  }

  async generarFactura(trabajo, usuario) {
    try {
      console.log(`Generando factura para trabajo ${trabajo._id} por usuario ${usuario}`);
      
      // Obtener el último número de comprobante
      const lastVoucher = await this.afip.ElectronicBilling.getLastVoucher(1, 6);
      const nextVoucher = lastVoucher + 1;
      
      console.log('Siguiente número de comprobante:', nextVoucher);

      // Preparar datos de la factura
      const facturaData = {
        CantReg: 1,
        PuntoVenta: 1,
        Concepto: 1,
        DocTipo: 80,
        DocNro: trabajo.cuit,
        Date: new Date().toISOString().split('T')[0],
        ImpTotal: trabajo.monto,
        ImpTotConc: 0,
        ImpNeto: trabajo.monto,
        ImpOpEx: 0,
        ImpIVA: 0,
        ImpTrib: 0,
        MonId: 'PES',
        MonCotiz: 1,
        CbteTipo: 6,
        CbteFch: new Date().toISOString().split('T')[0],
        FchServDesde: trabajo.fecha,
        FchServHasta: trabajo.fecha,
        FchVtoPago: new Date().toISOString().split('T')[0],
        CbtesAsoc: [],
        Tributos: [],
        Iva: [],
        Opcionales: []
      };

      console.log('Datos de factura:', facturaData);

      // Generar factura
      const result = await this.afip.ElectronicBilling.createVoucher(facturaData);
      console.log('Resultado de generación:', result);

      return {
        success: true,
        numeroFactura: result.voucher_number,
        cae: result.CAE,
        pdfPath: `facturas/${result.voucher_number}.pdf`
      };
    } catch (error) {
      console.error('Error al generar factura:', error);
      throw error;
    }
  }

  async getContadorPorAdministrador(usuario) {
    const pdfDir = path.join(__dirname, '../../../pdfs');
    const files = fs.readdirSync(pdfDir);
    const userFiles = files.filter(file => file.startsWith(usuario + '_'));
    return userFiles.length + 1;
  }
}

module.exports = new AfipService(); 