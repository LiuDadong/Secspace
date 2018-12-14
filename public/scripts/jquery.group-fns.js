$.isJson = function (obj) {
    return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}
$.handleECode = function () {
    var dt = arguments[1],
        act = arguments[2] ? arguments[2] : (arguments[0] ? '操作' : ''),
        aim = arguments[3] ? arguments[3] : '',
        okText,
        errorText;
    switch (dt.rt) {
        case '0':
        case 0:
        case '0000':    //操作成功
            okText = aim + act + dt.desc;
            if (arguments[0] === false) {//弱静默  若设置成false 错误时会有提示
                return;
            }
            break;
        case '0001':    //操作失败
            errorText = act + dt.desc;
            break;
        case '9001':    //操作失败
            setTimeout(function(){
                
            },1000)
            break;
        // case '3009':
        //     break;
        default:
            errorText = dt.desc ? dt.desc : '未收录错误';
    }
    if (arguments[0] !== null) {
        if (okText) {
            warningOpen(okText, 'primary', 'fa-check');
        }
        if (errorText) {
            console.warn('请求异常rt=' + dt.rt + ',' + errorText)
            warningOpen(errorText, 'danger', 'fa-bolt');
        }
    }
};
$.kindAjax = function (ecode, method, url, dt, cb, act, aim) {
    var xhr = $.ajax({
        type: method,
        url: url,
        data: dt,
        timeout: 60000,          // 设置超时时间
        dataType: "json",
        success: function (data) {
            $.handleECode(ecode, data, act, aim)
            cb(data);
        },
        error: function (jqXHR, textStatus) {  //
            console.error(textStatus);
            jqXHR.abort();
            // $.cookie('sid', '', { expires: -1 });
            // window.location.reload()   //刷新当前页面,最终应该转到登录界面
        },
        complete: function (xhr, status) {
            if (status == 'timeout') {
                xhr.abort();    // 超时后中断请求
                alert("网络超时，请刷新");
                location.reload();
            }
        }
    })
};

$.silentAjax = function (method, url, dt, cb, act, aim) {  //静默ajax
    $.kindAjax(false, method, url, dt, cb, act, aim);
}
$.silentGet = function (url, dt, cb, act, aim) {  //静默get
    $.silentAjax('get', url, dt, cb, act, aim);
}
$.silentPost = function (url, dt, cb, act, aim) {  //静默post
    $.silentAjax('post', url, dt, cb, act, aim);
}
$.nullAjax = function (method, url, dt, cb, act, aim) {  //静默ajax
    $.kindAjax(null, method, url, dt, cb, act, aim);
}
$.nullGet = function (url, dt, cb, act, aim) {  //静默get
    $.nullAjax('get', url, dt, cb, act, aim);
}
$.nullPost = function (url, dt, cb, act, aim) {  //静默post
    $.nullAjax('post', url, dt, cb, act, aim);
}
$.actAjax = function (method, url, dt, cb, act, aim) { //有提示ajax
    $.kindAjax(true, method, url, dt, cb, act, aim);
}
$.actGet = function (url, dt, cb, act, aim) { //有提示get
    $.actAjax('get', url, dt, cb, act, aim);
}
$.actPost = function (url, dt, cb, act, aim) { //有提示post
    $.actAjax('post', url, dt, cb, act, aim);
}

$.proAjax = function (method, url, dt) {  //异步Promised对象ajax
    return new Promise(function (resolve, reject) {
        $.kindAjax(null, method, url, dt, function (data) {
            resolve(data);
        });
    })
}
$.proGet = function (url, dt) {  //异步Promised对象get
    return $.proAjax('get', url, dt);
}
$.proPost = function (url, dt) {  //异步Promised对象post
    return $.proAjax('post', url, dt);
}

