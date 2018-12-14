/**
 * pjax代码：开始
*/
//$('document').pjax('html元素','需要跟新的容器')  给html元素绑定pjax传输的方法  

$('#admin').text($.cookie('admin'));
$('.username>a').text($.cookie('username'));
$('.email>a').text($.cookie('email'));

$(document).pjax('a.pjax-link,a[data-pjax]', '#pjax-aim', {
    show: 'fade',  //展现的动画，支持默认和fade, 可以自定义动画方式，这里为自定义的function即可。
    cache: false,  //是否使用缓存
    titleSuffix: 'dddd', //标题后缀
});
if ($('a[href="' + location.pathname + location.search + '"]').length === 1) {
    $('a[href="' + location.pathname + location.search + '"]').click();
} else {
    $('a[href="/sub?pg=p01_home"]').click();
}

//pjax事件监听

//这是提交表单的pjax。form表示所有的提交表单都会执行pjax，比如搜索和提交评论，可自行修改改成你想要执行pjax的form id或class。#content 同上改成你主题的内容主体id或class。
// $(document).on('submit', 'form', function (event) { 
//     $.pjax.submit(event, '#content', { fragment: '#content', timeout: 6000 }); 
// }); 

$(document).on('pjax:click', function () {
    $(".loading-container").removeClass('loading-inactive').addClass('loading-active');//参考的loading动画代码
});
$(document).on('pjax:success', function (event, data, state, option) {
    $.activeSidebar(location.pathname + location.search);   //根据url中的标识调整左边栏菜单样式
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
        $.activeSidebar(location.pathname + location.search);
    });
}
/**
 * pjax代码：结束
*/




function pjaxClick(sHref) {
    $('.sidebar-menu a[data-pjax][href="' + sHref + '"]').click();
}
function licApply(licPath) {
    $('a[data-pjax][href^="/sub?pg="]').each(function () {
        $(this).toggleClass('expired', !licPath[$(this).attr('href').split('=')[1].split('_')[0]]);
    })
}
if ($.cookie('licPath')) {
    licApply(JSON.parse($.cookie('licPath')));
    $.silentGet('/newlic', { 'licPath': $.cookie('licPath') }, function (data) {
    })
}
$('input[type=number]').keypress(function (e) {
    if (!String.fromCharCode(e.keyCode).match(/[0-9]/)) {
        return false;
    }
});
$('input[type=number]').keyup(function (e) {
    try {
        var val = parseInt(this.value);
        if (this.max && val > this.max) {
            this.value = this.max;
        } else {
            this.value = val;
        }
    } catch (err) {
        console.error(err)
    }
});
$('input[type=number]').blur(function () {
    if (!this.value) {
        this.value = this.min ? this.min : 1;
    }
})

var avatar = localStorage.getItem("avatar");
var icon = localStorage.getItem("icon");
var productName = localStorage.getItem("productName");
var appssec_url = localStorage.getItem("appssec_url");
picurl = appssec_url + '/';
hosturl = appssec_url + '/';
downurl = appssec_url;
if (icon) {
    $('.navbar-inner .navbar-brand small').html('<img src="' + appssec_url + '/' + icon + '" alt=""></img>');
} else {
    $('.navbar-inner .navbar-brand small').html('<img src="/assets/img/logo.png" alt=""/>');
}

if (avatar) {
    $('.navbar .account-area a .avatar').html('<img src="' + appssec_url + '/' + avatar + '" alt=""></img>');
    $('.navbar .account-area ul .avatar-area').html('<img class="avatar" src="' + appssec_url + '/' + avatar + '" alt=""></img>');
}

if (productName != 'undefined' && productName != '') {
    $('.navbar .product_name').html('<a href="#" class="navbar-brand">' + productName + '</a>');
} else {
    $('.navbar .product_name').html('<a href="#" class="navbar-brand">移动安全管理平台</a>');
}

$(".searchicon").click(function () {
    $(".searchicon").toggle();
    $(".searchcontent").slideToggle();
});

$(".treehead .cursor").click(function () {
    $(".searchcontent").hide();
    $(".searchicon").show();
});
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
        $('#usertaglist .treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                id = $(this).find('input[name=tree_id]').val() * 1;
            }
        });
        if (id) {
            userurl = '/man/user/getUserByTag?start=' + start + '&length=' + length + '&tag_id=' + id;
        } else {
            st = 2;
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
        }
    }
    $.silentGet(userurl,{}, function (data) {
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
    if (total >= 0) {
        var doc = $('.page' + footerNum + ''),
            pages = ~~(total / length) + (total % length > 0 ? 1 : 0);
        page = total > 0 ? page : 0;
        var str = '<div class="DTTTFooter"><div class="col-md-2"><div class="footertotal" style="white-space:nowrap;">共' + total + '条第' + page + '页</div></div>' +
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
    }
}

function issuePolicy() {
    var i = 0;
    var tab = $('table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            i = i + 1;
        }
    });
    if (i > 0) {
        var cont = '';
        cont += '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>' +
            '<h4 class="modal-title">下发策略</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<form role = "form" class="form-horizontal issuePolicy">' +
            '<div class = "form-group" style="text-align:center;margin-top:15px;">' +
            '<div class="col-sm-4 col-sm-offset-2">' +
            '<a href="javascript:pjaxClick(\'/sub?pg=p0401_pcy_device\')" class="btn btn-primary">设备策略</a>' +
            '</div>' +
            '<div class="col-sm-4">' +
            '<a href="javascript:pjaxClick(\'/sub?pg=p0402_pcy_compliance\')" class="btn btn-primary">合规策略</a>' +
            '</div>' +
            '</div>' +
            '<div class = "form-group" style="text-align:center;">' +
            '<div class="col-sm-4 col-sm-offset-2">' +
            '<a href="javascript:pjaxClick(\'/sub?pg=p0403_pcy_rail\')" class="btn btn-primary btn-large">' +
            '围栏策略' +
            '</a>' +
            '</div>' +
            '<div class="col-sm-4">' +
            '<a href="javascript:pjaxClick(\'/sub?pg=p0404_pcy_app\')" class="btn btn-primary btn-large">' +
            '应用策略' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>' +
            '</div>';
        alertOpen(cont);
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

function warningOpen(str, status, fa) {
    Notify(str, 'top-right', '3000', status, fa, true);
    return false;
}

// 获取cookie里的值
function getCookie(cookie_name) {
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name); //索引的长度  
    if (cookie_pos != -1) {
        cookie_pos += cookie_name.length + 1;
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        if (cookie_end == -1) {
            cookie_end = allcookies.length;
        }
        var value = unescape(allcookies.substring(cookie_pos, cookie_end)); //这里就可以得到cookie的值 
    }
    return value;
}

// 登录失效
function toLoginPage() {
    sessionStorage.removeItem('subpath');
    location.href = "/";
    $.cookie('sid', '', { path: "/", expires: -1 });
    $.cookie('admin', '', { path: "/", expires: -1 });
}



// 下载日志
function downloadLog(category) {
    var url = localStorage.getItem('appssec_url') + '/p/org/exportExcel?sid=' + $.cookie('sid') + '&category=' + category;
    // downloadFile(url);
    // window.location = url;
    try {
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        $(elemIF).attr('src', url).css('display', 'none');
        document.body.appendChild(elemIF);
    } catch (e) {
        console.error('下载log表格失败:url' + url);
        console.error(e);
    }
}





