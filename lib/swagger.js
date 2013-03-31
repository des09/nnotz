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

  swagger.addValidator(
  function validate(req, path, httpMethod) {
    //  only allow logged in users
    if (req.user) return true;
    return false;
  });

  swagger.setHeaders = function setHeaders(res) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");
    res.header("Content-Type", "application/json; charset=utf-8");
  };

  swagger.setAppHandler(app);
  swagger.addModels(require('./swaggerModel'));
  setupStatic(app);
};


exports.start = function _start(app) {
  console.log('configured swagger at ' + app.get('realm'));
  swagger.configure(app.get('realm'), "0.1");
};

exports.addPost = function _addPost(op) {
  swagger.addPost(op);
};

exports.addGet = function _addGet(op) {
  swagger.addGet(op);
};

exports.addDelete = function _addDelete(op) {
  swagger.addDelete(op);
};