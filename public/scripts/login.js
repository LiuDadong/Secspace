var b64 = new Base64();

$.get('/p/login/getProductName', function (data) {
    data = JSON.parse(data);
    if (data.rt == '0000') {
        $('h3').html(data.product_name);
    } else {
        $('h3').html('移动安全管理平台');
    }
});


//表单初始化
// 获取网络ip
if(typeof returnCitySN!=="undefined"){  //
    $('input[name=dev_ip]').val(returnCitySN.cip);
}else{
    getIPs(function(ip){$('input[name=dev_ip]').val(ip);});
}


$('input[name=account]').on('input change propertychange', function () {
    var manager= $(this).val().replace(' ','');
    $(this).val(manager);
    if(manager){
        $.cookie('manager',manager);
    }else{
        $.removeCookie('manager');
    }
});

//渲染上次登录的账号和密码（如果存在的话）
if ($.cookie('account') && $.cookie('passwd')) {
    $('input.savepw').prop('checked', true);
    $('input[name=account]').val($.cookie('account')).change();
    $('input[name=passwd]').val(b64.decode($.cookie('passwd')));
}else{
    $('input[name=account]').val(' ')
    setTimeout(function(){
        $('input[name=account]').val('').change().focus();
        $('input[name=passwd]').val('');
    },100)
}



$('input.savepw').on('input change propertychange', function () {
    if(!$(this).prop('checked')){
        $.removeCookie('account');
        $.removeCookie('passwd');
        $.removeCookie('_account');
        $.removeCookie('_passwd');
    }
});



// 登录表单
$('form').ajaxForm({
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
        switch (data.rt) {
            case '0000':    //登录成功
                saveAccPw();
                localStorage.setItem("name", data.name);
                localStorage.setItem("firLogin", data.firLogin);
                localStorage.setItem("avatar", data.avatar ? data.avatar : '');
                localStorage.setItem("icon", data.icon);
                localStorage.setItem("product_name", data.product_name);
                localStorage.setItem("appssec_url", data.manager_url);
                localStorage.setItem("lic", JSON.stringify(data.serverModules));
                localStorage.setItem("org_id", data.org);
                localStorage.setItem("userId", data.userId);
                $.cookie('sid', data.sid); 
                $.cookie('dev_ip', $('input[name=dev_ip]').val());
                $.cookie('org_id', data.org);
                $.cookie('userId', data.userId);
                if (typeof data.avatar != "undefined") {
                    $.cookie('avatar', data.avatar);
                };
                location.href = "/";
                
                break;
            case '0001':    //操作失败
                errorText = "登录失败"
                break;
            default:
                errorText = data.desc;
        }
        if (errorText) {
            alert(errorText);
        }
    },
    error: function (err) {
        console.error(err);
    }
});


function preSaveAccPw(){ //检查登录信息
    if ($('input.savepw').prop('checked')) {
        if(
            $.cookie('account')===undefined
            ||$.cookie('passwd')===undefined
            ||$('input[name=account]').val()!==$.cookie('account')
            ||$('input[name=passwd]').val()!==b64.decode($.cookie('passwd'))
        ){
            $.cookie('_account', $('input[name=account]').val(), { expires: 7});
            $.cookie('_passwd',b64.encode($('input[name=passwd]').val()), { expires: 7});
        }   
    }
}

function saveAccPw(){ //检查登录信息
    if($.cookie('_account')&& $.cookie('_passwd')){
        $.cookie('account', $.cookie('_account'), { expires: 7});
        $.cookie('passwd', $.cookie('_passwd'), { expires: 7});
        $.removeCookie('_account');
        $.removeCookie('_passwd');
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