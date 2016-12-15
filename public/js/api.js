var setLoginState = function(state) {
    if (state === true) {
        $('.onLoginShow').show();
        $('.onLoginHide').hide();
    } else {
        $('.onLoginShow').hide();
        $('.onLoginHide').show();
    }
};
var isGM = function() {
    return new Promise(function(resolve, reject) {
        try {
            $.ajax({
                'url': '../user/isGM',
                'dataType': 'json'
            }).done(function(data) {
                if (data.success === true) {
                    resolve(data.result);
                } else {
                    reject(data.error);
                }
            });
        } catch (e) {
            return reject(e);
        }
    });
}
var assembleErrorData = function(error) {
    var ret = {};
    ret.keys = ['error'];
    ret.error = error;
    return ret;
};
var loadLoginPage = function(target) {
    return loadTemplate('login', target).then(function(value) {
        $('button[type="submit"]').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var postbody = {};
            var form = $('form.pure-form');
            form.find('input').each(function(i, e) {
                postbody[$(e).attr('name')] = $(e).val();
            });
            form.find('select').each(function(i, e) {
                postbody[$(e).attr('name')] = $(e).val();
            });
            $.ajax({
                url: '../user/login',
                dataType: 'json',
                method: 'POST',
                data: postbody
            }).done(function(data) {
                if (data.success === false) {
                    setLoginState(false);
                    return loadTemplate('error', target, assembleErrorData(data.error));
                } else {
                    setLoginState(true);
                    isGM().then(function(value) {
                        if (value === true)
                            return loadTemplate('newTech', target);
                        else {
                            return loadTemplate('resourceTable', target);
                        }
                    }, function(error) {
                        return loadTemplate('error', target, assembleErrorData(error));
                    });
                }
            });
        });
    }, function(reason) {
        return loadTemplate('error', target, assembleErrorData(reason));
    });
};
var logoutHandler = function(target) {
    $.ajax({
        url: "../user/logout",
        dataType: 'json'
    }).done(function(data) {
        setLoginState(false);
        return loadLoginPage(target);
    });
};
var loadRegisterPage = function(target) {
    return loadTemplate('register', target).then(function(value) {
        $('button[type="submit"]').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var postbody = {};
            var form = $('form.pure-form');
            form.find('input').each(function(i, e) {
                if ($(e).attr('type') === 'checkbox') {
                    postbody[$(e).attr('name')] = $(e).is(":checked");
                } else {
                    postbody[$(e).attr('name')] = $(e).val();
                }
            });
            form.find('select').each(function(i, e) {
                postbody[$(e).attr('name')] = $(e).val();
            });
            $.ajax({
                url: '../user/register',
                dataType: 'json',
                method: 'POST',
                data: postbody
            }).done(function(data) {
                if (data.success === false) {
                    return loadTemplate('error', target, assembleErrorData(data.error));
                } else {
                    return loadLoginPage(target);
                }
            });
        });
    }, function(reason) {
        return loadTemplate('error', target, assembleErrorData(reason));
    });
};
var loadNewTech = function(target) {
    return loadTemplate('newTech', target).then(function(value) {
        loadPlayerName($('div#playerNameSelection')).then(function(result){
        $('button[type="submit"]').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var postbody = {};
            var form = $('form.pure-form');
            form.find('input').each(function(i, e) {
                postbody[$(e).attr('name')] = $(e).val();
            });
            form.find('select').each(function(i, e) {
                postbody[$(e).attr('name')] = $(e).val();
            });
            $.ajax({
                url: '../tech/new',
                dataType: 'json',
                method: 'POST',
                data: postbody
            }).done(function(data) {
                if (data.success === false) {
                    return loadTemplate('error', target, assembleErrorData(data.error));
                } else {
                    return loadNewTech(target);
                }
            });
        });
      });
    }, function(reason) {
        return loadTemplate('error', target, assembleErrorData(reason));
    });
};
var loadResourceTable = function(target) {
    return loadTemplate('defaultTables', target).then(function(value) {
        $.getScript({
            url: '../public/js/resource_table.js',
            dataType: 'script',
        }).done(function() {
            loadTable();
        });
    });
};
var assemblePlayerName = function(player) {
    var ret = {};
    ret.keys = {};
    ret.body = {};
    ret.keys.list = ["_id", "displayname"];
    ret.body.list = ["toAdd"];
    ret.list = player;
    return ret;
};
var loadPlayerName = function(target) {
  return new Promise(function(resolve, reject){
    $.ajax({
        url: "../tech/players",
        dataType: 'json'
    }).done(function(data) {
        if (data.success === false) {
            return reject(loadTemplate('error', target, assembleErrorData(data.error)));
        } else {
            return resolve(loadTemplate('playerNames', target, assemblePlayerName(data.result)));
        }
    });
  });
};
