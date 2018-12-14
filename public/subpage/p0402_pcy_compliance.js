/*
 * ==================================================================
 *                          合规策略 compliance
 * ==================================================================
 */

//用于交互时改变标题显示
var subCaption = $('#subCaption').data('itemText', '合规策略').text('合规策略列表');

//采用分页表格组件pagingTable初始化黑白名单列表
var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
    jsonData: {
        'listurl': '/p/org/listComPolicy',
        policy_type: 'complicance'
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
                        v = '围栏策略';
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
    addUrl: '/p/org/uploadPolicy',
    editUrl: '/p/org/updatePolicy',
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
        multForm.find('input[name=name]').attr('readonly', false);
        btnSubmit.off().on('click', function (e) {
            e.preventDefault();
            policying(use);
            return false;
        })
        switch (use) {
            case "add":
                break;
            case "edit":
            case "view":
                showItem(item);
                break;
            default:
        }
        // 提交添加策略
        function policying() {
            var act = arguments[0];
            var url = '', actInfo = '';

            var complicance_item = {
                rooted: 0,
                sim: 0,
                sys_low: 0,
                os_version: 0,
                lost_contact: 0,
                lost_day: 0,
                power_low: 0,
                storage_lack: 0,
                strategy: 0
            };
            if ($('select[name=os_version]').is(':visible')) {
                complicance_item.os_version = ~~$('select[name=os_version]').val();
            }
            if ($('input[name=lost_day]').is(':visible')) {
                complicance_item.os_version = ~~$('input[name=lost_day]').val();
            }
            for (k in complicance_item) {
                if (k == $('select[name=compliance_type]').val()) {
                    complicance_item[k] = 1;
                }
            }


            var violation_limit = {
                camera: 0,
                access_secspace: 0,
                enterprise_data: 0,
                all_data: 0,
                sd: 0,
                message: 0,
                phone: 0,
            };
            var valid_item = $('.valid_item');
            for (k in violation_limit) {
                violation_limit[k] = ~~valid_item.find('input[name=' + k + ']:visible').prop('checked');
            }

            var eleMesg = valid_item.find('input[name=mesg]'),
                mesg = eleMesg.prop('checked'),
                eleEmail = valid_item.find('input[name=email]'),
                email = eleEmail.prop('checked');
            violation_limit["alarm"] = (mesg && email) ? 3 : (mesg ? 1 : (email ? 2 : 0));
            var postData = {
                name: $('input[name=name]').val(),
                delay: $('input[name=delay]').val(),
                violation_limit: JSON.stringify(violation_limit),
                complicance_item: JSON.stringify(complicance_item),
                policy_type: 'complicance'
            };
            switch (act) {
                case 'add':
                    url = '/man/complicance/add_policy';
                    actInfo = '添加';
                    break;
                case 'edit':
                    url = '/man/complicance/updatePolicy';
                    actInfo = '修改并下发'
                    postData['id'] = ~~$('input[name=id]').val();
                    break;
                default:
                    url = '/man/complicance/add_policy';
            }
            if (postData.name == '') {
                warningOpen('请输入名称！', 'danger', 'fa-bolt');
                return false;
            } else if (postData.delay == '') {
                warningOpen('请输入延迟时间！', 'danger', 'fa-bolt');
                return false;
            } else if (violation_limit["alarm"] == 0 && eleMesg.is(':visible')) {
                warningOpen('违规告警至少选一项！', 'danger', 'fa-bolt');
                return false;
            } else {
                $.actPost(url, postData, function (data) {
                    if (data.rt == '0000') {
                        $('#multForm .btnBack').click();
                    }
                }, actInfo);
            }
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
    policy_type: 'complicance',
    deleteJson: {
        url: '/p/org/deleteComPolicy',
        policy_type: 'complicance',
        id: []
    },
    updateStatusUrl: '/p/org/changeComPolicyStatus',
    updateStatusJson: {
        url: '/p/org/changeComPolicyStatus',
        policy_type: 'complicance'
    }
})

var issuePane = $('#issuePane').IssuePane({
    objTargetTable: pagingTable,
    objTargetCaption: subCaption
})



// 违规限制选择
function checkthis(e) {
    if ($(e).attr("checked")) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked", false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked", true);
    }
}




// 编辑
function showItem(item) {
    $('input[name=id]').val(item.id);
    $('input[name=name]').val(item.name);
    $('input[name=delay]').val(item.delay);

    if (item.complicance_item.os_version != 0) {
        $('select[name=os_version]').val(item.complicance_item.os_version)
        delete item.complicance_item.lost_contact;
    }
    if (item.complicance_item.lost_day != 0) {
        $('input[name=lost_day]').val(item.complicance_item.lost_day)
        delete item.complicance_item.lost_day;
    }

    var eleCompType = $('select[name=compliance_type]');
    for (k in item.complicance_item) {
        if (k !== 'lost_day' && k !== 'os_version') {
            if (item.complicance_item[k]) {
                eleCompType.val(k);
            }
        }
    }
    eleCompType.change()

    var alarm = item.violation_limit.alarm;
    $('input[name=mesg]').prop('checked', alarm == 3 || alarm == 1);
    $('input[name=email]').prop('checked', alarm == 3 || alarm == 2);

    for (k in item.violation_limit) {
        if (k !== 'alarm') {
            $('input[name=' + k + ']').prop('checked', item.violation_limit[k])
        }
    }
}




//模块特别情况处理
fnSpecialInit();

function fnSpecialInit() {

    $("select[name=compliance_type]").change(function () {
        var os_version = $("select[name=os_version]"),
            lost_day = $("input[name=lost_day]"),
            valid_title = $(".valid_title"),
            valid_item = $(".valid_item");
        if ($(this).val() === 'sys_low') {
            os_version.show();
        } else {
            os_version.hide();
        }
        if ($(this).val() === 'lost_contact') {
            lost_day.show();
        } else {
            lost_day.hide();
        }
        switch ($(this).val()) {
            case 'lost_contact':
                showValidItems(['mesg','camera','access_secspace', 'enterprise_data', 'all_data']);
                break;
            case 'power_low':
            case 'storage_lack':
            case 'strategy':
                showValidItems(['mesg']);
                break;
            default:
                showValidItems(1);
        }
        function showValidItems(arr) {
            switch (arr) {
                case 0:
                    valid_title.hide();
                    valid_item.hide();
                    break;
                case 1:
                    valid_title.show();
                    valid_item.show();
                    break;
                default:
                    valid_item.hide();
                    for (i in arr) {
                        valid_item.find(':input[name=' + arr[i] + ']')
                            .closest('.valid_item').show();
                    }
            }
        }
    });
    $('#delay').keyup(function () {
        var c = $(this);
        var temp_amount = c.val().replace(/[^\d]/g, '');
        // 判断范围
        temp_amount = temp_amount < 1 ? 1 : temp_amount > 72 ? 72 : temp_amount;
        $(this).val(temp_amount);
    });

}
