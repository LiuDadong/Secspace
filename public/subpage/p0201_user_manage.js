/*
 * ==================================================================
 *                          用户管理 user
 * ==================================================================
 */

// 用户列表
listUsers(1, 10, '');
$('#valid_time').keyup(function () {
    var c = $(this);
    var temp_amount = c.val().replace(/[^\d]/g, '');
    // 判断范围
    temp_amount = temp_amount < 1 ? 1 : temp_amount > 30 ? 30 : temp_amount;
    $(this).val(temp_amount);
});

// 用户标签对象
function getTags(cb) {
    $.silentGet('/man/tag/getTagList', {
        'start': 1,
        'length': 1000
    }, function (data) {
        if (data.rt == '0000') {
            cb(data);
        }
    });
}

// 用户组对象
function getUsers(cb) {
    $.silentGet('/man/users/getUsersList', {
        depart_id: 0
    }, function (data) {
        if (data.rt == '0000') {
            cb(data);
        }
    });
}

// function fnSearch() {
//     if ($('.mdlTree>li').length == 0) {
//         searchuserlist();
//     }
// }

//这样调用a函数
var st = 1;
var depId;

function searchuserlist() {
    var str = '';
    var folder = '';
    var str2 = '<ul class="mdlTree">';
    getTags(function (tagObject) {
        if (tagObject.rt === 0) {
            var select = $('.searchcontent .tag ul');
            for (var i in tagObject.tag_list) {
                str += '<li class="list-group-item cursor" onclick="searchbytag(this)">' +
                    tagObject.tag_list[i].name +
                    '<input type="text" name="tagid" value="' + tagObject.tag_list[i].id + '" style="display:none" />' +
                    '</li>';
            }
            select.html(str);
        }
    })

    getUsers(function (usersObject) {
        if (usersObject.rt === 0) {
            str2 += liInUl(usersObject);
            str2 += '</ul>'
            $(".searchcontent .mdlTree").html(str2);
        }
    })

}

function searchbytag(e) {
    if ($(e).hasClass('tagactive')) {
        st = 1;
        $(e).removeClass('tagactive');
        listUsers(1, 10, '');
    } else {
        st = 3;
        $('.searchcontent .tag li').removeClass('tagactive');
        $(e).addClass('tagactive');
        listUsers(1, 10, '');
    }
}

function opentreesearch(e) {
    var id = $(e).parent().find('input[name=tree_id]').eq(0).val() * 1;
    var tab = $('.searchcontent .selectusers');
    var isFindChild = true;
    var folder = '';
    tab.find('input[name=p_id]').each(function () {
        if ($(this).val() == id) {
            isFindChild = false;
            active4 = $(this).parent().parent().is(":visible") == true ? 'hide' : 'show';
        }
    });
    if (isFindChild) {
        $(e).css('display', 'none');
        $(e).next().css('display', 'inline-block');
        var str = '<ul class="mdlTree">';
        $.silentGet('/man/users/getUsersList', {
            depart_id: id
        }, function (data) {
            if (data.rt == '0000') {
                str += liInUl(data);
                str += '</ul>';
                $(e).parent().append(str);
            }
        });
    } else {
        toguser(e);
    }
}

var active4 = '';

function toguser(e) {
    var that = $(e).parent().parent();
    if (active4 === 'show') {
        $(e).hide();
        $(e).next().css('display', 'inline-block');
        $(that).find('ul:first > li').show();
        $(that).find('li .faopen').show();
        $(that).find('li .faclose').hide();
    } else {
        $(e).hide();
        $(e).prev().css('display', 'inline-block');
        $(that).find('li').hide();
        $(that).find('li .faopen').show();
        $(that).find('li .faclose').hide();
    }
    active4 = '';
}

function _select(e) {
    var tab = $('.searchcontent .selectusers');
    tab.find('.treechildh').hide();
    tab.find('.treechildh').removeClass('active');
    tab.find('.treechilds').show();
    $(e).removeClass('active').hide();
    $(e).next().show();
}

function _cancel(e) {
    var tab = $('.searchcontent .selectusers');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).hide();
    $(e).prev().show().addClass('active');
}

// 搜索
function searchlist() {
    var keyword = $('.widget-btn input[name=searchval]').val();
    st == 2;
    listUsers(1, 10, keyword);
}

