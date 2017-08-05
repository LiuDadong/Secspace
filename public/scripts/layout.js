var picurl = "http://tpos.yingzixia.com/";
//var picurl = "http://dev-server.yingzixia.com/"; // 开发环境图片地址
var hosturl = "http://tpos.yingzixia.com/"; // 正式环境
//var hosturl = "http://dev-server.yingzixia.com/"; // 开发环境
var sendurl = 'http://118.190.70.55/pub'; // 正式环境
//var sendurl = 'http://ws.yingzixia.com/pub'; // 开发环境
//var downurl = 'http://dev-server.yingzixia.com';
var downurl = 'http://tpos.yingzixia.com';
regBox = {
    regEmail : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    regName : /^[a-z0-9_-]{3,16}$/,//用户名
    regMobile : /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,//手机
    regTel : /^0[\d]{2,3}-[\d]{7,8}$/
};
$(function() {
    var avatar = localStorage.getItem("avatar");
    var icon = localStorage.getItem("icon");
    var productName = localStorage.getItem("productName");
    if(icon){
        $('.navbar-inner .imglogo').html('<small><img src="' + picurl + icon + '" alt=""></img></small>');
    }else{
        $('.navbar-inner .imglogo').html('<small><img src="/imgs/logo.png" alt=""></img></small>');
    }
    if(avatar){
        $('.navbar .account-area a .avatar').html('<img src="' + picurl + avatar + '" alt=""></img>');
        $('.navbar .account-area ul .avatar-area').html('<img class="avatar" src="' + picurl + avatar + '" alt=""></img>');//<span class="caption">修改头像</span>
    }
    if(productName != 'undefined' && productName !=''){
        $('.navbar .product_name').html('<a href="#" class="navbar-brand">' + productName + '</a>');
    }else{
        $('.navbar .product_name').html('<a href="#" class="navbar-brand">移动安全管理平台</a>');
    }
    //$('.navbar-inner .navbar-brand small').html('<img src="../imgs/logo.png" style="width:170px;height:22px;margin-top:10px;"></img>');
}); 

// 管理员修改密码
function updatepwd() {
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">修改管理员密码</h4>'
             + '</div>'

             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">当前密码</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">新密码</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "tel">确认新密码</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" class="form-control" id = "tel" name="phone"/>'
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="admin_update()">确认</button>'
             + '</div>';  
    alertOpen(cont);
}

