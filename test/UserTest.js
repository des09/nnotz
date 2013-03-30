var util = require('util'),
  assert = require('assert'),
  datasource = require('./../lib/datasource'),
  UserDao = require('./../lib/dao/Users.js').Users,
  Dao = require('./../lib/dao/Dao.js').Dao;


var user = {
  googleId: 'test_' + new Date().getTime(),
  displayName: 'des',
  email: 'des',
  created: new Date().getTime()
};

var users = new UserDao('usertest');

describe('users', function() {
  describe('-basic functions', function() {
    it('should inherit from Dao', function(done) {
      assert(users instanceof Dao);
      done();
    });
  });

  describe('#insert()', function() {
    it('should insert without error', function(done) {

      users.insert(user, function(err, res) {
        if (err) throw err;

        users.findBy('googleId', user.googleId, function(err, res) {
          if (err) throw err;
          assert(res, 'expect a user');
          assert.equal(res.displayName, 'des', 'user displayName');
          assert.equal(res.email, 'des', 'user email');
        });

        users.getById(user.id, function(err, res) {
          if (err) throw err;
          assert(res, 'expect a user');
          assert.equal(res.displayName, 'des', 'user displayName');
          assert.equal(res.email, 'des', 'user email');
        });

        users.findBy('googleId', 'xyz', function(err, res) {
          if (err) throw err;
          assert.equal(res, null, 'expect no user');
        });

        setTimeout(function() {
          datasource.close();
        }, 200);

        done();
      });

    });
  });

});