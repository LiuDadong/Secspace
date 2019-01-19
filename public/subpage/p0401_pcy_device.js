/*
 * ==================================================================
 *                          设备策略 devpolicy
 * ==================================================================
 */

applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限


//用于交互时改变标题显示
var subCaption = $('#subCaption').data('itemText', '设备策略').text('设备策略列表');

//采用分页表格组件pagingTable初始化黑白名单列表
var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
    type: 'POST',
    jsonData: {
        url: '/p/policy/query',
        policy_type: 'device'
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
                    <th>更新时间</th>\
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
                switch (v) {
                    case 'NAV':
                        v = '本级创建';
                        break;
                    case 'PUB':
                        v = '上级发布';
                        break;
                    case 'ISS':
                        v = '上级下发';
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
}));

// 采用multForm组件初始化多用途表单
var multForm = $('#multForm').MultForm({
    addUrl: '/p/policy/deviceMan',
    editUrl: '/p/policy/deviceMan',
    editBtnTxt: '保存并下发',
    afterReset: function () {  //表单重置之后紧接着的回调
        //控制禁用客户端权限样式和行为
        // 获取客户端设置授权项
        var permissionItems = $(this).data('permissionItems');
        $(':input[data-for=permissionItems]').each(function () {
            $(this).prop('checked', ~~permissionItems[$(this).attr('name')] == 1)
                .prop('disabled', ~~permissionItems[$(this).attr('name')] == -1);
        })
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
        this.off('submit');
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
        pagingTable.PagingTable('refresh');
    }
})

var panel = $('#panel').Panel({
    objTargetTable: pagingTable,
    objTargetForm: multForm,
    objTargetCaption: subCaption,
    policy_type: 'device',
    updateStatusUrl: '/p/policy/chPolicySta'
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
    hasIssSubBtn: 1,
    hasPubSubBtn: 1,
    hasBackBtn: 1,
    hasSearchIpt: 0
})


//模块特别情况处理
$('.need-init').each(function () {
    $(this).plugInit();
});
$('input[name=camera]').on('click', function () {
    if ($(this).prop('checked')) {
        $('input[name=camera_control]').prop('checked', true)
    }
})
$('input[name=camera_control]').on('click', function () {
    if (!$(this).prop('checked')) {
        $('input[name=camera]').prop('checked', false)
    }
})



// 添加
function add() {
    reset();
    $('.policylist, .viewbtn').css({ 'display': 'none' });
    $('.policyadd, .addwifibtn').css({ 'display': 'block' });
    $('.modbtn').addClass('hidden');
    $('.addbtn').removeClass('hidden');
    $('.addpolicy').css({ 'display': 'inline-block' });
    $('select[name=position_strategy],select[name=passwd_type]').val(1);
    $('select[name=pw_min_len]').val(6);
    $('select[name=pw_fail_count], select[name=available_time]').val(0);
    $('.form-group:has(.limit_apps.append-box)').addClass('hidden');
}

function reset() {
    $('.policyadd :input').val('');
    $('.policyadd select').val('');
    $('.policyadd input:checkbox').prop("checked", false).prop("disabled", false);
    $('.need-init').each(function () {
        $(this).plugInit();
    });
}


