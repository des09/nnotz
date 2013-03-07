var util = require('util'),
  datasource = require('./../lib/datasource'),
  Users = require('./../lib/dao/Users.js');



var user = {
  googleId: 'test_' + new Date().getTime(),
  displayName: 'des',
  email: 'des',
  created: new Date().getTime()
};



describe('Users', function() {
  describe('#insert()', function() {
    it('should insert without error', function(done) {
      datasource.getConnection('usertest', function(err, col) {
        Users.setCollection(col);

        Users.insert(user, function(err, res) {
          if (err) throw err;

          Users.findBy('googleId', user.googleId, function(err, res) {
            if (err) throw err;
            //assert something
          });

          Users.getById(user.id, function(err, res) {
            if (err) throw err;
            //assert something
          });

          Users.findBy('googleId', 'xyz', function(err, res) {
            if (err) throw err;
            //assert something
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