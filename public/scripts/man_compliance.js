/*
 * ==================================================================
 *                          合规策略 compliance
 * ==================================================================
 */

$(function() {
    $('.policymenu').addClass('open active');
    $('.policymenu').find('li:eq(1)').addClass('active');
    // 合规策略列表
    getPolicyList(1,10);
    $("select[id^='item']").change(function(){
        if($(this).val() == 1){
            $(this).parents('.complicance_item').find('.os_version').css({'display':'block'});
        } else {
            $(this).parents('.complicance_item').find('.os_version').css({'display':'none'});
        }
    });
    $('#delay').keyup(function(){
        var c = $(this);
        var temp_amount = c.val().replace(/[^\d]/g, '');
        // 判断范围
        temp_amount = temp_amount < 1 ? 1 : temp_amount > 72 ? 72 : temp_amount;
        $(this).val(temp_amount);
    });
});
var item = 1;

// 添加
function add(){
    reset();
    $('.policylist, .modbtn, .viewbtn').css({'display':'none'});
    $('.policy_add,.addbtn, .addtypebtn, .additem').css({'display':'block'});
    $('.addpolicy').css({'display':'inline-block'});
    $('select[name=compliance_type]').val(1);
    $('select[name=os_version]').val(19);
}
// 添加编辑页面，添加合规项
function compliance_item_add(){
    var s = $('.complicance_item:last');
    var div1 = document.createElement("div");  
    div1.className = 'complicance_item';
    var txt1 = '<div class="row col-xs-12 col-md-12" style="margin-bottom:0px;">'
            + '<div class="form-group">'
            + '<div class="col-lg-6 col-xs-6 col-sm-8 col-lg-offset-3 col-xs-offset-3 col-sm-offset-2">'
            + '<label class="control-label" style="width:110px;padding-left:22px;">合规项</label>'
            + '<div class="adddiv" style="left: 140px;">'
            + '<select class="form-control" name="compliance_type" id="item_'+item+'">'
            + '<option class="option" value="1">系统版本过低</option>'
            + '<option class="option" value="2">SIM卡变更</option>'
            + '<option class="option" value="3">Rooted</option>'
            + '</select>'
            + '</div>'
            + '</div>'
            + '<div class="os_version col-lg-2 col-xs-2 col-sm-2">'
            + '<select class="form-control" name="os_version">'
            + '<option class="option">请选择...</option>'
            + '<option class="option" value="19">Android 4.4 (API 19)</option>'
            + '<option class="option" value="21">Android 5.0 (API 21)</option>'
            + '<option class="option" value="22">Android 5.1 (API 22)</option>'
            + '<option class="option" value="23">Android 6.0 (API 23)</option>'
            + '<option class="option" value="24">Android 7.0 (API 24)</option>'
            + '<option class="option" value="25">Android 7.1.1 (API 25)</option>'
            + '</select>'
            + '</div>'
            + '<a onclick="deleteitem(this)" style="line-height:34px;font-size:18px;margin-left:10px;" class="deleteicon">'
            + '<i class="fa fa-minus-circle primary"></i></a>'
            + '</div>'
            + '</div>';
           
    div1.innerHTML = txt1;  
    s.after(div1);
    $("select[id^='item']").change(function(){
        if($(this).val() == 1){
            $(this).parents('.complicance_item').find('.os_version').css({'display':'block'});
        } else {
            $(this).parents('.complicance_item').find('.os_version').css({'display':'none'});
        }
    });
    item = item + 1;
}

