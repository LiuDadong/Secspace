/*
 * ==================================================================
 *                          管理员角色管理
 * ==================================================================
 */

var fnTree = $('#fnTree');
var ulskey=fnTree.find('ul[data-key]');
var iptFn=fnTree.find('input:hidden[name=function]');


//用于交互时改变标题显示
var subCaption = $('#subCaption').data('itemText', '管理员角色').text('管理员角色列表');
//采用分页表格组件pagingTable初始化黑白名单列表
var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
    jsonData: { 'url': '/p/role/roleManage' },
    // theadHtml为表头类元素，第一个th用于存放全选复选框
    theadHtml: '<tr>\
                    <th style="width:8%"></th>\
                    <th>名称</th>\
                    <th style="width:12%">状态</th>\
                    <th>创建者</th>\
                    <th style="width:18%">创建时间</th>\
                    <th style="width:16%">操作</th>\
                </tr>',
    // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
    // to-edit、to-view表示要跳转的目标表单
    tbodyDemoHtml: '<tr>\
                        <td></td>\
                        <td><span item-key="name"></span></td>\
                        <td><span item-key="status"></span></td>\
                        <td><span item-key="creator"></span></td>\
                        <td><span item-key="create_time"></span></td>\
                        <td><a todo="edit" title="编辑"><i class="fa fa-edit"></i></a><a todo="view" title="查看"><i class="fa fa-eye"></i></a></td>\
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
        var permissionItems = $(this).data('permissionItems');
        $(':input[data-for=permissionItems]').each(function () {
            $(this).prop('checked', ~~permissionItems[$(this).attr('name')] == 1)
                .prop('disabled', ~~permissionItems[$(this).attr('name')] == -1);
        })
        $('#allcheck.blue').removeClass('blue');
        $('#tgltree.blue').removeClass('blue');
        fnTree.find('i.fa.fa-minus').click();
    },
    afterUsed:function (act) {  //表单重置之后紧接着的回调
        //控制禁用客户端权限样式和行为
        // 获取客户端设置授权项
        switch (act) {
            case 'add':
                fnTree.find('input[name=function]').val('{}');
                break;
            case 'edit':
                
                break;
            default:
                
        }
    },
    cbAfterSuccess: function (act) {  //提交编辑成功之后的回调
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

//fnTree事件绑定
fnTree.find('li input').on('input propertychange change', function () {
    $(this).closest('li').next('ul').find('input').prop('checked', $(this).prop('checked'));  //改变本级选定状态，所有下级跟着改变

    $(this).parents('ul').prev('li').each(function () {
        $(this).find('input').prop('checked', $(this).next('ul').find('input:checked').length > 0);  //根据下级是否有勾选的功能点，判断本级是否勾选
    });

    if ($(this).attr('data-val') && $(this).prop('checked')) {
        $(this).closest('ul').find('input[data-val=acc]').prop('checked', true);   //勾选任意功能点,默认选中查看权限
    }
    getRolefns();
});
fnTree.find('li input[data-val=acc]').on('input propertychange change', function () {
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
    multForm.removeClass('needmod');
    fnTree.find('input:checkbox').prop('checked', $(this).hasClass('blue'));
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
    var json = {};
    ulskey.each(function () {
        var str='';
        $(this).find('li input:checked').each(function () {
            str+=('-'+$(this).data('val'))
        });
        if(str){
            json[$(this).data('key')]=str.substr(1);
        }
    })
    iptFn.val(JSON.stringify(json));
}



function showRolefns(){
    var jsonFns=iptFn.data('value');
    fnTree.find('i.fa.fa-minus').click();
    fnTree.find('input:checkbox').prop('checked',false);
    ulskey.each(function(){
        var fns=jsonFns[$(this).data('key')];
        if(fns){
            fns=fns.split('-');
            $(this).prev('li').find('input').prop('checked',true);
            $(this).parents('ul').prev('li').find('input').prop('checked',true);
            $(this).find('li input').each(function(){
                if(fns.indexOf($(this).data('val'))!=-1){
                    $(this).prop('checked',true);
                }
            })
        }
    })
    $('ul:has(input:checked)').prev('li').each(function(){
        $(this).find('i.fa.fa-plus').click();
    })
}



//根据授权license控制角色功能点备选项是否删除
renderLicToRolefns();


//根据授权license控制角色功能点备选项显示或隐藏
function renderLicToRolefns(){
    $.getLicense(function(data){
        if(data.rt==='0000'){
            var  rolesFns= $.getLicPath('',data.licInfo.license.serverModules,{});
            for(k in rolesFns){
                if(typeof rolesFns[k] == "string"){
                    rolesFns[k]=rolesFns[k].split('-');
                }
            }
            applyLicFns(rolesFns);
            function applyLicFns(rolesFns){
                ulskey.each(function(){
                    var li=$(this).prev('li'),
                        fns=rolesFns[$(this).data('key')];
                        switch (fns){
                            case 0:
                            case false:
                            case undefined:
                            case '':
                                $(this).remove();
                                li.remove();
                                break;
                            default:
                                if(fns instanceof Array){
                                    $(this).find('li').each(function(){
                                        if(fns.indexOf($(this).find('input').data('val'))===-1){
                                            $(this).remove();
                                        }
                                    });
                                }
                        }
                });
            }
        }
    })
}