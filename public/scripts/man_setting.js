/*
 * ==================================================================
 *                          设置 setting
 * ==================================================================
 */

$(function() {
    $('.setmenu').addClass('open active');
    $('.setmenu').find('li').eq(1).addClass('active');
    localStorage.setItem('myCat', 'Tom');
    localStorage.setItem('myCat', JSON.stringify({name:'Tom',hobbies:['xrd',3232,{x:1,y:'xx'}]}));
    console.log(JSON.parse(localStorage.getItem('myCat')));

    hosturl = localStorage.getItem("appssec_url") + '/';
    var acturl = hosturl + 'p/org/orgUpdateSettings';  
    document.getElementById("addimg").action=acturl;
    document.getElementById("addadmpic").action=acturl;
    $("span[id^='identify_method']").removeClass('txt');
    $("input:checkbox[name^='identify_method']").attr("checked",false);
    $("input:checkbox[name^='identify_method']").attr("disabled",false);

    var img_area = $(".img_area");
    var img_adm = $(".img_adm");
    var adm_logo = $('.navbar-header .navbar-account .avatar');
    var avatar_area = $('.navbar-header .navbar-account .avatar-area');
    var admpic = '';
    var company_icon = '';
    var sid = getCookie("sid"); 

    // 上传头像 
    $(document).ready(function(){
        var picturefile = document.getElementById("picturefile");
        var admpicfile = document.getElementById("admpicfile");
        if ( typeof(FileReader) === 'undefined' ){
            picturefile.setAttribute( 'disabled','disabled' );
            admpicfile.setAttribute( 'disabled','disabled' );
        } else {
            picturefile.addEventListener( 'change',readFile,false );
            admpicfile.addEventListener( 'change',readadmfile,false );
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
                img_area.html('<img class="avatar imge-thumbnail" width="194.7px;" height="44px;" src="'+this.result+'" style="background:#ccc;"></img>');
                company_icon = this.result;
            }
        }

        function readadmfile(){
            var file = this.files[0];
            if(!/image\/\w+/.test(file.type)){
                return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                $('input[name=sid]').val(sid);
                img_adm.html('<img src="'+this.result+'" width="99px;" height="99px;"  class="avatar imge-thumbnail"></img>');
                admpic = this.result;
            }
        }      
        
    });
     // 从服务端接口获取公司详细信息
    $.get('/man/setting/orgGetSettings', function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            $('input[name=session_expire_time]').val(data.doc.session_expire_time);
            $('input[name=session_expire_time]').val(data.doc.session_expire_time);
            $('input[name=pw_max_try_times]').val(data.doc.pw_max_try_times);
            $('input[name=frozen_time]').val(data.doc.frozen_time);
            $("#max_download").find("option").eq(data.doc.max_download).attr("selected",true);
            $('input[name=send_url]').val(data.doc.send_url);
            $('input[name=client_frozen_time]').val(data.doc.client_frozen_time);
            $('input[name=client_pw_try_times]').val(data.doc.client_pw_try_times);
            $('input[name=email_server]').val(data.doc.email_server);
            $('input[name=send_user]').val(data.doc.send_user);
            $('input[name=send_pwd]').val(data.doc.send_pwd);
            $('input[name=recv_user]').val('');
            $('input[name=font_color]').val(data.doc.font_color);
            $('select[name=font_type]').val(data.doc.font_type);
            $('select[name=font_size]').val(data.doc.font_size);
            $('select[name=font_opacity]').val(data.doc.font_opacity);
            if(data.doc['switch'] == '1'){
                $("input:radio[name='switch']").eq(0).attr("checked",'checked');
            }else{
                $("input:radio[name='switch']").eq(1).attr("checked",'checked');
            }
            $("input:radio[name='camera_control'][value="+data.doc.camera_control+"]").attr("checked",'checked');
            $("input:radio[name='screenshot'][value="+data.doc.screenshot+"]").attr("checked",'checked');
            $("input:radio[name='forbid_unload'][value="+data.doc.forbid_unload+"]").attr("checked",'checked');


            $('input[name=pw_min_len]').val(data.doc.pw_min_len);
            $('select[name=passwd_type]').val(data.doc.passwd_type);
            $('input[name=passwd_available]').val(data.doc.passwd_available);
            $('input[name=manager_name]').val(data.doc.manager_name);
            $('input[name=product_name]').val(data.doc.product_name);
            $('input[name=company_name]').val(data.doc.company_name);
            $('input[name=company_domain]').val(data.doc.company_domain);
            img_area.html('<img width="194.7px;" height="44px;" src="'+ picurl + data.doc.icon + '" alt="" class="avatar imge-thumbnail"></img>');
            img_adm.html('<img width="99px;" height="99px;" src="'+ picurl + data.doc.avatar + '" alt="" class="avatar imge-thumbnail"></img>');
            if(data.doc.allow_remember_pw == '1'){
                $("input:radio[name='allow_remember_pw']").eq(0).attr("checked",'checked');
            }else{
                $("input:radio[name='allow_remember_pw']").eq(1).attr("checked",'checked');
            }
            
            if(data.doc.identify_method == 3){
                $("span[id='identify_method1']").addClass('txt');
                $("input:checkbox[name='identify_method1']").attr("checked",true);
                $("span[id='identify_method2']").addClass('txt');
                $("input:checkbox[name='identify_method2']").attr("checked",true);
                $('input[name=identify_method3]').attr("disabled","disabled");
            }else if(data.doc.identify_method == 5){
                $("span[id='identify_method1']").addClass('txt');
                $("input:checkbox[name='identify_method1']").attr("checked",true);
                $("span[id='identify_method3']").addClass('txt');
                $("input:checkbox[name='identify_method3']").attr("checked",true);
                $('input[name=identify_method2]').attr("disabled","disabled");
            }else if(data.doc.identify_method == 4){
                $("span[id='identify_method3']").addClass('txt');
                $("input:checkbox[name='identify_method3']").attr("checked",true);
                $('input[name=identify_method2]').attr("disabled","disabled");
            }else{
                $("span[id='identify_method"+data.doc.identify_method+"']").addClass('txt');
                $("input:checkbox[name='identify_method"+data.doc.identify_method+"']").attr("checked",true);
            }
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });

    // 提交修改公司图标
    $('#addimg').submit(function() {  
        var product_name = $('input[name=product_name]').val();
        var company_name =     $('input[name=company_name]').val();
        var company_domain =     $('input[name=company_domain]').val();
        if(company_icon && product_name && company_name && company_domain){
            $(this).ajaxSubmit({
                resetForm: true,
                beforeSubmit: function() {
                   // warningOpen('正在添加请稍后！');
                },
                success: function(d1, d2) {
                    $.get('/man/setting/orgGetSettings', function(data) {
                        data = JSON.parse(data);
                        if (data.rt==0) {
                            $('.navbar-brand small').html('<img style="width:170px;height:22px;margin-top:10px;" src="'+ picurl +data.doc.icon+'" alt=""></img>');
                            localStorage.setItem("icon",data.doc.icon); 
                        } else if (data.rt==5) {
                            toLoginPage();           
                        }
                    });
                    if (d1.rt == 0) { 
                        $('.navbar .product_name').html('<a href="#" class="navbar-brand">' + product_name + '</a>');
                        localStorage.setItem("productName",product_name); 
                        $('input[name=product_name]').val(product_name);
                        $('input[name=company_name]').val(company_name);
                        $('input[name=company_domain]').val(company_domain);
                        company_icon = '';
                        warningOpen('添加成功！','primary','fa-check');
                    } else if (d1.rt == 1) {
                        warningOpen('添加失败！','danger','fa-bolt');
                    } else if (d1.rt == 5) {
                        toLoginPage();
                    } else {
                        warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                    }
                    alertOff();
                }
            });
        } else if(product_name && company_name && company_domain && !company_icon){
            modifycompany();
        } else{
            warningOpen('参数不能为空！','danger','fa-bolt');
        }        
        return false;   
    });
      
    // 提交修改管理员头像
    $('#addadmpic').submit(function() {  

        var manager_name = $('.setting input[name=manager_name]').val();

        if(admpic){

            $(this).ajaxSubmit({

                resetForm: true,
                beforeSubmit: function() {
                    // warningOpen('正在添加请稍后！');
                },

                success: function(d1, d2) {

                    $.get('/man/setting/orgGetSettings', function(data) {
                        data = JSON.parse(data);
                        if (data.rt==0) {
                            adm_logo.html('<img src="'+ picurl +data.doc.avatar+'" alt=""></img>');
                            avatar_area.html('<img src="'+ picurl +data.doc.avatar+'" alt="" style="max-height:150px;max-weight:150px;"></img><span class="caption">修改头像</span>');
                            localStorage.setItem("avatar",data.doc.avatar); 
                            $('.setting input[name=manager_name]').val(manager_name);
                            admpic = '';
                        } else if (data.rt==5) {
                            toLoginPage();           
                        }
                    });

                    if (d1.rt == 0) {
                        warningOpen('添加成功！','primary','fa-check');
                    } else if (d1.rt == 1) {
                        warningOpen('添加失败！','danger','fa-bolt');
                    } else if (d1.rt == 5) {
                        toLoginPage();
                    } else {
                        warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                    }

                    alertOff();
                }
            });

        } else if($('.setting input[name=manager_name]').val() != ''&&!admpic){

            modifymanagerName();

        } else{
            console.log("未修改！");
        }

        return false;   
    });

    $("#email_server, #send_user, #send_pwd").bind("change", function(){
        $('.email-server-btn').attr("disabled",true);
    });
    
});
function setCallback(){
    var data=arguments[0];
    if (data.rt==0) {
        warningOpen('操作成功！','primary','fa-check');
    } else if (data.rt==5) {
        toLoginPage();
    } else {
        warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
    }
}
// 修改系统设置
function formAjax(){
    var form=$(event.target)[0].form;
    var url=form.action;
    var querystring=$(form).serialize();
    $.post(url,querystring,function(data){
        setCallback(data);
    })
}


