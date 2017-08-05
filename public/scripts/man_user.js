/*
 * ==================================================================
 *                          用户管理 user
 * ==================================================================
 */

$(function() {
    $('.usermenu').addClass('open active');
    $('.usermenu').find('li').eq(0).addClass('active');
    // 用户列表
    getUserList(1,10,'');  
});
// 用户列表
function getUserList(start,length,keyword) {
    var st = 1;
    var url = '/man/user/getUserList?start='+ start + '&length='+ length;
        url += keyword?'&keyword=' + keyword : '';
    var table = $('.userlist .usertable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>Email</th>'
            + '<th>姓名</th>'
            + '<th>电话</th>'
            + '<th>部门</th>'
            + '<th>注册时间</th>'
            + '<th>其他操作</th></tr>';
    $.get(url, function(data) {
        console.log("data = "+data);
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.user_list) {
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                    + '<td>' + data.user_list[i].email + '</td>'
                    + '<td>' + data.user_list[i].name + '</td>'
                    + '<td>' + data.user_list[i].phone + '</td>'
                    + '<td>' + data.user_list[i].depart_name + '</td>'
                    + '<td>' + data.user_list[i].create_time + '</td>' 
                    + '<td style="display:none;">' + data.user_list[i].id + '</td>'   
                    + '<td style="display:none;">' + data.user_list[i].policy_id + '</td>' 
                    + '<td style="display:none;">' + data.user_list[i].depart_id + '</td>'
                    + '<td style="display:none;">' + data.user_list[i].sex + '</td>'                                   
                    + '<td class="other">'           
                    + '<a href="javascript:user_apps('+ i +');">授权应用</a>&nbsp;&nbsp;&nbsp;&nbsp;'
                    + '<a href="javascript:user_resetpwd('+ i +');">修改密码</a>&nbsp;&nbsp;&nbsp;&nbsp;' 
                    + '<a href="javascript:user_modify('+ i +');">修改信息</a>'
                    + '</td></tr>';
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,data.total_count,st);  

        } else if (data.rt==5) {
            toLoginPage();           
        }
    });
    currentpage = start;
    console.log('sendurl = '+sendurl);
}
// page页查询
function search(p,i) {
    var email = $('.tab .tabbable').find('input[name=email]').val();
    if(i == 1){
        getUserList(p,10,'');
    } else if(i == 2){
        getauthappList(email,1,p,10);
    } else if(i == 3){
        getauthappList(email,0,p,10);;
    } else{
        console.log(i);
    }
}
// 返回用户列表
function userlist(){
    $('.tab, .apph').css({'display':'none'});
    $('.userlist').css({'display':'block'});
}
//修改用户密码
function user_resetpwd(i) {
    var cont = '';
          cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">修改密码</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "newpwd">新密码</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="password" class = "form-control" id = "newpwd" name="newpwd" placeholder = "请输入新密码"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "confirpw">确认新密码</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="password" class = "form-control" id = "confirpw" name="confirpw" placeholder = "再次输入新密码"/>' 
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="user_updatePW('+i+')">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 管理员修改用户密码提交操作
function user_updatePW(i) {
    var _tr = $('.usertable table tr').eq(i+1);
    var email = _tr.find('td').eq(1).text();
    var newpw = $('input[name=newpwd]').val();
    var confirpw = $('input[name=confirpw]').val();
    var postData = {
        newpw: newpw,
        email: email
    };
    if (postData.newpw =='') {
        warningOpen('请输入新密码！','danger','fa-bolt');
    } else if (confirpw!=postData.newpw) {
        warningOpen('前后密码不一致！','danger','fa-bolt');
    } else {  
        $.post('/man/user/updatePwd', postData, function(data) {
            if (data.rt==0) {
                alertOff();
                warningOpen('操作成功！','primary','fa-check');
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    }  
}

// 管理员修改用户信息
function user_modify(i) {
    var _tr = $('.usertable table tr').eq(i+1);
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">修改用户信息</h4>'
             + '</div>'

             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">姓名</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" value="'+_tr.find('td').eq(2).text()+'"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "tel">电话号码</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" class="form-control" id = "tel" name="phone" value="'+_tr.find('td').eq(3).text()+'"/>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "profession">部门</label>' 
             + '<div class="col-sm-7">' 
             + '<select id = "profession" name="depart" class = "form-control" >' 
             + '</select>'
             + '</div></div>'
             + '</form>'
             + '</div>'

             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="user_update('+i+')">确认</button>'
             + '</div>';  
    alertOpen(cont);
     
    $.get('/man/dep/getDepartList?start_page='+1+ '&page_length='+ 1000, function(data) {  // 获取部门列表
        data = JSON.parse(data);
        if (data.rt == 0) {
            var select = $('select[name=depart]'),
                str = "";
            for (var i=0; i<data.depart_list.length; i++){
                str += data.depart_list[i].id == _tr.find('td').eq(8).text() ? "<option value=\"" + data.depart_list[i].id + "\" selected='selected'>"
                    + data.depart_list[i].name + "</option>" : "<option value=\"" + data.depart_list[i].id + "\">"
                    + data.depart_list[i].name + "</option>"; 
            }
            select.html(str);
        } else {
            warningOpen('获取部门失败！','danger','fa-bolt');
        }
    });

    $('input[name=phone').keyup(function(){  // 输入限制，只能输入整数
        if (this.value.length==1) {
            this.value=this.value.replace(/[^1-9]/g,'');
        } else {
            this.value=this.value.replace(/\D/g,'');
        }
        this.value=this.value.substring(0,11);
    });
}

// 修改用户信息提交
function user_update(i) { 
    var _tr = $('.userlist .usertable table tr').eq(i+1);
    var id = _tr.find('td').eq(6).text();
    var name = $('input[name=name]').val();
    var phone = $('input[name=phone]').val();
    var depart_id = $('select[name=depart]').val();
    var email = _tr.find('td').eq(1).text();
    var policy_id = _tr.find('td').eq(7).text();
    var sex = _tr.find('td').eq(9).text();
    var postData = {
        id: id,
        name: name,
        phone: phone,
        depart_id: depart_id,
        email: email,
        policy_id: policy_id,
        sex: sex   
    };
    var ts = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var pflag = ts.test(postData.phone);
    if (!postData.name) {
        warningOpen('请输入用户名！','danger','fa-bolt');
    } else if (!pflag) {
        warningOpen('请输入正确的联系电话！','danger','fa-bolt');
    } else if (!postData.depart_id) {
        warningOpen('请选择用户所属部门！','danger','fa-bolt');
    } else {  
        $.post('/man/user/updateUser', postData, function(data) {
            if (data.rt==0) { 
                getUserList(currentpage,10,'');  
                alertOff();
                warningOpen('操作成功！','primary','fa-check');      
            } else if (data.rt==5) {
                toLoginPage();
            } else if (data.rt == 25) {
                warningOpen('手机号已存在！','danger','fa-bolt');
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    }
}
// 用户应用管理
function user_apps(i){  
    var tr = $('.usertable table tr').eq(i+1),
        email = tr.find('td').eq(1).text();  
    getauthappList(email,1,1,10);    
    $('.userlist').css({'display':'none'});
    $('.tab').css({'display':'block'});
    $('.apph').css({'display':'inline-block'});
    getauthappList(email,0,1,10);   
    $('.tab .tabbable').find('input[name=email]').val(email);      
}

// 获取用户授权app列表
function getauthappList(email,state,start_page,page_length){  
    var security_state = '';
    var platform = '';
    var strtab1 = '<table class="table table-striped table-bordered table-hover"><tr>'
                + '<th width="40px">logo</th>'
                + '<th>app名称</th>'
                + '<th>版本</th>'
                + '<th>平台</th>'
                + '<th>安全状态</th>'
                + '<th>供应商</th>'
                + '<th>更新时间</th>'
                + '<th>其它</th></tr>';
    $.get('/man/userauth/authAppList?email='+email+'&state='+ state +'&start_page='+ start_page +'&page_length='+page_length, function(data) {
        data = JSON.parse(data);
        if (data.rt == 0) {          
            for(var i in data.app_list) {
                if(data.app_list[i].security_state == 0){
                    security_state = '未检测';
                } else if(data.app_list[i].security_state == 1){
                    security_state = '安全';
                } else {
                    security_state = '危险';
                }
                platform = data.app_list[i].platform==0 ? 'Ios' : 'Android';

                strtab1 += '<tr>'
                        + '<td width="40px" style="padding:3.5px;"><div class="icon"><img width="27px" height="27px" src="' + picurl + data.app_list[i].icon + '"/></div></td>'
                        + '<td>' + data.app_list[i].app_name + '</td>'
                        + '<td>' + data.app_list[i].version + '</td>'
                        + '<td>' + platform + '</td>'
                        + '<td>' + security_state + '</td>'
                        + '<td>' + data.app_list[i].from + '</td>'
                        + '<td>' + data.app_list[i].modified + '</td>'
                        + '<td>' + data.app_list[i].package_name + '</td>'
                        + '<td style="display:none;">' + JSON.stringify(data.app_list[i].app_rule) + '</td></tr>';
            }
            strtab1 +='</table>';
            if(state == 1){
                $('#authapp1 .apptable').html(strtab1);
                createFooter(start_page,page_length,data.total_count,2);
            } else {
                $('#unauthapp1 .apptable').html(strtab1);
                createFooter(start_page,page_length,data.total_count,3);
            }
        } else if (data.rt == 5) {
            toLoginPage();           
        }
    });
}
// 添加用户
function add(){
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">添加用户</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">姓名</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入姓名"/>' 
             + '</div>' 
             + '<div class="col-sm-2" style="padding-left:0;">' 
             + '<img src = "../imgs/star.png"></img>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "email">登录名</label>' 
             + '<div class="col-sm-7">' 
             + '<input type ="email" class = "form-control" id = "email" name="mail" placeholder = "请输入邮箱"/>'
             + '</div>' 
             + '<div class="col-sm-2" style="padding-left:0;">' 
             + '<img src = "../imgs/star.png"></img>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "tel">电话号码</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" class="form-control" id = "tel" name="phone" placeholder = "请输入联系电话"/>'
             + '</div>' 
             + '<div class="col-sm-2" style="padding-left:0;">' 
             + '<img src = "../imgs/star.png"></img>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "profession">选择部门</label>' 
             + '<div class="col-sm-7">' 
             + '<select id = "profession" name="depart" class = "form-control">' 
             + '</select>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "tel">性别</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6" style="margin-top:6px;">'
             + '<input name="sex" checked="true" type="radio" value="1"/>'
             + '<span class="text">男</span></label>'
             + '<label class="col-xs-6" style="margin-top:6px;">'
             + '<input name="sex" type="radio" value="0"/>'
             + '<span class="text">女</span></label>'
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="user_add()">确认</button>'
             + '</div>';  
    alertOpen(cont);
     
    $.get('/man/dep/getDepartList?start_page='+1+ '&page_length='+ 1000, function(data) {  // 获取部门列表
        data = JSON.parse(data);
        if (data.rt == 0) {
            var select = $('select[name=depart]'),
                str = "";
            for (var i=0; i<data.depart_list.length; i++){
                str += "<option value=\"" + data.depart_list[i].id + "\">"
                    + data.depart_list[i].name + "</option>";
            }
            select.html(str);
        } else {
            warningOpen('获取部门失败！','danger','fa-bolt');
        }
    });
}
// 添加用户提交操作 
function user_add(){
    var passwd = '111111';
    var postData = {
            username: $('input[name=name]').val(),
            email: $('input[name=mail]').val(),
            phone: $('input[name=phone]').val(),
            departId: $('select[name=depart]').val(),
            sex: $('input:radio[name="sex"]:checked').val(),
            passwd: passwd
        };
    // 邮箱验证
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    var regtel = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if (postData.username == "") {
        warningOpen('请填写用户名！','danger','fa-bolt');
    } else if (!reg.test(postData.email)) {
        warningOpen('请填写正确的邮箱！','danger','fa-bolt');
    } else if(!regtel.test(postData.phone)){
        warningOpen('请填写正确的电话号！','danger','fa-bolt');
    } else {
        $.post('/man/user/addUser', postData, function(data) {
            if (data.rt == 0) {
                alertOff(); 
                getUserList(currentpage,10,''); 
                warningOpen('操作成功！','primary','fa-check');
            } else if (data.rt == 25) {
                warningOpen('该用户已存在！','danger','fa-bolt');
            } else if (data.rt == 5) {
                toLoginPage();
            } else if (data.rt == 7) {
                warningOpen('该用户已存在！','danger','fa-bolt');
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    }
}
// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getUserList(currentpage,10,'');
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.usertable table');
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
             +  '<button type="button" class="btn btn-primary" onclick="user_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的账号！','danger','fa-bolt');
    }
}

// 企业管理员删除多个用户
function user_delete() {
    var userId = [],
            i = 0;
    var tr;
    var tab = $('.usertable table');
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
        console.log(userId);
       /* 
        $.post('/man/user/delUser', postData, function(data) {
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
        warningOpen('请选择用户！','danger','fa-bolt');
    }        
}
