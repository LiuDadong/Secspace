/*
 * ==================================================================
 *                          部门管理 depart
 * ==================================================================
 */

$(function() {
    $('.usermenu').addClass('open active');
    $('.usermenu').find('li').eq(1).addClass('active');
    // 部门管理列表
    getDepartList(1,10);  
});
// 查询部门列表
function getDepartList(start_page,page_length){  
    var table = $('.departlist .departtable'), str = '', st = 1;   
    var url = '/man/dep/getDepartList?start_page='+start_page
            + '&page_length='+ page_length;    
           
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt == 0) {
            str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
                + '<th class="sel" onclick="selectedAll(this)"><i class="fa"></i></th>'
                + '<th>部门名称</th>'
                + '<th>部门领导</th>'
                + '<th>领导联系方式</th>'
                + '<th>创建时间</th>'
                + '<th>其它</th></tr>';
            for(var i in data.depart_list) {
                str += '<tr>'
                    + '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>'
                    + '<td width="20%">' + data.depart_list[i].name + '</td>'
                    + '<td width="20%">' + data.depart_list[i].leader + '</td>'
                    + '<td width="20%">' + data.depart_list[i].leader_mail + '</td>'    
                    + '<td width="20%">' + data.depart_list[i].created_time + '</td>'   
                    + '<td style="display:none;">' + data.depart_list[i].id + '</td>'    
                    + '<td style="display:none;">' + data.depart_list[i].policy_id + '</td>'  
                    + '<td style="display:none;">' + data.depart_list[i].leader_id + '</td>'    
                    + '<td style="display:none;">' + data.depart_list[i].current_num + '</td>'         
                    + '<td>'            
                    + '<a href="javascript:depart_policy('+ i +');">策略</a>&nbsp;&nbsp;&nbsp;&nbsp;' 
                    + '<a href="javascript:depart_modify('+ i +');">修改</a>'
                    + '</td></tr>';
            }
            str +='</table>';
            table.html(str);  
            createFooter(start_page,page_length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });
    currentpage = start_page; 
}
// page页查询
function search(p,i) {
    if(i == 1){
        getDepartList(p,10);
    } else if(i == 2){
        getPolicyList(p,10);
    } else if(i == 3){
        getListUser(p,10);
    } else if(i == 4){
        getdepmember(p,10);
    } else{
        console.log(i);
    }
}
// 返回用户列表
function departlist(){
    $('.policylist, .userlist, .addh, .policyh').css({'display':'none'});
    $('.departlist').css({'display':'block'});
    $('#members .membertable,.page4').html('');
    $('th i,td i').removeClass('fa-check');
}

