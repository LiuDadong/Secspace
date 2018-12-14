homeJadeInit();  //管理员信息初始化
renderRolesfns();   //渲染授权文件
pjaxInit(); //pjax初始化

var swiJm=new orgMind('switch',{
    container:'switch_jm_container'
});
$('#btnJmSwitch').on('click',function(){
    console.log(this);
    $('#switch_jm_container').empty()
    swiJm=new orgMind('switch',{
        container:'switch_jm_container'
    });
});




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