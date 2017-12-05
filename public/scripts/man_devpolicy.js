/*
 * ==================================================================
 *                          设备策略 devpolicy
 * ==================================================================
 */

$(function() {
    $('.policymenu').addClass('open active');
    $('.policymenu').find('li').eq(0).addClass('active');
    // 设备策略列表
    getPolicyList(1,10);
    $("select#position_strategy").change(function(){
        if($(this).val() == 3){

            if(!($('input[name=gps2]').attr("checked"))){

                $('input[name=gps1]').attr("disabled",true);
                $('input[name=gps1]').parent().find('span').removeClass('txt');
                $('input[name=gps1]').attr("checked",false);
                $('input[name=gps2]').attr("disabled",false);
                $('input[name=gps2]').click();
            }

        } else {

            if(!($('input[name=gps1]').attr("checked"))){
                $('input[name=gps2]').attr("disabled",true);
                $('input[name=gps2]').parent().find('span').removeClass('txt');
                $('input[name=gps2]').attr("checked",false);
                $('input[name=gps1]').attr("disabled",false);
                $('input[name=gps1]').click();
            }
        }
    }); 
});
// 全选按钮
function selectedAll(e) {
    var table = $(e).parents('table');
    var all = $(table).find('.checkbox input[type=checkbox]'),
        tag = 0;
    var tr = table.find('tr').eq(1);
    var status = 0;
    for (var i=1; i<all.length; i++) {
        if ($(all[i]).attr("checked")) {
            tag = tag + 1;
            break;
        }
    }
    if(tr.find('td').eq(1).text() === '默认策略'){
        status = 1;
    }
    
    if (tag === 0 && status === 0) {
        $(table).find('.checkbox input[type=checkbox]').attr("checked",true);
        $(table).find('.checkbox span').addClass("txt");
        $('.hrefactive').addClass("hrefallowed");
    } else if (tag === 0 && status === 1){
        $(table).find('.checkbox input[type=checkbox]').attr("checked",true);
        $(table).find('.checkbox span').addClass("txt");
    } else {
        $(table).find('.checkbox input[type=checkbox]').attr("checked",false);
        $(table).find('.checkbox span').removeClass("txt");
        $('.hrefactive').removeClass("hrefallowed");
    }
}    
// 选择按钮
function selected(e) {
    var i = 0;
    var tr = $(e).parents('table').find('tr').eq(1);
    if ($(e).attr("checked")) {
        $('th input[type=checkbox]').attr("checked",false);
        $('th .checkbox span').removeClass('txt');
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
    
    }
    if(tr.find('span').hasClass('txt') && tr.find('td').eq(1).text() === '默认策略'){
        i = 0;
    } else if($(e).parents('table').find('span').hasClass('txt')){
        i = 1;
    } else {
        
    }
    i === 0 ? $('.hrefactive').removeClass("hrefallowed") : $('.hrefactive').addClass("hrefallowed");
}
function cancelalltree(e){
    $(e).next().css({'display':'inline-block'});
    $(e).css({'display':'none'});

}
function selectalltree(e){
    $(e).prev().css({'display':'inline-block'});
    $(e).css({'display':'none'});
    getUserList(1,10,'',$('.usertable'),2,2);
    $('#treegroup').find('li .faopen').hide(); 
}
function opentree(e){
    $(e).next().css({'display':'inline-block'});
    $('#treegroup').css({'display':'inline-block'});
    $(e).css({'display':'none'});

}
function closetree(e){
    $(e).prev().css({'display':'inline-block'});
    $(e).css({'display':'none'});
    $('#treegroup').css({'display':'none'});
}
// 添加
function add(){
    reset();
    $('.devpolicylist, .modbtn, .viewbtn').css({'display':'none'});
    $('.devpolicy_add,.addbtn, .addwifibtn').css({'display':'block'});
    $('.addpolicy').css({'display':'inline-block'});
    $('select[name=position_strategy],select[name=passwd_type]').val(1);
    $('select[name=pw_min_len]').val(6);
    $('select[name=pw_fail_count], select[name=available_time]').val(0);
    $('input[name=gps1]').attr("disabled",false);
    $('input[name=gps1]').click();
}

