/**
 * 自制的用于项目迅速建立统一风格的组件
 */

//pagingTable 分页表格 paging:true分页（false不分页）
(function (root, factorys) {
    //定义全局函数
    //valByKey函数用于基于key提取多层item数据的值,用于解析列表类组件关键字item-key显示的渲染
    //如 item={name:'Jim',age=33,pet:{name:'coco',type:'cat'}},key='pet.name'
    //则 valByKey(item,key)的返回值为'coco'
    root['valByKey'] = function (item, key) {
        var val = item, keys = key.split('.');
        try {
            for (i in keys) {
                val = val[keys[i]];
                if(val===null||val===undefined){
                    val===null;
                    break;
                }
            }
        } catch (err) {
            val = '';
            this.console.error(item);
            this.console.error(keys);
            this.console.error(err);
        }
        return val;
    }

    //批量暴露组件
    for (plug in factorys) {
        root[plug] = factorys[plug](root.jQuery, plug);
    }
})(window, {
    Panel: function ($, plug) { //表格上面的按键面板
        var pnl;
        var __def__ = {
            relPagingTable: '#pagingTable',
            objTargetForm: {},
            relSubCaption: '#subCaption',
            relXTree: '#treeUserGroup',
            relXList: '#treeUserTag',
            defaultHtmlPullRight: '<div class="input-group">\
                                        <span class="input-icon">\
                                            <input id="iptKeyword" ctrl-regex="keyword" type="text" class="form-control input-sm" autocomplete="off" placeholder="请输入搜索关键字">\
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
            var pnlLeft = $(pnl[0]).find(".pull-left:first").addClass('buttons-preview');
            pnlLeft.find('button').attr('type', 'button');

            //判断是否具有添加权限
            hasFn('add')
                ? pnlLeft.find('.btnAdd,.btnUpload').on('click', function () {
                    var actText = $(this).text().replace(/[\s]/g, ''),
                        sCap = $(pnl.relSubCaption);
                    sCap.text(actText + sCap.data('itemText'));
                    $('.section:has(#pagingTable)').hide();
                    $('.section:has(#multForm)').show();
                    pnl.objTargetForm.usedAs('add');
                    if (pnl.cbAdd) {
                        pnl.cbAdd();
                    }
                })
                : toggleFn(pnlLeft.find('.btnAdd,.btnUpload'), false);


            //判断是否具有启用/禁用权限
            hasFn('act')
                ? pnlLeft.find('.btnAct,.btnUnact').off().on('click', function () {
                    if ($(this).hasClass('btnAct') || $(this).hasClass('btnUnact')) {  //禁用/启用
                        var actText = $(this).text().replace(/[\s]/g, ''),//获取操作类型文本禁用或启用
                            status = ~~$(this).hasClass('btnAct'),//获取操作标识
                            sel = pagingTable.data('PagingTable').sel;//获取列表中所有选中的对象数据
                        if (sel.length > 0) {
                            var aimText = getItemType(sel[0]);
                            if (hasHdlAuth(sel, actText, aimText)) {
                                switch (aimText) {
                                    case '策略':
                                        pcyAct();
                                        break;
                                    // case '应用名单':
                                    //     appAct();
                                    //     break;
                                    default:
                                        defAct();
                                }
                            }
                            function pcyAct() {
                                var allPros = [],
                                    selPcyIds = {
                                        device: $.arrKeyFlt(sel, 'id', function (item) {
                                            return item.policy_type == 'device';
                                        }),
                                        complicance: $.arrKeyFlt(sel, 'id', function (item) {
                                            return item.policy_type == 'complicance';
                                        }),
                                        geofence: $.arrKeyFlt(sel, 'id', function (item) {
                                            return item.policy_type == 'geofence';
                                        }),
                                        timefence: $.arrKeyFlt(sel, 'id', function (item) {
                                            return item.policy_type == 'timefence';
                                        }),
                                        whiteapp: $.arrKeyFlt(sel, 'id', function (item) {
                                            return item.policy_type == 'whiteapp';
                                        }),
                                        blackapp: $.arrKeyFlt(sel, 'id', function (item) {
                                            return item.policy_type == 'blackapp';
                                        }),
                                        limitaccess: $.arrKeyFlt(sel, 'id', function (item) {
                                            return item.policy_type == 'limitaccess';
                                        }),
                                        customer: $.arrKeyFlt(sel, 'id', function (item) {
                                            return item.policy_type == 'customer';
                                        })
                                    };
                                for (k in selPcyIds) {
                                    if (selPcyIds[k].length > 0) {
                                        allPros.push($.proPost('/common/toggle', {
                                            url: pnl.updateStatusUrl,
                                            status: status,
                                            ids: JSON.stringify(selPcyIds[k]),
                                            policy_type: k
                                        }));
                                    }
                                }
                                if (allPros.length > 0) {
                                    $.proAll(true, allPros, function (datas, rts) {
                                        if (rts.length === 1 && rts[0] == '0000') {
                                            pagingTable.PagingTable('update');
                                        } else {
                                            var arr = [];
                                            for (i in datas) {
                                                if (datas[i].rt === '3009') {
                                                    arr = arr.concat(datas[i].data || datas[i].policy_list);
                                                }
                                            }
                                            if (arr.length > 0) {
                                                $.dealRt3009(arr);
                                            }
                                        }
                                    }, actText);
                                }
                            }
                            function defAct() {
                                $.actPost('/common/toggle', actData(sel), function (data) {
                                    switch (data.rt) {
                                        case '0000':
                                            pagingTable.PagingTable('update');
                                            break;
                                        case '3009':
                                        case '5103':
                                            var arr = data.data || data.policy_list;
                                            if (arr.length > 0) {
                                                $.dealRt3009(arr);
                                            }
                                            break;
                                        default:
                                    }
                                }, actText);
                                function actData(sel) {  //基于列表选中组织启用/禁用请求数据
                                    var jsonPatch = { url: pnl.updateStatusUrl };
                                    if (pnl.updateStatusJson.hasOwnProperty('flag')) {
                                        jsonPatch['flag'] = status;
                                    } else {
                                        jsonPatch['status'] = status;
                                    }
                                    if (pnl.updateStatusJson.hasOwnProperty('account')) {
                                        jsonPatch['account'] = JSON.stringify($.arrKeyFlt(sel, 'account'));
                                    } else if (pnl.updateStatusJson.hasOwnProperty('id')) {
                                        jsonPatch['id'] = JSON.stringify($.arrKeyFlt(sel, 'id'));
                                    } else {
                                        jsonPatch['ids'] = JSON.stringify($.arrKeyFlt(sel, 'id'));
                                    }
                                    return $.extend(
                                        true,
                                        pnl.updateStatusJson,
                                        jsonPatch
                                    )
                                }
                            }
                        } else {
                            warningOpen('请选择要' + actText + '的' + $(pnl.relSubCaption).data('itemText') + '！', 'danger', 'fa-bolt');
                        }
                    }
                })
                : toggleFn(pnlLeft.find('.btnAct,.btnUnact'), false);

            //判定是否具有激活码发送权限
            hasFn('ena')
                ? pnlLeft.find('.btnInvite').on('click', function () {
                    var actText = $(this).text().replace(/[\s]/g, ''),//获取操作类型文本-删除
                        sel = pagingTable.data('PagingTable').sel;//获取列表中所有选中的对象数据：要删除的数据
                    if (sel.length > 0) {
                        var invited = $.arrKeyFlt(sel, false, function (item) {
                            return item.status == '1';
                        });
                        if (invited.length == 0) {
                            $.dialog('confirm', {
                                width: 460,
                                height: null,
                                maskClickHide: true,
                                title: "用户激活码发送",
                                content: '<p class="text-align-center">确认向选中的用户发送激活码吗？</p>',
                                hasBtn: true,
                                hasClose: true,
                                hasMask: true,
                                confirmValue: '确认',
                                confirm: function () {
                                    $('.dialog-btn-confirm').addClass('disabled');
                                    $.actPost('/admin/user/invite', {
                                        userId: JSON.stringify(arrByKey(sel, 'userId'))
                                    }, function (data) {
                                        $('.dialog-btn-confirm').removeClass('disabled');
                                        switch (data.rt) {
                                            case '0000':
                                                pagingTable.PagingTable('update');
                                                $.dialogClose();
                                                break;
                                            default:
                                        }
                                    }, actText)
                                    function arrByKey(arr, key) {
                                        return arr.map(function (item) {
                                            return item[key];
                                        });
                                    }
                                },
                                confirmHide: false,
                                cancelValue: '取消'
                            });
                        } else {
                            warningOpen('请选择未激活用户！', 'danger', 'fa-bolt');
                        }

                    } else {
                        warningOpen('请选择要' + actText + '的' + $(pnl.relSubCaption).data('itemText') + '！', 'danger', 'fa-bolt');
                    }
                })
                : toggleFn(pnlLeft.find('.btnInvite'), false);

            pnlLeft.find('.btnRefresh').on('click', function () {
                var btnRefresh = $(this).prop('disabled', true);
                setTimeout(function () {
                    btnRefresh.prop('disabled', false);
                }, 700)
                $(pnl.relPagingTable).PagingTable('refresh');
            });

            pnlLeft.find('.btnToggleOrg').on('click', function () {
                var btnToggleOrg = $(this).prop('disabled', true);
                btnToggleOrg.closest('.section').find('.orgmind').toggle(20, function () {
                    btnToggleOrg.prop('disabled', false);
                });
            });
            //判定管理员角色功能点是否具有删除功能权限
            if(hasFn('del')){
                pnlLeft.find('.btnDel').on('click', function () {
                    var actText = $(this).text().replace(/[\s]/g, ''),//获取操作类型文本-删除
                        sel = pagingTable.data('PagingTable').sel;//获取列表中所有选中的对象数据：要删除的数据
                    if (sel.length > 0) {
                        if(hasHdlAuth(sel,'删除',getItemType(sel[0]))){  //判定管理员对所选成员是否都具有删除权限
                            var needUnact;
                            switch (getItemType(sel[0])) {
                                case '用户':
                                case '用户标签':
                                    needUnact = [];
                                default:
                                    needUnact = $.arrKeyFlt(sel, false, function (item) {
                                        return item.status == '1';
                                    });
                            }
    
                            if (needUnact.length == 0) {
                                $.dialog('confirm', {
                                    width: 460,
                                    height: null,
                                    maskClickHide: true,
                                    title: "删除确认",
                                    content: '<p class="text-align-center">确认删除选中的' + $(pnl.relSubCaption).data('itemText') + '吗？</p>',
                                    hasBtn: true,
                                    hasClose: true,
                                    hasMask: true,
                                    confirmValue: '确认',
                                    confirm: function () {
                                        if (sel[0].hasOwnProperty('policy_type')) {
                                            delPolicy();
                                        } else {
                                            delDefault();
                                        }
                                        function delPolicy() {
                                            var allPros = [],
                                                selPcyIds = {
                                                    device: $.arrKeyFlt(sel, 'id', function (item) {
                                                        return item.policy_type == 'device';
                                                    }),
                                                    complicance: $.arrKeyFlt(sel, 'id', function (item) {
                                                        return item.policy_type == 'complicance';
                                                    }),
                                                    geofence: $.arrKeyFlt(sel, 'id', function (item) {
                                                        return item.policy_type == 'geofence';
                                                    }),
                                                    timefence: $.arrKeyFlt(sel, 'id', function (item) {
                                                        return item.policy_type == 'timefence';
                                                    }),
                                                    whiteapp: $.arrKeyFlt(sel, 'id', function (item) {
                                                        return item.policy_type == 'whiteapp';
                                                    }),
                                                    blackapp: $.arrKeyFlt(sel, 'id', function (item) {
                                                        return item.policy_type == 'blackapp';
                                                    }),
                                                    limitaccess: $.arrKeyFlt(sel, 'id', function (item) {
                                                        return item.policy_type == 'limitaccess';
                                                    }),
                                                    customer: $.arrKeyFlt(sel, 'id', function (item) {
                                                        return item.policy_type == 'customer';
                                                    })
                                                };
                                            for (k in selPcyIds) {
                                                if (selPcyIds[k].length > 0) {
                                                    allPros.push($.proPost('/common/del', {
                                                        url: '/p/policy/delete',
                                                        ids: JSON.stringify(selPcyIds[k]),
                                                        policy_type: k
                                                    }));
                                                }
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
                                        }
                                        function delDefault() {
                                            var modJson = {};
                                            if (pnl.deleteJson.hasOwnProperty('id')) {
                                                modJson['id'] = JSON.stringify($.arrKeyFlt(sel, 'id'))
                                            } else {
                                                modJson['ids'] = JSON.stringify($.arrKeyFlt(sel, 'id'))
                                            }
                                            $.actPost('/common/del', delData(sel), function (data) {
                                                switch (data.rt) {
                                                    case '0000':
                                                        pagingTable.PagingTable('update');
                                                        break;
                                                    default:
                                                }
                                            }, actText)
                                            function delData(sel) {
                                                var jsonPatch = {};
                                                if (pnl.deleteJson.hasOwnProperty('account')) {
                                                    jsonPatch['account'] = JSON.stringify(arrByKey(sel, 'account'));
                                                } else if (pnl.deleteJson.hasOwnProperty('userId')) {
                                                    jsonPatch['userId'] = JSON.stringify(arrByKey(sel, 'userId'));
                                                } else if (pnl.deleteJson.hasOwnProperty('id')) {
                                                    jsonPatch['id'] = JSON.stringify(arrByKey(sel, 'id'));
                                                } else {
                                                    jsonPatch['ids'] = JSON.stringify(arrByKey(sel, 'id'));
                                                }
                                                return $.extend(
                                                    true,
                                                    pnl.deleteJson,
                                                    jsonPatch
                                                )
                                                function arrByKey(arr, key) {
                                                    return arr.map(function (item) {
                                                        return item[key];
                                                    });
                                                }
                                            }
                                        }
                                    },
                                    confirmHide: true,
                                    cancelValue: '取消'
                                });
                            } else {
                                warningOpen('请先禁用要删除的' + $(pnl.relSubCaption).data('itemText') + '！', 'danger', 'fa-bolt');
                            }
                        }
                        
                    } else {
                        warningOpen('请选择要' + actText + '的' + $(pnl.relSubCaption).data('itemText') + '！', 'danger', 'fa-bolt');
                    }
                })
            }else{
                toggleFn(pnlLeft.find('.btnDel'), false);
            }

            //判定管理员角色功能点是否具有机构内下发权限
            if(hasFn('iio')){  //管理员角色功能点是否具有机构内下发权限
                pnlLeft.find('.btnToIssue').on('click', function () {
                    var actText = $(this).text().replace(/[\s]/g, ''),
                        sel = $(pnl.relPagingTable).data('PagingTable').sel,
                        sCap = $(pnl.relSubCaption);
                    if (sel.length == 0) {
                        warningOpen('请选择要' + actText + '的' + $(pnl.relSubCaption).data('itemText'), 'danger', 'fa-bolt');
                        return false;
                    } else {   //每次只让下发一个策略
                        if (hasHdlAuth(sel, '机构内下发', '策略')) {  //判定管理员对所选成员是否都具有机构内下发权限
                            switch (getItemType(sel[0])){
                                case '策略':
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
                                    break;
                                case '文件':
                                    var arr = [];
                                    for (var i = 0; i < sel.length; i++) {
                                        arr.push(~~sel[i].id)
                                    }
                                    $('#tabForIssue').data('file', {
                                        ids: JSON.stringify(arr)
                                    });
                                    break;
                                case '应用':
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
                                    break;
                                default:
                                    $('#tabForIssue').data('sel', sel);
                            }
                            sCap.text(actText + sCap.data('itemText'));
                            $('.section:has(#pagingTable)').hide();
                            $('.section:has(#tabForIssue)').show();
                            $(pnl.relXTree).XTree();
                            $(pnl.relXList).XList();
                        }
                    } 
                })
            }else{
                toggleFn(pnlLeft.find('.btnToIssue'), false);
            }

            //判定管理员角色功能点是否具有跨机构操作（发布或下发）权限
            if(hasFn('ioo') || hasFn('pub')){
                pnlLeft.find('.btnToSubOrgs').on('click', function () {
                    var actText = $(this).text().replace(/[\s]/g, ''),
                        sel = $(pnl.relPagingTable).data('PagingTable').sel,
                        sCap = $(pnl.relSubCaption);

                    if (sel.length == 0) {
                        warningOpen('请选择要' + actText + '的' + $(pnl.relSubCaption).data('itemText'), 'danger', 'fa-bolt');
                        return false;
                    } else {
                        if (hasHdlAuth(sel, '跨机构下发发布', '策略')) {
                            switch (getItemType(sel[0])){
                                case '策略':
                                    if (sel.length > 1) {
                                        warningOpen('一次只能下发或发布一个策略！', 'danger', 'fa-bolt');
                                        return false;
                                    } else {
                                        if (sel[0].status === 0) {
                                            warningOpen('请先启用该策略！', 'danger', 'fa-bolt');
                                            return false;
                                        }
                                        $('#om_select').data('policy', {
                                            policy_id: sel[0].id,
                                            policy_type: sel[0].policy_type
                                        });
                                    }
                                    break;
                                case '文件':
                                    var arr = [];
                                    for (var i = 0; i < sel.length; i++) {
                                        arr.push(~~sel[i].id)
                                    }
                                    $('#tabForIssue').data('file', {
                                        ids: JSON.stringify(arr)
                                    });
                                    break;
                                case '应用':
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
                                    break;
                                default:
                    
                            }
                            sCap.text(actText + sCap.data('itemText'));
                            $('.section:has(#pagingTable)').hide();
                            $('.section:has(#om_select)').show();
                            $('#om_select').css({
                                height: '500px',
                                overflow: 'auto'
                            });
                            if($('#om_select').data('om') instanceof OrgMind){
                                $('#om_select').data('om').refresh();
                            }else{
                                var omSelect = new OrgMind({
                                    container: 'om_select',          //'om_admin'-- id of the container   
                                    multiple: true,     //支持多选
                                    allowUnsel: true,    //允许不选
                                    disableRoot: true,
                                    editable: false,
                                    expandToDepth:10,
                                    view: {
                                        hmargin: 20,
                                        vmargin: 5,
                                        line_width: 1,
                                        line_color: '#000'
                                    },
                                    layout: {
                                        hspace: 20,
                                        vspace: 10,
                                        pspace: 12
                                    },
                                    jmnodeClick: function (om) {  //标签元素jmnode
                                        
                                    },
                                    complete:function(om){
                                        
                                    }
                                });
                            }
                        }
                    }
                })
            }else{
                toggleFn(pnlLeft.find('.btnToSubOrgs'), false);
            }


            if(hasFn('mod')){
                pnlLeft.find('.btnDefPcy').on('click', function () {
                    var btn = $(this).prop('disabled', true);
                    $.silentPost('/policy/default', {
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
                });
            }else{
                toggleFn(pnlLeft.find('.btnDefPcy'), false);
            }
            

            //绑定常用事件
            //设置右部输入、选择框样式
            var pnlRight = $(pnl[0]).find(".pull-right").html(pnl.defaultHtmlPullRight);
            pnlRight.find('#pageLength').on('change', function () {
                /**
                 * pagingTable组件会优先获取目标表格存储的data('pageLength')作为单页长度，
                 * 如果没有则才用内置的默认长度
                 */
                $(pnl.relPagingTable).data('PagingTable').pageLength = $(this).val() * 1;
                $(pnl.relPagingTable).PagingTable('page', 1);
            })
            pnlRight.find('#iptKeyword').on('input change propertychange', function () {
                /**
                 * pagingTable组件会优先获取目标表格存储的data('keyword')作为搜索关键字，
                 */
                if ($.iptRegExpCtrl(this)) {
                    $('#pagingTable').data('PagingTable').keyword = encodeURIComponent($(this).val());
                    if ($(this).data('timer')) {
                        clearTimeout($(this).data('timer'))
                    }
                    $(this).data('timer', setTimeout(function () {
                        $(pnl.relPagingTable).PagingTable('page', 1);
                    }, 700))
                }
            })
            //绑定默认事件
            return pnl;
        };
        return function (opts) {
            var dom = opts.dom;
            $(dom)[plug].call($(dom), opts); //执行插件功能函数，将this指向$(dom)这个代理对象，并传入参数。
        }
    },
    IssuePane: function ($, plug) { //下发界面的按键面板
        var __def__ = {
            issueText: '下发',
            hasIssueBtn: 1,
            hasUnissueBtn: 0,
            hasIssSubBtn: 0,
            hasPubSubBtn: 0,
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
            var ipnl = this;
            opts = $.extend(true, {}, __def__, opts);//将后面三个对象的方法属性以及值合并后赋给this对象
            //准备html
            var innerHtml = '<form class="form-inline" role="form" onkeydown="if(event.keyCode==13){return false;}">'
                + '<div class="buttons-preview pull-left">'
                + (opts.hasIssueBtn ? '<button class="btnIssue btn btn-primary">' + opts.issueText + '</button>' : '')
                + (opts.hasUnissueBtn ? '<button class="btnUnissue btn btn-primary">撤销下发</button>' : '')
                + (opts.hasIssSubBtn ? '<button act="ISS" class="btn btn-primary">下发</button>' : '')
                + (opts.hasPubSubBtn ? '<button act="PUB" class="btn btn-primary">发布</button>' : '')
                + (opts.hasBackBtn ? '<button class="btnBack btn btn-default">返回</button>' : '')
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
            }).find('button').attr('type', 'button');

            var ipnlLeft = $(ipnl[0]).find(".pull-left:first").addClass('buttons-preview');
            ipnlLeft.find('.btnBack').on('click', function () {  //返回       
                var sCap = $(opts.relSubCaption);
                sCap.text(sCap.data('itemText') + '列表');
                $(this).closest('.section').hide();
                if (opts.relPagingTable) {
                    $(opts.relPagingTable).PagingTable('update');
                    $(opts.relPagingTable).closest('.section').show();
                }
                clearData();
                function clearData() {
                    $('#om_select jmnodes jmnode.selected').click();
                }
            });


            //机构内下发/取消下发
            hasFn('iio') || hasFn('iss')
                ? ipnlLeft.find('.btnIssue,btnUnissue').on('click', function () {
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
                : toggleFn(ipnlLeft.find('.btnIssue,btnUnissue'), false);

            //下发至下级机构
            hasFn('ioo')
                ? ipnlLeft.find('[act=ISS]').on('click', pubiss)
                : toggleFn(ipnlLeft.find('[act=ISS]'), false);

            //发布至下级机构
            hasFn('pub')
                ? ipnlLeft.find('[act=PUB]').on('click', pubiss)
                : toggleFn(ipnlLeft.find('[act=PUB]'), false);
            function pubiss() {
                var actText = $(this).find('i').text(),
                    orgs=$('#om_select').data('om').selected.map(function(item){
                        return item.id;
                    }),
                    pd = {
                        policy_id: $('#om_select').data('policy').policy_id,
                        action: $(this).attr('act'),
                        orgs: JSON.stringify(orgs),
                    }
                if (pd.orgs === '[]') {
                    warningOpen('请选择机构', 'danger', 'fa-bolt');
                } else {
                    $.actPost('/isspubSub', pd, function (data) {
                        switch (data.rt) {
                            case '0000':
                                break;
                            default:
                        }
                    }, actText);
                }
            }
        };
    },
    PagingTable: function ($, plug) { //分页表格组件
        function arrangeItem(opts, trItem) {  //用于根据成员选定状态更新mark记录
            var item = trItem.data('item'),
                inSel = $.indexOfArr(item, opts.sel),
                inUnsel = $.indexOfArr(item, opts.unsel),
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
        function unPagingSel(opts) {
            opts.sel = [];
            $('.tbHas tr').each(function () {
                if ($(this).find('input:checkbox').prop('checked')) {
                    opts.sel.push($(this).data('item'));
                }
            });
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
                    trHeader.find('th:first-child').empty().append(
                        $('<div class="checkbox"><label>'
                            + '<input type="checkbox"/>'
                            + '<span class="text">' + spantxt + '</span>'
                            + '</label></div>')
                    );
                }

                tbl.parent().css({
                    overflow:'auto',
                    paddingRight:'4px'
                })
                if(opts.maxHeight){
                    tbl.parent().css({
                        maxHeight:opts.maxHeight
                    })
                }
                
                //表格横向滚动支持
                if (opts.scrollable) {
                    tbl.parent().addClass('table-scrollable');
                    trHeader.find('th').attr('scope', 'col');
                }

                //过滤表头事件绑定
                trHeader.find('th.filter ul.dropdown-menu').on('click', function (e) {
                    e.stopPropagation();
                })
                trHeader.find('th.filter ul.dropdown-menu :input').on('change', function () {
                    tbl.data(plug).sel = [];
                    tbl.data(plug).unsel = [];
                    tbl[plug]('page', 1)
                })


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
                        if (opts.paging) {
                            if (opts.selectAll) {   //全选范围为分页表所有成员，包括还没有加载过来的
                                opts.check = $(this).prop('checked');
                                opts.sel = [];
                                opts.unsel = [];
                            } else { //全选范围为分页表格当前页
                                ckbsHas.each(function () {
                                    arrangeItem(opts, $(this).closest('tr'));
                                })
                            }
                        } else {
                            unPagingSel(opts);
                        }
                        console.info('PagingTable.sel:', opts.sel);
                        console.info('PagingTable.unsel:', opts.unsel);
                    })
                //选择成员
                ckbDemo.on('click', function () {
                    if (opts.paging) {
                        arrangeItem(opts, $(this).closest('tr'));
                    } else {
                        unPagingSel(opts);
                    }
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
                        if (opts.trDemoBinders[j].dom === "a[todo]") {
                            trDemo.find(opts.trDemoBinders[j].dom).each(function () {
                                if ($(this).attr('todo') === "edit") {
                                    toggleFn(this, hasFn('mod'));    //控制修改按钮权限
                                }
                                if ($(this).attr('todo') === "resetpw") {
                                    toggleFn(this, hasFn('rsp'));    //控制重置密码按钮权限
                                }
                            });
                        }
                        trDemo.find(opts.trDemoBinders[j].dom).on(opts.trDemoBinders[j].event, opts.trDemoBinders[j].fn);
                    }
                }

                this[plug]('refresh');
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
                    opts.jsonData['start_page'] = opts.start;
                    opts.jsonData['page_length'] = opts.pageLength;
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
                if (thHeader.find('th.filter').length > 0) {  //配置过滤参数
                    thHeader.find('th.filter').each(function () {
                        var ipts = $(this).find('ul.dropdown-menu :input[name]'),
                            filterKey = ipts[0].name;
                        if (filterKey) {
                            opts.jsonData[filterKey] = [];
                            ipts.each(function () {
                                if ($(this).prop('checked')) {
                                    opts.jsonData[filterKey].push($(this).attr('value'));
                                }
                            })
                            opts.jsonData[filterKey] = JSON.stringify(opts.jsonData[filterKey]);
                        }
                    })
                }
                $.silentAjax(opts.type, opts.url, opts.jsonData, function (data) {
                    tbl.closest('.section').removeClass('loading-mask');
                    tbLoading.hide();
                    if (data.rt == '0000' || data.rt == '9053') {
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
                            if ($.indexOfArr(list[i], opts.unsel) !== -1) {
                                triCheckBox.prop('checked', false);
                            }
                            if ($.indexOfArr(list[i], opts.sel) !== -1) {
                                triCheckBox.prop('checked', true);
                            }
                            tri.data('item', list[i]);
                            tri.find('[item-key]').each(function () {
                                $(this).toggleClass('ellipsis', this.tagName == "TD");
                                var key = $(this).attr('item-key'),
                                    val = opts.fnValByKey(key, valByKey(list[i], key));
                                $(this).text(val).attr('title', val);
                                //$(this).text(opts.fnValByKey(key, list[i][key]));
                            });
                            if(opts.afterAppend){
                                opts.afterAppend(tri, list[i]);
                            }
                        }

                        

                        if (opts.paging) {
                            tbHas.find('tr').each(function () {
                                arrangeItem(opts, $(this));
                            })
                        } else {
                            unPagingSel(opts);
                        }

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
                this.find('th.filter :input').each(function () {
                    $(this).prop('checked', true);
                })
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
            url: '/common/org/list',
            hasMask: false,
            start: 1,
            pageLength: 10,
            paging: true,
            scrollable: true,
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
                dom: 'a[todo]',
                event: 'click',
                fn: function () {
                    var opts = $(this).closest('table').data(plug),
                        item = $(this).closest('tr').data('item'),
                        tfrm = $(opts.relMultForm || '#multForm').data('item', item),
                        tCap = $(opts.relSubCaption);
                    switch ($(this).attr('todo')) {
                        case 'edit':
                            if (hasHdlAuth(item, '编辑', getItemType(item))) {
                                tCap.html('编辑' + tCap.data('itemText'));
                                opts.cbEdit(item);
                                $(this).closest('.section').hide();
                                tfrm.closest('.section').show();
                            } else {
                                return false;
                            };
                            break;
                        case 'view':
                            tCap.html('查看' + tCap.data('itemText'));
                            opts.cbView(item);
                            $(this).closest('.section').hide();
                            tfrm.closest('.section').show();
                            break;
                        case 'resetpw':
                            if (hasHdlAuth(item, '重置', getItemType(item))) {
                                tCap.html('重置' + tCap.data('itemText'));
                                opts.cbEdit(item);
                                resetpw(item);
                            } else {
                                return false;
                            };
                            break;
                        default:
                    }

                    function resetpw(item) {
                        if (item.status == 0) {
                            warningOpen('请先激活该用户！', 'danger', 'fa-bolt');
                        } else {
                            $.dialog('confirm', {
                                width: 500,
                                height: null,
                                autoSize: true,
                                maskClickHide: true,
                                title: "修改用户密码",
                                content: '<form id="frmModPW" class="form-horizontal form-bordered" role="form" method="post" style="margin-right:-40px;">\
                                            <input type="hidden" name="userId" />\
                                            <div class="form-group">\
                                                <label for="pw" class="col-sm-2 control-label no-padding-right">新密码</label>\
                                                <div class="col-sm-10">\
                                                    <input type="password" class="form-control require" id="pw" name="pw" ctrl-regex="password" placeholder="请输入新密码">\
                                                </div>\
                                            </div>\
                                            <div class="form-group">\
                                                <label for="confirmpw" class="col-sm-2 control-label no-padding-right">确认密码</label>\
                                                <div class="col-sm-10">\
                                                    <input type="password" class="form-control" id="confirmpw" same-with="pw" autocomplete="off" placeholder="请再次输入密码">\
                                                </div>\
                                            </div>\
                                            <div class="form-group">\
                                                <div class="col-sm-2  col-sm-offset-4">\
                                                    <button type="button" class="btnBack btn btn-default">返回</button>\
                                                </div>\
                                                <div class="col-sm-2 col-sm-offset-1">\
                                                    <input type="submit" class="btn btn-primary" disabled="">\
                                                </div>\
                                            </div>\
                                        </form>',
                                hasBtn: false,
                                hasClose: true,
                                hasMask: true,
                                confirmValue: '确认',
                                confirm: function () {
                                    frmModPW.submit();
                                },
                                confirmHide: false,
                                cancelValue: '取消'
                            });
                            $('#frmModPW').data('item', { userId: item.userId });
                            var frmModPW = $('#frmModPW').MultForm({
                                editBtnTxt: '确认',
                                editAct: item.hasOwnProperty('roleId')? '/common/admin/resetpw': '/common/user/resetpw',
                                afterUsed: function (use) {
                                    frmModPW.find('input[name=url]').remove();
                                },
                                cbSubmit: function (use) {
                                    $.dialogClose();
                                }
                            });
                            frmModPW.usedAs('edit');
                            $('#frmModPW').parent().css({
                                display: 'block'
                            })
                        }

                    }
                }
            }, {
                dom: '.numInfo',
                event: 'click',
                fn: function () {
                    $('#pjax-aim').addClass('loading-mask'); //添加请求期间的遮罩
                    var item = $(this).closest('tr').data('item'), //操作的成员基本信息
                        thisData = $(this).data(),
                        urlkey = $(this).data('url') + '-' + $(this).find('[item-key]').attr('item-key'),
                        opts = { //组件 ScrollList初始化需要的参数
                            title: '',
                            numInfoData: {},
                            elesTop: [],       //列表标题
                            elesDemo: [],     //列表样本成员（也是采用item-key定向显示文本）
                            widthProportion: [],  //列宽比
                            completed: fnCompleted
                        }
                    //根据item-key的值，调用不同的函数，显示需要的信息详情,通过修正ScrollList的配置参数opts，实现对相似数据的显示
                    switch (urlkey) {
                        case '/p/user/activeDevList-dev_num.android': //用户激活的安卓设备
                            opts = numUserDevActInfo(opts, 'android');
                            break;
                        case '/p/user/activeDevList-dev_num.ios'://用户激活的苹果设备
                            opts = numUserDevActInfo(opts, 'ios');
                            break;
                        case '/p/user/policyByUserId-policy_num'://作用于用户的策略信息
                            opts = numUserPolicyInfo(opts);
                            break;
                        case '/p/user/userTagList-tag'://用户标签详情
                            opts = numUserTagInfo(opts);
                            break;
                        case '/p/policy/userByPolId-used'://策略应用下发详情
                            opts = numPolicyUsedInfo(opts);
                            break;
                        case '/p/file/viewFileStatus-view'://文件查看详情
                            opts = numFileUsedInfo(opts, 'view');
                            break;
                        case '/p/file/viewFileStatus-download'://文件下载详情
                            opts = numFileUsedInfo(opts, 'download');
                            break;
                        case '/p/file/viewFileStatus-authorized'://文件授权详情
                            opts = numFileUsedInfo(opts, 'authorized');
                            break;
                        case '/p/app/devByUserId-issue'://策略应用下发详情
                            opts = numAppUsedInfo(opts, 'issue');
                            break;
                        case '/p/app/devByUserId-install_num'://策略应用下发详情
                            opts = numAppUsedInfo(opts, 'install_num');
                            break;
                        default:
                    }
                    var cont = $('<div>').ScrollList(opts);
                    function numUserDevActInfo(opts, itemKey) {  //策略下发及应用情况
                        opts.elesTop = ['序号', '设备名称', '类型', '状态', '版本'];
                        opts.elesDemo = [   //信息详情列表的样本成员
                            '<span class="counter"></span>',
                            '<span item-key="dev_name"></span>',
                            '<span item-key="dev_type"></span>',
                            '<span item-key="online"></span>',
                            '<span item-key="dev_system"></span>',
                        ];
                        opts.widthProportion = [0.5, 1, 1, 1, 1];  //信息详情列表各列宽比
                        switch (itemKey) {
                            case 'android':
                                opts.title = '已激活设备';
                                break;
                            case 'ios':
                                opts.title = '已激活设备';
                                break;
                            default:
                        }
                        opts.numInfoData = $.extend(true, {
                            userId: item.userId,
                        }, thisData);
                        opts.fnGetItems = function (data) {
                            if (data.rt === '0000') {
                                return data.doc;
                            }
                        };
                        opts.fnValByKey = function (k, v) {  //用于根据键值对修正要显示文本
                            switch (k) {
                                case 'dev_type':
                                    v = v == 'phone' ? 'iOS' : 'Android';
                                    break;
                                case 'online':
                                    v = v == 1 ? '在线' : '离线';
                                    break;
                                default:
                            }
                            return v;
                        }
                        return opts;
                    }
                    function numUserPolicyInfo(opts) {  //策略下发及应用情况
                        opts.elesTop = ['序号', '策略名称', '类型', '创建者', '状态', '操作'];
                        opts.elesDemo = [   //信息详情列表的样本成员
                            '<span class="counter"></span>',
                            '<span item-key="name"></span>',
                            '<span item-key="policy_type"></span>',
                            '<span item-key="creator"></span>',
                            '<span item-key="status"></span>',
                            '<span class="btn btn-primary btn-sm ' + (hasFn('rmp') ? 'btnUnbind' : 'disabled') + '">移除策略</span>'
                        ];
                        opts.widthProportion = [0.5, 1, 1, 1, 1, 1];  //信息详情列表各列宽比
                        opts.title = '用户“' + item.name + '”应用策略';
                        opts.numInfoData = $.extend(true, {
                            userId: item.userId
                        }, thisData);
                        opts.fnValByKey = function (k, v) {  //用于根据键值对修正要显示文本
                            switch (k) {
                                case 'policy_type':
                                    v = $.textPolicy(v).type;
                                    break;
                                default:
                            }
                            return v;
                        };
                        opts.fnGetItems = function (data) {
                            if (data.rt === '0000') {
                                return data.doc;
                            }
                        };
                        opts['beforeShow'] = function (list) {
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].name === "默认策略") {
                                    list.unshift(list.splice(i, 1)[0])  //将默认策略移至前面
                                }
                            }
                        };
                        opts['listOnLoad'] = function (item, uli) {
                            if (item.name === "默认策略") {
                                uli.find('span.btnUnbind').each(function () {
                                    $(this).off().removeClass('btnUnbind').addClass('disabled');
                                });
                            }
                        }
                        return opts;
                    }
                    function numUserTagInfo(opts) {  //标签详情
                        opts.elesTop = ['序号', '标签名', '状态', '类型', '描述'];
                        opts.elesDemo = [   //信息详情列表的样本成员
                            '<span class="counter"></span>',
                            '<span item-key="name"></span>',
                            '<span item-key="status"></span>',
                            '<span item-key="tag_type"></span>',
                            '<span item-key="description"></span>'
                        ];
                        opts.widthProportion = [0.5, 1, 1, 1, 1.5];  //信息详情列表各列宽比
                        opts.title = '用户“' + item.name + '”所有标签';
                        opts.numInfoData = $.extend(true, {
                            userId: item.userId
                        }, thisData);
                        opts.fnGetItems = function (data) {
                            if (data.rt === '0000') {
                                return data.doc;
                            }
                        };
                        opts.fnValByKey = function (k, v) {  //用于根据键值对修正要显示文本
                            switch (k) {
                                case 'status':
                                    v = v == '1' ? '正常' : '禁用';
                                    break;
                                case 'tag_type':
                                    v = v == '0' ? '静态标签' : '动态标签';
                                    break;
                                case 'description':
                                    v = v == '' ? '暂无说明' : v;
                                    break;
                                default:
                            }
                            return v;
                        }
                        return opts;
                    }
                    function numPolicyUsedInfo(opts) {  //策略下发及应用情况
                        opts.title = '策略"' + item.name + '"下发及应用详情';  //列表表名文本
                        opts.numInfoData = $.extend(true, {
                            id: item.id,
                            policy_type: item.policy_type
                        }, thisData);
                        opts.elesTop = ['序号', '姓名', '账号', '状态', '操作'];
                        opts.elesDemo = [   //信息详情列表的样本成员
                            '<span class="counter"></span>',
                            '<span item-key="name"></span>',
                            '<span item-key="account"></span>',
                            '<span item-key="status"></span>',
                            '<span class="btn btn-primary btn-sm ' + (hasFn('rmp') ? 'btnUnbind' : 'disabled') + '">移除策略</span>'
                        ];
                        opts.widthProportion = [0.5, 1, 1, 1, 1];  //信息详情列表各列宽比
                        return opts;
                    }
                    function numFileUsedInfo(opts, itemKey) {  //文件下发及应用情况
                        opts.elesTop = ['序号', '姓名', '账号', '状态'];
                        opts.elesDemo = [   //信息详情列表的样本成员
                            '<span class="counter"></span>',
                            '<span item-key="name"></span>',
                            '<span item-key="account"></span>',
                        ];
                        switch (itemKey) {
                            case 'view':
                                opts.title = '已查看文件"' + item.filename + '"的用户';
                                opts.elesDemo.push('<span>已查看</span>');
                                break;
                            case 'download':
                                opts.title = '已下载文件"' + item.filename + '"的用户';
                                opts.elesDemo.push('<span>已下载</span>');
                                break;
                            case 'authorized':
                                opts.title = '已下发文件"' + item.filename + '"的用户';
                                opts.elesDemo.push('<span>已下发</span>');
                                break;
                            default:
                        }
                        opts.numInfoData = $.extend(true, {
                            id: item.id
                        }, thisData);
                        opts.widthProportion = [0.5, 1, 1, 1];
                        return opts;
                    }
                    function numAppUsedInfo(opts, itemkey) {  //应用授权及安装情况
                        opts.elesTop = ['序号', '姓名', '账号', '状态'];
                        opts.elesDemo = [   //信息详情列表的样本成员
                            '<span class="counter"></span>',
                            '<span item-key="name"></span>',
                            '<span item-key="account"></span>',
                        ];
                        switch (itemKey) {
                            case 'issue':
                                opts.title = '应用"' + item.app_name + '"授权用户';
                                opts.elesDemo.push('<span>已授权</span>');
                                break;
                            case 'install_num':
                                opts.title = '已安装应用"' + item.app_name + '"的用户';
                                opts.elesDemo.push('<span>已安装</span>');
                                break;
                            default:
                        }
                        numInfoData = $.extend(true, {
                            identify: item.identify
                        }, thisData);
                        opts.widthProportion = [0.5, 1, 1, 1];
                        return opts;
                    }
                    function fnCompleted(data) {  //收到响应后的处理
                        switch (data.rt) {
                            case '0000':
                                $.dialog('list', {
                                    title: opts.title,
                                    content: cont
                                });
                                break;
                            default:
                        }
                        $('#pjax-aim').removeClass('loading-mask'); //请求完毕，移除遮罩
                    }
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
            addAct: '/common/org_add', //添加表单action
            addBtnTxt: '添加',  //添加表单提交按钮显示文本
            addInfoTxt: '添加',  //添加提交成功或失败反馈的信息中的.act
            editAct: '/common/mod', //编辑表单action
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
                $(frm[0]).data('use', use);
                frm.beforeUsed(use, frm.data('item'));
                var btnSubmit = $(frm[0]).find(':input[type=submit]'),
                    frmGrp = $(frm[0]).find('.form-group');
                frm.reset();
                frm.afterReset();
                if ($(frm[0]).find('input:hidden[name=url]').length === 0) {
                    $(frm[0]).prepend('<input type="hidden" name="url" />')
                }
                switch (use) {
                    case 'add':
                        $(frm[0]).attr('action', frm.addAct);
                        $(frm[0]).data('url', frm.addUrl).find('input:hidden[name=url]').val(frm.addUrl);
                        $(frm[0]).data('infoTxt', frm.addInfoTxt);
                        $(frm[0]).find('input:checkbox').prop('disabled', false);
                        btnSubmit.show().text(frm.addBtnTxt).val(frm.addBtnTxt).prop('disabled', true);
                        break;
                    case 'edit':
                        frm.showItem();
                        $(frm[0]).attr('action', frm.editAct);
                        $(frm[0]).data('url', frm.editUrl).find('input:hidden[name=url]').val(frm.editUrl);
                        $(frm[0]).data('infoTxt', frm.editInfoTxt);
                        $(frm[0]).find('input:checkbox').prop('disabled', false);
                        btnSubmit.show().text(frm.editBtnTxt).val(frm.editBtnTxt).prop('disabled', false);
                        break;
                    case 'view':
                        frm.showItem();
                        frm.removeAttr('action');
                        $(frm[0]).find(':input[name]').prop('disabled', true);
                        $(frm[0]).find('input:checkbox').prop('disabled', true);
                        $(frm[0]).find('input:radio:checked').prop('disabled', false);
                        $(frm[0]).find('.append-box').addClass('disabled');
                        btnSubmit.hide();
                        break;
                    default:
                        $(frm[0]).attr('action', optAdd.action);
                        btnSubmit.show().text(optAdd.submitText).val(optAdd.submitText);
                }
                iptChange();
                frm.afterUsed(use, frm.data('item'));
                frm.check();
                setTimeout(function () {
                    frm.find('button:not([type])').attr('type', 'button');
                }, 300);
                function iptChange() {
                    $(frm[0]).find(':input[name]').each(function () {
                        try {
                            $(this).change();
                        } catch (err) {
                            console.error(err);
                        }
                    })
                }
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
                $(frm[0]).find(':input[name]').each(function () {
                    $(this).prop('disabled', false);
                });
                $(frm[0]).find('.append-box').each(function () {
                    $(this).removeClass('disabled').plugInit();
                });
            },
            check: function () {
                $(frm[0]).find('input[type=submit]').prop('disabled', $(frm[0]).find('.form-group:visible .danger').length !== 0);
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
                        case 'input:hidden':
                            if (typeof v === 'object') {
                                $(this).val(JSON.stringify(v));
                            } else {
                                $(this).val(v);
                            }
                            $(this).data('value', v);
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
            preventAutoSubmit();    //屏蔽回车提交
            prepareMarkers();       //准备输入form-group数据校验结果标志 <b>*</b>
            saveFnsForShare();      //保存组件函数至页面元素form，以便共享
            ajaxFormInit();         //表单ajax初始化
            bindFormBaseHandles();  //绑定表单基础事件处理函数， 返回按钮和提交事件
            bindIptHandles();       //绑定输入款
            function preventAutoSubmit() {
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
            }
            function prepareMarkers() {
                $(frm[0]).find('.form-group:has(:input.require,:input.same,:input[same-with])').each(function () {  //准备必填项的标识符<b></b>
                    if ($(this).find('label:first-child>b').length == 0) {
                        $(this).find('label:first-child').prepend($('<b>*</b>'));
                    }
                });
            };
            function saveFnsForShare() {
                $(frm[0]).data('fns', { check: frm.check });
            };
            function ajaxFormInit() {
                var pgrBar = $(frm[0]).find('.progress .progress-bar'),     //pgrBar.css("width":"30%");
                    pgrSro = pgrBar.find('.progress .progress-bar .sr-only'),    //pgrSro.text("30%");
                    ajaxFormOptions = {
                        beforeSerialize: function (jqForm, ajaxOptions) {
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
                                if (frm.beforeSerialize) {
                                    frm.beforeSerialize(jqForm, ajaxOptions);
                                }
                            });
                        },
                        beforeSubmit: function (arrKeyVal, $frm, ajaxOptions) {
                            for (var i = 0; i < arrKeyVal.length; i++) {
                                if (delKeyVal(arrKeyVal[i].name)) {
                                    arrKeyVal.splice(i, 1);
                                    i--;
                                }
                            }
                            function delKeyVal(key) {  //删掉不需要提交的数据
                                switch (key) {
                                    case 'id':
                                        return $frm.data('use') === 'add';  //添加的时候不传id值
                                    default:
                                }
                            }
                            if (frm.beforeSubmit) {
                                frm.beforeSubmit(arrKeyVal, $frm, ajaxOptions);
                            }
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

                            $.handleECode(true, data, $(frm[0]).data('infoTxt'));
                            switch (data.rt) {
                                case '0000':
                                    frm.reset();
                                    switch ($(frm[0]).attr('action')) {
                                        case frm.addAct:
                                            if (frm.cbSubmit) {
                                                frm.cbSubmit('add');
                                            }
                                            break;
                                        case frm.editAct:
                                            if (frm.cbSubmit) {
                                                frm.cbSubmit('edit');
                                            }
                                            break;
                                        default:
                                    }
                                    break;
                                default:
                                    console.warn("data.rt=" + data.rt)
                            }

                        }
                    };
                $(frm[0]).ajaxForm(ajaxFormOptions);
            }
            function bindFormBaseHandles() {
                $(frm[0]).find('.btnBack').on('click', function () {
                    var tCap = $(frm.relSubCaption);
                    tCap.html(tCap.data('itemText') + '列表');
                    if ($(this).closest('.dialog-box-content').length === 1) {
                        $.dialogClose();
                    } else {
                        frm.closest('.section').hide();
                        if (frm.targetTable) {
                            $(frm.targetTable).PagingTable('update');
                            $(frm.targetTable).closest('.section').show();
                        }
                    }
                })
            }
            function bindIptHandles() {
                $(frm[0]).find('.form-group :input').on('change input', function (e) {
                    var ipt = $(this).removeClass('danger'),
                        bmark = ipt.closest('.form-group').find('.control-label>b').removeClass('danger');

                    function addDanger() {  //不合法时添加标志
                        ipt.addClass('danger');
                        setTimeout(function () {
                            bmark.addClass('danger');
                        }, 0);
                    }
                    if ($(this).attr('type') == 'number') {   //数字输入框校验
                        var ipt = ($(this).val()).replace(/[^0-9]/g, ""),
                            min,
                            max;
                        if (ipt) {
                            ipt = parseInt(ipt);
                            if ($(this).attr('min')) {
                                min = parseInt($(this).attr('min'));
                                ipt = ipt > min ? ipt : min;
                            }
                            if ($(this).attr('max')) {
                                max = parseInt($(this).attr('max'));
                                ipt = ipt < max ? ipt : max;
                            }
                        } else {
                            if ($(this).attr('min')) {
                                ipt = parseInt($(this).attr('min'));
                            } else {
                                ipt = 0;
                            }
                        }
                        $(this).val(ipt);
                    }

                    if ($(this).hasClass('require')) {    //必填项检查
                        if (
                            $(this).val() === ''
                            || $(this).val() === '[]'
                            || $(this).val() === null
                            || $(this).val() === undefined
                        ) {
                            addDanger();
                        }
                    }

                    if ($(this).attr('ctrl-regex')) {     //正则检查
                        if ($(this).val() && !$.iptRegExpCtrl(this)) {
                            addDanger();
                        }
                    }

                    if ($(this).closest('.append-box').length === 1) {  //append-box组件中的input
                        if ($(this).closest('.append-box').find('.item :input.danger').length > 0) {
                            addDanger()
                        }
                    }

                })
                var iptSame = $(frm[0]).find('.form-group :input[same-with]'),
                    iptWith = $(frm[0]).find('#' + iptSame.attr('same-with'));
                iptSame.on('change input', function (e) {
                    if (iptWith.closest('.form-group').find('.danger').length > 0) {
                        $(this).addClass('danger')
                            .closest('.form-group').find('label>b').addClass('danger');
                    } else {
                        $(this).toggleClass('danger', $(this).val() !== iptWith.val())
                            .closest('.form-group').find('label>b').toggleClass('danger', $(this).val() !== iptWith.val());
                    }
                });
                iptWith.on('change input', function (e) {
                    iptSame.change();
                });

                $(frm[0]).on('change input', function () {  //.form-group单元校验之后的整体校验
                    frm.check();  //检验所有标记markers（<b>*</b>），判断是否所有数据都合法
                });
            }
            return frm;
        };
        return function (opts) {
            var dom = opts.dom;
            $(dom)[plug].call($(dom), opts); //执行插件功能函数，将this指向$(dom)这个代理对象，并传入参数。
            this.usedAs = frm.usedAs;
            this.reset = frm.reset;
        }
    },
    XTree: function ($, plug) {     //分布请求的树形组件，可以自定义数据源、唯一标识、关联表格等   本项目主要用于创建用户组树形
        function appendTreeItem(opts, aim, item) {   //向目标容器添加树的子节点
            var gid = item.gid,
                gident = item.gident,
                gtxt = item.text,
                gchecked = ~~item.checked,
                ghc = ~~item.hasChild,
                li = opts.multiple
                    ? $('<li gident="' + gident + '" data-gid="' + gid + '"><input type="checkbox"/><span class="pointer">' + gtxt + '</span><i class="tIcon fa fa-plus"></i></li>')
                    : $('<li gident="' + gident + '" data-gid="' + gid + '"><label class="pointer"><input type="radio" name="xtreeitem"/>' + gtxt + '</label><i class="tIcon fa fa-plus"></i></li>');

            if (ghc) {
                li.find('.tIcon').on('click', function () {
                    $(this).toggleClass('fa-plus').toggleClass('fa-minus');
                    li.toggleClass('open');
                });
            } else {
                li.find('.tIcon').remove();
            }

            if (opts.relPTable) {
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
                    if (gident == 0) {
                        $(opts.relPTable).data('PagingTable').jsonData = {
                            'url': '/p/user/manage'
                        };
                    } else {
                        $(opts.relPTable).data('PagingTable').jsonData = {
                            'url': '/p/depart/members'
                        };
                        $(opts.relPTable).data('PagingTable').jsonData[opts.keyItemIdentify] = gident;
                    }
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
            }

            if (gtxt !== '未分组') {
                aim.append(li);
                if(item.status != 0){
                    //判断成员是否有子节点
                    if (ghc) {  //如果有则预加载一级
                        li.on('preload', function () {
                            var ckb = $(this).find('input:checkbox');
                            var ul = $('<ul>');
                            var pd = {
                                url: '/p/depart/manage'
                            };
                            pd[opts.keyItemIdentify] = gident;
                            $.silentGet('/common/org/list', pd, function (data) {
                                if (data.rt == '0000') {
                                    var items = opts.fnGetTreeItems(data);
                                    li.data('items', items);
                                    for (var i = 0; i < items.length; i++) {
                                        appendTreeItem(opts, ul, {
                                            gid: items[i][opts.keyItemId],
                                            gident: items[i][opts.keyItemIdentify],
                                            text: items[i][opts.keyItemText],
                                            checked: ckb.prop('checked'),
                                            hasChild: items[i][opts.keyItemHasChild],
                                            status: items[i].status
                                        })
                                    }
                                    li.after(ul);
                                }
                            })
                        });
                        li.trigger('preload');
                        if (opts.hasRoot) {
                            if (opts.initOpen && gid == 0) {
                                li.find('.tIcon').click().addClass('hidden');
                            }
                        } else {
                            if (gid == 0) {
                                li.hide().addClass('hidden').find('.tIcon').click();
                            }
                        }
                    } else {
                        li.find('.tIcon').remove();
                    }
                }else{
                    li.addClass('disabled').find('input').remove();
                }  
            }
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
                    gident: 0,
                    text: opts.rootText,
                    checked: 0,
                    hasChild: 1,
                    status: 1
                })
                if (opts.relPTable) {
                    $(opts.relPTable).PagingTable({
                        jsonData: { 'url': '/p/user/manage' },
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
                                            <td><span item-key="depart.name"></span></td>\
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
                }
                tre.find('li[data-gid=0]').addClass('active');
                return tre;
            },
            getRules: function () {  //获取用户选择信息
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
            renderSelect: function (sel) {
                var key, val;
                if (typeof sel === "object") {
                    for (k in sel) {
                        key = k;
                        val = sel[k]
                    }
                } else {

                }


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
                console.warn('XTree组件没有方法' + fn);
            }
        };
        $.fn[plug]['__def__'] = {     //插件默认属性
            rootUrl: '/p/org/userList', //树形根节点获取全部用户接口
            hasRoot: 1,  //1表示设立一个根节点，0或false表示无根节点
            rootText: '所有用户组',  //根节点文本
            relPTable: '#tblForUserGroupTree',  //连动的表格（PagingTable组件）
            multiple: true,   //控制XTree是否支持多选，true则猜用复选框，false则采用单选框
            tableListKey: 'user_list',
            relSubCaption: "#subCaption", //关联的显示标题选择器
            keyItemId: 'id',  //成员唯一标识  用户构建下发数据
            keyItemIdentify: 'departId',  //树形构建请求参数标识
            keyItemText: 'name',  //文本标识
            keyItemHasChild: 'child_node',   //成员是否有子节点标识
            initOpen: 1,  //默认是否展开一级成员
            initChecked: 0,  //默认是否全选
            fnGetTreeItems: function (data) {
                return data.depart_list;
            }
        };
    },
    XList: function ($, plug) {     //列表组件，可以自定义数据源、关联表格等   本项目主要用于创建用户标签列表
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
                var ol = $('<ol class="dd-list"></ol>');
                lst.addClass('xlist dd shadowed').empty().append(ol);
                $.silentGet(opts.url, opts.getData, function (data) {
                    if (data.rt == '0000') {
                        var items = opts.fnGetListItems(data);
                        lst.data('items', items);
                        if (items.length === 0) {
                            ol.html('<li>暂无标签</li>')
                        } else {
                            for (var i = 0; i < items.length; i++) {
                                appendListItem(opts, ol, {
                                    tid: items[i][opts.keyItemId],
                                    tident: items[i][opts.keyItemIdentify],
                                    tname: items[i].name,
                                    tstatus: items[i].status
                                })
                            }
                            ol.find('li:has(input):first span').click();
                        }
                    }

                })
                function appendListItem(opts, aim, item) {   //向目标容器添加树的子节点
                    var tid = item.tid,
                        tident = item.tident;
                    txt = item.tname;
                    var li = opts.multiple
                        ? $('<li class="dd-item" tident="' + tident + '" data-tid="' + tid + '"><div><label class="pointer"><input type="checkbox"/>' + txt + '</label></div></li>')
                        : $('<li class="dd-item" tident="' + tident + '" data-tid="' + tid + '"><div><label class="pointer"><input type="radio" name="tid" value="' + tid + '"/>' + txt + '</label></div></li>');
                    if (item.tstatus != 0) {
                        if (opts.relPTable) {
                            li = $('<li class="dd-item" data-tid="' + tid + '"><div><input type="checkbox"/><span class="pointer">' + txt + '</span></div></li>');
                            li.data({//与组id一一对应
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
                            li.find('input:checkbox').on('change input propertychange', function (e) {  //监控勾选操作
                                e.stopPropagation();
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
                            li.find('span').on('click', function (e) {
                                e.stopPropagation();
                                if (!li.hasClass('active')) {
                                    li.closest('.xlist').find('li.active').removeClass('active');
                                    li.addClass('active');
                                }
                                var JD = {
                                    url: '/p/depart/members'
                                };
                                JD[opts.keyItemIdentify] = tident;
                                if ($(opts.relPTable).hasClass('pagingTable')) {
                                    $.extend(
                                        $(opts.relPTable).data('PagingTable'),
                                        {
                                            check: li.data('check'),
                                            sel: li.data('sel'),
                                            unsel: li.data('unsel'),
                                            jsonData: JD
                                        }
                                    )
                                    $(opts.relPTable).PagingTable('page', 1);
                                } else {
                                    $(opts.relPTable).PagingTable({
                                        jsonData: JD,
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
                        }
                    }else{
                        li.addClass('disabled').find('input').remove();
                    }
                    aim.append(li);
                };
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
                console.warn('XList组件没有方法' + fn);
            }
        };
        $.fn[plug]['__def__'] = {     //插件默认属性
            relPTable: '#tblForUserTagList',
            url: '/common/org/list',
            keyItemId: 'id',  //成员唯一标识  用户构建下发数据
            keyItemIdentify: 'tagId',  //关联表格请求参数标识
            multiple: true,
            getData: {
                url: '/p/tag/manage',
                start_page: 1,
                page_length: 10000
            },
            fnGetListItems: function (data) {
                return data.tag_list;
            }
        };
    },
    ScrollList: function ($, plug) { //滚动列表组件，主要用于低复杂度弱交互列表信息显示
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
                    var ul = $(this).closest('ul'),
                        item = ul.data('item'),
                        pd = {
                            userId: '',
                            policy_id: '',
                            policy_type: ''
                        }
                    if (opts.numInfoData['userId']) {
                        pd.userId = opts.numInfoData['userId'];
                        pd.policy_id = item.id;
                        pd.policy_type = item.policy_type;
                    } else {
                        pd.userId = item.userId;
                        pd.policy_id = opts.numInfoData['id'];
                        pd.policy_type = opts.numInfoData['policy_type'];
                    }
                    $.actPost('/policy/unbind', pd, function (data) {
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
                    .append($('<dl>').append(dtTop, ddHas, ddDemo, ddLoading, ddEmpty));
                this.css({
                    width: opts.width
                }).find('dl').css({
                    overflowY: 'auto',
                    height: opts.height
                });

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
                    $.nullGet(opts.commonUrl, opts.numInfoData, function (data) {
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
                        if (opts.beforeShow) {
                            opts.beforeShow(list);
                        }
                        for (var i = 0; i < list.length; i++) {
                            var uli = ulDemo.clone(true);
                            uli.data('item', list[i]);
                            uli.find('.counter').text(i + 1);
                            uli.find('[item-key]').each(function () {
                                var k = $(this).attr('item-key'),
                                    v = opts.fnValByKey(k, valByKey(list[i], k));
                                $(this).html(v);
                                if (typeof v == 'string' && v.length > 15) {
                                    $(this).closest('li').attr('title', $(this).text()).css({
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    })
                                }
                            });
                            ddHas.append(uli);
                            if (opts.listOnLoad) {
                                opts.listOnLoad(list[i], uli);
                            }
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
                console.warn('ScrollList组件没有方法' + fn);
            }
        };
        $.fn[plug]['__def__'] = {     //插件默认属性
            type: 'GET',
            inputList: false,
            commonUrl: '/common/item/info',
            numInfoData: {
                url: '/p/policy/userByPolId'
            },
            totalCount: 0,
            //必需  表头
            elesTop: ['序号', '姓名', '账号', '状态', '操作'],
            elesDemo: [
                '<span class="counter"></span>',
                '<span item-key="name"></span>',
                '<span item-key="account"></span>',
                '<span item-key="status"></span>',
                '<span class="btn btn-primary btn-sm ' + (hasFn('rmp') ? 'btnUnbind' : 'disabled') + '">移除策略</span>'
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
            fnGetItems: function (data) {  //必需   需要显示的成员
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
            listOnLoad: function (item, uli) {

            },
            beforeShow: function (list) {

            },
            completed: function (data) {

            }
        };
    }
})