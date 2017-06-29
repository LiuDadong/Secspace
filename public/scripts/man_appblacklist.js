$(function() {

    // 用户列表
    getAppblackList(1,15);
    $('.list_link').eq(3).css({'display':'block'});   
    $('.list_link').eq(3).find('a').eq(1).css({'color':'#55ACE4'});    
});
// 消息列表
function getAppblackList(start,length) {
    var url = '/man/app/getAppblackList?start='+ start + '&length='+ length;
    var st = 1;
    var table = $('.middle .tb'),
        str = '<table>';
   /* $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {           
            for(var i in data.messages) {
                str += '<tr>'
                    + '<td width="44px"><div class="select" onclick="selected(this)"></div></td>'
                    + '<td width="21%">' + data.messages[i].title + '</td>'
                    + '<td width="21%">' + data.messages[i].creator + '</td>'
                    + '<td width="21%">' + data.messages[i].create_time + '</td>'
                    + '<td width="21%">' + data.messages[i].send_time + '</td>'
                    + '<td style="display:none;">' + data.messages[i].content + '</td>'      
                    + '<td style="display:none;">' + data.messages[i].id + '</td>';
                    if(data.messages[i].is_sent == 0){
                        str +='<td class="other" width="16%">'                
                            + '<a href="javascript:views('+ i +');">预览</a>&nbsp;&nbsp;&nbsp;'
                            + '<a href="javascript:modify('+ i +');">修改</a>'
                            + '</td></tr>';
                    } else {
                        str +='<td class="other" width="16%">'                
                            + '<a href="javascript:views('+ i +');">预览</a>&nbsp;&nbsp;&nbsp;'
                            + '</td></tr>';
                    }
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });*/
}
// 编辑消息
function modify(i){
    var tr = $('.message .tb table tr').eq(i);
    var title = tr.find('td').eq(1).text();  
    var content = tr.find('td').eq(5).html(); 
    var id = tr.find('td').eq(6).text(); 
    var cont = '';
        cont += '<form autocomplete="off">'
             + '<p><span style="width: 100px;">消息标题 : </span><input type="text" name="mesgtitle" value="'+title+'" style="width:320px;"/></p>'
             + '<p><span style="width: 100px;">消息内容 : </span></p>'
             + '<div id="content" name="message" contenteditable="true" style="margin-top:-80px;margin-left:175px;width:330px;">'+content+'</div><p style="margin-bottom:85px;"></p>'
             + '</form><div class="line"></div>'
             + '<span><button onclick="mesg_mod('+id+')">保存</button><button onclick="alertOff()">取消</button></span>';
    alertOpen('编辑消息', cont);
}
// 编辑消息提交
function mesg_mod(message_id){
    var mesgtitle = $('.cont').find('input[name=mesgtitle]').val();
    var message = $('.cont #content').html();
    var postData = {
            message_id: message_id,
            title: mesgtitle,
            content: message
        };
    if(postData.title == '') {
        warningOpen("消息标题不能为空!");
    } else if(postData.content == '') {
        warningOpen("消息内容不能为空!");
    } else {
        $.post('/man/message/modifyMessage', postData, function(data) {
            if (data.rt == 0) {   
                getMessageList(1,15); 
                alertOff(); 
                warningOpen('保存成功！');      
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！');
            }
        }); 
    }
}
function adda(i){
    var mesgtitle = $('.alert .content .cont').find('input[name=mesgtitle]').val();
    localStorage.setItem("mesgtitle",mesgtitle); 
    var message = $('.cont .content').html();
    localStorage.setItem("message",message); 
    var cont = '';
        cont += '<form autocomplete="off">'
             + '<p><span>链接文本内容 : </span><input type="text" name="hrefname" style="width:310px;"/><span class="lowast">&lowast;</span></p>'
             + '<p><span>URL地址 : </span><input type="text" name="hrefurl" style="width:310px;"/><span class="lowast">&lowast;</span></p>'
             + '<p><a href="#" style="color:#999999;font-size:14px;">您输入的链接中不包含http等协议名称,默认将为您添加http://前缀</a></p>'
             + '</form><div class="line"></div>'
             + '<p><button onclick="a_add('+i+')">保存</button><button onclick="a_off('+i+')">取消</button></p>';
    alertOpen('添加链接', cont);
}
function a_add(i){
    var hrefname = $('.alert .content .cont').find('input[name=hrefname]').val();
    var hrefurl = $('.alert .content .cont').find('input[name=hrefurl]').val();
    alertOff();
    modify(i);
    var mesgtitle = localStorage.getItem("mesgtitle");
    var message = localStorage.getItem("message");
    $('.alert .content .cont').find('input[name=mesgtitle]').val(mesgtitle);
    if(hrefname !='' && hrefurl != ''){
        hrefurl = hrefurl.substr(0,7).toLowerCase() == "http://" ? hrefurl : "http://" + hrefurl;
        $('.alert .content .cont #content').html(message+'<a href="'+hrefurl+'" target="_blank">'+hrefname+'</a>');
    } else {
        $('.alert .content .cont #content').html(message);
        warningOpen('链接名称和地址不能为空！');
    }
}
function a_off(i){
    alertOff();
    modify(i);
}
// 消息列表预览消息
function views(i){
    var tr = $('.message .tb table tr').eq(i);
    var title = tr.find('td').eq(1).text();  
    var content = tr.find('td').eq(5).html(); 
    var cont = '';
        cont += '<p style="margin-top: -40px;margin-bottom: 10px;line-height:40px;text-align:center;color: #666;">'+ title +'</p>'
             +  '<div id="contents" style="margin: 0px 50px 50px 50px; text-align:left;word-break:break-all;min-height:30px;max-height:350px;overflow:auto;text-indent:2em;">'+ content +'</div>'
             + '<div class="line"></div>'
             + '<span><button onclick="alertOff()">确认</button><button onclick="alertOff()">取消</button></span>';
    alertOpen('消息预览', cont);
}
// 添加消息
function addmesg(){
    var sid = getCookie("sid"); 
    var url = hosturl + 'p/org/addMessage';
    var cont = '';
        cont += '<iframe name="iframe" width="0" height="0" style="display:none;"/>'
             + '<form id="addMessagefile" method="post" action="'+url+'" enctype="multipart/form-data" target="iframe" autocomplete="off">'
             + '<p style="margin:0 50px 50px 50px;"><span style="width: 120px;">消息标题 : </span><input type="text" name="title" style="width:320px;"/><span class="lowast"></span></p>'
             + '<p style="margin:0 50px 50px 50px;"><span style="width: 120px;">消息内容 : </span><a href="javascript:addhref()" style="float:left;">添加链接到正文...</a>'
             + '<input type="text" name="sid" style="display:none;" value="'+sid+'"/></p>'
             + '<div contenteditable="true" id="content" style="margin-top:-50px;width:330px;"></div>'
             + '<input type="text"  name="content" style="display:none;"/>'
             + '<p style="margin-bottom: 120px;margin-right:50px;"><input name="fileField" id="textfield" class="txt" placeholder="添加文件..." style="border:none;color:#59AEE5;width:340px;margin-left:75px;" style="z-index:1;"/>'
             + '<input type="file" name="file_data" class="file" id="appfile" size="28" onchange="document.getElementById(\'textfield\').value=this.value"/><a href="javascript:view()" style="float:none;">预览</a><span class="lowast" style="margin-top:-218px;"></span></p>'
             + '<div class="line"></div>'
             + '<span><button type="submit">保存</button><button onclick="alertOff()">取消</button></span></form>';
    alertOpen('添加推送消息', cont);
    $('#addMessagefile').submit(function() {  
        var manager_name = $('.alert .cont p input[name=fileField]').val();
        $('.alert .cont input[name=content]').val($('.alert .cont #content').text());
        if(manager_name){
            $(this).ajaxSubmit({
                resetForm: true,
                beforeSubmit: function() {
                    // warningOpen('正在添加请稍后！');
                },
                success: function(d1, d2) {
                    if (d1.rt == 0) {
                        warningOpen('添加成功！');
                    } else if (d1.rt == 1) {
                        warningOpen('添加失败！');
                    } else if (d1.rt == 5) {
                        toLoginPage();
                    } else {
                        warningOpen('其它错误！');
                    }
                    alertOff();
                }
            });
        } else {
            mesg_add();
        }
        return false;   
    });
}
// 添加消息时添加链接
function addhref(){
    var mesgtitle = $('.alert .content .cont').find('input[name=title]').val();
    localStorage.setItem("mesgtitle",mesgtitle); 
    var message = $('.alert .content .cont #content').html();
    localStorage.setItem("message",message); 
    var cont = '';
        cont += '<form autocomplete="off">'
             + '<p style="margin: 0 40px 50px 10px;"><span style="width:120px;margin-right:40px;text-align:right;">链接文本内容 : </span><input type="text" name="hrefname" style="width:320px;"/><span class="lowast"></span></p>'
             + '<p style="margin: 0 40px 10px 10px;"><span style="width:120px;margin-right:40px;text-align:right;">URL地址 : </span><input type="text" name="hrefurl" style="width:320px;"/><span class="lowast"></span></p>'
             + '<p style="margin: 0 40px 40px auto;"><a href="#" style="color:#999999;font-size:14px;">您输入的链接中不包含http等协议名称,默认将为您添加http://前缀</a></p>'
             + '</form><div class="line"></div>'
             + '<span><button onclick="href_add()">保存</button><button onclick="hrefoff()">取消</button></span>';
    alertOpen('添加链接', cont);
}

