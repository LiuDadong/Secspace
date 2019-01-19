homeJadeInit();  //管理员信息初始化
renderRolesfnsWithLic(pjaxInit);   //渲染授权文件之后pjax初始化

function renderRolesfnsWithLic(cb){   //根据角色权限渲染控制左侧菜单栏
    $.getLicense(function(data){
        if(data.rt==='0000'&&data['licInfo']){
            applyFinalFns(mergeFinalFns(getRoleFns(),$.getLicPath('',data.licInfo.license.serverModules,{})))
        }else{
            applyFinalFns({});
        }
        cb();
        function applyFinalFns(finalFns){
            $('ul.nav.sidebar-menu a[data-pjax][href^="/sub?pg="]').each(function () {  //遍历所有权限功能点的点击可以触发pjax跳转的a元素
                var path=$(this).attr('href').split('=')[1].split('_')[0];  //获取对应模块的权限功能表征             
                var fns=finalFns[path];  //获取对应模块的权限功能表征             
                // fns 可能的值
                // 0：完全没有访问权限
                // 1：全部权限
                // string：类似'add-del-mod-iio-ioo-pub-act-rop'格式，表示业务管理员对该功能模块拥有的权限功能点
                switch (path){
                    case 'p01':  //特别处理不用控制的模块
                    case 'p0302':
                    case 'p0803':
                        $(this).data('fns',1).removeClass('expired');
                        break;
                    default:
                        $(this).data('fns',fns||0).toggleClass('expired', !fns);
                }
            })
        }
        function mergeFinalFns(rolefns,licFns){
            for(k in rolefns){
                rolefns[k]= (typeof rolefns[k]=='string')?rolefns[k].split('-'):rolefns[k];
                licFns[k]= (typeof licFns[k]=='string')?licFns[k].split('-'):~~licFns[k];
                switch (licFns[k]){
                    case 1:
                        break;
                    case 0:
                        rolefns[k]=0;
                        break;
                    default:
                        rolefns[k]=getIntersection(rolefns[k],licFns[k])
                }
            }

            function getIntersection(arr1,arr2){
                var intersection=[];
                for(var k=0;k<arr2.length;k++){
                    if(arr1.indexOf(arr2[k])!=-1){
                        intersection.push(arr2[k]);
                    }
                }
                return intersection;
            }
            return rolefns;
        }
    })
}


function getRoleFns(){
    var obj={};
    var roles=JSON.parse(localStorage.getItem('roles'));
    console.log(roles);
    for(var i=0;i<roles.length;i++){
        var roleifn=roles[i]['function'];
        for(k in roleifn){
            switch(obj[k]){
                case undefined:
                    obj[k]=roleifn[k];               
                    break;
                default:
                    obj[k] = mergeArrayNoRepeat(obj[k],roleifn[k]);
            }
        }
    }
    function mergeArrayNoRepeat(arr1,arr2){
        for(var k=0;k<arr2.length;k++){
            if(arr1.indexOf(arr2[k])!=-1){
                arr1.push(arr2[k]);
            }
        }
        return arr1;
    }
    return obj;
}
(function (){
    var omSwitch = new OrgMind({
        container: 'om_switch',          //'om_admin'-- id of the container   
        multiple: false,     //支持多选
        allowUnsel: true,    //允许不选
        disableRoot: false,
        editable: false,
        expandToDepth:4,
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
            $('#btnJmSwitch .orgBtn').text(om.selected.topic);
            $.cookie('org_id',om.selected.id);
            $('ul.sidebar-menu li.active>a[data-pjax]').click();
        },
        complete:function(om){
            var jm=om.jm;
            jm.select_node($.cookie('org_id'));
            $('#btnJmSwitch .orgBtn').text(jm.get_selected_node().topic);
        }
    });
    $('#btnJmSwitch').on('click',function(){
        if(!$(this).next('ul').is(':visible')){
            omSwitch.ajaxMind(function(){
                omSwitch.refresh();
            });
        }
    });
})();







window.onbeforeunload = function (){   
    var warning="onbeforeunload:确认关闭www.someabcd.com?";     
    //你的业务操作。。。。    
    alert(warning);   
  };   
window.onunload = function (){   
    var warning="onunload:确认关闭www.someabcd.com?";     
    //你的业务操作。。。。    
    alert(warning); 
  };

