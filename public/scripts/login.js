$('.savepw input:checkbox').on('click', function () {
    if (!$(this).prop('checked')) {
        localStorage.removeItem("passwd");
        localStorage.removeItem("account");
        localStorage.removeItem("_account");
        localStorage.removeItem("_passwd");
    }
})

if (localStorage.getItem("account") && localStorage.getItem("passwd")) {
    $('.savepw input:checkbox').prop('checked', true);
    $('input[name=account]').val(localStorage.getItem("account"));
    $('input[name=passwd]').val(localStorage.getItem("passwd"));
} else {
    $('.savepw input:checkbox').prop('checked', false);
    $('input[name=account]').val('');
    $('input[name=passwd]').val('');
}

$.get('/p/login/getProductName', function (data) {
    data = JSON.parse(data);
    if (data.rt == '0000') {
        $('h3').html(data.product_name);
    } else {
        $('h3').html('移动安全管理平台');
    }
});
// login
$('form').ajaxForm({
    type: "POST",
    dataType: 'json',
    beforeSubmit: function () {
        if ($('input[name=account]').val() == '') {
            alert('请输入账号！');
            return false;
        } else if ($('input[name=passwd]').val() == '') {
            alert('请输入密码！');
            return false;
        }
        if ($('.savepw input:checkbox').prop('checked')) {
            localStorage.setItem("_account", $('input[name=account]').val());
            localStorage.setItem("_passwd", $('input[name=passwd]').val());
        } else {
            localStorage.removeItem("_account");
            localStorage.removeItem("_passwd");
        }
    },
    success: function (data) {
        var errorText = '';
        switch (data.rt) {
            case '0000':    //登录成功
                if (localStorage.getItem("_account") && localStorage.getItem("_passwd")) {
                    localStorage.setItem("account", localStorage.getItem("_account"));
                    localStorage.setItem("passwd", localStorage.getItem("_passwd"));
                    localStorage.removeItem("_account");
                    localStorage.removeItem("_passwd");
                }
                if ($('.login input[name=flag]').val() == 'per') {
                    localStorage.setItem("data1", JSON.stringify(data));
                    location.href = "/per/settings";
                } else {
                    localStorage.setItem("avatar", data.avatar);
                    localStorage.setItem("icon", data.icon);
                    localStorage.setItem("productName", data.product_name);
                    localStorage.setItem("appssec_url", data.manager_url);
                    // location.href = "/man/first";
                    location.href = "/";
                }
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
