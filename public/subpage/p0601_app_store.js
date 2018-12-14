/*
 * ==================================================================
 *                          应用管理 app
 * ==================================================================
 */


var oSubPage = {//定义全局对象，用于结构化数据
    fnActPart: function () {
        $('.part').addClass('hidden');
        for (i in arguments) {
            $('.part' + arguments[i]).removeClass('hidden');
        }
    },
    fnInit: function () {
        this.partTable.fnInit();
    },
    timer: null,//用于存储搜索框延迟搜索计时
    partTable: {//默认数据表格控制
        setting: {
            sListUrl: '',  //string-ajax请求默认表格数据列表的后端接口
            sDelUrl: '',   //string 删除列表元素的接口
            sMoreUrl: '',
            fnDealKeyVal: function (k, v) {//重写显示前数值处理函数
                switch (k) {
                    case "version":
                        v = v ? v : "————";
                        break;
                    case "platform":
                        switch (v) {
                            case "ios":
                                v = "iOS";
                                break;
                            case "android":
                                v = "Android";
                                break;
                            default:
                                v = "Web";
                        }
                        break;
                    case "visit_type":
                        v = (v == 1) ? '公开应用' : '授权应用';
                        break;
                    case "install_num":
                    case "issued":
                        v = v ? v : '--';
                        break;
                    default:
                }
                return v;
            },
            fnMoreAhead: function (ele, mdl) {
                mdl.find('span[key=app_name]').text($(ele).parents('tr').find('[viewkey=name]').text());
            }
        },
        fnMoreUrl: function (ele) {
            var url = '/man/more?sMoreUrl=' + this.setting.sMoreUrl,
                identify = $(ele).parents('tr').data(oSubPage.partTable.sItemIdentify),
                id = $(ele).parents('tr').data(oSubPage.partTable.sItemId);
            if (identify) {
                return url + ('&identify=' + encodeURIComponent(identify));
            } else {
                return url + ('&id=' + id);
            }
        },
        sPartSelector: '.partTable',
        oAjaxData: {}, //json-存储返回的数据
        aItems: [],
        nStart: 1,  //number 默认起始页
        nCurrentpage: 1,  //number 当前显示页
        nLength: 10,  //number 每页长度
        nInitLength: 10,  //number (1,5,10,20)每页默认长度
        nTotalCount: 0, //number 结果总条数
        sPlatform: 'all',//strinng  （all,android,ios）存储设备显示平台
        sInitPlatform: 'all',//strinng  （all,android,ios）设备显示默认平台
        sSearchKey: '',   //string 表格搜索关键字
        sItemId: 'data-id',
        sItemIdentify: 'data-identify',
        sRowId: 'row-id',
        sViewkey: 'viewkey',//string 显示数据元素上用于存储显示数据关键字段的自定义属性
        selected: {
            aItemIds: [],//array（整型数组） 存储选中的表格成员对应的数据id
            aItemIdents: [],//array（字符串数组） 存储选中的表格成员对应的数据id
            aItemTypeIds: [], //array(字符串数组)  存储应用访问类型与id组合标志
        },
        publicEles: {
            btnUpload: {
                dom: null,
                selector: '#btnUpload',
                events: [{
                    type: 'click',
                    fn: function () {
                        oSubPage.partForm.oItem = null;
                        oSubPage.partForm.fnInit('upload');
                    }
                }]
            },
            btnAdd: {
                dom: null,
                selector: '#btnAdd',
                events: [{
                    type: 'click',
                    fn: function () {
                        oSubPage.partForm.oItem = null;
                        oSubPage.partForm.fnInit('add');
                    }
                }]
            },
            btnDelete: {
                dom: null,
                selector: '#btnDelete',
                events: [{
                    type: 'click',
                    fn: function () {
                        if (oSubPage.partTable.selected.aItemIds.length != 0) {
                            var mdl = $('#modalDel');
                            mdl.modal({ backdrop: false });
                            mdl.find('button.btnOK').unbind().bind('click', function () {
                                oSubPage.partTable.fnDelItem();
                            });
                        } else {
                            warningOpen('请选择要删除的应用！', 'danger', 'fa-bolt');
                        }
                    }
                }]
            },
            btnUpdate: {
                dom: null,
                selector: '#btnUpdate',
                events: [{
                    type: 'click',
                    fn: function () {
                        if (oSubPage.partTable.selected.aItemIdents.length === 1) {
                            var item = $('tr:has(input:checkbox:checked)').data('item');
                            var mdl = $('#modalUpdate');
                            mdl.modal({ backdrop: false });
                            mdl.find('input[type=file]').unbind('change input propertychange')
                                .bind('change input propertychange', function () {
                                    var file = this.files[0],
                                        pf = item.platform,
                                        eleFn = $(this).nextAll('p.file-name'),
                                        eleFh = $(this).nextAll('p.file-help'),
                                        lab = $(this).parents('.form-group').find('label b'),
                                        ft, fn, ex, fs;
                                    var maxSize = 300;
                                    if (file) {
                                        fn = file.name;
                                        ex = fn.substr(fn.lastIndexOf('.'));
                                        fs = file.size;
                                        if (pf == "android") {
                                            if ((ex == ".apk" || ex == ".APK") && fs <= maxSize * 1024 * 1024) {
                                                checkRes(true);
                                            } else {
                                                fs > maxSize * 1024 * 1024
                                                    ? warningOpen('文件大小不得超过' + maxSize + "MB", 'danger', 'fa-bolt')
                                                    : warningOpen('请选择.apk文件', 'danger', 'fa-bolt');
                                                checkRes(false);
                                            }

                                        } else {

                                            if ((ex == ".ipa" || ex == ".IPA") && fs <= maxSize * 1024 * 1024) {
                                                checkRes(true);
                                            } else {
                                                fs > maxSize * 1024 * 1024
                                                    ? warningOpen('文件大小不得超过' + maxSize + "MB", 'danger', 'fa-bolt')
                                                    : warningOpen('请选择.ipa文件', 'danger', 'fa-bolt');
                                                checkRes(false);
                                            }
                                        }


                                    } else {
                                        checkRes(false)
                                    }
                                    oSubPage.partForm.fnCheckAll();
                                    function checkRes(bool) {
                                        eleFn.text(fn).toggleClass('hidden', !bool);
                                        eleFh.toggleClass('hidden', bool);
                                        lab.toggleClass('danger', !bool);
                                        mdl.find('button[type=submit]').prop('disabled', !bool)
                                    }

                                });

                            mdl.find('#updateForm').unbind().bind('submit', function () {
                                var frm = $(this),
                                    action = frm.attr('action'),
                                    ipts = frm.find(':input[name][type!=hidden]'),
                                    iptFile = frm.find('input[name=file_data]'),
                                    btnSmt = frm.find('button[type=submit]'),
                                    btnBack = frm.find('button[data-dismiss=modal]'),
                                    pgrBar = frm.find('.uploadFile+.progress .progress-bar');

                                frm.find('input[name=identify]').val(oSubPage.partTable.selected.aItemIdents[0]);
                                frm.ajaxSubmit({
                                    beforeSubmit: function () {
                                        ipts.prop('disabled', true);
                                        btnSmt.prop('disabled', true);
                                        btnBack.prop('disabled', true);
                                        pgrBar.css('width', '0');
                                    },
                                    uploadProgress: function (event) {
                                        if (event.lengthComputable) {
                                            var cplt = Number.parseInt(event.loaded / event.total * 100) + "%";
                                            pgrBar.css('width', cplt);
                                        }
                                    },
                                    success: function (data) {
                                        iptFile.nextAll('p.file-name').text('').addClass('hidden');
                                        iptFile.nextAll('p.file-help').removeClass('hidden');
                                        iptFile.parents('.form-group').find('label b').addClass('danger');
                                        frm[0].reset();
                                        ipts.prop('disabled', false);
                                        btnSmt.prop('disabled', true);
                                        btnBack.prop('disabled', false);
                                        btnBack.click();
                                        ipts.iptsReset();


                                        pgrBar.css('width', '0');
                                        switch (data.rt) {
                                            case '0000':
                                                oSubPage.partTable.fnRefresh();
                                                warningOpen('应用更新成功！', 'primary', 'fa-check');
                                                break;
                                            default:
                                                console.warn("data.rt=" + data.rt)
                                                warningOpen('应用更新失败！', 'danger', 'fa-bolt');
                                        }
                                        oSubPage.partForm.fnCheckAll();
                                    }
                                });
                                return false;
                            });
                        } else {
                            warningOpen('请选择一个需要更新的应用！', 'danger', 'fa-bolt');
                        }
                    }
                }]
            },
            btnModify: {
                dom: null,
                selector: '#tbDemo .btnModify',
                events: [{
                    type: 'click',
                    fn: function () {
                        var i = $(this).parents('tr').data(oSubPage.partTable.sRowId);
                        oSubPage.partForm.oItem = oSubPage.partTable.aItems[i];
                        oSubPage.partForm.fnInit('modify');
                    }
                }]
            },
            btnView: {
                dom: null,
                selector: '#tbDemo .btnView',
                events: [{
                    type: 'click',
                    fn: function () {
                        var tbl = oSubPage.partTable,
                            frm = oSubPage.partForm,
                            i = $(this).parents('tr').data(tbl.sRowId);
                        frm.oItem = tbl.aItems[i];
                        frm.fnInit('view');
                    }
                }]
            },
            btnVersion: {
                dom: null,
                selector: '#tbDemo .btnVersion',
                events: [{
                    type: 'click',
                    fn: function () {
                        var item = $(this).closest('tr').data('item'),
                            listurl = '/p/app/listAppHistory',
                            title = '应用"' + item.app_name + '"历史版本',
                            elesTop = ['序号', '名称', '版本', '上传时间', '上传者', '操作'],
                            elesDemo = [
                                '<span class="counter"></span>',
                                '<span item-key="app_name"></span>',
                                '<span item-key="version"></span>',
                                '<span item-key="created"></span>',
                                '<span item-key="operator"></span>',
                                '<span class="btn btn-danger btn-xs btnDelVersion">删除</span>'
                            ],
                            widthProportion = [0.6, 1, 1, 1, 1, 1],
                            fnGetItems = function (data) {
                                return data.app_list;
                            },
                            fnValByKey = function (k, v) {
                                switch (k) {
                                    case 'status':
                                        v = v == 1 ? '已安装' : '已授权';
                                        break;
                                    case 'dev_name':
                                        v = v ? v : '该用户暂未安装应用';
                                        break;
                                    default:
                                }
                                return v;
                            };

                        var cont = $('<div>').ScrollList({
                            numInfoData: {
                                listurl: listurl,
                                identify: item.identify
                            },
                            elesTop: elesTop,
                            elesDemo: elesDemo,
                            widthProportion: widthProportion,
                            fnGetItems: fnGetItems,
                            fnValByKey: fnValByKey,
                            completed: function (data) {
                                cont.off().on('click', function (e) {
                                    if ($(e.target).hasClass('btnDelVersion')) {
                                        var ul = $(e.target).closest('ul'),
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
                                            }
                                        }, '删除')
                                    }

                                });
                                switch (data.rt) {
                                    case '0000':
                                        $.dialog('list', {
                                            title: title,
                                            content: cont
                                        });
                                        break;
                                    case '9053':
                                        warningOpen('暂无历史版本', 'danger', 'fa-bolt');
                                        break;
                                }
                            }
                        });


                        obj = {
                            dom: 'a.btn-danger',
                            event: 'click',
                            fn: function (e) {
                                versionTable.reset()
                                $.silentPost('/mam/app/delVersion', {
                                    id: $(e.target).closest('tr').data('item').id
                                }, function (data) {
                                    if (data.rt == '0000') {
                                        warningOpen('成功删除历史版本！', 'primary', 'fa-bolt');
                                        versionTable.refresh()
                                    } else {
                                        warningOpen('删除失败！', 'danger', 'fa-bolt');
                                        versionTable.refresh()
                                        console.error('删除历史版本失败：', data)
                                    }
                                })
                            }
                        }
                    }
                }]
            },
            btnIssue: {
                dom: null,
                selector: '#btnIssue',
                events: [{
                    type: 'click',
                    fn: function () {
                        if (oSubPage.partTable.selected.aItemIds.length > 0) {
                            var idts = oSubPage.partTable.selected.aItemIdents;
                            if (oSubPage.partTable.selected.aItemTypeIds.length > 0) {
                                warningOpen('请选择授权应用，公开应用不能授权！', 'danger', 'fa-bolt');
                                return;
                            }
                            if (idts.length > 0) {
                                var pf = idts[0].split('*')[0];
                                for (var i = 0; i < idts.length; i++) {
                                    if (idts[i].split('*')[0] !== pf) {
                                        warningOpen('请选择同一平台应用！', 'danger', 'fa-bolt');
                                        return;
                                    }
                                }
                            }
                            toIssue();
                            function toIssue() {
                                oSubPage.fnActPart('.partIssue');
                                $('#tabForIssue').data('app', {
                                    identify: JSON.stringify(oSubPage.partTable.selected.aItemIdents)
                                });
                                $('#treeUserGroup').XTree();
                                $('#treeUserTag').XList();
                            }
                        } else {
                            warningOpen('请先选择要下发的应用！', 'danger', 'fa-bolt');
                        }
                    }
                }]
            },
            btnRefresh: {
                dom: null,
                selector: '#btnRefresh',
                events: [{
                    type: 'click',
                    fn: function () {
                        oSubPage.partTable.fnRefresh();
                    }
                }]
            },

            aMoreInfo: {
                dom: null,
                selector: 'td .more-info',
                events: [{
                    type: 'click',
                    fn: function () {
                        var item = $(this).closest('tr').data('item'),
                            pjaxAim = $('#pjax-aim').addClass('loading-mask'),
                            listurl = '/p/app/devByUserId',
                            title = '应用"' + item.app_name + '"授权及安装情况',
                            elesTop = ['序号', '姓名', '状态', '安装设备'],
                            elesDemo = [
                                '<span class="counter"></span>',
                                '<span item-key="user_name"></span>',
                                '<span item-key="status"></span>',
                                '<span item-key="dev_name"></span>'
                            ],
                            widthProportion = [0.6, 1, 1, 2],
                            fnGetItems = function (data) {
                                return data.doc;
                            },
                            fnValByKey = function (k, v) {
                                switch (k) {
                                    case 'status':
                                        v = v == 1 ? '已安装' : '已授权';
                                        break;
                                    case 'dev_name':
                                        v = v ? v : '该用户暂未安装应用';
                                        break;
                                    default:
                                }
                                return v;
                            };

                        var cont = $('<div>').ScrollList({
                            numInfoData: {
                                listurl: listurl,
                                identify: item.identify
                            },
                            elesTop: elesTop,
                            elesDemo: elesDemo,
                            widthProportion: widthProportion,
                            fnGetItems: fnGetItems,
                            fnValByKey: fnValByKey,
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
                    },
                }]
            },
            selPlatform: {
                dom: null,
                selector: '#selPlatform',
                events: [{
                    type: 'change input propertychange',
                    fn: function () {
                        oSubPage.partTable.sPlatform = $(this).val();
                        oSubPage.partTable.fnPage(1);
                    }
                }]
            },
            selLength: {
                dom: null,
                selector: '#selLength',
                events: [{
                    type: 'change input propertychange',
                    fn: function () {
                        ;
                        oSubPage.partTable.nLength = $(this).val();
                        oSubPage.partTable.fnPage(1);
                    }
                }]
            },
            ckbSelectAll: {
                dom: null,
                selector: '#multTable thead tr th input:checkbox',
                events: [{
                    type: 'click',
                    fn: function () {
                        var ckbs = $('#tbHas tr .checkbox input:checkbox');
                        ckbs.prop("checked", this.checked);
                        oSubPage.partTable.fnCheckSelAll();
                    }
                }]
            },
            ckbSelect: {
                dom: null,
                selector: '#tbDemo tr input:checkbox',
                events: [{
                    type: 'click',
                    fn: function () {
                        oSubPage.partTable.fnCheckSelAll();
                    }
                }]
            },
            iptSearch: {
                dom: null,
                selector: '#iptSearch',
                events: [{
                    type: 'keyup',
                    fn: function () {
                        clearTimeout(oSubPage.timer);
                        var that = this;
                        oSubPage.timer = setTimeout(function () {
                            oSubPage.partTable.sSearchKey = $(that).val();
                            oSubPage.partTable.fnPage(1);
                        }, 500)
                    }
                }]
            },
            divEmpty: {
                dom: null,
                selector: '#divEmpty'
            },
            tbHas: {
                dom: null,
                selector: '#tbHas'
            },
            trDemo: {
                dom: null,
                selector: '#tbDemo>tr'
            },


        },
        fnInit: function () {
            var partTable = $(this.sPartSelector);
            oSubPage.fnActPart(this.sPartSelector);
            // 初始化元素dom并绑定事件
            for (k in this.publicEles) {
                this.publicEles[k].dom = partTable.find(this.publicEles[k].selector);
                if (this.publicEles[k].events) {
                    var evts = this.publicEles[k].events;
                    for (var i = 0; i < evts.length; i++) {
                        this.publicEles[k].dom.unbind(evts[i].type, evts[i].fn);
                        this.publicEles[k].dom.bind(evts[i].type, evts[i].fn);
                    }
                }
            }
            this.fnRefresh();
        },
        fnRefresh: function () {
            oSubPage.fnActPart(this.sPartSelector);
            this.nStart = 1;
            this.nCurrentpage = 1;
            this.publicEles.iptSearch.dom.val('');
            this.sSearchKey = '';
            this.publicEles.selLength.dom.val(this.nInitLength);
            this.nLength = this.nInitLength;
            this.publicEles.selPlatform.dom.val(this.sInitPlatform);
            this.sPlatform = this.sInitPlatform;
            for (i in this.selected) {
                this.selected[i] = [];
            }
            this.fnPage(1);
        },
        fnPage: function () {
            oSubPage.fnActPart(this.sPartSelector);
            if (arguments[0] && typeof arguments[0] == 'number') {
                this.nStart = arguments[0];
                this.nCurrentpage = arguments[0];
            }
            var that = this;
            $.silentGet('/man/getList', {
                sListUrl: this.setting.sListUrl,
                platform: this.sPlatform,
                start: this.nStart,
                length: this.nLength,
                keyword: encodeURIComponent(this.sSearchKey)
            }, function (data) {
                that.fnList(data);
            })
        },

        fnUrl: function () {
            var url = '/man/getList?sListUrl=' + encodeURIComponent(this.setting.sListUrl)
                + '&platform=' + this.sPlatform
                + "&start=" + this.nStart
                + "&length=" + this.nLength
                + "&keyword=" + encodeURIComponent(encodeURIComponent(this.sSearchKey));
            return url;
        },
        fnDelItem: function () {
            var that = this,
                pd = {
                    'sDelUrl': this.setting.sDelUrl,
                    'id': JSON.stringify(this.selected.aItemIds),
                    'identify': JSON.stringify(this.selected.aItemIdents)
                };
            $.actPost('/man/delete', pd, function (data) {
                if (data.rt == '0000') {
                    for (i in that.selected) {
                        that.selected[i] = [];
                    }
                    that.fnPage();
                }
            }, '删除', '应用')
        },
        fnList: function (data) {
            if (typeof data === 'object' && data.rt !== undefined) {
                if (data.app_list && data.app_list.length > 0) {
                    this.publicEles.divEmpty.dom.hide();
                    this.publicEles.tbHas.dom.show();
                    this.publicEles.tbHas.dom.empty();
                } else {
                    this.publicEles.tbHas.dom.hide();
                    this.publicEles.divEmpty.dom.show();
                }
                switch (data.rt) {
                    case '0000':
                        this.oAjaxData = data;
                        this.nTotalCount = data.total_count;
                        this.aItems = data.app_list;
                        var keys = '',
                            vk = this.sViewkey;
                        this.publicEles.trDemo.dom.find('[' + this.sViewkey + ']').each(function () {
                            if (keys === '') {
                                keys += $(this).attr(vk);
                            } else {
                                keys += (' ' + $(this).attr(vk));
                            }
                        });
                        keys = keys.split(' ');
                        for (var i = 0; i < this.aItems.length; i++) {
                            var item = this.aItems[i],
                                tri = this.publicEles.trDemo.dom.clone(true);
                            if (item.app_type == 'web') {
                                tri.find('.btnVersion').remove();
                            }
                            item.app_name = item.app_type == 'web' ? '' : item.app_name;
                            item.name = item.name ? item.name : item.app_name;
                            tri.data(this.sItemId, item.id);
                            tri.data(this.sItemIdentify, item.identify);
                            tri.data(this.sRowId, i);
                            tri.data('item', item);

                            if (item.visit_type !== undefined) {
                                tri.data('visit_type', item.visit_type);
                            }
                            if ($.inArray(item.id, this.selected.aItemIds) != -1) {
                                tri.find('input:checkbox').prop("checked", true);
                            };
                            for (var j = 0; j < keys.length; j++) {

                                var k = keys[j],
                                    e = tri.find('[' + this.sViewkey + '*=' + k + ']');
                                v = this.setting.fnDealKeyVal(k, item[k]);

                                if (v && v.length && v.length > 8) {
                                    e.attr('title', v)
                                        .css({
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        });
                                }
                                e.text(v);
                            }
                            this.publicEles.tbHas.dom.append(tri[0]);
                            createFooter(this.nStart, this.nLength, data.total_count, 1);
                        }
                        oSubPage.partTable.fnCheckSelAll();
                        break;
                    case 5:
                        toLoginPage();
                        break;
                    default:
                }
            } else {
                console.error(data);
            }
        },
        fnCheckSelAll: function () {
            var ckbs = $('#tbHas tr input:checkbox'),
                ckbAll = $(oSubPage.partTable.publicEles.ckbSelectAll.selector),
                allChecked = true,
                hasChecked = false;
            var that = this;
            ckbs.each(function () {
                if (this.checked) {
                    hasChecked = true;
                } else {
                    allChecked = false;
                }
                var ptr = $(this).parents('tr');
                var typeId = ptr.data('visit_type') + '*' + ptr.data(oSubPage.partTable.sItemId);
                if (this.checked && $.inArray(typeId, oSubPage.partTable.selected.aItemTypeIds) == -1 && ptr.data('visit_type') == 1) {
                    oSubPage.partTable.selected.aItemTypeIds.push(typeId)
                } else if (!this.checked && $.inArray(typeId, oSubPage.partTable.selected.aItemTypeIds) != -1 && ptr.data('visit_type') == 1) {
                    oSubPage.partTable.selected.aItemTypeIds.splice($.inArray(typeId, oSubPage.partTable.selected.aItemTypeIds), 1);
                } else { }
                var itemId = ptr.data(oSubPage.partTable.sItemId);
                if (this.checked && $.inArray(itemId, oSubPage.partTable.selected.aItemIds) == -1) {
                    oSubPage.partTable.selected.aItemIds.push(itemId);
                } else if (!this.checked && $.inArray(itemId, oSubPage.partTable.selected.aItemIds) != -1) {
                    oSubPage.partTable.selected.aItemIds.splice($.inArray(itemId, oSubPage.partTable.selected.aItemIds), 1);
                } else { }

                var identify = ptr.data(oSubPage.partTable.sItemIdentify);
                if (this.checked && $.inArray(identify, oSubPage.partTable.selected.aItemIdents) == -1) {
                    oSubPage.partTable.selected.aItemIdents.push(identify)
                } else if (!this.checked && $.inArray(identify, oSubPage.partTable.selected.aItemIdents) != -1) {
                    oSubPage.partTable.selected.aItemIdents.splice($.inArray(identify, oSubPage.partTable.selected.aItemIdents), 1);
                } else { }
            })
            ckbAll.prop("checked", allChecked);
            $('.hrefactive').toggleClass("hrefallowed", hasChecked);
            $('.hrefactive[data-target]').attr('data-toggle', hasChecked ? 'modal' : '')
        },
        fnBtnCtrl: function () {
            if (this.selected.aItemIds.length != 0) {

            }
        }
    },
    partForm: {//多用途表单控制
        sPartSelector: '.partForm',
        oItem: null,
        aCtrl: ['upload', 'add', 'modify', 'view'],//array 字符串数组   控制多用途表单用于新建、修改、或查看
        aBtnTxt: {
            upload: '上传',
            add: '提交',
            modify: '保存'
        },
        setting: {
            aCtrl: ['upload', 'add', 'modify', 'view'],
            upload: {
                action: "/app/upload"
            },
            modify: {
                action: "/app/modify"
            },
            fnAheadItem: function (item) {  //准备表单元素
                var app = item;
                var ele = $('#apptag').html('<option value="">无</option>');
                if (ele[0]) {
                    $.silentGet('/man/appTag/getAppTagList', {
                        start: 1,
                        length: 1000
                    }, function (data) {  // 获取标签列表
                        var list = data.apptag_list;
                        for (var i = 0; i < list.length; i++) {
                            var opt = $('<option></option>'),
                                item = list[i];
                            opt.attr('value', item.id);
                            if (app && app.apptag == item.id) {
                                opt.attr('selected', 'selected');
                            }
                            opt.text(item.name);
                            ele.append(opt[0]);
                        }
                    });
                }
            },
            fnAfterItem: function (ctrl, item) {   //根据显示成员控制表单form-group元素的显示和隐藏
                var mulFrm = $('#multForm'),
                    iptsAll = mulFrm.find(':input[name]'),
                    webbox = mulFrm.find('.appbox.web'),
                    mobbox = mulFrm.find('.appbox.mob');
                switch (ctrl) {
                    case this.aCtrl[0]:  //upload 
                        webbox.addClass('hidden');
                        mobbox.removeClass('hidden');
                        mobbox.find('.form-group').removeClass('hidden');
                        mobbox.find('.ios').addClass('hidden');
                        mobbox.find('.android').removeClass('hidden');
                        mobbox.find('.form-group:has(input[name=app_name])').addClass('hidden');
                        break;
                    case this.aCtrl[1]: //add
                        break;
                    case this.aCtrl[2]: //modify
                    case this.aCtrl[3]: //view
                        mobbox.find('.form-group').removeClass('hidden');
                        mulFrm.find('.form-group:has(input[name=app_name])').addClass('hidden');
                        switch (item.app_type) {
                            case 'plugin':  //移动应用
                            case 'wrap':  //wrapping应用
                                webbox.addClass('hidden');
                                mobbox.removeClass('hidden');
                                if (item.platform == 'android') {
                                    mobbox.find('.ios').addClass('hidden');
                                    mobbox.find('.android').removeClass('hidden');
                                } else if (item.platform == 'ios') {
                                    mobbox.find('.android').addClass('hidden');
                                    mobbox.find('.ios').removeClass('hidden');
                                } else {
                                    console.warn('警告 item.platform:' + item.platform)
                                }
                                mobbox.find('.form-group:has(input[type=file][name=app_file])').addClass('hidden');
                                break;
                            case 'web':  //web应用
                                mobbox.addClass('hidden');
                                webbox.removeClass('hidden');
                                break;
                            default:
                                console.warn('警告 item.app_type:' + item.app_type);
                        }
                        break;
                    default:
                }
                iptsAll.prop('disabled', false);
                mulFrm.find('.appbox.hidden :input[name],.form-group.hidden :input[name]').prop('disabled', true);
            },
            fnFormFinal: function (ctrl) { //定义表格表单数据渲染之后的显示调整
                var iptsShow = $('#multForm :input[name]:visible');
                switch (ctrl) {
                    case this.aCtrl[0]:  //upload
                        for (var i = 0; i < iptsShow.length; i++) {
                            switch ($(iptsShow[i]).attr('name')) {
                                case 'app_name':
                                    $(iptsShow[i]).prop('disabled', true).val('').parents('.form-group').addClass('hidden');
                                    break;
                                default:
                                    switch ($(iptsShow[i]).attr('type')) {
                                        case 'text':
                                        case 'hidden':
                                        case 'file':
                                            $(iptsShow[i]).prop('disabled', false).val('');
                                            break;
                                        default:
                                    }
                            }
                        }
                        break;
                    case this.aCtrl[1]:  //add
                        break;
                    case this.aCtrl[2]:  //modify
                        for (var i = 0; i < iptsShow.length; i++) {
                            switch ($(iptsShow[i]).attr('name')) {
                                case 'app_name':
                                case 'app_type':
                                case 'platform':
                                case 'dev_type':
                                case 'icon':
                                case 'url':
                                    $(iptsShow[i]).prop('disabled', true);
                                    $(iptsShow[i]).closest('.form-group').find('.danger').removeClass('danger');
                                    break;
                                case 'app_file':
                                    $(iptsShow[i]).prop('disabled', true).parents('.form-group').addClass('hidden');
                                    break;
                                default:
                                    $(iptsShow[i]).prop('disabled', false);
                            }
                        }
                        break;
                    case this.aCtrl[3]:  //view
                        for (var i = 0; i < iptsShow.length; i++) {
                            switch ($(iptsShow[i]).attr('name')) {
                                case 'app_type':
                                case 'app_file':
                                    $(iptsShow[i]).prop('disabled', true).parents('.form-group').addClass('hidden');
                                    break;
                                default:
                            }
                        }
                        break;
                    default:
                }
                $('.hidden :input[name][type!="hidden"]').prop('disabled', true);
            }
        },
        publicEles: {
            multForm: {
                dom: null,
                selector: '#multForm',
                events: [{
                    type: 'submit',
                    fn: function () {
                        var frm = $(this),
                            selApptype = frm.find('select[name=app_type]'),
                            ipts = frm.find(':input[name][type!=hidden]'),
                            iptFile = frm.find('input[name=file_data]'),
                            btnSmt = frm.find('button[type=submit]'),
                            pgrBar = frm.find('.uploadFile+.progress .progress-bar');
                        switch (frm.attr('action')) {
                            case oSubPage.partForm.setting.upload.action:    //上传操作
                                frm.ajaxSubmit({
                                    beforeSubmit: function (aNameValue, thisFrm, ajaxOptions) {
                                        frm.attr('enctype', 'multipart/form-data');
                                        ipts.prop('disabled', true);
                                        btnSmt.prop('disabled', true);
                                        return;
                                    },
                                    uploadProgress: function (event) {
                                        if (event.lengthComputable && selApptype.val() !== 'web') {
                                            var cplt = Number.parseInt(event.loaded / event.total * 100) + "%";
                                            pgrBar.css('width', cplt);
                                        }
                                    },
                                    success: function (data) {
                                        $.handleECode(true, data, '上传', '应用');
                                        switch (data.rt) {
                                            case '0000':
                                                oSubPage.partTable.fnPage(1);
                                                break;
                                            default:
                                                console.warn("data.rt=" + data.rt)
                                                ipts.prop('disabled', false);
                                                btnSmt.prop('disabled', true);
                                                setTimeout(function () {
                                                    ipts.iptsReset();
                                                    pgrBar.css('width', '0');
                                                }, 100);
                                        }
                                        oSubPage.partForm.fnCheckAll();
                                    }
                                });
                                break;
                            case localStorage.getItem("appssec_url") + "/p/app/upload": //上传web应用表单的action
                                frm.ajaxSubmit({
                                    beforeSubmit: function (aNameValue, thisFrm, ajaxOptions) {
                                        aNameValue.push({ name: "sid", value: $.cookie("sid"), type: "hidden", required: false });
                                        switch (selApptype.val()) {
                                            case 'plugin':
                                            case 'wrap':
                                                frm.attr("action", "/app/upload");
                                                pgrBar.css('width', '0');
                                                break;
                                            case 'web':
                                                frm.attr("action", localStorage.getItem("appssec_url") + "/p/app/upload");
                                                for (var i = 0; i < aNameValue.length; i++) {
                                                    switch (aNameValue[i].name) {
                                                        case 'id':
                                                        case 'identify':
                                                        case 'app_name':
                                                            aNameValue.splice(i, 1);
                                                            i--;
                                                            break;
                                                        default:
                                                    }
                                                }
                                                break;
                                            default:
                                        }
                                        frm.attr('enctype', 'multipart/form-data');
                                        ipts.prop('disabled', true);
                                        btnSmt.prop('disabled', true);
                                        return;
                                    },
                                    success: function (data) {
                                        $.handleECode(true, data, '上传', '应用');
                                        switch (data.rt) {
                                            case '0000':
                                                oSubPage.partTable.fnPage(1);
                                                break;
                                            default:
                                                console.warn("data.rt=" + data.rt)
                                                ipts.prop('disabled', false);
                                                btnSmt.prop('disabled', true);
                                                setTimeout(function () {
                                                    ipts.iptsReset();
                                                    pgrBar.css('width', '0')
                                                }, 100);
                                        }
                                        oSubPage.partForm.fnCheckAll();
                                    }
                                });
                                break;
                            case oSubPage.partForm.setting.modify.action:
                                frm.ajaxSubmit({
                                    beforeSubmit: function () {
                                        frm.removeAttr('enctype');
                                    },
                                    success: function (data) {
                                        $.handleECode(true, data, '修改', '应用');
                                        switch (data.rt) {
                                            case '0000':
                                                oSubPage.partTable.fnPage(1);
                                                break;
                                            default:
                                                console.warn("data.rt=" + data.rt)
                                                ipts.prop('disabled', false);
                                                btnSmt.prop('disabled', true);
                                                setTimeout(function () {
                                                    ipts.iptsReset();
                                                    pgrBar.css('width', '0')
                                                }, 100);
                                        }
                                        oSubPage.partForm.fnCheckAll();
                                    }
                                });
                                break;
                            default:
                        }
                        oSubPage.partForm.fnCheckAll();
                        return false;
                    }
                }]
            },
            slcApptype: {
                dom: null,
                selector: 'select[name=app_type]',
                events: [{
                    type: 'change',
                    fn: function () {
                        var v = $(this).val(),
                            AppBoxMob = $('.appbox.mob'),
                            AppBoxWeb = $('.appbox.web');
                        AppBoxMob.toggleClass('hidden', v != 'plugin' && v != 'wrap');
                        AppBoxWeb.toggleClass('hidden', v != 'web');
                        switch (v) {
                            case "plugin":
                            case "wrap":
                                AppBoxWeb.addClass('hidden')
                                    .find(':input[name][type!=hidden]').prop('disabled', true);
                                AppBoxMob.removeClass('hidden')
                                    .find(':input[name][type!=hidden]').prop('disabled', false);
                                $(this).closest('form').attr('action', '/app/upload')
                                break;
                            case "web":
                                AppBoxMob.addClass('hidden')
                                    .find(':input[name][type!=hidden]').prop('disabled', true);
                                AppBoxWeb.removeClass('hidden')
                                    .find(':input[name][type!=hidden]').prop('disabled', false);
                                $(this).closest('form').attr('action', localStorage.getItem("appssec_url") + "/p/app/upload")
                                break;
                            default:
                        }
                    }
                }]
            },
            selPlatform: {
                dom: null,
                selector: 'select[name=platform]',
                events: [{
                    type: 'change input propertychange',
                    fn: function () {
                        var v = $(this).val();
                        switch (v) {
                            case 'android':
                                $('.ios').addClass('hidden').find(':input[name][type!=hidden]').prop('disabled', true);
                                $('.android').removeClass('hidden').find(':input[name][type!=hidden]').prop('disabled', false);
                                break;
                            case 'ios':
                                $('.android').addClass('hidden').find(':input[name][type!=hidden]').prop('disabled', true);
                                $('.ios').removeClass('hidden').find(':input[name][type!=hidden]').prop('disabled', false);
                                break;
                            default:
                        }
                        $('input[type=file]:visible', '#multForm').val('').change();
                        $('input[type=text]:visible', '#multForm').val('').keyup();
                    }
                }]
            },
            iptUploadImg: {
                dom: null,
                selector: '.uploadImg>input[type=file]',
                events: [{
                    type: 'change input propertychange',
                    fn: function () {
                        var ipt = $(this),
                            img = ipt.next("img"),
                            lab = ipt.closest('.form-group').find('label.control-label>b'),
                            file = this.files[0], fn, ex, fs;
                        if (file) {
                            fn = file.name;
                            ex = fn.substr(fn.lastIndexOf('.')).toLowerCase();
                            fs = file.size;
                            if ($.inArray(ex, ['.png', '.jpeg', '.jpg', '.icon', '.ico', '.png']) == -1) {
                                warningOpen('请上传图片png,jpeg,jpg,icon等常用格式图片', 'danger', 'fa-bolt')
                                checkImg(false)
                            } else if (fs > 10 ** 1024 * 1024) {
                                warningOpen('图片大小不得超过10M', 'danger', 'fa-bolt')
                                checkImg(false)
                            } else {
                                checkImg(true)
                            }
                        } else {
                            checkImg(false)
                        }
                        oSubPage.partForm.fnCheckAll();

                        function checkImg(bool) {
                            img.attr("src", bool ? getObjectURL(file) : img.attr('data-src'));
                            ipt.toggleClass('danger', !bool);
                            lab.toggleClass('danger', !bool);
                        }
                        function getObjectURL(file) {
                            var url = null;
                            if (window.createObjectURL != undefined) { // basic
                                url = window.createObjectURL(file);
                            } else if (window.URL != undefined && typeof window.URL.createObjectURL == 'function') {
                                // mozilla(firefox)
                                try {
                                    url = window.URL.createObjectURL(file);
                                } catch (e) {
                                    console.error(e);
                                }
                            } else if (window.webkitURL != undefined) {
                                // webkit or chrome
                                url = window.webkitURL.createObjectURL(file);
                            }
                            return url;
                        }
                    }
                }]
            },
            iptUploadFile: {
                dom: null,
                selector: '.uploadFile>input[type=file]',
                events: [{
                    type: 'change input propertychange',
                    fn: function () {
                        var file = this.files[0],
                            at = $("select[name = app_type]").val(),
                            pf = $("select[name = platform]").val(),
                            eleFn = $(this).nextAll('p.file-name'),
                            eleFh = $(this).nextAll('p.file-help'),
                            lab = $(this).parents('.form-group').find('label b'),
                            fn, //文件名称
                            ex, //文件后缀
                            fs; //文件大小
                        var maxSize = 300;   //最大允许上传的文件尺寸
                        if (file) {
                            fn = file.name;
                            ex = fn.substr(fn.lastIndexOf('.'));
                            fs = file.size;
                            if (at == 'plugin' || at == 'wrap') {
                                if (pf == "android") {
                                    if ((ex == ".apk" || ex == ".APK") && fs <= maxSize * 1024 * 1024) {
                                        checkRes(true);
                                    } else {
                                        fs > maxSize * 1024 * 1024
                                            ? warningOpen('文件大小不得超过' + maxSize + "MB", 'danger', 'fa-bolt')
                                            : warningOpen('请选择.apk文件', 'danger', 'fa-bolt');
                                        checkRes(false);
                                    }

                                } else {
                                    if ((ex == ".ipa" || ex == ".IPA") && fs <= maxSize * 1024 * 1024) {
                                        checkRes(true);
                                    } else {
                                        fs > maxSize * 1024 * 1024
                                            ? warningOpen('文件大小不得超过' + maxSize + "MB", 'danger', 'fa-bolt')
                                            : warningOpen('请选择.ipa文件', 'danger', 'fa-bolt');
                                        checkRes(false);
                                    }
                                }
                            }

                        } else {
                            checkRes(false)
                        }
                        oSubPage.partForm.fnCheckAll();
                        function checkRes(bool) {
                            eleFn.text(fn).toggleClass('hidden', !bool);
                            eleFh.toggleClass('hidden', bool);
                            lab.toggleClass('danger', !bool);
                        }
                    }
                }]
            },
            iptsReg: {
                dom: null,
                selector: 'input[name][type=text][txt-reg]',
                events: [{
                    type: 'change input propertychange',
                    fn: function () {
                        var lab = $(this).parents('.form-group').find('label>b'),
                            val = $(this).val(),
                            reg = new RegExp($(this).attr('txt-reg'));
                        lab.toggleClass('danger', !reg.test(val));
                        $(this).toggleClass('danger', !reg.test(val));
                        oSubPage.partForm.fnCheckAll();
                    }
                }]
            },
            btnBack: {
                dom: null,
                selector: '.btnBack',
                events: [{
                    type: 'click',
                    fn: function () {
                        oSubPage.partTable.fnPage();
                    }
                }]
            }
        },
        fnCheckAll: function () { //根据输入元素正则匹配结果指示器$('.form-group:visible:has(b.danger)') 判断是否全部验证通过，开关提交按钮
            $('#multForm button[type=submit]').prop('disabled', $('.form-group:visible:has(b.danger)').length > 0);
        },
        fnNameVal: function (n, v) {
            switch (n) {
                case "platform":
                    v = v == "ios" ? "ios" : "android";
                    break;
                default:
            }
            return v;
        },
        fnInit: function (ctrl) {
            var partForm = $('.part.partForm'),
                frm = partForm.find('#multForm'),
                btnSmt = partForm.find('#multForm button[type=submit]');
            oSubPage.fnActPart(this.sPartSelector);
            // 初始化元素dom并绑定事件
            for (k in this.publicEles) {
                this.publicEles[k].dom = partForm.find(this.publicEles[k].selector);
                if (this.publicEles[k].events) {
                    var evts = this.publicEles[k].events;
                    for (var i = 0; i < evts.length; i++) {
                        this.publicEles[k].dom.unbind(evts[i].type, evts[i].fn);
                        this.publicEles[k].dom.bind(evts[i].type, evts[i].fn);
                    }
                }
            }
            var item = this.oItem;
            frm[0].reset();
            frm.find(':input').iptsReset();
            frm.find('.uploadFile .file-help').removeClass('hidden');
            frm.find('.uploadFile .file-name').addClass('hidden').text('');
            this.setting.fnAheadItem(item);
            this.fnItemInForm(); //将成员参数加载入表单
            this.setting.fnAfterItem(ctrl, item);
            switch (ctrl) {
                case this.aCtrl[0]:   //upload        
                    frm.attr('action', this.setting.upload.action);
                    btnSmt.show().text(this.aBtnTxt.upload).prop('disabled', false);
                    frm.find(':input[name][type!=hidden]:visible').prop('disabled', false);
                    break;
                case this.aCtrl[1]:   //add
                    frm.attr('action', this.setting.add.action);
                    btnSmt.show().text(this.aBtnTxt.add).prop('disabled', false);
                    frm.find(':input[name][type!=hidden]:visible').prop('disabled', false);
                    break;
                case this.aCtrl[2]:   //modify
                    frm.attr('action', this.setting.modify.action);
                    btnSmt.show().text(this.aBtnTxt.modify).prop('disabled', false);
                    frm.find(':input[name][type!=hidden]:visible').prop('disabled', false);
                    break;
                case this.aCtrl[3]:   //view
                    frm.find(':input[name][type!=hidden]:visible').prop('disabled', true);
                    frm.find('input:radio:visible:checked').prop('disabled', false);
                    btnSmt.hide();
                    break;
                default:
                    console.error('请向_Global.partForm.fnInit中代入' + this.aCtrl + '中一个表单用途控制参数');
            }
            this.setting.fnFormFinal(ctrl);
            this.fnCheckAll();
        },

        fnItemInForm: function () {   //在表单中加载选中的成员信息，以便查看和修改
            if (this.oItem) {
                var item = this.oItem,
                    that = this;
                $(':input[name]', '#multForm').each(function () {
                    var n = $(this).attr('name'),
                        v = item[n];
                    if (v !== undefined) {
                        $(this).prop('disabled', false);
                        switch ($(this).attr('type')) {
                            case 'radio':
                            case 'checkbox':
                                $(this).prop("checked", $(this).attr('value') == v)
                                break;
                            case 'file':
                                if (v) {
                                    var imgsrc = localStorage.getItem("appssec_url") + '/' + v;
                                    $(this).next('img').data('src', imgsrc).attr('src', imgsrc);
                                }
                                break;
                            default:
                                $(this).val(that.fnNameVal(n, v));
                        }
                        $(this).change();
                    } else {
                        //console.warn("注意关键字：" + n)
                    }

                });
                $('input[type=file]', '#multForm .uploadFile').prop('disabled', true).parents('.form-group').addClass('hidden');
            } else {
                $('input[type=file]', '#multForm .uploadFile').prop('disabled', false).parents('.form-group').removeClass('hidden');
            }

        },


    },
    partIssue: {
        fnInit: function () {
            $('#treeUserGroup').XTree();
            var partIssue = $(this.selector);
            oSubPage.fnActPart(this.selector);
            $('#tabForIssue').data('file', {
                identify: JSON.stringify(oSubPage.partTable.selected.aItemIdents)
            });
            $('#treeUserGroup').XTree();
            $('#treeUserTag').XList();
            // 初始化元素dom并绑定事件
            for (k in this.publicEles) {
                this.publicEles[k].dom = partIssue.find(this.publicEles[k].selector);
                if (this.publicEles[k].events) {
                    var evts = this.publicEles[k].events;
                    for (var i = 0; i < evts.length; i++) {
                        this.publicEles[k].dom.unbind(evts[i].type, evts[i].fn);
                        this.publicEles[k].dom.bind(evts[i].type, evts[i].fn);
                    }
                }
            }
        }
    }
};













