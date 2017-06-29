/*
 * ==================================================================
 *                          首页 first
 * ==================================================================
 */

$(function() {
    $('.firstmenu').addClass('active');
    var devNum = $('.t1 .count'),
        userNum = $('.t2 .count'),
        appNum = $('.t3 .count'),
        depNum = $('.t4 .count');
        devnum = $('#online span'),
        depnum = $('#depart span'),
        appnum = $('#app span');
    // 获取统计信息 
    $.get('/man/org/statistics', function(data) {
        data = JSON.parse(data);
        if (data.rt==0) {
            var devices = data.doc.device_count;
            var apps = data.doc.app_count;
            var departs = data.doc.depart_count;
            var online_device = data.doc.online_device_count;
            var users = data.doc.user_count;
            var users_depart = data.doc.user_has_depart;
            var installed_count = data.doc.installed_app_count;
            var weeks = [];
            var categories = [];
            var categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            weeks = data.doc.online_device_count_daily;
            if(weeks.length == 0){
                weeks = [0,0,0,0,0,0,0];
            }
            devNum.html(devices);
            userNum.html(users);
            devnum.html(((online_device/devices).toFixed(2)*100).toFixed(0));
            depNum.html(departs);
            depnum.html(((users_depart/users).toFixed(2)*100).toFixed(0));
            appNum.html(apps);
            appnum.html(((installed_count/apps).toFixed(2)*100).toFixed(0));
            /**
  * Highcharts 在 4.2.0 开始已经不依赖 jQuery 了，直接用其构造函数既可创建图表
 **/
var chart = new Highcharts.Chart('deviceNum', {
    title: {
        text: null
    },
   /* subtitle: {
        text: '每天在线设备数量统计',
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

            
            /*$('#deviceNum').highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ' '
                },
                subtitle: {
                    text: ' '
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    title: {
                        text: ' '
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: function() {
                        return this.x +'在线设备数: '+ this.y +'个';
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: true
                    }
                },
                series: [{
                    data: weeks
                }]
            });*/
            circle();
        } else if (data.rt==5) {
           toLoginPage();
        }
    });
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
