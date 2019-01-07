/*
 * ==================================================================
 *                          license管理 app
 * ==================================================================
 */

    var frm = $('#multForm'),
        iptFile = frm.find('input[type=file]'),
        btnSmt = frm.find('button[type=submit]');
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
                    : warningOpen('请选择license文件', 'danger', 'fa-bolt');
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
                if(iptFile[0].files.length===0){
                    warningOpen('请选择授权文件','danger','fa-bolt');
                    return false;
                }else{
                    iptFile.prop("disabled", true);
                    btnSmt.prop("disabled", true);
                }
            },
            success: function (data, result) {
                iptFile.prop("disabled", false).change();
                $.handleECode(true, data, '上传');
                switch (data.rt) {
                    case '0000':
                        if (data.serverModules && typeof data.serverModules == 'object') {
                            localStorage.setItem('lic',JSON.stringify(data.serverModules));
                        }
                        break;
                    default:
                        console.warn("data.rt=" + data.rt)
                }
            },
            error: function (err) {
                warningOpen('操作失败！', 'danger', 'fa-check');
                console.error(err);
            },
        });
        return false;
    });