// 用户列表
function listUsers(start, length, keyword) {
    var tag_id;
    var status = '';
    var depart_name = '';
    var url = '/man/user/getMembers';
    var json = {
        start: start,
        length: length
    };
    var tab;
    var tagname = '';
    var resetpwd = '';
    if (keyword) {
        json['keyword'] = keyword;
    }

    var table = $('.userlist .usertable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>' +
            '<th class="sel" style="line-height:20px;">' +
            '<div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)" />' +
            '<span class="text">全选</span></label></div></th>' +
            '<th>姓名</th>' +
            '<th>账号</th>' +
            '<th>邮箱</th>' +
            '<th>手机号</th>' +
            '<th>已激活设备</th>' +
            '<th>用户组</th>' +
            '<th>标签</th>' +
            '<th>状态</th>' +
            '<th>策略</th>' +
            '<th>操作</th></tr>';
    $.silentGet('/man/user/getUserList', json, function (data) {
        if (data.rt == '0000') {
            var nAnd = 0, nIOS = 0;
            for (var i in data.user_list) {
                if (data.user_list[i].status) {
                    resetpwd = '<a class="btn btn-primary btn-xs" href="javascript:user_resetpwd(' + i + ');">修改密码</a>';
                    status = '已激活';
                } else {
                    resetpwd = '<a class="btn btn-primary btn-xs disabled">修改密码</a>';
                    status = '未激活';
                }
                if (typeof data.user_list[i].dev_num != 'number') {
                    nAnd = data.user_list[i].dev_num['android'];
                    nIOS = data.user_list[i].dev_num['ios'];
                } else {
                    nAnd = data.user_list[i].dev_num;
                }

                depart_name = data.user_list[i].depart_name == -1 ? '' : data.user_list[i].depart_name;
                tagname = '<a href="javascript:tag_list(' + i + ');">' + data.user_list[i].tag_num + '</a>';
                str += '<tr data-id="' + data.user_list[i].id + '">' +
                    '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)" />' +
                    '<span class="text"></span></label></div></td>' +
                    '<td>' + data.user_list[i].name + '</td>' +
                    '<td>' + data.user_list[i].account + '</td>' +
                    '<td class="ellipsis" title="'+  data.user_list[i].email +'">' + data.user_list[i].email + '</td>' +
                    '<td>' + data.user_list[i].phone + '</td>' +
                    '<td class="dev-list">' +
                    '<i class="iconfont icon-android">' + nAnd + '</i>' +
                    '<i class="iconfont icon-IOS">' + nIOS + '</i>' +
                    '</td>' +
                    '<td>' + depart_name + '</td>' +
                    '<td>' + tagname + '</td>' +
                    '<td>' + status + '</td>' +
                    '<td style="display:none;">' + data.user_list[i].id + '</td>' +
                    '<td style="display:none;">' + data.user_list[i].status + '</td>' +
                    '<td style="display:none;">' + data.user_list[i].depart_id + '</td>' +
                    '<td>' +
                    '<a href="javascript:policy_list(' + i + ');">' + data.user_list[i].policy_num + '</a>' +
                    '</td>' +
                    '<td class="other">' +
                    '<a href="javascript:user_modify(' + i + ');" class="modifyhref btn btn-primary btn-xs">编辑</a>' +
                    resetpwd +
                    '</td></tr>';
            }
            str += '</table>';
            table.html(str);
            createFooter(start, length, data.total_count, 1);
            table.find('td.dev-list').bind('click', dev_list);
        }
    });
    $('.hrefactive').removeClass("hrefallowed");
    currentpage = start;
}

// page页查询
function search(p, i) {
    if (i == 1) {
        listUsers(p, 10, '');
    } else {
        console.warn(i);
    }
}

// 查看
function policy_list(i) {
    var _tr = $('.usertable table tr').eq(i + 1);
    var id = _tr.find('td').eq(9).text() * 1;
    var strtab1 = '<table class="table table-hover"><tr>' +
        '<th>策略名称</th>' +
        '<th>类型</th>' +
        '<th>创建者</th>' +
        '<th>状态</th>' +
        '<th>操作</th>' +
        '</tr>';
    var status;
    var cont = '';
    var policy_type = '';
    var str = '';
    var postData = {
        id: id
    };
    $.silentPost('/man/user/getPolicyByUserId', postData, function (data) {
        if (data.rt == '0000') {
            for (var i in data.doc) {
                status = data.doc[i].status == 1 ? '已启用' : '已禁用';
                if (data.doc[i].policy_type === 'geofence') {
                    policy_type = '地理围栏策略';
                } else if (data.doc[i].policy_type === 'device') {
                    policy_type = '设备策略';
                } else if (data.doc[i].policy_type === 'complicance') {
                    policy_type = '合规策略';
                } else if (data.doc[i].policy_type === 'timefence') {
                    policy_type = '时间围栏策略';
                } else if (data.doc[i].policy_type === 'whiteapp') {
                    policy_type = '白名单策略';
                } else if (data.doc[i].policy_type === 'blackapp') {
                    policy_type = '黑名单策略';
                } else if (data.doc[i].policy_type === 'customer') {
                    policy_type = '客户端策略';
                } else if (data.doc[i].policy_type === 'limitaccess') {
                    policy_type = '限制访问策略';
                } else {
                    console.warn(data.doc[i].policy_type);
                    policy_type = '未知类型';
                }
                str = data.doc[i].name == '默认策略' ? '' : '<a href="javascript:user_remove(' + i + ');">移出策略</a>';
                strtab1 += '<tr>' +
                    '<td>' + data.doc[i].name + '</td>' +
                    '<td>' + policy_type + '</td>' +
                    '<td>' + data.doc[i].creator + '</td>' +
                    '<td>' + status + '</td>' +
                    '<td style="display:none;">' + data.doc[i].id + '</td>' +
                    '<td style="display:none;">' + data.doc[i].policy_type + '</td>' +
                    '<td>' +
                    str +
                    '</td></tr>';
            }
            strtab1 += '</table>';
            cont += '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
                '<h4 class="modal-title">策略列表</h4>' +
                '</div>' +
                '<div class="modal-body" style="max-height:340px;overflow-y:auto;">' +
                '<input name="userId" value="' + id + '" style="display:none;" />' +
                strtab1 +
                '</div>' +
                '<div class="modal-footer"></div>';
            alertOpen(cont);
        }
    });
}
// 移除策略
function user_remove(i) {
    var _tr = $('.modal-body table tr').eq(i + 1);
    var policy_id = _tr.find('td').eq(4).text() * 1;
    var uid = $('.modal-body input[name=userId]').val() * 1;
    var policy_type = _tr.find('td').eq(5).text();
    var postData = {
        uid: uid,
        policy_id: policy_id,
        policy_type: policy_type
    };
    $.actPost('/man/railpolicy/unbindPolicy', postData, function (data) {
        if (data.rt == '0000') {
            _tr.css({ 'display': 'none' });
        }
    });
}
// 查看
function dev_list(e) {
    var td = $(e.currentTarget);
    td.unbind('click');
    setTimeout(function () {
        td.unbind('click').bind('click', dev_list);
    }, 5000)
    var platform, showDevType;
    if ($(e.target).hasClass('icon-android')) {
        platform = 'android';
        showDevType = 'Android';
    } else if ($(e.target).hasClass('icon-IOS')) {
        platform = 'ios';
        showDevType = 'iOS';
    } else {
        td.bind('click', dev_list);
        return;
    }
    var strtab1 = '<table class="table table-hover"><tr>' +
        '<th>设备名称</th>' +
        '<th>类型</th>' +
        '<th>状态</th>' +
        '<th>版本</th>' +
        '</tr>';
    var status;
    var cont = '';
    $.silentGet('/man/user/getDeviceList', {
        id: $(e.target).parents('tr').data('id')
    }, function (data) {
        td.unbind('click').bind('click', dev_list);
        if (data.rt == '0000') {
            for (var i in data.doc) {
                if (data.doc[i].platform == platform) {
                    if (data.doc[i].dev_name && data.doc[i].dev_system) {
                        status = data.doc[i].online == 1 ? '在线' : '离线';
                        strtab1 += '<tr>' +
                            '<td>' + data.doc[i].dev_name + '</td>' +
                            '<td>' + showDevType + '</td>' +
                            '<td>' + status + '</td>' +
                            '<td>' + data.doc[i].dev_system + '</td></tr>';
                    }
                }
            }
            if (strtab1.indexOf('<td>') == -1) {
                strtab1 += '<td colspan=4>暂无激活的' + showDevType + '设备</td>'
            }
            strtab1 += '</table>';
            cont += '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
                '<h4 class="modal-title">已激活' + showDevType + '设备</h4>' +
                '</div>' +
                '<div class="modal-body" style="max-height:340px;overflow-y:auto;">' +
                strtab1 +
                '</div>' +
                '<div class="modal-footer"></div>';
            alertOpen(cont);
        }
    });
}
// 查看
function tag_list(i) {
    var _tr = $('.usertable table tr').eq(i + 1);
    var id = _tr.find('td').eq(9).text() * 1;
    var strtab1 = '<table class="table table-hover"><tr>' +
        '<th>名称</th>' +
        '<th>状态</th>' +
        '<th>类型</th>' +
        '</tr>';
    var status, tag_type;
    var cont = '';
    $.silentGet('/man/user/getTagList', {
        id: id
    }, function (data) {
        if (data.rt == '0000') {
            for (var i in data.doc) {
                status = data.doc[i].status == 1 ? '正常' : '禁用';
                tag_type = data.doc[i].tag_type == 1 ? '动态标签' : '静态标签';
                strtab1 += '<tr>' +
                    '<td>' + data.doc[i].name + '</td>' +
                    '<td>' + status + '</td>' +
                    '<td>' + tag_type + '</td></tr>';
            }
            strtab1 += '</table>';
            cont += '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
                '<h4 class="modal-title">标签列表</h4>' +
                '</div>' +
                '<div class="modal-body" style="max-height:340px;overflow-y:auto;">' +
                strtab1 +
                '</div>' +
                '<div class="modal-footer"></div>';
            alertOpen(cont);
        }
    });
}

// 添加标签
function addTotag() {
    var i = 0;
    var tr;
    var cont = '';
    var tab = $('.usertable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            i = i + 1;
        }
    });

    if (i > 0) {
        cont += '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
            '<h4 class="modal-title">移动至标签</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<form role = "form" class="form-horizontal">' +
            '<div class = "form-group">' +
            '<label class="col-sm-3 control-label" for = "name">请选择标签</label>' +
            '</div>' +
            '<div class = "form-group">' +
            '<div class="col-sm-7 col-sm-offset-2">' +
            '<div id="usertag" style="height:atuo;max-height:180px;padding:5px;overflow-y:auto;">' +
            '<ul name="taglist" class="list-group">' +
            '</ul>' +
            '</div>' +
            '</div></div>' +
            '</form>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
            '<button type="button" class="btn btn-primary" onclick="tag_add()">确认</button>' +
            '</div>';
        alertOpen(cont);
        var str = '';
        getTags(function (data) {
            var select = $('#usertag ul[name=taglist]');
            for (var i in data.tag_list) {
                str += '<li class="list-group-item cursor" onclick="selectonetag(this)">' +
                    data.tag_list[i].name +
                    '<input type="text" name="tagid" value="' + data.tag_list[i].id + '" style="display:none" />' +
                    '</li>';
            }
            select.html(str);
        })
    }
}

