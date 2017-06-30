 var regBox = {
    regEmail : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    regName : /^[a-z0-9_-]{3,16}$/,//用户名
    regMobile : /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,//手机
    regTel : /^0[\d]{2,3}-[\d]{7,8}$/
};
// 切换登录状态
function getAction(flag) {
    $('.sign a').removeClass('active');
    $('.loginbox input[name=account]').val('');
    $('.loginbox input[name=passwd]').val('');
    if (flag == 'per') {
        $('.loginbox-title').html('个人登录');
        $('.sign a').eq(1).addClass('active');
        $('.loginbox-signup').css({'display':'block'});           
        $('.loginbox input[name=flag]').val('per');
    } else { 
        $('.loginbox-title').html('管理员登录');
        $('.sign a').eq(0).addClass('active');
        $('.loginbox-signup').css({'display':'none'}); 
        $('.loginbox input[name=flag]').val('man');
        //window.location.reload(); 
    }
    $.cookie('flag', flag, {path: "/", expires: -1});
}

$(function() {
   /*
    var btn=document.getElementById("btn");
    var pass=document.getElementById("pass")
    btn.onmouseover = function(){
        pass.type = "text";
    };
    btn.onmouseout = function(){
        pass.type = "password";
    }
*/
    $.cookie('flag', 'man', {path: "/", expires: -1});
    if($('.login .center .login_tab a').eq(0).hasClass('active')){
        $('.login .center input[name=flag]').val('man');
    }else{
        $('.login .center input[name=flag]').val('per');
    }
    // login
    $('form').ajaxForm({
        type: "POST",
        dataType: 'json',
        beforeSubmit: function() {
            if ($('.login .center input[name=account]').val()=='') {                
                $('.login .center .err').html('请输入用户名！');
                setTimeout("warningOff()",2000);
                return false;
            } else if ($('.login .center input[name=passwd]').val()=='') {
                $('.login .center .err').html('请输入密码！');
                setTimeout("warningOff()",2000);
                return false;
            }
        },
        success: function(data) {
            console.log("datart  == "+data.rt);
            if(data.rt==0) {
                if ($('.login input[name=flag]').val()=='per') {
                    localStorage.setItem("data1",JSON.stringify(data));
                    location.href = "/per/settings";
                } else {
                    //console.log("data  == "+JSON.stringify(data));
                    localStorage.setItem("avatar",data.avatar);
                    localStorage.setItem("icon",data.icon);
                    location.href = "/man/first";
                }
            } else if(data.rt==3 || data.rt==4) {
                $('.login .center .err').html('用户名或密码错误！');
                setTimeout("warningOff()",2000);
            } else if(data.rt==5) {
                location.href = "/";
            }else if(data.rt==22) {
                warningOpen('三次登陆密码有误，账户已冻结！');
            }  else {
                warningOpen('登录失败！');
            }
        },
        error:function(err){
            alert("表单提交异常！"+err.msg);
        }
    });
});

