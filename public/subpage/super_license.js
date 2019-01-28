/*
 * ==================================================================
 *                          license管理
 * ==================================================================
 */



var frmLic = $('#multForm').MultForm({
    addAct: '/common/upload',
    addUrl: '/p/org/licenseUpload',
    addBtnTxt: '上传',
    afterUsed: function (use, item) {
        switch (use) {
            case 'add':
                break;
            default:
        }
    },
    success: function (res) {  //提交编辑成功之后的回调
        $.getLicense(function (data) {
            console.log(data);
            if (data.rt === '0000') {
                var license = data.licInfo.license
                showLicense(license);
                renderLicRolefns(license.serverModules);
            } else {
                showLicense(false);
                renderLicRolefns(false);
            }
        })
    },
    beforeSubmit: function (arrKeyVal, $frm, ajaxOptions) {
        if (frmLic.find('input[type=file]')[0].files.length === 0) {
            warningOpen('请选择授权文件', 'danger', 'fa-bolt');
            return false;
        }
        return true;
    }
});
frmLic.usedAs('add');

frmLic.find('input[type=file]').on('change input propertychange', function () {
    var ipt = $(this),
        file = this.files[0],
        frmGrp = ipt.closest('.form-group'),
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
        frmGrp.toggleClass('has-error', !bool);
    }
})


var licForm = $('#licForm').MultForm({
    resetForm:false,
    editUrl: '/p/super/updateSettings',
    editBtnTxt: '保存'
});
$.getLicense(function (data) {
    if (data.rt === '0000') {
        var license = data.licInfo.license
        showLicense(license);
        renderLicRolefns(license.serverModules);
    } else {
        showLicense(false);
        renderLicRolefns(false);
    }
    if (data.licInfo && data.licInfo.setting) {
        licForm.data('item', data.licInfo.setting);
    }else{
        licForm.data('item', {});
    }
    licForm.usedAs('edit');
})
var fnTree = $('#fnTree');
fnTree.find('li i.fa').on('click', function () {
    $(this)
        .toggleClass('fa-plus')
        .toggleClass('fa-minus')
        .closest('li').toggleClass('open');
});
$('#tgltree').on('click', function () {
    $(this).toggleClass('blue');
    if ($(this).hasClass('blue')) {
        fnTree.find('i.fa.fa-plus').click();
    } else {
        fnTree.find('i.fa.fa-minus').click();
    }
});
function showLicense(license) {
    if (license) {
        $('[data-path]').each(function () {
            if ($(this).hasClass('list-group-item')) {
                var forbid = getValFromLicByPath(license, $(this).data('path')) == -1;
                $(this).toggleClass('success', !forbid).toggleClass('darkorange', forbid);
                $(this).find('i.glyphicon').toggleClass('glyphicon-ok', !forbid).toggleClass('glyphicon-remove', forbid);
            } else {
                $(this).html(getValFromLicByPath(license, $(this).data('path')));
            }
        });
    } else {
        $('[data-path]').each(function () {
            if ($(this).hasClass('list-group-item')) {
                var forbid = false;
                $(this).toggleClass('success', !forbid).toggleClass('darkorange', forbid);
                $(this).find('i.glyphicon').toggleClass('glyphicon-ok', !forbid).toggleClass('glyphicon-remove', forbid);
            } else {
                $(this).html('--');
            }
        });
    }


    function getValFromLicByPath(lic, path) {
        var val = lic, keys = path.split('.');
        try {
            for (i in keys) {
                val = val[keys[i]];
                if (val === '' || val === null || val === undefined) {
                    val = '— —';
                    break;
                }
            }
        } catch (err) {
            val = '— —';
            this.console.error(item);
            this.console.error(keys);
            this.console.error(err);
        }
        switch (path) {
            case 'attributes.maxUserNumber':
            case 'attributes.maxDevNumber':
                if (val['Control'] == 'ON') {
                    val = val['Number'];
                } else {
                    val = "不限制";
                }
                break;
            case 'attributes.maxDevNumber':
                if (val['Control'] == 'ON') {
                    val = val['Number'];
                } else {
                    val = "不限制";
                }
                break;
            case 'product.validTime.startTime':
            case 'product.validTime.stopTime':
                val = val.substr(0, val.length - 3);
                break;
            default:

        }
        return val;
    }
}
//根据授权license控制角色功能点备选项显示或隐藏
function renderLicRolefns(fns) {
    fnTree.find('label>input:checkbox').each(function () {
        if ($(this).prev('i').length == 0) {
            $(this).addClass('hidden').before('<i class="glyphicon" style="margin:-6px 4px 0 0;"></i>');
        }
    });
    if (fns) {
        var licFns = $.getLicPath('', fns, {});
        for (k in licFns) {
            if (typeof licFns[k] == "string") {
                licFns[k] = licFns[k].split('-');
            }
        }
        applyLicFns(licFns);
    } else {
        fnTree.find('label').each(function () {
            toggleLabel(this, false);
        });
    }
    function toggleLabel(label, yesno) {
        $(label).toggleClass('darkorange', !yesno)
            .toggleClass('success', yesno);
        $(label).find('i.glyphicon')
            .toggleClass('glyphicon-remove', !yesno)
            .toggleClass('glyphicon-ok', yesno);
        $(label).closest('ul').each(function () {
            if ($(this).children('li').length === $(this).children('li:has(.darkorange>.glyphicon-remove)').length) {
                toggleLabel($(this).prev('li').find('label'), false);
            }
        });
    }
    function applyLicFns(licFns) {
        fnTree.find('label').each(function () {
            toggleLabel(this, true);
        });
        fnTree.find('ul[data-key]').each(function () {
            var fns = licFns[$(this).data('key')];
            if (fns instanceof Array && fns[0] == 'acc') {
                $(this).find('li').each(function () {
                    if (fns.indexOf($(this).find('input').data('val')) === -1) {
                        toggleLabel($(this).find('label'), false);
                    }
                });
            } else {
                toggleLabel($(this).find('li label'), false);
            }
        });
        fnTree.find('ul').each(function () {
            if ($(this).find('.darkorange').length > 0) {
                $(this).prev('li').find('label').addClass('darkorange');
            }
        });
    }


}

