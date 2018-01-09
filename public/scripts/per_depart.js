/*
 * ==================================================================
 *                          用户部门管理 per_depart
 * ==================================================================
 */

$(function() { 

    // 部门详细信息
    getDetail(); 
    $('.layout-right .top .right .search input').val('');
    $('.layout-right .top .left').css({'display':'block'});
});

// 个人用户所在部门详细信息
function getDetail(){
    $('.layout-right .top .right .search input').val('');
    var departname = '',
        departcount = '',
        leader = '';
    // 获取localStorage里部门id
    if(localStorage.length>0){
        var inform = localStorage.getItem("data1");
        var informs = JSON.parse(inform);
        var info = informs.doc;
        var info = info.info;
        var departId = info.departId;
    }
    if(departId == -1){
        warningOpen("此账号目前不属于任何部门 ！")
    }
    var str = '<div class="detailinfo">'
            + '<span class="spanleft">部门名称:</span><span class="spanright">'
            + '</span><br><span class="spanleft">部门人数:</span><span class="spanright">'
            + '</span><br><span class="spanleft">部门领导:</span><span class="spanright">'
            + '</span><br>'
            + '<span class="spanleft"><input type="button" onclick="getDepartMembers('+departId+')" value="部门员工"/></span></div>'
            + '<div class="departmemberlist" style="display:none;"><ul name="memberlist"></ul></div>'
            + '<div class="departmembertable" style="display:none;"></div>';      
    var tab = $('.layout .center .depart');
    tab.html(str); 
    var url = '/per/getDepart?departId='+departId;
    $.get(url, function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            var depart_info = data.depart_info;
            departname = depart_info.name;
            departcount = depart_info.current_num;
            leader = depart_info.leader;
        $('.detailinfo .spanright').eq(0).html('<label>'+departname+'</label>');
        $('.detailinfo .spanright').eq(1).html('<label>'+departcount+'</label>');
        $('.detailinfo .spanright').eq(2).html('<label>'+leader+'</label>');

        } else if (data.rt==5) {
          toLoginPage();           
        }
    });
}
function getDepartMembers(departId){
    if($('.departmembertable').css("display")=="block"){
        $('.departmembertable').css({'display':'none'});
    } else {
        if(departId > 0){
            $(document).ready(function(){
                $.get('/man/depart/members?start_page='+1+ '&page_length='+ 1000 + '&depart_id='+ departId, function(data) {
                    data = JSON.parse(data);
                    if (data.rt==0) {
                        var table = $('.layout .layout-right .center .depart .departmembertable'),
                        str = '<table><tr class="firsttr">'
                            + '<th style="width:30%;padding-left:50px;">用户ID</th>'
                            + '<th style="width:35%;">用户名</th>'
                            + '<th style="width:35%;">用户账号</th></tr>';

                        for (var i=0; i<data.depart_users.length; i++){
                            str += '<tr>'
                                + '<td style="padding-left:50px;">' + data.depart_users[i].id + '</td>'
                                + '<td>' + data.depart_users[i].name + '</td>'
                                + '<td>' + data.depart_users[i].email + '</td></tr>';
                        }
                        str +='</table>'
                        table.html(str);
                    } else {
                        warningOpen('获取部门员工失败！');
                    }
                });
            });
            $('.departmembertable').css({'display':'block'});
        }else{
            warningOpen("用户不属于任何部门！");
        }
    }    

}


