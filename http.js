var http = require('http');
var https = require('https');
var util = require('util');
//var hostname = 'http://tpos.yingzixia.com';

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
    //url = hostname + url;
       url = 'http://tpos.yingzixia.com' + url;  // 正式环境
        //url = 'https://dev-server.yingzixia.com' + url;  // 开发环境
        // url = '123.59.135.124' + url;  // 开发环境
        //url = 'http://test.yingzixia.com' + url;  // 测试环境

        //url = '115.28.135.202' + url;
        //url = 'http://192.168.2.235:8000' + url;
        //url = 'http://127.0.0.1:7770'+url;
    http.get(url, function(res) {
        res.setEncoding('utf-8');
        res.on('data', function(chunk) { cont += chunk;});
        res.on('end', function() {
            fun(cont);
        });
    console.log("Get after: " + url);
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
    //console.log('url:tpos.yingzixia.com' + url+'?'+postData);
    //console.log('postData: ' + postData+url);
    var cont = '',
        options = {
            hostname: 'tpos.yingzixia.com', //zheng shi
            //hostname: 'dev-server.yingzixia.com', // kai fa
            //hostname: '123.59.135.124', // kai fa
            //hostname: '115.28.135.202',
            //hostname: '192.168.2.235',
            //hostname: '127.0.0.1',
            path: url,
            port: 80,
            //port:443,
            //port:8000,
           // port: 7771,
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
    req.on('error', function(e) {
        console.log('Error: ' + e.messsage);
    });
    req.write(postData);
    req.end();
};
