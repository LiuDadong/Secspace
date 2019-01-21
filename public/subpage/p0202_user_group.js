/*
 * ==================================================================
 *                          用户组管理 users
 * ==================================================================
 */

applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限


var subCaption = $('#subCaption').data('itemText', '用户组').text('用户组列表');

// 用户组
getDeparts(0);

// 用户组列表
function getDeparts(departId) {
    $.silentGet('/common/org/list', {
        departId: departId,
        url: '/p/depart/manage'
    }, function (data) {
        if (data.rt == '0000') {
            var tbl = $('<table class="table table-striped table-bordered table-hover" style="width:100%;background-color:#fff;" >\
                            <tr style="line-height:36px;">\
                                <th class="sel" style="line-height:20px;">\
                                    <div class="checkbox">\
                                        <label><input type="checkbox" onclick="selectedAll(this)" /><span class="text">全选</span></label>\
                                    </div>\
                                </th>\
                                <th>名称</th>\
                                <th>创建人</th>\
                                <th>用户关联数量</th>\
                                <th>更新时间</th>\
                                <th>状态</th>\
                                <th>操作</th>\
                            </tr>\
                        </table>');
            if(data.depart_list.length>0){
                for (var i in data.depart_list) {
                    var item = data.depart_list[i];
                    tri = $('<tr></tr>').data('item', item);
                    tri.data('item')['parent_id'] = 0;
                    tdCkb = item.name === "未分组" ? '<td></td>' : '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)" /><span class="text"></span></label></div></td>';
                    tdAct = '<td class="other"><a title="编辑" class="btn btn-primary btn-xs' 
                            + (hasFn('mod') ? '" onclick="edit(this)"' : ' disabled"') 
                            + '><i class="fa fa-edit"></i></a>'
                            +'<a title="查看" class="btn btn-primary btn-xs" onclick="view(this)"><i class="fa fa-eye"></i></a></td>';
                    tdUsersInfo = item.name == '未分组'
                        ? '<td><span>' + item.current_num + '</span></td>'
                        : '<td><span onclick="dialogForMoveUser(this)" class="pointer"><a>' + item.current_num + '</a></span></td>';
    
                    status = item.status == 1 ? '正常' : '禁用';
                    tdName = item.child_node != 0 ?
                        '<td class="tdGrpName" onclick="toggleChild(this)" class="pointer"><i class="fa fa-plus"></i>' + item.name + '</td>' :
                        '<td class="tdGrpName">' + item.name + '</td>';
                    tri.html(tdCkb + tdName
                        + '<td>' + item.creator + '</td>'
                        + tdUsersInfo
                        + '<td>' + item.update_time + '</td>'
                        + '<td>' + status + '</td>'
                        + '<td departid="' + data.depart_list[i].departId + '" style="display:none;">' + item.id + '</td>'
                        + '<td style="display:none;">' + item.name + '</td>'
                        + '<td style="display:none;">' + item.status + '</td>'
                        + '<td style="display:none;">' + departId + '</td>'
                        + tdAct);
                    tbl.append(tri);
                }
            }else{
                if(departId==0){
                    tbl.append('<tr><td colspan="7">暂无数据</td></tr>');
                }
            }
            $('.userstable').html(tbl);
        }
    });
    $('.hrefactive').removeClass("hrefallowed");
}

