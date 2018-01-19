/*
 * ==================================================================
 *                          围栏策略 railpolicy
 * ==================================================================
 */

$(function () {
    $('.policymenu').addClass('open active');
    $('.policymenu').find('li').eq(2).addClass('active');
    // 围栏策略列表
    getPolicyList(1, 10);
});
var railPolicies = {};
var mapObj = {};
//创建高德地图对象


function mapAdjust(map, circle, delay) {
    //基于圆形围栏调整地图缩放比及中心坐标
    setTimeout(function () {
        var r = circle.getRadius();
        if (r < 5) {
            r = 5;
            circle.setRadius(r);
        } else if (r > 50000) {
            r = 50000;
            circle.setRadius(r);
        }
        var cirCenter=circle.getCenter();
        map.setZoomAndCenter(zoom(r), [cirCenter.lng,cirCenter.lat]);
    }, delay)
    function zoom(r) {   //根据圆形围栏半径获取合适的缩放比zoom
        r=1*r;
        var z,
            s = 35; //控制自动调整边界
        z = 18 - Math.floor(Math.log((r >= s ? r : s) / s) / Math.log(2));
        return z;
    }
}
function mapInit() {

    var initSite = [116.397428,39.90923],// 圆心位置(天安门)
        initRadius = 300,
        map = new AMap.Map("address", {
            resizeEnable: true,
        }),
        circle = new AMap.Circle({
            map: map,
            center: initSite,
            radius: initRadius, //半径
            strokeColor: "#F00", //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 1, //线粗细度
            fillColor: "#F00", //填充颜色
            fillOpacity: 0.15//填充透明度
        });
    map.plugin(["AMap.CircleEditor"], function () {
        var timer
        circleEditor = new AMap.CircleEditor(map, circle);
        circleEditor.open();
        circleEditor.on('adjust', function (e) {
            clearTimeout(timer);
            $('.radius').html(circle.getRadius());
            timer = setTimeout(function () {
                mapAdjust(map, circle, 50)
            }, 500)
        });
        circleEditor.on('move', function (e) {
            clearTimeout(timer);
            $('.pointer').text(e.lnglat.lng+','+e.lnglat.lat);
            timer = setTimeout(function () {
                mapAdjust(map, circle, 50)
            }, 500)
        });
    });
    if(arguments[0]){
        var initPolicy=arguments[0];
        initSite=initPolicy.site_range.site.split(',');
        initRadius= parseInt(initPolicy.site_range.range);
        init();
    }else{
        geoLocate();
    }
    function geoLocate(){
        map.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位,默认:true
                timeout: 10000,          //超过10秒后停止定位,默认：无穷大
                buttonOffset: new AMap.Pixel(20, 20),//定位按钮与设置的停靠位置的偏移量,默认：Pixel(10, 20)
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见,默认：false
                buttonPosition: 'LB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
            //解析定位结果
            function onComplete(data) {
                initSite = [data.position.getLng(),data.position.getLat()]
                init();
            }
            //解析定位错误信息
            function onError(data) {
                init();
                console.warn("浏览器定位失败,采用默认位置");
            }
        });
    }
    map.plugin(["AMap.ToolBar"], function () {
        ToolBar = new AMap.ToolBar()
        map.addControl(ToolBar);
        ToolBar.hideLocation();
    });

    map.plugin(["AMap.PlaceSearch"], function () {
        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            pageSize: 1,
            pageIndex: 1,
            city: 010,
            map: map
        });
        map.plugin(["AMap.Autocomplete"], function () {
            var auto = new AMap.Autocomplete({
                input: "inputSearch",
                map: map
            })
            //构造地点查询类
            AMap.event.addListener(auto, "select", select);//注册监听,当选中某条记录时会触发
            function select(e) {
                placeSearch.setCity(e.poi.adcode);
                placeSearch.search(e.poi.name);  //关键字查询查询
            }
        });
        $("#inputSearch").keyup(function (e) {
            if (e.keyCode == 13) {
                placeSearch.search($(this).val())
            }
        });
        $("#btnSearch").click(function () {
            placeSearch.search($("#inputSearch").val())
            $("#inputSearch").val("");
        });
        $("#btnReset").click(function () {
            init();
        });
    });
    map.on('click', function (e) {
        var lng = e.lnglat.getLng(),
            lat = e.lnglat.getLat();
        circle.setCenter([lng, lat])
        mapAdjust(this, circle, 0);
        $('.pointer').html(lng + ',' + lat);
    });
    function init(){   //基于initSite,initRadius重置地图
        try{
            circle.setCenter(initSite);
            circle.setRadius(initRadius);
            $('.pointer').html(initSite.join(','));
            $('.radius').html(initRadius);
            mapAdjust(map,circle,100);
        }catch(err){
            console.error('地图还原init()失败：');
            console.error(err);
        }
    }
    return {
        map: map,
        circle: circle,
        reset:reset
    };
};
function mapResize(ele) {
    var i = $(ele).find('i')
    var iclass = i.attr('class');
    if (iclass === 'icon glyphicon glyphicon-fullscreen') {
        i.attr('class', 'icon glyphicon glyphicon-resize-small');
        i.attr('title', '小图');
        $('#mapwrap').removeClass('col-lg-8 col-xs-10 col-sm-10 col-lg-offset-2 col-xs-offset-1 col-sm-offset-1');
        $('#mapwrap').addClass('col-lg-12 col-xs-12 col-sm-12 maxmap');
        $('html,body').animate({
            scrollTop: $(ele).offset().top - 80
        }, 300);
    } else if (iclass === 'icon glyphicon glyphicon-resize-small') {
        i.attr('class', 'icon glyphicon glyphicon-fullscreen');
        i.attr('title', '大图');
        $('#mapwrap').removeClass('col-lg-12 col-xs-12 col-sm-12 maxmap');
        $('#mapwrap').addClass('col-lg-8 col-xs-10 col-sm-10 col-lg-offset-2 col-xs-offset-1 col-sm-offset-1');
        $('html,body').animate({
            scrollTop: $(ele).offset().top - 136
        }, 300);
    } else {
        console.warn("地图窗口最大最小化函数mapResize()有误")
    }

    mapAdjust(mapObj.map, mapObj.circle, 0);
}
// 添加
function add() {
    reset();
    $('.policylist, .modbtn, .viewbtn, .timepolicy').css({'display': 'none'});
    $('.policy_add,.addbtn, .everyweek, .addresspolicy').css({'display': 'block'});
    $('.addpolicy').css({'display': 'inline-block'});
    $('select[name=policy_type]').val(1);
    $('select[name=repeat_type]').val(1);
    var str = '';
    if ($('select[name=in_fence] li').length < 1) {
        $.get('/man/policy/getUsedDevPolicy', function (data) {  // 获取已经启用策略列表
            data = JSON.parse(data);
            if (data.rt == 0) {
                var select = $('select[name=in_fence]');
                for (var i in data.policies) {
                    str += '<option class="option" value="' + data.policies[i].id + '">'
                        + data.policies[i].name
                        + '</option>';
                }

                $('select[name=in_fence]').html(str);
                $('select[name=out_fence]').html(str);
            } else {
                warningOpen('获取已启用策略失败！', 'danger', 'fa-bolt');
            }
        });
    }
    mapInit();
    $('.pointer').html('');
    $('.radius').html('');
}

