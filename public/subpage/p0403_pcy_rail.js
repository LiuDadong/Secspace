/*
 * ==================================================================
 *                          围栏策略 railpolicy
 * ==================================================================
 */
//用于交互时改变标题显示
var subCaption = $('#subCaption').data('itemText', '围栏策略').text('围栏策略列表');

//采用分页表格组件pagingTable初始化黑白名单列表
var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
    jsonData: {
        'listurl': '/p/org/listFencePolicy',
    },
    // theadHtml为表头类元素，第一个th用于存放全选复选框
    theadHtml: '<tr>\
                    <th></th>\
                    <th>名称</th>\
                    <th>类型</th>\
                    <th>状态</th>\
                    <th>已应用/已下发</th>\
                    <th>更新时间</th>\
                    <th>创建者</th>\
                    <th>操作</th>\
                </tr>',
    // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
    // to-edit、to-view表示要跳转的目标表单
    tbodyDemoHtml: '<tr>\
                        <td></td>\
                        <td><span item-key="name"></span></td>\
                        <td><span item-key="policy_type"></span></td>\
                        <td><span item-key="status"></span></td>\
                        <td>\
                            <a href="#" class="numInfo" data-listurl="/p/org/userByPolicyId">\
                                <span item-key="used"></span>/<span item-key="issued"></span>\
                            </a>\
                        </td>\
                        <td><span item-key="update_time"></span></td>\
                        <td><span item-key="creator"></span></td>\
                        <td><a toForm="edit">编辑</a><a toForm="view">查看</a></td>\
                    </tr>',
    //因不同需求需要个性控制组件表现的修正函数和增强函数
    fnGetItems: function (data) {  //必需   需要要显示的成员
        return data.policies;
    },
    fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
        switch (k) {
            case 'policy_type':
                switch (v) {
                    //设备策略
                    case 'device':
                        v = '设备策略';
                        break;
                    //合规策略
                    case 'complicance':
                        v = '合规策略';
                        break;
                    //围栏策略
                    case 'geofence':
                        v = '地理围栏';
                        break;
                    case 'timefence':
                        v = '时间围栏';
                        break;
                    //应用策略
                    case 'blackapp':
                        v = '黑名单策略';
                        break;
                    case 'whiteapp':
                        v = '白名单策略';
                        break;
                    case 'limitaccess':
                        v = '限制访问策略';
                        break;
                    //客户端策略
                    case 'customer':
                        v = '客户端策略';
                        break;
                    default:
                        v = '未知策略';
                }
                break;
            case 'status':
                v = v == 1 ? '启用' : '禁用';  //例： item['status']的值为1时，在<span item-key="status"></span>中显示文本‘启用’，否则显示‘禁用’
                break;
            default:
        }
        return v;
    },
    cbEdit: function () {   //点击修改、编辑按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
        multForm.usedAs('edit');
    },
    cbView: function () {  //点击产看、详情按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
        multForm.usedAs('view');
    }
}))

// 采用multForm组件初始化黑白名单多用途表单
var multForm = $('#multForm').MultForm({
    addUrl: '/p/org/uploadFencePolicy',
    editUrl: '/p/org/updateFencePolicy',
    editBtnTxt: '保存并下发',
    afterReset: function () {  //表单重置之后紧接着的回调
        //控制禁用客户端权限样式和行为
        // 获取客户端设置授权项
    },
    beforeUsed: function (use, item) {
        switch (use) {
            case "add":
                break;
            case "edit":
                break;
            case "view":
                break;
            default:
        }
    },
    afterUsed: function (use, item) {
        this.off('submit').attr("onkeydown","if(event.keyCode==13){return false;}");
        var btnSubmit = this.find('input[type=submit]');
        switch (use) {
            case "add":
                btnSubmit.off().on('click', function (e) {
                    e.preventDefault();
                    add_policy();
                    return false;
                })
                break;
            case "edit":
                showItem(item);
                multForm.find('input[name=name]').attr('readonly', false);
                btnSubmit.off().on('click', function (e) {
                    e.preventDefault();
                    mod_policy();
                    return false;
                })
                break;
            case "view":
                showItem(item);
                break;
            default:
        }
    },
    cbSubmit: function (use) {  //提交编辑成功之后的回调
        switch (use) {
            case 'add':
                break;
            case 'edit':
                break;
            default:
        }
        pagingTable.PagingTable('update');
    }
})

