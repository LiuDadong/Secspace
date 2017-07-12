/*
 * ==================================================================
 *                          版本管理 version
 * ==================================================================
 */

$(function() {
    $('.setmenu').addClass('open active');
    $('.setmenu').find('li').eq(0).addClass('active');
    // 版本列表
    getVersionList(1,10,'');  
});
// 版本列表
function getVersionList(start,length,keyword) {
    var st = 1;
    var total_count = 54;
    var url = '/man/user/getUserList?start='+ start + '&length='+ length;
        url += keyword?'&keyword=' + keyword : '';
    var table = $('.versiontable'),
        str = '<table class="table table-striped table-bordered table-hover" id="expandabledatatable"><tr>'
            //+ '<th class="sel" onclick="selectedAll(this)"><i class="fa"></i></th>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>版本名称</th>'
            + '<th>版本编号</th>'
            + '<th>状态</th>'
            + '<th>创建时间</th>'
            + '<th>其他操作</th></tr>';
    var user_list = [{"name": "ss7", "depart_id": 9,  "sex": "0", "phone": "15849876532", "create_time": "2017-06-14 18:32:42", "id": 82.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss7@appssec.com", "policy_id": -1},
     {"name": "ss6", "depart_id": 9, "app_rule": {}, "sex": "5", "phone": "18304587963", "create_time": "2017-06-14 18:32:06", "dev": ["83b2268073a2c06e"], "id": 81.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss6@appssec.com", "policy_id": -1}, {"name": "ss5", "depart_id": 9, "app_rule": {}, "sex": "0", "phone": "18307521493", "create_time": "2017-06-14 18:31:33", "dev": ["83b2268073a2c06e"], "id": 80.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss5@appssec.com", "policy_id": -1}, {"name": "ss4", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "15904523897", "create_time": "2017-06-14 18:30:58", "dev": ["83b2268073a2c06e"], "id": 79.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss4@appssec.com", "policy_id": -1}, {"name": "ss3", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "18304598728", "create_time": "2017-06-14 18:30:26", "dev": ["83b2268073a2c06e"], "id": 78.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss3@appssec.com", "policy_id": -1}, {"name": "ss2", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "18304598723", "create_time": "2017-06-12 16:53:21", "dev": ["e520c5b318e1c1fc"], "id": 77.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss2@appssec.com", "policy_id": 7}, {"name": "ss1", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "18304598732", "create_time": "2017-06-12 16:52:57", "dev": ["e520c5b318e1c1fc", "8373f324679096b5"], "id": 76.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss1@appssec.com", "policy_id": 7}, {"name": "user2", "depart_id": 5, "app_rule": {}, "sex": "1", "phone": "15823095675", "create_time": "2017-05-24 17:27:40", "dev": ["3c3d32f646f3f83b", "31183aad7db4d53b"], "id": 73.0, "depart_name": "\u6d4b\u8bd5\u90e8\u95e8", "email": "user2@qq.com", "policy_id": -1}, {"name": "user1", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "15834569023", "create_time": "2017-05-24 17:27:03", "dev": ["3c3d32f646f3f83b", "b5978e187bf0aeda"], "id": 72.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "user1@qq.com", "policy_id": 35}, {"name": "018", "depart_id": 7, "app_rule": {}, "sex": "1", "phone": "15010170062", "create_time": "2017-04-27 15:46:00", "dev": ["7f9d4bb1c8c2d780", "322302ecdf93ab86", "3c3d32f646f3f83b", "2e5ab2dd362126d", "f8325e0fd226bc44"], "id": 71.0, "depart_name": "\u7814\u53d1\u90e8\u95e8", "email": "018@qq.com", "policy_id": 35}]
    //$.get(url, function(data) {
        //data = JSON.parse(data);
       // if (data.rt==0) {
            for(var i in user_list) {
                if(user_list[i].sex==5){
                    str += '<tr>'
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                        //+ '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>'
                        + '<td class="detail" style="cursor:pointer;"><a>' + user_list[i].name + '</a></td>'
                        + '<td>' + user_list[i].id + '</td>'
                        + '<td><a>正在生效</a></td>'
                        + '<td>' + user_list[i].create_time + '</td>' 
                        + '<td style="display:none;">' + user_list[i].sex + '</td>'
                        + '<td class="other">'           
                        + '<a href="javascript:version_cancel('+ i +');">取消</a>&nbsp;&nbsp;&nbsp;&nbsp;'
                        + '<a href="javascript:version_download('+ i +');">下载</a>&nbsp;&nbsp;&nbsp;&nbsp;' 
                        + '<a href="javascript:version_modify('+ i +');">修改信息</a>'
                        + '</td></tr>'
                        + '<tr class="box" style="display:none;">'
                        + '<td style="border:none;"></td>'
                        + '<td colspan="5" style="border:none;"><p style="margin-top:10px;">版本信息：' + user_list[i].phone + 
                        + '</p><p>版本信息2:' + user_list[i].depart_id + '</p><p>版本信息：dsfsrewreqw</p></td>'
                        + '</tr>';
                }else if(user_list[i].sex==0){
                    str += '<tr>'
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                        //+ '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>'
                        + '<td class="detail" style="cursor:pointer;"><a>' + user_list[i].name + '</a></td>'
                        + '<td>' + user_list[i].id + '</td>'
                        + '<td>待生效</td>'
                        + '<td>' + user_list[i].create_time + '</td>' 
                        + '<td style="display:none;">' + user_list[i].sex + '</td>'
                        + '<td class="other">'           
                        + '<a href="javascript:version('+ i +');">生效</a>&nbsp;&nbsp;&nbsp;&nbsp;'
                        + '<a href="javascript:version_download('+ i +');">下载</a>&nbsp;&nbsp;&nbsp;&nbsp;' 
                        + '<a href="javascript:version_modify('+ i +');">修改信息</a>'
                        + '</td></tr>' 
                        + '<tr class="box" style="display:none;">'
                        + '<td style="border:none;"></td>'
                        + '<td colspan="5" style="border:none;"><p style="margin-top:10px;">版本信息：' + user_list[i].phone + 
                        + '</p><p>版本信息2:' + user_list[i].depart_id + '</p><p>版本信息：dsfsrewreqw</p></td>'
                        + '</tr>';
                }else{
                    str += '<tr>'
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                        //+ '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>'
                        + '<td class="detail" style="cursor:pointer;"><a>' + user_list[i].name + '</a></td>'
                        + '<td>' + user_list[i].id + '</td>'
                        + '<td>已失效</td>'
                        + '<td>' + user_list[i].create_time + '</td>' 
                        + '<td style="display:none;">' + user_list[i].sex + '</td>'
                        + '<td class="other">'    
                        + '<a style="cursor:not-allowed;color:#999;">失效</a>&nbsp;&nbsp;&nbsp;&nbsp;'       
                        + '<a href="javascript:version_download('+ i +');">下载</a>&nbsp;&nbsp;&nbsp;&nbsp;' 
                        + '<a href="javascript:version_modify('+ i +');">修改信息</a>'
                        + '</td></tr>' 
                        + '<tr class="box" style="display:none;">'
                        + '<td style="border:none;"></td>'
                        + '<td colspan="5" style="border:none;"><p style="margin-top:10px;">版本信息：' + user_list[i].phone + 
                        + '</p><p>版本信息2:' + user_list[i].depart_id + '</p><p>版本信息：dsfsrewreqw</p></td>'
                        + '</tr>';
                }
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,total_count,st);  
       // } else if (data.rt==5) {
      //      toLoginPage();           
      //  }
   // });currentpage = start;
    $(function(){
        $('.versiontable table tr').each(function(){
            $(this).find('.detail').click(function(){
                $(this).parent('tr').next('.box').toggle();    
            });
        });
    });
}
// 取消生效
function version_cancel(i) {
    var _tr = $('.versiontable table tr').eq(2*i+1);
    var id = _tr.find('td').eq(1).text();
    var postData = {
        id: id,
        status: 0
    };
    /*
    $.post('/man/user/updatePwd', postData, function(data) {
        if (data.rt==0) {
            alertOff();
            warningOpen('操作成功！','primary','fa-check');
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });*/
}
// 版本生效
function version(i) {
    var _tr = $('.versiontable table tr').eq(2*i+1);
    var id = _tr.find('td').eq(1).text();
    var postData = {
        id: id,
        status: 1
    };
    /*
    $.post('/man/user/updatePwd', postData, function(data) {
        if (data.rt==0) {
            alertOff();
            warningOpen('操作成功！','primary','fa-check');
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });*/
}

// 下载
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
// 下载版本
function version_download(i){   
    var _tr = $('.versiontable table tr').eq(2*i+1);
    var id = _tr.find('td').eq(1).text();
    var id2 = _tr.find('td').eq(1).text();
    var sid = getCookie("sid");
    var url = hosturl+'p/org/exportVersion?sid='+sid+'&id='+ id + '&id2='+ id2;
    downloadFile(url);
}
// 修改版本
function version_modify(i){
    var _tr = $('.versiontable table tr').eq(2*i+1);
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
             + '<input type = "text" class = "form-control" id = "name" name="name" value="'+_tr.find('td').eq(1).text()+'"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "versioncode">版本编号</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" class="form-control" id = "versioncode" name="versioncode" value="'+_tr.find('td').eq(3).text()+'"/>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "describe">版本详情</label>' 
             + '<div class="col-sm-7">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="3" name="describe" id="describe">'+_tr.find('td').eq(4).text()+'</textarea>'
             + '</span>'
             + '</div></div>'
             + '</form>'
             + '</div>'

             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="version_update('+i+')">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 修改版本提交
function version_update(i) {
    var _tr = $('.versiontable table tr').eq(2*i+1);
    var id = _tr.find('td').eq(1).text();
    var name = $('input[name=name]').val();
    var versioncode = $('input[name=versioncode]').val();
    var describe = $('textarea[name=describe]').val();
    var postData = {
        name: name,
        versioncode: versioncode,
        describe: describe
    };
    if (postData.name =='') {
        warningOpen('请输入新密码！','danger','fa-bolt');
    } else if (postData.versioncode =='') {
        warningOpen('前后密码不一致！','danger','fa-bolt');
    }  else if (postData.describe =='') {
        warningOpen('前后密码不一致！','danger','fa-bolt');
    } else {  
        alertOff();
        /*$.post('/man/user/updatePwd', postData, function(data) {
            if (data.rt==0) {
                alertOff();
                warningOpen('操作成功！','primary','fa-check');
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });*/

    }  
}

// 添加版本
function add(){
    var sid = getCookie("sid"); 
    var url = hosturl + 'p/app/uploadop45';
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">添加版本</h4>'
             + '</div>'
             + '<div class="modal-body" style="padding-bottom:0px;">'
             + '<iframe name="ifm" style="display:none;"></iframe>'
             + '<form id="addAppForm" method="post" action="'+url+'" enctype="multipart/form-data" target="ifm" autocomplete="off" role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">版本名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input name="sid" value="'+sid+'" style="display:none;"/>'
             + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入版本名称"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "versioncode">版本编号</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "versioncode" name="versioncode" placeholder = "请输入版本编号" autocomplete="off"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">是否立即生效</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6">'
             + '<input name="check_security" type="radio" value="0"/>'
             + '<span class="text">是</span></label>'
             + '<label class="col-xs-6">'
             + '<input name="check_security" checked="true" type="radio" value="1"/>'
             + '<span class="text">否</span></label>'
             + '</div></div>'     
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "file_data">文件</label>' 
             + '<div class="col-sm-6" style="overflow:hidden;">' 
             + '<input type = "file" name="file_data" id="file_data"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "describe">版本详情</label>' 
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
}
// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
   // getUserList(currentpage,10,'');
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.versiontable table');
    if(tab.find('td span').hasClass('txt')){
        i = 1;
    }     
    var cont = '';
    if(i>0){
        cont += '<div class="modal-header">'
             +  ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             +  '<h4 class="modal-title">提示</h4>'
             +  '</div>'
             +  '<div class="modal-body">'
             +  '<p>确定删除？</p>'
             +  '</div>'
             +  '<div class="modal-footer">'
             +  '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             +  '<button type="button" class="btn btn-primary" onclick="user_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的版本！','danger','fa-bolt');
    }
}

// 企业管理员删除多个版本
function user_delete() {
    var userId = [],
            i = 0;
    var tr;
    var tab = $('.versiontable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            userId[i] = tr.find('td').eq(6).text()*1;
            i = i+1;
        }     
    });  
    if(userId.length > 0){
        var postData = {
            users: JSON.stringify(userId)
        };
        
       /*  $.post('/man/user/delUser', postData, function(data) {
            if (data.rt == 0) {               
                getUserList(1,10,'');  
                alertOff(); 
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); */
    }else{
        warningOpen('请选择要删除的版本！','danger','fa-bolt');
    }        
}
