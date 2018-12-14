var express = require('express');
var path = require('path');
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

/* 跨域访问 */
var chttp = require(path.join(__dirname, 'crossHttp.js'));
/* 登陆页面 */
require(path.join(__dirname, 'login.js'))(app, chttp);

/* 个人 personal */
// require('./personal.js')(app, chttp);
/* 企业 manager */
require(path.join(__dirname, 'manager.js'))(app, chttp);

/* 错误页面 */
app.get('/404', function(req, res) { res.send('Not Found') });
app.get('/500', function(req, res) { res.send('500') });
app.get('/*', function(req, res) { res.send('Not Found') });

/* 启动监听 */
app.listen(app.get('port'), function() {
    console.info('AppsSecid-IO running on port ' + app.get('port') + '.');
});