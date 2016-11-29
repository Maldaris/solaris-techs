var mongoose = require('mongoose');

var SchemaObject = {
  name : String,
  owner : { type : mongoose.Schema.Types.ObjectId, ref : 'UserModel'},
  effect: [String],
  shared_with : [{ type : mongoose.Schema.Types.ObjectId, ref : 'UserModel'}]
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
  exports.tech = db.model('TechModel', Schema);
  exports.exportedFields = ['tech'];
};