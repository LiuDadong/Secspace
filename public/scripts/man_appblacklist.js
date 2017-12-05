/*
 * ==================================================================
 *                          应用黑名单 appblacklist
 * ==================================================================
 */

$(function() {
    $('.appmenu').addClass('open active');
    $('.appmenu').find('li').eq(1).addClass('active');
    // 应用黑名单列表
    getBlackList(1,10); 
});

// app黑名单列表
function getBlackList(start,length){   
    var st = 1;
    var status;
    var table = $('.blacktable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox">'
            + '<label><input type="checkbox" onclick="selectedAll(this)"></input>'
            + '<span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>状态</th>'
            + '<th>创建者</th>'
            + '<th>更新时间</th>'
            + '<th>操作</th></tr>';

    var url = '/man/blackList/getAppBlickList?start='+ start + '&length='+ length;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.app_list) {
                status = data.app_list[i].status == 1 ? '启用' : '禁用';
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input>'
                    + '<span class="text"></span></label></div></td>'
                    + '<td>' + data.app_list[i].name + '</td>'
                    + '<td>' + status + '</td>'
                    + '<td>' + data.app_list[i].operator + '</td>'
                    + '<td>' + data.app_list[i].modified + '</td>'  
                    + '<td style="display:none;">' + data.app_list[i].id + '</td>' 
                    + '<td style="display:none;">' + data.app_list[i].describe + '</td>'
                    + '<td style="display:none;">' + data.app_list[i].app_name + '</td>'
                    + '<td style="display:none;">' + data.app_list[i].package_name + '</td>'
                    + '<td style="display:none;">' + data.app_list[i].status + '</td>'
                    + '<td>'  
                    + '<a href="javascript:modify('+ i +');">编辑</a>&nbsp;&nbsp;'  
                    + '<a href="javascript:view('+ i +');">详情</a>'    
                    + '</td></tr>';
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,data.total_count,st);
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
        getBlackList(p,10);
    } else{
        console.log(i);
    }
}

// 返回列表
function blacklist(){
    $('.blacklist_add, .addblacklist, .blacklist_mod, .modblacklist, .blacklist_view, .viewblacklist').css({'display':'none'});
    $('.blacklist').css({'display':'block'});
    $('input').val('');
}

// 添加
function add(){
    $('.blacklist').css({'display':'none'});
    $('.blacklist_add').css({'display':'block'});
    $('.addblacklist').css({'display':'inline-block'});
}