function reset(){
    $('.devpolicy_add input').val('');
    $('.devpolicy_add select').val('');
    $('.devpolicy_add input[type=checkbox]').attr("checked",false);
    $('.devpolicy_add input[type=checkbox]').attr("disabled",false);
    $('.devpolicy_add .adddiv span').removeClass('txt');
    $('.devpolicy_add .wifilist').not(':first').remove();
}

// 限制策略选择
function checkthis(e){
    if($(e).attr("checked")) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
    }
}

function checkwifi(e){
    if($(e).attr("checked") || $('input[name=mobile_data]').attr("checked")) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
        $('input[name=mobile_data]').attr("disabled",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
        $('input[name=mobile_data]').attr("disabled",true);
    }
}

function checkmobile(e){
    if($(e).attr("checked") || $('input[name=wifi]').attr("checked")) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
        $('input[name=wifi]').attr("disabled",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
        $('input[name=wifi]').attr("disabled",true);
    }
}

function checkgps1(e){
    if($(e).attr("checked") || $('input[name=gps2]').attr("checked")) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
        $('input[name=gps2]').attr("disabled",false);
    } else {
        $('input[name=gps2]').attr("disabled",true);
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
    }
}

function checkgps2(e){
    if($(e).attr("checked") || $('input[name=gps1]').attr("checked")) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
        $('input[name=gps1]').attr("disabled",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
        $('input[name=gps1]').attr("disabled",true);
    }
}

// 提交添加策略
function add_policy(){ 
    var dev_limit = {};
    var dev_security = {};
    var postData = {};
    var position_strategy = $('select[name=position_strategy]').val();
        dev_security["pw_min_len"] = $('select[name=pw_min_len]').val();
        dev_security["passwd_type"] = $('select[name=passwd_type]').val();
        dev_security["pw_fail_count"] = $('select[name=pw_fail_count]').val();
        dev_security["available_time"] = $('select[name=available_time]').val();

        dev_limit["camera"] = document.getElementById('camera').checked == true ? 1 : 0;
        dev_limit["wifi"] = document.getElementById('wifi').checked == true ? 1 : 0;
        dev_limit["recording"] = document.getElementById('recording').checked == true ? 1 : 0;
        dev_limit["bluetooth"] = document.getElementById('bluetooth').checked == true ? 1 : 0;
        dev_limit["gps"] = document.getElementById('gps1').checked == true ? 1 : 0;
        dev_limit["mobile_data"] = document.getElementById('mobile_data').checked == true ? 1 : 0;
        dev_limit["screenshot"] = document.getElementById('screenshot').checked == true ? 1 : 0;
        dev_limit["setfactory"] = document.getElementById('setfactory').checked == true ? 1 : 0;
        dev_limit["message"] = document.getElementById('message').checked == true ? 1 : 0;
        dev_limit["phone"] = document.getElementById('phone').checked == true ? 1 : 0;

    var status = document.getElementById('status').checked == true ? 1 : 0;

    var wifi = [], wifiliobj = {}, k = 0;
    var wifiul = $('.wifi_list');
    wifiul.find(".wifilist").each(function () {
        wifiliobj = {}
        if ($(this).find('input[name=ssid]').val() && $(this).find('input[name=password]').val()) {
            wifiliobj.ssid = $(this).find('input[name=ssid]').val();
            wifiliobj.password = $(this).find('input[name=password]').val();
            wifi[k] = wifiliobj;   
            k = k + 1; 
        }     
    });
    var wifilist = {
        status: status,
        wifi: wifi
    }
    dev_limit["gps"] = position_strategy == 3 ? 0 : 1;
    postData = {
        name: $('input[name=name]').val(),
        position_strategy: position_strategy,
        dev_limit: JSON.stringify(dev_limit),
        dev_security: JSON.stringify(dev_security),
        wifi: JSON.stringify(wifilist)
    };

    $.post('/man/devpolicy/add_policy', postData, function(data) {
        if (data.rt==0) {
            policylist();
            warningOpen('操作成功！','primary','fa-check');
            getPolicyList(currentpage,10);
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
    var usedstr;
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

    var url = '/man/devpolicy/getDevpolicyList?start_page='+ start + '&page_length='+ length;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.policies) {
                status = data.policies[i].status == 1 ? '启用' : '禁用';
                usedstr = data.policies[i].name === '默认策略' ? '<a> -- / -- </a>':
                '<a href="javascript:devusers('+ i +');">' + data.policies[i].used + ' / ' + data.policies[i].issued +'</a>';
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input>'
                    + '<span class="text"></span></label></div></td>'
                    + '<td>' + data.policies[i].name + '</td>'
                    + '<td>设备策略</td>'
                    + '<td>' + status + '</td>'
                    + '<td>' + data.policies[i].creator + '</td>'  
                    + '<td>' 
                    + usedstr
                    + '</td>'  
                    + '<td>' + data.policies[i].update_time + '</td>'
                    + '<td style="display:none;">' + data.policies[i].id + '</td>' 
                    + '<td style="display:none;">' + data.policies[i].position_strategy + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].dev_limit) + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].dev_security) + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].wifi) + '</td>' 
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
    $('.devpolicy_add, .addpolicy, .devpolicy_mod, .modpolicy,.devpolicy_view, .viewpolicy, .issuedlist, .issuedpolicy').css({'display':'none'});
    $('.devpolicylist').css({'display':'block'});
    reset();
    $('.devpolicy_add input').attr("disabled",false);
    $('.devpolicy_add select').attr("disabled",false);
    $('.devpolicy_add input[type=checkbox]').attr("disabled",false);
}

