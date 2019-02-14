/*
 * Released under BSD License
 * Copyright (c) 2014-2016 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

; (function ($w) {
    'use strict';
    // set 'OrgMind' as the library name.
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
            expandToDepth: 1,
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
                pspace: 16
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
            jmnodeClick: function (om) {    //标签jmnode点击事件
                //console.info(om);
            },
            jmnodesClick:function(om){      //标签jmnodes点击事件
                //console.info(om);
            },
            complete:function(om){      //首次图形绘制完毕之后的回调函数
                //console.info(om);
            }
        };
        this.opts = $.extend(true,{}, __def__,options);
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
            this.jmcnter.data('om',this).addClass('orgmind');
            this.cnterInit();   //盒子初始化
            this.btnsInit();    //关联按钮初始化
            this.ajaxMind();    //拉取图形数据并绘制
        },
        cnterInit: function () {  //给容器绑定单击事件，通过冒泡触发
            var that = this,
                jm=that.jm,
                opts=that.opts,
                cnter = that.jmcnter,
                clickTimer;
            cnter.on('click', function (e) {
                    var jn = $(e.target),
                    tagName=jn.prop('tagName').toLowerCase(),
                    nodeid=jn.attr('nodeid');
                    switch (tagName){
                        case 'jmnode':
                            if (opts.multiple) {
                                that['selected'] = [];
                                jn.toggleClass('selected');
                                cnter.find('jmnode.selected').each(function () {
                                    that.selected.push(jm.get_node($(this).attr('nodeid')));
                                });
                            } else {
                                jm.select_node($(jn).attr('nodeid'));
                                that['selected'] = jm.get_selected_node();
                                that.synOrgInfoPanel();
                            }
                            that.opts.jmnodeClick(that);
                            break;
                        case 'jmnodes':
                            that.opts.jmnodesClick(that);
                            break;
                        case 'jmexpander':
                            clearTimeout(clickTimer);
                            clickTimer=setTimeout(function(){
                                jm.toggle_node(nodeid);
                            },200)
                            break;
                        default:
                    }
                
            });
            cnter.on('dblclick', function (e) {
                clearTimeout(clickTimer);
                var jn = $(e.target),
                    tagName=jn.prop('tagName').toLowerCase(),
                    nodeid=jn.attr('nodeid'),
                    nodeRel=jm.get_node(nodeid);
                switch (tagName){
                    case 'jmexpander':
                        if(nodeRel.expanded){
                            deepCollapse(nodeid)
                        }else{
                            deepExpand(nodeid)
                        }
                        break;
                    default:
                }
                function deepExpand(nodeid){
                    jm.expand_node(nodeid);
                    jm.get_data('node_array').data.map(function(node){
                        if(node.parentid==nodeid){
                            deepExpand(node.id);
                        }
                    })
                }
                function deepCollapse(nodeid){
                    jm.collapse_node(nodeid);
                    jm.get_data('node_array').data.map(function(node){
                        if(node.parentid==nodeid){
                            deepCollapse(node.id);
                        }
                    })
                }
            });
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
                btnRefresh.on('click',function(){
                    that['theBtn']=$(this).prop('disabled',true);
                    that.refresh();
                });    //刷新机构树
                function fnAdd() {
                    var nodeSel = that.selected;
                    $.dialog('form', {
                        title: "添加机构",
                        width: 500,
                        height: null,
                        autoSize: true,
                        maskClickHide: true,
                        hasBtn: false,
                        hasClose: true,
                        hasMask: true,
                        confirmHide: true,
                        content:  '<form id="frmOrg" class="form-horizontal" role="form" style="width:400px;">\
                                        <input type="hidden" name="parentid" value="'+ nodeSel.id +'" />\
                                        <div class="form-group">\
                                            <label for="topic" class="col-sm-3 control-label no-padding-right">机构名称</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control require" name="topic" ctrl-regex="orgName" placeholder="机构树中显示的文本" autocomplete="off">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="orgCode" class="col-sm-3 control-label no-padding-right">机构码</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control require" name="orgCode" ctrl-regex="orgCode" placeholder="机构唯一标识码" autocomplete="off" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,\'\')">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <div class="col-sm-offset-3">\
                                                <div class="checkbox">\
                                                    <label>\
                                                        <input name="bindUserDevCard" type="checkbox">\
                                                        <span class="text">绑定人机卡</span>\
                                                    </label>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <div class="col-sm-2  col-sm-offset-4">\
                                                <button type="button" onclick="$.dialogClose()" class="btnBack btn btn-default">取消</button>\
                                            </div>\
                                            <div class="col-sm-2 col-sm-offset-1">\
                                                <input type="submit" class="btn btn-primary" disabled="">\
                                            </div>\
                                        </div>\
                                    </form>'
                    });
                    
                    var frmOrg = $('#frmOrg').MultForm({
                        addBtnTxt: '确认',
                        addAct: '/common/orgtree/add',
                        afterUsed: function (use) {
                            frmOrg.find('input[name=url]').remove();
                            frmOrg.find('input[name=bindUserDevCard]')
                                .prop('checked',nodeSel.data['bindUserDevCard'])
                                .closest('.checkbox').toggleClass('anti-cursor',$.local('org_id')!=0);
                        },
                        cbAfterSuccess: function (use) {  //提交成功之后的回调
                            try{
                                $(that['theBtn'])
                                .prop('disabled',false)
                                .removeClass('disabled')
                                .removeClass('unabled');
                            }catch(err){
                                console.error(err);
                            }
                            $.dialogClose();
                            that.ajaxMind();
                        }
                    });
                    frmOrg.usedAs('add');
                }
                function fnEdit() {
                    var nodeSel = that.selected;
                    $.dialog('form', {
                        title: "编辑机构",
                        width: 500,
                        height: null,
                        autoSize: true,
                        maskClickHide: true,
                        hasBtn: false,
                        hasClose: true,
                        hasMask: true,
                        confirmHide: true,
                        content:  '<form id="frmOrg" class="form-horizontal" method="POST" role="form" style="width:400px;">\
                                        <input type="hidden" name="id" value="'+ nodeSel.id +'" />\
                                        <div class="form-group">\
                                            <label for="topic" class="col-sm-3 control-label no-padding-right">机构名称</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control require" name="topic" ctrl-regex="orgName" placeholder="机构树中显示的文本" autocomplete="off">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="orgCode" class="col-sm-3 control-label no-padding-right">机构码</label>\
                                            <div class="col-sm-8">\
                                                <input type="text" class="form-control require" name="orgCode" ctrl-regex="orgCode" placeholder="机构唯一标识码" autocomplete="off" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,\'\')">\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <div class="col-sm-offset-3">\
                                                <div class="checkbox">\
                                                    <label>\
                                                        <input disabled="disabled" name="bindUserDevCard" type="checkbox">\
                                                        <span class="text">绑定人机卡</span>\
                                                    </label>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="form-group">\
                                            <div class="col-sm-2  col-sm-offset-4">\
                                                <button type="button" onclick="$.dialogClose()" class="btnBack btn btn-default">取消</button>\
                                            </div>\
                                            <div class="col-sm-2 col-sm-offset-1">\
                                                <input type="submit" class="btn btn-primary" disabled="">\
                                            </div>\
                                        </div>\
                                    </form>'
                    });
        
                    var frmOrg = $('#frmOrg').MultForm({
                        editBtnTxt: '保存',
                        editAct: '/common/orgtree/mod',
                        afterUsed: function (use) {
                            frmOrg.find('input[name=url]').remove();
                            frmOrg.find('input[name=bindUserDevCard]')
                                .prop('checked',nodeSel.data['bindUserDevCard'])
                                .prop('disabled',true);
                        },
                        cbAfterSuccess: function (use) {  //提交成功之后的回调
                            try{
                                $(that['theBtn'])
                                .prop('disabled',false)
                                .removeClass('disabled')
                                .removeClass('unabled');
                            }catch(err){
                                console.error(err);
                            }
                            $.dialogClose();
                            that.ajaxMind(function(t){
                                
                            });
                        }
                    });
                    frmOrg.data('item',{
                        topic: nodeSel.topic,
                        orgCode: nodeSel.data.orgCode,
                        id: nodeSel.id
                    });
                    frmOrg.usedAs('edit');
                }

                function fnDel() {
                    that['theBtn']=$(this).prop('disabled',true);
                    if(that['selected'].isroot){
                        warningOpen('根节点无法删除','danger','fa-bolt');
                        setTimeout(function(){
                            that['theBtn'].prop('disabled',false);
                        },1000)
                        return;
                    }
                    $.dialog('confirm', {
                        content: '<p>机构删除操作会删除机构本身,<br />以及属于该机构的所有数据及操作关系,<br />确认删除选中的机构及其子机构吗?</p>',
                        confirm: function () {
                            $.actPost('/common/orgtree/del', {
                                id: that.selected.id
                            }, function (data) {
                                $(that['theBtn']).prop('disabled',false);
                                if (data.rt === "0000") {
                                    jm.remove_node(that.selected);
                                    that.selected=jm.get_root();
                                    jm.select_node(that.selected);
                                    that.synOrgInfoPanel();
                                }
                            }, '删除');
                        },
                        cancel: function () {
                            $(that['theBtn']).prop('disabled',false);
                        },
                        title: '删除机构'
                    });
                }
                
                function fnExport() {
                    warningOpen('敬请期待','danger','fa-bolt');
                    return false;
                }
                function fnImport() {
                    warningOpen('敬请期待','danger','fa-bolt');
                    return false;
                }
            }
        },
        refresh: function (cb) {
            this.selected=this.opts.multiple?[]:null;
            var that=this,
                jm=that.jm,
                opts =that.opts,
                jmcnter =that.jmcnter,
                nodes=that.nodes;
            nodes.map(function(node){
                node['expanded']=false;
                return node;
            });
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
                "data": nodes
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
            
            if(opts.expandToDepth&&typeof opts.expandToDepth== 'number'){
                jm.expand_to_depth(opts.expandToDepth);
            }
            // jmcnter.find('jmnode').each(function(){
            //     $(this).attr('title',$(this).text());
            // });
            if (cb instanceof Function) {
                cb(that);
            }
            if(opts.complete){
                opts.complete(that);
            }
        },
        redraw: function (cb) {  //重绘、绘制图形并初始化图形事件
            var that = this,
                jm=that.jm;
            try{
                var oldNodeArray=jm.get_data('node_array').data,
                    newNodeArray=that.nodes;
                updateMind(oldNodeArray,newNodeArray);
                if (cb instanceof Function) {
                    cb(that);
                }
                function updateMind(oldNodeArray,newNodeArray){
                    if(newNodeArray.length>oldNodeArray.length){   //新增了节点 
                        var newNode=getNewNode(oldNodeArray,newNodeArray);
                        jm.expand_node(newNode.parentid);
                        jm.add_node(newNode.parentid, newNode.id, newNode.topic, {
                            orgCode:newNode.orgCode,
                            orgPolicy:newNode.orgPolicy,
                            orgUser:newNode.orgUser
                        });

                    }else if(newNodeArray.length===oldNodeArray.length){
                        var newNode=getNewNode(oldNodeArray,newNodeArray);
                        if(newNode){
                            jm.update_node(newNode.id, newNode.topic);
                            that.selected.data.orgCode = newNode.orgCode;
                            that.synOrgInfoPanel();
                        }
                    }else{
                        console.error('updateMind异常');
                    }
                    // that.jmcnter.find('jmnode').each(function(){
                    //     $(this).attr('title',$(this).text());
                    // });
                }

                function getNewNode(oldNodeArray,newNodeArray){
                    var newNode={};
                    for(var i=0;i<newNodeArray.length;i++){
                        newNode=newNodeArray[i];
                        for(var j=0;j<oldNodeArray.length;j++){
                            if(newNode.id===oldNodeArray[j].id){
                                if(newNode.orgCode!==oldNodeArray[j].orgCode||newNode.topic!==oldNodeArray[j].topic){
                                    return newNode;
                                }else{
                                    break;
                                }
                            }
                            if(j+1==oldNodeArray.length){
                                return newNode;
                            }
                        }
                    }
                }
            }catch(err){
                that.refresh(cb);
            }
        },
        ajaxMind: function (cb) {  //获取机构树mind数据刷新至页面，cb支持回调
            var that = this,pd={};
            if(that.opts['rootId']){
                pd={org_id:that.opts['rootId']}
            }
            $.silentGet('/common/orgtree/nodes', pd, function (data) {
                try{
                    $(that['theBtn'])
                    .prop('disabled',false)
                    .removeClass('disabled')
                    .removeClass('unabled');
                }catch(err){
                    console.error(err);
                }
                if (data.rt === '0000') {
                    if (data.data.length === 0) {
                        $.silentPost('/common/orgtree/add', {
                            topic: '总公司',
                            orgCode: 'root',
                            parentid: 0
                        }, function (data) {
                            if (data.rt === '0000') {
                                that.ajaxMind(cb);
                            }
                        })
                    } else {
                        data.data[0]['isroot'] = true;
                        that['nodes'] = data.data;
                        that.redraw(cb);
                    }
                }
            }, '获取', '机构数据')
        },
        synOrgInfoPanel:function () {
            $(this['theBtn']).prop('disabled',false);
            if(!Array.isArray(this.selected)){
                $('#topic').text(this.selected.topic||'--');
                $('#orgCode').text(this.selected.data.orgCode||'--');
                $('#orgUser').text(this.selected.data.orgUser||'--');
                $('#orgPolicy').text(this.selected.data.orgPolicy||'--');
            }
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