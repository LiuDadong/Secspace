/*
 * ==================================================================
 *                          设备管理 device
 * ==================================================================
 */
(function () {
    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限

    $('input[name=searchval]').on('input change propertychange', function () {
        var searchvalTimer;
        clearTimeout(searchvalTimer);
        searchvalTimer = setTimeout(function () {
            getDeviceList(1, 10);
        }, 500)

    })

    // 设备管理列表
    getDeviceList(1, 10);

})();
var mapObj = (function () {
    var map;
    function getInstance() {
        if (map === undefined) {
            map = new Construct();
        }
        map.clearMap();
        return map;
    }
    function Construct() {
        var map = new AMap.Map("address", {
            resizeEnable: true,
            center: [116.40, 39.90], //地图中心点
            zoom: 15 //地图显示的缩放级别
        });
        AMap.plugin(['AMap.ToolBar', 'AMap.AdvancedInfoWindow'], function () {
            //创建并添加工具条控件
            var toolBar = new AMap.ToolBar();
            map.addControl(toolBar);
        })
        return map;
    }
    return {
        getInstance: getInstance
    }
})();
// 获取设备列表
function getDeviceList(start_page, page_length) {
    var table = $('.devicetable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>' +
            '<th class="sel" style="line-height:20px;"><div class="checkbox">' +
            '<label><input type="checkbox" onclick="selectedAll(this)" />' +
            '<span class="text">全选</span></label></div></th>' +
            '<th>设备名称</th>' +
            '<th>姓名</th>' +
            '<th>所属账号</th>' +
            '<th>设备类型</th>' +
            '<th>系统</th>' +
            '<th>上一次在线时间</th>' +
            '<th>目前状态</th>' +
            '</tr>';

    $.silentGet('/man/dev/getDevList', {
        start_page: start_page,
        page_length: page_length,
        keyword: $('input[name=searchval]').val()
    }, function (data) {
        var online = '', platform = '';
        if (data.rt == '0000') {
            for (var i in data.doc) {
                dev_name = data.doc[i].dev_name || '未知设备';
                dev_system = data.doc[i].dev_system || '未知系统';
                online = (data.doc[i].online == 1) ? '在线' : '离线';
                platform = (data.doc[i].platform == "ios") ? 'iOS' : 'Android';
                str += '<tr data-i="' + i + '">' +
                    '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)" />' +
                    '<span class="text"></span></label></div></td>' +
                    '<td><a href="javascript:getDetail(' + i + ');">' + dev_name + '</a></td>' +
                    '<td>' + data.doc[i].user_name + '</td>' +
                    '<td>' + data.doc[i].account + '</td>' +
                    '<td>' + platform + '</td>' +
                    '<td>' + dev_system + '</td>' +
                    '<td>' + data.doc[i].last_online + '</td>' +
                    '<td>' + online + '</td>' +
                    '</tr>';
            }
            str += '</table>';
            table.html(str);
            table.find('table').data('data', data);
            createFooter(start_page, page_length, data.total_count, 1);
        } else if (data.rt == 5) {
            toLoginPage();
        }
    });
    currentpage = start_page;
}

// page页查询
function search(p, i) {
    if (i == 1) {
        getDeviceList(p, 10);
    } else {
        console.info(i);
    }
}

// 返回设备列表
function devicelist() {
    $('.device, .deviceinfo').css({ 'display': 'none' });
    $('.devicelist').css({ 'display': 'block' });
    $('#myTab5 li a').eq(2).attr("disabled", false);
}

function checkmap() {
    var dev_id = [],
        i = 0;
    var tr;
    var tab = $('.devicetable table');
    tab.find('td span.text').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            dev_id[i] = tr.data('i') * 1;
            i = i + 1;
        }
    });
    if (i === 1) {
        getDetail(dev_id[0]);
        $('#myTab5 li').removeClass('active');
        $('#tab1').removeClass('in active');
        $('#myTab5 li').eq(2).addClass('active');
        $('#tab3').addClass('in active');
    } else {
        warningOpen('请选择一台设备查看设备定位信息！', 'danger', 'fa-bolt');
    }
}

