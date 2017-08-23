/*
 * ==================================================================
 *                          用户组管理 users
 * ==================================================================
 */

$(function() {
    $('.usermenu').addClass('open active');
    $('.usermenu').find('li').eq(1).addClass('active');
    // 用户列表
   // getUsersList(1,10,'');  
      var menuArry = [
      { id: 1, name: "办公管理", pid: 0 },
      { id: 2, name: "请假申请", pid: 1 },
      { id: 3, name: "出差申请", pid: 1 },
      { id: 4, name: "请假记录", pid: 2 },
      { id: 5, name: "系统设置", pid: 0 },
      { id: 6, name: "权限管理", pid: 5 },
      { id: 7, name: "用户角色", pid: 6 },
      { id: 8, name: "菜单设置", pid: 6 }
      ];
      var str = '<table class="" style="width:100%;background-color:#fff;" ><tr style="line-height:36px;">'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>创建人</th>'
            + '<th>用户关联数量</th>'
            + '<th>更新时间</th>'
            + '<th>状态</th>'
            + '<th>操作</th></tr>';
 
      GetData(0, menuArry,0)
      $(".userstable").html(str+menus);
});
 //菜单列表html
    var menus = '';
 
    //根据菜单主键id生成菜单列表html
    //id：菜单主键id
    //arry：菜单数组信息
    function GetData(id, arry,k) {
      k +=1;
      var childArry = GetParentArry(id, arry);
      if (childArry.length > 0) {
     //   menus += '<tr>';
        for (var i in childArry) {
          var str2;
          var cnum = GetParentArry(childArry[i].id, arry).length;
          if(k>1 && cnum >= 1){
            str2 = '<td onclick="showuser(this)" class="groupline" style="padding-left:'+((k-1)*36)+'px;background:url(../imgs/fold_line.png) no-repeat '+(10+(k-2)*20)+'px 0;">'
                 + '<i class="fa fa-folder-o" style="color:#666;font-size:16px;margin-right:5px;"></i>  ' + childArry[i].name + '</td>'
          } else if(k>1 && cnum < 1){
            str2 = '<td class="groupline" style="padding-left:'+((k-1)*36)+'px;background:url(../imgs/fold_line.png) no-repeat '+(10+(k-2)*20)+'px 0;">' + childArry[i].name + '</td>';
          } else{
            str2 = '<td onclick="showuser(this)" style="padding-left:'+((k-1)*36)+'px;">'+'<i class="fa fa-folder-o" style="color:#666;font-size:16px;margin-right:5px;"></i>' + childArry[i].name + '</td>';
          }
          menus += '<tr>'
                + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                //+ '<td style="padding-left:'+((k-1)*36)+'px;">' + childArry[i].name +'</td>'
                + str2
                + '<td>' + childArry[i].name +'</td>'
                + '<td>' + childArry[i].name +'</td>'
                + '<td>' + childArry[i].name +'</td>'
                + '<td>' + childArry[i].pid +'</td>'
                + '<td>' + childArry[i].id +'</td></tr>';
          GetData(childArry[i].id, arry,k);
         // menus += '';
        }
       // menus += '</tr>';
      }
    }
 
    //根据菜单主键id获取下级菜单
    //id：菜单主键id
    //arry：菜单数组信息
    function GetParentArry(id, arry) {
      var newArry = new Array();
      for (var i in arry) {
        if (arry[i].pid == id)
          newArry.push(arry[i]);
      }
      return newArry;
    }
    var fortimes = 0;
    var active = '';
