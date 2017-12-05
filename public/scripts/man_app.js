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
    searchapplist();
});
function fnSearch(){}
var appssec_url = localStorage.getItem("appssec_url");
hosturl = appssec_url; 
var st = 1;

function searchapplist(){

    var str = '';
    $.get('/man/appTag/getAppTagList?start='+ 1 + '&length='+ 1000, function(data) {  // 获取标签列表
        data = JSON.parse(data);
        if (data.rt == 0) {
            var select = $('.searchcontent .tag ul');
            for(var i in data.apptag_list) {
                str += '<li class="list-group-item cursor" onclick="searchbytag(this)">'
                    + data.apptag_list[i].name
                    + '<input type="text" name="tagid" value="'+data.apptag_list[i].id+'" style="display:none"/>'
                    + '</li>';
            }
            select.html(str);
        } else {
            warningOpen('获取标签失败！','danger','fa-bolt');
        }
    });
}

function searchbytag(e){

    if($(e).hasClass('tagactive')){
        st = 1
        $(e).removeClass('tagactive');
        getAppList(1,10); 
    } else {
        st = 2;
        $('.searchcontent .tag li').removeClass('tagactive');
        $(e).addClass('tagactive');
        getAppList(1,10);   
    }
}

// app列表
function getAppList(start,length){   
    var visit_type = '';
    var platform = '';
    var tab;
    var id;
    var url = '';
    var issued = '';
    var table = $('.appstable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
            + '<input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>版本</th>'
            + '<th>平台</th>'
            + '<th>分类</th>'
            + '<th>标签</th>'
            + '<th>已安装/已授权</th>'
            + '<th>创建者</th>'
            + '<th>更新时间</th>'
            + '<th>操作</th></tr>';
    if(st === 1){
        url = '/man/app/getAppList?start='+ start + '&length='+ length;
    } else if(st ===2){
        tab = $('.searchcontent .tag ul');
        tab.find('li').each(function () {
            if ($(this).hasClass('tagactive')) {
                id = $(this).find('input[name=tagid]').val()*1;
            }     
        }); 
        url = '/man/app/getAppByTag?start='+ start + '&length='+ length+ '&id='+ id;
    } else {
        url = '/man/app/getAppList?start='+ start + '&length='+ length;
    }
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.app_list) {
                visit_type = data.app_list[i].visit_type == 1 ? '公开应用' : '授权应用';
                platform = data.app_list[i].platform==0 ? 'Ios' : 'Android'; 
                issued = typeof(data.app_list[i].issued) != 'undefined' ? data.app_list[i].issued : '--';  
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)">'
                    + '</input><span class="text"></span></label></div></td>'
                    + '<td>' + data.app_list[i].app_name + '</td>'
                    + '<td>' + data.app_list[i].version + '</td>'
                    + '<td>' + platform + '</td>'
                    + '<td>' + visit_type + '</td>' 
                    + '<td>' + data.app_list[i].tag_name + '</td>'
                    + '<td><a href="javascript:dev_list('+ i +');" class="cursor">' + data.app_list[i].install_num + ' / ' + issued + '</a></td>'
                    + '<td>' + data.app_list[i].operator + '</td>'
                    + '<td>' + data.app_list[i].modified + '</td>'      
                    + '<td style="display:none;">' + data.app_list[i].package_name + '</td>' 
                    + '<td style="display:none;">' + data.app_list[i].download + '</td>'  
                    + '<td style="display:none;">' + data.app_list[i].install_type + '</td>'    
                    + '<td style="display:none;">' + data.app_list[i].visit_type + '</td>' 
                    + '<td style="display:none;">' + data.app_list[i].describe + '</td>'  
                    + '<td style="display:none;">' + data.app_list[i].sysRequest + '</td>'   
                    + '<td style="display:none;">' + data.app_list[i].id + '</td>'  
                    + '<td style="display:none;">' + data.app_list[i].apptag + '</td>'   
                    + '<td style="display:none;">' + data.app_list[i].platform + '</td>'    
                    + '<td>'  
                    + '<a href="javascript:modify('+ i +');">编辑</a>&nbsp;&nbsp;'  
                    + '<a href="javascript:view('+ i +');">详情</a>'        
                    + '</td></tr>';
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,data.total_count,1);
        } else if (data.rt==5) {
          toLoginPage();           
        }
    });
    $('.hrefactive').removeClass("hrefallowed");
    currentpage = start;
}

