var util = require('util'),
  datasource = require('./../lib/datasource'),
  Users = require('./../lib/dao/Users.js');



var user = {
  googleId: 'test_' + new Date().getTime(),
  displayName: 'des',
  email: 'des',
  created: new Date().getTime()
};

datasource.getConnection('usertest', function(err, col) {
  Users.setCollection(col);
  
  Users.insert(user, function(err, res) {
    console.log(err ? err : util.inspect(user));
      Users.findBy('googleId', user.googleId , function(err, res) {
        console.log('here googleId ' + err + " " + util.inspect(res));
      });
      
      Users.getById(user.id , function(err, res) {
        console.log('here id ' + err + " " + util.inspect(res));
      });
      
      Users.findBy('googleId', 'xyz' , function(err, res) {
        console.log('here xyz ' + err + " " + util.inspect(res));
      });
      
      setTimeout(function(){        datasource.close();},2000);
  });



});