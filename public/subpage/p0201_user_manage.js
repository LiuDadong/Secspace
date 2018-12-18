/*
 * ==================================================================
 *                          用户管理 user
 * ==================================================================
 */


    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限

    //用于交互时改变标题显示
    var subCaption = $('#subCaption').data('itemText', '用户').text('用户列表');
    
    //采用分页表格组件pagingTable初始化黑白名单列表
    var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
        jsonData: {
            'url': '/p/user/manage'
        },
        // theadHtml为表头类元素，第一个th用于存放全选复选框
        theadHtml: '<tr>\
                        <th style="width:5%;"></th>\
                        <th style="width:10%;">姓名</th>\
                        <th style="width:10%;">账号</th>\
                        <th style="width:12%;">邮箱</th>\
                        <th style="width:10%;">手机号</th>\
                        <th style="width:8%;">状态</th>\
                        <th style="width:10%;">激活设备</th>\
                        <th style="width:5%;">策略</th>\
                        <th style="width:10%;">用户组</th>\
                        <th style="width:5%;">标签</th>\
                        <th style="width:15%;">操作</th>\
                    </tr>',
        // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
        // to-edit、to-view表示要跳转的目标表单
        tbodyDemoHtml: '<tr>\
                            <td></td>\
                            <td item-key="name"></td>\
                            <td item-key="account"></td>\
                            <td item-key="email"></td>\
                            <td item-key="phone"></td>\
                            <td item-key="status"></td>\
                            <td>\
                                <a href="#" class="numInfo" data-url="/p/user/activeDevList">\
                                    <i item-key="dev_num.android" class="iconfont icon-android"></i>\
                                </a>\
                                <a href="#" class="numInfo" data-url="/p/user/activeDevList">\
                                    <i item-key="dev_num.ios" class="iconfont icon-ios"></i>\
                                </a>\
                            </td>\
                            <td>\
                                <a href="#" class="numInfo" data-url="/p/user/policyByUserId">\
                                    <span item-key="policy_num"></span>\
                                </a>\
                            </td>\
                            <td item-key="depart.name"></td>\
                            <td>\
                                <a href="#" class="numInfo" data-url="/p/user/userTagList">\
                                    <span item-key="tag"></span>\
                                </a>\
                            </td>\
                            <td><a todo="edit">编辑</a><a todo="view">查看</a><a todo="resetpw">重置密码</a></td>\
                        </tr>',
        //因不同需求需要个性控制组件表现的修正函数和增强函数
        fnGetItems: function (data) {  //必需   需要要显示的成员
            return data.user_list;
        },
        fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
            switch (k) {
                case 'status':
                    v = v == 1 ? '已激活' : '未激活';
                    break;
                case 'tag':
                    v = v.length;
                    break;
                case 'depart.name':
                    v = v===null?'未分组':v;
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
        addUrl: '/p/user/manage',
        editUrl: '/p/user/manage',
        addBtnTxt: '录入',
        editBtnTxt: '保存',
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
            prepareUserGroupTree();
            prepareUserTagList();
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
            $('#ckbSendEmail').prop('checked', false).change();
            //this.off('submit');
            var btnSubmit = this.find('input[type=submit]');
            switch (use) {
                case "add":
                    $('input:hidden[name=tag_id]').val('[]');
                    $('#wrapAccountInfo').show();
                    break;
                case "edit":
                    $('#wrapAccountInfo').hide();
                    break;
                case "view":
                    $('#wrapAccountInfo').hide();
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
        },
        beforeSubmit: function (arrKeyVal, $frm, ajaxOptions) {
            for (var i = 0; i < arrKeyVal.length; i++) {
                if (delKeyVal(arrKeyVal[i].name)) {
                    arrKeyVal.splice(i, 1);
                    i--;
                }
            }
            if ($frm.data('use') == 'add') {
                arrKeyVal.push({ name: 'flag', value: ~~$('#ckbSendEmail').prop('checked') });
            }
            function delKeyVal(key) {  //删掉不需要提交的数据
                switch (key) {
                    case 'depart':
                    case 'tag':
                    case 'xtreeitem':
                        return true;
                    case 'account':
                    case 'active_code':
                    case 'valid_time':
                        return $frm.data('use') !== 'add';
                    case 'id':
                    case 'userId':
                        return $frm.data('use') === 'add';
                    default:
                }
            }
            return true;
        }
    })
    
    var panel = $('#panel').Panel({
        objTargetTable: pagingTable,
        objTargetForm: multForm,
        objTargetCaption: subCaption,
        policy_type: 'device',
        deleteJson: {
            url: '/p/user/manage',
            userId: []
        },
        updateStatusUrl: '/p/org/changePolicyStatus',
        updateStatusJson: {
            url: '/p/org/changePolicyStatus',
            policy_type: 'device'
        }
    })
    var issuePane = $('#issuePane').IssuePane({
        objTargetTable: pagingTable,
        objTargetCaption: subCaption
    })