// page页查询
function search(p,i) {
    if(i == 1){
        getAppList(p,10);
    } else if(i == 2){
        var tab1 = $('.usertable');
        var tab2 = $('.tagusertable'); 
        var keyword = $('.widget-btn input[name=keyvalue]').val();
        getUserList(p,10,keyword,tab1,2,2); 
        getUserList(p,10,keyword,tab2,3,2); 
    } else{
        console.log(i);
    }
}

// 返回app列表
function applist(){
    $('.issuedlist, .appissued, .cancellist, .appissued1, .app_add, .appadd,.app_mod, .appmod, .app_view, .appview').css({'display':'none'});
    $('.appslist').css({'display':'block'});
}

// 查看
function dev_list(i){
    var _tr = $('.appslist table tr').eq(i+1);
    var package_name = _tr.find('td').eq(9).text();
    var strtab1 = '<table class="table table-hover"><tr>'
                + '<th>设备名称</th>'
                + '<th>用户名</th>'
                + '<th>邮箱</th>'
                + '<th>状态</th>'
                + '</tr>';
    var cont = '';
    $.get('/man/app/getDeviceList?package_name='+ package_name, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.doc) {
                strtab1 += '<tr>'
                        + '<td>' + data.doc[i].dev_name + '</td>'
                        + '<td>' + data.doc[i].user_name + '</td>'
                        + '<td>' + data.doc[i].email + '</td>'
                        + '<td>已安装</td></tr>';              
            }
            strtab1 += '</table>';
            cont += '<div class="modal-header">'
                 + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                 + '<h4 class="modal-title">已安装设备</h4>'
                 + '</div>'
                 + '<div class="modal-body" style="max-height:340px;overflow-y:auto;">'
                 + strtab1
                 + '</div>'
                 + '<div class="modal-footer">'
                 + '<button type="button" class="btn btn-primary" onclick="alertOff()">确认</button>'
                 + '</div>';  
            alertOpen(cont);
        } else if (data.rt==5) {
            toLoginPage();           
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
}

// 添加至标签
function addTotag(){
    var i = 0;
    var tr;
    var cont = '';
    var tab = $('.appstable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            i = i+1;
        }     
    });  

    if(i > 0){
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">移动至标签</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">请选择标签</label>' 
             + '</div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name"></label>' 
             + '<div class="col-sm-7">' 
             + '<div id="usertag" style="height:atuo;max-height:180px;overflow:auto;padding:5px;border:1px solid #ccc;">'
             + '<ul name="taglist">'
             + '</ul>'
             + '</div>'
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="tag_add()">确认</button>'
             + '</div>';  
        alertOpen(cont);
        var str = '';
        $.get('/man/appTag/getAppTagList?start='+ 1 + '&length='+ 1000, function(data) {  // 获取标签列表
            data = JSON.parse(data);
            if (data.rt == 0) {
                var select = $('#usertag ul[name=taglist]');
                for(var i in data.apptag_list) {
                    str += '<li class="list-group-item" onclick="selectonetag(this)">'
                        + data.apptag_list[i].name
                        + '<input type="text" name="tagid" value="'+data.apptag_list[i].id+'" style="display:none"/>'
                        + '</li>';
                }
                select.html(str);
            } else {
                warningOpen('获取标签失败！','danger','fa-bolt');
            }
        });

    }
}

