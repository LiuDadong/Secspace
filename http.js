var http = require('http');
var https = require('https');
var util = require('util');
//var hostname = 'http://192.168.1.25:8002';
//var hostname = 'http://124.205.191.82:1326';
//var hostname = 'http://tpos.appssec.cn';//正式
//var hostname = 'http://dev-server.appssec.cn:8090';//开发
//var hostname = 'http://123.59.135.124';//开发
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
    console.time('Timer1');
    http.get(url, function(res) {
        console.timeEnd('Timer1');
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
    console.log('postData:'+postData);
    console.time('Timer2');
    var cont = '',
        options = {
            //hostname: '192.168.1.25',
            //hostname: '124.205.191.82',
           // hostname: 'dev-server.appssec.cn',
            //hostname: '123.59.135.124',
            //hostname: 'tpos.appssec.cn',
            hostname: '127.0.0.1',
            //hostname: '47.93.184.176',
            path: url,
           // port:1326,
            //port: 8090,  //正式 开发
            port: 7771,//线上
            //port: 8002,  //惠讯
            method: 'POST',
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        req = http.request(options, function(res) {
            console.timeEnd('Timer2');
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
       // console.log(querystring.stringify(options));
    req.on('error', function(e) {
        console.log('Error: ' + e.messsage);
    });
    req.write(postData);
    req.end();
};
