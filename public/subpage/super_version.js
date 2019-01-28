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
                        var iptchk = '<input type="checkbox" onclick="selected(this)" />', tdStatus = '', aStatus = '';
                        switch (data.appList[i].status) {
                            case '0':
                                tdStatus = '<td style="color:#5db2ff">待生效</td>';
                                aStatus = '<a class="btn" href="javascript:version(' + i + ');">生效</a>';
                                break;
                            case '1':
                                iptchk = '';
                                tdStatus = '<td><a>正在生效</a></td>';
                                break;
                            case '2':
                                tdStatus = '<td style="color:#d73d32">已失效</td>';
                                break;
                            default:
                                console.warn('请检查data.appList[i].status')
                        }
                        str += '<tr>'
                            + '<td class="sel"><div class="checkbox"><label>' + iptchk + '<span class="text"></span></label></div></td>'
                            + '<td class="detail" style="cursor:pointer;"><a>' + data.appList[i].name + '</a></td>'
                            + '<td>' + data.appList[i].versioncode + '</td>'
                            + '<td>' + (data.appList[i].platform == 'ios' ? 'iOS' : 'Android') + '</td>'
                            + '<td>' + data.appList[i].dev_type + '</td>'
                            + '<td style="display:none;">' + data.appList[i]._id + '</td>'
                            + '<td style="display:none;">' + (data.appList[i].describe ? data.appList[i].describe : '') + '</td>'
                            + '<td style="display:none;">' + data.appList[i].path + '</td>'
                            + tdStatus
                            + '<td>' + data.appList[i].create_time + '</td>'
                            + '<td class="other">'
                            + aStatus
                            + '<a title="下载" class="btn btn-primary btn-xs" href="javascript:version_download(' + i + ');"><i class="fa fa-download"></i></a>'
                            + '<a title="编辑" class="btn btn-primary btn-xs" href="javascript:version_modify(' + i + ');"><i class="fa fa-edit"></i></a>'
                            + '</td></tr>'
                            + '<tr style="display:none;">'
                            + '<td colspan="6" style="border:none;"><p style="margin-top:10px;">更新内容：' + data.appList[i].describe + '</p></td>'
                            + '</tr>';
                    }
                } else {
                    str += '<tr><td colspan="8">暂无数据</td></tr>'
                }
                str += '</table>';
                table.html(str);
                table.find('table').data('data', data);
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
        var item = $('.versiontable table').data('data').appList[i];
        $.actPost('/man/version/authSecspace', {
            _id: item._id,
            status: '2',
            platform: item.platform,
            dev_type: item.dev_type
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
            platform: _tr.find('td').eq(3).text() == 'iOS' ? 'ios' : 'android',
            dev_type: _tr.find('td').eq(4).text(),
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
        var path = $('.versiontable table tr').eq(2 * i + 1).find('td').eq(7).text();
        var url = localStorage.getItem('appssec_url') + path;
        downloadFile(url);
    }

    // 修改版本
    function version_modify(i) {
        var _tr = $('.versiontable table tr').eq(2 * i + 1);
        $.dialog('form', {
            title: '提示',
            content: '<form role = "form" class="form-horizontal">'
                + '<div class = "form-group">'
                + '<label class="col-sm-3 control-label no-padding-right" for = "name">版本名称</label>'
                + '<div class="col-sm-9">'
                + '<input type = "text" class = "form-control" id = "name" name="name" value="' + _tr.find('td').eq(1).text() + '" />'
                + '</div></div>'
                + '<div class = "form-group">'
                + '<label class="col-sm-3 control-label no-padding-right" for = "versioncode">版本编号</label>'
                + '<div class="col-sm-9">'
                + '<input type="text" class="form-control" id = "versioncode" name="versioncode" value="' + _tr.find('td').eq(2).text() + '" />'
                + '</div></div>'
                + '<div class = "form-group">'
                + '<label class="col-sm-3 control-label no-padding-right" for = "describe">版本详情</label>'
                + '<div class="col-sm-9">'
                + '<span class="input-icon icon-right">'
                + '<textarea class="form-control" rows="3" name="describe" id="describe">' + _tr.find('td').eq(6).text() + '</textarea>'
                + '</span>'
                + '</div></div>'
                + '</form>',
            confirmValue: '确认',
            confirm: function () {
                version_update(i)
            },
            cancelValue: '取消',
            cancel: function () {
                // 点击取消的回到函数
            }
        });
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
        $.dialog('form', {
            title: '添加版本',
            top:'20%',
            width: '600',
            content: '<form id="addAppForm" method="post" action="' + localStorage.getItem("appssec_url") + '/p/file/uploadApp" enctype="multipart/form-data" target="ifm" autocomplete="off" role = "form" class="form-horizontal form-sm">\
                        <div class = "form-group">\
                            <label class="col-sm-3 control-label no-padding-right" for = "name">版本名称</label>\
                            <div class="col-sm-9">\
                                <input type = "hidden" name="sid" value="' + sid + '" />\
                                <input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入版本名称" />\
                            </div>\
                        </div>\
                        <div class = "form-group">\
                            <label class="col-sm-3 control-label no-padding-right" for = "versioncode">版本编号</label>\
                            <div class="col-sm-9">\
                                <input type = "text" class = "form-control" id = "versioncode" name="versioncode" placeholder = "例：1.0.0" autocomplete="off" />\
                            </div>\
                        </div>\
                        <div class = "form-group">\
                            <label class="col-sm-3 control-label no-padding-right">平台</label>\
                            <div class="col-sm-9">\
                                <select type = "text" class = "form-control" id = "platform" name="platform">\
                                    <option value="android">Android</option>\
                                    <option value="ios">iOS</option>\
                                </select>\
                            </div>\
                        </div>\
                        <div class = "form-group">\
                            <label class="col-sm-3 control-label no-padding-right">设备类型</label>\
                            <div class="col-sm-9">\
                                <select type = "text" class = "form-control" id = "dev_type" name="dev_type">\
                                    <option value="phone">phone</option>\
                                    <option value="pad">pad</option>\
                                </select>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label no-padding-right">\
                                <span>立即生效</span>\
                            </label>\
                            <div class="checkbox">\
                                <label>\
                                    <input class="checkbox-slider yesno" value="1" type="checkbox" name="status">\
                                    <span class="text"></span>\
                                </label>\
                            </div>\
                        </div>\
                        <div class = "form-group">\
                            <label class="col-sm-3 control-label no-padding-right" for = "file_data">文件</label>\
                            <div class="col-sm-9">\
                                <input type = "file" class="form-control" name="file_data" id="file_data" />\
                            </div>\
                        </div>\
                        <div class = "form-group">\
                            <label class="col-sm-3 control-label no-padding-right" for = "describe">更新内容</label>\
                            <div class="col-sm-9">\
                                <textarea class="form-control" rows="2" name="describe" id="describe"></textarea>\
                            </div>\
                        </div>\
                    </form>',
            confirmHide: false,
            confirmValue: '上传',
            confirm: function (cnt) {
                if($('input[name=name]').val()==''){
                    warningOpen('版本名称不能为空','danger','fa-bolt')
                    return false;
                }
                if($('input[name=versioncode]').val()==''){
                    warningOpen('版本编号不能为空','danger','fa-bolt')
                    return false;
                }
                if($('input[name=file_data]')[0].files.length==0){
                    warningOpen('请选择要上传的应用','danger','fa-bolt')
                    return false;
                }
                cnt.find('form').submit();
            },
            cancelValue: '取消',
            cancel: function () {
                // 点击取消的回到函数
            }
        });
        $('#addAppForm').submit(function () {
            $(this).ajaxSubmit({
                resetForm: true,
                beforeSubmit: function () {
                    var versioncode = $('input[name=versioncode]').val();
                    if (versioncode == '' || !vcode.test(versioncode)) {
                        warningOpen('请输入正确的版本编号！', 'danger', 'fa-bolt');
                        return false;
                    }
                    $('#file_data').addClass('progress-mask');
                    $('.dialog-btn-confirm').addClass('disabled');
                },
                success: function (data) {
                    $('#file_data').removeClass('progress-mask');
                    $('.dialog-btn-confirm').removeClass('disabled');
                    $.handleECode(true, data, '上传');
                    if (data.rt === "0000") {
                        $.dialogClose();
                        getVersionList(currentpage, 10);
                    }
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
            $.dialog('confirm', {
                title: '提示',
                content: '<p>确定删除？</p>',
                confirmValue: '确认',
                confirm: function () {
                    version_delete()
                },
                cancelValue: '取消',
                cancel: function () {
                    // 点击取消的回到函数
                }
            });
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
