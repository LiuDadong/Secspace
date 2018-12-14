
    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限
    
    var jm = new orgMind('admin', {
        container: 'jsmind_container',   // id of the container
        editable: false, // you can change it in your opts
        view: {
            hmargin: 20,
            vmargin: 10,
            line_width: 1,
            line_color: '#000'
        },
        layout: {
            hspace: 20,
            vspace: 10,
            pspace: 12
        }
    });

    $('#jsmind_container').find('jmnodes').click();
    /*
     * ==================================================================
     *                          机构管理员
     * ==================================================================
     */

    //用于交互时改变标题显示
    var subCaption = $('#subCaption').data('itemText', '业务管理员').text('业务管理员列表');

    //采用分页表格组件pagingTable初始化黑白名单列表
    var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
        paging: false,
        jsonData: { 'url': '/p/org/adminMan' },
        // theadHtml为表头类元素，第一个th用于存放全选复选框
        theadHtml: '<tr>\
                    <th></th>\
                    <th>账号</th>\
                    <th>名称</th>\
                    <th>状态</th>\
                    <th>责任机构</th>\
                    <th>手机号</th>\
                    <th>创建者</th>\
                    <th>创建时间</th>\
                    <th style="width:18%;">操作</th>\
                </tr > ',
        // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
        // to-edit、to-view表示要跳转的目标表单
        tbodyDemoHtml: '<tr>\
                        <td></td>\
                        <td class="ellipsis" item-key="account"></td>\
                        <td class="ellipsis" item-key="name"></td>\
                        <td class="ellipsis" item-key="status"></td>\
                        <td class="ellipsis" item-key="orgName"></td>\
                        <td class="ellipsis" item-key="phone"></td>\
                        <td class="ellipsis" item-key="creator"></td>\
                        <td class="ellipsis" item-key="created_time"></td>\
                        <td class="ellipsis"><a toForm="edit">编辑</a><a toForm="view">查看</a><a onclick="resetAdminPW(this)">重置密码</a></td>\
                    </tr>',
        //因不同需求需要个性控制组件表现的修正函数和增强函数
        fnGetItems: function (data) {  //必需   需要要显示的成员
            var nd = jm.get_selected_node();
            return nd === null
                ? data.adminInfo
                : data.adminInfo.filter(function (item) {
                    return item.orgCode === nd.data.orgCode;
                });
        },
        fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
            switch (k) {
                case 'status':
                    v = v == 1 ? '启用' : '禁用';  //例： item['status']的值为1时，在<span item-key="status"></span>中显示文本‘启用’，否则显示‘禁用’
                    break;
                case 'phone':
                    v = v ? v : '暂未绑定手机';  //例： item['status']的值为1时，在<span item-key="status"></span>中显示文本‘启用’，否则显示‘禁用’
                    break;
                default:
            }
            return v;
        },

        cbEdit: function (item) {   //点击修改、编辑按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
            multForm.usedAs('edit');
        },
        cbView: function (item) {  //点击产看、详情按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
            multForm.usedAs('view');
        }
    }))


    // 采用multForm组件初始化黑白名单多用途表单
    var multForm = $('#multForm').MultForm({
        addUrl: '/p/org/adminMan',
        addBtnTxt: '添加',
        editUrl: '/p/org/adminMan',
        editBtnTxt: '保存',
        afterReset: function () {  //表单重置之后紧接着的回调
            //
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
            switch (use) {
                case "add":
                    $('input.same').prop('disabled', false).closest('.form-group').show();
                    $('input[name=account]').prop('readonly', false);
                    $('.form-group:has(input[type=password])').removeClass('hidden');
                    $('input[name=org_id]').val($('#jsmind_container jmnode.selected').attr('nodeid'));
                    break;
                case "edit":
                case "view":
                    $('input[name=account]').prop('readonly', true);
                    $('.form-group:has(input[type=password])').addClass('hidden');
                    $('input.same').prop('disabled', true).closest('.form-group').hide();
                    break;
                default:
            }
            $.silentPost('/common/adminRoleInfo', {}, function (data) {
                var selectRoles = $('#selectRoles').empty().css({ 'max-height': '200px' });
                if (data.rt === "0000") {
                    var roles = data.query_adm_role;
                    if (roles.length > 0) {
                        var numAct = 0;
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i].status == '1') {
                                numAct++;
                                selectRoles.append($('<option value="' + roles[i].id + '">' + roles[i].name + '</option>').css('cursor', 'pointer'))
                            } else {
                                selectRoles.append($('<option class="disabled" value="' + roles[i].id + '">' + roles[i].name + '</option>'))
                            }
                        }
                        if (numAct == 0) {
                            selectRoles.html('<option class="disabled" value="0">角色均已禁用</option>');
                        }
                        if (numAct > 5) {
                            selectRoles.css('height', numAct * 12 + 'px')
                        }

                    } else {
                        selectRoles.html('<option class="disabled" value="0">请先创建角色</option>');
                    }

                } else {
                    selectRoles.html('<option value="0">请先创建角色</option>');
                }
                if (item && item.roleId) {
                    $('#selectRoles').val(item.roleId).change();
                }
            }, '获取', '角色信息');
        },
        beforeSubmit: function (arrKeyVal, $frm, ajaxOptions) {
            for (var i = 0; i < arrKeyVal.length; i++) {
                if (delKeyVal(arrKeyVal[i].name)) {
                    arrKeyVal.splice(i, 1);
                    i--;
                }
            }
            function delKeyVal(key) {  //删掉不需要提交的数据
                switch (key) {
                    case 'pw':
                        return $frm.data('use') !== 'add';
                    case 'id':
                    case 'userId':
                        return $frm.data('use') === 'add';
                    case 'org_id':
                        return $frm.data('use') === 'edit';
                    default:
                }
            }
            return true;
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
        defaultHtmlPullRight: '<div class="input-group">\
                                <span class="input-icon">\
                                    <input id="iptKeyword" type="text" class="form-control input-sm" autocomplete="off" placeholder="请输入搜索关键字">\
                                    <i class="glyphicon glyphicon-search blue"></i>\
                                </span>\
                            </div>',
        deleteJson: {
            account: [],
            url: '/p/org/adminMan',
        },
        updateStatusJson: {
            account: [],
            url: '/p/org/chAdmStatus'
        }
    })



    //fnTree事件绑定
    var fnTree = $('#fnTree');

    fnTree.find('li input').on('input propertychange change', function () {

        $(this).closest('li').next('ul').find('input').prop('checked', $(this).prop('checked'));  //改变本级选定状态，所有下级跟着改变

        $(this).parents('ul').prev('li').each(function () {
            $(this).find('input').prop('checked', $(this).next('ul').find('input:checked').length > 0);  //根据下级是否有勾选的功能点，判断本级是否勾选
        });

        if ($(this).attr('value') && $(this).prop('checked')) {
            $(this).closest('ul').find('input[value=acc]').prop('checked', true);   //勾选任意功能点,默认选中查看权限
        }
        getRolefns();
    });
    fnTree.find('li input[value=acc]').on('input propertychange change', function () {
        if (!$(this).prop('checked')) {
            $(this).closest('li').nextAll('li').find('input:checked').click();
        }
    });

    fnTree.find('li i.fa').on('click', function () {
        $(this)
            .toggleClass('fa-plus')
            .toggleClass('fa-minus')
            .closest('li').toggleClass('open');
    })

    $('#allcheck').on('click', function () {
        $(this).toggleClass('blue');
        fnTree.find('input').prop('checked', $(this).hasClass('blue'));
        getRolefns();
    });

    $('#tgltree').on('click', function () {
        $(this).toggleClass('blue');
        if ($(this).hasClass('blue')) {
            fnTree.find('i.fa.fa-plus').click();
        } else {
            fnTree.find('i.fa.fa-minus').click();
        }
    });
    getRolefns();
    function getRolefns() {
        var iptallfns = fnTree.find('input:hidden[all-fns]'),
            json = {};
        iptallfns.each(function () {
            var mdlkey = $(this).attr('mdl-key'),
                allfns = $(this).attr('all-fns'),
                selfns = '';
            $(this).nextAll('li:has(input:checked)').each(function () {
                selfns += ('-' + $(this).find('input').attr('value'));
            });
            if (selfns !== '') {
                selfns = selfns.substr(1)
                json[mdlkey] = (allfns === selfns ? 1 : selfns);
            }
        })

        fnTree.find('input:hidden[name=function]').val(JSON.stringify(json));
    }





    $('#selectRoles').on('input propertychange change', function () {
        $('input[name=roleId]').val(JSON.stringify($(this).val().map(Number)));
    })

    function resetAdminPW(e) {
        var item = $(e).closest('tr').data('item');
        if (item.status == 0) {
            warningOpen('请先启用该管理员！', 'danger', 'fa-bolt');
        } else {
            $.dialog('confirm', {
                width: 500,
                height: null,
                autoSize: true,
                maskClickHide: true,
                title: "修改管理员密码",
                content: '<form id="frmResetPW" class="form-horizontal form-bordered" role="form" method="post" style="margin-right:-40px;">\
                        <input type="hidden" name="userId" />\
                        <div class="form-group">\
                            <label for="passwd" class="col-sm-2 control-label no-padding-right">新密码</label>\
                            <div class="col-sm-10">\
                                <input type="password" class="form-control require" id="passwd" name="passwd" ctrl-regex="password" placeholder="请输入新密码">\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label for="confirmpw" class="col-sm-2 control-label no-padding-right">确认密码</label>\
                            <div class="col-sm-10">\
                                <input type="password" class="form-control" id="confirmpw" same-with="passwd" autocomplete="off" placeholder="请再次输入密码">\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <div class="col-sm-2  col-sm-offset-4">\
                                <button type="button" onclick="$.dialogClose()" class="btnBack btn btn-default">返回</button>\
                            </div>\
                            <div class="col-sm-2 col-sm-offset-1">\
                                <input type="submit" class="btn btn-primary" disabled="">\
                            </div>\
                        </div>\
                    </form>',
                hasBtn: false,
                hasClose: true,
                hasMask: true,
                confirmValue: '确认',
                confirm: function () {
                    frmResetPW.submit();
                },
                confirmHide: true,
                cancelValue: '取消'
            });

            var frmResetPW = $('#frmResetPW').MultForm({
                editUrl: '/p/org/resetAdmPw',
                editBtnTxt: '确认',
                editAct: '/common/adminpw/reset',
                afterUsed: function (use) {
                    frmResetPW.find('input[name=url]').remove();
                },
                cbSubmit: function (use) {  //提交编辑成功之后的回调
                    $.dialogClose();
                }
            });

            $('#frmResetPW').data('item', {
                userId: item.userId
            })
            frmResetPW.usedAs('edit');
            $('#frmResetPW').parent().css({
                display: 'block'
            })
        }

    }