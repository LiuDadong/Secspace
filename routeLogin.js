/* 个人登录 */
var md5 = require('md5');

module.exports = function (app, chttp) {
    // 登录页
    app.get('/', function (req, res) {
        if (req.cookies.sid&&req.cookies.firLogin!=='0') {
            if(req.cookies.org_id=='0'){           
                res.render('super');
            }else{           
                res.render('layout');
            }
        } else {
            res.render('login');
        }
    })
    // 检查登录是否过期
    app.get('/beat', function (req, res) {
        if (req.cookies.sid) {
            res.send({rt:'0000'});
        } else {
            res.send({rt:'9001'});
        }
    })
    // 登录(登录表单的ajaxForm)
    app.post('/login', function (req, res) {
        var url = '/p/org/admLogin';
        chttp.cpost({
            'account': req.body.account,
            'passwd': md5('xthinkers' + req.body.passwd),
            'dev_ip': req.body.dev_ip
        }, url, function (cont) {
            console.log(cont);
            res.send(cont);

        });
    });
    // 获取产品名称
    app.get('/p/login/getProductName', function (req, res) {
        chttp.cget('/p/super/getProductName', function (cont) {
            res.send(cont);
        });
    });

    // 电话发送验证码
    app.post('/per/send/captchaPhone', function (req, res) {
        chttp.cpost({
            'email': req.body.email,
            'phone': req.body.phone
        }, '/p/user/sendCaptchaPhone', function (cont) {
            res.send(cont);
        });
    });

    // 用户注册
    app.post('/per/user/register', function (req, res) {
        chttp.cpost({
            'email': req.body.email,
            'pw': md5('xthinkers' + req.body.pw)
        }, '/p/user/register', function (cont) {
            res.send(cont);
        });
    });

    // 用户注册时验证收到的验证码
    app.post('/per/register/verifyRegisterCaptcha', function (req, res) {
        chttp.cpost({
            'email': req.body.email,
            'captcha': req.body.captcha
        }, '/p/user/verifyRegisterCaptcha', function (cont) {
            res.send(cont);
        });
    });


    app.get('/logout', function (req, res) {
        var postData = {
            "sid": req.cookies.sid,
            "dev_ip": req.cookies.dev_ip
        };
        chttp.cpost(postData, '/p/org/admLogout', function (cont) {
            for(i in req.cookies){
                res.clearCookie(i);
            }
            res.redirect('/');
        });
    });
};