$.proAll = function (ecode, pros, cb, act, aim) { //有提示post
    Promise.all(pros).then(function (datas) {
        if (datas[0] !== undefined && datas[0].rt !== undefined) {
            var rts = [datas[0].rt], difDatas = [datas[0]];
            if (datas.length > 1) {
                for (var i = 1; i < datas.length; i++) {
                    if ($.inArray(datas[i].rt, rts) == -1) {
                        rts.push(datas[i].rt);
                        difDatas.push(datas[i]);
                    }
                }
            }
            if (rts.length > 1) {
                for (var i = 0; i < difDatas.length; i++) {
                    if (difDatas[i].rt !== '0000') {
                        $.handleECode(ecode, difDatas[i], act, aim)
                        break;
                    }
                }
            } else {
                $.handleECode(ecode, datas[0], act, aim)
            }
            console.info('datas:', datas)
            console.info('rts:', rts)
            cb(datas, rts)
        }


    })
}


$.dealRt3009 = function (policy_list) {
    var cont = $('<div>').ScrollList({
        inputList: policy_list,
        elesTop: ['序号', '操作对象', '正在被以下策略使用'],
        elesDemo: [
            '<span class="counter"></span>',
            '<span item-key="aim"></span>',
            '<span item-key="policies"></span>',
        ],
        widthProportion: [0.5, 1, 1.5],
        fnValByKey: function (k, v) {
            switch (k) {
                case 'policies':
                    var htmlPolicies = '',
                        textPolicies = '';
                    if (v instanceof Array) {
                        var ptype = '';
                        for (var j = 0; j < v.length; j++) {
                            switch (v[j].policy_type) {
                                case 'geofence':
                                    ptype = '地理围栏策略';
                                    pt='rail';
                                    break;
                                case 'device':
                                    ptype = '设备策略';
                                    pt='dev';
                                    break;
                                case 'complicance':
                                    ptype = '合规策略';
                                    pt='comp';
                                    break;
                                case 'timefence':
                                    ptype = '时间围栏策略';
                                    pt='rail';
                                    break;
                                default:
                                    ptype = '未知策略';
                                    pt='null';
                            }
                            if (j == v.length - 1) {
                                textPolicies = v[j].name+'('+pt+')';
                                htmlPolicies += '<span title="' + ptype + '">' + v[j].name + '</span>'
                            } else {
                                textPolicies = v[j].name+'('+pt+')、';
                                htmlPolicies += ('<span title="' + ptype + '">' + v[j].name + '</span>、')
                            }
                        }
                        v = textPolicies;
                    } else {
                        console.error('policy_list', policy_list);
                    }
                    break;
                default:
            }
            return v;
        }
    });
    $.dialog('list', {
        title: '以下策略暂无法禁用',
        content: cont
    });
}



$.fn.tablePaging = function () {
    this.data("fnDealKeyVal")()
}

$.fn.iptsReset = function () {
    for (var i = 0; i < this.length; i++) {
        var e = $(this[i]), TT = '';
        TT = e.prop('tagName').toLowerCase();
        TT += e.prop('type') ? ':' + e.prop('type').toLowerCase() : '';
        switch (TT) {
            case "input:radio":
                break;
            case "input:checkbox":
                e.prop('checked', false);
                break;
            case "select:select-one":
                $("option:first", e).prop("selected", true)
                break;
            case "file":
                e[0].files[0] = null;
                //nextImg.attr('stc',nextImg.data('src'));
                break;
            default:
                e.val('');
        }
        e.change();
    }
    return this;
}


$.fn.jsonSerialize = function () {
    var o = {};
    var a = this.serializeArray();
    var $radio = $('input[type=radio],input[type=checkbox]', this);
    var temp = {};
    $.each($radio, function () {
        if (!temp.hasOwnProperty(this.name)) {
            if ($("input[name='" + this.name + "']:checked").length == 0) {
                temp[this.name] = "";
                a.push({ name: this.name, value: $("input[name='" + this.name + "']").prop('disabled') ? "-1" : "0" });
            }
        }
    });
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });

    // return jQuery.param(a);
    return o;
};



