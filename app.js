var express = require('express');
<<<<<<< HEAD
var path = require('path');;;;
=======
var path = require('path');
>>>>>>> dev14_1
var app = express();
var bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

//app.use(require('body-parser')());  //老式写法引用新版本body-parser会报错
//app.use(require('body-parser')({limit:'100mb'}));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(require('cookie-parser')());

/* http请求包装 */
var chttp = require(path.join(__dirname, 'crossHttp.js'));

/* 管理员登入登出 */
require(path.join(__dirname, 'routeLogin.js'))(app, chttp);

/* 无身份通用业务请求路由 admin */
require(path.join(__dirname, 'routeCommon.js'))(app, chttp);

/* 业务管理员特有路由 admin */
require(path.join(__dirname, 'routeAdmin.js'))(app, chttp);

/* 超级管理员特有路由 super */
require(path.join(__dirname, 'routeSuper.js'))(app, chttp);

/* 错误页面 */
app.get('/404', function(req, res) { res.send('Not Found')});
app.get('/500', function(req, res) { res.send('500') });
app.get('/*', function(req, res) { res.send('Not Found') });

/* 启动监听 */
app.listen(app.get('port'), function() {
    console.info('AppsSecid-IO running on port ' + app.get('port') + '.');
});