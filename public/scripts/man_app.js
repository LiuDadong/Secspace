/*
 * ==================================================================
 *                          应用管理 app
 * ==================================================================
 */

$(function() {
    $('.appmenu').addClass('open active');
    $('.appmenu').find('li').eq(0).addClass('active');
    // 应用管理列表
    getAppList(1,10); 
});

// app列表
function getAppList(start,length,keyword){   
    var st = 1;
    var check_security = '';
    var platform = '';
    var table = $('.appstable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>图标</th>'
            + '<th>app名称</th>'
            + '<th>版本</th>'
            + '<th>平台</th>'
            + '<th>安全状态</th>'
            + '<th>来源</th>'
            + '<th>安装数量</th>'
            + '<th>创建时间</th>'
            + '<th>更新时间</th>'
            + '<th>其它</th></tr>';

    var url = '/man/app/getAppList?start='+ start + '&length='+ length;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.doc) {
                check_security = data.doc[i].check_security==1 ? '检测' : '不检测';
                platform = data.doc[i].platform==0 ? 'Ios' : 'Android';     
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                    + '<td style="padding:2px;"><img width="31px" height="31px" src="'+picurl+ data.doc[i].icon + '"/></td>'
                    + '<td>' + data.doc[i].app_name + '</td>'
                    + '<td>' + data.doc[i].version + '</td>'
                    + '<td>' + platform + '</td>'
                    + '<td>' + check_security + '</td>' 
                    + '<td>' + data.doc[i].from + '</td>'
                    + '<td>' + data.doc[i].install_num + '</td>'
                    + '<td>' + data.doc[i].created + '</td>'
                    + '<td>' + data.doc[i].modified + '</td>'      
                    + '<td style="display:none;">' + data.doc[i].package_name + '</td>' 
                    + '<td style="display:none;">' + data.doc[i].download + '</td>'  
                    + '<td style="display:none;">' + data.doc[i].app_type + '</td>' 
                    + '<td style="display:none;">' + data.doc[i].install_type + '</td>'    
                    + '<td style="display:none;">' + data.doc[i].visit_type + '</td>' 
                    + '<td style="display:none;">' + data.doc[i].describe + '</td>'  
                    + '<td style="display:none;">' + data.doc[i].check_security + '</td>'      
                    + '<td>'  
                    + '<a href="javascript:app_auth('+ i +');">授权</a>&nbsp;&nbsp;'  
                    + '<a href="javascript:app_cancel('+ i +');">取消授权</a>&nbsp;&nbsp;'  
                    + '<a href="javascript:app_modify('+ i +');">修改信息</a>'        
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
}
// page页查询
function search(p,i) {
    if(i == 1){
        getAppList(p,10);
    } else if(i == 2){
        getUserList(p,10,'');
    } else if(i == 3){
        getDepartList(p,10);
    } else{
        console.log(i);
    }
}
// 返回app列表
function appslist(){
    $('.issuedlist, .appissued, .cancellist, .appissued1').css({'display':'none'});
    $('.appslist').css({'display':'block'});
}
// app取消授权
function app_cancel(i) {
    $('.appslist').css({'display':'none'});
    $('.cancellist').css({'display':'block'});
    $('.appissued1').css({'display':'inline-block'});
    var _tr = $('.appstable tr').eq(i+1),
        package_name = _tr.find('td').eq(10).text();
    $('.tabbable').find('input[name=packagename]').val(package_name);
    getUserList(1,10,''); // app已经授权的用户列表
    getDepartList(1,10);// app已经授权的部门列表
}
// app授权
function app_auth(i) {
    $('.appslist').css({'display':'none'});
    $('.issuedlist').css({'display':'block'});
    $('.appissued').css({'display':'inline-block'});
    var _tr = $('.appstable tr').eq(i+1),
        package_name = _tr.find('td').eq(10).text();
    $('.tabbable').find('input[name=package_name]').val(package_name);
    getUserList(1,10,''); // app未授权
    getDepartList(1,10);// app未授权
}
// 获取用户列表
function getUserList(start,length,keyword){
    var strtab1 = '<table class="table table-striped table-bordered table-hover"><tr>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
                + '<th>用户名</th>'
                + '<th>用户邮箱</th>'
                + '<th>用户id</th></tr>';
    var st = 2;
    var str = '';
    var userurl = '/man/user/getUserList?start='+ start + '&length='+ length;
        userurl += keyword?'&keyword=' + keyword : '';
    var policyid = $('input[name=policyid]').val();
    $.get(userurl, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.user_list) {
                strtab1 += '<tr>'
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                        + '<td>' + data.user_list[i].name + '</td>'
                        + '<td>' + data.user_list[i].email + '</td>'
                        + '<td name = "userid" value="'+data.user_list[i].id+'">' + data.user_list[i].id + '</td></tr>';               
            }
            strtab1 += '</table>';
            $('.usertable').html(strtab1);
            createFooter(start,length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });
}