function getDetail(i) {
    var oItem = $('.devicelist table').data('data').doc[i];
    var oDevInfo = oItem.dev_info ? oItem.dev_info : null,
        oAppInfoList = oItem.app_list ? oItem.app_list.app_info_list : null;
    if (typeof oDevInfo === "object" && JSON.stringify(oDevInfo) !== '{}' && oDevInfo !== null) {
        $('.devicelist').css({ 'display': 'none' });
        $('.device').css({ 'display': 'block' });
        $('.deviceinfo').css({ 'display': 'inline-block' });
        $('#myTab5 li').removeClass('active');
        $('#myTab5 li:first-child').addClass('active');
        $('.tab-content div').removeClass('active');
        $('#tab1').addClass('active');

        var devicename = oItem.dev_name,
            lasttime = oItem.last_online,
            status = oItem.online == 1 ? '在线' : '离线',
            userid = oItem.uid,
            dev_id = oItem.dev_id;
        var strtab1 = '';
        var strtab4 = '';
        var strtab2 = '';

        $('.devicename').text('设备名称 : ' + devicename);
        $('.lasttime').text('上一次在线时间 : ' + lasttime);
        $('.imei').text('IMEI : ' + oDevInfo.imei);
        $('.status').text('目前状态 : ' + status);
        var reset = '<li class="list-group-item" style="border:none;">' +
            '<img class="img-circle" src="../imgs/reset.png" onclick="sendCmd(\'reset\',\'' + dev_id + '\')" /></li>' +
            '<li class="list-group-item" onclick="sendCmd(\'reset\',\'' + dev_id + '\')" style="border:none;">擦除全部数据</li>';
        $('.reset').html(reset);
        var bell = '<li class="list-group-item" style="border:none;">' +
            '<img class="img-circle" src="../imgs/bell.png" onclick="sendCmd(\'bell\',\'' + dev_id + '\')" /></li>' +
            '<li class="list-group-item" onclick="sendCmd(\'bell\',\'' + dev_id + '\')" style="border:none;">响铃追踪</li>';
        $('.bell').html(bell);
        var lock = '<li class="list-group-item" style="border:none;">' +
            '<img class="img-circle" src="../imgs/lock.png" onclick="sendCmd(\'lockscreen\',\'' + dev_id + '\')" /></li>' +
            '<li class="list-group-item" onclick="sendCmd(\'lockscreen\',\'' + dev_id + '\')" style="border:none;">锁屏</li>';
        $('.lock').html(lock);
        var lockpwd = '<li class="list-group-item" style="border:none;"><input name="userid" value="' + userid + '" style="display:none;" />' +
            '<img class="img-circle" src="../imgs/lockpwd.png" onclick="updatescreenpw(\'' + dev_id + '\')" /></li>' +
            '<li class="list-group-item" onclick="updatescreenpw(\'' + dev_id + '\')" style="border:none;">锁屏密码</li>';
        $('.lockpwd').html(lockpwd);

        // tab1 设备基本信息
        var ulinfo1 = '<li class="list-group-item" style="border:none;">' + oDevInfo.manufacture + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.screen_resolution + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.screen_size + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.system_language + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.battery + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.sim_supportor + '</li>';
        $('.ulinfo1').html(ulinfo1);
        var ulinfo2 = '<li class="list-group-item" style="border:none;">' + oDevInfo.model_number + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.cpu_name + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.cpu_count + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.memory_total + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.phone_type + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.serial + '</li>';
        $('.ulinfo2').html(ulinfo2);

        // tab2 设备网络信息
        var netinfo1 = '<li class="list-group-item" style="border:none;">' + oDevInfo.devicemobileinfo.phone_number + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.devicemobileinfo.isrouting + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.devicemobileinfo.sim_provider + '</li>' +
            '<li class="list-group-item" style="border:none;">－－</li>';
        $('.netinfo1').html(netinfo1);
        var netinfo2 = '<li class="list-group-item" style="border:none;">－－</li>' +
            '<li class="list-group-item" style="border:none;">－－</li>' +
            '<li class="list-group-item" style="border:none;">－－</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.devicemobileinfo.network_type + '</li>';
        $('.netinfo2').html(netinfo2);
        var netinfo3 = '<li class="list-group-item" style="border:none;">' + oDevInfo.devicemobileinfo.device_wifi_info.bssid + '</li>' +
            '<li class="list-group-item" style="border:none;">' + oDevInfo.devicemobileinfo.device_wifi_info.ip_address + '</li>';
        $('.netinfo3').html(netinfo3);
        var netinfo4 = '<li class="list-group-item" style="border:none;">' + lasttime + '</li>' +
            '<li class="list-group-item" style="border:none;">－－</li>';
        $('.netinfo4').html(netinfo4);

        // tab3 设备定位信息
        var url = '/man/dev/location?dev_id=' + dev_id;
        $.get(url, function (data) {
            data = JSON.parse(data);
            showLocationMap(data);
        });

        // tab4 设备已安装app列表
        strtab4 = '<table class="table table-hover"><tr>' +
            '<th>应用名称</th>' +
            '<th>应用包名称</th>' +
            '<th>版本</th>'
        '<th>安装位置</th></tr>';
        for (var i in oAppInfoList) {
            var apptype = oAppInfoList[i].is_system_app ? '系统应用' : '空间应用';
            strtab4 += '<tr>' +
                '<td>' + oAppInfoList[i].app_name + '</td>' +
                '<td>' + oAppInfoList[i].package_name + '</td>' +
                '<td>' + oAppInfoList[i].version_name + '</td>' +
                '<td>' + apptype + '</td>';
        }
        strtab4 += '</table>';
        $('.applist').html(strtab4);
    } else {
        warningOpen('设备信息缺失！', 'danger', 'fa-bolt');
    }
}

