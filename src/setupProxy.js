const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const proxy = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': '/api'  // mantener el prefijo /api
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Proxy] Enviando ${req.method} ${req.url} a ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[Proxy] Respuesta de ${req.url}: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error('[Proxy] Error:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({
        error: 'Error de conexión con el servidor',
        details: err.message,
        code: err.code
      }));
    }
  });

  app.use('/api', proxy);

  // Middleware adicional para logging
  app.use((req, res, next) => {
    console.log(`[Express] ${req.method} ${req.url}`);
    next();
  });
}; 