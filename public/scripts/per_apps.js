/*
 * ==================================================================
 *                          用户应用管理 per_app
 * ==================================================================
 */

$(function() {    

    // 当前登录用户全部app列表
    $('.layout .layout-right .footerpage').css({'display':'block'});
    getApps(1,13);
});

// 用户app列表页面
function getApps(start_page,page_length){   
    var str = '<div id="tab_bar"><ul>'
        + '<li id="tab1" class="tabswitch" onclick="allApps()" style="width:auto;">所有APP</li> '
        + '<li id="tab2" onclick="authorizedApps()" style="width:auto;margin-left:100px;">授权APP</li></ul></div>'                           
        + '<div class="tab_css" id="tab1_content" style="display: block">'
        + '<div class="tab1">'
        + '</div></div>'
        + '<div class="tab_css" id="tab2_content">'
        + '<div class="tab2">'
        + '</div></div> ';

    var tab = $('.layout .layout-right .center .app');
    tab.html(str);
    getAll(start_page,page_length);
    $('.layout .layout-right .center .app #tab_bar #tab1').css({'border-bottom':'3px solid #63B2E6','color':'#666666'}); 
}

// 获取用户app全部列表页面
function getAll(start_page,page_length) {
    var email = '';
    var st = 1;
    var security_state = '';  
    if(localStorage.length>0){
        var inform = localStorage.getItem("data1");
        var informs = JSON.parse(inform);
        var infos = informs.doc;
        var info = infos.info;
            email = info.email;
        var unauthorized_app = info.unauthorized_app;
    }
    var tab = $('.layout .layout-right .center .app .tab1');
    var allApps = '<table><tr>'
        + '<th style="width:15%;">图标</th>'
        + '<th style="width:17%;">名称</th>'
        + '<th style="width:17%;">版本</th>'
        + '<th style="width:17%;">安全等级</th>'
        + '<th style="width:17%;">安装数量</th>'
        + '<th style="width:17%;">授权状态</th>'
        + '</tr>';

    var url = '/man/app/getAppList?start='+start_page + '&length='+ page_length; 
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.doc) {
                var auth_state = '已授权';
                for(var k in unauthorized_app){
                    if(data.doc[i].package_name == unauthorized_app[k]){
                        auth_state = '未授权';
                    }
                }               
                if(data.doc[i].security_state == 0){
                    security_state = '未检测';
                }else if(data.doc[i].security_state == 1){
                    security_state = '安全';
                }else{
                    security_state = '危险';
                }
                
                allApps += '<tr>'
                    + '<td><img width="36px" height="36px" src="' + picurl + data.doc[i].icon + '"/></td>'
                    + '<td>' + data.doc[i].app_name + '</td>'
                    + '<td>' + data.doc[i].version + '</td>'
                    + '<td>' + security_state + '</td>'
                    + '<td>' + data.doc[i].install_num + '</td>'
                    + '<td>' + auth_state + '</td></tr>';
            }
            allApps +='</table>';
            tab.html(allApps);
            createFooter(start_page,page_length,data.total_count,st);
        } else if (data.rt==5) {
          toLoginPage();           
        }
    });
}

// 获取用户已授权列表
function getAuthApps(start_page,page_length){
    var email = '';
    var st = 2;
    if(localStorage.length>0){
        var inform = localStorage.getItem("data1");
        var informs = JSON.parse(inform);
        var infos = informs.doc;
        var info = infos.info;
            email = info.email;
    }
    var tab = $('.layout .layout-right .center .app .tab2');
    var security_state = '';
    var authorizedApps = '<table><tr>'
        + '<th style="width:15%;">图标</th>'
        + '<th style="width:17%;">名称</th>'
        + '<th style="width:17%;">版本</th>'
        + '<th style="width:17%;">安全等级</th>'
        + '<th style="width:17%;">安装数量</th>'
        + '<th style="width:17%;">授权状态</th>'
        + '</tr>';

    $.get('/man/userauth/authAppList?start_page='+ start_page + '&page_length='+ page_length + '&email='+ email + '&state='+ 1, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.app_list) {
                if(data.app_list[i].security_state == 0){
                    security_state = '未检测';
                }else if(data.app_list[i].security_state == 1){
                    security_state = '安全';
                }else{
                    security_state = '危险';
                }
                authorizedApps += '<tr>'
                    + '<td><img width="36px" height="36px" src="' + picurl + data.app_list[i].icon + '"/></td>'
                    + '<td>' + data.app_list[i].app_name + '</td>'
                    + '<td>' + data.app_list[i].version + '</td>'
                    + '<td>' + security_state + '</td>'
                    + '<td>' + data.app_list[i].install_num + '</td>'
                    + '<td>' + '已授权' + '</td></tr>';
            }
            authorizedApps +='</table>';
            tab.html(authorizedApps);
            createFooter(start_page,page_length,data.total_count,st);
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });
}

// page页面查询
function search(par,i) {
    var p = document.getElementById("pageactive").innerHTML * 1; 
    var totalpage = document.getElementById("totalpage").innerHTML * 1; 
    var jump = $('.layout .layout-right .footerpage .page').find('input[name=page]').val() * 1;
   
    if(i == 1){         
        if(par == 0) {
            getAll(p-1,13);
        } else if(par == 1) {
            getAll(p+1,13);
        } else {
            if(totalpage>=jump&&jump>0&&jump!=p){
               getAll(jump,13);
            }
            $('.layout .layout-right .footerpage .page #jump').val('');
        }
    } else {
        if(par == 0) {
            getAuthApps(p-1,13);
        } else if(par == 1) {
            getAuthApps(p+1,13);
        } else {
            if(totalpage>=jump&&jump>0&&jump!=p){
                getAuthApps(jump,13);
            }
            $('.layout .layout-right .footerpage .page #jump').val('');
        }
    }
}

// 切换用户全部app列表页面
function allApps(){ 
    myclick(1);
    getAll(1,13);
}

// 切换用户授权app列表页面
function authorizedApps(){
    myclick(2); 
    getAuthApps(1,13);
}