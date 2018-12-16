/*
 * ==================================================================
 *                          客户端策略 appList
 * ==================================================================
 */


    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限

    //用于交互时改变标题显示
    var subCaption = $('#subCaption').data('itemText', '客户端策略').text('客户端策略列表');

    //采用分页表格组件pagingTable初始化黑白名单列表
    var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
        type: 'POST',
        jsonData: {
            url: '/p/policy/query',
            policy_type: 'customer'
        },
        // theadHtml为表头类元素，第一个th用于存放全选复选框
        theadHtml: '<tr>\
                    <th></th>\
                    <th>名称</th>\
                    <th>类型</th>\
                    <th>状态</th>\
                    <th>已应用/已下发</th>\
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
                                        <span class="text">本地创建</span>\
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
                        <td><a todo="edit">编辑</a><a todo="view">查看</a></td>\
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
                            v = '本地创建';
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
        cbEdit: function (item) {   //点击修改、编辑按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
            multForm.usedAs('edit');
            multForm.find('input[name=name]').attr('readonly', false);
        },
        cbView: function (item) {  //点击产看、详情按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
            multForm.usedAs('view');
        }
    }))


    // 采用multForm组件初始化黑白名单多用途表单
    var multForm = $('#multForm').MultForm({
        addUrl: '/p/policy/customerMan',
        addBtnTxt: '添加',
        editUrl: '/p/policy/customerMan',
        editBtnTxt: '保存',
        afterReset: function () {  //表单重置之后紧接着的回调
            //控制禁用客户端权限样式和行为
            // 获取客户端设置授权项
            var permissionItems = $(this).data('permissionItems');
            $(':input[data-for=permissionItems]').each(function () {
                $(this).prop('checked', ~~permissionItems[$(this).attr('name')] == 1)
                    .prop('disabled', ~~permissionItems[$(this).attr('name')] == -1);
            })

            //权限关联逻辑
            $('input:checkbox[on-on]').off().on("click", function (e) {
                var checkbox = $(this),
                    aName = checkbox.attr('on-on').split(' '),
                    aN = [], //存储当前关闭的关联复选框name
                    msg = '开启\"' + getTextByName(checkbox.attr('name')) + '\"将强制开启当前禁用的',
                    aUn = [],//存储当前未激活的关联复选框name
                    msgUn = '开启\"' + getTextByName(checkbox.attr('name')) + '\"还需要激活';

                for (var i = 0; i < aName.length; i++) {
                    if ($('input:checkbox[name=' + aName[i] + ']').prop('disabled')) {
                        aUn.push(aName[i]);
                    }
                    if (!$('input:checkbox[name=' + aName[i] + ']').prop('checked')) {
                        aN.push(aName[i]);
                    }
                }
                if (checkbox.prop('checked') && aUn.length != 0) {
                    e.preventDefault();
                    for (var i = 0; i < aUn.length; i++) {
                        if (i < aUn.length - 1) {
                            msgUn += ('\"' + getTextByName(aUn[i]) + '\"、');
                        } else {
                            msgUn += ('\"' + getTextByName(aUn[i]) + '\"。');
                        }
                    }
                    $.dialog('confirm', {
                        confirmValue: '去激活',
                        confirm: function () {
                            checkbox.prop('checked', false);
                            $('#sidebar a[href="/sub?pg=p0803_set_licence"]').click();
                        },
                        cancel: function () {
                            checkbox.prop('checked', false);
                        },
                        cancelValue: '取消',
                        title: '提示',
                        content: msgUn
                    });
                    return;
                }
                if (checkbox.prop('checked') && aN.length != 0) {
                    e.preventDefault();
                    for (var i = 0; i < aN.length; i++) {
                        if (i < aN.length - 1) {
                            msg += ('\"' + getTextByName(aN[i]) + '\"、');
                        } else {
                            msg += ('\"' + getTextByName(aN[i]) + '\",确认开启吗?');
                        }
                    }
                    $.dialog('confirm', {
                        confirmValue: '确认',
                        confirm: function () {
                            checkbox.prop('checked', true);
                            for (var i = 0; i < aN.length; i++) {
                                $('input[name=' + aN[i] + ']').prop('checked', true);
                            }
                        },
                        cancel: function () {
                            checkbox.prop('checked', false);
                        },
                        cancelValue: '取消',
                        title: '提示',
                        content: msg
                    });
                }
            });

            $('input:checkbox[off-off]').off().on("click", function (e) {
                var aName = $(this).attr('off-off').split(' '),
                    aN = [],
                    msg = '关闭\"' + getTextByName($(this).attr('name')) + '\"将强制关闭当前启用的';
                for (var i = 0; i < aName.length; i++) {
                    if ($('input:checkbox[name=' + aName[i] + ']').prop('checked')) {
                        aN.push(aName[i]);
                    }
                }
                if (!$(this).prop('checked') && aN.length != 0) {
                    e.preventDefault();
                    var checkbox = $(this);
                    for (var i = 0; i < aN.length; i++) {
                        if (i < aN.length - 1) {
                            msg += ('\"' + getTextByName(aN[i]) + '\"、');
                        } else {
                            msg += ('\"' + getTextByName(aN[i]) + '\",确认关闭吗?');
                        }
                    }
                    $.dialog('confirm', {
                        confirmValue: '确认',
                        confirm: function () {
                            checkbox.prop('checked', false);
                            for (var i = 0; i < aN.length; i++) {
                                $('input[name=' + aN[i] + ']').prop('checked', false);
                            }
                        },
                        cancel: function () {
                            checkbox.prop('checked', true);
                        },
                        cancelValue: '取消',
                        title: '提示',
                        content: msg
                    });
                }
            });
            //根据input的name属性获取label的文本，用于对话框显示信息的拼接
            function getTextByName(n) {
                return $('input:checkbox[name=' + n + ']').closest("div").prev('label').text();
            }
        },
        cbSubmit: function (act) {  //提交编辑成功之后的回调
            switch (act) {
                case 'add':
                    pagingTable.PagingTable('refresh');
                    break;
                case 'edit':
                    pagingTable.PagingTable('refresh');
                    break;
                default:
                    pagingTable.PagingTable('refresh');
            }
        }
    })

    var panel = $('#panel').Panel({
        objTargetTable: pagingTable,
        objTargetForm: multForm,
        objTargetCaption: subCaption,
        policy_type: 'customer',
        updateStatusUrl: '/p/policy/chCusSta'
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

    // 获取客户端设置授权项
    $.silentGet('/getPermissions', { url: '/p/org/getPermissionItems' }, function (data) {
        var permissionItems = data.permissionItems;
        multForm.data('permissionItems', permissionItems);
        $(':input[data-for=permissionItems]').each(function () {
            var key = $(this).attr('name'),
                val = permissionItems[key];
            $(this).toggleClass('forbidden', ~~val == -1)
                .closest('.form-group').toggleClass('forbidden', ~~val == -1);
            if (~~val == -1) {
                $(this).prop('checked', false).prop('disabled', true);
            }
        });
    })

    //颜色选择器初始化
    $('#font_color').attr('readonly', 'readonly').css({
        cursor: 'auto'
    }).colpick({
        layout: 'rgbhex',
        submit: 0,
        //colorScheme:'dark',
        onChange: function (hsb, hex, rgb, ele, bsc) {
            // hsb -- object (eg. {h:0, s:100, b:100})
            // hex -- string (with no #)
            // rgb -- object(eg. {r:255, g:0, b:0})
            // ele -- element, the parent element on which colorpicker() was called. Use it to modify this parent element on change (see first example below).
            // bsc -- number(1,0)-bySetColor:if 1, the onChange callback was fired by the colpickSetColor function and not by the user changing the color directly in the picker.
            $(ele).val(hex).css({
                backgroundColor: '#' + hex,
                color: '#' + hex
            });
            // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
        }

    }).on('input change propertychange', function () {
        if (this.value.length == 6) {
            $(this).colpickSetColor(this.value);
        }
    });
    $('#watermarkControl').on('change propertychange input', function () {
        $(this).closest('.form-group').nextAll('.form-group:has(:input[data-for=watermark])')
            .find(':input').prop('disabled', !$(this).prop('checked'));
    })
