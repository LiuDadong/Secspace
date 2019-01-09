$.objRegex= {  //输入正则控制
    account: {   //account表示账号类参数,在输入元素上添加类“re-account”,便可实现对元素输入的正则控制
        pattern: /^[a-zA-Z0-9_-]{4,16}$/,   //检测输入的值是否合法
        info: "请输入4-16位英文、数字、_或-"   //用户设置titile作为鼠标移入时的提示
    },
    name_mix: {
        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{2,16}$/,
        info: "请输入2-16位中英文、数字、_或-"
    },
    appname: {
        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,20}$/,
        info: '1-20个中英文、数字或"-_"'
    },
    description: {
        pattern: /^[\s\S]{0,60}$/,
        info: "不超过60个字符"
    },
    phone: {
        pattern: /^[\d]{11}$/,
        info: "请输入11位数字"
    },
    email: {
        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
        info: "请输入合法邮箱地址"
    },
    password: {
        pattern: /^[a-zA-Z\d_]{6,16}$/,
        info: "请输入6-16位字母或数字"
    },
    number6: {
        pattern: /^[\d]{6}$/,
        info: "请输入6位数字"
    },
    wifi: {
        pattern: /^[\s\S]{0,30}$/,
        info: "请输入30位以内字符"
    },
    version: {
        pattern: /^[a-zA-Z0-9.]{2,16}$/,
        info: "请输入16位以内字符,建议格式v1.01"
    },
    keyword: {
        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,16}$/,
        info: "请输入16位以内中英文、数字、_或-"
    },
    url: {
        pattern: /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/,
        info: "请输入合法url"
    },
    package: {
        pattern: /^[a-zA-Z0-9\._-]{0,50}$/,
        info: "请输入50位以内英文、数字或'._-'"
    }
};
$.iptRegExpCtrl =function (ipt){
    var ctrlRegex = $(ipt).attr('ctrl-regex');
    if(ctrlRegex){     //正则检查
        var irec = $.objRegex[ctrlRegex];
        if (irec) {
            var yesno=irec.pattern.test($(ipt).val());
            if($(ipt).closest('.append-box').length==0){
                $(ipt).closest('.form-group').toggleClass('has-error',!yesno);
            }else{
                $(ipt).toggleClass('input-error',!yesno);
            }
            return irec.pattern.test($(ipt).val());
        } else {
            console.error('ctrl-regex="' + ctrlRegex + '"未定义');
        }
    }
    return true;
}


$.isJson = function (obj) {
    return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
};
$.arrKeyFlt = function (arr, key, flt) {
    return arr.filter(flt ? flt : function () {
        return true;
    }).map(function (item) {
        return key ? item[key] : item;
    });
};

$.indexOfArr = function (item, items) {   //获取成员对象item在数组中的下标
    var index = -1;
    if (item.id) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].id == item.id) {
                index = i;
                break;
            }
        }
    } else if (item.account) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].account == item.account) {
                index = i;
                break;
            }
        }
    } else {
        if (items.indexOf) {
            index = items.indexOf(item);
        } else {
            for (var i = 0; i < items.length; i++) {
                if (items[i] === item) {
                    index = i;
                    break;
                }
            }
        }
    }
    return index;
};