//根据请求获得的定位数据，展示定位地图
function showLocationMap(data) {
    var posType = $('#position_type');
    var uplTime = $('#upload_time');
    var time = new Date();
    var rt = data.rt,
        position_type = data.position_type,
        position = data.position ? JSON.parse(data.position) : '',
        upload_time = data.upload_time;
    switch (position_type) {
        case 1:
            posType.text('正常定位模式');
            if (upload_time && position) {
                uplTime.text(upload_time);
                uplTime.css('color', 'inherit');
            } else {
                uplTime.text('获取最新定位时间失败');
                uplTime.css('color', 'red');
            }
            break;
        case 2:
            posType.text('工作日定位模式');
            if (upload_time && position) {
                uplTime.text(upload_time);
                uplTime.css('color', 'inherit');
            } else {
                uplTime.text('获取定位时间失败');
                uplTime.css('color', 'red');
            }
            break;
        case 3:
            posType.text('不允许定位模式');
            break;
        default:
            console.error('获取定位模式异常');
    }
    if (rt == 0) {
        if (position) {
            var map = new AMap.Map("address", {
                resizeEnable: true,
                center: [position.longitude, position.latitude], //地图中心点
                zoom: 15 //地图显示的缩放级别
            });
            AMap.plugin(['AMap.ToolBar', 'AMap.AdvancedInfoWindow'], function () {
                //创建并添加工具条控件
                var toolBar = new AMap.ToolBar();
                map.addControl(toolBar);
            })

            //map.setCenter([position.longitude, position.latitude]);

            var marker = new AMap.Marker({
                title: position.address,
                map: map
            });
            // 设置label标签
            marker.setLabel({ //label默认蓝框白底左上角显示，样式className为：amap-marker-label
                offset: new AMap.Pixel(20, 20), //修改label相对于maker的位置
                content: "位置信息：" + position.address
            });
            return;
        } else {
            mapObj.getInstance();
            warningOpen('设备没有定位信息！', 'danger', 'fa-bolt');
        }

    } else if (rt == 1) {
        mapObj.getInstance();
        warningOpen('该设备定位信息已过时！', 'danger', 'fa-bolt');
    } else if (rt == 5) {
        toLoginPage();
    } else {
        warningOpen('其他错误 ' + rt + ' ！', 'danger', 'fa-bolt');
    }
}


// 单个设备推送
function sendCmd(cmd, dev_id) {
    if (cmd === 'reset') {
        var cont = '';
        cont += '<div class="modal-header">' +
            ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
            '<h4 class="modal-title">提示</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>确定恢复出厂设置？</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
            '<button type="button" class="btn btn-primary" id="resetdata">确认</button>' +
            '</div>';
        alertOpen(cont);
        $("#resetdata").click(function () {
            alertOff();
            sendcmd(cmd, dev_id);
        });
    } else {
        sendcmd(cmd, dev_id);
    }

}

