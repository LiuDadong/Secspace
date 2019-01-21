/*
 * ==================================================================
 *                          设备管理 device
 * ==================================================================
 */
applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限

//用于交互时改变标题显示
var subCaption = $('#subCaption').data('itemText', '设备').text('设备列表');

//采用分页表格组件pagingTable初始化黑白名单列表
var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
    type: 'GET',
    jsonData: {
        url: '/p/dev/devList'
    },
    // theadHtml为表头类元素，第一个th用于存放全选复选框
    theadHtml: '<tr>\
                    <th style="width:5%;"></th>\
                    <th style="width:15%;">设备名称</th>\
                    <th style="width:10%;">姓名</th>\
                    <th style="width:15%;">所属账号</th>\
                    <th style="width:8%;">设备类型</th>\
                    <th style="width:7%;">系统</th>\
                    <th style="width:16%;">上一次在线时间</th>\
                    <th style="width:9%;">目前状态</th>\
                    <th style="width:14%;">操作</th>\
                </tr>',
    // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
    // to-edit、to-view表示要跳转的目标表单
    tbodyDemoHtml: '<tr>\
                        <td></td>\
                        <td onclick="showDevDetail(this,\'basic\')" style="color:#428bca;cursor:pointer;" item-key="dev_name"></td>\
                        <td item-key="user_name"></td>\
                        <td item-key="account"></td>\
                        <td item-key="platform"></td>\
                        <td item-key="dev_system"></td>\
                        <td item-key="last_online"></td>\
                        <td item-key="online"></td>\
                        <td>\
                            <a class="btn btn-primary btn-xs" onclick="showDevDetail(this,\'basic\')" title="设备详情"><i class="fa fa-eye"></i></a>\
                            <a class="btn btn-primary btn-xs" onclick="showDevDetail(this,\'map\')" title="查看位置" style="margin:0 -6px;"><i class="glyphicon glyphicon-map-marker"></i></a>\
                            <a class="btn btn-primary btn-xs'+ (hasFn('spw')?'" onclick="resetLockPW(this)"':' disabled"')+' title="设置锁屏密码"><i class="fa fa-key"></i></a>\
                        </td>\
                    </tr>',
    //因不同需求需要个性控制组件表现的修正函数和增强函数
    fnGetItems: function (data) {  //必需   需要要显示的成员
        return data.doc.map(function (item) {
            item['id'] = item.dev_id;
            return item;
        });
    },
    fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
        switch (k) {
            case 'dev_name':
                v = v || '未知设备';
                break;
            case 'dev_system':
                v = v || '未知系统';
                break;
            case 'platform':
                v = (v == 'ios') ? 'iOS' : 'Android';
                break;
            case 'online':
                v = v == 1 ? '在线' : '离线';
                break;
            default:
        }
        return v;
    }
}))

var panel = $('#panel').Panel({
    objTargetTable: pagingTable,
    objTargetForm: null,
    objTargetCaption: subCaption
});



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


