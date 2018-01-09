/*
 * ==================================================================
 *                          用户设置 per_setting
 * ==================================================================
 */

$(function() {
  $('.layout-right .top .right .search input').val(''); 
  var acturl = hosturl + 'p/user/uploadAvatar'; 
  document.getElementById("addperpic").action=acturl;
  var name = '', email = '', phone = '', perimg = '', sid = '', pic = '';
  var per_logo = $('.layout .layout-left .online .pic');  
  var perpic = '';
  var img_area = $(".img_area");
 
  if(localStorage.length>0){
        pic = localStorage.getItem("peravatar");
    var inform = localStorage.getItem("data1");
    var nation = JSON.parse(inform);
    var inform = nation.doc;  
    var info = inform.info;
    name = info.name;
    email = info.email;
    phone = info.phone;
    sid = nation.sid;
    perimg = info.avatar;
  }

  if(phone.length > 0){
    $('.layout .layout-right .center .setting .company .info label').eq(5).html(phone);;
  }else{
    $('.layout .layout-right .center .setting .company .info label').eq(5).html('&nbsp;');
  }
  $('.layout .layout-right .center .setting .company .info label').eq(1).html(name);
  $('.layout .layout-right .center .setting .company .info label').eq(3).html(email);  
  $('.layout .layout-right .center .setting .company .info label').eq(7).html("singuloid");
  if(pic){
    img_area.html('<img width="104px;" height="104px;" src="'+pic+'" alt=""/>');
  } else if(perimg){
      img_area.html('<img width="104px;" height="104px;" src="'+ picurl +perimg+'" alt=""/>');
  } else{
      console.log("当前用户目前没有头像");
  }
 
  $(document).ready(function(){
    var picturefile = document.getElementById("picturefile");
    if ( typeof(FileReader) === 'undefined' ){
      picturefile.setAttribute( 'disabled','disabled' );
    } else {
      picturefile.addEventListener( 'change',readFile,false );
    }

    function readFile(){
      var file = this.files[0];
      if(!/image\/\w+/.test(file.type)){
          return false;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e){ 
          $('input[name=sid]').val(sid);     
          img_area.html('<img width="104px;" height="104px;" src="'+this.result+'" alt=""/>');
          perpic = this.result;      
      }
    }
  });

  $('#addperpic').submit(function() {   
    if(perpic){
      $('#addperpic').ajaxSubmit({
        resetForm: true,
        beforeSubmit: function() {
            //warningOpen('正在添加请稍后！');
        },
        success: function(d1, d2) {
            per_logo.html('<img width="100%;" height="100%;" src="' + perpic + '" alt=""></img>');
            localStorage.setItem("peravatar",perpic);
            if (d1.rt == 0) {
                warningOpen('添加成功！');
            } else if (d1.rt == 1) {
                warningOpen('添加失败！');
            } else if (d1.rt == 5) {
                toLoginPage();
            } else {
                warningOpen('其它错误！');
            }
            alertOff();
        }
      });
    } 
    return false;   
  });  


});

//用户修改电话
function modifyuserTel() {
  var phone = $('.layout .layout-right .center .setting .company .info label').eq(5).html();
  var tel = 1;
  var eml = 0;
  cont = '';
  if(phone.length > 10){
    cont += '<p style="margin-bottom:24px;margin-top:-30px;color:#666666;">为了账号安全 请你选择校验方式</p>'
       + '<div class="verifyicon icon1"></div><div class="verify" onclick="captchacheck('+tel+')">通过短信进行验证</div>'
       + '<br>'
       + '<div class="verifyicon icon2"></div><div class="verify" onclick="captchacheck('+eml+')">通过邮箱进行验证</div>'
       + '<p><button onclick="alertOff()" style="width:160px;height:50px;margin-left:130px;margin-top:-10px;font-size:0.8em;">取消</button></p>';
    alertOpen('选择校验方式', cont);
  }else{
    cont += '<p style="margin-bottom:24px;margin-top:-30px;color:#666666;">为了账号安全请选择邮箱校验</p>'
       + '<div class="verifyicon icon2"></div><div class="verify" onclick="captchacheck('+eml+')">通过邮箱进行验证</div>'
       + '<p><button onclick="alertOff()" style="width:160px;height:50px;margin-left:130px;margin-top:-10px;font-size:0.8em;">取消</button></p>';
    alertOpen('邮箱校验', cont);
  }
  
}

