/*
 * ==================================================================
 *                          客户端日志 log
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
        var start_time = $('input[name=start_time]').val();
        var end_time = $('input[name=end_time]').val();
        var keyword = $('.input-group').find('input[name=searchval]').val();
        var log_type = $('select[name=log_type]').val();

        var table = $('.logtable'),
            str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
                + '<th>类型</th>'
                + '<th>时间</th>'
                + '<th>操作者</th>'
                + '<th>IP地址</th>'
                + '<th>设备名称</th>'
                + '<th>设备类型</th>'
                + '<th>具体操作</th></tr>';
        var pd={
            category:'clientLog',
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
                    str += '<tr><td colspan="7">暂无数据</td></tr>'
                }else{
                    for (var i in data.logInfo) {
                        str += '<tr>'
                            + '<td>' + data.logInfo[i].log_type + '</td>'
                            + '<td>' + data.logInfo[i].opt_time + '</td>'
                            + '<td>' + data.logInfo[i].account + '</td>'
                            + '<td>' + (data.logInfo[i].client_ip||'--') + '</td>'
                            + '<td>' + data.logInfo[i].dev_name + '</td>'
                            + '<td>' + data.logInfo[i].os_type + '</td>'
                            + '<td>' + data.logInfo[i].operate + ': ' + data.logInfo[i].state + '</td>'
                            + '</tr>';
                    }
                }
                str += '</table>';
                table.html(str);
                $.DTTTFooterInit({
                    tbl:table.find('table'),
                    page:start_page,
                    length:page_length,
                    total:data.total_count,
                    cb:function(i){
                        getloglist(i,10);
                    }
                });
            }
        });
    }


    // page查询
    function search(p, i) {
        if (i == 1) {
            getloglist(p, 10);
        } else {
            console.info(i);
        }
    }