// 用户组下级显示/隐藏
function toggleChild(td) {
    var tr = $(td).closest('tr'),
        item = tr.data('item');
    $(td).find('i.fa').toggleClass('fa-plus').toggleClass('fa-minus');
    if (item.departId != tr.next().attr('pid')) {
        $.silentGet('/common/org/list', {
            departId: item.departId,
            url: '/p/depart/manage'
        }, function (data) {
            if (data.rt == '0000') {
                for (var i in data.depart_list) {
                    var cItem = data.depart_list[i];
                    var status = cItem.status == 1 ? '正常' : '禁用';
                    var str2 = cItem.child_node != 0
                        ? '<td onclick="toggleChild(this)" class="pointer" style="padding-left:'
                        + ((cItem.layer * 1 - 1) * 40) + 'px;background:url(../imgs/fold_line.png) no-repeat '
                        + (10 + (cItem.layer * 1 - 2) * 20) + 'px 0;">'
                        + '<i class="fa fa-plus faopen"></i><i class="fa fa-minus faclose"></i>'
                        + cItem.name + '</td>'
                        : '<td style="padding-left:'
                        + ((cItem.layer * 1 - 1) * 40) + 'px;background:url(../imgs/fold_line.png) no-repeat '
                        + (10 + (cItem.layer * 1 - 2) * 20) + 'px 0;">'
                        + cItem.name + '</td>';
                    cItem['parent_id'] = item.id;
                    var cTr = $('<tr>').data('item', cItem).attr('pid', item.departId)
                        .html('<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)" />'
                            + '<span class="text"></span></label></div></td>'
                            + str2
                            + '<td>' + cItem.creator + '</td>'
                            + '<td><span onclick="dialogForMoveUser(this)" class="pointer"><a>' + cItem.current_num + '</a></span></td>'
                            + '<td>' + cItem.update_time + '</td>'
                            + '<td>' + status + '</td>'
                            + '<td departid="' + cItem.departId + '" style="display:none;">' + cItem.departId + '</td>'
                            + '<td style="display:none;">' + cItem.name + '</td>'
                            + '<td style="display:none;">' + cItem.status + '</td>'
                            + '<td style="display:none;">' + cItem.departId + '</td>'
                            + '<td class="other">'
                                +'<a title="编辑" class="btn btn-primary btn-xs' + (hasFn('mod') && item.name !== "未分组" ? '" onclick="edit(this)"' : ' disabled"') + '><i class="fa fa-edit"></i></a>'
                                +'<a title="查看" class="btn btn-primary btn-xs" onclick="view(this)"><i class="fa fa-eye"></i></a>'
                            +'<td>')
                    if (cTr.find('td:last').html() == '') {
                        cTr.find('td:last').remove();
                    }
                    tr.after(cTr);
                }
            }
        });
    } else {
        toggleChildByTd(td)
    }
    function toggleChildByTd(td) {
        var item = $(td).closest('tr').data('item'),
            hide = $(td).find('i.fa:visible').hasClass('fa-plus');
        $('.userstable table tr').each(function () {
            if ($(this).attr('pid') === item.departId) {
                if ($(td).is(':visible')) {
                    $(this).toggleClass('hidden', hide);
                } else {
                    $(this).addClass('hidden');
                }
                var ctd = $(this).find('td[onclick="toggleChild(this)"]')[0];
                if (ctd) {
                    toggleChildByTd(ctd)
                }
            }
        })
    }
}


// 添加用户组
function add() {
    grpFormFor('add');
}
function edit(e) {
    grpFormFor('edit', e)
}
function view(e) {
    grpFormFor('view', e)
}

