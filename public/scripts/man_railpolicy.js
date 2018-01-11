/*
 * ==================================================================
 *                          围栏策略 railpolicy
 * ==================================================================
 */

$(function() {
    $('.policymenu').addClass('open active');
    $('.policymenu').find('li').eq(2).addClass('active');

    // 围栏策略列表
    getPolicyList(1,10); 
});

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
    $('.policylist, .modbtn, .viewbtn, .timepolicy').css({'display':'none'});
    $('.policy_add,.addbtn, .everyweek, .addresspolicy').css({'display':'block'});
    $('.addpolicy').css({'display':'inline-block'});
    $('select[name=policy_type]').val(1);
    $('select[name=repeat_type]').val(1);
    var str = '';
    if($('select[name=in_fence] li').length < 1){
        $.get('/man/policy/getUsedDevPolicy', function(data) {  // 获取已经启用策略列表
            data = JSON.parse(data);
            if (data.rt == 0) {
                var select = $('select[name=in_fence]');
                for(var i in data.policies) {
                    str += '<option class="option" value="'+data.policies[i].id+'">'
                        + data.policies[i].name
                        + '</option>';
                }
                
                $('select[name=in_fence]').html(str);
                $('select[name=out_fence]').html(str);
            } else {
                warningOpen('获取已启用策略失败！','danger','fa-bolt');
            }
        });
    }
    mapObj.getInstance();
    $('.pointer').html('');
    $('.radius').html('');
}

function reset(){
    $('.policy_add input').val('');
    $('.policy_add select').val('');
    $('.policy_add input').attr("disabled",false);
    $('.policy_add select').attr("disabled",false);
}

// 提交添加策略

