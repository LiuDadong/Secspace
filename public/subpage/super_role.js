/*
 * ==================================================================
 *                          管理员角色管理
 * ==================================================================
 */

var fnTree = $('#fnTree');

//用于交互时改变标题显示
var subCaption = $('#subCaption').data('itemText', '管理员角色').text('管理员角色列表');
//采用分页表格组件pagingTable初始化黑白名单列表
var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
    jsonData: { 'url': '/p/role/roleManage' },
    // theadHtml为表头类元素，第一个th用于存放全选复选框
    theadHtml: '<tr>\
                    <th></th>\
                    <th>名称</th>\
                    <th>状态</th>\
                    <th>创建者</th>\
                    <th>创建时间</th>\
                    <th>操作</th>\
                </tr>',
    // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
    // to-edit、to-view表示要跳转的目标表单
    tbodyDemoHtml: '<tr>\
                        <td></td>\
                        <td><span item-key="name"></span></td>\
                        <td><span item-key="status"></span></td>\
                        <td><span item-key="creator"></span></td>\
                        <td><span item-key="create_time"></span></td>\
                        <td><a toForm="edit">编辑</a><a toForm="view">查看</a></td>\
                    </tr>',
    //因不同需求需要个性控制组件表现的修正函数和增强函数
    fnGetItems: function (data) {  //必需   需要要显示的成员
        return data.role_info;
    },
    fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
        switch (k) {
            case 'status':
                v = v == 1 ? '启用' : '禁用';  //例： item['status']的值为1时，在<span item-key="status"></span>中显示文本‘启用’，否则显示‘禁用’
                break;
            default:
        }
        return v;
    },
    cbEdit: function (item) {   //点击修改、编辑按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
        multForm.usedAs('edit');
        showRolefns();
    },
    cbView: function (item) {  //点击产看、详情按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
        multForm.usedAs('view');
        showRolefns();
    }
}))


// 采用multForm组件初始化黑白名单多用途表单
var multForm = $('#multForm').MultForm({
    addUrl: '/p/role/roleManage',
    addBtnTxt: '添加',
    editUrl: '/p/role/roleManage',
    editBtnTxt: '保存',
    afterReset: function () {  //表单重置之后紧接着的回调
        //控制禁用客户端权限样式和行为
        // 获取客户端设置授权项
        var permissionItems = $(this).data('permissionItems');
        $(':input[data-for=permissionItems]').each(function () {
            $(this).prop('checked', ~~permissionItems[$(this).attr('name')] == 1)
                .prop('disabled', ~~permissionItems[$(this).attr('name')] == -1);
        })
        fnTree.find('i.fa.fa-minus').click();
    },
    cbSubmit: function (act) {  //提交编辑成功之后的回调
        switch (act) {
            case 'add':
                pagingTable.PagingTable('refresh');
                break;
            case 'edit':
                pagingTable.PagingTable('refresh');
                break;
            default:
                pagingTable.PagingTable('refresh');
        }
    }
})

var panel = $('#panel').Panel({
    objTargetTable: pagingTable,
    objTargetForm: multForm,
    objTargetCaption: subCaption,
    deleteJson: {
        url: '/p/role/roleManage',
    },
    updateStatusJson: {
        url: '/p/role/chStatus',
    }
})



//模块特别情况处理
//console.log('licPath:');
//console.log(JSON.parse($.cookie('licPath')));
// 获取客户端设置授权项
// $.silentGet('/getFunctions', { url: '/p/org/getRoleFunctions' }, function (data) {
//     if(data.rt==='0000'){
//         var jsonFunctions = data.RoleFunctionJson;
//         multForm.data('jsonFunctions', jsonFunctions);
//     }

// })


//fnTree事件绑定
fnTree.find('li input').on('input propertychange change', function () {

    $(this).closest('li').next('ul').find('input').prop('checked', $(this).prop('checked'));  //改变本级选定状态，所有下级跟着改变

    $(this).parents('ul').prev('li').each(function () {
        $(this).find('input').prop('checked', $(this).next('ul').find('input:checked').length > 0);  //根据下级是否有勾选的功能点，判断本级是否勾选
    });

    if ($(this).attr('value') && $(this).prop('checked')) {
        $(this).closest('ul').find('input[value=acc]').prop('checked', true);   //勾选任意功能点,默认选中查看权限
    }
    getRolefns();
});
fnTree.find('li input[value=acc]').on('input propertychange change', function () {
    if(!$(this).prop('checked')){
        $(this).closest('li').nextAll('li').find('input:checked').click();
    }
});

