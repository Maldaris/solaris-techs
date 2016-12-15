$.ajax({
    url: '../user/state',
    dataType: 'json'
}).done(function(result) {
    setLoginState(result.success);
});
$('a#AddNewTech').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    loadNewTech($('div.content'));
});
$('a#register').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    loadRegisterPage($('div.content'));
});
$('a#logout').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    logoutHandler($('div.content'));
});
$('a#login').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    loadLoginPage($('div.content'));
});
