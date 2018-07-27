$(function() {
    layui.use(['form'], function() {

    });
    var drugAllergyArr = [];
    var illnessAddArr = []; // 既往病史
    var eatingDrugAddArr = []; // 正在服用的药物
    var surgicalHistoryAddArr = [];

    // 删除 既往病史 标签
    function deleteTally(obj, id) {
        // 删除疾病标签
        $.ajax({
            type: 'POST',
            url: IP + '/api-record/anamnesis/delete',
            dataType: 'json',
            data: {
                "token": $.cookie('token'),
                "id": id,
                "patientId": myLocal.getItem('patientId'),
            },
            success: function(data) {
                console.log(data)
                if (data.code == 20000) {
                    obj.remove();
                } else {

                }
            },
            error: function(err) {

            },
        });
    }

    // 查询学历列表
    $.ajax({
        type: 'POST',
        url: IP + '/api-stata/education/getAll',
        dataType: 'json',
        data: {
            "token": $.cookie('token'),
        },
        async: false,
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                var education = data.result;
                var _html = '<option value="">请选择</option>';
                for (var i = 0; i < education.length; i++) {
                    _html += '<option value="' + education[i].id + '">' + education[i].educationName + '</option>'
                }
                $('.educationSel').html(_html);
            } else if (data.code == 40001) {
                window.location = '/union/login/login.html';
            } else {
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
        async: false,
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                var occupation = data.result;
                var _html = '<option value="">请选择</option>';
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
        async: false,
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                var nation = data.result;
                var _html = '<option value="">请选择</option>';
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
        async: false,
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                var bloodType = data.result;
                var _html = '<option value="">请选择</option>';
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

    var grandfatherCityId = '';
    var parentCityId = '';
    var cityId = '';
    if (myLocal.getItem('patientId')) {
        //根据ID查询患者病历信息
        $.ajax({
            type: 'POST',
            url: IP + '/api-record/patientAnamnesis/getHealthRrecord',
            dataType: 'json',
            data: {
                "token": $.cookie('token'),
                "patientId": myLocal.getItem('patientId'),
            },
            // async: false,
            success: function(data) {
                console.log(data)
                $('.surgicalHistoryUl').show();
                if (data.code == '20000') {
                    var obj = data.result;
                    myLocal.setItem('patientInfo', obj);
                    $('.patientName').val(data.result.patientName);
                    $('.age').html(data.result.patientAge);
                    $('.patientCard').val(data.result.patientCard);
                    $('.patientPhone').val(data.result.patientPhone);
                    $('.patientBirthday').html(data.result.patientBirthday);
                    $('.patientSex').html(data.result.patientSex);
                    $('.educationSel').val(data.result.educationId ? data.result.educationId : ''); // 学历id
                    $('.occupationSel').val(data.result.professionId ? data.result.professionId : ''); // 职业id
                    $('.bloodTypeSel').val(data.result.bloodGroupId ? data.result.bloodGroupId : ''); // 血型 id
                    $('.nationSel').val(data.result.nationId); // 民族id
                    if (data.result.cityDetailBean) {
                        grandfatherCityId = data.result.cityDetailBean.grandfatherCityId ? data.result.cityDetailBean.grandfatherCityId : ''; //省id
                        parentCityId = data.result.cityDetailBean.parentCityId ? data.result.cityDetailBean.parentCityId : ''; // 市id
                        cityId = data.result.cityDetailBean.cityId ? data.result.cityDetailBean.cityId : ''; // 区县id
                    }
                    $('.detailAddress').val(data.result.detailAddress ? data.result.detailAddress : '');

                    var obj = myLocal.getItem('patientInfo')
                    var drugAllergyHtml = '';
                    if (obj.anamnesisAllergyDrugList.length > 0) {
                        $('.receiveBtn > a').removeClass('active').eq(1).addClass('active');
                        $('.receiveBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').removeAttr('disabled');
                        for (var i = 0; i < obj.anamnesisAllergyDrugList.length; i++) {
                            drugAllergyArr.push(obj.anamnesisAllergyDrugList[i].orderId);
                            drugAllergyHtml += '<li type="old" name="' + obj.anamnesisAllergyDrugList[i].id + '">' + obj.anamnesisAllergyDrugList[i].anamnesisRemark + '</li>';
                        }
                        $('.receiveUl').show().html(drugAllergyHtml);
                    } else {
                        $('.receiveUl').hide();
                    }

                    var eatingDrugHtml = '';
                    if (obj.anamnesisEatingDrugList.length > 0) {
                        $('.eatingDrugBtn > a').removeClass('active').eq(1).addClass('active');
                        $('.eatingDrugBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').removeAttr('disabled');
                        for (var i = 0; i < obj.anamnesisEatingDrugList.length; i++) {
                            eatingDrugAddArr.push(obj.anamnesisEatingDrugList[i].orderId);
                            eatingDrugHtml += '<li type="old" name="' + obj.anamnesisEatingDrugList[i].id + '">' + obj.anamnesisEatingDrugList[i].anamnesisRemark + '</li>';
                        }
                        $('.eatingDrugUl').show().html(eatingDrugHtml);
                    } else {
                        $('.eatingDrugUl').hide();
                    }

                    var illnessHtml = '';
                    if (obj.anamnesisIllnessList.length > 0) {
                        $('.illnessBtn > a').removeClass('active').eq(1).addClass('active');
                        $('.illnessBtn > a').parent('.radioBox').siblings('.searchBox').find('input').removeAttr('disabled');
                        for (var i = 0; i < obj.anamnesisIllnessList.length; i++) {
                            illnessAddArr.push(obj.anamnesisIllnessList[i].orderId);
                            illnessHtml += '<li type="old" name="' + obj.anamnesisIllnessList[i].id + '">' + obj.anamnesisIllnessList[i].anamnesisRemark + '</li>';
                        }
                        $('.illnessUl').show().html(illnessHtml);
                    } else {
                        $('.illnessUl').hide();
                    }

                    var surgicalHistoryHtml = '';
                    if (obj.anamnesisSurgicalHistoryList.length > 0) {
                        $('.surgicalHistoryBtn > a').removeClass('active').eq(1).addClass('active');
                        $('.surgicalHistoryBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').removeAttr('disabled');
                        for (var i = 0; i < obj.anamnesisSurgicalHistoryList.length; i++) {
                            surgicalHistoryAddArr.push(obj.anamnesisSurgicalHistoryList[i].orderId);
                            surgicalHistoryHtml += '<li type="old" name="' + obj.anamnesisSurgicalHistoryList[i].id + '">' + obj.anamnesisSurgicalHistoryList[i].anamnesisRemark + '</li>';
                        }
                        $('.surgicalHistoryUl').html(surgicalHistoryHtml).show();
                    } else {
                        $('.surgicalHistoryUl').hide();
                    }
                    if (obj.otherList[0]) {
                        $('.otherInput').val(obj.otherList[0].anamnesisRemark).attr('name', obj.otherList[0].id)
                    } else {
                        $('.otherInput').attr('name', '');
                    }
                } else {

                }
            },
            error: function(err) {

            },
        });
    }
    // 查询城市
    var region = [];
    var province = []; // 省
    var city = []; // 市
    var county = []; // 县
    var _province = '<option value="">请选择</option>';
    var _city = '<option value="">请选择</option>';
    var _county = '<option value="">请选择</option>';
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
                    if (grandfatherCityId == region[i].id) {
                        city = region[i].cityList;
                        _province += '<option selected = "selected" value="' + region[i].id + '">' + region[i].cityName + '</option>';
                    } else {
                        city = region[0].cityList;
                        _province += '<option value="' + region[i].id + '">' + region[i].cityName + '</option>';
                    }
                }
                $('.provinceSel').html(_province);
                for (var i = 0; i < city.length; i++) {

                    if (city[i].id == parentCityId) {
                        county = city[i].cityList;
                        _city += '<option selected = "selected" value="' + city[i].id + '">' + city[i].cityName + '</option>';
                    } else {
                        county = city[0].cityList;
                        _city += '<option value="' + city[i].id + '">' + city[i].cityName + '</option>';
                    }
                }
                $('.citySel').html(_city);
                for (var i = 0; i < county.length; i++) {
                    if (county[i].id == cityId) {
                        _county += '<option selected = "selected" value="' + county[i].id + '">' + county[i].cityName + '</option>';
                    } else {
                        _county += '<option value="' + county[i].id + '">' + county[i].cityName + '</option>';
                    }

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
    var patientCardFlag = true;
    patientCard.blur(function() {
        if (!RegExpObj.Reg_IDCardNo.test(patientCard.val())) {
            $(this).addClass('error')
        } else {
            // 身份证校验
            if ($(this).val() != myLocal.getItem('patientInfo').patientCard) {
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
                            patientCardFlag = false;
                        }
                    },
                    error: function(err) {

                    },
                });
            }
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
        } else if (!$('.nationSel').val()) {
            layer.msg('请选择民族')
        } else if (!$('.occupationSel').val()) {
            layer.msg('请选择职业')
        } else if (!$('.educationSel').val()) {
            layer.msg('请选择文化程度')
        } else if (!$('.bloodTypeSel').val()) {
            layer.msg('请选择血型')
        } else if (!$('.provinceSel').val()) {
            layer.msg('请选择省份')
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
        if ($(this).attr('type') == 'old') {
            deleteTally($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        drugAllergyArr.splice(drugAllergyArr.indexOf($(this).attr('name')), 1);
        if (drugAllergyArr.length <= 0) {
            $('.receiveUl').hide();
        }
    })
    // 既往病史
    $('.illnessInput').on('input', function(e) {
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
        if ($(this).attr('type') == 'old') {
            deleteTally($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        illnessAddArr.splice(illnessAddArr.indexOf($(this).attr('name')), 1);
        if (illnessAddArr.length <= 0) {
            $('.illnessUl').hide();
        }
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
        if ($(this).attr('type') == 'old') {
            deleteTally($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        eatingDrugAddArr.splice(eatingDrugAddArr.indexOf($(this).attr('name')), 1);
        if (eatingDrugAddArr.length <= 0) {
            $('.eatingDrugUl').hide();
        }
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
        if ($(this).attr('type') == 'old') {
            deleteTally($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        surgicalHistoryAddArr.splice(surgicalHistoryAddArr.indexOf($(this).attr('name')), 1);
        if (surgicalHistoryAddArr.length <= 0) {
            $('.surgicalHistoryUl').hide();
        }
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
                        var tempObj = $('.receiveUl > li');
                        for (var i = 0; i < tempObj.length; i++) {
                            if (tempObj.eq(i).attr('type') == 'old') {
                                $.ajax({
                                    type: 'POST',
                                    url: IP + '/api-record/anamnesis/delete',
                                    dataType: 'json',
                                    data: {
                                        "token": $.cookie('token'),
                                        "id": tempObj.eq(i).attr('name'),
                                        "patientId": myLocal.getItem('patientId'),
                                    },
                                    success: function(data) {
                                        console.log(data)
                                        if (data.code == 20000) {

                                        } else {

                                        }
                                    },
                                    error: function(err) {

                                    },
                                });
                            }
                        }
                        $('.receiveUl').html('').hide();
                        drugAllergyArr = [];
                        layer.close(index)
                    },
                    btn2: function(index, layero) {
                        // $('.receiveBtn > a').eq(1).addClass('active').siblings('a').removeClass('active');
                    }
                })
            }
            $('.receiveBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
            $('.receiveBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').val('').attr('disabled', 'disabled');
            $('.receiveBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('.drugAllergyUl').hide();
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
                        var tempObj = $('.illnessUl > li');
                        for (var i = 0; i < tempObj.length; i++) {
                            if (tempObj.eq(i).attr('type') == 'old') {
                                $.ajax({
                                    type: 'POST',
                                    url: IP + '/api-record/anamnesis/delete',
                                    dataType: 'json',
                                    data: {
                                        "token": $.cookie('token'),
                                        "id": tempObj.eq(i).attr('name'),
                                        "patientId": myLocal.getItem('patientId'),
                                    },
                                    success: function(data) {
                                        console.log(data)
                                        if (data.code == 20000) {

                                        } else {

                                        }
                                    },
                                    error: function(err) {

                                    },
                                });
                            }
                        }
                        $('.illnessUl').html('').hide();
                        illnessAddArr = [];
                        layer.close(index)
                    },
                    btn2: function(index, layero) {
                        // $('.illnessBtn > a').eq(1).addClass('active').siblings('a').removeClass('active');
                    }
                })
            }
            $('.illnessBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').val('').attr('disabled', 'disabled');
            $('.illnessBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('.illnessAdd').hide();
            $('.illnessBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
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
                        var tempObj = $('.eatingDrugUl > li');
                        for (var i = 0; i < tempObj.length; i++) {
                            if (tempObj.eq(i).attr('type') == 'old') {
                                $.ajax({
                                    type: 'POST',
                                    url: IP + '/api-record/anamnesis/delete',
                                    dataType: 'json',
                                    data: {
                                        "token": $.cookie('token'),
                                        "id": tempObj.eq(i).attr('name'),
                                        "patientId": myLocal.getItem('patientId'),
                                    },
                                    success: function(data) {
                                        console.log(data)
                                        if (data.code == 20000) {

                                        } else {

                                        }
                                    },
                                    error: function(err) {

                                    },
                                });
                            }
                        }
                        $('.eatingDrugUl').html('').hide();
                        eatingDrugAddArr = [];
                        layer.close(index);
                    },
                    btn2: function(index, layero) {
                        // $('.eatingDrugBtn > a').eq(1).addClass('active').siblings('a').removeClass('active');
                    }
                })
            }
            $('.eatingDrugBtn > a').parent('.radioBox').siblings('.searchBox').find('input').val('').attr('disabled', 'disabled');
            $('.eatingDrugBtn > a').parent('.radioBox').siblings('.searchBox').find('.eatingDrugAdd').hide();
            $('.eatingDrugBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
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
                        $('.surgicalHistoryBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').attr('disabled', 'disabled');
                        $('.surgicalHistoryBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
                        var tempObj = $('.surgicalHistoryUl > li');
                        for (var i = 0; i < tempObj.length; i++) {
                            if (tempObj.eq(i).attr('type') == 'old') {
                                $.ajax({
                                    type: 'POST',
                                    url: IP + '/api-record/anamnesis/delete',
                                    dataType: 'json',
                                    data: {
                                        "token": $.cookie('token'),
                                        "id": tempObj.eq(i).attr('name'),
                                        "patientId": myLocal.getItem('patientId'),
                                    },
                                    success: function(data) {
                                        console.log(data)
                                        if (data.code == 20000) {

                                        } else {

                                        }
                                    },
                                    error: function(err) {

                                    },
                                });
                            }
                        }
                        $('.surgicalHistoryUl').html('').hide();
                        illnessAddArr = [];
                        layer.close(index)
                    },
                    btn2: function(index, layero) {

                    }
                })
            }
            $('.surgicalHistoryBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('input').val('').attr('disabled', 'disabled');
            $('.surgicalHistoryBtn > a').eq(0).parent('.radioBox').siblings('.searchBox').find('.surgicalHistoryAdd').hide();
            $('.surgicalHistoryBtn > a').eq(0).addClass('active').siblings('a').removeClass('active');
        } else {
            $(this).parent('div').siblings('.searchBox').find('input').removeAttr('disabled')
            $(this).addClass('active').siblings('a').removeClass('active');
        }
    })



    // 完成按钮
    $('.submit').click(function() {
        $.ajax({
            type: 'POST',
            url: IP + '/api-record/patientAnamnesis/update',
            dataType: 'json',
            data: {
                "token": $.cookie('token'),
                "patientId": myLocal.getItem('patientId'),
                "patientName": $('.patientName').val(),
                "patientCard": $('.patientCard').val(),
                "patientPhone": $('.patientPhone').val(),
                "patientBirthday": $('.patientBirthday').html(),
                "patientSex": $('.patientSex').html(),
                "patientAge": $('.age').html(),
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
                "orderAnamnesisRemark": $('.otherInput').val(),
                "orderAnamnesisId": $('.otherInput').attr('name'),
            },
            success: function(data) {
                console.log(data)
                if (data.code == 20000) {
                    window.history.go(-1);
                } else {

                }
            },
            error: function(err) {

            },
        });
    })
    // 建档完成 - 是
    $('.closeYes').click(function() {
        myLocal.setItem('patientInfo', '');
        window.location = '/union/patientInfo/patientInfo.html';
    })

});
