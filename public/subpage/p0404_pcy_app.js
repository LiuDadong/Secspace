/*
 * ==================================================================
 *                          应用策略 apppolicy
 * ==================================================================
 */
    var camap = new CAmap('amapwrap');
    applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限

    //用于交互时改变标题显示
    var subCaption = $('#subCaption').data('itemText', '应用策略').text('应用策略列表');

    //采用分页表格组件pagingTable初始化黑白名单列表
    var pagingTable = $.extend(true, {}, $('#pagingTable').PagingTable({
        jsonData: {
            'url': '/p/policy/appPolicyMan',
        },
        // theadHtml为表头类元素，第一个th用于存放全选复选框
        theadHtml: '<tr>\
                    <th></th>\
                    <th>名称</th>\
                    <th>类型</th>\
                    <th>状态</th>\
                    <th style="width:12%;">已应用/已下发</th>\
                    <th class="filter btn-group">\
                        <a class="btn btn-default dropdown-toggle" data-toggle="dropdown">\
                            <span>来源</span> <i class="fa fa-angle-down"></i>\
                        </a>\
                        <ul class="dropdown-menu">\
                            <li>\
                                <div class="checkbox">\
                                    <label>\
                                        <input type="checkbox" name="filter" value="PUB" />\
                                        <span class="text">上级发布</span>\
                                    </label>\
                                </div>\
                            </li>\
                            <li>\
                                <div class="checkbox">\
                                    <label>\
                                        <input type="checkbox" name="filter" value="ISS" />\
                                        <span class="text">上级下发</span>\
                                    </label>\
                                </div>\
                            </li>\
                            <li>\
                                <div class="checkbox">\
                                    <label>\
                                        <input type="checkbox" name="filter" value="NAV" />\
                                        <span class="text">本级创建</span>\
                                    </label>\
                                </div>\
                            </li>\
                        </ul>\
                    </th>\
                    <th style="width:14%;">更新时间</th>\
                    <th>创建者</th>\
                    <th>管理者</th>\
                    <th>操作</th>\
                </tr>',
        // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
        // to-edit、to-view表示要跳转的目标表单
        tbodyDemoHtml: '<tr>\
                        <td></td>\
                        <td><span item-key="name"></span></td>\
                        <td><span item-key="policy_type"></span></td>\
                        <td><span item-key="status"></span></td>\
                        <td>\
                            <a href="#" class="numInfo" data-url="/p/policy/userByPolId">\
                                <span item-key="used"></span>/<span item-key="issued"></span>\
                            </a>\
                        </td>\
                        <td><span item-key="origin"></span></td>\
                        <td><span item-key="update_time"></span></td>\
                        <td><span item-key="creator"></span></td>\
                        <td><span item-key="manager"></span></td>\
                        <td><a todo="edit" title="编辑"><i class="fa fa-edit"></i></a><a todo="view" title="查看"><i class="fa fa-eye"></i></a></td>\
                    </tr>',
        //因不同需求需要个性控制组件表现的修正函数和增强函数
        fnGetItems: function (data) {  //必需   需要要显示的成员
            return data.policies;
        },
        fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
            switch (k) {
                case 'policy_type':
                    v = $.textPolicy(v).type;
                    break;
                case 'status':
                    v = v == 1 ? '启用' : '禁用';  //例： item['status']的值为1时，在<span item-key="status"></span>中显示文本‘启用’，否则显示‘禁用’
                    break;
                case 'origin':
                    switch (v) {
                        case 'NAV':
                            v = '本级创建';
                            break;
                        case 'PUB':
                            v = '上级发布';
                            break;
                        case 'ISS':
                            v = '上级下发';
                            break;
                        default:
                    }
                    break;
                default:
            }
            return v;
        },
        cbEdit: function () {   //点击修改、编辑按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
            multForm.usedAs('edit');
        },
        cbView: function () {  //点击产看、详情按钮，跳转至表单后的回调函数，用于数据显示、表单控制修正
            multForm.usedAs('view');
        }
    }))

    // 采用multForm组件初始化黑白名单多用途表单
    var multForm = $('#multForm').MultForm({
        addUrl: '/p/policy/appPolicyMan',
        editUrl: '/p/policy/appPolicyMan',
        editBtnTxt: '保存并下发',
        afterReset: function () {  //表单重置之后紧接着的回调
            //控制禁用客户端权限样式和行为
            // 获取客户端设置授权项
        },
        beforeUsed: function (use, item) {
            switch (use) {
                case "add":
                    break;
                case "edit":
                    break;
                case "view":
                    break;
                default:
            }
        },
        afterUsed: function (use, item) {
            this.off('submit');
            var btnSubmit = this.find('input[type=submit]');
            switch (use) {
                case "add":
                    btnSubmit.off().on('click', function (e) {
                        e.preventDefault();
                        add_policy();
                        return false;
                    })
                    break;
                case "edit":
                    showItem(item);
                    multForm.find('input[name=name]').attr('readonly', false);
                    btnSubmit.off().on('click', function (e) {
                        e.preventDefault();
                        mod_policy();
                        return false;
                    })
                    break;
                case "view":
                    showItem(item);
                    break;
                default:
            }
            setTimeout(function(){
                $('#multForm select').css({
                    cursor:'pointer'
                }).change();
            },1);
        },
        cbSubmit: function (use) {  //提交编辑成功之后的回调
            switch (use) {
                case 'add':
                    break;
                case 'edit':
                    break;
                default:
            }
            pagingTable.PagingTable('update');
        }
    })

    var panel = $('#panel').Panel({
        objTargetTable: pagingTable,
        objTargetForm: multForm,
        objTargetCaption: subCaption,
        updateStatusUrl: '/p/policy/chAppPolicySta'
    })
    var issuePane = $('#issuePane').IssuePane({
        objTargetTable: pagingTable,
        objTargetCaption: subCaption
    })
    var issueSubsPane = $('#issueSubsPane').IssuePane({
        objTargetTable: pagingTable,
        objTargetCaption: subCaption,
        hasIssueBtn: 0,
        hasUnissueBtn: 0,
        hasIssSubBtn: 1,
        hasPubSubBtn: 1,
        hasBackBtn: 1,
        hasSearchIpt: 0
    })















    var appPolicies = {};
    // 已经启用黑名单列表对象
    var frmAppPcy = $('#frmAppPcy'),
        policy_type = $('#policy_type'),
        wrapLimitAccess = $('#wrapLimitAccess'),
        wrapBlackList = $('#wrapBlackList'),
        wrapWhiteList = $('#wrapWhiteList'),
        addrpolicy = $('#addrpolicy'),
        timepolicy = $('#timepolicy'),
        itemSiteLimit = $('#itemSiteLimit'),
        itemTimeLimit = $('#itemTimeLimit'),
        selAppList = $('#selAppList');

    addrpolicy.on('change', function () {
        if ($(this).prop('checked')) {
            itemSiteLimit.show();
        } else {
            itemSiteLimit.hide();
            if (!timepolicy.prop('checked')) {
                timepolicy.prop('checked', true).change();
            }
        }
    })
    timepolicy.on('change', function () {
        if ($(this).prop('checked')) {
            itemTimeLimit.show();
        } else {
            itemTimeLimit.hide();
            if (!addrpolicy.prop('checked')) {
                addrpolicy.prop('checked', true).change();
            }
        }
    })

    policy_type.on('change', function () {
        wrapWhiteList.hide();
        wrapLimitAccess.hide();
        wrapBlackList.hide();
        switch ($(this).val()) {
            case "blackapp":// 黑名单策略
                wrapBlackList.show();
                break;
            case "whiteapp":// 白名单策略
                wrapWhiteList.show();
                break;
            case "limitaccess":  //限制访问策略
                wrapLimitAccess.show();
                if (!(addrpolicy.prop('checked') || timepolicy.prop('checked'))) {
                    addrpolicy.prop('checked', true).change();
                    timepolicy.prop('checked', true).change();
                }
                break;
            default:
        }
    })


    $.silentPost('/man/apppolicy/appList', { platform: 'android' }, function (data) {
        if (data.rt == '0000') {
            if (data.data.length === 0) {
                selAppList.html('<option value="null">暂无应用策略</option>').css({
                    pointerEvents: 'none',
                    cursor: 'auto'
                });
            } else {
                selAppList.html('');
                for (var i in data.data) {
                    var option = $('<option>');
                    option.text(data.data[i].app_name).attr({
                        'value': data.data[i].package_name,
                        'title': data.data[i].package_name
                    });
                    selAppList.append(option);
                }
            }
        }
    })
    $.silentPost('/man/apppolicy/onBlackList', {}, function (data) {  //初始化黑白名单select
        if (data.rt == '0000') {
            if (data.blacklist.length > 0) {
                showList(data.blacklist, wrapBlackList.find('select[name=black_id]'));
            } else {
                wrapBlackList.find('select[name=black_id]').html('<option class="anti-cursor">暂无黑名单应用</option>');
            }
            if (data.whitelist.length > 0) {
                showList(data.whitelist, wrapWhiteList.find('select[name=white_id]'));
            } else {
                wrapWhiteList.find('select[name=white_id]').html('<option class="anti-cursor">暂无白名单应用</option>');
            }
            function showList(list, eleSelect) {
                eleSelect.empty().data('list', list);
                for (var i = 0; i < list.length; i++) {
                    var option = $('<option>');
                    option.text(list[i].name).attr('value', list[i].id);
                    eleSelect.append(option);
                }
            }
        }
    })
    jeDatePcyInit();


    $("select[name=repeat_type]").on('change', function () {
        if ($(this).val() == 1) {
            $(".everyweek").css({ 'display': 'block' });
        } else {
            $(".everyweek").css({ 'display': 'none' });
        }
        if($(this).val()=='4'){
            $('#stop_date').removeClass('require danger')
            .parent().addClass('hidden')
            .prev().addClass('hidden');
            $('label[for=start_date]').prop('lastChild').nodeValue='特定日期';
    
        }else{
            $('#stop_date').addClass('require')
            .parent().removeClass('hidden')
            .prev().removeClass('hidden');
            $('label[for=start_date]').prop('lastChild').nodeValue='起止日期';
        }
        $('#start_date').change();
    });




    function getPostData() {
        if ($('label>b.danger:visible').length > 0) {
            warningOpen('数据缺失！', 'danger', 'fa-bolt');
            return false;
        }
        var pd = {
            url: '/p/policy/appPolicyMan',
            name: $('input[name=name]').val(),
            leave:$('input[name=leave]').prop('checked') ? 1 : 0,
            policy_type: policy_type.val()
        }, black_id, white_id;
        switch (policy_type.val()) {
            case 'blackapp':
                black_id = $('select[name=black_id]').val();
                if (black_id.length > 0) {
                    for (var i = 0; i < black_id.length; i++) {
                        black_id[i] = black_id[i] * 1;
                    }
                } else {
                    black_id = [];
                }
                pd['black_id'] = JSON.stringify(black_id);
                break;
            case 'whiteapp':
                white_id = $('select[name=white_id]').val();
                if (white_id.length > 0) {
                    for (var i = 0; i < white_id.length; i++) {
                        white_id[i] = white_id[i] * 1;
                    }
                } else {
                    white_id = [];
                }
                pd['white_id'] = JSON.stringify(white_id);
                break;
            case 'limitaccess':
                if (timepolicy.prop('checked') && addrpolicy.prop('checked')) {
                    pd['limit'] = 'both';
                } else if (addrpolicy.prop('checked')) {
                    pd['limit'] = 'geo';
                } else {
                    pd['limit'] = 'time';
                };
                if (timepolicy.prop('checked')) {
                    pd['time_limit'] = {
                        repeat_type: $('select[name=repeat_type]').val(),
                        start_date: $('input[name=start_date]').val(),
                        stop_date: $('input[name=stop_date]').val(),
                        start_time: $('input[name=start_time]').val(),
                        stop_time: $('input[name=stop_time]').val()
                    };
                    if (pd.time_limit.repeat_type == '1') {
                        pd.time_limit['weekday'] = $('select[name=weekday]').val()
                    }
                    pd.time_limit = JSON.stringify(pd.time_limit)
                }
                if (addrpolicy.prop('checked')) {
                    pd['site_range'] = JSON.stringify({
                        site: $('.lnglat').text(),
                        range: $('.radius').text()
                    });
                }
                pd['app_list'] = JSON.stringify($('select[name=app_list]').val());
                break;
            default:
        }
        return pd;
    }
    // 提交添加策略
    function add_policy() {
        var postData = getPostData();
        if (postData) {
            $.actPost('/common/org_add', postData, function (data) {
                if (data.rt == '0000') {
                    pagingTable.PagingTable('update');
                }
            });
        }
    }




    // 编辑
    function showItem(item) {
        policy_type.val(item.policy_type).change().prop('disabled', true);
        $('input[name=leave]').prop('checked',item.leave=='1');
        if (item.policy_type == 'limitaccess') {
            switch (item.limit) {
                case 'geo':
                    addrpolicy.prop("checked", true).change();
                    timepolicy.prop("checked", false).change();
                    break;
                case 'time':
                    timepolicy.prop("checked", true).change();
                    addrpolicy.prop("checked", false).change();
                    break;
                case 'both':
                    addrpolicy.prop("checked", true).change();
                    timepolicy.prop("checked", true).change();
                    break;
                default:
                    console.warn(item.limit);
            }
            if (item.site_range && item.site_range.site && item.site_range.range) {
                var aCenter = item.site_range.site.split(',');
                var iRadius = parseInt(item.site_range.range);
                camap.fnSetInit(aCenter, iRadius);
            }
            if (item.time_limit) {
                $('select[name=repeat_type]').val(item.time_limit.repeat_type).change();
                if (item.time_limit.repeat_type == 1) {
                    $('select[name=weekday]').val(item.time_limit.weekday);
                }
                $('input[name=stop_date]').val(item.time_limit.stop_date);
                $('input[name=start_date]').val(item.time_limit.start_date);
                $('input[name=stop_time]').val(item.time_limit.stop_time);
                $('input[name=start_time]').val(item.time_limit.start_time);
            }
        }
        var appList = [];
        if (item.app_list) {
            for (var i = 0; i < item.app_list.length; i++) {
                if (item.app_list[i]) {
                    appList.push(item.app_list[i].package_name);
                } else {
                    console.warn('异常数据：]', item)
                    console.warn('.app_list[' + i + ']=', item.app_list[i])
                }
            }
            if (appList.length > 0) {
                $('select[name=app_list]').val(appList);
            }
        }
    }

    // 编辑提交
    function mod_policy() {
        var postData = getPostData();
        if (postData) {
            postData['id'] = $('input[name=id]').val();
            postData['url'] = '/p/policy/appPolicyMan';
            $.actPost('/common/mod', postData, function (data) {
                if (data.rt == '0000') {
                    pagingTable.PagingTable('update');
                }
            }, '修改并下发');
        }
    }



    // 启用/禁用
    function activate(status) {
        var whitelist = [], blacklist = [], limitlist = [];
        var tr;
        var tab = $('.policytable table');
        tab.find('td span').each(function () {
            if ($(this).hasClass('txt')) {
                tr = $(this).parents("tr");
                if (tr.find('td').eq(8).text() === 'whiteapp') {
                    whitelist.push(tr.find('td').eq(7).text() * 1);
                } else if (tr.find('td').eq(8).text() === 'blackapp') {
                    blacklist.push(tr.find('td').eq(7).text() * 1);
                } else {
                    limitlist.push(tr.find('td').eq(7).text() * 1);
                }
            }
        });
        if (whitelist.length > 0 || blacklist.length > 0 || limitlist.length > 0) {
            var allPros = [], proPostUrl = '/man/apppolicy/changePolicyStatus';
            if (whitelist.length > 0) {
                allPros.push($.proPost(proPostUrl, {
                    status: status,
                    policy_type: 'whiteapp',
                    ids: JSON.stringify(whitelist)
                }));
            }
            if (blacklist.length > 0) {
                allPros.push($.proPost(proPostUrl, {
                    status: status,
                    policy_type: 'blackapp',
                    ids: JSON.stringify(blacklist)
                }));
            }
            if (limitlist.length > 0) {
                allPros.push($.proPost(proPostUrl, {
                    status: status,
                    policy_type: 'limitaccess',
                    ids: JSON.stringify(limitlist)
                }));
            }
        }
    };

    // 删除
    function policy_delete() {
        var whiteapp = [], blackapp = [], limitapp = [];
        var tr;
        var tab = $('.policytable table');
        tab.find('td span').each(function () {
            if ($(this).hasClass('txt')) {
                tr = $(this).parents("tr");
                if (tr.find('td').eq(8).text() === 'whiteapp') {
                    whiteapp.push(tr.find('td').eq(7).text() * 1);
                } else if (tr.find('td').eq(8).text() === 'blackapp') {
                    blackapp.push(tr.find('td').eq(7).text() * 1);
                } else {
                    limitapp.push(tr.find('td').eq(7).text() * 1);
                }

            }
        });
        if (whiteapp.length > 0) {
            var postData = {
                ids: JSON.stringify(whiteapp),
                policy_type: 'whiteapp'
            };
            $.actPost('/man/apppolicy/del_policy', postData, function (data) {
                if (data.rt == '0000') {
                    alertOff();
                    getPolicyList(currentpage, 10);
                }
            });
        }
        if (blackapp.length > 0) {
            var postData = {
                ids: JSON.stringify(blackapp),
                policy_type: 'blackapp'
            };
            $.actPost('/man/apppolicy/del_policy', postData, function (data) {
                if (data.rt == '0000') {
                    alertOff();
                    getPolicyList(currentpage, 10);
                }
            });
        }
        if (limitapp.length > 0) {
            var postData = {
                ids: JSON.stringify(limitapp),
                policy_type: 'limitaccess'
            };
            $.actPost('/man/apppolicy/del_policy', postData, function (data) {
                if (data.rt == '0000') {
                    alertOff();
                    getPolicyList(currentpage, 10);
                }
            });
        }
    }
