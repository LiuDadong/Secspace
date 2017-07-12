/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * =================================================================
 *                              管理员登录
 * =================================================================
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
var md5 = require('md5');

module.exports = function(app, _http) {

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
                title: '用户管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');                    
        }
    });
    // 角色管理
    app.get('/man/role', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_role', {
                sid: sid,
                admin: req.cookies.admin,
                title: '角色管理',
                logout: '/logout/man'
            }); 
        } else {
            res.redirect('/');                    
        }
    });
    //设备管理
    app.get('/man/device', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_device', {
                sid: sid,
                admin: req.cookies.admin,
                title: '设备管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');          
        }
    });
    //策略管理
    app.get('/man/policy', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_policy', {
                sid: sid,
                admin: req.cookies.admin,
                title: '策略管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');         
        }
    });
    //围栏管理
    app.get('/man/rail', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_rail', {
                sid: sid,
                admin: req.cookies.admin,
                title: '围栏管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');         
        }
    });
    // 部门管理
    app.get('/man/depart', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_depart', {
                sid: sid,
                admin: req.cookies.admin,
                title: '部门管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');          
        }
    });
    //应用管理
    app.get('/man/apps', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_app', {
                sid: sid,
                admin: req.cookies.admin,
                title: '应用管理',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });
    //应用黑名单
    app.get('/man/blacklist', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_appblacklist', {
                sid: sid,
                admin: req.cookies.admin,
                title: '应用黑名单',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });
     //消息推送
    app.get('/man/message', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_message', {
                sid: sid,
                admin: req.cookies.admin,
                title: '消息推送',
                logout: '/logout/man'
            });
        } else {
            res.redirect('/');        
        }
    });
     //日志
    app.get('/man/log', function(req, res) {
        var sid = req.cookies.sid;
        if(sid) {
            res.render('man_log', {
                sid: sid,
                admin: req.cookies.admin,
                title: '日志',
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

     //查询首页数据
    app.get('/man/org/statistics', function(req, res) {
        var url = '/p/org/statistics?sid=' + req.cookies.sid;
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });
   
    /*
     * =============================================================
     *                       用户管理 man_user
     * =============================================================
     */

    //企业管理员查询员工列表
    app.get('/man/user/getUserList', function(req, res) {
        var url = '/p/org/userList?sid=' + req.cookies.sid;
            url += req.query.start ? '&start='+req.query.start : 1; 
            url += req.query.length ? '&length='+req.query.length : 10;      
            url += req.query.keyword ? '&keyword='+req.query.keyword : '';
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });

    //管理员修改员工信息
    app.post('/man/user/updateUser', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'phone': req.body.phone,
                'depart_id': req.body.depart_id,
                'name': req.body.name,
                'email': req.body.email, 
                'policy_id': req.body.policy_id, 
                'sex': req.body.sex
            },
            url = '/p/org/modifyUser';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员删除员工
    app.post('/man/user/delUser', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'users': req.body.users
            },
            url = '/p/org/delUser';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员重置员工密码
    app.post('/man/user/updatePwd', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'email': req.body.email,
                'pw': md5('xthinkers' + req.body.newpw)
            },
            url = '/p/org/resetUserPw';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员查询策略列表
    app.get('/man/policy/getPolicyList', function (req, res) {
        var url = '/p/org/listPolicy?sid=' + req.cookies.sid;
            url += '&start_page=' + req.query.start_page;
            url += '&page_length=' + req.query.page_length;

        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员策略绑定解绑操作
    app.post('/man/org/boundPolicy', function(req, res) {
        var postData = {};
        if(req.body.userId){
            postData = {
                'sid': req.cookies.sid,
                'policyId': req.body.policyId,
                'boundState': req.body.boundState,
                'userId': req.body.userId
            };
        } else {
            postData = {
                'sid': req.cookies.sid,
                'policyId': req.body.policyId,
                'boundState': req.body.boundState,
                'departId': req.body.departId
            };
        }
        var url = '/p/org/boundPolicy';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });
    
    //企业管理员获取指定用户app授权列表
    app.get('/man/userauth/authAppList', function (req, res) {
        var url = '/p/org/authAppList?sid=' + req.cookies.sid
                + '&email='+req.query.email
                + '&state='+ req.query.state;
            url += '&start_page=' + req.query.start_page;
            url += '&page_length=' + req.query.page_length;
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员对个人用户进行app授权操作
    app.post('/man/user/app_auth', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'email': req.body.email,
                'state': req.body.state,
                'package_name': req.body.package_name
            },
            url = '/p/org/authApp';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员修改用户app策略
    app.post('/man/user/saveAppRule', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'email': req.body.email,
                'package_name': req.body.package_name,
                'app_rule': req.body.app_rule
            },
            url = '/p/org/saveAppRule';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });

    //企业管理员添加用户
    app.post('/man/user/addUser', function (req, res) {
        var postData;
        if(req.body.departId){
            postData = {
                'sid': req.cookies.sid,
                'email': req.body.email,
                'phone': req.body.phone ? req.body.phone : '',
                'depart_id': req.body.departId,
                'name': req.body.username,
                'sex': req.body.sex
            };
        } else {
            postData = {
                'sid': req.cookies.sid,
                'email': req.body.email,
                'phone': req.body.phone ? req.body.phone : '',
                'name': req.body.username,
                'sex': req.body.sex
            };
        } 
        url = '/p/org/addUser';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       角色管理 man_role
     * =============================================================
     */

    //查询角色列表
    app.get('/man/role/getRoleList', function(req, res) {
        var url = '/p/org/roleList?sid=' + req.cookies.sid       
                + '&start_page=' + req.query.start
                + '&page_length=' + req.query.length;
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员添加角色
    app.post('/man/role/addRole', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'name': req.body.name,
                'description': req.body.description
            },
            url = '/p/org/addRole';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });
    //企业管理员删除角色
    app.post('/man/role/delRole', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'roles': req.body.roles
            },
            url = '/p/org/deleteRole';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });
     //企业管理员修改角色
    app.post('/man/role/modifyRole', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'role_id': req.body.role_id,
                'name': req.body.name,
                'description': req.body.description
            },
            url = '/p/org/updateRole';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });
    //查询角色管理列表
    app.get('/man/role/getRoleManagerList', function(req, res) {
        var url = '/p/org/roleManagement?sid=' + req.cookies.sid       
                + '&role_id=' + req.query.role_id;
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });
    //企业管理员保存角色管理
    app.post('/man/role/roleManagement', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'role_id': req.body.role_id,
                'user_list': req.body.user_list,
                'app_list': req.body.app_list
            },
            url = '/p/org/roleManagement';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });
    /*
     * =============================================================
     *                       设备管理 man_device
     * =============================================================
     */

    //查询设备列表
    app.get('/man/dev/getDevList', function(req, res) {
        var url = '/p/dev/devList?sid=' + req.cookies.sid       
                + '&start_page=' + req.query.start_page
                + '&page_length=' + req.query.page_length;
            url += req.query.keyword
            ? '&keyword='+req.query.keyword
            : '';
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询设备基本信息 
   /* app.get('/man/dev/devBasicInfo', function(req, res) {
        var url = '/p/dev/devBasicInfo?sid=' + req.cookies.sid       
                + '&dev_id=' + req.query.dev_id;
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });*/
        // 企业管理员查询设备定位 
    app.get('/p/dev/uploadLocation', function(req, res) {
        var url = '/p/dev/uploadLocation?sid=' + req.cookies.sid       
                + '&dev_id=' + req.query.dev_id;
        _http.GET(url, function(cont) {
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
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });
   /*  //企业管理员删除设备
    app.post('/man/device/sendCmd', function(req, res) {
        var postData = {
                'cmd': req.body.cmd 
            },
            url = '/pub?id='+req.body.cmd;
        _http.POST4(postData, url, function(cont) {
            res.send(cont);
        });
    });*/
    /*
     * =============================================================
     *                       策略管理 man_policy
     * =============================================================
     */

    //企业管理员添加策略
    app.post('/man/user/add_policy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'name': req.body.name,
                'version': req.body.version,
                'dev_limit': req.body.dev_limit,
                'dev_security': req.body.dev_security,
                'network': req.body.network,
                'wifi': req.body.wifi
            },
            url = '/p/org/uploadPolicy';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });

    //删除策略
    app.post('/man/policy/policyDel', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id
            },
            url = '/p/org/deletePolicy';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });
    
    // 更新策略 
    app.post('/man/policy/updatePolicy', function (req, res) {
        var postData;
        if(req.body.dev_limit){
            postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'name': req.body.name,
                'version': req.body.version,
                'dev_limit': req.body.dev_limit,
                'dev_security': req.body.dev_security,
                'network': req.body.network,
                'wifi': req.body.wifi
            };    
        }else{
            postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'name': req.body.name,
                'version': req.body.version
            };
        }
        var url = '/p/org/updatePolicy';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改个人用户登录策略
    app.post('/man/policy/updateLoginPolicy', function (req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'name': req.body.name,
                'version': req.body.version,
                'dev_security': req.body.dev_security
            };
        
            var url = '/p/org/updatePolicy';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员给人员分配策略
    app.post('/man/policy/boundPolicy', function(req, res) {
        var postData = {};
        if(req.body.userId){
            postData = {
                'sid': req.cookies.sid,
                'policyId': req.body.id,
                'userId': req.body.userId 
            };
        }else{
            postData = {
                'sid': req.cookies.sid,
                'policyId': req.body.id,
                'departId': req.body.departId
            };
        }
            url = '/p/org/boundPolicy';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       部门管理 man_depart
     * =============================================================
     */

    // 企业管理员查询部门列表
    app.get('/man/dep/getDepartList', function(req, res) {
        var url = '/p/org/getDepartList?sid=' + req.cookies.sid;
            url += req.query.start_page ? '&start_page='+req.query.start_page : 1; 
            url += req.query.page_length ? '&page_length='+req.query.page_length : 10; 
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除部门 
    app.post('/man/depart/delDepart', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'departs': req.body.departs
            },
            url = '/p/org/delDepart';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员修改部门信息 
    app.post('/man/depart/updateDeaprtInfo', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'id': req.body.id,
                'leader_id': req.body.leader_id,
                'name': req.body.name
            },
            url = '/p/org/updateDepart';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员添加部门
    app.post('/man/depart/addDepart', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'name': req.body.name,
                'leader_id': req.body.leader_id,
                'users': req.body.users
            },
            url = '/p/org/addDepart';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员根据部门id查询员工列表
    app.get('/man/depart/members', function(req, res) {
        var url = '/p/org/members?sid=' + req.cookies.sid;
            url += req.query.start_page ? '&start_page='+req.query.start_page : 1; 
            url += req.query.page_length ? '&page_length='+req.query.page_length : 10; 
            url += '&depart_id='+ req.query.depart_id;
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询没有部门的用户
    app.get('/man/depart/freeUserList', function(req, res) {
        var url = '/p/org/freeUserList?sid=' + req.cookies.sid;
            url += req.query.start_page ? '&start_page='+req.query.start_page : 1; 
            url += req.query.page_length ? '&page_length='+req.query.page_length : 10; 
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员给部门添加员工
    app.post('/man/depart/addMembers', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'depart_id': req.body.depart_id,
                'userids': req.body.userids
            },
            url = '/p/depart/addMembers';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除部门员工
    app.post('/man/depart/delMembers', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'depart_id': req.body.depart_id,
                'userids': req.body.userids
            },
            url = '/p/depart/delMembers';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });
    
    /*
     * =============================================================
     *                       应用管理 man_app
     * =============================================================
     */

    //获取app列表
    app.get('/man/app/getAppList', function (req, res) {
        var url = '/p/app/list?sid=' + req.cookies.sid;
            url += req.query.start ? '&start_page='+req.query.start : 1; 
            url += req.query.length ? '&page_length='+req.query.length : 10;  
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });
    
    // 修改app默认策略
    app.post('/man/app/rule', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'package_name': req.body.package_name,
                'app_rule': req.body.app_rule
            },
            url = '/p/app/rule';
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员app授权、取消授权
    app.post('/man/apps/authApp', function (req, res) {
        var postData;
        if(req.body.user_list){
            postData = {
                'sid': req.cookies.sid,
                'package_name': req.body.package_name,
                'user_list': req.body.user_list,
                'state': req.body.state
            };
        } else {
            postData = {
                'sid': req.cookies.sid,
                'package_name': req.body.package_name,
                'depart_list': req.body.depart_list,
                'state': req.body.state
            };
        } 
        url = '/p/org/authApp';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });
    //管理员修改应用信息
    app.post('/man/app/updateApp', function(req, res) {
        var postData = {
                'sid': req.cookies.sid,
                'package_name': req.body.package_name,
                'app_name': req.body.app_name,
                'platform': req.body.platform,
                'from': req.body.from,
                'check_security': req.body.check_security, 
                'app_type': req.body.app_type, 
                'install_type': req.body.install_type,
                'visit_type': req.body.visit_type, 
                'describe': req.body.describe
            },
            url = '/p/app/modify';
        _http.POST1(postData, url, function(cont) {
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
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });
    /*
     * =============================================================
     *                       消息推送 man_message
     * =============================================================
     */
    //获取消息列表
    app.get('/man/message/getMessageList', function (req, res) {
        var url = '/p/org/messageList?sid=' + req.cookies.sid;
            url += req.query.start ? '&start_page='+req.query.start : 1; 
            url += req.query.length ? '&page_length='+req.query.length : 10;  
        _http.GET(url, function(cont) {
            res.send(cont);
        });
    });
    //获取推送消息列表
    app.get('/man/message/sendMessage', function (req, res) {
        var url = '/p/org/sendMessage?sid=' + req.cookies.sid;
            url += '&message_id='+req.query.message_id;  
        _http.GET(url, function(cont) {
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
        _http.POST1(postData, url, function(cont) {
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
        _http.POST1(postData, url, function(cont) {
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
        _http.POST1(postData, url, function(cont) {
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
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

   /*
     * =============================================================
     *                       日志管理 man_logs
     * =============================================================
     */
    //获取日志列表
    app.get('/man/Log/getLogList', function (req, res) {
        var url = '/p/org/uploadLog?sid=' + req.cookies.sid;
            url += '&start_page='+req.query.start_page; 
            url += '&page_length='+req.query.page_length;  
            url += '&start_time='+req.query.start_time; 
            url += '&end_time='+req.query.end_time;  
            url += '&email='+req.query.email; 
            url += '&operation='+req.query.operation;  
        _http.GET(url, function(cont) {
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
        _http.GET(url, function(cont) {
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
        _http.POST1(postData, url, function(cont) {
            res.send(cont);
        });
    });

    //企业管理员修改企业信息
    app.post('/man/setting/orgUpdateSettings', function (req, res) {
        var postData;
        if(req.body.session_expire_time){
            postData = {
                'sid': req.cookies.sid,
                'session_expire_time': req.body.session_expire_time,
                'pw_max_try_times': req.body.pw_max_try_times,
                'frozen_time': req.body.frozen_time,
                'allow_remember_pw': req.body.allow_remember_pw,
                'max_download': req.body.max_download
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
        } else{
            console.log("settings");
        } 
        url = '/p/org/orgUpdateSettings';
        _http.POST1(postData, url, function (cont) {
            res.send(cont);
        });
    });  
  
};