function showuser(e){
  var id = $(e).parent().find('td').eq(6).text();
  var childArry = getchildrenarray(id);
    if (childArry.length > 0) {
      for (var i in childArry) {
        var tab = $('.userstable table');
        tab.find('tr').each(function () {
          if($(this).find('td').eq(6).text() == childArry[i]) {
            $(this).is(":hidden") == true ? active = 'show' : active = 'hide';
          }
        });
      }
  }
  toguser(e);
  fortimes = 0
  active = '';
}
function toguser(e){
    var id = $(e).parent().find('td').eq(6).text();
    var childArry = getchildrenarray(id);
    if (childArry.length > 0) {
      fortimes += 1;
      for (var i in childArry) {
        var tab = $('.userstable table');
        tab.find('tr').each(function () {
          if($(this).find('td').eq(6).text() == childArry[i]) {
              /*if(fortimes > 1){
                var pid = $(this).find('td').eq(5).text()
                var that = this;
                tab.find('tr').each(function () {
                  if($(this).find('td').eq(6).text() == pid) {
                    $(this).is(":hidden") == true ? $(that).hide() : $(that).show();
                  } 
                  //else{
                  //  $(that).toggle();
                  //}
                });
              }else{
                $(this).toggle();
              }*/
              //if(fortimes === 1){
              //  $(this).is(":hidden") == true ? active = 'show' : active = 'hide';
              //}
              active === 'show' ? $(this).show() : $(this).hide();
              //$(this).toggle();
                //if($(this).is(":hidden")){
              toguser($(this).find('td').eq(2));
          }     
        });
        //fortimes = 0;
      }
    }
}
function getchildrenarray(id){
    var newArry = new Array();
    var tab = $('.userstable table');
    tab.find('tr').each(function () {
        if($(this).find('td').eq(5).text() == id) {
            
            newArry.push($(this).find('td').eq(6).text());
        }     
    });
    return newArry;
}
// 用户列表
function getUsersList(start,length,keyword) {
    var i = 9;
    var st = 1;
    var url = '/man/user/getUsersList?start='+ start + '&length='+ length;
        url += keyword?'&keyword=' + keyword : '';
    var table = $('.userslist .userstable'),str1,str,str2;
        str = '<table class="table-hover" style="width:100%;background-color:#fff;" ><tr style="line-height:36px;">'
            + '<th class="sel" style="line-height:20px;"><div class="checkbox"><label><input type="checkbox" onclick="selectedAll(this)"></input><span class="text">全选</span></label></div></th>'
            + '<th>名称</th>'
            + '<th>创建人</th>'
            + '<th>用户关联数量</th>'
            + '<th>更新时间</th>'
            + '<th>状态</th>'
            + '<th>操作</th></tr>';
    var tree = [
              {
                name: '研发部',
                createp: '001@qq.com',
                'create_time': '2017-08-12',
                id:1,
                person: 4,
                status: '正常',
                childrens:[
                   {
                     name: '开发部',
                     createp: '001@qq.com',
                     'create_time': '2017-08-13',
                     id:12,
                     person: 46,
                     status: '正常',
                     childrens: []
                   },
                   {
                     name: '测试部',
                     createp: '001@qq.com',
                    'create_time': '2017-08-14',
                     id:13,
                     person: 44,
                     status: '正常',
                     childrens:[
                        {
                          name: '研发部11',
                          createp: '001@qq.com',
                          'create_time': '2017-08-12',
                          id:11,
                          person: 14,
                          status: '正常1',
                          childrens:[]
                        }
                     ]
                   }
                 ]
              },
              
              { name: '财务部',
                 createp: '001@qq.com',
                'create_time': '2017-08-12',
                 id:15,
                 person: 4,
                 status: '正常',
                 childrens:[]
              },
              {
                 name: '行政部',
                 createp: '001@qq.com',
                'create_time': '2017-08-16',
                 id:18,
                 person: 4,
                 status: '正常',
                 childrens:[
                  {
                    name: '行政部',
                    createp: '001@qq.com',
                    'create-time': '2017-08-16',
                    id: 18,
                    person: 4,
                    status: '正常',
                    childrens: [
                    ]
                  },
                  {
                    name: '行政部',
                    createp: '001@qq.com',
                    'create-time': '2017-08-16',
                    id: 18,
                    person: 4,
                    status: '正常',
                    childrens: [
                    ]
                  },
                  {
                    name: '行政部',
                    createp: '001@qq.com',
                    'create-time': '2017-08-16',
                    id: 18,
                    person: 4,
                    status: '正常',
                    childrens: [
                    ]
                  }
                 ]
              }
            ];
    for(var i in tree) {
      if(tree[i].childrens.length>0){
        str2 = '<td onclick="showusers(this)"><i class="fa fa-caret-down" style="color:#666;font-size:16px;"></i>  ' + tree[i].name + '</td>'
      }else{
        str2 = '<td>' + tree[i].name + '</td>'
      } 
        str += '<tr class="grouptotal" id="tr'+i+'">'
            + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
            + str2
            //+ '<td onclick="showusers()"><i class="fa fa-caret-down" style="color:#666;font-size:16px;"></i>  ' + tree[i].name + '</td>'
            + '<td>' + tree[i].createp + '</td>'
            + '<td>' + tree[i].person + '</td>'
            + '<td>' + tree[i].create_time + '</td>'
            + '<td>' + tree[i].status + '</td>' 
            + '<td style="display:none;"></td>'   
            + '<td style="display:none;"></td>' 
            + '<td style="display:none;"></td>'
            + '<td style="display:none;"></td>'                                   
            + '<td class="other">'           
            + '<a href="javascript:users_update('+ i +');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;'
            + '<a href="javascript:users_detail('+ i +');">详情</a>'
            + '</td></tr>';
            for(var j in tree[i].childrens) {
              if(tree[i].childrens[j].childrens.length>0){
                str2 = '<td class="usersline" onclick="showusers(this)"><i class="fa fa-caret-down" style="color:#666;font-size:16px;"></i>  ' + tree[i].name + '</td>'
              }else{
                str2 = '<td class="usersline">' + tree[i].name + '</td>'
              } 
              str += '<tr class="grouptotal" id="tr'+i+'tr'+j+'">'
                  + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                  + str2
                  //+ '<td class="usersline">' + tree[i].childrens[j].name + '</td>'
                  + '<td>' + tree[i].childrens[j].createp + '</td>'
                  + '<td>' + tree[i].childrens[j].person + '</td>'
                  + '<td>' + tree[i].childrens[j].create_time + '</td>'
                  + '<td>' + tree[i].childrens[j].status + '</td>' 
                  + '<td style="display:none;"></td>'   
                  + '<td style="display:none;"></td>' 
                  + '<td style="display:none;"></td>'
                  + '<td style="display:none;"></td>'                                   
                  + '<td class="other">'           
                  + '<a href="javascript:users_update('+ j +');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;'
                  + '<a href="javascript:users_detail('+ j +');">详情</a>'
                  + '</td></tr>';
              for(var k in tree[i].childrens[j].childrens) {
              str += '<tr class="grouptotal" id="tr'+i+'tr'+j+'tr'+k+'">'
                  + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                  + '<td class="usersline2">' + tree[i].childrens[j].childrens[k].name + '</td>'
                  + '<td>' + tree[i].childrens[j].childrens[k].createp + '</td>'
                  + '<td>' + tree[i].childrens[j].childrens[k].person + '</td>'
                  + '<td>' + tree[i].childrens[j].childrens[k].create_time + '</td>'
                  + '<td>' + tree[i].childrens[j].childrens[k].status + '</td>' 
                  + '<td style="display:none;"></td>'   
                  + '<td style="display:none;"></td>' 
                  + '<td style="display:none;"></td>'
                  + '<td style="display:none;"></td>'                                   
                  + '<td class="other">'           
                  + '<a href="javascript:users_update('+ k +');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;'
                  + '<a href="javascript:users_detail('+ k +');">详情</a>'
                  + '</td></tr>';
              }
            }


            }

    str1 += '<tr class="grouptotal">'
            + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
            + '<td onclick="showusers()"><i class="fa fa-caret-down" style="color:#666;font-size:16px;"></i>  ' + '技术部' + '</td>'
            + '<td>管理员1</td>'
            + '<td>' + '40' + '</td>'
            + '<td>2017年8月3日 16:00:34</td>'
            + '<td>正常</td>' 
            + '<td style="display:none;"></td>'   
            + '<td style="display:none;"></td>' 
            + '<td style="display:none;"></td>'
            + '<td style="display:none;"></td>'                                   
            + '<td class="other">'           
            + '<a href="javascript:users_update('+ i +');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;'
            + '<a href="javascript:users_detail('+ i +');">详情</a>'
            + '</td></tr>';
    str1 += '<tr class="grouptr">'
            + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
            + '<td class="usersline">' + '研发部' + '</td>'
            + '<td>管理员1</td>'
            + '<td>' + '40' + '</td>'
            + '<td>2017年8月3日 16:00:34</td>'
            + '<td>正常</td>' 
            + '<td style="display:none;"></td>'   
            + '<td style="display:none;"></td>' 
            + '<td style="display:none;"></td>'
            + '<td style="display:none;"></td>'                                   
            + '<td class="other">'           
            + '<a href="javascript:users_update('+ i +');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;'
            + '<a href="javascript:users_detail('+ i +');">详情</a>'
            + '</td></tr>';
     str1 += '<tr class="grouptr">'
            + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
            + '<td class="usersline">' + '测试部' + '</td>'
            + '<td>管理员1</td>'
            + '<td>' + '40' + '</td>'
            + '<td>2017年8月3日 16:00:34</td>'
            + '<td>正常</td>' 
            + '<td style="display:none;"></td>'   
            + '<td style="display:none;"></td>' 
            + '<td style="display:none;"></td>'
            + '<td style="display:none;"></td>'                                   
            + '<td class="other">'           
            + '<a href="javascript:users_update('+ i +');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;'
            + '<a href="javascript:users_detail('+ i +');">详情</a>'
            + '</td></tr>';
     str1 += '<tr class="grouptr">'
            + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
            + '<td class="usersline"><i class="fa fa-caret-down" style="color:#666;font-size:16px;"></i>  ' + '技术部' + '</td>'
            + '<td>管理员1</td>'
            + '<td>' + '40' + '</td>'
            + '<td>2017年8月3日 16:00:34</td>'
            + '<td>正常</td>' 
            + '<td style="display:none;"></td>'   
            + '<td style="display:none;"></td>' 
            + '<td style="display:none;"></td>'
            + '<td style="display:none;"></td>'                                   
            + '<td class="other">'           
            + '<a href="javascript:users_update('+ i +');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;'
            + '<a href="javascript:users_detail('+ i +');">详情</a>'
            + '</td></tr>';
      str1 += '<tr class="grouptr">'
            + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
            + '<td class="usersline2">' + '技术部' + '</td>'
            + '<td>管理员1</td>'
            + '<td>' + '40' + '</td>'
            + '<td>2017年8月3日 16:00:34</td>'
            + '<td>正常</td>' 
            + '<td style="display:none;"></td>'   
            + '<td style="display:none;"></td>' 
            + '<td style="display:none;"></td>'
            + '<td style="display:none;"></td>'                                   
            + '<td class="other">'           
            + '<a href="javascript:users_update('+ i +');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;'
            + '<a href="javascript:users_detail('+ i +');">详情</a>'
            + '</td></tr>';

   /* $.get(url, function(data) {
        //console.log("data = "+data);
        data = JSON.parse(data);
        if (data.rt==0) {
            for(var i in data.user_list) {
                str += '<tr>'
                    + '<td class="sel"><div class="checkbox"><label><input type="checkbox" onclick="selected(this)"></input><span class="text"></span></label></div></td>'
                    + '<td>' + data.user_list[i].email + '</td>'
                    + '<td>' + data.user_list[i].name + '</td>'
                    + '<td>' + data.user_list[i].phone + '</td>'
                    + '<td>' + data.user_list[i].depart_name + '</td>'
                    + '<td>' + data.user_list[i].create_time + '</td>' 
                    + '<td style="display:none;">' + data.user_list[i].id + '</td>'   
                    + '<td style="display:none;">' + data.user_list[i].policy_id + '</td>' 
                    + '<td style="display:none;">' + data.user_list[i].depart_id + '</td>'
                    + '<td style="display:none;">' + data.user_list[i].sex + '</td>'                                   
                    + '<td class="other">'           
                    + '<a href="javascript:user_apps('+ i +');">授权应用</a>&nbsp;&nbsp;&nbsp;&nbsp;'
                    + '<a href="javascript:user_resetpwd('+ i +');">修改密码</a>&nbsp;&nbsp;&nbsp;&nbsp;' 
                    + '<a href="javascript:user_modify('+ i +');">修改信息</a>'
                    + '</td></tr>';
            }
            str +='</table>';
            table.html(str);
            createFooter(start,length,data.total_count,st);  
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });*/
    str +='</table>';
    table.html(str);
}
// page页查询
function search(p,i) {
    var email = $('.tab .tabbable').find('input[name=email]').val();
    if(i == 1){
        getUserList(p,10,'');
    } else if(i == 2){
        getauthappList(email,1,p,10);
    } else if(i == 3){
        getauthappList(email,0,p,10);;
    } else{
        console.log(i);
    }
}
function showusers(e){
    var id = $(e).parent().attr("id");
    var tr = $('tr[id^='+id+']').not('#'+id);
    if($(tr).is(":hidden")){
        $(e).find('.fa').removeClass('fa-caret-right');
        $(e).find('.fa').addClass('fa-caret-down');
        $(tr).show();
    }else{
        $(e).find('.fa').removeClass('fa-caret-down');
        $(e).find('.fa').addClass('fa-caret-right');
        $(tr).hide();
    }
    //$('.grouptr').hasClass('usergroup') == true ? $('.grouptr').removeClass('usergroup') : $('.grouptr').addClass('usergroup');
   // $('.grouptr').hasClass('usergroup') == true ? $('.grouptotal .fa').removeClass('fa-caret-right') : $('.grouptotal .fa').addClass('fa-caret-bottom'); 
}
function showuserss(){
    if($('.grouptr').is(":hidden")){
        $('.grouptotal .fa').removeClass('fa-caret-right');
        $('.grouptotal .fa').addClass('fa-caret-down');
        $('.grouptr').show();
    }else{
        $('.grouptotal .fa').removeClass('fa-caret-down');
        $('.grouptotal .fa').addClass('fa-caret-right');
        $('.grouptr').hide();
    }
    //$('.grouptr').hasClass('usergroup') == true ? $('.grouptr').removeClass('usergroup') : $('.grouptr').addClass('usergroup');
   // $('.grouptr').hasClass('usergroup') == true ? $('.grouptotal .fa').removeClass('fa-caret-right') : $('.grouptotal .fa').addClass('fa-caret-bottom'); 
}