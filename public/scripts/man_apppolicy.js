/*
 * ==================================================================
 *                          应用策略 apppolicy
 * ==================================================================
 */

$(function() {
    $('.policymenu').addClass('open active');
    $('.policymenu').find('li:eq(3)').addClass('active');
    // 策略列表
    getPolicyList(1,10);
    blacklistObj.getBlack();
    $('#delay').keyup(function(){
        var c = $(this);
        var temp_amount = c.val().replace(/[^\d]/g, '');
        // 判断范围
        temp_amount = temp_amount < 1 ? 1 : temp_amount > 72 ? 72 : temp_amount;
        $(this).val(temp_amount);
    });

    var blackname = $("select[name=blacklistname]");
    blackname.data("last", blackname.val()).change(function(){
        var that = this;
        var oldvalue = $(that).data("last");
        $(that).data("last", $(that).val());
        var blval = $(this).val();
        $("select[name=blacklistname]").each(function(){
            if (that != this) {
                $(this).find('option[value="'+blval+'"]').css({'display':'none'});
                if($(this).val() == $(that).val()){
                    $(this).val('');
                }
            };
            
            $(this).find('option[value="'+oldvalue+'"]').css({'display':'block'});
        });
        
    });
});
var item = 1;

// 已经启用黑名单列表对象
var blacklistObj = (function(){
    var blackObj;
    function getBlack(){
        if(blackObj == undefined){
            blackObj = new Construct();
        }
        return blackObj;
    }
    function Construct(){
        $.get('/man/apppolicy/onBlackList', function(data){
            data = JSON.parse(data);
            if (data.rt == 0) {
                blackObj = data;
            } else if (data.rt==5) {
                toLoginPage();           
            } else {
                warningOpen('获取标签失败！','danger','fa-bolt');
            }
        });
    }
    return {
        getBlack: getBlack
    }
})();

var mapObj = (function(){
    var map;
    function getInstance(){
        if( map === undefined ){
            map = new Construct();
        }
        map.clearMap();
        return map;
    }
    function Construct(){
        var editorTool, map = new AMap.Map("address", {
            resizeEnable: true,
            center: [116.40, 39.90],//地图中心点
            zoom: 13 //地图显示的缩放级别
        });
        var circle = {};
        map.on('click', function(e) {
            map.clearMap();
            circle = new AMap.Circle({
                map: map,
                center: [e.lnglat.getLng(), e.lnglat.getLat()],// 圆心位置
                radius: 100, //半径
                strokeColor: "#F33", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 2, //线粗细度
                fillColor: "#ee2200", //填充颜色
                fillOpacity: 0.35//填充透明度
            });
            $('.pointer').html(e.lnglat.getLng()+','+ e.lnglat.getLat());
            $('.radius').html(circle.getRadius());
            map.plugin(["AMap.CircleEditor"],function(){ 
                circleEditor = new AMap.CircleEditor(map,circle); 
                circleEditor.open(); 
                circleEditor.on('adjust', function(e) {
                    console.log(e.radius+'   ');
                    $('.radius').html(e.radius);
                });
                circleEditor.on('move', function(e) {
                    $('.pointer').text(e.lnglat);
                });
            });
        });
        AMap.service(["AMap.PlaceSearch"], function() {
            placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 1,
                pageIndex: 1,
                city: "010", //城市
                map: map//,
                //panel: "panel"
            });
        });
        $("input[name=searchaddress]").keyup(function(){
            if($('input[name=searchaddress]').val()){
                placeSearch.search($('input[name=searchaddress]').val(), function(status, result) {
                });
            }
        });
        return map;
    }
    return {
        getInstance : getInstance
    }
})();

function bridgemap(){
    $('.address').removeClass('col-lg-7 col-xs-10 col-sm-10 col-lg-offset-3 col-xs-offset-1 col-sm-offset-1');
    $('.address').addClass('col-lg-12 col-xs-12 col-sm-12 maxmap');
    $('.addressicon').css({'display':'none'});
    $('.addressicon2').css({'display':'inline'});
}
function minmap(){
    $('.address').removeClass('col-lg-12 col-xs-12 col-sm-12 maxmap');
    $('.address').addClass('col-lg-7 col-xs-10 col-sm-10 col-lg-offset-3 col-xs-offset-1 col-sm-offset-1');    
    $('.addressicon2').css({'display':'none'});
    $('.addressicon').css({'display':'inline'});
}
// 添加
function add(){
    reset();
    $('.policylist, .modbtn, .modpolicy, .viewbtn').css({'display':'none'});
    $('.policy_add input').attr("disabled",false);
    $('.policy_add select').attr("disabled",false);
    $('.policy_add input[type=checkbox]').attr("disabled",false);
    $('.policy_add, .addbtn, .additem, .addappitem, #app_list a').css({'display':'block'});
    $('.addpolicy').css({'display':'inline-block'});
    $("input:radio[name='policy_type']").eq(0).click();
    var str = '';
    var data = blacklistObj.getBlack();
    for(var i in data.data) {
        str += '<option class="option" value="'+data.data[i].id+'">'
            + data.data[i].name
            + '</option>';
    }
    $('select[name=blacklistname]').html(str);
    $('select[name=blacklistname]').val('');
}
// 黑名单策略
function check_1(){
    $('.white-item, .addr-item, .time-item').css({'display':'none'});
    $('.black-item').css({'display':'block'});
}
// 白名单策略
function check_2(){
    $('.white-item, .addr-item, .time-item').css({'display':'block'});
    $('.black-item').css({'display':'none'});
    document.getElementById('timepolicy').checked = true;
    document.getElementById('addrpolicy').checked = true;
    $('.white-item .text').addClass('txt');
    mapObj.getInstance();
    $('.pointer').html('');
    $('.radius').html('');
}

