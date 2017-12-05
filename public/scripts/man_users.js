/*
 * ==================================================================
 *                          用户组管理 users
 * ==================================================================
 */

$(function() {
    $('.usermenu').addClass('open active');
    $('.usermenu').find('li').eq(1).addClass('active');
    // 用户组
    getUsersList(0);  
});
// 用户组列表
function getUsersList(depart_id){
    var str = '<table class="" style="width:100%;background-color:#fff;" ><tr style="line-height:36px;">'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
            + '<input type="checkbox" onclick="selectedAll(this)"></input>'
            + '<span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>创建人</th>'
            + '<th>用户关联数量</th>'
            + '<th>更新时间</th>'
            + '<th>状态</th>'
            + '<th>操作</th></tr>';
    var str2 = '';
    var status = '';
    var folder = '';
    var table = $('.userstable');
    $.get('/man/users/getUsersList?depart_id=' + depart_id, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.depart_list) {
                status = data.depart_list[i].status == 1 ? '正常' : '禁止';
                folder = data.depart_list[i].child_node != 0 ? 
                '<i class="fa fa-plus faopen"></i><i class="fa fa-minus faclose"></i>' : '';
                str2 = '<td onclick="findChild(this)" class="cursor">'
                     + folder
                     + data.depart_list[i].name + '</td>';
                str += '<tr>'
                      + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)">'
                      + '</input><span class="text"></span></label></div></td>'
                      + str2
                      + '<td>' + data.depart_list[i].creator +'</td>'
                      + '<td><span onclick="add_user(this)" class="cursor"><a>'+data.depart_list[i].current_num +'</a></span></td>'  
                      + '<td>' + data.depart_list[i].update_time +'</td>'
                      + '<td>' + status +'</td>'
                      + '<td style="display:none;">' + data.depart_list[i].id + '</td>'
                      + '<td style="display:none;">' + data.depart_list[i].name + '</td>'
                      + '<td style="display:none;">' + data.depart_list[i].status + '</td>'  
                      + '<td style="display:none;">' + depart_id + '</td>'  
                      + '<td class="other">'           
                      + '<span onclick="modify(this)" class="cursor"><a>编辑</a></span>'
                      + '</td>' 
                      + '</tr>';
            }
            str +='</table>';
            table.html(str);
        } else if (data.rt==5) {
            toLoginPage();           
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
    $('.hrefactive').removeClass("hrefallowed");
}
// 返回列表
function userslist(){
    $('.user, .addur, .user_mod, .addusertitle').css({'display':'none'});
    $('.userslist').css({'display':'block'});
}
// 用户组下级
function findChild(e){
    var id = $(e).parent().find('td').eq(6).text()*1;
    var nextchildid = $(e).parent().next().find('td').eq(9).text()*1;
    if(id != nextchildid){
      $(e).find('.faopen').css('display','none');
      $(e).find('.faclose').css('display','inline-block');
      var trHtml;
      var str2 = '';
      var folder = '';
      var status = '';
      $.get('/man/users/getUsersList?depart_id=' + id, function(data) {
          data = JSON.parse(data);
          if (data.rt==0) {
              for(var i in data.depart_list) {
                  status = data.depart_list[i].status == 1 ? '正常' : '禁止';
                  folder = data.depart_list[i].child_node != 0 ? 
                  '<i class="fa fa-plus faopen"></i><i class="fa fa-minus faclose"></i>' : '';
                  str2 = '<td onclick="findChild(this)" class="cursor" style="padding-left:'
                       + ((data.depart_list[i].layer*1-1)*36)+'px;background:url(../imgs/fold_line.png) no-repeat '
                       + (10+(data.depart_list[i].layer*1-2)*20)+'px 0;">'
                       + folder
                       + data.depart_list[i].name + '</td>';
                  trHtml = '<tr>'
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)">'
                        + '</input><span class="text"></span></label></div></td>'
                        + str2
                        + '<td>' + data.depart_list[i].creator +'</td>'
                        + '<td><span onclick="add_user(this)" class="cursor"><a>'+data.depart_list[i].current_num +'</a></span></td>'    
                        + '<td>' + data.depart_list[i].update_time +'</td>'
                        + '<td>' + status +'</td>'
                        + '<td style="display:none;">' + data.depart_list[i].id + '</td>'
                        + '<td style="display:none;">' + data.depart_list[i].name + '</td>'
                        + '<td style="display:none;">' + data.depart_list[i].status + '</td>'  
                        + '<td style="display:none;">' + id + '</td>' 
                        + '<td class="other">'           
                        + '<span onclick="modify(this)" class="cursor"><a>编辑</a></span>'
                        + '<td>' 
                        + '</tr>';
                $(e).parent().after(trHtml);
              }

          } else if (data.rt==5) {
              toLoginPage();           
          } else {
              warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
          }
      });
    } else {
        showusers(e);
    }
}
var active = '';
function showusers(e){
  var id = $(e).parent().find('td').eq(6).text();
  var childArry = getchildtr(id);
    if (childArry.length > 0) {
        var tab = $('.userstable table');
        tab.find('tr').each(function () {
          if($(this).find('td').eq(6).text() == childArry[0]) {
            $(this).is(":hidden") == true ? active = 'show' : active = 'hide';
          }
        });
  }
  showorhide(e);
  active = '';
}
function showorhide(e){
    var that = e;
    var id = $(e).parent().find('td').eq(6).text();
    var childArry = getchildtr(id);
    if (childArry.length > 0) {
      for (var i in childArry) {
        var tab = $('.userstable table');
        tab.find('tr').each(function () {
          if($(this).find('td').eq(6).text() == childArry[i]) {
              if(active == 'show'){
                  $(this).show();
                  $(that).find('.faopen').hide();
                  $(that).find('.faclose').css('display','inline-block');
              } else{
                  $(this).hide();
                  $(that).find('.faclose').hide();
                  $(that).find('.faopen').css('display','inline-block');
                  showorhide($(this).find('td').eq(1));
              }
              //active === 'show' ? $(this).show() : $(this).hide();
              //if(active === 'hide'){showorhide($(this).find('td').eq(1));}
          }     
        });
      }
    }
}
function getchildtr(id){
    var newArry = new Array();
    var tab = $('.userstable table');
    tab.find('tr').each(function () {
        if($(this).find('td').eq(9).text() == id) {  
            newArry.push($(this).find('td').eq(6).text());
        }     
    });
    return newArry;
}
// 用户组添加用户
function add_user(e){
    var _tr = $(e).parent().parent();
    var id = _tr.find('td').eq(6).text()*1;
    $('.userslist').css({'display':'none'});
    $('.user').css({'display':'block'});
    $('.addur').css({'display':'inline-block'});
    $('.user').find('input[name=depart_id]').val(id);
    var url = '/man/users/freeUserList?depart_id='+id;
    var table1 = $('.freeuser'),
          str1 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="adduser"><tr>'
               + '<th width="50%">账号</th>'
               + '<th width="50%">姓名</th>'
               + '<th width="50px" style="text-align:center;">操作</th></tr>',
    table2 = $('.member'),
      str2 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="deleteuser"><tr>'
           + '<th width="50%">账号</th>'
           + '<th width="50%">姓名</th>'
           + '<th width="50px" style="text-align:center;">操作</th></tr>';
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {           
            for(var i in data.available_users) {
                str1 += '<tr>'
                    + '<td>' + data.available_users[i].account + '</td>'
                    + '<td>' + data.available_users[i].name + '</td>'
                    + '<td style="display:none;">' + data.available_users[i].id + '</td>' 
                    + '<td style="padding:0;text-align:center;"><img src="../imgs/roleadd.png" onclick="adduser(this)" style="vertical-align: middle;cursor:pointer;"/>'             
                    + '</td></tr>';
            }
            str1 +='</table>';
            table1.html(str1);

            for(var j in data.depart_users) {
                str2 += '<tr>'
                    + '<td>' + data.depart_users[j].account + '</td>'
                    + '<td>' + data.depart_users[j].name + '</td>'
                    + '<td style="display:none;">' + data.depart_users[j].id + '</td>' 
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
}
//页面删除用户
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
//页面添加用户
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
//查询未选择的用户
function sfreeusers(){
    var s = document.getElementById("freeusers").value;
    var tab = $('.freeuser table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
//查询用户组内用户
function searchusers(){
    var s = document.getElementById("users").value;
    var tab = $('.member table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
// 用户添加提交
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
            depart_id: $('.user').find('input[name=depart_id]').val()*1,
            user_list: JSON.stringify(user_list)
        };
    $.post('/man/users/addUsers', postData, function(data) {
        if (data.rt == 0) {       
            userslist();
            getUsersList(0); 
            warningOpen('操作成功！','primary','fa-check');  
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    }); 
}
// 修改用户组
function modify(e){
    var _tr = $(e).parent().parent();
    var id = _tr.find('td').eq(6).text()*1;
    var pid = _tr.find('td').eq(9).text()*1;
    var name = _tr.find('td').eq(7).text();
    var status = _tr.find('td').eq(8).text();
    var cont = '';
    var folder = '';
    var checkstr = '';
    var str = '<ul style="padding-left: 20px;">';
    cont += '<div class="modal-header">'
         + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
         + '<h4 class="modal-title">修改用户组</h4>'
         + '</div>'
         + '<div class="modal-body">'
         + '<form role = "form" class="form-horizontal">'
         + '<div class = "form-group">' 
         + '<label class="col-sm-3 control-label" for = "name">名称</label>' 
         + '<div class="col-sm-7">'
         + '<input type = "text" class = "form-control" name="parent_id" value="'+pid+'" style="display:none;"/>' 
         + '<input type = "text" class = "form-control" id = "name" name="name" value="'+name+'" />' 
         + '</div></div>'
         + '<div class = "form-group">' 
         + '<label class="col-sm-3 control-label" for = "tel">状态</label>' 
         + '<div class="col-sm-7">' 
         + '<label class="col-xs-6" style="margin-top:6px;">'
         + '<input name="status" checked="true" type="radio" value="1"/>'
         + '<span class="text">正常</span></label>'
         + '<label class="col-xs-6" style="margin-top:6px;">'
         + '<input name="status" type="radio" value="0"/>'
         + '<span class="text">禁止</span></label>'
         + '</div></div>'
         + '<div class = "form-group">' 
         + '<label class="col-sm-3 control-label" for = "name">上级用户组</label>' 
         + '<div class="col-sm-7">' 
         + '<div id="treegroup" style="height:atuo;max-height:180px;overflow:auto;padding:5px;border:1px solid #ccc;">'
         + '</div>'
         + '</div></div>'
         + '</form>'
         + '</div>'
         + '<div class="modal-footer">'
         + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
         + '<button type="button" class="btn btn-primary" onclick="users_modify('+id+')">确认</button>'
         + '</div>';  
    alertOpen(cont);
    $(document).ready(function(){
        $("input[name=status][value='"+status+"']").attr("checked",true);
    });
    $.get('/man/users/getUsersList?depart_id=' + 0, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.depart_list) {
                checkstr = data.depart_list[i].id == pid ? '<i class="fa fa-check-square-o treechildh cursor" onclick="select(this)">'
                    + '<input type="text" name="tree_id" value="'+data.depart_list[i].id+'" style="display:none;"/></i>'
                    + '<i class="fa fa-square-o treechilds cursor" onclick="cancel(this)" style="display:none;"></i>' : '<i class="fa fa-check-square-o treechildh cursor" style="display:none;" onclick="select(this)">'
                    + '<input type="text" name="tree_id" value="'+data.depart_list[i].id+'" style="display:none;"/></i>'
                    + '<i class="fa fa-square-o treechilds cursor" onclick="cancel(this)"></i>';
                folder = data.depart_list[i].child_node != 0 ? 
                '<i class="fa fa-plus faopen cursor" onclick="opentrees(this)" style="width: 15px;"></i><i class="fa fa-minus faclose cursor" onclick="opentrees(this)" style="width: 15px;"></i>' : '';
                str += '<li class="tree-item">'
                    + '<div class ="tree-item-name">'
                    + checkstr
                    + '<input type="text" name="p_id" value="'+0+'" style="display:none;"/>'
                    + folder
                    + data.depart_list[i].name
                    + '</div>'
                    + '</li>';
            }
            str += '</ul>'
            $("#treegroup").html(str);
        } else if (data.rt==5) {
            toLoginPage();           
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });

}
// 修改用户组提交
function users_modify(id){
    var pid = $('input[name=parent_id]').val()*1;
    var tab = $('#treegroup');
    tab.find('.treechildh').each(function () {
        if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
            pid = $(this).find('input[name=tree_id]').val()*1;
        }     
    }); 
    
    var postData = {
            name: $('input[name=name]').val(),
            id: id,
            status: $("input[name='status']:checked").val(),
            parent_id: pid
        };
    if (postData.name == "") {
        warningOpen('请填写名称！','danger','fa-bolt');
    } else {
        $.post('/man/users/updateUsers', postData, function(data) {
            if (data.rt == 0) {
                alertOff(); 
                getUsersList(0); 
                warningOpen('操作成功！','primary','fa-check');
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    }
}
// 添加用户组
function add(){
    var cont = '';
    var folder = '';
    var str = '<ul style="padding-left: 20px;">';
    cont += '<div class="modal-header">'
         + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
         + '<h4 class="modal-title">添加用户组</h4>'
         + '</div>'
         + '<div class="modal-body">'
         + '<form role = "form" class="form-horizontal">'
         + '<div class = "form-group">' 
         + '<label class="col-sm-3 control-label" for = "name">名称</label>' 
         + '<div class="col-sm-7">' 
         + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入名称"/>' 
         + '</div>' 
         + '<div class="col-sm-2" style="padding-left:0;">' 
         + '<img src = "../imgs/star.png"></img>' 
         + '</div></div>'
         + '<div class = "form-group">' 
         + '<label class="col-sm-3 control-label" for = "name">上级用户组</label>' 
         + '<div class="col-sm-7">' 
         + '<input type="text" name="parent_id" id="parent_id" style="display:none;"/>'
         + '<div id="treegroup" style="height:atuo;max-height:180px;overflow:auto;padding:5px;border:1px solid #ccc;">'
         + '</div>'
         + '</div></div>'
         + '</form>'
         + '</div>'
         + '<div class="modal-footer">'
         + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
         + '<button type="button" class="btn btn-primary" onclick="users_add()">确认</button>'
         + '</div>';  
    alertOpen(cont);
    $.get('/man/users/getUsersList?depart_id=' + 0, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.depart_list) {
                folder = data.depart_list[i].child_node != 0 ? 
                 '<i class="fa fa-plus faopen cursor" onclick="opentrees(this)" style="width: 15px;"></i><i class="fa fa-minus faclose cursor" onclick="opentrees(this)" style="width: 15px;"></i>' : '';
                str += '<li class="tree-item">'
                    + '<div class ="tree-item-name">'
                    + '<i class="fa fa-check-square-o treechildh cursor" style="display:none;" onclick="select(this)">'
                    + '<input type="text" name="tree_id" value="'+data.depart_list[i].id+'" style="display:none;"/></i>'
                    + '<i class="fa fa-square-o treechilds cursor" onclick="cancel(this)"></i>'
                    + '<input type="text" name="p_id" value="'+0+'" style="display:none;"/>'
                    + folder
                    + data.depart_list[i].name
                    + '</div>'
                    + '</li>';
            }
            str += '</ul>'
            $("#treegroup").html(str);
        } else if (data.rt==5) {
            toLoginPage();           
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
} 
var active1 = '';
function opentrees(e){
    var id = $(e).parent().find('input[name=tree_id]').eq(0).val()*1;
    var tab = $('#treegroup');
    var folder = '';
    var isFindChild = true;
    tab.find('input[name=p_id]').each(function () {
        if ($(this).val() == id) {
            isFindChild = false;
            active1 = $(this).parent().parent().is(":visible") == true ? 'hide' : 'show';
        }
    }); 
    if(isFindChild){
        $(e).css('display','none');
        $(e).next().css('display','inline-block');
        var str = '<ul style="padding-left: 20px;">';
        $.get('/man/users/getUsersList?depart_id=' + id, function(data) {
          data = JSON.parse(data);
          if (data.rt==0) {
              for(var i in data.depart_list) {
                  folder = data.depart_list[i].child_node != 0 ? 
                  '<i class="fa fa-plus faopen cursor" onclick="opentrees(this)" style="width: 15px;"></i><i class="fa fa-minus faclose cursor" onclick="opentrees(this)" style="width: 15px;"></i>' : '';
                  str += '<li class="tree-item">'
                      + '<div class ="tree-item-name">'
                      + '<i class="fa fa-check-square-o treechildh cursor" style="display:none;" onclick="select(this)">'
                      + '<input type="text" name="tree_id" value="'+data.depart_list[i].id+'" style="display:none;"/></i>'
                      + '<i class="fa fa-square-o treechilds cursor" onclick="cancel(this)"></i>'
                      + '<input type="text" name="p_id" value="'+id+'" style="display:none;"/>'
                      + folder
                      + data.depart_list[i].name
                      + '</div>'
                      + '</li>';
              }
              str += '</ul>'
              $(e).parent().append(str);
          } else if (data.rt==5) {
              toLoginPage();           
          } else {
              warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
          }
        });
    } else {
        togusers(e);
    }  
}
function togusers(e){
    var that = $(e).parent().parent();
    if(active1 === 'show'){
      $(e).hide();
      $(e).next().css('display','inline-block');
      $(that).find('ul:first > li').show();
      $(that).find('li .faopen').show();
      $(that).find('li .faclose').hide();
    }else{
      $(e).hide();
      $(e).prev().css('display','inline-block');
      $(that).find('li').hide();
      $(that).find('li .faopen').show();
      $(that).find('li .faclose').hide();
    }
    active1 = '';
}

function select(e){
    var tab = $('#treegroup');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).next().show();
}
function cancel(e){
    var tab = $('#treegroup');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).hide();
    $(e).prev().show();
}

// 添加用户组提交操作 
function users_add(){
    var parent_id = 0;
    var tab = $('#treegroup');
    tab.find('.treechildh').each(function () {
        if ($(this).is(":visible")) {
            parent_id = $(this).find('input[name=tree_id]').val()*1;
        }     
    }); 
    var postData = {
            name: $('input[name=name]').val(),
            status: 1,
            parent_id: parent_id
        };
    if (postData.name == "") {
        warningOpen('请填写名称！','danger','fa-bolt');
    } else {
        $.post('/man/users/addUserGroup', postData, function(data) {
            if (data.rt == 0) {
                alertOff(); 
                getUsersList(0); 
                warningOpen('操作成功！','primary','fa-check');
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
    getUsersList(0);
    $('.hrefactive').removeClass("hrefallowed");
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.userstable table');
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
             +  '<button type="button" class="btn btn-primary" onclick="users_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    }
}

// 删除
function users_delete() {
    var departs = [],
            i = 0;
    var tr;
    var tab = $('.userstable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            departs[i] = tr.find('td').eq(6).text()*1;
            i = i+1;
        }     
    });  
    if(departs.length > 0){
        var postData = {
            departs: JSON.stringify(departs)
        };       
        $.post('/man/users/delUsers', postData, function(data) {
            if (data.rt == 0) {               
                getUsersList(0);  
                alertOff(); 
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }else{
        warningOpen('请选择标签！','danger','fa-bolt');
    }        
}
