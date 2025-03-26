# Sistema de Facturación AFIP

Sistema de facturación electrónica integrado con AFIP para la gestión de comprobantes fiscales.

## Características

- Integración con AFIP para facturación electrónica
- Gestión de trabajos y edificios
- Exportación a Excel y Google Sheets
- Sistema de autenticación y autorización
- Interfaz moderna y responsive

## Requisitos

- Node.js >= 14
- MongoDB
- Certificados de AFIP (homologación o producción)

## Configuración

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd facturacion-afip.v2
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
Crear un archivo `.env` con las siguientes variables:
```
MONGODB_URI=tu_uri_de_mongodb
GOOGLE_SHEET_ID=tu_id_de_google_sheets
AFIP_CUIT=tu_cuit
NODE_ENV=development
PORT=3001
```

4. Configurar certificados AFIP
- Crear directorio `certificates/`
- Colocar los archivos `cert.pem` y `key.pem` en el directorio

## Estructura de Directorios

```
├── src/
│   ├── client/          # Frontend React
│   └── server/          # Backend Node.js
│       ├── config/      # Configuraciones
│       ├── routes/      # Rutas API
│       └── services/    # Servicios
├── certificates/        # Certificados AFIP (ignorado en git)
└── pdfs/               # PDFs generados (ignorado en git)
```

## Desarrollo

```bash
# Iniciar en modo desarrollo
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## Producción

```bash
# Construir para producción
npm run build

# Iniciar en producción
npm start
```

## Seguridad

- Los certificados y claves privadas de AFIP deben mantenerse seguros
- No compartir el archivo `.env`
- Las credenciales están excluidas del control de versiones

## Licencia

Este proyecto es privado y confidencial.
