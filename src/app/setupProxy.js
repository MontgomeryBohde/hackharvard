const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Add proxy configuration for the API endpoint
  app.use(
    '/api', // The path you want to proxy (can be any path)
    createProxyMiddleware({
      target: 'https://api.n2yo.com', // The URL of the external API
      changeOrigin: true, // Set this to true to change the origin of the request
    })
  );
};
