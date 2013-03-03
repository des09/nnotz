var express = require('express'),
  swagger = require("swagger-node-express");

function setupStatic(app) {
  var docs_handler = express.static(__dirname + '/../swagger-ui-1.1.7/');

  app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
    if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
      res.writeHead(302, {
        'Location': req.url + '/'
      });
      res.end();
      return;
    }
    // take off leading /docs so that connect locates file correctly
    req.url = req.url.substr('/docs'.length);
    return docs_handler(req, res, next);
  });
}

exports.configure = function _configure(app) {
  swagger.setAppHandler(app);
  swagger.addModels(require('./swaggerModel'));
  setupStatic(app);
};


exports.start = function _start(app) {
  swagger.configure("http://localhost:3001/", "0.1");
};

exports.addGet = function _addGet(op){
  swagger.addGet(op);
};