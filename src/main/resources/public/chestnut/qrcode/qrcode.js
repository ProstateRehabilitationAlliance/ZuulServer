$(function() {
    // 获取token
    function getToken() {
        $('form')[0].submit();
        var codeStr = window.location.href.split('?')[1].split('=')[1].split('&')[0];
        $.ajax({
            type: 'POST',
            url: IP + '/api-doctor/weChat/oauth',
            dataType: 'json',
            data: {
                "code": codeStr,
            },
            async: false,
            success: function(data) {
                console.log(data)
                if (data.code == '20000') {
                    myLocal.setItem('token', data.result);
                    window.location.reload();
                } else {
                    getToken();
                }
            },
            error: function(err) {
                console.log(err)
            },
        });
    }
    // 获取用户信息
    $.ajax({
        type: 'POST',
        url: IP + '/api-record/patientAnamnesis/selete',
        dataType: 'json',
        data: {
            "token": myLocal.getItem('token'),
        },
        async: false,
        success: function(data) {
            console.log(data)
            if (data.code == '20000') {
                myLocal.setItem('userInfo', data.result);
                // 微信端获取医患关系绑定二维码
                $.ajax({
                    type: 'POST',
                    url: IP + '/api-doctor/weChat/getQRCode',
                    dataType: 'json',
                    data: {
                        "token": myLocal.getItem('token'),
                    },
                    success: function(data) {
                        console.log(data)
                        if (data.code == '20000') {
                            $('.qrcodeText').html('绑定码'+data.result);
                            $('.qrcodeImg').qrcode({
                                render: 'canvas',
                                width: 200,
                                height: 200,
                                // foreground: "black",
                                // background: "#FFF",
                                text: data.result,
                            });
                        } else if (data.code == '40001') {
                            getToken();
                        } else {
                            $('.qrcodeImg').qrcode({
                                render: 'canvas',
                                width: 200,
                                height: 200,
                                // foreground: "black",
                                // background: "#FFF",
                                text: '',
                            });
                        }
                    },
                    error: function(err) {
                        console.log(err)
                    },
                });
            } else if (data.code == '40001') {
                getToken();
            } else if (data.code == '40004') {
                myLocal.deleteItem('userInfo');
                window.location = '/chestnut/newrecord/newrecord.html'
            }
        },
        error: function(err) {
            layer.msg('服务器维护中...')
            console.log(err)
        },
    });

    setTimeout(function() {
        $('.refreshBtn').css({
            "display": "flex"
        });
    }, 300000)
    $('.refreshBtn').click(function() {
        $.ajax({
            type: 'POST',
            url: IP + '/api-doctor/weChat/getQRCode',
            dataType: 'json',
            data: {
                "token": myLocal.getItem('token'),
            },
            success: function(data) {
                console.log(data)
                if (data.code == '20000') {
                    $('.qrcodeImg').html('');
                    $('.qrcodeText').html('绑定码'+data.result);
                    $('.qrcodeImg').qrcode({
                        render: 'canvas',
                        width: 200,
                        height: 200,
                        // foreground: "black",
                        // background: "#FFF",
                        text: data.result,
                    });
                    $('.refreshBtn').css({
                        "display": "none"
                    });
                    setTimeout(function() {
                        $('.refreshBtn').css({
                            "display": "flex"
                        });
                    }, 300000)
                } else if (data.code == '40001') {
                    getToken();
                }
            },
            error: function(err) {
                console.log(err)
            },
        });
    })
    if (myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientName) {
        $('.name').html(myLocal.getItem('userInfo').patientName);
    } else {
        $.ajax({
            type: 'POST',
            url: IP + '/api-doctor/weChat/getUserInfo',
            dataType: 'json',
            data: {
                "token": myLocal.getItem('token'),
            },
            async: false,
            success: function(data) {
                console.log(data)
                if (data.code == '20000') {
                    $('.name').html(data.result.nickName);
                } else if (data.code == '40001') {
                    getToken();
                }
            },
            error: function(err) {
                console.log(err)
            },
        });
    }
    $('.tel').html(myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientPhone?myLocal.getItem('userInfo').patientPhone:null);
})