//根据url调整边栏和面包屑导航样式
$.activeSidebar = function (actHref) {
    var iClass, aText, aHref, aLi = [],
        openLi = $('ul.sidebar-menu>li:has(a[href="' + actHref + '"])');
    // 调整边栏样式
    openLi.siblings('li').removeClass('open active')
        .find('ul.submenu').hide()
        .find('li.active').removeClass('active');
    openLi.addClass('active').toggleClass('open', openLi.find('ul.submenu').length === 1)
        .find('ul.submenu>li:has(a[href="' + actHref + '"])').addClass('active')
        .siblings('li.active').removeClass('active');

    //获取更新面包屑导航所需元素要素
    var pagetitle, //页标题
        txt1, //一级菜单文本
        txt2; //二级菜单文本
    var li1 = openLi.find('a>i');
    txt1 = li1.next('span').text();
    aLi.push({
        i: li1.clone(false),
        a: li1.closest('a').clone(false).text(txt1)
    });
    $('.header-title>h1').text(txt1);
    pagetitle = 'SecSpace-' + txt1;
    var li2 = openLi.find('ul.submenu>li.active>a');
    if (li2.length === 1) {
        txt2 = li2.find('span').text();
        aLi.push({
            a: li2.clone(false).text(txt2)
        })
        $('.header-title>h1').text(txt2);
        pagetitle = 'SecSpace-' + txt2;
    }
    document.title = pagetitle;
    var bc = $('ul.breadcrumb').empty();
    for (var i = 0; i < aLi.length; i++) {
        var li = $('<li>');
        if (aLi[i].i) {
            li.append(aLi[i].i);
        }
        li.append(aLi[i].a);
        bc.append(li);
    }
}

