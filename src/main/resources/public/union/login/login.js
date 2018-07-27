$(function(){

    // 登录注册切换
    // $('.userContent > ul > li').click(function(){
    //     $(this).addClass('active').siblings('li').removeClass('active');
    //     if($(this).index() == 0){
    //         $('.signUpBox').show();
    //         $('.signInBox').hide();
    //     }else {
    //         $('.signUpBox').hide();
    //         $('.signInBox').show();
    //     }
    // });
    // 注册验证
    // var iphoneInput = $('.iphoneInput');// 账号
    // var password = $('.password');// 密码1
    // var passwordIn = $('.passwordIn');// 确认密码
    // iphoneInput.blur(function (){
    //     if(!RegExpObj.Reg_TelNo.test(iphoneInput.val())){
    //         $(this).addClass('error')
    //     }
    // }).focus(function () {
    //     if(!RegExpObj.Reg_TelNo.test(iphoneInput.val())){
    //         $(this).removeClass().val("");
    //     }
    // })
    // password.blur(function (){
    //     if(!RegExpObj.Reg_PassWord.test($(this).val())){
    //         $(this).addClass('error')
    //     }
    // }).focus(function () {
    //     if(!RegExpObj.Reg_PassWord.test($(this).val())){
    //         $(this).removeClass().val("");
    //     }
    // })
    // passwordIn.blur(function (){
    //     if(!RegExpObj.Reg_PassWord.test($(this).val()) || passwordIn.val() != password.val()){
    //         $(this).addClass('error')
    //     }
    // }).focus(function () {
    //     if(!RegExpObj.Reg_PassWord.test(passwordIn.val()) || passwordIn.val() != password.val()){
    //         passwordIn.removeClass().val("");
    //     }
    // });
    // 注册事件
    // $('.signInBtn').click(function (){
    //     if (iphoneInput.val() && password.val() && passwordIn.val()) {
    //         // 注册 ajax
    //         $.ajax({
    //             type:'POST',
    //             url: IP + '/api-doctor/doctor/register',
    //             dataType:'json',
    //             data:{
    //                 "doctorPhone":iphoneInput.val(),
    //                 "doctorPassword":passwordIn.val()
    //             },
    //             success:function(data){
    //                 console.log(data)
    //                 if(data.code === 20000){
    //                     iphoneInput.val('');
    //                     password.val('');
    //                     passwordIn.val('');
    //                     layer.open({
    //                         type: 0,
    //                         title: '',
    //                         closeBtn: 0,
    //                         content: '注册成功',
    //                         btn: ['确认'],
    //                         yes: function(){
    //                             layer.closeAll();
    //                             $('.userContent > ul > li').removeClass('active').eq(0).addClass('active');
    //                             $('.signUpBox').show();
    //                             $('.signInBox').hide();
    //                         }
    //                     });
    //                 } else {
    //                     layer.msg('注册失败');
    //                 }
    //             },
    //             error:function(err){
    //                 layer.open({
    //                     type: 0,
    //                     title: '',
    //                     closeBtn: 0,
    //                     content: '注册失败，请重试或联系客服',
    //                     btn: ['确认'],
    //                     yes: function(){
    //                         layer.closeAll();
    //                     }
    //                 });
    //             },
    //         });
    //     } else {
    //         layer.msg('请完善信息');
    //     }
    //
    // })

    var iphoneInputIn = $('.iphoneInputIn');
    var passwordUp = $('.passwordUp');
    iphoneInputIn.blur(function () {
        if(!RegExpObj.Reg_TelNo.test($(this).val())){
            $('.userItem').addClass('error')
        }
    }).focus(function () {
        if(!RegExpObj.Reg_TelNo.test($(this).val())){
            $('.userItem').removeClass('error');
            $(this).val('');
        }
    })
    passwordUp.blur(function (){
        if(!RegExpObj.Reg_PassWord.test($(this).val())){
            $('.passwordItem').addClass('error')
        }
    }).focus(function () {
        if(!RegExpObj.Reg_PassWord.test($(this).val())){
            $('.passwordItem').removeClass('error');
            $(this).val('');
        }
    })
    // 登录事件
    $('.logInBtn').click(function () {
        if(!RegExpObj.Reg_TelNo.test(iphoneInputIn.val())){
            $('.userItem').addClass('error')
        } else if (!RegExpObj.Reg_PassWord.test(passwordUp.val())) {
            $('.passwordItem').addClass('error')
        } else {
            $.ajax({
                type:'POST',
                url: IP + '/api-doctor/doctor/login',
                xhrFields: {
                   withCredentials: true
                },
                dataType:'json',
                data:{
                    "doctorPhone":iphoneInputIn.val(),
                    "doctorPassword": passwordUp.val()
                },
                success:function(data){
                    console.log(data)
                    if(data.code === 20000){
                        layer.msg('登录成功');
                        $.cookie('token', data.result , {expires: 1, path: '/', });
                        // 页面跳转
                        window.location.href="/union/index/index.html";
                    } else if(data.status === 20004){
                        layer.msg('密码错误');
                        passwordUp.val("");
                    } else {
                        layer.msg('登录失败');
                    }
                },
                error:function(err){
                    console.log(err);
                    layer.msg('登录失败');
                },
            })
        }
    });
    // 忘记密码按钮
    // $('.signUpBox > p').click(function () {
    //     $('.amendContainer').show();
    // });
    // 修改密码关闭
    // $('.amendContainer').click(function (){
    //     $(this).hide();
    // })
    // $('.amendContent').click(function () {
    //     return false;
    // })
    // var amendIphone = $('.amendIphone');
    // var amendPassword = $('.amendPassword');
    // var amendPasswordIn = $('.amendPasswordIn');
    // amendIphone.blur(function (){
    //     if(!RegExpObj.Reg_TelNo.test(amendIphone.val())){
    //         $(this).addClass('error')
    //     }
    // }).focus(function () {
    //     if(!RegExpObj.Reg_TelNo.test(amendIphone.val())){
    //         $(this).removeClass().val("");
    //     }
    // })
    // amendPassword.blur(function (){
    //     if(!RegExpObj.Reg_PassWord.test($(this).val())){
    //         $(this).addClass('error')
    //     }
    // }).focus(function () {
    //     if(!RegExpObj.Reg_PassWord.test($(this).val())){
    //         $(this).removeClass().val("");
    //     }
    // })
    // amendPasswordIn.blur(function (){
    //     if(!RegExpObj.Reg_PassWord.test($(this).val()) || amendPasswordIn.val() != amendPassword.val()){
    //         $(this).addClass('error')
    //     }
    // }).focus(function () {
    //     if(!RegExpObj.Reg_PassWord.test(amendPasswordIn.val()) || amendPasswordIn.val() != amendPassword.val()){
    //         amendPasswordIn.removeClass().val("");
    //     }
    // });
    // $('.amendBtn').click(function () {
    //     if(amendIphone.val() && amendPassword.val() && amendPasswordIn.val()){
    //         $.ajax({
    //             type:'POST',
    //             url: IP + '/api-doctor/doctor/updDoctorPassword',
    //             dataType:'json',
    //             data:{
    //                 "doctorPhone":amendIphone.val(),"doctorPassword":amendPasswordIn.val()
    //             },
    //             success:function(data){
    //                 console.log(data)
    //                 if(data.code === 20000){
    //                     layer.msg('登录成功');
    //                     // 页面跳转
    //                     // window.location = '/union/index/index.html'
    //                 } else if(data.status === 20004){
    //                     layer.msg('密码错误');
    //                     amendPassword.val("");
    //                 } else {
    //                     layer.msg('登录失败');
    //                 }
    //             },
    //             error:function(err){
    //                 layer.msg('登录失败');
    //             },
    //         })
    //     }else{
    //         layer.msg('请完善信息');
    //     }
    // })
})