function tag_add() {
    var tag_id;
    var tab = $('#usertag ul[name=taglist]');
    tab.find('li').each(function () {
        if ($(this).hasClass('tagactive')) {
            tag_id = $(this).find('input[name=tagid]').val() * 1;
        }
    });

    var userId = [],
        app_list = [],
        j = 0;
    var tr;
    var tab1 = $('.usertable table');
    tab1.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            userId[j] = tr.find('td').eq(9).text() * 1;
            j = j + 1;
        }
    });
    if (tag_id) {
        var postData = {
            tag_id: tag_id,
            user_list: JSON.stringify(userId),
            app_list: JSON.stringify(app_list)
        };
        $.actPost('/man/tag/addUsers', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
            }
        });
    }

}

function selectonetag(e) {
    if ($(e).hasClass('tagactive') == true) {
        $('#usertag ul[name=taglist] li').removeClass('tagactive');
    } else {
        $('#usertag ul[name=taglist] li').removeClass('tagactive');
        $(e).addClass('tagactive');
    }
}

// 添加用户组
function addTousers() {
    var i = 0;
    var tr;
    var cont = '';
    var label = '';
    var tab = $('.usertable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            i = i + 1;
        }
    });
    if (i > 0) {
        cont += '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
            '<h4 class="modal-title">移动至用户组</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<form role = "form" class="form-horizontal">' +
            '<div class = "form-group">' +
            '<label class="col-sm-3 control-label" for = "name">请选择要移至的用户组</label>' +
            '</div>' +
            '<div class = "form-group">' +
            '<ul class="mdlTree">' +
            '</ul>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
            '<button type="button" class="btn btn-primary" onclick="users_add()">确认</button>' +
            '</div>';
        alertOpen(cont);
        getUsers(function (data) {
            $(".modal-body .mdlTree").html(liInUl(data));
            active2 = '';
        })
    }
}

