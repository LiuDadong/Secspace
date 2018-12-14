



/**
 * 边栏菜单跳转实现思路：
 * 1、给所有的'#sidebar a[subhomePath]'元素绑定跳转函数sideSkip(e)
 * 2、通过sideSkip事件对象e，获取当前事件目标元素e.currentTarget
 * 3、获取目标元素预先准备的subhomePath（用于最终请求响应子页subhome.html）属性值，加载局部首页subpage(pagename)更新的格式，
 *    判断其为主菜单还是子菜单，并作响应处理，返回一个对象数组skipInfo
 *      [主菜单，子菜单]：   [{txt:'',pagename:''},{txt:'',pagename:''}]  
 *      [主菜单]：          [{txt:'',pagename:''}]
 * 4、根据skipInfo，重置面包屑导航 cnReset(skipInfo)
 * 
 * 5、用于重置面包屑导航
 */



var st = 1;

/*用于显示文件上传进度*/


$(".searchicon").click(function () {
    $(".searchicon").toggle();
    $(".searchcontent").slideToggle();
});
$(".treehead .cursor").click(function () {
    $(".searchcontent").hide();
    $(".searchicon").show();
});
// searchapplist();



function searchbytag(e) {
    if ($(e).hasClass('tagactive')) {
        st = 1
        $(e).removeClass('tagactive');
        fnListAppIntable(1);
    } else {
        st = 2;
        $('.searchcontent .tag li').removeClass('tagactive');
        $(e).addClass('tagactive');
        fnListAppIntable(1);
    }
}


// 添加至标签
function addTotag() {
    var i = 0;
    var tr;
    var cont = '';
    var tab = $('.appstable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            i = i + 1;
        }
    });

    if (i > 0) {
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
            + '<ul name="taglist" class="list-group">'
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
        $.silentGet('/man/appTag/getAppTagList', { start_page: 1, page_length: 1000 }, function (data) {  // 获取标签列表
            if (data.rt == '0000') {
                var select = $('#usertag ul[name=taglist]');
                for (var i = 0; i < data.apptag_list.length; i++) {
                    str += '<li class="list-group-item" onclick="selectonetag(this)">'
                        + data.apptag_list[i].name
                        + '<input type="text" name="tagid" value="' + data.apptag_list[i].id + '" style="display:none"/>'
                        + '</li>';
                }
                select.html(str);
            } else {
                warningOpen('获取标签失败！', 'danger', 'fa-bolt');
            }
        });

    }
}

// 旧式标签筛选框函数
function tag_add() {
    var tag_id;
    var tab = $('#usertag ul[name=taglist]');
    tab.find('li').each(function () {
        if ($(this).hasClass('tagactive')) {
            tag_id = $(this).find('input[name=tagid]').val() * 1;
        }
    });

    var app_list = [], j = 0;
    var tr;
    var tab1 = $('.appstable table');
    tab1.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            app_list[j] = tr.find('td').eq(15).text() * 1;
            j = j + 1;
        }
    });
    if (tag_id) {
        var postData = {
            apptag_id: tag_id,
            app_list: JSON.stringify(app_list)
        };
        $.actPost('/man/appTag/addApp', postData, function (data) {
            if (data.rt == '0000') {
                alertOff();
                fnListAppIntable(currentpage);
            }
        });
    }

}








// 策略下发获取用户组
function searchuserlist1() {
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
function searchuserlist() {
    var str2 = '';
    var folder = '';
    $.silentGet('/common/org/list' + 0,{
        departId: 0,
        url:'/p/depart/manage'
    }, function (data) {
        if (data.rt == '0000') {
            for (var i = 0; i < data.depart_list.length; i++) {
                folder = data.depart_list[i].child_node != 0 ?
                    '<i class="fa fa-plus faopen cursor" onclick="opentreesearch(this)" style="width: 15px;"></i><i class="fa fa-minus faclose cursor" onclick="opentreesearch(this)" style="width: 15px;"></i>' : '';
                str2 += '<li class="tree-item">'
                    + '<div class ="tree-item-name">'
                    + '<i class="fa fa-check-square-o treechildh cursor" style="display:none;" onclick="_select(this)">'
                    + '<input type="text" name="tree_id" value="' + data.depart_list[i].id + '" style="display:none;"/></i>'
                    + '<i class="fa fa-square-o treechilds cursor" onclick="_cancel(this)"></i>'
                    + '<input type="text" name="p_id" value="' + 0 + '" style="display:none;"/>'
                    + folder
                    + data.depart_list[i].name
                    + '</div>'
                    + '</li>';
            }
            str2 += '</ul>'
            $("#treegroup").html(str2);
        }
    });
}