// 编辑
function modify(i){
    var tr = $('.policytable table tr').eq(i+1);
    var id = tr.find('td').eq(7).text(); 
    var name = tr.find('td').eq(1).text(); 
    var position_strategy = tr.find('td').eq(8).text(); 
    var dev_limit = tr.find('td').eq(9).text();        
    var devLimitObj = JSON.parse(dev_limit);
    var dev_security = tr.find('td').eq(10).text();
    var devSecurityObj = JSON.parse(dev_security);
    var wifi = tr.find('td').eq(11).text(); 
    var wifilistObj = JSON.parse(wifi);
    var wifilist = wifilistObj.wifi;

    $('.devpolicylist, .addbtn, .viewbtn').css({'display':'none'});
    $('.devpolicy_add,.modbtn, .addwifibtn').css({'display':'block'});
    $('.modpolicy').css({'display':'inline-block'});
    $('input[name=policyid]').val(id);
    $('input[name=name]').val(name);
    $('select[name=position_strategy]').val(position_strategy);

    $('select[name=pw_min_len]').val(devSecurityObj.pw_min_len);
    $('select[name=passwd_type]').val(devSecurityObj.passwd_type);
    $('select[name=pw_fail_count]').val(devSecurityObj.pw_fail_count);
    $('select[name=available_time]').val(devSecurityObj.available_time);
    if(devLimitObj.gps == 1) {
        document.getElementById('gps1').checked = true;
        document.getElementById('gps2').checked = false;
        $('input[name=gps2]').attr("disabled",true);
    } else {
        document.getElementById('gps2').checked = true;
        document.getElementById('gps1').checked = false;
        $('input[name=gps1]').attr("disabled",true);
    }
    if(devLimitObj.wifi == 1) {
        document.getElementById('mobile_data').checked = false;
        $('input[name=mobile_data]').attr("disabled",true);
    }
    if(devLimitObj.mobile_data == 1) {
        document.getElementById('wifi').checked = false;
        $('input[name=wifi]').attr("disabled",true);
    }
    document.getElementById('camera').checked = devLimitObj.camera == 1 ? true : false;
    document.getElementById('bluetooth').checked = devLimitObj.bluetooth == 1 ? true : false;
    document.getElementById('recording').checked = devLimitObj.recording == 1 ? true : false;
    document.getElementById('wifi').checked = devLimitObj.wifi == 1 ? true : false;
    document.getElementById('mobile_data').checked = devLimitObj.mobile_data == 1 ? true : false;
    document.getElementById('screenshot').checked = devLimitObj.screenshot == 1 ? true : false;
    document.getElementById('setfactory').checked = devLimitObj.setfactory == 1 ? true : false;
    document.getElementById('message').checked = devLimitObj.message == 1 ? true : false;
    document.getElementById('phone').checked = devLimitObj.phone == 1 ? true : false;
    document.getElementById('status').checked = wifilistObj.status == 1 ? true : false;
    
    // wifi tab
    var wifiitem= $('.wifi_list');
    for(var k = 0; k < wifilist.length - 1; k++){
        wifilist_add();
    }    
    for(var j in wifilist) {
        $('.wifilist').eq(j).find('input[name=ssid]').val(wifilist[j].ssid);  
        $('.wifilist').eq(j).find('input[name=password]').val(wifilist[j].password);        
    }
}