// 修改部门信息
function depart_modify(i) { 
    var _tr = $('.departlist .departtable table tr').eq(i+1),
        departname = _tr.find('td').eq(1).text(),
        depart_id = _tr.find('td').eq(5).text(),
        leader_id = _tr.find('td').eq(7).text(),
        leaderemail = _tr.find('td').eq(3).text(),
        departleader = _tr.find('td').eq(2).text();
    var v = 1;
    departid = depart_id;
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">修改部门</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "leader">部门负责人</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" id="leader" style="cursor:pointer;" class="form-control" value="' + departleader + '" readonly="readonly"/>'
             + '<input type="text" name="leader_id" value="'+leader_id+'" style="display:none;"/>'
             + '<div class="overflowlist" style="display:none;overflow-x:hidden;height:100px;border:1px solid #ddd;">'
             + '<ul name="memberlist" class="list-group"></ul></div>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "leaderemail">联系方式</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" class="form-control" id = "leaderemail" name="leaderemail" value="'+leaderemail+'" readonly="readonly"/>'
             + '</div></div>'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "departname">部门名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" class="form-control" id = "departname" name="departname" value="'+departname+'"/>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<div class="col-sm-7 col-sm-offset-3" style="text-align:right;">' 
             + '<a href="javascript:depart_useradd()">为部门添加/删除人员</a>'
             + '</div></div>'
            
             + '</form>'
             + '</div>'

             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="depart_mod('+depart_id+')">确认</button>'
             + '</div>';  
    alertOpen(cont);
 // 获取部门成员
    $(document).ready(function(){
        $.get('/man/depart/members?start_page='+1+ '&page_length='+ 1000 + '&depart_id='+ depart_id, function(data) {
            data = JSON.parse(data);
            if (data.rt==0) {
                var ul = $('ul[name=memberlist]'),
                    str = "";
                for (var i=0; i<data.depart_users.length; i++){
                    str += '<li class="list-group-item" style="border:none;" value="'+ data.depart_users[i].id +'"><a>' + data.depart_users[i].name + '</a>'
                        + '<input id="lemail" name="lemail" style="display:none;" type="text" value="'+data.depart_users[i].email+'"/></li>';
                }
                ul.html(str);
            } else {
                warningOpen('获取部门员工失败！','danger','fa-bolt');
            }
        });
    });   

    $(document).ready(function(){
        $("#leader").click(function(){
            var thisinput=$(this);
            var thislist=$(".overflowlist");
            var thisul=$(".overflowlist").find("ul");
            var thisemail = $("#leaderemail");

            if(thislist.css("display")=="none"){
                thislist.css({"display":"block",width:"auto"});
                thisul.find("a").click(function(){
                    thisinput.val($(this).text());
                    $('input[name=leader_id]').val($(this).parent().val());
                    thislist.fadeOut("10");
                    thisemail.val($(this).parent().find('input[name=lemail]').val());
                });
            }
        });
    });

   // $('.rt .mesg').find('input[name=mesginfo]').val(depart_id);
}

