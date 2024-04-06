/*
Middleware setup for creating a proxy to forward requests from the '/api' path to a target server.
- It requires the 'http-proxy-middleware' library.
- Exports a function that takes 'app' (an Express app instance) as a parameter.
- Configures the proxy middleware to intercept requests to '/api' and forward them to 'http://localhost:3001'.
- Sets 'changeOrigin' to 'true' to enable the proxy to rewrite the host header to match the target host.

LAST EDITED 04/05/2024 Gavin T. Anderson
*/
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:3001',
            changeOrigin: 'true',
        })
    );
};
