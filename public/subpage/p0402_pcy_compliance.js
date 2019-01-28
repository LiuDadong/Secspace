/*
 * ==================================================================
 *                          合规策略 compliance
 * ==================================================================
 */


applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限


//用于交互时改变标题显示
var subCaption = $('#subCaption').data('itemText', '合规策略').text('合规策略列表');

//采用分页表格组件pagingTable初始化列表
var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
    type:'POST',
    jsonData: {
        url: '/p/policy/query',
        policy_type: 'complicance'
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

// 采用multForm组件初始化多用途表单
var multForm = $('#multForm').MultForm({
    addUrl: '/p/policy/comPolicyMan',
    editUrl: '/p/policy/comPolicyMan',
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
                complicance_item.lost_day = ~~$('input[name=lost_day]').val();
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
                url:'/p/policy/comPolicyMan',
                name: $('input[name=name]').val(),
                leave:$('input[name=leave]').prop('checked') ? 1 : 0,
                delay: $('input[name=delay]').val(),
                violation_limit: JSON.stringify(violation_limit),
                complicance_item: JSON.stringify(complicance_item),
                policy_type: 'complicance'
            };
            switch (act) {
                case 'add':
                    url = '/common/org_add';
                    actInfo = '添加';
                    break;
                case 'edit':
                    url = '/common/mod';
                    actInfo = '修改并下发'
                    postData['id'] = ~~$('input[name=id]').val();
                    break;
                default:
                    url = '/common/org_add';
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
    cbAfterSuccess: function (use) {  //提交编辑成功之后的回调
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
    policy_type:'compliance',
    updateStatusUrl: '/p/policy/chComPolicySta'
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
    $('input[name=leave]').prop('checked',item.leave=='1');
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
    eleCompType.change();

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
            wrap_lost_day = $(".has-unit:has(input[name=lost_day])"),
            valid_title = $(".valid_title"),
            valid_item = $(".valid_item");
        if ($(this).val() === 'sys_low') {
            os_version.show();
        } else {
            os_version.hide();
        }
        if ($(this).val() === 'lost_contact') {
            wrap_lost_day.show();
        } else {
            wrap_lost_day.hide();
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

}