function liInUl(data) {
    var s = '';
    for (var i in data.depart_list) {
        if (data.depart_list[i].id != -1) {
            if (data.depart_list[i].status == 1) {
                if (data.depart_list[i].child_node != 0) {
                    label = '<i data-id="' + data.depart_list[i].id + '" onclick="toggleUsers(this)" class="fa fa-plus"></i>'
                        + '<label>'
                        + '<input name="depart_list" value="' + data.depart_list[i].id + '" type="radio" />'
                        + '<span class="text">' + data.depart_list[i].name + '</span>'
                        + '</label>'
                } else {
                    label = '<label>'
                        + '<input name="depart_list" value="' + data.depart_list[i].id + '" type="radio" />'
                        + '<span class="text">' + data.depart_list[i].name + '</span>'
                        + '</label>'
                }
                s += '<li>'
                    + '<div class="radio">'
                    + label
                    + '</div></li>';
            } else {
                console.warn('禁用：', data.depart_list[i])
            }
        }
    }
    return s;
}

// 用户添加至用户组
function users_add() {
    var userId = [],
        i = 0;
    var tr;
    var tab = $('.usertable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            userId[i] = tr.find('td').eq(9).text() * 1;
            i = i + 1;
        }
    });
    var depart_id = $('.modal-body .mdlTree input:radio:checked[name=depart_list]').val();
    var postData = {
        depart_id: depart_id,
        user_list: JSON.stringify(userId)
    };
    if (postData.depart_id) {
        $.actPost('/man/users/addUsers', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
            }
        });
    } else {
        warningOpen('请选择添加用户组！', 'danger', 'fa-bolt');
    }

}
// 用户添加至用户组
var active2 = '';

