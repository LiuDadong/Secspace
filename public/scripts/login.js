var wrap_login_form=$('#wrap_login_form');
var wrap_modpw_form=$('#wrap_modpw_form');

//判断是否已经采用初始密码通过登录验证
if($.cookie('firLogin')=='0'){  //是  则强制修改初始密码
    wrap_login_form.hide();
    wrap_modpw_form.show();
}else{                          //否  则强制修改初始密码
    wrap_modpw_form.hide();
    wrap_login_form.show();
}

var b64 = new Base64();

$.get('/p/login/getProductName', function (data) {
    data = JSON.parse(data);
    if (data.rt == '0000') {
        $('h3.product-name').html(data.product_name);
    } else {
        $('h3.product-name').html('移动安全管理平台');
    }
});


//表单初始化
// 获取网络ip
if(typeof returnCitySN!=="undefined"){  //
    $('input[name=dev_ip]').val(returnCitySN.cip);
}else{
    getIPs(function(ip){$('input[name=dev_ip]').val(ip);});
}


//登录账号输入时间
$('input[name=account]').on('input change propertychange', function () {
    var manager= $(this).val().replace(' ','');
    $(this).val(manager);
    if(manager){
        $.local('manager',manager);
    }else{
        $.removeLocal('manager');
    }
});
//登录表单是否记住密码复选框变动事件
$('input.savepw').on('input change propertychange', function () {
    if(!$(this).prop('checked')){
        $.removeLocal('account');
        $.removeLocal('passwd');
        $.removeLocal('_account');
        $.removeLocal('_passwd');
    }
});


//渲染上次成功登录的账号和密码（如果存在的话）
if ($.local('account') && $.local('passwd')) {
    $('input.savepw').prop('checked', true);
    $('input[name=account]').val($.local('account')).change();
    $('input[name=passwd]').val(b64.decode($.local('passwd')));
}else{
    $('input[name=account]').val(' ')
    setTimeout(function(){
        $('input[name=account]').val('').change().focus();
        $('input[name=passwd]').val('');
    },100)
}





// 登录表单
wrap_login_form.find('form').ajaxForm({
    type: "POST",
    dataType: 'json',
    beforeSubmit: function () {
        if ($('input.savepw').prop('checked')) {
            preSaveAccPw(); 
        }
        if ($('input[name=account]').val() == '') {
            alert('请输入账号！');
            return false;
        } else if ($('input[name=passwd]').val() == '') {
            alert('请输入密码！');
            return false;
        }
    },
    success: function (data) {
        var errorText = '';
        console.log(data);
        switch (data.rt) {
            case '0000':    //登录成功
                saveAccPw();
                $.cookie('sid', data.sid);  //必须 登录session标识
                $.cookie('firLogin', data.firLogin);    //必须 初始密码登录标识
                $.cookie('dev_ip', $('input[name=dev_ip]').val()); //必须 设备IP
                $.cookie('org_id', data.org);       //必须 当前被访问机构ID（随着）  在线时期切换机构会改变其值
                $.cookie('userId', data.userId);    //必须 登录的管理员身份标识
                $.local("name", data.name);         //管理员姓名
                $.local("avatar", data.avatar ? data.avatar : '');      //管理员头像
                $.local("icon", data.icon);                             //产品logo
                $.local("product_name", data.product_name);     //产品名称
                $.local("appssec_url", data.manager_url);       //服务器根目录的绝对路径
                $.local("roles", JSON.stringify(data.serverModules));   //业务管理员所配置的角色信息
                $.local("org_id", data.org);  //必须 当前登入管理员责任机构id   在线时期保持不变
                location.href = "/";
                break;
            default:
                errorText = data.desc;
        }
        if (errorText) {
            console.error(errorText);
            alert(errorText);
        }
    },
    error: function (err) {
        console.error(err);
        alert(err);
    }
});

// 修改初始密码表单
wrap_modpw_form.find('form').ajaxForm({
    type: "POST",
    dataType: 'json',
    beforeSubmit: function () {
        if ($('input.savepw').prop('checked')) {
            preSaveAccPw();
        }
        if ($('input[name=old_passwd]').val() == '') {
            alert('请输入初始密码！');
            return false;
        } else if ($('input[name=new_passwd]').val() == '') {
            alert('请输入新密码！');
            return false;
        } else if ($('input[same-with=new_passwd]').val() !== $('input[name=new_passwd]').val()) {
            $('input[same-with=new_passwd]').val('');
            $('input[name=new_passwd]').val('').focus();
            alert('两次输入的新密码不一致，请重新输入！');
            return false;
        } else {}
    },
    success: function (data) {
        var errorText = '';
        switch (data.rt) {
            case '0000':    //登录成功
                saveAccPw();
                $.cookie('firLogin','1');
                location.href = "/";
                break;
            default:
                errorText = data.desc;
        }
        if (errorText) {
            console.error(errorText);
            alert(errorText);
        }
    },
    error: function (err) {
        console.error(err);
        alert(err);
    }
});



function preSaveAccPw(){ //检查登录信息
    if ($('input.savepw').prop('checked')) {
        if($('input[name=passwd]').is(':visible')){
            if(
                $.local('account')===undefined
                ||$.local('passwd')===undefined
                ||$('input[name=account]').val()!==$.local('account')
                ||$('input[name=passwd]').val()!==b64.decode($.local('passwd'))
            ){
                $.local('_account', $('input[name=account]').val());
                $.local('_passwd',b64.encode($('input[name=passwd]').val()));
            }
        }else{
            $.local('_passwd',b64.encode($('input[name=new_passwd]').val()));
        }
    }

}

function saveAccPw(){ //登录成功之后正式保存预存的账号和密码
    if($.local('_account')){
        $.local('account', $.local('_account'));
        $.removeLocal('_account');
    }
    if($.local('_passwd')){
        $.local('passwd', $.local('_passwd'));
        $.removeLocal('_passwd');
    }
}
function getIPs(callback){
    var ip_dups = {};
    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
    || window.mozRTCPeerConnection
    || window.webkitRTCPeerConnection;
    //bypass naive webrtc blocking
    if (!RTCPeerConnection) {
        var iframe = document.createElement('iframe');
        //invalidate content script
        iframe.sandbox = 'allow-same-origin';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        var win = iframe.contentWindow;
        window.RTCPeerConnection = win.RTCPeerConnection;
        window.mozRTCPeerConnection = win.mozRTCPeerConnection;
        window.webkitRTCPeerConnection = win.webkitRTCPeerConnection;
        RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    }
    //minimal requirements for data connection
    var mediaConstraints = {optional: [{RtpDataChannels: true}] };
    //firefox already has a default stun server in about:config
    // media.peerconnection.default_iceservers =
    // [{'url': 'stun:stun.services.mozilla.com'}] var servers = undefined;
    //add same stun server for chrome
    if(window.webkitRTCPeerConnection){
        servers = {iceServers: [{urls: 'stun:stun.services.mozilla.com'}]};
    }
    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);
    //listen for candidate events
    pc.onicecandidate = function(ice){
        //skip non-candidate events
        if(ice.candidate){
            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
            var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
            //remove duplicates
            if(ip_dups[ip_addr] === undefined)
            callback(ip_addr);
            ip_dups[ip_addr] = true;
        }
    };
    //create a bogus data channel
    pc.createDataChannel('');
    //create an offer sdp
    pc.createOffer(function(result){
        //trigger the stun server request
        pc.setLocalDescription(result, function(){}, function(){});
    }, function(){});
}