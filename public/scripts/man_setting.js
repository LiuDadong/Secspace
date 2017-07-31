/*
 * ==================================================================
 *                          设置 setting
 * ==================================================================
 */

$(function() {
    var acturl = hosturl + 'p/org/orgUpdateSettings';  
    document.getElementById("addimg").action=acturl;
    document.getElementById("addadmpic").action=acturl;

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
                img_area.html('<img class="avatar imge-thumbnail" width="194.7px;" height="44px;" src="'+this.result+'" alt=""></img>');
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
                img_adm.html('<img src="'+this.result+'" alt="" width="99px;" height="99px;"  class="avatar imge-thumbnail"></img>');
                admpic = this.result;
            }
        }      
        
    });
     // 获取公司详细信息
    $.get('/man/setting/orgGetSettings', function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            $('input[name=session_expire_time]').val(data.doc.session_expire_time);
            $('input[name=pw_max_try_times]').val(data.doc.pw_max_try_times);
            $('input[name=frozen_time]').val(data.doc.frozen_time);
            $("#max_download").find("option").eq(data.doc.max_download-1).attr("selected",true);
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
            }else if(data.doc.identify_method == 5){
                $("span[id='identify_method1']").addClass('txt');
                $("input:checkbox[name='identify_method1']").attr("checked",true);
                $("span[id='identify_method3']").addClass('txt');
                $("input:checkbox[name='identify_method3']").attr("checked",true);
            }else if(data.doc.identify_method == 4){
                $("span[id='identify_method4']").addClass('txt');
                $("input:checkbox[name='identify_method4']").attr("checked",true);
            }else{
                $("span[id='identify_method"+data.doc.identify_method+"']").addClass('txt');
                $("input:checkbox[name='identify_method"+data.doc.identify_method+"']").attr("checked",true);
            }
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });

  /*  // 获取公司详细信息
    $.get('/man/setting/orgGetSettings', function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            $('input[name=session_expire_time]').val(data.doc.session_expire_time);
            $('input[name=pw_max_try_times]').val(data.doc.pw_max_try_times);
            $('input[name=frozen_time]').val(data.doc.frozen_time);
            $("#max_download").find("option").eq(data.doc.max_download-1).attr("selected",true);
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
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });*/

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
                    console.log(d1.rt);
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
});

// 修改系统设置
function setsave(){
    var session_expire_time = $('input[name=session_expire_time]').val();
    var pw_max_try_times = $('input[name=pw_max_try_times]').val();
    var frozen_time = $('input[name=frozen_time]').val();
    var max_download = $('select[name=max_download]').val();
    var allow_remember_pw = $('input[name=allow_remember_pw]:checked').val();
    var postData = {
        session_expire_time: session_expire_time,
        pw_max_try_times: pw_max_try_times,
        frozen_time: frozen_time,
        allow_remember_pw: allow_remember_pw,
        max_download: max_download
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

// 修改系统设置
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
        }
        
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
    }else{
        warningOpen('请至少选择一项！','danger','fa-bolt');
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