// 添加编辑页面，添加黑名单
function blacklist_item_add(){
    var s = $('.black_item:last');
    var div1 = document.createElement("div");  
    div1.className = 'black_item';
    var txt1 = '<div class="row col-xs-12 col-md-12" style="margin-bottom:0px;">'
            + '<div class="form-group">'
            + '<div class="col-lg-6 col-xs-6 col-sm-8 col-lg-offset-3 col-xs-offset-3 col-sm-offset-2">'
            + '<label class="control-label" style="width:110px;padding-left:22px;">选择黑名单</label>'
            + '<div class="adddiv" style="left: 140px;">'
            + '<select class="form-control" name="blacklistname" id="item_'+item+'">'
            + '</select>'
            + '</div>'
            + '</div>'
            + '<div class="col-lg-2 col-xs-2 col-sm-2 deleteicon">'
            + '<a onclick="deleteitem(this)" style="line-height:34px;font-size:18px;margin-left:10px;">'
            + '<i class="fa fa-minus-circle primary"></i></a>'
            + '</div>'
            + '</div>'
            + '</div>';
    div1.innerHTML = txt1;  
    s.after(div1);
    var option = 'item_'+item;
    $('#item_0 option').each(function(){
        var oValue = $(this).val().toString();
        var oText = $(this).text().toString();
        var option = $("<option>").val(oValue).text(oText);
        $('#item_'+item).append(option); 
    });
    $('#item_'+item).val('');

    var blackname = $("select[id^='item_']");
    blackname.data("last", blackname.val()).change(function(){
        var that = this;
        var oldvalue = $(that).data("last");
        $(that).data("last", $(that).val());
        var blval = $(this).val();
        blackname.each(function(){
            if (that != this) {
                $(this).find('option[value="'+blval+'"]').css({'display':'none'});
                if($(this).val() == blval){
                    $(this).val('');
                }
            };
            
            $(this).find('option[value="'+oldvalue+'"]').css({'display':'block'});
        });
        
    });
    
    item = item + 1;
}

// 添加编辑页面删除黑名单
function deleteitem(that){
    $(that).parents('.black_item').remove();
}
// 默认
function reset(){
    $('.policy_add input').val('');
    $('.policy_add select').val('');
    $('#app_list').html('');
    $('.policy_add input[type=checkbox]').attr("checked",false);
    $('.policy_add .adddiv span').removeClass('txt');
    $('.policy_add .black_item').not(':first').remove();
    item = 1;
}

// 时间限制选择
function check1(e){
    if($(e).attr("checked") || $(e).next().hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
        $('.time-item').css({'display':'none'});
        $('.addr-item').css({'display':'block'});
        document.getElementById('addrpolicy').checked = true;
        $('#addrpolicy').next().addClass('txt');
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
        $('.time-item').css({'display':'block'});
    }
}
// 地理限制选择
function check2(e){
    if($(e).attr("checked") || $(e).next().hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
        $('.time-item').css({'display':'block'});
        $('.addr-item').css({'display':'none'});
        document.getElementById('timepolicy').checked = true;
        $('#timepolicy').next().addClass('txt');
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
        $('.addr-item').css({'display':'block'});
    }
}
// 违规限制选择
function checkthis(e){
    if($(e).attr("checked")) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
    }
}

