/*
 * ==================================================================
 *                          标签 tag
 * ==================================================================
 */

(function () {
    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限

    // 标签列表
    getTagList(1, 10);

})();
function updateTagTable() {
    var i = $('.tagtable').data('start');
    var l = $('.tagtable').data('length');
    getTagList(i, l);
}
// app标签列表
function getTagList(i, len) {
    var start = (typeof i === 'number')
        ? i
        : ((typeof $('.tagtable').data('start') === 'number')
            ? $('.tagtable').data('start')
            : 0),
        length = (typeof len === 'number')
            ? len
            : ((typeof $('.tagtable').data('length') === 'number')
                ? $('.tagtable').data('length')
                : 0),
        st = 1,
        tag_type = '',
        status = '',
        table = $('.tagtable').data({start: start,length: length})
                .html('<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
                    + '<th class="sel" style="line-height:20px;"><div class="checkbox">'
                    + '<label><input type="checkbox" onclick="selectedAll(this)" />'
                    + '<span class="text">全选</span></label></div></th>'
                    + '<th>名称</th>'
                    + '<th>创建者</th>'
                    + '<th>类型</th>'
                    + '<th>用户关联数量</th>'
                    + '<th>更新时间</th>'
                    + '<th>状态</th>'
                    + '<th>操作</th></tr>'
                + '</table>');
    $.silentGet('/common/org/list', {
        start_page: start,
        page_length: length,
        url: '/p/tag/manage'
    }, function (data) {

        if (data.rt == '0000') {
            for (var i in data.tag_list) {
                tag_type = data.tag_list[i].tag_type == 1 ? '动态标签' : '静态标签';
                status = data.tag_list[i].status == 1 ? '正常' : '禁用';
                var tri= $('<tr>'
                + '<td class="sel"><div class="checkbox"><label>'
                + '<input type="checkbox" onclick="selected(this)" />'
                + '<span class="text"></span></label></div></td>'
                + '<td>' + data.tag_list[i].name + '</td>'
                + '<td>' + data.tag_list[i].creator + '</td>'
                + '<td>' + tag_type + '</td>'
                + '<td>'
                + '<a onclick="dialogForMoveUser(this)" href="javascript:void(0);">' + data.tag_list[i].user_num + '</a>'
                + '</td>'
                + '<td>' + data.tag_list[i].create_time + '</td>'
                + '<td>' + status + '</td>'
                + '<td tagid="' + data.tag_list[i].tagId + '" style="display:none;">' + data.tag_list[i].id + '</td>'
                + '<td style="display:none;">' + data.tag_list[i].description + '</td>'
                + '<td style="display:none;">' + data.tag_list[i].tag_type + '</td>'
                + '<td style="display:none;">' + data.tag_list[i].status + '</td>'
                + '<td>'
                + '<a class="btn btn-primary btn-xs' + (hasFn('mod') ? '" onclick="edit(this)"' : ' disabled"') + '>编辑</a>'
                + '<a class="btn btn-primary btn-xs" onclick="view(this)">详情</a>'
                + '</td></tr>').data('item', data.tag_list[i])
                table.find('table').append(tri);
            }
            createFooter(start, length, data.total_count, st);
        }
    });
    $('.hrefactive').removeClass("hrefallowed");
    currentpage = start;
}
// page页查询
function search(p, i) {
    if (i == 1) {
        getTagList(p, 10);
    } else {
        console.warn(i);
    }
}

// 修改
function tag_update(e) {
    var tagid = $(e).attr('tagid')
    var postData = {
        name: $('input[name=name]').val(),
        tag_type: $('select[name=tag_type]').val(),
        status: $("input[name='status']:checked").val(),
        description: $('textarea[name=description]').val(),
        tagId: tagid,
        url: '/p/tag/manage'
    };
    if (postData.name == "") {
        warningOpen('请填写标签名称！', 'danger', 'fa-bolt');
    } else {
        $.actPost('/common/mod', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
                getTagList(currentpage, 10);
            }
        });
    }
}







// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getTagList(currentpage, 10);
    $('.hrefactive').removeClass("hrefallowed");
}
// 删除提示

