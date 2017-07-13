
function selectedBt(str) {
    location.href = str;
}
// 创建footer
function createFooter(page, length, total,status){
    if(total >= 0){
        $('.layout-right .footerpage').css({'display':'block'});
        var doc = $('.page'),
        pages = ~~(total/length) + (total%length>0 ? 1 : 0);
        page = total > 0 ? page : 0;
        var before = 0;
        var next = 1;
        var str = '<ul><li>共<label id="total" value=' + total + '>'+total+'</label>条</li>'
                +'<li>第<label id="pageactive"value=' + page + '>'+page+'</label>/<label id="totalpage" value=' + pages + '>'+pages+'</label>页</li>';
        if(pages > 1){ 
            if(page>1){
                str += '<li class="pagesty" style="color:#55ACE4;" onclick="search('+before+','+status+')">前一页</li>';
            } else {
                str += '<li class="pagesty" style="cursor:text;">前一页</li>';
            }
            if(page<pages){
                str += '<li class="pagesty" style="color:#55ACE4;" onclick="search('+next+','+status+')">后一页</li>';
            } else {
                str += '<li class="pagesty" style="cursor:text;">后一页</li>';
            }
           
        } else { 
            str += '<li class="pagesty" style="cursor:text;">前一页</li>';
            str += '<li class="pagesty" style="cursor:text;">后一页</li>';  
        }
        str += '<li class="pagesty" style="width:28%;"><input type="text" id="jump" name="page"/>&nbsp;页<a style="color:#55ACE4;" href="javascript:jumpRun('+status+')">&nbsp;&nbsp;跳转</a></li>';   
        doc.html(str);
    } else {
        $('.footerpage').css({'display':'none'}); 
    }
    $('input[name=page').keyup(function(){  // 输入限制，只能输入整数
        if (this.value.length == 1) {
            this.value = this.value.replace(/[^1-9]/g,'');
        } else {
            this.value = this.value.replace(/\D/g,'');
        }
    });    
}

// page查询跳转
function jumpRun(status) {
    var jump = $('.page #jump');
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

// 全选按钮
function selectedAll() {
    var all = $('table .select'),
        tag = 0;
    for (var i=1; i<all.length; i++) {
        if ($(all[i]).hasClass('radic')) {
            tag = tag + 1;
            break;
        }
    }
    if (tag == 0) {
        $('table .select').addClass('radic');
    } else {
        $('table .select').removeClass('radic');
    }
}

// 选择按钮
function selected(e) {
    if ($(e).hasClass('radic')) {
        $('th div').removeClass('radic');
        $(e).removeClass('radic');
    } else {
        $(e).addClass('radic');
    }
}
// 选择按钮
function radioselect(e) {
    if ($(e).hasClass('radic')) {
       console.log("-----");
    } else {
        $('.select').removeClass('radic');
        $(e).addClass('radic');
    }
}
// 切换tab页面
function myclick(v) {
    var divs = document.getElementsByClassName("tab_css");  
    for(var i = 0; i < divs.length; i++) {
        var div = divs[i];
        if(div == document.getElementById("tab" + v + "_content")) {  
            div.style.display = "block";  
        } else {  
            div.style.display = "none";  
        }  
    } 
    $('th div').removeClass('radic');
    $('td div').removeClass('radic');
    $('#tab_bar li').css({'border':'none'});
    $('#tab_bar li').css({'color':'#999999'});
    $("#tab"+v+"").css({'border-bottom':'3px solid #63B2E6'});
    $("#tab"+v+"").css({'color':'#666666'});
    $(".devinfo #tab"+v+"").css({'border':'none'});
}

// 切换选中效果
function switchcheck(e){   
    if ($(e).hasClass('securitycheck')) {
        $(e).removeClass('securitycheck');
        $(e).find('.secheck').removeClass('sechecked');
    } else {
        $(e).addClass('securitycheck');
        $(e).find('.secheck').addClass('sechecked');
    }
}

//设置表格每一列一样宽度
function thstyle(){
    var table = $('.tb table'),
        tr = table.find('tr').eq(0);
    var cells = tr.find('th').length;
    var width1 = 0;
    if(tr.find('th div').eq(0).hasClass('select')) {        
        var a = 94/(cells-1),
        width1 = a + "%";
        tr.find('th').css({'width':width1});
        tr.find('th').eq(0).css({'width':'6%'});
    } else {
        var a = 100/cells;
        width1 = a + "%";
        tr.find('th').css({'width':width1});
    }   
}

//检查app_rule里面开始时间要是否早于结束时间
function checktime(start, end){
    var strtimeA=start.split(":"); 
    var arrB=end.split(":");
    var str1,str2,end1,end2;

    if(strtimeA[0].charAt(0) == '0'){
        str1 = strtimeA[0].charAt(1);
    }else{
        str1 = strtimeA[0];
    } 
    if(arrB[0].charAt(0) == '0'){
        end1 = arrB[0].charAt(1);
    }else{
        end1 = arrB[0];
    } 
    str2 = (str1 + strtimeA[1])*1;
    end2 = (end1 + arrB[1])*1;
    if(str2 >= end2){
        return true;
    } else{
        return false;
    }
}

// 查询数据
function searchbykeyword(s){
    var tab = $('.center table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
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
function setCookie(name,value) {
    //var Days = 30;
    //var exp = new Date();
    //exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape(value);
}
// 管理员退出登录
function logout() {
    var cont = '';
        cont += '<div class="walert">确定退出吗？</div><div class="line"></div>'
            + '<div><button onclick="_logout()">确认</button><button onclick="alertOff()">取消</button></div>';
    alertOpen('退出提示', cont);
}

// 管理员确认退出
function _logout(){
    localStorage.removeItem("avatar");
    localStorage.removeItem("icon");
    document.getElementById('logout').click();
    alertOff();
}