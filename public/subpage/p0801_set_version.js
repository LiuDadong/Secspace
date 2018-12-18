/*
 * ==================================================================
 *                          版本管理 version
 * ==================================================================
 */

// 版本列表
getVersionList(1, 10);
// 版本列表
function getVersionList(start, length) {
    var st = 1;
    var table = $('.versiontable'),
        str = '<table class="table table-striped table-bordered table-hover" id="expandabledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
            + '<input type="checkbox" onclick="selectedAll(this)" />'
            + '<span class="text">全选</span></label></div></th>'
            + '<th>版本名称</th>'
            + '<th>版本编号</th>'
            + '<th>平台</th>'
            + '<th>设备类型</th>'
            + '<th>状态</th>'
            + '<th>创建时间</th>'
            + '<th>其他操作</th></tr>';
    var url = '/man/file/listApp?start_page=' + start + '&page_length=' + length;
    $.get(url, function (data) {
        data = JSON.parse(data);
        if (data.rt == '0000') {
            if (data.appList.length != 0) {
                for (i in data.appList) {
                    var iptchk='<input type="checkbox" onclick="selected(this)" />',tdStatus = '', aStatus = '';
                    switch (data.appList[i].status) {
                        case '0':
                            tdStatus = '<td style="color:#5db2ff">待生效</td>';
                            aStatus = '<a class="btn" href="javascript:version(' + i + ');">生效</a>';
                            break;
                        case '1':
                            iptchk='';
                            tdStatus = '<td><a>正在生效</a></td>';
                            break;
                        case '2':
                            tdStatus = '<td style="color:#d73d32">已失效</td>';
                            break;
                        default:
                            console.warn('请检查data.appList[i].status')
                    }
                    str += '<tr>'
                        + '<td class="sel"><div class="checkbox"><label>'+ iptchk +'<span class="text"></span></label></div></td>'
                        + '<td class="detail" style="cursor:pointer;"><a>' + data.appList[i].name + '</a></td>'
                        + '<td>' + data.appList[i].versioncode + '</td>'
                        + '<td>' + (data.appList[i].platform == 'ios' ? 'iOS' : 'Android') + '</td>'
                        + '<td>' + data.appList[i].dev_type + '</td>'
                        + '<td style="display:none;">' + data.appList[i]._id + '</td>'
                        + '<td style="display:none;">' + (data.appList[i].describe?data.appList[i].describe:'') + '</td>'
                        + '<td style="display:none;">' + data.appList[i].path + '</td>'
                        + tdStatus
                        + '<td>' + data.appList[i].create_time + '</td>'
                        + '<td class="other">'
                        + aStatus
                        + '<a class="btn" href="javascript:version_download(' + i + ');">下载</a>'
                        + '<a class="btn" href="javascript:version_modify(' + i + ');">修改信息</a>'
                        + '</td></tr>'
                        + '<tr style="display:none;">'
                        + '<td colspan="6" style="border:none;"><p style="margin-top:10px;">更新内容：' + data.appList[i].describe + '</p></td>'
                        + '</tr>';
                }
            } else {
                str += '<tr><td colspan="6">暂无版本信息</td></tr>'
            }
            str += '</table>';
            table.html(str);
            table.find('table').data('data',data);
            createFooter(start, length, data.total_count, st);
        } else if (data.rt == 5) {
            toLoginPage();
        }
    });

    currentpage = start;
    setTimeout("func()", "2000");
}

function func() {
    $('.versiontable tr').each(function () {
        $(this).find('.detail').click(function () {
            $(this).parent('tr').next('tr').toggle();
        });
    });
}

// page页查询
function search(p, i) {
    if (i == 1) {
        getVersionList(p, 10);
    } else {
        console.warn(i);
    }
}

// 取消生效
function version_cancel(i) {
    var item=$('.versiontable table').data('data').appList[i];
    $.actPost('/man/version/authSecspace', {
        _id: item._id,
        status: '2',
        platform:item.platform,
        dev_type:item.dev_type
    }, function (data) {
        if (data.rt == '0000') {
            getVersionList(currentpage, 10);
        } else if (data.rt == 5) {
            toLoginPage();
        } else {
            // warningOpen('其它错误 ', 'danger', 'fa-bolt');
        }
    });
}

