/*
 * ==================================================================
 *                          应用标签 apptag
 * ==================================================================
 */




    iptKeywordInit();
    function iptKeywordInit() {
        var timer;
        $('#iptKeyword').data('timer', '').on('input', function () {
            $(this).val($(this).val().replace(/[^\u4e00-\u9fa50-9a-zA-Z_-]/g, ''));
            var keyword = $(this).val();
            clearTimeout(timer);
            timer = setTimeout(function () {
                getAppTagList(1, 10, keyword);
            }, 700)
        })
    }

    // 应用标签列表
    getAppTagList(1, 10);

    // app标签列表
    function getAppTagList(start, length, keyword) {
        var st = 1;
        var table = $('.apptagtable'),
            str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
                + '<th class="sel" style="width:110px;"><div class="checkbox">'
                + '<label><input type="checkbox" onclick="selectedAll(this)" />'
                + '<span class="text"></span></label></div></th>'
                + '<th>名称</th>'
                + '<th>创建者</th>'
                + '<th>应用数量</th>'
                + '<th>更新时间</th>'
                + '<th>操作</th></tr>',
            pd = {
                start_page: start,
                page_length: length
            };
        if (keyword) {
            pd['keyword'] = keyword;
        }
        $.silentGet('/man/appTag/getAppTagList', pd, function (data) {
            if (data.rt == '0000') {
                if(data.apptag_list.length>0){
                    for (var i in data.apptag_list) {
                        str += '<tr>'
                            + '<td class="sel"><div class="checkbox"><label>'
                            + '<input type="checkbox" onclick="selected(this)" />'
                            + '<span class="text"></span></label></div></td>'
                            + '<td>' + data.apptag_list[i].name + '</td>'
                            + '<td>' + data.apptag_list[i].creator + '</td>'
                            + '<td>'
                            + '<a href="javascript:add_app(' + i + ');">' + data.apptag_list[i].app_num + '</a>'
                            + '</td>'
                            + '<td>' + data.apptag_list[i].modify_time + '</td>'
                            + '<td style="display:none;">' + data.apptag_list[i].id + '</td>'
                            + '<td style="display:none;">' + data.apptag_list[i].description + '</td>'
                            + '<td>'
                            + '<a class="btn btn-primary btn-xs'+(hasFn('mod')?'':' disabled')+'" href="javascript:tag_modify(' + i + ');">编辑</a>'
                            + '<a class="btn btn-primary btn-xs" href="javascript:tag_view(' + i + ');">详情</a>'
                            + '</td></tr>';
                    }
                }else{
                    str += '<tr><td class="sel" colspan="6">暂无应用标签</td></tr>';
                }
                
                str += '</table>';
                table.html(str);
                createFooter(start, length, data.total_count, st);
            } else if (data.rt == 5) {
                toLoginPage();
            }
        });
        $('.hrefactive').removeClass("hrefallowed");
        currentpage = start;
    }

    // page页查询
    function search(p, i) {
        if (i == 1) {
            getAppTagList(p, 10);
        } else {
            console.warn(i);
        }
    }

    // 返回列表
    function apptaglist() {
        $('.apptag_add, .apptag_mod, .apptag_view, .addapptag, .modtag, .viewtag, .app ,.addapp').css({ 'display': 'none' });
        $('.apptaglist').css({ 'display': 'block' });
        $('input, textarea').val('');
    }

    // 标签内添加应用
    function add_app(i) {
        var _tr = $('.apptagtable table tr').eq(i + 1);
        var id = _tr.find('td').eq(5).text() * 1;
        $('.apptaglist').css({ 'display': 'none' });
        $('.app').css({ 'display': 'block' });
        $('.addapp').css({ 'display': 'inline-block' });
        $('.app').find('input[name=tag_id]').val(id);
        var url = '/man/appTag/getAppByTag?apptag_id=' + id;
        var table1 = $('.freeapp'),
            str1 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="addapp"><tr>'
                + '<th width="50%">应用名称</th>'
                + '<th width="50%">版本</th>'
                + '<th width="50px" style="text-align:center;">操作</th></tr>',
            table2 = $('.member'),
            str2 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="deleteapp"><tr>'
                + '<th width="50%">应用名称</th>'
                + '<th width="50%">版本</th>'
                + '<th width="50px" style="text-align:center;">操作</th></tr>';
        $.get(url, function (data) {
            data = JSON.parse(data);
            if (data.rt == '0000') {
                for (var i in data.available_apps) {
                    str1 += '<tr>'
                        + '<td>' + data.available_apps[i].app_name + '</td>'
                        + '<td>' + data.available_apps[i].version + '</td>'
                        + '<td style="display:none;">' + data.available_apps[i].id + '</td>'
                        + '<td style="padding:0;text-align:center;"><img src="../imgs/roleadd.png" onclick="addapp(this)" style="vertical-align: middle;cursor:pointer;" />'
                        + '</td></tr>';
                }
                str1 += '</table>';
                table1.html(str1);

                for (var j in data.tag_apps) {
                    str2 += '<tr>'
                        + '<td>' + data.tag_apps[j].app_name + '</td>'
                        + '<td>' + data.tag_apps[j].version + '</td>'
                        + '<td style="display:none;">' + data.tag_apps[j].id + '</td>'
                        + '<td style="padding:0;text-align:center;"><img src="../imgs/roledelete.png" onclick="deleteapp(this)" style="vertical-align: middle;cursor:pointer;" />'
                        + '</td></tr>';
                }
                str2 += '</table>';
                table2.html(str2);
            } else {
                //warningOpen('其它错误 ', 'danger', 'fa-bolt');
            }
        });
    }

    //删除标签内应用
    function deleteapp(obj) {
        var tr = $(obj).parent().parent();
        var rowIndex = tr.index() + 1;
        var email = tr.find('td').eq(0).text();
        var name = tr.find('td').eq(1).text();
        var id = tr.find('td').eq(2).text();
        var tab = document.getElementById("addapp");
        //表格行数
        var rows = tab.rows.length * 1;
        var x = document.getElementById('addapp').insertRow(rows);
        var y = x.insertCell(0);
        var z = x.insertCell(1);
        var k = x.insertCell(2);
        var v = x.insertCell(3);
        y.innerHTML = email;
        z.innerHTML = name;
        k.innerHTML = id;
        v.innerHTML = '<img src="../imgs/roleadd.png" onclick="addapp(this)" style="vertical-align: middle;cursor:pointer;" />';
        k.style.display = 'none';
        v.style.padding = '0';
        v.style.textAlign = 'center';
        $(obj).parent("td").parent("tr").remove();
    }

    //添加标签内应用
    function addapp(obj) {
        var tr = $(obj).parent().parent();
        var rowIndex = tr.index() + 1;
        var email = tr.find('td').eq(0).text();
        var name = tr.find('td').eq(1).text();
        var id = tr.find('td').eq(2).text();
        var tab = document.getElementById("deleteapp");
        //表格行数
        var rows = tab.rows.length * 1;
        var x = document.getElementById('deleteapp').insertRow(rows);
        var y = x.insertCell(0);
        var z = x.insertCell(1);
        var k = x.insertCell(2);
        var v = x.insertCell(3);
        y.innerHTML = email;
        z.innerHTML = name;
        k.innerHTML = id;
        v.innerHTML = '<img src="../imgs/roledelete.png" onclick="deleteapp(this)" style="vertical-align: middle;cursor:pointer;" />';
        k.style.display = 'none';
        v.style.padding = '0';
        v.style.textAlign = 'center';
        $(obj).parent("td").parent("tr").remove();
    }

    //查询不属于标签内应用
    function sfreeapps() {
        var s = document.getElementById("freeapps").value;
        var tab = $('.freeapp table');
        tab.find('tr').each(function () { $(this).css({ 'display': '' }); });
        searchbykeywords(s, tab);
    }

    //查询标签内部应用
    function searchapps() {
        var s = document.getElementById("apps").value;
        var tab = $('.member table');
        tab.find('tr').each(function () { $(this).css({ 'display': '' }); });
        searchbykeywords(s, tab);
    }

    // 标签添加应用
    function save() {
        var apptable = $('.member table');
        var app_list = [], i = 0, app_list = [];
        apptable.find('tr:not(:first)').remove().each(function () {
            if ($(this).css("display") != "none") {
                app_list[i] = $(this).find('td').eq(2).text() * 1;
                i = i + 1;
            }
        });
        var postData = {
            apptag_id: $('.app').find('input[name=tag_id]').val(),
            app_list: JSON.stringify(app_list)
        };
        $.actPost('/man/appTag/addApp', postData, function (data) {
            if (data.rt == '0000') {
                apptaglist();
                getAppTagList(currentpage, 10);
            } else {
                //warningOpen('其它错误 ', 'danger', 'fa-bolt');
            }
        });
    }

    // 查看
    function tag_view(i) {
        $('.apptaglist').css({ 'display': 'none' });
        $('.apptag_view').css({ 'display': 'block' });
        $('.viewtag').css({ 'display': 'inline-block' });
        var tr = $('.apptagtable table tr').eq(i + 1);
        var name = tr.find('td').eq(1).text();
        var description = tr.find('td').eq(6).text();
        $('.apptag_view input[name=name]').val(name);
        $('.apptag_view textarea[name=describe]').val(description);
    }

    // 修改
    function tag_modify(i) {
        $('.apptaglist').css({ 'display': 'none' });
        $('.apptag_mod').css({ 'display': 'block' });
        $('.modtag').css({ 'display': 'inline-block' });
        var tr = $('.apptagtable table tr').eq(i + 1);
        var tagid = tr.find('td').eq(5).text();
        var name = tr.find('td').eq(1).text();
        var description = tr.find('td').eq(6).text();
        $('.apptag_mod input[name=apptag_id]').val(tagid);
        $('.apptag_mod input[name=name]').val(name);
        $('.apptag_mod textarea[name=describe]').val(description);
    }

    // 修改应用标签提交 
    function tag_mod() {
        var postData = {
            apptag_id: $('.apptag_mod input[name=apptag_id]').val() * 1,
            name: $('.apptag_mod input[name=name]').val(),
            description: $('.apptag_mod textarea[name=describe]').val()
        };
        if (postData.name == "") {
            warningOpen('请填写应用标签名称！', 'danger', 'fa-bolt');
        } else {
            $.actPost('/man/appTag/updateAppTag', postData, function (data) {
                if (data.rt == '0000') {
                    apptaglist();
                    getAppTagList(currentpage, 10);
                }
            });
        }

    }

    // 添加
    function add() {
        $('.apptaglist').css({ 'display': 'none' });
        $('.apptag_add').css({ 'display': 'block' });
        $('.addapptag').css({ 'display': 'inline-block' });
    }

    // 添加应用标签提交
    function tag_add() {
        var postData = {
            name: $('.apptag_add input[name=name]').val(),
            description: $('.apptag_add textarea[name=describe]').val()
        };
        if (postData.name == "") {
            warningOpen('请填写应用标签名称！', 'danger', 'fa-bolt');
        } else {
            $.actPost('/man/appTag/addAppTag', postData, function (data) {
                if (data.rt == '0000') {
                    apptaglist();
                    getAppTagList(currentpage, 10);
                } else if (data.rt == 5) {
                    toLoginPage();
                } else {
                    //warningOpen('其它错误 ', 'danger', 'fa-bolt');
                }
            });
        }
    }

    // 刷新
    function refresh() {
        $('th span,td span').removeClass('txt');
        getAppTagList(currentpage, 10);
    }

    // 删除
    function deletes() {
        if ($('.apptagtable table').find('span.txt').length>0) {
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
                    tag_delete();
                },
                confirmHide: true,
                cancelValue: '取消'
            });
        }
    }

    // 企业管理员删除多个应用标签
    function tag_delete() {
        var tagId = [],
            i = 0;
        var tr;
        var tab = $('.apptagtable table');
        tab.find('td span').each(function () {
            if ($(this).hasClass('txt')) {
                tr = $(this).parents("tr");
                tagId[i] = tr.find('td').eq(5).text() * 1;
                i = i + 1;
            }
        });
        if (tagId.length > 0) {
            var postData = {
                apptag_ids: JSON.stringify(tagId)
            };
            $.actPost('/man/appTag/deleteAppTag', postData, function (data) {
                if (data.rt == '0000') {
                    getAppTagList(1, 10);
                    alertOff();
                } else if (data.rt == 5) {
                    toLoginPage();
                } else {
                    //warningOpen('其它错误 ', 'danger', 'fa-bolt');
                }
            });
        }
    }

    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限