$.fn.fnInit = function () {
    if (this.length === 1) {
        if (this.hasClass('append-box')) {   //组件:追加盒子初始化
            /**
             * 追加盒子组件设计思路：
             * 1、根据类append-box识别组件盒子，组件盒子除了包含append-box类名以外，还必须包含以下直接子元素
             *      <input type="hidden" name="xxxxx">   //实时存储追加成员的所有值，
             *      <div class="item">   //可以追加的成员，必须
             *          <---任意含有name属性的可通过val()方法获取其值的:input类元素区域--->
             *          <input type="text" name="xxxxx" placeholder="xxxxxx" class="form-control" />
             *          <div class="form-group">
             *              <label class="col-sm-4 control-label no-padding-right">xxxxx</label>
             *              <div class="col-sm-8">
             *                  <input type="text" name="xxxxx" placeholder="xxxxxx" class="form-control" />
             *              </div>
             *          </div>
             *          <---/任意含有name属性的可通过val()方法获取其值的:input类元素区域---> 
             *          <i class="fa fa-minus-circle primary"></i>   //用于删除或清空所属成员的小按钮，必须是.item的直接子元素
             *      </div>
             *      <button class="btn btn-primary">追加成员按钮</button>
             * 2、appendCheck---绑定至组件盒子的实时控制函数
             *      a.当只有一个成员且成员中的:input均为空时，隐藏其中的图标元素<i class="fa fa-minus-circle primary"></i>，否则显示；
             *      b.当成员个数等于或大于组件设定的最大长度maxLength或者所有.item中的:input元素有空值''时，禁用追加按钮，否则激活追加按钮；
             *      c.实时将有效成员(成员中:input的不全为空)中的值序列化成json对象push至$('input[type=hidden]').data('arrData')中；
             *      
             */


            // 数据准备
            var box = this,
                maxLength = 10;   // 最多追加的成员个数
            if (arguments[0]) {  //也可根据输入初始化设置参数，设置修改maxLength
                maxLength = arguments[0].maxLength ? arguments[0].maxLength : 10;
            }


            box.find('.item>i').addClass('fa fa-minus-circle primary');
            box.find('button').attr('type', 'button').addClass('btn btn-primary');  //避免button因没有设置type类型而默认为submit类型按钮，进而点击时触发所属form的submit行为
            box.find('.item:first').nextAll('.item').remove();
            box.find('.item :input').iptsReset();  //自定义的:input类元素重置方法reset
            // 定义组件的控制函数，主要用于控制样式和获取数据
            if (!box.appendCheck) {
                box.appendCheck = function () {

                    //只有一个全空成员时隐藏删除/清空按钮
                    var emp = true;
                    if (box.find('.item').length === 1) {
                        box.find('.item :input[name]').each(function () {
                            if ($(this).val()) {
                                emp = false;
                            }
                        })
                    } else {
                        emp = false;
                    }
                    box.find('.item i').toggleClass('hidden', emp);
                    var appendBtn = box.find('button').prop('disabled', false);
                    var noRepeatIpts = box.find('.item .no-repeat').removeClass('danger');
                    if (noRepeatIpts.length > 1) {
                        for (var i = 0; i < noRepeatIpts.length - 1; i++) {
                            for (var j = i + 1; j < noRepeatIpts.length; j++) {
                                if ($(noRepeatIpts[i]).val() === $(noRepeatIpts[j]).val()) {
                                    $(noRepeatIpts[i]).addClass('danger');
                                    $(noRepeatIpts[j]).addClass('danger');
                                    appendBtn.prop('disabled', true);
                                }
                            }
                        }
                    };


                    //超过设定长度时禁止继续添加
                    if (box.find('.item').length >= maxLength) {
                        appendBtn.prop('disabled', true)
                    }
                    //如果有item含有空的:input则不让继续添加
                    box.find('.item :input').each(function () {
                        if (!$(this).val()) {
                            appendBtn.prop('disabled', true);
                        }
                    })

                    //实时刷新数据
                    box.find('input[type=hidden]').data('arrData', [])
                    var arrData = box.find('input[type=hidden]').data('arrData'),
                        iptNum = box.find('.item:first :input').length,
                        onlyname, dt, hasVal, ipdHid;
                    if (iptNum > 1) {
                        box.find('.item').each(function () {
                            dt = {};
                            hasVal = false;
                            $(this).find(':input').each(function () {
                                if ($(this).val() == '') {
                                    box.find('button').attr('disabled', 'disabled');
                                }
                                if ($(this).val()) {
                                    hasVal = true;
                                }
                                dt[$(this).attr('name')] = $(this).val();
                            })
                            if (hasVal) {
                                arrData.push(dt);
                            }
                        })
                    } else if (iptNum == 1) {
                        box.find('.item').each(function () {
                            dt = $(this).find(':input').val();
                            if (dt) {
                                arrData.push(dt);
                            }
                        })
                    } else {
                        console.error('.item中必须至少含有一个:input类元素。')
                    }

                    if (box.closest('form').data('fns') !== undefined) {  //尝试检查可能所属的表单预先绑定的数据检查函数check
                        try {
                            box.closest('form').data('fns').check();
                        } catch (err) {
                            console.error(err)
                        }
                    }
                };
            }
            // 组件元素初始化
            box.appendCheck();

            // 给input[type=hidden]绑定自定义事件data事件，便于通过脚本触发，将预先存储在其data('arrData')中的值显示到组件中
            box.find('input[type=hidden]').off('data').on('data', function (event, data) {
                var arrData = data.arrData;
                var item0 = $($(this).closest('.append-box').find('.item')[0]);
                item0.nextAll('.item').remove();
                item0.find(':input').val('');
                $(this).data('arrData', arrData);
                if (typeof arrData == 'object' && arrData.length > 0) {
                    for (var i = 0; i < arrData.length; i++) {
                        if (i == 0) {
                            showDataInItem(arrData[0], item0);
                        } else {
                            var newItem = item0.clone(true);
                            showDataInItem(arrData[i], newItem)
                            box.find('.item:last').after(newItem);
                            newItem = null;
                        }
                    }
                    function showDataInItem(dt, item) {
                        switch (typeof dt) {
                            case 'object':
                                for (k in dt) {
                                    item.find(':input[name=' + k + ']').val(dt[k]);
                                }
                                break;
                            default:
                                item.find(':input').val(dt);
                        }
                    }
                } else {
                    console.warn('组件append-box初入的数据arrData必须是数组格式的字符串或对象')
                }
                box.appendCheck();

            })

            // 监控第一个.item（将用于复制追加）中的所有:input值的变化，再通过appendCheck函数实时控制整个组件
            box.find('.item :input').off('input propertychange change').on('input propertychange change', function () {

                $(this).val($(this).val().replace(/\s/g, ''));
                box.appendCheck();
            })

            // 给第一个.item（将用于复制追加）中的图标按钮<i>元素绑定click时间，只有一个.item时清空其中所有:input的值，否则删除当前.item
            box.find('.item i').addClass('cursor').off('click').on('click', function () {
                if (box.find('.item').length == 1) {
                    $(this).closest('.item').find(':input').reset();
                } else {
                    $(this).closest('.item').remove();
                }
                box.appendCheck();
            });

            // 给追加按钮绑定追加方法

            box.find('button').off('click').on('click', function () {
                var item = box.find('.item:first').clone(true);
                item.find(':input').val('');
                box.find('.item:last').after(item);
                box.appendCheck();
            });
            return box;
        }
    } else {
        console.warn('fnInit()只支持一个.need-init元素的初始化,如有多个匹配的元素，可以使用each(function(){$(this).fnInit()})的方式初始化组件');
        alert('组件初始化失败，详情见Console!');
        return this;
    }
}

