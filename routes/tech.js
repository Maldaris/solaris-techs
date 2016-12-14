var Router = require('express').Router;

var db_getDefaults = function(db, cb){
  return DefaultModel.findOne({}, function(err, result){
    if(err) return cb(false, err);
    return cb(true, result);
  });
};

var db_findTechs = function(db, username, cb) {
    var UserModel = db.model('UserModel');
    var TechModel = db.model('TechModel');

    UserModel.findOne({
        user: username
    }).exec(function(err, user) {
        if (err) return cb(false, err);
        var uid = user._id;
        TechModel.find({
            $or: [{
                owner: uid
            }, {
                shared_with: {
                    $in: [uid]
                }
            }]
        }).populate('EffectModel').exec(function(err, result) {
            if (err) return cb(false, err);
            return cb(true, result);
        });
    });
};
var db_findTechByType = function(db, username, category, cb) {
    var TechModel = db.model('TechModel');
    var UserModel = db.model('UserModel');
    UserModel.findOne({
        user: username
    }).exec(function(err, user) {
        if (err) return cb(false, err);
        var uid = user._id;
        TechModel.find({

        }).populate('EffectModel').exec(function(err, result) {
          if(err) return cb(false, err);
          
        });
    });
};

var init = function(db) {
    var router = new Router();

    var res_error = function(res, err, dat) {
        if (dat !== undefined) {
            return res.end(Object.assign({
                'success': false,
                'error': err.toString()
            }, dat));
        } else {
            return res.end({
                'success': false,
                'error': err.toString()
            });
        }
    };
    var res_success = function(res, err, dat) {
        if (dat !== undefined) {
            return res.end(Object.assign({
                'success': false,
                'error': err.toString()
            }, dat));
        } else {
            return res.end({
                'success': true,
                'result': err
            });
        }
    };

    router.use(function(req, res, next) {
        if (req.session.isAuthenticated !== true)
            res_error(res, "Unauthenticated");
        next();
    });
    router.get('/defaults/resources/{type}', function(req, res) {
        return db_findTechByType(db, username, ['resources', req.param.type], function(success, result) {
            if (success === false) return res_error(res, result);

        });
    });
    router.get('/defaults/construction/{type}', function(req, res) {
        return db_findTechByType(db, username, ['construction', req.param.type], function(success, result) {
            if (success === false) return res_error(res, result);
            return db_getDefaults(db, function(success, defaults){
              var val = defaults.construction[req.param.type];
              for (var i = 0; i < result.length; i++) {}
            });
        });
    });

    router.get('/techs', function(req, res) {

    });
    return router;
};
exports.init = init;
