var Router = require('express').Router;
var crypto = require('crypto');
var sanitize = require('mongo-sanitize');

var validate = {
    '/register': {
        fields: ['username', 'password','repeat-password'],
        strict: true
    },
    '/login': {
        fields: ['user', 'pass'],
        strict: true
    },
    '/logout': {
        fields: [],
        strict: false
    }
};
var fields_validate = function(body, route) {
    var obj = validate[route];
    if (obj.strict === true) {
        var stripped = {};
        for (var i = 0; i < obj.fields.length; i++) {
            if (body[obj.fields[i]] === undefined)
                return false;
            stripped[obj.fields[i]] = body[obj.fields[i]];
        }
        return stripped;
    } else {
        for (var j = 0; j < obj.fields.length; j++) {
            if (body[obj.fields[j]] === undefined)
                return false;
        }
    }
    return body;
};
var res_error = function(res, err) {
    return res.end(JSON.stringify({
        'success': false,
        'error': err.toString()
    }));
};
var res_success = function(res, err) {
    return res.end(JSON.stringify({
        'success': true,
        'result': JSON.stringify(err)
    }));
};

var init = function(db) {
    var UserModel = db.model('UserModel');
    var router = new Router();

    router.get('/state', function(req, res){
      if(req.session.isAuthenticated !== true){
        return res_error(res, 'Unauthenticated');
      } else {
        return res_success(res, req.session.userData.username);
      }
    });
    router.get('/isGM', function(req, res){
      if(req.session.isAuthenticated !== true){
        return res_error(res, 'Unauthenticated');
      } else {
        console.log(req.session);
        return res_success(res, req.session.userData.isGM);
      }
    });

    router.post('/register', function(req, res) {
        var clean = sanitize(req.body);
        return UserModel.findOne({
            'username': clean.username
        }, function(err, result) {
            if (err) return res_error(res, err);
            if (result !== null){
                console.log(result);
                return res_error(res, 'User already exists');
              }
            else
                return (new UserModel({
                    'username': clean.username,
                    'password': (function(pass) {
                        var hash = crypto.createHash('md5');
                        hash.update(pass);
                        hash.update(clean.username);
                        return hash.digest('base64');
                    })(clean.password),
                    'isGM' : clean.isGM
                })).save(function(err) {
                    if (err) return res_error(res, err);
                    return res_success(res, 'Registered Successfully!');
                });
        });
    });
    router.post('/login', function(req, res) {
        var clean = sanitize(req.body);
        console.log(clean);
        var password = function(pass) {
          var hash = crypto.createHash('md5');
          hash.update(pass.toString());
          hash.update(clean.username.toString());
          return hash.digest('base64');
        }(clean.password);
        console.log(password);
        return UserModel.findOne({
            'username': clean.username,
            'password': password
        }, function(err, result) {
            if (err) return res_error(res, err);
            if(result === null)
              return res_error(res, "No Such User");
            req.session.isAuthenticated = true;
            req.session.userData = result;
            return res_success(res, 'Logged In Successfully!');
        });
    });
    router.get('/logout', function(req, res) {
        req.session.isAuthenticated = false;
        req.session.userData = null;
        return res_success(res, 'Logged out.');
    });
    return router;
};

exports.init = init;