$.fn.fnShowData = function () {
    /**用途：用于将绑定在目标元素form、table上的数据data('data'),渲染到元素内所有带有显示要件（如name、data-key）的元素上
     * 用法：
     *      数据准备--在调用该方法之前，将要显示的数据data通过.data('data',data)绑定到目标元素上，
     *      函数准备--如果需要修正数据，需重定义存储目标元素.data('fns',{})中的修正函数valByKey，语法如下：
     *      .data('fns',{
     *          valByKey:function(k,v){
     *              switch(k){
     *                  case 'keyname':
     *                      if(v===xxx){
     *                          v=newV1
     *                      }else{
     *                          v=newV2
     *                      }
     *                      break;
     *                  …………
     *                  default:
     *                      
     *              }
     *              return v;
     *          }
     *      })
     */
    if (this.data('data')) {
        switch (this.prop('tagName').toLowerCase()) {
            case 'form':
                var item = this.data('data');
                this.find(':input[name]').each(function () {
                    var k = $(this).attr('name'),
                        val = item[k],
                        ipt = $(this),
                        tn = ipt.prop('tagName').toLowerCase(),
                        tp = ipt.prop('type').toLowerCase(),
                        tntp = tp ? tn + ':' + tp : tn;
                    switch (tntp) {
                        case 'input:radio':
                        case 'input:checkbox':
                            ipt.prop('checked', ipt.val() == val);
                            break;
                        default:
                            ipt.val(val);
                    }
                    try {
                        ipt.change();
                    } catch (err) {
                        console.error(err);
                    }
                })
                break;
            case 'table':
                /**
                 * table必须具备的元素结构
                 * <table>
                 *      <thead>
                 *          <th>标题1</th>
                 *          <th>标题2</th>
                 *          <th>标题3</th>
                 *          <th>标题4</th>
                 *          ……
                 *      </thead>
                 *      <tbody class="tbDemo">
                 *          <td><span data-key="keyname1"></span></td>
                 *          <td><span data-key="keyname1"></span></td>
                 *          <td><span data-key="keyname1"></span></td>
                 *          <td><span data-key="keyname1"></span></td>
                 *          ……
                 *      </tbody>
                 *      <tbody class="tbHas"></tbody>
                 *      <tbody class="tbEmpty">
                 *          <td>要显示的文本</td>   //只要一个td
                 *      </tbody>
                 * </table>
                 */
                var list = this.data('data'),
                    th = this.find('thead'),
                    tbDemo = this.find('tbody.tbDemo'),
                    trDemo = tbDemo.find('tr'),
                    tbHas = this.find('tbody.tbHas'),
                    tbEmpty = this.find('tbody.tbEmpty'),
                    fnValByKey = this.data('fns').valByKey,
                    numCol;
                tbDemo.hide();
                tbHas.empty();
                if (th.find('tr>th').length === tbDemo.find('tr>td').length) {
                    numCol = th.find('tr>th').length;
                    tbEmpty.find('tr>td:only-child').attr('colspan', numCol).css('text-align', 'center');
                } else {
                    console.error('fnShowData检测到调用该方法的表格的表头列数与样本列数不等');
                    console.error(this);
                    console.error('thead.length=' + th.find('tr>th').length + ',tbody.length=' + tbDemo.find('tr>th').length)
                }
                if (list.length > 0) {
                    tbEmpty.hide();
                    tbHas.show().empty();
                    for (var i = 0; i < list.length; i++) {
                        var tri = trDemo.clone(true);
                        tri.data('data', list[i]);
                        tri.find('span[data-key]').each(function () {
                            var k = $(this).attr('data-key');
                            if (fnValByKey) {
                                $(this).text(fnValByKey(k, list[i][k]))
                            } else {
                                $(this).text(list[i][k]);
                            }
                        })
                        tbHas.append(tri);
                    }
                } else {
                    tbHas.hide().empty();
                    tbEmpty.show();
                }
                break;
            default:
                console.error('调用fnShowData()的元素不合法:');
                console.error(this[0]);
        }
    } else {
        console.error('调用fnShowData()的jquery对象data("data")不能为空或未定义')
    }

}

