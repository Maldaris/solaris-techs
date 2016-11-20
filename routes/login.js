var Router = require('express').Router;
var crypto = require('crypto');
var sanitize = require('mongo-sanitize');

var validate = {
    '/register': {
        fields: ['user', 'pass'],
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
}
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
        for (var i = 0; i < obj.fields.length; i++) {
            if (body[obj.fields[i]] === undefined)
                return false;
        }
    }
    return body;
};
var res_error = function(res, err) {
    return res.end({
        'success': false,
        'error': err.toString()
    });
}
var res_success = function(res, err) {
    return res.end({
        'success': true,
        'result': err
    });
}

var init = function(db) {
    var UserModel = db.model('UserModel');
    var router = new Router();

    router.get('/login', function(req, res){
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    router.post('/register', function(req, res) {
        var body = fields_validate(req.body, '/register');
        if (body === false)
            res_error(res, 'Invalid post body.');
        var clean = sanitize(body);
        return UserModel.findOne({
            'username': clean.user
        }, function(err, res) {
            if (err) return res_error(res, err);
            if (res != null || res !== undefined)
                return res_error(res, 'User already exists');
            else
                return (new UserModel({
                    'username': clean.user,
                    'password': (function(pass) {
                        var hash = crypto.createHash('md5');
                        hash.update(pass);
                        hash.update(clean.user);
                        return hash.digest('base64');
                    })(clean.pass)
                })).save(function(err) {
                    if (err) return res_error(res, err);
                    return res_success(res, 'Registered Successfully!');
                });
        });
    });
    router.post('/login', function(req, res) {
        var body = fields_validate(req.body, '/login');
        if (body === false)
            res_error(res, 'Invalid post body.');
        var clean = sanitize(body);
        return UserModel.findOne({
            'username': clean.user,
            'password': function(pass) {
              var hash = crypto.createHash('md5');
              hash.update(pass);
              hash.update(clean.user);
              return hash.digest('base64');
            }(clean.pass)
        }, function(err, res) {
            if (err) return res_error(res, err);
            req.session.isAuthenticated = true;
            req.session.userData = res;
            return res_success(res, 'Logged In Successfully!');
        });
    });
    router.post('/logout', function(req, res) {
        req.session.isAuthenticated = false;
        req.session.userData = null;
        return res_success(res, 'Logged out.');
    });
    return router;
};

exports.init = init;
