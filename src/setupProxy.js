const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const PORT = process.env.PORT || 5000;
  console.log('proxy PORT---', PORT);
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${PORT}`,
      changeOrigin: true,
    })
  );
  // app.use(
  //   '/api',
  //   createProxyMiddleware({
  //     target: `https://shrouded-peak-81939.herokuapp.com:${PORT}`,
  //     changeOrigin: true,
  //   })
  // );
};