//表单补充
function prepareUserGroupTree(){
    var xtreeUserGroup = $('#xtreeUserGroup').XTree({
        multiple: false,
        hasRoot: false,
        relPTable: null
    });
    xtreeUserGroup.off().on('input change propertychange', function (e) {
        $('input:hidden[name=depart_id]').val($(this).find('li[data-gid]:has(input:radio:checked)').attr('data-gid')).change();
    });
    $('input:hidden[name=depart]').off().on('input change propertychange', function () {
        if ($(this).data('value')) {
            var timer,depart_id = $(this).data('value').id;;
            clearTimeout(timer);
            timer = setTimeout(function () {
                xtreeUserGroup.find('li:visible i.fa-minus').click();
                xtreeUserGroup.find('li[data-gid]').each(function(){
                    if($(this).attr('data-gid')==depart_id){
                        $(this).find('input').prop('checked', true).change();
                        $(this).parents('ul').prev('li').each(function () {
                            $(this).find('i.fa-plus').click();
                        });
                    }
                });
            }, 100)
        }
    });
}
function prepareUserTagList(){
    var xlistUserTag = $('#xlistUserTag').XList({
        relPTable: null,
        multiple: true
    });
    xlistUserTag.off().on('input change propertychange', function (e) {
        var tids = [];
        $(this).find('li[data-tid]:has(input:checked)').each(function () {
            tids.push($(this).attr('data-tid')*1);
        });
        $('input:hidden[name=tag_id]').val(JSON.stringify(tids)).change();
    });
    
    $('input[name=tag]').off().on('input change propertychange', function () {
        if ($(this).data('value')) {
            var tids = $(this).data('value').map(function (item) {
                    return item.id+'';
                });
            setTimeout(function () {
                xlistUserTag.find('li[data-tid]:has(input)').each(function(){
                    $(this).find('input').prop('checked',tids.indexOf($(this).attr('data-tid'))!==-1).change();
                })
            }, 100)
        }
    })
}
//模块特别情况处理
function importusers() {
    alert('敬请期待，请不要作无谓尝试！')
    return false;
    var cont = '<form id="addUserFile" class="form-inline" action="' + localStorage.getItem("appssec_url") + '/p/user/bulkLoad" enctype="multipart/form-data" autocomplete="off" role="form">\
            <input type="hidden" name="sid" value="' + $.cookie('sid') + '" />\
            <input type="hidden" name="org_id" value="' + $.cookie('org_id') + '" />\
            <div class="form-group" style="position:relative;">\
                <div class="progress progress-striped hidden" style="position:absolute;top:0;left:0;right:0;bottom:0;height:100%">\
                    <div class="progress-bar progress-bar-inverse" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 100%">\
                        <span class="sr-only">\
                            100% Complete (success)\
                        </span>\
                    </div>\
                </div>\
                <input id="file_data" name="file_data" type="file" class="form-control"/>\
            </div>\
            <a type="button" class="btn btn-default" href="'+ localStorage.getItem("appssec_url") + '/p/user/templateDownload?name=userTemplate.xls">下载模板</a>\
        </form>'
    //alertOpen(cont);
    $.dialog('confirm', {
        title: '批量导入',
        content: cont,
        confirmValue: '确认',
        confirm: function () {
            $('#addUserFile').submit();
        },
        confirmHide: false,
        cancelValue: '取消',
        cancel: function () {
            //btnDel.removeClass('disabled');
        }
    });

    $('#addUserFile').submit(function () {
        $(this).ajaxSubmit({
            resetForm: true,
            beforeSubmit: function () {
                $('.dialog-btn .dialog-btn-confirm').addClass('disabled');
                $('#addUserFile .progress').addClass('active').removeClass('hidden');
            },
            success: function (data) {
                $.handleECode(true, data);
                $('#addUserFile .progress').removeClass('active');
                setTimeout(() => {
                    $('.dialog-btn .dialog-btn-confirm').removeClass('disabled');
                    $('#addUserFile .progress').addClass('hidden');
                }, 2000);
            },
            error: function (err) {
                console.error(err);
                $('.dialog-btn .dialog-btn-confirm').removeClass('disabled');
                $('#addUserFile .progress').addClass('hidden');
            }
        });
        return false;
    });
}

