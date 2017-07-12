/*
 * ==================================================================
 *                          用户管理 role
 * ==================================================================
 */

$(function() {
    $('.usermenu').addClass('open active');
    $('.usermenu').find('li').eq(2).addClass('active');
    // 角色列表
    getRoleList(1,10);
});

// 角色信息列表
function getRoleList(start,length) {
    var url = '/man/role/getRoleList?start='+ start + '&length='+ length;
    var st = 1;
    var table = $('.rolelist .roletable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable" style="table-layout: fixed;"><tr>'
            //+ '<th class="sel" onclick="selectedAll(this)"><i class="fa"></i></th>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th style="width:20%;">角色名称</th>'
            + '<th style="width:28%;text-overflow:ellipsis; white-space: nowrap;overflow: hidden;overflow:hidden;">角色描述</th>'
            + '<th style="width:28%;">创建时间</th>'
            + '<th style="width:24%;">其它</th></tr>';
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
           
            for(var i in data.role_list) {
                str += '<tr>'
                    //+ '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                    + '<td>' + data.role_list[i].name + '</td>'
                    + '<td title="'+data.role_list[i].description+'">' + data.role_list[i].description + '</td>'
                    + '<td>' + data.role_list[i].create_time + '</td>'
                    + '<td style="display:none;">' + data.role_list[i].id + '</td>'                                   
                    + '<td>'                
                    + '<a href="javascript:role('+ i +');">角色管理</a>&nbsp;&nbsp;&nbsp;&nbsp;'
                    + '<a href="javascript:modrole('+ i +');">修改信息</a>'
                    + '</td></tr>';
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        } else {
            warningOpen('其它错误 ' + data.rt +'！');
        }
    });
    currentpage = start; 
}
// page页查询
function search(p,i) {
    if(i == 1){
        getRoleList(p,10);
    } else{
        console.log(i);
    }
}
// 返回角色列表
function rolelist(){
    $('.role, .roleadd').css({'display':'none'});
    $('.rolelist').css({'display':'block'});
}
// 角色管理
function role(i){
    var tr = $('.roletable table tr').eq(i+1);
    role_id = tr.find('td').eq(4).text(); 
    $('.rolelist').css({'display':'none'});
    $('.role').css({'display':'block'});
    $('.roleadd').css({'display':'inline-block'});

    var url = '/man/role/getRoleManagerList?role_id='+role_id;
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
    var table3 = $('.freeapp'),
        str3 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="addapp"><tr>'
                + '<th width="50%">应用名称</th>'
                + '<th width="50%">版本号</th>'
                + '<th width="50px" style="text-align:center;">操作</th></tr>',
        table4 = $('.apps'),
        str4 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="deleteapp"><tr>'
                + '<th width="50%">应用名称</th>'
                + '<th width="50%">版本号</th>'
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

            for(var j in data.role_users) {
                str2 += '<tr>'
                    + '<td>' + data.role_users[j].email + '</td>'
                    + '<td>' + data.role_users[j].name + '</td>'
                    + '<td style="display:none;">' + data.role_users[j].id + '</td>' 
                    + '<td style="padding:0;text-align:center;"><img src="../imgs/roledelete.png" onclick="deleteuser(this)" style="vertical-align: middle;cursor:pointer;"/>'              
                    + '</td></tr>';
            }
            str2 +='</table>';
            table2.html(str2);

            for(var x in data.available_apps) {
                str3 += '<tr>'
                    + '<td>' + data.available_apps[x].app_name + '</td>'
                    + '<td>' + data.available_apps[x].version + '</td>'
                    + '<td style="display:none;">' + data.available_apps[x].id + '</td>' 
                    + '<td style="padding:0;text-align:center;"><img src="../imgs/roleadd.png" onclick="addapp(this)" style="vertical-align: middle;cursor:pointer;"/>'              
                    + '</td></tr>';
            }
            str3 +='</table>';
            table3.html(str3);

            for(var y in data.role_apps) {
                str4 += '<tr>'
                    + '<td>' + data.role_apps[y].app_name + '</td>'
                    + '<td>' + data.role_apps[y].version + '</td>'
                    + '<td style="display:none;">' + data.role_apps[y].id + '</td>' 
                    + '<td style="padding:0;text-align:center;"><img src="../imgs/roledelete.png" onclick="deleteapp(this)" style="vertical-align: middle;cursor:pointer;"/>'              
                    + '</td></tr>';
            }
            str4 +='</table>';
            table4.html(str4);
        } else if (data.rt==5) {
            toLoginPage();           
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
}
//删除角色内用户
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
//删除角色内应用
function deleteapp(obj){
    var tr = $(obj).parent().parent();
    var rowIndex = tr.index()+1;
    var name = tr.find('td').eq(0).text();
    var version = tr.find('td').eq(1).text();
    var id = tr.find('td').eq(2).text();
    var tab = document.getElementById("addapp");
      //表格行数
    var rows = tab.rows.length*1;
    var x=document.getElementById('addapp').insertRow(rows);
    var y=x.insertCell(0);
    var z=x.insertCell(1);
    var k=x.insertCell(2);
    var v=x.insertCell(3);
    y.innerHTML=name;
    z.innerHTML=version;
    k.innerHTML=id;
    v.innerHTML='<img src="../imgs/roleadd.png" onclick="addapp(this)" style="vertical-align: middle;cursor:pointer;"/>';
    k.style.display = 'none';
    v.style.padding = '0';
    v.style.textAlign = 'center';
    $(obj).parent("td").parent("tr").remove();
}
//角色添加用户
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
//角色添加应用
function addapp(obj){
    var tr = $(obj).parent().parent();
    var rowIndex = tr.index()+1;
    var name = tr.find('td').eq(0).text();
    var version = tr.find('td').eq(1).text();
    var id = tr.find('td').eq(2).text();

    var tab = document.getElementById("deleteapp");
      //表格行数
    var rows = tab.rows.length*1;
    var t=document.getElementById('deleteapp').insertRow(rows);
    var y=t.insertCell(0);
    var z=t.insertCell(1);
    var k=t.insertCell(2);
    var v=t.insertCell(3);
    y.innerHTML=name;
    z.innerHTML=version;
    k.innerHTML=id;
    v.innerHTML='<img src="../imgs/roledelete.png" onclick="deleteapp(this)" style="vertical-align: middle;cursor:pointer;"/>';
    k.style.display = 'none';
    v.style.padding = '0';
    v.style.textAlign = 'center';
    $(obj).parent("td").parent("tr").remove();
}

