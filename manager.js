/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * =================================================================
 *                              管理员登录
 * =================================================================
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
var md5 = require('md5');

module.exports = function(app, chttp) {

    /*
     * =============================================================
     *                      企业版页面框架 
     * =============================================================
     */

    // 管理员主页
    app.get('/man/first', function(req, res) {
        var sid = req.cookies.sid;
       if(sid) {
            res.render('man_first', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '系统主页',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');         
        }
    });

    // 用户管理
    app.get('/man/user', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_user', {
                sid: sid,
                admin: req.cookies.admin,
                passwd: req.cookies.passwd,
                email: req.cookies.email,
                title: '用户管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');                    
        }
    });

    // 用户组管理
    app.get('/man/users', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_users', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                passwd: req.cookies.passwd,
                title: '用户组管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');                    
        }
    });

    // 标签管理
    app.get('/man/tag', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_tag', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                passwd: req.cookies.passwd,
                title: '标签管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');                    
        }
    });
    // 用户标签管理
    app.get('/man/usertag', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_usertag', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                passwd: req.cookies.passwd,
                title: '用户标签管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');
        }
    });

    // 设备管理
    app.get('/man/device', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_device', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '设备管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');          
        }
    });

    // 设备策略
    app.get('/man/devpolicy', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_devpolicy', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '设备策略',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');         
        }
    });

    // 围栏策略
    app.get('/man/railpoliicy', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_railpolicy', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '围栏策略',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');         
        }
    });

    // 应用策略
    app.get('/man/apppolicy', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_apppolicy', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '应用策略',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');         
        }
    });

    // 合规性策略
    app.get('/man/compliance', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_compliance', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '合规策略',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');         
        }
    });

    // 应用管理
    app.get('/man/apps', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_app', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '应用管理',
                logout: '/logout/man'
            });
        } else {

            res.redirect('/');        
        }
    });

    // 应用黑名单
    app.get('/man/blacklist', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_appblacklist', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '应用黑名单',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });

    // 应用标签
    app.get('/man/apptag', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_apptag', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '应用标签',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });

    // 消息推送
    app.get('/man/message', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_message', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '消息推送',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });

    // 日志
    app.get('/man/log', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_log', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '日志',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });

    // 客户端日志
    app.get('/man/phonelog', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_phonelog', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '客户端日志',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });

    // 应用日志
    app.get('/man/applog', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_applog', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '应用日志',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });

    // 用户管理日志
    app.get('/man/userlog', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_userlog', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '用户管理日志',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });

    // 设备管理日志
    app.get('/man/devicelog', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_devicelog', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '设备管理日志',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });
    
     // 应用管理日志
    app.get('/man/appcontrollog', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_appcontrollog', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '应用管理日志',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });

     // 策略管理日志
    app.get('/man/policylog', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_policylog', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '策略管理日志',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });
    
     // 管理员日志
    app.get('/man/adminlog', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_adminlog', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '管理员日志',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });

     // 违规情况日志
    app.get('/man/violationlog', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_violationlog', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '违规情况日志',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });
    
    // 版本管理
    app.get('/man/version', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_version', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '版本管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');          
        }
    });

    // 设置
    app.get('/man/settings', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_setting', {
                sid: sid,
                admin: req.cookies.admin,
                email: req.cookies.email,
                title: '设置',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');    
        }
    });

    /*
     * =============================================================
     *                       系统首页 man_first
     * =============================================================
     */

    // 查询首页数据
    app.get('/man/org/statistics', function(req, res) {
        var url = '/p/org/statistics?sid=' + req.cookies.sid;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });
   
    /*
     * =============================================================
     *                       用户管理 man_user
     * =============================================================
     */

    // 企业管理员查询员工列表
    app.get('/man/user/getUserList', function(req, res) {
        var url = '/p/org/userList?sid=' + req.cookies.sid;
            url += req.query.start ? '&start='+req.query.start : 1; 
            url += req.query.length ? '&length='+req.query.length : 10;      
            url += req.query.keyword ? '&keyword='+req.query.keyword : '';
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询用户策略列表
    app.post('/man/user/getPolicyByUserId', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id
            },
            url = '/p/org/policyByUserId';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 下载导入用户模板
    app.get('/man/user/templateDownload', function(req, res) {
        var url = '/p/org/templateDownload?name=' + req.query.name;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 管理员修改员工信息
    app.post('/man/user/updateUser', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'phone': req.body.phone,
                'depart_id': req.body.depart_id,
                'name': req.body.name,
                'email': req.body.email, 
                'tag_id': req.body.tag_id
            },
            url = '/p/org/modifyUser';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除员工
    app.post('/man/user/delUser', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'users': req.body.users
            },
            url = '/p/org/delUser';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员重置员工密码
    app.post('/man/user/updatePwd', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'account': req.body.account,
                'pw': md5('xthinkers' + req.body.newpw)
            },
            url = '/p/org/resetUserPw';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加用户
    app.post('/man/user/addUser', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'email': req.body.email,
            'phone': req.body.phone ? req.body.phone : '',
            'depart_id': req.body.depart_id,
            'name': req.body.name,
            'account': req.body.account,
            'active_code':  req.body.active_code,
            'valid_time': req.body.valid_time,
            'tag_id': req.body.tag_id,
            'flag': req.body.flag
        };
        url = '/p/org/addUser';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询用户标签列表
    app.get('/man/user/getTagList', function (req, res) {
        var url = '/p/org/userTagList?sid=' + req.cookies.sid;
            url += '&id=' + req.query.id;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询用户已经激活设备列表
    app.get('/man/user/getDeviceList', function (req, res) {
        var url = '/p/org/activeDevList?sid=' + req.cookies.sid;
            url += '&id=' + req.query.id;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员激活用户
    app.post('/man/user/activeInvite', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'user_list': req.body.user_list
            },
            url = '/p/org/activeInvite';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员根据用户组id获取用户列表
    app.get('/man/user/getUserByDepart', function (req, res) {
        var url = '/p/org/members?sid=' + req.cookies.sid;
            url += '&depart_id=' + req.query.depart_id;
            url += '&start_page=' + req.query.start;
            url += '&page_length=' + req.query.length;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员根据标签id获取用户列表
    app.get('/man/user/getUserByTag', function (req, res) {
        var url = '/p/org/userByTag?sid=' + req.cookies.sid;
            url += '&id=' + req.query.id;
            url += '&start_page=' + req.query.start;
            url += '&page_length=' + req.query.length;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员根据标签id和用户组id获取用户列表
    app.get('/man/user/getMembers', function (req, res) {
         console.time('Timer100');
        var url = '/p/org/members?sid=' + req.cookies.sid;
            url += '&start_page=' + req.query.start;
            url += '&page_length=' + req.query.length;
            if(req.query.depart_id){
                url += '&depart_id=' + req.query.depart_id;
            }
            if(req.query.tag_id){
                url += '&tag_id=' + req.query.tag_id;
            }
            if(req.query.keyword){
                url += '&keyword=' + req.query.keyword;
            }
            
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
         console.timeEnd('Timer100');
    });

    /*
     * =============================================================
     *                       用户组管理 man_users
     * =============================================================
     */

    // 查询所有用户组
    app.get('/man/users/getUsersList', function(req, res) {
        var url = '/p/org/getDepartList?sid=' + req.cookies.sid
                + '&depart_id='+req.query.depart_id;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加用户组
    app.post('/man/users/addUserGroup', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'name': req.body.name,
            'status': req.body.status,
            'parent_id': req.body.parent_id
        };
        url = '/p/org/addDepart';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 管理员修改用户组
    app.post('/man/users/updateUsers', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'name': req.body.name,
                'status': req.body.status,
                'parent_id': req.body.parent_id
            },
            url = '/p/org/updateDepart';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除用户组
    app.post('/man/users/delUsers', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'departs': req.body.departs
            },
            url = '/p/org/delDepart';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 查询用户组里用户和不属于用户组用户
    app.get('/man/users/freeUserList', function(req, res) {
        var url = '/p/org/departManagement?sid=' + req.cookies.sid       
                + '&depart_id=' + req.query.depart_id;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 用户组添加用户删除用户
    app.post('/man/users/addUsers', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'depart_id': req.body.depart_id,
                'user_list': req.body.user_list
            },
            url = '/p/org/departManagement';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       标签管理 man_tag
     * =============================================================
     */

    // 查询标签列表
    app.get('/man/tag/getTagList', function(req, res) {
        var url = '/p/org/tagList?sid=' + req.cookies.sid       
                + '&start_page=' + req.query.start
                + '&page_length=' + req.query.length;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加标签
    app.post('/man/tag/addTag', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'name': req.body.name,
            'tag_type': req.body.tag_type,
            'status': req.body.status,
            'description': req.body.description
        };
        url = '/p/org/addTag';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 管理员修改标签信息
    app.post('/man/tag/updateTag', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'tag_id': req.body.tag_id,
                'name': req.body.name,
                'tag_type': req.body.tag_type,
                'status': req.body.status,
                'description': req.body.description
            },
            url = '/p/org/updateTag';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除标签
    app.post('/man/tag/delTag', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'tag_ids': req.body.tag_ids
            },
            url = '/p/org/deleteTag';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });
    
    // 查询标签里面用户列表
    app.get('/man/tag/tagManagement', function(req, res) {
        var url = '/p/org/tagManagement?sid=' + req.cookies.sid       
                + '&tag_id=' + req.query.tag_id;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 标签添加用户删除用户
    app.post('/man/tag/addUsers', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'tag_id': req.body.tag_id,
                'user_list': req.body.user_list,
                'app_list': req.body.app_list
            },
            url = '/p/org/tagManagement';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       设备管理 man_device
     * =============================================================
     */

    // 查询设备列表
    app.get('/man/dev/getDevList', function(req, res) {
        var url = '/p/dev/devList?sid=' + req.cookies.sid       
                + '&start_page=' + req.query.start_page
                + '&page_length=' + req.query.page_length;
            url += req.query.keyword
            ? '&keyword='+req.query.keyword
            : '';
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 根据ID查询用户策略
    app.post('/man/device/orgGetPolicy', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'dev_id': req.body.dev_id
            },
            url = '/p/org/orgGetPolicyById';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员推送指令到设备
    app.post('/man/device/sendCmd', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'opt_type': req.body.opt_type,
                'dev_id': req.body.dev_id
            },
            url = '/p/push/PushDev';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询设备定位 
    app.get('/p/dev/uploadLocation', function(req, res) {
        var url = '/p/dev/uploadLocation?sid=' + req.cookies.sid       
                + '&dev_id=' + req.query.dev_id;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });
   
    //企业管理员删除设备
    app.post('/man/device/delDevice', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'dev_id': req.body.dev_id
            },
            url = '/p/dev/delete';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       设备策略管理 man_devpolicy
     * =============================================================
     */

    // 企业管理员查询设备策略列表
    app.get('/man/devpolicy/getDevpolicyList', function(req, res) {
        var url = '/p/org/listPolicy?sid=' + req.cookies.sid;
            url += '&policy_type=device'; 
            url += req.query.start_page ? '&start_page='+req.query.start_page : 1; 
            url += req.query.page_length ? '&page_length='+req.query.page_length : 10; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询已应用／已下发用户列表
    app.get('/man/devpolicy/getUserByPolicyId', function(req, res) {
        var url = '/p/org/userByPolicyId?sid=' + req.cookies.sid;
            url += '&policy_type=device'; 
            url += '&id='+req.query.id; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加设备策略
    app.post('/man/devpolicy/add_policy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'name': req.body.name,
                'position_strategy': req.body.position_strategy,
                'dev_limit': req.body.dev_limit,
                'dev_security': req.body.dev_security,
                'policy_type': 'device',
                'wifi': req.body.wifi
            },
            url = '/p/org/uploadPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 删除策略
    app.post('/man/devpolicy/policyDel', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'policy_type': 'device'
            },
            url = '/p/org/deletePolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });
    
    // 更新策略 
    app.post('/man/devpolicy/updatePolicy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'name': req.body.name,
                'position_strategy': req.body.position_strategy,
                'dev_limit': req.body.dev_limit,
                'dev_security': req.body.dev_security,
                'policy_type': 'device',
                'wifi': req.body.wifi
            };    
        var url = '/p/org/updatePolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员分配策略
    app.post('/man/devpolicy/boundPolicy', function(req, res) {
        var postData = {};
        if(req.body.user_list){
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': 'device',
                'user_list': req.body.user_list 
            };
        } else if(req.body.depart_id){
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': 'device',
                'depart_id': req.body.depart_id 
            };
        } else {
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': 'device',
                'tag_id': req.body.tag_id 
            };
        }
            url = '/p/org/boundPolicy';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 策略的启用/禁用 
    app.post('/man/devpolicy/changePolicyStatus', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'ids': req.body.ids,
                'status': req.body.status,
                'policy_type': 'device'
            };    
        var url = '/p/org/changePolicyStatus';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 用户取消策略 
    app.post('/man/devpolicy/unbindPolicy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'uid': req.body.uid,
                'policy_type': 'device'
            };    
        var url = '/p/org/unbindPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });
    /*
     * =============================================================
     *                       合规策略管理 man_complicance
     * =============================================================
     */

    // 企业管理员查询合规策略列表
    app.get('/man/complicance/getPolicyList', function(req, res) {
        var url = '/p/org/listComPolicy?sid=' + req.cookies.sid;
            url += '&policy_type=complicance'; 
            url += req.query.start_page ? '&start_page='+req.query.start_page : 1; 
            url += req.query.page_length ? '&page_length='+req.query.page_length : 10; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询已应用／已下发用户列表
    app.get('/man/complicance/getUserByPolicyId', function(req, res) {
        var url = '/p/org/userByPolicyId?sid=' + req.cookies.sid;
            url += '&policy_type=complicance'; 
            url += '&id='+req.query.id; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加合规策略
    app.post('/man/complicance/add_policy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'name': req.body.name,
                'delay': req.body.delay,
                'complicance_item': req.body.complicance_item,
                'violation_limit': req.body.violation_limit,
                'policy_type': 'complicance'
            },
            url = '/p/org/uploadComPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 删除策略
    app.post('/man/complicance/policyDel', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'policy_type': 'complicance'
            },
            url = '/p/org/deleteComPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });
    
    // 更新策略 
    app.post('/man/complicance/updatePolicy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'name': req.body.name,
                'delay': req.body.delay,
                'complicance_item': req.body.complicance_item,
                'violation_limit': req.body.violation_limit,
                'policy_type': 'complicance',
            };    
        var url = '/p/org/updateComPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员分配策略
    app.post('/man/complicance/boundPolicy', function(req, res) {
        var postData = {};
        if(req.body.user_list){
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': 'complicance',
                'user_list': req.body.user_list 
            };
        } else if(req.body.depart_id){
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': 'complicance',
                'depart_id': req.body.depart_id 
            };
        } else {
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': 'complicance',
                'tag_id': req.body.tag_id 
            };
        }
            url = '/p/org/boundPolicy';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 策略的启用/禁用 
    app.post('/man/complicance/changePolicyStatus', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'ids': req.body.ids,
                'status': req.body.status,
                'policy_type': 'complicance'
            };    
        var url = '/p/org/changeComPolicyStatus';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 用户取消策略 
    app.post('/man/complicance/unbindPolicy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'uid': req.body.uid,
                'policy_type': 'complicance'
            };    
        var url = '/p/org/unbindPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

     /*
     * =============================================================
     *                       围栏策略管理 man_railpolicy
     * =============================================================
     */

    // 企业管理员查询策略列表
    app.get('/man/railpolicy/getRailpolicyList', function(req, res) {
        var url = '/p/org/listFencePolicy?sid=' + req.cookies.sid;
            url += req.query.start_page ? '&start_page='+req.query.start_page : 1; 
            url += req.query.page_length ? '&page_length='+req.query.page_length : 10; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询已启用设备策略
    app.get('/man/policy/getUsedDevPolicy', function(req, res) {
        var url = '/p/org/onDevPolicy?sid=' + req.cookies.sid;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加围栏策略
    app.post('/man/railpolicy/add_policy', function (req, res) {
        var postData = req.body;
        postData.sid=req.cookies.sid;
        console.log(postData);
        chttp.cpost(postData,'/p/org/uploadFencePolicy', function (cont) {
            console.log(cont);
            res.send(cont);

        });
    });

    // 企业管理员修改围栏策略
    app.post('/man/railpolicy/mod_policy', function (req, res) {
        var postData = req.body;
        postData.sid=req.cookies.sid;
        console.log(postData);
        chttp.cpost(postData, '/p/org/updateFencePolicy', function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除策略
    app.post('/man/railpolicy/del_policy', function (req, res) {
        var postData = {}, url;
        if(req.body.geoids){
            postData = {
                'sid': req.cookies.sid,
                'ids': req.body.geoids,
                'policy_type': 'geofence'
            };
            url = '/p/org/deleteFencePolicy';
            chttp.cpost(postData, url, function (cont) {
                res.send(cont);
            });
        }
        if(req.body.timeids){
            postData = {
                'sid': req.cookies.sid,
                'ids': req.body.timeids,
                'policy_type': 'timefence'
            };
            url = '/p/org/deleteFencePolicy';
            chttp.cpost(postData, url, function (cont) {
                res.send(cont);
            });
        }
    });

    // 企业管理员策略的启用/禁用
    app.post('/man/railpolicy/changePolicyStatus', function (req, res) {
        var postData = {}, url;
        if(req.body.geoids){
            postData = {
                'sid': req.cookies.sid,
                'ids': req.body.geoids,
                'policy_type': 'geofence',
                'status': req.body.status
            };
            url = '/p/org/changeFencePolicyStatus';
            chttp.cpost(postData, url, function (cont) {
                res.send(cont);
            });
        }
        if(req.body.timeids){
            postData = {
                'sid': req.cookies.sid,
                'ids': req.body.timeids,
                'policy_type': 'timefence',
                'status': req.body.status
            };
            url = '/p/org/changeFencePolicyStatus';
            chttp.cpost(postData, url, function (cont) {
                res.send(cont);
            });
        }
    });
    
    // 企业管理员查询已应用／已下发用户列表
    app.get('/man/railpolicy/getUserByFencePolicyId', function(req, res) {
        var url = '/p/org/userByPolicyId?sid=' + req.cookies.sid
                + '&policy_type='+req.query.policy_type 
                + '&id='+req.query.id; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 取消策略 
    app.post('/man/railpolicy/unbindPolicy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'uid': req.body.uid,
                'policy_type': req.body.policy_type
            };    
        var url = '/p/org/unbindPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员分配策略
    app.post('/man/railpolicy/boundPolicy', function(req, res) {
        var postData = {};
        if(req.body.user_list){
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': req.body.policy_type,
                'user_list': req.body.user_list 
            };
        } else if(req.body.depart_id){
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': req.body.policy_type,
                'depart_id': req.body.depart_id 
            };
        } else {
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': req.body.policy_type,
                'tag_id': req.body.tag_id 
            };
        }
            url = '/p/org/boundPolicy';
        console.time('Timer5');
        chttp.cpost(postData, url, function(cont) {
            console.timeEnd('Timer5');
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       系统应用策略 man_apppolicy
     * =============================================================
     */

    // 企业管理员查询策略列表
    app.get('/man/apppolicy/getApppolicyList', function(req, res) {
        var url = '/p/org/listAppPolicy?sid=' + req.cookies.sid;
            url += req.query.start_page ? '&start_page='+req.query.start_page : 1; 
            url += req.query.page_length ? '&page_length='+req.query.page_length : 10; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询已应用／已下发用户列表
    app.get('/man/apppolicy/getUserByPolicyId', function(req, res) {
        var url = '/p/org/userByPolicyId?sid=' + req.cookies.sid;
            url += '&policy_type='+req.query.policy_type; 
            url += '&id='+req.query.id; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询已启用黑名单
    app.get('/man/apppolicy/onBlackList', function(req, res) {
        var url = '/p/org/onBlackList?sid=' + req.cookies.sid;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询所有应用列表
    app.get('/man/apppolicy/appList', function(req, res) {
        var url = '/p/org/appList?sid=' + req.cookies.sid;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询已启用策略 0
    app.get('/man/apppolicy/getUsedDevPolicy', function(req, res) {
        var url = '/p/org/onDevPolicy?sid=' + req.cookies.sid;
            url += req.query.start_page ? '&start_page='+req.query.start_page : 1; 
            url += req.query.page_length ? '&page_length='+req.query.page_length : 10; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询应用授权
    app.post('/man/apppolicy/appAuthList', function (req, res) {
        var postData = {}, url;
        postData = {
            'sid': req.cookies.sid,
            'policy_id': req.body.policy_id,
            'policy_type': req.body.policy_type
        };
        url = '/p/org/appAuthList';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加策略
    app.post('/man/apppolicy/add_policy', function (req, res) {
        var postData = {}, url;
        if(req.body.whiteapp){
            if(req.body.site_range && req.body.time_limit){
                postData = {
                    'sid': req.cookies.sid,
                    'name': req.body.name,
                    'limit': req.body.limit,
                    'site_range': req.body.site_range,
                    'time_limit': req.body.time_limit,
                    'app_list': req.body.app_list,
                    'policy_type': 'whiteapp'
                };
            } else if(req.body.time_limit) {
                postData = {
                    'sid': req.cookies.sid,
                    'name': req.body.name,
                    'limit': req.body.limit,
                    'time_limit': req.body.time_limit,
                    'app_list': req.body.app_list,
                    'policy_type': 'whiteapp'
                };
            } else {
                postData = {
                    'sid': req.cookies.sid,
                    'name': req.body.name,
                    'limit': req.body.limit,
                    'site_range': req.body.site_range,
                    'app_list': req.body.app_list,
                    'policy_type': 'whiteapp'
                };
            }
        } else {
            postData = {
                'sid': req.cookies.sid,
                'name': req.body.name,
                'delay': req.body.delay,
                'black_id': req.body.black_id,
                'violation_limit': req.body.violation_limit,
                'policy_type': 'blackapp'
            };
        }
        url = '/p/org/uploadAppPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改策略
    app.post('/man/apppolicy/mod_policy', function (req, res) {
        var postData = {}, url;
        if(req.body.whiteapp){
            if(req.body.site_range && req.body.time_limit){
                postData = {
                    'sid': req.cookies.sid,
                    'id': req.body.id,
                    'name': req.body.name,
                    'limit': req.body.limit,
                    'site_range': req.body.site_range,
                    'time_limit': req.body.time_limit,
                    'app_list': req.body.app_list,
                    'policy_type': 'whiteapp'
                };
            } else if(req.body.time_limit) {
                postData = {
                    'sid': req.cookies.sid,
                    'id': req.body.id,
                    'name': req.body.name,
                    'limit': req.body.limit,
                    'time_limit': req.body.time_limit,
                    'app_list': req.body.app_list,
                    'policy_type': 'whiteapp'
                };
            } else {
                postData = {
                    'sid': req.cookies.sid,
                    'id': req.body.id,
                    'name': req.body.name,
                    'limit': req.body.limit,
                    'site_range': req.body.site_range,
                    'app_list': req.body.app_list,
                    'policy_type': 'whiteapp'
                };
            }
            
        } else {
            postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'name': req.body.name,
                'delay': req.body.delay,
                'black_id': req.body.black_id,
                'violation_limit': req.body.violation_limit,
                'policy_type': 'blackapp'
            };
        }
        url = '/p/org/updateAppPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除策略
    app.post('/man/apppolicy/del_policy', function (req, res) {
        var postData = {}, url;
        postData = {
            'sid': req.cookies.sid,
            'ids': req.body.ids,
            'policy_type': req.body.policy_type
        };
        url = '/p/org/deleteAppPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员策略的启用/禁用
    app.post('/man/apppolicy/changePolicyStatus', function (req, res) {
        var postData = {}, url;
        if(req.body.whiteapp){
            postData = {
                'sid': req.cookies.sid,
                'ids': req.body.ids,
                'policy_type': 'whiteapp',
                'status': req.body.status
            };
            url = '/p/org/changeAppPolicyStatus';
            chttp.cpost(postData, url, function (cont) {
                res.send(cont);
            });
        }

        if(req.body.blackapp){
            postData = {
                'sid': req.cookies.sid,
                'ids': req.body.ids,
                'policy_type': 'blackapp',
                'status': req.body.status
            };
            url = '/p/org/changeAppPolicyStatus';
            chttp.cpost(postData, url, function (cont) {
                res.send(cont);
            });
        }
    });
    // 取消策略 
    app.post('/man/apppolicy/unbindPolicy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'uid': req.body.uid,
                'policy_type': req.body.policy_type
            };    
        var url = '/p/org/unbindPolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员分配策略
    app.post('/man/apppolicy/boundPolicy', function(req, res) {
        var postData = {};
        if(req.body.user_list){
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': req.body.policy_type,
                'user_list': req.body.user_list 
            };
        } else if(req.body.depart_id){
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': req.body.policy_type,
                'depart_id': req.body.depart_id 
            };
        } else {
            postData = {
                'sid': req.cookies.sid,
                'policy_id': req.body.policy_id,
                'policy_type': req.body.policy_type,
                'tag_id': req.body.tag_id 
            };
        }
            url = '/p/org/boundPolicy';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });
    /*
     * =============================================================
     *                       应用管理 man_app
     * =============================================================
     */

    // 获取app列表
    app.get('/man/app/getAppList', function (req, res) {
        var url = '/p/app/list?sid=' + req.cookies.sid;
            url += req.query.start ? '&start_page='+req.query.start : 1; 
            url += req.query.length ? '&page_length='+req.query.length : 10;  
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 获取已安装应用的设备列表
    app.get('/man/app/getDeviceList', function (req, res) {
        var url = '/p/app/devByUserId?sid=' + req.cookies.sid
                +'&package_name='+req.query.package_name; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });
    
    // 企业管理员app授权、取消授权
    app.post('/man/apps/authApp', function (req, res) {
        var postData;
        if(req.body.user_list){
            postData = {
                'sid': req.cookies.sid,
                'package_name': req.body.package_name,
                'user_list': req.body.user_list,
                'state': req.body.state
            };
        } else if(req.body.depart_list) {
            postData = {
                'sid': req.cookies.sid,
                'package_name': req.body.package_name,
                'depart_list': req.body.depart_list,
                'state': req.body.state
            };
        } else {
            postData = {
                'sid': req.cookies.sid,
                'package_name': req.body.package_name,
                'tag_list': req.body.tag_list,
                'state': req.body.state
            };
        } 
        url = '/p/org/authApp';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 管理员修改应用信息
    app.post('/man/app/updateApp', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'package_name': req.body.package_name,
                'platform': req.body.platform,
                'apptag': req.body.apptag,
                'sysRequest': req.body.sysRequest, 
                'install_type': req.body.install_type,
                'visit_type': req.body.visit_type, 
                'describe': req.body.describe
            },
            url = '/p/app/modify';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除app
    app.post('/man/apps/delapps', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'downloads': req.body.downloads
            },
            url = '/p/app/del';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 根据app标签获取对应app列表
    app.get('/man/app/getAppTag', function (req, res) {
        var url = '/p/app/appTagList?sid=' + req.cookies.sid;
            url += '&id='+req.query.id; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 根据标签获取app列表
    app.get('/man/app/getAppByTag', function (req, res) {
        var url = '/p/org/appInfoByAppTag?sid=' + req.cookies.sid;
            url += '&id='+req.query.id; 
            url += req.query.start ? '&start_page='+req.query.start : 1; 
            url += req.query.length ? '&page_length='+req.query.length : 10;  
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       应用黑名单 man_appBlacklist
     * =============================================================
     */

    // 获取应用黑名单列表
    app.get('/man/blackList/getAppBlickList', function (req, res) {
        var url = '/p/app/ShowBlackList?sid=' + req.cookies.sid;
            url += req.query.start ? '&start_page='+req.query.start : 1; 
            url += req.query.length ? '&page_length='+req.query.length : 10;  
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 添加应用黑名单
    app.post('/man/blackList/addBlickList', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'name': req.body.name,
                'describe': req.body.describe,
                'app_name': req.body.app_name,
                'package_name': req.body.package_name
            },
            url = '/p/app/addBlackList';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 修改应用黑名单
    app.post('/man/blackList/updateBlickList', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'name': req.body.name,
                'describe': req.body.describe,
                'app_name': req.body.app_name,
                'package_name': req.body.package_name
            },
            url = '/p/app/updateBlackList';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 删除应用黑名单
    app.post('/man/blackList/deleteBlickList', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id
            },
            url = '/p/app/delBlackList';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 黑名单禁用/启用
    app.post('/man/blackList/updateStatus', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'flag': req.body.flag,
            },
            url = '/p/app/statusBlackList';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       应用标签 man_appTag
     * =============================================================
     */

    // 获取应用标签列表
    app.get('/man/appTag/getAppTagList', function (req, res) {
        var url = '/p/org/appTagList?sid=' + req.cookies.sid;
            url += req.query.start ? '&start_page='+req.query.start : 1; 
            url += req.query.length ? '&page_length='+req.query.length : 10;  
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 添加应用标签
    app.post('/man/appTag/addAppTag', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'name': req.body.name,
                'description': req.body.description
            },
            url = '/p/org/addAppTag';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 修改应用标签
    app.post('/man/appTag/updateAppTag', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'apptag_id': req.body.apptag_id,
                'name': req.body.name,
                'description': req.body.description
            },
            url = '/p/org/updateAppTag';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 删除应用标签
    app.post('/man/appTag/deleteAppTag', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'apptag_ids': req.body.apptag_ids
            },
            url = '/p/org/deleteAppTag';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 获取应用标签对应的应用列表
    app.get('/man/appTag/getAppByTag', function (req, res) {
        var url = '/p/org/appTagManagement?sid=' + req.cookies.sid;
            url += '&apptag_id='+req.query.apptag_id; 
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 应用标签添加应用
    app.post('/man/appTag/addApp', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'apptag_id': req.body.apptag_id,
                'app_list': req.body.app_list
            },
            url = '/p/org/appTagManagement';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       消息推送 man_message
     * =============================================================
     */

    // 获取消息列表
    app.get('/man/message/getMessageList', function (req, res) {
        var url = '/p/org/messageList?sid=' + req.cookies.sid;
            url += req.query.start ? '&start_page='+req.query.start : 1; 
            url += req.query.length ? '&page_length='+req.query.length : 10;  
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 获取推送消息列表
    app.get('/man/message/sendMessage', function (req, res) {
        var url = '/p/org/sendMessage?sid=' + req.cookies.sid;
            url += '&message_id='+req.query.message_id;  
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加消息
    app.post('/man/message/addMessage', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'title': req.body.title,
                'content': req.body.content
            },
            url = '/p/org/addMessage';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除消息
    app.post('/man/message/deleteMessage', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'message_ids': req.body.message_ids
            },
            url = '/p/org/deleteMessage';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改消息
    app.post('/man/message/modifyMessage', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'message_id': req.body.message_id,
                'title': req.body.title,
                'content': req.body.content
            },
            url = '/p/org/modifyMessage';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员推送消息
    app.post('/man/message/sendMessage', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'message_id': req.body.message_id,
                'users': req.body.users
            },
            url = '/p/org/sendMessage';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       日志管理 man_logs
     * =============================================================
     */

    // 获取日志列表
    app.get('/man/Log/getLogList', function (req, res) {
        var url = '/p/org/uploadLog?sid=' + req.cookies.sid;
            url += '&start_page='+req.query.start_page; 
            url += '&page_length='+req.query.page_length;  
            url += '&start_time='+req.query.start_time; 
            url += '&end_time='+req.query.end_time;  
            url += '&account='+req.query.account; 
            url += '&operation='+req.query.operation;  
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 获取日志列表
    app.get('/man/Log/getLog', function (req, res) {
        var url = '/p/org/viewLog?sid=' + req.cookies.sid;
            url += '&start_page='+req.query.start_page; 
            url += '&page_length='+req.query.page_length;  
            url += '&start_time='+req.query.start_time; 
            url += '&end_time='+req.query.end_time;  
            url += '&category='+req.query.category; 
        if(req.query.log_type){
            url += '&log_type='+req.query.log_type; 
        }
        if(req.query.keyword){
            url += '&keyword='+req.query.keyword;
        }  
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       应用管理 man_version
     * =============================================================
     */

    // 获取版本列表
    app.get('/man/file/listApp', function (req, res) {
        var url = '/p/file/listApp?sid=' + req.cookies.sid;
            url += '&start_page='+req.query.start_page; 
            url += '&page_length='+req.query.page_length;  
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员生效取消生效
    app.post('/man/version/authSecspace', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                '_id': req.body._id,
                'status': req.body.status
            },
            url = '/p/org/authSecspace';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改版本
    app.post('/man/version/modifyVersion', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                '_id': req.body._id,
                'name': req.body.name,
                'versioncode': req.body.versioncode,
                'describe': req.body.describe
            },
            url = '/p/org/modifyVersion';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除版本
    app.post('/man/version/deleteApp', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'versions': req.body.versions
            },
            url = '/p/org/deleteApp';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });
    
    /*
     * =============================================================
     *                       设置 man_setting
     * =============================================================
     */

    // 企业管理员获取企业基本信息
    app.get('/man/setting/orgGetSettings', function(req, res) {
        var url = '/p/org/orgGetSettings?sid=' + req.cookies.sid;
        chttp.cget(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改自己密码
    app.post('/man/setting/orgUpdatePw', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'old_passwd': md5('xthinkers' + req.body.old_passwd),
                'new_passwd': md5('xthinkers' + req.body.new_passwd)
            },
            url = '/p/org/orgUpdatePw';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员测试邮箱服务器地址
    app.post('/man/setting/testEmail', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'email_server': req.body.email_server,
                'send_user': req.body.send_user,
                'send_pwd': req.body.send_pwd,
                'recv_user': req.body.recv_user
            },
            url = '/p/org/testEmail';
        chttp.cpost(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改企业信息
    app.post('/man/setting/orgUpdateSettings', function (req, res) {
        var postData=req.body;
        postData.sid=req.cookies.sid;
        /*if(req.body.session_expire_time){
            postData = {
                'sid': req.cookies.sid,
                'session_expire_time': req.body.session_expire_time,
                'pw_max_try_times': req.body.pw_max_try_times,
                'frozen_time': req.body.frozen_time,
                'client_frozen_time': req.body.client_frozen_time,
                'client_pw_try_times': req.body.client_pw_try_times,
                'allow_remember_pw': req.body.allow_remember_pw,
                'screenshot': req.body.screenshot,
                'max_download': req.body.max_download,
                'pw_min_len': req.body.pw_min_len,
                'passwd_type': req.body.passwd_type,
                'passwd_available': req.body.passwd_available,
                'send_url': req.body.send_url                               
            };
        } else if(req.body.switchon){
            postData = {
                'sid': req.cookies.sid,
                'switch': req.body.switchon,
                'font_type': req.body.font_type,
                'font_size': req.body.font_size,
                'font_color': req.body.font_color,
                'font_opacity': req.body.font_opacity 
            };
        } else if(req.body.email_server){
            postData = {
                'sid': req.cookies.sid,
                'email_server': req.body.email_server,
                'send_user': req.body.send_user,
                'send_pwd': req.body.send_pwd,
            };
        } else if(req.body.domain_name){
            postData = {
                'sid': req.cookies.sid,
                'domain_name': req.body.domain_name,
                'send_url': req.body.send_url
            };
        } else if(req.body.company_domain){
            postData = {
                'sid': req.cookies.sid,
                'company_domain': req.body.company_domain,
                'product_name': req.body.product_name,
                'company_name': req.body.company_name
            };
        }else if(req.body.manager_name){
            postData = {
                'sid': req.cookies.sid,
                'manager_name': req.body.manager_name
            };
        }else if(req.body.identify_method){
            postData = {
                'sid': req.cookies.sid,
                'identify_method': req.body.identify_method
            };
        } else{
            console.log("settings");
        } */
        url = '/p/org/orgUpdateSettings';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });  
  
};