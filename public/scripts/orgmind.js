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
    // __name__ should be a const value, Never try to change it easily.
    var __name__ = 'OrgMind';
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
        if (typeof $w[__name__] != 'undefined') {
            logger.log(__name__ + ' has been already exist.');
            return;
        }
    }


    // detect isElement
    var $i = function (el) { return !!el && (typeof el === 'object') && (el.nodeType === 1) && (typeof el.style === 'object') && (typeof el.ownerDocument === 'object'); };
    if (typeof String.prototype.startsWith != 'function') { String.prototype.startsWith = function (p) { return this.slice(0, p.length) === p; }; }




    // core object
    var om = function (options) {
        om.current = this;
        this.version = __version__;
        //default jsmind opts
        var __def__ = {
            container: '',          //'jsmind_container'-- id of the container   
            btnContainer: '',     //'#btn_cnter'
            editable: false,        // you can change it in your opts
            theme: 'org',           // 主题
            mode: 'side',           // full or side
            support_html: true,
            multiple: false,     //支持多选
            allowUnsel: true,    //允许不选
            disableRoot: false,
            root_id: 'root',
            role: 'super_admin',
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
            default_event_handle: {  //屏蔽jsmind组件默认事件
                enable_mousedown_handle: false,
                enable_click_handle: false,
                enable_dblclick_handle: false
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
            },
            nodeClick: function (om) {
                console.log(om);
                console.log(this);
            }
        };
        this.opts = $.extend(true,{}, __def__,options);
        console.log(this.opts);
        if (!this.opts.container) {
            logger.error('container should not be null or empty.');
            return;
        }
        this.jmcnter = $('#' + this.opts.container);
       
        if (this.opts['btn_cnter']) {
            this.jmbtncnter = $('#' + this.opts.btn_cnter);
        }
        this.jm = new jsMind(this.opts);        
        this.inited = false;
        this.init();
        return this;
    };

    om.prototype = {
        init: function () {
            if (this.inited) { return; }
            this.inited = true;
            this.jmcnter.addClass('orgmind');
            this.cnterInit();   //盒子初始化
            this.mindInit();    //图形初始化
            this.btnsInit();    //关联按钮初始化
            // var that =this;
            // var jm =that.jm;
            // var jmcnter =that.jmcnter;
            // var jminner =that.jminner;
            // var jmnodes =that.jmnodes;
            // switch (this.use) {
            //     case 'admin':   //用于配置管理员
            //         refreshAdmin();
            //         function refreshAdmin() {
            //             jmnodes.on('click', function (e) {
            //                 var btnAdd = $('#panel .btnAdd');
            //                 if (e.target.tagName.toLowerCase() !== 'jmnode') {
            //                     console.log('clear')
            //                     jm.select_clear();
            //                 }
            //                 var nd = jm.get_selected_node();
            //                 console.log(nd);
            //                 if(nd&&(nd.id===jm.get_root().id)){
            //                     return;
            //                 }
            //                 btnAdd.toggleClass('disabled', nd === null);  //选中下级机构才可以添加管理员
            //                 $('#panel button.btnRefresh').click(); //选中任意机构都会刷新表格，显示对应机构的管理员
            //             });
            //             refresh(jm, function () {
            //                 jmnodes.find('.root').addClass('disabled');
            //                 jminner.css({
            //                     padding:'0 20px',
            //                     overflow:'hidden'
            //                 });
            //                 setTimeout(function(){
            //                     jminner.css({
            //                         overflowY:'auto'
            //                     });
            //                 },100)
            //             });
            //         }
            //         break;


            //     case 'switch':  //用于管理员切入不同的机构
            //         refresh(jm, function () {
            //             jm.select_node($.cookie('org_id'));
            //             var nd = jm.get_selected_node()?jm.get_selected_node():jm.get_root();
            //             var orgBtn=$('#btnJmSwitch .orgBtn').text(nd.topic);
            //             jmnodes.on('click', function (e) {
            //                 if (e.target.tagName.toLowerCase() !== 'jmnode') {
            //                     jm.select_node($.cookie('org_id'));
            //                 }else{
            //                     nd = jm.get_selected_node();
            //                     if(nd===null){
            //                         jm.select_node($.cookie('org_id'));
            //                     }else{
            //                         orgBtn.text(nd.topic);
            //                         $.cookie('org_id',nd.id);
            //                     }
            //                     $('ul.sidebar-menu li.active>a[data-pjax]').click();
            //                 }
            //             });
            //         });
            //         break;

            //     case 'select':  //用于管理员切入不同的机构
            //         refresh(jm, function () {
            //             jm.select_node($.cookie('org_id'));
            //             jm.select_clear();
            //             jm.disable_edit();
            //             jmnodes.find('jmnode.root').addClass('disabled');
            //             jmnodes.data('orgs',[]);
            //             jmnodes.find('jmnode.selected').removeClass('selected');
            //             jmnodes.off('click').on('click', function (e) {
            //                 if(e.target.tagName.toLowerCase()==='jmnode'&&!$(e.target).hasClass('root')){
            //                     var i = $(this).data('orgs').indexOf($(e.target).attr('nodeid') * 1);
            //                     $(e.target).toggleClass('selected');
            //                     if($(e.target).hasClass('selected')){
            //                         if(i===-1){
            //                             $(this).data('orgs').push($(e.target).attr('nodeid') * 1);
            //                         }
            //                     }else{
            //                         if(i!==-1){
            //                             $(this).data('orgs').splice(i, 1);
            //                         }
            //                     }
            //                     console.log($(this).data('orgs'));
            //                 }
            //             });
            //         });
            //         break;
            //     default:
            //         logger.error('"new orgMind(use,opts)" only supports 3 uses : edit|admin|switch');
            // }
            // create instance of function provider
        },
        cnterInit: function () {  //给容器绑定单击事件，通过冒泡触发
            var that = this,
                jm=that.jm,
                opts=that.opts,
                cnter = that.jmcnter;
            cnter.off().on('click', function (e) {
                var jn = $(e.target);
                console.log(that);
                if (opts.multiple) {
                    console.log('11111')
                    if (jn.prop('tagName').toLowerCase() === 'jmnode') {
                        that['selected'] = [];
                        jn.toggleClass('selected');
                        cnter.data('sel')
                        cnter.find('jmnode.selected').each(function () {
                            that.selected.push(jm.get_selected_node($(this).attr('nodeid')));
                        });
                    }
                } else {
                    console.log('222222')

                    if (jn.prop('tagName').toLowerCase() === 'jmnode') {
                        jm.select_node($(jn).attr('nodeid'));
                        that['selected'] = jm.get_selected_node();
                    }
                }
                if(jn.prop('tagName').toLowerCase() === 'jmnode' && that.opts.nodeClick){ //点击节点的回调
                    that.opts.nodeClick(that);
                }
                console.log(that['selected']);
            })
        },

        btnsInit: function () {
            var that = this;
            if (that.opts.btnContainer) {
                var jm = that.jm;
                var jmbtncnt = $('#'+that.opts.btnContainer);
                var btnAdd = jmbtncnt.find('.btnAdd');
                var btnEdit = jmbtncnt.find('.btnEdit');
                var btnDel = jmbtncnt.find('.btnDel');
                var btnExport = jmbtncnt.find('.btnExport');
                var btnImport = jmbtncnt.find('.btnImport');
                var btnRefresh = jmbtncnt.find('.btnRefresh');
                btnAdd.on('click', fnAdd);               //添加机构
                btnEdit.on('click', fnEdit);             //编辑机构
                btnDel.on('click', fnDel);               //删除机构
                btnExport.on('click', fnExport);               //删除机构
                btnImport.on('click', fnImport);               //删除机构
                btnRefresh.on('click', that.refresh);    //刷新机构树
                function fnAdd() {
                    var btn=$(this);
                    btn.prop('disabled',true);
                    var nodeSel = that.selected,
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
                            btn.prop('disabled',false);
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
                }
                function fnEdit() {
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
                }
                function fnDel() {
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
                }
                function fnExport() {
                    alert('暂不支持，敬请期待')
                }
                function fnImport() {
                    alert('暂不支持，敬请期待')
                }

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
            }
        },
        mindInit: function () {
            var that = this,
                jm=that.jm,
                opts=that.opts,
                jmcnter=that.jmcnter;
            that.ajaxMind()
        },
        refresh: function (cb) {
            this.selected=this.opts.multiple?[]:null;
            var that=this;
            this.update(cb);
        },
        update: function (cb) {
            var that=this;
            this.ajaxMind(function (that) {
                !(cb instanceof Function) || cb(that);
            });
        },
        redrawMind: function (cb) {
            var that = this,
                jm=that.jm,
                opts=that.opts,
                jmcnter=that.jmcnter;
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
                "data": that.mind
            })
            var jmroot=jmcnter.find('jmnode.root');
            if(opts.disableRoot){
                jmroot.addClass('disabled');
            }else{
                if(this.opts.multiple){
                    if(Array.isArray(this['selected'])&&this['selected'].length>0){
                        for(i in this.selected){
                            jmcnter.find('jmnode[nodeid='+ this.selected[i].id +']').addClass('selected');
                        }
                    }
                }else{
                    if(this['selected']==undefined||this['selected']==null){
                        if(!opts.allowUnsel){
                            jmroot.click();
                        }
                    }else{
                        jm.select_node(this['selected'].id);
                    }
                }                    
            }
            if (cb instanceof Function) {
                cb(that);
            }
        },
        nodeAdd: function (opts, cb) {
            $.actPost('/common/orgtree/add', {
                topic: opts.topic,
                parentid: opts.parentid,
                orgCode: opts.orgCode
            }, function (data) {
                if (data.rt === '0000') {
                    if (cb) {
                        ajaxMind(cb);
                    }
                }
            }, '添加', '机构')
        },
        ajaxMind: function (cb) {  //获取机构树mind数据刷新至页面，cb支持回调
            var that = this;
            $.silentGet('/common/orgtree/mind', {}, function (data) {
                if (data.rt === '0000') {
                    if (data.data.length === 0) {
                        $.silentPost('/common/orgtree/add', {
                            topic: '移动控制平台',
                            orgCode: 'root',
                            parentid: 0
                        }, function (data) {
                            if (data.rt === '0000') {
                                ajaxMind(cb);
                            }
                        })
                    } else {
                        data.data[0]['isroot'] = true;
                        that['mind'] = data.data;
                        that.redrawMind(cb);
                    }
                }
            }, '获取', '机构数据')
        },
        getMind: function () {
            return this['mind'];
        }
    };

    // export orgmind
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = om;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () { return om; });
    } else {
        $w[__name__] = om;
    }
})(typeof window !== 'undefined' ? window : global);