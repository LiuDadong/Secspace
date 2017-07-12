/*
 * ==================================================================
 *                          围栏管理 rail
 * ==================================================================
 */

$(function() {
    // 围栏列表
    getRailList(1,10);  
});
// 围栏列表
function getRailList(start,length) {
    var st = 1;
    var total_count = 54;
    var url = '/man/user/getUserList?start='+ start + '&length='+ length;
    var table = $('.railtable'),
        str = '<table class="table table-striped table-bordered table-hover"><tr>'
            //+ '<th class="sel" onclick="selectedAll(this)"><i class="fa"></i></th>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>围栏名称</th>'
            + '<th>围栏摘要</th>'
            + '<th>推送数／收到数</th>'
            + '<th>创建人</th>'
            + '<th>更新时间</th>'
            + '<th>其他操作</th></tr>';
    var user_list = [{"name": "ss7", "depart_id": 9,  "sex": "1", "phone": "15849876532", "create_time": "2017-06-14 18:32:42", "id": 82.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss7@appssec.com", "policy_id": -1},
     {"name": "ss6", "depart_id": 9, "app_rule": {}, "sex": "5", "phone": "18304587963", "create_time": "2017-06-14 18:32:06", "dev": ["83b2268073a2c06e"], "id": 81.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss6@appssec.com", "policy_id": -1}, {"name": "ss5", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "18307521493", "create_time": "2017-06-14 18:31:33", "dev": ["83b2268073a2c06e"], "id": 80.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss5@appssec.com", "policy_id": -1}, {"name": "ss4", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "15904523897", "create_time": "2017-06-14 18:30:58", "dev": ["83b2268073a2c06e"], "id": 79.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss4@appssec.com", "policy_id": -1}, {"name": "ss3", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "18304598728", "create_time": "2017-06-14 18:30:26", "dev": ["83b2268073a2c06e"], "id": 78.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss3@appssec.com", "policy_id": -1}, {"name": "ss2", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "18304598723", "create_time": "2017-06-12 16:53:21", "dev": ["e520c5b318e1c1fc"], "id": 77.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss2@appssec.com", "policy_id": 7}, {"name": "ss1", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "18304598732", "create_time": "2017-06-12 16:52:57", "dev": ["e520c5b318e1c1fc", "8373f324679096b5"], "id": 76.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "ss1@appssec.com", "policy_id": 7}, {"name": "user2", "depart_id": 5, "app_rule": {}, "sex": "1", "phone": "15823095675", "create_time": "2017-05-24 17:27:40", "dev": ["3c3d32f646f3f83b", "31183aad7db4d53b"], "id": 73.0, "depart_name": "\u6d4b\u8bd5\u90e8\u95e8", "email": "user2@qq.com", "policy_id": -1}, {"name": "user1", "depart_id": 9, "app_rule": {}, "sex": "1", "phone": "15834569023", "create_time": "2017-05-24 17:27:03", "dev": ["3c3d32f646f3f83b", "b5978e187bf0aeda"], "id": 72.0, "depart_name": "\u4ea7\u54c1\u90e8\u95e8", "email": "user1@qq.com", "policy_id": 35}, {"name": "018", "depart_id": 7, "app_rule": {}, "sex": "1", "phone": "15010170062", "create_time": "2017-04-27 15:46:00", "dev": ["7f9d4bb1c8c2d780", "322302ecdf93ab86", "3c3d32f646f3f83b", "2e5ab2dd362126d", "f8325e0fd226bc44"], "id": 71.0, "depart_name": "\u7814\u53d1\u90e8\u95e8", "email": "018@qq.com", "policy_id": 35}]
    //$.get(url, function(data) {
        //data = JSON.parse(data);
       // if (data.rt==0) {
            for(var i in user_list) {
                str += '<tr>'
                    //+ '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                    + '<td>' + user_list[i].name + '</td>'
                    + '<td>' + user_list[i].id + '</td>'
                    + '<td>100/68</td>'
                    + '<td>' + user_list[i].phone + '</td>'
                    + '<td>' + user_list[i].create_time + '</td>' 
                    + '<td style="display:none;">' + user_list[i].sex + '</td>'
                    + '<td class="other">'           
                    + '<a href="javascript:rail_modify('+ i +');">修改信息</a>'
                    + '</td></tr>';
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,total_count,st);  
       // } else if (data.rt==5) {
      //      toLoginPage();           
      //  }
   // });
    currentpage = start;
}
function rail_modify(i){
    if(i%2 == 0){
        add1();
    }else{
        add2();
    }
}
// 添加Wi-Fi围栏
function add1(){
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">Wi-Fi围栏</h4>'
             + '</div>'

             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">围栏名称：</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入名称"/>' 
             + '</div></div>'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "ssid">SSID：</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "ssid" name="ssid" placeholder = "请输入SSID"/>' 
             + '</div></div>'

             + '<ul class="nav nav-tabs" style="box-shadow:none;background:#fff;border-bottom:1px solid #ddd;margin-top:20px;">'
             + '<li class="active"><a data-toggle="tab" href="#rail">围栏内</a></li>'
             + '<li><a data-toggle="tab" href="#outrail">围栏外</a></li>'
             + '</ul>'

             + '<div class="tab-content" style="box-shadow:none;background:#fff;">'

             + '<div class="tab-pane active" id="rail">'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "leader">围栏内策略：</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" id="leader1" style="cursor:pointer;background:url(../imgs/pulldown.png) no-repeat 98%;" class="form-control" value="departleader" readonly="readonly"/>'
             + '<input type="text" name="leader_id1" value="leader_id1" style="display:none;"/>'
             + '<div class="overflowlist1" style="display:none;overflow-x:hidden;height:100px;border:1px solid #ddd;">'
             + '<ul name="memberlist99" class="list-group memberlist">'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '</ul></div>'
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "tips">围栏内提示：</label>' 
             + '<div class="col-sm-7">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="2" name="tips" id="tips"></textarea>'
             + '</span>'
             + '</div></div>'
             + '</div>'

             + '<div class="tab-pane" id="outrail">'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "policy2">围栏外策略：</label>' 
             + '<div class="col-sm-7">' 
             + '<input type="text" id="leader2" style="cursor:pointer;background:url(../imgs/pulldown.png) no-repeat 98%;" class="form-control" value="departleader" readonly="readonly"/>'
             + '<input type="text" name="leader_id2" value="leader_id2" style="display:none;"/>'
             + '<div class="overflowlist2" style="display:none;overflow-x:hidden;height:100px;border:1px solid #ddd;">'
             + '<ul name="memberlist99" class="list-group memberlist">'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '<li><a>fdksjfdlreowqruiwoq</a></li>'
             + '</ul></div>'
             + '</div></div>'

             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "tip">围栏外提示：</label>' 
             + '<div class="col-sm-7">' 
             + '<span class="input-icon icon-right">'
             + '<textarea class="form-control" rows="2" name="tip" id="tip"></textarea>'
             + '</span>'
             + '</div></div>'
             + '</div>'
             
             + '</form>'
             + '</div>'
             + '</div>'

             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="user_add()">确认</button>'
             + '</div>';  
    alertOpen(cont);
     
    $(document).ready(function(){
        $("#leader1").click(function(){
            var thisinput=$(this);
            var thislist=$(".overflowlist1");
            var thisul=$(".overflowlist1").find("ul");
           // var thisemail = $("#leaderemail");

            if(thislist.css("display")=="none"){
                thislist.css({"display":"block",width:"auto"});
                thisul.find("a").click(function(){
                    thisinput.val($(this).text());
                    $('input[name=leader_id1]').val($(this).parent().val());
                    thislist.fadeOut("10");
                    thisemail.val($(this).parent().find('input[name=lemail1]').val());
                });
            }
        });
        $("#leader2").click(function(){
            var thisinput=$(this);
            var thislist=$(".overflowlist2");
            var thisul=$(".overflowlist2").find("ul");
           // var thisemail = $("#leaderemail");

            if(thislist.css("display")=="none"){
                thislist.css({"display":"block",width:"auto"});
                thisul.find("a").click(function(){
                    thisinput.val($(this).text());
                    $('input[name=leader_id2]').val($(this).parent().val());
                    thislist.fadeOut("10");
                    thisemail.val($(this).parent().find('input[name=lemail2]').val());
                });
            }
        });
    });
}
// 添加地理围栏
function add2(){
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">地理围栏</h4>'
             + '</div>'

             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">围栏名称：</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入名称"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "suggestId">地理位置查询：</label>' 
             + '<div id="r-result" class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "suggestId" name="suggestId" size="20" placeholder = "地理位置查询"/></div>' 
             
             + '</div>'
             + '<div class = "form-group">'
             + '<label class="col-sm-3 control-label" for = "name">方圆：</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "number" class = "form-control" id = "name" name="name" placeholder = "请输入数字"/>' 
             + '</div>'
             + '<div class="col-sm-2" style="line-height:34px;">' 
             + '(单位：米)' 
             + '</div>'
             + '</div>'

            + '<div id="searchResultPanel" style="1px solid #C0C0C0;width:150px;height:auto;display:none;"></div>'
             + '<div class = "form-group">' 
             + '<div id="l-map" class="col-sm-10 col-sm-offset-1" style="height:260px;border:1px solid #d5d5d5;">' 
             + '</div>'
             + '</div>'
        
             + '</div>'
             + '</div>'

             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="user_add()">确认</button>'
             + '</div>';  
    alertOpen(cont);
     
    $(document).ready(function(){
        // 百度地图API功能
        function G(id) {
            return document.getElementById(id);
        } 
        var map = new BMap.Map("l-map");
        map.centerAndZoom("北京",12);                 // 初始化地图,设置城市和地图级别。
        var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_TOP_RIGHT});   //设置版权控件位置
        map.addControl(cr); //添加版权控件
        //添加缩略图控件
        map.addControl(new BMap.OverviewMapControl({isOpen:false,anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
        //添加缩放平移控件
        map.addControl(new BMap.NavigationControl());
        //添加比例尺控件
        map.addControl(new BMap.ScaleControl());
        map.enableScrollWheelZoom(true); 

        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {"input" : "suggestId"
            ,"location" : map
        });

        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
        var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
            
            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
            
            setPlace();
        });
        function setPlace(){
            map.clearOverlays();
            function myFun(){
                var pp = local.getResults().getPoi(0).point;
                map.centerAndZoom(pp,18);
                map.addOverlay(new BMap.Marker(pp));
            }
            var local = new BMap.LocalSearch(map, {
                renderOptions:{map: map}
            });
            console.log(myValue);
            
           // var local = new BMap.localSearch(map,{
           //     onSearchComplete: myFun
          //  });
          //  local.search(myValue);
            local.enableAutoViewport(); //允许自动调节窗体大小
            local.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0);
            console.log(poi.point.lng + "," + poi.point.lat);
            map.centerAndZoom(poi.point, 13);
            });
            local.search(myValue);
        }
    });
}
// 添加地理围栏
function add3(){
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">地理围栏</h4>'
             + '</div>'

             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">围栏名称：</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入名称"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "suggestId">地理位置查询：</label>' 
             + '<div id="r-result" class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "suggestId" name="suggestId" size="20" placeholder = "地理位置查询"/></div>' 
             
             + '</div>'
             + '<div class = "form-group">'
             + '<label class="col-sm-3 control-label" for = "name">方圆：</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "number" class = "form-control" id = "name" name="name" placeholder = "请输入数字"/>' 
             + '</div>'
             + '<div class="col-sm-2" style="line-height:34px;">' 
             + '(单位：米)' 
             + '</div>'
             + '</div>'

            + '<div id="searchResultPanel" style="1px solid #C0C0C0;width:150px;height:auto;display:none;"></div>'
             + '<div class = "form-group">' 
             + '<div id="l-map" class="col-sm-10 col-sm-offset-1" style="height:260px;border:1px solid #d5d5d5;">' 
             + '</div>'
             + '</div>'
        
             + '</div>'
             + '</div>'

             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="user_add()">确认</button>'
             + '</div>';  
    alertOpen(cont);
     
    $(document).ready(function(){
        // 百度地图API功能
        function G(id) {
            return document.getElementById(id);
        } 
        var map = new BMap.Map("l-map");
        map.centerAndZoom("北京",12);                 // 初始化地图,设置城市和地图级别。
        var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_TOP_RIGHT});   //设置版权控件位置
        map.addControl(cr); //添加版权控件
        //添加缩略图控件
        map.addControl(new BMap.OverviewMapControl({isOpen:false,anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
        //添加缩放平移控件
        map.addControl(new BMap.NavigationControl());
        //添加比例尺控件
        map.addControl(new BMap.ScaleControl());
        map.enableScrollWheelZoom(true); 

        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {"input" : "suggestId"
            ,"location" : map
        });

        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
        var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
            
            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
            
            setPlace();
        });
        function setPlace(){
            map.clearOverlays();
            function myFun(){
                var pp = local.getResults().getPoi(0).point;
                map.centerAndZoom(pp,18);
                map.addOverlay(new BMap.Marker(pp));
            }
            var local = new BMap.LocalSearch(map, {
                renderOptions:{map: map}
            });
            local.search(myValue);
           // var local = new BMap.localSearch(map,{
           //     onSearchComplete: myFun
          //  });
          //  local.search(myValue);
        }
    });
}

