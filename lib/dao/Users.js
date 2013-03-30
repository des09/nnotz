var ObjectID = require('mongodb').ObjectID,
  util = require('util'),
  Dao = require('./Dao').Dao;

function Users(name) {
  Dao.call(this,name);
}

exports.Users = Users;

util.inherits(Users, Dao);

//TODO different semantics in notes, rename this to findsByUnique
Users.prototype.findBy = function(key, v, done) {
  var t = this,
    qry = {};

  qry[key] = v;
  this.col.find(qry, {
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