var panel = $('#panel').Panel({
    objTargetTable: pagingTable,
    objTargetForm: multForm,
    objTargetCaption: subCaption,
    policy_type: 'rail',
    deleteJson: {
        url: '/p/org/deleteFencePolicy',
    },
    updateStatusUrl: '/p/org/changeFencePolicyStatus',
    updateStatusJson: {
        url: '/p/org/changeFencePolicyStatus',
    }
})
var issuePane = $('#issuePane').IssuePane({
    objTargetTable: pagingTable,
    objTargetCaption: subCaption
})




var Amap = new cAmap('amapwrap');
Amap.run();
$.silentGet('/man/policy/getUsedDevPolicy', {}, function (data) {//获取已启用设备策略
    if (data.rt == '0000') {
        var devPolicy = $('select[name=dev_policy]'),
            option = $('<option>').attr('value', -1).text('默认策略');
        devPolicy.append(option);
        for (var i in data.policies) {
            if (data.policies[i].id != -1) {
                devPolicy.append(
                    option.clone(true)
                        .attr('value', data.policies[i].id)
                        .text(data.policies[i].name)
                );
            }
        }
    } else {
        console.warn('获取已启用设备策略失败！');
    }
});

$.silentGet('/man/policy/getUsedAppPolicy', {}, function (data) {//获取已启用应用策略
    if (data.rt == '0000') {
        var appPolicy = $('select[name=app_policy]');
        for (var i in data.blackapp) {
            var option = $('<option>')
            option.attr({
                'value': data.blackapp[i].id,
                title: '黑名单应用策略'
            }).html('<span>' + data.blackapp[i].name + '</span>')
                .addClass('black-option');
            appPolicy.append(option);
        }
        for (var i in data.whiteapp) {
            var option = $('<option>')
            option.attr({
                'value': data.whiteapp[i].id,
                title: '白名单应用策略'
            }).html('<span>' + data.whiteapp[i].name + '</span>')
                .addClass('white-option');
            appPolicy.append(option);
        }
    } else {
        console.warn('获取已启用应用策略失败！');
    }
});


$(".jedate").each(function () {
    if ($(this).hasClass('nofn')) {
        $(this).jeDate({
            format: "YYYY-MM-DD",
            okfun: function (elem, value) {
                elem.elem.change();
            },
            clearfun: function (elem, value) {
                elem.elem.change();
            }
        });
    }
    if ($(this).hasClass('jetime')) {
        $(this).jeDate({
            format: "hh:mm:ss",
            okfun: function (elem, value) {
                elem.elem.change();
            },
            clearfun: function (elem, value) {
                elem.elem.change();
            }
        });
    }
})

$('.append-box').fnInit();

$('input:checkbox[name=wifi]').on('change', function () {
    $('.form-group:has(input[name=ssid])').toggleClass('hidden', !this.checked);
});

$("select[name=policy_type]").on('change', function () {
    if ($(this).val() == 'geofence') {
        $(".timepolicy").css({ 'display': 'none' });
        $(".addresspolicy").css({ 'display': 'block' });
    } else {
        $(".addresspolicy").css({ 'display': 'none' });
        $(".timepolicy").css({ 'display': 'block' });
    }
});
$("select[name=repeat_type]").on('change', function () {
    if ($(this).val() == 1) {
        $(".everyweek").css({ 'display': 'block' });
    } else {
        $(".everyweek").css({ 'display': 'none' });
    }
});


// 添加
function add() {
    Amap.fnMapInit();
}