// 个人用户注册
function register(){
    $('.loginbox-title').html('注册账号');
    $('form').css({'display':'none'});
    $('.register').css({'display':'block'});
}
function registercapt(){
    var account = $('.register').find('input[name=account]').val();
    var type = '';    
    var postData = {};

    var phone = regBox.regMobile.test(account);
    var email = regBox.regEmail.test(account);
    if(phone || email){
        if(phone){
            type = 'phone';
        }else{
            type = 'email';
        }
        postData = {
            account: account,
            type: type
        }; 
        //account = postData.account;
        registernew(postData.account);
        // captcha= data.captcha
       /* $.post('/per/send/captcha', postData, function(data) {
            if (data.rt==0) { 
                // rtcap = data.captcha;
                warningOpen('验证码发送成功 ！');
            } else if(data.rt == 18){
                warningOpen('没有剩余的短信，无法发送验证码！');
            }else {
                warningOpen('其它错误 ' + data.rt +'！');
            }
        });*/

    } else {
        warningOpen('请输入正确的账号 ！');        
    } 
}
// 注册用户获取验证码
function registernew(account){    
    $('.register').css({'display':'none'});
    $('.registernew').css({'display':'block'});
    $('.registernew').find('input[name=email]').val(account);
    $('.registernew').find('input[name=captcha]').val('');
}
// 注册新用户 提交
function userregister(){
    var postData = {
        email: $('.registernew input[name=email]').val(),
        pw: $('.registernew input[name=password]').val(),
        confirm: $('.registernew input[name=confirm]').val()
    };
    var captcha1 = $('.registernew input[name=captcha]').val();
    if(postData.pw == ''){
        warningOpen('请输入密码 ！');
    } else if(postData.pw != postData.confirm){
        warningOpen('两次密码不一致 ！');
    } 
    //else if(captcha != captcha1){
   //     warningOpen('验证码错误 ！');
   // } 
    else {
        $.post('/per/user/register', postData, function(data) {
            if (data.rt == 0) {
                window.location.reload();
            } else {
                warningOpen('其它错误 ' + data.rt +'！');
                window.location.reload();
            }
        });
    }
}

// 忘记密码
function updatepwd(){
    $('.loginbox-title').html('忘记密码');
    $('form').css({'display':'none'});
    $('.forgetpwd').css({'display':'block'});
}
// 忘记密码获取验证码
function checkpwd(){
    var account = $('.forgetpwd').find('input[name=email]').val();
    var type = '';    
    var postData = {};

    var phone = regBox.regMobile.test(account);
    var email = regBox.regEmail.test(account);
    if(phone || email){
        if(phone){
            type = 'phone';
        }else{
            type = 'email';
        }
        postData = {
            account: account,
            type: type
        }; 
        checkpaswds(postData.account);
        //$.post('', postData, function(data) {
         //   if (data.rt==0) { 
                // rtcap = data.captcha;
         //       warningOpen('验证码发送成功 ！');
         //   } else if(data.rt == 18){
       //         warningOpen('没有剩余的短信，无法发送验证码！');
        //    }else {
              //  warningOpen('其它错误 ' + data.rt +'！');
        //    }
       // });

    }else{
        warningOpen('请输入正确的账号 ！');        
    } 
}
// 修改密码
function checkpaswds(email){
    $('.forgetpwd').css({'display':'none'});
    $('.findpwd').css({'display':'block'});
    $('.findpwd').find('input[name=email]').val(email);
    account = email;
}
// 修改密码
function checkpaswd(){ 
    var captcha = $('.findpwd input[name=captcha]').val();
    //if(rtcap == captcha){
        $('.findpwd').css({'display':'none'});
        $('.updatepwd').css({'display':'block'});
        $('.updatepwd').find('input[name=email]').val(account);
         
   // }       
}
// 提交密码修改
function newPassword(){
    var postData = {
        account: $('.updatepwd input[name=email]').val(),
        pw: $('.updatepwd input[name=password]').val(),
        verify_pw: $('.updatepwd input[name=confirm]').val(),
    };
        
    if(postData.pw == '') {
        warningOpen('请输入密码 ！');
    } else if(postData.pw != postData.verify_pw) {
        warningOpen('两次密码不一致 ！');
    } else {
         //window.location.reload();
        $.post('/per/userUpdatePw', postData, function(data) {
            if (data.rt==0) {
                window.location.reload();
            } else {
                warningOpen('其它错误 ' + data.rt +'！');
            }
        });
    }   
}

// 显示2秒
function warningOpen(_cont) {
    warningBlock(_cont);
    var timmer = setTimeout(function(){
            warningOff();
            clearTimeout(timmer);
            timmer = null;
        }, 2000);
}
// 设置显示内容
function warningBlock(_cont) {
    var warning = $('.err');
    warning.html(_cont);
}
// 隐藏
function warningOff() {
    $('.login .center .err').html('&nbsp;');
}