function deletes() {
    var actText = $(this).text().replace(/[\s]/g, ''),//获取操作类型文本-删除
        sel = pagingTable.data('PagingTable').sel;//获取列表中所有选中的对象数据：要删除的数据
    if (sel.length > 0) {
        var needUnact;
        switch (getItemType(sel[0])){
            case '用户':
            case '用户标签':
                needUnact=[];
            default:
                needUnact = $.arrKeyFlt(sel, false, function (item) {
                    return item.status == '1';
                });
        }

        if (needUnact.length == 0) {
            $.dialog('confirm',{
                width: 460,
                height: null,
                maskClickHide: true,
                title: "删除确认",
                content: '<p class="text-align-center">确认删除选中的' + $(pnl.relSubCaption).data('itemText') + '吗？</p>',
                hasBtn: true,
                hasClose: true,
                hasMask: true,
                confirmValue: '确认',
                confirm: function () {
                    if (sel[0].hasOwnProperty('policy_type')) {
                        delPolicy();
                    } else {
                        delDefault();
                    }
                    function delPolicy(){
                        var allPros = [],
                        selPcyIds = {
                            device: $.arrKeyFlt(sel, 'id', function (item) {
                                return item.policy_type == 'device';
                            }),
                            complicance: $.arrKeyFlt(sel, 'id', function (item) {
                                return item.policy_type == 'complicance';
                            }),
                            geofence: $.arrKeyFlt(sel, 'id', function (item) {
                                return item.policy_type == 'geofence';
                            }),
                            timefence: $.arrKeyFlt(sel, 'id', function (item) {
                                return item.policy_type == 'timefence';
                            }),
                            whiteapp: $.arrKeyFlt(sel, 'id', function (item) {
                                return item.policy_type == 'whiteapp';
                            }),
                            blackapp: $.arrKeyFlt(sel, 'id', function (item) {
                                return item.policy_type == 'blackapp';
                            }),
                            limitaccess: $.arrKeyFlt(sel, 'id', function (item) {
                                return item.policy_type == 'limitaccess';
                            }),
                            customer: $.arrKeyFlt(sel, 'id', function (item) {
                                return item.policy_type == 'customer';
                            })
                        };
                        for (k in selPcyIds) {
                            if (selPcyIds[k].length > 0) {
                                allPros.push($.proPost('/common/del', {
                                    url: '/p/policy/delete',
                                    ids: JSON.stringify(selPcyIds[k]),
                                    policy_type: k
                                }));
                            }
                        }
                        if (allPros.length > 0) {
                            $.proAll(true, allPros, function (datas, rts) {
                                if (rts.length === 1 && rts[0] == '0000') {
                                    switch (rts[0]) {
                                        case '0000':
                                            pagingTable.PagingTable('update');
                                            break;
                                        default:
                                    }
                                }
                            }, actText);
                            return;
                        }
                    }
                    function delDefault(){
                        var modJson = {};
                        if (pnl.deleteJson.hasOwnProperty('id')) {
                            modJson['id'] = JSON.stringify($.arrKeyFlt(sel, 'id'))
                        } else {
                            modJson['ids'] = JSON.stringify($.arrKeyFlt(sel, 'id'))
                        }
                        $.actPost('/common/del', delData(sel), function (data) {
                            switch (data.rt) {
                                case '0000':
                                    pagingTable.PagingTable('update');
                                    break;
                                default:
                            }
                        }, actText)
                        function delData(sel) {
                            var jsonPatch = {};
                            if (pnl.deleteJson.hasOwnProperty('account')) {
                                jsonPatch['account'] = JSON.stringify(arrByKey(sel, 'account'));
                            } else if (pnl.deleteJson.hasOwnProperty('userId')) {
                                jsonPatch['userId'] = JSON.stringify(arrByKey(sel, 'userId'));
                            } else if (pnl.deleteJson.hasOwnProperty('id')) {
                                jsonPatch['id'] = JSON.stringify(arrByKey(sel, 'id'));
                            } else {
                                jsonPatch['ids'] = JSON.stringify(arrByKey(sel, 'id'));
                            }
                            return $.extend(
                                true,
                                pnl.deleteJson,
                                jsonPatch
                            )
                            function arrByKey(arr, key) {
                                return arr.map(function (item) {
                                    return item[key];
                                });
                            }
                        }
                    }
                },
                confirmHide:true,
                cancelValue: '取消'
            });
        } else {
            warningOpen('请先禁用要删除的' + $(pnl.relSubCaption).data('itemText') + '！', 'danger', 'fa-bolt');
        }
    } else {
        warningOpen('请选择要' + actText + '的' + $(pnl.relSubCaption).data('itemText') + '！', 'danger', 'fa-bolt');
    }
}

function deletes() {
    var i = 0;
    var tab = $('.tagtable table');
    if (tab.find('span').hasClass('txt')) {
        i = 1;
    }
    var cont = '';
    if (i > 0) {
        cont += '<div class="modal-header">'
            + ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
            + '<h4 class="modal-title">提示</h4>'
            + '</div>'
            + '<div class="modal-body">'
            + '<p>确定删除？</p>'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
            + '<button type="button" class="btn btn-primary" onclick="tag_delete()">确认</button>'
            + '</div>';
        alertOpen(cont);
    }
}

// 删除
function tag_delete() {
    var tag_ids = [],
        i = 0;
    var tr;
    var tab = $('.tagtable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            tag_ids[i] = tr.find('td').eq(7).attr('tagid');
            i = i + 1;
        }
    });
    if (tag_ids.length > 0) {
        var postData = {
            tagId: JSON.stringify(tag_ids),
            url: '/p/tag/manage'
        };
        $.actPost('/common/del', postData, function (data) {
            if (data.rt == '0000') {
                getTagList(1, 10);
                alertOff();
            }
        });
    } else {
        warningOpen('请选择标签！', 'danger', 'fa-bolt');
    }
}



