$(function() {
    layui.use(['form'], function() {

    });

    // 查询学历列表
    $.ajax({
        type: 'POST',
        url: IP + '/api-stata/education/getAll',
        dataType: 'json',
        data: {
            "token": $.cookie('token'),
        },
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                var education = data.result;
                var _html = "";
                for (var i = 0; i < education.length; i++) {
                    _html += '<option value="' + education[i].id + '">' + education[i].educationName + '</option>'
                }
                $('.educationSel').html(_html);
            } else if (data.code == 40001) {
                window.location = '/union/login/login.html';
            }  else {
                // layer.msg('注册失败');
            }
        },
        error: function(err) {

        },
    });

    // 查询职业列表
    $.ajax({
        type: 'POST',
        url: IP + '/api-stata/profession/getAll',
        dataType: 'json',
        data: {
            "token": $.cookie('token'),
        },
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                var occupation = data.result;
                var _html = "";
                for (var i = 0; i < occupation.length; i++) {
                    _html += '<option value="' + occupation[i].id + '">' + occupation[i].professionName + '</option>'
                }
                $('.occupationSel').html(_html);
            } else {

            }
        },
        error: function(err) {

        },
    });

    // 查询民族列表
    $.ajax({
        type: 'POST',
        url: IP + '/api-stata/nation/getAll',
        dataType: 'json',
        data: {
            "token": $.cookie('token'),
        },
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                var nation = data.result;
                var _html = "";
                for (var i = 0; i < nation.length; i++) {
                    _html += '<option value="' + nation[i].id + '">' + nation[i].nationName + '</option>'
                }
                $('.nationSel').html(_html);
            } else {

            }
        },
        error: function(err) {

        },
    });
    // 查询血型列表
    $.ajax({
        type: 'POST',
        url: IP + '/api-stata/bloodGroup/getAll',
        dataType: 'json',
        data: {
            "token": $.cookie('token'),
        },
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                var bloodType = data.result;
                var _html = "";
                for (var i = 0; i < bloodType.length; i++) {
                    _html += '<option value="' + bloodType[i].id + '">' + bloodType[i].bloodGroupName + '</option>'
                }
                $('.bloodTypeSel').html(_html);
            } else {

            }
        },
        error: function(err) {

        },
    });

    // 查询城市
    var region = [];
    var province = []; // 省
    var city = []; // 市
    var county = []; // 县
    var _province = '';
    var _city = '';
    var _county = '';
    $.ajax({
        type: 'POST',
        url: IP + '/api-stata/city/getCounty',
        dataType: 'json',
        data: {
            "token": $.cookie('token'),
        },
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                region = data.result;
                for (var i = 0; i < region.length; i++) {
                    _province += '<option value="' + region[i].id + '">' + region[i].cityName + '</option>';
                    city = region[0].cityList;
                }
                $('.provinceSel').html(_province);
                for (var i = 0; i < city.length; i++) {
                    _city += '<option value="' + city[i].id + '">' + city[i].cityName + '</option>';
                    county = city[0].cityList
                }
                $('.citySel').html(_city);
                for (var i = 0; i < county.length; i++) {
                    _county += '<option value="' + county[i].id + '">' + county[i].cityName + '</option>';
                }
                $('.countySel').html(_county);
            } else {
                // layer.msg('注册失败');
            }
        },
        error: function(err) {

        },
    });
    // 省的切换
    $('.provinceSel').change(function() {
        _city = '';
        _county = '';
        for (var i = 0; i < region.length; i++) {
            if ($(this).val() == region[i].id) {
                city = region[i].cityList;
            }
        }
        for (var i = 0; i < city.length; i++) {
            _city += '<option value="' + city[i].id + '">' + city[i].cityName + '</option>';
            county = city[0].cityList
        }
        $('.citySel').html(_city);
        for (var i = 0; i < county.length; i++) {
            _county += '<option value="' + county[i].id + '">' + county[i].cityName + '</option>';
        }
        $('.countySel').html(_county);
    })
    // 市的切换
    $('.citySel').change(function() {
        _county = '';
        for (var i = 0; i < city.length; i++) {
            if ($(this).val() == city[i].id) {
                county = city[i].cityList
            }
        }
        for (var i = 0; i < county.length; i++) {
            _county += '<option value="' + county[i].id + '">' + county[i].cityName + '</option>';
        }
        $('.countySel').html(_county);
    })


    // 用户名
    var patientName = $('.patientName');
    patientName.blur(function() {
        if (!RegExpObj.Reg_Name.test(patientName.val())) {
            $(this).addClass('error')
        }
    }).focus(function() {
        if (!RegExpObj.Reg_Name.test(patientName.val())) {
            $(this).removeClass('error');
            patientName.val("");
        }
    })
    // 身份证
    var patientCard = $('.patientCard');
    var patientBirthday = ''; // 出生日期
    var patientSex = ''; // 性别
    var patientCardFlag = false;
    patientCard.blur(function() {
        if (!RegExpObj.Reg_IDCardNo.test(patientCard.val())) {
            $(this).addClass('error')
        } else {
            // 身份证校验
            $.ajax({
                type: 'POST',
                url: IP + '/api-record/idCard/check',
                dataType: 'json',
                data: {
                    "token": $.cookie('token'),
                    "idCard": $(this).val(),
                },
                success: function(data) {
                    console.log(data)
                    if (data.code == 20000) {
                        patientCard.removeClass('error');
                        patientCardFlag = true;
                    } else {
                        patientCard.addClass('error')
                        layer.msg('该身份证号不可用');
                    }
                },
                error: function(err) {

                },
            });
            if ($(this).val().length == 18) {
                patientBirthday = $(this).val().substring(6, 14);
                $(this).val().substring(16, 17) % 2 == 1 ? patientSex = '男' : patientSex = '女';
                var date = new Date();
                var year = date.getFullYear();
                var birthday_year = parseInt($(this).val().substr(6, 4));
                var userage = year - birthday_year;
                $('.age').html(userage);
            } else {
                patientBirthday = 19 + $(this).val().substring(6, 12);
                $(this).val().substring(14, 15) % 2 == 1 ? patientSex = '男' : patientSex = '女';
                var date = new Date();
                var year = date.getFullYear();
                var birthday_year = parseInt($(this).val().substr(6, 4));
                var userage = year - birthday_year;
                $('.age').html(userage);
            }
            $('.patientBirthday').html(patientBirthday);
            $('.patientSex').html(patientSex);
        }
    }).focus(function() {
        if (!RegExpObj.Reg_IDCardNo.test(patientCard.val())) {
            $(this).removeClass('error');
            patientCard.val("");
        }
    })

    // 手机号
    var patientPhone = $('.patientPhone');
    patientPhone.blur(function() {
        if (!RegExpObj.Reg_TelNo.test(patientPhone.val())) {
            $(this).addClass('error')
        }
    }).focus(function() {
        if (!RegExpObj.Reg_TelNo.test(patientPhone.val())) {
            $(this).removeClass('error');
            patientPhone.val("");
        }
    })

    // 详细地区
    $('.detailAddress').blur(function() {
        if ($(this).val() == '') {
            $(this).addClass('error')
        } else {
            $(this).removeClass('error')
        }
    })

    // 切换按钮-------

    // 基本信息
    $('.tab1').click(function() {
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.userinfoContainer').show();
        $('.illnessinfoContainer').hide();
        $('.stepTwo > img').attr('src', '/union/newrecord/false.png');
        $('.stepTwo').addClass('active');
    })
    // 既往病历
    $('.tab2').click(function() {
        if (!RegExpObj.Reg_Name.test(patientName.val())) {
            patientName.addClass('error')
        } else if (!RegExpObj.Reg_IDCardNo.test(patientCard.val()) || !patientCardFlag) {
            patientCard.addClass('error')
        } else if (!RegExpObj.Reg_TelNo.test(patientPhone.val())) {
            patientPhone.addClass('error')
        } else if ($('.detailAddress').val() == '') {
            $('.detailAddress').addClass('error')
        } else {
            $('.tabBox > a').removeClass('active').eq(1).addClass('active');
            $('.illnessinfoContainer').show();
            $('.userinfoContainer').hide();
            $('.stepTwo > img').attr('src', '/union/newrecord/true.png');
            $('.stepTwo').removeClass('active');
        }
    })

    // 上一步
    $('.pervStep').click(function() {
        $('.tabBox > a').removeClass('active').eq(0).addClass('active');
        $('.userinfoContainer').show();
        $('.illnessinfoContainer').hide();
        $('.stepTwo').addClass('active');
        $('.stepTwo > img').attr('src', '/union/newrecord/false.png');
    })
    // 下一步
    $('.nextStep').click(function() {
        if (!RegExpObj.Reg_Name.test(patientName.val())) {
            patientName.addClass('error')
        } else if (!RegExpObj.Reg_IDCardNo.test(patientCard.val()) || !patientCardFlag) {
            patientCard.addClass('error')
        } else if (!RegExpObj.Reg_TelNo.test(patientPhone.val())) {
            patientPhone.addClass('error')
        } else if ($('.detailAddress').val() == '') {
            $('.detailAddress').addClass('error')
        } else {
            $('.tabBox > a').removeClass('active').eq(1).addClass('active');
            $('.illnessinfoContainer').show();
            $('.userinfoContainer').hide();
            $('.stepTwo > img').attr('src', '/union/newrecord/true.png');
            $('.stepTwo').removeClass('active');
        }
    })


    // 第二步


    // 过敏药物
    $('.drugAllergy').on('input', function(e) {
        $.ajax({
            type: 'POST',
            url: IP + '/api-stata/anamnesisAllergyDrug/search',
            dataType: 'json',
            data: {
                "token": $.cookie('token'),
                "spellName": $('.drugAllergy').val(),
            },
            success: function(data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].allergyDrugName + '</li>'
                    }
                    $('.drugAllergyUl').show().html(_html);
                } else {
                    $('.drugAllergyUl').hide();
                }
            },
            error: function(err) {

            },
        });
    })
    // 添加过敏病
    var drugAllergyArr = [];
    $(".drugAllergyUl").delegate("li", "click", function() {
        if (drugAllergyArr.indexOf($(this).attr('name')) == -1) {
            $('.receiveUl').show();
            drugAllergyArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".receiveUl");
            $(".drugAllergyUl").hide();
            $('.drugAllergy').val("");
        }
    });

    // 删除过敏药物

    $('.receiveUl').delegate('li', "click", function() {
        drugAllergyArr.splice(drugAllergyArr.indexOf($(this).attr('name')), 1);
        if (drugAllergyArr.length <= 0) {
            $('.receiveUl').hide();
        }
        $(this).remove();
    })

    // 既往病史
    $('.illnessInput').on('input', function(e) {
        console.log()
        $.ajax({
            type: 'POST',
            url: IP + '/api-stata/anamnesisIllness/search',
            dataType: 'json',
            data: {
                "token": $.cookie('token'),
                "spellName": $('.illnessInput').val(),
            },
            success: function(data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].anamnesisIllnessName + '</li>'
                    }
                    $('.illnessAdd').show().html(_html);
                } else {
                    $('.illnessAdd').hide();
                }
            },
            error: function(err) {

            },
        });
    })
    var illnessAddArr = [];
    $(".illnessAdd").delegate("li", "click", function() {
        if (illnessAddArr.indexOf($(this).attr('name')) == -1) {
            $(".illnessUl").show();
            illnessAddArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".illnessUl");
            $(".illnessAdd").hide();
            $('.illnessInput').val("");
        }
    });
    $('.illnessUl').delegate('li', "click", function() {
        illnessAddArr.splice(illnessAddArr.indexOf($(this).attr('name')), 1);
        if (illnessAddArr.length <= 0) {
            $('.illnessUl').hide();
        }
        $(this).remove();
    })
    // 正在服用的药物
    $('.eatingDrugInput').on('input', function(e) {
        $.ajax({
            type: 'POST',
            url: IP + '/api-stata/anamnesisEatingDrug/search',
            dataType: 'json',
            data: {
                "token": $.cookie('token'),
                "spellName": $('.eatingDrugInput').val(),
            },
            success: function(data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].eatingDrugName + '</li>'
                    }
                    $('.eatingDrugAdd').show().html(_html);
                } else {
                    $('.eatingDrugAdd').hide();
                }
            },
            error: function(err) {

            },
        });
    })
    var eatingDrugAddArr = [];
    $(".eatingDrugAdd").delegate("li", "click", function() {
        if (eatingDrugAddArr.indexOf($(this).attr('name')) == -1) {
            $('.eatingDrugUl').show();
            eatingDrugAddArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".eatingDrugUl");
            $(".eatingDrugAdd").hide();
            $('.eatingDrugInput').val("");
        }
    });
    $('.eatingDrugUl').delegate('li', "click", function() {
        eatingDrugAddArr.splice(eatingDrugAddArr.indexOf($(this).attr('name')), 1);
        if (eatingDrugAddArr.length <= 0) {
            $('.eatingDrugUl').hide();
        }
        $(this).remove();
    })

    // 手术史
    $('.surgicalHistoryInput').on('input', function(e) {
        $.ajax({
            type: 'POST',
            url: IP + '/api-stata/surgicalHistory/search',
            dataType: 'json',
            data: {
                "token": $.cookie('token'),
                "spellName": $('.surgicalHistoryInput').val(),
            },
            success: function(data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].surgicalHistoryName + '</li>'
                    }
                    $('.surgicalHistoryAdd').show().html(_html);
                } else {
                    $('.surgicalHistoryAdd').hide();
                }
            },
            error: function(err) {

            },
        });
    })
    var surgicalHistoryAddArr = [];
    $(".surgicalHistoryAdd").delegate("li", "click", function() {
        if (surgicalHistoryAddArr.indexOf($(this).attr('name')) == -1) {
            $('.surgicalHistoryUl').show();
            surgicalHistoryAddArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".surgicalHistoryUl");
            $(".surgicalHistoryAdd").hide();
            $('.surgicalHistoryInput').val("");
        }
    });
    $('.surgicalHistoryUl').delegate('li', "click", function() {
        surgicalHistoryAddArr.splice(surgicalHistoryAddArr.indexOf($(this).attr('name')), 1);
        if (surgicalHistoryAddArr.length <= 0) {
            $('.surgicalHistoryUl').hide();
        }
        $(this).remove();
    })


    // 单选按钮
    $('.receiveBtn > a').click(function() {
        if ($(this).index() == 0) {
            if ($('.receiveUl > li').length > 0) {
                layer.open({
                    id: 'receiveBtn',
                    title: '',
                    content: '是否清除添加的信息？',
                    btn: ['是', '否'],
                    btn1: function(index, layero) {
                        $('.receiveBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').attr('disabled', 'disabled');
                        $('.receiveBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
                        $('.receiveUl').html('').hide();
                        drugAllergyArr = [];
                        layer.close(index)
                    },
                    btn2: function(index, layero) {
                        // $('.receiveBtn > a').eq(1).addClass('active').siblings('a').removeClass('active');
                    }
                })
            } else {
                $('.receiveBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
                $('.receiveBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').attr('disabled', 'disabled');
            }
        } else {
            $(this).addClass('active').siblings('a').removeClass('active');
            $(this).parent('div').siblings('.searchBox').find('input').removeAttr('disabled')
        }
    });
    $('.illnessBtn > a').click(function() {
        if ($(this).index() == 0) {
            if ($('.illnessUl > li').length > 0) {
                layer.open({
                    id: 'illnessBtn',
                    title: '',
                    content: '是否清除添加的信息？',
                    btn: ['是', '否'],
                    btn1: function(index, layero) {
                        $('.illnessBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').attr('disabled', 'disabled');
                        $('.illnessBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
                        $('.illnessUl').html('').hide();
                        illnessAddArr = [];
                        layer.close(index)
                    },
                    btn2: function(index, layero) {
                        // $('.illnessBtn > a').eq(1).addClass('active').siblings('a').removeClass('active');
                    }
                })
            } else {
                $('.illnessBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').attr('disabled', 'disabled');
                $('.illnessBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
            }
        } else {
            $(this).parent('div').siblings('.searchBox').find('input').removeAttr('disabled')
            $(this).addClass('active').siblings('a').removeClass('active');
        }
    })
    $('.eatingDrugBtn > a').click(function() {
        if ($(this).index() == 0) {
            if ($('.eatingDrugUl > li').length > 0) {
                layer.open({
                    id: 'eatingDrugBtn',
                    title: '',
                    content: '是否清除添加的信息？',
                    btn: ['是', '否'],
                    btn1: function(index, layero) {
                        $('.eatingDrugBtn > a').parent('.radioBox').siblings('.searchBox').find('input').attr('disabled', 'disabled');
                        $('.eatingDrugBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
                        $('.eatingDrugUl').html('').hide();
                        eatingDrugAddArr = [];
                        layer.close(index);
                    },
                    btn2: function(index, layero) {
                        // $('.eatingDrugBtn > a').eq(1).addClass('active').siblings('a').removeClass('active');
                    }
                })
            } else {
                $('.eatingDrugBtn > a').parent('.radioBox').siblings('.searchBox').find('input').attr('disabled', 'disabled');
                $('.eatingDrugBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
            }
        } else {
            $(this).parent('div').siblings('.searchBox').find('input').removeAttr('disabled');
            $(this).addClass('active').siblings('a').removeClass('active');
        }
    })
    $('.surgicalHistoryBtn > a').click(function() {
        if ($(this).index() == 0) {
            if ($('.surgicalHistoryUl > li').length > 0) {
                layer.open({
                    id: 'surgicalHistoryBtn',
                    title: '',
                    content: '是否清除添加的信息？',
                    btn: ['是', '否'],
                    btn1: function(index, layero) {
                        $('.surgicalHistoryBtn > a').parent('.radioBox').siblings('.searchBox').find('input').attr('disabled', 'disabled');
                        $('.surgicalHistoryBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
                        $('.surgicalHistoryUl').html('').hide();
                        surgicalHistoryAddArr = [];
                        layer.close(index);
                    },
                    btn2: function(index, layero) {
                        // $('.eatingDrugBtn > a').eq(1).addClass('active').siblings('a').removeClass('active');
                    }
                })
            } else {
                $('.surgicalHistoryBtn > a').parent('.radioBox').siblings('.searchBox').find('input').attr('disabled', 'disabled');
                $('.surgicalHistoryBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
            }
        } else {
            $(this).parent('div').siblings('.searchBox').find('input').removeAttr('disabled');
            $(this).addClass('active').siblings('a').removeClass('active');
        }
    })

    $('.illnessBoxRight').find('input').focus(function () {
        $('.illnessBoxRight').find('input').val('');
        $('.searchBox > ul').hide();
    })

    // 完成按钮
    $('.submit').click(function() {
        $.ajax({
            type: 'POST',
            url: IP + '/api-record/patientAnamnesis/add',
            dataType: 'json',
            data: {
                "token": $.cookie('token'),
                "patientName": $('.patientName').val(),
                "patientCard": $('.patientCard').val(),
                "patientPhone": $(patientPhone).val(),
                "patientBirthday": patientBirthday,
                "patientSex": patientSex,
                "educationId": $('.educationSel').val(),
                "professionId": $('.occupationSel').val(),
                "bloodGroupId": $('.bloodTypeSel').val(),
                "nationId": $('.nationSel').val(),
                "cityId": $('.countySel').val(),
                "detailAddress": $('.detailAddress').val(),
                "anamnesisAllergyDrugIds": drugAllergyArr.toString(),
                "anamnesisIllnessIds": illnessAddArr.toString(),
                "anamnesisEatingDrugIds": eatingDrugAddArr.toString(),
                "anamnesisSurgicalHistoryIds": surgicalHistoryAddArr.toString(),
                "otherIds": $('.otherInput').val(),
            },
            success: function(data) {
                console.log(data)
                if (data.code == 20000) {
                    $('.promptBox').fadeIn();
                    // $.cookie('patientId', data.result, { path: '/', });
                    myLocal.setItem('patientId', data.result);
                } else {

                }
            },
            error: function(err) {

            },
        });
    })
    // 建档完成 - 是
    $('.closeYes').click(function() {
        // $.cookie('patientInfo', '', {
        //     path: '/',
        // });
        myLocal.setItem('patientInfo','');
        window.location = '/union/patientInfo/patientInfo.html';
    })

});
