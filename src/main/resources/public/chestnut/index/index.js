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
            } else if (data.code == '40001') {
                getToken();
            } else if (data.code == '40004') {
                myLocal.deleteItem('userInfo')
            }
        },
        error: function(err) {
            layer.msg('服务器维护中...')
            console.log(err)
        },
    });

    // 自测评估
    $('.assess').click(function() {
        // 判断用户信息
        if (!myLocal.getItem('userInfo')) {
            window.location = '/chestnut/newrecord/newrecord.html'
        } else if (myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientAge) {
            // 答题
            window.location = '/chestnut/answer/answer.html'
        } else {
            // 基本信息
            window.location = '/chestnut/infoEntry/infoEntry.html'
        }
    });

    // 解读化验单
    $('.assay').click(function() {
        // 判断是否有年龄
        if (!myLocal.getItem('userInfo')) {
            window.location = '/chestnut/newrecord/newrecord.html'
        } else if (myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientAge) {
            window.location = '/chestnut/assay/assay.html';
        } else {
            layer.msg('请去个人中心完善年龄');
        }
    })
})