// 用户标签添加用户
function dialogForMoveUser(e) {
    var _tr = $(e).closest('tr');
    var id = _tr.find('td').eq(7).text() * 1;
    var tagId = _tr.find('td').eq(7).attr('tagid');
    var tname = tagId.split('&')[0];
    $('input:hidden[name=tagId]').val(tagId);
    $('.tname').text(tname);
    $('#manageGroup').removeClass('hidden');
    tableCouple(tagId);
}


// 用户标签内外用户移动
function dialogForMoveUser(e) {
    var cont = '<div style="display:flex;">\
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
    var _tr = $(e).closest('tr');
    var tagId = _tr.find('td').eq(7).attr('tagid');
    $('input:hidden[name=tagId]').val(tagId);
    tblCoupleInit(tagId);
}
function tblCoupleInit(tagId) {
    tblCouple(tagId);
}
function tblCoupleRefresh(tagId) {
    tblCouple(tagId, function () {
        getTagList();
        $('.arrows').removeClass('antiCursor');
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
    $('.arrows').addClass('antiCursor');
    var user_list = [],
        tagId = $('input:hidden[name=tagId]').val();
    switch (flag) {
        case 'in':
            $('#tblForOuter').find('dd.ddHas>ul:has(input:checked)').each(function () {
                user_list.push($(this).data('item').userId)
            });
            if (user_list.length == 0) {
                warningOpen('请选择标签外用户', 'danger', 'fa-bolt');
                $('.arrows').removeClass('antiCursor');
                return;
            }
            break;
        case 'out':
            $('#tblForInner').find('dd.ddHas>ul:has(input:checked)').each(function () {
                user_list.push($(this).data('item').userId)
            });
            if (user_list.length == 0) {
                warningOpen('请选择标签内用户', 'danger', 'fa-bolt');
                $('.arrows').removeClass('antiCursor');
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


// 添加用户标签
function add() {
    tagFormFor('add');
}
function edit(e) {
    tagFormFor('edit', e)
}
function view(e) {
    tagFormFor('view', e)
}

function tagFormFor(use, ele) {
    var item = {};
    switch (use) {
        case 'add':
            title = "新建用户标签";
            break;
        case 'edit':
            item = $(ele).closest('tr').data('item');
            title = "编辑用户标签:" + item.name;
        case 'view':
            item = $(ele).closest('tr').data('item');
            title = "用户标签详情:" + item.name;
            break;
    }
    var cont = '<form id="frmUserTag" class="form-horizontal form-bordered" role="form" method="post">\
            <input type="hidden" name="tagId"/>\
            <div class="form-group">\
                <label for="name" class="col-sm-3 control-label no-padding-right">标签名</label>\
                <div class="col-sm-9">\
                    <input type="text" class="form-control require" id="name" name="name" ctrl-regex="name_mix" placeholder="请输入用户组名">\
                </div>\
            </div>\
            <div class="form-group">\
                <label for="name" class="col-sm-3 control-label no-padding-right">标签名</label>\
                <div class="col-sm-9">\
                    <select id="tag_type" name="tag_type" class="form-control">\
                        <option value="0">静态标签</option>\
                        <option value="1">动态标签</option>\
                    </select>\
                </div>\
            </div>\
            <div class="form-group">\
                <label for="status" class="col-sm-3 control-label no-padding-right">状态</label>\
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
                <label class="col-md-3 control-label no-padding-right">描述</label>\
                <div class="col-md-9">\
                    <textarea class="form-control" rows="7" name="description" id="description" placeholder="请输入描述信息"></textarea>\
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
    $.dialog('confirm', {
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
            frmUserTag.submit();
        },
        confirmHide: false,
        cancelValue: '取消'
    });
    var frmUserTag = $('#frmUserTag').MultForm({
        addUrl: '/p/tag/manage',
        addBtnTxt: '确认',
        editUrl: '/p/tag/manage',
        editBtnTxt: '保存',
        afterUsed: function (use) {
            switch (use) {
                case 'add':
                    frmUserTag.find('input[name=tagId]').remove();
                    break;
                case 'edit':
                    frmUserTag.find('input[name=status][value="' + item.status + '"]').prop('checked', true);
                    break;
                default:
            }
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
                    case 'xtreeitem':
                        return true;
                    case 'departId':
                        return use === 'add';
                    default:
                }
            }
            return true;
        },
        cbSubmit: function (use) {
            $.dialogClose();
            updateTagTable();
        }
    });

    if (item) {
        frmUserTag.data('item', item);
    } else {
        frmUserTag.removeData('item');
    }
    $('#frmUserTag').parent().css({
        display: 'block'
    })
    frmUserTag.usedAs(use);
}