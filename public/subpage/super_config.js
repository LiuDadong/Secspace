/*
 * ==================================================================
 *                          管理员角色管理
 * ==================================================================
 */



// //采用分页表格组件pagingTable初始化列表
var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
    jsonData: { 'url': '/p/config/filelist','org_code':'root' },
    paging:false,
    // theadHtml为表头类元素，第一个th用于存放全选复选框
    theadHtml: '<tr>\
                    <th style="width:8%"></th>\
                    <th style="width:30%">文件名</th>\
                    <th style="width:12%">大小/B</th>\
                    <th>创建时间</th>\
                    <th>上传时间</th>\
                    <th>操作</th>\
                </tr>',
    // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
    // to-edit、to-view表示要跳转的目标表单
    tbodyDemoHtml: '<tr>\
                        <td></td>\
                        <td><span item-key="name"></span></td>\
                        <td><span item-key="size"></span></td>\
                        <td><span item-key="birth_time"></span></td>\
                        <td><span item-key="upload_time"></span></td>\
                        <td><a onclick="downloadConfigFiles(this)" title="下载" class="btn btn-primary btn-xs" href="javascript:void(0);"><i class="fa fa-download"></i></a></td>\
                    </tr>',
    //因不同需求需要个性控制组件表现的修正函数和增强函数
    fnGetItems: function (data) {  //必需   需要要显示的成员
        return data.files;
    },
    fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
        switch (k) {
            case 'status':
                v = v == 1 ? '启用' : '禁用';  //例： item['status']的值为1时，在<span item-key="status"></span>中显示文本‘启用’，否则显示‘禁用’
                break;
            default:
        }
        return v;
    }
}))

uploadFormInit();
function uploadFormInit() {
    var uploadForm=$('#uploadForm'),
        pgrBar = uploadForm.find('.progress .progress-bar'),     //pgrBar.css("width":"30%");
        pgrSro = pgrBar.find('.progress .progress-bar .sr-only'),  //pgrSro.text("30%");
        ajaxFormOptions = {
            reset:true,
            beforeSubmit: function (arrKeyVal, $frm, ajaxOptions) {
                uploadForm.find('label:has(input[name=config_files])').addClass('disabled');
                return true;
            },
            uploadProgress: function (event) {
                if (event.lengthComputable) {
                    var cplt;
                    cplt = Number.parseInt(event.loaded / event.total * 100) + "%";
                    pgrBar.css('width', cplt)
                    pgrSro.text(cplt);
                }
            },
            success: function (data) {
                uploadForm.find('label:has(input[name=config_files])').removeClass('disabled');
                uploadForm[0].reset();
                $.handleECode(true, data, '上传');
                switch (data.rt) {
                    case '0000':
                        break;
                    default:
                        console.warn("data.rt=" + data.rt)
                }
            }
        };
    uploadForm.ajaxForm(ajaxFormOptions);
    uploadForm.find('input[name=config_files]').on('change',function(){
        uploadForm.submit();
    })
}

function downloadConfigFiles(ele){
    var filename=$(ele).closest('tr').data('item').name;
    $('<form action="/common/config_file/download" method="post">' +  // action请求路径及推送方法
                '<input type="text" name="org_code" value="root"/>' + // 文件路径
                '<input type="text" name="filename" value="'+filename+'"/>' + // 文件名称
            '</form>')
        .appendTo('body').submit().remove();
}

function deleteConfigFiles(){
    var selFilenames=[];
    selFilenames = pagingTable.data('PagingTable').sel.map(function(item){
        return item.name;
    });
    if(selFilenames.length>0){
        $.dialog('confirm',{
            title: '配置文件删除确认',
            content: '确认删除选中的配置文件吗?',
            confirmValue: '确认',
            confirm: function () {
                $.actPost('/common/config_files/delete', {
                    org_code:'root',
                    deleteFilenames: selFilenames
                }, function (data) {
                    pagingTable.PagingTable('update');
                }, '删除');
            },
            cancel: function () {

            },
            cancelValue: '取消',
            
        })
    }else{
        warningOpen('请选择配置文件','danger','fa-bolt');
    }
}