function tag_add(){
    var tag_id;
    var tab = $('#usertag ul[name=taglist]');
    tab.find('li').each(function () {
        if ($(this).hasClass('tagactive')) {
            tag_id = $(this).find('input[name=tagid]').val()*1;
        }     
    });

    var app_list = [], j = 0;
    var tr;
    var tab1 = $('.appstable table');
    tab1.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            app_list[j] = tr.find('td').eq(15).text()*1;
            j = j+1;
        }     
    });  
    if(tag_id){
        var postData = {
            apptag_id: tag_id,
            app_list: JSON.stringify(app_list)
        };
        $.post('/man/appTag/addApp', postData, function(data) {
            if (data.rt == 0) {      
                alertOff(); 
                getAppList(currentpage,10); 
                warningOpen('操作成功！','primary','fa-check');  
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
    
}

function selectonetag(e){
    if($(e).hasClass('tagactive') == true){
        $('#usertag ul[name=taglist] li').removeClass('tagactive');
    } else {
        $('#usertag ul[name=taglist] li').removeClass('tagactive');
        $(e).addClass('tagactive');
    }
}

// 添加应用
function add(){ 
    $('.app_add input[name=describe]').val('');
    $('select[name=sysRequest]').val('19');
    $('select[name=apptag]').val('');
    $("input:radio[name='visit_type']").eq(0).click();
    $("input:radio[name='install_type']").eq(0).click();
    $('button[type=submit]').attr("disabled",false);
   // $("input:radio[name='install_type']").eq(0).attr("checked",'checked');
    
    $('.appslist').css({'display':'none'});
    $('.app_add').css({'display':'block'});
    $('.appadd').css({'display':'inline-block'});
    var sid = getCookie("sid"); 
    var url = appssec_url+'/p/app/upload';  
    document.getElementById("addapp").action = url;
    var str =  '<option class="option" value="">请选择</option>';
    $.get('/man/appTag/getAppTagList?start='+ 1 + '&length='+ 1000, function(data) {  // 获取标签列表
        data = JSON.parse(data);
        if (data.rt == 0) {
            var select = $('select[name=apptag]');
            for(var i in data.apptag_list) {
                str += '<option class="option" value="'+data.apptag_list[i].id+'">'
                    + data.apptag_list[i].name
                    + '</option>';
            }
            select.html(str);
        } else {
            warningOpen('获取标签失败！','danger','fa-bolt');
        }
    });
    $('.app_add').find('input[name=sid]').val(sid);
    $(".app_add select[name=apptag]").val('-1');
    $('#addapp').submit(function() { 
        $('button[type=submit]').attr("disabled",true);
        $(this).ajaxSubmit({
            resetForm: true,
            beforeSubmit: function() {
                $('.appupload').css({'display':'block'}); 
                $('.app_add input, .app_add select').attr("disabled",true);
            },
            success: function(data) {
                $('.appupload').css({'display':'none'}); 
                warningOpen('操作成功！','primary','fa-check');
                $('button[type=submit]').attr("disabled",false);
                $('.app_add input, .app_add select').attr("disabled",false);
                applist();
                getAppList(currentpage,10);
            }
        });
        return false;
    }); 
}

// 修改APP
function modify(i) {
    var _tr = $('.appstable table tr').eq(i+1);
    var sysRequest = _tr.find('td').eq(14).text();
    var install_type = _tr.find('td').eq(11).text();
    var visit_type = _tr.find('td').eq(12).text();
    var describe = _tr.find('td').eq(13).text();
    var id = _tr.find('td').eq(15).text();
    var tag_id = _tr.find('td').eq(16).text();
    var package_name = _tr.find('td').eq(9).text();
    var platform = _tr.find('td').eq(17).text();
    var str = '<option class="option" value="">请选择</option>';
    $('.appslist').css({'display':'none'});
    $('.app_mod').css({'display':'block'});
    $('.appmod').css({'display':'inline-block'});
    $.get('/man/appTag/getAppTagList?start='+ 1 + '&length='+ 1000, function(data) {  // 获取标签列表
        data = JSON.parse(data);
        if (data.rt == 0) {
            var select = $('.app_mod select[name=_apptag]');
            for(var i in data.apptag_list) {
                str += '<option class="option" value="'+data.apptag_list[i].id+'">'
                    + data.apptag_list[i].name
                    + '</option>';
            }
            select.html(str);
        } else {
            warningOpen('获取标签失败！','danger','fa-bolt');
        }
    });
    
    $(".app_mod select[name=_version]").val(sysRequest);
    $('.app_mod input[name=_describe]').val(describe);
    $(".app_mod input:radio[name='visit_type'][value='" + visit_type + "']").prop("checked", "checked");
    $(".app_mod input:radio[name='install_type'][value='" + install_type + "']").prop("checked", "checked");
    $('.app_mod input[name=appid]').val(id);
    $('.app_mod input[name=package_name]').val(package_name);
    $('.app_mod input[name=platform]').val(platform);
    setTimeout('$(".app_mod select[name=_apptag]").val('+tag_id+')',50);
}

// 提交修改
function app_mod(){
    var sysRequest = $('.app_mod select[name=_version]').val();
    var describe = $('.app_mod input[name=_describe]').val();
    var visit_type = $('.app_mod input[name=visit_type]:checked').val();
    var install_type = $('.app_mod input[name=install_type]:checked').val();
    var id = $('.app_mod input[name=appid]').val()*1;
    var package_name = $('.app_mod input[name=package_name]').val();
    var platform = $('.app_mod input[name=platform]').val();
    var apptag = $('.app_mod select[name=_apptag]').val();
    var postData = { 
        id: id,
        package_name: package_name,
        platform: platform,
        sysRequest: sysRequest,
        describe: describe,
        visit_type: visit_type,
        install_type: install_type,
        apptag: apptag
    };
    if (!postData.sysRequest) {
        warningOpen('请选择最低应用系统！','danger','fa-bolt');
    } else {  
        $.post('/man/app/updateApp', postData, function(data) {
            if (data.rt==0) { 
                warningOpen('操作成功！','primary','fa-check');
                applist();
                getAppList(currentpage,10);  
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    }
}

// 查看APP
function view(i) {
    var _tr = $('.appstable table tr').eq(i+1);
    var sysRequest = _tr.find('td').eq(14).text();
    var install_type = _tr.find('td').eq(11).text();
    var visit_type = _tr.find('td').eq(12).text();
    var describe = _tr.find('td').eq(13).text();
    var tag_id = _tr.find('td').eq(16).text();
    var str = '<option class="option" value="">请选择</option>';
    $('.appslist').css({'display':'none'});
    $('.app_view').css({'display':'block'});
    $('.appview').css({'display':'inline-block'});
    $.get('/man/appTag/getAppTagList?start='+ 1 + '&length='+ 1000, function(data) {  // 获取标签列表
        data = JSON.parse(data);
        if (data.rt == 0) {
            var select = $('.app_view select[name=apptag]');
            for(var i in data.apptag_list) {
                str += '<option class="option" value="'+data.apptag_list[i].id+'">'
                    + data.apptag_list[i].name
                    + '</option>';
            }
            select.html(str);
        } else {
            warningOpen('获取标签失败！','danger','fa-bolt');
        }
    });
    $(".app_view #app_version").val(sysRequest);
    $('.app_view input[name=app_describe]').val(describe);
    $(".app_view input:radio[name='visit_type'][value='" + visit_type + "']").prop("checked", "checked");
    $(".app_view input:radio[name='install_type'][value='" + install_type + "']").prop("checked", "checked");
    setTimeout('$(".app_view select[name=apptag]").val('+tag_id+')',50);
}

// 应用授权
function appauth(){
    var status = 0;
    var apps = [];
    var i = 0;
    var tr;
    var visit_type = 0;
    var tab1 = $('.usertable');
    var tab2 = $('.tagusertable');
    var tab = $('.appstable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            apps[i] = tr.find('td').eq(15).text()*1;
            i = i+1;
            if(tr.find('td').eq(12).text() == 1){
                visit_type = 1;
            }
        }     
    });  
    if(apps.length > 0 && visit_type === 0){
        $('.appslist').css({'display':'none'});
        $('.issuedlist').css({'display':'block'});
        $('.appissued').css({'display':'inline-block'});
        var _tr = $('.appstable tr').eq(i+1),
            package_name = _tr.find('td').eq(10).text();
        $('.tabbable').find('input[name=package_name]').val(package_name);
        getUserList(1,10,'',tab1,2,2); 
        getUserList(1,10,'',tab2,3,2);
        searchuserlist();
        searchtaglist();
    } else {
        if(visit_type === 1){
            warningOpen('公开应用不能授权！','danger','fa-bolt');
        } else {
            warningOpen('请先选择应用！','danger','fa-bolt');
        }
        
    } 
}

function searchtaglist(){
    var str = '';
    $.get('/man/tag/getTagList?start='+ 1 + '&length='+ 1000, function(data) {  // 获取标签列表
        data = JSON.parse(data);
        if (data.rt == 0) {
            var select = $('#usertaglist');
            for(var i in data.tag_list) {
                str += '<li class="list-group-item" style="padding-bottom:0px;padding-top:0px;">'
                    + '<div class ="tree-item-name">'
                    + '<i class="fa fa-check-square-o treechildh cursor" style="display:none;width:30px;" onclick="_selectbytag(this)">'
                    + '<input type="text" name="tree_id" value="'+data.tag_list[i].id+'" style="display:none;"/></i>'
                    + '<i class="fa fa-square-o treechilds cursor" onclick="_cancelbytag(this)" style="width:30px;"></i>'
                    + data.tag_list[i].name
                    + '</div>'
                    + '</li>';
            }
            select.html(str);
        } else {
            warningOpen('获取标签失败！','danger','fa-bolt');
        }
    });
}

function _selectbytag(e){
    var tab1 = $('.tagusertable');
    var tab = $('#usertaglist');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).next().show(); 
    getUserList(1,10,'',tab1,3,2); 
    getUserList(1,10,''); 
}

function _cancelbytag(e){
    var tab1 = $('.tagusertable');
    var tab = $('#usertaglist');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).hide();
    $(e).prev().show();
    getUserList(1,10,'',tab1,3,4); 
}
// 策略下发获取用户组
function searchuserlist(){
    var str2 = '<ul style="padding-left:0px;">';
    var folder = '';
    folder = '<i class="fa fa-plus faopen cursor" onclick="opentreesearch(this)" style="width: 15px;"></i><i class="fa fa-minus faclose cursor" onclick="opentreesearch(this)" style="width: 15px;"></i>';
        str2 += '<li class="tree-item">'
            + '<div class ="tree-item-name">'
            + '<i class="fa fa-check-square-o treechildh cursor" style="display:none;" onclick="_select(this)">'
            + '<input type="text" name="tree_id" value="0" style="display:none;"/></i>'
            + '<i class="fa fa-square-o treechilds cursor" onclick="_cancel(this)"></i>'
            + '<input type="text" name="p_id" value="-1" style="display:none;"/>'
            + folder
            + '所有用户组'
            + '</div>'
            + '</li>';
    str2 += '</ul>'
    $("#treegroup").html(str2);
}
function searchuserlist1(){
    var str2 = '';
    var folder = '';
    $.get('/man/users/getUsersList?depart_id=' + 0, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.depart_list) {
                folder = data.depart_list[i].child_node != 0 ? 
                 '<i class="fa fa-plus faopen cursor" onclick="opentreesearch(this)" style="width: 15px;"></i><i class="fa fa-minus faclose cursor" onclick="opentreesearch(this)" style="width: 15px;"></i>' : '';
                str2 += '<li class="tree-item">'
                    + '<div class ="tree-item-name">'
                    + '<i class="fa fa-check-square-o treechildh cursor" style="display:none;" onclick="_select(this)">'
                    + '<input type="text" name="tree_id" value="'+data.depart_list[i].id+'" style="display:none;"/></i>'
                    + '<i class="fa fa-square-o treechilds cursor" onclick="_cancel(this)"></i>'
                    + '<input type="text" name="p_id" value="'+0+'" style="display:none;"/>'
                    + folder
                    + data.depart_list[i].name
                    + '</div>'
                    + '</li>';
            }
            str2 += '</ul>'
            $("#treegroup").html(str2);
        } else if (data.rt==5) {
            toLoginPage();           
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
}

function opentreesearch(e){
    var id = $(e).parent().find('input[name=tree_id]').eq(0).val()*1;
    var tab = $('#treegroup');
    var isFindChild = true;
    var folder = '';
    tab.find('input[name=p_id]').each(function () {
        if ($(this).val() == id) {
            isFindChild = false;
            active2 = $(this).parent().parent().is(":visible") == true ? 'hide' : 'show';
        }
    }); 
    if(isFindChild){
        $(e).css('display','none');
        $(e).next().css('display','inline-block');
        var str = '<ul style="padding-left: 24px;">';
        $.get('/man/users/getUsersList?depart_id=' + id, function(data) {
            data = JSON.parse(data);
            if (data.rt==0) {
                for(var i in data.depart_list) {
                    folder = data.depart_list[i].child_node != 0 ? 
                    '<i class="fa fa-plus faopen cursor" onclick="opentreesearch(this)" style="width: 15px;"></i><i class="fa fa-minus faclose cursor" onclick="opentreesearch(this)" style="width: 15px;"></i>' : '';
                    str += '<li class="tree-item">'
                        + '<div class ="tree-item-name">'
                        + '<i class="fa fa-check-square-o treechildh cursor" style="display:none;" onclick="_select(this)">'
                        + '<input type="text" name="tree_id" value="'+data.depart_list[i].id+'" style="display:none;"/></i>'
                        + '<i class="fa fa-square-o treechilds cursor" onclick="_cancel(this)"></i>'
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

var active2 = '';
function togusers(e){
    var that = $(e).parent().parent();
    if(active2 === 'show'){
      $(e).hide();
      $(e).next().css('display','inline-block');
      $(that).find('ul:first > li').show();
      $(that).find('li .faopen').show();
      $(that).find('li .faclose').hide();
    } else {
      $(e).hide();
      $(e).prev().css('display','inline-block');
      $(that).find('li').hide();
      $(that).find('li .faopen').show();
      $(that).find('li .faclose').hide();
    }
    active2 = '';
}

function _select(e){
    var tab1 = $('.usertable');
    var tab = $('#treegroup');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).next().show(); 
    getUserList(1,10,'',tab1,2,2); 

}

function _cancel(e){
    var tab1 = $('.usertable');
    var tab = $('#treegroup');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).hide();
    $(e).prev().show();
    getUserList(1,10,'',tab1,2,3); 
}

// 搜索下发用户
function searchauthlist(){
    var keyword = $('.widget-btn input[name=keyvalue]').val();
    var tab1 = $('.usertable');
    var tab2 = $('.tagusertable');
    getUserList(1,10,keyword,tab1,2,2); 
    getUserList(1,10,keyword,tab2,3,2); 
}

// 获取用户列表
function getUserList(start,length,keyword,tab,page,st){
    var strtab1 = '<table class="table table-striped table-bordered table-hover"><tr>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
                + '<input type="checkbox" onclick="selectedAll(this)" checked="checked"></input>'
                + '<span class="text txt">全选</span>'
                + '</label></div></th>'
                + '<th>用户名</th>'
                + '<th>账号</th>'
                + '<th>状态</th></tr>';
    var depId;
    var userurl;   
    var status;
    var id;
    var checkstr = '<input type="checkbox" onclick="selected(this)" checked="checked"></input><span class="text txt"></span>';
    if(st == 2){
        userurl = '/man/user/getUserList?start='+ start + '&length='+ length;
        userurl += keyword?'&keyword=' + keyword : '';
        checkstr = '<input type="checkbox" onclick="selected(this)"></input><span class="text"></span>';
        strtab1 = '<table class="table table-striped table-bordered table-hover"><tr>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
                + '<input type="checkbox" onclick="selectedAll(this)"></input>'
                + '<span class="text">全选</span>'
                + '</label></div></th>'
                + '<th>用户名</th>'
                + '<th>账号</th>'
                + '<th>状态</th></tr>';
    } else if(st == 3){
        var tab2 = $('#treegroup');
        tab2.find('.treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                depId = $(this).find('input[name=tree_id]').val()*1;
            }     
        });
        userurl = '/man/user/getUserByDepart?start='+ start + '&length='+ length+ '&depart_id='+ depId;
    } else {
        var tab3 = $('#usertaglist');
        tab3.find('.treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                id = $(this).find('input[name=tree_id]').val()*1;
            }     
        });  
        userurl = '/man/user/getUserByTag?start='+ start + '&length='+ length+ '&id='+ id;
    }

    $.get(userurl, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.user_list) {
                status = data.user_list[i].status == 1 ? '已激活' : '未激活';
                strtab1 += '<tr>'
                        + '<td class="sel"><div class="checkbox"><label>'
                        + checkstr
                        + '</label></div></td>'
                        + '<td>' + data.user_list[i].name + '</td>'
                        + '<td>' + data.user_list[i].account + '</td>'
                        + '<td>' + status + '</td>'
                        + '<td style="display:none;">' + data.user_list[i].id + '</td></tr>';               
            }
            strtab1 += '</table>';
            tab.html(strtab1);
            createFooter(start,length,data.total_count,page);  
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
    var package_name = [], user_list = [], 
    depart_list = [], tag_list = [], i = 0, tr, k = 0;
    var _tr;
    var tab = $('.appstable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            _tr = $(this).parents("tr");
            package_name[k] = _tr.find('td').eq(9).text();
            k = k+1;
        }     
    });  

    // 用户组app授权
    if($("#departs").hasClass('active')){ 
        var tab1 = $('.usertable');
        if(tab1.find('th .checkbox span').hasClass('txt')){
            var tab2 = $('#treegroup');
            tab2.find('.treechildh').each(function () {
                if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                    depart_list[0] = $(this).find('input[name=tree_id]').val()*1;
                }     
            });
        } else {
            tab1.find('td span').each(function () { 
                if ($(this).hasClass('txt')) {
                    tr = $(this).parents("tr");
                    user_list[i] = tr.find('td').eq(4).text()*1;
                    i = i+1;
                }    
            });
        }
    }
    // 标签app授权 
    if($("#usertag").hasClass('active')){
        var tab3 = $('.tagusertable');  
        if(tab3.find('th span').hasClass('txt')){
            var tab4 = $('#usertaglist');
            tab4.find('.treechildh').each(function () {
                if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                    tag_list[0] = $(this).find('input[name=tree_id]').val()*1;
                }     
            });
        } else {
            tab3.find('td span').each(function () { 
                if ($(this).hasClass('txt')) {
                    tr = $(this).parents("tr");
                    user_list[i] = tr.find('td').eq(4).text()*1;
                    i = i+1;
                }
            });
        }
    }

    if(user_list.length > 0 || depart_list.length > 0|| tag_list.length > 0){
        if(user_list.length > 0){
            postData = {
                package_name: JSON.stringify(package_name),
                user_list: JSON.stringify(user_list),
                state: state
            };
        } else if(depart_list.length > 0){
            postData = {
                package_name: JSON.stringify(package_name),
                depart_list: JSON.stringify(depart_list),
                state: state
            };
        } else {
            postData = {
                package_name: JSON.stringify(package_name),
                tag_list: JSON.stringify(tag_list),
                state: state
            };
        }
        $.post('/man/apps/authApp', postData, function(data) {
            if (data.rt == 0) {
                warningOpen('操作成功！','primary','fa-check');        
            } else if (data.rt == 8) {
                warningOpen('所选用户组下没有用户无需授权！','primary','fa-check'); 
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

// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getAppList(currentpage,10);
    $('.hrefactive').removeClass("hrefallowed");
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
            downloads[i] = tr.find('td').eq(10).text();
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
