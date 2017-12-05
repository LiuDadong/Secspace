/* 个人登录 */
var md5 = require('md5');

module.exports = function(app, _http) {
    
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

    // login 像cookie里添加了 passwod
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
        } else {
            postData = {
                'account': req.body.account,
                'passwd': md5('xthinkers' + req.body.passwd)
            };
            url = '/p/org/orgLogin';
            admin = postData.account;
            //passwd = postData.pw;
        }      
        _http.POST1(postData, url, function(cont) {
            if(cont.rt == 0) {
                res.cookie('sid', cont.sid, {maxAge:2*60*60*1000});
                res.cookie('admin', admin);
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
        _http.POST1(postData, url, function(cont) {
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
            "sid": req.cookies.sid
        };
        res.clearCookie('sid');
        res.clearCookie('admin');       
        var url = '/p/org/orgLogout';
        _http.POST1(postData, url, function(cont) {
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
        _http.GET(url, function(cont) {
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
           
        _http.POST1(postData, url, function(cont) {
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
        _http.POST1(postData, url, function(cont) {
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
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

};