// 添加消息添加链接
function href_add(){
    var hrefname = $('.alert .content .cont').find('input[name=hrefname]').val();
    var hrefurl = $('.alert .content .cont').find('input[name=hrefurl]').val();
    alertOff();
    addmesg();
    var mesgtitle = localStorage.getItem("mesgtitle");
    var message = localStorage.getItem("message");
    $('.alert .content .cont').find('input[name=title]').val(mesgtitle);
    if(hrefname !='' && hrefurl != ''){
        hrefurl = hrefurl.substr(0,7).toLowerCase() == "http://" ? hrefurl : "http://" + hrefurl;
        $('.alert .content .cont #content').html(message+'<label>&nbsp;<label><a href="'+hrefurl+'" target="_blank">'+hrefname+'</a><label>&nbsp;<label>');
    } else {
        $('.alert .content .cont #content').html(message);
    }
}
// 未添加文件时消息添加提交
function mesg_add(){
    var mesgtitle = $('.alert .content .cont').find('input[name=title]').val();
    var message = $('.alert .content .cont #content').html();
    var postData = {
            title: mesgtitle,
            content: message
        };
    if(postData.title == ''){
        warningOpen("消息标题不能为空!");
    }else if(postData.content == ''){
        warningOpen("消息内容不能为空!");
    }else{
        $.post('/man/message/addMessage', postData, function(data) {
            if (data.rt == 0) {   
                alertOff();            
                warningOpen('保存成功！');      
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！');
            }
        });
    } 
}
// 添加消息时预览
function view(){
    var mesgtitle = $('.alert .content .cont').find('input[name=title]').val();
    localStorage.setItem("mesgtitle",mesgtitle); 
    var message = $('.alert .content .cont #content').html();
    localStorage.setItem("message",message); 
    var cont = '';
        cont += '<p style="margin-top: -40px;margin-bottom: 10px;line-height:40px;text-align:center;color: #666;">'+ mesgtitle +'</p>'
             + '<div id="view" style="margin: 0px 50px 50px 50px; text-align:left;word-break:break-all;word-wrap: break-word;word-break: normal;min-height:100px;max-height:350px;overflow:auto;text-indent:2em;">'+message+'</div>'
             + '<div class="line"></div>'
             + '<span><button onclick="hrefoff()">确认</button><button onclick="hrefoff()">取消</button></span>';
    alertOpen('消息推送预览', cont);
}
// 添加消息时预览完成
function hrefoff(){    
    alertOff();
    addmesg();
    var mesgtitle = localStorage.getItem("mesgtitle");
    var message = localStorage.getItem("message");
    $('.alert .content .cont').find('input[name=title]').val(mesgtitle);
    $('.alert .content .cont #content').html(message);
}
// 刷新消息列表
function refresh(){
    $('th div').removeClass('radic');
    $('td div').removeClass('radic');
    getMessageList(1,15);
}