function reset() {
    $('.policy_add input').val('');
    $('.policy_add select').val('');
    $('.policy_add input').attr("disabled", false);
    $('.policy_add select').attr("disabled", false);
}

// 提交添加策略

//
function getPolicyData() {
    var postData = {};
    var policy_type = $('select[name=policy_type]').val();
    /*根据选择的围栏类型配置请求数据postData*/
    switch (policy_type) {
        case '1':   //地理围栏
            policy_type = "geofence";
            var site_range = {
                site: $('.pointer').text(),
                range: $('.radius').text()
            };
            var ssid = $('input[name=ssid]').val().replace(/\s+/g, ' '); //替换多空格为单空格
            if (ssid.charAt(ssid.length - 1) === ' ') {
                ssid = ssid.substr(0, ssid.length - 1)
            }
            if (ssid.charAt(0) === ' ') {
                ssid = ssid.substr(1)
            }
            var wifi_limit = {
                open: $('input[name=wifi]')[0].checked ? 1 : 0,
                ssid: ssid.split(' ')
            }
            postData = {
                name: $('input[name=name]').val(),
                policy_type: policy_type,
                site_range: JSON.stringify(site_range),
                gps: $('input[name=gps]')[0].checked ? 1 : 0,
                wifi_limit: JSON.stringify(wifi_limit),
                in_fence: $('select[name=in_fence]').val(),
                out_fence: $('select[name=out_fence]').val()
            };
            break;
        case '2':   //时间围栏
            policy_type = "timefence";
            var time_limit = {
                repeat_type: $('select[name=repeat_type]').val(),
                start_date: $('input[name=start_date]').val(),
                stop_date: $('input[name=stop_date]').val(),
                start_time: $('input[name=start_time]').val(),
                stop_time: $('input[name=stop_time]').val(),
            };
            if ($('select[name=repeat_type]').val() == '1') {
                time_limit.weekday = $('select[name=weekday]').val();
            }
            postData = {
                name: $('input[name=name]').val(),
                policy_type: policy_type,
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
function add_policy() {
    var postData = getPolicyData();
    $.post('/man/railpolicy/add_policy', postData, function (data) {
        if (data.rt == 0) {
            policylist();
            warningOpen('操作成功！', 'primary', 'fa-check');
            getPolicyList(currentpage, 10);
        } else if (data.rt == 39) {
            warningOpen('策略开始时间大于截止时间！', 'danger', 'fa-bolt');
        } else if (data.rt == 40) {
            warningOpen('策略截止时间小于当前时间！', 'danger', 'fa-bolt');
        } else if (data.rt == 5) {
            toLoginPage();
        } else if (data.rt == 15) {
            warningOpen('策略名称重复！', 'danger', 'fa-bolt');
        } else {
            warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
        }
    });
}
// 编辑提交
function mod_policy() {
    var postData = getPolicyData();
    postData.id = $('input[name=policyid]').val();
    $.post('/man/railpolicy/mod_policy', postData, function (data) {
        if (data.rt == 0) {
            policylist();
            warningOpen('修改并下发成功！', 'primary', 'fa-check');
            getPolicyList(currentpage, 10);
        } else if (data.rt == 39) {
            warningOpen('策略开始时间大于截止时间！', 'danger', 'fa-bolt');
        } else if (data.rt == 40) {
            warningOpen('策略截止时间小于当前时间！', 'danger', 'fa-bolt');
        } else if (data.rt == 5) {
            toLoginPage();
        } else if (data.rt == 15) {
            warningOpen('策略名称重复！', 'danger', 'fa-bolt');
        } else {
            warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
        }
    });
}
var st = 2;
// 设备策略列表
function getPolicyList(start, length) {
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

    var url = '/man/railpolicy/getRailpolicyList?start_page=' + start + '&page_length=' + length;
    $.get(url, function (data) {
        data = JSON.parse(data);
        if (data.rt == 0) {
            railPolicies = data.policies;
            for (var i in railPolicies) {
                status = railPolicies[i].status == 1 ? '启用' : '禁用';
                policy_type = railPolicies[i].policy_type == 'timefence' ? '时间围栏' : '地理围栏';
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"/>'
                    + '<span class="text"></span></label></div></td>'
                    + '<td>' + railPolicies[i].name + '</td>'
                    + '<td>' + policy_type + '</td>'
                    + '<td>' + status + '</td>'
                    + '<td>' + railPolicies[i].creator + '</td>'
                    + '<td>'
                    + '<a href="javascript:devusers(' + i + ');">' + railPolicies[i].used + ' / ' + railPolicies[i].issued + '</a>'
                    + '</td>'
                    + '<td>' + railPolicies[i].update_time + '</td>'
                    + '<td style="display:none;">' + railPolicies[i].id + '</td>'
                    + '<td style="display:none;">' + railPolicies[i].in_fence + '</td>'
                    + '<td style="display:none;">' + railPolicies[i].out_fence + '</td>'
                    + '<td style="display:none;">' + railPolicies[i].policy_type + '</td>'
                    + '<td style="display:none;">' + JSON.stringify(railPolicies[i].site_range) + '</td>'
                    + '<td style="display:none;">' + JSON.stringify(railPolicies[i].time_limit) + '</td>'
                    + '<td style="display:none;">' + railPolicies[i].status + '</td>'
                    + '<td>'
                    + '<a href="javascript:modify(' + i + ');">编辑</a>&nbsp;&nbsp;'
                    + '<a href="javascript:view(' + i + ');">详情</a>'
                    + '</td></tr>';
            }
            str += '</table>';
            table.html(str);

            createFooter(start, length, data.total_count, 1);
        } else if (data.rt == 5) {
            toLoginPage();
        }
    });
    $('.hrefactive').removeClass("hrefallowed");
    currentpage = start;
}
// page页查询
function search(p, i) {
    if (i == 1) {
        getPolicyList(p, 10);
    } else if (i == 2) {
        var tab1 = $('.usertable');
        var tab2 = $('.tagusertable');
        var keyword = $('.widget-btn input[name=keyvalue]').val();
        getUserList(p, 10, keyword, tab1, 2, 2);
        getUserList(p, 10, keyword, tab2, 3, 2);
    } else {
        console.error("注意search(p,i)的i取值");
    }
}
// 返回列表
function policylist() {
    $('.policy_add, .addpolicy, .modpolicy, .viewpolicy, .issuedlist, .issuedpolicy').css({'display': 'none'});
    $('.policylist').css({'display': 'block'});
    reset();
}
// 策略列表查看已下发用户
function devusers(i) {
    var tr = $('.policytable table tr').eq(i + 1);
    var id = tr.find('td').eq(7).text() * 1;
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
    var userurl = '/man/railpolicy/getUserByFencePolicyId?id=' + id + '&policy_type=' + policy_type;
    var cont = '';
    $.get(userurl, function (data) {
        data = JSON.parse(data);
        if (data.rt == 0) {
            for (var i in data.data) {
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
                    + '<a href="javascript:user_remove(' + i + ');">移出策略</a>'
                    + '</td></tr>';
            }
            strtab1 += '</table>';
            cont += '<div class="modal-header">'
                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                + '<h4 class="modal-title">已应用/已下发</h4>'
                + '</div>'
                + '<div class="modal-body" style="max-height:340px;overflow-y:auto;">'
                + '<input name="policyId" value="' + id + '" style="display:none;">'
                + strtab1
                + '</div>'
                + '<div class="modal-footer">'
                + '<button type="button" class="btn btn-primary" onclick="alertOff()">确认</button>'
                + '</div>';
            alertOpen(cont);
        } else if (data.rt == 5) {
            toLoginPage();
        }
    });
}
// 移除策略
function user_remove(i) {
    var _tr = $('.modal-body table tr').eq(i + 1);
    var uid = _tr.find('td').eq(4).text() * 1;
    var policy_id = $('.modal-body input[name=policyId]').val() * 1;
    var policy_type = _tr.find('td').eq(5).text();
    var postData = {
        uid: uid,
        policy_id: policy_id,
        policy_type: policy_type
    };
    $.post('/man/railpolicy/unbindPolicy', postData, function (data) {
        if (data.rt == 0) {
            _tr.css({'display': 'none'});
            warningOpen('操作成功！', 'primary', 'fa-check');
            refresh();
        } else if (data.rt == 5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
        }
    });
}
// 编辑
function modify(i) {
    var railPolicyMod = railPolicies[i];
    $('.policylist, .addbtn, .viewbtn').css({'display': 'none'});
    $('.policy_add, .modbtn').css({'display': 'block'});
    $('.modpolicy').css({'display': 'inline-block'});
    $('input[name=policyid]').val(railPolicyMod.id);
    $('input[name=name]').val(railPolicyMod.name);
    $('.policy_add select[name=policy_type]').attr("disabled", true);
    $('input[name=name]').val(railPolicyMod.name);
    var str = '';
    if ($('select[name=in_fence] li').length < 1) {
        $.get('/man/policy/getUsedDevPolicy', function (data) {  // 获取已经启用策略列表
            data = JSON.parse(data);
            if (data.rt == 0) {
                var select = $('select[name=in_fence]');
                for (var i in data.policies) {
                    str += '<option class="option" value="' + data.policies[i].id + '">'
                        + data.policies[i].name
                        + '</option>';
                }
                $('select[name=in_fence]').html(str);
                $('select[name=out_fence]').html(str);
                $('select[name=in_fence]').val(railPolicyMod.in_fence);
                $('select[name=out_fence]').val(railPolicyMod.out_fence);
            } else {
                warningOpen('获取已启用策略失败！', 'danger', 'fa-bolt');
            }
        });
    } else {
        $('select[name=in_fence]').val(railPolicyMod.in_fence);
        $('select[name=out_fence]').val(railPolicyMod.out_fence);
    }
    if (railPolicyMod.policy_type === 'timefence') {
        var timeObj = railPolicyMod.time_limit;
        $(".addresspolicy").css({'display': 'none'});
        $(".timepolicy").css({'display': 'block'});
        $('select[name=policy_type]').val(2);
        timeObj.repeat_type == 1 ? $(".everyweek").css({'display': 'block'}) :
            $(".everyweek").css({'display': 'none'});
        $('select[name=repeat_type]').val(timeObj.repeat_type);
        $('select[name=weekday]').val(timeObj.weekday);
        $('input[name=stop_date]').val(timeObj.stop_date);
        $('input[name=start_date]').val(timeObj.start_date);
        $('input[name=stop_time]').val(timeObj.stop_time);
        $('input[name=start_time]').val(timeObj.start_time);
    } else {
        var siteObj = railPolicyMod.site_range;
        var wifiObj = railPolicyMod.wifi_limit;;
        $(".timepolicy").hide();
        $(".addresspolicy").show();
        $('select[name=policy_type]').val(1)
        $('input[name=gps]').attr('checked', railPolicyMod.gps == 1);
        $('input[name=wifi]').attr('checked', wifiObj.open == 1);
        $('input[name=ssid]').val(wifiObj.ssid.join(' '));
        $('.pointer').html(siteObj.site);
        $('.radius').html(siteObj.range);
        mapObj = mapInit(railPolicyMod);
        mapAdjust(mapObj.map, mapObj.circle, 0);
    }
}

function view(i) {
    modify(i);
    $('.policylist,.modbtn, .addbtn, .addpolicy,.modpolicy').css({'display': 'none'});
    $('.policy_add, .viewbtn').css({'display': 'block'});
    $('.viewpolicy').css({'display': 'inline-block'});
    $('.policy_add input').attr("disabled", true);
    $('.policy_add select').attr("disabled", true);
}
// 策略下发
function auth() {
    var list = [], i = 0;
    var status = 1;
    var tr;
    var policy_type;
    var tab1 = $('.usertable');
    var tab2 = $('.tagusertable');
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            list[i] = tr.find('td').eq(7).text() * 1;
            policy_type = tr.find('td').eq(10).text();
            i = i + 1;
            if (tr.find('td').eq(13).text() == 0) {
                status = 0;
            }
        }
    });
    if (list.length === 1 && status === 1) {
        $('.policylist').css({'display': 'none'});
        $('.issuedlist').css({'display': 'block'});
        $('.issuedpolicy').css({'display': 'inline-block'});
        $('.tabbable').find('input[name=policy_id]').val(list[0]);
        $('.tabbable').find('input[name=policy_type]').val(policy_type);
        getUserList(1, 10, '', tab1, 2, 2);
        getUserList(1, 10, '', tab2, 3, 2);
        searchuserlist();
        searchtaglist();
    } else {
        warningOpen('请选择一条启用的策略进行下发！', 'danger', 'fa-bolt');
    }
}
function searchtaglist() {
    var str = '';
    $.get('/man/tag/getTagList?start=' + 1 + '&length=' + 1000, function (data) {  // 获取标签列表
        data = JSON.parse(data);
        if (data.rt == 0) {
            var select = $('#usertaglist');
            for (var i in data.tag_list) {
                str += '<li class="list-group-item" style="padding-bottom:0px;padding-top:0px;">'
                    + '<div class ="tree-item-name">'
                    + '<i class="fa fa-check-square-o treechildh cursor" style="display:none;width:30px;" onclick="_selectbytag(this)">'
                    + '<input type="text" name="tree_id" value="' + data.tag_list[i].id + '" style="display:none;"/></i>'
                    + '<i class="fa fa-square-o treechilds cursor" onclick="_cancelbytag(this)" style="width:30px;"></i>'
                    + data.tag_list[i].name
                    + '</div>'
                    + '</li>';
            }
            select.html(str);
        } else {
            warningOpen('获取标签失败！', 'danger', 'fa-bolt');
        }
    });
}
function _selectbytag(e) {
    var tab1 = $('.tagusertable');
    var tab = $('#usertaglist');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).next().show();
    getUserList(1, 10, '', tab1, 3, 2);
}
function _cancelbytag(e) {
    var tab1 = $('.tagusertable');
    var tab = $('#usertaglist');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).hide();
    $(e).prev().show();
    getUserList(1, 10, '', tab1, 3, 4);
}
// 策略下发获取用户组
function searchuserlist() {
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
function searchuserlist1() {
    var str2 = '';
    var folder = '';
    $.get('/man/users/getUsersList?depart_id=' + 0, function (data) {
        data = JSON.parse(data);
        if (data.rt == 0) {
            for (var i in data.depart_list) {
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
        } else if (data.rt == 5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
        }
    });
}
function opentreesearch(e) {
    var id = $(e).parent().find('input[name=tree_id]').eq(0).val() * 1;
    var tab = $('#treegroup');
    var isFindChild = true;
    var folder = '';
    tab.find('input[name=p_id]').each(function () {
        if ($(this).val() == id) {
            isFindChild = false;
            active2 = $(this).parent().parent().is(":visible") == true ? 'hide' : 'show';
        }
    });
    if (isFindChild) {
        $(e).css('display', 'none');
        $(e).next().css('display', 'inline-block');
        var str = '<ul style="padding-left: 24px;">';
        $.get('/man/users/getUsersList?depart_id=' + id, function (data) {
            data = JSON.parse(data);
            if (data.rt == 0) {
                for (var i in data.depart_list) {
                    folder = data.depart_list[i].child_node != 0 ?
                        '<i class="fa fa-plus faopen cursor" onclick="opentreesearch(this)" style="width: 15px;"></i><i class="fa fa-minus faclose cursor" onclick="opentreesearch(this)" style="width: 15px;"></i>' : '';
                    str += '<li class="tree-item">'
                        + '<div class ="tree-item-name">'
                        + '<i class="fa fa-check-square-o treechildh cursor" style="display:none;" onclick="_select(this)">'
                        + '<input type="text" name="tree_id" value="' + data.depart_list[i].id + '" style="display:none;"/></i>'
                        + '<i class="fa fa-square-o treechilds cursor" onclick="_cancel(this)"></i>'
                        + '<input type="text" name="p_id" value="' + id + '" style="display:none;"/>'
                        + folder
                        + data.depart_list[i].name
                        + '</div>'
                        + '</li>';
                }
                str += '</ul>'
                $(e).parent().append(str);
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
            }
        });
    } else {
        togusers(e);
    }
}
var active2 = '';
function togusers(e) {
    var that = $(e).parent().parent();
    if (active2 === 'show') {
        $(e).hide();
        $(e).next().css('display', 'inline-block');
        $(that).find('ul:first > li').show();
        $(that).find('li .faopen').show();
        $(that).find('li .faclose').hide();
    } else {
        $(e).hide();
        $(e).prev().css('display', 'inline-block');
        $(that).find('li').hide();
        $(that).find('li .faopen').show();
        $(that).find('li .faclose').hide();
    }
    active2 = '';
}
function _select(e) {
    var tab1 = $('.usertable');
    var tab = $('#treegroup');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).next().show();
    getUserList(1, 10, '', tab1, 2, 2);
}
function _cancel(e) {
    var tab1 = $('.usertable');
    var tab = $('#treegroup');
    tab.find('.treechildh').hide();
    tab.find('.treechilds').show();
    $(e).hide();
    $(e).prev().show();
    getUserList(1, 10, '', tab1, 2, 3);
}
var st = 2;
// 获取用户列表
function getUserList(start, length, keyword, tab, page, st) {
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
    if (st == 2) {
        userurl = '/man/user/getUserList?start=' + start + '&length=' + length;
        userurl += keyword ? '&keyword=' + keyword : '';
        checkstr = '<input type="checkbox" onclick="selected(this)"/><span class="text"></span>';
        strtab1 = '<table class="table table-striped table-bordered table-hover"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label>'
            + '<input type="checkbox" onclick="selectedAll(this)"/>'
            + '<span class="text">全选</span>'
            + '</label></div></th>'
            + '<th>用户名</th>'
            + '<th>账号</th>'
            + '<th>状态</th></tr>';
    } else if (st == 3) {
        var tab2 = $('#treegroup');
        tab2.find('.treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                depId = $(this).find('input[name=tree_id]').val() * 1;
            }
        });
        userurl = '/man/user/getUserByDepart?start=' + start + '&length=' + length + '&depart_id=' + depId;
    } else {
        var tab3 = $('#usertaglist');
        tab3.find('.treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                id = $(this).find('input[name=tree_id]').val() * 1;
            }
        });
        userurl = '/man/user/getUserByTag?start=' + start + '&length=' + length + '&id=' + id;
    }

    $.get(userurl, function (data) {
        data = JSON.parse(data);
        if (data.rt == 0) {
            for (var i in data.user_list) {
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
            createFooter(start, length, data.total_count, page);
        } else if (data.rt == 5) {
            toLoginPage();
        }
    });
}

