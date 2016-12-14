var mongoose = require('mongoose');

var SchemaObject = {
  category : String,
  target : String,
  modifier: Number,
  operation : String
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
  exports.effect = db.model('EffectModel', Schema);
  exports.exportedFields = ['effect'];
};