$.handleECode = function () {
    //arguments[0]: true则无论失败与否，都给出提示   false:则只有返回异常时给出提示，请求为rt=“0000”,则不提示
    //arguments[1]: 返回的json格式数据
    //arguments[2]: 操作文本：如“上传”、“添加”、“删除”等
    //arguments[3]: 操作对象：如“用户”、“文件”、“策略”等
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
        case '9053':    //请求成功，但是暂无数据
            return;
            break;
        case '0001':    //操作失败
            errorText = act + dt.desc;
            break;
        case '9001':    //操作失败
            setTimeout(function () {
                location.href = '/logout';
            }, 2000)
            if ($('.dialog-box .dialog-box-content').text() != "登陆已过期，请重新登陆。") {
                $.dialog('info', {
                    content: "登陆已过期，请重新登陆。"
                });
            }
            break;
        // case '3009':
        //     break;
        default:
            
            errorText = dt.desc ? dt.desc : '未收录错误';
            console.log(errorText);
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
                        for (var j = 0; j < v.length; j++) {
                            var objPcy=$.textPolicy(v[j].policy_type);
                            
                            if (j == v.length - 1) {
                                textPolicies = v[j].name + '(' + objPcy.tip + ')';
                                htmlPolicies += '<span title="' + objPcy.type + '">' + v[j].name + '</span>'
                            } else {
                                textPolicies = v[j].name + '(' + objPcy.tip + ')、';
                                htmlPolicies += ('<span title="' + objPcy.type + '">' + v[j].name + '</span>、')
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


$.getLicense = function (cb){
    $.silentPost('/common/license',{},function(data){
        cb(data);
    })
}

$.fn.iptsReset = function () {
    for (var i = 0; i < this.length; i++) {
        var e = $(this[i]), TT = '';
        TT = e.prop('tagName').toLowerCase();
        TT += e.prop('type') ? ':' + e.prop('type').toLowerCase() : '';
        switch (TT) {
            case "input:text":
            case "input:password":
                e.val('');
                break;
            default:
                
        }
        e.removeData();
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


$.fn.plugInit = function () {
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
                    var yesno=true,
                        emp = true;
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
                    var noRepeatIpts = box.find('.item input.no-repeat').removeClass('input-error');  //查重
                    if (noRepeatIpts.length > 1) {
                        for (var i = 0; i < noRepeatIpts.length - 1; i++) {
                            for (var j = i + 1; j < noRepeatIpts.length; j++) {
                                if ($(noRepeatIpts[i]).val() === $(noRepeatIpts[j]).val()) {
                                    $(noRepeatIpts[i]).addClass('input-error');
                                    $(noRepeatIpts[j]).addClass('input-error');
                                    yesno=false;
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
                    var ipdHid = box.find('input[type=hidden]').data('arrData', []),
                    arrData = box.find('input[type=hidden]').data('arrData'),
                    iptNum = box.find('.item:first :input').length,
                    dt, hasVal;
                    if(yesno){
                        if (iptNum > 1) {
                            box.find('.item').each(function () {
                                dt = {};
                                hasVal = false;
                                $(this).find(':input').each(function () {
                                    if ($(this).val() == '') {
                                        box.find('button').attr('disabled', 'disabled');
                                    }
                                    if ($(this).val()) {
                                        if($.iptRegExpCtrl(this)){
                                            hasVal = true;
                                        }else{
                                            yesno=false;
                                        }
                                    }
                                    dt[$(this).attr('name')] = $(this).val();
                                })
                                if (hasVal) {
                                    arrData.push(dt);
                                }
                            })
                            
                        } else if (iptNum == 1) {
                            box.find('.item').each(function () {
                                var ipt=$(this).find(':input'),
                                    dt = ipt.val();
                                    console.log(dt)
                                    if (dt) {
                                        if($.iptRegExpCtrl(ipt)){
                                            arrData.push(dt);
                                        }else{
                                            yesno=false;
                                        }
                                    }
                            })
                        } else {
                            console.error('.item中必须至少含有一个:input类元素。')
                        }
                        ipdHid.data('arrData',yesno?arrData:[]).val(yesno?JSON.stringify(arrData):'[]').change();
                    }else{
                        ipdHid.data('arrData',[]).val('[]').change();
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
            box.find('.item :input').off().on('input propertychange change', function () {
                $(this).val($(this).val().replace(/\s/g, ''));
                box.appendCheck();
            });

            // 给第一个.item（将用于复制追加）中的图标按钮<i>元素绑定click时间，只有一个.item时清空其中所有:input的值，否则删除当前.item
            box.find('.item i').addClass('pointer').off('click').on('click', function () {
                if (box.find('.item').length == 1) {
                    $(this).closest('.item').find('input').val('');
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
        console.warn('plugInit()只支持一个.need-init元素的初始化,如有多个匹配的元素，可以使用each(function(){$(this).plugInit()})的方式初始化组件');
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

$.dialogClose= function(cb) {
    $('.dialog-box-title span.dialog-box-close').click();
}
$.dialog = function (type, opts) {
    if ($('#dialogBox').length == 0) {
        $('body').append($('<div id="dialogBox"></div>'));
    }
    var dialog = $('#dialogBox');
    var __def__ = {
        width: null,
        height: null,
        zIndex: 1001,
        autoHide: false,
        maskClickHide: false,
        autoSize: true,
        cancel: function () { },
        cancelValue: null,
        confirm: function () { },
        confirmValue: null,
        confirmHide:true, //点击确认之后自动关闭对话框  false则不关闭
        content: "",
        effect: "",
        hasBtn: true,
        hasClose: true,
        hasMask: true,
        time: 0,
        title: "",
        type: "normal",  //normal,correct,error

    };
    switch (type) {
        case 'confirm':   //确认对话框
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
        case 'form':   //表单对话框
            opts.content = $('<div>').html(opts.content).css({
                fontSize: '1em',
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
        case 'list':    //列表对话框
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
        case 'info':    //消息对话框
            opts = $.extend(
                true,
                __def__,
                {
                    time: 3000,
                    hasClose: true,
                    hasBtn: false
                },
                opts
            );
            break;
        default:
    }
    var x = dialog.dialogBox(opts);
    $('.dialog-box .dialog-btn').css({
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontSize: '0.8em',
        padding: '0 60px 20px'
    });
    return x;
}


$.textPolicy=function(v){
    var obj={
        type:'',
        tip:''
    }
    switch (v) {
        //设备策略
        case 'device':
            obj.type = '设备策略';
            obj.tip = 'dev';
            break;
        //合规策略
        case 'complicance':
            obj.type = '合规策略';
            obj.tip = 'comp';
            break;
        //围栏策略
        case 'geofence':
            obj.type = '地理围栏';
            obj.tip = 'geo';
            break;
        case 'timefence':
            obj.type = '时间围栏';
            obj.tip = 'time';
            break;
        //应用策略
        case 'blackapp':
            obj.type = '黑名单策略';
            obj.tip = 'black';
            break;
        case 'whiteapp':
            obj.type = '白名单策略';
            obj.tip = 'white';
            break;
        case 'limitaccess':
            obj.type = '限制访问策略';
            obj.tip = 'limit';
            break;
        //客户端策略
        case 'customer':
            obj.type = '客户端策略';
            obj.tip = 'cstom';
            break;
        default:
            obj.type = '未知策略';
            obj.tip = '';
    }
    return obj;
}