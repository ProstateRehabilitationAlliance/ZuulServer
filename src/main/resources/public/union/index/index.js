$(function () {
    if (!$.cookie('token')) {
        window.location = '/union/login/login.html'
    }
})
