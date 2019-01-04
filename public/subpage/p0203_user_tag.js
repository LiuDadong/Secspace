/*
 * ==================================================================
 *                          标签 tag
 * ==================================================================
 */
    //用于交互时改变标题显示
    var subCaption = $('#subCaption').data('itemText', '用户标签').text('用户标签列表');

    //采用分页表格组件pagingTable初始化黑白名单列表
    var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
        type: 'GET',
        jsonData: {
            url: '/p/tag/manage'
        },
        // theadHtml为表头类元素，第一个th用于存放全选复选框
        theadHtml: '<tr>\
                <th></th>\
                <th>名称</th>\
                <th>类型</th>\
                <th>状态</th>\
                <th>用户关联数量</th>\
                <th>创建者</th>\
                <th>创建时间</th>\
                <th>操作</th>\
            </tr>',
        // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
        // to-edit、to-view表示要跳转的目标表单
        tbodyDemoHtml: '<tr>\
                    <td></td>\
                    <td><span item-key="name"></span></td>\
                    <td><span item-key="tag_type"></span></td>\
                    <td><span item-key="status"></span></td>\
                    <td>\
                        <a onclick="dialogForMoveUser(this)" href="#">\
                            <span item-key="user_num"></span>\
                        </a>\
                    </td>\
                    <td><span item-key="creator"></span></td>\
                    <td><span item-key="create_time"></span></td>\
                    <td><a todo="edit" title="编辑"><i class="fa fa-edit"></i></a><a todo="view" title="查看"><i class="fa fa-eye"></i></a></td>\
                </tr>',
        //因不同需求需要个性控制组件表现的修正函数和增强函数
        fnGetItems: function (data) {  //必需   需要要显示的成员
            return data.tag_list;
        },
        fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
            switch (k) {
                case 'status':
                    v = v == 1 ? '正常' : '禁用';
                    break;
                case 'tag_type':
                    switch (v) {
                        case 0:
                            v = '静态标签';
                            break;
                        case 1:
                            v = '动态标签';
                            break;
                        default:
                            v = '未知标签';
                        }
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
        addUrl: '/p/tag/manage',
        addBtnTxt: '添加',
        editUrl: '/p/tag/manage',
        editBtnTxt: '保存',
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
        objTargetCaption: subCaption
    })





