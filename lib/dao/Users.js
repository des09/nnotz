var ObjectID = require('mongodb').ObjectID,
  util = require('util'),
  col, SAFE = {
    w: 1
  };

function pack(user) {
  if (user !== null && user.id) {
    user._id = ObjectID.createFromHexString(user.id);
    delete user.id;
  }
  return user;
}

function unpack(user) {
  if (user && user._id) {
    user.id = user['_id'].toHexString();
    delete user['_id'];
  }
  return user;
}

module.exports = {
  setCollection: function _setCollection(collection) {
    col = collection;
    col.count(function(err, count) {
      console.log(count + " users known.");
    });
  },

  insert: function _addOrUpdate(user, done) {
    col.insert(user, SAFE, function(err, result) {
      done(err, unpack(result[0]));
    });
  },
  getById: function _getById(id, done) {
    col.findOne({
      _id: ObjectID.createFromHexString(id)
    }, function(err, result) {
      done(err, result);
    });
  },
//TODO different semantics in notes, rename this to findsByUnique
  findBy: function(key, v, done) {
    var qry = {};
    qry[key] = v;
    col.find(qry, {
      limit: 20
    }, function(err, result) {
      if (err) {
        done(err, null);
      } else {
        result.nextObject(function(err, r) {
          done(null, unpack(r));
          try {
            result.close();
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  }
};