// 编辑提交
function mod_policy(){
    var dev_limit = {};
    var dev_security = {};
    var postData = {};
    var position_strategy = $('select[name=position_strategy]').val();
        dev_security["pw_min_len"] = $('select[name=pw_min_len]').val();
        dev_security["passwd_type"] = $('select[name=passwd_type]').val();
        dev_security["pw_fail_count"] = $('select[name=pw_fail_count]').val();
        dev_security["available_time"] = $('select[name=available_time]').val();

        dev_limit["camera"] = document.getElementById('camera').checked == true ? 1 : 0;
        dev_limit["wifi"] = document.getElementById('wifi').checked == true ? 1 : 0;
        dev_limit["recording"] = document.getElementById('recording').checked == true ? 1 : 0;
        dev_limit["bluetooth"] = document.getElementById('bluetooth').checked == true ? 1 : 0;
        dev_limit["gps"] = document.getElementById('gps1').checked == true ? 1 : 0;
        dev_limit["mobile_data"] = document.getElementById('mobile_data').checked == true ? 1 : 0;
        dev_limit["screenshot"] = document.getElementById('screenshot').checked == true ? 1 : 0;
        dev_limit["setfactory"] = document.getElementById('setfactory').checked == true ? 1 : 0;
        dev_limit["message"] = document.getElementById('message').checked == true ? 1 : 0;
        dev_limit["phone"] = document.getElementById('phone').checked == true ? 1 : 0;

    var status = document.getElementById('status').checked == true ? 1 : 0;

    var wifi = [], wifiliobj = {}, k = 0;
    var wifiul = $('.wifi_list');
    wifiul.find(".wifilist").each(function () {
        wifiliobj = {};
        if ($(this).find('input[name=ssid]').val() && $(this).find('input[name=password]').val()) {
            wifiliobj.ssid = $(this).find('input[name=ssid]').val();
            wifiliobj.password = $(this).find('input[name=password]').val();
            wifi[k] = wifiliobj;   
            k = k + 1; 
        }     
    });
    var wifilist = {
        status: status,
        wifi: wifi
    }
    dev_limit["gps"] = position_strategy == 3 ? 0 : 1; 
    postData = {
        id: $('input[name=policyid]').val()*1,
        name: $('input[name=name]').val(),
        position_strategy: position_strategy,
        dev_limit: JSON.stringify(dev_limit),
        dev_security: JSON.stringify(dev_security),
        wifi: JSON.stringify(wifilist)
    };

    if(postData.name == '') {
        warningOpen('名称不能为空！','danger','fa-bolt');
    } else {
        $.post('/man/devpolicy/updatePolicy', postData, function(data) {
            if (data.rt == 0) { 
                policylist();
                getPolicyList(currentpage,10); 
                warningOpen('修改成功！','primary','fa-check');      
            } else if (data.rt==5) {
                toLoginPage();
            } else if (data.rt==15) {
                warningOpen('策略名称重复！','danger','fa-bolt');
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        }); 
    }
}

// 查看详细信息
function view(i){
    modify(i);
    $('.devpolicylist,.modbtn, .addbtn, .modpolicy, .addwifibtn, .deleteicon').css({'display':'none'});
    $('.devpolicy_add, .viewbtn').css({'display':'block'});
    $('.viewpolicy').css({'display':'inline-block'});
    $('.devpolicy_add input').attr("disabled",true);
    $('.devpolicy_add select').attr("disabled",true);
    $('.devpolicy_add input[type=checkbox]').attr("disabled",true);

}

// 策略列表查看已下发用户
function devusers(i) {
    var tr = $('.policytable table tr').eq(i+1);
    var id = tr.find('td').eq(7).text()*1; 
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
    var userurl = '/man/devpolicy/getUserByPolicyId?id='+ id;
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
    var postData = {
            uid: uid,
            policy_id: policy_id
        };
    $.post('/man/devpolicy/unbindPolicy', postData, function(data) {
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

// 策略下发
function auth(){
    var list = [],i = 0;
    var status = 1;
    var tr;
    var tab1 = $('.usertable');
    var tab2 = $('.tagusertable');
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            list[i] = tr.find('td').eq(7).text()*1;
            i = i+1;
            if(tr.find('td').eq(12).text() == 0){
                status = 0;
            }
        }     
    });  
    if(list.length === 1 && status === 1 && list[0] != 1000){
        $('.devpolicylist').css({'display':'none'});
        $('.issuedlist').css({'display':'block'});
        $('.issuedpolicy').css({'display':'inline-block'});
        $('.tabbable').find('input[name=policy_id]').val(list[0]);
        getUserList(1,10,'',tab1,2,2); 
        getUserList(1,10,'',tab2,3,2);
        searchuserlist();
        searchtaglist();
        //$('#treegroup').css({'display':'none'});
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
            + '<div class ="tree-item-name" style="font-size:14px;color:#666;">'
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
                user_list: JSON.stringify(user_list)
            };
        } else if(depart_id){
            postData = {
                policy_id: policy_id,
                depart_id: depart_id
            };
        } else {
            postData = {
                policy_id: policy_id,
                tag_id: tag_id
            };
        }
        $.post('/man/devpolicy/boundPolicy', postData, function(data) {
            if (data.rt == 0) {
                warningOpen('操作成功！','primary','fa-check');        
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

// 添加编辑页面，添加Wi-Fi项
function wifilist_add(){
    var s = $('.wifilist:last');
    var div1 = document.createElement("div");  
    div1.className = 'wifilist';
    var txt1 = '<div class="row">'
            + '<div class="form-group">'
            + '<div class="col-lg-6 col-xs-6 col-sm-8 col-lg-offset-3 col-xs-offset-3 col-sm-offset-2">'
            + '<label class="control-label" style="width:110px;padding-left:22px;">SSID</label>'
            + '<div class="adddiv" style="left: 140px;">'
            + '<input type="text" class="form-control" name="ssid" />'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="row"><div class="form-group">'
            + '<div class="col-lg-6 col-xs-6 col-sm-8 col-lg-offset-3 col-xs-offset-3 col-sm-offset-2">'
            + '<label class="control-label" style="width:110px;padding-left:22px;">密码</label>'
            + '<div class="adddiv" style="left: 140px;">'
            + '<input type="text" class="form-control" name="password" />'
            + '</div>'
            + '</div>'
            + '<div class="col-lg-2 col-xs-2 col-sm-1 deleteicon" style="font-size:18px;line-height:34px;">'
            + '<a onclick="deleteswifi(this)"><i class="fa fa-minus-circle primary"></i></a>'
            + '</div>'
            + '</div>'
            + '</div>';
           
    div1.innerHTML = txt1;  
    s.after(div1);
}

// 添加编辑页面删除Wifi项
function deleteswifi(that){
    $(that).parents('.wifilist').remove();
}

// 启用/禁用
function activate(status){
    var list = [],
            i = 0;
    var tr;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if(tr.find('td').eq(7).text()*1 != 1000){
                list[i] = tr.find('td').eq(7).text()*1;
                i = i+1;
            } else {
                warningOpen('默认策略不能启用禁用！','danger','fa-bolt');
            }
            
        }     
    });  
    if(list.length > 0){
        var postData = {
            status: status,
            ids: JSON.stringify(list)
        };       
        $.post('/man/devpolicy/changePolicyStatus', postData, function(data) {
            if (data.rt == 0) {               
                getPolicyList(currentpage,10);  
                warningOpen('操作成功！','primary','fa-check'); 
            } else if (data.rt==5) {
                toLoginPage();
            } else if (data.rt==17) {
                var strtab1 = '<table class="table table-hover">'
                            + '<caption style="margin-bottom:10px;color:red;">请先从围栏策略将设备策略取消再禁用设备策略</caption><tr>'
                            + '<th>策略名称</th>'
                            + '<th>类型</th>'
                            + '<th>状态</th>'
                            + '<th>创建时间</th>'
                            + '</tr>';
                var cont = '';
                var status;
                var policy_type;
                for(var i in data.data) {
                    status = data.data[i].status == 1 ? '已启用' : '已禁用';
                    if(data.data[i].policy_type === 'geofence'){
                        policy_type = '地理围栏策略';
                    } else if(data.data[i].policy_type === 'device'){
                        policy_type = '设备策略';
                    } else if(data.data[i].policy_type === 'complicance'){
                        policy_type = '合规策略';
                    } else if(data.data[i].policy_type === 'timefence'){
                        policy_type = '时间围栏策略';
                    } else {
                        policy_type = '';
                    }
                    strtab1 += '<tr>'
                            + '<td>' + data.data[i].name + '</td>'
                            + '<td>' + policy_type + '</td>'
                            + '<td>' + status + '</td>'
                            + '<td>' + data.data[i].create_time + '</td></tr>';              
                }
                strtab1 += '</table>';
                cont += '<div class="modal-header">'
                     + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="alertOff()">×</button>'
                     + '<h4 class="modal-title">设备策略已被围栏策略启用列表</h4>'
                     + '</div>'
                     + '<div class="modal-body" style="max-height:340px;overflow-y:auto;">'
                     + strtab1
                     + '</div>'
                     + '<div class="modal-footer">'
                     + '<button type="button" class="btn btn-primary" onclick="alertOff()">确认</button>'
                     + '</div>';  
                alertOpen(cont);
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
    var i = 0, status = 0, defaultpolicy = 0;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            if(tr.find('td').eq(12).text() == 1){
                status = 1;
            }
            if(tr.find('td').eq(7).text() == 1000 && tr.find('td').eq(1).text() == '默认策略'){
                defaultpolicy = 1;
            }
            i = 1;
        }     
    });     
    var cont = '';
    if(i>0 && status === 0 && status === 0){
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
    var list = [],
            i = 0;
    var tr;
    var tab = $('.policytable table');
    tab.find('td span').each(function () {
        if ($(this).hasClass('txt')) {
            tr = $(this).parents("tr");
            list[i] = tr.find('td').eq(7).text()*1;
            i = i+1;
        }     
    });  
    if(list.length > 0){
        var postData = {
            id: JSON.stringify(list)
        };       
        $.post('/man/devpolicy/policyDel', postData, function(data) {
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
