/*
 * ==================================================================
 *                          应用黑白名单 appList
 * ==================================================================
 */
//用于交互时改变标题显示
var subCaption = $('#subCaption').data('itemText', '黑白名单').text('黑白名单列表');;

//采用分页表格组件pagingTable初始化黑白名单列表
var pagingTable = $('#pagingTable').PagingTable({
    jsonData:{'listurl':'/p/app/showAppList'},
    // theadHtml为表头类元素，第一个th用于存放全选复选框
    theadHtml: '<tr>\
                    <th></th>\
                    <th>名称</th>\
                    <th>黑/白名单</th>\
                    <th>状态</th>\
                    <th>创建者</th>\
                    <th>更新时间</th>\
                    <th>操作</th>\
                </tr>',
    // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
    // to-edit、to-view表示要跳转的目标表单
    tbodyDemoHtml: '<tr>\
                        <td></td>\
                        <td><span item-key="name"></span></td>\
                        <td><span item-key="list_type"></span></td>\
                        <td><span item-key="status"></span></td>\
                        <td><span item-key="operator"></span></td>\
                        <td><span item-key="modified"></span></td>\
                        <td><a toForm="edit">编辑</a><a toForm="view">查看</a></td>\
                    </tr>',
    //因不同需求需要个性控制组件表现的修正函数和增强函数
    fnGetItems: function (data) {  //必需   需要要显示的成员 
        return data.app_list;
    },
    fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
        switch (k) {
            case 'status':
                v = v == 1 ? '启用' : '禁用';  //例： item['status']的值为1时，在<span item-key="status"></span>中显示文本‘启用’，否则显示‘禁用’
                break;
            case 'platform':
                v = v == 0 ? 'iOS' : 'Android';
                break;
            case 'list_type':
                v = v == 'blacklist' ? '黑名单' : '白名单';
                break;
            default:
        }
        return v;
    },
    cbEdit: function (item) {   //点击修改、编辑按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
        multForm.usedAs('edit');
        $('input[name=list_type]:not(:checked)').prop('disabled', true);
    },
    cbView: function (item) {  //点击产看、详情按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
        multForm.usedAs('view');
    }
})