function sendcmd(cmd, dev_id) {
    var dev_id = [dev_id];
    var postData = {
        dev_id: JSON.stringify(dev_id),
        opt_type: cmd
    };
    $.actPost('/man/device/sendCmd', postData, function (data) {
        if (data.rt == '0000') {

        }
    });
}

// 设置锁屏密码
function updatescreenpw(dev_id) {
    var id = $('input[name=userid]').val() * 1;
    var passwd_type, min_len, checkpwd = '',
        warningtext = '';
    var postData = {
        dev_id: dev_id,
        id: id
    };
    $.silentPost('/man/device/orgGetPolicy', postData, function (data) {
        if (data.rt == '0000') {
            passwd_type = data.passwd_type;
            min_len = data.pw_min_len;
            if (passwd_type == 1) {
                checkpwd = /^\d$/; //数字
                warningtext = '请输入至少' + min_len + '位数字'; //提示
            } else if (passwd_type == 2) {
                checkpwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,}$/; //字母和数字
                warningtext = '请输入至少' + min_len + '位字母和数字组合'; //提示
            } else if (passwd_type == 3) {
                checkpwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,10}$/; //字母和数字包含大小写
                warningtext = '请输入至少' + min_len + '位包含大小写字母和数字组合'; //提示
            } else {
                checkpwd = ''; //字母和数字
            }
        }
    });

    setTimeout(function () {
        var cont = '';
        cont += '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
            '<h4 class="modal-title">设置锁屏密码</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p class="lockpwdwarning" style="color:red;text-align:center;">' + warningtext + '</p>' +
            '<form role = "form" class="form-horizontal">' +
            '<div class = "form-group">' +
            '<label class="col-sm-3 control-label" for = "screen_pw">锁屏密码</label>' +
            '<div class="col-sm-7">' +
            '<input type="password" class = "form-control" id = "screen_pw" name="screen_pw" placeholder = "请输入新密码" />' +
            '</div></div>' +
            '<div class = "form-group">' +
            '<label class="col-sm-3 control-label" for = "confirm">确认锁屏密码</label>' +
            '<div class="col-sm-7">' +
            '<input type="password" class = "form-control" id = "confirm" name="confirm" placeholder = "再次输入新密码" />' +
            '</div></div>' +
            '</form>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
            '<button type="button" class="btn btn-primary updscrpw" onclick="sendpw(\'' + dev_id + '\')">确认</button>' +
            '</div>';
        alertOpen(cont);

        $('input[name=screen_pw],input[name=confirm]').keyup(function () { // 输入限制，只能输入整数 
            if (passwd_type == 1) {
                if (this.value.length == 1) {
                    this.value = this.value.replace(/[^0-9]/g, '');
                } else {
                    this.value = this.value.replace(/\D/g, '');
                }
            } else {
                this.value = this.value.replace(/[\W]/g, '');
            }

        });

        $("input[name=screen_pw], input[name=confirm]").blur(function () {

            if (passwd_type == 1) {
                if (this.value.length < min_len * 1) {
                    warningOpen('请输入正确格式锁屏密码！', 'danger', 'fa-bolt');
                    $(".updscrpw").attr("disabled", true);
                } else {
                    $(".updscrpw").attr("disabled", false);
                }

            } else {
                if (!checkpwd.test(this.value) || this.value.length < min_len * 1) {
                    warningOpen('锁屏密码格式错误！', 'danger', 'fa-bolt');
                    $(".updscrpw").attr("disabled", true);

                } else {
                    $(".updscrpw").attr("disabled", false);
                }

            }
        });
    }, 500);

}

// 锁屏密码推送
function sendpw(devid) {
    var psw = $('input[name=screen_pw]').val();
    var confirm = $('input[name=confirm]').val();
    if (psw == '') {
        warningOpen('请输入锁屏密码！', 'danger', 'fa-bolt');
    } else if (psw != confirm) {
        warningOpen('前后锁屏密码不一致！', 'danger', 'fa-bolt');
    } else {
        var cmd = 'chg_screen_pw <' + psw + '>';
        var dev_id = [devid];
        var postData = {
            dev_id: JSON.stringify(dev_id),
            opt_type: cmd
        };
        $.actPost('/man/device/sendCmd', postData, function (data) {
            if (data.rt == '0000') {

            }
        });
    }
}

