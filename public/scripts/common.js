var b64 = new Base64();
function pjaxClick(sHref) {
    switch(sHref){
        case '/':
            $('ul.sidebar-menu>li:first>a').click();
            break;
        default:
            $('ul.sidebar-menu a[data-pjax][href="' + sHref + '"]').click();
    }
}
function pjaxInit() {  //pjax初始化
    //$('document').pjax('html元素','需要更新的容器')  给html元素绑定pjax传输的方法  

    $(document).pjax('a.pjax-link,a[data-pjax]', '#pjax-aim', {
        show: 'fade',  //展现的动画，支持默认和fade, 可以自定义动画方式，这里为自定义的function即可。
        cache: false,  //是否使用缓存
        titleSuffix: 'dddd', //标题后缀
    });
    //pjax事件监听

    // 下面是提交表单的pjax。form表示所有的提交表单都会执行pjax，比如搜索和提交评论，可自行修改改成你想要执行pjax的form id或class。#content 同上改成你主题的内容主体id或class。
    // $(document).on('submit', 'form', function (event) { 
    //     $.pjax.submit(event, '#content', { fragment: '#content', timeout: 6000 }); 
    // }); 

    $(document).on('pjax:click', function (e) {
        setTimeout(function(){
            pageRender();
        },100);
        localStorage.setItem('fns',JSON.stringify($(e.target).data('fns')));
        $.cookie('hasAcc',$(e.target).data('fns')?1:0);
        $(".loading-container").removeClass('loading-inactive').addClass('loading-active');//参考的loading动画代码
    });
    $(document).on('pjax:success', function (event, data, state, option) {        
        $('script[data-src]').each(function () {
            var src = $(this).data('src');
            $.getScript(src, function () {
                console.info('成功引入js文件：' + src);
            });
        })
        $(".loading-container").removeClass('loading-active').addClass('loading-inactive');//参考的loading动画代码
    });

    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            pageRender();
        });
    }
    pjaxClick(location.pathname + location.search);
}
function homeJadeInit() {  //初始化登录的管理员信息
    var appssec_url = localStorage.getItem("appssec_url"),
        product_name = localStorage.getItem("product_name"),
        icon = localStorage.getItem("icon"),
        avatar = localStorage.getItem("avatar"),
        managerName=localStorage.getItem('name'),
        manager=localStorage.getItem('manager'),
        email=localStorage.getItem('email'),
        firLogin=localStorage.getItem('firLogin');
    if(icon){
        $('img.log').attr('src',appssec_url+'/'+icon);
    }
    if(avatar){
        $('.account-area img').attr('src',appssec_url+'/'+avatar);
    }
    $('.managerName').text(managerName);
    $('li.manager>a').text(manager);
    $('li.email>a').text(email);
    $('.product_name a').text(product_name);

    if(firLogin=='0'){
        $.dialog('confirm',{
            title:'初始密码修改提示',
            content:'<p>当前登录密码为初始密码，出于安全考虑，建议修改初始密码？</p>',
            confirmValue: '修改密码',
            confirm: function () {
                setTimeout(function(){
                    $('.account-area button[onclick="updatePW()"]').click();
                },300)
            },
            cancel:function(){
                localStorage.setItem('firLogin','');
            }
        })
    }

};

function pageRender() { //基于url调整边栏和面包屑导航样式
    var actHref=location.pathname + location.search;
    var aLi = [],
        openLi = $('ul.sidebar-menu>li:has(a[href="' + actHref + '"])'),
        actA = openLi.find('a[href="' + actHref + '"]');
    // 调整边栏样式
    openLi.siblings('li').removeClass('open active')
        .find('ul.submenu').hide()
        .find('li.active').removeClass('active');
    openLi.addClass('active').toggleClass('open', openLi.find('ul.submenu').length === 1)
        .find('ul.submenu>li:has(a[href="' + actHref + '"])').addClass('active')
        .siblings('li.active').removeClass('active');



    //获取更新面包屑导航所需元素要素
    var pagetitle, //页标题
        txt1, //一级菜单文本
        txt2; //二级菜单文本
    var li1 = openLi.find('a>i');
    txt1 = li1.next('span').text();
    aLi.push({
        i: li1.clone(true),
        a: li1.closest('a').clone(true).text(txt1)
    });
    $('.header-title>h1').text(txt1);
    pagetitle = 'SecSpace-' + txt1;
    var li2 = openLi.find('ul.submenu>li.active>a');
    if (li2.length === 1) {
        txt2 = li2.find('span').text();
        aLi.push({
            a: li2.clone(true).text(txt2)
        })
        $('.header-title>h1').text(txt2);
        pagetitle = 'SecSpace-' + txt2;
    }
    document.title = pagetitle;
    var bc = $('ul.breadcrumb').empty();
    for (var i = 0; i < aLi.length; i++) {
        var li = $('<li>');
        if (aLi[i].i) {
            li.append(aLi[i].i);
        }
        li.append(aLi[i].a);
        bc.append(li);
    }
}


