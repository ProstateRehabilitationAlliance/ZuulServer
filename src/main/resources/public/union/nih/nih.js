$(function() {
    // 组装问题html
    function _html(obj, oneArr) {
        // obj 插入的目标对象
        // arr 题目数组
        var _oneHtml = '';
        for (var i = 0; i < oneArr.length; i++) {
            if (oneArr[i].nihCpsiType == '0') {
                _oneHtml += '<ul class="radioBox"><h2>' + oneArr[i].nihCpsiTitle + '</h2>\
                '
                var temp = oneArr[i].childList;
                for (var j = 0; j < temp.length; j++) {
                    _oneHtml += '<li class="radioItem topic" score="0" answercard="0">\
                            <span>' + temp[j].nihCpsiTitle + '</span>\
                            <div class="btnBox">\
                                <a class="active" name="0"\ href="javascript:;">否</a>\
                                <a name="1" href="javascript:;">是</a>\
                            </div>\
                        </li>'
                }
                _oneHtml += '</ul>';
            } else if (oneArr[i].nihCpsiType == '1') {
                _oneHtml += '<ul class="dragBox clearfix topic" score="0" answercard="';
                var temp = oneArr[i].childList;
                var xHtml = '';
                for (var x = 0; x < temp.length; x++) {
                    if (x == 0) {
                        xHtml += '1'
                    } else {
                        xHtml += '0'
                    }
                }
                _oneHtml += xHtml + '"><h2>' + oneArr[i].nihCpsiTitle + '</h2>';
                for (var j = 0; j < temp.length; j++) {
                    if (j == 0) {
                        _oneHtml += '<li class="active" name=' + temp[j].nihCpsiScore + '>\
                                <span>' + temp[j].nihCpsiTitle + '</span>\
                                <p>' + temp[j].nihCpsiScore + '分</p>\
                            </li>'
                    } else {
                        _oneHtml += '<li name=' + temp[j].nihCpsiScore + '>\
                                <span>' + temp[j].nihCpsiTitle + '</span>\
                                <p>' + temp[j].nihCpsiScore + '分</p>\
                            </li>'
                    }
                }
                _oneHtml += '</ul>';
            }
        }
        obj.html(_oneHtml);
        _oneHtml = '';
    }
    $.ajax({
        type: 'POST',
        url: IP + '/api-stata/nihCpsi/getAll',
        dataType: 'json',
        data: {
            "token": $.cookie('token'),
        },
        success: function(data) {
            console.log(data)
            if (data.code == 20000) {
                var dataArr = data.result;
                for (var i = 0; i < dataArr.length; i++) {
                    if (dataArr[i].nihCpsiType == 'a') {
                        _html($('.oneContent'), dataArr[i].childList);
                        $('.titleA').show().find('span').html(dataArr[i].nihCpsiTitle);
                    } else if (dataArr[i].nihCpsiType == 'b') {
                        _html($('.twoContent'), dataArr[i].childList);
                        $('.titleB').show().find('span').html(dataArr[i].nihCpsiTitle);
                    } else if (dataArr[i].nihCpsiType == 'c') {
                        _html($('.threeContent'), dataArr[i].childList);
                        $('.titleC').show().find('span').html(dataArr[i].nihCpsiTitle);
                    }
                }
                if (myLocal.getItem('nihResult')) {
                    var resultArr = myLocal.getItem('nihResult').split("-");
                    for (var i = 0; i < resultArr.length; i++) {
                        $('.topic').eq(i).attr({
                            "score": resultArr[i]
                        });
                    }
                    // 单选答案遍历
                    for (var i = 0; i < $('.radioItem.topic').length; i++) {
                        $('.radioItem.topic').eq(i).find('.btnBox > a').removeClass('active').eq($('.radioItem.topic').eq(i).attr('score')).addClass('active');
                        $('.radioItem.topic').eq(i).attr({
                            "answercard": $('.radioItem.topic').eq(i).attr('score')
                        })
                    }
                    // 拖拽题答案遍历
                    for (var i = 0; i < $('.dragBox.topic').length; i++) {
                        $('.dragBox.topic').eq(i).find('li').removeClass('active').eq($('.dragBox.topic').eq(i).attr('score')).addClass('active');
                        var _str = '';
                        for (var j = 0; j < $('.dragBox.topic').eq(i).attr('answercard').length; j++) {
                            if (j == $('.dragBox.topic').eq(i).attr('score')) {
                                _str += '1';
                            } else {
                                _str += '0';
                            }
                        }
                        $('.dragBox.topic').eq(i).attr({
                            "answercard": _str
                        });
                    }
                    reckon($('.oneContent'), $('.oneCount'));
                    reckon($('.twoContent'), $('.twoCount'));
                    reckon($('.threeContent'), $('.threeCount'));
                } else {
                    reckon($('.oneContent'), $('.oneCount'));
                    reckon($('.twoContent'), $('.twoCount'));
                    reckon($('.threeContent'), $('.threeCount'));
                }
            } else {
                // 获取数据失败

            }
        },
        error: function(err) {

        },
    });

    // 单选
    $('.answerContent').delegate('.btnBox > a', 'click', function() {
        $(this).addClass('active').siblings('a').removeClass('active');
        $(this).parents('.topic').attr({
            "score": $(this).attr('name'),
            "answerCard": $(this).attr('name')
        });
        reckon($('.oneContent'), $('.oneCount'));
        reckon($('.twoContent'), $('.twoCount'));
        reckon($('.threeContent'), $('.threeCount'));
    })



    // 托选题
    $('.answerContent').delegate('.dragBox > li', 'click', function() {
        $(this).addClass('active').siblings('li').removeClass('active');
        var oneCounts = $(this).index() - 1;
        var oneScantrons = '';
        for (var j = 0; j <= $(this).siblings('li').length; j++) {
            if ($(this).index() - 1 == j) {
                oneScantrons += '1';
            } else {
                oneScantrons += '0';
            }
        }
        $(this).parents('.topic').attr({
            "score": oneCounts,
            "answercard": oneScantrons
        })
        oneScantrons = '';
        reckon($('.oneContent'), $('.oneCount'));
        reckon($('.twoContent'), $('.twoCount'));
        reckon($('.threeContent'), $('.threeCount'));
    })

    // 上侧导航
    $('.scoringBox > li').click(function() {
        $(this).addClass('active').siblings('li').removeClass('active');
        var index = $(this).index();
        $('.answerContainer > li').hide().eq(index).show();
    })

    // 统计答题结果
    function reckon(obj, valObj) {
        // obj 统计的范围
        // valObj 统计分值放入的位置
        var temp = obj.find('.topic');
        var count = 0;
        var card = '';
        for (var i = 0; i < temp.length; i++) {
            count += Number(temp.eq(i).attr('score'))
            card += temp.eq(i).attr('answercard');
        }
        valObj.html(count);
        valObj.attr({
            "card": card
        });
        var countNum = 0;
        countNum = Number($('.oneCount').html()) + Number($('.twoCount').html()) + Number($('.threeCount').html())
        $('.count').html(countNum);
    }

    $('.submit').click(function() {

        if (myLocal.getItem('createDate')) {
            var myDate = new Date();
            var _year = myLocal.getItem('createDate').split('-')[0];
            var _month = myLocal.getItem('createDate').split('-')[1];
            var _day = myLocal.getItem('createDate').split('-')[2];
            if (_year == myDate.getFullYear() && _month == myDate.getMonth() + 1 && _day == myDate.getDate()) {
                // 修改nih结果
                $.ajax({
                    type: 'POST',
                    url: IP + '/api-assessmen/patientNihCpsiScore/update',
                    dataType: 'json',
                    data: {
                        "token": $.cookie('token'),
                        "id": myLocal.getItem('testId'),
                        "inflammationScore": $('.inflammationScore').html(),
                        "symptomScore": $('.symptomScore').html(),
                        "lifeScore": $('.lifeScore').html(),
                        "nihCpsiScore": Number($('.inflammationScore').html()) + Number($('.symptomScore').html()) + Number($('.lifeScore').html()),
                        "answer": $('.inflammationScore').attr('card') + $('.symptomScore').attr('card') + $('.lifeScore').attr('card'),
                        "patientAge": myLocal.getItem('patientInfo').patientAge,
                    },
                    success: function(data) {
                        console.log(data)
                        if (data.code == 20000) {
                            myLocal.setItem('testId', data.result.id);
                            myLocal.setItem('scoreType', "A");
                            history.go(-1);
                        } else if (data.code == 50005) {
                            layer.msg('今天已添加过，每天仅限添加一条');
                        } else {
                            // 获取数据失败
                        }
                    },
                    error: function(err) {

                    },
                });
            } else {
                layer.msg('只能修改当天的评测记录')
            }
        } else {
            $.ajax({
                type: 'POST',
                url: IP + '/api-assessmen/patientNihCpsiScore/add',
                dataType: 'json',
                data: {
                    "token": $.cookie('token'),
                    // "id": myLocal.getItem('testId') != 'null' ? myLocal.getItem('testId') : null,
                    "patientId": myLocal.getItem('patientId'),
                    "inflammationScore": $('.inflammationScore').html(),
                    "symptomScore": $('.symptomScore').html(),
                    "lifeScore": $('.lifeScore').html(),
                    "nihCpsiScore": Number($('.inflammationScore').html()) + Number($('.symptomScore').html()) + Number($('.lifeScore').html()),
                    "answer": $('.inflammationScore').attr('card') + $('.symptomScore').attr('card') + $('.lifeScore').attr('card'),
                    "patientAge": myLocal.getItem('patientInfo').patientAge,
                },
                success: function(data) {
                    console.log(data)
                    if (data.code == 20000) {
                        myLocal.setItem('testId', data.result.id);
                        myLocal.setItem('scoreType', "A");
                        history.go(-1);
                    } else if (data.code == 50005) {
                        layer.msg('今天已添加过，每天仅限添加一条');
                    } else {
                        // 获取数据失败

                    }
                },
                error: function(err) {

                },
            });
        }

    })
})
