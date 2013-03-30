var ObjectID = require('mongodb').ObjectID,
  util = require('util'),
  Dao = require('./Dao').Dao;

function Notes(name) {
  Dao.call(this,name);
}

module.exports.Notes = Notes;

util.inherits(Notes, Dao);

Notes.prototype.findBy = function(key, v, limit, offset, done) {
  var t = this;

  this.connect(this.name, function(err, col) {
    if (err) return done(err, col);

    var qry = {};
    qry[key] = v;
    col.find(qry, {
      limit: limit,
      skip: offset
    }, function(err, result) {
      if (err) return done(err, null);
      result.toArray(function(err, r) {
        r.forEach(function(rr) {
          t.unpack(rr);
        });
        done(null, r);
        try {
          result.close();
        } catch (err) {
          console.log(err);
        }
      });

    });
  });
};

Notes.prototype.findByUnique = function(key, v, done) {
  var t = this,
    qry = {};
  qry[key] = v;
  t.col.find(qry, {
    limit: 20
  }, function(err, result) {
    if (err) {
      done(err, null);
    } else {
      result.nextObject(function(err, r) {
        done(null, t.unpack(r));
        try {
          result.close();
        } catch (err) {
          console.log(err);
        }
      });
    }
  });
};