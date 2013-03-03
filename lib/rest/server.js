

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
    'action': function(req, res) {
      res.send('{"status": "up", "display": "ready for action... lets make some nnotz!"}');
    }
  };