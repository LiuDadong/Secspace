var http = require('http');
var https = require('https');
var util = require('util');
var querystring = require('querystring');
//------------tp1/5测试环境配置点：声明hostname-----------
var hostname = 'https://192.168.1.25:1443'; // 内网测试环境
//var hostname = 'http://tpos.appssec.cn';//正式
//var hostname = 'http://127.0.0.1:7770'; // 线上
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/*
 * GET
 * url 访问路径
 * 
 * fun 回调方法
 *      function(cont),cont返回的数据
 */
exports.GET = function (url, fun) {
    var cont = '',
        url = hostname + url;
//    console.time('Timer1');
//------------tp2/5测试环境配置点：http、https-----------
    https.get(url, function (res) {
//        console.timeEnd('Timer1');
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            cont += chunk;
        });
        res.on('end', function () {
            fun(cont);
        });
//        console.log("跨越Get url: " + url);
    }).on('error', function (err) {
        console.log("跨越Get error: " + err.message);
    });
};
/*
 * POST
 * postData 传递参数
 *      {
 *          'account': name,
 *          'passwd': md5(passwd)
 *      }
 * url 访问路径
 *      '/a/app/login'
 * fun 回调方法
 *      function(cont),cont返回的数据
 */
exports.POST1 = function (postData, url, fun) {
    console.log('跨域post请求的url:');
    console.log(url);
    postData = querystring.stringify(postData);
    var cont = '',
        options = {
//------------tp3/5测试环境配置点：hostname------------
            hostname: '192.168.1.25', //内网测试环境
            //hostname: 'tpos.appssec.cn', // 正式
            //hostname: '127.0.0.1',
            path: url,
//------------tp4/5测试环境配置点：port----------------
            port: 1443,  //内网测试环境
            //port: 80,  //正式
            //port: 7771,  //线上
            method: 'POST',
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
//------------tp5/5测试环境配置点：http、https-----------
        req = https.request(options, function (res) {
//            console.timeEnd('Timer2');
            res.on('data', function (chunk) {
                cont += chunk;
            });
            res.on('end', function () {
                try {
                    cont = JSON.parse(cont);
                    console.log('跨域post响应的内容cont：')
                    console.log(cont)
                    fun(cont);
                } catch (e) {
                    fun(cont);
                }
            });
        });
    req.on('error', function (e) {
        console.log('跨域post Error: ' + e.messsage);
    });
    req.write(postData);
    req.end();
};