$.mdlMsg = function (option) {
    var mdlOpt = {
        dom: '#mdlMsg',
        type: 'info',
        title: true,
        body: true
    };
    $.extend(mdlOpt, option);
    var mdl = $(mdlOpt.dom),
        mdlHeader = mdl.find('.modal-header'),
        headerIcon = mdlHeader.find('i'),
        mdlTitle = mdl.find('.modal-title'),
        mdlBody = mdl.find('.modal-body'),
        mdlBtn = mdl.find('.modal-footer button.btn');
    mdlTitle.toggleClass('hidden', mdlOpt.title === false).html(mdlOpt.title);
    mdlBody.toggleClass('hidden', mdlOpt.body === false).html(mdlOpt.body);
    // 成功、信息、警告、危险四种样式
    mdl.toggleClass('modal-success', mdlOpt.type === 'success');
    headerIcon.toggleClass('glyphicon glyphicon-check', mdlOpt.type === 'success');
    mdlBtn.toggleClass('btn-success', mdlOpt.type === 'success');
    mdl.toggleClass('modal-info', mdlOpt.type === 'info');
    headerIcon.toggleClass('fa fa-envelope', mdlOpt.type === 'info');
    mdlBtn.toggleClass('btn-info', mdlOpt.type === 'info');
    mdl.toggleClass('modal-warning', mdlOpt.type === 'warning');
    headerIcon.toggleClass('fa fa-warning', mdlOpt.type === 'warning');
    mdlBtn.toggleClass('btn-warning', mdlOpt.type === 'warning');
    mdl.toggleClass('modal-danger', mdlOpt.type === 'danger');
    headerIcon.toggleClass('glyphicon glyphicon-fire', mdlOpt.type === 'danger');
    mdlBtn.toggleClass('btn-danger', mdlOpt.type === 'danger');
    mdl.modal({
        //remote:"test/test.jsp",//可以填写一个url，会调用jquery load方法加载数据
        backdrop: "static",//指定一个静态背景，当用户点击背景处，modal界面不会消失
        keyboard: true//当按下esc键时，modal框消失
    });
    return mdl;
}


$.dialog = function (type, opts) {
    if ($('#dialogBox').length == 0) {
        $('body').append($('<div id="dialogBox"></div>'));
    }
    var dialog = $('#dialogBox');
    var __def__ = {
        autoHide: false,
        maskClickHide:false,
        autoSize: true,
        cancel: function () { },
        cancelValue: null,
        confirm: function () { },
        confirmValue: null,
        content: "",
        effect: "",
        hasBtn: true,
        hasClose: true,
        hasMask: true,
        height: null,
        time: 999999999,
        title: "",
        type: "normal",  //normal,correct,error
        width: null,
        zIndex: 99999,
    };
    switch (type) {
        case 'confirm':
            opts.content = $('<div>').html(opts.content).css({
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.1em',
            });
            opts = $.extend(
                true,
                __def__,
                {
                    title: '操作确认',
                    confirmValue: '确定',
                    cancelValue: '取消',
                },
                opts
            );

            break;
        case 'list':
            opts = $.extend(
                true,
                __def__,
                {
                    hasClose: true,
                    hasBtn: false
                },
                opts
            );
            break;
        case 'info':
            opts = $.extend(
                true,
                __def__,
                {
                    time: 5000,
                    hasClose: true,
                    hasBtn: false
                },
                opts
            );
            break;
        default:
    }
    dialog.dialogBox(opts);
    $('.dialog-box .dialog-btn').css({
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontSize: '0.8em',
        padding: '0 60px 20px'
    })
}