var issuePane = $('#issuePane');
issuePane.find('.btnIssue').on('click', function () {
    fnIssue(1);
})
issuePane.find('.btnUnissue').on('click', function () {
    fnIssue(0);
})
issuePane.find('.btnBack').on('click', function () {
    oSubPage.partTable.fnPage(1);
})
function fnIssue(state) {
    var actText = (state ? '' : '取消') + '授权',
        tab = $('#tabForIssue'),
        pd = {
            authfilter: '',
            authtype: 'app',
            state: state,
            identify: tab.data('app').identify,
            authrules: ''
        },
        rules = $('#tabForIssue .tabBody>.tab-pane.active .relFilter').data('rules');
    if (rules && rules.reverse == 1) {
        pd.authfilter = 'xtree';
        pd.authrules = JSON.stringify(rules);
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
}

// page页查询
function search(p, i) {
    var keyword = $('.widget-btn input[name=keyvalue]').val();
    oSubPage.partTable.fnPage(p);
}

function delVersion(btn) {
    $.silentPost('/mam/app/delVersion', {
        id: $(btn).closest('tr').data('item').id
    }, function (data) {
        if (data.rt == '0000') {
            warningOpen('删除成功！', 'primary', 'fa-check');
        } else {
            warningOpen('删除失败！', 'danger', 'fa-bolt');
        }
    })
}




var SPAS = $.extend(oSubPage);  //SPAS(SubPage of AppStore)通过jquery拷贝oSubPage所有属性和方法
SPAS.partTable.setting.sListUrl = "/p/app/list";
SPAS.partTable.setting.sDelUrl = "/p/app/del";
SPAS.partTable.setting.sMoreUrl = "/p/app/devByUserId";
SPAS.partForm.aBtnTxt.upload = "上传应用";
SPAS.partForm.aBtnTxt.modify = "保存";
SPAS.fnInit();