function toggleUsers(ele) {
    var id = $(ele).attr('data-id'),
        i = $(ele),
        li = $($(ele).parents('li')[0]);
    if (i.hasClass('fa-plus')) {
        if (li.next('ul').length === 0) {
            var str = '<ul>';
            $.silentGet('/man/users/getUsersList', { 'depart_id': id }, function (data) {
                if (data.rt == '0000') {
                    str += liInUl(data);
                    str += '</ul>'
                    li.after(str);
                }
            })
        }
    }
    li.next('ul').toggleClass('hidden', i.hasClass('fa-minus'));
    i.toggleClass('fa-plus fa-minus');
}

function toggledepart(e, index) {
    var that = $(e).parent().parent();
    if (index === 'show') {
        $(e).hide();
        $(e).next().css('display', 'inline-block');
        $(that).find('ul:first > li').show();
        $(that).find('li .faopen').show();
        $(that).find('li .faclose').hide();
    } else {
        $(e).hide();
        $(e).prev().css('display', 'inline-block');
        $(that).find('li').hide();
        $(that).find('li .faopen').show();
        $(that).find('li .faclose').hide();
    }
    index = '';
}

// 返回用户列表
function userlist() {
    $('.tab, .addusertitle,.user_add, .viewtitle,.user_view , .modifytitle,.user_mod').css({ 'display': 'none' });
    $('.userlist').css({ 'display': 'block' });
}
//修改用户密码
function user_resetpwd(i) {
    var cont = '';
    cont += '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
        '<h4 class="modal-title">修改密码</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<form role = "form" class="form-horizontal">' +
        '<div class = "form-group">' +
        '<label class="col-sm-3 control-label" for = "newpwd">新密码</label>' +
        '<div class="col-sm-7">' +
        '<input type="password" class = "form-control" id = "newpwd" name="newpwd" placeholder = "请输入新密码" />' +
        '</div></div>' +
        '<div class = "form-group">' +
        '<label class="col-sm-3 control-label" for = "confirpw">确认新密码</label>' +
        '<div class="col-sm-7">' +
        '<input type="password" class = "form-control" id = "confirpw" name="confirpw" placeholder = "再次输入新密码" />' +
        '</div></div>' +
        '</form>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
        '<button type="button" class="btn btn-primary" onclick="user_updatePW(' + i + ')">确认</button>' +
        '</div>';
    alertOpen(cont);
}
// 管理员修改用户密码提交操作
function user_updatePW(i) {
    var _tr = $('.usertable table tr').eq(i + 1);
    var account = _tr.find('td').eq(2).text();
    var newpw = $('input[name=newpwd]').val();
    var confirpw = $('input[name=confirpw]').val();
    var postData = {
        newpw: newpw,
        account: account
    };
    if (postData.newpw == '') {
        warningOpen('请输入新密码！', 'danger', 'fa-bolt');
    } else if (confirpw != postData.newpw) {
        warningOpen('前后密码不一致！', 'danger', 'fa-bolt');
    } else {
        $.actPost('/man/user/updatePwd', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
            }
        });
    }
}

// 管理员修改用户信息
function user_modify(i) {
    var tab2 = $('.user_mod .selectusers');
    var _tr = $('.usertable table tr').eq(i + 1);
    var id = _tr.find('td').eq(9).text() * 1;
    var name = _tr.find('td').eq(1).text();
    var email = _tr.find('td').eq(3).text();
    var phone = _tr.find('td').eq(4).text();
    var depart_id = _tr.find('td').eq(11).text();
    var tagid = [];
    var str = '';
    var folder = '';
    var str2 = '<ul class="mdlTree">';
    var select;
    var tagdata;
    $('input[name=uid]').val(id);
    $('input[name=groupid]').val(depart_id);
    $('input[name=uname]').val(name);
    $('input[name=uemail]').val(email);
    $('input[name=uphone]').val(phone);
    $('.userlist').css({ 'display': 'none' });
    $('.user_mod').css({ 'display': 'block' });
    $('.modifytitle').css({ 'display': 'inline-block' });
    getTags(function (tagdata) {
        if (JSON.stringify(tagdata) !== "{}") {
            select = $('.user_mod ul[name=utag]');
            for (var i in tagdata.tag_list) {
                str += '<li class="list-group-item cursor" onclick="selecttag(this)" style="padding-left:12px;">' +
                    tagdata.tag_list[i].name +
                    '<input type="text" name="tagid" value="' + tagdata.tag_list[i].id + '" style="display:none" />' +
                    '</li>';
            }
            select.html(str);
        }
    })

    $.silentGet('/man/user/getTagList', {
        id: id
    }, function (data) { // 获取标签列表
        if (data.rt == '0000') {
            for (var i in data.doc) {
                var tab1 = $('.user_mod ul[name=utag]');
                tab1.find('li').each(function () {
                    if ($(this).find('input[name=tagid]').val() * 1 == data.doc[i].id) {
                        $(this).addClass('tagactive')
                    }
                });
            }
        }
    });
    getUsers(function (usersdata) {
        if (JSON.stringify(usersdata) !== "{}") {
            str2 += liInUl(usersdata);
            str2 += '</ul>'
            tab2.html(str2);
            active3 = '';
            tab2.find('.treechildh').each(function () {
                if ($(this).find('input[name=tree_id]').val() == depart_id) {
                    $(this).show();
                    $(this).parent().find('.treechilds').hide();
                }
            });
        }
    })


}

