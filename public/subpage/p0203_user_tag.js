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
        table = $('.tagtable').data({
            start: start,
            length: length
        }),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox">'
            + '<label><input type="checkbox" onclick="selectedAll(this)" />'
            + '<span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>创建者</th>'
            + '<th>类型</th>'
            + '<th>用户关联数量</th>'
            + '<th>更新时间</th>'
            + '<th>状态</th>'
            + '<th>操作</th></tr>';
    $.silentGet('/common/org/list', {
        start_page: start,
        page_length: length,
        url: '/p/tag/manage'
    }, function (data) {
        if (data.rt == '0000') {
            for (var i in data.tag_list) {
                tag_type = data.tag_list[i].tag_type == 1 ? '动态标签' : '静态标签';
                status = data.tag_list[i].status == 1 ? '正常' : '禁用';
                str += '<tr>'
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
                    + '<a class="btn btn-primary btn-xs' + (hasFn('mod') ? '" onclick="tag_modify(' + i + ')"' : ' unable"') + '>编辑</a>'
                    + '<a class="btn btn-primary btn-xs" href="javascript:tag_view(' + i + ');">详情</a>'
                    + '</td></tr>';
            }
            str += '</table>';
            table.html(str);
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
// 返回列表
function taglist() {
    $('.user, .addt').css({ 'display': 'none' });
    $('.taglist').css({ 'display': 'block' });
}
// 管理员修改信息
function tag_modify(i) {
    var _tr = $('.tagtable table tr').eq(i + 1);
    var id = _tr.find('td').eq(7).text();
    var tagid = _tr.find('td').eq(7).attr('tagid');
    var tag_type = _tr.find('td').eq(9).text();
    var status = _tr.find('td').eq(10).text();
    var cont = '';
    cont += '<div class="modal-header">'
        + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
        + '<h4 class="modal-title">修改信息</h4>'
        + '</div>'
        + '<div class="modal-body">'
        + '<form role = "form" class="form-horizontal">'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "name">名称</label>'
        + '<div class="col-sm-7">'
        + '<input type = "text" class = "form-control" id = "name" name="name" value="' + _tr.find('td').eq(1).text() + '" />'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "tag_type">类型</label>'
        + '<div class="col-sm-7">'
        + '<select id = "tag_type" name="tag_type" class = "form-control">'
        + '<option value="0">静态标签</option>'
        + '<option value="1">动态标签</option>'
        + '</select>'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "status">状态</label>'
        + '<div class="col-sm-7">'
        + '<label class="col-xs-6" style="margin-top:6px;">'
        + '<input name="status" checked="true" type="radio" value="1" />'
        + '<span class="text">正常</span></label>'
        + '<label class="col-xs-6" style="margin-top:6px;">'
        + '<input name="status" type="radio" value="0" />'
        + '<span class="text">禁用</span></label>'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "description">描述</label>'
        + '<div class="col-sm-7">'
        + '<span class="input-icon icon-right">'
        + '<textarea class="form-control" rows="7" name="description" id="description">' + _tr.find('td').eq(8).text() + '</textarea>'
        + '</span>'
        + '</div></div>'
        + '</form>'
        + '</div>'
        + '<div class="modal-footer">'
        + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
        + '<button type="button" class="btn btn-primary" tagid="' + tagid + '" onclick="tag_update(this)">确认</button>'
        + '</div>';
    alertOpen(cont);
    $(document).ready(function () {
        $("input[name=status][value='" + status + "']").attr("checked", true);
        $("select[name='tag_type']").val(tag_type);
    });
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
// 查看
function tag_view(i) {
    var _tr = $('.tagtable table tr').eq(i + 1);
    var cont = '';
    cont += '<div class="modal-header">'
        + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
        + '<h4 class="modal-title">详细信息</h4>'
        + '</div>'
        + '<div class="modal-body">'
        + '<form role = "form" class="form-horizontal">'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label">名称</label>'
        + '<div class="col-sm-7">'
        + '<label class="control-label">' + _tr.find('td').eq(1).text() + '</label>'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label">类型</label>'
        + '<div class="col-sm-7">'
        + '<label class="control-label">' + _tr.find('td').eq(3).text() + '</label>'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label">状态</label>'
        + '<div class="col-sm-7">'
        + '<label class="control-label">' + _tr.find('td').eq(6).text() + '</label>'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "description">描述</label>'
        + '<div class="col-sm-7" style="padding-top:8px;max-height:200px;overflow:auto">'
        + _tr.find('td').eq(8).text()
        + '</div></div>'
        + '</form>'
        + '</div>'
        + '<div class="modal-footer">'
        + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
        + '<button type="button" class="btn btn-primary" onclick="alertOff()">确认</button>'
        + '</div>';
    alertOpen(cont);
}


//删除推送用户
function deleteuser(obj) {
    var tr = $(obj).parent().parent();
    var rowIndex = tr.index() + 1;
    var email = tr.find('td').eq(0).text();
    var name = tr.find('td').eq(1).text();
    var id = tr.find('td').eq(2).text();
    var tab = document.getElementById("adduser");
    //表格行数
    var rows = tab.rows.length * 1;
    var x = document.getElementById('adduser').insertRow(rows);
    var y = x.insertCell(0);
    var z = x.insertCell(1);
    var k = x.insertCell(2);
    var v = x.insertCell(3);
    y.innerHTML = email;
    z.innerHTML = name;
    k.innerHTML = id;
    v.innerHTML = '<img src="../imgs/roleadd.png" onclick="adduser(this)" style="vertical-align: middle;cursor:pointer;" />';
    k.style.display = 'none';
    v.style.padding = '0';
    v.style.textAlign = 'center';
    $(obj).parent("td").parent("tr").remove();
}
//添加推送用户
function adduser(obj) {
    var tr = $(obj).parent().parent();
    var rowIndex = tr.index() + 1;
    var email = tr.find('td').eq(0).text();
    var name = tr.find('td').eq(1).text();
    var id = tr.find('td').eq(2).text();
    var tab = document.getElementById("deleteuser");
    //表格行数
    var rows = tab.rows.length * 1;
    var x = document.getElementById('deleteuser').insertRow(rows);
    var y = x.insertCell(0);
    var z = x.insertCell(1);
    var k = x.insertCell(2);
    var v = x.insertCell(3);
    y.innerHTML = email;
    z.innerHTML = name;
    k.innerHTML = id;
    v.innerHTML = '<img src="../imgs/roledelete.png" onclick="deleteuser(this)" style="vertical-align: middle;cursor:pointer;" />';
    k.style.display = 'none';
    v.style.padding = '0';
    v.style.textAlign = 'center';
    $(obj).parent("td").parent("tr").remove();
}
//查询未推送的用户
function sfreeusers() {
    var s = document.getElementById("freeusers").value;
    var tab = $('.freeuser table');
    tab.find('tr').each(function () { $(this).css({ 'display': '' }); });
    searchbykeywords(s, tab);
}
//查询推送过的用户
function searchusers() {
    var s = document.getElementById("users").value;
    var tab = $('.member table');
    tab.find('tr').each(function () { $(this).css({ 'display': '' }); });
    searchbykeywords(s, tab);
}
// 消息推送提交
function save() {
    var usertable = $('.member table');
    var user_list = [], i = 0, app_list = [];
    usertable.find('tr:not(:first)').remove().each(function () {
        if ($(this).css("display") != "none") {
            user_list[i] = $(this).find('td').eq(2).text() * 1;
            i = i + 1;
        }
    });
    var postData = {
        tag_id: $('.user').find('input[name=tag_id]').val(),
        user_list: JSON.stringify(user_list),
        app_list: JSON.stringify(app_list)
    };
    $.actPost('/man/tag/addUsers', postData, function (data) {
        if (data.rt == '0000') {
            taglist();
            getTagList(currentpage, 10);
        }
    });
}
// 添加
function add() {
    var cont = '';
    cont += '<div class="modal-header">'
        + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
        + '<h4 class="modal-title">添加标签</h4>'
        + '</div>'
        + '<div class="modal-body">'
        + '<form role = "form" class="form-horizontal">'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "name">名称</label>'
        + '<div class="col-sm-7">'
        + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入名称" />'
        + '</div>'
        + '<div class="col-sm-2" style="padding-left:0;">'
        + '<img src = "../imgs/star.png"></img>'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "tag_type">类型</label>'
        + '<div class="col-sm-7">'
        + '<select id = "tag_type" name="tag_type" class = "form-control">'
        + '<option value="0">静态标签</option>'
        + '<option value="1">动态标签</option>'
        + '</select>'
        + '</div>'
        + '<div class="col-sm-2" style="padding-left:0;">'
        + '<img src = "../imgs/star.png"></img>'
        + '</div></div>'
        /*+ '<div class = "form-group">' 
        + '<label class="col-sm-3 control-label" for = "status">状态</label>' 
        + '<div class="col-sm-7">' 
        + '<label class="col-xs-6" style="margin-top:6px;">'
        + '<input name="status" checked="true" type="radio" value="1" />'
        + '<span class="text">正常</span></label>'
        + '<label class="col-xs-6" style="margin-top:6px;">'
        + '<input name="status" type="radio" value="0" />'
        + '<span class="text">禁用</span></label>'
        + '</div></div>'*/
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "description">描述</label>'
        + '<div class="col-sm-7">'
        + '<span class="input-icon icon-right">'
        + '<textarea class="form-control" rows="7" name="description" id="description" placeholder = "请输入描述信息"></textarea>'
        + '</span>'
        + '</div></div>'
        + '</form>'
        + '</div>'
        + '<div class="modal-footer">'
        + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
        + '<button type="button" class="btn btn-primary" onclick="tag_add()">确认</button>'
        + '</div>';
    alertOpen(cont);
}
// 添加提交操作 
function tag_add() {
    var postData = {
        name: $('input[name=name]').val(),
        tag_type: $('select[name=tag_type]').val(),
        // status: $("input[name='status']:checked").val(),
        status: 1,
        description: $('textarea[name=description]').val(),
        url: '/p/tag/manage'
    };
    if (postData.name == "") {
        warningOpen('请填写名称！', 'danger', 'fa-bolt');
    } else {
        $.actPost('/common/org_add', postData, function (data) {
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



// 用户组添加用户
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
        title: '移入移出用户组',
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
        console.log(this);
        console.log(e.target);
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
        console.log(data);
        if (data.rt === "0000") {
            tblCoupleRefresh(tagId);
        }
    })
}