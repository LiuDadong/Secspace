/*
 * ==================================================================
 *                          用户策略管理 per_policy
 * ==================================================================
 */

$(function() { 

    // 用户策略详细信息
    getDetail();     
    $('.layout-right .top .right .search input').val('');
});

// 用户所分配策略详细信息
function getDetail(){
    var tab = $('.layout .layout-right .center .policy .detail');

    var strtab1 = '<div name="pwdtype" class="span"><span class="span1">密码类型</span>'
            + '<div class="select_box">'
            + '<input id="selecttext" type="text" value="" name="passwdtype" readonly="readonly"/>'
            + '</div></div>'            
            + '<div class="span"><span class="span1">密码最小长度</span>'
            + '<div class="select_box">'
            + '<input id="selecttext" type="text" name="pwdlength" value="" readonly="readonly">'
            + '</div></div>'
            + '<div class="span"><span class="span1">密码有误次数</span>'
            + '<div class="select_box">'
            + '<input id="selecttext" type="text" name="failtimes" value="" readonly="readonly">'
            + '</div></div>';

    var strtab2 = '<div class="span"><span  class="span1">相机</span><div class="scheck" id="camera"><div class="secheck"></div></div></div>'
            + '<div class="span"><span class="span1">蓝牙</span><div class="scheck" id="bluetooth"><div class="secheck"></div></div></div>'
            + '<div class="span"><span class="span1">无线</span><div class="scheck" id="wifi"><div class="secheck"></div></div></div>'
            + '<div class="span"><span class="span1">GPS</span><div class="scheck" id="gps"><div class="secheck"></div></div></div>'
            + '<div class="span"><span class="span1">模拟位置</span><div class="scheck" id="mockLoc"><div class="secheck"></div></div></div>'
            + '<div class="span"><span class="span1">通知</span><div class="scheck" id="notification"><div class="secheck"></div></div></div>';
    
    var str = '<div id="tab_bar"><ul>'
            + '<li id="tab1" class="tabswitch" onclick="deviceLimit()" style="width:auto;">设备设置</li> '
            + '<li id="tab2" onclick="securityPolicy()" style="width:auto;margin-left:100px;">安全策略</li></ul></div>'                           
            + '<div class="tab_css" id="tab1_content" style="display: block">'
            + '<div class="tab1">'
            + strtab2
            + '</div></div>'
            + '<div class="tab_css" id="tab2_content"> '
            + '<div class="tab2>'
            + strtab1
            + '</div></div> ';
    var tabpolicy = '<div class="tabpolicy"><div id="policyinfo"><label>策略名称 ：</label><span style="margin-left:10%;"><label>策略版本 ：</label></span></div>' 
            + str + '</div>';
    tab.html(tabpolicy);

    //window.setTimeout(list(),100);
   // function list(){ 
        if(localStorage.length>0){
            var inform = localStorage.getItem("data1");
            var informs = JSON.parse(inform);
            var info = informs.doc;
            var policy = info.policy;
            if(policy.hasOwnProperty('name')) { 
                var policyname = policy.name;
                var version = policy.version;
                var dev_limit = policy.dev_limit;
                var dev_security = policy.dev_security;
                $('.tabpolicy #policyinfo').html('<label>策略名称 ：'+policyname+'</label><span style="margin-left:10%;"><label>策略版本 ：'+version+'</label></span>');

                if(dev_security.passwd_type == 0){
                    $('.select_box').find('input[name=passwdtype]').val('不设密码');
                } else if (dev_security.passwd_type == 1) {
                    $('.select_box').find('input[name=passwdtype]').val('字母');
                } else if(dev_security.passwd_type == 2) {
                    $('.select_box').find('input[name=passwdtype]').val('字母,数字');
                } else if(dev_security.passwd_type == 3) {
                    $('.select_box').find('input[name=passwdtype]').val('Biowetric weak');
                } else if(dev_security.passwd_type == 4) {
                    $('.select_box').find('input[name=passwdtype]').val('字母、数字、特殊字符');
                } else if(dev_security.passwd_type == 5) {
                    $('.select_box').find('input[name=passwdtype]').val('必须有数字');
                } else if(dev_security.passwd_type == 6) {
                    $('.select_box').find('input[name=passwdtype]').val('Numeric Complex');
                } else {
                    $('.select_box').find('input[name=passwdtype]').val('Something');
                }
                $('.select_box').find('input[name=pwdlength]').val(dev_security.pw_min_len);
                $('.select_box').find('input[name=failtimes]').val(dev_security.pw_fail_count);

                if(dev_limit.bluetooth == 1){
                    $('#bluetooth').addClass('securitycheck');
                    $('#bluetooth .secheck').addClass('sechecked');
                }
                if(dev_limit.camera == 1){
                    $('#camera').addClass('securitycheck');
                    $('#camera .secheck').addClass('sechecked');
                }
                if(dev_limit.gps == 1){
                    $('#gps').addClass('securitycheck');
                    $('#gps .secheck').addClass('sechecked');
                }
                if(dev_limit.mockLocation == 1){
                    $('#mockLoc').addClass('securitycheck');
                    $('#mockLoc .secheck').addClass('sechecked');
                }
                if(dev_limit.notifications == 1){
                    $('#notification').addClass('securitycheck');
                    $('#notification .secheck').addClass('sechecked');
                }
                if(dev_limit.wifi == 1){
                    $('#wifi').addClass('securitycheck');
                    $('#wifi .secheck').addClass('sechecked');
                }
            } else{
                warningOpen('此账号没有邦定策略！');
            }
        }
   // }
    $('.layout .layout-right .center .policy #tab_bar #tab1').css({'border-bottom':'3px solid #63B2E6','color':'#666666'}); 
}

// 设备限制策略tab
function deviceLimit(){
    myclick(1);
}

// 安全策略tab
function securityPolicy(){  
    myclick(2);      
}