// 修改用户信息提交
function user_mod() {
    var tag_id = [];
    var i = 0;
    var tab = $('.user_mod ul[name=utag]');
    tab.find('li').each(function () {
        if ($(this).hasClass('tagactive')) {
            tag_id[i] = $(this).find('input[name=tagid]').val() * 1;
            i = i + 1;
        }
    });
    var depart_id;
    var tab2 = $('.user_mod .selectusers');
    tab2.find('input[name=depart_list]').each(function () {
        if ($(this).prop('checked')) {
            depart_id = $(this).val() * 1;
        }
    });
    if (!depart_id) { depart_id = $('.user_mod input[name=groupid]').val() * 1; }
    var postData = {
        id: $('.user_mod input[name=uid]').val(),
        name: $('.user_mod input[name=uname]').val(),
        email: $('.user_mod input[name=uemail]').val(),
        phone: $('.user_mod input[name=uphone]').val(),
        depart_id: depart_id,
        tag_id: JSON.stringify(tag_id)
    };
    // 邮箱验证
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    var regtel = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if (postData.name == "") {
        warningOpen('请填写姓名！', 'danger', 'fa-bolt');
    } else if (!reg.test(postData.email)) {
        warningOpen('请填写正确的邮箱！', 'danger', 'fa-bolt');
    } else if (postData.tag_id == "") {
        warningOpen('请选择标签！', 'danger', 'fa-bolt');
    } else {
        $.actPost('/man/user/updateUser', postData, function (data) {
            if (data.rt == '0000') {
                userlist();
                refresh();
            }
        });
    }
}
// 用户修改用户组
var active3 = '';

function fnopenusers(e) {
    var id = $(e).parent().find('input[name=tree_id]').eq(0).val() * 1;
    var tab = $('.user_mod .selectusers');
    var isFindChild = true;
    var folder = '';
    tab.find('input[name=p_id]').each(function () {
        if ($(this).val() == id) {
            isFindChild = false;
            active3 = $(this).parent().parent().is(":visible") == true ? 'hide' : 'show';
        }
    });
    if (isFindChild) {
        $(e).css('display', 'none');
        $(e).next('.faclose').css('display', 'inline-block');
        var str = '<ul class="mdlTree">';
        $.silentGet('/man/users/getUsersList', {
            depart_id: id
        }, function (data) {
            if (data.rt == '0000') {
                str += liInUl(data);
                str += '</ul>';
                $(e).parent().append(str);
            }
        });
    } else {
        toggleuser(e);
    }
}

function toggleuser(e) {
    var that = $(e).parent().parent();
    if (active3 === 'show') {
        $(e).hide();
        $(e).next('.faclose').css('display', 'inline-block');
        $(that).find('ul:first > li').show();
        $(that).find('li .faopen').show();
        $(that).find('li .faclose').hide();
    } else {
        $(e).hide();
        $(e).prev().css('display', 'inline-block');
        $(that).find('li').hide();
        $(that).find('li .faopen').show();
        $(that).find('li .faclose').hide();
    }
    active3 = '';
}

function add() {
    var cont = '';
    cont += '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
        '<h4 class="modal-title">添加用户</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<form role = "form" class="form-horizontal">' +
        '<div class = "form-group" style="text-align:center;font-size:24px;margin-bottom:0;margin-top:15px;">' +
        '<div class="col-sm-4 col-sm-offset-2">' +
        '<a href="javascript:adduser()">' +
        '<i class="icon glyphicon glyphicon-log-in"></i>' +
        '</a>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<a href="javascript:importusers()">' +
        '<i class="icon glyphicon glyphicon-cloud-upload"></i>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '<div class = "form-group" style="text-align:center;">' +
        '<div class="col-sm-4 col-sm-offset-2">' +
        '<a href="javascript:adduser()">' +
        '手工录入' +
        '</a>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<a href="javascript:importusers()">' +
        '批量导入' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</form>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
        '</div>';
    alertOpen(cont);
}

