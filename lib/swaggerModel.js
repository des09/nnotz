exports.models = {
  "Status": {
    "properties": {
      "status": {
        "type": "string",
        "allowableValues": {
          "valueType": "LIST",
          "values": ["up", "warnings", "errors"]
        }
      },
      "display": {
        "type": "string"
      }
    }
  },
  "Note": {
    "properties": {
      "id": {
        "type": "string"
      },
      "type": {
        "type": "string",
        "allowableValues": {
          "valueType": "LIST",
          "values": ["sticky", "todo", "comment"]
        }
      },
      "text": {
        "type": "string"
      },
     "parentId": {
        "type": "string"        
      }
    }
  }
};