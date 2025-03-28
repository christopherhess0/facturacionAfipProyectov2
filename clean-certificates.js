const fs = require('fs');
const path = require('path');

function cleanCertificate(content) {
  // Eliminar espacios en blanco y retornos de carro al inicio y final
  content = content.trim();
  
  // Asegurarse de que las líneas terminen con \n
  content = content.replace(/\r\n/g, '\n');
  
  // Asegurarse de que haya una línea en blanco después del BEGIN y antes del END
  content = content.replace(/(-----BEGIN [^-]+-----)\n/, '$1\n\n');
  content = content.replace(/\n(-----END [^-]+-----)/g, '\n\n$1');
  
  return content;
}

function processCertificates(directory) {
  console.log(`Procesando certificados en ${directory}...`);
  
  const certPath = path.join(directory, 'cert.pem');
  const keyPath = path.join(directory, 'key.pem');
  
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.log(`No se encontraron los archivos en ${directory}`);
    return;
  }
  
  // Limpiar y guardar el certificado
  let certContent = fs.readFileSync(certPath, 'utf8');
  certContent = cleanCertificate(certContent);
  fs.writeFileSync(certPath, certContent);
  console.log(`Certificado limpiado: ${certPath}`);
  
  // Limpiar y guardar la clave privada
  let keyContent = fs.readFileSync(keyPath, 'utf8');
  keyContent = cleanCertificate(keyContent);
  fs.writeFileSync(keyPath, keyContent);
  console.log(`Clave privada limpiada: ${keyPath}`);
  
  // Verificar el contenido
  console.log('\nVerificando contenido:');
  console.log('Certificado:');
  console.log(certContent.substring(0, 100) + '...');
  console.log('\nClave privada:');
  console.log(keyContent.substring(0, 100) + '...');
}

// Procesar los certificados de cada cuenta
const accounts = ['christopher', 'german', 'nicole'];
accounts.forEach(account => {
  const certDir = path.join(process.cwd(), `certificates_${account}`);
  processCertificates(certDir);
  console.log('\n');
}); 