//保存角色管理
function rolesave(){
    var usertable = $('.member table');
    var apptable = $('.apps table');
    var user_list = [], i = 0;
    var app_list = [], j = 0;
    usertable.find('tr:not(:first)').remove().each(function () {
        if($(this).css("display") != "none"){
           user_list[i] = $(this).find('td').eq(2).text()*1;
           i = i + 1;
        }
    });
    apptable.find('tr:not(:first)').remove().each(function () {
        if($(this).css("display") != "none"){
           app_list[j] = $(this).find('td').eq(2).text()*1;
           j = j + 1;
        }
    });
    var postData = {
            role_id: role_id,
            user_list: JSON.stringify(user_list),
            app_list: JSON.stringify(app_list)
        };
    $.post('/man/role/roleManagement', postData, function(data) {
        if (data.rt == 0) {   
            rolelist();            
            warningOpen('操作成功！','primary','fa-check');      
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    }); 
}
//搜索不属于任何角色的用户
function sfreeusers(){
    var s = document.getElementById("freeusers").value;
    var tab = $('.freeuser table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
//搜索属于该角色的用户
function sroleusers(){
    var s = document.getElementById("roleusers").value;
    var tab = $('.member table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
//搜索未分配给该角色的应用
function sfreeapps(){
    var s = document.getElementById("freeapps").value;
    var tab = $('.freeapp table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
//搜索该角色内应用
function sroleapps(){
    var s = document.getElementById("roleapps").value;
    var tab = $('.apps table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
// 修改角色
function modrole(i){   
    var tr = $('.rolelist .roletable table tr').eq(i+1);
    var role_id = tr.find('td').eq(4).text();  
    var name = tr.find('td').eq(1).text();
    var description = tr.find('td').eq(2).text();
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">修改角色</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">角色名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" value="'+name+'"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "content">描述信息</label>' 
             + '<div class="col-sm-7">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="7" name="content" id="content">'+description+'</textarea>'
             + '</span>'
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="role_modify('+role_id+')">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 修改角色
function role_modify(role_id){
    var postData = {
            name: $('input[name=name]').val(),
            description: $('textarea[name=content]').val(),
            role_id: role_id
        };
    if (postData.name == "") {
        warningOpen('请填写角色名称！','danger','fa-bolt');
    } else if(postData.description == ""){
        warningOpen('请填写角色描述！','danger','fa-bolt');
    } else {
        $.post('/man/role/modifyRole', postData, function(data) {
            if (data.rt == 0) {
                warningOpen('操作成功！','primary','fa-check'); 
                alertOff(); 
                getRoleList(currentpage,10);          
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    }
}
//添加角色
function add(){
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">添加角色</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">角色名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入角色名称"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "content">描述信息</label>' 
             + '<div class="col-sm-7">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="7" name="content" id="content" placeholder = "请输入描述信息"></textarea>'
             + '</span>'
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="role_add()">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
function role_add(){
    var postData = {
            name: $('input[name=name]').val(),
            description: $('textarea[name=content]').val()
        };
    if (postData.name == "") {
        warningOpen('请填写角色名称！','danger','fa-bolt');
    } else if(postData.description == ""){
        warningOpen('请填写角色描述！','danger','fa-bolt');
    } else {
        $.post('/man/role/addRole', postData, function(data) {
            if (data.rt == 0) {
                getRoleList(currentpage,10);
                warningOpen('操作成功！','primary','fa-check');
                alertOff();
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    }
}
// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getRoleList(currentpage,10);
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.rolelist .roletable table');
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
             +  '<button type="button" class="btn btn-primary" onclick="role_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的账号！','danger','fa-bolt');
    }
}

// 企业管理员删除多个角色
function role_delete() {
    var roles = [],
            i = 0;
    var tr;
    var tab = $('.rolelist .roletable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            roles[i] = tr.find('td').eq(4).text()*1;
            i = i+1;
        }     
    });  
    if(roles.length > 0){
        var postData = {
            roles: JSON.stringify(roles)
        };
        
        $.post('/man/role/delRole', postData, function(data) {
            if (data.rt == 0) {               
                getRoleList(1,10);  
                alertOff(); 
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误! ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    } else {
        warningOpen('请选择角色！','danger','fa-bolt');
    }        
}
