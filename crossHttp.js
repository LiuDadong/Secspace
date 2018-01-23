/*配置测试网络环境http*/
var httpSettings = {
    PDP_base: {//内网基础测试
        protocol: 'https',
        domain: '192.168.1.25',
        port: 1443
    },
    PDP_formal: {//正式：本地测试上线部署
        protocol: 'http',
        domain: 'tpos.appssec.cn'
    },
    PDP_online: {//上线部署
        protocol: 'http',
        domain: '127.0.0.1',
        port: 7770
    },
    crossGet: true,//控制跨域cget请求的日志输出
    crossPost: true
}
/*
 * 配置网络参数PDP（protocol,domain,port）
 */
//var PDP=httpSettings.PDP_base;    //内网基础测试
//var PDP=httpSettings.PDP_formal;  //正式
var PDP=httpSettings.PDP_online;  //上线
var protocol=PDP.protocol,
    domain=PDP.domain,
    port= PDP.port?PDP.port:'';
var baseUrl = port
    ? protocol + '://' + domain + ':'+ port
    : protocol + '://' + domain;

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
    if (httpSettings.crossGet) {   //根据设置输出log
        console.info('跨域cget请求的url:');
        console.info(url);
    }
    http.get(url, function (res) {
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            cont += chunk;
        });
        res.on('end', function () {
            if (httpSettings.crossGet) {
                console.info('跨域cget响应的cont:');
                console.info(cont);
            }
            fun(cont);
        });
    }).on('error', function (err) {
        console.info("跨越cget报错:");
        console.info(err.message)
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
    if(port==7770){
        port=7771
    }
    postData = querystring.stringify(postData);
    if (httpSettings.crossPost) {
        console.info('跨域cpost请求的url:');
        console.info(url);
    }
    var cont = '',
        options = {
            hostname:domain,
            path: url,
            port: parseInt(port?port:80),
            method: 'POST',
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        req = http.request(options, function (res) {
            res.on('data', function (chunk) {
                cont += chunk;
            });
            res.on('end', function () {
                try {
                    cont = JSON.parse(cont);
                    if (httpSettings.crossPost) {
                        console.info('跨域cpost响应的cont：')
                        console.info(cont)
                    }
                    fun(cont);
                } catch (e) {
                    fun(cont);
                }
            });
        });
    req.on('error', function (e) {
        console.info('跨域cpost Error: ');
        console.info(e.message);
    });
    req.write(postData);
    req.end();
};
