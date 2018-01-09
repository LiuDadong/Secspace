/*
 * ==================================================================
 *                          用户设备管理 per_device
 * ==================================================================
 */

$(function() { 

    // 设备管理列表
    getDeviceList();  
    $('.layout-right .top .right .search input').val('');
});

// 设备管理列表
function getDeviceList(start_page,page_length){ 
    var email = '';
    if(localStorage.length>0){
        var inform = localStorage.getItem("data1");
        var nation = JSON.parse(inform);
        var inform = nation.doc;
        var info = inform.info;
            email = info.email;
    }
    var table = $('.layout .layout-right .center .device'),
        str = '<table><tr class="firsttr">'
            + '<th style="width:25%;padding-left:70px;">设备名称</th>'
            + '<th style="width:25%;">系统</th>'
            + '<th style="width:25%;">更新时间</th>'
            + '<th style="width:25%;">目前状态</th></tr>';

    $.get('/per/dev/getUserDev?&email='+email, function(data) {
        var online='';
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.dev) {
                online = (data.dev[i].online == 1) ? '在线':'离线';
                str += '<tr>'
                    + '<td class="other" style="padding-left:70px;">'            
                    + '<a href="javascript:getDetail('+ i +');">' + data.dev[i].dev_name + '</a></td>'
                    + '<td>' + data.dev[i].dev_system + '</td>'
                    + '<td>' + data.dev[i].last_online + '</td>'
                    + '<td>' + online + '</td>'
                    + '<td style="display:none;">' + JSON.stringify(data.dev[i].dev_info) + '</td>'
                    + '<td style="display:none;">' + data.dev[i].dev_id + '</td>'
                    +'</tr>';
            }
            str +='</table>';
            table.html(str);
            table.css({'height':'100%'});
            thstyle();       
        }else if(data.rt == 20){
            warningOpen('此账号目前还没有邦定设备 ！');
        } else if (data.rt==5) {
           toLoginPage();
        }
    });
}
function returnlist(){
    var tab = $('.layout .layout-right .center .device');
    tab.html('');
    getDeviceList();
    var title = '<a href="javascript:getDeviceList()" style="color:#666666;">设备管理</a>';
    $('.layout-right .top .left ul .title').html(title);
    $('.layout .layout-right .center .device').css({'background-color':'#ffffff'});
    heightstyle();
}
// 设备对应详细信息
function getDetail(i){
    $('.layout-right .footerpage').css({'display':'none'});
    $('.layout-right .top .right .search input').val('');
    var title = '<a href="javascript:returnlist()" style="color:#666666;">设备管理</a>&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;详细信息';
    $('.layout-right .top .left ul .title').html(title);
    $('.layout .layout-right .center .device').css({'background-color':'#F5F5F5','height':'auto'});
   

    var _tr = $('.layout .layout-right .center .device table tr').eq(i+1),
        devicename = _tr.find('td').eq(0).text(),
        last_online = _tr.find('td').eq(2).text(),
        status = _tr.find('td').eq(3).text(),
        dev_id = _tr.find('td').eq(5).text();
    var devObj;
    var dev_info = _tr.find('td').eq(4).text(),        
    devObj = JSON.parse(dev_info);
    var email = '';
    // 获取sessionStorage里用户email
    if(localStorage.length>0){
        var inform = localStorage.getItem("data1");
        var nation = JSON.parse(inform);
        var inform = nation.doc;
        var info = inform.info;
            email = info.email;
    }

    // 获取指定设备详细信息 
    /*$.get('/per/dev/devBasicInfo?dev_id='+ dev_id +'&email='+ email, function(data) {
        var online='';
        data = JSON.parse(data);
        if (data.rt==0) {
            console.log("9999999"); 
        } else if (data.rt==5) {
           toLoginPage();
        }
    });
    */

    var strtab1 = '';

    strtab1 = '<table><tr><th>供应商</th><th>'           
            + devObj.manufacture
            + '</th><th>型号</th><th>'
            + devObj.model_number
            + '</th></tr>'
            + '<tr><th>屏幕分辨率</th><th>'
            + devObj.screen_resolution
            + '<th>cup名称</th><th>'           
            + devObj.cpu_name
            + '</th></tr>'
            + '<tr><th>屏幕大小</th><th>'
            + devObj.screen_size
            + '</th>'
            + '<th>cup数量</th><th>'           
            + devObj.cpu_count
            + '</th></tr>'
            + '<tr><th>系统语言</th><th>'
            + devObj.system_language
            + '</th>'
            + '<th>内存</th><th>'           
            + devObj.memory_total
            + '</th></tr>'
            + '<tr><th>电池</th><th>'
            + devObj.battery
            + '</th>'
            + '<th>手机类型</th><th colspan ="3">'           
            + devObj.phone_type
            + '</th>'
            + '<tr><th>SIM卡类型</th><th>'           
            + devObj.sim_supportor
            + '</th><th>设备序列号</th><th>'
            + devObj.serial
            + '</th></tr>'
            + '<tr><th>无线MAC</th><th colspan ="3">'           
            + devObj.wifi_mac
            + '</th></tr>'
            + '<tr><th>蓝牙MAC</th><th colspan ="3">'           
            + devObj.bluetooth_mac
            + '</th></tr></table>';

    var dev_head = '<div class="inform"><div class="devleft">'
            + '<p><label>设备名称:</label><span><label>'
            + devicename
            + '</label></span><label>IMEI:</label>'
            + devObj.imei
            + '</p><p><label>在线时间:</label><span><label>'
            + last_online
            + '</label></span><label>目前状态:</label>'
            + status
            + '</p></div>'
            + '<div class="devright">'
            + '<div class="t1"><ul>'
            + '<li class="resetfactory"></li>'
            + '<li class="handle" onclick="sendCmd(\'reset\',\''+dev_id+'\')">恢复出厂设置</li>'
            + '</ul></div>'
            + '<div class="t2"><ul>'
            + '<li class="tracking"></li>'
            + '<li class="handle" onclick="sendCmd(\'bell\',\''+dev_id+'\')">响铃追踪</li>'
            + '</ul></div>'
            + '<div class="t3"><ul>'
            + '<li class="lock"></li>'
            + '<li class="handle" onclick="sendCmd(\'lockscreen\',\''+dev_id+'\')">锁屏</li>'
            + '</ul></div>'
            + '<div class="t4"><ul>'
            + '<li class="lockpwd"></li>'
            + '<li class="handle" onclick="updatescreenpw(\''+dev_id+'\')">锁屏密码</li>'
            + '</ul></div>'
            + '</div>';
    var str = '<div id="tab_bar"><ul>'
            + '<li id="tab1" onclick="funinfo(\''+dev_id+'\')">基本信息</li>'
            + '<li id="tab2" onclick="funnet(\''+dev_id+'\')">网络信息</li>'
            + '<li id="tab3" onclick="funaddr(\''+dev_id+'\')">位置链接</li></ul></div>'                                
            + '<div class="tab_css" id="tab1_content" style="display: block">'
            + '<div class="tab1">'
            + strtab1
            + '</div></div>'
            + '<div class="tab_css" id="tab2_content"> '
            + '<div class="tab2">'
            + '<div id="usage">'
            + '<p><label name = "timetype"></label>'
            + '<label>usage:</label>'
            + '<label name = "usagenum"></label></p>'
            + '<p class="pbt"><a class="year" href="javascript:getYearug();">year</a>'
            + '<a class="month" href="javascript:getMonthug();">month</a>'
            + '<a class="week" href="javascript:getWeekug();">week</a>'
            + '<a class="day" href="javascript:getDayug();">day</a>'      
            + '<label> Unit : MB</label></p>'
            + '</div>'
            + '<div class="dvcnum"><div id="deviceNum"></div></div>'
            + '</div></div> '
            + '<div class="tab_css" id="tab3_content"> '
            + '<div class="tab3">'
            + '<div class="address"><div id="addr"></div></div>'
            + '</div></div></div>';
        str = dev_head + str;  
   
    var tab = $('.layout .layout-right .center .device');
    tab.html(str);      
    $('.layout .layout-right .center .device #tab_bar #tab1').addClass('switchtab'); 
   heightstyle();
}