//获取下发、授权用户列表
function getUserList(start, length, keyword, tab, footerNum, st) {
    var strtab1 = '<table class="table table-striped table-bordered table-hover"><tr>'
        + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
        + '<input type="checkbox" onclick="selectedAll(this)" checked="checked"/>'
        + '<span class="text txt">全选</span>'
        + '</label></div></th>'
        + '<th>姓名</th>'
        + '<th>账号</th>'
        + '<th>状态</th></tr>';
    var depId;
    var userurl;
    var status;
    var id;
    var checkstr = '<input type="checkbox" onclick="selected(this)" checked="checked"/><span class="text txt"></span>';
    if (st == 2) {
        userurl = '/man/user/getUserList?start=' + start + '&length=' + length;
        userurl += keyword ? '&keyword=' + keyword : '';
        checkstr = '<input type="checkbox" onclick="selected(this)"/><span class="text"></span>';
        strtab1 = '<table class="table table-striped table-bordered table-hover"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
            + '<input type="checkbox" onclick="selectedAll(this)"/>'
            + '<span class="text">全选</span>'
            + '</label></div></th>'
            + '<th>姓名</th>'
            + '<th>账号</th>'
            + '<th>状态</th></tr>';
    } else if (st == 3) {
        $('#treegroup .treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                depId = $(this).find('input[name=tree_id]').val() * 1;
            }
        });
        userurl = '/man/user/getUserByDepart?start=' + start + '&length=' + length + '&depart_id=' + depId;
    } else {
        
    }
    $.silentGet(userurl, {}, function (data) {
        var ul = '';
        if (st == 4) {
            try {
                ul = data.tag_users;
            } catch (err) { }

        } else {
            try {
                ul = data.user_list;
            } catch (err) { }
        }

        if (data.rt == '0000') {
            for (var i in ul) {
                status = ul[i].status == 1 ? '已激活' : '未激活';
                strtab1 += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label>'
                    + checkstr
                    + '</label></div></td>'
                    + '<td>' + ul[i].name + '</td>'
                    + '<td>' + ul[i].account + '</td>'
                    + '<td>' + status + '</td>'
                    + '<td style="display:none;">' + ul[i].id + '</td></tr>';
            }
            strtab1 += '</table>';
            tab.html(strtab1);
            if (data.total_count) {
                $('.page' + footerNum).show();
                createFooter(start, length, data.total_count, footerNum);
            } else {
                $('.page' + footerNum).hide();
            }
        } else if (data.rt == 5) {
            toLoginPage();
        }
    });
}

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
function selectcheckbox(e) {
    if ($(e).parent().find('span').hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).prop("checked", false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).prop("checked", true);
    }
}


// 选择按钮
function selected(e) {
    $(e).next('span').toggleClass('txt', $(e).prop("checked"));
    var table = $(e).parents('table'),
        tbody = $(e).parents('tbody');
    var hasSelected = tbody.find('tr td .checkbox input:checkbox:checked').length !== 0;
    allChecked = tbody.find('tr td .checkbox input:checkbox:not(:checked)').length == 0;
    table.find('tr th .checkbox input:checkbox')
        .prop('checked', allChecked)
        .next('span').toggleClass('txt', allChecked);
    $('.hrefactive').toggleClass("hrefallowed", hasSelected);
}

