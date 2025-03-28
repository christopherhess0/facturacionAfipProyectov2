const path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Importar los módulos usando rutas absolutas
const AfipService = require(path.join(process.cwd(), 'src/server/services/afipService'));
const cuentasAfip = require(path.join(process.cwd(), 'src/server/config/cuentasAfip'));

async function testAllConnections() {
  for (const [cuentaId, cuenta] of Object.entries(cuentasAfip)) {
    console.log(`\nProbando conexión para ${cuenta.nombre} (${cuentaId})...`);
    try {
      const afipService = new AfipService(cuentaId);
      const resultado = await afipService.testConnection();
      console.log('✅ Conexión exitosa:', resultado);
    } catch (error) {
      console.error('❌ Error en la conexión:', error.message);
      console.error('Detalles del error:', error);
    }
  }
}

testAllConnections().catch(error => {
  console.error('Error general:', error);
  process.exit(1);
}); 