// 邮箱服务器设置
function modwatermarke(){
    var switchon = $('input[name=switch]:checked').val();
    var font_type = $('select[name=font_type]').val();
    var font_size = $('select[name=font_size]').val();
    var font_color = $('input[name=font_color]').val();
    var font_opacity = $('select[name=font_opacity]').val();

    var postData = {
        switchon: switchon,
        font_type: font_type,
        font_size: font_size,
        font_color: font_color,
        font_opacity: font_opacity
    };
    
    $.post('/man/setting/orgUpdateSettings', postData, function(data) {
        if (data.rt==0) {
            warningOpen('操作成功！','primary','fa-check');
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });  
}

// 邮箱服务器测试
function testemail(){
    var email_server = $('input[name=email_server]').val();
    var send_user = $('input[name=send_user]').val();
    var send_pwd = $('input[name=send_pwd]').val();
    var recv_user = $('input[name=recv_user]').val();
    var postData = {
        email_server: email_server,
        send_user: send_user,
        send_pwd: send_pwd,
        recv_user: recv_user
    };
    if(postData.email_server && postData.send_user && postData.send_pwd && postData.recv_user){
        $.post('/man/setting/testEmail', postData, function(data) {
            if (data.rt==0) {
                warningOpen('邮箱服务器信息正确！','primary','fa-check');
                $('.email-server-btn').attr("disabled",false);
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });  
    } else {
        warningOpen('请将信息填写完整再测试！','danger','fa-bolt');
    }
}
// 邮箱服务器设置
function modemailserver(){
    var email_server = $('input[name=email_server]').val();
    var send_user = $('input[name=send_user]').val();
    var send_pwd = $('input[name=send_pwd]').val();

    var postData = {
        email_server: email_server,
        send_user: send_user,
        send_pwd: send_pwd
    };
    $.post('/man/setting/orgUpdateSettings', postData, function(data) {
        if (data.rt==0) {
            warningOpen('操作成功！','primary','fa-check');
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });  
}
// 修改服务器地址
function save_url(){
    var send_url = $('input[name=send_url]').val();
    var domain_name = $('input[name=domain_name]').val();
    var postData = {
        domain_name: domain_name,
        send_url: send_url
    };
    $.post('/man/setting/orgUpdateSettings', postData, function(data) {
        if (data.rt==0) {
            warningOpen('操作成功！','primary','fa-check');
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });  
}

// 认证方式设置
function identify_method(){
    var _method1 = $('#identify_method1').hasClass('txt') == true ? 1 : 0;
    var _method2 = $('#identify_method2').hasClass('txt') == true ? 2 : 0;
    var _method3 = $('#identify_method3').hasClass('txt') == true ? 4 : 0;
    var identify_method = 1;
    if(_method1 || _method2 || _method3){
        if(_method2 && _method3){
            warningOpen('用户名口令＋指纹认证和用户名口令＋本地指纹认证不能同时选择！','danger','fa-bolt');
        }else{
            identify_method = (_method1|_method2|_method3);
            var postData = {
                identify_method: identify_method
            };
            $.post('/man/setting/orgUpdateSettings', postData, function(data) {
                if (data.rt==0) {
                    warningOpen('操作成功！','primary','fa-check');
                } else if (data.rt==5) {
                    toLoginPage();
                } else {
                    warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
                }
            });
        }
    }else{
        warningOpen('请至少选择一项！','danger','fa-bolt');
    }
    
}
// 选择按钮
function select2(e) {
    if ($(e).parent().find('span').hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
        $('input[name=identify_method3]').parent().find('span').removeClass('txt');
        $('input[name=identify_method3]').attr("disabled",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
        $('input[name=identify_method3]').parent().find('span').removeClass('txt');
        $('input[name=identify_method3]').attr("disabled","disabled");
    }
}
// 选择按钮
function select3(e) {
    if ($(e).parent().find('span').hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
        $('input[name=identify_method2]').parent().find('span').removeClass('txt');
        $('input[name=identify_method2]').attr("disabled",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
        $('input[name=identify_method2]').parent().find('span').removeClass('txt');
        $('input[name=identify_method2]').attr("disabled","disabled");
    }
}
// 修改公司私云域名
function modifycompany(){
    var product_name = $('input[name=product_name]').val();
    var company_name =     $('input[name=company_name]').val();
    var company_domain =     $('input[name=company_domain]').val();
    var postData = {
        product_name: product_name,
        company_domain: company_domain,
        company_name: company_name
    };
    $.post('/man/setting/orgUpdateSettings', postData, function(data) {
        if (data.rt==0) {
            $('.navbar .product_name').html('<a href="#" class="navbar-brand">' + product_name + '</a>');
            localStorage.setItem("productName",product_name); 
            warningOpen('操作成功！','primary','fa-check');
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });  
}

// 修改管理员名称
function modifymanagerName(){
    var manager_name =$('input[name=manager_name]').val();
    var postData = {
        manager_name: manager_name
    };
    $.post('/man/setting/orgUpdateSettings', postData, function(data) {
        if (data.rt==0) {
            warningOpen('操作成功！','primary','fa-check');
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });  
}

// 修改管理员密码
function set_updatePW(){
    var old_passwd = $('input[name=currentpw]').val();
    var new_passwd =     $('input[name=newpw]').val();
    var confirpw =     $('input[name=confirpw]').val();
    if(new_passwd == confirpw){
        var postData = {
            old_passwd: old_passwd,
            new_passwd: new_passwd
        };
        $.post('/man/setting/orgUpdatePw', postData, function(data) {
            if (data.rt==0) {
                warningOpen('操作成功！','primary','fa-check');
            } else if (data.rt==5) {
                toLoginPage();
            } else {
                warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
            }
        });  
    }else {
        warningOpen('两次密码不一致！','danger','fa-bolt');
    }
}