function add_applist(){
    var strtab1 = '<table class="table table-hover"><tr>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
                + '<input type="checkbox" onclick="selectedAll(this)"></input>'
                + '<span class="text"></span></label></div></th>'
                + '<th>应用名称</th>'
                + '<th>应用包名</th>'
                + '</tr>';
    var cont = '';
    $.get('/man/apppolicy/appList', function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.data) {
                strtab1 += '<tr>'
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)">'
                        + '</input><span class="text"></span></label></div></td>'
                        + '<td>' + data.data[i].app_name + '</td>'
                        + '<td>' + data.data[i].package_name + '</td></tr>';              
            }
            strtab1 += '</table>';
            cont += '<div class="modal-header">'
                 + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                 + '<h4 class="modal-title">选择应用</h4>'
                 + '</div>'
                 + '<div class="modal-body" style="max-height:340px;overflow-y:auto;">'
                 + strtab1
                 + '</div>'
                 + '<div class="modal-footer">'
                 + '<button type="button" class="btn btn-primary" onclick="addapp()">确认</button>'
                 + '</div>';  
            alertOpen(cont);
        } else if (data.rt==5) {
            toLoginPage();           
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
}
function addapp(){
    var tr;
    var tab = $('.modal-body table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            $("#app_list").append("<li value="+tr.find('td').eq(2).text()+" style='line-height:34px;'>"
                + tr.find('td').eq(1).text()
                + "<a onclick='deleteapp(this)' style='line-height:34px;font-size:18px;margin-right:180px;float:right;'>"
                + "<i class='fa fa-minus-circle primary'></i></a>"
                + "</li>");
        }     
    });
    alertOff();  
}
function deleteapp(e){
    $(e).parent().remove();
}
// 提交添加策略
function add_policy(){ 
    var whiteapp;
    var postData = {};
    var violation_limit = {};
    var black_id = [];
    var app_list = [];
    var limit;
    var i = 0;
    var tab = $('#app_list');
    var site_range = {};
    var time_limit = {};
    if($(".black_item").is(":visible")){
        violation_limit["camera"] = document.getElementById('camera').checked == true ? 1 : 0;
        violation_limit["access_secspace"] = document.getElementById('access_secspace').checked == true ? 1 : 0;
        violation_limit["enterprise_data"] = document.getElementById('enterprise_data').checked == true ? 1 : 0;
        violation_limit["all_data"] = document.getElementById('all_data').checked == true ? 1 : 0;
        violation_limit["sd"] = document.getElementById('sd').checked == true ? 1 : 0;
        violation_limit["message"] = document.getElementById('message').checked == true ? 1 : 0;
        violation_limit["phone"] = document.getElementById('phone').checked == true ? 1 : 0;
        var mesg = document.getElementById('mesg').checked;
        var email = document.getElementById('email').checked;
        if(mesg && email){
            violation_limit["alarm"] = 3;
        } else if(mesg == true){
            violation_limit["alarm"] = 1;
        } else if(email == true){
            violation_limit["alarm"] = 2;
        } else {
            violation_limit["alarm"] = 0;
        }
        var itemlist = $('.policy_add');
        itemlist.find(".black_item").each(function () {
            var itemval = $(this).find('select[name=blacklistname]').val() * 1;
            black_id.push(itemval); 
        });
        postData = {
            name: $('input[name=name]').val(),
            delay: $('input[name=delay]').val(),
            violation_limit: JSON.stringify(violation_limit),
            black_id: JSON.stringify(black_id)
        };
        if (postData.name =='') {
            warningOpen('请输入名称！','danger','fa-bolt');
        } else if (postData.delay =='') {
            warningOpen('请输入延迟时间！','danger','fa-bolt');
        } else if (postData.black_id.length < 1) {
            warningOpen('请输选择黑名单！','danger','fa-bolt');
        } else { 
            $.post('/man/apppolicy/add_policy', postData, function(data) {
                if (data.rt == 0) {
                    policylist();
                    warningOpen('操作成功！','primary','fa-check');
                    getPolicyList(currentpage,10);
                } else if (data.rt == 5) {
                    toLoginPage();
                } else if (data.rt == 15) {
                    warningOpen('策略名称重复！','danger','fa-bolt');
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
            });
        }
    } else {

        whiteapp = 0;

        tab.find('li').each(function () {
            app_list[i] = $(this).attr('value');
            i = i+1;  
        }); 

        site_range = {
            site: $('.pointer').text(),
            range: $('.radius').text()
        };

        if($('select[name=repeat_type]').val() == 1){
            time_limit = {
                repeat_type: '1',
                start_date: $('input[name=start_date]').val(),
                stop_date: $('input[name=stop_date]').val(),
                start_time: $('input[name=start_time]').val(),
                stop_time: $('input[name=stop_time]').val(),
                weekday: $('select[name=weekday]').val()
            };
        } else {
            time_limit = {
                repeat_type: $('select[name=repeat_type]').val(),
                start_date: $('input[name=start_date]').val(),
                stop_date: $('input[name=stop_date]').val(),
                start_time: $('input[name=start_time]').val(),
                stop_time: $('input[name=stop_time]').val()
            };
        }

        var timepolicy = document.getElementById('timepolicy').checked;
        var addrpolicy = document.getElementById('addrpolicy').checked;

        if(timepolicy && addrpolicy){
            limit = 'both';
            postData = {
                name: $('input[name=name]').val(),
                whiteapp: whiteapp,
                limit: limit,
                site_range: JSON.stringify(site_range),
                time_limit: JSON.stringify(time_limit),
                app_list: JSON.stringify(app_list)
            };
        } else if(addrpolicy == true){
            limit = 'geo';
            postData = {
                name: $('input[name=name]').val(),
                whiteapp: whiteapp,
                limit: limit,
                site_range: JSON.stringify(site_range),
                app_list: JSON.stringify(app_list)
            };

        } else {
            limit = 'time';
            postData = {
                name: $('input[name=name]').val(),
                whiteapp: whiteapp,
                limit: limit,
                time_limit: JSON.stringify(time_limit),
                app_list: JSON.stringify(app_list)
            };
        }
        
        if (postData.name =='') {

            warningOpen('请输入名称！','danger','fa-bolt');            
        } else { 

            $.post('/man/apppolicy/add_policy', postData, function(data) {
                if (data.rt == 0) {
                    policylist();
                    warningOpen('操作成功！','primary','fa-check');
                    getPolicyList(currentpage,10);
                } else if (data.rt == 5) {
                    toLoginPage();
                } else if (data.rt == 15) {
                    warningOpen('策略名称重复！','danger','fa-bolt');
                } else if (data.rt == 39) {
                    warningOpen('策略开始时间大于截止时间！','danger','fa-bolt');
                }  else if (data.rt == 40) {
                    warningOpen('策略截止时间小于当前时间！','danger','fa-bolt');
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
            });
        }

    }

}

var st = 2;
// 策略列表
function getPolicyList(start,length){   
    var status;
    var usedstr;
    var policy_type;
    var table = $('.policytable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox">'
            + '<label><input type="checkbox" onclick="selectedAll(this)"></input>'
            + '<span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>类型</th>'
            + '<th>状态</th>'
            + '<th>创建者</th>'
            + '<th>已应用/已下发</th>'
            + '<th>更新时间</th>'
            + '<th>操作</th></tr>';

    var url = '/man/apppolicy/getApppolicyList?start_page='+ start + '&page_length='+ length;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.policies) {
                status = data.policies[i].status == 1 ? '启用' : '禁用';
                policy_type = data.policies[i].policy_type == 'whiteapp' ? '白名单策略' : '黑名单策略';
                usedstr = data.policies[i].name === '默认策略' ? '<a> -- / -- </a>':
                '<a href="javascript:devusers('+ i +');">' + data.policies[i].used + ' / ' + data.policies[i].issued +'</a>';
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input>'
                    + '<span class="text"></span></label></div></td>'
                    + '<td>' + data.policies[i].name + '</td>'
                    + '<td>' + policy_type + '</td>'
                    + '<td>' + status + '</td>'
                    + '<td>' + data.policies[i].creator + '</td>'  
                    + '<td>' 
                    + usedstr
                    + '</td>'  
                    + '<td>' + data.policies[i].update_time + '</td>'
                    + '<td style="display:none;">' + data.policies[i].id + '</td>' 
                    + '<td style="display:none;">' + data.policies[i].policy_type + '</td>' 
                    + '<td style="display:none;">' + data.policies[i].delay + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].black_id) + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].violation_limit) + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].site_range) + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].app_list) + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].time_limit) + '</td>' 
                    + '<td style="display:none;">' + data.policies[i].limit + '</td>'
                    + '<td style="display:none;">' + data.policies[i].status + '</td>' 
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
        getPolicyList(p,10);
    } else if(i == 2){
        var tab1 = $('.usertable');
        var tab2 = $('.tagusertable'); 
        var keyword = $('.widget-btn input[name=keyvalue]').val();
        getUserList(p,10,keyword,tab1,2,2); 
        getUserList(p,10,keyword,tab2,3,2); 
    } else {
        console.log(i);
    }
}