// 下发策略提交
function authbtn() {
    subbtn(1);
}
// 取消策略提交
function unauthbtn() {
    subbtn(0);
}

// 策略下发取消提交
function subbtn(state) {

    var user_list = [], depart_id,
        tag_id, i = 0, tr;
    var policy_id = $('input[name=policy_id]').val() * 1;
    var policy_type = $('input[name=policy_type]').val();

    // 用户组app授权
    if ($("#departs").hasClass('active')) {
        var tab1 = $('.usertable');
        var tab2 = $('#treegroup');
        tab2.find('.treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                depart_id = $(this).find('input[name=tree_id]').val() * 1;
            }
        });
        if (tab1.find('th .checkbox span').hasClass('txt') && depart_id) {
            console.info('下发到用户组！');
        } else {
            depart_id = 0;
            tab1.find('td span').each(function () {
                if ($(this).hasClass('txt')) {
                    tr = $(this).parents("tr");
                    user_list[i] = tr.find('td').eq(4).text() * 1;
                    i = i + 1;
                }
            });
        }
    }

    // 标签app授权 
    if ($("#usertag").hasClass('active')) {
        var tab3 = $('.tagusertable');
        var tab4 = $('#usertaglist');
        tab4.find('.treechildh').each(function () {
            if ($(this).is(":visible") && $(this).find('input[name=tree_id]').val()) {
                tag_id = $(this).find('input[name=tree_id]').val() * 1;
            }
        });
        if (tab3.find('th span').hasClass('txt') && tag_id) {

            console.info('下发到标签!');
        } else {
            tag_id = 0;
            tab3.find('td span').each(function () {
                if ($(this).hasClass('txt')) {
                    tr = $(this).parents("tr");
                    user_list[i] = tr.find('td').eq(4).text() * 1;
                    i = i + 1;
                }
            });
        }
    }

    if (user_list.length > 0 || depart_id || tag_id) {
        if (user_list.length > 0) {
            postData = {
                policy_id: policy_id,
                policy_type: policy_type,
                user_list: JSON.stringify(user_list)
            };
        } else if (depart_id) {
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
        $.post('/man/railpolicy/boundPolicy', postData, function (data) {
            if (data.rt == 0) {
                warningOpen('操作成功！', 'primary', 'fa-check');
            } else if (data.rt == 40) {
                warningOpen('策略截止时间小于当前时间！', 'danger', 'fa-bolt');
            } else if (data.rt == 8) {
                warningOpen('所选用户组下没有用户无需下发策略！', 'primary', 'fa-check');
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
            }
        });
    } else {
        warningOpen('请选择一条启用策略进行下发！', 'danger', 'fa-bolt');
    }
}

