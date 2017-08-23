/*
 * ==================================================================
 *                          设备管理 device
 * ==================================================================
 */

$(function() { 
    $('.devicemenu').addClass('open active');
    $('.devicemenu').find('li').eq(0).addClass('active');

    // 设备管理列表
    getDeviceList(1,10); 
    $.get('/man/setting/orgGetSettings', function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            if(data.doc.send_url){
                sendurl = 'http://' + data.doc.send_url + '/pub';
            }
            console.log('sendurl = '+sendurl);
        }
    });
});

// 获取设备列表
function getDeviceList(start_page,page_length){  
    var table = $('.devicetable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>设备名称</th>'
            + '<th>所属用户</th>'
            + '<th>系统</th>'
            + '<th>上一次在线时间</th>'
            + '<th>目前状态</th></tr>';
    $.get('/man/dev/getDevList?start_page='+start_page+'&page_length='+page_length, function(data) {
        var online='';
        data = JSON.parse(data);
        if (data.rt== 0) {
            for(var i in data.doc) {
                online = (data.doc[i].online == 1) ? '在线':'离线';
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                    + '<td>'            
                    + '<a href="javascript:getDetail('+ i +');">' + data.doc[i].dev_name + '</a></td>'
                    + '<td>' + data.doc[i].email + '</td>'
                    + '<td>' + data.doc[i].dev_system + '</td>'
                    + '<td>' + data.doc[i].last_online + '</td>'
                    + '<td>' + online + '</td>'
                    + '<td style="display:none;">' + JSON.stringify(data.doc[i].dev_info) + '</td>'
                    + '<td style="display:none;">' + data.doc[i].dev_id + '</td>'
                    + '<td style="display:none;">' + JSON.stringify(data.doc[i].app_list) + '</td></tr>';
            }
            str +='</table>';
            table.html(str);   
            createFooter(start_page,page_length,data.doc.length,1);          
        } else if (data.rt==5) {
           toLoginPage();
        }
    });
    currentpage = start_page;
}
// page页查询
function search(p,i) {
    if(i == 1){
        getDeviceList(p,10);
    } else {
        console.log(i);
    }
}
// 返回设备列表
function devicelist(){
    $('.device, .deviceinfo').css({'display':'none'});
    $('.devicelist').css({'display':'block'});
}
// 获取设备详细信息
function getDetail(i){
    var _tr = $('.devicetable table tr').eq(i+1);
    var devObj;
    var appObj1,appObj;
    var dev_info = _tr.find('td').eq(6).text();
    var app_list = _tr.find('td').eq(8).text() || '{}'; 
       
    var last_online = _tr.find('td').eq(4).text();   
    if(dev_info.length > 0 && dev_info != "undefined"){
        devObj = JSON.parse(dev_info);
        
        //appObj = appObj1.mAppinfolist; 
        $('.devicelist').css({'display':'none'});
        $('.device').css({'display':'block'});
        $('.deviceinfo').css({'display':'inline-block'});

        var devicename = _tr.find('td').eq(1).text(),
            lasttime = _tr.find('td').eq(4).text(),
            status = _tr.find('td').eq(5).text(),
            email = _tr.find('td').eq(2).text(),
            dev_id = _tr.find('td').eq(7).text();
        var strtab1 = '';
        var strtab4 = '';
        var strtab2 = '';

        $('.devicename').text('设备名称 : '+devicename);
        $('.lasttime').text('上一次在线时间 : '+lasttime);
        $('.imei').text('IMEI : '+devObj.imei);
        $('.status').text('目前状态 : '+status);
        var reset = '<li class="list-group-item" style="border:none;">'
                  + '<img class="img-circle" src="../imgs/reset.png" onclick="sendCmd(\'reset\',\''+dev_id+'\')"/></li>'
                  + '<li class="list-group-item" onclick="sendCmd(\'reset\',\''+dev_id+'\')" style="border:none;">擦除全部数据</li>';
        $('.reset').html(reset);
        var bell = '<li class="list-group-item" style="border:none;">'
                  + '<img class="img-circle" src="../imgs/bell.png" onclick="sendCmd(\'bell\',\''+dev_id+'\')"/></li>'
                  + '<li class="list-group-item" onclick="sendCmd(\'bell\',\''+dev_id+'\')" style="border:none;">响铃追踪</li>';
        $('.bell').html(bell);
        var lock = '<li class="list-group-item" style="border:none;">'
                  + '<img class="img-circle" src="../imgs/lock.png" onclick="sendCmd(\'lockscreen\',\''+dev_id+'\')"/></li>'
                  + '<li class="list-group-item" onclick="sendCmd(\'lockscreen\',\''+dev_id+'\')" style="border:none;">锁屏</li>';
        $('.lock').html(lock);
        var lockpwd = '<li class="list-group-item" style="border:none;"><input name="email" value="'+email+'" style="display:none;"/>'
                  + '<img class="img-circle" src="../imgs/lockpwd.png" onclick="updatescreenpw(\''+dev_id+'\')"/></li>'
                  + '<li class="list-group-item" onclick="updatescreenpw(\''+dev_id+'\')" style="border:none;">锁屏密码</li>';
        $('.lockpwd').html(lockpwd);

        // tab1 设备基本信息 
        var ulinfo1 = '<li class="list-group-item" style="border:none;">'+devObj.manufacture+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.screen_resolution+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.screen_size+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.system_language+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.battery+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.sim_supportor+'</li>';
        $('.ulinfo1').html(ulinfo1);
        var ulinfo2 = '<li class="list-group-item" style="border:none;">'+devObj.model_number+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.cpu_name+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.cpu_count+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.memory_total+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.phone_type+'</li>'
                    + '<li class="list-group-item" style="border:none;">'+devObj.serial+'</li>';
        $('.ulinfo2').html(ulinfo2);
        // tab2 设备网络信息
       
        var netinfo1 = '<li class="list-group-item" style="border:none;">'+devObj.devicemobileinfo.phone_number+'</li>'
            + '<li class="list-group-item" style="border:none;">'+devObj.devicemobileinfo.isrouting+'</li>'
            + '<li class="list-group-item" style="border:none;">'+devObj.devicemobileinfo.sim_provider+'</li>'
            + '<li class="list-group-item" style="border:none;">－－</li>';
        $('.netinfo1').html(netinfo1);
        var netinfo2 = '<li class="list-group-item" style="border:none;">－－</li>'
            + '<li class="list-group-item" style="border:none;">－－</li>'
            + '<li class="list-group-item" style="border:none;">－－</li>'
            + '<li class="list-group-item" style="border:none;">'+devObj.devicemobileinfo.network_type+'</li>';
        $('.netinfo2').html(netinfo2);
        var netinfo3 = '<li class="list-group-item" style="border:none;">'+devObj.devicemobileinfo.device_wifi_info.bssid+'</li>'
           // + '<li class="list-group-item" style="border:none;">'+devObj.devicemobileinfo.mDeviceWifiInfo.mIpAddress+'</li>';
            + '<li class="list-group-item" style="border:none;">'+devObj.devicemobileinfo.device_wifi_info.ip_address+'</li>';
        $('.netinfo3').html(netinfo3);
        var netinfo4 = '<li class="list-group-item" style="border:none;">'+lasttime+'</li>'
            + '<li class="list-group-item" style="border:none;">－－</li>';
        $('.netinfo4').html(netinfo4);
        // tab3 设备定位信息

        var sid = getCookie("sid");
        var url = hosturl + 'p/dev/uploadLocation?sid='+sid+'&dev_id=' +dev_id;
        $.get(url, function(data) {
            if (data.rt == 0) {
                var position = JSON.parse(data.position);
                if(position){
                    
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
                }else{
                    var map = new BMap.Map("addr");
                    map.centerAndZoom('北京', 12);
                  
                    var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_TOP_RIGHT});   //设置版权控件位置
                    map.addControl(cr); //添加版权控件
                    //添加缩略图控件
                    map.addControl(new BMap.OverviewMapControl({isOpen:false,anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
                    //添加缩放平移控件
                    map.addControl(new BMap.NavigationControl());
                    //添加比例尺控件
                    map.addControl(new BMap.ScaleControl());

                    var bs = map.getBounds();   //返回地图可视区域
                    cr.addCopyright({id: 1, content: "<a href='#' style='font-size:12px;color:red;'>登陆地址：没有上传登录地址！</a>", bounds: bs});  

                    map.disableScrollWheelZoom();
                    map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
                    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
                    warningOpen('设备未登陆或者定位，没有定位信息！','danger','fa-bolt');
                }   
            } else if (data.rt==5) {
               toLoginPage();
            }
        });
        // tab4 设备已安装app列表
        appObj1 = JSON.parse(app_list);
        appObj = appObj1.app_info_list;  
        console.log(appObj);
        strtab4 = '<table class="table table-hover"><tr>'
                + '<th>应用名称</th>'
                + '<th>应用包名称</th>'
                + '<th>版本</th>'
                + '<th>安全状态</th>'
                + '<th>来源</th></tr>';
        for(var i in appObj) { 
            strtab4 += '<tr>'
                + '<td>' + appObj[i].app_name + '</td>'
                + '<td>' + appObj[i].package_name + '</td>'
                + '<td>' + appObj[i].version_name + '</td>' 
                + '<td>－－</td>'
                + '<td>－－</td></tr>';
            }
        strtab4 +='</table>';
        $('.applist').html(strtab4);
    }else{
        warningOpen('设备没有详细信息信息！','danger','fa-bolt');
    }
}
// 单个设备推送
function sendCmd(cmd, dev_id){
    var dev_id = [dev_id];
    var postData = {
            dev_id: JSON.stringify(dev_id),
            opt_type: cmd
        };
        $.post('/man/device/sendCmd', postData, function(data) {
            if (data.rt == 0) {               
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    //var url = sendurl + "?id="+dev_id;
    //var xml = new XMLHttpRequest();
   // xml.open("POST", url, true);
   // xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
   // xml.send(cmd); 
}
// 设置锁屏密码
function updatescreenpw(dev_id){
    var email = $('input[name=email]').val();
    var security, min_len, checkpwd, warningtext = '';
     $.get('/man/device/orgGetPolicy?email='+ email, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            security = data.data.dev_security;
            min_len = security.pw_min_len;
            if(security.passwd_type == 1){
                checkpwd = /^[a-zA-Z]+$/; //字母
                warningtext = '请输入至少'+security.pw_min_len+ '位字母'; //提示
            } else if(security.passwd_type == 2){
                checkpwd = /^\d$/; //数字
                warningtext = '请输入至少'+security.pw_min_len+ '位数字'; //提示
            } else if(security.passwd_type == 3){
                console.log('min_len = dd = '+min_len);
                checkpwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,}$/; //字母和数字
                warningtext = '请输入至少'+security.pw_min_len+ '位字母和数字组合'; //提示
            } else{
                checkpwd = ''; //字母和数字
            }
        }
    });
    setTimeout(function(){
        var cont = '';  
            cont += '<div class="modal-header">'
                 + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                 + '<h4 class="modal-title">设置锁屏密码</h4>'
                 + '</div>'
                 + '<div class="modal-body">'
                 + '<p class="lockpwdwarning" style="color:red;text-align:center;">'+warningtext+'</p>'
                 + '<form role = "form" class="form-horizontal">'
                 + '<div class = "form-group">' 
                 + '<label class="col-sm-3 control-label" for = "screen_pw">锁屏密码</label>' 
                 + '<div class="col-sm-7">' 
                 + '<input type="password" class = "form-control" id = "screen_pw" name="screen_pw" placeholder = "请输入新密码"/>' 
                 + '</div></div>'
                 + '<div class = "form-group">' 
                 + '<label class="col-sm-3 control-label" for = "confirm">确认锁屏密码</label>' 
                 + '<div class="col-sm-7">' 
                 + '<input type="password" class = "form-control" id = "confirm" name="confirm" placeholder = "再次输入新密码"/>' 
                 + '</div></div>'
                 + '</form>'
                 + '</div>'
                 + '<div class="modal-footer">'
                 + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
                 + '<button type="button" class="btn btn-primary updscrpw" onclick="sendpw(\''+dev_id+'\')">确认</button>'
                 + '</div>';  
        alertOpen(cont);
        $('input[name=screen_pw],input[name=confirm]').keyup(function(){  // 输入限制，只能输入整数 
            if(security.passwd_type == 2){
                if (this.value.length==1) {
                    this.value=this.value.replace(/[^0-9]/g,'');
                } else {
                    this.value=this.value.replace(/\D/g,'');
                }
            } else if(security.passwd_type == 1){
                this.value=this.value.replace(/[^a-zA-Z]/g,'');
            } else if(security.passwd_type == 3){
                this.value=this.value.replace(/[\W]/g,'');
            }
            
        }); 
        $("input[name=screen_pw]").blur(function(){
            if(security.passwd_type == 1 || security.passwd_type == 2){
                if (this.value.length < min_len*1){
                    warningOpen('请输入正确格式锁屏密码！','danger','fa-bolt');
                    $(".updscrpw").attr("disabled",true);
                }else{$(".updscrpw").attr("disabled",false);}    
            }else if(security.passwd_type == 3){
                if (!checkpwd.test(this.value) || this.value.length < min_len*1){
                    warningOpen('确认锁屏密码格式错误！','danger','fa-bolt');
                    $(".updscrpw").attr("disabled",true);
                }else{$(".updscrpw").attr("disabled",false);}   

            }
        }); 
        $("input[name=confirm]").blur(function(){
            if(security.passwd_type == 1 || security.passwd_type == 2){
                if (this.value.length < min_len*1){
                    warningOpen('请输入正确格式锁屏密码！','danger','fa-bolt');
                    $(".updscrpw").attr("disabled",true);
                }else{$(".updscrpw").attr("disabled",false);}    
            }else if(security.passwd_type == 3){
                if (!checkpwd.test(this.value) || this.value.length < min_len*1){
                    warningOpen('确认锁屏密码格式错误！','danger','fa-bolt');
                    $(".updscrpw").attr("disabled",true);
                }else{$(".updscrpw").attr("disabled",false);}   

            }
        }); 
    }, 500);
}
// 锁屏密码推送
function sendpw(devid){
    var psw = $('input[name=screen_pw]').val();
    var confirm = $('input[name=confirm]').val();
    if(psw == ''){
        warningOpen('请输入锁屏密码！','danger','fa-bolt');
    }else if(psw != confirm){
        warningOpen('前后锁屏密码不一致！','danger','fa-bolt');
    }else{
        var cmd = 'chg_screen_pw <'+ psw +'>';
        var dev_id = [devid];
        var postData = {
                dev_id: JSON.stringify(dev_id),
                opt_type: cmd
            };
            $.post('/man/device/sendCmd', postData, function(data) {
                if (data.rt == 0) {               
                    warningOpen('操作成功！','primary','fa-check'); 
                } else if (data.rt==5) {
                    toLoginPage();
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
            }); 
       // sendCmd(cmd,devid);
       // alertOff();
       // warningOpen('操作成功！','primary','fa-check');
    }   
}
//一个或者多个设备消息推送
function send_cmds(cmd){
    var dev_id = [], i = 0, tr, email, security, checkpwd, warningtext = '', min_len;
    var cmd = cmd;
    var tab = $('.devicetable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            dev_id[i] = tr.find('td').eq(7).text();
            email = tr.find('td').eq(2).text();
            i = i+1;
        }     
    }); 
    
    if(dev_id.length > 0){
        if(cmd == 'chg_screen_pw') {
            if(dev_id.length === 1){
                $.get('/man/device/orgGetPolicy?email='+ email, function(data) {
                    data = JSON.parse(data);
                    if (data.rt==0) {
                        security = data.data.dev_security;
                        min_len = security.pw_min_len;
                        if(security.passwd_type == 1){
                            checkpwd = /^[a-zA-Z]+$/; //字母
                            warningtext = '请输入至少'+security.pw_min_len+ '位字母'; //提示
                        } else if(security.passwd_type == 2){
                            checkpwd = /^\d$/; //数字
                            warningtext = '请输入至少'+security.pw_min_len+ '位数字'; //提示
                        } else if(security.passwd_type == 3){
                            checkpwd = /^(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{2,}$/; //字母和数字
                            warningtext = '请输入至少'+security.pw_min_len+ '位字母和数字组合'; //提示
                        } else{
                            checkpwd = ''; //字母和数字
                        }
                    }
                });
                setTimeout(function(){
                    var cont = '';  
                        cont += '<div class="modal-header">'
                             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                             + '<h4 class="modal-title">设置锁屏密码</h4>'
                             + '</div>'
                             + '<div class="modal-body">'
                             + '<p class="lockpwdwarning" style="color:red;text-align:center;">'+warningtext+'</p>'
                             + '<form role = "form" class="form-horizontal">'
                             + '<div class = "form-group">' 
                             + '<label class="col-sm-3 control-label" for = "screen_pw">锁屏密码</label>' 
                             + '<div class="col-sm-7">' 
                             + '<input type="password" class = "form-control" id = "screen_pw" name="screen_pw" placeholder = "请输入新密码"/>' 
                             + '</div></div>'
                             + '<div class = "form-group">' 
                             + '<label class="col-sm-3 control-label" for = "confirm">确认锁屏密码</label>' 
                             + '<div class="col-sm-7">' 
                             + '<input type="password" class = "form-control" id = "confirm" name="confirm" placeholder = "再次输入新密码"/>' 
                             + '</div></div>'
                             + '</form>'
                             + '</div>'
                             + '<div class="modal-footer">'
                             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
                             + '<button type="button" class="btn btn-primary updscrpw" onclick="changesppw()">确认</button>'
                             + '</div>';  
                    alertOpen(cont);
                    $('input[name=screen_pw],input[name=confirm]').keyup(function(){  // 输入限制，只能输入整数 
                        if(security.passwd_type == 2){
                            if (this.value.length==1) {
                                this.value=this.value.replace(/[^0-9]/g,'');
                            } else {
                                this.value=this.value.replace(/\D/g,'');
                            }
                        } else if(security.passwd_type == 1){
                            this.value=this.value.replace(/[^a-zA-Z]/g,'');
                        } else if(security.passwd_type == 3){
                            this.value=this.value.replace(/[\W]/g,'');
                        }
                        
                    }); 
                    $("input[name=screen_pw]").blur(function(){
                        if(security.passwd_type == 1 || security.passwd_type == 2){
                            if (this.value.length < min_len*1){
                                warningOpen('请输入正确格式锁屏密码！','danger','fa-bolt');
                                $(".updscrpw").attr("disabled",true);
                            }else{$(".updscrpw").attr("disabled",false);}    
                        }else if(security.passwd_type == 3){
                            if (!checkpwd.test(this.value) || this.value.length < min_len*1){
                                warningOpen('确认锁屏密码格式错误！','danger','fa-bolt');
                                $(".updscrpw").attr("disabled",true);
                            }else{$(".updscrpw").attr("disabled",false);}   

                        }
                    }); 
                    $("input[name=confirm]").blur(function(){
                        if(security.passwd_type == 1 || security.passwd_type == 2){
                            if (this.value.length < min_len*1){
                                warningOpen('请输入正确格式锁屏密码！','danger','fa-bolt');
                                $(".updscrpw").attr("disabled",true);
                            }else{$(".updscrpw").attr("disabled",false);}    
                        }else if(security.passwd_type == 3){
                            if (!checkpwd.test(this.value) || this.value.length < min_len*1){
                                warningOpen('确认锁屏密码格式错误！','danger','fa-bolt');
                                $(".updscrpw").attr("disabled",true);
                            }else{$(".updscrpw").attr("disabled",false);}   

                        }
                    }); 
                }, 500);
            } else {
                warningOpen('请选择一个设备设置锁屏密码！','danger','fa-bolt');
            }
            
        } else {
            //for(var j=0;j<dev_id.length;j++){
            //    sendCmd(cmd,dev_id[j]);
            //}
            var postData = {
                dev_id: JSON.stringify(dev_id),
                opt_type: cmd
            };
            $.post('/man/device/sendCmd', postData, function(data) {
                if (data.rt == 0) {               
                    warningOpen('操作成功！','primary','fa-check'); 
                } else if (data.rt==5) {
                    toLoginPage();
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
            }); 
            //warningOpen('操作成功！','primary','fa-check');
        }        
    } else {
        warningOpen('请先选择设备！','danger','fa-bolt');
    }       
}
// 多个设备锁屏密码
function changesppw(){
    var dev_id = [], i = 0, tr;
    var tab = $('.devicetable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            dev_id[i] = tr.find('td').eq(7).text();
            i = i+1;
        }     
    });  
    var psw = $('input[name=screen_pw]').val();
    var confirm = $('input[name=confirm]').val();
    if(psw == ''){
        warningOpen('请输入锁屏密码！','danger','fa-bolt');
    }else if(psw != confirm){
        warningOpen('前后锁屏密码不一致！','danger','fa-bolt');
    }else{
        var cmd = 'chg_screen_pw <'+ psw +'>';
        var postData = {
                dev_id: JSON.stringify(dev_id),
                opt_type: cmd
            };
            $.post('/man/device/sendCmd', postData, function(data) {
                if (data.rt == 0) {   
                    alertOff();            
                    warningOpen('操作成功！','primary','fa-check'); 
                } else if (data.rt==5) {
                    toLoginPage();
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
            }); 
        //for(var j=0;j<dev_id.length;j++){
         //   sendCmd(cmd,dev_id[j]);
       // }
        //alertOff();
       // warningOpen('操作成功！','primary','fa-check');
    }     
}
// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getDeviceList(currentpage,10);
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.devicetable table');
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
             +  '<button type="button" class="btn btn-primary" onclick="device_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的设备！','danger','fa-bolt');
    }
}

// 企业管理员删除多个设备
function device_delete() {
    var dev_id = [],
            i = 0;
    var tr;
    var tab = $('.devicetable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            dev_id[i] = tr.find('td').eq(7).text();
            i = i+1;
        }     
    });  
    if(dev_id.length > 0){
        var postData = {
            dev_id: JSON.stringify(dev_id)
        };
        
        $.post('/man/device/delDevice', postData, function(data) {
            if (data.rt == 0) {
                warningOpen('操作成功！','primary','fa-check');
                alertOff();                
                getDeviceList(1,10);  
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }else{
        warningOpen('请选择设备！','danger','fa-bolt');
    }        
}