function importusers() {
    var sid = $.cookie('sid');
    var hosturl = localStorage.getItem("appssec_url");
    var url = hosturl + '/p/org/bulkLoad';
    var cont = '';
    cont += '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
        '<h4 class="modal-title">批量导入</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p class="userupload" style="display:none;color:red;text-align:center;">正在上传......</p>' +
        '<iframe name="ifm" style="display:none;"></iframe>' +
        '<form id="addUserFile" method="post" action="' + url + '" enctype="multipart/form-data" target="ifm" autocomplete="off" role = "form" class="form-horizontal">' +
        '<div class = "form-group">' +
        '<label class="col-sm-3 control-label">模板</label>' +
        '<div class="col-sm-6" style="overflow:hidden;">' +
        '<a href="javascript:importexcel()">' +
        '下载导入模板' +
        '</a>' +
        '</div></div>' +
        '<input name="sid" value="' + sid + '" style="display:none;" />' +
        '<div class = "form-group">' +
        '<label class="col-sm-3 control-label" for = "file_data">文件</label>' +
        '<div class="col-sm-6" style="overflow:hidden;">' +
        '<input type = "file" name="file_data" id="file_data" />' +
        '</div></div>' +
        '<div class="modal-footer" style="margin-left:-15px;margin-right:-15px;margin-bottom:-15px;">' +
        '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
        '<button type="submit" id="submit" class="btn btn-primary">确认</button>' +
        '</div>' +
        '</form>' +
        '</div>';
    alertOpen(cont);
    $('#addUserFile').submit(function () {
        $(this).ajaxSubmit({
            resetForm: true,
            beforeSubmit: function () {
                $('.userupload').css({ 'display': 'block' });
            },
            success: function (data) {
                $.handleECode(true, data)
                alertOff();
            }
        });
        return false;
    });
}

function importexcel() {
    downloadFile(localStorage.getItem("appssec_url") + '/p/org/templateDownload?name=userTemplate.xls');
}
// 下载
function downloadFile(url) {
    try {
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    } catch (e) {
        console.warn(url);
    }
}
// 手工录入
function adduser() {
    alertOff();
    $('.user_add input').val('');
    $('.userlist').css({ 'display': 'none' });
    $('.user_add').css({ 'display': 'block' });
    $('.addusertitle').css({ 'display': 'inline-block' });
    var str = '';
    var folder = '';
    var str2 = '<ul class="mdlTree">';
    var data1;
    var data2;
    getTags(function (data1) {
        if (JSON.stringify(data1) !== "{}") {
            var select = $('.user_add ul[name=taglist]');
            for (var i in data1.tag_list) {
                if (data1.tag_list[i].status) {
                    str += '<li class="list-group-item cursor" onclick="selecttag(this)">' +
                        data1.tag_list[i].name +
                        '<input type="text" name="tagid" value="' + data1.tag_list[i].id + '" style="display:none" />' +
                        '</li>';
                } else {
                    console.warn('禁用：', data1.tag_list[i])
                }

            }
            select.html(str);
        }
    })

    getUsers(function (data2) {
        if (JSON.stringify(data2) !== "{}") {
            str2 += liInUl(data2);
            str2 += '</ul>';
            $(".user_add .selectusers").html(str2);
            active1 = '';
        }
    })

}
var active1 = '';

function opentrees(e) {
    var id = $(e).parent().find('input[name=tree_id]').eq(0).val() * 1;
    var tab = $('.user_add .selectusers');
    var isFindChild = true;
    var folder = '';
    tab.find('input[name=p_id]').each(function () {
        if ($(this).val() == id) {
            isFindChild = false;
            active1 = $(this).parent().parent().is(":visible") == true ? 'hide' : 'show';
        }
    });
    if (isFindChild) {
        $(e).css('display', 'none');
        $(e).next().css('display', 'inline-block');
        var str = '<ul class="mdlTree">';
        $.silentGet('/man/users/getUsersList', {
            depart_id: id
        }, function (data) {
            if (data.rt == '0000') {
                str += liInUl(data);
                str += '</ul>';
                $(e).parent().append(str);
            }
        });
    } else {
        toggledepart(e, active1);
    }
}

function select(e) {
    var tab = $('.selectusers');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    //$(e).siblings('.treechilds').show();
}

function cancel(e) {
    var tab = $('.selectusers');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).hide();
    $(e).prev().show();
}

function selecttag(e) {
    $(e).hasClass('tagactive') == true ? $(e).removeClass('tagactive') : $(e).addClass('tagactive');
}
// 随机生成六位数激活码
function activationpwd() {
    var pwd = Math.round(900000 * Math.random() + 100000);
    $('input[name=activation_pwd]').val(pwd);
}