// 获取部门列表
function getDepartList(start_page,page_length){
    var st = 3;
    var strtab2 = '<table class="table table-striped table-bordered table-hover"><tr>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
                + '<th>部门名称</th>'
                + '<th>部门领导</th>'
                + '<th>创建时间</th></tr>',
        depurl = '/man/dep/getDepartList?start_page=' + start_page + '&page_length=' + page_length; 
    var str = '';
    var policyid = $('input[name=policyid]').val();
    $.get(depurl, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.depart_list) {
                strtab2 += '<tr>'
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                        + '<td>' + data.depart_list[i].name + '</td>'
                        + '<td>' + data.depart_list[i].leader + '</td>'
                        + '<td>' + data.depart_list[i].created_time + '</td>'   
                        + '<td style="display:none;">' + data.depart_list[i].id + '</td></tr>';   
            }
            strtab2 += '</table>'; 
            $('.departtable').html(strtab2);
            createFooter(start_page,page_length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });  
}

//给部门或者用户授权app进行提交
function authbtn(){
    subbtn(1);
}
//给部门或者用户取消app授权提交
function unauthbtn(){
    subbtn(0);
}

// 授权或取消授权提交
function subbtn(state){
    var user_list = [], package_name = [], depart_list = [], i = 0, j = 0, tr;
    package_name[0] = $('input[name=package_name]').val();
     // 用户app授权
    if($("#users").hasClass('active')){ 
        var tab1 = $('.usertable');
            tab1.find('td span').each(function () { 
                if ($(this).hasClass('txt')) {
                    tr = $(this).parents("tr");
                    user_list[i] = tr.find('td').eq(2).text();
                    i = i+1;
                }    
            });
    }
    // 部门app授权 
    if($("#departs").hasClass('active')){
        var tab2 = $('.departtable');        
            tab2.find('td span').each(function () { 
                if ($(this).hasClass('txt')) {
                    tr = $(this).parents("tr");
                    depart_list[j] = tr.find('td').eq(4).text()*1;
                    j = j+1;
                }
            });
    }

    if(user_list.length > 0 || depart_list.length > 0){
        if(user_list.length > 0){
            postData = {
                package_name: JSON.stringify(package_name),
                user_list: JSON.stringify(user_list),
                state: state
            };
        }else{
            postData = {
                package_name: JSON.stringify(package_name),
                depart_list: JSON.stringify(depart_list),
                state: state
            };
        }
        $.post('/man/apps/authApp', postData, function(data) {
            if (data.rt == 0) {
                warningOpen('操作成功！','primary','fa-check');        
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    } else {
        warningOpen('请先选择应用授权对象！','danger','fa-bolt');
    }
} 
// 修改app
function app_modify(i) {
    var _tr = $('.appstable table tr').eq(i+1);
    var check_security = _tr.find('td').eq(16).text();
    var app_type = _tr.find('td').eq(12).text();
    var install_type = _tr.find('td').eq(13).text();
    var visit_type = _tr.find('td').eq(14).text();
    var describe = _tr.find('td').eq(15).text();
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
             + '<input type = "text" class = "form-control" id = "name" name="app_name" value = "'+_tr.find('td').eq(2).text()+'"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "platform">app平台</label>' 
             + '<div class="col-sm-7">' 
             + '<select id = "platform" name="platform" class = "form-control">' 
             + '<option value="1">Android</option>'
             + '</select>'
             + '</div></div>'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "from">供应商</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "from" name="from" value = "'+_tr.find('td').eq(6).text()+'" autocomplete="off"/>' 
             + '</div></div>'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">安全检查</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6">'
             + '<input name="check_security" type="radio" value="0"/>'
             + '<span class="text">关闭</span></label>'
             + '<label class="col-xs-6">'
             + '<input name="check_security" type="radio" value="1"/>'
             + '<span class="text">开启</span></label>'
             + '</div></div>'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">应用类型</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6">'
             + '<input name="app_type" type="radio" value="0"/>'
             + '<span class="text">普通应用</span></label>'
             + '<label class="col-xs-6">'
             + '<input name="app_type" type="radio" value="1"/>'
             + '<span class="text">插件应用</span></label>'
             + '</div></div>'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">应用安装类型</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6">'
             + '<input name="install_type" type="radio" value="0"/>'
             + '<span class="text">强制安装</span></label>'
             + '<label class="col-xs-6">'
             + '<input name="install_type" type="radio" value="1"/>'
             + '<span class="text">非强制安装</span></label>'
             + '</div></div>'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">应用访问类型</label><input type="text" id="visit_type" name="visit_type" value="'+visit_type+'" style="display:none;"/>' 
             + '<div class="col-sm-7">' 
             + '<select id = "visit_tp" class = "form-control">' 
             + '<option value = "0">公开应用</option>'
             + '<option value = "1">保护应用</option>'
             + '</select>'
             + '</div></div>'
             + '<div class = "form-group pttype" style="display:none;">' 
             + '<label class="col-sm-3 control-label">保护方式</label>' 
             + '<div class="col-sm-7">' 
             + '<select id="vt_tp" class = "form-control">' 
             + '<option value="1">用户口令＋指纹认证</option>'
             + '<option value="2">用户口令认证</option>'
             + '</select>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "describe">应用详情</label>' 
             + '<div class="col-sm-7">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="2" name="describe" id="describe">'+describe+'</textarea>'
             + '</span>'
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="app_update('+i+')">确认</button>'
             + '</div>';  
    alertOpen(cont);
    $(document).ready(function(){
        $("input:radio[name='check_security']").eq(check_security).attr("checked",'checked');
        $("input:radio[name='app_type']").eq(app_type).attr("checked",'checked');
        $("input:radio[name='install_type']").eq(install_type).attr("checked",'checked');
        if(visit_type != '0'){
            $(".pttype").css({'display':'block'});
            $("#visit_tp").find("option").eq(1).attr("selected",true);
            $("#vt_tp").find("option").eq(visit_type-1).attr("selected",true);
        }
        $('select[id="visit_tp"]').change(function(){
            if($('select[id="visit_tp"]').val() == 1){
                $(".pttype").css({'display':'block'});
                $('input[name="visit_type"]').val($('select[id="vt_tp"]').val());
            }else{
                $('input[name="visit_type"]').val(0);
                $(".pttype").css({'display':'none'});
            }
        });
        $('select[id="vt_tp"]').change(function(){
            $('input[name="visit_type"]').val($('select[id="vt_tp"]').val());
        });
    });
}
//  修改提交
function app_update(i){
    var _tr = $('.appstable table tr').eq(i+1);
    var package_name = _tr.find('td').eq(10).text();
    var app_name = $('input[name=app_name]').val();
    var platform = $('select[name=platform]').val();
    var from = $('input[name=from]').val();
    var check_security = $('input[name=check_security]:checked').val();
    var app_type = $('input[name=app_type]:checked').val();
    var install_type = $('input[name=install_type]:checked').val();
    var visit_type = $('input[name=visit_type]').val();
    var describe = $('textarea[name=describe]').val();
    var postData = {
        package_name: package_name,
        app_name: app_name,
        platform: platform,
        from: from,
        check_security: check_security,
        app_type: app_type,
        install_type: install_type,  
        visit_type: visit_type,
        describe: describe   
    };
    if (!postData.app_name) {
        warningOpen('请输入名称！');
    } else {  
        $.post('/man/app/updateApp', postData, function(data) {
            if (data.rt==0) { 
                warningOpen('操作成功！','primary','fa-check');
                alertOff(); 
                getAppList(currentpage,10);  
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    }
}
// 添加应用
function add(){
    var sid = getCookie("sid"); 
    var url = hosturl + 'p/app/upload';
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">添加应用</h4>'
             + '</div>'
             + '<div class="modal-body" style="padding-bottom:0px;">'
             + '<p class="appupload" style="display:none;color:red;text-align:center;">正在上传......</p>'
             + '<iframe name="ifm" style="display:none;"></iframe>'
             + '<form id="addAppForm" method="post" action="'+url+'" enctype="multipart/form-data" target="ifm" autocomplete="off" role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input name="sid" value="'+sid+'" style="display:none;"/>'
             + '<input type = "text" class = "form-control" id = "name" name="app_name" placeholder = "请输入应用名称"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "platform">app平台</label>' 
             + '<div class="col-sm-7">' 
             + '<select id = "platform" name="platform" class = "form-control">' 
             + '<option value="1">Android</option>'
             + '</select>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "from">供应商</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "from" name="from" placeholder = "请输入供应商" autocomplete="off"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">安全检查</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6">'
             + '<input name="check_security" type="radio" value="0"/>'
             + '<span class="text">关闭</span></label>'
             + '<label class="col-xs-6">'
             + '<input name="check_security" checked="true" type="radio" value="1"/>'
             + '<span class="text">开启</span></label>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">应用类型</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6">'
             + '<input name="app_type" type="radio" value="0"/>'
             + '<span class="text">普通应用</span></label>'
             + '<label class="col-xs-6">'
             + '<input name="app_type" checked="true" type="radio" value="1"/>'
             + '<span class="text">插件应用</span></label>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">应用安装类型</label>' 
             + '<div class="col-sm-7">' 
             + '<label class="col-xs-6">'
             + '<input name="install_type" type="radio" value="0"/>'
             + '<span class="text">强制安装</span></label>'
             + '<label class="col-xs-6">'
             + '<input name="install_type" checked="true" type="radio" value="1"/>'
             + '<span class="text">非强制安装</span></label>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label">应用访问类型</label><input type="text" id="visit_type" name="visit_type" value="0" style="display:none;"/>' 
             + '<div class="col-sm-7">' 
             + '<select id = "visit_tp" class = "form-control">' 
             + '<option value = "0">公开应用</option>'
             + '<option value = "1">保护应用</option>'
             + '</select>'
             + '</div></div>'            
             + '<div class = "form-group pttype" style="display:none;">' 
             + '<label class="col-sm-3 control-label">保护方式</label>' 
             + '<div class="col-sm-7">' 
             + '<select id="vt_tp" class = "form-control">' 
             + '<option value="2">用户口令认证</option>'
             + '<option value="1">用户口令＋指纹认证</option>'
             + '</select>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "file_data">文件</label>' 
             + '<div class="col-sm-6" style="overflow:hidden;">' 
             + '<input type = "file" name="file_data" id="file_data"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "describe">应用详情</label>' 
             + '<div class="col-sm-7">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="2" name="describe" id="describe"></textarea>'
             + '</span>'
             + '</div></div>'
             + '<div class="modal-footer" style="margin-left:-15px;margin-right:-15px;">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="submit" id="submit" class="btn btn-primary">确认</button>'
             + '</div>'
             + '</form>'
             + '</div>';  
    alertOpen(cont);
    $(document).ready(function(){
        $('select[id="visit_tp"]').change(function(){
            if($('select[id="visit_tp"]').val() == 1){
                $(".pttype").css({'display':'block'});
                $('input[name="visit_type"]').val($('select[id="vt_tp"]').val());
            }else{
                $('input[name="visit_type"]').val(0);
                $(".pttype").css({'display':'none'});
            }
        });
        $('select[id="vt_tp"]').change(function(){
            $('input[name="visit_type"]').val($('select[id="vt_tp"]').val());
        });
    });
    $('#addAppForm').submit(function() {        
        $(this).ajaxSubmit({
            resetForm: true,
            beforeSubmit: function() {
                $('.appupload').css({'display':'block'}); 
            },
            success: function(data) {
                warningOpen('操作成功！','primary','fa-check');
                alertOff();
                getAppList(currentpage,10);
            }
        });
        return false;
    });      
}
// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getAppList(currentpage,10);
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.appstable table');
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
             +  '<button type="button" class="btn btn-primary" onclick="app_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的应用！','danger','fa-bolt');
    }
}

// 企业管理员删除多个应用
function app_delete() {
    var downloads = [],
            i = 0;
    var tr;
    var tab = $('.appstable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            downloads[i] = tr.find('td').eq(11).text();
            i = i+1;
        }     
    });  
    if(downloads.length > 0){
        var postData = {
            downloads: JSON.stringify(downloads)
        };
        
        $.post('/man/apps/delapps', postData, function(data) {
            if (data.rt == 0) {
                alertOff(); 
                warningOpen('操作成功！','primary','fa-check');                
                getAppList(1,10);  
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    } else {
        warningOpen('请选择要删除的应用！','danger','fa-bolt');
    }        
}