// 消息推送
function pushmesg(){
    var i = 0;
    var message_id = '';
    var tab = $('.tb table');
    tab.find('td .select').each(function(){
        if ($(this).hasClass('radic')) {
            i += 1; 
            tr = $(this).parents("tr");
            message_id = tr.find('td').eq(6).text();
        }             
    }); 
    if(i == 1){ 
        $('.center .middle,.footerpage').css({'display':'none'});
        $('.center').css({'bottom':'0px'});
        $('.push').css({'display':'block'});
        $('.push .mesgid').find('input[name=message_id]').val(message_id);

        var url = '/man/message/sendMessage?message_id='+message_id;
        var table1 = $('.lf .sheet'),
            str1 = '<table id="adduser"><tr class="firsttr">'
                + '<th width="43%">登录名</th>'
                + '<th width="43%">姓名</th>'
                + '<th width="50px">操作</th></tr>',
            table2 = $('.rt .sheet'),
            str2 = '<table id="deleteuser"><tr class="firsttr">'
                + '<th width="43%">登录名</th>'
                + '<th width="43%">姓名</th>'
                + '<th width="50px">操作</th></tr>';
        $.get(url, function(data) {
            data = JSON.parse(data);
            if (data.rt==0) {           
                for(var i in data.available_users) {
                    str1 += '<tr>'
                        + '<td>' + data.available_users[i].email + '</td>'
                        + '<td>' + data.available_users[i].name + '</td>'
                        + '<td style="display:none;">' + data.available_users[i].id + '</td>' 
                        + '<td><img src="../imgs/roleadd.png" onclick="adduser(this)" style="vertical-align: middle;cursor:pointer;"/>'              
                        + '</td></tr>';
                }
                str1 +='</table>';
                table1.html(str1);

                for(var j in data.role_users) {
                    str2 += '<tr>'
                        + '<td>' + data.role_users[j].email + '</td>'
                        + '<td>' + data.role_users[j].name + '</td>'
                        + '<td style="display:none;">' + data.role_users[j].id + '</td>' 
                        + '<td><img src="../imgs/roledelete.png" onclick="deleteuser(this)" style="vertical-align: middle;cursor:pointer;"/>'              
                        + '</td></tr>';
                }
                str2 +='</table>';
                table2.html(str2);
            } else if (data.rt==5) {
                toLoginPage();           
            } else{
                warningOpen('其它错误 ' + data.rt +'！');
            }
        });
    }else{
        warningOpen('请选择一条消息进行推送！');
    }
}
// 消息推送添加推送用户
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
    $(obj).parent("td").parent("tr").remove();
}
// 消息推送删除推送用户
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
    $(obj).parent("td").parent("tr").remove();
}
// 消息推送提交
function save(){
    var usertable = $('.rt .sheet table');
    var user_list = [], i = 0;
    usertable.find('tr:not(:first)').remove().each(function () {
        if($(this).css("display") != "none"){
           user_list[i] = $(this).find('td').eq(2).text()*1;
           i = i + 1;
        }
    }); 
    var postData = {
            message_id: $('.push').find('input[name=message_id]').val(),
            users: JSON.stringify(user_list)
        };
    $.post('/man/message/sendMessage', postData, function(data) {
        if (data.rt == 0) {       
            cancel();
            warningOpen('保存成功！');      
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！');
        }
    }); 
}
function cancel(){
    $('.push').css({'display':'none'});  
    $('.center .middle,.footerpage').css({'display':'block'});
    $('.center').css({'bottom':'70px'});
}    
// 消息推送搜索待选用户
function sfreeusers(){
    var s =  $('.push .lf').find('input[name=freeusers]').val();
    var tab = $('.lf .sheet table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    $('.lf .s').removeClass('spic');
    searchbykeywords(s,tab);
    if(!s){
        $('.lf .s').addClass('spic');
    }
}
// 消息推送搜索已经选择用户 
function susers(){
    var s = $('.push .rt').find('input[name=users]').val();
    var tab = $('.rt .sheet table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    $('.rt .s').removeClass('spic');
    searchbykeywords(s,tab);
    if(!s){
        $('.rt .s').addClass('spic');
    }
}

// 删除消息
function delmesg() {
    var i = 0;
    var tab = $('.middle .tb table');
    if(tab.find('td .select').hasClass('radic')){
        i = 1;
    }     
    if(i > 0){
        var cont = '';
        cont += '<div class="rolewarning">确定删除所选消息?</div>'
            + '<span><button onclick="deletes()">确定</button><button onclick="alertOff()">取消</button></span>';
        alertOpen('删除消息', cont);
    }else{
        warningOpen('请选择消息！');
    }
}

// 企业管理员删除多条消息
function deletes() {
    var message_ids = [],
        i = 0;
    var tr;
    var tab = $('.message .tb table');
    tab.find('td .select').each(function () {
        if ($(this).hasClass('radic')) {
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
                getMessageList(1,15);              
                alertOff(); 
                warningOpen('删除成功！');        
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！');
            }
        }); 
    }else{
        warningOpen('请选择消息！');
    }        
}
