var setLoginState = function(state) {
    if (state === true) {
        $('.onLoginShow').show();
        $('.onLoginHide').hide();
    } else {
        $('.onLoginShow').hide();
        $('.onLoginHide').show();
    }
}
var assembleNewReviewData = function(productId, productName){
  var ret = {
    'productId' : productId,
    'productName'  : productName
  };
  ret.keys = ['productName', 'productId'];
  return ret;
};

var assembleErrorData = function(error) {
    var ret = {};
    ret.keys = ['error'];
    ret.error = error;
    return ret;
};
var assembleProductsData = function(products) {
    var ret = {};
    ret.keys = {};
    ret.body = {};
    ret.keys.list = ["name", "price", "ratings", "_id"];
    ret.body.list = ["toAdd"];
    ret.list = products;
    return ret;
};
var assembleReviewsData = function(productName, reviews) {
    var ret = { productName : productName };
    ret.keys = {};
    ret.body = {};
    ret.keys.list = ["rating", "body"];
    ret.body.list = ["productName", "toAdd"];
    ret.list = reviews;
    ret.productName = productName;
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
                    return loadProductIndex(target);
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
        return loadLoginPage(target);
    });
};
var loadRegisterPage = function(target){
  return loadTemplate('register', target).then(function(value){
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
  }, function(reason){
    return loadTemplate('error', target, assembleErrorData(reason));
  });
}
var loadProductIndex = function(target) {
    $.ajax({
        url: "../products/all",
        dataType: 'json'
    }).done(function(data) {
        if (data.success === false) {
            return loadTemplate('error', target, assembleErrorData(data.error));
        } else {
            return loadTemplate('products', target, assembleProductsData(data.result)).then(function(resolve) {
                $('a.inspectProduct').click(function(e) {
                    var productId = $(e.target).attr('id');
                    var productName = $(e.target).parent().children('span.productsTileName').html();
                    return loadReviewsForProduct(target, productId, productName);
                });
            }, function(reason) {
                return loadTemplate('error', target, assembleErrorData(reason));
            });
        }
    });
};
var loadNewReview = function(target, productId, productName) {
  return loadTemplate('newReview', target, assembleNewReviewData(productId, productName)).then(function(value){
    $('button[type="submit"]').click(function(e){
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
      form.find('textarea').each(function(i, e){
          postbody[$(e).attr('name')] = $(e).val();
      });
      $.ajax({
          url: '../reviews/new',
          dataType: 'json',
          method: 'POST',
          data: postbody
      }).done(function(data) {
          if (data.success === false) {
              return loadTemplate('error', target, assembleErrorData(data.error));
          } else {
              return loadReviewsForProduct(target, productId, productName);
          }
      });
    });
  }, function(reason){
    return loadTemplate('error', target, assembleErrorData(reason));
  });
};
var loadReviewsForProduct = function(target, productId, productName) {
    $.ajax({
        url: '../reviews/product/' + productId,
        dataType: 'json'
    }).done(function(data) {
        if (data.success === false) {
            return loadTemplate('error', target, assembleErrorData(data.result));
        } if(data.success === true && data.result.length === 0){
            return loadNewReview(target, productId, productName);
        } else {
            return loadTemplate('reviews', target, assembleReviewsData(productName, data.result)).then(function(value) {
                $('button[type="submit"]').click(function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  return loadNewReview(target, productId, productName);
                });
            }, function(reason) {
                return loadTemplate('error', target, assembleErrorData(reason));
            });
        }
    });
};
