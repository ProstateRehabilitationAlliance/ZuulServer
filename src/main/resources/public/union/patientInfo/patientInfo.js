$(function() {
    $.ajax({
        type: 'POST',
        url: IP + '/api-record/patientAnamnesis/getHealthRrecord',
        dataType: 'json',
        data: {
            "token": $.cookie('token'),
            "patientId": myLocal.getItem('patientId'),
        },
        success: function(data) {
            console.log(data)
            if (data.code == '20000') {
                var obj = data.result;
                myLocal.setItem('patientInfo', obj);
                $('.name').html(obj.patientName ? obj.patientName : '');
                $('.patientNumber').html(obj.patientNumber ? obj.patientNumber : '');
                $('.createTime').html(obj.createTime ? obj.createTime : '');
                $('.patientCard').html(obj.patientCard ? obj.patientCard : '');
                $('.patientPhone').html(obj.patientPhone ? obj.patientPhone : '');
                if (obj.cityDetailBean && obj.detailAddress) {
                    var _html = '';
                    obj.cityDetailBean.grandfatherCityName ? _html += obj.cityDetailBean.grandfatherCityName + '-' : '';
                    obj.cityDetailBean.parentCityName ? _html += obj.cityDetailBean.parentCityName + '-' : '';
                    obj.cityDetailBean.cityName ? _html += obj.cityDetailBean.cityName + '-' : '';
                    obj.detailAddress ? _html += obj.detailAddress : '';
                    $('.detailAddress').html(_html);
                } else if (obj.detailAddress) {
                    $('.detailAddress').html(obj.detailAddress);
                }
                var _html = '';
                for (var i = 0; i < obj.anamnesisAllergyDrugList.length; i++) {
                    _html += obj.anamnesisAllergyDrugList[i].anamnesisRemark + '、'
                }
                for (var i = 0; i < obj.anamnesisEatingDrugList.length; i++) {
                    _html += obj.anamnesisEatingDrugList[i].anamnesisRemark + '、'
                }
                for (var i = 0; i < obj.anamnesisIllnessList.length; i++) {
                    _html += obj.anamnesisIllnessList[i].anamnesisRemark + '、'
                }
                for (var i = 0; i < obj.anamnesisSurgicalHistoryList.length; i++) {
                    _html += obj.anamnesisSurgicalHistoryList[i].anamnesisRemark + '、'
                }
                for (var i = 0; i < obj.otherList.length; i++) {
                    _html += obj.otherList[i].anamnesisRemark + '、'
                }
                $('.orderBean').html(_html);
            } else if (data.code == 40001) {
                window.location = '/union/login/login.html';
            }  else {

            }
        },
        error: function(err) {

        },
    });

    // 查询评测结果
    $.ajax({
        type: 'POST',
        url: IP + '/api-assessmen/assessment/findByPatientId',
        dataType: 'json',
        data: {
            "token": $.cookie('token'),
            "patientId": myLocal.getItem('patientId'),
        },
        success: function(data) {
            console.log(data)
            if (data.code == '20000') {
                var obj = data.result;
                if (obj.length > 0) {
                    var _html = '';
                    for (var i = 0; i < obj.length; i++) {
                        _html += '<tr>\
                            <td>' + (i + 1) + '</td>\
                            <td>' + obj[i].createTime + '</td>\
                            <td>' + obj[i].totalScore + '</td>\
                            <td>' + obj[i].caution + '</td>\
                            <td><a class="testBtn" createDate="' + obj[i].createTime + '" type="' + obj[i].scoreType + '" name="' + obj[i].id + '" href="javascript:;">查看</a></td>\
                        </tr>'
                    }
                    $('.appendHtml').html(_html);
                    $('.addTest').hide();
                } else {
                    $('.addTest').show();
                }
            } else {

            }
        },
        error: function(err) {

        },
    });


    $('.testBox').delegate('.testBtn', 'click', function() {
        myLocal.setItem('testId', $(this).attr('name'));
        myLocal.setItem('scoreType', $(this).attr('type'));
        myLocal.setItem('createDate', $(this).attr('createDate'));
        window.location = '/union/test/test.html';
    });
    $('.addTest,.newDossier').click(function() {
        myLocal.setItem('testId', '');
        myLocal.setItem('createDate', '');
        myLocal.setItem('scoreType', '');
        myLocal.setItem('nihResult', '');
        myLocal.setItem('ipssResult', '');
        if (myLocal.getItem('patientInfo').patientAge >= 50) {
            window.location = '/union/ipss/ipss.html';
        } else {
            window.location = '/union/nih/nih.html';
        }


    });
})
