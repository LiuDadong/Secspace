homeJadeInit();  //管理员信息初始化
renderRolesfns();   //渲染授权文件
pjaxInit(); //pjax初始化

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
        setTimeout(function(){
            omSwitch.refresh();
        },10)
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