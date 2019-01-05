/*
 * ==================================================================
 *                          应用管理日志 log
 * ==================================================================
 */


    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限


    
    logDateInit();
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
                + '<th>影响目标</th>'
                //  + '<th>账号</th>'
                //   + '<th>设备名称</th>'
                //    + '<th>设备类型</th>'
                + '<th>具体操作</th></tr>';
        var pd={
            category:'fileLog',
            start_time:start_time,
            end_time:end_time,
            start_page:start_page,
            page_length:page_length
        };
        if (keyword) {
            pd['keyword']=keyword;
        }
        if (log_type) {
            pd['log_type']=log_type;
        }
        $.silentGet('/man/Log/getLog',pd, function (data) {
            if (data.rt == '0000') {
                if(data.logInfo.length==0){
                    str += '<tr><td colspan="5">暂无日志</td></tr>'
                }
                for (var i in data.logInfo) {
                    str += '<tr>'
                        + '<td>' + data.logInfo[i].log_type + '</td>'
                        + '<td>' + data.logInfo[i].opt_time + '</td>'
                        + '<td>' + data.logInfo[i].creator + '</td>'
                        + '<td>' + data.logInfo[i].effect_target + '</td>'
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



    // 导出日志
    function impexcel() {
        downloadLog('fileLog');
    }

    // page查询
    function search(p, i) {
        if (i == 1) {
            getloglist(p, 10);
        } else {
            console.warn(i);
        }
    }
