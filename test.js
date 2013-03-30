#! /usr/bin/node

var Mocha = require('mocha'),
  fs = require('fs'),
  path = require('path');

// First, you need to instantiate a Mocha instance.
var mocha = new Mocha({
  ui: 'bdd',
  reporter: 'nyan'
});

// Then, you need to use the method "addFile" on the mocha
// object for each file.

fs.readdirSync('test').filter(function(file) {
  return file.substr(-3) === '.js';
}).forEach(function(file) {
  mocha.addFile(
  path.join('test', file));
});

// run the tests.
mocha.run(function(failures) {
  process.exit(failures);
});