//
function getPolicyData(){
    var postData = {};
    var policy_type=$('select[name=policy_type]').val();
    /*根据选择的围栏类型配置请求数据postData*/
    switch (policy_type){
        case '1':   //地理围栏
            policy_type="geofence";
            var site_range = {
                site: $('.pointer').text(),
                range: $('.radius').text()
            };
            var ssid=$('input[name=ssid]').val().replace(/\s+/g,' '); //替换多空格为单空格
            if(ssid.charAt(ssid.length-1)===' '){
                console.log('后面有空格')
                ssid = ssid.substr(0,ssid.length-1)
            }
            if(ssid.charAt(0)===' '){
                console.log('前面有空格')
                ssid = ssid.substr(1)
            }
            var wifi_limit={
                open:$('input[name=wifi]')[0].checked?1:0,
                ssid:ssid.split(' ')
            }
            postData = {
                name: $('input[name=name]').val(),
                policy_type:policy_type,
                site_range: JSON.stringify(site_range),
                gps:$('input[name=gps]')[0].checked?1:0,
                wifi_limit:JSON.stringify(wifi_limit),
                in_fence: $('select[name=in_fence]').val(),
                out_fence: $('select[name=out_fence]').val()
            };
            break;
        case '2':   //时间围栏
            policy_type="timefence";
            var time_limit = {
                repeat_type: $('select[name=repeat_type]').val(),
                start_date: $('input[name=start_date]').val(),
                stop_date: $('input[name=stop_date]').val(),
                start_time: $('input[name=start_time]').val(),
                stop_time: $('input[name=stop_time]').val(),
            };
            if($('select[name=repeat_type]').val() == '1'){
                time_limit.weekday=$('select[name=weekday]').val();
            }
            postData = {
                name: $('input[name=name]').val(),
                policy_type:policy_type,
                time_limit: JSON.stringify(time_limit),
                in_fence: $('select[name=in_fence]').val(),
                out_fence: $('select[name=out_fence]').val()
            };
            break;
        default:
            alert('man_railpolicay.js围栏类型policy_type设置错误')
    }
    return postData;
}
function add_policy(){
    var postData=getPolicyData();
    console.log(postData.policy_type+'围栏请求数据：')
    console.log(postData);
    $.post('/man/railpolicy/add_policy', postData, function(data) {
        console.log(policy_type+'围栏返回数据：')
        console.log(data)
        if (data.rt==0) {
            policylist();
            warningOpen('操作成功！','primary','fa-check');
            getPolicyList(currentpage,10);
        } else if (data.rt == 39) {
            warningOpen('策略开始时间大于截止时间！','danger','fa-bolt');
        } else if (data.rt == 40) {
            warningOpen('策略截止时间小于当前时间！','danger','fa-bolt');
        } else if (data.rt==5) {
            toLoginPage();
        } else if (data.rt==15) {
            warningOpen('策略名称重复！','danger','fa-bolt');
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
}
// 编辑提交
function mod_policy(){
    var postData=getPolicyData();
    postData.id=$('input[name=policyid]').val();
    $.post('/man/railpolicy/mod_policy', postData, function(data) {
        if (data.rt==0) {
            policylist();
            warningOpen('修改并下发成功！','primary','fa-check');
            getPolicyList(currentpage,10);
        } else if (data.rt == 39) {
            warningOpen('策略开始时间大于截止时间！','danger','fa-bolt');
        } else if (data.rt == 40) {
            warningOpen('策略截止时间小于当前时间！','danger','fa-bolt');
        } else if (data.rt==5) {
            toLoginPage();
        } else if (data.rt==15) {
            warningOpen('策略名称重复！','danger','fa-bolt');
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
}
var st = 2;
// 设备策略列表
function getPolicyList(start,length){
    var status;
    var policy_type;
    var table = $('.policytable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox">'
            + '<label><input type="checkbox" onclick="selectedAll(this)"/>'
            + '<span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>类型</th>'
            + '<th>状态</th>'
            + '<th>创建者</th>'
            + '<th>已应用/已下发</th>'
            + '<th>更新时间</th>'
            + '<th>操作</th></tr>';

    var url = '/man/railpolicy/getRailpolicyList?start_page='+ start + '&page_length='+ length;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.policies) {
                status = data.policies[i].status == 1 ? '启用' : '禁用';
                policy_type = data.policies[i].policy_type == 'timefence' ? '时间围栏' : '地理围栏';
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"/>'
                    + '<span class="text"></span></label></div></td>'
                    + '<td>' + data.policies[i].name + '</td>'
                    + '<td>' + policy_type + '</td>'
                    + '<td>' + status + '</td>'
                    + '<td>' + data.policies[i].creator + '</td>'  
                    + '<td>' 
                    + '<a href="javascript:devusers('+ i +');">' + data.policies[i].used + ' / ' + data.policies[i].issued +'</a>'
                    + '</td>'  
                    + '<td>' + data.policies[i].update_time + '</td>'
                    + '<td style="display:none;">' + data.policies[i].id + '</td>' 
                    + '<td style="display:none;">' + data.policies[i].in_fence + '</td>' 
                    + '<td style="display:none;">' + data.policies[i].out_fence + '</td>' 
                    + '<td style="display:none;">' + data.policies[i].policy_type + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].site_range) + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].time_limit) + '</td>' 
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
function NEWgetPolicyList(start,length){
    var status;
    var policy_type;
    var table = $('.policytable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox">'
            + '<label><input type="checkbox" onclick="selectedAll(this)"/>'
            + '<span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>类型</th>'
            + '<th>状态</th>'
            + '<th>创建者</th>'
            + '<th>已应用/已下发</th>'
            + '<th>更新时间</th>'
            + '<th>操作</th></tr>';

    var url = '/man/railpolicy/getRailpolicyList?start_page='+ start + '&page_length='+ length;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.policies) {
                status = data.policies[i].status == 1 ? '启用' : '禁用';
                policy_type = data.policies[i].policy_type == 'timefence' ? '时间围栏' : '地理围栏';
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"/>'
                    + '<span class="text"></span></label></div></td>'
                    + '<td>' + data.policies[i].name + '</td>'
                    + '<td>' + policy_type + '</td>'
                    + '<td>' + status + '</td>'
                    + '<td>' + data.policies[i].creator + '</td>'
                    + '<td>'
                    + '<a href="javascript:devusers('+ i +');">' + data.policies[i].used + ' / ' + data.policies[i].issued +'</a>'
                    + '</td>'
                    + '<td>' + data.policies[i].update_time + '</td>'
                    + '<td style="display:none;">' + data.policies[i].id + '</td>'
                    + '<td style="display:none;">' + data.policies[i].in_fence + '</td>'
                    + '<td style="display:none;">' + data.policies[i].out_fence + '</td>'
                    + '<td style="display:none;">' + data.policies[i].policy_type + '</td>'
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].site_range) + '</td>'
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].time_limit) + '</td>'
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
}
// 策略列表查看已下发用户
function devusers(i) {
    var tr = $('.policytable table tr').eq(i+1);
    var id = tr.find('td').eq(7).text()*1; 
    var policy_type = tr.find('td').eq(10).text();
    var strtab1 = '<table class="table table-hover"><tr>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
                + '<input type="checkbox" onclick="selectedAll(this)"/>'
                + '<span class="text"></span></label></div></th>'
                + '<th>用户名</th>'
                + '<th>账号</th>'
                + '<th>状态</th>'
                + '<th>操作</th>'
                + '</tr>';
    var status;
    var userurl = '/man/railpolicy/getUserByFencePolicyId?id='+ id+ '&policy_type='+ policy_type;
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
                        + '<td style="display:none;">' + policy_type + '</td>'
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
                 + strtab1
                 + '</div>'
                 + '<div class="modal-footer">'
                 + '<button type="button" class="btn btn-primary" onclick="alertOff()">确认</button>'
                 + '</div>';  
            alertOpen(cont);
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });
}
// 移除策略
function user_remove(i){
    var _tr = $('.modal-body table tr').eq(i+1);
    var uid = _tr.find('td').eq(4).text()*1;
    var policy_id = $('.modal-body input[name=policyId]').val()*1;
    var policy_type = _tr.find('td').eq(5).text();
    var postData = {
            uid: uid,
            policy_id: policy_id,
            policy_type: policy_type
        };
    $.post('/man/railpolicy/unbindPolicy', postData, function(data) {
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
// 编辑
function modify(i){
    var tr = $('.policytable table tr').eq(i+1);
    console.log(tr)
    var id = tr.find('td').eq(7).text();
    var name = tr.find('td').eq(1).text(); 
    var policy_type = tr.find('td').eq(10).text(); 
    var in_fence = tr.find('td').eq(8).text()*1; 
    var out_fence = tr.find('td').eq(9).text()*1; 
    var time_limit = tr.find('td').eq(12).text();
    var timeObj;
    var site_range = tr.find('td').eq(11).text();        
    var siteObj;
    $('.policylist, .addbtn, .viewbtn').css({'display':'none'});
    $('.policy_add, .modbtn').css({'display':'block'});
    $('.modpolicy').css({'display':'inline-block'});
    $('input[name=policyid]').val(id);
    $('input[name=name]').val(name);
    $('.policy_add select[name=policy_type]').attr("disabled",true);
   
    var str = '';
    if($('select[name=in_fence] li').length < 1){
        $.get('/man/policy/getUsedDevPolicy', function(data) {  // 获取已经启用策略列表
            data = JSON.parse(data);
            if (data.rt == 0) {
                var select = $('select[name=in_fence]');
                for(var i in data.policies) {
                    str += '<option class="option" value="'+data.policies[i].id+'">'
                        + data.policies[i].name
                        + '</option>';
                }
                $('select[name=in_fence]').html(str);
                $('select[name=out_fence]').html(str);
                $('select[name=in_fence]').val(in_fence);
                $('select[name=out_fence]').val(out_fence);
            } else {
                warningOpen('获取已启用策略失败！','danger','fa-bolt');
            }
        });
    } else {
        $('select[name=in_fence]').val(in_fence);
        $('select[name=out_fence]').val(out_fence);
    }
    
    if(policy_type === 'timefence'){
        $(".addresspolicy").css({'display':'none'});
        $(".timepolicy").css({'display':'block'});
        $('select[name=policy_type]').val(2);
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

        $(".timepolicy").css({'display':'none'});
        $(".addresspolicy").css({'display':'block'});
        $('select[name=policy_type]').val(1);
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
    } 
}

function view(i){
    modify(i);
    $('.policylist,.modbtn, .addbtn, .addpolicy,.modpolicy').css({'display':'none'});
    $('.policy_add, .viewbtn').css({'display':'block'});
    $('.viewpolicy').css({'display':'inline-block'});
    $('.policy_add input').attr("disabled",true);
    $('.policy_add select').attr("disabled",true);
}
// 策略下发
function auth(){
    var list = [],i = 0;
    var status = 1;
    var tr;
    var policy_type;
    var tab1 = $('.usertable');
    var tab2 = $('.tagusertable');
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            list[i] = tr.find('td').eq(7).text()*1;
            policy_type = tr.find('td').eq(10).text();
            i = i+1;
            if(tr.find('td').eq(13).text() == 0){
                status = 0;
            }
        }     
    });  
    if(list.length === 1 && status === 1){
        $('.policylist').css({'display':'none'});
        $('.issuedlist').css({'display':'block'});
        $('.issuedpolicy').css({'display':'inline-block'});
        $('.tabbable').find('input[name=policy_id]').val(list[0]);
        $('.tabbable').find('input[name=policy_type]').val(policy_type);
        getUserList(1,10,'',tab1,2,2); 
        getUserList(1,10,'',tab2,3,2);
        searchuserlist();
        searchtaglist();
    } else {
        warningOpen('请选择一条启用的策略进行下发！','danger','fa-bolt');
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
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label style="width: 100px">'
                + '<input type="checkbox" onclick="selectedAll(this)" checked="checked" />'
                + '<span class="text txt">全选</span>'
                + '</label></div></th>'
                + '<th>用户名</th>'
                + '<th>账号</th>'
                + '<th>状态</th></tr>';
    var depId;
    var userurl;   
    var status;
    var id;
    var checkstr = '<input type="checkbox" onclick="selected(this)" checked="checked"/><span class="text txt"></span>';
    if(st == 2){
        userurl = '/man/user/getUserList?start='+ start + '&length='+ length;
        userurl += keyword?'&keyword=' + keyword : '';
        checkstr = '<input type="checkbox" onclick="selected(this)"/><span class="text"></span>';
        strtab1 = '<table class="table table-striped table-bordered table-hover"><tr>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
                + '<input type="checkbox" onclick="selectedAll(this)"/>'
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
    var policy_type = $('input[name=policy_type]').val();
   
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

            console.log('下发到标签!');
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
        $.post('/man/railpolicy/boundPolicy', postData, function(data) {
            if (data.rt == 0) {
                warningOpen('操作成功！','primary','fa-check');        
            } else if (data.rt == 40) {
                warningOpen('策略截止时间小于当前时间！','danger','fa-bolt');
            } else if (data.rt == 8) {
                warningOpen('所选用户组下没有用户无需下发策略！','primary','fa-check'); 
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
    var geoids = [], timeids = [],
            i = 0, j = 0, st = 0;
    var tr;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if(tr.find('td').eq(10).text() === 'geofence'){
                geoids[i] = tr.find('td').eq(7).text()*1;
                i = i+1;
            } else {
                timeids[j] = tr.find('td').eq(7).text()*1;
                j = j+1;
            }
            
        }     
    });  
    if(geoids.length > 0){
        var postData = {
            status: status,
            geoids: JSON.stringify(geoids)
        };       
        $.post('/man/railpolicy/changePolicyStatus', postData, function(data) {
            if (data.rt == 0) {
                alertOff();  
                st = st + 1;
                getPolicyList(currentpage,10);
                warningOpen('操作成功！','primary','fa-check');            
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
    if(timeids.length > 0){
        var postData = {
            status: status,
            timeids: JSON.stringify(timeids)
        }; 
        if(geoids.length > 0){
            setTimeout(function(){
                $.post('/man/railpolicy/changePolicyStatus', postData, function(data) {
                    if (data.rt == 0) {
                        alertOff();  
                        st = st + 1; 
                        getPolicyList(currentpage,10);
                        warningOpen('操作成功！','primary','fa-check');           
                    } else if (data.rt==5) {
                        toLoginPage();
                    } else {
                        warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                    }
                }); 
            },100)
        }else{
            $.post('/man/railpolicy/changePolicyStatus', postData, function(data) {
                if (data.rt == 0) {
                    alertOff();  
                    st = st + 1; 
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
}

// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getPolicyList(currentpage,10);
}

// 删除提示
function deletes(){
    var i = 0, status = 0;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if(tr.find('td').eq(13).text() == 1){
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
    } else {
        
    }
}

// 删除
function policy_delete() {
    var geoids = [], timeids = [],
            i = 0, j = 0, st = 0;
    var tr;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if(tr.find('td').eq(10).text() === 'geofence'){
                geoids[i] = tr.find('td').eq(7).text()*1;
                i = i+1;
            } else {
                timeids[j] = tr.find('td').eq(7).text()*1;
                j = j+1;
            }
            
        }     
    });  
    if(geoids.length > 0){
        var postData = {
            geoids: JSON.stringify(geoids)
        };       
        $.post('/man/railpolicy/del_policy', postData, function(data) {
            if (data.rt == 0) {
                alertOff();  
                st = st + 1;
                getPolicyList(currentpage,10);
                warningOpen('操作成功！','primary','fa-check');            
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
    if(timeids.length > 0){
        var postData = {
            timeids: JSON.stringify(timeids)
        };       
        $.post('/man/railpolicy/del_policy', postData, function(data) {
            if (data.rt == 0) {
                alertOff();  
                st = st + 1; 
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