// 搜索下发用户
function searchauthlist() {
    var keyword = $('.widget-btn input[name=keyvalue]').val();
    var tab1 = $('.usertable');
    var tab2 = $('.tagusertable');
    getUserList(1, 10, keyword, tab1, 2, 2);
    getUserList(1, 10, keyword, tab2, 3, 2);
}

// 启用/禁用
function activate(status) {
    var geoids = [], timeids = [],
        i = 0, j = 0, st = 0;
    var tr;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if (tr.find('td').eq(10).text() === 'geofence') {
                geoids[i] = tr.find('td').eq(7).text() * 1;
                i = i + 1;
            } else {
                timeids[j] = tr.find('td').eq(7).text() * 1;
                j = j + 1;
            }

        }
    });
    if (geoids.length > 0) {
        var postData = {
            status: status,
            geoids: JSON.stringify(geoids)
        };
        $.post('/man/railpolicy/changePolicyStatus', postData, function (data) {
            if (data.rt == 0) {
                alertOff();
                st = st + 1;
                getPolicyList(currentpage, 10);
                warningOpen('操作成功！', 'primary', 'fa-check');
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
            }
        });
    }
    if (timeids.length > 0) {
        var postData = {
            status: status,
            timeids: JSON.stringify(timeids)
        };
        if (geoids.length > 0) {
            setTimeout(function () {
                $.post('/man/railpolicy/changePolicyStatus', postData, function (data) {
                    if (data.rt == 0) {
                        alertOff();
                        st = st + 1;
                        getPolicyList(currentpage, 10);
                        warningOpen('操作成功！', 'primary', 'fa-check');
                    } else if (data.rt == 5) {
                        toLoginPage();
                    } else {
                        warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
                    }
                });
            }, 100)
        } else {
            $.post('/man/railpolicy/changePolicyStatus', postData, function (data) {
                if (data.rt == 0) {
                    alertOff();
                    st = st + 1;
                    getPolicyList(currentpage, 10);
                    warningOpen('操作成功！', 'primary', 'fa-check');
                } else if (data.rt == 5) {
                    toLoginPage();
                } else {
                    warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
                }
            });
        }
    }
}

// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getPolicyList(currentpage, 10);
}

// 删除提示
function deletes() {
    var i = 0, status = 0;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if (tr.find('td').eq(13).text() == 1) {
                status = 1;
            }
            i = 1;
        }
    });
    var cont = '';
    if (i > 0 && status === 0) {
        cont += '<div class="modal-header">'
            + ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
            + '<h4 class="modal-title">提示</h4>'
            + '</div>'
            + '<div class="modal-body">'
            + '<p>确定删除？</p>'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
            + '<button type="button" class="btn btn-primary" onclick="policy_delete()">确认</button>'
            + '</div>';
        alertOpen(cont);
    } else if (status === 1) {
        warningOpen('请先禁用相关策略然后删除!', 'danger', 'fa-bolt');
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
            if (tr.find('td').eq(10).text() === 'geofence') {
                geoids[i] = tr.find('td').eq(7).text() * 1;
                i = i + 1;
            } else {
                timeids[j] = tr.find('td').eq(7).text() * 1;
                j = j + 1;
            }

        }
    });
    if (geoids.length > 0) {
        var postData = {
            geoids: JSON.stringify(geoids)
        };
        $.post('/man/railpolicy/del_policy', postData, function (data) {
            if (data.rt == 0) {
                alertOff();
                st = st + 1;
                getPolicyList(currentpage, 10);
                warningOpen('操作成功！', 'primary', 'fa-check');
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
            }
        });
    }
    if (timeids.length > 0) {
        var postData = {
            timeids: JSON.stringify(timeids)
        };
        $.post('/man/railpolicy/del_policy', postData, function (data) {
            if (data.rt == 0) {
                alertOff();
                st = st + 1;
                getPolicyList(currentpage, 10);
                warningOpen('操作成功！', 'primary', 'fa-check');
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt + '！', 'danger', 'fa-bolt');
            }
        });
    }
}