//一个或者多个设备消息推送
function send_cmds(cmd) {
    var dev_id = [],
        i = 0,
        tr;
    var tab = $('.devicetable table');
    tab.find('td span.text').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            dev_id[i] = tab.data('data').doc[tr.data('i')].dev_id;
            i = i + 1;
        }
    });
    if (dev_id.length > 0) {
        if (cmd === 'reset' || cmd === 'erasedata') {
            var cont = '';
            cont += '<div class="modal-header">' +
                ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
                '<h4 class="modal-title">提示</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<p>确定擦除数据？</p>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
                '<button type="button" class="btn btn-primary" id="resetdata">确认</button>' +
                '</div>';
            alertOpen(cont);
            $("#resetdata").click(function () {
                alertOff();
                sendcmds(cmd);
            });
        } else {
            sendcmds(cmd);
        }
    }

}

function sendcmds(cmd) {
    var dev_id = [],
        i = 0,
        tr, id, passwd_type, checkpwd = '',
        warningtext = '',
        min_len;
    var cmd = cmd;
    var tab = $('.devicetable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            dev_id[i] = tab.data('data').doc[tr.data('i')].dev_id;
            id = tab.data('data').doc[tr.data('i')].uid * 1;
            i = i + 1;
        }
    });

    if (dev_id.length > 0) {
        if (cmd == 'chg_screen_pw') {
            if (dev_id.length === 1) {
                var postData = {
                    dev_id: dev_id[0],
                    id: id
                };
                $.post('/man/device/orgGetPolicy', postData, function (data) {
                    if (data.rt == '0000') {
                        passwd_type = data.passwd_type;
                        min_len = data.pw_min_len;
                        if (passwd_type == 1) {
                            checkpwd = /^\d$/; //数字
                            warningtext = '请输入至少' + min_len + '位数字'; //提示
                        } else if (passwd_type == 2) {
                            checkpwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,}$/; //字母和数字
                            warningtext = '请输入至少' + min_len + '位字母和数字组合'; //提示
                        } else if (passwd_type == 3) {
                            checkpwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,10}$/; //字母和数字包含大小写
                            warningtext = '请输入至少' + min_len + '位包含大小写字母和数字组合'; //提示
                        } else {
                            checkpwd = ''; //字母和数字
                        }
                    }
                });

                setTimeout(function () {
                    var cont = '';
                    cont += '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
                        '<h4 class="modal-title">设置锁屏密码</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<p class="lockpwdwarning" style="color:red;text-align:center;">' + warningtext + '</p>' +
                        '<form role = "form" class="form-horizontal">' +
                        '<div class = "form-group">' +
                        '<label class="col-sm-3 control-label" for = "screen_pw">锁屏密码</label>' +
                        '<div class="col-sm-7">' +
                        '<input type="password" class = "form-control" id = "screen_pw" name="screen_pw" placeholder = "请输入新密码" />' +
                        '</div></div>' +
                        '<div class = "form-group">' +
                        '<label class="col-sm-3 control-label" for = "confirm">确认锁屏密码</label>' +
                        '<div class="col-sm-7">' +
                        '<input type="password" class = "form-control" id = "confirm" name="confirm" placeholder = "再次输入新密码" />' +
                        '</div></div>' +
                        '</form>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
                        '<button type="button" class="btn btn-primary updscrpw" onclick="changesppw()">确认</button>' +
                        '</div>';
                    alertOpen(cont);
                    $('input[name=screen_pw],input[name=confirm]').keyup(function () { // 输入限制，只能输入整数 
                        if (passwd_type == 1) {
                            if (this.value.length == 1) {
                                this.value = this.value.replace(/[^0-9]/g, '');
                            } else {
                                this.value = this.value.replace(/\D/g, '');
                            }
                        } else {
                            this.value = this.value.replace(/[\W]/g, '');
                        }

                    });

                    $("input[name=screen_pw], input[name=confirm]").blur(function () {

                        if (passwd_type == 1) {
                            if (this.value.length < min_len * 1) {
                                warningOpen('请输入正确格式锁屏密码！', 'danger', 'fa-bolt');
                                $(".updscrpw").attr("disabled", true);
                            } else {
                                $(".updscrpw").attr("disabled", false);
                            }

                        } else {
                            if (!checkpwd.test(this.value) || this.value.length < min_len * 1) {
                                warningOpen('锁屏密码格式错误！', 'danger', 'fa-bolt');
                                $(".updscrpw").attr("disabled", true);

                            } else {
                                $(".updscrpw").attr("disabled", false);
                            }

                        }
                    });
                }, 500);
            } else {
                warningOpen('请选择一个设备设置锁屏密码！', 'danger', 'fa-bolt');
            }

        } else {
            var postData = {
                dev_id: JSON.stringify(dev_id),
                opt_type: cmd
            };
            $.actPost('/man/device/sendCmd', postData, function (data) {
                if (data.rt == '0000') {

                }
            });
        }
    } else {
        warningOpen('请先选择设备！', 'danger', 'fa-bolt');
    }
}

