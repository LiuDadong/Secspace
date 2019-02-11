/*配置测试网络环境http*/
var logSettings = {
    crossGet: false, //控制跨域cget请求的日志输出
    crossPost: false //控制跨域cpost请求的日志输出
}
var PDP,
    v = 1;
// 1: 部署
// 2: 本地测试内网1 :192.168.1.25
// 3: 本地测试正式 
// 4: 本地测试惠讯
// 5: 本地测试内网2 :192.168.1.69
switch (v) {
    case 1: //上线部署
        PDP = { protocol: 'http', domain: '127.0.0.1', port: 7770 };
        break;
    case 2: //内网基础测试
        PDP = { protocol: 'https', domain: '192.168.1.25', port: 1443 };
        break;
    case 3: //本地测试正式上线
        PDP = { protocol: 'http', domain: 'tpos.appssec.cn' };
        break;
    case 4: //本地测试惠讯
        PDP = { protocol: 'https', domain: '124.207.66.125', port: 8002 };
        break;
    case 5: //内网2本地测试
        PDP = { protocol: 'https', domain: '192.168.1.69', port: 1443 };
        break;
    default:
}
/*
 * 配置网络参数PDP（protocol,domain,port）
 */
var protocol = PDP.protocol,
    domain = PDP.domain,
    port = PDP.port ? PDP.port : '';
var baseUrl = port ?
    protocol + '://' + domain + ':' + port :
    protocol + '://' + domain;

//引入所需模块
var http = (protocol === 'https') ? require('https') : require('http');
var util = require('util');
var querystring = require('querystring');
var FormData = require('form-data');


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
    if (logSettings.crossGet) { //根据设置输出log
        console.info('跨域cget请求的url:');
        console.info(url);
    }
    http.get(url, function (res) {
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            cont += chunk;
        });
        res.on('end', function () {
            if (logSettings.crossGet) {
                console.info('跨域cget响应的cont:');
                console.info(cont);
            }
            fun(cont);
        });
    }).on('error', function (err) {
        console.info("跨越cget报错:");
        console.info(err);
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
    if (logSettings.crossPost) {
        console.info('跨域cpost请求的url:');
        console.info(url);
    }
    var cont = '',
        options = {
            hostname: domain,
            path: url,
            port: parseInt(port ? port : 80),
            method: 'POST',
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                cont += chunk;
            });
            res.on('end', function () {
                try {
                    cont = JSON.parse(cont);
                    if (logSettings.crossPost) {
                        console.info('跨域cpost响应的cont：')
                        console.info(cont)
                    }
                } catch (e) {
                    console.error(e)
                }
                fun(cont);
            });
        });
    req.on('error', function (e) {
        console.info('跨域cpost Error: ');
    });
    req.write(postData);
    req.end();
};

exports.cFormData = function (postData, url, fun) {
    var form = new FormData();
    //form.append('file', fs.createReadStream("./filename.zip"));//'file'是服务器接受的key
    for(key in postData){
        form.append(key,postData[key]);
    }
    var headers = form.getHeaders();//这个不能少
    var cont = '',
        options = {
            hostname: domain,
            path: url,
            port: parseInt(port ? port : 80),
            method: 'POST',
            headers: headers
        },
        req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                cont += chunk;
            });
            res.on('end', function () {
                try {
                    cont = JSON.parse(cont);
                    if (logSettings.crossPost) {
                        console.info('跨域cFormData响应的cont：')
                        console.info(cont)
                    }
                } catch (e) {
                    console.error(e)
                }
                fun(cont);
            });
        });
    req.on('error', function (e) {
        console.info('跨域cFormData Error: ');
    });
    form.pipe(req);
};

exports.cput = function (postData, url, fun) {
    postData = querystring.stringify(postData);
    if (logSettings.crossPost) {
        console.info('跨域cput请求的url:');
        console.info(url);
    }
    var cont = '',
        options = {
            hostname: domain,
            path: url,
            port: parseInt(port ? port : 80),
            method: 'PUT',
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                cont += chunk;
            });
            res.on('end', function () {
                try {
                    cont = JSON.parse(cont);
                    if (logSettings.crossPost) {
                        console.info('跨域cput响应的cont：')
                        console.info(cont)
                    }
                } catch (e) {
                    console.error(e)
                }
                fun(cont);
            });
        });
    req.on('error', function (e) {
        console.info('跨域cput Error: ');
        console.info(e.message);
    });
    req.write(postData);
    req.end();
};
exports.cdelete = function (postData, url, fun) {
    postData = querystring.stringify(postData);
    if (logSettings.crossPost) {
        console.info('跨域cdelete请求的url:');
        console.info(url);
    }
    var cont = '',
        options = {
            hostname: domain,
            path: url,
            port: parseInt(port ? port : 80),
            method: 'DELETE',
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                cont += chunk;
            });
            res.on('end', function () {
                try {
                    cont = JSON.parse(cont);
                    if (logSettings.crossPost) {
                        console.info('跨域cdelete响应的cont：')
                        console.info(cont)
                    }
                } catch (e) {
                    console.error(e)
                }
                fun(cont);
            });
        });
    req.on('error', function (e) {
        console.info('跨域cdelete Error: ');
        console.info(e.message);
    });
    req.write(postData);
    req.end();
};