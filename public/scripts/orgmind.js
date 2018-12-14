/*
 * Released under BSD License
 * Copyright (c) 2014-2016 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

; (function ($w) {
    'use strict';
    // set 'orgMind' as the library name.
    // __name0__,__name1__,__name2__ should be a const value, Never try to change it easily.
    var __name0__ = 'MngMind';  //管理脑图  用于支持增删改
    var __name1__ = 'SglMind';  //单选脑图  用于支持单选，绑定单选事件，不支持增删改
    var __name2__ = 'MultMind'; //多选脑图  用于支持多选，记录多选，不支持增删改
    // library version
    var __version__ = '0.0.1';
    // author
    var __author__ = 'liudadong@appssec.cn';

    // an noop function define
    var _noop = function () { };
    var logger = (typeof console === 'undefined') ? {
        log: _noop, debug: _noop, error: _noop, warn: _noop, info: _noop
    } : console;

    // check global variables
    if (typeof module === 'undefined' || !module.exports) {
        if (typeof $w[__name0__] != 'undefined') {
            logger.log(__name0__ + ' has been already exist.');
            return;
        }
        if (typeof $w[__name1__] != 'undefined') {
            logger.log(__name1__ + ' has been already exist.');
            return;
        }
        if (typeof $w[__name2__] != 'undefined') {
            logger.log(__name2__ + ' has been already exist.');
            return;
        }
    }


    // detect isElement
    var $i = function (el) { return !!el && (typeof el === 'object') && (el.nodeType === 1) && (typeof el.style === 'object') && (typeof el.ownerDocument === 'object'); };
    if (typeof String.prototype.startsWith != 'function') { String.prototype.startsWith = function (p) { return this.slice(0, p.length) === p; }; }

    //default jsmind opts
    var __def__ = {
        multiple:false,  //是否支持多选
        container: '',   // id of the container
        editable: false, // you can change it in your opts
        theme: 'org',
        mode: 'side',     // full or side
        support_html: true,
        view: {
            hmargin: 40,
            vmargin: 10,
            line_width: 1,
            line_color: '#000'
        },
        layout: {
            hspace: 40,
            vspace: 12,
            pspace: 12
        },
        default_event_handle: {
            enable_mousedown_handle: true,
            enable_click_handle: true,
            enable_dblclick_handle: true
        },
        shortcut: {
            enable: false,
            handles: {},
            mapping: {
                editnode: 113,// F2
                delnode: 46, // Delete
                toggle: 32, // Space
                left: 37, // Left
                up: 38, // Up
                right: 39, // Right
                down: 40, // Down
            }
        }
    };

    // core object
    var jm = function (opts) {
        jm.current = this;
        this.version = __version__;
        var def_omopt = {
            container: 'jsmind_container',
            om_btns: '#orgmind_btns',
            root_id: 'root',
            role: 'super_admin'
        };
        deepMerge(__def__, def_omopt);
        deepMerge(__def__, opts);
        if (!__def__.container) {
            logger.error('the opts.container should not be null or empty.');
            return;
        }
        if (!__def__.om_btns) {
            logger.error('the opts.om_btns should not be null or empty.');
            return;
        }
        this.jm = new jsMind(__def__);
        this.use = use;
        this.omopt = __def__;
        this.inited = false;
        this.init();
        $('#'+__def__.container).addClass('jsmind').data('jm',this.jm);
        return this.jm;
    };
    var jm0 = function (opts) {;
        var def0 = {
            container: 'jsmind_container',
            om_btns: '#orgmind_btns',
            editable: true
        };
        this.opt={};
        deepMerge(this.opt,__def__);
        deepMerge(this.opt,def0);
        deepMerge(this.opt,options);
        if (!__def__.container) {
            logger.error('the opts.container should not be null or empty.');
            return;
        }
        if (!__def__.om_btns) {
            logger.error('the opts.om_btns should not be null or empty.');
            return;
        }
        this.jm = new jsMind(__def__);
        this.use = use;
        this.omopt = __def__;
        this.inited = false;
        this.init();
        $('#'+__def__.container).addClass('jsmind').data('jm',this.jm);
        return this.jm;
    };

    jm.prototype = {
        init: function () {
            if (this.inited) { return; }
            this.inited = true;
            var jm = this.jm,
                omopt = this.omopt,
                jmInner = $('#' + omopt.container).find('.jsmind-inner'),
                jmnodes = jmInner.find('jmnodes'),
                btns = $(omopt.om_btns),
                btnAdd = btns.find('.btnAdd'),
                btnEdit = btns.find('.btnEdit'),
                btnDel = btns.find('.btnDel'),
                btnExport = btns.find('.btnExport'),
                btnImport = btns.find('.btnImport'),
                btnRefresh = btns.find('.btnRefresh');
            switch (this.use) {
                case 'edit':    //机构树编辑（带操作按钮）
                    refreshEdit();
                    function refreshEdit() {
                        jmnodes.on('click', function (e) {
                            if (e.target.tagName.toLowerCase() !== 'jmnode') {
                                jm.select_clear();
                            }
                            synBtns(jm);
                            synPnl(jm);
                        });

                        // 双击编辑节点，失去焦点时触发提交修改操作
                        jmnodes.on('keyup', function (e) {
                            var ipt = $(e.target),
                                nd = ipt.closest('jmnode'),
                                nodeid = nd.attr('nodeid'),
                                jnd = jm.get_node(nodeid),
                                orgCode = jnd.data.orgCode;
                            jmnodes.data('editData', {
                                id: nodeid,
                                topic: ipt.val(),
                                orgCode: orgCode
                            })
                            ipt.off().on('blur', function () {
                                if (jmnodes.data('editData')) {
                                    $.silentPost('/common/orgtree/mod', jmnodes.data('editData'), function (data) {
                                        if (data.rt === "0000") {
                                            update(jm, function () {
                                                synBtns(jm);
                                                synPnl(jm);
                                            });
                                        }
                                    }, '修改', '机构名')
                                } else {
                                    nd.html(jnd.topic);
                                }
                            })
                        });
                        //添加机构按钮
                        btnAdd.on('click', function () {
                            $(this).addClass('disabled');
                            var nodeSel = jm.get_selected_node(),
                                htmlForm = '<form class="form-horizontal" role="form" style="width:400px;">\
                                                <div class="form-group">\
                                                    <label for="topic" class="col-sm-3 control-label no-padding-right">机构名称</label>\
                                                    <div class="col-sm-8">\
                                                        <input type="text" class="form-control" name="topic" placeholder="机构树中显示的文本" autocomplete="off">\
                                                    </div>\
                                                </div>\
                                                <div class="form-group">\
                                                    <label for="orgCode" class="col-sm-3 control-label no-padding-right">机构码</label>\
                                                    <div class="col-sm-8">\
                                                        <input type="text" class="form-control" name="orgCode" placeholder="机构唯一标识码" autocomplete="off" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,\'\')">\
                                                    </div>\
                                                </div>\
                                            </form>',
                                $form,
                                $confirm;
                            $.dialog('confirm', {
                                title: '添加机构',
                                content: htmlForm,
                                confirmValue: '添加',
                                confirm: function () {
                                    $.silentPost('/common/orgtree/add', {
                                        topic: $form.data('topic'),
                                        orgCode: $form.data('orgCode'),
                                        parentid: nodeSel.id,
                                    }, function (data) {
                                        if (data.rt = "0000") {
                                            update(jm, function () {
                                                synBtns(jm);
                                                synPnl(jm);
                                            });
                                        }
                                        $form.removeData();
                                        btnAdd.removeClass('disabled');
                                    }, '添加', '机构');
                                },
                                cancelValue: '取消',
                                cancel: function () {
                                    btnDel.removeClass('disabled');
                                }
                            });
                            $form = $('.dialog-box-content form');
                            $confirm = $('.dialog-btn .dialog-btn-confirm').addClass('disabled');
                            $form.on('propertychange change input', function () {
                                var topic = $(this).find('input[name=topic]').val(),
                                    orgCode = $(this).find('input[name=orgCode]').val();
                                $form.data({
                                    topic: topic,
                                    orgCode: orgCode
                                });
                                if (topic !== '' && orgCode !== '') {
                                    $confirm.removeClass('disabled');
                                } else {
                                    $confirm.addClass('disabled');
                                }
                            });
                        });
                        //编辑机构按钮
                        btnEdit.on('click', function () {
                            var $this = $(this).addClass('disabled');
                            var nodeSel = jm.get_selected_node(),
                                htmlForm = '<form class="form-horizontal" role="form" style="width:400px;">\
                                                <div class="form-group">\
                                                    <label for="topic" class="col-sm-3 control-label no-padding-right">机构名称</label>\
                                                    <div class="col-sm-8">\
                                                        <input type="text" class="form-control" name="topic" value="'+ nodeSel.topic + '" placeholder="机构树中显示的文本">\
                                                    </div>\
                                                </div>\
                                                <div class="form-group">\
                                                    <label for="orgCode" class="col-sm-3 control-label no-padding-right">机构码</label>\
                                                    <div class="col-sm-8">\
                                                        <input type="text" class="form-control" name="orgCode" value="'+ nodeSel.data.orgCode + '" placeholder="机构唯一标识码" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,\'\')">\
                                                    </div>\
                                                </div>\
                                            </form>',
                                $form,
                                $confirm;
                            $.dialog('confirm', {
                                title: '编辑机构',
                                content: htmlForm,
                                confirmValue: '保存',
                                confirm: function () {
                                    $.silentPost('/common/orgtree/mod', {
                                        topic: $form.data('topic'),
                                        orgCode: $form.data('orgCode'),
                                        id: nodeSel.id,
                                    }, function (data) {
                                        if (data.rt = "0000") {
                                            update(jm, function () {
                                                synBtns(jm);
                                                synPnl(jm);
                                            });
                                        }
                                        $form.removeData();
                                        $this.removeClass('disabled');
                                    }, '修改', '机构');
                                },
                                cancelValue: '取消',
                                cancel: function () {
                                    $this.removeClass('disabled');
                                }
                            });
                            $form = $('.dialog-box-content form').data({
                                topic: nodeSel.topic,
                                orgCode: nodeSel.orgCode
                            });
                            $confirm = $('.dialog-btn .dialog-btn-confirm').addClass('disabled');
                            $form.on('propertychange change input', function () {
                                var topic = $(this).find('input[name=topic]').val(),
                                    orgCode = $(this).find('input[name=orgCode]').val();
                                $form.data({
                                    topic: topic,
                                    orgCode: orgCode
                                });
                                if (topic !== '' && orgCode !== '') {
                                    $confirm.removeClass('disabled');
                                } else {
                                    $confirm.addClass('disabled');
                                }
                            });
                        });
                        //删除机构按钮
                        btnDel.on('click', function () {
                            var $this = $(this).addClass('disabled');
                            $.dialog('confirm', {
                                confirmValue: '确认',
                                confirm: function () {
                                    $.silentPost('/common/orgtree/del', {
                                        id: jm.get_selected_node().id
                                    }, function (data) {
                                        if (data.rt === "0000") {
                                            refresh(jm, function () {
                                                synPnl(jm);
                                                synBtns(jm);
                                            });
                                        }
                                        $this.removeClass('disabled');
                                    }, '删除', '机构');
                                },
                                cancel: function () {
                                    $this.removeClass('disabled');
                                },
                                cancelValue: '取消',
                                title: '删除机构',
                                content: '确认删除选中的机构吗?'
                            });
                        });
                        //刷新机构按钮
                        btnRefresh.on('click', function () {
                            var $this = $(this).addClass('disabled');
                            refresh(jm, function () {
                                synBtns(jm);
                                synPnl(jm);
                                $this.removeClass('disabled');
                            });
                        });
                        refresh(jm, function () {
                            synBtns(jm);
                            synPnl(jm);
                        });

                        function synBtns(jm) {
                            var nd = jm.get_selected_node();
                            btnAdd.toggleClass('disabled', nd === null);
                            btnEdit.toggleClass('disabled', nd === null);
                            btnDel.toggleClass('disabled', nd === null);
                            btnExport.toggleClass('disabled', nd === null);
                            btnImport.toggleClass('disabled', nd === null);
                            if (nd && nd.isroot) {  //如果选中的机构是根节点，禁用删除
                                btnDel.addClass('disabled');
                            };
                        }
                        function synPnl(jm) {
                            var nd = jm.get_selected_node();
                            if (nd === null) {
                                $('#topic').text('请选择机构');
                                $('#orgCode').text('无');
                                $('#orgUser').text('0');
                                $('#orgPolicy').text('0');
                            } else {
                                $('#topic').text(nd.topic);
                                $('#orgCode').text(nd.data.orgCode);
                                $('#orgUser').text(nd.data.orgUser);
                                $('#orgPolicy').text(nd.data.orgPolicy);
                            }
                        }
                    };
                    break;
                case 'admin':   //用于配置管理员
                    refreshAdmin();
                    function refreshAdmin() {
                        jmnodes.on('click', function (e) {
                            var btnAdd = $('#panel .btnAdd');
                            if (e.target.tagName.toLowerCase() !== 'jmnode') {
                                console.log('clear')
                                jm.select_clear();
                            }
                            var nd = jm.get_selected_node();
                            console.log(nd);
                            if(nd&&(nd.id===jm.get_root().id)){
                                return;
                            }
                            btnAdd.toggleClass('disabled', nd === null);  //选中下级机构才可以添加管理员
                            $('#panel button.btnRefresh').click(); //选中任意机构都会刷新表格，显示对应机构的管理员
                        });
                        refresh(jm, function () {
                            jmnodes.find('.root').addClass('disabled');
                            jmInner.css({
                                padding:'0 20px',
                                overflow:'hidden'
                            });
                            setTimeout(function(){
                                jmInner.css({
                                    overflowY:'auto'
                                });
                            },100)
                        });
                    }
                    break;
                case 'switch':  //用于管理员切入不同的机构
                    refresh(jm, function () {
                        var orgBtn=$('#btnJmSwitch .orgBtn');
                        jmnodes.on('click', function (e) {
                            console.log('1111111111')
                            var snd=jm.get_selected_node();
                            if(snd===null){
                                if($.cookie('org_id')){
                                    jm.select_node($.cookie('org_id'));
                                }else{
                                    jm.select_node(jm.get_root().id);
                                }
                                snd=jm.get_selected_node();
                                $('ul.sidebar-menu li.active>a[data-pjax]').click();
                            }
                            if($.cookie('org_id')!=snd.id){
                                $.cookie('org_id',snd.id);
                                $('ul.sidebar-menu li.active>a[data-pjax]').click();
                            }
                            if(orgBtn.text()!=snd.topic){
                                orgBtn.text(snd.topic);
                            }
                        });
                        jmnodes.click();
                    });
                    break;

                case 'select':  //用于管理员切入不同的机构
                    refresh(jm, function () {
                        jm.select_node($.cookie('org_id'));
                        jm.select_clear();
                        jm.disable_edit();
                        jmnodes.find('jmnode.root').addClass('disabled');
                        jmnodes.data('orgs',[]);
                        jmnodes.find('jmnode.selected').removeClass('selected');
                        jmnodes.off('click').on('click', function (e) {
                            if(e.target.tagName.toLowerCase()==='jmnode'&&!$(e.target).hasClass('root')){
                                var i = $(this).data('orgs').indexOf($(e.target).attr('nodeid') * 1);
                                $(e.target).toggleClass('selected');
                                if($(e.target).hasClass('selected')){
                                    if(i===-1){
                                        $(this).data('orgs').push($(e.target).attr('nodeid') * 1);
                                    }
                                }else{
                                    if(i!==-1){
                                        $(this).data('orgs').splice(i, 1);
                                    }
                                }
                                console.log($(this).data('orgs'));
                            }
                        });
                    });
                    break;
                default:
                    logger.error('"new orgMind(use,opts)" only supports 3 uses : edit|admin|switch');
            }
            // create instance of function provider
        }
    };

    // export jm0,jm1,jm2
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = jm;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () { return jm; });
    } else {
        $w[__name0__] = jm0;
        $w[__name1__] = jm1;
        $w[__name2__] = jm2;
    }

    //functions
    function deepMerge(b, a) {
        a = JSON.parse(JSON.stringify(a));
        for (var o in a) {
            if (o in b) {
                if (typeof b[o] === 'object' &&
                    Object.prototype.toString.call(b[o]).toLowerCase() == '[object object]' &&
                    !b[o].length) {
                    deepMerge(b[o], a[o]);
                } else {
                    b[o] = a[o];
                }
            } else {
                b[o] = a[o];
            }
        }
        return b;
    }






    function refresh(jm, cb) {
        showjsmind(jm, function () {
            jm.select_clear();
            !(cb instanceof Function) || cb();
        });
    }
    function update(jm, cb) {
        var selId = jm.get_selected_node() ? jm.get_selected_node().id : false;
        showjsmind(jm, function () {
            selId ? jm.select_node(selId) : jm.select_clear();
            !(cb instanceof Function) || cb();
        });
    }
    function showjsmind(jm, cb) {  //获取机构树mind数据刷新至页面，cb支持回调
        $.silentGet('/common/orgtree/mind', {}, function (data) {
            if (data.rt === '0000') {
                if (data.data.length === 0) {
                    $.silentPost('/common/orgtree/add', {
                        topic: '海军',
                        orgCode: 'root',
                        parentid: 0
                    }, function (data) {
                        if (data.rt === '0000') {
                            showjsmind(jm, cb);
                        }
                    }, '添加', '机构')
                } else {
                    data.data[0]['isroot'] = true;
                    console.log('jm');
                    console.log(jm);
                    console.log(data.data);
                    jm.show({
                        /* 元数据，定义思维导图的名称、作者、版本等信息 */
                        "meta": {
                            "name": "机构图",
                            "author": "liudadong@appssec.cn",
                            "version": "0.1"
                        },
                        /* 数据格式声明 */
                        "format": "node_array",
                        /* 数据内容 */
                        "data": data.data
                    });
                    $('#pjax-aim').data('jmdt', data.data);
                    !(cb instanceof Function) || cb();
                }
            }
        }, '获取', '机构树')
    }

})(typeof window !== 'undefined' ? window : global);