// 添加提交
function blacklist_add(){
    var postData = {
        name: $('.blacklist_add input[name=name]').val(),
        describe: $('.blacklist_add input[name=describe]').val(), 
        app_name: $('.blacklist_add input[name=appname]').val(), 
        package_name: $('.blacklist_add input[name=apppackage]').val()
    };
    if(postData.name == '') {
        warningOpen('名称不能为空！','danger','fa-bolt');
    } else if(postData.app_name == '') {
        warningOpen('应用名称不能为空！','danger','fa-bolt');
    } else if(postData.package_name == '') {
        warningOpen('包名不能为空！','danger','fa-bolt');
    } else {
        $.post('/man/blacklist/addBlickList', postData, function(data) {
            if (data.rt == 0) {   
                blacklist();
                getBlackList(currentpage,10); 
                warningOpen('操作成功！','primary','fa-check');      
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
}

// 编辑
function modify(i){
    var tr = $('.blacktable table tr').eq(i+1);
    var id = tr.find('td').eq(5).text()*1; 
    var name = tr.find('td').eq(1).text(); 
    var describe = tr.find('td').eq(6).text(); 
    var appname = tr.find('td').eq(7).text(); 
    var apppackage = tr.find('td').eq(8).text();
    $('.blacklist').css({'display':'none'});
    $('.blacklist_mod').css({'display':'block'});
    $('.modblacklist').css({'display':'inline-block'});

    $('.blacklist_mod input[name=apppackage]').val(apppackage);
    $('.blacklist_mod input[name=appname]').val(appname);
    $('.blacklist_mod input[name=describe]').val(describe);
    $('.blacklist_mod input[name=name]').val(name);
    $('.blacklist_mod input[name=id]').val(id);
}

// 编辑提交
function modsave(){
    var postData = {
        id: $('.blacklist_mod input[name=id]').val()*1,
        name: $('.blacklist_mod input[name=name]').val(),
        describe: $('.blacklist_mod input[name=describe]').val(), 
        app_name: $('.blacklist_mod input[name=appname]').val(), 
        package_name: $('.blacklist_mod input[name=apppackage]').val()
    };
    if(postData.name == '') {
        warningOpen('名称不能为空！','danger','fa-bolt');
    } else if(postData.app_name == '') {
        warningOpen('应用名称不能为空！','danger','fa-bolt');
    } else if(postData.package_name == '') {
        warningOpen('包名不能为空！','danger','fa-bolt');
    } else {
        $.post('/man/blacklist/updateBlickList', postData, function(data) {
            if (data.rt == 0) { 
                blacklist();  
                getBlackList(currentpage,10); 
                warningOpen('操作成功！','primary','fa-check');      
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
}

// 查看详情
function view(i){
    var tr = $('.blacktable table tr').eq(i+1);
    var name = tr.find('td').eq(1).text(); 
    var describe = tr.find('td').eq(6).text(); 
    var appname = tr.find('td').eq(7).text(); 
    var apppackage = tr.find('td').eq(8).text();
    $('.blacklist').css({'display':'none'});
    $('.blacklist_view').css({'display':'block'});
    $('.viewblacklist').css({'display':'inline-block'});
    
    $('.blacklist_view input[name=apppackage]').val(apppackage);
    $('.blacklist_view input[name=appname]').val(appname);
    $('.blacklist_view input[name=describe]').val(describe);
    $('.blacklist_view input[name=name]').val(name);
}

// 启用/禁用
function activate(status){
    var blacklist = [],
            i = 0;
    var tr;
    var tab = $('.blacktable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            blacklist[i] = tr.find('td').eq(5).text()*1;
            i = i+1;
        }     
    });  
    if(blacklist.length > 0){
        var postData = {
            flag: status,
            id: JSON.stringify(blacklist)
        };       
        $.post('/man/blacklist/updateStatus', postData, function(data) {
            if (data.rt == 0) {               
                getBlackList(currentpage,10);  
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
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
    getBlackList(currentpage,10);
}

// 删除提示
function deletes(){
    var i = 0, status = 0;
    var tab = $('.blacktable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if(tr.find('td').eq(9).text() == 1){
                status = 1;
            }
            i = 1;
        }     
    });   

    var cont = '';
    if(i>0){
        if(status === 0){
            cont += '<div class="modal-header">'
                 +  ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                 +  '<h4 class="modal-title">提示</h4>'
                 +  '</div>'
                 +  '<div class="modal-body">'
                 +  '<p>确定删除？</p>'
                 +  '</div>'
                 +  '<div class="modal-footer">'
                 +  '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
                 +  '<button type="button" class="btn btn-primary" onclick="blacklist_delete()">确认</button>'
                 +  '</div>'; 
                alertOpen(cont);
        } else {
            warningOpen('请先禁用黑名单再删除！','danger','fa-bolt');
        }
        
    }
}

// 删除
function blacklist_delete() {
    var blacklist = [],
            i = 0;
    var tr;
    var tab = $('.blacktable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            blacklist[i] = tr.find('td').eq(5).text()*1;
            i = i+1;
        }     
    });  
    if(blacklist.length > 0){
        var postData = {
            id: JSON.stringify(blacklist)
        };       
        $.post('/man/blacklist/deleteBlickList', postData, function(data) {
            if (data.rt == 0) {
                alertOff();              
                getBlackList(currentpage,10);  
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }     
}