function showDevDetail(ele, acttab) {
    $('.row.dev_list').addClass('hidden');
    $('.row.dev_info').removeClass('hidden');
    $('#navDevInfo>li.' + acttab + '>a').click();
    var oItem = $(ele).closest('tr').data('item'),
        oDevInfo = oItem.dev_info ? oItem.dev_info : null,
        oAppInfoList = oItem.app_list ? oItem.app_list.app_info_list : null;
    if (typeof oDevInfo === "object" && JSON.stringify(oDevInfo) !== '{}' && oDevInfo !== null) {
        // $('.devicelist').css({ 'display': 'none' });
        // $('.device').css({ 'display': 'block' });
        // $('.deviceinfo').css({ 'display': 'inline-block' });
        // $('#navDevInfo li').removeClass('active');
        // $('#navDevInfo li:first-child').addClass('active');
        // $('.tab-content div').removeClass('active'); 
        // $('#tab1').addClass('active');

        var devicename = oItem.dev_name,
            lasttime = oItem.last_online,
            status = oItem.online == 1 ? '在线' : '离线',
            userid = oItem.uid,
            dev_id = oItem.dev_id;
        var strtab4 = '';
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
            '<th>版本</th>' +
        '<th>安装位置</th></tr>';
        if(oAppInfoList instanceof Array&&oAppInfoList.length>0){
            for (var i in oAppInfoList) {
                var apptype = oAppInfoList[i].is_system_app ? '系统应用' : '空间应用';
                strtab4 += '<tr>' +
                    '<td>' + oAppInfoList[i].app_name + '</td>' +
                    '<td>' + oAppInfoList[i].package_name + '</td>' +
                    '<td>' + oAppInfoList[i].version_name + '</td>' +
                    '<td>' + apptype + '</td></tr>';
            }
        }else{
            strtab4 += '<tr><td colspan="4">暂无数据</td></tr>'
        }
        
        strtab4 += '</table>';
        console.log(strtab4);
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


function fnSend(cmd, dev_id) {
    $.actPost('/man/device/sendCmd', {
        dev_id: JSON.stringify(dev_id),
        opt_type: cmd
    }, function (data) {
        if (data.rt == '0000') {}
    });
}
//一个或者多个设备消息推送
function send_cmds(cmd) {
    var dev_id = pagingTable.data('PagingTable').sel.map(function (item) {
        return item.dev_id;
    });
    console.log(dev_id);
    if (dev_id.length > 0) {
        switch (cmd) {
            case 'reset':
                $.dialog('confirm', {
                    title: '提示',
                    content: '确认恢复出厂设置吗？',
                    confirm: function () {
                        fnSend(cmd, dev_id);
                    }
                })
                break;
            case 'erasedata':
                $.dialog('confirm', {
                    title: '提示',
                    content: '确认擦除企业数据吗？',
                    confirm: function () {
                        fnSend(cmd, dev_id);
                    }
                })
                break;
            default:
                fnSend(cmd, dev_id);
        }
    } else {
        warningOpen('请先选择设备', 'danger', 'fa-bolt');
    }

}

function resetLockPW(ele) {
    var dev_id = $(ele).closest('tr').data('item').dev_id;
    $.post('/man/device/orgGetPolicy', {
        dev_id: dev_id,
        id: 1
    }, function (data) {
        $.objRegex['lockpw'] = {
            pattern: /^[0-9]{4,}$/,
            info: '请输入至少4位数字'
        };
        if (data.rt == '0000') {
            switch (data.passwd_type) {
                case 1:
                    $.objRegex.lockpw.pattern = new RegExp("^[0-9]{" + data.pw_min_len + ",}$");
                    $.objRegex.lockpw.info = '请输入至少' + data.pw_min_len + '位数字';
                    break;
                case 2:
                    $.objRegex.lockpw.pattern = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{" + data.pw_min_len + ",}$");
                    $.objRegex.lockpw.info = '请输入至少' + data.pw_min_len + '位字母和数字组合';
                    checkpwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,}$/; //字母和数字
                    warningtext = '请输入至少' + data.pw_min_len + '位字母和数字组合'; //提示
                    break;
                case 3:
                    $.objRegex.lockpw.pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{" + data.pw_min_len + ",}$");
                    $.objRegex.lockpw.info = '请输入至少' + data.pw_min_len + '位包含大小写字母和数字组合';
                    break;
                default:
            }
        }
        $.dialog('form', {
            title: '设置锁屏密码',
            top: '20%',
            width: 500,
            height: null,
            autoSize: true,
            maskClickHide: true,
            content: '<form id="frmModPW" class="form-horizontal" role="form" method="post">\
                        <input type="hidden" name="dev_id" />\
                        <input type="hidden" name="opt_type" />\
                        <div class="form-group">\
                            <label for="screen_pw" class="col-sm-3 control-label no-padding-right">锁屏密码</label>\
                            <div class="col-sm-9">\
                                <input type="password" class="form-control require" id="screen_pw" ctrl-regex="lockpw" placeholder="请输入新密码">\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label for="confirm" class="col-sm-3 control-label no-padding-right">确认锁屏密码</label>\
                            <div class="col-sm-9">\
                                <input type="password" class="form-control" id="confirm" same-with="screen_pw" autocomplete="off" placeholder="请再次输入新密码">\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <div class="col-sm-2  col-sm-offset-5">\
                                <button type="button" class="btnBack btn btn-default">返回</button>\
                            </div>\
                            <div class="col-sm-2 col-sm-offset-1">\
                                <input type="submit" class="btn btn-primary" disabled="">\
                            </div>\
                        </div>\
                    </form>',
            hasBtn: false,
            hasClose: true,
            hasMask: true,
            confirm: function () {
                frmModPW.submit();
            },
            confirmHide: false,
            cancelValue: '取消'
        });
        $('#frmModPW').data('item', {
            dev_id: JSON.stringify([dev_id])
        });
        var frmModPW = $('#frmModPW').MultForm({
            editBtnTxt: '确认',
            editAct: '/man/device/sendCmd',
            afterUsed: function (use) {
                frmModPW.find('input[name=url]').remove();
            },
            cbAfterSuccess: function (use) {
                $.dialogClose();
            }
        });
        frmModPW.usedAs('edit');
        $('#screen_pw').on('input', function () {
            $('input[name=opt_type]').val('chg_screen_pw <' + $(this).val() + '>')
        });
    });
}



// 企业管理员解绑多个设备
function unlink() {
    var dev_id = pagingTable.data('PagingTable').sel.map(function (item) {
        return item.dev_id;
    });
    if (dev_id.length > 0) {
        $.dialog('confirm', {
            content: '确认解绑选中的设备吗？',
            confirm: function () {
                $.actPost('/man/device/unlinkDevice', {
                    dev_id: JSON.stringify(dev_id)
                }, function (data) {
                    if (data.rt == '0000') {
                        pagingTable.PagingTable('refresh');
                    }
                });
            },
            cancelValue: '取消',
            title: '设备解绑确认'
        });
    } else {
        warningOpen('请先选择设备', 'danger', 'fa-bolt')
    }
}
// 企业管理员淘汰多个设备
function weepout() {
    var dev_id = pagingTable.data('PagingTable').sel.map(
        function (item) {
            return item.dev_id;
        }
    );
    if (dev_id.length > 0) {
        $.dialog('confirm', {
            title: '设备淘汰确认',
            content: '确认淘汰选中的设备吗？',
            cancelValue: '取消',
            confirm: function () {
                $.actPost('/man/device/weepoutDevice', {
                    dev_id: JSON.stringify(dev_id)
                }, function (data) {
                    if (data.rt == '0000') {
                        pagingTable.PagingTable('refresh');
                    }
                });
            }
        });
    } else {
        warningOpen('请先选择设备', 'danger', 'fa-bolt');
    }
};




// 单个设备推送
function sendCmd(cmd, dev_id) {
    if (cmd === 'reset') {
        $.dialog('confirm', {
            content: '确认恢复出厂设置？',
            confirm: function () {
                sendcmd(cmd, dev_id);
            },
            cancelValue: '取消',
            title: '设备淘汰确认'
        });
    } else {
        sendcmd(cmd, dev_id);
    }
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