// 设备详细信息tab切换
function funswitch(v,dev_id){
   if(v == 2) {
        var tabstr2 = '<ul>'            
            + '<li id="tab2" onclick="funnet(\''+dev_id+'\')">网络信息</li>'
            + '<li id="tab3" onclick="funaddr(\''+dev_id+'\')">位置链接</li>'
            + '<li id="tab1" onclick="funinfo(\''+dev_id+'\')">基本信息</li></ul>';
        $('.layout .layout-right .center .device #tab_bar').html(tabstr2);        
        $('.layout .layout-right .center .device #tab_bar #tab2').addClass('switchtab');      

    } else if(v == 3) {
        var tabstr3 = '<ul>'       
            + '<li id="tab3" onclick="funaddr(\''+dev_id+'\')">位置链接</li>'
            + '<li id="tab1" onclick="funinfo(\''+dev_id+'\')">基本信息</li>'
            + '<li id="tab2" onclick="funnet(\''+dev_id+'\')">网络信息</li></ul>';
        $('.layout .layout-right .center .device #tab_bar').html(tabstr3);
        $('.layout .layout-right .center .device #tab_bar #tab3').addClass('switchtab');       

    } else {
        var tabstr1 = '<ul>'     
            + '<li id="tab1" onclick="funinfo(\''+dev_id+'\')">基本信息</li>'
            + '<li id="tab2" onclick="funnet(\''+dev_id+'\')">网络信息</li>'
            + '<li id="tab3" onclick="funaddr(\''+dev_id+'\')">位置链接</li></ul>';
        $('.layout .layout-right .center .device #tab_bar').html(tabstr1);     
        $('.layout .layout-right .center .device #tab_bar #tab1').addClass('switchtab');       
    }  
}
function funinfo(dev_id){
    myclick(1); 
    funswitch(1,dev_id);
}
function funnet(dev_id){
    warningOpen('目前没有流量信息接口 !');
    /*
    myclick(2); 
    funswitch(2,dev_id);
    getDayug();   
    */
}
function funaddr(dev_id){
    var sid = getCookie("sid");
    var url = hosturl + 'p/dev/uploadLocation?sid='+sid+'&dev_id=' +dev_id;
    $.get(url, function(data) {
        var position = JSON.parse(data.position);
        if (data.rt==0) { 
            if(position) {
                myclick(3);
                funswitch(3,dev_id);  
                var map = new BMap.Map("addr");
                var point = new BMap.Point(position.longitude, position.latitude);
                map.centerAndZoom(point, 15);
              
                var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_TOP_RIGHT});   //设置版权控件位置
                map.addControl(cr); //添加版权控件
                //添加缩略图控件
                map.addControl(new BMap.OverviewMapControl({isOpen:false,anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
                //添加缩放平移控件
                map.addControl(new BMap.NavigationControl());
                //添加比例尺控件
                map.addControl(new BMap.ScaleControl());

                var bs = map.getBounds();   //返回地图可视区域
                cr.addCopyright({id: 1, content: "<a href='#' style='font-size:12px;color:red;'>登陆地址："+position.address+"</a>", bounds: bs});  

                var marker = new BMap.Marker(new BMap.Point(position.longitude, position.latitude));  // 创建标注
                var opts = {title : '<span style="font-size:14px;color:#0A8021">登陆地址</span>'};
                var infoWindow =new BMap.InfoWindow("<div style='line-height:1.8em;font-size:12px;'>"+position.address+"</div>", opts);  // 创建信息窗口对象，引号里可以书写任意的html语句。
                marker.addEventListener("mouseover", function(){
                    this.openInfoWindow(infoWindow);
                });

                map.addOverlay(marker);     // 将标注添加到地图中
                marker.show();
                map.disableScrollWheelZoom();
                map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
                map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            } else{
                warningOpen("设备未登陆，没有定位信息！");
            }   
        } else if (data.rt==5) {
            toLoginPage();
        }
    }); 
}
// 单个设备推送
function sendCmd(cmd, dev_id){
    var url = hosturl + "pub?id="+dev_id;
    var xml = new XMLHttpRequest();
    xml.open("POST", url, true);
    xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
    xml.send(cmd);
}
// 单个设备设置锁屏密码界面
function updatescreenpw(dev_id){  
    var cont = '';    
    cont += '<form autocomplete="off"><p><span>锁屏密码</span><input type="password" name="screen_pw"></input></p>'
         + '<p><span>确认锁屏密码</span><input type="password" name="confirm"></input></p>'
         + '</form><div class="line"></div>'
         + '<p><button onclick="chgspw(\''+dev_id+'\')">确认</button><button onclick="alertOff()">取消</button></p>';
    alertOpen('设置锁屏密码', cont);
    $('input[name=screen_pw],input[name=confirm]').keyup(function(){  // 输入限制，只能输入整数 
        if (this.value.length==1) {
            this.value=this.value.replace(/[^1-9]/g,'');
        } else {
            this.value=this.value.replace(/\D/g,'');
        }
    }); 
}

// 单个设备锁屏密码提交 
function chgspw(dev_id){
    var cmd = $('input[name=screen_pw]').val();
    var confirm = $('input[name=confirm]').val();
    if(cmd == '' || cmd.length<4 || cmd.length>6){
        warningOpen('请输入四到六位锁屏密码！');
    }else if(cmd != confirm){
        warningOpen('前后锁屏密码不一致！');
    }else{
        cmd = 'chg_screen_pw <'+ cmd +'>';
        sendCmd(cmd, dev_id);
        alertOff();
    }
}
function getDayug(){
    $('.layout .layout-right .center .device .tab2 a').removeClass('active');
    $('.layout .layout-right .center .device .tab2 .day').addClass('active');
    var usagenum = 100;
    $('.layout .layout-right .center .device .tab2').find('label[name=timetype]').val('今天');
    $('.layout .layout-right .center .device .tab2').find('label[name=usagenum]').val(100);
    $(function () {
    $('#deviceNum').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: ' '
        },
        subtitle: {
            text: ' '
        },
        xAxis: {
            categories: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00']
        },
        yAxis: {
            title: {
                text: ' '
            }
        },
        tooltip: {
            enabled: true,
            formatter: function() {
                return this.x +'数量: '+ this.y +'个';
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        series: [{
            data: [9, 17, 25, 88, 490, 160]
        }]
    });
});
    
}

function getWeekug(){
    $('.layout .layout-right .center .device .tab2 a').removeClass('active');
    $('.layout .layout-right .center .device .tab2 .week').addClass('active');
    var usagenum = 100;
    $('.layout .layout-right .center .device .tab2').find('label[name=timetype]').val('本周');
    $('.layout .layout-right .center .device .tab2').find('label[name=usagenum]').val(100);
    $(function () {
    $('#deviceNum').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: ' '
        },
        subtitle: {
            text: ' '
        },
        xAxis: {
            categories: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        },
        yAxis: {
            title: {
                text: ' '
            }
        },
        tooltip: {
            enabled: true,
            formatter: function() {
                return this.x +'数量: '+ this.y +'个';
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        series: [{
            data: [9, 17, 97, 34, 88, 36]
        }]
    });
});
    
}