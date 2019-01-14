/*
 * ==================================================================
 *                          license管理
 * ==================================================================
 */



var frmLic =$('#multForm').MultForm({
    addAct:'/common/upload',
    addUrl:'/p/org/licenseUpload',
    addBtnTxt: '上传',
    afterUsed:function(use,item){
        switch(use){
            case 'add':
                break;
            default:
        }
    },
    success: function (res) {  //提交编辑成功之后的回调
        $.getLicense(function(data){
            if(data.rt==='0000'){
                var license=data.licInfo.license
                showLicense(license);
                renderLicRolefns(license.serverModules);
            }else{
                showLicense(false);
                renderLicRolefns(false);
            }
        })
    },
    beforeSubmit: function (arrKeyVal, $frm, ajaxOptions) {
        if(frmLic.find('input[type=file]')[0].files.length===0){
            warningOpen('请选择授权文件','danger','fa-bolt');
            return false;
        }
        return true;
    }
});
frmLic.usedAs('add');

frmLic.find('input[type=file]').on('change input propertychange', function () {
    var ipt=$(this),
        file = this.files[0],
        frmGrp=ipt.closest('.form-group'),
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
        frmGrp.toggleClass('has-error',!bool);
    }
})



$.getLicense(function(data){
    console.log(data);
    if(data.rt==='0000'){
        var license=data.licInfo.license
        showLicense(license);
        renderLicRolefns(license.serverModules);
    }else{
        showLicense(false);
        renderLicRolefns(false);
    }
})
var fnTree=$('#fnTree');
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
function showLicense(license){
    if(license){
        $('[data-path]').each(function(){
            if($(this).hasClass('list-group-item')){
                var forbid = getValFromLicByPath(license,$(this).data('path'))==-1;
                $(this).toggleClass('success',!forbid).toggleClass('darkorange',forbid);
                $(this).find('i.glyphicon').toggleClass('glyphicon-ok',!forbid).toggleClass('glyphicon-remove',forbid);
            }else{
                $(this).html(getValFromLicByPath(license,$(this).data('path')));
            }
        });
    }else{
        $('[data-path]').each(function(){
            if($(this).hasClass('list-group-item')){
                var forbid = false;
                $(this).toggleClass('success',!forbid).toggleClass('darkorange',forbid);
                $(this).find('i.glyphicon').toggleClass('glyphicon-ok',!forbid).toggleClass('glyphicon-remove',forbid);
            }else{
                $(this).html('--');
            }
        });
    }
    

    function getValFromLicByPath(lic, path) {
        var val = lic, keys = path.split('.');
        try {
            for (i in keys) {
                val = val[keys[i]];
                if(val===''||val===null||val===undefined){
                    val='— —';
                    break;
                }
            }
        } catch (err) {
            val = '— —';
            this.console.error(item);
            this.console.error(keys);
            this.console.error(err);
        }
        switch (path){
            case 'attributes.maxUserNumber':
            case 'attributes.maxDevNumber':
                if(val['Control']=='ON'){
                    val=val['Number'];
                }else{
                    val="不限制";
                }
                break;
            case 'attributes.maxDevNumber':
                if(val['Control']=='ON'){
                    val=val['Number'];
                }else{
                    val="不限制";
                }
                break;
            case 'product.validTime.startTime':
            case 'product.validTime.stopTime':
                val= val.substr(0,val.length-3);
                break;
            default:

        }
        return val;
    }
}
//根据授权license控制角色功能点备选项显示或隐藏
function renderLicRolefns(fns){
    fnTree.find('label>input:checkbox').each(function(){
        if($(this).prev('i').length==0){
            $(this).addClass('hidden').before('<i class="glyphicon" style="margin:-6px 4px 0 0;"></i>');
        }
    });
    if(fns){
        var  rolesFns= $.getLicPath('',fns,{});
        for(k in rolesFns){
            if(typeof rolesFns[k] == "string"){
                rolesFns[k]=rolesFns[k].split('-');
            }
        }
        applyLicFns(rolesFns);
    }else{
        fnTree.find('label').each(function(){
            toggleLabel(this,false);
        });
    }
    function toggleLabel(label,yesno){
        $(label).toggleClass('darkorange',!yesno)
        .toggleClass('success',yesno);
        $(label).find('i.glyphicon')
        .toggleClass('glyphicon-remove',!yesno)
        .toggleClass('glyphicon-ok',yesno);
    }
    function applyLicFns(rolesFns){
        fnTree.find('label').each(function(){
            toggleLabel(this,true);
        });
        fnTree.find('input:hidden[mdl-key]').each(function(){
            var ipt=$(this),
                ul=ipt.closest('ul'),
                li=ul.prev('li'),
                key=ipt.attr('mdl-key'),
                fns=rolesFns[key];
                if(fns===false||fns===0||fns===undefined){
                    li.find('label').addClass('disabled').find('input').prop('checked',false);
                }else if(fns instanceof Array){
                    if(fns[0]=='acc'){
                        ipt.nextAll('li').each(function(){
                            if(fns.indexOf($(this).find('input').attr('value'))===-1){
                                toggleLabel($(this).find('label'),false);
                            }
                        });
                    }else{
                        toggleLabel(li.find('label'),false);
                    }
                }else{}
        });
        fnTree.find('li').each(function(){
            var nextUl=$(this).next('ul');
            if(nextUl.length===1&&nextUl.find('li').length===0){
                nextUl.addClass('disabled');
                toggleLabel(nextUl.find('label'),false);
                toggleLabel($(this).find('label'),false);
            }
        });
    }
    
}