// 全选按钮
function selectedAll(e) {
    $(e).parents('table').find('tr td .checkbox input:checkbox')
        .prop('checked', $(e).prop("checked"))
        .next('span.text').toggleClass('txt', $(e).prop("checked"));
    if ($(e).prop("checked")) {
        $('.hrefactive').addClass("hrefallowed");
        $('.hrefactive[data-target]').attr('data-toggle', 'modal');
    } else {
        $('.hrefactive').removeClass("hrefallowed");
        $('.hrefactive[data-target]').removeAttr('data-toggle');
    }
}

// 创建footer
function createFooter(page, length, total, footerNum) {
    var j = 0;
    if (total > 0) {
        var doc = $('.page' + footerNum + ''),
            pages = ~~(total / length) + (total % length > 0 ? 1 : 0);
        page = total > 0 ? page : 0;
        var str = '<div class="DTTTFooter"><div class="col-md-2"><div class="dataTables_info">共' + total + '条第' + page + '页</div></div>' +
            '<div class="col-md-10">' +
            '<div class="dataTables_paginate paging_bootstrap">' +
            '<ul class="pagination">';
        if (page == 1) {
            str += '<li class="prev disabled"><a>上一页</a></li>'
        } else {
            str += '<li class="prev"><a href="javascript:search(' + (page - 1) + ',' + footerNum + ')">上一页</a></li>'
        }

        if (pages < 6) {
            for (var i = 0; i < pages; i++) {
                if (page == (i + 1)) {
                    str += '<li class="active"><a>' + (i + 1) + '</a></li>';
                    j = i + 1;
                } else {
                    str += '<li><a href="javascript:search(' + (i + 1) + ',' + footerNum + ')">' + (i + 1) + '</a></li>';
                }
            }
        } else {
            if (page < 3) {
                for (var i = 0; i < 5; i++) {
                    if (page == i + 1) {
                        str += '<li class="active"><a>' + (i + 1) + '</a></li>';
                        j = i + 1;
                    } else {
                        str += '<li><a href="javascript:search(' + (i + 1) + ',' + footerNum + ')">' + (i + 1) + '</a></li>';
                    }
                }
            } else if (pages - page < 3) {
                for (var i = pages - 5; i < pages; i++) {
                    if (page == i + 1) {
                        str += '<li class="active"><a>' + (i + 1) + '</a></li>';
                        j = i + 1;
                    } else {
                        str += '<li><a href="javascript:search(' + (i + 1) + ',' + footerNum + ')">' + (i + 1) + '</a></li>';
                    }
                }
            } else {
                for (var i = page - 3; i < page + 2; i++) {
                    if (page == i + 1) {
                        str += '<li class="active"><a>' + (i + 1) + '</a></li>';
                        j = i + 1;
                    } else {
                        str += '<li><a href="javascript:search(' + (i + 1) + ',' + footerNum + ')">' + (i + 1) + '</a></li>';
                    }
                }
            }
        }
        if (j < pages) {
            str += '<li class="next"><a href="javascript:search(' + (j + 1) + ',' + footerNum + ')">下一页</a></li>'
        } else {
            str += '<li class="next disabled"><a>下一页</a></li>'
        }
        str += '</ul>' +
            '</div>' +
            '</div></div>';
        doc.html(str);
    }else{
        $('.page' + footerNum + '').empty();
    }
}



function searchbykeywords(s, tab) {
    if (s.length == 0) {
        warningOpen('请输入你要搜索的内容！');
        return false;
    } else {
        s = encode(s);
        var tr, str, status = 0,
            j = 0,
            child;
        tab.find('tr').each(function () {
            $(this).find('td').each(function () {
                str = $(this).text();
                if (str.indexOf(s) >= 0) {
                    status = 1;
                }
            });
            if (status == 1) {
                $(this).css({ 'visibility': 'visible' });
                status = 0;
                if (j == 0) {
                    $(this).css({ "background-color": "#FFFFFF" });
                    j = 1;
                } else {
                    $(this).css({ "background-color": "#F4F4F4" });
                    j = 0;
                }
            } else {
                $(this).css({ 'display': 'none' });
            }

            var child = $(this).find('th');
            if (child.length > 0) {
                $(this).css({ 'display': '' });
                $(this).css({ 'visibility': 'visible' });
            }
        });
        $('.search input').val('');
    }
}

