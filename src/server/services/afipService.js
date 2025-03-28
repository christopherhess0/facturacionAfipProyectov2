const Afip = require('@afipsdk/afip.js');
const path = require('path');
const fs = require('fs');
const cuentasAfip = require('../config/cuentasAfip');
require('dotenv').config();

class AfipService {
  constructor(cuentaId) {
    const cuenta = cuentasAfip[cuentaId];
    if (!cuenta) {
      throw new Error(`Cuenta de AFIP no encontrada: ${cuentaId}`);
    }
    this.cuenta = cuenta;
    this.afip = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log(`Inicializando AFIP con CUIT: ${this.cuenta.cuit}`);
    
    const certPath = this.cuenta.certificado;
    const keyPath = this.cuenta.clave;

    console.log('Rutas de archivos:');
    console.log('Certificado:', certPath);
    console.log('Clave privada:', keyPath);

    // Verificar que los archivos existan
    if (!fs.existsSync(certPath)) {
      throw new Error(`Certificado no encontrado en: ${certPath}`);
    }
    if (!fs.existsSync(keyPath)) {
      throw new Error(`Clave privada no encontrada en: ${keyPath}`);
    }

    // Leer el contenido de los archivos
    const certContent = fs.readFileSync(certPath, 'utf8').trim();
    const keyContent = fs.readFileSync(keyPath, 'utf8').trim();

    console.log('Contenido del certificado:');
    console.log(certContent.substring(0, 100) + '...');
    console.log('Contenido de la clave privada:');
    console.log(keyContent.substring(0, 100) + '...');

    if (!certContent.includes('-----BEGIN CERTIFICATE-----')) {
      throw new Error('El archivo de certificado no es válido');
    }
    if (!keyContent.includes('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('El archivo de clave privada no es válido');
    }

    try {
      // Crear directorio temporal para los certificados si no existe
      const tempCertDir = path.join(process.cwd(), 'temp_certs', this.cuenta.nombre.toLowerCase().replace(/\s+/g, '_'));
      if (!fs.existsSync(tempCertDir)) {
        fs.mkdirSync(tempCertDir, { recursive: true });
      }

      // Escribir los archivos temporales
      const tempCertPath = path.join(tempCertDir, 'cert.pem');
      const tempKeyPath = path.join(tempCertDir, 'key.pem');

      fs.writeFileSync(tempCertPath, certContent);
      fs.writeFileSync(tempKeyPath, keyContent);

      this.afip = new Afip({
        CUIT: this.cuenta.cuit,
        cert: tempCertPath,
        key: tempKeyPath,
        production: false, // Usar ambiente de homologación
        res_folder: tempCertDir,
        ta_folder: tempCertDir,
        wsdl_folder: tempCertDir
      });

      this.initialized = true;
      console.log(`AFIP inicializado correctamente para ${this.cuenta.nombre}`);
    } catch (error) {
      console.error('Error al inicializar AFIP:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.initialize();
      console.log('Probando conexión con AFIP...');
      
      // Intentar obtener el último comprobante
      const lastVoucher = await this.afip.ElectronicBilling.getLastVoucher(1, 1);
      console.log('Último comprobante:', lastVoucher);
      
      return {
        success: true,
        message: 'Conexión exitosa con AFIP',
        lastVoucher
      };
    } catch (error) {
      console.error('Error al probar conexión:', error);
      throw error;
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

module.exports = AfipService; 