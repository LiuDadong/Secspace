/* 个人登录 */
var md5 = require('md5');
var lic0 = {
    p01: true,
    p02: { '01': true, '02': true, '03': true },
    p03: { '01': true },
    p04: { '01': true, '02': true, '03': true, '04': true, '05': true },
    p05: { '01': true },
    p06: { '01': true, '02': true, '03': true },
    p07: { '01': true, '02': true, '03': true, '04': true, '05': true, '06': true, '07': true, '08': true, '09': true },
    p08: { '01': true, '02': true, '03': true },
};
function getLicPath(baseP, lic, licPath) {
    for (i in lic) {
        switch (typeof lic[i]) {
            case 'object':
                getLicPath(baseP + i, lic[i], licPath);
                break;
            case 'boolean':
                licPath[baseP + i] = lic[i];
                break;
            default:
        }
    }
    if (baseP == '') {
        return licPath
    }
}
module.exports = function (app, chttp) {
    // 登录页
    app.get('/', function (req, res) {
        if (req.cookies.sid) {
            res.render('layout');
        } else {
            res.render('login');
        }
    })
    // 登录
    app.post('/login', function (req, res) {
        var url;
        switch (req.body.flag) {
            case 'per':
                url = '/p/user/userLogin';
                break;
            case 'admin':
                url = '/p/org/orgLogin';
                break;
            default:
                console.error("登录请求flag值错误，必须为admin或者per");
        }
        chttp.cpost({
            'account': req.body.account,
            'passwd': md5('xthinkers' + req.body.passwd),
            'dev_ip': req.body.dev_ip
        }, url, function (cont) {
            if (cont.rt == '0000') {
                res.cookie('sid', cont.sid, { maxAge: 2 * 60 * 60 * 1000 });
                res.cookie('admin', req.body.account);
                res.cookie('dev_ip', req.body.dev_ip);
                res.cookie('email', cont.manager_email);
                res.cookie('licPath', JSON.stringify(getLicPath('', cont.serverModules, {})));
                if (req.body.flag != 'per') {
                    res.cookie('avatar', cont.avatar);
                }
            }
            res.send(cont);
        });
    });
    // 获取产品名称
    app.get('/p/login/getProductName', function (req, res) {
        chttp.cget('/p/org/getProductName', function (cont) {
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
};