//获取策略提交数据
function getPolicyPostData(act) {
    return {
        url: '/p/policy/deviceMan',
        policy_type: 'device',
        name: $('input[name=name]').val(),
        leave: $('input[name=leave]').prop('checked') ? 1 : 0,
        position_strategy: $('select[name=position_strategy]').val(),
        dev_limit: JSON.stringify({
            camera: $('#camera').prop('checked') ? 1 : 0,
            camera_control: $('#camera_control').prop('checked') ? 1 : 0,
            wifi: $('#wifi').prop('checked') ? 1 : 0,
            recording: $('#recording').prop('checked') ? 1 : 0,
            bluetooth: $('#bluetooth').prop('checked') ? 1 : 0,
            gps: $('#gps').prop('checked') ? 1 : 0,
            screenshot: $('#screenshot').prop('checked') ? 1 : 0,
            setfactory: $('#setfactory').prop('checked') ? 1 : 0,
            message: $('#message').prop('checked') ? 1 : 0,
            phone: $('#phone').prop('checked') ? 1 : 0,
            space_only: $('#space_only').prop('checked') ? 1 : 0,
        }),
        dev_security: JSON.stringify({
            pw_min_len: $('select[name=pw_min_len]').val(),
            passwd_type: $('select[name=passwd_type]').val(),
            pw_fail_count: $('select[name=pw_fail_count]').val(),
            available_time: $('select[name=available_time]').val(),
        }),
        vpnlimit: JSON.stringify({
            control: $('input[name=control]').prop('checked') ? 1 : 0,
            limit_apps: $('.limit_apps.append-box input[type=hidden][name=limit_apps]').data('arrData')
        }),
        wifi: JSON.stringify({
            status: $('input[name=status]').prop('checked') ? 1 : 0,
            wifi: $('.wifi.append-box input[type=hidden][name=wifi]').data('arrData')
        })
    };
}

// 提交添加策略
function add_policy() {
    if (!$('input[name=name]').val()) {
        warningOpen('请填写策略名称！', 'danger', 'fa-bolt');
        return;
    }
    $.actPost('/common/org_add', getPolicyPostData(), function (data) {
        if (data.rt == '0000') {
            multForm.find('.btnBack').click();
        }
    });
}

// 编辑提交
function mod_policy() {
    if (!$('input[name=name]').val()) {
        warningOpen('请填写策略名称！', 'danger', 'fa-bolt');
        return;
    }
    var postData = getPolicyPostData();
    postData['id'] = $('input[name=policyid]').val() * 1;
    $.actPost('/common/mod', postData, function (data) {
        if (data.rt == '0000') {
            multForm.find('.btnBack').click();
        }
    }, '修改', '策略');
}




// 编辑
function showItem(item) {
    $('input[name=policyid]').val(item.id);
    $('input[name=name]').val(item.name).attr('readonly', false);
    $('input[name=leave]').prop('checked', item.leave == 1);
    $('select[name=position_strategy]').val(item.position_strategy);
    //锁屏策略
    $('select[name=pw_min_len]').val(item.dev_security.pw_min_len);
    $('select[name=passwd_type]').val(item.dev_security.passwd_type);
    $('select[name=pw_fail_count]').val(item.dev_security.pw_fail_count);
    $('select[name=available_time]').val(item.dev_security.available_time);
    //限制策略
    $('#gps').prop('checked', item.dev_limit.gps == 1);

    $('#camera').prop('checked', item.dev_limit.camera == 1);
    $('#camera_control').prop('checked', item.dev_limit.camera_control == 1);
    $('#bluetooth').prop('checked', item.dev_limit.bluetooth == 1);
    $('#recording').prop('checked', item.dev_limit.recording == 1);
    $('#wifi').prop('checked', item.dev_limit.wifi == 1);
    // $('#mobile_data').prop('checked', item.dev_limit.mobile_data == 1);
    $('#screenshot').prop('checked', item.dev_limit.screenshot == 1);
    $('#setfactory').prop('checked', item.dev_limit.setfactory == 1);
    $('#message').prop('checked', item.dev_limit.message == 1);
    $('#phone').prop('checked', item.dev_limit.phone == 1);
    $('#space_only').prop('checked', item.dev_limit.space_only == 1);

    // 网络策略
    if (item.vpnlimit) {
        $('input[name=control]').prop('checked', item.vpnlimit.control == 1);
        $('.form-group:has(.limit_apps.append-box)')
            .find('input[type=hidden][name=limit_apps]')
            .trigger('data', { arrData: item.vpnlimit.limit_apps });
    }

    // wifi策略
    if (item.wifi) {
        $('input[name=status]').prop('checked', item.wifi.status == 1);
        $('.form-group:has(.wifi.append-box)')
            .find('input[type=hidden][name=wifi]')
            .trigger('data', { arrData: item.wifi.wifi });
    }

}