// 版本生效
function version(i) {
    var _tr = $('.versiontable table tr').eq(2 * i + 1);
    var _id = _tr.find('td').eq(5).text();
    var postData = {
        _id: _id,
        status: 1,
        platform:_tr.find('td').eq(3).text()=='iOS'?'ios':'android',
        dev_type:_tr.find('td').eq(4).text(),
    };
    $.actPost('/man/version/authSecspace', postData, function (data) {
        if (data.rt == '0000') {
            getVersionList(currentpage, 10);
        } else if (data.rt == 5) {
            toLoginPage();
        } else {
            // warningOpen('其它错误 ', 'danger', 'fa-bolt');
        }
    });
}

// 下载
function downloadFile(url) {
    try {
        var elemIF = document.createElement("iframe");
        $(elemIF).attr('src', url).css('display', 'none');
        document.body.appendChild(elemIF);
    } catch (e) {
        console.error(e);
        console.warn(url);
    }
}

// 下载版本
function version_download(i) {
    var _tr = $('.versiontable table tr').eq(2 * i + 1);
    var path = _tr.find('td').eq(7).text();
    var url = downurl + path;
    downloadFile(url);
}

// 修改版本
function version_modify(i) {
    var _tr = $('.versiontable table tr').eq(2 * i + 1);
    var cont = '';
    cont += '<div class="modal-header">'
        + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
        + '<h4 class="modal-title">修改版本信息</h4>'
        + '</div>'

        + '<div class="modal-body">'
        + '<form role = "form" class="form-horizontal">'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "name">版本名称</label>'
        + '<div class="col-sm-7">'
        + '<input type = "text" class = "form-control" id = "name" name="name" value="' + _tr.find('td').eq(1).text() + '" />'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "versioncode">版本编号</label>'
        + '<div class="col-sm-7">'
        + '<input type="text" class="form-control" id = "versioncode" name="versioncode" value="' + _tr.find('td').eq(2).text() + '" />'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "describe">版本详情</label>'
        + '<div class="col-sm-7">'
        + '<span class="input-icon icon-right">'
        + '<textarea class="form-control" rows="3" name="describe" id="describe">' + _tr.find('td').eq(6).text() + '</textarea>'
        + '</span>'
        + '</div></div>'
        + '</form>'
        + '</div>'

        + '<div class="modal-footer">'
        + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
        + '<button type="button" class="btn btn-primary" onclick="version_update(' + i + ')">确认</button>'
        + '</div>';
    alertOpen(cont);
}

// 修改版本提交
function version_update(i) {
    var _tr = $('.versiontable table tr').eq(2 * i + 1);
    var id = _tr.find('td').eq(5).text();
    var name = $('input[name=name]').val();
    var versioncode = $('input[name=versioncode]').val();
    var describe = $('textarea[name=describe]').val();
    var postData = {
        name: name,
        versioncode: versioncode,
        describe: describe,
        _id: id
    };
    var version = /^[0-9]+(\.+[0-9]+)+/;
    if (postData.name == '') {
        warningOpen('请输入版本名称！', 'danger', 'fa-bolt');
    } else if (postData.versioncode == '' || !version.test(postData.versioncode)) {
        warningOpen('请输入正确的版本编号！', 'danger', 'fa-bolt');
    } else if (postData.describe == '') {
        warningOpen('请输入版本描述信息！', 'danger', 'fa-bolt');
    } else {
        $.actPost('/man/version/modifyVersion', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
                getVersionList(currentpage, 10);
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                // warningOpen('其它错误 ', 'danger', 'fa-bolt');
            }
        });

    }
}