// 采用multForm组件初始化黑白名单多用途表单
var multForm = $('#multForm').MultForm({
    addAct: '/man/appList/add',
    addBtnTxt: '添加',
    editAct: '/man/appList/edit',
    editBtnTxt: '保存',
    cbSubmit: function (act) {  //提交编辑成功之后的回调
        switch (act) {
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
    objTargetForm: multForm
})
//页面初始化事件绑定
bindEvents();


function bindEvents() {
    var tblSel = pagingTable.data('PagingTable').sel;
    // 给操作面板中的按钮绑定事件(包括分页长度和搜索关键字实时刷新)
    panel.find('.btnAct').on('click', function () {
        activate(1);
    })

    panel.find('.btnUnact').on('click', function () {
        activate(0);
    })

    panel.find('.btnDel').on('click', function () {
        var ids = [], 
        needUnact = [];
        for (var i = 0; i < tblSel.length; i++) {
            var item = tblSel[i];
            ids.push(item.id);
            if (item.status == 1) {
                needUnact.push(item.name)
            }
        }
        if (ids.length > 0) {
            if (needUnact.length === 0) {
                bootbox.dialog({
                    title: '<i class="glyphicon glyphicon-fire danger"></i>',
                    message: '<p class="text-align-center">确认删除选中的应用吗？</p>',
                    className: "modal-darkorange",
                    buttons: {
                        success: {
                            label: "取消",
                            className: "btn-blue",
                            callback: function () {
                                //
                            }
                        },
                        "确认删除": {
                            className: "btn-danger",
                            callback: function () {
                                $.silentPost('/man/appList/del', {
                                    id: JSON.stringify(ids)
                                }, function (data) {
                                    switch (data.rt) {
                                        case '0000':
                                            pagingTable.PagingTable('refresh');
                                            warningOpen('删除成功！', 'primary', 'fa-check');
                                            break;
                                        case 5:
                                            toLoginPage();
                                            break;
                                        default:
                                            warningOpen('删除失败！', 'danger', 'fa-bolt');
                                    }
                                })
                            }
                        }
                    }
                });
            } else {
                warningOpen('请先禁用要删除的应用！', 'danger', 'fa-bolt');
            }

        }
    })

    /**
 * 绑定表单事件
 */
    //表单中名单类型list_type切换事件
    $('#multForm input:radio[name=list_type]').change(function () {
        var frm = $(this.form);
        if ($(this).prop('checked')) {
            switch ($(this).val()) {
                case 'blacklist':
                    frm.find('.form-group:has(input[name=phone_func])').addClass('hidden')
                        .find(':input').prop('disabled', true);
                    frm.find('.form-group:has(input[name=system_app])').addClass('hidden')
                        .find(':input').prop('disabled', true);
                    break;
                case 'whitelist':
                    frm.find('.form-group:has(input[name=phone_func])').removeClass('hidden')
                        .find(':input').prop('disabled', false);
                    frm.find('.form-group:has(input[name=system_app])').removeClass('hidden')
                        .find(':input').prop('disabled', false);
                    break;
                default:
                    console.error('input:radio[name=list_type]取值异常：' + $(this).val())
            }
        }
    })

    //查看及编辑应用名单
    $("button[ruletype]").off('click').on('click', function () {
        var tableBox = $(this).closest('.form-group').find('.appList_more_table'),
            table = tableBox.find('table'),
            tbAdd = table.find('tbody.tbAdd'),
            tbdemo = table.find('tbody.tbdemo').addClass('hidden'),
            rule_type = $(this).attr('ruletype');
        if (rule_type === 'phone') {
            table.data('rule_type', rule_type);
            table.data('txtShow', '通话应用');
        } else if (rule_type === 'system_app') {
            table.data('rule_type', rule_type);
            table.data('txtShow', '系统应用');
        } else {

        }

        //显示/隐藏添加应用行
        table.find('thead button.toggleAdd').off('click').on('click', function () {
            tbAdd.toggleClass('hidden');
        })
        //添加应用保存按钮
        tbAdd.find('input[data-name=package_name]').off().on('propertychange change input', function () {
            if ($.inArray($(this).val(), table.data('list')) == -1) {
                $(this).css('color', 'inherit').removeAttr('title');
                tbAdd.find('button.save').prop('disabled', false);
            } else {
                $(this).css('color', 'red').attr('title', '包名重复');
                tbAdd.find('button.save').prop('disabled', true);
            }
        })
        //添加应用保存按钮
        tbAdd.find('button.save').off().on('click', function () {
            var package_name = $(this).closest('tr').find('input[data-name=package_name]').val();
            $.silentPost('/man/appList/more/add', {
                rule_type: rule_type,
                package_name: package_name
            }, function (data) {
                switch (data.rt) {
                    case '0000':
                        tbAdd.find('input[data-name=package_name]').val('');
                        warningOpen('添加成功！', 'primary', 'fa-check');
                        tableRefresh(table);
                        break;
                    case 7:
                        warningOpen('包名重复！', 'primary', 'fa-check');
                        tableRefresh(table);
                        break;
                    default:
                        warningOpen('添加失败！', 'danger', 'fa-bolt');
                }
            })
        })
        //添加应用取消按钮
        tbAdd.find('button.cancel').off().on('click', function () {
            tbAdd.find('input').val('');
            tbAdd.addClass('hidden');
        })

        //删除应用按钮
        tbdemo.find('button.del').off().on('click', function () {
            var package_name = $(this).closest('tr').find('span.package_name').text();
            bootbox.dialog({
                message: '<p class="text-align-center">确认删除' + table.data('txtShow') + '<b>' + package_name + '</b>吗？</p>',
                title: '<i class="glyphicon glyphicon-fire danger"></i>',
                className: "modal-darkorange",
                buttons: {
                    success: {
                        label: "取消",
                        className: "btn-blue",
                        callback: function () {
                            //
                        }
                    },
                    "确认删除": {
                        className: "btn-danger",
                        callback: function () {
                            $.silentPost('/man/appList/more/del', {
                                rule_type: rule_type,
                                package_name: package_name
                            }, function (data) {
                                switch (data.rt) {
                                    case '0000':
                                        warningOpen('删除成功！', 'primary', 'fa-check');
                                        break;
                                    default:
                                        warningOpen('删除失败！', 'danger', 'fa-bolt');
                                }
                                tableRefresh(table);
                            })
                        }
                    }
                }
            });

        })

        // tableBox.toggleClass('hidden');
        tableBox.slideToggle();
        tableRefresh(table);
        // bootbox.dialog({
        //     message: $('#appList_more_table').html(),
        //     title: "应用名单",
        //     className: "modal-app-ctrlList",
        // });

    });

    //刷新电话或系统应用名单表格
    function tableRefresh(table) {
        var trhas = table.find('tbody.tbHas'),
            trdemo = table.find('tbody.tbdemo tr'),
            tbempty = table.find('tbody.tbEmpty');
        $.silentGet('/man/appList/more', { rule_type: table.data('rule_type') }, function (data) {
            var list;
            switch (data.rt) {
                case '0000':
                    list = data.data;
                    table.data('list', list);
                    if (list.length > 0) {
                        ('OK')
                        trhas.empty().removeClass('hidden');
                        tbempty.addClass('hidden');
                        for (var i = 0; i < list.length; i++) {
                            var tri = trdemo.clone(true);
                            tri.find('span.sort').text(i + 1);
                            tri.find('span.package_name').text(list[i]);
                            trhas.append(tri);
                        }
                    } else {
                        trhas.empty().addClass('hidden');
                        tbempty.removeClass('hidden');
                    }
                    break;
                default:
                    warningOpen('获取' + table.data('txtShow') + '名单失败！', 'danger', 'fa-bolt');
            }
        })
    }
    // 启用/禁用
    function activate(status) {
        if (tblSel.length > 0) {
            var ids = [];
            for (var i = 0; i < tblSel.length; i++) {
                ids.push(tblSel[i].id);
            }
            $.actPost('/man/appList/updateStatus', {
                flag: status,
                id: JSON.stringify(ids)
            }, function (data) {
                switch (data.rt) {
                    case '0000':
                        pagingTable.PagingTable('refresh');
                        break;
                    case '3009':
                        if (data.data[0].aim) {
                            $.dealRt3009(data.data);
                            var eleMdl = $('#mdlMsg');
                            eleMdl.find('.modal-body thead tr th').eq(0).html('名单名称');
                            eleMdl.find('.modal-body thead tr th').eq(1).html('正在被以下应用策略使用');
                            eleMdl.find('.modal-title').html('以下黑白名单暂无法禁用');
                            pagingTable.PagingTable('refresh');
                        }
                        break;
                    default:
                        
                }
            })
        } else {
            warningOpen('请选择要' + (status == 1 ? '启用' : '禁用') + '的应用！', 'danger', 'fa-bolt');
        }
    }
}












