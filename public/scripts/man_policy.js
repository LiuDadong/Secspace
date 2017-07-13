/*
 * ==================================================================
 *                          策略管理 policy
 * ==================================================================
 */

$(function() {  
    $('.policymenu').addClass('open active');
    $('.policymenu').find('li').eq(0).addClass('active');
    // 策略列表  
    getPolicylist(1,10);
});
// 全局变量
var ulindex = 0;
var li_index = 0;
var wifiindex = 0;

// 策略列表
function getPolicylist(start_page,page_length){   
    var st = 1;
    var table = $('.policytable'),
        str = '<table class="table table-striped table-bordered table-hover" id="simpledatatable"><tr>'
           // + '<th class="sel" onclick="selectedAll(this)"><i class="fa"></i></th>'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>版本</th>'
            + '<th>创建时间</th>'
            + '<th>上一次修改时间</th>'
            + '<th>用户数量</th>'
            + '<th>其它</th></tr>';
   
    $.get('/man/policy/getPolicyList?start_page='+start_page + '&page_length='+ page_length, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.policies) {
                    str += '<tr>'
                       // + '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>'
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                        + '<td><a href="javascript:getDetail('+ i +');">' + data.policies[i].name + '</a></td>'
                        + '<td>' + data.policies[i].version + '</td>'
                        + '<td>' + data.policies[i].create_time + '</td>'
                        + '<td>' + data.policies[i].update_time + '</td>'
                        + '<td>' + data.policies[i].policy_use_num + '</td>'
                        + '<td style="display:none;">' + data.policies[i].id + '</td>' 
                        + '<td style="display:none;">' + JSON.stringify(data.policies[i].dev_limit) + '</td>'
                        + '<td style="display:none;">' + JSON.stringify(data.policies[i].dev_security) + '</td>'    
                        + '<td style="display:none;">' + JSON.stringify(data.policies[i].network) + '</td>'   
                        + '<td style="display:none;">' + JSON.stringify(data.policies[i].wifi) + '</td>'             
                        + '<td>'                
                        + '<a href="javascript:dispatch_policy('+ i +');">策略下发</a>&nbsp;&nbsp;&nbsp;&nbsp;'
                        + '<a href="javascript:cancel_policy('+ i +');">策略取消</a>&nbsp;&nbsp;&nbsp;&nbsp;'
                        + '<a href="javascript:policy_modify('+ i +');">修改信息</a>'
                        + '</td></tr>';                
            }
            str +="</table>";
            table.html(str);    
            createFooter(start_page,page_length,data.total_count,st); 
        } else if (data.rt==5) {
           toLoginPage();
        }
    });
    currentpage = start_page;
}
// page页查询
function search(p,i) {
    if(i == 1){
        getPolicylist(p,10);
    } else if(i == 2){
        getUserList(p,10,'');
    } else if(i == 3){
        getDepartList(p,10);
    } else{
        console.log(i);
    }
}
// 返回策略列表
function policylist(){
    $('.issuedlist, .pissued, .detail, .policyset, .cancellist, .pissued2').css({'display':'none'});
    $('.policylist').css({'display':'block'});
    tabreset();
}
// 获取策略详细信息
function getDetail(i) {
    ulindex = 0;
    li_index = 0;
    wifiindex = 0;
    $('.policylist').css({'display':'none'});
    $('.detail').css({'display':'block'});
    $('.policyset').css({'display':'inline-block'});
    $('input[type=checkbox]').attr("checked",'true');
    var _tr = $('.policytable table tr').eq(i+1),
        policyname = _tr.find('td').eq(1).text(),
        policy_id = _tr.find('td').eq(6).text(),
        version = _tr.find('td').eq(2).text(),
        tab = $('.tab-content');
    var dev_limit = _tr.find('td').eq(7).text();        
    var devLimitObj = JSON.parse(dev_limit);
    var dev_security = _tr.find('td').eq(8).text();
    var devSecurityObj = JSON.parse(dev_security);
    var network = _tr.find('td').eq(9).text();   
    var networkObj = JSON.parse(network);
    var wifi = _tr.find('td').eq(10).text(); 
    var wifilistObj = JSON.parse(wifi);
    $('input[name=policy_id]').val(policy_id);
    $('input[name=version]').val(version);
    $('input[name=policyname]').val(policyname);
    $('.policyname').html('<h5>策略名称：'+policyname+'</h5>');
    var isChecked = document.getElementById('camera').checked;
    console.log(isChecked);
    //$(document).ready(function(){
        // deviceLimit tab
        document.getElementById('camera').checked = devLimitObj.camera == 1 ? true : false;
        document.getElementById('bluetooth').checked = devLimitObj.bluetooth == 1 ? true : false;
        document.getElementById('recording').checked = devLimitObj.recording == 1 ? true : false;
        document.getElementById('gps').checked = devLimitObj.gps == 1 ? true : false;
        document.getElementById('mockLoc').checked = devLimitObj.mockLocation == 1 ? true : false;
        document.getElementById('notifications').checked = devLimitObj.notifications == 1 ? true : false;
        // securityPolicy tab
        if(devSecurityObj.lock_type == 0){
            $("#locktype").find("option").attr("selected",false);
        }  else {
            $("#locktype").find("option").eq(devSecurityObj.lock_type-1).attr("selected",true);
        }
        if(devSecurityObj.passwd_type == 0){
            $("#passwdtype").find("option").eq(7).attr("selected",true);
        } else {
            $("#passwdtype").find("option").eq(devSecurityObj.passwd_type-1).attr("selected",true);
        }
        $('#securityPolicy').find('input[name=pwdlength]').val(devSecurityObj.pw_min_len);
        $('#securityPolicy').find('input[name=failtimes]').val(devSecurityObj.pw_fail_count);
        $('#securityPolicy').find('input[name=available_time]').val(devSecurityObj.available_time);
        $('#securityPolicy').find('input[name=pw_validity]').val(devSecurityObj.pw_validity);
        // domainPolicy tab
        document.getElementById('only_emergency_phone').checked = networkObj.only_emergency_phone == 1 ? true : false;
        document.getElementById('mms').checked = networkObj.mms == 1 ? true : false;
        document.getElementById('data_backup').checked = networkObj.data_backup == 1 ? true : false;
        $("#allow_mobile_network").find("option").eq(networkObj.allow_mobile_network-1).attr("selected",true);
        $("#allow_wifi").find("option").eq(networkObj.allow_wifi-1).attr("selected",true);
        var ul = $('#domainPolicy #listul');
        var wifiObj = networkObj.wifi_whitelist;
        for(var i in wifiObj){
          
            ul.find('#li'+ ulindex +' input[name=wifilistname]').val(wifiObj[i].sid);  
            for(var d in wifiObj[i].mac){  
                if(d == 0){
                    $('#li'+ ulindex +' .selli').addClass('radic');
                }
                var s = document.getElementById('uli'+ulindex);
                var li = document.createElement("li");
                li.id = 'l' + li_index;
                li.className = 'list-group-item';
                var lid = 'l' + li_index;
                
                var txt = '<input type="text" class="form-control input-sm" name="wifimac" value="'+wifiObj[i].mac[d]+'"/>'
                        + '<a href="javascript:adduli('+lid+')"><img src="../imgs/pa.png"></img></a>'
                        + '<a href="javascript:deletelis('+lid+')"><img src="../imgs/pd.png"></img></a>';
                li.innerHTML = txt; 
                s.appendChild(li);
                li_index = li_index + 1;
            }
            addli(-1);
        }

        var wifilist = $('#wifiPolicy #wifi');    
        for(var j in wifilistObj) {
            wifilist.find('#wifili'+ wifiindex +' input[name=wifiname]').val(wifilistObj[j].ssid);  
            wifilist.find('#wifili'+ wifiindex +' select[name="wifi_type"]').find("option").eq(wifilistObj[j].type).attr("selected",true);
            wifilist.find('#wifili'+ wifiindex +' input[name=pwds]').val(wifilistObj[j].password); 
            addwifili();        
        }
        
   // });
}
// 提交策略修改
function subdetail(){ 
    var dev_limit = {};
    var security = {};
    var postData = {};
        security["lock_type"] = $('select[name=lock_type]').val();
        security["passwd_type"] = $('select[name=passwdtype]').val();
        security["pw_min_len"] = $('input[name=pwdlength]').val();
        security["pw_fail_count"] = $('input[name=failtimes]').val();
        security["pw_validity"] = $('input[name=pw_validity]').val();
        security["available_time"] = $('input[name=available_time]').val();

        dev_limit["camera"] = document.getElementById('camera').checked == true ? 1 : 0;
        dev_limit["bluetooth"] = document.getElementById('bluetooth').checked == true ? 1 : 0;
        dev_limit["recording"] = document.getElementById('recording').checked == true ? 1 : 0;
        dev_limit["gps"] = document.getElementById('gps').checked == true ? 1 : 0;
        dev_limit["mockLocation"] = document.getElementById('mockLoc').checked == true ? 1 : 0;
        dev_limit["notifications"] = document.getElementById('notifications').checked == true ? 1 : 0;

    var allow_mobile_network = $('select[name=allow_mobile_network]').val();
    var allow_wifi = $('select[name=allow_wifi]').val();
    var only_emergency_phone = document.getElementById('only_emergency_phone').checked == true ? 1 : 0;
    var mms = document.getElementById('mms').checked == true ? 1 : 0;
    var data_backup = document.getElementById('data_backup').checked == true ? 1 : 0;
    var wifi_whitelist = [], w = 0;
    var ul = $('#domainPolicy #listul');
    ul.find("li[id^='li']").each(function () {
        if ($(this).find('input[name=wifilistname]').val()) {
            var wflist = [], i = 0, wifiobj = {};
            if($(this).find('.selli').hasClass('radic')){

                $(this).find("ul[id^='uli'] li").each(function () {
                    if($(this).find('input').val()){
                        wflist[i] = $(this).find('input').val();
                        i = i + 1;
                    }

                });
            }
               
            wifiobj.sid = $(this).find('input[name=wifilistname]').val(); 
            wifiobj.mac = wflist;    
            wifi_whitelist[w] = wifiobj;   
            w = w + 1;
        }     
    });  
    var network = {
            mms: mms,
            data_backup: data_backup,
            only_emergency_phone: only_emergency_phone,
            allow_mobile_network: allow_mobile_network,
            allow_wifi: allow_wifi,
            wifi_whitelist: wifi_whitelist
        };
    var wifi = [], wifiliobj = {}, k = 0;
    var wifiul = $('#wifiPolicy #wifi');
    wifiul.find("li[id^='wifili']").each(function () {
        wifiliobj = {};
        if ($(this).find('input[name=wifiname]').val() && $(this).find('select[name=wifi_type]').val() && $(this).find('input[name=pwds]').val()) {
            wifiliobj.ssid = $(this).find('input[name=wifiname]').val();
            wifiliobj.type = $(this).find('select[name=wifi_type]').val();
            wifiliobj.password = $(this).find('input[name=pwds]').val();
            wifi[k] = wifiliobj;   
            k = k + 1; 
        }     
    }); 
    postData = {
        id: $('input[name=policy_id]').val(),
        name: $('input[name=policyname]').val(),
        version: $('input[name=version]').val(),
        dev_limit: JSON.stringify(dev_limit),
        dev_security: JSON.stringify(security),
        network: JSON.stringify(network),
        wifi: JSON.stringify(wifi)
    };

    $.post('/man/policy/updatePolicy', postData, function(data) {
        if (data.rt==0) {
            warningOpen('操作成功！','primary','fa-check');
            getPolicylist(currentpage,10);
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
}
// 添加Wi-Fi 白名单
function addli(n){
    var s = document.getElementById('listul');
    var t=s.childNodes.length;
    var li= document.createElement("li");
    ulindex = ulindex + 1;
    li.id = 'li'+ulindex;
    li.className = 'list-group-item';
    var id = 'li'+ulindex;

    var txt = '<input type="text" class="form-control input-sm" name="wifilistname"/>'
            + '<a href="javascript:addli('+(-1)+')"><img src="../imgs/pa.png"></img></a>'
            + '<a href="javascript:deleteli('+id+')"><img src="../imgs/pd.png"></img></a>'
            + '<div class="select"><div class="selli" onclick="selectli(this)"></div><label>对应MAC地址</label></div>'
            + '<ul class="list-group" id="uli'+ulindex+'"></ul>';
    li.innerHTML = txt;      
    s.appendChild(li);
}
// 添加二级白名单
function selectli(e){
    if ($(e).hasClass('radic')) {
        $(e).removeClass('radic');        
        $(e).parent().parent().find('ul li').remove();
    } else {
        $(e).addClass('radic');
        var id = $(e).parent().parent().find('ul').attr("id");
        var s = document.getElementById(id);
        var li = document.createElement("li");
        li.id = 'l' + li_index;
        li.className = 'list-group-item';
        var lid = 'l' + li_index;
        var txt = '<input type="text" class="form-control input-sm" name="wifil"/>'
                + '<a href="javascript:adduli('+lid+')"><img src="../imgs/pa.png"></img></a>'
                + '<a href="javascript:deletelis('+lid+')"><img src="../imgs/pd.png"></img></a>';
        li.innerHTML=txt; 
        s.appendChild(li);
       li_index = li_index + 1;
    }
}
// 添加二级Wi-Fi白名单
function adduli(lid){
    var id = $(lid).parent().attr("id");
    var s = document.getElementById(id);
    var li = document.createElement("li");  
    li.id = 'l' + li_index;
    li.className = 'list-group-item';
    var lid = 'l' + li_index;
    var txt = '<input type="text" class="form-control input-sm" name="wifil"/>'
            + '<a href="javascript:adduli('+lid+')"><img src="../imgs/pa.png"></img></a>'
            + '<a href="javascript:deletelis('+lid+')"><img src="../imgs/pd.png"></img></a>';
    li.innerHTML = txt; 
    s.appendChild(li);      
    li_index = li_index + 1;
}
// 添加Wi-Fi li 
function addwifili(){
    var s = document.getElementById('wifi');
    var t=s.childNodes.length;
    var li= document.createElement("li");
    wifiindex = wifiindex + 1;
    li.id = 'wifili'+wifiindex;
    li.className = 'list-group-item';
    var id = 'wifili'+wifiindex;
   
    var txt = '<h5>WI-FI 基础配置信息</h5>'
            + '<div class="row" style="height:50px;">'
            + '<label  class="col-xs-3 col-md-3" style="line-height:30px;"> WI-FI 名词:</label>'
            + '<div class="col-xs-9 col-md-9">'
            + '<input style="width:200px;" type="text" class="form-control input-sm" name="wifiname"/>'
            + '</div></div>'
            + '<div class="row" style="height:50px;">'
            + '<label  class="col-xs-3 col-md-3" style="line-height:30px;"> WI-FI 类型:</label>'
            + '<div class="col-xs-9 col-md-9">'
            + '<select style="width:200px;padding:0;" class="form-control input-sm" name="wifi_type">'
            + '<option value="">请选择</option>'
            + '<option value="1">Open</option>'
            + '<option value="2">WEP</option>'
            + '<option value="3">WPA/WPA2PSK</option>'
            + '</select>'
            + '</div></div>'
            + '<div class="row wi_fi" style="height:50px;">'
            + '<label  class="col-xs-3 col-md-3" style="line-height:30px;"> 密钥:</label>'
            + '<div class="col-xs-9 col-md-9">'
            + '<input type="text" class="form-control input-sm" name="pwds"/>'
            + '<a href="javascript:addwifili()"><img src="../imgs/pa.png"></img></a>'
            + '<a href="javascript:deleteli('+id+')"><img src="../imgs/pd.png"></img></a>'
            + '</div></div>';
    li.innerHTML=txt;   
    s.appendChild(li);
}

// 删除Wi-Fi 白名单
function deleteli(id){
    id.remove();
}
// 删除Wi-Fi 二级白名单
function deletelis(id){    
    var length = $(id).parent().children('li').length;
    if(length <= 1){
        $(id).parent().parent().find('.selli').removeClass('radic');
    }
    id.remove();
}
function tabreset(){
    $(".detail").find("input[type='text']").val("");
    $("#domainPolicy li[id^='li']").not("#li0").remove(); 
    $("#uli0 li").remove();
    $("#wifiPolicy li[id^='wifili']").not("#wifili0").remove(); 
}
// 下发策略
function dispatch_policy(i) {
    $('.policylist').css({'display':'none'});
    $('.issuedlist').css({'display':'block'});
    $('.pissued').css({'display':'inline-block'});
    var _tr = $('.policytable tr').eq(i+1),
        policy_id = _tr.find('td').eq(6).text();
    $('.tabbable').find('input[name=policyid]').val(policy_id);
    getUserList(1,10,''); // 该策略没有下发的用户列表
    getDepartList(1,10);// 该策略没有下发的部门列表
}
// 取消策略
function cancel_policy(i) {
    $('.policylist').css({'display':'none'});
    $('.cancellist').css({'display':'block'});
    $('.pissued2').css({'display':'inline-block'});
    var _tr = $('.policytable tr').eq(i+1),
        policy_id = _tr.find('td').eq(6).text();
    $('.tabbable').find('input[name=policy_id]').val(policy_id);
    getUserList(1,10,''); // 该策略已经下发的用户列表
    getDepartList(1,10); // 该策略已经下发的部门列表
}
// 获取用户列表
function getUserList(start,length,keyword){
    var strtab1 = '<table class="table table-striped table-bordered table-hover"><tr>'
               // + '<th class="sel" onclick="selectedAll(this)"><i class="fa"></i></th>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
                + '<th>用户名</th>'
                + '<th>用户邮箱</th>'
                + '<th>策略id</th></tr>';
    var st = 2;
    var str = '';
    var userurl = '/man/user/getUserList?start='+ start + '&length='+ length;
        userurl += keyword?'&keyword=' + keyword : '';
    var policyid = $('input[name=policyid]').val();
    $.get(userurl, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.user_list) {
                // str = data.user_list[i].policy_id == policyid ? '<td class="sel" onclick="selected(this)"><i class="fa fa-check"></i></td>' : '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>';
                strtab1 += '<tr>'
                        //+ str
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                        + '<td>' + data.user_list[i].name + '</td>'
                        + '<td>' + data.user_list[i].email + '</td>'
                        + '<td style="display:none;" name = "userid" value="'+data.user_list[i].id+'">' + data.user_list[i].id + '</td>'
                        + '<td>' + data.user_list[i].policy_id + '</td></tr>';               
            }
            strtab1 += '</table>';
            $('.usertable').html(strtab1);
            createFooter(start,length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });
}

// 获取部门列表
function getDepartList(start_page,page_length){
    var st = 3;
    var strtab2 = '<table class="table table-striped table-bordered table-hover"><tr>'
                //+ '<th class="sel" onclick="selectedAll(this)"><i class="fa"></i></th>'
                + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
                + '<th>部门名称</th>'
                + '<th>部门领导</th>'
                + '<th>策略id</th></tr>',
        depurl = '/man/dep/getDepartList?start_page=' + start_page + '&page_length=' + page_length; 
    var str = '';
    var policyid = $('input[name=policyid]').val();
    $.get(depurl, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.depart_list) {
                //str = data.depart_list[i].policy_id == policyid ? '<td class="sel" onclick="selected(this)"><i class="fa fa-check"></i></td>' : '<td class="sel" onclick="selected(this)"><i class="fa"></i></td>';
                strtab2 += '<tr>'
                        //+ str
                        + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                        + '<td>' + data.depart_list[i].name + '</td>'
                        + '<td>' + data.depart_list[i].leader + '</td>'
                        + '<td>' + data.depart_list[i].policy_id + '</td>'   
                        + '<td style="display:none;">' + data.depart_list[i].id + '</td></tr>';   
            }
            strtab2 += '</table>'; 
            $('.departtable').html(strtab2);
            createFooter(start_page,page_length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });  
}
//给部门或者用户分配策略进行提交
function subbtn(){
    var userId = [], departId = [], i = 0, j = 0, tr;
    var postData = {};

    // 用户分配策略
    if($("#users").hasClass('active')){ 
        var tab1 = $('.usertable');
            tab1.find('td span').each(function () { 
                if ($(this).hasClass('txt')) {
                    tr = $(this).parents("tr");
                    userId[i] = tr.find('td').eq(3).text()*1;
                    i = i+1;
                }    
            });
    }

    // 部门分配策略 
    if($("#departs").hasClass('active')){
        var tab2 = $('.departtable');        
            tab2.find('td span').each(function () { 
                if ($(this).hasClass('txt')) {
                    tr = $(this).parents("tr");
                    departId[j] = tr.find('td').eq(4).text()*1;
                    j = j+1;
                }
            });
    }

    // 策略提交 
    if(userId.length > 0 || departId.length > 0) {
        if(userId.length > 0){
            postData = {
                policyId: $('input[name=policyid]').val(),
                boundState: 1,
                userId: JSON.stringify(userId)
            };
        }
        if(departId.length > 0){
            postData = {
                policyId: $('input[name=policyid]').val(),
                boundState: 1,
                departId: JSON.stringify(departId)
            };
        }    
        $.post('/man/org/boundPolicy', postData, function(data) {
            if (data.rt == 0) {
                warningOpen('操作成功！','primary','fa-check');
            } else if (data.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });
    } else {
        warningOpen('请先选择策略分配对象！','danger','fa-bolt');
    }
}

// 修改策略
function policy_modify(i){
    var _tr = $('.policytable table tr').eq(i+1);
    var name = _tr.find('td').eq(1).text();
    var version = _tr.find('td').eq(2).text();
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">修改策略</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">策略名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" value="'+name+'"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "version1">策略版本</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "number" size="16" class = "form-control" id = "version1" name="version1" value = "'+version+'"/>' 
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="policy_update('+i+')">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 修改策略信息提交
function policy_update(i) { 
    var _tr = $('.policytable table tr').eq(i+1);
    var id = _tr.find('td').eq(6).text();
    var name = $('input[name=name]').val();
    var version = $('input[name=version1]').val();
    var postData = {
        id: id,
        name: name,
        version: version
    };
    console.log("veruewo="+version);
    if (!postData.name) {
        warningOpen('策略名不能为空！','danger','fa-bolt');
    } else if (!postData.version) {
        warningOpen('策略版本不能为空！','danger','fa-bolt');
    } else {  
        $.post('/man/policy/updatePolicy', postData, function(data) {
            if (data.rt==0) {
                alertOff();
                warningOpen('操作成功！','primary','fa-check');
                getPolicylist(currentpage,15);
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！');
            }
        });
    }
}
// 添加策略
function add(){
    var cont = '';
        cont += '<div class="modal-header">'
             + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
             + '<h4 class="modal-title">添加策略</h4>'
             + '</div>'
             + '<div class="modal-body">'
             + '<form role = "form" class="form-horizontal">'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "name">策略名称</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "text" class = "form-control" id = "name" name="name" placeholder = "请输入策略名称"/>' 
             + '</div></div>'
             + '<div class = "form-group">' 
             + '<label class="col-sm-3 control-label" for = "versionnumber">策略版本</label>' 
             + '<div class="col-sm-7">' 
             + '<input type = "number" size="16" class = "form-control" id = "versionnumber" name="versionnumber" placeholder = "请输入策略版本"/>' 
             + '</div></div>'
             + '</form>'
             + '</div>'
             + '<div class="modal-footer">'
             + '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="alertOff()">取消</button>'
             + '<button type="button" class="btn btn-primary" onclick="addpolicy()">确认</button>'
             + '</div>';  
    alertOpen(cont);
}
// 添加策略提交
function addpolicy(){
    var name = $('input[name=name]').val();
    var version = $('input[name=versionnumber]').val();
    var dev_security = {};
        dev_security["lock_type"] = "0";
        dev_security["passwd_type"] = "0";
        dev_security["pw_min_len"] = "6";
        dev_security["pw_fail_count"] = "3";
        dev_security["pw_validity"] = "0";
    var dev_limit = {};
        dev_limit["camera"] = 0; 
        dev_limit["bluetooth"] = 0;
        dev_limit["recording"] = 0; 
        dev_limit["gps"] = 0; 
        dev_limit["mockLocation"] = 0;
        dev_limit["notifications"] = 0;
    var network = {
        mms: 0,
        data_backup: 0,
        only_emergency_phone: 0,
        allow_mobile_network: '',
        allow_wifi: '',
        wifi_whitelist: []
    };
    var wifi = [], 
    wifiobj = {
        password: '',
        type: '',
        ssid: ''
    };
    wifi[0] = wifiobj;
    var postData = {
            name: name,
            version: version,
            dev_limit: JSON.stringify(dev_limit),
            dev_security: JSON.stringify(dev_security),
            network: JSON.stringify(network),
            wifi: JSON.stringify(wifi)
        };
    if (postData.name == "") {
        warningOpen('请输入策略名！！','danger','fa-bolt');
    } else if(postData.version == ""){
        warningOpen('请输入策略版本！','danger','fa-bolt');
    } else {
        $.post('/man/user/add_policy', postData, function(data) {
            if (data.rt==0) {
                warningOpen('操作成功！','primary','fa-check');
                alertOff();
                getPolicylist(currentpage,10);
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
}
// 刷新
function refresh() {
    $('th span,td span').removeClass('txt');
    getPolicylist(currentpage,10);
}
// 删除
function deletes(){
    var i = 0;
    var tab = $('.policytable table');
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
             +  '<button type="button" class="btn btn-primary" onclick="policy_delete()">确认</button>'
             +  '</div>'; 
        alertOpen(cont);
    } else {
        warningOpen('请选择要删除的账号！','danger','fa-bolt');
    }
}

// 企业管理员删除多个策略
function policy_delete() {
    var policyId = [],
            i = 0;
    var tr;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            policyId[i] = tr.find('td').eq(6).text()*1;
            i = i+1;
        }     
    });  
    if(policyId.length > 0){
        var postData = {
            id: JSON.stringify(policyId)
        };
        
        $.post('/man/policy/policyDel', postData, function(data) {
            if (data.rt == 0) {
                alertOff(); 
                warningOpen('操作成功！','primary','fa-check');                
                getPolicylist(1,10);  
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }else{
        warningOpen('请选择策略！','danger','fa-bolt');
    }        
}
