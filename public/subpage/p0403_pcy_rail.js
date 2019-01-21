/*
 * ==================================================================
 *                          围栏策略 railpolicy
 * ==================================================================
 */


var camap = new CAmap('amapwrap');

applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限
jeDatePcyInit();
//用于交互时改变标题显示
var subCaption = $('#subCaption').data('itemText', '围栏策略').text('围栏策略列表');

//采用分页表格组件pagingTable初始化黑白名单列表
var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
    jsonData: {
        'url': '/p/policy/fenceMan',
    },
    // theadHtml为表头类元素，第一个th用于存放全选复选框
    theadHtml: '<tr>\
                    <th></th>\
                    <th>名称</th>\
                    <th>类型</th>\
                    <th>状态</th>\
                    <th style="width:12%;">已应用/已下发</th>\
                    <th class="filter btn-group">\
                        <a class="btn btn-default dropdown-toggle" data-toggle="dropdown">\
                            <span>来源</span> <i class="fa fa-angle-down"></i>\
                        </a>\
                        <ul class="dropdown-menu">\
                            <li>\
                                <div class="checkbox">\
                                    <label>\
                                        <input type="checkbox" name="filter" value="PUB" />\
                                        <span class="text">上级发布</span>\
                                    </label>\
                                </div>\
                            </li>\
                            <li>\
                                <div class="checkbox">\
                                    <label>\
                                        <input type="checkbox" name="filter" value="ISS" />\
                                        <span class="text">上级下发</span>\
                                    </label>\
                                </div>\
                            </li>\
                            <li>\
                                <div class="checkbox">\
                                    <label>\
                                        <input type="checkbox" name="filter" value="NAV" />\
                                        <span class="text">本级创建</span>\
                                    </label>\
                                </div>\
                            </li>\
                        </ul>\
                    </th>\
                    <th style="width:14%;">更新时间</th>\
                    <th>创建者</th>\
                    <th>管理者</th>\
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
                            <a href="#" class="numInfo" data-url="/p/policy/userByPolId">\
                                <span item-key="used"></span>/<span item-key="issued"></span>\
                            </a>\
                        </td>\
                        <td><span item-key="origin"></span></td>\
                        <td><span item-key="update_time"></span></td>\
                        <td><span item-key="creator"></span></td>\
                        <td><span item-key="manager"></span></td>\
                        <td><a todo="edit" title="编辑"><i class="fa fa-edit"></i></a><a todo="view" title="查看"><i class="fa fa-eye"></i></a></td>\
                    </tr>',
    //因不同需求需要个性控制组件表现的修正函数和增强函数
    fnGetItems: function (data) {  //必需   需要要显示的成员
        return data.policies;
    },
    fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
        switch (k) {
            case 'policy_type':
                v = $.textPolicy(v).type;
                break;
            case 'status':
                v = v == 1 ? '启用' : '禁用';  //例： item['status']的值为1时，在<span item-key="status"></span>中显示文本‘启用’，否则显示‘禁用’
                break;
            case 'origin':
                switch(v){
                    case 'NAV':
                        v='本级创建';
                        break;
                    case 'PUB':
                        v='上级发布';
                        break;
                    case 'ISS':
                        v='上级下发';
                        break;
                    default:
                }
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
    addUrl: '/p/policy/fenceMan',
    editUrl: '/p/policy/fenceMan',
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
                $('input[name=wifi]').change();
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
    cbAfterSuccess: function (use) {  //提交编辑成功之后的回调
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
    updateStatusUrl: '/p/policy/chFenPolicySta'
})
var issuePane = $('#issuePane').IssuePane({
    objTargetTable: pagingTable,
    objTargetCaption: subCaption
})
var issueSubsPane = $('#issueSubsPane').IssuePane({
    objTargetTable: pagingTable,
    objTargetCaption: subCaption,
    hasIssueBtn: 0,
    hasUnissueBtn: 0,
    hasIssSubBtn:1,
    hasPubSubBtn:1,
    hasBackBtn: 1,
    hasSearchIpt: 0
})



