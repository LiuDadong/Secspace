/*配置测试网络环境http*/
var httpSettings = {
    PDP_base: {//内网基础测试
        protocol: 'https',
        domain: '192.168.1.25',
        port: '1443'
    },
    PDP_formal: {//正式
        protocol: 'http',
        domain: 'tpos.appssec.cn',
    },
    PDP_online: {//上线
        protocol: 'http',
        domain: '127.0.0.1',
        port: '7770'
    },
    crossGet: false,//控制跨域cget请求的日志输出
    crossPost: false
}
/*
* 配置网络参数PDP（protocol,domain,port）
*/
var PDP=httpSettings.PDP_base;    //内网基础测试
//var PDP=httpSettings.PDP_formal;  //正式
//var PDP=httpSettings.PDP_online;  //上线
var protocol=PDP.protocol,
    domain=PDP.domain,
    port= PDP.port?PDP.port:'';
var baseUrl = port
    ? protocol + '://' + domain + ':'+ port
    : protocol + '://' + domain;
console.log('当前网络环境基础路径baseUrl:')
console.log(baseUrl)
//引入所需模块
var http = (protocol==='https')?require('https'):require('http');
var util = require('util');
var querystring = require('querystring');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/*
 * 定义跨域cget请求
 * url 访问相对路径，即虚拟目录和文件名
 * fun 回调方法
 *      function(cont),cont返回的数据
 */
exports.cget = function (url, fun) {
    var cont = '';
    url = baseUrl + url;
    if (httpSettings.crossGet) {
        console.log('跨域cget请求的url:');
        console.log(url);
    }
    http.get(url, function (res) {
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            cont += chunk;
        });
        res.on('end', function () {
            if (httpSettings.crossGet) {
                console.log('跨域cget响应的cont:');
                console.log(cont);
            }
            fun(cont);
        });
    }).on('error', function (err) {
        console.log("跨越cget报错111111:");
        console.log(err.message)
    });
};
/*
 * 定义跨域cpost请求
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
exports.cpost = function (postData, url, fun) {
    postData = querystring.stringify(postData);
    url = baseUrl + url;
    if (httpSettings.crossPost) {
        console.log('跨域cpost请求的url:');
        console.log(url);
    }
    var cont = '',
        options = {
//------------tp3/5测试环境配置点：hostname------------
            //hostname: '192.168.1.25', //内网测试环境
            //hostname: 'tpos.appssec.cn', // 正式
            //hostname: '127.0.0.1',
            hostname:domain,
            path: url,
            port: port?port:80,
            method: 'post',
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
//------------tp5/5测试环境配置点：http、http-----------
        req = http.request(options, function (res) {
//            console.timeEnd('Timer2');
            res.on('data', function (chunk) {
                cont += chunk;
            });
            res.on('end', function () {
                try {
                    cont = JSON.parse(cont);
                    if (httpSettings.crossPost) {
                        console.log('跨域cpost响应的cont：')
                        console.log(cont)
                    }
                    fun(cont);
                } catch (e) {
                    fun(cont);
                }
            });
        });
    req.on('error', function (e) {
        console.log('跨域cpost Error: ' + e.messsage);
    });
    req.write(postData);
    req.end();
};
