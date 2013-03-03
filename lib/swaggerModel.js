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
  }
};