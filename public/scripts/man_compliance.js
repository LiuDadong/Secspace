/*
 * ==================================================================
 *                          系统合规 compliance
 * ==================================================================
 */
$(function() {
   	$('.policymenu').addClass('open active');
    $('.policymenu').find('li').eq(1).addClass('active');
   	// 获取系统合规
    $.get('/man/policy/compliance', function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            data = data.data;
            var checked;
            if(data.is_sim === '1'){
                $('#is_sim').addClass('txt');
                $('input[name=is_sim]').attr("checked",true);
            }else{
                $('#is_sim').removeClass('txt');
                $('input[name=is_sim]').attr("checked",false);
            }
            if(data.is_root === '1'){
                $('#is_root').addClass('txt');
                $('input[name=is_root]').attr("checked",true);
            }else{
                $('#is_root').removeClass('txt');
                $('input[name=is_root]').attr("checked",false);
            }
            if(data.is_android === '1'){
                //$('.devicesys').show();
                $('#is_android').addClass('txt');
                $('input[name=is_android]').attr("checked",true);
                $("#os_version").attr("disabled",false);
            }else{
                //$('.devicesys').hide();
                $('#is_android').removeClass('txt');
                $('input[name=is_android]').attr("checked",false);
                $("#os_version").attr("disabled",true);
            }
            $("#os_version").val(data.os_version);
            $("#violation_handing").val(data.action);
            $('.checkbox').find('span').each(function () {
                if ($(this).hasClass('txt')) {
                    checked = 1;
                }     
            });
            checked == 1 ? $("#violation_handing").attr("disabled",false) : $("#violation_handing").attr("disabled",true);
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });

});
function compliancesave(){
    var is_sim = $('#is_sim').hasClass('txt') == true ? 1 : 0;
    var is_root = $('#is_root').hasClass('txt') == true ? 1 : 0;
    var is_android = $('#is_android').hasClass('txt') == true ? 1 : 0;
    var os_version = $('#os_version').val();
    var action = $("#violation_handing").val();
    var postData = {
            is_sim: is_sim,
            is_root: is_root,
            is_android: is_android,
            os_version: os_version,
            action: action
        };
    $.post('/man/policy/updatecompliance', postData, function(data) {
        if (data.rt==0) {
            warningOpen('操作成功！','primary','fa-check');
        } else if (data.rt==5) {
            toLoginPage();
        } else {
            warningOpen('其它错误 ' + data.rt +'！','danger','fa-bolt');
        }
    });
}
// 选择按钮
function selectsys(e) {
    var checked;
    if ($(e).parent().find('span').hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
        $("#os_version").attr("disabled",true);
        //$('.devicesys').hide();
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
        $("#os_version").attr("disabled",false);
        //$('.devicesys').show();
    }
    $('.checkbox').find('span').each(function () {
        if ($(this).hasClass('txt')) {
            checked = 1;
        }     
    });
    checked == 1 ? $("#violation_handing").attr("disabled",false) : $("#violation_handing").attr("disabled",true);
}
// 选择按钮
function selectcheckbox(e) {
    var checked;
    if ($(e).parent().find('span').hasClass('txt')) {
        $(e).parent().find('span').removeClass('txt');
        $(e).attr("checked",false);
    } else {
        $(e).parent().find('span').addClass('txt');
        $(e).attr("checked",true);
    }
    $('.checkbox').find('span').each(function () {
        if ($(this).hasClass('txt')) {
            checked = 1;
        }     
    });
    checked == 1 ? $("#violation_handing").attr("disabled",false) : $("#violation_handing").attr("disabled",true);
}
function cancel(){
    $.get('/man/policy/compliance', function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            data = data.data;
            var checked;
            if(data.is_sim === '1'){
                $('#is_sim').addClass('txt');
                $('input[name=is_sim]').attr("checked",true);
            }else{
                $('#is_sim').removeClass('txt');
                $('input[name=is_sim]').attr("checked",false);
            }
            if(data.is_root === '1'){
                $('#is_root').addClass('txt');
                $('input[name=is_root]').attr("checked",true);
            }else{
                $('#is_root').removeClass('txt');
                $('input[name=is_root]').attr("checked",false);
            }
            if(data.is_android === '1'){
                //$('.devicesys').show();
                $('#is_android').addClass('txt');
                $('input[name=is_android]').attr("checked",true);
                $("#os_version").attr("disabled",false);
            }else{
                //$('.devicesys').hide();
                $('#is_android').removeClass('txt');
                $('input[name=is_android]').attr("checked",false);
                $("#os_version").attr("disabled",true);
            }
            $("#os_version").val(data.os_version);
            $("#violation_handing").val(data.action);
            $('.checkbox').find('span').each(function () {
                if ($(this).hasClass('txt')) {
                    checked = 1;
                }     
            });
            checked == 1 ? $("#violation_handing").attr("disabled",false) : $("#violation_handing").attr("disabled",true);
        } else if (data.rt==5) {
            toLoginPage();           
        }
    });
}