// 用户标签内外用户移动
function dialogForMoveUser(e) {
    var item = $(e).closest('tr').data('item'),
        cont = '<div style="display:flex;">\
            <input type="hidden" name="tagId" />\
            <div style="width:45%">\
                    <form id="pnlForInGroup" class="form-inline pnl" role="form" onkeydown="if(event.keyCode==13){return false;}">\
                            <div class="buttons-preview pull-left"><h5>组内用户</h5></div>\
                            <div class="pull-right">\
                                <div class="input-group">\
                                    <span class="input-icon">\
                                        <input type="text" class="form-control input-sm" autocomplete="off" placeholder="请输入搜索关键字">\
                                        <i class="glyphicon glyphicon-search blue"></i>\
                                    </span>\
                                </div>\
                            </div>\
                    </form>\
                    <table id="tblForInner"></table>\
            </div>\
            <div style="width:10%">\
                <div class="arrows">\
                    <i onclick="moveGrpUsers(\'in\')" class="iconfont icon-zuojiantouxiangzuofanhuimianxing"></i>\
                    <i onclick="moveGrpUsers(\'out\')" class="iconfont icon-zuojiantouxiangzuofanhuimianxing1"></i>\
                </div>\
            </div>\
            <div style="width:45%">\
                    <form id="pnlForOutGroup" class="form-inline pnl" role="form" onkeydown="if(event.keyCode==13){return false;}">\
                            <div class="buttons-preview pull-left"><h5>组外用户</h5></div>\
                                <div class="pull-right"><div class="input-group">\
                                    <span class="input-icon">\
                                        <input type="text" class="form-control input-sm" autocomplete="off" placeholder="请输入搜索关键字">\
                                        <i class="glyphicon glyphicon-search blue"></i>\
                                    </span>\
                                </div>\
                            </div>\
                    </form>\
                    <table id="tblForOuter"></table>\
            </div>\
        </div>';
    $.dialog('list', {
        width: 1200,
        title: '移入移出用户标签',
        content: cont
    });
    $('.dialog-box').css({
        top: '15%'
    }).find();
    
    $('input:hidden[name=tagId]').val(item.tagId);
    
    tblCoupleInit(item.tagId);
}
function tblCoupleInit(tagId) {
    tblCouple(tagId);
}
function tblCoupleRefresh(tagId) {
    tblCouple(tagId, function () {
        $('.arrows').removeClass('anti-cursor');
        $('.dialog-box-content input').val('');
        pagingTable.PagingTable('update');
    });
}
function tblCouple(tagId, cb) {
    $.silentGet('/admin/tag/memberManage', { tagId: tagId }, function (data) {
        if (data.rt == '0000') {
            $('#tblForInner').ScrollList({
                inputList: data.tag_users,
                width: '100%',
                height: '300px',
                elesTop: ['序号', '账号', '姓名', '<label><input class="allcheck" type="checkbox"><span>全选</span></div>'],
                elesDemo: [
                    '<span class="counter"></span>',
                    '<span item-key="account"></span>',
                    '<span item-key="name"></span>',
                    '<label><input class="itemcheck" type="checkbox"><span></span></label>'
                ],
                widthProportion: [0.5, 1, 1, 0.5]
            });
            $('#tblForOuter').ScrollList({
                inputList: data.available_users,
                width: '100%',
                height: '300px',
                elesTop: ['序号', '账号', '姓名', '<label><input class="allcheck" type="checkbox"><span>全选</span></label>'],
                elesDemo: [
                    '<span class="counter"></span>',
                    '<span item-key="account"></span>',
                    '<span item-key="name"></span>',
                    '<label><input class="itemcheck" type="checkbox"><span></span></label>'
                ],
                widthProportion: [0.5, 1, 1, 0.5]
            });
            if (cb) {
                cb(data);
            }
        }
    });

    $('.pnl input').off().on('input change propertychange', function () {
        var keyword = encode($(this).val()),
            tbl = $(this).closest('.pnl').next('table');
        tbl.find('input:checkbox').prop('checked', false);
        tbl.find('dd.ddHas>ul').each(function () {
            if (keyword === '') {
                $(this).removeClass('hidden');
            } else {
                var yesno = true;
                $(this).find('li span[item-key]').each(function () {
                    if ($(this).text().toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                        yesno = false;
                    }
                })
                $(this).toggleClass('hidden', yesno);
            }
        })
    })

    $('#tblForOuter,#tblForInner').off().on('change', function (e) {
        if ($(e.target).hasClass('allcheck')) {
            $(this).find('dd.ddHas input:checkbox:visible').prop('checked', $(e.target).prop('checked'));
        }
    });
}
function moveGrpUsers(flag) {
    $('.arrows').addClass('anti-cursor');
    var user_list = [],
        tagId = $('input:hidden[name=tagId]').val();
    switch (flag) {
        case 'in':
            $('#tblForOuter').find('dd.ddHas>ul:has(input:checked)').each(function () {
                user_list.push($(this).data('item').userId)
            });
            if (user_list.length == 0) {
                warningOpen('请选择标签外用户', 'danger', 'fa-bolt');
                $('.arrows').removeClass('anti-cursor');
                return;
            }
            break;
        case 'out':
            $('#tblForInner').find('dd.ddHas>ul:has(input:checked)').each(function () {
                user_list.push($(this).data('item').userId)
            });
            if (user_list.length == 0) {
                warningOpen('请选择标签内用户', 'danger', 'fa-bolt');
                $('.arrows').removeClass('anti-cursor');
                return;
            }
            break;
        default:
    }
    $.actPost('/admin/tag/memberManage', {
        flag: flag,
        tagId: tagId,
        user_list: JSON.stringify(user_list)
    }, function (data) {
        if (data.rt === "0000") {
            tblCoupleRefresh(tagId);
        }
    })
}