// 添加编辑页面删除合规项
function deleteitem(that){
    $(that).parents('.complicance_item').remove();
}
// 默认
function reset(){
    $('.policy_add input').val('');
    $('.policy_add select').val('');
    $('.policy_add input[type=checkbox]').attr("checked",false);
    $('.policy_add .adddiv span').removeClass('txt');
    $('.policy_add .complicance_item').not(':first').remove();
    item = 1;
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

// 提交添加策略
function add_policy(){ 
    var violation_limit = {};
    var complicance_item = {
        rooted: 0,
        sim: 0,
        sys_low: 0,
        os_version: ''
    };
    var postData = {};
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
    itemlist.find(".complicance_item").each(function () {
        var itemval = $(this).find('select[name=compliance_type]').val();
        if (itemval == 1) {
            complicance_item.sys_low = 1;
            complicance_item.os_version = $(this).find('select[name=os_version]').val();
        } else if (itemval == 2){
            complicance_item.sim = 1;
        } else if(itemval == 3){
             complicance_item.rooted = 1;
        } else {}   
    });
    postData = {
        name: $('input[name=name]').val(),
        delay: $('input[name=delay]').val(),
        violation_limit: JSON.stringify(violation_limit),
        complicance_item: JSON.stringify(complicance_item)
    };
    if (postData.name =='') {
        warningOpen('请输入名称！','danger','fa-bolt');
    } else if (postData.delay =='') {
        warningOpen('请输入延迟时间！','danger','fa-bolt');
    } else if(violation_limit["alarm"] == 0){
        warningOpen('违规告警至少必选一项！','danger','fa-bolt');
    } else { 
        $.post('/man/complicance/add_policy', postData, function(data) {
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
}

var st = 2;
// 策略列表
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

    var url = '/man/complicance/getPolicyList?start_page='+ start + '&page_length='+ length;
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
                    + '<td>合规策略</td>'
                    + '<td>' + status + '</td>'
                    + '<td>' + data.policies[i].creator + '</td>'  
                    + '<td>' 
                    + usedstr
                    + '</td>'  
                    + '<td>' + data.policies[i].update_time + '</td>'
                    + '<td style="display:none;">' + data.policies[i].id + '</td>' 
                    + '<td style="display:none;">' + data.policies[i].delay + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].violation_limit) + '</td>' 
                    + '<td style="display:none;">' + JSON.stringify(data.policies[i].complicance_item) + '</td>' 
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
    var tr = $('.policytable table tr').eq(i+1);
    var id = tr.find('td').eq(7).text(); 
    var name = tr.find('td').eq(1).text(); 
    var delay = tr.find('td').eq(8).text(); 

    var violation_limit = tr.find('td').eq(9).text();        
    var limitObj = JSON.parse(violation_limit);
    var complicance_item = tr.find('td').eq(10).text();
    var complicanceObj = JSON.parse(complicance_item);

    $('.policylist, .addbtn, .viewbtn').css({'display':'none'});
    $('.policy_add,.modbtn, .additem').css({'display':'block'});
    $('.modpolicy').css({'display':'inline-block'});
    $('input[name=policyid]').val(id);
    $('input[name=name]').val(name);
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
    } else{
        document.getElementById('mesg').checked = false;
        document.getElementById('email').checked = false;
    }

    var length = 0;
    var list = [];
    if(complicanceObj.sys_low){
        length = list.push(1);
    }
    if(complicanceObj.sim){
        length = list.push(2);
    }
    if(complicanceObj.rooted){
        length = list.push(3);
    }
    for(var k = 0; k < length - 1; k++){
        compliance_item_add();
    } 
    for(var j in list) {
        $('.complicance_item').eq(j).find('select[name=compliance_type]').val(list[j]);
        if(list[j] === 1){
            $('.complicance_item').eq(j).find('select[name=os_version]').val(complicanceObj.os_version);
            $('.complicance_item').eq(j).find('.os_version').css({'display':'block'});
        } else {
            $('.complicance_item').eq(j).find('.os_version').css({'display':'none'});
        }
    } 
}

// 编辑提交
function mod_policy(){
    var violation_limit = {};
    var complicance_item = {
        rooted: 0,
        sim: 0,
        sys_low: 0,
        os_version: ''
    };
    var postData = {};
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
    itemlist.find(".complicance_item").each(function () {
        var itemval = $(this).find('select[name=compliance_type]').val();
        if (itemval == 1) {
            complicance_item.sys_low = 1;
            complicance_item.os_version = $(this).find('select[name=os_version]').val();
        } else if (itemval == 2){
            complicance_item.sim = 1;
        } else if(itemval == 3){
             complicance_item.rooted = 1;
        } else {}   
    });
    postData = {
        id: $('input[name=policyid]').val()*1,
        name: $('input[name=name]').val(),
        delay: $('input[name=delay]').val(),
        violation_limit: JSON.stringify(violation_limit),
        complicance_item: JSON.stringify(complicance_item)
    };
    if (postData.name =='') {
        warningOpen('请输入名称！','danger','fa-bolt');
    } else if (postData.delay =='') {
        warningOpen('请输入延迟时间！','danger','fa-bolt');
    } else if(violation_limit["alarm"] == 0){
        warningOpen('违规告警至少必选一项！','danger','fa-bolt');
    } else { 
        $.post('/man/complicance/updatePolicy', postData, function(data) {
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
}

// 查看详细信息
function view(i){
    modify(i);
    $('.policylist,.modbtn, .addbtn, .modpolicy, .additem, .deleteicon').css({'display':'none'});
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
    var userurl = '/man/complicance/getUserByPolicyId?id='+ id;
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
    $.post('/man/complicance/unbindPolicy', postData, function(data) {
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
            if(tr.find('td').eq(11).text() == 0){
                status = 0;
            }
        }     
    });  
    if(list.length === 1 && status === 1){
        $('.policylist').css({'display':'none'});
        $('.issuedlist').css({'display':'block'});
        $('.issuedpolicy').css({'display':'inline-block'});
        $('.tabbable').find('input[name=policy_id]').val(list[0]);
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
        $.post('/man/complicance/boundPolicy', postData, function(data) {
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

// 启用/禁用
function activate(status){
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
            status: status,
            ids: JSON.stringify(list)
        };       
        $.post('/man/complicance/changePolicyStatus', postData, function(data) {
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
            if(tr.find('td').eq(11).text() == 1){
                status = 1;
            }
            if(tr.find('td').eq(7).text() == 1000 && tr.find('td').eq(1).text() == '默认策略'){
                defaultpolicy = 1;
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
        $.post('/man/complicance/policyDel', postData, function(data) {
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
