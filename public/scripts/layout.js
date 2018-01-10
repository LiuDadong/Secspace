function selectedBt(str) {
    location.href = str;
}
$(function() {
    $('input[type=number]').keypress(function(e) {
        if (!String.fromCharCode(e.keyCode).match(/[0-9]/)) {
            return false;
        }
    });
    $('input[type=number]').keyup(function(e) {
        try{
            var val=parseInt(this.value);
            if(this.max&&val>this.max){
                this.value=this.max;
            }else{
                this.value=val;
            }
        }catch(err){
            console.log(err)
        }
    });
    $('input[type=number]').blur(function(){
            if(!this.value){
                this.value=this.min?this.min:1;
            }
    })

    var avatar = localStorage.getItem("avatar");
    var icon = localStorage.getItem("icon");
    var productName = localStorage.getItem("productName");
    var appssec_url = localStorage.getItem("appssec_url");
    picurl = appssec_url+'/'; // 
    hosturl = appssec_url+'/'; //
    downurl = appssec_url;

    if(icon) {
        $('.navbar-inner .imglogo').html('<small><img src="' + appssec_url+'/' + icon + '" alt=""></img></small>');
    } else {
        $('.navbar-inner .imglogo').html('<small>< src="/imgs/logo.png" alt=""/></small>');
    }

    if(avatar) {
        $('.navbar .account-area a .avatar').html('<img src="' + appssec_url+'/' + avatar + '" alt=""></img>');
        $('.navbar .account-area ul .avatar-area').html('<img class="avatar" src="' + appssec_url+'/' + avatar + '" alt=""></img>');
    } 

    if(productName != 'undefined' && productName !=''){
        $('.navbar .product_name').html('<a href="#" class="navbar-brand">' + productName + '</a>');
    } else {
        $('.navbar .product_name').html('<a href="#" class="navbar-brand">移动安全管理平台</a>');
    }

    $(".searchicon").click(function(){
        fnSearch();
        $(".searchicon").toggle();
        $(".searchcontent").slideToggle();
    });

    $(".treehead .cursor").click(function(){
        $(".searchcontent").hide();
        $(".searchicon").show();
    });

});
//function fnSearch(){}

// 选择按钮
function selectitem(e) {
    var i = 0;
    if ($(e).hasClass("tree-selected")) {
        $(e).removeClass('tree-selected');
        $(e).find('.treechildh').hide();
        $(e).find('.treechilds').show();
    } else {
        $(e).addClass('tree-selected');
        $(e).find('.treechildh').show();
        $(e).find('.treechilds').hide();
    }
}

// 选择按钮
function selected(e) {
    var i = 0;
    if ($(e).attr("checked")) {
        $('th input[type=checkbox]').attr("checked",false);
        $('th .checkbox span').removeClass('txt');
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
    }

    if($(e).parents('table').find('span').hasClass('txt')){
        i = 1;
    }
    i === 0 ? $('.hrefactive').removeClass("hrefallowed") : $('.hrefactive').addClass("hrefallowed");
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
        $('.hrefactive').addClass("hrefallowed");
    } else {
        $(table).find('.checkbox input[type=checkbox]').attr("checked",false);
        $(table).find('.checkbox span').removeClass("txt");
        $('.hrefactive').removeClass("hrefallowed");
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
            str += '<li class="prev disabled"><a>上一页</a></li>'
        }else{
            str += '<li class="prev"><a href="javascript:search('+(page-1)+','+status+')">上一页</a></li>'
        }

        if(pages < 6) {
            for(var i=0; i<pages; i++) {
                if(page == (i+1)) {
                    str += '<li class="active"><a>' + (i+1) + '</a></li>';
                    j = i+1;
                } else {
                    str += '<li><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                } 
            }
        } else {
            if(page < 3) {
                for(var i=0; i<5; i++) {
                    if(page == i+1) {
                        str += '<li class="active"><a>' + (i+1) + '</a></li>';
                        j = i + 1;
                    } else {
                        str += '<li><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                    }   
                }
            } else if(pages-page < 3) {
                for(var i=pages-5; i<pages; i++) {
                    if(page == i+1) {
                        str += '<li class="active"><a>' + (i+1) + '</a></li>';
                        j = i +1;
                    } else {
                        str += '<li><a href="javascript:search(' + (i+1) + ','+status+')">' + (i+1) + '</a></li>';
                    }
                }
            } else {
                for(var i=page-3; i<page+2; i++) {
                    if(page == i+1) {
                        str += '<li class="active"><a>' + (i+1) + '</a></li>';
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
            str +='<li class="next disabled"><a>下一页</a></li>'
        }
        str +='</ul>'
            + '</div>'
            + '</div></div>';
        doc.html(str);
    }
}

function authpolicy(){
    var i = 0;
    var tab = $('table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            i = i+1;
        }     
    });
    if(i > 0) {
        var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">下发策略</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal authpolicy">'
             + '<div class = "form-group" style="text-align:center;margin-top:15px;">' 
             + '<div class="col-sm-4 col-sm-offset-2">'
             + '<a href="javascript:selectedBt(\'/man/devpolicy\')" class="btn btn-primary">设备策略</a>'
             + '</div>' 
             + '<div class="col-sm-4">' 
             + '<a href="javascript:selectedBt(\'/man/compliance\')" class="btn btn-primary">合规策略</a>'
             + '</div>'
             + '</div>'
             + '<div class = "form-group" style="text-align:center;">' 
             + '<div class="col-sm-4 col-sm-offset-2">'
             + '<a href="javascript:selectedBt(\'/man/railpoliicy\')" class="btn btn-primary btn-large">'
             + '围栏策略'
             + '</a>'
             + '</div>' 
             + '<div class="col-sm-4">' 
             + '<a href="javascript:selectedBt(\'/man/apppolicy\')" class="btn btn-primary btn-large">'
             + '应用策略'
             + '</a>'
             + '</div>'
             + '</div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '</div>';  
        alertOpen(cont);
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

function encode(s){
    return s.replace(/([\<\>\&\\\.\*\[\]\(\)\$\^\?\;\:\"\%\#\~\`\'\,\!])/g,"");
}

function alertOpen(_cont) {
    var alert = $('.bootbox');
    alert.find('.modal-content').html(_cont);
    alert.css('display', 'block');
    $('.background').addClass('modal-backdrop fade in');
}

// 隐藏警告框
function alertOff() {
    $('.modal-content').html('');
    $('.background').removeClass('modal-backdrop fade in');
    $('.bootbox').css('display', 'none');
}
function alertOpen1(_cont) {
    var alert = $('.bootbox2');
    alert.find('.modal-content').html(_cont);
    alert.css('display', 'block');
    $('.background').addClass('modal-backdrop fade in');
    $('.bootbox').css('display', 'none');
}
// 隐藏警告框
function alertOff1() {
    $('.bootbox2 .modal-content').html('');
    $('.bootbox2').css('display', 'none');
    $('.bootbox').css('display', 'block');
}
function warningOpen(str,status,fa){
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