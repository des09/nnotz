var ObjectID = require('mongodb').ObjectID,
  datasource = require('./../datasource'),
  util = require('util');

function Dao(name) {
    if(!name) throw new Error('name must be defined when constructing Dao');
  this.name = name;
  this.col = null;
  this.SAFE = {
    w: 1
  };
  return this;
}

exports.Dao = Dao;


Dao.prototype.pack = function(user) {
  if (user !== null && user.id) {
    user._id = ObjectID.createFromHexString(user.id);
    delete user.id;
  }
  return user;
};

Dao.prototype.unpack = function unpack(o) {
  if (o && o._id) {
    o.id = o['_id'].toHexString();
    delete o['_id'];
  }
  return o;
};

Dao.prototype.setCollection = function setCollection(collection) {
  this.col = collection;
  this.col.count(function(err, count) {
    console.log(count + " users known.");
  });
};

Dao.prototype.insert = function insert(obj, done) {
  var t = this;
  this.connect(this.name, function(err, col) {
    col.insert(obj, t.SAFE, function(err, result) {
      done(err, t.unpack(result[0]));
    });
  });
};

Dao.prototype.deleteById = function deleteById(id, done) {
  var t = this;
  var q = { _id: ObjectID.createFromHexString(id)};
  this.connect(this.name, function(err, col) {
    col.remove(q, t.SAFE, function(err, result) {
      console.log("delete result:" + util.inspect(result));
      done(err, t.unpack(result[0]));
    });
  });
};

Dao.prototype.getById = function _getById(id, done) {
  this.connect(this.name, function(err, col) {
    col.findOne({
      _id: ObjectID.createFromHexString(id)
    }, function(err, result) {
      done(err, result);
    });
  });
};

Dao.prototype.connect = function connect(name, done) {
  var t = this;
  if (this.col) {
    done(null, this.col);
  } else {
      datasource.getConnection(name, function(err, col) {
      t.setCollection(col);
      done(err, col);
    });
  }
};