// 添加版本
function add() {
    var vcode = /^[0-9]+(\.+[0-9]+)+$/;
    var sid = $.cookie('sid');
    var url = localStorage.getItem("appssec_url") + '/p/file/uploadApp';
    var cont = '';
    cont += '<div class="modal-header">'
        + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
        + '<h4 class="modal-title">添加版本</h4>'
        + '</div>'
        + '<div class="modal-body" style="padding-bottom:0px;">'
        + '<p class="appupload" style="display:none;color:red;text-align:center;">正在上传......</p>'
        + '<iframe name="ifm" style="display:none;"></iframe>'
        + '<form id="addAppForm" method="post" action="' + url + '" enctype="multipart/form-data" target="ifm" autocomplete="off" role = "form" class="form-horizontal">'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "name">版本名称</label>'
        + '<div class="col-sm-7">'
        + '<input name="sid" value="' + sid + '" style="display:none;" />'
        + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入版本名称" />'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "versioncode">版本编号</label>'
        + '<div class="col-sm-7">'
        + '<input type = "text" class = "form-control" id = "versioncode" name="versioncode" placeholder = "例：1.0.0" autocomplete="off" />'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label">平台</label>'
        + '<div class="col-sm-7">'
        + '<select type = "text" class = "form-control" id = "platform" name="platform">'
        + '<option value="android">Android</option>'
        + '<option value="ios">iOS</option>'
        + '</select>'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label">设备类型</label>'
        + '<div class="col-sm-7">'
        + '<select type = "text" class = "form-control" id = "dev_type" name="dev_type">'
        + '<option value="phone">phone</option>'
        + '<option value="pad">pad</option>'
        + '</select>'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label">是否立即生效</label>'
        + '<div class="col-sm-7">'
        + '<label class="col-xs-6">'
        + '<input name="status" type="radio" checked="true" value="0" />'
        + '<span class="text">否</span></label>'
        + '<label class="col-xs-6">'
        + '<input name="status" type="radio" value="1" />'
        + '<span class="text">是</span></label>'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "file_data">文件</label>'
        + '<div class="col-sm-6" style="overflow:hidden;">'
        + '<input type = "file" name="file_data" id="file_data" />'
        + '</div></div>'
        + '<div class = "form-group">'
        + '<label class="col-sm-3 control-label" for = "describe">更新内容</label>'
        + '<div class="col-sm-7">'
        + '<span class="input-icon icon-right">'
        + '<textarea class="form-control" rows="3" name="describe" id="describe"></textarea>'
        + '</span>'
        + '</div></div>'
        + '<div class="modal-footer" style="margin-left:-15px;margin-right:-15px;">'
        + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
        + '<button type="submit" id="submit" class="btn btn-primary">确认</button>'
        + '</div>'
        + '</form>'
        + '</div>';
    alertOpen(cont);
    $('#addAppForm').submit(function () {
        $(this).ajaxSubmit({
            resetForm: true,
            beforeSubmit: function () {
                var versioncode = $('input[name=versioncode]').val();
                if (versioncode == '' || !vcode.test(versioncode)) {
                    warningOpen('请输入正确的版本编号！', 'danger', 'fa-bolt');
                    return false;
                }
                $('.appupload').css({ 'display': 'block' });
            },
            success: function (data) {
                warningOpen('操作成功！', 'primary', 'fa-check');
                alertOff();
                getVersionList(currentpage, 10);
            }
        });
        return false;
    });
}

// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getVersionList(currentpage, 10);
}

// 删除
function deletes() {
    var i = 0;
    var tab = $('.versiontable table');
    if (tab.find('td span').hasClass('txt')) {
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
            + '<button type="button" class="btn btn-primary" onclick="version_delete()">确认</button>'
            + '</div>';
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的版本！', 'danger', 'fa-bolt');
    }
}

// 企业管理员删除多个版本
function version_delete() {
    var versions = [],
        i = 0;
    var tr;
    var tab = $('.versiontable table');
    tab.find('td span.txt').each(function () {
        tr = $(this).parents("tr");
        versions[i] = tr.find('td').eq(5).text();
        i = i + 1;
    });
    if (versions.length > 0) {
        var postData = {
            versions: JSON.stringify(versions)
        };
        $.actPost('/man/version/deleteApp', postData, function (data) {
            if (data.rt == '0000') {
                getVersionList(1, 10);
                alertOff();
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                // warningOpen('其它错误 ', 'danger', 'fa-bolt');
            }
        });
    } else {
        warningOpen('请选择要删除的版本！', 'danger', 'fa-bolt');
    }
}
