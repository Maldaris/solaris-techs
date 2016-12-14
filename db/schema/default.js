var mongoose = require('mongoose');

var SchemaObject = {

  resources:{
  food:
  {
    '0-40':{type:Number,default:0},
    '40-55':{type:Number,default:2},
    '56-65':{type:Number,default:3},
    '65-80':{type:Number,default:4},
    '81-89':{type:Number,default:5},
    '90-100':{type:Number,default:8}
  },
  raw:
  {
    '0-40':{type:Number,default:0},
    '40-55':{type:Number,default:2},
    '56-65':{type:Number,default:3},
    '65-80':{type:Number,default:4},
    '81-89':{type:Number,default:5},
    '90-100':{type:Number,default:8}
  },

  water:
  {
    '0-40':{type:Number,default:0},
    '40-55':{type:Number,default:1},
    '56-65':{type:Number,default:2},
    '65-80':{type:Number,default:3},
    '81-89':{type:Number,default:4},
    '90-100':{type:Number,default:6}
  },
  fuel:
  {
    '0-40':{type:Number,default:0},
    '40-55':{type:Number,default:1},
    '56-65':{type:Number,default:2},
    '65-80':{type:Number,default:3},
    '81-89':{type:Number,default:4},
    '90-100':{type:Number,default:6}
  },

    exotic:
  {
    '0-40':{type:Number,default:0},
    '40-60':{type:Number,default:1},
    '61-70':{type:Number,default:2},
    '71-80':{type:Number,default:3},
    '81-89':{type:Number,default:4},
    '90-100':{type:Number,default:6}
  }
},



  construction:
  {
    speed:{type:Number,default:5},
     cost:
    {
      food:{type:Number,default:0},
      water:{type:Number,default:0},
      fuel:{type:Number,default:1},
      raw:{type:Number,default:4},
      exotic:{type:Number,default:2},
    }
  }



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
  exports.default = db.model('DefaultModel', Schema);
  exports.exportedFields = ['default'];
};
