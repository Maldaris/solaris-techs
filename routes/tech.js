var Router = require('express').Router;

var init = function(db){
  var router = new Router();

  var res_error = function(res, err) {
      return res.end({
          'success': false,
          'error': err.toString()
      });
  };
  var res_success = function(res, err) {
      return res.end({
          'success': true,
          'result': err
      });
  };

  router.use(function(req, res, next){
    if(req.session.isAuthenticated === false || req.session.isAuthenticated === undefined)
      res.redirect('../login/');
    next();
  });

  router.get('/', function(req, res){
      res.sendFile(path.join(__dirname, 'public', 'tech.html'));
  });
  router.get('/getUserTechs', function(req, res){

  });
  router.get('/getGlobalTechs', function(req, res){

  });
  router.get('/getUserPrivateTechs', function(req, res){

  });
  router.post('/markTechPrivate', function(req, res){

  });
  router.post('/shareTech', function(req, res){

  });

  return router;
};
exports.init = init;
