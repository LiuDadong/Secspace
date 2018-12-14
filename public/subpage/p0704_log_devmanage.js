/*
 * ==================================================================
 *                          设备管理日志 log
 * ==================================================================
 */


    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限


    $(".jedate").each(function () {
        $(this).jeDate({
            format: "YYYY-MM-DD hh:mm:ss",
            okfun: function (elem, value) {
                elem.elem.change();
                $('.input-group-btn button').click();
            },
            clearfun: function (elem, value) {
                elem.elem.change();
                $('.input-group-btn button').click();
            }
        });
    })

    getloglist(1, 10);
    $("#datestart, #dateend, select[name=log_type]").change(function () {
        getloglist(1, 10);
    });
    $('input[name=searchval]').keyup(function () {
        getloglist(1, 10);
    });

    // 搜索日志列表
    function searchlist() {
        getloglist(1, 10);
    }

    // 列表
    function getloglist(start_page, page_length) {
        var index = 0;
        var start_time = $('.search').find('input[name=start_time]').val();
        var end_time = $('.search').find('input[name=end_time]').val();
        var keyword = $('.input-group').find('input[name=searchval]').val();
        var log_type = $('.search').find('select[name=log_type]').val();

        var table = $('.logtable'),
            str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
                + '<th>类型</th>'
                + '<th>时间</th>'
                + '<th>操作者</th>'
                + '<th>影响用户</th>'
                //  + '<th>用户</th>'
                //  + '<th>账号</th>'
                + '<th>设备名称</th>'
                // + '<th>设备类型</th>'
                + '<th>具体操作</th></tr>';
        var url = '/man/Log/getLog?start_time=' + start_time
            + '&end_time=' + end_time
            + '&category=devLog'
            + '&start_page=' + start_page
            + '&page_length=' + page_length;
        if (keyword) {
            url += '&keyword=' + encodeURI(encodeURI(keyword));
        }
        if (log_type) {
            url += '&log_type=' + encodeURI(encodeURI(log_type));
        }

        $.get(url, function (data) {
            data = JSON.parse(data);
            if (data.rt == '0000') {
                for (var i in data.logInfo) {
                    str += '<tr>'
                        + '<td>' + data.logInfo[i].log_type + '</td>'
                        + '<td>' + data.logInfo[i].opt_time + '</td>'
                        + '<td>' + data.logInfo[i].creator + '</td>'
                        + '<td>' + data.logInfo[i].effect_target + '</td>'
                        + '<td>' + data.logInfo[i].dev_name + '</td>'
                        // + '<td>' + data.logInfo[i].log_type + '</td>'      
                        + '<td>' + data.logInfo[i].operate + ': ' + data.logInfo[i].state + '</td>'
                        + '</tr>';
                }
                str += '</table>';
                table.html(str);
                createFooter(start_page, page_length, data.total_count, 1);
            } else if (data.rt == 5) {
                toLoginPage();
            }
        });
    }



    // page查询
    function search(p, i) {
        if (i == 1) {
            getloglist(p, 10);
        } else {
            console.warn(i);
        }
    }

