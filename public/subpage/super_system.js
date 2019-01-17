/*
 * ==================================================================
 *                          设置 setting
 * ==================================================================
 */


$.getJSON('//ipinfo.io/json', function (data) {
    //emIp=JSON.stringify(data, null, 2)
    $.cookie('em_ip', data.ip);
});
// 修改系统设置
$('.widget a[data-toggle=collapse]').unbind('click').bind('click', function () {
    $(this).parents('.widget').toggleClass('collapsed');
})
$('button.btnFormAjax').click(function () {
    var form = this.form;
    var url = form.action;
    var formdata = $(form).jsonSerialize();
    $.actPost(url, formdata, function (data) {

    })
})

var acturl = localStorage.getItem("appssec_url") + '/' + 'p/org/orgUpdateSettings';
document.getElementById("updateLogo").action = acturl;
$("span[id^='identify_method']").removeClass('txt');
$("input:checkbox[name^='identify_method']").prop("checked", false);
$("input:checkbox[name^='identify_method']").prop("disabled", false);

// 更新logo
var imgLogo = $("#wrapLogo img");
var logoIcon = '';
var sid = $.cookie("sid");
var iptLogo = $("#wrapLogo input[type=file]");
if (typeof (FileReader) === 'undefined') {
    iptLogo.prop('disabled', true);
} else {
    iptLogo.on('change input', function () {
        var file = this.files[0];
        if (!/image\/\w+/.test(file.type)) {
            return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            $('input[name=sid]').val(sid);
            imgLogo.attr('src', this.result);
            logoIcon = this.result;
        }
    });
}


// 从服务端接口获取公司详细信息
$.silentGet('/super/setting/getSettings', {}, function (data) {
    if (data.rt == '0000') {
        var dt = data.doc;
        var count = 0;
        $(':input[name]').each(function () {
            var k = this.name,
                v = dt[k];
            if (v !== undefined) {
                var tag_type = $(this).prop('tagName').toLowerCase();
                tag_type += $(this).prop('type').toLowerCase() ? (':' + $(this).prop('type').toLowerCase()) : '';
                count++;
                switch (k) {
                    case 'allow_remember_pw':
                        break;
                }
                switch (tag_type) {
                    case 'input:text':
                    case 'input:number':
                    case 'input:password':
                    case 'select:select-one':
                        $(this).val(data.doc[this.name]);
                        break;
                    case 'input:checkbox':
                        $(this).prop('checked', v == 1);
                        if (v == -1) {
                            // $(this).prop('disabled', true).addClass('forbidden')
                            //     .closest('.form-group').css('opacity', '0.6')
                            //     .find('.control-label.no-padding-right')
                            //     .append('（未激活）');
                            $(this).closest('.form-group').addClass('forbidden')
                        }
                        break;
                    case 'input:radio':
                        $(this).prop('checked', v == $(this).attr('value'));
                        break;
                    default:
                        count--;
                        console.warn(tag_type)
                }
            }
        })


        if (data.doc.identify_method == 3) {
            $("span[id='identify_method1']").addClass('txt');
            $("input:checkbox[name='identify_method1']").prop("checked", true);
            $("span[id='identify_method2']").addClass('txt');
            $("input:checkbox[name='identify_method2']").prop("checked", true);
            $('input[name=identify_method3]').prop("disabled", true);
        } else if (data.doc.identify_method == 5) {
            $("span[id='identify_method1']").addClass('txt');
            $("input:checkbox[name='identify_method1']").prop("checked", true);
            $("span[id='identify_method3']").addClass('txt');
            $("input:checkbox[name='identify_method3']").prop("checked", true);
            $('input[name=identify_method2]').prop("disabled", true);
        } else if (data.doc.identify_method == 4) {
            $("span[id='identify_method3']").addClass('txt');
            $("input:checkbox[name='identify_method3']").prop("checked", true);
            $('input[name=identify_method2]').prop("disabled", true);
        } else {
            $("span[id='identify_method" + data.doc.identify_method + "']").addClass('txt');
            $("input:checkbox[name='identify_method" + data.doc.identify_method + "']").prop("checked", true);
        }
    }
});