$.silentPost('/policy/dev_app', {}, function (data) {//获取已启用设备策略和应用策略
    if (data.rt == '0000') {
        var device=data.policies.device,
            blackapp=data.policies.blackapp,
            whiteapp=data.policies.whiteapp;
        var devPolicy = $('select[name=dev_policy]').empty(),
            appPolicy = $('select[name=app_policy]').html('<option value="-1">不设置应用策略</option>');
        for (var i in device) {
            var option = $('<option>').attr('value', device[i].id).text(device[i].name);
            if(device[i].name=='默认策略'){
                option.attr('checked','checked');
                devPolicy.prepend(option);
            }else{
                devPolicy.append(option);
            }
        }
        for (var i in blackapp) {
            var option = $('<option>').attr({
                'value': blackapp[i].id,
                title: '黑名单应用策略'
            }).html('<span>' + blackapp[i].name + '</span>')
                .addClass('black-option');
            appPolicy.append(option);
        }
        for (var i in whiteapp) {
            var option = $('<option>').attr({
                'value': whiteapp[i].id,
                title: '白名单应用策略'
            }).html('<span>' + whiteapp[i].name + '</span>')
                .addClass('white-option');
            appPolicy.append(option);
        }
    } else {
        console.warn('获取已启用设备策略失败！');
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
    if($(this).val()=='4'){
        $('#stop_date').removeClass('require danger')
        .parent().addClass('hidden')
        .prev().addClass('hidden');
        $('label[for=start_date]').prop('lastChild').nodeValue='特定日期';

    }else{
        $('#stop_date').addClass('require')
        .parent().removeClass('hidden')
        .prev().removeClass('hidden');
        $('label[for=start_date]').prop('lastChild').nodeValue='起止日期';
    }
    $('#start_date').change();
});



// 提交添加策略
function getPolicyData() {
    if (!$('input[name=name]').val()) {
        warningOpen('请填写策略名称！', 'danger', 'fa-bolt');
        return false;
    }
    var postData = {
        url:'/p/policy/fenceMan',
        name: $('input[name=name]').val(),
        leave:$('input[name=leave]').prop('checked') ? 1 : 0,
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
                site: $('.lnglat').text(),
                range: $('.radius').text()
            });
            postData['gps'] = ~~$('input[name=gps]').prop('checked');
            postData['wifi_limit'] = JSON.stringify({
                open: ~~$('input[name=wifi]').prop('checked'),
                ssid: $('input[name=wifi]').prop('checked') ? $('input[name=ssid]').data('arrData') : []
            });
            break;
        case 'timefence':   //时间围栏
            var time_limit = {
                repeat_type: $('select[name=repeat_type]').val(),
                start_date: $('input[name=start_date]').val(),
                stop_date: $('select[name=repeat_type]').val()=='4'?$('input[name=start_date]').val():$('input[name=stop_date]').val(),
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
    $.actPost('/common/org_add', postData, function (data) {
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
    $.actPost('/common/mod', postData, function (data) {
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
    $('input[name=leave]').prop('checked',item.leave=='1');
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
            $('.lnglat').html(siteObj.site);
            $('.radius').html(siteObj.range);
            camap.fnSetInit(lnglat, radius);
            break;
        case "timefence":
            var timeObj = item.time_limit;
            $(".addresspolicy").css({ 'display': 'none' });
            $(".timepolicy").css({ 'display': 'block' });
            timeObj.repeat_type == 1 ? $(".everyweek").css({ 'display': 'block' }) :
                $(".everyweek").css({ 'display': 'none' });
            $('select[name=repeat_type]').val(timeObj.repeat_type).change();
            $('select[name=weekday]').val(timeObj.weekday).change();
            setTimeout(function(){
                $('input[name=stop_date]').val(timeObj.stop_date).change();
                $('input[name=start_date]').val(timeObj.start_date).change();
                $('input[name=stop_time]').val(timeObj.stop_time).change();
                $('input[name=start_time]').val(timeObj.start_time).change();
            },1)
            break;
        default:
            console.error("检查modify(i)中的围栏类型railPolicyMod.policy_type")
    }
}


