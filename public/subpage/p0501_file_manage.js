/*
 * ==================================================================
 *                          文件管理
 * ==================================================================
 */




    //用于交互时改变标题显示
    var subCaption = $('#subCaption').data('itemText', '文件').text('文件列表');


    //采用分页表格组件pagingTable初始化列表
    var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
        url: '/common/list',
        jsonData: { 'url': '/p/file/listFile' },
        // theadHtml为表头类元素，第一个th用于存放全选复选框
        theadHtml: '<tr>\
                    <th style="width:8%;"></th>\
                    <th style="width:24%;">文件名</th>\
                    <th style="width:8%;">大小</th>\
                    <th style="width:8%;">版本号</th>\
                    <th style="width:14%;">已查看/已下载/已下发</th>\
                    <th style="width:14%;">更新时间</th>\
                    <th>创建者</th>\
                    <th>操作</th>\
                </tr>',
        // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
        // to-edit、to-view表示要跳转的目标表单
        tbodyDemoHtml: '<tr>\
                        <td></td>\
                        <td><span item-key="filename"></span></td>\
                        <td><span item-key="filesize"></span></td>\
                        <td><span item-key="version"></span></td>\
                        <td>\
                            <a href="#" class="numInfo" data-url="/p/file/viewFileStatus" data-flag="view">\
                                <span item-key="view">0</span>\
                            <a/>\
                            /\
                            <a href="#" class="numInfo" data-url="/p/file/viewFileStatus" data-flag="download">\
                                <span item-key="download">0</span>\
                            </a>\
                            /\
                            <a href="#" class="numInfo" data-url="/p/file/viewFileStatus" data-flag="authorized">\
                                <span item-key="authorized">0</span>\
                            </a>\
                        </td>\
                        <td><span item-key="modify_time"></span></td>\
                        <td><span item-key="creator"></span></td>\
                        <td><a todo="edit" title="编辑"><i class="fa fa-edit"></i></a><a todo="view" title="查看"><i class="fa fa-eye"></i></a></td>\
                    </tr>',
        //因不同需求需要个性控制组件表现的修正函数和增强函数
        fnGetItems: function (data) {  //必需   需要要显示的成员
            return data.file_list;
        },
        fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
            switch (k) {
                case 'visit_type':
                    v = v == 1 ? '公开文件' : '下发文件';
                    break;
                case 'platform':
                    v = v == 0 ? 'iOS' : 'Android';
                    break;
                case 'issued':
                    v = typeof v !== undefined ? v : '--';
                    break;
                default:
            }
            return v;
        },
        cbEdit: function (item) {   //点击修改、编辑按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
            multForm.usedAs('edit');
            multForm.find('.form-group:has(input[name=file_data])').hide()
                .find(':input').prop('disabled', true);
            multForm.find('.form-group:has(input[name=filename])').show()
                .find(':input').prop('disabled', false);
        },
        cbView: function (item) {  //点击产看、详情按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
            multForm.usedAs('view');
            multForm.find('.form-group:has(input[name=file_data])').hide()
                .find(':input').prop('disabled', true);
            multForm.find('.form-group:has(input[name=filename])').show()
                .find(':input').prop('disabled', false);
        }
    }))


    // 采用multForm组件初始化多用途表单
    var multForm = $('#multForm').MultForm({
        addAct: '/common/add',
        addUrl: '/p/file/uploadFile',
        addBtnTxt: '上传',
        addInfoTxt: '上传',  //添加提交成功或失败反馈的信息中的.act
        editAct: '/common/mod',
        editUrl: '/p/file/updateFile',
        editBtnTxt: '保存',
        afterReset: function () {  //表单重置之后紧接着的回调
            //控制禁用客户端权限样式和行为
            // 获取客户端设置授权项
            var permissionItems = $(this).data('permissionItems');
            $(':input[data-for=permissionItems]').each(function () {
                $(this).prop('checked', ~~permissionItems[$(this).attr('name')] == 1)
                    .prop('disabled', ~~permissionItems[$(this).attr('name')] == -1);
            })
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
            url: '/p/file/deleteFile',
            id: ''
        },
        cbAdd: function () {
            multForm.find('.form-group:has(input[name=filename])').hide()
                .find(':input').prop('disabled', true);
            multForm.find('.form-group:has(input[name=file_data])').show()
                .find(':input').prop('disabled', false);
        }
    })

    var issuePane = $('#issuePane').IssuePane({
        hasUnissueBtn: 1,
        objTargetTable: pagingTable,
        objTargetCaption: subCaption
    })



    //页面初始化事件绑定
    bindEvents();

    function bindEvents() {

        /**
         * 绑定表单事件
         */


    }


    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限