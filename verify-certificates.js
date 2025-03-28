const fs = require('fs');
const path = require('path');
const forge = require('node-forge');
const cuentasAfip = require('./src/server/config/cuentasAfip');

function extractCertificateInfo(certPath) {
  try {
    // Leer el contenido del certificado
    const certContent = fs.readFileSync(certPath, 'utf8');
    
    // Parsear el certificado
    const cert = forge.pki.certificateFromPem(certContent);
    
    // Extraer información relevante
    const subject = cert.subject;
    const issuer = cert.issuer;
    const validity = cert.validity;
    
    // Buscar el CUIT en los atributos del sujeto
    const cuit = subject.getField('CN')?.value;
    
    return {
      cuit,
      subject: subject.attributes.map(attr => `${attr.shortName}=${attr.value}`).join(', '),
      issuer: issuer.attributes.map(attr => `${attr.shortName}=${attr.value}`).join(', '),
      validity: {
        notBefore: validity.notBefore,
        notAfter: validity.notAfter
      },
      serialNumber: cert.serialNumber
    };
  } catch (error) {
    console.error(`Error al procesar el certificado ${certPath}:`, error);
    return null;
  }
}

function verifyCertificates() {
  console.log('Verificando certificados...\n');
  
  for (const [cuentaId, cuenta] of Object.entries(cuentasAfip)) {
    console.log(`\nVerificando certificado para ${cuenta.nombre} (${cuentaId})`);
    console.log('CUIT configurado:', cuenta.cuit);
    
    const certPath = cuenta.certificado;
    if (!fs.existsSync(certPath)) {
      console.log('❌ Error: No se encontró el archivo de certificado');
      continue;
    }
    
    const certInfo = extractCertificateInfo(certPath);
    if (!certInfo) {
      console.log('❌ Error: No se pudo extraer la información del certificado');
      continue;
    }
    
    console.log('\nInformación del certificado:');
    console.log('CUIT en certificado:', certInfo.cuit);
    console.log('Sujeto:', certInfo.subject);
    console.log('Emisor:', certInfo.issuer);
    console.log('Válido desde:', certInfo.validity.notBefore);
    console.log('Válido hasta:', certInfo.validity.notAfter);
    console.log('Número de serie:', certInfo.serialNumber);
    
    if (certInfo.cuit === cuenta.cuit) {
      console.log('✅ CUIT coincide con la configuración');
    } else {
      console.log('❌ CUIT no coincide con la configuración');
    }
    
    const now = new Date();
    if (certInfo.validity.notAfter > now) {
      console.log('✅ Certificado vigente');
    } else {
      console.log('❌ Certificado vencido');
    }
    
    console.log('----------------------------------------');
  }
}

verifyCertificates(); 