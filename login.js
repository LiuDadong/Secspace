/* 个人登录 */
var md5 = require('md5');

module.exports = function(app, chttp) {
    
    // 登录页
    app.get('/', function(req, res) {
        if (req.cookies.sid) {
            if (req.cookies.flag=='per') {
                res.redirect('/per/settings');
            } else {
                res.redirect('/man/first');
            }
        } else {  
            res.render('login');
        }
    });
    app.get('/test', function(req, res) {
        res.render('test')
    });
    app.post('/test/xml', function(req, res) {
        res.sendfile('xml.html');
    });

    // 向/login端口post请求
    app.post('/login', function(req, res) {
        var url,
            flag = req.body.flag,
            postData,
         //   passwd,
            admin;
        if (flag=='per') {
            postData = {
                'email': req.body.account,
                'pw': md5('xthinkers' + req.body.passwd),
                'dev_id': 'web'
            };
            url = '/p/user/userLogin';
            admin = req.body.account;
        }else if(flag=='admin') {
            postData = {
                'account': req.body.account,
                'passwd': md5('xthinkers' + req.body.passwd),
                'dev_ip': req.body.dev_ip
            };
            url = '/p/org/orgLogin';
            admin = postData.account;
            //passwd = postData.pw;
        }else{
            console.error("登录请求flag值错误，必须为man或者per")
        }
        chttp.cpost(postData, url, function(cont) {
            if(cont.rt == 0) {
                res.cookie('sid', cont.sid, {maxAge:2*60*60*1000});
                res.cookie('admin', admin);
                res.cookie('dev_ip', postData.dev_ip);
                res.cookie('email', cont.manager_email);
                if (flag!='per') {
                    res.cookie('avatar', cont.avatar);
                }
            }
            res.send(cont);
        });
    });  

    // logout-per
    app.get('/logout/per', function(req, res) {
        res.clearCookie('sid');
        res.clearCookie('admin');
        var postData = {
                "sid": req.cookies.sid,
                'dev_id': 'web'
            };
        var url = '/p/user/userLogout';
        chttp.cpost(postData, url, function(cont) {
            if(cont.rt==0 || cont.rt == 5) {                
                res.redirect('/');
            } else {
                res.redirect('/500');
            }
        });
    });

    // logout-man
    app.get('/logout/man', function(req, res) {
        var postData = {
            "sid": req.cookies.sid,
            'dev_ip': req.cookies.dev_ip
        };
        res.clearCookie('sid');
        res.clearCookie('dev_ip');
        res.clearCookie('admin');       
        var url = '/p/org/orgLogout';
        chttp.cpost(postData, url, function(cont) {
            if(cont.rt==0 || cont.rt == 5) {            
                res.redirect('/');
            } else {
                res.redirect('/500');
            }
        });
    });

    // 获取产品名称
    app.get('/p/login/getProductName', function(req, res) {
        var url = '/p/org/getProductName';
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });
   
    // 电话发送验证码
    app.post('/per/send/captchaPhone', function(req, res) {
        var postData = {
                'email': req.body.email,
                'phone': req.body.phone
             },
            url = '/p/user/sendCaptchaPhone';
           
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
         });
    });
    
    // 用户注册
    app.post('/per/user/register', function(req, res) {
        var postData = {
                'email': req.body.email,
                'pw': md5('xthinkers' + req.body.pw)
             },
            url = '/p/user/register';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });
    // 用户注册时验证收到的验证码
    app.post('/per/register/verifyRegisterCaptcha', function(req, res) {
        var postData = {
                'email': req.body.email,
                'captcha': req.body.captcha
             },
            url = '/p/user/verifyRegisterCaptcha';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

};