function encode(s) {
    return s.replace(/([\<\>\&\\\.\*\[\]\(\)\$\^\?\;\:\"\%\#\~\`\'\,\!])/g, "");
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


function warningOpen(str, status, fa) {
    Notify(str, 'top-right', '3000', status, fa, true);
    return false;
}


// 登录失效
function toLoginPage() {
    sessionStorage.removeItem('subpath');
    location.href = "/";
    $.cookie('sid', '', { path: "/", expires: -1 });
    $.cookie('manager', '', { path: "/", expires: -1 });
}



// 下载日志
function downloadLog(category) {
    var url = localStorage.getItem('appssec_url') + '/p/org/exportExcel?sid=' + $.cookie('sid') + '&category=' + category+ '&org_id=' + $.cookie('org_id');
    // downloadFile(url);
    window.location = url;
    // try {
    //     var elemIF = document.createElement("iframe");
    //     elemIF.src = url;
    //     $(elemIF).attr('src', url).css('display', 'none');
    //     document.body.appendChild(elemIF);
    // } catch (e) {
    //     console.error('下载log表格失败:url' + url);
    //     console.error(e);
    // }
}




function applyFnsToSubpage(){
    setTimeout(function(){
        $('[rolefn]').each(function(){
            toggleFn(this,hasFn($(this).attr('rolefn')))
        });
    },10)
}
function toggleFn(ele,has){  //根据has判定元素ele是否具有访问权限，如果没有访问权限，渲染禁止访问样式
    if(!has){  //清楚所有事件并且阻止冒泡
        $(ele)
        .addClass('disabled')
        .prop('disabled',true)
        .removeAttr('onclick')
        .removeClass('hrefactive')
        .off()
        .on('click',function(e){
            e.stopPropagation();
            return false;
        });
    }
}
function hasFn(fn){   //判断功能点fn是否属于合法权限
    if(localStorage.getItem('fns')=='undefined'){
        return true;
    }
    var lid = localStorage.getItem('org_id'),   //管理员责任机构id
        cid = $.cookie('org_id'),               //管理员当前管理机构id
        fns= JSON.parse(localStorage.getItem('fns'));        //模块对应功能点sss
    if(cid==0){
        return true;
    }
    switch (fns){
        case 0:
            return false;
        default:
            if(fns instanceof Array){
                if(fns.indexOf(fn)==-1){
                    return false;
                }else{
                    switch (fn){
                        case 'ioo':
                        case 'pub':
                            return lid==cid;
                            break;
                        default:
                            return true;
                    }
                }
            }else{
                return false;
            }
    }
}


function hasHdlAuth(item,act,aim){
    if(item instanceof Array){
        var has=true;
        for(i in item){
            if(!hasAuth(item[i],act,aim)){
                has=false;
                break;
            }
        }
        return has;
    }else{
        return hasAuth(item,act,aim);
    }
    function hasAuth(item,act,aim){
        var mng = $.cookie('manager'),
        lid = localStorage.getItem('org_id'),   //管理员责任机构id
        cid = $.cookie('org_id'),               //管理员当前管理机构id
        yesno = false;
        if(lid=='0'){  //超级管理员具备最高权限
            yesno = true;
        }

        if(!item.hasOwnProperty('manager')){    //业务管理员对责任机构内没有指定管理者的成员具有完全管理权限
            yesno = true;                       //业务管理员对责任机构内没有指定管理者的成员具有完全管理权限
        }

        if(item.hasOwnProperty('origin')){  //对策略的操作权限
            switch (item.origin){
                case 'NAV':     //本级创建的策略
                    yesno = mng == item.manager;
                    if(act=='跨机构操作'&&lid!=cid){
                        warningOpen('不允许在下级机构进行跨机构操作','danger','fa-bolt');
                        return false;
                    }
                    break;
                case 'PUB':     //上级发布的策略
                    if(act=='机构内下发'){
                        yesno = true;  //对于上级发布的策略，能看见的人都具有机构内下发的权限
                    }
                    break;
                case 'ISS':     //上级下发的策略
                    yesno = false;
                    break;
                default:
            }
        }
        if(!yesno){
            warningOpen('您暂无'+act+'此'+aim+'权限','danger','fa-bolt');
        }
        return yesno;
    }
}


function getItemType(m){   //根据成员item拥有的属性，自动判断其类型，用于提升交互提示的友好度
    if(m.hasOwnProperty('userId')){
        return '用户';
    }else if(m.hasOwnProperty('departId')){
        return '用户组';
    }else if(m.hasOwnProperty('tagId')){
        return '用户标签';
    }else if(m.hasOwnProperty('dev_id')){
        return '设备';
    }else if(m.hasOwnProperty('policyId')){
        return '策略';
    }else if(m.hasOwnProperty('filename')){
        return '文件';
    }else if(m.hasOwnProperty('app_name')){
        return '应用';
    }else if(m.hasOwnProperty('appListId')){
        return '应用名单';
    }else if(m.hasOwnProperty('app_num')){
        return '应用标签';
    }else{
        return '对象';
    }
}


function accountInfo(e) {  //修改密码
        var srcAvatar='/imgs/admin.png';
        if(localStorage.getItem("avatar")){
            srcAvatar=localStorage.getItem("appssec_url")+'/'+localStorage.getItem("avatar");
        }
        $.dialog('form', {
            width: 500,
            height: null,
            autoSize:true,
            maskClickHide: true,
            title: "账号信息",
            content: '<form id="frmAccount" class="form-horizontal" role="form" method="post" enctype="multipart/form-data">\
                        <input name="sid" type="hidden" />\
                        <div class="form-group">\
                            <div class="col-sm-12">\
                                <div id="wrapAccountAvatar">\
                                    <div class="wrap-img">\
                                        <input class="ipt-img" type="file" name="avatar" title="点击更换头像" size="10">\
                                        <img src="'+ srcAvatar +'" />\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label for="name" class="col-sm-2 control-label no-padding-right">账号</label>\
                            <div class="col-sm-10">\
                                <input type="text" class="form-control" name="account">\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label for="name" class="col-sm-2 control-label no-padding-right">昵称</label>\
                            <div class="col-sm-10">\
                                <input type="text" class="form-control require" id="name" name="name" ctrl-regex="name_mix" placeholder="请输入账号昵称">\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <div class="col-sm-2  col-sm-offset-3">\
                                <button type="button" onclick="$.dialogClose()" class="btnBack btn btn-default">返回</button>\
                            </div>\
                            <div class="col-sm-2 col-sm-offset-2">\
                                <input type="submit" class="btn btn-primary" disabled="">\
                            </div>\
                        </div>\
                    </form>',
            hasBtn: false,
            hasClose: true,
            hasMask: true,
            confirm: function () {
                frmAccount.submit();
            },
            confirmHide: true
        });
        var frmAccount =$('#frmAccount').MultForm({
            editUrl:'/p/org/admUpdateAttr',
            editBtnTxt: '保存',
            editAct:'/common/upload',
            afterUsed:function(use,item){
                switch(use){
                    case 'add':
                        break;
                    case 'edit':
                        frmAccount.find('input[name=account]').prop('disabled',true);
                        break;
                    default:
                }
            },
            cbAfterSuccess: function (use) {  //提交编辑成功之后的回调
                $.dialogClose();
            }
        });
        frmAccount.data('item',{
            account:$.cookie('manager'),
            name:localStorage.getItem('name')
        });
        frmAccount.usedAs('edit');
        frmAccount.find('input.ipt-img').off().on('change', function(){
            var file = this.files[0];
            if (!/image\/\w+/.test(file.type)) {
                return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                $('#wrapAccountAvatar .wrap-img img').attr('src',this.result)
            }
        });
        accountFormInit(frmAccount[0])
        function accountFormInit(frm) {
            var ajaxFormOptions = {
                    success: function (data) {
                        $.handleECode(false, data, $(frm[0]).data('infoTxt'));
                        switch (data.rt) {
                            case '0000':
                                if(data.avatar){
                                    localStorage.setItem('avatar',data.avatar);
                                }
                                localStorage.setItem('name',$(frm).find('input[name=name]').val());
                                homeJadeInit();
                                $.dialogClose();
                                break;
                            default:
                                console.warn("data.rt=" + data.rt)
                        }

                    }
                };
            $(frm).off().ajaxForm(ajaxFormOptions);
        }
}



function updatePW(e) {  //修改密码
    $.dialog('form', {
        top:'20%',
        width: 500,
        height: null,
        autoSize:true,
        maskClickHide: true,
        title: "修改密码",
        content: '<form id="frmModPW" class="form-horizontal" role="form" method="post" style="margin-right:-40px;">\
                    <div class="form-group">\
                        <label for="old_passwd" class="col-sm-2 control-label no-padding-right">当前密码</label>\
                        <div class="col-sm-10">\
                            <input type="password" class="form-control require" id="old_passwd" name="old_passwd" placeholder="请输入当前密码">\
                        </div>\
                    </div>\
                    <div class="form-group">\
                        <label for="new_passwd" class="col-sm-2 control-label no-padding-right">新密码</label>\
                        <div class="col-sm-10">\
                            <input type="password" class="form-control require" id="new_passwd" name="new_passwd" ctrl-regex="password" placeholder="请输入新密码">\
                        </div>\
                    </div>\
                    <div class="form-group">\
                        <label for="confirmpw" class="col-sm-2 control-label no-padding-right">确认密码</label>\
                        <div class="col-sm-10">\
                            <input type="password" class="form-control" id="confirmpw" same-with="new_passwd" autocomplete="off" placeholder="请再次输入新密码">\
                        </div>\
                    </div>\
                    <div class="form-group">\
                        <div class="col-sm-2  col-sm-offset-4">\
                            <button type="button" onclick="$.dialogClose()" class="btnBack btn btn-default">返回</button>\
                        </div>\
                        <div class="col-sm-2 col-sm-offset-1">\
                            <input type="submit" class="btn btn-primary" disabled="">\
                        </div>\
                    </div>\
                </form>',
        hasBtn: false,
        hasClose: true,
        hasMask: true,
        confirm: function () {
            frmModPW.submit();
        },
        confirmHide: true
    });
    var frmModPW =$('#frmModPW').MultForm({
        editBtnTxt: '确认',
        editAct:'/common/pw/selfmod',
        beforeSubmit:function(arrKeyVal, $frm, ajaxOptions){
            frmModPW['new_passwd']=b64.encode($('input[name=new_passwd]').val());
        },
        cbAfterSuccess: function (use) {  //提交编辑成功之后的回调
            localStorage.setItem('firLogin','');
            $.cookie('passwd',frmModPW['new_passwd']);
            $.dialogClose();
        }
    });
    frmModPW.data('item',{});
    frmModPW.usedAs('edit');
}

function jeDatePcyInit(){
    var today=$.nowDate().split(' ')[0],
        tomorrow=$.nowDate({DD:+1}).split(' ')[0];
        start_date_opt={
            format: "YYYY-MM-DD",
            minDate: today,
            isClear:false,
            okfun: function (elem) {
                stopNum=$.timeStampDate(elem.val)+60*60*24;
                stop_date_opt.minDate=$.timeStampDate(stopNum,stop_date_opt.format);
                $('#stop_date').jeDate(stop_date_opt);
                if(stopNum>$.timeStampDate($('#stop_date').val())){
                    $('#stop_date').val(stop_date_opt.minDate);
                }
            }
        },
        stop_date_opt={
            format: "YYYY-MM-DD",
            minDate: today,
            isClear:false
        },
        time_opt={
            format: "hh:mm:ss",
            isClear:false
        };
    $('#start_date').attr('value',today).jeDate(start_date_opt);
    $('#stop_date').attr('value',tomorrow).jeDate(stop_date_opt);
    $('#start_time').attr('value','08:00:00').jeDate(time_opt);
    $('#stop_time').attr('value','20:00:00').jeDate(time_opt);
}

function logDateInit(){
    $(".jedate").each(function () {
        $(this).jeDate({
            isClear:true,
            format: "YYYY-MM-DD hh:mm:ss",
            okfun: function (elem) {
                elem.elem.change();
            },
            clearfun: function (elem) {
                elem.elem.change();
            }
        });
    })
}


