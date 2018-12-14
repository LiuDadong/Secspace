/**
 * 自制的用于项目迅速建立统一风格的组件
 */

//pagingTable 分页表格 paging:true分页（false不分页）
(function (root, factorys) {
    for (plug in factorys) {
        root[plug] = factorys[plug](root.jQuery, plug);
    }
})(window, {
    Panel: function ($, plug) { //
        var pnl;
        var __def__ = {
            relPagingTable: '#pagingTable',
            objTargetForm: {},
            relSubCaption: '#subCaption',
            relXTree: '#treeUserGroup',
            relXList: '#treeUserTag',
            defaultHtmlPullRight: '<div class="input-group">\
                                        <span class="input-icon">\
                                            <input id="iptKeyword" type="text" class="form-control input-sm" autocomplete="off" placeholder="请输入搜索关键字">\
                                            <i class="glyphicon glyphicon-search blue"></i>\
                                        </span>\
                                    </div>\
                                    <div class="input-group">\
                                        <span class="input-icon">\
                                            <select id="pageLength" class="form-control input-sm">\
                                                <option value="1">1</option>\
                                                <option value="5">5</option>\
                                                <option value="10" selected="selected">10</option>\
                                                <option value="15">15</option>\
                                                <option value="20">20</option>\
                                            </select>\
                                        </span>\
                                    </div>'
        };
        $.fn[plug] = function (opts) {
            //（通过添加类控制样式）
            pnl = $.extend(this, __def__, opts);//将后面三个对象的方法属性以及值合并后赋给this对象
            //准备html
            //设置表单面板样式
            pnl.addClass('form-inline').attr({
                'role': 'form',
                'onkeydown': 'if(event.keyCode==13){return false;}'
            });
            //设置左部按钮组样式
            $(pnl[0]).find(".pull-left:first").addClass('buttons-preview')
                .find('button').attr('type', 'button')
                .each(function () { //绑定事件
                    if ($(this).hasClass('btnAdd') || $(this).hasClass('btnUpload')) { //添加或上传
                        var actText = $(this).find('i').text();
                        $(this).on('click', function () {
                            var sCap = $(pnl.relSubCaption);
                            sCap.text(actText + sCap.data('itemText'));
                            $('.section:has(#pagingTable)').hide();
                            $('.section:has(#multForm)').show();
                            pnl.objTargetForm.usedAs('add');
                            if (pnl.cbAdd) {
                                pnl.cbAdd();
                            }
                        })
                    }
                    if ($(this).hasClass('btnAct') || $(this).hasClass('btnUnact')) {  //禁用/启用
                        var actText = $(this).find('i').text(),
                            status = ~~$(this).hasClass('btnAct');
                        $(this).on('click', function () {
                            if (pagingTable.data('PagingTable').sel.length > 0) {
                                var sel = pagingTable.data('PagingTable').sel,
                                    allPros = [],
                                    ids = [],
                                    geoIds = [],
                                    timeIds = [],
                                    whitelist = [],
                                    blacklist = [],
                                    limitlist = [];
                                for (var i = 0; i < sel.length; i++) {
                                    ids.push(sel[i].id);
                                    if (sel[i].policy_type && sel[i].policy_type == 'geofence') {
                                        geoIds.push(sel[i].id);
                                    }
                                    if (sel[i].policy_type && sel[i].policy_type == 'timefence') {
                                        timeIds.push(sel[i].id);
                                    }
                                    if (sel[i].policy_type && sel[i].policy_type == 'whiteapp') {
                                        whitelist.push(sel[i].id);
                                    }
                                    if (sel[i].policy_type && sel[i].policy_type == 'blackapp') {
                                        blacklist.push(sel[i].id);
                                    }
                                    if (sel[i].policy_type && sel[i].policy_type == 'limitaccess') {
                                        limitlist.push(sel[i].id);
                                    }
                                }

                                if (geoIds.length > 0) {
                                    allPros.push($.proPost('/items/updateStatus', $.extend(
                                        true,
                                        pnl.updateStatusJson,
                                        {
                                            status: status,
                                            ids: JSON.stringify(geoIds),
                                            policy_type: 'geofence'
                                        }
                                    )));
                                }
                                if (timeIds.length > 0) {
                                    allPros.push($.proPost('/items/updateStatus', $.extend(
                                        true,
                                        pnl.updateStatusJson,
                                        {
                                            status: status,
                                            ids: JSON.stringify(timeIds),
                                            policy_type: 'timefence'
                                        }
                                    )));
                                }
                                if (whitelist.length > 0) {
                                    allPros.push($.proPost('/items/updateStatus', $.extend(
                                        true,
                                        pnl.updateStatusJson,
                                        {
                                            status: status,
                                            policy_type: 'whiteapp',
                                            ids: JSON.stringify(whitelist)
                                        }
                                    )));
                                }
                                if (blacklist.length > 0) {
                                    allPros.push($.proPost('/items/updateStatus', $.extend(
                                        true,
                                        pnl.updateStatusJson,
                                        {
                                            status: status,
                                            policy_type: 'blackapp',
                                            ids: JSON.stringify(blacklist)
                                        }
                                    )));
                                }
                                if (limitlist.length > 0) {
                                    allPros.push($.proPost('/items/updateStatus', $.extend(
                                        true,
                                        pnl.updateStatusJson,
                                        {
                                            status: status,
                                            policy_type: 'limitaccess',
                                            ids: JSON.stringify(limitlist)
                                        }
                                    )));
                                }
                                if (allPros.length > 0) {
                                    $.proAll(true, allPros, function (datas, rts) {
                                        console.log(datas);
                                        if (rts.length === 1 && rts[0] == '0000') {
                                            pagingTable.PagingTable('update');
                                        } else {
                                            var arr = [];
                                            for (i in datas) {
                                                if (datas[i].rt === '3009' && (datas[i].policy_list || datas[i].data)) {
                                                    try {
                                                        if (datas[i].policy_list.length > 0) {
                                                            arr = arr.concat(datas[i].policy_list);
                                                        }
                                                        if (datas[i].data.length > 0) {
                                                            arr = arr.concat(datas[i].data);
                                                        }
                                                    } catch (err) {

                                                    }
                                                }
                                            }
                                            if (arr.length > 0) {
                                                $.dealRt3009(arr);
                                            }
                                        }
                                    }, actText);
                                    return;
                                }

                                $.actPost('/items/updateStatus', $.extend(
                                    true,
                                    pnl.updateStatusJson,
                                    {
                                        status: status,
                                        ids: JSON.stringify(ids)
                                    }
                                ), function (data) {
                                    switch (data.rt) {
                                        case '0000':
                                            pagingTable.PagingTable('update');
                                            break;
                                        case '3009':
                                            try {
                                                if (data.data.length > 0) {
                                                    $.dealRt3009(data.data);
                                                }
                                                if (data.policy_list.length > 0) {
                                                    $.dealRt3009(data.policy_list);
                                                }
                                                
                                            } catch (err) {

                                            }
                                            break;
                                        default:
                                    }
                                }, actText);
                            } else {
                                warningOpen('请选择要' + actText + '的' + $(pnl.relSubCaption).data('itemText') + '！', 'danger', 'fa-bolt');
                            }
                        })
                    }
                    if ($(this).hasClass('btnRefresh')) {  //刷新按
                        $(this).on('click', function () {
                            $(pnl.relPagingTable).PagingTable('refresh');
                        })
                    }
                    if ($(this).hasClass('btnDel')) { //删除
                        $(this).on('click', function () {
                            var sel = pagingTable.data('PagingTable').sel,
                                actText = $(this).find('i').text(),
                                ids = [],
                                needUnact = [],
                                geoIds = [],
                                timeIds = [],
                                whitelist = [],
                                blacklist = [],
                                limitlist = [];
                            if (pagingTable.data('PagingTable').sel.length > 0) {
                                for (var i = 0; i < sel.length; i++) {
                                    ids.push(sel[i].id);
                                    if (sel[i].status == 1) {
                                        needUnact.push(sel[i].name)
                                    }
                                    if (sel[i].policy_type && sel[i].policy_type == 'geofence') {
                                        geoIds.push(sel[i].id);
                                    }
                                    if (sel[i].policy_type && sel[i].policy_type == 'timefence') {
                                        timeIds.push(sel[i].id);
                                    }
                                    if (sel[i].policy_type && sel[i].policy_type == 'whiteapp') {
                                        whitelist.push(sel[i].id);
                                    }
                                    if (sel[i].policy_type && sel[i].policy_type == 'blackapp') {
                                        blacklist.push(sel[i].id);
                                    }
                                    if (sel[i].policy_type && sel[i].policy_type == 'limitaccess') {
                                        limitlist.push(sel[i].id);
                                    }
                                }
                                if (needUnact.length == 0) {
                                    bootbox.dialog({
                                        title: '<i class="glyphicon glyphicon-fire danger"></i>',
                                        message: '<p class="text-align-center">确认删除选中的' + $(pnl.relSubCaption).data('itemText') + '吗？</p>',
                                        className: "modal-darkorange",
                                        buttons: {
                                            success: {
                                                label: "取消",
                                                className: "btn-blue",
                                                callback: function () {
                                                    //
                                                }
                                            },
                                            "确认删除": {
                                                className: "btn-danger",
                                                callback: function () {
                                                    //Promise处理围栏策略：【地理围栏、时间围栏】多请求操作
                                                    var allPros = [];
                                                    if (geoIds.length > 0) {
                                                        allPros.push($.proPost('/items/delete', $.extend(
                                                            true,
                                                            pnl.deleteJson,
                                                            {
                                                                status: status,
                                                                ids: JSON.stringify(geoIds),
                                                                policy_type: 'geofence'
                                                            }
                                                        )));
                                                    }
                                                    if (timeIds.length > 0) {
                                                        allPros.push($.proPost('/items/delete', $.extend(
                                                            true,
                                                            pnl.deleteJson,
                                                            {
                                                                status: status,
                                                                ids: JSON.stringify(timeIds),
                                                                policy_type: 'timefence'
                                                            }
                                                        )));
                                                    }
                                                    if (whitelist.length > 0) {
                                                        allPros.push($.proPost('/items/delete', $.extend(
                                                            true,
                                                            pnl.deleteJson,
                                                            {
                                                                status: status,
                                                                policy_type: 'whiteapp',
                                                                ids: JSON.stringify(whitelist)
                                                            }
                                                        )));
                                                    }
                                                    if (blacklist.length > 0) {
                                                        allPros.push($.proPost('/items/delete', $.extend(
                                                            true,
                                                            pnl.deleteJson,
                                                            {
                                                                status: status,
                                                                policy_type: 'blackapp',
                                                                ids: JSON.stringify(blacklist)
                                                            }
                                                        )));
                                                    }
                                                    if (limitlist.length > 0) {
                                                        allPros.push($.proPost('/items/delete', $.extend(
                                                            true,
                                                            pnl.deleteJson,
                                                            {
                                                                status: status,
                                                                policy_type: 'limitaccess',
                                                                ids: JSON.stringify(limitlist)
                                                            }
                                                        )));
                                                    }
                                                    if (allPros.length > 0) {
                                                        $.proAll(true, allPros, function (datas, rts) {
                                                            if (rts.length === 1 && rts[0] == '0000') {
                                                                switch (rts[0]) {
                                                                    case '0000':
                                                                        pagingTable.PagingTable('update');
                                                                        break;
                                                                    default:
                                                                }
                                                            }
                                                        }, actText);
                                                        return;
                                                    }

                                                    var modJson = {};
                                                    if (pnl.deleteJson.hasOwnProperty('id')) {
                                                        modJson['id'] = JSON.stringify(ids)
                                                    } else {
                                                        modJson['ids'] = JSON.stringify(ids)
                                                    }
                                                    $.actPost('/items/delete', $.extend(
                                                        true,
                                                        pnl.deleteJson,
                                                        modJson
                                                    ), function (data) {
                                                        switch (data.rt) {
                                                            case '0000':
                                                                pagingTable.PagingTable('update');
                                                                break;
                                                            default:
                                                        }
                                                    }, '删除')
                                                }
                                            }
                                        }
                                    });
                                } else {
                                    warningOpen('请先禁用要删除的' + $(pnl.relSubCaption).data('itemText') + '！', 'danger', 'fa-bolt');
                                }

                            } else {
                                warningOpen('请选择要' + actText + '的' + $(pnl.relSubCaption).data('itemText') + '！', 'danger', 'fa-bolt');
                            }
                        })
                    }
                    if ($(this).hasClass('btnToIssue')) { //去下发
                        var actText = $(this).find('i').text();
                        $(this).on('click', function () {
                            var sel = $(pnl.relPagingTable).data('PagingTable').sel;
                            if (sel.length == 0) {
                                warningOpen('请选择要' + actText + '的' + $(pnl.relSubCaption).data('itemText'), 'danger', 'fa-bolt');
                                return false;
                            } else if (sel[0].policy_type) {   //每次只让下发一个策略
                                if (sel.length > 1) {
                                    warningOpen('一次只能下发一个策略！', 'danger', 'fa-bolt');
                                    return false;
                                } else {
                                    if (sel[0].status === 0) {
                                        warningOpen('请先启用该策略！', 'danger', 'fa-bolt');
                                        return false;
                                    }
                                    $('#tabForIssue').data('policy', {
                                        policy_id: sel[0].id,
                                        policy_type: sel[0].policy_type
                                    });
                                }
                            } else if (sel[0].filename) {   //文件下发
                                var arr = [];
                                for (var i = 0; i < sel.length; i++) {
                                    arr.push(~~sel[i].id)
                                }
                                $('#tabForIssue').data('file', {
                                    ids: JSON.stringify(arr)
                                });

                            } else if (sel[0].app_name) {   //应用授权
                                var arr = [];
                                for (var i = 0; i < sel.length; i++) {
                                    if (~~sel[i].visit_type == 0) {
                                        arr.push(sel[i].identify)
                                    } else {
                                        warningOpen('只能对授权应用授权！', 'danger', 'fa-bolt');
                                        return false;
                                    }
                                }
                                $('#tabForIssue').data('app', {
                                    identify: arr
                                });
                            } else {
                                $('#tabForIssue').data('sel', sel);
                            }
                            var sCap = $(pnl.relSubCaption);
                            sCap.text(actText + sCap.data('itemText'));
                            $('.section:has(#pagingTable)').hide();
                            $('.section:has(#tabForIssue)').show();
                            $(pnl.relXTree).XTree();
                            $(pnl.relXList).XList();
                        })
                    }
                    if ($(this).hasClass('btnDefPcy')) { //产看编辑默认策略
                        $(this).on('click', function () {
                            var btn = $(this).prop('disabled', true);
                            $.silentGet('/policy/default', {
                                policy_type: pnl.policy_type
                            }, function (data) {
                                btn.prop('disabled', false);
                                switch (data.rt) {
                                    case '0000':
                                        pnl.closest('.section').hide();
                                        pnl.objTargetForm.closest('.section').show();
                                        pnl.objTargetForm.data('item', data.policies).usedAs('edit');
                                        pnl.objTargetForm.find('input[name=name]').attr('readonly', true);
                                        $(pnl.relSubCaption).html(btn.text());
                                        break;
                                    default:
                                }
                            })
                        })
                    }
                });
            //绑定常用事件
            //设置右部输入、选择框样式
            $(pnl[0]).find(".pull-right").html(pnl.defaultHtmlPullRight);
            $(pnl[0]).find('#pageLength').on('change', function () {
                /**
                 * pagingTable组件会优先获取目标表格存储的data('pageLength')作为单页长度，
                 * 如果没有则才用内置的默认长度
                 */
                $(pnl.relPagingTable).data('PagingTable').pageLength = $(this).val() * 1;
                $(pnl.relPagingTable).PagingTable('page', 1);
            })
            $(pnl[0]).find('#iptKeyword').on('input change propertychange', function () {
                /**
                 * pagingTable组件会优先获取目标表格存储的data('keyword')作为搜索关键字，

                 */
                $('#pagingTable').data('PagingTable').keyword = encodeURIComponent($(this).val());
                if ($(this).data('timer')) {
                    clearTimeout($(this).data('timer'))
                }
                $(this).data('timer', setTimeout(function () {
                    $(pnl.relPagingTable).PagingTable('page', 1);
                }, 1000))
            })
            //绑定默认事件
            return pnl;
        };
        return function (opts) {
            var dom = opts.dom;
            $(dom)[plug].call($(dom), opts); //执行插件功能函数，将this指向$(dom)这个代理对象，并传入参数。
        }
    },
    IssuePane: function ($, plug) { //
        var __def__ = {
            issueText: '下发',
            hasUnissueBtn: 0,
            hasBackBtn: 1,
            hasSearchIpt: 0,
            objTargetTab: '#tabForIssue',
            relSubCaption: '#subCaption',
            relPagingTable: '#pagingTable',
            defaultHtmlPullRight: '<div class="input-group">\
                                        <span class="input-icon">\
                                            <input type="text" class="keyword form-control input-sm" autocomplete="off" placeholder="请输入搜索关键字">\
                                            <i class="glyphicon glyphicon-search blue"></i>\
                                        </span>\
                                    </div>'
        };
        $.fn[plug] = function (opts) {
            //（通过添加类控制样式）
            opts = $.extend(true, {}, __def__, opts);//将后面三个对象的方法属性以及值合并后赋给this对象
            //准备html
            var innerHtml = '<form class="form-inline" role="form" onkeydown="if(event.keyCode==13){return false;}">'
                + '<div class="buttons-preview pull-left">'
                + '<button class="btnIssue btn btn-primary"><i class="fa fa-magic">' + opts.issueText + '</i></button>'
                + (opts.hasUnissueBtn ? '<button class="btnUnissue btn btn-primary"><i class="fa fa-check-circle">取消' + opts.issueText + '</i></button>' : '')
                + (opts.hasBackBtn ? '<button class="btnBack btn btn-default"><i class="fa fa-check-circle">返回</i></button>' : '')
                + '</div>'
                + '<div class="pull-right">'
                + (opts.hasSearchIpt ?
                    '<div class="input-group">'
                    + '<span class="input-icon">'
                    + '<input type="text" class="keyword form-control input-sm" autocomplete="off" placeholder="请输入搜索关键字">'
                    + '<i class="glyphicon glyphicon-search blue"></i>'
                    + '</span>'
                    + '</div>' : '')
                + '</div>'
                + '</form>'
            this.empty().html(innerHtml);

            //设置表单面板样式

            this.find('form').addClass('form-inline').attr({
                'role': 'form',
                'onkeydown': 'if(event.keyCode==13){return false;}'
            }).find('button').attr('type', 'button').each(function () { //绑定事件
                if ($(this).hasClass('btnBack')) { //返回
                    $(this).on('click', function () {
                        var sCap = $(opts.relSubCaption);
                        sCap.text(sCap.data('itemText') + '列表');
                        $(this).closest('.section').hide();
                        $(opts.relPagingTable).PagingTable('update');
                        $(opts.relPagingTable).closest('.section').show();
                    })
                }
                if ($(this).hasClass('btnIssue') || $(this).hasClass('btnUnissue')) {  //下发（授权）或者取消 
                    $(this).on('click', function () {
                        var actText = $(this).find('i').text(),
                            state = ~~$(this).hasClass('btnIssue'),
                            tab = $(opts.objTargetTab),
                            pd = {};
                        if (tab.data('policy')) {
                            pd = {
                                authfilter: '',
                                authtype: 'policy',
                                policy_id: tab.data('policy').policy_id,
                                policy_type: tab.data('policy').policy_type,
                                authrules: ''
                            }
                        } else if (tab.data('file')) {
                            pd = {
                                authfilter: '',
                                authtype: 'file',
                                state: state,
                                ids: tab.data('file').ids,
                                authrules: ''
                            }
                        } else if (tab.data('app')) {
                            pd = {
                                authfilter: '',
                                authtype: 'app',
                                state: state,
                                identify: tab.data('app').identify,
                                authrules: ''
                            }
                        } else {
                            return;
                        }
                        var rules = $('#tabForIssue .tabBody>.tab-pane.active .relFilter').data('rules');
                        if (rules && rules.reverse == 1) {
                            pd.authfilter = 'xtree';
                            pd.authrules = JSON.stringify(rules);
                            console.info('xtree-rules', rules);
                        } else if (rules && rules.length > 0 && typeof rules[0] == 'object') {
                            for (i in rules) {
                                if (rules[i].check) {
                                    rules[i].sel = [];
                                    if (rules[i].unsel.length > 0) {
                                        for (k in rules[i].unsel) {
                                            rules[i].unsel[k] = rules[i].unsel[k].id;
                                        }
                                    }
                                } else {
                                    rules[i].unsel = [];
                                    if (rules[i].sel.length > 0) {
                                        for (j in rules[i].sel) {
                                            rules[i].sel[j] = rules[i].sel[j].id;
                                        }
                                    }
                                }
                            }
                            console.info('xlist-rules', rules);
                            pd.authfilter = 'xlist';
                            pd.authrules = JSON.stringify(rules);
                        } else {
                            warningOpen('请选择要' + actText + '的用户！', 'danger', 'fa-bolt');
                            return;
                        }
                        $.actPost('/issueByRules', pd, function (data) {
                            switch (data.rt) {
                                case '0000':
                                    tab.find('li.active>span').click();
                                    break;
                                default:
                            }
                        }, actText);
                    })
                }
            });

        };
    },
    PagingTable: function ($, plug) { //分页表格组件
        function arrangeItem(opts, trItem) {  //用于根据成员选定状态更新mark记录
            var item = trItem.data('item'),
                inSel = hasItem(item, opts.sel),
                inUnsel = hasItem(item, opts.unsel),
                bool = trItem.find('td:first-child input:checkbox').prop('checked');
            if (opts.selectAll) {
                if (opts.check) {
                    if (!bool) {
                        if (inUnsel == -1) {
                            opts.unsel.push(item);
                        } else {
                            opts.unsel[inUnsel] = item;
                        }
                    } else {
                        if (inUnsel > -1) {
                            opts.unsel.splice(inUnsel, 1);
                        }
                    }
                } else {
                    if (bool) {
                        if (inSel == -1) {
                            opts.sel.push(item);
                        } else {
                            opts.sel[inSel] = item;
                        }
                    } else {
                        if (inSel > -1) {
                            opts.sel.splice(inSel, 1);
                        }
                    }
                }
            } else {
                if (bool) {
                    if (inSel == -1) {
                        opts.sel.push(item);
                    } else {
                        opts.sel[inSel] = item;
                    }
                    if (inUnsel > -1) {
                        opts.unsel.splice(inUnsel, 1);
                    }
                } else {
                    if (inUnsel == -1) {
                        opts.unsel.push(item);
                    } else {
                        opts.unsel[inUnsel] = item;
                    }
                    if (inSel > -1) {
                        opts.sel.splice(inSel, 1);
                    }
                }
            }
        };

        function hasItem(item, items) {
            var index = -1;
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == item.id) {
                    index = i;
                    break;
                }
            }
            return index;
        };

        function updateRelTree(opts) {
            if (opts.relFilter) {
                var actLi = $(opts.relFilter).find('li.active'),
                    actLiCkb = actLi.find('input:checkbox'),
                    nextUl = actLi.next('ul');
                $.extend(
                    true,
                    actLi.data(),
                    {
                        check: opts.check,
                        sel: opts.sel,
                        unsel: opts.unsel
                    }
                )
                actLi.trigger('dataChange');
            }
        };

        function ctrlThCkb(opts, thHeader, tbHas) {
            var ckbHeader = thHeader.find('tr>th:first-child input:checkbox'),
                ckbsHas = tbHas.find('tr>td:first-child input:checkbox');
            if (opts.selectAll) {
                ckbHeader.prop('checked', opts.check && opts.unsel.length == 0);
            } else {
                ckbHeader.prop('checked', ckbsHas.filter(function () {
                    return !$(this).prop('checked');
                }).length == 0);
            }
        }
        // 创建footer
        function createFooter(tbl, page, length, total) {
            var j = 0;
            if (tbl.next('.pagingTableFooter').length == 0) {
                tbl.after($('<div class="pagingTableFooter"></div>'))
            }
            if (total >= 0) {
                var doc = tbl.next('.pagingTableFooter'),
                    pages = Math.ceil(total / length);
                page = total > 0 ? page : 0;
                var str = '<div class="DTTTFooter"><div class="col-md-2"><div class="footertotal" style="white-space:nowrap;">共' + total + '条第' + page + '页</div></div>' +
                    '<div class="col-md-10">' +
                    '<div class="dataTables_paginate paging_bootstrap">' +
                    '<ul class="pagination">';
                if (page == 1) {
                    str += '<li class="prev disabled"><a>上一页</a></li>'
                } else {
                    str += '<li class="prev"><a href="javascript:void(0);" to-page="' + (page - 1) + '">上一页</a></li>'
                }
                if (pages < 6) {
                    for (var i = 0; i < pages; i++) {
                        if (page == (i + 1)) {
                            str += '<li class="active"><a>' + (i + 1) + '</a></li>';
                            j = i + 1;
                        } else {
                            str += '<li><a href="javascript:void(0);" to-page="' + (i + 1) + '">' + (i + 1) + '</a></li>';
                        }
                    }
                } else {
                    if (page < 3) {
                        for (var i = 0; i < 5; i++) {
                            if (page == i + 1) {
                                str += '<li class="active"><a>' + (i + 1) + '</a></li>';
                                j = i + 1;
                            } else {
                                str += '<li><a href="javascript:void(0);" to-page="' + (i + 1) + '">' + (i + 1) + '</a></li>';
                            }
                        }
                    } else if (pages - page < 3) {
                        for (var i = pages - 5; i < pages; i++) {
                            if (page == i + 1) {
                                str += '<li class="active"><a>' + (i + 1) + '</a></li>';
                                j = i + 1;
                            } else {
                                str += '<li><a href="javascript:void(0);" to-page="' + (i + 1) + '">' + (i + 1) + '</a></li>';
                            }
                        }
                    } else {
                        for (var i = page - 3; i < page + 2; i++) {
                            if (page == i + 1) {
                                str += '<li class="active"><a>' + (i + 1) + '</a></li>';
                                j = i + 1;
                            } else {
                                str += '<li><a href="javascript:void(0);" to-page="' + (i + 1) + '">' + (i + 1) + '</a></li>';
                            }
                        }
                    }
                }
                if (j < pages) {
                    str += '<li class="next"><a href="javascript:void(0);" to-page="' + (j + 1) + '">下一页</a></li>'
                } else {
                    str += '<li class="next disabled"><a>下一页</a></li>'
                }
                str += '</ul>' +
                    '</div>' +
                    '</div></div>';
                doc.html(str);
                doc.find('ul.pagination>li>a[to-page]').on('click', function (e) {
                    tbl.PagingTable('page', $(e.target).attr('to-page') * 1)
                })
            }
            return this;
        };

        var __prop__ = {  //插件默认方法
            init: function (opts) {
                //合并默认配置参数和用户输入参数，形成最终使用配置参数
                var tbl = this;
                opts = $.extend(
                    true,
                    {},
                    $.fn[plug].__def__,
                    opts
                )
                //判断该元素是否已经被初始化
                if (
                    this.filter(function () {
                        return $(this).data(plug);
                    }).length !== 0
                ) {
                    console.warn('该元素已经被' + plug + '组件初始化：', this[0])
                }
                //绑定最终使用的配置参数至元素data(plug)插件私有命名空间
                this.data(plug, opts);

                //设置插件核心代码
                this.addClass('pagingTable table table-striped table-bordered table-hover');
                //准备html
                this.empty();
                this.append(
                    $('<thead class="thHeader">' + opts.theadHtml + '</thead>'),
                    $('<tbody class="tbDemo">' + opts.tbodyDemoHtml + '</tbody>'),
                    $('<tbody class="tbLoading">' + opts.tbodyLoadingHtml + '</tbody>'),
                    $('<tbody class="tbEmpty">' + opts.tbodyEmptyHtml + '</tbody>'),
                    $('<tbody class="tbHas"></tbody>')
                );

                var thHeader = this.find('.thHeader'),
                    trHeader = thHeader.find('tr'),
                    tbDemo = this.find('.tbDemo').hide(),
                    trDemo = tbDemo.find('tr'),
                    tbLoading = this.find('.tbLoading'),
                    tbEmpty = this.find('.tbEmpty').hide(),
                    tbHas = this.find('.tbHas').hide();
                //表头用于全选的复选框
                if (!trHeader.find('th:first-child').html()) {
                    var spantxt = opts.selectAll ? '全选' : '';
                    trHeader.find('th:first-child').css({
                        width: '70px'
                    }).empty().append(
                        $('<div class="checkbox"><label>'
                            + '<input type="checkbox"/>'
                            + '<span class="text">' + spantxt + '</span>'
                            + '</label></div>')
                    );
                }
                //样本中用于选择的复选框
                if (!trDemo.find('td:first-child').html()) {
                    trDemo.find('td:first-child').html(
                        '<div class="checkbox"><label>'
                        + '<input type="checkbox"/>'
                        + '<span class="text"></span>'
                        + '</label></div>'
                    );
                }
                //最后一列按钮样式
                if (trDemo.find('td:last-child a').attr('class')) {
                    trDemo.find('td:last-child a')
                        .addClass('btn btn-xs')
                        .attr('href', 'javascript:void(0);');
                } else {
                    trDemo.find('td:last-child a')
                        .addClass('btn btn-primary btn-xs')
                        .attr('href', 'javascript:void(0);');
                }

                //绑定选择事件
                var ckbHeader = trHeader.find('input:checkbox'),
                    ckbDemo = trDemo.find('input:checkbox');
                //全选
                ckbHeader.prop('checked', opts.check)
                    .on('click', function (e) {
                        //全选或全不选
                        ckbDemo.prop('checked', $(this).prop('checked'));
                        var ckbsHas = tbHas.find('tr td:first-child input:checkbox').prop('checked', $(this).prop('checked'));
                        if (opts.selectAll) {   //全选范围为分页表所有成员，包括还没有加载过来的
                            opts.check = $(this).prop('checked');
                            opts.sel = [];
                            opts.unsel = [];
                            updateRelTree(opts);
                        } else { //全选范围为分页表格当前页
                            ckbsHas.each(function () {
                                arrangeItem(opts, $(this).closest('tr'));
                            })
                        }
                        console.info('PagingTable.sel:', opts.sel);
                        console.info('PagingTable.unsel:', opts.unsel);
                    })
                //选择成员
                ckbDemo.on('click', function () {
                    arrangeItem(opts, $(this).closest('tr'));

                    ctrlThCkb(opts, thHeader, tbHas);

                    if (opts.selectAll) {
                        if (opts.sel.length == opts.totalCount && opts.totalCount > 0) {
                            opts.check = true;
                            ckbHeader.prop('checked', true);
                            opts.sel = [];
                        }
                        if (opts.unsel.length == opts.totalCount) {
                            opts.check = false;
                            ckbHeader.prop('checked', false);
                            opts.unsel = [];
                        }
                    }
                    console.info('PagingTable.sel:', opts.sel);
                    console.info('PagingTable.unsel:', opts.unsel);
                    updateRelTree(opts);
                })
                var thLen = trHeader.find('th').length,
                    tdLen = trDemo.find('td').length;
                if (thLen == tdLen) {
                    this.find('.tbEmpty tr>td:only-child,.tbLoading tr>td:only-child').attr('colspan', thLen).css('text-align', 'center');
                } else {
                    console.error('pagingTable表头列数与样本列数不等');
                    console.error('thead.length=' + thLen + ',tbody.length=' + tdLen)
                }


                //给trDemo中指定元素添加事件
                if (opts.trDemoBinders) {
                    for (var j = 0; j < opts.trDemoBinders.length; j++) {
                        trDemo.find(opts.trDemoBinders[j].dom).on(opts.trDemoBinders[j].event, opts.trDemoBinders[j].fn);
                    }
                }

                this[plug]('update');
                return this;
            },
            page: function (i) {
                var opts = this.data(plug);
                if (this.parents(".modal").length == 0) {
                    $('.section').hide();
                    this.parents('.section').show();
                }
                opts.start = i;
                this[plug]('update');
                return this;
            },
            update: function () {
                var opts = $(this).data(plug);
                if (this.parents(".modal").length == 0) {
                    $('.section').hide();
                    this.parents('.section').show();
                }
                var thHeader = this.find('thead.thHeader'),
                    tbHas = this.find('tbody.tbHas'),
                    tbEmpty = this.find('tbody.tbEmpty').hide(),
                    tbLoading = this.find('tbody.tbLoading'),
                    tbDemo = this.find('tbody.tbDemo').hide(),
                    trDemo = tbDemo.find('tr');

                if (opts.paging) {
                    opts.jsonData['start'] = opts.start;
                    opts.jsonData['length'] = opts.pageLength;
                    opts.jsonData['keyword'] = opts.keyword;
                }

                var tbl = this,
                    trs = tbHas.find('tr');
                if (trs.length == 0) {
                    tbHas.hide()
                    tbLoading.show();
                } else {
                    tbLoading.hide();
                    tbHas.show()
                }
                tbl.closest('.section').addClass('loading-mask');
                $.silentGet('/list', opts.jsonData, function (data) {
                    tbl.closest('.section').removeClass('loading-mask');
                    tbLoading.hide();
                    if (data.rt == '0000') {
                        opts.totalCount = data.total_count;
                        opts['data'] = data;
                        opts['list'] = opts.fnGetItems(data);
                        showTableList(opts.list)
                        if (opts.paging) {
                            createFooter(tbl, opts.start, opts.pageLength, opts.totalCount);
                        }

                    }
                })
                function showTableList(list) {
                    if (list.length > 0) {
                        tbHas.show();
                        if (trs.length > list.length) {
                            trs.eq(list.length - 1).nextAll().remove();
                        }

                        for (var i = 0; i < list.length; i++) {
                            var tri, triCheckBox;
                            if (trs.eq(i)[0]) {
                                tri = trs.eq(i);
                            } else {
                                tri = trDemo.clone(true);
                                tbHas.append(tri);
                            }
                            var triCheckBox = tri.find('td:first input:checkbox').prop('checked', opts.check);
                            //根据用户选择记录渲染当前分页的勾选状态
                            if (hasItem(list[i], opts.unsel) !== -1) {
                                triCheckBox.prop('checked', false);
                            }
                            if (hasItem(list[i], opts.sel) !== -1) {
                                triCheckBox.prop('checked', true);
                            }
                            tri.data('item', list[i]);
                            tri.find('[item-key]').each(function () {
                                var k = $(this).attr('item-key');
                                $(this).text(opts.fnValByKey(k, list[i][k]));
                            });
                        }

                        tbHas.find('tr').each(function () {
                            arrangeItem(opts, $(this));
                        })
                        ctrlThCkb(opts, thHeader, tbHas);
                    } else {
                        tbHas.empty();
                        tbEmpty.show();
                    }
                }
            },
            refresh: function () {
                var opts = this.data(plug);
                if (this.parents(".modal").length == 0) {
                    $('.section').hide();
                    this.parents('.section').show();
                }
                this.data({
                    check: opts.check,
                    sel: [],
                    unsel: []
                })
                opts.check = opts.initThChecked;
                opts.unsel = [];
                opts.sel = [];
                this[plug]('page', 1)
            }
        };
        $.fn[plug] = function (fn) {
            if (__prop__[fn]) {
                return __prop__[fn].apply(
                    this,
                    Array.prototype.slice.call(arguments, 1)
                );
            } else if ($.type(fn) === 'object') {
                return __prop__.init.apply(this, arguments);
            } else {
                console.warn('pagingTable组件没有方法' + fn);
            }
        };
        $.fn[plug]['__def__'] = {     //插件默认属性
            type: 'GET',
            hasMask: false,
            start: 1,
            pageLength: 10,
            paging: true,
            iptKeyword: '#iptKeyword',
            jsonData: {},
            check: 0,
            initThChecked: 0,
            selectAll: 0,
            sel: [],
            unsel: [],
            totalCount: 0,
            relMultForm: '',  //"#multForm" 可选   关联多用途表单组件MultForm，新建、编辑、查看成员
            relFilter: '', //"#treeUserGroup" 可选   关联复杂树形组件XTree
            relSubCaption: "#subCaption",
            //必需  表头
            theadHtml: '<tr>\
                    <th><div class="checkbox"><label><input type="checkbox"/><span class="text">全选</span></label></div></th>\
                    <th>插件默认名称</th>\
                    <th>操作</th>\
                </tr>',
            //可选   没有成员时的显示文本
            tbodyEmptyHtml: '<tr><td>暂无数据</td><tr>',
            //可选   加载成员时的显示文本
            tbodyLoadingHtml: '<tr><td>数据加载中...</td><tr>',
            //必需  成员显示样本
            tbodyDemoHtml: '<tr>\
                    <td><div class="checkbox"><label><input type="checkbox"/><span class="text"></span></label></div></td>\
                    <td><span item-key="name"></span></td>\
                    <td><a class="mod btn btn-primary btn-xs" href="#">编辑</a><a class="view btn btn-primary btn-xs" href="#">查看</a></td>\
                </tr>',
            //可选   样本默认绑定的事件处理器
            trDemoBinders: [{
                dom: 'a[toForm]',
                event: 'click',
                fn: function () {
                    var opts = $(this).closest('table').data(plug),
                        item = $(this).closest('tr').data('item'),
                        tfrm = $(opts.relMultForm || '#multForm').data('item', item),
                        tCap = $(opts.relSubCaption);
                    $(this).closest('.section').hide();
                    tfrm.closest('.section').show();
                    switch ($(this).attr('toForm')) {
                        case 'edit':
                            tCap.html('编辑' + tCap.data('itemText'));
                            opts.cbEdit(item);
                            break;
                        case 'view':
                            tCap.html('查看' + tCap.data('itemText'));
                            opts.cbView(item);
                            break;
                        default:
                    }
                }
            }, {
                dom: '.numInfo',
                event: 'click',
                fn: function () {
                    var item = $(this).closest('tr').data('item'),
                        pjaxAim = $('#pjax-aim'),
                        elesTop = ['序号', '姓名', '账号', '状态', '操作'],
                        elesDemo = [
                            '<span class="counter"></span>',
                            '<span item-key="name"></span>',
                            '<span item-key="account"></span>',
                            '<span item-key="status"></span>',
                            '<span class="btnUnbind">移出策略</span>'
                        ],
                        widthProportion = [0.5, 1, 1, 1, 1],
                        itemKey, title, numInfoData;

                    if (item.policy_type) {
                        title = '策略"' + item.name + '"下发及应用详情';
                        numInfoData = $.extend(true, {
                            id: item.id,
                            policy_type: item.policy_type
                        }, $(this).data());
                    } else if (item.filename) {
                        itemKey = $(this).find('[item-key]').attr('item-key');
                        switch (itemKey) {
                            case 'view':
                                itemKey = '已查看';
                                elesDemo[3] = '<span>已查看</span>';
                                break;
                            case 'download':
                                itemKey = '已下载';
                                elesDemo[3] = '<span>已下载</span>';
                                break;
                            case 'authorized':
                                itemKey = '已下发';
                                elesDemo[3] = '<span>已下发</span>';
                                break;
                            default:
                        }
                        title = itemKey + '文件"' + item.filename + '"的用户';
                        numInfoData = $.extend(true, {
                            id: item.id
                        }, $(this).data());
                        widthProportion.pop();
                        elesTop.pop();
                        elesDemo.pop();

                    } else if (item.app_name) {
                        itemKey = $(this).find('[item-key]').attr('item-key');
                        switch (itemKey) {
                            case 'issue':
                                itemKey = '已授权';
                                elesDemo[3] = '<span>已授权</span>';
                                break;
                            case 'install_num':
                                itemKey = '已安装';
                                elesDemo[3] = '<span>已安装</span>';
                                break;
                            default:
                        }
                        title = itemKey + '应用"' + item.filename + '"的用户';
                        numInfoData = $.extend(true, {
                            identify: item.identify
                        }, $(this).data());
                        widthProportion.pop();
                        elesTop.pop();
                        elesDemo.pop();
                    } else { };
                    pjaxAim.addClass('loading-mask');
                    var cont = $('<div>').ScrollList({
                        numInfoData: numInfoData,
                        elesTop: elesTop,
                        elesDemo: elesDemo,
                        widthProportion: widthProportion,
                        completed: function (data) {
                            switch (data.rt) {
                                case '0000':
                                    $.dialog('list', {
                                        title: title,
                                        content: cont
                                    });
                                    break;
                                default:
                            }
                            pjaxAim.removeClass('loading-mask');
                        }
                    });
                }
            }],
            // 成员关键字与值显示修正
            fnValByKey: function (k, v) {
                switch (k) {
                    case 'xxx':
                        v = v == 1 ? '启用' : '禁用';
                        break;

                    default:
                }
                return v;
            },

            //编辑按钮回调
            cbEdit: function (item) {   //点击修改、编辑按钮，初步渲染并跳转至表单后的回调函数，用于数据显示、表单控制修正
                console.info('默认fnModCb请忽略', item)
            },

            //产看按钮回调
            cbView: function (item) {  //点击产看、详情按钮，初步渲染并跳转至表单后的回调函数，用于数据显示、表单控制修正
                console.info('默认fnViewCb请忽略', item)
            }
        };
    },
    MultForm: function ($, plug) {// 多用途表单 add/edit/view
        var frm;
        var __def__ = {     //插件默认属性
            addAct: '/item/add', //添加表单action
            addBtnTxt: '添加',  //添加表单提交按钮显示文本
            addInfoTxt: '添加',  //添加提交成功或失败反馈的信息中的.act
            editAct: '/item/edit', //编辑表单action
            editBtnTxt: '保存修改',//编辑表单提交按钮显示文本
            editInfoTxt: '修改',//编辑提交成功或失败反馈的信息中的.act
            type: 'POST', //表单提交方式
            targetTable: '#pagingTable',  //关联的分页表格选择器
            relSubCaption: "#subCaption", //关联的显示标题选择器
            fnValByKey: function (k, v) { //表单数据显示预处理
                switch (k) {
                    case 'xxx':
                        v = v == 1 ? '启用' : '禁用';
                        break;
                    default:
                        v = v;
                }
                return v;
            },
            afterReset: function () {
                //表单重置之后的回调,用于数据准备
            }
        };
        var __prop__ = {  //插件默认方法
            usedAs: function (use) {
                frm.beforeUsed(use, frm.data('item'));
                var btnSubmit = $(frm[0]).find(':input[type=submit]'),
                    frmGrp = $(frm[0]).find('.form-group');
                frm.reset();
                frm.afterReset();
                frm.check();
                switch (use) {
                    case 'add':
                        $(frm[0]).attr('action', frm.addAct);
                        $(frm[0]).data('url', frm.addUrl);
                        $(frm[0]).data('infoTxt', frm.addInfoTxt);
                        btnSubmit.show().text(frm.addBtnTxt).val(frm.addBtnTxt).prop('disabled', true);
                        break;
                    case 'edit':
                        frm.showItem();
                        $(frm[0]).attr('action', frm.editAct);
                        $(frm[0]).data('url', frm.editUrl);
                        $(frm[0]).data('infoTxt', frm.editInfoTxt);
                        btnSubmit.show().text(frm.editBtnTxt).val(frm.editBtnTxt).prop('disabled', false);
                        break;
                    case 'view':
                        frm.showItem();
                        frm.removeAttr('action');
                        $(frm[0]).find(':input[name]').prop('disabled', true);
                        $(frm[0]).find('input:radio:checked').prop('disabled', false);
                        $(frm[0]).find('.append-box').addClass('disabled');
                        btnSubmit.hide();
                        break;
                    default:
                        $(frm[0]).attr('action', optAdd.action);
                        btnSubmit.show().text(optAdd.submitText).val(optAdd.submitText);
                }
                frm.afterUsed(use, frm.data('item'));
                setTimeout(function () {
                    frm.find('button:not([type])').attr('type', 'button');
                }, 300);
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
            reset: function () {
                frm[0].reset();
                $(frm[0]).find(':input[name]').prop('disabled', false).change();
                $(frm[0]).find('.append-box').each(function () {
                    $(this).removeClass('disabled').fnInit();
                });
            },
            check: function () {
                var btnSubmit = $(frm[0]).find('input[type=submit]').prop('disabled', false),
                    bs = $(frm[0]).find('.form-group .control-label>b').removeClass('danger');
                $(frm[0]).find('.form-group:has(.append-box)').each(function () {
                    if ($(this).find('.append-box .item .danger').length > 0) {
                        $(this).find('.control-label>b').addClass('danger');
                        btnSubmit.prop('disabled', true);
                    } else {
                        $(this).find('.control-label>b').removeClass('danger');
                    }
                })
                $(frm[0]).find('.form-group:visible:has(:input.require)').each(function () {
                    var ipts = $(this).find(':input.require'),
                        b = $(this).find('label.control-label>b:first-child');
                    for (var i = 0; i < ipts.length; i++) {
                        if (!$(ipts[i]).val()) {
                            b.addClass('danger');
                            btnSubmit.prop('disabled', true);
                        }
                    }
                });
            },
            showItem: function () {
                var item;
                if ($(frm[0]).data('item')) {
                    item = $(frm[0]).data('item');
                } else {
                    console.warn('组件multForm调用showItem方法需先将要显示的成员数据存入表单data("item")');
                    return;
                }
                $(frm[0]).find(':input[name]').each(function () {
                    var k = $(this).attr('name'),
                        fk = $(this).attr('data-for'),
                        tn = $(this).prop('tagName').toLowerCase(),
                        tp = $(this).prop('type').toLowerCase(),
                        tntp = tp ? tn + ':' + tp : tn,
                        v;
                    if (fk) {
                        var jsonVal;
                        if ($.isJson(item[fk])) {
                            jsonVal = item[fk];
                        } else {
                            try {
                                jsonVal = JSON.parse(item[fk]);
                            } catch (err) {
                                console.error(err)
                            }
                        }
                        v = jsonVal ? jsonVal[k] : '';
                    } else {
                        v = item[k];
                    }
                    switch (tntp) {
                        case 'input:text':
                        case 'input:number':
                        case 'select:single':
                            $(this).val(v);
                            break;
                        case 'input:radio':
                            $(this).prop('checked', $(this).val() == v);
                            break;
                        case 'input:checkbox':
                            $(this).prop('checked', ~~v == 1);
                            break;
                        default:
                            $(this).val(v);
                    }
                    try {
                        $(this).change();
                    } catch (err) {
                        console.error(err);
                    }
                });
                $(frm[0]).find('.append-box :input[name][type=hidden]').each(function () {
                    var k = $(this).attr('name'),
                        v = item[k];
                    if (v && typeof v == 'string') {
                        try {
                            v = JSON.parse(v);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                    $(this).trigger('data', { arrData: v });   //用于append-box组件中的input:hidden接受数据时，触发渲染数据操作
                });
            }
        };
        $.fn[plug] = function (opts) {
            frm = $.extend(this, __def__, __prop__, opts);//将后面三个对象的方法属性以及值合并后赋给this对象
            //准备html
            //禁用表单的回车自动提交
            frm[0].onkeydown = function (event) {
                var target, tag;
                if (!event) {
                    event = window.event; //针对ie浏览器
                    target = event.srcElement;
                } else {
                    target = event.target; //针对遵循w3c标准的浏览器，如Firefox
                }
                if (event.keyCode == 13) {
                    switch (target.tagName) {
                        case 'INPUT':
                        case 'SELECT':
                        case 'TEXTAREA':
                        case 'FORM':
                            return false;
                            break;
                        default:
                            return true;
                    }
                }
            };
            $(frm[0]).find('.form-group:has(:input.require)').each(function () {
                if ($(this).find('label:first-child>b').length == 0) {
                    $(this).find('label:first-child').prepend($('<b>*</b>'));
                }
            });
            $(frm[0]).data('fns', { check: frm.check });
            $(frm[0]).find(':input').on('input propertychange change', frm.check);
            $(frm[0]).find('.btnBack').on('click', function () {
                var tCap = $(frm.relSubCaption);
                frm.closest('.section').hide();
                tCap.html(tCap.data('itemText') + '列表');
                $(frm.targetTable).PagingTable('update');
                $(frm.targetTable).closest('.section').show();
            })
            frm.on('submit', function () {
                var pgrBar = frm.find('.progress .progress-bar'),     //pgrBar.css("width":"30%");
                    pgrSro = pgrBar.find('.progress .progress-bar .sr-only');     //pgrSro.text("30%");
                frm.ajaxSubmit({
                    beforeSerialize: function () {
                        $(frm[0]).find('input:hidden[name]').each(function () {
                            var n = $(this).attr('name'),
                                dt = {};
                            $(frm[0]).find(':input[data-for=' + n + ']').each(function () {
                                $(this).prop('disabled', true);
                                var val,
                                    tag_type = $(this).prop('tagName').toLowerCase();
                                tag_type += $(this).prop('type').toLowerCase() ? (':' + $(this).prop('type').toLowerCase()) : '';
                                switch (tag_type) {
                                    case 'input:checkbox':
                                        if ($(this).hasClass('forbidden')) {
                                            val = -1;
                                        } else {
                                            val = ~~$(this).prop('checked');
                                        }
                                        break;
                                    case 'input:radio':
                                        if ($(this).prop('checked')) {
                                            val = $(this).attr('value');
                                        } else {
                                            return;
                                        }
                                        break;
                                    default:
                                        val = $(this).val() ? $(this).val() : '';
                                }
                                dt[$(this).attr('name')] = val;
                            })
                            if (JSON.stringify(dt) !== '{}') {
                                $(this).val(JSON.stringify(dt));
                            }
                        });
                    },
                    beforeSubmit: function (aNameValue, $frm, ajaxOptions) {
                        if ($(frm[0]).data('url')) {
                            aNameValue.push({ name: "url", value: $(frm[0]).data('url'), type: "text", required: false });
                        }
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
                        $.handleECode(true, data, $(frm[0]).data('infoTxt'));
                        switch (data.rt) {
                            case '0000':
                                frm.reset();
                                switch ($(frm[0]).attr('action')) {
                                    case frm.addAct:
                                        frm.cbSubmit('add');
                                        break;
                                    case frm.editAct:
                                        frm.cbSubmit('edit');
                                        break;
                                    default:
                                }
                                break;
                            default:
                                console.warn("data.rt=" + data.rt)
                        }

                    }
                });
                return false;
            });
            return frm;
        };
        return function (opts) {
            var dom = opts.dom;
            $(dom)[plug].call($(dom), opts); //执行插件功能函数，将this指向$(dom)这个代理对象，并传入参数。
            this.usedAs = frm.usedAs;
            this.reset = frm.reset;
        }
    },
    XTree: function ($, plug) {
        function appendTreeItem(opts, aim, item) {   //向目标容器添加树的子节点
            var gid = item.gid,
                gtxt = item.text,
                gchecked = ~~item.checked,
                ghc = ~~item.hasChild;
            var li = $('<li>\
                        <input type="checkbox"/>\
                        <span>'+ gtxt + '</span>\
                        <i class="tIcon fa fa-plus"></i>\
                    </li>');
            li.attr('data-gid', gid)   //与组id一一对应
                .data({
                    check: gchecked,
                    sel: [],
                    unsel: [],
                    reverse: false,
                }).on('dataChange', function () {
                    if (
                        ($(this).data('check') && $(this).data('unsel').length > 0)
                        || (!$(this).data('check') && $(this).data('sel').length > 0)
                    ) {
                        $(this).data('reverse', 1).find('input:checkbox').prop('indeterminate', true);
                    }

                    var prLi = $(this).closest('ul').prev('li');
                    if (prLi.length == 1 && !prLi.data('reverse') && prLi.data('check') !== $(this).prop('checked')) {
                        prLi.data('reverse', true)
                            .find('input:checkbox').prop('indeterminate', true);
                        prLi.parents('ul').each(function () {
                            $(this).prev('li').data('reverse', true)
                                .find('input:checkbox').prop('indeterminate', true);
                        });
                    }
                    $(this).closest('.xtree').XTree('getRules');
                }).find('input:checkbox').prop('checked', gchecked)  //控制追加的组是否勾选
                .on('change input propertychange', function () {  //监控勾选操作
                    var ck = $(this).prop('checked');
                    li.data({  //刷新自身
                        check: ck,
                        sel: [],
                        unsel: [],
                        reverse: false
                    }).next('ul').find('li').data({//刷新所有子组
                        check: ck,
                        sel: [],
                        unsel: [],
                        reverse: false
                    }).find('input:checkbox')
                        .prop('checked', ck)
                        .prop('indeterminate', false);
                    if (ck || li.hasClass('active')) {
                        li.find('span').click();
                    }
                    li.trigger('dataChange');
                });
            li.find('span').on('click', function () {
                if (!li.hasClass('active')) {
                    li.closest('.xtree').find('li.active').removeClass('active');
                    li.addClass('active');
                }
                $(opts.relPTable).data('PagingTable').jsonData = (gid == 0)
                    ? {
                        'listurl': '/p/org/userList'
                    }
                    : {
                        'listurl': '/p/org/members',
                        'gid': gid
                    };
                $.extend(
                    $(opts.relPTable).data('PagingTable'),
                    {
                        check: li.data('check'),
                        sel: li.data('sel'),
                        unsel: li.data('unsel')
                    }
                )
                $(opts.relPTable).PagingTable('page', 1);
            })
            if (ghc) {
                var tIcon = li.find('.tIcon').on('click', function () {
                    $(this).toggleClass('fa-plus').toggleClass('fa-minus');
                    li.toggleClass('open');
                });
                li.on('preload', function () {
                    var ckb = $(this).find('input:checkbox');
                    var ul = $('<ul>');
                    $.silentGet('/xtree/item', {
                        gid: gid
                    }, function (data) {
                        if (data.rt == '0000') {
                            var items = opts.fnGetTreeItems(data);
                            li.data('items', items);
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].status == 1) {
                                    appendTreeItem(opts, ul, {
                                        gid: items[i][opts.keyItemId],
                                        text: items[i][opts.keyItemText],
                                        checked: ckb.prop('checked'),
                                        hasChild: items[i][opts.keyItemHasChild] ? 1 : 0
                                    })
                                } else {
                                    console.warn('用户组"' + items[i][opts.keyItemText] + '"被禁用，不予显示！')
                                }
                            }
                            li.after(ul);
                        }
                    })
                })

                if (opts.initOpen && gid == 0) {
                    li.find('.tIcon').click().addClass('hidden');
                }
            } else {
                li.find('.tIcon').remove();
            }
            aim.append(li);
            li.trigger('preload');
        };
        var __prop__ = {  //插件默认方法
            init: function (opts) {
                //合并默认配置参数和用户输入参数，形成最终使用配置参数
                var tre = this;
                opts = $.extend(
                    true,
                    {},
                    $.fn[plug].__def__,
                    opts
                )
                //判断该元素是否已经被初始化
                if (
                    this.filter(function () {
                        return $(this).data(plug);
                    }).length !== 0
                ) {
                    console.warn('该元素已经被' + plug + '组件初始化：', this[0])
                }
                //绑定最终使用的配置参数至元素data(plug)插件私有命名空间
                this.data(plug, opts);

                //设置插件核心代码
                tre.addClass('xtree').empty();
                appendTreeItem(opts, tre, {
                    gid: 0,
                    text: opts.rootText,
                    checked: 0,
                    hasChild: 1
                })
                $(opts.relPTable).PagingTable({
                    jsonData: { 'listurl': '/p/org/userList' },
                    //selectAll: true,
                    relFilter: tre[0],
                    // theadHtml为表头类元素，第一个th用于存放全选复选框
                    theadHtml: '<tr>\
                                    <th></th>\
                                    <th>姓名</th>\
                                    <th>账号</th>\
                                    <th>所属组</th>\
                                    <th>状态</th>\
                                </tr>',
                    // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
                    // to-edit、to-view表示要跳转的目标表单
                    tbodyDemoHtml: '<tr>\
                                        <td></td>\
                                        <td><span item-key="name"></span></td>\
                                        <td><span item-key="account"></span></td>\
                                        <td><span item-key="depart_name"></span></td>\
                                        <td><span item-key="status"></span></td>\
                                    </tr>',
                    tbodyEmptyHtml: '<tr><td>该用户组没有直属用户</td><tr>',
                    //因不同需求需要个性控制组件表现的修正函数和增强函数
                    fnGetItems: function (data) {  //必需   需要要显示的成员
                        return data[opts.tableListKey];
                    },
                    fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
                        switch (k) {
                            case 'status':
                                v = v == 1 ? '已激活' : '未激活';  //例：
                                break;
                            default:
                        }
                        return v;
                    }
                });
                tre.find('li[data-gid=0]').addClass('active');
                return tre;
            },
            getRules: function () {
                var rules = {
                    "gid": 'root',  //虚拟根
                    "check": 0,
                    "reverse": 0,
                    "pickUsers": [],
                    "pickGroups": []
                };
                this.data('rules', rules);
                var li0 = this.find('li[data-gid=0]'),
                    ckb0 = li0.find('input:checkbox');
                if (ckb0.prop('checked') || ckb0.prop('indeterminate')) {
                    rules.reverse = 1;
                    rules.pickGroups.push(gtj(li0))
                }
                function gtj(li) {
                    var tj = {
                        "gid": ~~li.data('gid'),
                        "check": ~~li.data('check'),
                        "reverse": ~~li.data('reverse'),
                        "pickUsers": [],
                        "pickGroups": []
                    }
                    if (tj.reverse) {
                        var pus = tj.check ? li.data('unsel') : li.data('sel');
                        if (pus.length > 0) {
                            for (var i = 0; i < pus.length; i++) {
                                tj.pickUsers.push(pus[i].id);
                            }
                        }
                        if (li.next('ul').length == 1) {
                            li.next('ul').find('li').each(function () {
                                if ($(this).data('reverse') || !($(this).data('check') == tj.check)) {
                                    tj.pickGroups.push(gtj($(this)));
                                }
                            })
                        }
                    }
                    return tj;
                }
            },
            reset: function () {

            }
        };
        $.fn[plug] = function (fn) {
            if (__prop__[fn]) {
                return __prop__[fn].apply(
                    this,
                    Array.prototype.slice.call(arguments, 1)
                );
            } else if ($.type(fn) === 'object' || fn == undefined) {
                return __prop__.init.apply(this, arguments);
            } else {
                console.warn('PagingTable组件没有方法' + fn);
            }
        };
        $.fn[plug]['__def__'] = {     //插件默认属性
            rootUrl: '/p/org/userList', //树形根节点获取全部用户接口
            rootText: '所有用户组',
            relPTable: '#tblForUserGroupTree',
            tableListKey: 'user_list',
            relSubCaption: "#subCaption", //关联的显示标题选择器
            keyItemId: 'id',
            keyItemText: 'name',
            keyItemHasChild: 'child_node',
            initOpen: 1,
            initChecked: 0,
            fnGetTreeItems: function (data) {
                return data.depart_list
            },
        };
    },
    XList: function ($, plug) {
        var __prop__ = {  //插件默认方法
            init: function (opts) {
                //合并默认配置参数和用户输入参数，形成最终使用配置参数
                var lst = this;
                opts = $.extend(
                    true,
                    {},
                    $.fn[plug].__def__,
                    opts
                )
                //判断该元素是否已经被初始化
                if (
                    this.filter(function () {
                        return $(this).data(plug);
                    }).length !== 0
                ) {
                    console.warn('该元素已经被' + plug + '组件初始化：', this[0])
                }
                //绑定最终使用的配置参数至元素data(plug)插件私有命名空间
                this.data(plug, opts);

                //设置插件核心代码
                var ul = $('<ol class="dd-list"></ol>');
                lst.addClass('xlist dd shadowed').empty().append(ul);
                $.silentGet('/xlist/item', {}, function (data) {
                    if (data.rt == '0000') {
                        var items = opts.fnGetListItems(data);
                        lst.data('items', items);
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].status == 1) {
                                appendListItem(opts, ul, {
                                    tid: items[i].id,
                                    tname: items[i].name
                                })
                            } else {
                                console.warn('用户标签"' + items[i].name + '"被禁用，不予显示！')
                            }

                        }
                        ul.find('li:first span').click();
                    }

                })
                function appendListItem(opts, aim, item) {   //向目标容器添加树的子节点
                    var tid = item.tid,
                        txt = item.tname;
                    var li = $('<li class="dd-item">\
                                    <div class="dd-handle">\
                                        <input type="checkbox"/>\
                                        <span>'+ txt + '</span>\
                                    </div>\
                                </li>');
                    li.attr('data-tid', tid)   //与组id一一对应
                        .data({
                            check: 0,
                            sel: [],
                            unsel: [],
                            reverse: false,
                        }).on('dataChange', function () {
                            if (
                                ($(this).data('check') && $(this).data('unsel').length > 0)
                                || (!$(this).data('check') && $(this).data('sel').length > 0)
                            ) {
                                $(this).data('reverse', 1).find('input:checkbox').prop('indeterminate', true);
                            }
                            $(this).closest('.xlist').XList('getRules');
                        });
                    li.find('input:checkbox').on('change input propertychange', function () {  //监控勾选操作
                        li.data({  //刷新自身
                            check: $(this).prop('checked'),
                            sel: [],
                            unsel: [],
                            reverse: false
                        });
                        if ($(this).prop('checked') || li.hasClass('active')) {
                            li.find('span').click();
                        }
                        li.trigger('dataChange');
                    })
                    li.find('span').on('click', function () {
                        if (!li.hasClass('active')) {
                            li.closest('.xlist').find('li.active').removeClass('active');
                            li.addClass('active');
                        }
                        if ($(opts.relPTable).hasClass('pagingTable')) {
                            $.extend(
                                $(opts.relPTable).data('PagingTable'),
                                {
                                    check: li.data('check'),
                                    sel: li.data('sel'),
                                    unsel: li.data('unsel'),
                                    jsonData: {
                                        'listurl': '/p/org/members',
                                        'tid': tid
                                    }
                                }
                            )
                            $(opts.relPTable).PagingTable('page', 1);
                        } else {
                            $(opts.relPTable).PagingTable({
                                jsonData: {
                                    'listurl': '/p/org/members',
                                    'tid': tid
                                },
                                //selectAll: true,
                                relFilter: lst[0],
                                // theadHtml为表头类元素，第一个th用于存放全选复选框
                                theadHtml: '<tr>\
                                    <th></th>\
                                    <th>姓名</th>\
                                    <th>账号</th>\
                                    <th>所属组</th>\
                                    <th>状态</th>\
                                </tr>',
                                // tbodyDemoHtml用于复制的行样本，通过data-key获取数据定点显示，第一个td用于存储用于选择的复选框
                                // to-edit、to-view表示要跳转的目标表单
                                tbodyDemoHtml: '<tr>\
                                        <td></td>\
                                        <td><span item-key="name"></span></td>\
                                        <td><span item-key="account"></span></td>\
                                        <td><span item-key="depart_name"></span></td>\
                                        <td><span item-key="status"></span></td>\
                                    </tr>',
                                tbodyEmptyHtml: '<tr><td>该用户标签没有用户</td><tr>',
                                //因不同需求需要个性控制组件表现的修正函数和增强函数
                                fnGetItems: function (data) {  //必需   需要要显示的成员
                                    return data.user_list;
                                },
                                fnValByKey: function (k, v) {  //用于根据键值对修正要显示文本
                                    switch (k) {
                                        case 'status':
                                            v = v == 1 ? '已激活' : '未激活';  //例：
                                            break;
                                        default:
                                    }
                                    return v;
                                }

                            });
                        }
                    })
                    aim.append(li);
                };
                lst.find('ul>li:first>span').click();
                return lst;
            },
            getRules: function () {
                var rules = [];
                this.data('rules', rules);
                this.find('li').each(function () {
                    if ($(this).data('check') || $(this).data('sel').length > 0) {
                        rules.push({
                            tid: ~~$(this).data('tid'),
                            check: ~~$(this).data('check'),
                            sel: $(this).data('sel'),
                            unsel: $(this).data('unsel')
                        });
                    }
                });
            },
            reset: function () {

            }
        };
        $.fn[plug] = function (fn) {
            if (__prop__[fn]) {
                return __prop__[fn].apply(
                    this,
                    Array.prototype.slice.call(arguments, 1)
                );
            } else if ($.type(fn) === 'object') {
                return __prop__.init.apply(this, arguments);
            } else if (!fn) {
                return __prop__.init.apply(this, {});
            } else {
                console.warn('pagingTable组件没有方法' + fn);
            }
        };
        $.fn[plug]['__def__'] = {     //插件默认属性
            relPTable: '#tblForUserTagList',
            fnGetListItems: function (data) {
                return data.tag_list;
            }
        };
    },
    ScrollList: function ($, plug) { //分页表格组件
        var __prop__ = {  //插件默认方法
            init: function (opts) {
                //合并默认配置参数和用户输入参数，形成最终使用配置参数
                opts = $.extend(
                    {},
                    $.fn[plug].__def__,
                    opts
                )
                //判断该元素是否已经被初始化
                if (
                    this.filter(function () {
                        return $(this).data(plug);
                    }).length !== 0
                ) {
                    console.warn('该元素已经被' + plug + '组件初始化：', this[0])
                }
                //绑定最终使用的配置参数至元素data(plug)插件私有命名空间
                this.data(plug, opts);

                //设置插件核心代码
                //准备html
                var dtTop = $('<dt><ul></ul></dt>'),
                    ulTop = dtTop.find('ul'),
                    ddHas = $('<dd class="ddHas"><ul></ul></dd>').hide(),
                    ulHas = ddHas.find('ul'),
                    ddDemo = $('<dd class="ddDemo"><ul></ul></dd>').hide(),
                    ulDemo = ddDemo.find('ul'),
                    ddLoading = $('<dd class="ddLoading"><ul><li>' + opts.loadingText + '</li></ul></dd>'),
                    ddEmpty = $('<dd class="ddEmpty"><ul><li>' + opts.emptyText + '</li></ul></dd>').hide();
                if (opts.elesTop.length === opts.elesDemo.length) {
                    for (var i = 0; i < opts.elesTop.length; i++) {
                        ulTop.append($('<li>').html(opts.elesTop[i]));
                    }
                    for (var i = 0; i < opts.elesDemo.length; i++) {
                        ulDemo.append($('<li>').html(opts.elesDemo[i]));
                    }
                } else {
                    console.error(plug + 'elesTop和elesDemo长度不一致！');
                }

                ulDemo.find('.btnUnbind').off().on('click', function () {
                    var ul = $(this).closest('ul');
                    console.log(ul.data('item'));
                    $.actPost('/man/railpolicy/unbindPolicy', {
                        uid: ul.data('item').uid != undefined ? ul.data('item').uid : ul.data('item').id,
                        policy_id: opts.numInfoData.id,
                        policy_type: opts.numInfoData.policy_type
                    }, function (data) {
                        if (data.rt == '0000') {
                            if (ul.closest('dd.ddHas').find('ul').length > 1) {
                                ul.nextAll('ul').each(function () {
                                    var counter = $(this).find('.counter'),
                                        n = ~~counter.text() - 1;
                                    counter.text(n);
                                })
                            } else {
                                ul.closest('dd').hide();
                                ul.closest('dl').find('dd.ddEmpty').show();
                            }
                            ul.slideUp(300, function () {
                                ul.remove();
                            });
                            $(opts.relPagingTable).PagingTable('update');
                        }
                    }, '策略移出');
                });
                ulDemo.find('.btnDelVerison').off().on('click', function () {
                    var ul = $(this).closest('ul'),
                        item = ul.data('item');
                    $.actPost('/mam/app/delVersion', {
                        id: item.id
                    }, function (data) {
                        if (data.rt == '0000') {
                            if (ul.closest('dd.ddHas').find('ul').length > 1) {
                                ul.nextAll('ul').each(function () {
                                    var counter = $(this).find('.counter'),
                                        n = ~~counter.text() - 1;
                                    counter.text(n);
                                })
                            } else {
                                ul.closest('dd').hide();
                                ul.closest('dl').find('dd.ddEmpty').show();
                            }
                            ul.slideUp(300, function () {
                                ul.remove();
                            });
                            $(opts.relPagingTable).PagingTable('update');
                        }
                    }, '删除')
                });


                this.empty().addClass('scrollList')
                    .append($('<dl>').append(dtTop, ddHas, ddDemo, ddLoading, ddEmpty))
                    .find('ul').css({
                        width: opts.width
                    });
                ddHas.css({
                    maxHeight: opts.maxHeight,
                })


                //控制列表各列宽度
                var sum = 0;
                for (i in opts.widthProportion) {
                    sum += opts.widthProportion[i];
                }
                for (i in opts.widthProportion) {
                    var widPercent = (opts.widthProportion[i] / sum) * 100 + '%';
                    ulTop.children('li').eq(i).css({
                        width: widPercent
                    })
                    ulDemo.children('li').eq(i).css({
                        width: widPercent
                    })
                }
                if (opts.inputList && opts.inputList instanceof Array) {
                    ddLoading.hide();
                    opts['list'] = opts.inputList;
                    showList(opts.list);
                } else {
                    $.nullGet('/list', opts.numInfoData, function (data) {
                        ddLoading.hide();
                        opts.completed(data);
                        if (data.rt == '0000') {
                            opts['list'] = opts.fnGetItems(data);
                            showList(opts.list);
                        }
                    })
                }
                function showList(list) {
                    if (list.length > 0) {
                        ddHas.empty().show();
                        for (var i = 0; i < list.length; i++) {
                            var uli = ulDemo.clone(true);
                            uli.data('item', list[i]);
                            uli.find('.counter').text(i + 1);
                            uli.find('[item-key]').each(function () {
                                var k = $(this).attr('item-key'),
                                    v = opts.fnValByKey(k, list[i][k]);
                                $(this).html(v);
                                if (typeof v == 'string' && v.length > 15) {
                                    $(this).closest('li').attr('title', $(this).text()).css({
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    })
                                }
                            });
                            console.log(uli[0])
                            ddHas.append(uli);
                        }
                    } else {
                        ddEmpty.show();
                    }
                }
                return this;
            }
        };
        $.fn[plug] = function (fn) {
            if (__prop__[fn]) {
                return __prop__[fn].apply(
                    this,
                    Array.prototype.slice.call(arguments, 1)
                );
            } else if ($.type(fn) === 'object') {
                return __prop__.init.apply(this, arguments);
            } else {
                console.warn('pagingTable组件没有方法' + fn);
            }
        };
        $.fn[plug]['__def__'] = {     //插件默认属性
            type: 'GET',
            inputList: false,
            numInfoData: {
                listurl: '/p/org/userByPolicyId'
            },
            totalCount: 0,
            //必需  表头
            elesTop: ['序号', '姓名', '账号', '状态', '操作'],
            elesDemo: [
                '<span class="counter"></span>',
                '<span item-key="name"></span>',
                '<span item-key="account"></span>',
                '<span item-key="status"></span>',
                '<span class="btnUnbind">移出策略</span>'
            ],
            relPagingTable: '#pagingTable',
            width: '500px',
            maxHeight: '250px',
            widthProportion: [0.6, 1, 1, 1, 1],
            //可选   没有成员时的显示文本
            emptyText: '暂无数据',
            //可选   加载成员时的显示文本
            loadingText: '数据加载中...',
            //必需  成员显示样本
            fnGetItems: function (data) {  //必需   需要要显示的成员
                return data.data;
            },
            fnValByKey: function (k, v) {
                switch (k) {
                    case 'status':
                        v = v == 1 ? '已应用' : '已下发';
                        break;

                    default:
                }
                return v;
            },
            completed: function (data) {

            }
        };
    }
})