// page页查询
function search(p,i) {
    if(i == 1){
        getRailList(p,10);
    } else{
        console.log(i);
    }
}
// 返回围栏列表
function raillist(){
    $('.user, .pushrail').css({'display':'none'});
    $('.raillist').css({'display':'block'});
}
// 围栏推送
function pushmesg(){
    var i = 0;
    var message_id = '';
    var tab = $('.railtable table');

    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            message_id = tr.find('td').eq(6).text()*1;
            i = i+1;
        }     
    }); 
    if(i == 1){ 
        $('.raillist').css({'display':'none'});
        $('.user').css({'display':'block'});
        $('.pushrail').css({'display':'inline-block'});
        $('.user').find('input[name=message_id]').val(message_id);

        var url = '/man/message/sendMessage?message_id='+message_id;
        var table1 = $('.freeuser'),
              str1 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="adduser"><tr>'
                   + '<th width="50%">登录名</th>'
                   + '<th width="50%">姓名</th>'
                   + '<th width="50px" style="text-align:center;">操作</th></tr>',
        table2 = $('.member'),
          str2 = '<table class="table table-striped table-bordered table-hover" style="table-layout: fixed;" id="deleteuser"><tr>'
               + '<th width="50%">登录名</th>'
               + '<th width="50%">姓名</th>'
               + '<th width="50px" style="text-align:center;">操作</th></tr>';
        $.get(url, function(data) {
            data = JSON.parse(data);
            if (data.rt==0) {           
                for(var i in data.available_users) {
                    str1 += '<tr>'
                        + '<td>' + data.available_users[i].email + '</td>'
                        + '<td>' + data.available_users[i].name + '</td>'
                        + '<td style="display:none;">' + data.available_users[i].id + '</td>' 
                        + '<td style="padding:0;text-align:center;"><img src="../imgs/roleadd.png" onclick="adduser(this)" style="vertical-align: middle;cursor:pointer;"/>'             
                        + '</td></tr>';
                }
                str1 +='</table>';
                table1.html(str1);

                for(var j in data.message_users) {
                    str2 += '<tr>'
                        + '<td>' + data.message_users[j].email + '</td>'
                        + '<td>' + data.message_users[j].name + '</td>'
                        + '<td style="display:none;">' + data.message_users[j].id + '</td>' 
                        + '<td style="padding:0;text-align:center;"><img src="../imgs/roledelete.png" onclick="deleteuser(this)" style="vertical-align: middle;cursor:pointer;"/>'             
                        + '</td></tr>';
                }
                str2 +='</table>';
                table2.html(str2);
            } else if (data.rt==5) {
                toLoginPage();           
            } else{
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    } else {
        warningOpen('请选择一条消息进行推送！','danger','fa-bolt');
    }
}
//删除围栏推送用户
function deleteuser(obj){
    var tr = $(obj).parent().parent();
    var rowIndex = tr.index()+1;
    var email = tr.find('td').eq(0).text();
    var name = tr.find('td').eq(1).text();
    var id = tr.find('td').eq(2).text();
    var tab = document.getElementById("adduser");
      //表格行数
    var rows = tab.rows.length*1;
    var x=document.getElementById('adduser').insertRow(rows);
    var y=x.insertCell(0);
    var z=x.insertCell(1);
    var k=x.insertCell(2);
    var v=x.insertCell(3);
    y.innerHTML=email;
    z.innerHTML=name;
    k.innerHTML=id;
    v.innerHTML='<img src="../imgs/roleadd.png" onclick="adduser(this)" style="vertical-align: middle;cursor:pointer;"/>';
    k.style.display = 'none';
    v.style.padding = '0';
    v.style.textAlign = 'center';
    $(obj).parent("td").parent("tr").remove();
}
//添加围栏推送用户
function adduser(obj){
    var tr = $(obj).parent().parent();
    var rowIndex = tr.index()+1;
    var email = tr.find('td').eq(0).text();
    var name = tr.find('td').eq(1).text();
    var id = tr.find('td').eq(2).text();
    var tab = document.getElementById("deleteuser");
      //表格行数
    var rows = tab.rows.length*1;
    var x=document.getElementById('deleteuser').insertRow(rows);
    var y=x.insertCell(0);
    var z=x.insertCell(1);
    var k=x.insertCell(2);
    var v=x.insertCell(3);
    y.innerHTML=email;
    z.innerHTML=name;
    k.innerHTML=id;
    v.innerHTML='<img src="../imgs/roledelete.png" onclick="deleteuser(this)" style="vertical-align: middle;cursor:pointer;"/>';
    k.style.display = 'none';
    v.style.padding = '0';
    v.style.textAlign = 'center';
    $(obj).parent("td").parent("tr").remove();
}
//查询未推送的用户
function sfreeusers(){
    var s = document.getElementById("freeusers").value;
    var tab = $('.freeuser table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
//查询推送过的用户
function searchusers(){
    var s = document.getElementById("users").value;
    var tab = $('.member table');
    tab.find('tr').each(function () {$(this).css({'display':''});});
    searchbykeywords(s,tab);
}
// 围栏推送提交
function save(){
    var usertable = $('.member table');
    var user_list = [], i = 0;
    usertable.find('tr:not(:first)').remove().each(function () {
        if($(this).css("display") != "none"){
           user_list[i] = $(this).find('td').eq(2).text()*1;
           i = i + 1;
        }
    }); 
    var postData = {
            message_id: $('.user').find('input[name=message_id]').val(),
            users: JSON.stringify(user_list)
        };
    raillist();
    /*$.post('/man/message/sendMessage', postData, function(data) {
        if (data.rt == 0) {       
            raillist();
            warningOpen('操作成功！','primary','fa-check');  
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    }); */
}
// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getRailList(currentpage,10,'');
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.railtable table');
    if(tab.find('td span').hasClass('txt')){
        i = 1;
    }     
    var cont = '';
    if(i>0){
        cont += '<div class="modal-header">'
             +  ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             +  '<h4 class="modal-title">提示</h4>'
             +  '</div>'
             +  '<div class="modal-body">'
             +  '<p>确定删除？</p>'
             +  '</div>'
             +  '<div class="modal-footer">'
             +  '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             +  '<button type="button" class="btn btn-primary" onclick="rail_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的围栏！','danger','fa-bolt');
    }
}

// 企业管理员删除多个围栏
function rail_delete() {
    var railId = [],
            i = 0;
    var tr;
    var tab = $('.railtable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            railId[i] = tr.find('td').eq(6).text()*1;
            i = i+1;
        }     
    });  
    if(railId.length > 0){
        var postData = {
            rails: JSON.stringify(railId)
        };
        
       /* $.post('/man/user/delUser', postData, function(data) {
            if (data.rt == 0) {               
                getUserList(1,10,'');  
                alertOff(); 
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); */
    }else{
        warningOpen('请选择要删除的围栏！','danger','fa-bolt');
    }        
}
