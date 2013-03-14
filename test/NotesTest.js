var util = require('util'),assert= require('assert'),
  datasource = require('./../lib/datasource'),
  Notes = require('./../lib/dao/Notes.js');



var note = {
  type: 'sticky',
  text: 'des',
  created: new Date().getTime()
};

describe('Notes', function() {
  describe('#insert()', function() {
    it('should insert without error', function(done) {
      datasource.getConnection('notetest', function(err, col) {
        Notes.setCollection(col);

        Notes.insert(note, function(err, res) {
          if (err) throw err;

          Notes.findBy('type', note.type,10,0, function(err, res) {
            if (err) throw err;
            assert(res,'expect a result');
            assert(res[0],'expect an array');
            assert.equal(res[0].text,'des','note text set');
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