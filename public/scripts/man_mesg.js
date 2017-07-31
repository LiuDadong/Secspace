$(function() {
    $('.mesgmenu').addClass('open active');
    $('.mesgmenu').find('li').eq(0).addClass('active');
    // 消息列表
    getMessageList(1,10);
});
// 消息列表
function getMessageList(start,length) {
    var url = '/man/message/getMessageList?start='+ start + '&length='+ length;
    var st = 1;
    var table = $('.mesgtable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>消息标题</th>'
            + '<th>创建人</th>'
            + '<th>创建时间</th>'
            + '<th>推送时间</th>'
            + '<th>操作</th></tr>';

    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {           
            for(var i in data.messages) {
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                    + '<td>' + data.messages[i].title + '</td>'
                    + '<td>' + data.messages[i].creator + '</td>'
                    + '<td>' + data.messages[i].create_time + '</td>'
                    + '<td>' + data.messages[i].send_time + '</td>'
                    + '<td style="display:none;">' + data.messages[i].content + '</td>'      
                    + '<td style="display:none;">' + data.messages[i].id + '</td>';
                    if(data.messages[i].is_sent == 0){
                        str +='<td class="other" width="16%">'                
                            + '<a href="javascript:views('+ i +');">预览</a>&nbsp;&nbsp;&nbsp;'
                            + '<a href="javascript:modify('+ i +');">修改信息</a>'
                            + '</td></tr>';
                    } else {
                        str +='<td class="other" width="16%">'                
                            + '<a href="javascript:views('+ i +');">预览</a>&nbsp;&nbsp;&nbsp;'
                            + '<a style="color:#999; cursor:not-allowed">修改信息</a>'
                            + '</td></tr>';
                    }
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });
    currentpage = start;
}
// page页查询
function search(p,i) {
    if(i == 1){
        getMessageList(p,10);
    } else{
        console.log(i);
    }
}
// 返回消息列表
function mesglist(){
    $('.user, .pushadd').css({'display':'none'});
    $('.mesglist').css({'display':'block'});
}
// 添加消息时预览
function views(i){
    var tr = $('.mesgtable table tr').eq(i+1);
    var title = tr.find('td').eq(1).text();  
    var content = tr.find('td').eq(5).html(); 
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">消息预览</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<h4 style="text-align:center;">'
             + title
             + '</h4>'
             + '<div class = "row" style="min-height:50px;max-height:300px;overflow:auto;">' 
             + '<div class="col-sm-10 col-xs-offset-1" style="word-wrap:word-break;text-indent:2em;">' 
             + content
             + '</div></div>'
             + '</div>' 
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="alertOff()">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 编辑消息
function modify(i){
    var tr = $('.mesgtable table tr').eq(i+1);
    var title = tr.find('td').eq(1).text();  
    var content = tr.find('td').eq(5).html(); 
    var id = tr.find('td').eq(6).text(); 
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">编辑消息</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form autocomplete="off" role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "title">消息标题</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "title" name="title" value="'+title+'"/>' 
             + '</div></div>'
             + '<div class = "form-group" style="margin-bottom:0px;">' 
             + '<label class="col-sm-3 control-label" for = "content">消息内容</label>' 
             + '<div class="col-sm-7">' 
             + '<a href="javascript:addhref()" style="line-height:32px;">添加链接到正文...</a>' 
             + '</div></div>'
             + '<div class = "form-group" style="margin-bottom:5px;">' 
             + '<div class="col-sm-7 col-xs-offset-3">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="5" name="content" id="content">'+content+'</textarea>'
             + '</span>'
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="mesg_mod('+id+')">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 编辑消息提交
function mesg_mod(message_id){
    var mesgtitle = $('.modal-body').find('input[name=title]').val();
    var message = $('.modal-body').find('textarea[name=content]').val();
    var postData = {
            message_id: message_id,
            title: mesgtitle,
            content: message
        };
    if(postData.title == '') {
        warningOpen('消息标题不能为空！','danger','fa-bolt');
    } else if(postData.content == '') {
        warningOpen('消息内容不能为空！','danger','fa-bolt');
    } else {
        $.post('/man/message/modifyMessage', postData, function(data) {
            if (data.rt == 0) {
                alertOff(); 
                warningOpen('操作成功！','primary','fa-check');   
                getMessageList(currentpage,10); 
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
}
// 消息推送
function pushmesg(){
    var i = 0;
    var message_id = '';
    var tab = $('.mesgtable table');

    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            message_id = tr.find('td').eq(6).text()*1;
            i = i+1;
        }     
    }); 
    if(i == 1){ 
        $('.mesglist').css({'display':'none'});
        $('.user').css({'display':'block'});
        $('.pushadd').css({'display':'inline-block'});
        $('.user').find('input[name=message_id]').val(message_id);

        var url = '/man/message/sendMessage?message_id='+message_id;
        var table1 = $('.freeuser'),
              str1 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="adduser"><tr>'
                   + '<th width="50%">登录名</th>'
                   + '<th width="50%">姓名</th>'
                   + '<th width="50px" style="text-align:center;">操作</th></tr>',
        table2 = $('.member'),
          str2 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="deleteuser"><tr>'
               + '<th width="50%">登录名</th>'
               + '<th width="50%">姓名</th>'
               + '<th width="50px" style="text-align:center;">操作</th></tr>';
        $.get(url, function(data) {
            data = JSON.parse(data);
            if (data.rt==0) {           
                for(var i in data.available_users) {
                    str1 += '<tr>'
                        + '<td>' + data.available_users[i].email + '</td>'
                        + '<td>' + data.available_users[i].name + '</td>'
                        + '<td style="display:none;">' + data.available_users[i].id + '</td>' 
                        + '<td style="padding:0;text-align:center;"><img src="../imgs/roleadd.png" onclick="adduser(this)" style="vertical-align: middle;cursor:pointer;"/>'             
                        + '</td></tr>';
                }
                str1 +='</table>';
                table1.html(str1);

                for(var j in data.message_users) {
                    str2 += '<tr>'
                        + '<td>' + data.message_users[j].email + '</td>'
                        + '<td>' + data.message_users[j].name + '</td>'
                        + '<td style="display:none;">' + data.message_users[j].id + '</td>' 
                        + '<td style="padding:0;text-align:center;"><img src="../imgs/roledelete.png" onclick="deleteuser(this)" style="vertical-align: middle;cursor:pointer;"/>'             
                        + '</td></tr>';
                }
                str2 +='</table>';
                table2.html(str2);
            } else if (data.rt==5) {
                toLoginPage();           
            } else{
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    } else {
        warningOpen('请选择一条消息进行推送！','danger','fa-bolt');
    }
}
//删除推送用户
function deleteuser(obj){
    var tr = $(obj).parent().parent();
    var rowIndex = tr.index()+1;
    var email = tr.find('td').eq(0).text();
    var name = tr.find('td').eq(1).text();
    var id = tr.find('td').eq(2).text();
    var tab = document.getElementById("adduser");
      //表格行数
    var rows = tab.rows.length*1;
    var x=document.getElementById('adduser').insertRow(rows);
    var y=x.insertCell(0);
    var z=x.insertCell(1);
    var k=x.insertCell(2);
    var v=x.insertCell(3);
    y.innerHTML=email;
    z.innerHTML=name;
    k.innerHTML=id;
    v.innerHTML='<img src="../imgs/roleadd.png" onclick="adduser(this)" style="vertical-align: middle;cursor:pointer;"/>';
    k.style.display = 'none';
    v.style.padding = '0';
    v.style.textAlign = 'center';
    $(obj).parent("td").parent("tr").remove();
}
//添加推送用户
function adduser(obj){
    var tr = $(obj).parent().parent();
    var rowIndex = tr.index()+1;
    var email = tr.find('td').eq(0).text();
    var name = tr.find('td').eq(1).text();
    var id = tr.find('td').eq(2).text();
    var tab = document.getElementById("deleteuser");
      //表格行数
    var rows = tab.rows.length*1;
    var x=document.getElementById('deleteuser').insertRow(rows);
    var y=x.insertCell(0);
    var z=x.insertCell(1);
    var k=x.insertCell(2);
    var v=x.insertCell(3);
    y.innerHTML=email;
    z.innerHTML=name;
    k.innerHTML=id;
    v.innerHTML='<img src="../imgs/roledelete.png" onclick="deleteuser(this)" style="vertical-align: middle;cursor:pointer;"/>';
    k.style.display = 'none';
    v.style.padding = '0';
    v.style.textAlign = 'center';
    $(obj).parent("td").parent("tr").remove();
}
//查询未推送的用户
function sfreeusers(){
    var s = document.getElementById("freeusers").value;
    var tab = $('.freeuser table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
//查询推送过的用户
function searchusers(){
    var s = document.getElementById("users").value;
    var tab = $('.member table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
// 消息推送提交
function save(){
    var usertable = $('.member table');
    var user_list = [], i = 0;
    usertable.find('tr:not(:first)').remove().each(function () {
        if($(this).css("display") != "none"){
           user_list[i] = $(this).find('td').eq(2).text()*1;
           i = i + 1;
        }
    }); 
    var postData = {
            message_id: $('.user').find('input[name=message_id]').val(),
            users: JSON.stringify(user_list)
        };
    $.post('/man/message/sendMessage', postData, function(data) {
        if (data.rt == 0) {       
            mesglist();
            warningOpen('操作成功！','primary','fa-check');  
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    }); 
}
// 添加消息
function add(){
    var sid = getCookie("sid"); 
    var url = hosturl + 'p/org/addMessage';
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">添加消息</h4>'
             + '</div>'
             + '<div class="modal-body" style="padding-bottom:0px;">'
             + '<iframe name="ifm" style="display:none;"></iframe>'
             + '<form id="addMessagefile" method="post" action="'+url+'" enctype="multipart/form-data" target="ifm" autocomplete="off" role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "title">消息标题</label>' 
             + '<div class="col-sm-7">' 
             + '<input name="sid" value="'+sid+'" style="display:none;"/>'
             + '<input type = "text" class = "form-control" id = "title" name="title" placeholder = "请输入消息标题"/>' 
             + '</div></div>'
             + '<div class = "form-group" style="margin-bottom:0px;">' 
             + '<label class="col-sm-3 control-label" for = "content">消息内容</label>' 
             + '<div class="col-sm-7">' 
             + '<a href="javascript:addhref()" style="line-height:32px;">添加链接到正文...</a>' 
             + '</div></div>'
             + '<div class = "form-group" style="margin-bottom:5px;">' 
             + '<div class="col-sm-7 col-xs-offset-3">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="5" name="content" id="content"></textarea>'
             + '</span>'
             + '</div></div>'
             + '<div class = "form-group" style="margin-bottom:0px;">' 
             + '<label class="col-sm-3 control-label" for = "file_data">文件</label>' 
             + '<div class="col-sm-6" style="overflow:hidden; margin-top:6px;">' 
             + '<input id="textfield" class="txt" placeholder="添加文件..." style="border:none;color:#59AEE5;" style="z-index:1;"/>'
             + '<input type="file" name="file_data" class="file" id="file_data" size="28" onchange="document.getElementById(\'textfield\').value=this.value" style="margin-top:-20px;cursor:pointer;opacity:0;"/>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<a class="col-sm-10" style="text-align:right;" href="javascript:view()">预览</a>'
             + '</div>'
             + '<div class="modal-footer" style="margin-left:-15px;margin-right:-15px;">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="submit" id="submit" class="btn btn-primary">确认</button>'
             + '</div>'
             + '</form>'
             + '</div>';  
    alertOpen(cont);
    $('#addMessagefile').submit(function() {  
        $(this).ajaxSubmit({
            resetForm: true,
            beforeSubmit: function() {
                // warningOpen('正在添加请稍后！');
            },
            success: function(d1, d2) {
                if (d1.rt == 0) {
                    getMessageList(currentpage,10);
                    warningOpen('操作成功！','primary','fa-check');
                } else if (d1.rt == 1) {
                    warningOpen('添加失败！','danger','fa-bolt');
                } else if (d1.rt == 5) {
                    toLoginPage();
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
                alertOff();
            }
        });
        return false;   
    });
}
// 添加消息时预览
function view(){
    var title = $('.bootbox').find('input[name=title]').val();
    var content = $('.bootbox').find('textarea[name=content]').val();
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff1()">×</button>'
             + '<h4 class="modal-title">消息预览</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<h4 style="text-align:center;">'
             + title
             + '</h4>'
             + '<div class = "row" style="min-height:50px;max-height:300px;overflow:auto;">' 
             + '<div class="col-sm-10 col-xs-offset-1" style="word-wrap:word-break;text-indent:2em;">' 
             + content
             + '</div></div>'
             + '</div>' 
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff1()">取消</button>'
             + '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="alertOff1()">确认</button>'
             + '</div>';  
    alertOpen1(cont);
}
// 添加消息时添加链接
function addhref(){
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff1()">×</button>'
             + '<h4 class="modal-title">添加链接</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "hrefname">链接文本内容</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" class = "form-control" id = "hrefname" name="hrefname" placeholder="百度"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "hrefurl">URL地址</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" class = "form-control" id = "hrefurl" name="hrefurl" placeholder = "http://www.baidu.com"/>' 
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff1()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="href_add()">确认</button>'
             + '</div>';  
    alertOpen1(cont);
}

// 添加消息添加链接
function href_add(){
    var hrefname = $('.modal-body').find('input[name=hrefname]').val();
    var hrefurl = $('.modal-body').find('input[name=hrefurl]').val();
    alertOff1();
    if(hrefname !='' && hrefurl != ''){
        if(hrefurl.indexOf("http") == 0 ){
            $('.modal-body').find('textarea[name=content]').val(($('.modal-body').find('textarea[name=content]').val()+'&nbsp;<a href="'+hrefurl+'" target="_blank">'+hrefname+'</a>&nbsp;'));
        } else {
            $('.modal-body').find('textarea[name=content]').val(($('.modal-body').find('textarea[name=content]').val()+'&nbsp;<a href="http://'+hrefurl+'" target="_blank">'+hrefname+'</a>&nbsp;'));
        }
    }
}

// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getMessageList(currentpage,10);
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.mesgtable table');
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
             +  '<button type="button" class="btn btn-primary" onclick="mesg_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的消息！','danger','fa-bolt');
    }
}
// 企业管理员删除多条消息
function mesg_delete() {
    var message_ids = [],
        i = 0;
    var tr;
    var tab = $('.mesgtable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            message_ids[i] = tr.find('td').eq(6).text()*1;
            i = i+1;
        }     
    }); 
    if(message_ids.length > 0){
        var postData = {
            message_ids: JSON.stringify(message_ids)
        };
        
        $.post('/man/message/deleteMessage', postData, function(data) {
            if (data.rt == 0) { 
                alertOff(); 
                warningOpen('操作成功！','primary','fa-check'); 
                getMessageList(currentpage,10);                    
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    } else {
        warningOpen('请选择消息！','danger','fa-bolt');
    }        
}