// 用户修改电话发送验证
function captchacheck(s) {
    alertOff();
    var title = '<a href="javascript:getback()" style="color:#666666;">首页</a>&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;修改电话';
    $('.layout-right .top .left ul .title').html(title);
    var setting = $('.layout .layout-right .center .setting');
    var str='';
    var email = '';
    var phone = '';
    var url = '';
    var capt = '';
    var postData = {};
    if(localStorage.length>0){
    var inform = localStorage.getItem("data1");
    var nation = JSON.parse(inform);
    var inform = nation.doc;
    var info = inform.info;
    var name = info.name;
        email = info.email;
        phone = info.phone;
    }
    if(s == 1){
        postData = {
            phone: phone,
            email: email
        };
        url = '/per/sendCaptchaPhone';
        capt = '电话号码：' + phone + ' , 本次验证码300秒后过期 ！';
    }else {
        postData = {
            email: email
        };
        url = '/per/sendCaptchaEmail';
        capt = '邮箱： '+email+' , 本次验证码300秒后过期 ！';
    }
      
    $.post(url, postData, function(data) {
      if (data.rt==0) {  
          warningOpen('验证码发送成功！');
          str = '<p class="verify" style="margin-top:170px;"><span>新电话号：</span><input type="text" name="phonenumber"/></p>'
          + '<p class="verify"><span>输入验证码：</span><input type="text" id="captcha" name="captcha"/><input type="button" name="timebtn" class="timebtn"/><a style="display:none;" href="javascript:captchacheck('+s+');">重新获取验证码</a></p><br>'
          + '<p class="verify notific">我们已将验证码发送至'+capt+'</p>'
          + '<button class="phonesub" onclick="updateTel()">提&nbsp;交</button>';
          setting.html(str);  
          var code=300;
          $('.layout .layout-right .center .setting .timebtn').show();
          var tistt = settime(code);
          clearTimeout(tistt);        
          settime(code);
          $('input[name=phonenumber').keyup(function(){  // 输入限制，只能输入整数  
            if (this.value.length==1) {
              this.value=this.value.replace(/[^1-9]/g,'');
            } else {
              this.value=this.value.replace(/\D/g,'');
            }
            this.value=this.value.substring(0,11);
          });   
          $('input[name=captcha').keyup(function(){  // 输入限制，只能输入整数 
            if (this.value.length==1) {
                this.value=this.value.replace(/[^1-9]/g,'');
            } else {
                this.value=this.value.replace(/\D/g,'');
            }
            $('.layout .layout-right .center .setting .timebtn').hide();
          }); 
      } else if (data.rt==5) {
          toLoginPage();
      } else {
          warningOpen('其它错误 ' + data.rt +'！');
      }
    });   
}
// 用户修改电话提交
function updateTel(){
  var email = '';
  if(localStorage.length>0){
      var inform = localStorage.getItem("data1");
      var nation = JSON.parse(inform);
      var inform = nation.doc;
      var info = inform.info;
      var name = info.name;
          email = info.email;
  }
  var postData = {
          phone: $('input[name=phonenumber]').val(),
          captcha: $('input[name=captcha]').val(),
          email: email
      };
  var regMobile = /^0?1[3|4|5|8][0-9]\d{8}$/;
  if(!regMobile.test(postData.phone)){
    warningOpen('请输入正确的电话号！');
  }else if(postData.captcha == ""){
    warningOpen('请输入验证码！');
  } else{
    $.post('/per/modifyPhone', postData, function(data) {
      if (data.rt == 0) {
          $('.layout-left ul li .a').eq(0).click();
          warningOpen('电话修改成功！');
          $('.layout .layout-right .center .setting .company .info label').eq(5).html(postData.phone);
      } else if (data.rt==5) {
          toLoginPage();
      } else {
          warningOpen('其它错误 ' + data.rt +'！');
      }
    });
  }
}

//用户退出
function logout(){
  var cont = '';
      cont += '<p class="tips">确定退出？</p><div class="line"></div>'
           + '<p style="margin-bottom:-200px"><button onclick="user_logout()">确认</button><button onclick="alertOff()">取消</button></p>';
  alertOpen('用户退出', cont);
  window.location.hash = "thetop";
  window.location.hash = "";
}
function user_logout(){
  document.getElementById('logout').click();
  alertOff();
  localStorage.removeItem("peravatar");
  localStorage.removeItem("data1");
}

//修改用户密码
function resetpwd(){
  var cont = '';
  cont += '<form autocomplete="off"><p><span>当前密码：</span><input type="password" name="currentpw" autocomplete="off"></p>'
          + '<p><span>新密码：</span><input type="password" name="newpw"></p>'
          + '<p><span>确认新密码：</span><input type="password" name="confirpw"></p></form><div class="line"></div>'
          + '<p><button onclick="set_updatePW()">确认</button><button onclick="alertOff()">取消</button></p>';
  alertOpen('修改密码', cont);
  window.location.hash = "thetop";
  window.location.hash = "";
}
// 提交修改的密码
function set_updatePW(){
    var pw = '';
    var email = '';
    if(localStorage.length>0){
        var inform = localStorage.getItem("data1");
        var nation = JSON.parse(inform);
        var inform = nation.doc;
        var info = inform.info;
            email = info.email;
    }
    var postData = {
          email: email,
          new_pw: $('input[name=newpw]').val(),
          pw: $('input[name=currentpw]').val()
      };
    var confirm = $('input[name=confirpw]').val();
  if(postData.pw == ""){
    warningOpen('请填写现在的密码！');
  }else if (postData.new_pw == ""){
    warningOpen('请填写新密码！');
  }else if(postData.new_pw != confirm){
    warningOpen('前后密码不一致！');    
  }else{
    $.post('/per/settings/userUpdatePw', postData, function(data) {
      if (data.rt==0) { 
          alertOff();                 
          warningOpen('密码修改成功！');       
      } else if (data.rt==5) {
          toLoginPage();
      } else {
          warningOpen('其它错误 ' + data.rt +'！');
      }
  });
  }
}