function selectedBt(str) {
    location.href = str;
}
// 选择按钮
function selected(e) {
    if ($(e).attr("checked")) {
        $('th input[type=checkbox]').attr("checked",false);
        $('th .checkbox span').removeClass('txt');
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
    } else {
       // $('th input[type=checkbox]').attr("checked",true);
        //$('th .checkbox .text').addClass('txt');
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
    }
}
// 选择按钮
function selectcheckbox(e) {
    if ($(e).parent().find('span').hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
    }
}
// 选择按钮
function selected1(e) {
    if ($(e).find('i').hasClass('fa-check')) {
        $('th i').removeClass('fa-check');
        $(e).find('i').removeClass('fa-check');
    } else {
        $(e).find('i').addClass('fa-check');
    }
}
// 全选按钮
function selectedAll(e) {
    var table = $(e).parents('table');
    var all = $(table).find('.checkbox input[type=checkbox]'),
        tag = 0;
    for (var i=1; i<all.length; i++) {
        if ($(all[i]).attr("checked")) {
            tag = tag + 1;
            break;
        }
    }
    if (tag == 0) {
        $(table).find('.checkbox input[type=checkbox]').attr("checked",true);
        $(table).find('.checkbox span').addClass("txt");
    } else {
        $(table).find('.checkbox input[type=checkbox]').attr("checked",false);
        $(table).find('.checkbox span').removeClass("txt");
    }
}    
// 全选按钮
function selectedAll1(e) {
    var table = $(e).parents('table');
    var all = $(table).find('.sel i'),
        tag = 0;
    for (var i=1; i<all.length; i++) {
        if ($(all[i]).hasClass('fa-check')) {
            tag = tag + 1;
            break;
        }
    }
    if (tag == 0) {
        $(table).find('.sel i').addClass('fa-check');
    } else {
        $(table).find('.sel i').removeClass('fa-check');
    }
}   
// 创建footer
function createFooter(page,length,total,status){
    var j = 0;
    if(total >= 0){
        var doc = $('.page'+status+''),
        pages = ~~(total/length) + (total%length>0 ? 1 : 0);
        page = total > 0 ? page : 0;
        var str = '<div class="DTTTFooter"><div class="col-sm-6"><div class="footertotal">共'+total+'条第'+page+'页</div></div>'
                + '<div class="col-sm-6">'
                + '<div class="dataTables_paginate paging_bootstrap">'
                + '<ul class="pagination">';
        if(page == 1){
            str += '<li class="prev disabled"><a href="#">上一页</a></li>'
        }else{
            str += '<li class="prev"><a href="javascript:search('+(page-1)+','+status+')">上一页</a></li>'
        }

        if(pages < 6) {
            for(var i=0; i<pages; i++) {
                if(page == (i+1)) {
                    str += '<li class="active"><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                    j = i+1;
                } else {
                    str += '<li><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                } 
            }
        } else {
            if(page < 3) {
                for(var i=0; i<5; i++) {
                    if(page == i+1) {
                        str += '<li class="active"><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                        j = i + 1;
                    } else {
                        str += '<li><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                    }   
                }
            } else if(pages-page < 3) {
                for(var i=pages-5; i<pages; i++) {
                    if(page == i+1) {
                        str += '<li class="active"><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                        j = i +1;
                    } else {
                        str += '<li><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                    }
                }
            } else {
                for(var i=page-3; i<page+2; i++) {
                    if(page == i+1) {
                        str += '<li class="active"><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                        j = i +1;
                    } else {
                        str += '<li><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                    }
                }
            }
        }
        if(j<pages){
            str +='<li class="next"><a href="javascript:search(' + (j+1) + ','+status+')">下一页</a></li>'
        } else {
            str +='<li class="next disabled"><a href="#">下一页</a></li>'
        }
        str +='</ul>'
            + '</div>'
            + '</div></div>';
        doc.html(str);
    }
}
function searchbykeywords(s,tab){
    if (s.length==0){
        warningOpen('请输入你要搜索的内容！');
        return false;
    } else {
        s=encode(s);
        var tr, str, status = 0, j = 0, child;
        tab.find('tr').each(function () {       
            $(this).find('td').each(function () {
                str = $(this).text();
                if(str.indexOf(s)>=0){
                    status = 1;
                }
            });
            if(status == 1){
                $(this).css({'visibility':'visible'});
                status = 0;
                if(j == 0){
                    $(this).css({"background-color":"#FFFFFF"});
                    j = 1;
                }else {                   
                   $(this).css({"background-color":"#F4F4F4"}); 
                   j = 0;
                }
            } else {
                $(this).css({'display':'none'});
            }
            
            var child = $(this).find('th');
            if(child.length > 0){
                $(this).css({'display':''});
                $(this).css({'visibility':'visible'});
            }
        }); 
        $('.search input').val('');
    }    
}
function searchbykeywords2(s,tab){
     var tr, str, status = 0, child;
    if (s.length==0){
        warningOpen('请输入你要搜索的内容！');
        return false;
    } else {
        s=encode(s);
        console.log('s='+s);
       
        tab.find('tr').each(function () {       
            $(this).find('td').each(function () {
                str = $(this).text();
                if(str.indexOf(s)>=0){
                    status = 1;
                }
            });
            if(status == 1){
                $(this).css({'display':'block'});
                status = 0;
            } else {
                $(this).css({'display':'none'});
            }
            
          //  var child = $(this).find('th');
         //   if(child.length > 0){
         //       $(this).css({'display':''});
          //      $(this).css({'visibility':'visible'});
          //  }
        }); 
    }    
}
function encode(s){
    return s.replace(/([\<\>\&\\\.\*\[\]\(\)\$\^\?\;\:\"\%\#\~\`\'\,\!])/g,"");
}

function alertOpen(_cont) {
    var alert = $('.bootbox');
    alert.find('.modal-content').html(_cont);
    alert.css('display', 'block');
    $('.background').addClass('modal-backdrop fade in');
}
function alertOpen1(_cont) {
    var alert = $('.bootbox2');
    alert.find('.modal-content').html(_cont);
    alert.css('display', 'block');
    $('.background').addClass('modal-backdrop fade in');
    $('.bootbox').css('display', 'none');
}
// 隐藏警告框
function alertOff() {
    $('.modal-content').html('');
    $('.background').removeClass('modal-backdrop fade in');
    $('.bootbox').css('display', 'none');
}
// 隐藏警告框
function alertOff1() {
    $('.bootbox2 .modal-content').html('');
    //$('.background').removeClass('modal-backdrop fade in');
    $('.bootbox2').css('display', 'none');
    $('.bootbox').css('display', 'block');
}
function warningOpen(str,status,fa){
 //   Notify('操作以成功！', 'top-right', '5000', 'success', 'fa-check', true);
 //   Notify('Something Went Wrong!', 'top-right', '5000', 'danger', 'fa-bolt', true);
    Notify(str, 'top-right', '3000', status, fa, true);
    return false;
}
// 获取cookie里的值
function getCookie(cookie_name) {
    var allcookies = document.cookie;  
    var cookie_pos = allcookies.indexOf(cookie_name);   //索引的长度  
    if (cookie_pos != -1) {   
        cookie_pos += cookie_name.length + 1;     
        var cookie_end = allcookies.indexOf(";", cookie_pos);  
    if (cookie_end == -1){  
        cookie_end = allcookies.length;  
    }  
    var value = unescape(allcookies.substring(cookie_pos, cookie_end)); //这里就可以得到cookie的值 
    }   
    return value;    
}  
// 登录失效
function toLoginPage() {
    $.cookie('sid', '', {path: "/", expires: -1});
    $.cookie('admin', '', {path: "/", expires: -1});
    location.href = "/";
}