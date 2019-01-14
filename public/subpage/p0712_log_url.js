/*
 * ==================================================================
 *                          用户管理日志 log
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
        var start_time = $('input[name=start_time]').val();
        var end_time = $('input[name=end_time]').val();
        var keyword = $('.input-group').find('input[name=searchval]').val();
        var log_type = $('select[name=log_type]').val();

        var table = $('.logtable'),
            str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th style="width:10%">类型</th>'
            + '<th style="width:10%">用户名</th>'
            + '<th style="width:18%">账号</th>'
            + '<th style="width:10%">设备</th>'
            + '<th style="width:10%">操作系统</th>'
            + '<th style="width:18%">时间</th>'
            + '<th style="width:20%">违规地址</th>';
        var pd={
            category:'urlLog',
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
                    + '<td>' + data.logInfo[i].user_name + '</td>'
                    + '<td>' + data.logInfo[i].account + '</td>'
                    + '<td>' + data.logInfo[i].dev_name + '</td>'
                    + '<td>' + (data.logInfo[i].os_type=='android'? 'Android':'iOS') + '</td>'
                    + '<td>' + data.logInfo[i].opt_time + '</td>'
                    + '<td title="'+ data.logInfo[i].url +'">' + data.logInfo[i].url + '</td>'
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
