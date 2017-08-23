/*
 * ==================================================================
 *                          日志管理 log
 * ==================================================================
 */

$(function() {
    $('.logmenu').addClass('open active');
    $('.logmenu').find('li').eq(0).addClass('active');
    jeDate({
        dateCell:"#datestart",
        //skinCell:"jedatered",
        format:"YYYY-MM-DD hh:mm:ss",
        isinitVal:true,
        isTime:true, 
        //isClear:false,
       // initAddVal:{DD:"-1"},
        minDate:"2000-01-01 00:00:00",
        //maxDate:(nowDate(0)-24*60*60*1000),       
        okfun:function(val){$('.dt').find('input[name=start_time]').val(val);}
    });
    jeDate({
        dateCell:"#dateend",
        //skinCell:"jedatered",
        format:"YYYY-MM-DD hh:mm:ss",
        isinitVal:true,
        isTime:true, //isClear:false,
        minDate:"2000-01-01 00:00:00",
        //maxDate:nowDate(0),       
        okfun:function(val){$('.dt').find('input[name=end_time]').val(val);}
    });
    //$('#datestart,#dateend').val('');
});
// 搜索日志列表
function searchlist(){
    getloglist(1,10); 
}
// 列表
function getloglist(start_page,page_length){  
    var sid = getCookie('sid'); 
    var index = 0;
    var start_time = $('.dt').find('input[name=start_time]').val();
    var end_time = $('.dt').find('input[name=end_time]').val();
    var email = $('.uname').find('input[name=email]').val() == '' ? 'all' : $('.uname').find('input[name=email]').val();   
    var operation = $('.tp').find('select[name=operation]').val();   
   
    var table = $('.logtable'),
          str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
              + '<th>序号</th>'
              + '<th>登录名</th>'
              + '<th>操作标识</th>'
              + '<th>应用名称</th>'
              + '<th>应用版本</th>'
              + '<th>应用类型</th>'
              + '<th>访问位置</th>'
              + '<th>设备类型</th>'
              + '<th>设备序号</th>'
              + '<th>认证方式</th>'
              + '<th>操作结果</th>'
              + '<th>操作时间</th></tr>';
             
    //var url = '/man/Log/getLogList?start_time='+ start_time + '&end_time='+ end_time + '&email='+ email + '&operation='+ operation+ '&start_page='+ start_page + '&page_length='+ page_length;
    var url = hosturl+'p/org/uploadLog?sid='+sid
        +'&start_time='+ start_time + '&end_time='+ end_time 
        + '&email='+ email + '&operation='+ operation
        + '&start_page='+ start_page + '&page_length='+ page_length;
    
    $.get(url, function(data) {
       // data = JSON.parse(data);
        var name, operation, app, app_version, app_type, location, device, device_imei, auth, result, time;
        if (data.rt==0) {
            for(var i in data.logs) {
                name = data.logs[i].email == '' ? '－': data.logs[i].email;
                operation = data.logs[i].operation == '' ? '－': data.logs[i].operation;
                app = data.logs[i].app == '' ? '－': data.logs[i].app;
                app_version = data.logs[i].app_version == '' ? '－': data.logs[i].app_version;
                app_type = data.logs[i].app_type == '' ? '－': data.logs[i].app_type;
                location = data.logs[i].location == '' ? '－': data.logs[i].location;
                device = data.logs[i].device == '' ? '－': data.logs[i].device;
                device_imei = data.logs[i].device_imei == '' ? '－': data.logs[i].device_imei;
                auth = data.logs[i].auth == '' ? '－': data.logs[i].auth;
                result = data.logs[i].result == '' ? '－': data.logs[i].result;
                time = data.logs[i].time == '' ? '－': data.logs[i].time;
                str += '<tr>'
                    + '<td>'+(++index)+'</td>'
                    + '<td>'+name+'</td>'
                    + '<td>'+operation+'</td>'
                    + '<td>' + app + '</td>'
                    + '<td>' + app_version + '</td>'
                    + '<td>' + app_type + '</td>'
                    + '<td>' + location + '</td>' 
                    + '<td>' + device + '</td>'
                    + '<td>' + device_imei + '</td>'
                    + '<td>' + auth + '</td>'
                    + '<td>' + result + '</td>'      
                    + '<td>' + time + '</td>'           
                    + '</tr>';
            }
            str +='</table>';
            table.html(str);          
            createFooter(start_page,page_length,data.total_count,1);    
        } else if (data.rt==5) {
          toLoginPage();           
        }
    });
    currentpage = start_page;
}
// 下载日志
function downloadFile(url) {   
    try{ 
        var elemIF = document.createElement("iframe");   
        elemIF.src = url;   
        elemIF.style.display = "none";   
        document.body.appendChild(elemIF);    
    } catch(e){ 
        console.log(url);
    } 
}
// 导出日志
function impexcel(){   
    var index = 0;
    var check_security = '';
    var start_time = $('.dt').find('input[name=start_time]').val();
    var end_time = $('.dt').find('input[name=end_time]').val();
    var email = $('.uname').find('input[name=email]').val() == '' ? 'all': $('.uname').find('input[name=email]').val();
    var operation = $('.tp').find('select[name=operation]').val();
    var sid = getCookie("sid");
    var url = hosturl + 'p/org/exportExcel?sid='+sid+'&start_time='+ start_time + '&end_time='+ end_time + '&email='+ email + '&operation='+ operation;
    console.log(url);
    downloadFile(url);
}
// page查询
function search(p,i) {
    if(i == 1){
        getloglist(p,10);
    } else {
        console.log(i);
    }   
}