const Trabajo = require('../models/Trabajo');
const Factura = require('../models/Factura');
const afipService = require('./afipService');

class FacturacionService {
  async distribuirFacturas() {
    try {
      console.log('Iniciando distribución de facturas...');
      const trabajosPendientes = await Trabajo.find({ estado: 'pendiente' });
      console.log(`Encontrados ${trabajosPendientes.length} trabajos pendientes`);

      // Lógica de distribución aquí...
      return { message: 'Distribución completada', trabajos: trabajosPendientes };
    } catch (error) {
      console.error('Error en distribuirFacturas:', error);
      throw error;
    }
  }

  async generarFacturasParaUsuario(usuario) {
    try {
      console.log(`Generando facturas para usuario: ${usuario}`);
      const trabajos = await Trabajo.find({ usuarioFacturador: usuario, estado: 'pendiente' });
      console.log(`Encontrados ${trabajos.length} trabajos pendientes para ${usuario}`);

      const resultados = [];
      for (const trabajo of trabajos) {
        try {
          console.log(`Procesando trabajo: ${trabajo._id}`);
          const resultado = await afipService.generarFactura(trabajo, usuario);
          console.log(`Factura generada exitosamente para trabajo ${trabajo._id}`);
          
          // Crear registro de factura
          const factura = new Factura({
            trabajo: trabajo._id,
            numeroFactura: resultado.numeroFactura,
            cae: resultado.cae,
            pdfPath: resultado.pdfPath,
            usuarioFacturador: usuario
          });
          
          await factura.save();
          console.log(`Registro de factura guardado: ${factura._id}`);
          
          // Actualizar estado del trabajo
          trabajo.estado = 'facturado';
          await trabajo.save();
          console.log(`Estado del trabajo actualizado a 'facturado'`);

          resultados.push({
            trabajo: trabajo._id,
            factura: factura._id,
            success: true
          });
        } catch (error) {
          console.error(`Error al procesar trabajo ${trabajo._id}:`, error);
          resultados.push({
            trabajo: trabajo._id,
            success: false,
            error: error.message
          });
        }
      }

      return resultados;
    } catch (error) {
      console.error('Error en generarFacturasParaUsuario:', error);
      throw error;
    }
  }

  getTrabajosAsignados(usuario) {
    // Obtener la distribución actual
    const distribucion = this.distribuirFacturas();
    
    // Retornar los IDs de los trabajos asignados al usuario
    return distribucion.distribucion[usuario].map(trabajo => trabajo._id);
  }
}

module.exports = new FacturacionService(); 