// 提交修改的部门信息
function depart_mod(id) {
    var postData = {
            id: id,
            leader_id: $('input[name=leader_id]').val(),
            name: $('input[name=departname]').val()
        };
    if (postData.name=='') {
        warningOpen('请输入部门名称！','danger','fa-bolt');
    } else {    
        $.post('/man/depart/updateDeaprtInfo', postData, function(data) {
            if (data.rt==0) {
                getDepartList(currentpage,10);
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


// 用户策略管理
function depart_policy(k){
    var tr = $('.departtable table tr').eq(k+1);
    var policy_id = tr.find('td').eq(6).text(); // 用户的策略ID 
    var depart_id = tr.find('td').eq(5).text(); 
    $('.departlist').css({'display':'none'});
    $('.policylist').css({'display':'block'});
    $('.policyh').css({'display':'inline-block'});
    $('.policy').find('input[name=policyid]').val(policy_id);
    $('.policy').find('input[name=departid]').val(depart_id);
    getPolicyList(1,10);
}
// 获取策略列表
function getPolicyList(start_page,page_length){
    var str = '<table class="table table-striped table-bordered table-hover">'
            + '<tr><th class="sel"></th>'
            + '<th>策略名称</th>'
            + '<th>版本</th>'
            + '<th>注册时间</th>'
            + '<th>更新时间</th></tr>';
    var st = 2;
    var table = $('.policylist .policytable');
    var policy_id = $('.policy').find('input[name=policyid]').val();
    $.get('/man/policy/getPolicyList?start_page='+start_page + '&page_length='+ page_length, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.policies) {
                if(policy_id == data.policies[i].id){
                    str += '<tr>'
                        + '<td class="sel" onclick="switchpolicyNo(this)"><i class="fa fa-check"></i></td>';
                } else {
                    str += '<tr>'
                        + '<td class="sel" onclick="switchpolicyNo(this)"><i class="fa"></i></td>';
                }                      
                str +='<td>' + data.policies[i].name + '</td>'
                    + '<td>' + data.policies[i].version + '</td>'
                    + '<td>' + data.policies[i].create_time + '</td>'
                    + '<td>' + data.policies[i].update_time + '</td>'
                    + '<td style="display:none;">' + data.policies[i].id + '</td></tr>';
            }
            str += '</table>';
            table.html(str);
            createFooter(start_page,page_length,data.total_count,st); 
        } else if (data.rt==5) {
          toLoginPage();           
        }
    });
}
// 用户添加取消策略方法
function switchpolicyNo(radioObj){    
    var cont = ''; 
    var boundState;
    var departid = $('.policy').find('input[name=departid]').val()*1;
    var tr = $(radioObj).parent();
    var tab=tr.parent();
    var policyId = tr.find('td').eq(5).text();
    var departId = [];
    var radio_list = $(radioObj).parent();
    departId[0] = departid;
    if($(radioObj).find('i').hasClass('fa-check')){
        cont = '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">提示</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<p>是否取消该策略？</p>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" id="cancelpolicy">确认</button>'
             + '</div>';  
        alertOpen(cont);      
        $(document).ready(function(){
            $("#cancelpolicy").click(function(){                  
                $(radioObj).find('i').removeClass('fa-check');
                boundState = 0;
                var postData = {
                    policyId: policyId,
                    boundState: boundState,
                    departId: JSON.stringify(departId)
                };
                $.post('/man/org/boundPolicy', postData, function(data) {
                    if (data.rt == 0) {
                        alertOff(); 
                        warningOpen('操作成功！','primary','fa-check');
                        $('.policy').find('input[name=policyid]').val('');
                        getDepartList(currentpage,10);
                    } else if (data.rt == 5) {
                        toLoginPage();
                    } else {
                        warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                    }
                });
                
            });
        }); 
                 
    } else {
        cont += '<div class="modal-header">'
             +  ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             +  '<h4 class="modal-title">提示</h4>'
             +  '</div>'
             +  '<div class="modal-body">'
             +  '<p>是否添加该策略？</p>'
             +  '</div>'
             +  '<div class="modal-footer">'
             +  '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             +  '<button type="button" id="addpolicy" class="btn btn-primary">确认</button>'
             +  '</div>'; 
        alertOpen(cont);  
        $(document).ready(function(){
            $("#addpolicy").click(function(){
                tab.find(".sel i").removeClass('fa-check');         
                $(radioObj).find('i').addClass('fa-check');
                boundState = 1;
                var postData = {
                    policyId: policyId,
                    boundState: boundState,
                    departId: JSON.stringify(departId)
                };
                $.post('/man/org/boundPolicy', postData, function(data) {
                    if (data.rt == 0) {
                        alertOff(); 
                        warningOpen('操作成功！','primary','fa-check');
                        $('.policy').find('input[name=policyid]').val(policyId);
                        getDepartList(currentpage,10);
                    } else if (data.rt == 5) {
                        toLoginPage();
                    } else {
                        warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                    }
                });
            });
        });                   
    }
}
// 添加部门
function add(){
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">添加部门</h4>'
             + '</div>'

             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">部门名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入部门名称"/>' 
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="adddepart()">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 添加部门
function adddepart(v){
    if($('input[name=name]').val()){
        dname = $('input[name=name]').val(); 
        departid = '';
        depart_useradd();
    }else{
        warningOpen('请输入部门名称！','danger','fa-bolt');
    }
}

// 给部门添加员工、删除部门员工页面
function depart_useradd(){
    getListUser(1,10);
    alertOff();     
    $('.addh').css({'display':'inline-block'});
    $('.departlist').css({'display':'none'});
    $('.userlist').css({'display':'block'});
    if(departid){
        getdepmember(1,10);
    } 
}
// 获取不属于任何部门的员工 
function getListUser(start,length){
    var st = 3;
    var str = '<table class="table table-striped table-bordered table-hover"><tr>'
            + '<th class="sel" onclick="selectedAll(this)"><i class="fa"></i></th>'
            + '<th>Email</th>'
            + '<th>用户名</th>'
            + '<th>用户id</th></tr>';

    var url = '/man/depart/freeUserList?start_page='+start
            + '&page_length='+ length;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.free_users) {
                str += '<tr>'
                    + '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>'
                    + '<td>' + data.free_users[i].email + '</td>'
                    + '<td>' + data.free_users[i].name + '</td>'
                    + '<td>' + data.free_users[i].id + '</td></tr>';           
            }
            str +='</table>';
            $('#freeuser .freetable').html(str);
                createFooter(start,length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        } else{
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
}
// 获取指定部门员工
function getdepmember(start_page, page_length){
    var st = 4;
    var str = '<table class="table table-striped table-bordered table-hover"><tr>'
            + '<th class="sel" onclick="selectedAll(this)"><i class="fa"></i></th>'
            + '<th>Email</th>'
            + '<th>用户名</th>'
            + '<th>用户id</th></tr>';

    var url = '/man/depart/members?start_page='+start_page
            + '&page_length='+ page_length + '&depart_id='+ departid;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.depart_users) {
                str += '<tr>'
                    + '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>'
                    + '<td>' + data.depart_users[i].email + '</td>'
                    + '<td>' + data.depart_users[i].name + '</td>'
                    + '<td>' + data.depart_users[i].id + '</td></tr>';           
            }
            str +='</table>'; 
            $('#members .membertable').html(str);
            createFooter(start_page,page_length,data.total_count,st); 
        } else if (data.rt==5) {
          toLoginPage();           
        }
    });
}
// 将部门员工从部门删除
function deluser() {    
    var userids = [], i = 0, tr; 
    var users = $('.membertable table');   
    users.find('td i').each(function () { 
        if ($(this).hasClass('fa-check')) {
            tr = $(this).parents("tr");
            userids[i] = tr.find('td').eq(3).text()*1;
            i = i+1;
        }    
    }); 

    if(userids.length > 0){
        var postData = {
            depart_id: departid,
            userids: JSON.stringify(userids)
        };

        $.post('/man/depart/delMembers', postData, function(data) {
            if (data.rt == 0) {
                getdepmember(1,10);
                warningOpen('操作成功！','primary','fa-check'); 
                getListUser(1,10);
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    } else {
        warningOpen('请先选择用户！','danger','fa-bolt');
    }
}
// 新添加部门选择部门用户列表
function getuserlists(){
    var arr = [], uid, uname, i = 0, tr, arrs = {}; 
    var users = $('.freetable table');

    users.find('td i').each(function () { 
        if ($(this).hasClass('fa-check')) {
            tr = $(this).parents('tr');
            arrs = {uid: tr.find('td').eq(3).text()*1, uname: tr.find('td').eq(2).text()};
            arr.push(arrs);
        }    
    });
    return arr;
}
// 添加新部门/添加帐号时获取选择的用户id
function getUsers(){
    var arr = [], i = 0, tr; 
    var users = $('.freetable table');   

    users.find('td i').each(function () { 
        if ($(this).hasClass('fa-check')) {
            tr = $(this).parents("tr");
            arr[i] = tr.find('td').eq(3).text()*1;
            i = i+1;
        }    
    });
    return arr;
}

// 部门添加员工
function adduser() {
    if(!departid) {
        var str = "", users = getuserlists();
        if(users.length > 0){
            var cont = '';
                cont += '<div class="modal-header">'
                     + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                     + '<h4 class="modal-title">增加部门</h4>'
                     + '</div>'
                     + '<div class="modal-body">'
                     + '<form role = "form" class="form-horizontal">'

                     + '<div class = "form-group">' 
                     + '<label class="col-sm-3 control-label" for = "leader">部门负责人</label>' 
                     + '<div class="col-sm-7">' 
                     + '<input type="text" id="leader" style="cursor:pointer;" class="form-control" value="请选择...." readonly="readonly"/>'
                     + '<input type="text" name="leader_id" style="display:none;"/>'
                     + '<div class="overflowlist" style="display:none;overflow-x:hidden;height:100px;border:1px solid #ddd;">'
                     + '<ul name="memberlist" class="list-group"></ul></div>'
                     + '</div></div>'   

                     + '</form>'
                     + '</div>'

                     + '<div class="modal-footer">'
                     + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
                     + '<button type="button" class="btn btn-primary" onclick="depart_add()">确认</button>'
                     + '</div>';  
            alertOpen(cont);

            var ul = $('ul[name=memberlist]');
            for (var i=0; i<users.length; i++){
                str += '<li class="list-group-item" style="border:none;" value="'+ users[i].uid +'"><a>' + users[i].uname + '</a></li>';
            }
            ul.html(str);
            $(document).ready(function(){
                $("#leader").click(function(){
                    var thisinput=$(this);
                    var thislist=$(".overflowlist");
                    var thisul=$(".overflowlist").find("ul");

                    if(thislist.css("display")=="none"){
                        thislist.css({"display":"block",width:"auto"});
                        thisul.find("a").click(function(){
                            thisinput.val($(this).text());
                            $('input[name=leader_id]').val($(this).parent().val());
                            thislist.fadeOut("10");
                        });
                    }
                });
            });
        } else {
            warningOpen('请先选择用户！','danger','fa-bolt');
        }

    } else {
        // 已经存在的部门添加员工
        var userids = getUsers();
        if(userids.length > 0){
            var postData = {
                depart_id: departid,
                userids: JSON.stringify(userids)
            };
            $.post('/man/depart/addMembers', postData, function(data) {
                if (data.rt == 0) {
                    getListUser(1,10);
                    warningOpen('操作成功！','primary','fa-check');
                    getdepmember(1,10);
                } else if (data.rt == 5) {
                    toLoginPage();
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
            });
        } else {
            warningOpen('请先选择用户！','danger','fa-bolt');
        }
    }   
}

// 提交添加部门
function depart_add(){    
    var postData = {
            name: dname,
            leader_id: $('input[name=leader_id]').val() * 1,
            users: JSON.stringify(getUsers())
        };
    if (postData.name == "") {
        warningOpen('请输入部门名称！','danger','fa-bolt');
    } else if (postData.leader_id == "") {
        warningOpen('请选择部门领导！','danger','fa-bolt');
    } else {
        $.post('/man/depart/addDepart', postData, function(data) {
            if (data.rt==0) {
                departlist();
                refresh();
                alertOff();
                warningOpen('操作成功！','primary','fa-check');
            } else if (data.rt==5) {
                toLoginPage();
            } else if (data.rt==7) {
                warningOpen('该部门已存在！' + data.rt +'！','danger','fa-bolt');         
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    }
}

function refresh() {
    $('th i,td i').removeClass('fa-check');
    getDepartList(currentpage,10);
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.departlist .departtable table');
    if(tab.find('td i').hasClass('fa-check')){
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
             +  '<button type="button" class="btn btn-primary" onclick="depart_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的账号！','danger','fa-bolt');
    }
}

// 企业管理员删除多个部门
function depart_delete() {
    var depId = [],
            i = 0;
    var tr;
    var tab = $('.departlist .departtable table');
    tab.find('td i').each(function () {
        if ($(this).hasClass('fa-check')) {
            tr = $(this).parents("tr");
            depId[i] = tr.find('td').eq(5).text()*1;
            i = i+1;
        }     
    });  
    if(depId.length > 0){
        var postData = {
            departs: JSON.stringify(depId)
        };
        
        $.post('/man/depart/delDepart', postData, function(data) {
            if (data.rt == 0) {               
                getDepartList(1,10);  
                alertOff(); 
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }else{
        warningOpen('请选择部门！','danger','fa-bolt');
    }        
}
