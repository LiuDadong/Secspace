var http = require('http');
var https = require('https');
var util = require('util');
//var hostname = 'http://tpos.yingzixia.com';//正式
//var hostname = 'http://dev-server.yingzixia.com';//开发
var hostname = 'http://127.0.0.1:7770'; // 线上
//var hostname = 'http://47.93.184.176:8002'; // 惠讯
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/*
 * GET
 * url 访问路径
 * 
 * fun 回调方法
 *      function(cont),cont返回的数据
 */
exports.GET = function(url, fun) {
    var cont = '',
    url = hostname + url;
    http.get(url, function(res) {
        res.setEncoding('utf-8');
        res.on('data', function(chunk) { cont += chunk;});
        res.on('end', function() {
            fun(cont);
        });
    console.log("Get url: " + url);
    }).on('error', function(err) {
        console.log("Got error: " + err.message);
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
exports.POST1 = function(postData, url, fun) {
    var querystring = require('querystring');
    postData = querystring.stringify(postData);
   // console.log('post url:48.93.184.176'+ url+'?'+postData);
    var cont = '',
        options = {
            //hostname: 'dev-server.yingzixia.com',
            //hostname: 'tpos.yingzixia.com',
            hostname: '127.0.0.1',
            //hostname: '47.93.184.176',
            path: url,
            //port: 80,  //正式 开发
            port: 7771,//线上
            //port: 8002,  //惠讯
            method: 'POST',
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        req = http.request(options, function(res) {
            res.on('data', function(chunk) { cont += chunk; });
            res.on('end', function() {
                try {
                    cont = JSON.parse(cont);
                    fun(cont);
                } catch (e) {
                    fun(cont);
                }
            });
        });
        console.log(querystring.stringify(options));
    req.on('error', function(e) {
        console.log('Error: ' + e.messsage);
    });
    req.write(postData);
    req.end();
};