// 提交修改公司图标
$('#updateLogo').submit(function () {
    var product_name = $('input[name=product_name]').val();
    var company_name = $('input[name=company_name]').val();
    var company_domain = $('input[name=company_domain]').val();
    if (logoIcon && product_name && company_name && company_domain) {
        $(this).ajaxSubmit({
            resetForm: true,
            beforeSubmit: function () {
                // warningOpen('正在添加请稍后！');
            },
            success: function (d1, d2) {
                $.silentGet('/super/setting/getSettings',{}, function (data) {
                    if (data.rt == '0000') {
                        localStorage.setItem("icon", data.doc.icon);
                    }
                });
                if (d1.rt == '0000') {
                    $('.navbar .product_name a').text(product_name);
                    localStorage.setItem("product_name", product_name);
                    $('input[name=product_name]').val(product_name);
                    $('input[name=company_name]').val(company_name);
                    $('input[name=company_domain]').val(company_domain);
                    logoIcon = '';
                    warningOpen('修改成功！', 'primary', 'fa-check');
                }else {
                    warningOpen('操作失败！', 'danger', 'fa-bolt');
                    console.warn(d1.rt);
                }
            },
            error: function (err) {
                console.error(err)
            }
        });
    } else if (product_name && company_name && company_domain && !logoIcon) {
        modifycompany();
    } else {
        warningOpen('参数不能为空！', 'danger', 'fa-bolt');
    }
    return false;
});



$("#email_server, #send_user, #send_pwd").bind("change", function () {
    $('.email-server-btn').prop("disabled", true);
});




// 邮箱服务器设置
function modwatermarke() {
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
    $.post('/super/setting/updateSettings', postData, function (data) {
        if (data.rt == '0000') {
            warningOpen('操作成功！', 'primary', 'fa-check');
        } else if (data.rt == 5) {
            toLoginPage();
        } else {
            warningOpen('操作失败！', 'danger', 'fa-bolt');
            console.warn(data.rt);
        }
    });
}

// 邮箱服务器测试
function testemail() {
    var postData = {
        email_server: $('input[name=email_server]').val(),
        send_user: $('input[name=send_user]').val(),
        send_pwd: $('input[name=send_pwd]').val(),
        recv_user: $('input[name=recv_user]').val()
    };
    if (postData.email_server && postData.send_user && postData.send_pwd && postData.recv_user) {
        $.silentPost('/super/setting/testEmail', postData, function (data) {
            if (data.rt == '0000') {
                warningOpen('邮箱服务器信息正确！', 'primary', 'fa-check');
                $('.email-server-btn').prop("disabled", false);
            } else {
                console.warn(data.rt);
            }
        },'测试');
    } else {
        warningOpen('请将信息填写完整再测试！', 'danger', 'fa-bolt');
    }
}
// 邮箱服务器设置
function modemailserver() {
    $.actPost('/super/setting/updateSettings', {
        email_server:  $('input[name=email_server]').val(),
        send_user: $('input[name=send_user]').val(),
        send_pwd: $('input[name=send_pwd]').val()
    });
}
// 修改服务器地址
function save_url() {
    var send_url = $('input[name=send_url]').val();
    var domain_name = $('input[name=domain_name]').val();
    var postData = {
        domain_name: domain_name,
        send_url: send_url
    };
    $.post('/super/setting/updateSettings', postData, function (data) {
        if (data.rt == '0000') {
            warningOpen('操作成功！', 'primary', 'fa-check');
        } else if (data.rt == 5) {
            toLoginPage();
        } else {
            warningOpen('操作失败！', 'danger', 'fa-bolt');
            console.warn(data.rt);
        }
    });
}

