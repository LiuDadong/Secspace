/*
 * ==================================================================
 *                          首页 first
 * ==================================================================
 */

$(function() {
    console.time('Timer4');
    $('.firstmenu').addClass('active');
    $('body').addClass('first');
  
    // 获取统计信息 
    $.get('/man/org/statistics', function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            var weeks = [];
            var categories = [];
            var categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            weeks = data.doc.online_device_count_daily || [];
            if(weeks.length == 0){
                weeks = [7,14,10,20,10,18,15];
            }
            $('.blicklist_count').html(data.doc.blicklist_count);
            $('.active_user_count').html(data.doc.active_user_count);
            $('.issued_app').html(data.doc.issued_app);
            $('.user_count').html(data.doc.user_count);
            $('.online_device_count').html(data.doc.online_device_count);
            $('.app_count').html(data.doc.app_count);
            $('.on_policy_count').html(data.doc.on_policy_count);
            $('.policy_count').html(data.doc.policy_count);
            $('.device_count').html(data.doc.device_count);
            $('.issued_policy').html(data.doc.issued_policy);
            $('.page-version').html('版本信息 : '+data.doc.server_version);

            $('#online span').html(((data.doc.active_user_count/data.doc.user_count).toFixed(2)*100).toFixed(0));
            $('#depart span').html(((data.doc.dev_complicance_count/data.doc.device_count).toFixed(2)*100).toFixed(0));
            $('#app span').html(((data.doc.issued_policy/data.doc.policy_count).toFixed(2)*100).toFixed(0));
    
            var chart = new Highcharts.Chart('deviceNum', {
                title: {
                    text:' 在线设备统计'
                },
                /*
                subtitle: {
                    text: '一周在线设备数量统计',
                    x: -20
                },*/
                credits: {
                    enabled:false
                },
                
                xAxis: {
                    categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    title: {
                        text: '数量(个)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '台'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: '设备',
                    data: weeks
                }/*, {
                    name: '纽约',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: '柏林',
                    data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                }, {
                    name: '伦敦',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }*/]
            });
            circle();
        } else if (data.rt==5) {
           toLoginPage();
        }else{
            
        }
    });
    console.timeEnd('Timer4');
    
});

//绘画圆形百分比函数
function circle(){ 
    $('.circle').each(function(index, el) {
        var num = $(this).find('span').text() * 3.6;
        if (num<=180) {
            $(this).find('.right').css('transform', "rotate(" + num + "deg)");
        } else {
            $(this).find('.right').css('transform', "rotate(180deg)");
            $(this).find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
        };
    });
}
