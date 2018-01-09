var express = require('express');
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', './views/pages');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser')());
app.use(require('cookie-parser')());

/* 跨域访问 */
var _http = require('./http.js');

/* 登陆页面 */
require('./login.js')(app, _http);

/* 个人 personal */
require('./personal.js')(app, _http);

/* 企业 manager */
require('./manager.js')(app, _http);

/* 错误页面 */
app.get('/404', function(req, res) { res.send('Not Found') });
app.get('/500', function(req, res) { res.send('500') });
app.get('/*', function(req, res) { res.send('Not Found') });

/* 启动监听 */
app.listen(app.get('port'), function() {
    console.log('AppsSecid-IO started on ' + app.get('port') + '.');
});
