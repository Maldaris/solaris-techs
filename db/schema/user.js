var mongoose = require('mongoose');

var SchemaObject = {
  username : String,
  password : String,
  user_flags : [String]
};

var SchemaOptions = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
};


exports.init = function(db) {
  var Schema = new mongoose.Schema(SchemaObject, SchemaOptions);
  exports.user = db.model('UserModel', Schema);
  exports.exportedFields = ['user'];
};
