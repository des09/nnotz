var MongoClient = require('mongodb').MongoClient;
var mongoUrl = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/nnotz';
var _db;

exports.getConnection = function getConnection(collectionName, done) {
  MongoClient.connect(mongoUrl, {
    auto_reconnect: true
  }, function(err, db) {
    if (err) return done(err, null);

    _db = db;
    db.createCollection(collectionName, function(err, collection) {
    
      db.admin().serverInfo(function(err, result) {
        if (err) console.log(err);
        else console.log('collection: ' + mongoUrl + '/' + collectionName + '\t' + result.version);
      });
    
      done(err, collection);
    });
  });
};

exports.close = function() {
  _db.close();
};