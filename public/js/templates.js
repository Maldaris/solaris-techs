var loginSource = "../public/templates/login.html";
var errorSource = "../public/templates/error.html";
var registerSource = "../public/templates/register.html";


var newTechSource = "../public/templates/newTech.html";
var playerNamesSource  = "../public/templates/playerNames.html";
var playerNamesTileSource  = "../public/templates/playerNamesTile.html";
function loadSrc(url) {
    if (Array.isArray(url)) {
          var promises = [];
          for(var i = 0; i < url.length; i++){
            promises.push(loadSrc(url[i]));
          }
          return Promise.all(promises);
    } else {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.responseType = 'text';

            request.onload = function() {
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject(Error('Source didn\'t load successfully; error code:' + request.statusText));
                }
            };
            request.onerror = function() {
                reject(Error('There was a network error.'));
            };
            request.send();
        });
    }
}

var defaultApplicator = function(src, dat) {
    var body = "" + src;
    var values = [];

    for(var i = 0; i < dat.keys.length; i++) {
        values.push(dat[dat.keys[i]]);
    }
    if(values.length > 1)
      return vsprintf(src, values);
    else
      return sprintf(src, values[0]);
};
var nullApplicator = function(src, data){
  return src;
};
var listApplicator = function(src, data) {
    var body = src[0];
    var tileSrc = src[1];
    var toAdd = "";
    var list = data.list;
    for(var i = 0; i < list.length; i++){
      var listObj = list[i];
      listObj.keys = data.keys.list;
      toAdd += "\n" + defaultApplicator(tileSrc, listObj);
    }
    var comp = {};
    comp.keys = data.body.list;
    for(var j = 0; j < comp.keys.length; j++){
      comp[comp.keys[j]] = data[comp.keys[j]];
    }
    comp.toAdd = toAdd;
    return defaultApplicator(src[0], comp);
};

function Template(src, applicator) {
    this.applicator = applicator;
    var _this = this;
    loadSrc(src).then(function(val) {
        _this.src = val;
    }).catch(function(reason) {
        throw reason;
    });
}
Template.prototype.insert = function(target, data) {
    var src = this.applicator(this.src, data);
    target.empty();
    target.append(src);
};

var templates = {
    'login': new Template(loginSource, nullApplicator),
    'error' : new Template(errorSource, defaultApplicator),
    'register' : new Template(registerSource, nullApplicator),
    'newTech': new Template(newTechSource, defaultApplicator),
    'playerNames': new Template([playerNamesSource, playerNamesTileSource], listApplicator),
};

var loadTemplate = function(name, target, data) {
  return new Promise(function(resolve, reject){
    var tmp = templates[name];
    if (tmp === null || tmp === undefined) return reject(false);
    try {
        tmp.insert(target, data);
        return resolve(true);
    } catch (e) {
        return reject(e);
    }
  });

};