// 添加用户提交操作 
function user_add(flag) {
    var tag_id = [];
    var i = 0;
    var tab = $('.user_add ul[name=taglist]');
    tab.find('li').each(function () {
        if ($(this).hasClass('tagactive')) {
            tag_id[i] = $(this).find('input[name=tagid]').val() * 1;
            i = i + 1;
        }
    });
    var depart_id;
    var tab2 = $('.user_add .selectusers');
    tab2.find('input[name=depart_list]').each(function () {
        if ($(this).prop('checked')) {
            depart_id = $(this).val() * 1;
        }
    });
    var postData = {
        name: $('.user_add input[name=username]').val(),
        email: $('.user_add input[name=email]').val(),
        phone: $('.user_add input[name=phone]').val(),
        depart_id: depart_id,
        account: $('.user_add input[name=account]').val(),
        active_code: $('.user_add input[name=activation_pwd]').val(),
        valid_time: $('.user_add input[name=valid_time]').val(),
        tag_id: JSON.stringify(tag_id),
        flag: flag
    };
    // 邮箱验证
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    var regtel = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if (postData.name == "") {
        warningOpen('请填写姓名！', 'danger', 'fa-bolt');
    } else if (!reg.test(postData.email)) {
        warningOpen('请填写正确的邮箱！', 'danger', 'fa-bolt');
    } else if (!postData.depart_id) {
        warningOpen('请选择所属用户组！', 'danger', 'fa-bolt');
    } else if (postData.account == "") {
        warningOpen('请填写账号！', 'danger', 'fa-bolt');
    } else if (postData.active_code == "") {
        warningOpen('请填写激活密码！', 'danger', 'fa-bolt');
    } else if (postData.valid_time == "") {
        warningOpen('请填写密码有效期！', 'danger', 'fa-bolt');
    } else if (postData.tag_id == "") {
        warningOpen('请选择标签！', 'danger', 'fa-bolt');
    } else {
        $.actPost('/man/user/addUser', postData, function (data) {
            if (data.rt == '0000') {
                userlist();
                refresh();
            }
        });
    }
}
// 刷新
function refresh() {
    st = 1;
    $('th span,td span').removeClass('txt');
    listUsers(currentpage, 10, '');
    $('.widget-btn input[name=searchval]').val('');
    $('.hrefactive').removeClass("hrefallowed");
    $('.searchcontent .tag li').removeClass('tagactive');
    var tab = $('.searchcontent .selectusers');
    tab.find('.treechildh').hide();
    tab.find('.treechildh').removeClass('active');
    tab.find('.treechilds').show();
}

// 激活
function invent() {
    var i = 0;
    var tr;
    var status = 0;
    var tab = $('.usertable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            i = 1;
            tr = $(this).parents("tr");
            if (tr.find('td').eq(10).text() == 1) {
                status = 1;
            }
        }
    });

    var cont = '';
    if (i > 0 && status === 0) {
        cont += '<div class="modal-header">' +
            ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
            '<h4 class="modal-title">提示</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>确定激活？</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
            '<button type="button" class="btn btn-primary" onclick="user_invent()">确认</button>' +
            '</div>';
        alertOpen(cont);
    } else {
        warningOpen('请选择未激活的用户进行激活！', 'danger', 'fa-bolt');
    }
}

// 企业管理员激活多个用户
function user_invent() {
    var userId = [],
        i = 0;
    var tr;
    var tab = $('.usertable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt') && $(this).parents("tr").find('td').eq(10).text() == 0) {
            tr = $(this).parents("tr");
            userId[i] = tr.find('td').eq(9).text() * 1;
            i = i + 1;
        }
    });
    if (userId.length > 0) {
        var postData = {
            user_list: JSON.stringify(userId)
        };
        $.actPost('/man/user/activeInvite', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
            }
        });
    } else {
        warningOpen('已激活用户不能再次发激活邀请！', 'danger', 'fa-bolt');
    }
}

// 删除
function deletes() {
    var i = 0;
    var tab = $('.usertable table');
    if (tab.find('span').hasClass('txt')) {
        i = 1;
    }
    var cont = '';
    if (i > 0) {
        cont += '<div class="modal-header">' +
            ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
            '<h4 class="modal-title">提示</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>确定删除？</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
            '<button type="button" class="btn btn-primary" onclick="user_delete()">确认</button>' +
            '</div>';
        alertOpen(cont);
    }
}

// 企业管理员删除多个用户
function user_delete() {
    var userId = [],
        i = 0;
    var tr;
    var tab = $('.usertable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            userId[i] = tr.find('td').eq(9).text() * 1;
            i = i + 1;
        }
    });
    if (userId.length > 0) {
        var postData = {
            users: JSON.stringify(userId)
        };
        $.actPost('/man/user/delUser', postData, function (data) {
            if (data.rt == '0000') {
                st = 1;
                listUsers(1, 10, '');
                alertOff();
            }
        });
    }
}