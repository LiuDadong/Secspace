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
        if(file){
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
        }
    });
}


//MultForm组件化所有form表单
$('form').each(function(){
    var multForm = $(this).MultForm({
        editAct: '/super/setting/updateSettings',
        editBtnTxt: '保存',
        resetForm:false,
        afterUsed: function (act) {
            multForm.find('input[name=url]').remove();
        },
        success:function(dt){
            if(dt.rt==="0000"){
                renderSettings();
            }
        }
    });
    multForm.usedAs('edit');
});




$("#email_server, #send_user, #send_pwd").on("input", function () {
    $('#subEmailServer').addClass("disabled");
});



// 从服务端接口获取公司详细信息
renderSettings();
function renderSettings(){
    $.silentGet('/super/setting/getSettings', {}, function (data) {
        if (data.rt == '0000') {
            var dt = data.doc;
            console.log(dt);
            localStorage.setItem("product_name", dt.product_name);
            localStorage.setItem("icon", dt.icon);
            var srcLogo= localStorage.getItem('appssec_url')+'/'+dt.icon;
            $('img.logo').attr('src',srcLogo);
            $('.product_name a.navbar-brand').text(dt.product_name);
            $(':input[name]').each(function () {
                var k = this.name,
                    v = dt[k];
                if (v !== undefined) {
                    var tag_type = $(this).prop('tagName').toLowerCase();
                    tag_type += $(this).prop('type').toLowerCase() ? (':' + $(this).prop('type').toLowerCase()) : '';
                    switch (k) {
                        case 'allow_remember_pw':
                            break;
                    }
                    switch (tag_type) {
                        case 'input:text':
                        case 'input:hidden':
                        case 'input:number':
                        case 'input:password':
                        case 'select:select-one':
                            $(this).val(data.doc[this.name]).change();
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
                        case 'input:file':
                            console.log(localStorage.getItem('appssec_url')+'/'+v);
                            $(this).prev('img').attr('src',localStorage.getItem('appssec_url')+'/'+v);
                            break;
                        default:
                            console.warn(tag_type);
                    }
                }
            })
    
    
            if (data.doc.identify_method == 3) {
                $("input:checkbox[name='identify_method1']").prop("checked", true);
                $("input:checkbox[name='identify_method2']").prop("checked", true);
                $('input[name=identify_method3]').prop("disabled", true);
            } else if (data.doc.identify_method == 5) {
                $("input:checkbox[name='identify_method1']").prop("checked", true);
                $("input:checkbox[name='identify_method3']").prop("checked", true);
                $('input[name=identify_method2]').prop("disabled", true);
            } else if (data.doc.identify_method == 4) {
                $("input:checkbox[name='identify_method3']").prop("checked", true);
                $('input[name=identify_method2]').prop("disabled", true);
            } else {
                $("input:checkbox[name='identify_method" + data.doc.identify_method + "']").prop("checked", true);
            }
        }
    });
}


// 邮箱服务器测试
var btnTestEmail = $('#btnTestEmail').on('click',function(){
    btnTestEmail.prop('disabled',true);
    btnTestEmail.closest('form').attr('readonly','readonly');
    var postData = {
        email_server: $('input[name=email_server]').val(),
        send_user: $('input[name=send_user]').val(),
        send_pwd: $('input[name=send_pwd]').val(),
        recv_user: $('#recv_user').val()
    };
    if (postData.email_server && postData.send_user && postData.send_pwd && postData.recv_user) {
        $.nullPost('/super/setting/testEmail', postData, function (data) {
            btnTestEmail.prop('disabled',false);
            btnTestEmail.closest('form').removeAttr('readonly');
            if (data.rt == '0000') {
                warningOpen('邮箱服务器信息正确！', 'primary', 'fa-check');
                $('#subEmailServer').removeClass("disabled");
            } else {
                warningOpen('邮箱服务器配置错误！', 'danger', 'fa-bolt');
                console.warn(data.rt);
            }
        });
    } else {
        setTimeout(function(){
            btnTestEmail.prop('disabled',false);
            btnTestEmail.closest('form').removeAttr('readonly');
        },500);
        warningOpen('请将信息填写完整再测试！', 'danger', 'fa-bolt');
    }
})

// 认证方式设置
$('.enhance').on('change',function(){
    if($(this).prop('checked')){
        console.log($(this).closest('.checkbox').siblings('.checkbox:has(.enhance)')[0]);
        $(this).closest('.checkbox')
            .siblings('.checkbox:has(.enhance)')
            .find('input:checkbox').prop('checked',false);
    }
});
$('input[name=identify_method]').on('change',function(){
    var v= ~~$(this).val(),
        ckb1 = $('input.identify[value=1]'),
        ckb2 = $('input.identify[value=2]'),
        ckb4 = $('input.identify[value=4]'),
        smt = $(this).closest('form').find('[type=submit]');
        ckb1.prop('checked',v%2===1);
        ckb2.prop('checked',v===2||v===3);
        ckb4.prop('checked',v===4||v===5);
        smt.prop('disabled',v===0);
});
$('.identify').on('change',function(){
    var i1 = $('input.identify[value=1]').prop('checked') ? 1 : 0;
    var i2 = $('input.identify[value=2]').prop('checked') ? 2 : 0;
    var i4 = $('input.identify[value=4]').prop('checked') ? 4 : 0;
    $('input[name=identify_method]').val(i1|i2|i4).change();
});
