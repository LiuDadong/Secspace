$(function() {
    var avatar = '';
    if(localStorage.length>0){
        var inform = localStorage.getItem("data1");
        var informs = JSON.parse(inform);
        var info = informs.doc;
            avatar = info.info.avatar;
    }
    var pic = localStorage.getItem("peravatar");
    if(pic){
        $('.layout .layout-left .online .pic').html('<img width="100%;" height="100%;" src="' + pic + '" alt=""></img>');
    } else if(avatar){
       $('.layout .layout-left .online .pic').html('<img width="100%;" height="100%;" src="'+ picurl + avatar + '" alt=""></img>');
    } else{
        console.log("当前用户目前没有头像");
    } 
});

function selectedBt(str) {
    location.href = str;
}
function getback(){
    window.location.reload(); 
};
//设置表格每一列一样宽度
function thstyle(){
    var table = $('.layout .layout-right .center table'),
        tr = table.find('tr').eq(1);
    var cells = tr.find('th').length;
    var width1 = 0;
    if(tr.find('th div').eq(0).hasClass('select')){        
        var a = 95/(cells-1),
            width1 = a + "%";
        tr.find('th').css({'width':width1});
        tr.find('th').eq(0).css({'width':'5%'});
    } else {
        var a = 100/cells;
        width1 = a + "%";
        tr.find('th').css({'width':width1});
    }   
}

// 切换tab 
function myclick(v) { 
    var divs = document.getElementsByClassName("tab_css");  
    for(var i = 0; i < divs.length; i++) {  
        var divv = divs[i];  

        if(divv == document.getElementById("tab" + v + "_content")) {  
            divv.style.display = "block";  
        } else {  
            divv.style.display = "none";  
        }  
    }
    $('.layout-right .top .right .search input').val('');
    $('.layout .layout-right .center #tab_bar li').css({'border-bottom':'0','color':'#999999'});
    $("#tab"+v+"").css({'border-bottom':'3px solid #63B2E6','color':'#666666'}); 
} 

// 选择按钮
function selected(e) {
    if ($(e).hasClass('active')) {
        $(e).removeClass('active');
        $(e).html('&nbsp;&nbsp;&nbsp;');
    } else {
        $(e).addClass('active');
        $(e).html('&nbsp;&radic;&nbsp;');
        $(e).css({'color':'red'});
    }
}

// 页面footer
function createFooter(page, length, total,status){
    if(total > 0){
        $('.layout-right .footerpage').css({'display':'block'});
        var doc = $('.layout .layout-right .footerpage .page'),
        pages = ~~(total/length) + (total%length>0 ? 1 : 0);
        var before = 0;
        var next = 1;
        var str = '<ul><li><label id="pageactive"value=' + page + '>'+page+'</label>/<label id="totalpage" value=' + pages + '>'+pages+'</label>页</li>';
        if(pages > 1){
            if(page>1){
            str += '<li class="pagesty" onclick="search('+before+','+status+')">前一页</li>';
            }
            if(page<pages){
                str += '<li class="pagesty" onclick="search('+next+','+status+')">后一页</li>';
            }
            str += '<li><input type="text" id="jump" name="page"/></li>';
            str += '<li class="pagesty" onclick="jumpRun('+status+')">跳转</li>';
        }
        doc.html(str);
    } else {
        $('.layout-right .footerpage').css({'display':'none'}); 
    }
}

// 查询跳转
function jumpRun(status) {
    var jump = $('.layout .layout-right .footerpage .page #jump');
    var par = 2;
    jump.keyup(function(){  // 输入限制，只能输入整数
        if(this.value.length==1){
            this.value=this.value.replace(/[^1-9]/g,'');
        } else {
            this.value=this.value.replace(/\D/g,'');
        }
    });
    search(par,status); 
}

// 页面搜索功能
function searchbyk(s){
    var tab = $('.layout .layout-right .center table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
function searchbykeywords(s,tab){
    if (s.length==0){
        warningOpen('请输入你要搜索的内容！');
        return false;
    } else {
        s=encode(s);
        var tr, str, status = 0, j = 0;
        tab.find('tr').each(function () {
            $(this).find('td').each(function () {
                str = $(this).text();
                if(str.indexOf(s)>=0){
                    status = 1;
                    j = j + 1; 
                }
            });
            if(status == 1){
                $(this).css({'visibility':'visible'});
                status = 0;
                if(j%2 == 1){
                    $(this).css({"background-color":"#FFFFFF"});
                } else {
                    $(this).css({"background-color":"#F4F4F4"});
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
        $('.layout-right .top .right .search input').val('');  
    }    
}

function encode(s){
    return s.replace(/([\<\>\&\\\*\[\]\(\)\$\^\?\;\:\"\%\#\~\`\'\,\!])/g,"");
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