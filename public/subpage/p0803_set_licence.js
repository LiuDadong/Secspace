/*
 * ==================================================================
 *                          licence管理 app
 * ==================================================================
 */

var frm = $('#multForm'),
    iptFile = frm.find('input[type=file]'),
    btnSmt = frm.find('button[type=submit]');

frm.attr("action", localStorage.getItem("appssec_url") + "/p/org/licenseUpload");

iptFile.on('change input propertychange', function () {
    var file = this.files[0],
        eleFn = $(this).nextAll('p.file-name'),
        eleFh = $(this).nextAll('p.file-help'),
        lab = $(this).parents('.form-group').find('label b'),
        fn, ex, fs;
    var maxSize = 50;
    if (file) {
        fn = file.name;
        ex = fn.substr(fn.lastIndexOf('.'));
        fs = file.size;
        if ($.inArray(ex, ['.lic']) != -1 && fs <= maxSize * 1024 * 1024) {
            checkRes(true);
        } else {
            fs > maxSize * 1024 * 1024
                ? warningOpen('文件大小不得超过' + maxSize + "MB", 'danger', 'fa-bolt')
                : warningOpen('请选择licence文件', 'danger', 'fa-bolt');
            checkRes(false);
        }

    } else {
        checkRes(false)
    }
    function checkRes(bool) {
        eleFn.text(fn).toggleClass('hidden', !bool);
        eleFh.toggleClass('hidden', bool);
        lab.toggleClass('danger', !bool);
        btnSmt.prop('disabled', !bool)
    }
})


frm.on('submit', function () {
    frm.ajaxSubmit({
        resetForm: true,
        beforeSubmit: function () {
            console.info(iptFile[0].files[0]);
            iptFile.prop("disabled", true);
            btnSmt.prop("disabled", true);
        },
        success: function (data, result) {
            iptFile.prop("disabled", false).change();
            switch (data.rt) {
                case '0000':
                    if (data.serverModules && typeof data.serverModules == 'object') {
                        var licPath = getLicPath('', data.serverModules, {});
                        $.silentGet('/newlic', { 'licPath': JSON.stringify(licPath) }, function (data) {
                            console.info(data);
                            if (data.rt == '0000') {
                                warningOpen('激活成功！', 'primary', 'fa-check');
                            } else {
                                warningOpen('更新licence失败！', 'danger', 'fa-bolt');
                            }

                        })
                        licApply(licPath);
                    } else {
                        warningOpen('没有返回licence解析数据！', 'danger', 'fa-bolt');
                    }
                    break;
                case 45:
                    warningOpen('Licence已过期！', 'danger', 'fa-bolt');
                    break;
                case 47:
                    warningOpen('同一License文件只能在同一台设备上激活！', 'danger', 'fa-bolt');
                    break;
                case 48:
                    warningOpen('已达到授权用户数！', 'danger', 'fa-bolt');
                    break;
                case 49:
                    warningOpen('已达到授权设备数', 'danger', 'fa-bolt');
                    break;
                case 46:
                    warningOpen('Licence读取失败！', 'danger', 'fa-bolt');
                    break;
                default:
                    console.warn("data.rt=" + data.rt)
                    warningOpen('licence上传失败！', 'danger', 'fa-bolt');
            }
        },
        error: function (err) {
            warningOpen('操作失败！', 'danger', 'fa-check');
            console.error(err);
        },
    });
    return false;
});

function getLicPath(baseP, lic, licPath) {
    for (i in lic) {
        switch (typeof lic[i]) {
            case 'object':
                getLicPath(baseP + i, lic[i], licPath);
                break;
            case 'boolean':
                licPath[baseP + i] = lic[i];
                break;
            default:
        }
    }
    if (baseP == '') {
        return licPath
    }
}