// 多个设备锁屏密码
function changesppw() {
    var dev_id = [],
        i = 0,
        tr;
    var tab = $('.devicetable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            dev_id[i] = tab.data('data').doc[tr.data('i')].dev_id;
            i = i + 1;
        }
    });
    var psw = $('input[name=screen_pw]').val();
    var confirm = $('input[name=confirm]').val();
    if (psw == '') {
        warningOpen('请输入锁屏密码！', 'danger', 'fa-bolt');
    } else if (psw != confirm) {
        warningOpen('前后锁屏密码不一致！', 'danger', 'fa-bolt');
    } else {
        var cmd = 'chg_screen_pw <' + psw + '>';
        var postData = {
            dev_id: JSON.stringify(dev_id),
            opt_type: cmd
        };
        $.actPost('/man/device/sendCmd', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
            }
        });
    }
}

// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getDeviceList(currentpage, 10);
    $('.hrefactive').removeClass("hrefallowed");
}

// 解绑
function unlink() {
    var i = 0;
    var tab = $('.devicetable table');
    if (tab.find('td span').hasClass('txt')) {
        i = 1;
    }
    var cont = '';
    if (i > 0) {
        cont += '<div class="modal-header">' +
            ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
            '<h4 class="modal-title">提示</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p class="text-align-center">确定解绑吗？</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
            '<button type="button" class="btn btn-primary" onclick="device_unlink()">确认</button>' +
            '</div>';
        alertOpen(cont);
    }
}
// 淘汰
function weepout() {
    var i = 0;
    var tab = $('.devicetable table');
    if (tab.find('td span').hasClass('txt')) {
        i = 1;
    }
    var cont = '';
    if (i > 0) {
        cont += '<div class="modal-header">' +
            ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
            '<h4 class="modal-title">提示</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p class="text-align-center">确定淘汰吗？</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
            '<button type="button" class="btn btn-primary" onclick="device_weepout()">确认</button>' +
            '</div>';
        alertOpen(cont);
    }
}

// 企业管理员解绑多个设备
function device_unlink() {
    var dev_id = [],
        i = 0;
    var tr;
    var tab = $('.devicetable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            dev_id[i] = tab.data('data').doc[tr.data('i')].dev_id;
            i = i + 1;
        }
    });
    if (dev_id.length > 0) {
        var postData = {
            dev_id: JSON.stringify(dev_id)
        };

        $.actPost('/man/device/unlinkDevice', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
                getDeviceList(1, 10);
            }
        });
    }
}
// 企业管理员淘汰多个设备
function device_weepout() {
    var dev_id = [],
        i = 0;
    var tr;
    var tab = $('.devicetable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            dev_id[i] = tab.data('data').doc[tr.data('i')].dev_id;
            i = i + 1;
        }
    });
    if (dev_id.length > 0) {
        var postData = {
            dev_id: JSON.stringify(dev_id)
        };

        $.actPost('/man/device/weepoutDevice', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
                getDeviceList(1, 10);
            }
        });
    }
}
