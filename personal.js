/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * =================================================================
 *                              个人登录
 * =================================================================
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
var md5 = require('md5');

module.exports = function(app, chttp) {

    /*
     * =============================================================
     *                      用户设备管理 per_device
     * =============================================================
     */
    // 设备管理
    app.get('/per/device', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('per_device', {
                sid: sid,
                admin: req.cookies.admin,
                title: '设备列表',
                logout: '/logout/per'
            });
        } else {
            res.redirect('/');
        }
    });

    //查询设备列表
    app.get('/per/dev/getUserDev', function(req, res) {
        var url = '/p/dev/getUserDev?sid=' + req.cookies.sid       
                + '&email=' + req.query.email;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 个人用户查询设备基本信息 
    app.get('/per/dev/devBasicInfo', function(req, res) {
        var url = '/p/dev/devBasicInfo?sid=' + req.cookies.sid       
                + '&dev_id=' + req.query.dev_id
                + '&email=' + req.query.email;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                      用户部门管理 per_depart
     * =============================================================
     */
    app.get('/per/depart', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('per_depart', {
                sid: sid,
                admin: req.cookies.admin,
                title: '部门管理',
                logout: '/logout/per'
            });
        } else {
            res.redirect('/');
        }
    });
    //根据部门id获取部门信息接口 
    app.get('/per/getDepart', function(req, res) {
        var url = '/p/org/getDepartById?sid=' + req.cookies.sid;
            url += '&departId=' + req.query.departId;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                      用户策略管理 per_policy
     * =============================================================
     */

    app.get('/per/policy', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('per_policy', {
                sid: sid,
                admin: req.cookies.admin,
                title: '策略详情',
                logout: '/logout/per'
            });
        } else {
            res.redirect('/');
        }
    });

    /*
     * =============================================================
     *                      用户主页
     * =============================================================
     */
    app.get('/per/companyicon', function(req, res) {
        var url = '/p/user/getUserInfo?sid=' + req.cookies.sid;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });
    app.get('/per/settings', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('per_settings', {
                sid: sid,
                admin: req.cookies.admin,
                title: '首页',
                logout: '/logout/per'
            });
        } else {
            res.render('per_settings', {
                sid: sid,
                admin: req.cookies.admin,
                title: '首页',
                logout: '/logout/per'
            });
        }
    });

    // 修改电话
    app.post('/per/modifyPhone', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'phone': req.body.phone,
                'captcha': req.body.captcha,
                'email': req.body.email
             },
            url = '/p/user/modifyPhone';
        chttp.POST(postData, url, function(cont) {
            res.send(cont);
        });
    });
    // 登录后修改密码 
    app.post('/per/settings/userUpdatePw', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'email': req.body.email,
                'pw': md5('xthinkers' + req.body.pw),
                'new_pw': md5('xthinkers' + req.body.new_pw)
             },
            url = '/p/user/userUpdatePw';
        chttp.POST(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 忘记密码修改密码 
    app.post('/per/userUpdatePw', function(req, res) {
        var postData = {
                'account': req.body.account,
                'pw': md5('xthinkers' + req.body.pw),
                'verify_pw': md5('xthinkers' + req.body.verify_pw)
             },
            url = '/p/user/resetPw';
        chttp.POST(postData, url, function(cont) {
            res.send(cont);
        });
    });
    // 邮箱发送验证码
    app.post('/per/sendCaptchaEmail', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'email': req.body.email
             },
            url = '/p/user/sendCaptchaEmail';
        chttp.POST(postData, url, function(cont) {
            res.send(cont);
        });
    });
    // 电话发送验证码
    app.post('/per/sendCaptchaPhone', function(req, res) {
        var postData = {
                'email': req.body.email,
                'phone': req.body.phone
             },
            url = '/p/user/sendCaptchaPhone';
        chttp.POST(postData, url, function(cont) {
            res.send(cont);
        });
    });
    // 忘记密码发送错误
    app.post('/per/send/captcha', function(req, res) {
        var postData = {
                'account': req.body.account,
                'type': req.body.type
             },
            url = '/p/user/sendCaptcha';
        chttp.POST(postData, url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       应用管理 per_app
     * =============================================================
     */
    // 应用管理 主页
    app.get('/per/apps', function(req, res) {
        if(req.cookies.sid) {
            res.render('per_app', {
                sid: req.cookies.sid,
                admin: req.cookies.admin,
                title: '应用管理',
                logout: '/logout/per'
            });
        } else {
            res.redirect('/');        
        }
    });

};