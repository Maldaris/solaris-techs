var Router = require('express').Router;
var sanitize = require('mongo-sanitize');

var db_getDefaults = function(db, cb) {
    var DefaultModel = db.model('DefaultModel');
    return DefaultModel.findOne({}, function(err, result) {
        if (err) return cb(false, err);
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
            $or: [{
                owner: uid
            }, {
                shared_with: {
                    $in: [uid]
                }
            }]
        }).populate('EffectModel').exec(function(err, result) {
            if (err) return cb(false, err);
            var ret = [];
            for (var i = 0; i < result.length; i++) {
                var tech = result[i];
                for (var j = 0; j < tech.effect.length; i++) {
                    var effect = tech.effect[j];
                    if (effect.category === category[0]) {
                        if (effect.target === category[1]) {
                            ret.push(tech);
                            break;
                        }
                    }
                }
            }
            return ret;
        });
    });
};

var init = function(db) {
    var router = new Router();

    var UserModel = db.model('UserModel');
    var TechModel = db.model('TechModel');
    var EffectModel = db.model('EffectModel');

    var res_error = function(res, err, dat) {
        if (dat !== undefined) {
            return res.end(JSON.stringify(Object.assign({
                'success': false,
                'error': err.toString()
            }, dat)));
        } else {
            return res.end(JSON.stringify({
                'success': false,
                'error': err.toString()
            }));
        }
    };
    var res_success = function(res, err, dat) {
        if (dat !== undefined) {
            return res.end(JSON.stringify(Object.assign({
                'success': false,
                'error': err.toString()
            }, dat)));
        } else {
            return res.end(JSON.stringify({
                'success': true,
                'result': err
            }));
        }
    };

    router.use(function(req, res, next) {
        if (req.session.isAuthenticated !== true)
            res_error(res, "Unauthenticated");
        next();
    });
    router.get('/defaults/resources/{type}', function(req, res) {
        if (['food', 'water', 'fuel', 'raw', 'exotic'].indexOf(req.params.type) < 0) {
            return res_error(res, 'No Such type: ' + req.params.type);
        }
        return db_findTechByType(db, req.session.userData.username, ['resources', req.params.type], function(success, result) {
            if (success === false) return res_error(res, result);
            return db_getDefaults(db, function(success, defaults) {
                var val = defaults.resources[req.params.type];
                for (var i = 0; i < result.length; i++) {
                    var tech = result[i];
                    for (var j = 0; j < tech.effect.length; i++) {
                        var effect = tech.effect[j];
                        if (effect.category === 'resources' && effect.type === req.params.type) {
                            var keys = Object.keys(val);
                            var k;
                            switch (effect.operator) {
                                case "add":
                                    for (k = 0; k < keys.length; k++) {
                                        val[keys[k]] += effect.modifier;
                                    }
                                    break;
                                case "mul":
                                    for (k = 0; k < keys.length; k++) {
                                        val[keys[k]] *= effect.modifier;
                                    }
                                    break;
                            }
                        }
                    }
                }
                return res_success(err, val);
            });
        });
    });
    router.get('/defaults/construction/{type}', function(req, res) {
        if (['speed', 'cost'].indexOf(req.params.type) < 0) {
            return res_error(res, 'No Such type: ' + req.params.type);
        }
        return db_findTechByType(db, req.session.userData.username, ['construction', req.params.type], function(success, result) {
            if (success === false) return res_error(res, result);
            return db_getDefaults(db, function(success, defaults) {
                var val = defaults.construction[req.params.type];
                for (var i = 0; i < result.length; i++) {
                    var tech = result[i];
                    for (var j = 0; j < tech.effect.length; i++) {
                        var effect = tech.effect[j];
                        if (effect.category === 'construction' && effect.type === req.params.type) {
                            switch (effect.operator) {
                                case "add":
                                    val += effect.modifier;
                                    break;
                                case "mul":
                                    val *= effect.modifier;
                                    break;
                            }
                        }
                    }
                }
                return res_success(err, val);
            });
        });
    });

    router.post('/new', function(req, res) {
        return UserModel.findOne({
            username: req.session.userData.username
        }, function(err, result) {
            if (result.isGM === false) return res_error(res, 'Not a GM');
            var san = sanitize(req.body);
            return UserModel.findOne({
                _id : san.owner
            }, function(err, result) {
                if (err) return res_error(res, error);
                if (result === null || result === undefined)
                    return res_error(res, 'No such user' + san.playerName);
                var effect = new EffectModel();
                effect.target = san.target;
                effect.category = (function(target){
                  if(['cost', 'speed'].indexOf(target) < 0){
                    return 'resources';
                  } return 'construction';
                })(san.target);
                effect.modifier = san.value;
                effect.operation = san.modifer === 'ddd' ? 'add' : 'mul'
                effect.save(function(err){
                  if(err) return res_error(res, err);
                  var toAdd = new TechModel();
                  toAdd.owner = result._id;
                  toAdd.name = san.name;
                  toAdd.effect = [];
                  toAdd.effect.push(effect._id);
                  toAdd.save(function(err) {
                      if (err) return res_error(res, err);
                      return res_success(res, true);
                  });
                });
            });
        });
    });
    router.get('/players', function(req, res) {
        return UserModel.find({
            isGM: false
        }, function(err, result) {
            if (err) return res_error(res, err);
            var ret = [];
            for (var i = 0; i < result.length; i++) {
                ret.push({
                    'username': result[i].username,
                    'displayname': result[i].displayname === undefined ? result[i].username : result[i].displayname,
                    '_id': result[i]._id
                });
            }
            return res_success(res, ret);
        });
    });
    router.get('/techs', function(req, res) {
        return db_findTechs(db, req.session.userData.username, function(success, result) {
            if (success === false) return res_error(res, result);
            return res_success(res, result);
        });
    });
    return router;
};
exports.init = init;