function grpFormFor(use, ele) {
    var item = {};
    switch (use) {
        case 'add':
            title = "新建用户组";
            break;
        case 'edit':
            item = $(ele).closest('tr').data('item');
            title = "编辑用户组:" + item.name;
            break;
        case 'view':
            item = $(ele).closest('tr').data('item');
            title = "查看用户组:" + item.name;
            break;
        default:
    }
    var cont = '<form id="frmUserGroup" class="form-horizontal form-bordered" role="form" method="post">\
            <input type="hidden" name="departId"/>\
            <div class="form-group">\
                <label for="name" class="col-sm-3 control-label no-padding-right">用户组名</label>\
                <div class="col-sm-9">\
                    <input type="text" class="form-control require" id="name" name="name" ctrl-regex="name_mix" placeholder="请输入用户组名">\
                </div>\
            </div>\
            <div class="form-group">\
                <label for="status" class="col-sm-3 control-label no-padding-right">用户组名</label>\
                <div class="col-sm-9">\
                    <div class="control-group">\
                        <div class="radio col-sm-5">\
                            <label>\
                                <input name="status" value="1" type="radio" checked="checked" />\
                                <span class="text">正常</span>\
                            </label>\
                        </div>\
                        <div class="radio col-sm-5">\
                            <label>\
                                <input name="status" value="0" type="radio" />\
                                <span class="text">禁用</span>\
                            </label>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="form-group">\
                <label class="col-md-3 control-label no-padding-right">上级组</label>\
                <div class="col-md-9">\
                    <input type="hidden" name="parent_id" value="0" />\
                    <div id="xtreegroup" style="min-height:100px;max-height:300px;"></div>\
                </div>\
            </div>\
            <div class="form-group">\
                <div class="col-sm-2  col-sm-offset-4">\
                    <button type="button" class="btnBack btn btn-default">返回</button>\
                </div>\
                <div class="col-sm-2 col-sm-offset-1">\
                    <input type="submit" class="btn btn-primary" disabled="">\
                </div>\
            </div>\
        </form>';
    $.dialog('form', {
        width: 500,
        height: null,
        autoSize: true,
        maskClickHide: true,
        title: title,
        content: cont,
        hasBtn: false,
        hasClose: true,
        hasMask: true,
        confirmValue: '确认',
        confirm: function () {
            frmUserGroup.submit();
        },
        confirmHide: false,
        cancelValue: '取消'
    });
    var frmUserGroup = $('#frmUserGroup').MultForm({
        addUrl: '/p/depart/manage',
        addBtnTxt: '确认',
        editUrl: '/p/depart/manage',
        editBtnTxt: '保存',
        afterUsed: function (use) {
            switch (use) {
                case 'add':
                    frmUserGroup.find('input[name=parent_id]').val(0);
                    break;
                case 'view':
                    frmUserGroup.find('.xtree').addClass('anti-cursor');
                case 'edit':
                    frmUserGroup.find('input[name=status][value="' + item.status + '"]').prop('checked', true);
                    break;
                default:
            }
        },
        beforeSubmit: function (arrKeyVal, $frm, ajaxOptions) {
            if (item && frmUserGroup.find('input[name=parent_id]').val() == item.id) {
                warningOpen('用户组不能移至自身', 'danger', 'fa-bolt');
                return false;
            }
            for (var i = 0; i < arrKeyVal.length; i++) {
                if (delKeyVal(arrKeyVal[i].name)) {
                    arrKeyVal.splice(i, 1);
                    i--;
                }
            }
            function delKeyVal(key) {  //删掉不需要提交的数据
                switch (key) {
                    case 'xtreeitem':
                        return true;
                    case 'departId':
                        return use === 'add';
                    default:
                }
            }
            return true;
        },
        cbAfterSuccess: function (use) {
            $.dialogClose();
            getDeparts(0);
        }
    });
    if (item) {
        frmUserGroup.data('item', item);
    } else {
        frmUserGroup.removeData('item');
    }

    $('#xtreegroup').XTree({
        multiple: false,
        hasRoot: false,
        relPTable: null
    });
    $('#xtreegroup').off().on('click', function (e) {
        if (e.target.tagName === "LABEL") {
            return;
        } else if (e.target.tagName === "INPUT") {
            var li = $(e.target).closest('li'),
                gid = li.data('gid'),
                ipt = li.find('input'),
                iptDid = $('#xtreegroup').prev();
            if (gid == iptDid.val()) {
                iptDid.val('0');
                ipt.prop('checked', false);
            } else {
                iptDid.val(gid);
            }
        } else {

        }

    });
    frmUserGroup.usedAs(use);
}



// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getDeparts(0);
    $('.hrefactive').removeClass("hrefallowed");
}
// 删除
function deletes() {
    if ($('.userstable table').find('span.txt').length>0) {
        $.dialog('confirm', {
            width: 460,
            height: null,
            maskClickHide: true,
            title: "删除确认",
            content: '<p class="text-align-center">确认删除选中的用户组吗？</p>',
            hasBtn: true,
            hasClose: true,
            hasMask: true,
            confirmValue: '确认',
            confirm: function () {
                users_delete();
            },
            confirmHide: true,
            cancelValue: '取消'
        });
    }
}

// 删除
function users_delete() {
    var departs = [],
        i = 0;
    var tr;
    var tab = $('.userstable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            departs[i] = tr.find('td').eq(6).attr('departid');
            i = i + 1;
        }
    });
    if (departs.length > 0) {
        var postData = {
            departs: JSON.stringify(departs),
            url: '/p/depart/manage'
        };
        $.actPost('/common/del', postData, function (data) {
            if (data.rt == '0000') {
                getDeparts(0);
                alertOff();
            }
        }, '删除');
    } else {
        warningOpen('请选择标签！', 'danger', 'fa-bolt');
    }
}



// 用户组内外用户移动
function dialogForMoveUser(e) {
    var _tr = $(e).closest('tr');
    var departId = _tr.find('td').eq(6).attr('departId');
    var cont = '<div style="display:flex;">\
            <input type="hidden" name="departId" value="'+ departId +'" />\
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
        title: '移入移出用户组',
        content: cont
    });
    $('.dialog-box').css({
        top: '15%'
    }).find();
    tblCoupleInit(departId);
}




function tblCoupleInit(departId) {
    tblCouple(departId);
}
function tblCoupleRefresh(departId) {
    tblCouple(departId, function () {
        getDeparts(0);
        $('.arrows').removeClass('anti-cursor');
        $('.dialog-box-content input[type=text]:visible').val('');
    });
}

function tblCouple(departId, cb) {
    $.silentGet('/admin/depart/memberManage', { departId: departId }, function (data) {
        if (data.rt == '0000') {
            var scrollOpts={
                width: '100%',
                height: '300px',
                elesTop: ['序号', '账号', '姓名','用户组', '<label><input class="allcheck" type="checkbox"><span>全选</span></div>'],
                elesDemo: [
                    '<span class="counter"></span>',
                    '<span item-key="account"></span>',
                    '<span item-key="name"></span>',
                    '<span item-key="depart.name"></span>',
                    '<label><input class="itemcheck" type="checkbox"><span></span></label>'
                ],
                widthProportion: [0.5, 1, 1, 1, 0.5],
                fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
                    switch (k) {
                        case 'depart.name':
                            v = v===null?'未分组':v;
                            break;
                        default:
                    }
                    return v;
                }
            };

            scrollOpts['inputList']=data.depart_users;
            $('#tblForInner').ScrollList(scrollOpts);

            scrollOpts['inputList']=data.available_users;
            $('#tblForOuter').ScrollList(scrollOpts);
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
    event.stopPropagation();
    var user_list = [],
        departId = $('input:hidden[name=departId]').val();
    switch (flag) {
        case 'in':
            $('#tblForOuter').find('dd.ddHas>ul:has(input:checked:visible)').each(function () {
                user_list.push($(this).data('item').userId)
            });
            if (user_list.length == 0) {
                warningOpen('请选择组外用户', 'danger', 'fa-bolt');
                $('.arrows').removeClass('anti-cursor');
                return;
            }
            break;
        case 'out':
            $('#tblForInner').find('dd.ddHas>ul:has(input:checked:visible)').each(function () {
                user_list.push($(this).data('item').userId)
            });
            if (user_list.length == 0) {
                warningOpen('请选择组内用户', 'danger', 'fa-bolt');
                $('.arrows').removeClass('anti-cursor');
                return;
            }
            break;
        default:
    }
    $.actPost('/admin/depart/memberManage', {
        flag: flag,
        departId: departId,
        user_list: JSON.stringify(user_list)
    }, function (data) {
        if (data.rt === "0000") {
            tblCoupleRefresh(departId);
        }
    })
}