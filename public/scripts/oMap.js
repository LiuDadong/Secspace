/**
 * Created by Administrator on 2018/1/25.
 */

; (function ($w) {
    function CAmap(sAmapWrapId, sLnglatBoxClass = "lnglat", sRadiusBoxClass = "radius") {
        this.oAmapWrap = {
            ele: null,
            props: {
                id: sAmapWrapId,
                style: "height:430px;border:1px solid #888;position:relative;border-radius:6px;box-shadow:0 0 4px #444;overflow:hidden;padding:3px;"
            },
            maxStyle: "position:fixed;z-index:99999;top:0;left:0;right:0;bottom:0;padding:0;"
        };
        this.sLnglatBoxClass = sLnglatBoxClass;
        this.sRadiusBoxClass = sRadiusBoxClass;
        this.oAmapBox = {
            ele: null,
            tag: 'div',
            props: {
                id: 'amap',
                style: "height: 100%;border-radius: 4px;overflow:hidden;"
            }
        };
        this.oMapFuncEles = {
            mapSearchIpt: {
                ele: null,
                tag: 'input',
                props: {
                    type: "text",
                    id: 'iptSearch',
                    visibility: true,
                    onkeydown:"if(event.keyCode==13){return false;}",
                    style: "position:absolute;" +
                        "visibility:true;" +
                        "bottom:10px;right:82px;" +
                        "padding:0 0.5em;" +
                        "line-height: 34px;" +
                        "border-radius:4px!important;",
                    placeholder: '请输入地址关键字...'
                }
            },
            mapBtns: {
                oBtns: {
                    mapSearchBtn: {
                        ele: null,
                        tag: 'button',
                        props: {
                            id: 'btnSearch',
                            visibility: true,
                            title: '搜索',
                            style: 'bottom: 10px;right: 50px',
                            class: 'mbtn'
                        },
                        sInHtml: '<i class="icon glyphicon glyphicon-search"></i>'
                    },
                    mapInitBtn: {
                        ele: null,
                        tag: 'button',
                        props: {
                            id: 'btnInit',
                            visibility: true,
                            title: '重置',
                            style: 'bottom: 10px;right: 10px',
                            class: 'mbtn'
                        },
                        sInHtml: '<i class="icon glyphicon glyphicon-record"></i>'
                    },
                    mapResizeBtn: {
                        ele: null,
                        tag: 'button',
                        props: {
                            id: 'btnReat',
                            visibility: true,
                            style: 'top: 10px;right: 10px',
                            class: 'mbtn'
                        },
                        sInHtml: '<i title="大图" class="icon glyphicon glyphicon-fullscreen"></i>',
                        sInHtmlMin: '<i title="还原" class="icon glyphicon glyphicon-resize-small"></i>'
                    }
                },
                commonStyle: {
                    position: 'absolute',
                    border: '1px solid rgba(0,0,0,0.2)',
                    borderRadius: '3px',
                    background: '#fff',
                    color: '#999',
                    fontSize: '18px',
                    lineHeight: '36px',
                    textAlign: 'center',
                    width: '36px',
                    height: '36px'
                },
                hover: {
                    transform: 'scale(1.05)',
                    color: '#18A4DA'
                }
            }
        };
        this.oDependencies = {
            amap: {
                href: 'http://cache.amap.com/lbs/static/main1119.css',
                src: 'http://webapi.amap.com/maps?v=1.4.3&key=44ffc5b6029cb5a30b0a83e36577079d'
            },
            plugins: {
                src: 'http://cache.amap.com/lbs/static/es5.min.js'
            }
        };
        this.aInitCenter = [116.397428, 39.90923];
        this.iInitRadius = 300;
        this.aCenter = [116.397428, 39.90923];
        this.iRadius = 300;
        this.oMap = {};
        this.oCircle = {};
        this.oCircleEditor = {};
        this.oGeolocation = {};
        this.oPlaceSearch = {};
        this.oToolBar = {};
        this.run();
    }
    CAmap.prototype = {
        run: function () {
            var that=this;
            //加载地图依赖并初始化地图
            Promise.all([
                jsReady('//webapi.amap.com/maps?v=1.4.3&key=44ffc5b6029cb5a30b0a83e36577079d'),
                jsReady('//cache.amap.com/lbs/static/es5.min.js')
            ]).then(function(res){
                that.fnInEle();
                that.fnCreateMap();
                that.fnCreateGeoLocate();
                that.fnCreateCircle();
                that.fnCreateCircleEditor();
                that.fnCreatePlaceSearch();
                that.fnCreateToolBar();
                that.fnAddBtnEvent();
                that.fnMapInit();
            });
            function jsReady(src) {
                return new Promise(function (resolve, reject) {
                    var script = document.createElement('script'),
                        aim = document.getElementById('pjax-aim');
                    script.type = 'text/javascript';
                    script.charset = 'UTF-8';
                    script.src = src;
                    if (script.addEventListener) {
                        script.addEventListener('load', function () {
                            resolve({src:src});
                        }, false);
                    } else if (script.attachEvent) {
                        script.attachEvent('onreadystatechange', function () {
                            var target = window.event.srcElement;
                            if (target.readyState == 'loaded') {
                                resolve({src:src});
                            }
                        });
                    }else{}
                    aim.appendChild(script);
                });
            }

        },
        fnSetInit: function ([lng, lat], iRadius) {
            this.aInitCenter = [lng, lat];
            this.iInitRadius = iRadius;
            console.log([lng, lat], iRadius);
            this.fnMapInit();
        },
        /*功能键dom准备*/
        fnInEle: function () {
            this.oAmapWrap.ele = document.getElementById(this.oAmapWrap.props.id);
            if (this.oAmapWrap.props.style) {
                this.oAmapWrap.ele.setAttribute('style', this.oAmapWrap.props.style);
            }
            if (this.oAmapWrap.ele.innerHTML != '') {
                this.oAmapWrap.ele.innerHTML = '';
            }
            fnInsertEle(this.oAmapWrap.ele, this.oAmapBox); //向this.oAmapWrap.ele中插入this.oAmapBox
            /*插入搜索输入框*/
            fnInsertEle(this.oAmapWrap.ele, this.oMapFuncEles.mapSearchIpt);
            /*插入功能按钮*/
            for (i in this.oMapFuncEles.mapBtns.oBtns) {
                fnInsertEle(this.oAmapWrap.ele, this.oMapFuncEles.mapBtns.oBtns[i]);
                var btn = this.oMapFuncEles.mapBtns.oBtns[i].ele;
                var cs = this.oMapFuncEles.mapBtns.commonStyle;
                var hv = this.oMapFuncEles.mapBtns.hover;
                var unhv = {};
                for (p in cs) {
                    btn.style[p] = cs[p];
                }
                for (p in hv) {
                    unhv[p] = btn.style[p] ? btn.style[p] : '';
                }
                btn.addEventListener('mouseover', function () {
                    for (p in hv) {
                        btn.style[p] = hv[p];
                    }
                })
                btn.addEventListener('mouseout', function () {
                    for (p in unhv) {
                        btn.style[p] = unhv[p];
                    }
                })
            }
            function fnInsertEle(parentNode, oEle) {
                if (oEle.tag) {
                    oEle.ele = document.createElement(oEle.tag);
                } else {
                    oEle.ele = document.createElement('div');
                }
                if (oEle.props) {
                    for (p in oEle.props) {
                        oEle.ele.setAttribute(p, oEle.props[p])
                    }
                }
                if (oEle.events) {
                    for (i in oEle.events) {
                        oEle.ele.addEventListener(i, oEle.events[i]);
                    }
                }
                if (oEle.sInHtml) {
                    oEle.ele.innerHTML = oEle.sInHtml;
                }
                parentNode.append(oEle.ele);
            }
        },
        fnCreateMap: function () {
            this.oMap = new AMap.Map(this.oAmapBox.props.id, {
                resizeEnable: true
            });
        },
        fnCreateGeoLocate: function () {
            var that = this;
            that.oMap.plugin('AMap.Geolocation', function () {
                that.oGeolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位,默认:true
                    timeout: 10000,          //超过10秒后停止定位,默认：无穷大
                    buttonOffset: new AMap.Pixel(20, 20),//定位按钮与设置的停靠位置的偏移量,默认：Pixel(10, 20)
                    zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见,默认：false
                    buttonPosition: 'LB',
                    buttonHidden: true
                });
                setTimeout(function () {
                    that.oGeolocation.Uf.hidden = true;
                }, 0)
                that.oMap.addControl(that.oGeolocation);
                that.oGeolocation.getCurrentPosition();
                AMap.event.addListener(that.oGeolocation, 'complete', onComplete);//返回定位信息
                AMap.event.addListener(that.oGeolocation, 'error', onError);      //返回定位出错信息
                //解析定位结果
                function onComplete(data) {
                    that.aInitCenter = [data.position.getLng(), data.position.getLat()];
                    that.fnMapInit();
                }
                //解析定位错误信息
                function onError(data) {
                    console.warn("浏览器定位失败,采用默认位置");
                }
            });

        },
        fnCreateCircle: function () {
            this.oCircle = new AMap.Circle({
                map: this.oMap,
                center: this.aInitCenter,
                radius: this.iInitRadius,
                strokeColor: "#F00",
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: "#F00",
                fillOpacity: 0.15
            });
        },
        fnCreateCircleEditor: function () {
            var that = this;
            that.oMap.plugin(["AMap.CircleEditor"], function () {
                var timer;
                that.oCircleEditor = new AMap.CircleEditor(that.oMap, that.oCircle);
                that.oCircleEditor.open();
                that.oCircleEditor.on('adjust', function (e) {
                    if (e.radius > 50000) {
                        that.iRadius = 50000;
                        that.oCircle.setRadius(50000)
                    } else if (e.radius < 5) {
                        that.iRadius = 5
                        that.oCircle.setRadius(5)
                    } else {
                        that.iRadius = e.radius;
                    }
                    that.fnSynRadius(that.iRadius);
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        that.fnMapAdjust()
                    }, 500)
                });
                that.oCircleEditor.on('move', function (e) {
                    that.fnSynLnglat([e.lnglat.lng, e.lnglat.lat]);
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        that.fnMapAdjust()
                    }, 500)
                });
            });
            that.oMap.on('click', function (e) {
                that.fnSynLnglat([e.lnglat.getLng(), e.lnglat.getLat()]);
                that.fnMapAdjust();
            });
        },
        fnCreatePlaceSearch: function () {
            var that = this;
            if (!that.oMap.plugin) {
                setTimeout(function () {
                    that.fnCreatePlaceSearch();
                }, 500)
                return;
            }
            that.oMap.plugin(["AMap.PlaceSearch"], function () {
                that.oPlaceSearch = new AMap.PlaceSearch({ //构造地点查询类
                    pageSize: 1,
                    pageIndex: 1,
                    city: '010',
                    map: that.oMap
                });
                that.oMap.plugin(["AMap.Autocomplete"], function () {
                    var auto = new AMap.Autocomplete({
                        input: that.oMapFuncEles.mapSearchIpt.props.id,
                        map: that.oMap
                    })
                    //构造地点查询类
                    AMap.event.addListener(auto, "select", select);//注册监听,当选中某条记录时会触发
                    function select(e) {
                        that.oPlaceSearch.setCity(e.poi.adcode);
                        that.oPlaceSearch.search(e.poi.name);  //关键字查询查询
                    }
                });
            });
        },
        fnAddBtnEvent: function () {
            var that = this;
            var iptSearch = that.oMapFuncEles.mapSearchIpt.ele,
                btnSearch = that.oMapFuncEles.mapBtns.oBtns.mapSearchBtn.ele,
                btnInit = that.oMapFuncEles.mapBtns.oBtns.mapInitBtn.ele,
                btnResize = that.oMapFuncEles.mapBtns.oBtns.mapResizeBtn.ele;
            iptSearch.addEventListener('keydown', function (e) {
                console.log(e.keyCode);
                if (e.keyCode == 13) {
                    return false;
                }
            },true)
            btnSearch.addEventListener('click', function () {
                that.fnMapSearch.call(that);
            })
            btnInit.addEventListener('click', function () {
                that.fnMapInit.call(that)
            })
            btnResize.addEventListener('click', function () {
                that.fnMapResize.call(that)
            })
        },
        fnCreateToolBar: function () {
            var that = this;
            that.oMap.plugin(["AMap.ToolBar"], function () {
                that.oToolBar = new AMap.ToolBar()
                that.oMap.addControl(that.oToolBar);
                that.oToolBar.hideLocation();
            });
        },
        fnMapZoom: function (iRad) {   //根据圆形围栏半径获取合适的缩放比zoom
            var iIndex;
            var oResBtn = this.oMapFuncEles.mapBtns.oBtns.mapResizeBtn
            iIndex = 35;
            switch (oResBtn.ele.innerHTML) {
                case oResBtn.sInHtml:
                    iIndex = 35;
                    break;
                case oResBtn.sInHtmlMin:
                    iIndex = 50;
                    break;
                default:
                    iIndex = 35;
                    console.warn("请检查函数fnMapZoom")
            }
            return 18 - Math.floor(Math.log((iRad >= iIndex ? iRad : iIndex) / iIndex) / Math.log(2));
        },
        fnMapSearch: function () {
            var keySearch = this.oMapFuncEles.mapSearchIpt.ele.value
            if (keySearch) {
                this.oPlaceSearch.search(this.oMapFuncEles.mapSearchIpt.ele.value);
            }
            this.fnMapAdjust()
        },
        fnMapAdjust: function () {//根据this.oCircle调整this.oMap中心和缩放
            this.oCircle.setCenter(this.aCenter);
            this.oMap.setZoomAndCenter(this.fnMapZoom(this.iRadius), this.aCenter);
        },
        fnMapInit: function () {//根据this.oCircle调整this.oMap中心和缩放
            this.aCenter = this.aInitCenter;
            this.iRadius = this.iInitRadius;
            this.fnSynLnglat(this.aCenter);
            this.fnSynRadius(this.iRadius);
            this.fnMapAdjust();
            var that=this;
            setTimeout(function(){
                that.oCircle.setRadius(that.iRadius);
            },1)
        },
        fnMapResize: function () {
            var oBtnResize = this.oMapFuncEles.mapBtns.oBtns.mapResizeBtn;
            if (oBtnResize.ele.innerHTML === oBtnResize.sInHtml) {
                oBtnResize.ele.innerHTML = oBtnResize.sInHtmlMin;
                this.oAmapWrap.ele.setAttribute('style', this.oAmapWrap.maxStyle);
                document.body.style.overflow = 'hidden';
            } else {
                oBtnResize.ele.innerHTML = oBtnResize.sInHtml;
                this.oAmapWrap.ele.setAttribute('style', this.oAmapWrap.props.style);
                document.body.style.overflow = 'auto';
                // if($){
                //     $(window).scrollTop(150)
                // }
            };

        },
        fnSynLnglat: function ([lng, lat]) {
            this.aCenter = [lng, lat];
            var aLnglatBox = document.getElementsByClassName(this.sLnglatBoxClass);
            for (i in aLnglatBox) {
                aLnglatBox[i].innerHTML = lng + ',' + lat
                aLnglatBox[i].innerHTML = lng + ',' + lat
            }
        },
        fnSynRadius: function (radius) {
            this.iRadius = radius;
            var aRadiusBox = document.getElementsByClassName(this.sRadiusBoxClass);
            for (i in aRadiusBox) {
                aRadiusBox[i].innerHTML = this.iRadius;
            }
        }
    }
    // export oMap
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = CAmap;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () { return CAmap; });
    } else {
        $w['CAmap'] = CAmap;
    }

})(typeof window !== 'undefined' ? window : global);