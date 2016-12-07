function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
$(document).ready(function(){
  $('a#register').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    loadRegisterPage($('div.content'));
  });
  $('a#logout').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    logoutHandler($('div.content'));
  });
  $('a#login').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    loadLoginPage($('div.content'));
  });
  $('a#ViewProductList').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    loadProductIndex($('div.content'));
  });
  if(getParameterByName('doLogin') === true){
      loadLoginPage($('div.content'));
  } else {
      loadProductIndex($('div.content'));
  }
});
