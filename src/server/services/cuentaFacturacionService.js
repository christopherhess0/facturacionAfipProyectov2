const CuentaFacturacion = require('../models/CuentaFacturacion');
const AfipService = require('./afipService');

class CuentaFacturacionService {
  constructor() {
    this.cuentas = new Map();
  }

  async cargarCuentas() {
    try {
      const cuentas = await CuentaFacturacion.find({ activa: true });
      cuentas.forEach(cuenta => {
        this.cuentas.set(cuenta.cuit, cuenta);
      });
      console.log(`Se cargaron ${cuentas.length} cuentas de facturación`);
    } catch (error) {
      console.error('Error al cargar cuentas:', error);
      throw error;
    }
  }

  async obtenerCuenta(cuit) {
    try {
      let cuenta = this.cuentas.get(cuit);
      if (!cuenta) {
        cuenta = await CuentaFacturacion.findOne({ cuit, activa: true });
        if (cuenta) {
          this.cuentas.set(cuit, cuenta);
        }
      }
      return cuenta;
    } catch (error) {
      console.error('Error al obtener cuenta:', error);
      throw error;
    }
  }

  async crearCuenta(datos) {
    try {
      const cuenta = new CuentaFacturacion(datos);
      await cuenta.save();
      this.cuentas.set(cuenta.cuit, cuenta);
      return cuenta;
    } catch (error) {
      console.error('Error al crear cuenta:', error);
      throw error;
    }
  }

  async actualizarCuenta(id, datos) {
    try {
      const cuenta = await CuentaFacturacion.findByIdAndUpdate(
        id,
        datos,
        { new: true }
      );
      if (cuenta) {
        this.cuentas.set(cuenta.cuit, cuenta);
      }
      return cuenta;
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      throw error;
    }
  }

  async eliminarCuenta(id) {
    try {
      const cuenta = await CuentaFacturacion.findByIdAndUpdate(
        id,
        { activa: false },
        { new: true }
      );
      if (cuenta) {
        this.cuentas.delete(cuenta.cuit);
      }
      return cuenta;
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      throw error;
    }
  }

  async probarConexion(cuit) {
    try {
      const cuenta = await this.obtenerCuenta(cuit);
      if (!cuenta) {
        throw new Error('Cuenta no encontrada');
      }

      const afipService = new AfipService(cuenta);
      return await afipService.testConnection();
    } catch (error) {
      console.error('Error al probar conexión:', error);
      throw error;
    }
  }
}

module.exports = new CuentaFacturacionService(); 