// 认证方式设置
function identify_method() {
    var _method1 = $('#identify_method1').hasClass('txt') == true ? 1 : 0;
    var _method2 = $('#identify_method2').hasClass('txt') == true ? 2 : 0;
    var _method3 = $('#identify_method3').hasClass('txt') == true ? 4 : 0;
    var identify_method = 1;
    if (_method1 || _method2 || _method3) {
        if (_method2 && _method3) {
            warningOpen('用户名口令＋指纹认证和用户名口令＋本地指纹认证不能同时选择！', 'danger', 'fa-bolt');
        } else {
            identify_method = (_method1 | _method2 | _method3);
            var postData = {
                identify_method: identify_method
            };
            $.post('/super/setting/updateSettings', postData, function (data) {
                if (data.rt == '0000') {
                    warningOpen('操作成功！', 'primary', 'fa-check');
                } else if (data.rt == 5) {
                    toLoginPage();
                } else {
                    warningOpen('操作失败！', 'danger', 'fa-bolt');
                    console.warn(data.rt);
                }
            });
        }
    } else {
        warningOpen('请至少选择一项！', 'danger', 'fa-bolt');
    }

}
// 选择按钮
function select2(e) {
    if ($(e).parent().find('span').hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).prop("checked", false);
        $('input[name=identify_method3]').parent().find('span').removeClass('txt');
        $('input[name=identify_method3]').prop("disabled", false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).prop("checked", true);
        $('input[name=identify_method3]').parent().find('span').removeClass('txt');
        $('input[name=identify_method3]').prop("disabled", true);
    }
}
// 选择按钮
function select3(e) {
    if ($(e).parent().find('span').hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).prop("checked", false);
        $('input[name=identify_method2]').parent().find('span').removeClass('txt');
        $('input[name=identify_method2]').prop("disabled", false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).prop("checked", true);
        $('input[name=identify_method2]').parent().find('span').removeClass('txt');
        $('input[name=identify_method2]').prop("disabled", true);
    }
}
// 修改公司私云域名
function modifycompany() {
    var product_name = $('input[name=product_name]').val();
    var company_name = $('input[name=company_name]').val();
    var company_domain = $('input[name=company_domain]').val();
    var postData = {
        product_name: product_name,
        company_domain: company_domain,
        company_name: company_name
    };
    $.post('/super/setting/updateSettings', postData, function (data) {
        if (data.rt == '0000') {
            $('.navbar .product_name').html('<a href="#" class="navbar-brand">' + product_name + '</a>');
            localStorage.setItem("product_name", product_name);
            warningOpen('操作成功！', 'primary', 'fa-check');
        } else if (data.rt == 5) {
            toLoginPage();
        } else {
            warningOpen('操作失败！', 'danger', 'fa-bolt');
            console.warn(data.rt);
        }
    });
}

// 修改管理员名称
function modifymanagerName() {
    var manager_name = $('input[name=manager_name]').val();
    var postData = {
        manager_name: manager_name
    };
    $.post('/super/setting/updateSettings', postData, function (data) {
        if (data.rt == '0000') {
            warningOpen('操作成功！', 'primary', 'fa-check');
        } else if (data.rt == 5) {
            toLoginPage();
        } else {
            warningOpen('操作失败！', 'danger', 'fa-bolt');
            console.warn(data.rt);
        }
    });
}

// 修改管理员密码
function set_updatePW() {
    var old_passwd = $('input[name=currentpw]').val();
    var new_passwd = $('input[name=newpw]').val();
    var confirpw = $('input[name=confirpw]').val();
    if (new_passwd == confirpw) {
        var postData = {
            old_passwd: old_passwd,
            new_passwd: new_passwd
        };
        $.actPost('/common/pw/mod', postData, function (data) {
            
        },'密码修改');
    } else {
        warningOpen('两次密码不一致！', 'danger', 'fa-bolt');
    }
}

$('input[type=number]').on('keydown',function(e){
        return e.keyCode!=69
})
$('input[type=number]').on('input',function(e){
    var ipt=$(this).val();
    if(ipt){
        if($(this).attr('max')){
            if(parseInt(ipt)>parseInt($(this).attr('max'))){
                ipt=$(this).attr('max');
            }
        }
    }
    $(this).val(ipt);
})
$('input[type=number]').on('blur',function(e){
    var ipt=$(this).val();
    if(ipt){
        if($(this).attr('min')){
            if(parseInt(ipt)<parseInt($(this).attr('min'))){
                ipt=$(this).attr('min');
            }
        }
    }else{
        ipt=$(this).attr('min')||0;
    }
    $(this).val(ipt);
})



