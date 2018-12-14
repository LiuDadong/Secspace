/*
 * ==================================================================
 *                          标签 tag
 * ==================================================================
 */


// 标签列表
getTagList(1,10); 
// app标签列表
function getTagList(start,length){   
    var st = 1;
    var tag_type = '';
    var status = '';
    var table = $('.tagtable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox">'
            + '<label><input type="checkbox" onclick="selectedAll(this)" />'
            + '<span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>创建者</th>'
            + '<th>类型</th>'
            + '<th>用户关联数量</th>'
            + '<th>更新时间</th>'
            + '<th>状态</th>'
            + '<th>操作</th></tr>';

    var url = '/man/tag/getTagList?start='+ start + '&length='+ length;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt=='0000') {
            for(var i in data.tag_list) {
                tag_type = data.tag_list[i].tag_type == 1 ? '动态标签' : '静态标签';
                status = data.tag_list[i].status == 1 ? '正常' : '禁用';
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label>'
                    + '<input type="checkbox" onclick="selected(this)" />'
                    + '<span class="text"></span></label></div></td>'
                    + '<td>' + data.tag_list[i].name + '</td>'
                    + '<td>' + data.tag_list[i].creator + '</td>'
                    + '<td>' + tag_type + '</td>'
                    + '<td>'
                    + '<a href="javascript:add_user('+ i +');">'+data.tag_list[i].user_num +'</a>'  
                    + '</td>'
                    + '<td>' + data.tag_list[i].create_time + '</td>' 
                    + '<td>' + status + '</td>'   
                    + '<td style="display:none;">' + data.tag_list[i].id + '</td>' 
                    + '<td style="display:none;">' + data.tag_list[i].description + '</td>'
                    + '<td style="display:none;">' + data.tag_list[i].tag_type + '</td>' 
                    + '<td style="display:none;">' + data.tag_list[i].status + '</td>'  
                    + '<td>'  
                    + '<a class="btn btn-primary btn-xs" href="javascript:tag_modify('+ i +');">编辑</a>'  
                    + '<a class="btn btn-primary btn-xs" href="javascript:tag_view('+ i +');">详情</a>'    
                    + '</td></tr>';
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,data.total_count,st);
        }
    });
    $('.hrefactive').removeClass("hrefallowed");
    currentpage = start;
}
// page页查询
function search(p,i) {
    if(i == 1){
        getTagList(p,10);
    } else {
        console.warn(i);
    }
}
// 返回列表
function taglist(){
    $('.user, .addt').css({'display':'none'});
    $('.taglist').css({'display':'block'});
}
// 管理员修改信息
function tag_modify(i) {
    var _tr = $('.tagtable table tr').eq(i+1);
    var id = _tr.find('td').eq(7).text();
    var tag_type = _tr.find('td').eq(9).text();
    var status = _tr.find('td').eq(10).text();
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">修改信息</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" value="'+_tr.find('td').eq(1).text()+'" />' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "tag_type">类型</label>' 
             + '<div class="col-sm-7">' 
             + '<select id = "tag_type" name="tag_type" class = "form-control">' 
             + '<option value="0">静态标签</option>'
             + '<option value="1">动态标签</option>'
             + '</select>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "status">状态</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6" style="margin-top:6px;">'
             + '<input name="status" checked="true" type="radio" value="1" />'
             + '<span class="text">正常</span></label>'
             + '<label class="col-xs-6" style="margin-top:6px;">'
             + '<input name="status" type="radio" value="0" />'
             + '<span class="text">禁用</span></label>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "description">描述</label>' 
             + '<div class="col-sm-7">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="7" name="description" id="description">'+_tr.find('td').eq(8).text()+'</textarea>'
             + '</span>'
             + '</div></div>'            
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="tag_update('+id+')">确认</button>'
             + '</div>';  
    alertOpen(cont);
    $(document).ready(function(){
        $("input[name=status][value='"+status+"']").attr("checked",true);
        $("select[name='tag_type']").val(tag_type);
    });
}
// 修改
function tag_update(id){
    var postData = {
            name: $('input[name=name]').val(),
            tag_type: $('select[name=tag_type]').val(),
            status: $("input[name='status']:checked").val(),
            description: $('textarea[name=description]').val(),
            tag_id: id
        };
    if (postData.name == "") {
        warningOpen('请填写标签名称！','danger','fa-bolt');
    } else {
        $.actPost('/man/tag/updateTag', postData, function(data) {
            if (data.rt == '0000') {
                alertOff();
                getTagList(currentpage,10);          
            }
        });
    }
}
// 查看
function tag_view(i){
    var _tr = $('.tagtable table tr').eq(i+1);
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">详细信息</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">名称</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="control-label">'+_tr.find('td').eq(1).text()+'</label>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">类型</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="control-label">'+_tr.find('td').eq(3).text()+'</label>'        
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">状态</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="control-label">'+_tr.find('td').eq(6).text()+'</label>'  
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "description">描述</label>' 
             + '<div class="col-sm-7" style="padding-top:8px;max-height:200px;overflow:auto">' 
             + _tr.find('td').eq(8).text()
             + '</div></div>'            
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="alertOff()">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 标签添加用户
function add_user(i){
    var _tr = $('.tagtable table tr').eq(i+1);
    var id = _tr.find('td').eq(7).text();
    $('.taglist').css({'display':'none'});
    $('.user').css({'display':'block'});
    $('.addt').css({'display':'inline-block'});
    $('.user').find('input[name=tag_id]').val(id);
    var url = '/man/tag/tagManagement?tag_id='+id;
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
        if (data.rt=='0000') {           
            for(var i in data.available_users) {
                str1 += '<tr>'
                    + '<td>' + data.available_users[i].account + '</td>'
                    + '<td>' + data.available_users[i].name + '</td>'
                    + '<td style="display:none;">' + data.available_users[i].id + '</td>' 
                    + '<td style="padding:0;text-align:center;"><img src="../imgs/roleadd.png" onclick="adduser(this)" style="vertical-align: middle;cursor:pointer;" />'             
                    + '</td></tr>';
            }
            str1 +='</table>';
            table1.html(str1);

            for(var j in data.tag_users) {
                str2 += '<tr>'
                    + '<td>' + data.tag_users[j].account + '</td>'
                    + '<td>' + data.tag_users[j].name + '</td>'
                    + '<td style="display:none;">' + data.tag_users[j].id + '</td>' 
                    + '<td style="padding:0;text-align:center;"><img src="../imgs/roledelete.png" onclick="deleteuser(this)" style="vertical-align: middle;cursor:pointer;" />'             
                    + '</td></tr>';
            }
            str2 +='</table>';
            table2.html(str2);
        }
    });
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
    v.innerHTML='<img src="../imgs/roleadd.png" onclick="adduser(this)" style="vertical-align: middle;cursor:pointer;" />';
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
    v.innerHTML='<img src="../imgs/roledelete.png" onclick="deleteuser(this)" style="vertical-align: middle;cursor:pointer;" />';
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
    var user_list = [], i = 0, app_list = [];
    usertable.find('tr:not(:first)').remove().each(function () {
        if($(this).css("display") != "none"){
           user_list[i] = $(this).find('td').eq(2).text()*1;
           i = i + 1;
        }
    }); 
    var postData = {
            tag_id: $('.user').find('input[name=tag_id]').val(),
            user_list: JSON.stringify(user_list),
            app_list: JSON.stringify(app_list)
        };
    $.actPost('/man/tag/addUsers', postData, function(data) {
        if (data.rt == '0000') {       
            taglist();
            getTagList(currentpage,10);
        }
    }); 
}
// 添加
function add(){
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">添加标签</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入名称" />' 
             + '</div>' 
             + '<div class="col-sm-2" style="padding-left:0;">' 
             + '<img src = "../imgs/star.png"></img>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "tag_type">类型</label>' 
             + '<div class="col-sm-7">' 
             + '<select id = "tag_type" name="tag_type" class = "form-control">' 
             + '<option value="0">静态标签</option>'
             + '<option value="1">动态标签</option>'
             + '</select>'
             + '</div>' 
             + '<div class="col-sm-2" style="padding-left:0;">' 
             + '<img src = "../imgs/star.png"></img>' 
             + '</div></div>'
             /*+ '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "status">状态</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6" style="margin-top:6px;">'
             + '<input name="status" checked="true" type="radio" value="1" />'
             + '<span class="text">正常</span></label>'
             + '<label class="col-xs-6" style="margin-top:6px;">'
             + '<input name="status" type="radio" value="0" />'
             + '<span class="text">禁用</span></label>'
             + '</div></div>'*/
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "description">描述</label>' 
             + '<div class="col-sm-7">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="7" name="description" id="description" placeholder = "请输入描述信息"></textarea>'
             + '</span>'
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="tag_add()">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 添加提交操作 
function tag_add(){
    var postData = {
            name: $('input[name=name]').val(),
            tag_type: $('select[name=tag_type]').val(),
           // status: $("input[name='status']:checked").val(),
            status: 1,
            description: $('textarea[name=description]').val()
        };
    if (postData.name == "") {
        warningOpen('请填写名称！','danger','fa-bolt');
    } else {
        $.actPost('/man/tag/addTag', postData, function(data) {
            if (data.rt == '0000') {
                alertOff();
                getTagList(currentpage,10); 
            }
        });
    }
}
// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getTagList(currentpage,10);
    $('.hrefactive').removeClass("hrefallowed");
}
// 删除提示
function deletes(){
    var i = 0;
    var tab = $('.tagtable table');
    if(tab.find('span').hasClass('txt')){
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
             +  '<button type="button" class="btn btn-primary" onclick="tag_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    }
}

// 删除
function tag_delete() {
    var tag_ids = [],
            i = 0;
    var tr;
    var tab = $('.tagtable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            tag_ids[i] = tr.find('td').eq(7).text()*1;
            i = i+1;
        }     
    });  
    if(tag_ids.length > 0){
        var postData = {
            tag_ids: JSON.stringify(tag_ids)
        };       
        $.actPost('/man/tag/delTag', postData, function(data) {
            if (data.rt == '0000') {               
                getTagList(1,10);  
                alertOff(); 
            }
        }); 
    }else{
        warningOpen('请选择标签！','danger','fa-bolt');
    }        
}
