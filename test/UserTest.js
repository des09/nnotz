var util = require('util'),assert= require('assert'),
  datasource = require('./../lib/datasource'),
  Users = require('./../lib/dao/Users.js');



var user = {
  googleId: 'test_' + new Date().getTime(),
  displayName: 'des',
  email: 'des',
  created: new Date().getTime()
};
 console.log('assert is a ' + typeof assert);


describe('Users', function() {
  describe('#insert()', function() {
    it('should insert without error', function(done) {
      datasource.getConnection('usertest', function(err, col) {
        Users.setCollection(col);

        Users.insert(user, function(err, res) {
          if (err) throw err;

          Users.findBy('googleId', user.googleId, function(err, res) {
            if (err) throw err;
            assert(res,'expect a user');
            assert.equal(res.displayName,'des','user displayName');
            assert.equal(res.email,'des','user email');
          });

          Users.getById(user.id, function(err, res) {
            if (err) throw err;
            assert(res,'expect a user');
            assert.equal(res.displayName,'des','user displayName');
            assert.equal(res.email,'des','user email');
          });

          Users.findBy('googleId', 'xyz', function(err, res) {
            if (err) throw err;
            assert.equal(res ,null,'expect no user');
          });

          setTimeout(function() {
            datasource.close();
          }, 200);

          done();
        });
      });
    });
  });


});