// 提交添加策略
function getPolicyData() {
    if (!$('input[name=name]').val()) {
        warningOpen('请填写策略名称！', 'danger', 'fa-bolt');
        return false;
    }
    var postData = {
        name: $('input[name=name]').val(),
        policy_type: $('select[name=policy_type]').val(),
        in_fence: JSON.stringify({
            dev_policy: $('#in_fence select[name=dev_policy]').val() * 1,
            app_policy: $('#in_fence select[name=app_policy]').val() * 1,
        }),
        out_fence: JSON.stringify({
            dev_policy: $('#out_fence select[name=dev_policy]').val() * 1,
            app_policy: $('#out_fence select[name=app_policy]').val() * 1,
        })
    };
    /*根据选择的围栏类型配置请求数据postData*/
    switch (postData.policy_type) {
        case 'geofence':   //地理围栏
            postData['site_range'] = JSON.stringify({
                site: $('.pointer').text(),
                range: $('.radius').text()
            });
            postData['gps'] = ~~$('input[name=gps]').prop('checked');
            postData['wifi_limit'] = JSON.stringify({
                open: ~~$('input[name=wifi]').prop('checked') ? 1 : 0,
                ssid: $('input[name=wifi]').prop('checked') ? $('input[name=ssid]').data('arrData') : []
            });
            break;
        case 'timefence':   //时间围栏
            var time_limit = {
                repeat_type: $('select[name=repeat_type]').val(),
                start_date: $('input[name=start_date]').val(),
                stop_date: $('input[name=stop_date]').val(),
                start_time: $('input[name=start_time]').val(),
                stop_time: $('input[name=stop_time]').val(),
            };
            if ($('select[name=repeat_type]').val() == '1') {
                time_limit.weekday = $('select[name=weekday]').val();
            }
            postData['time_limit'] = JSON.stringify(time_limit);
            break;
        default:

    }
    return postData;
}
function add_policy() {
    var postData = getPolicyData();
    if (!postData) {
        return;
    }
    $.actPost('/man/railpolicy/add_policy', postData, function (data) {
        if (data.rt == '0000') {
            multForm.find('.btnBack').click();
        }
    });
}
// 编辑提交
function mod_policy() {
    var postData = getPolicyData();
    if (!postData) {
        return;
    }
    postData.id = $('input[name=id]').val();
    $.actPost('/man/railpolicy/mod_policy', postData, function (data) {
        if (data.rt == '0000') {
            multForm.find('.btnBack').click();
        }
    }, '修改并下发');
}



// 显示成员
function showItem(item) {
    $('select[name=policy_type]').prop("disabled", true);
    $('#in_fence select[name=dev_policy]').val(item.in_fence.dev_policy);
    $('#out_fence select[name=dev_policy]').val(item.out_fence.dev_policy);
    $('#in_fence select[name=app_policy]').val(item.in_fence.app_policy);
    $('#out_fence select[name=app_policy]').val(item.out_fence.app_policy);

    switch (item.policy_type) {
        case "geofence":
            var siteObj = item.site_range;
            var wifiObj = item.wifi_limit;
            var lnglat = siteObj.site.split(',');
            var radius = parseInt(item.site_range.range);
            $(".timepolicy").hide();
            $(".addresspolicy").show();
            $('input[name=gps]').attr('checked', item.gps == 1);
            if (wifiObj) {
                $('input[name=wifi]').prop('checked', wifiObj.open == 1).change();
                if (wifiObj.ssid.length > 0) {
                    $('input:hidden[name=ssid]').trigger('data', { arrData: wifiObj.ssid });
                }else{
                    $('input:hidden[name=ssid]').val('').removeData();
                }
            }

            $('.pointer').html(siteObj.site);
            $('.radius').html(siteObj.range);
            Amap.fnSetInit(lnglat, radius);
            break;
        case "timefence":
            var timeObj = item.time_limit;
            $(".addresspolicy").css({ 'display': 'none' });
            $(".timepolicy").css({ 'display': 'block' });
            timeObj.repeat_type == 1 ? $(".everyweek").css({ 'display': 'block' }) :
                $(".everyweek").css({ 'display': 'none' });
            $('select[name=repeat_type]').val(timeObj.repeat_type);
            $('select[name=weekday]').val(timeObj.weekday);
            $('input[name=stop_date]').val(timeObj.stop_date);
            $('input[name=start_date]').val(timeObj.start_date);
            $('input[name=stop_time]').val(timeObj.stop_time);
            $('input[name=start_time]').val(timeObj.start_time);
            break;
        default:
            console.error("检查modify(i)中的围栏类型railPolicyMod.policy_type")
    }


}


