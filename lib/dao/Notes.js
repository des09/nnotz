var ObjectID = require('mongodb').ObjectID,
  util = require('util'),
  col, SAFE = {
    w: 1
  };
//TODO the Users and Notes dao's are copy-pasted code. This needs refactoring.
function pack(o) {
  if (o !== null && o.id) {
    o._id = ObjectID.createFromHexString(o.id);
    delete o.id;
  }
  return o;
}

function unpack(o) {
  if (o && o._id) {
    o.id = o['_id'].toHexString();
    delete o['_id'];
  }
  return o;
}

module.exports = {
  setCollection: function _setCollection(collection) {
    col = collection;
    col.count(function(err, count) {
      console.log(count + " notes known.");
    });
  },

  insert: function _addOrUpdate(o, done) {
    col.insert(o, SAFE, function(err, result) {
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

  findBy: function(key, v, limit, offset, done) {
    var qry = {};
    qry[key] = v;
    col.find(qry, {
      limit: limit,
      skip: offset
    }, function(err, result) {
      if (err) {
        done(err, null);
      } else {
        result.toArray(function(err, r) {
          r.forEach(function(rr){unpack(rr);});
          done(null, r);
          try {
            result.close();
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  },
  findByUnique: function(key, v, done) {
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