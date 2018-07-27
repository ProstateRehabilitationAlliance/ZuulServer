$(function() {
    var dataPageNo = 0; // 后台页码
    var dataPageSize = 100; // 后台一页多少条
    var pageNo = 1;
    var pageSize = 10;
    var count = 0;
    var archivesArr = [];
    // 获取患者列表
    // 1、后台一页100条
    // 2、获取数据使用完，再次获取
    function getPatientList(dataPageNo, patientName, number) {
        // dataPageNo 后台页码
        // patientName 用户名
        // number 用户手机号
        $.ajax({
            type: 'POST',
            url: IP + '/api-record/patient/getPatientList',
            dataType: 'json',
            data: {
                "token": $.cookie('token'),
                "pageNo": dataPageNo,
                "patientName": patientName,
                "number": number,
            },
            async: false,
            success: function(data) {
                console.log(data)
                if (data.code == 20000) {
                    // 获取成功
                    dataPageNo++; // 后台页码加1
                    archivesArr = archivesArr.concat(data.result); // 每次获取到时数据给装数据的数组后面添加新的数据
                    count = data.count; // 后台数据总条数
                } else if (data.code == 40004) {
                    $('.tbodyContent').html('暂无数据');
                    count = 0;
                    archivesArr = [];
                } else if (data.code == 40001) {
                    window.location = '/union/login/login.html'
                }
            },
            error: function(err) {
                console.log(err)
            },
        });
    }

    // 搜索按钮
    $('.searchBtn').click(function() {
        archivesArr = [];
        getPatientList(dataPageNo, $('.patientName').val(), $('.number').val());
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox',
                count: count, // 总条数
                limit: pageSize, // 每页的条数
                theme: '#f6c567', // 焦点页颜色
                jump: function(obj, first) {
                    if (first) {
                        // 第一次渲染
                        var _html = '';
                        var tempArr = archivesArr.slice((pageNo - 1), pageSize);
                        for (var i = 0; i < tempArr.length; i++) {
                            _html += '<tr>\
                                <td>' + (i + 1 + pageSize * (pageNo - 1)) + '</td>\
                                <td>' + tempArr[i].createTime + '</td>\
                                <td>' + tempArr[i].patientName + '</td>\
                                <td>' + tempArr[i].patientSex + '</td>\
                                <td>' + tempArr[i].patientCard + '</td>\
                                <td>' + tempArr[i].patientAge + '</td>\
                                <td>--</td>';
                            _html += '<td><a class="seeBtn" name="' + tempArr[i].id + '" href="javascript:;">查看</a><a class="amendBtn" name="' + tempArr[i].id + '" href="javascript:;">修改</a></td>\
                            </tr>';
                        }
                        $('.tbodyContent').html(_html);
                    } else {
                        // 判断第一次获取的数据是否使用完
                        if (obj.curr == Math.ceil(dataPageSize / pageSize)) {
                            // 数据用完再次获取
                            getPatientList(dataPageNo, $('.patientName').val(), $('.number').val());
                            // 前台分割每页的数据 并 渲染
                            var tempArr = archivesArr.slice((obj.curr - 1) * pageSize, (obj.curr - 1) * pageSize + pageSize);
                            var _html = '';
                            for (var i = 0; i < tempArr.length; i++) {
                                _html += '<tr>\
                                    <td>' + (i + 1 + pageSize * (obj.curr - 1)) + '</td>\
                                    <td>' + tempArr[i].createTime + '</td>\
                                    <td>' + tempArr[i].patientName + '</td>\
                                    <td>' + tempArr[i].patientSex + '</td>\
                                    <td>' + tempArr[i].patientCard + '</td>\
                                    <td>' + tempArr[i].patientAge + '</td>\
                                    <td>--</td>';
                                _html += '<a class="seeBtn" name="' + tempArr[i].id + '" href="javascript:;">查看</a><a class="amendBtn" name="' + tempArr[i].id + '" href="javascript:;">修改</a></td>\
                                </tr>';
                            }
                            $('.tbodyContent').html(_html);
                        } else {
                            var tempArr = archivesArr.slice((obj.curr - 1) * pageSize, (obj.curr - 1) * pageSize + pageSize);
                            var _html = '';
                            for (var i = 0; i < tempArr.length; i++) {
                                _html += '<tr>\
                                    <td>' + (i + 1 + pageSize * (obj.curr - 1)) + '</td>\
                                    <td>' + tempArr[i].createTime + '</td>\
                                    <td>' + tempArr[i].patientName + '</td>\
                                    <td>' + tempArr[i].patientSex + '</td>\
                                    <td>' + tempArr[i].patientCard + '</td>\
                                    <td>' + tempArr[i].patientAge + '</td>\
                                    <td>--</td>';
                                _html += '<td><a class="seeBtn" name="' + tempArr[i].id + '" href="javascript:;">查看</a><a class="amendBtn" name="' + tempArr[i].id + '" href="javascript:;">修改</a></td>\
                                </tr>';
                            }
                            $('.tbodyContent').html(_html);
                        }
                    }


                }
            });
        });
    })

    // 查看按钮
    $('.tbodyContent').delegate('.seeBtn', 'click', function() {
        myLocal.setItem('patientId', $(this).attr('name'));
        window.location = '/union/patientInfo/patientInfo.html'
    });
    // 修改按钮
    $('.tbodyContent').delegate('.amendBtn', 'click', function() {
        for (var i = 0; i < archivesArr.length; i++) {
            if (archivesArr[i].id == $(this).attr('name')) {
                // 保存当前这条数据的 用户id 和 用户信息
                myLocal.setItem('patientId', $(this).attr('name'));
                myLocal.setItem('patientInfo', archivesArr[i]);
            }
        }
        window.location = '/union/amend/amend.html';
    });


    // 首次获取 主要获取数据总条数 渲染分页器
    getPatientList(dataPageNo, $('.patientName').val(), $('.number').val());
    // 分液器渲染
    layui.use('laypage', function() {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',
            count: count, // 总条数
            limit: pageSize, // 每页的条数
            theme: '#f6c567', // 焦点页颜色
            jump: function(obj, first) {
                if (first) {
                    // 第一次渲染
                    var _html = '';
                    var tempArr = archivesArr.slice((pageNo - 1), pageSize);
                    for (var i = 0; i < tempArr.length; i++) {
                        _html += '<tr>\
                            <td>' + (i + 1 + pageSize * (pageNo - 1)) + '</td>\
                            <td>' + tempArr[i].createTime + '</td>\
                            <td>' + tempArr[i].patientName + '</td>\
                            <td>' + tempArr[i].patientSex + '</td>\
                            <td>' + tempArr[i].patientCard + '</td>\
                            <td>' + tempArr[i].patientAge + '</td>\
                            <td>--</td>';
                        _html += '<td><a class="seeBtn" name="' + tempArr[i].id + '" href="javascript:;">查看</a><a class="amendBtn" name="' + tempArr[i].id + '" href="javascript:;">修改</a></td>\
                        </tr>';
                    }
                    $('.tbodyContent').html(_html);
                } else {
                    // 判断第一次获取的数据是否使用完
                    if (obj.curr == Math.ceil(dataPageSize / pageSize)) {
                        // 数据用完再次获取
                        getPatientList(dataPageNo, $('.patientName').val(), $('.number').val());
                        // 前台分割每页的数据 并 渲染
                        var tempArr = archivesArr.slice((obj.curr - 1) * pageSize, (obj.curr - 1) * pageSize + pageSize);
                        var _html = '';
                        for (var i = 0; i < tempArr.length; i++) {
                            _html += '<tr>\
                                <td>' + (i + 1 + pageSize * (obj.curr - 1)) + '</td>\
                                <td>' + tempArr[i].createTime + '</td>\
                                <td>' + tempArr[i].patientName + '</td>\
                                <td>' + tempArr[i].patientSex + '</td>\
                                <td>' + tempArr[i].patientCard + '</td>\
                                <td>' + tempArr[i].patientAge + '</td>\
                                <td>--</td>';
                            _html += '<td><a class="seeBtn" name="' + tempArr[i].id + '" href="javascript:;">查看</a><a class="amendBtn" name="' + tempArr[i].id + '" href="javascript:;">修改</a></td>\
                            </tr>';
                        }
                        $('.tbodyContent').html(_html);
                    } else {
                        var tempArr = archivesArr.slice((obj.curr - 1) * pageSize, (obj.curr - 1) * pageSize + pageSize);
                        var _html = '';
                        for (var i = 0; i < tempArr.length; i++) {
                            _html += '<tr>\
                                <td>' + (i + 1 + pageSize * (obj.curr - 1)) + '</td>\
                                <td>' + tempArr[i].createTime + '</td>\
                                <td>' + tempArr[i].patientName + '</td>\
                                <td>' + tempArr[i].patientSex + '</td>\
                                <td>' + tempArr[i].patientCard + '</td>\
                                <td>' + tempArr[i].patientAge + '</td>\
                                <td>--</td>';
                            _html += '<td><a class="seeBtn" name="' + tempArr[i].id + '" href="javascript:;">查看</a><a class="amendBtn" name="' + tempArr[i].id + '" href="javascript:;">修改</a></td>\
                            </tr>';
                        }
                        $('.tbodyContent').html(_html);
                    }
                }


            }
        });
    });
    $('.scan').click(function() {
        var _$ = layui.jquery;
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['336px', '210px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('.associatedContent'),
        });
    })
    $('.associatedContent').find('.noBtn').click(function() {
        layer.closeAll();
        $('.associatedContent').hide();
    })
    $('.associatedContent').find('.yesBtn').click(function() {
        if ($('.cacheInput').val()) {
            $.ajax({
                type: 'POST',
                url: IP + '/api-record/doctorPatient/add',
                dataType: 'json',
                data: {
                    "token": $.cookie('token'),
                    "cacheId": $('.cacheInput').val(),
                },
                async: false,
                success: function(data) {
                    console.log(data)
                    if (data.code == 20000) {
                        layer.closeAll();
                        layer.msg('绑定成功');
                        // getPatientList(0, '', '');
                        setTimeout(function () {
                            window.location.reload();
                        },2000)
                        $('.associatedContent').hide();
                    } else if (data.code == 60001) {
                        layer.msg('二维码已过期!');
                    } else if (data.code == 40001) {
                        window.location = '/union/login/login.html';
                    }  else {
                        layer.msg('绑定失败');
                        layer.closeAll();
                        $('.associatedContent').hide();
                    }
                },
                error: function(err) {
                    console.log(err)
                },
            });
        } else {
            layer.msg('请输入')
        }
    })

    // 新建患者档案
    $('.newDossier').click(function() {
        // 新建患者档案时，清空缓存的患者id
        myLocal.setItem('patientId', '');
        window.location = '/union/newrecord/newrecord.html';
    })
})