fnTree.find('li i.fa').on('click', function () {
    $(this)
        .toggleClass('fa-plus')
        .toggleClass('fa-minus')
        .closest('li').toggleClass('open');
})

$('#allcheck').on('click', function () {
    $(this).toggleClass('blue');
    fnTree.find('input').prop('checked', $(this).hasClass('blue'));
    getRolefns();
});

$('#tgltree').on('click', function () {
    $(this).toggleClass('blue');
    if ($(this).hasClass('blue')) {
        fnTree.find('i.fa.fa-plus').click();
    } else {
        fnTree.find('i.fa.fa-minus').click();
    }
});



getRolefns();  //将角色功能点树的选择情况保存到input:hidden[name=function]
function getRolefns() {
    var iptallfns = fnTree.find('input:hidden[all-fns]'),
        json = {};
    iptallfns.each(function () {
        var mdlkey = $(this).attr('mdl-key'),
            allfns = $(this).attr('all-fns'),
            selfns = '';
        $(this).nextAll('li:has(input:checked)').each(function () {
            selfns +=('-' + $(this).find('input').attr('value'));
        });
        if(selfns!==''){
            selfns=selfns.substr(1)
            json[mdlkey] = (allfns === selfns ? 1 : selfns);
        }
    })
    
    fnTree.find('input:hidden[name=function]').val(JSON.stringify(json));
}



function showRolefns(){
    var iptFns=fnTree.find('input:hidden[name=function]'),
        jsonFns=iptFns.data('value');
    fnTree.find('i.fa.fa-minus').click();
    fnTree.find('input').prop('checked',false);
    for(k in jsonFns){
        if(jsonFns[k]==1){
            fnTree.find('input:hidden[mdl-key='+ k +']').closest('ul').find('li input[value]').prop('checked',true).change();
        }else{
            var fns=jsonFns[k].split('-');
            for(i in fns){
                fnTree.find('input:hidden[mdl-key='+ k +']').closest('ul').find('li input[value='+fns[i]+']').prop('checked',true).change();
            }
        }
    }
    $('ul:has(input:checked)').prev('li').each(function(){
        $(this).find('i.fa.fa-plus').click();
    })
}



//根据授权licence控制角色功能点备选项显示或隐藏
renderLicToRolefns();


//根据授权licence控制角色功能点备选项显示或隐藏
function renderLicToRolefns(){
    var  rolesFns= getLicPath('',JSON.parse(localStorage.getItem('lic')),{});
    console.log(rolesFns);

    for(k in rolesFns){
        if(typeof rolesFns[k] == "string"){
            rolesFns[k]=rolesFns[k].split('-');
        }
    }
    console.log(rolesFns);
    applyLicFns(rolesFns);
    function applyLicFns(rolesFns){
        fnTree.find('input:hidden[mdl-key]').each(function(){
            var ipt=$(this),
                ul=ipt.closest('ul'),
                li=ul.prev('li'),
                key=ipt.attr('mdl-key'),
                fns=rolesFns[key];
                if(fns===false||fns===0||fns===undefined){
                    ul.remove();
                    li.remove();
                }else if(fns instanceof Array){
                    if(fns[0]=='acc'){
                        ipt.nextAll('li').each(function(){
                            if(fns.indexOf($(this).find('input').attr('value'))===-1){
                                console.log($(this).find('input').attr('value'))
                                $(this).remove();
                            }
                        });
                    }else{
                        ul.remove();
                        li.remove();
                    }
                    
                }else{}
        });
        fnTree.find('li').each(function(){
            var nextUl=$(this).next('ul');
            if(nextUl.length===1&&nextUl.find('li').length===0){
                nextUl.remove();
                $(this).remove();
            }
        });
    }
}