function changeGroup() {
    var sel = $('#pagingTable').data('PagingTable').sel;
    if (sel.length === 0) {
        warningOpen('请选择要移动的用户！', 'danger', 'fa-bolt');
    } else {
        $.dialog('confirm', {
            width: 460,
            height: null,
            maskClickHide: true,
            title: "变更用户组",
            content: '<div id="xGrp" style="max-height:200px;overflow-y:auto;"></div>',
            hasBtn: true,
            hasClose: true,
            hasMask: true,
            confirmValue: '移动',
            confirm: function () {
                var liChecked=$('#xGrp').find('li[gident]:has(input:checked)');
                if(liChecked.length===0){
                    warningOpen('请选择要移至的用户组！', 'danger', 'fa-bolt');
                }else{
                    $('.dialog-btn-confirm').addClass('disabled');
                    $.actPost('/admin/user/chUserDepart', {
                        departId: liChecked.attr('gident'),
                        user_list: JSON.stringify(sel.map(function (item) {
                            return item.userId;
                        }))
                    }, function (data) {
                        $('.dialog-btn-confirm').removeClass('disabled');
                        if (data.rt == '0000') {
                            $.dialogClose();
                            pagingTable.PagingTable('update');
                        }
                    });
                }
            },
            confirmHide: false,
            cancelValue: '取消'
        });
        $('#xGrp').css({
            display: 'flex',
            justifycontent: 'center',
            width: '100%',
            marginLeft: '30px'
        }).XTree({
            multiple: false,
            hasRoot: false,
            relPTable: null
        });
    }
}
function addTagMember() {
    var sel = $('#pagingTable').data('PagingTable').sel;
    if (sel.length === 0) {
        warningOpen('请选择要添加标签的用户！', 'danger', 'fa-bolt');
    } else {
        $.dialog('confirm', {
            width: 460,
            height: null,
            maskClickHide: true,
            title: "请选择标签",
            content: '<div id="xTag" style="max-height:200px;overflow-y:auto;"></div>',
            hasBtn: true,
            hasClose: true,
            hasMask: true,
            confirmValue: '添加',
            confirm: function () {
                var tagIds=[];
                $('#xTag').find('li[tident]:has(input:checked)').each(function(){
                    tagIds.push($(this).attr('tident'))
                })
                if(tagIds.length===0){
                    warningOpen('请选择要添加的标签！', 'danger', 'fa-bolt');
                }else{
                    $('.dialog-btn-confirm').addClass('disabled');
                    $.actPost('/admin/user/chUserTag', {
                        tagId: JSON.stringify(tagIds), 
                        user_list: JSON.stringify(sel.map(function (item) {
                            return item.userId;
                        }))
                    }, function (data) {
                        $('.dialog-btn-confirm').removeClass('disabled');
                        if (data.rt == '0000') {
                            $.dialogClose();
                            pagingTable.PagingTable('update');
                        }
                    });
                }
            },
            confirmHide: false,
            cancelValue: '取消'
        });
        $('#xTag').css({
            display: 'flex',
            justifycontent: 'center',
            width: '100%',
            marginLeft: '30px'
        }).XList({
            multiple: true,
            relPTable: null
        });
    }
}
//生成随机激活码
function randomCode() {
    var n = 0,
        actpw = $('#active_code');
    var timer = setInterval(() => {
        actpw.val(strNum(6)).change();
        if (n++ > 20) {
            clearInterval(timer)
        }
    }, 10);
    function strNum(len) {
        var str = ''
        for (var i = 0; i < len; i++) {
            str += Math.floor(Math.random() * 10);
        }
        return str;
    }
}