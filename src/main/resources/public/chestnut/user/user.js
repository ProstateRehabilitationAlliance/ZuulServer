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
            } else if (data.code == '40004') {
                myLocal.deleteItem('userInfo')
            } else {
                myLocal.setItem('userInfo', data.result);
            }
        },
        error: function(err) {
            console.log(err)
        },
    });


    // 获取登录者 的微信基本信息
    var nickName = '';
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
                $('.userImg').attr('src', data.result.headImgUrl);// 用户头像
                nickName = data.result.nickName;// 微信昵称
            } else if (data.code == '40001') {
                getToken();
            }
        },
        error: function(err) {
            console.log(err)
        },
    });

    // 用户头像
    // $('.userImg').attr('src', '');
    // 姓名
    $('.username').html(myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientName ? myLocal.getItem('userInfo').patientName : nickName);
    // 档案号
    $('.account').html(myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientNumber ? '档案号：' + myLocal.getItem('userInfo').patientNumber: '');
})
