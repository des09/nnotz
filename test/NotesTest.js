var util = require('util'),
  assert = require('assert'),
  NotesDao = require('./../lib/dao/Notes.js').Notes;


var note = {
  type: 'sticky',
  text: 'des',
  created: new Date().getTime()
};

var Notes = new NotesDao('notestest');

describe('Notes', function() {
  describe('#insert()', function() {
    this.timeout(50000);
    it('should insert without error', function(done) {

      Notes.insert(note, function(err, res) {
        if (err) throw err;

        Notes.findBy('type', note.type, 10, 0, function(err, res) {
          if (err) throw err;
          assert(res, 'expect a result');
          assert(res[0], 'expect an array');
          assert.equal(res[0].text, 'des', 'note text set');
        });

        done();
      });
    });
  });


});