var mongoose = require('mongoose');
var schema = require('./schema/index').dir;
var config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json'));

function setupURL(cfg, prefix){
  var URI = cfg[prefix+'URI'];
  var Username = cfg[prefix+'Username'];
  var Password = cfg[prefix+'Password'];

  return 'mongodb://' + Username + ':' + Password + '@' + URI;
}

var db_Connection = mongoose.createConnection(setupURL(config, ''), { server : { poolSize : 20 }});
exports.schema = {};
exports.schema.exportedFields = [];
schema.forEach(function(e) {
  e.init(db_Connection);
  e.exportedFields.forEach(function(d) {
    exports.schema[d] = e[d];
    exports.schema.exportedFields.push(d);
  });
});
exports.applicationConnection = db_Connection;
