var sw = require("swagger-node-express"),
  url = require("url"),
  swe = sw.errors;

var Notes;

exports.setNotes = function(dao) {
  console.log(dao);
  Notes = dao;
};

exports.addNote = {
  'spec': {
    "description": "Add a note",
    "path": "/notes.{format}",
    "notes": "Adds a new note. If a note id is passed, it will be ignored.",
    "summary": "add note.",
    "method": "POST",
    "params": [sw.postParam("Note", "Note object to be added.")],
    "errorResponses": [swe.invalid('input')],
    "nickname": "addNote"
  },
  'action': function(req, res) {
    var body = req.body;
    if (!body || !body.type) {
      throw swe.invalid('note');
    } else {
      Notes.insert(body, function(err,result){
        if(err)
          throw err;
        res.send(200);
      });
    }
  }
};

exports.deleteNote = {
  'spec': {
    "description": "Delete a note",
    "path": "/notes.{format}/{id}",
    "notes": "Deletes a note. Does not check that document exists, returns 200 if it doesn't exist.",
    "summary": "Delete note bi id.",
    "method": "DELETE",
    "params": [sw.pathParam("id", "id of note object to be deleted.", "string")],
    "errorResponses": [swe.invalid('id')],
    "nickname": "deleteNote"
  },
  'action': function deleteNote(req, res) {
    var id = req.params.id;

    if (!id) {
      throw swe.invalid('id');
    } else {
      Notes.deleteById(id, function(err,result){
        if(err)
          throw err;
        res.send(200);
      });
    }
  }
};

//TODO limit to user
exports.listNotes = {
  'spec': {
    "description": "list all notes",
    "path": "/notes.{format}",
    "notes": "Show notes. Limit defaults to 50 if not specified.",
    "summary": "list notes.",
    "method": "GET",
    "params": [sw.queryParam("limit", "max number of results.", "string",false,false,null,"50"),
               sw.queryParam("offset", "first results offset.", "string",false,false,null,"0"),
               sw.queryParam("type", "Note type", "string", false, false, "LIST[sticky,todo]",null)],
    "errorResponses": [swe.invalid('input')],
    "nickname": "listNotes"
  },
  'action': function listNotes(req, res) {
     var offset = url.parse(req.url,true).query["offset"];
     offset = offset ? parseInt(offset) : 0;

     var limit = url.parse(req.url,true).query["limit"];
     limit = limit ? parseInt(limit) : 50;
     
     var type = url.parse(req.url,true).query["type"];
     Notes.findBy('type', type, limit, offset, function(err,result){
        if(err)
          throw err;     
       res.send(JSON.stringify(result));
     });
     
  }
};

exports.status = {
  'spec': {
    "description": "Ping the server, and get its status",
    "path": "/status.{format}",
    "notes": "Returns a status, and display string",
    "summary": "Server Status",
    "method": "GET",
    "params": [],
    "responseClass": "Status",
    "errorResponses": [],
    "nickname": "status"
  },
  'action': function status(req, res) {
    res.send('{"status": "up", "display": "ready for action... lets make some nnotz!"}');
  }
};




















