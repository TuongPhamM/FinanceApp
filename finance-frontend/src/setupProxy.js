const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  //configuring api calls, everytime the enpoints using '/api' patterns, it will fetch from localhost:8000/api/blah-blah
  app.use( 
    "/api",
    createProxyMiddleware({
      target: "http://127.0.0.1:8000",
      changeOrigin: true,
    })
  );
};