// 返回列表
function policylist(){
    $('.policy_add, .addpolicy, .modpolicy, .viewpolicy, .issuedlist, .issuedpolicy').css({'display':'none'});
    $('.policylist').css({'display':'block'});
    reset();
    $('.policy_add input').attr("disabled",false);
    $('.policy_add select').attr("disabled",false);
    $('.policy_add input[type=checkbox]').attr("disabled",false);
}

// 编辑
function modify(i){
    //add();
    reset();
    $('.policy_add input').attr("disabled",false);
    $('.policy_add select').attr("disabled",false);
    $('.policy_add input[type=checkbox]').attr("disabled",false);

    var tr = $('.policytable table tr').eq(i+1);
    var id = tr.find('td').eq(7).text(); 
    var name = tr.find('td').eq(1).text(); 
    var delay = tr.find('td').eq(9).text(); 
    var policy_type = tr.find('td').eq(8).text(); 
    var violation_limit = tr.find('td').eq(11).text();        
    var limitObj;
    var black_id = tr.find('td').eq(10).text();          
    var blackObj;
    var site_range = tr.find('td').eq(12).text();       
    var siteObj;
    var app_list = tr.find('td').eq(13).text();       
    var appObj;
    var time_limit = tr.find('td').eq(14).text();    
    var timeObj;
    var limit = tr.find('td').eq(15).text(); 

    $('.policylist, .addbtn, .viewbtn, .addpolicy').css({'display':'none'});
    $('.policy_add,.modbtn, .additem').css({'display':'block'});
    $('.modpolicy').css({'display':'inline-block'});
    $('input[name=policyid]').val(id);
    $('input[name=name]').val(name);
    if(policy_type == 'blackapp'){
        $("input:radio[name='policy_type']").eq(0).click();   
        $('.policy_add input[type=radio]').attr("disabled",true);      
        limitObj = JSON.parse(violation_limit);    
        blackObj = JSON.parse(black_id);

        var str = '';
        var blacklist = blacklistObj.getBlack();
        for(var i in blacklist.data) {
            str += '<option class="option" value="'+blacklist.data[i].id+'">'
                + blacklist.data[i].app_name
                + '</option>';
        }
        $('select[name=blacklistname]').html(str);
        $('input[name=delay]').val(delay);
        document.getElementById('camera').checked = limitObj.camera == 1 ? true : false;
        document.getElementById('access_secspace').checked = limitObj.access_secspace == 1 ? true : false;
        document.getElementById('enterprise_data').checked = limitObj.enterprise_data == 1 ? true : false;
        document.getElementById('all_data').checked = limitObj.all_data == 1 ? true : false;
        document.getElementById('sd').checked = limitObj.sd == 1 ? true : false;
        document.getElementById('message').checked = limitObj.message == 1 ? true : false;
        document.getElementById('phone').checked = limitObj.phone == 1 ? true : false;
        if(limitObj.alarm == 3){
            document.getElementById('mesg').checked = true;
            document.getElementById('email').checked = true;
        } else if(limitObj.alarm == 1){
            document.getElementById('mesg').checked = true;
            document.getElementById('email').checked = false;
        } else if(limitObj.alarm == 2){
            document.getElementById('mesg').checked = false;
            document.getElementById('email').checked = true;
        } else {
            document.getElementById('mesg').checked = false;
            document.getElementById('email').checked = false;
        }
        for(var k = 0; k < blackObj.length - 1; k++){
            blacklist_item_add();
        }
        for(var j in blackObj) {
            $('.black_item').eq(j).find('select[name=blacklistname]').val(blackObj[j]);
        }

    } else {
        $("input:radio[name='policy_type']").eq(1).click();
        $('.policy_add input[type=radio]').attr("disabled",true);
        appObj = JSON.parse(app_list);
        if(limit === 'geo'){
            $('#timepolicy').next().removeClass('txt');
            $('#timepolicy').attr("checked",false);
            $('.time-item').css({'display':'none'});
            $('.addr-item').css({'display':'block'});
            document.getElementById('addrpolicy').checked = true;
            $('#addrpolicy').next().addClass('txt');

            siteObj = JSON.parse(site_range);
            var pointer = siteObj.site.split(',');
            var map = mapObj.getInstance();
            var zoomindex = 12;
            if(siteObj.range*1 > 10000){
                zoomindex = 10;
            } else if(siteObj.range*1 < 1000 && siteObj.range*1 > 500){
                zoomindex = 14;
            } else if(siteObj.range*1 < 100 && siteObj.range*1 > 0){
                zoomindex = 17;
            } else if(siteObj.range*1 > 1000 && siteObj.range*1 < 10000) {
                zoomindex = 11;
            } else if(siteObj.range*1 < 500 && siteObj.range*1 > 100) {
                zoomindex = 15;
            } else {
                zoomindex = 10;
            }
            map.setZoomAndCenter(zoomindex,[pointer[0]*1, pointer[1]*1]);
            var circle = new AMap.Circle({
                map: map,
                center: [pointer[0]*1, pointer[1]*1],// 圆心位置
                radius: siteObj.range*1, //半径
                strokeColor: "#F33", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 2, //线粗细度
                fillColor: "#ee2200", //填充颜色
                fillOpacity: 0.35//填充透明度
            });

            $('.pointer').html(siteObj.site);
            $('.radius').html(siteObj.range*1);
            
            map.plugin(["AMap.CircleEditor"],function(){ 
                circleEditor = new AMap.CircleEditor(map,circle); 
                circleEditor.open(); 
                circleEditor.on('adjust', function(e) {
                    console.log(e.radius+'   ');
                    $('.radius').html(e.radius);
                });
                circleEditor.on('move', function(e) {
                    $('.pointer').text(e.lnglat);
                });
            });

        } else if (limit === 'time') {
            $('#addrpolicy').next().removeClass('txt');
            $('#addrpolicy').attr("checked",false);
            $('.time-item').css({'display':'block'});
            $('.addr-item').css({'display':'none'});
            document.getElementById('timepolicy').checked = true;
            $('#timepolicy').next().addClass('txt');

            timeObj = JSON.parse(time_limit);
            timeObj.repeat_type == 1 ? $(".everyweek").css({'display':'block'}) : 
            $(".everyweek").css({'display':'none'});
            $('select[name=repeat_type]').val(timeObj.repeat_type);
            $('select[name=weekday]').val(timeObj.weekday);
            $('input[name=stop_date]').val(timeObj.stop_date);
            $('input[name=start_date]').val(timeObj.start_date);
            $('input[name=stop_time]').val(timeObj.stop_time);
            $('input[name=start_time]').val(timeObj.start_time);

        } else {
            siteObj = JSON.parse(site_range);
            var pointer = siteObj.site.split(',');
            
            var map = mapObj.getInstance();
            var zoomindex = 12;
            if(siteObj.range*1 > 10000){
                zoomindex = 10;
            } else if(siteObj.range*1 < 1000 && siteObj.range*1 > 500){
                zoomindex = 14;
            } else if(siteObj.range*1 < 100 && siteObj.range*1 > 0){
                zoomindex = 17;
            } else if(siteObj.range*1 > 1000 && siteObj.range*1 < 10000) {
                zoomindex = 11;
            } else if(siteObj.range*1 < 500 && siteObj.range*1 > 100) {
                zoomindex = 15;
            } else {
                zoomindex = 10;
            }
            map.setZoomAndCenter(zoomindex,[pointer[0]*1, pointer[1]*1]);
            var circle = new AMap.Circle({
                map: map,
                center: [pointer[0]*1, pointer[1]*1],// 圆心位置
                radius: siteObj.range*1, //半径
                strokeColor: "#F33", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 2, //线粗细度
                fillColor: "#ee2200", //填充颜色
                fillOpacity: 0.35//填充透明度
            });

            $('.pointer').html(siteObj.site);
            $('.radius').html(siteObj.range*1);
            
            map.plugin(["AMap.CircleEditor"],function(){ 
                circleEditor = new AMap.CircleEditor(map,circle); 
                circleEditor.open(); 
                circleEditor.on('adjust', function(e) {
                    console.log(e.radius+'   ');
                    $('.radius').html(e.radius);
                });
                circleEditor.on('move', function(e) {
                    $('.pointer').text(e.lnglat);
                });
            });
            
            timeObj = JSON.parse(time_limit);
            timeObj.repeat_type == 1 ? $(".everyweek").css({'display':'block'}) : 
            $(".everyweek").css({'display':'none'});
            $('select[name=repeat_type]').val(timeObj.repeat_type);
            $('select[name=weekday]').val(timeObj.weekday);
            $('input[name=stop_date]').val(timeObj.stop_date);
            $('input[name=start_date]').val(timeObj.start_date);
            $('input[name=stop_time]').val(timeObj.stop_time);
            $('input[name=start_time]').val(timeObj.start_time);
        }

        for(var k in appObj) {
            $("#app_list").append("<li value="+appObj[k].package_name+" style='line-height:34px;'>"
            + appObj[k].app_name
            + "<a onclick='deleteapp(this)' style='line-height:34px;font-size:18px;margin-right:180px;float:right;'>"
            + "<i class='fa fa-minus-circle primary'></i></a>"
            + "</li>");
        }

    }
}

// 编辑提交
function mod_policy(){
    var whiteapp;
    var postData = {};
    var violation_limit = {};
    var black_id = [];
    var app_list = [];
    var i = 0;
    var tab = $('#app_list');
    var limit;
    var site_range = {};
    var time_limit = {};
    if($(".black_item").is(":visible")){
        violation_limit["camera"] = document.getElementById('camera').checked == true ? 1 : 0;
        violation_limit["access_secspace"] = document.getElementById('access_secspace').checked == true ? 1 : 0;
        violation_limit["enterprise_data"] = document.getElementById('enterprise_data').checked == true ? 1 : 0;
        violation_limit["all_data"] = document.getElementById('all_data').checked == true ? 1 : 0;
        violation_limit["sd"] = document.getElementById('sd').checked == true ? 1 : 0;
        violation_limit["message"] = document.getElementById('message').checked == true ? 1 : 0;
        violation_limit["phone"] = document.getElementById('phone').checked == true ? 1 : 0;
        var mesg = document.getElementById('mesg').checked;
        var email = document.getElementById('email').checked;
        if(mesg && email){
            violation_limit["alarm"] = 3;
        } else if(mesg == true){
            violation_limit["alarm"] = 1;
        } else if(email == true){
            violation_limit["alarm"] = 2;
        } else {
            violation_limit["alarm"] = 0;
        }
        var itemlist = $('.policy_add');
        itemlist.find(".black_item").each(function () {
            var itemval = $(this).find('select[name=blacklistname]').val()*1;
            black_id.push(itemval); 
        });
        postData = {
            id: $('input[name=policyid]').val()*1,
            name: $('input[name=name]').val(),
            delay: $('input[name=delay]').val(),
            violation_limit: JSON.stringify(violation_limit),
            black_id: JSON.stringify(black_id)
        };
        if (postData.name =='') {
            warningOpen('请输入名称！','danger','fa-bolt');
        } else if (postData.delay =='') {
            warningOpen('请输入延迟时间！','danger','fa-bolt');
        } else { 
            $.post('/man/apppolicy/mod_policy', postData, function(data) {
                if (data.rt == 0) {
                    policylist();
                    warningOpen('修改成功！','primary','fa-check');
                    getPolicyList(currentpage,10);
                } else if (data.rt == 5) {
                    toLoginPage();
                } else if (data.rt == 15) {
                    warningOpen('策略名称重复！','danger','fa-bolt');
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
            });
        }
    } else {

        whiteapp = 0;
        var timepolicy = document.getElementById('timepolicy').checked;
        var addrpolicy = document.getElementById('addrpolicy').checked;
        tab.find('li').each(function () {
            app_list[i] = $(this).attr('value');
            i = i+1;  
        }); 
       
        site_range = {
            site: $('.pointer').text(),
            range: $('.radius').text()
        }
        if($('select[name=repeat_type]').val() == 1){
            time_limit = {
                repeat_type: '1',
                start_date: $('input[name=start_date]').val(),
                stop_date: $('input[name=stop_date]').val(),
                start_time: $('input[name=start_time]').val(),
                stop_time: $('input[name=stop_time]').val(),
                weekday: $('select[name=weekday]').val()
            };
        } else {
            time_limit = {
                repeat_type: $('select[name=repeat_type]').val(),
                start_date: $('input[name=start_date]').val(),
                stop_date: $('input[name=stop_date]').val(),
                start_time: $('input[name=start_time]').val(),
                stop_time: $('input[name=stop_time]').val()
            };
        }

        if(timepolicy && addrpolicy){
            limit = 'both';
            postData = {
                id: $('input[name=policyid]').val()*1,
                name: $('input[name=name]').val(),
                whiteapp: whiteapp,
                limit: limit,
                site_range: JSON.stringify(site_range),
                time_limit: JSON.stringify(time_limit),
                app_list: JSON.stringify(app_list)
            };
        } else if(addrpolicy == true){
            limit = 'geo';
            postData = {
                id: $('input[name=policyid]').val()*1,
                name: $('input[name=name]').val(),
                whiteapp: whiteapp,
                limit: limit,
                site_range: JSON.stringify(site_range),
                app_list: JSON.stringify(app_list)
            };
        } else {
            limit = 'time';
            postData = {
                id: $('input[name=policyid]').val()*1,
                name: $('input[name=name]').val(),
                whiteapp: whiteapp,
                limit: limit,
                time_limit: JSON.stringify(time_limit),
                app_list: JSON.stringify(app_list)
            };
        }

        if (postData.name =='') {
            warningOpen('请输入名称！','danger','fa-bolt');
        } else { 
            $.post('/man/apppolicy/mod_policy', postData, function(data) {
                if (data.rt == 0) {
                    policylist();
                    warningOpen('修改成功！','primary','fa-check');
                    getPolicyList(currentpage,10);
                } else if (data.rt == 5) {
                    toLoginPage();
                } else if (data.rt == 15) {
                    warningOpen('策略名称重复！','danger','fa-bolt');
                } else if (data.rt == 39) {
                    warningOpen('策略开始时间大于截止时间！','danger','fa-bolt');
                }  else if (data.rt == 40) {
                    warningOpen('策略截止时间小于当前时间！','danger','fa-bolt');
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
            });
        }
    }
}

// 查看详细信息
function view(i){
    modify(i);
    $('.policylist,.modbtn, .addbtn, .modpolicy, .additem, .addappitem, #app_list a, .deleteicon').css({'display':'none'});
    $('.policy_add, .viewbtn').css({'display':'block'});
    $('.viewpolicy').css({'display':'inline-block'});
    $('.policy_add input').attr("disabled",true);
    $('.policy_add select').attr("disabled",true);
    $('.policy_add input[type=checkbox]').attr("disabled",true);
}

// 策略列表查看已下发用户
function devusers(i) {
    var tr = $('.policytable table tr').eq(i+1);
    var id = tr.find('td').eq(7).text()*1; 
    var policy_type = tr.find('td').eq(8).text(); 
    var strtab1 = '<table class="table table-hover"><tr>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
                + '<input type="checkbox" onclick="selectedAll(this)"></input>'
                + '<span class="text"></span></label></div></th>'
                + '<th>用户名</th>'
                + '<th>账号</th>'
                + '<th>状态</th>'
                + '<th>操作</th>'
                + '</tr>';
    var status;
    var userurl = '/man/apppolicy/getUserByPolicyId?id='+ id + '&policy_type='+policy_type;
    var cont = '';
    $.get(userurl, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.data) {
                status = data.data[i].status == 1 ? '已应用' : '已下发';
                strtab1 += '<tr>'
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)">'
                        + '</input><span class="text"></span></label></div></td>'
                        + '<td>' + data.data[i].name + '</td>'
                        + '<td>' + data.data[i].account + '</td>'
                        + '<td>' + status + '</td>'
                        + '<td style="display:none;">' + data.data[i].uid + '</td>'
                        + '<td>'           
                        + '<a href="javascript:user_remove('+ i +');">移出策略</a>' 
                        + '</td></tr>';              
            }
            strtab1 += '</table>';
            cont += '<div class="modal-header">'
                 + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                 + '<h4 class="modal-title">已应用/已下发</h4>'
                 + '</div>'
                 + '<div class="modal-body" style="max-height:340px;overflow-y:auto;">'
                 + '<input name="policyId" value="'+id+'" style="display:none;">'
                 + '<input name="policyType" value="'+policy_type+'" style="display:none;">'
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

// 移除策略
function user_remove(i){
    var _tr = $('.modal-body table tr').eq(i+1);
    var uid = _tr.find('td').eq(4).text()*1;
    var policy_id = $('.modal-body input[name=policyId]').val()*1;
    var policy_type = $('.modal-body input[name=policyType]').val();
    var postData = {
            uid: uid,
            policy_id: policy_id,
            policy_type: policy_type
        };
    $.post('/man/apppolicy/unbindPolicy', postData, function(data) {
        if (data.rt == 0) {
            _tr.css({'display':'none'});      
            warningOpen('操作成功！','primary','fa-check'); 
            refresh(); 
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    }); 
}
// 查看白名单策略里应用授权
function viewauth(){
    var list = [],i = 0;
    var policy_type;
    var tr;
    var postData = {};
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            list[i] = tr.find('td').eq(7).text()*1;
            i = i+1;
            policy_type = tr.find('td').eq(8).text();
        }     
    });  
    if(list.length === 1 && policy_type === 'whiteapp'){
        postData = {
            policy_id: list[0],
            policy_type: 'whiteapp'
        };
        $.post('/man/apppolicy/appAuthList', postData, function(data) {
            if (data.rt == 0) {
                var thlength = 0, x = 0;
                var st = '';
                var str = '<table class="table table-hover"><tr>';
                for(var n in data.policies[0]){
                    str += '<th>'+ data.policies[0][n][0] +'</th>';
                }
                thlength = data.policies[0].length;
                str += '</tr>';
                for(var k in data.policies) {
                     str += '<tr>';

                    for(var j in data.policies[k]){
                        if(data.policies[k][j][1] == 0 || data.policies[k][j][1] == 1){
                            st = data.policies[k][j][1] == 1 ? '已授权' : '未授权';
                        } else {
                            st = data.policies[k][j][1];
                        }
                        str += '<td>' + st + '</td>';
                    
                    } 
                    str += '</tr>';   
                }
                str += '</table>';
                var cont = '<div class="modal-header">'
                     + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                     + '<h4 class="modal-title">应用授权查看</h4>'
                     + '</div>'
                     + '<div class="modal-body">'
                     + '<div style="max-height:340px;max-width:470px;overflow-y:auto;">'
                     + str
                     + '</div>'
                     + '</div>'
                     + '<div class="modal-footer">'
                     + '<button type="button" class="btn btn-primary" onclick="alertOff()">确认</button>'
                     + '</div>';  
                alertOpen(cont);

            } else if(data.rt = 38) {
                warningOpen('策略未下发！','danger','fa-bolt');
            } else if (data.rt==5) {
                toLoginPage();           
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
        
    } else {
        warningOpen('请选择一条已下发的白名单策略查看！','danger','fa-bolt');
    } 
}
// 策略下发
function auth(){
    var list = [],i = 0;
    var status = 1;
    var policy_type;
    var tr;
    var tab1 = $('.usertable');
    var tab2 = $('.tagusertable');
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            list[i] = tr.find('td').eq(7).text()*1;
            i = i+1;
            policy_type = tr.find('td').eq(8).text();
            if(tr.find('td').eq(16).text() == 0){
                status = 0;
            }
        }     
    });  
    if(list.length === 1 && status === 1){
        $('.policylist').css({'display':'none'});
        $('.issuedlist').css({'display':'block'});
        $('.issuedpolicy').css({'display':'inline-block'});
        $('.tabbable').find('input[name=policy_id]').val(list[0]);
        $('.tabbable').find('input[name=ptype]').val(policy_type);
        getUserList(1,10,'',tab1,2,2); 
        getUserList(1,10,'',tab2,3,2);
        searchuserlist();
        searchtaglist();
    } else {
        warningOpen('请选择一条启用的非默认策略进行下发！','danger','fa-bolt');
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
// 策略下发获取用户组
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

var st = 2;
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

// 下发策略提交
function authbtn(){
    subbtn(1);
}

// 取消策略提交
function unauthbtn(){
    subbtn(0);
}

// 策略下发取消提交
function subbtn(state){

    var user_list = [], depart_id,
        tag_id, i = 0, tr;
    var policy_id = $('input[name=policy_id]').val()*1;
    var policy_type = $('input[name=ptype]').val();
   
    // 用户组app授权
    if($("#departs").hasClass('active')){ 
        var tab1 = $('.usertable');
        var tab2 = $('#treegroup');
        tab2.find('.treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                depart_id = $(this).find('input[name=tree_id]').val()*1;
            }     
        });
        if(tab1.find('th .checkbox span').hasClass('txt') && depart_id){
            console.log('下发到用户组！');
        } else {
            depart_id = 0;
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
        var tab4 = $('#usertaglist');
        tab4.find('.treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                tag_id = $(this).find('input[name=tree_id]').val()*1;
            }     
        });  
        if(tab3.find('th span').hasClass('txt') && tag_id){
            console.log('下发到标签！');
        } else {
            tag_id = 0;
            tab3.find('td span').each(function () { 
                if ($(this).hasClass('txt')) {
                    tr = $(this).parents("tr");
                    user_list[i] = tr.find('td').eq(4).text()*1;
                    i = i+1;
                }
            });
        }
    }

    if(user_list.length > 0 || depart_id || tag_id){
        if(user_list.length > 0){
            postData = {
                policy_id: policy_id,
                policy_type: policy_type,
                user_list: JSON.stringify(user_list)
            };
        } else if(depart_id){
            postData = {
                policy_id: policy_id,
                policy_type: policy_type,
                depart_id: depart_id
            };
        } else {
            postData = {
                policy_id: policy_id,
                policy_type: policy_type,
                tag_id: tag_id
            };
        }
        console.time('Timer3');
        $.post('/man/apppolicy/boundPolicy', postData, function(data) {
            if (data.rt == 0) {
                console.timeEnd('Timer3');
                warningOpen('操作成功！','primary','fa-check');        
            } else if (data.rt == 8) {
                warningOpen('所选用户组下没有用户无需下发策略！','primary','fa-check'); 
            } else if (data.rt == 40) {
                warningOpen('策略截止时间已过期下发失败！','danger','fa-bolt');
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    } else {
        warningOpen('请选择一条启用策略进行下发！','danger','fa-bolt');
    }
}

// 搜索下发用户
function searchauthlist(){
    var keyword = $('.widget-btn input[name=keyvalue]').val();
    var tab1 = $('.usertable');
    var tab2 = $('.tagusertable');
    getUserList(1,10,keyword,tab1,2,2); 
    getUserList(1,10,keyword,tab2,3,2); 
}

// 启用/禁用
function activate(status){
    var whitelist = [], blacklist = [], i = 0, j = 0;
    var tr;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if(tr.find('td').eq(8).text() === 'whiteapp'){
                whitelist[i] = tr.find('td').eq(7).text()*1;
                i = i+1;
            } else {
                blacklist[j] = tr.find('td').eq(7).text()*1;
                j = j+1;
            }          
        }     
    });  
    if(whitelist.length > 0){
        var postData = {
            status: status,
            whiteapp: 'whiteapp',
            ids: JSON.stringify(whitelist)
        };       
        $.post('/man/apppolicy/changePolicyStatus', postData, function(data) {
            if (data.rt == 0) {               
                getPolicyList(currentpage,10);  
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            }  else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
    if(blacklist.length > 0){
        var postData = {
            status: status,
            blackapp: 'blackapp',
            ids: JSON.stringify(blacklist)
        };       
        $.post('/man/apppolicy/changePolicyStatus', postData, function(data) {
            if (data.rt == 0) {               
                getPolicyList(currentpage,10);  
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            }  else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }        
}

// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getPolicyList(currentpage,10);
    $('.hrefactive').removeClass("hrefallowed");
}

// 删除提示
function deletes(){
    var i = 0, status = 0;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if(tr.find('td').eq(16).text() == 1){
                status = 1;
            }
            i = 1;
        }     
    });     
    var cont = '';
    if(i>0 && status === 0){
        cont += '<div class="modal-header">'
             +  ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             +  '<h4 class="modal-title">提示</h4>'
             +  '</div>'
             +  '<div class="modal-body">'
             +  '<p>确定删除？</p>'
             +  '</div>'
             +  '<div class="modal-footer">'
             +  '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             +  '<button type="button" class="btn btn-primary" onclick="policy_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else if(status === 1){
        warningOpen('请先禁用相关策略然后删除!','danger','fa-bolt');
    } else if(defaultpolicy === 1) {
        warningOpen('默认策略不能删除!','danger','fa-bolt');
    } else {
        
    }
}

// 删除
function policy_delete() {
    var whiteapp = [], blackapp = [],
            i = 0, j = 0;
    var tr;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if(tr.find('td').eq(8).text() === 'whiteapp'){
                whiteapp[i] = tr.find('td').eq(7).text()*1;
                i = i+1;
            } else {
                blackapp[j] = tr.find('td').eq(7).text()*1;
                j = j+1;
            }
            
        }     
    });  
    if(whiteapp.length > 0){
        var postData = {
            ids: JSON.stringify(whiteapp),
            policy_type: 'whiteapp'
        };       
        $.post('/man/apppolicy/del_policy', postData, function(data) {
            if (data.rt == 0) {
                alertOff();  
                getPolicyList(currentpage,10);
                warningOpen('操作成功！','primary','fa-check');            
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
    if(blackapp.length > 0){
        var postData = {
            ids: JSON.stringify(blackapp),
            policy_type: 'blackapp'
        };       
        $.post('/man/apppolicy/del_policy', postData, function(data) {
            if (data.rt == 0) {
                alertOff();  
                getPolicyList(currentpage,10);
                warningOpen('操作成功！','primary','fa-check');           
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    } 
}
