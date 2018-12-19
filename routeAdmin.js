/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * =================================================================
 *                              业务管理员登录
 * =================================================================
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
var md5 = require('md5');
var multer = require('multer');
var querystring = require("querystring");
var fs = require("fs");
var path = require('path');
var upTransfer = multer({
    storage: multer.diskStorage({
        //设置上传后文件路径，uploads文件夹会自动创建。
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'uploads'))
        },
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            //cb(null,fileFormat[0] + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
            cb(null, file.originalname);
        }
    })
});
module.exports = function (app, chttp) {
    /*
     * =============================================================
     *                      业务管理员界面请求路由
     * =============================================================
     */
    // 管理员主页
    app.get('/sub', function (req, res) {
        var fns=req.cookies.fns;
        try{
            fns= (fns===undefined)?1:JSON.parse(fns);
        }catch(err){
            fns=1
        }
        
        if (req.query.pg&&req.cookies.sid) {
            if(req.cookies.org_id=='0'){  //根机构id为'0'，由超级管理员管理
                if (req.get('X-PJAX')) {
                    res.end(fs.readFileSync(__dirname + '/public/subpage/' + req.query.pg + '.html'));
                } else {
                    res.render('super');
                }
            }else{
                if(fns==1||(fns instanceof Array&&fns[0]==='acc')){
                    if (req.get('X-PJAX')) {
                        res.end(fs.readFileSync(__dirname + '/public/subpage/' + req.query.pg + '.html'));
                    } else {
                        res.render('layout');
                    }
                }else{
                    if (req.get('X-PJAX')) {
                        res.render('Expire404');
                    } else {
                        res.render('login');
                    }
                }
            }
        } else {
            res.redirect('/');
        }

    })

    app.get('/subpage', function (req, res) {
        if (req.cookies.sid) {
            res.end(fs.readFileSync(__dirname + '/public/subpage/' + req.query.pagename + '.html'))
        } else {
            res.send("lost");
        }
    });

    app.use('/man', function (req, res, next) {
        if (req.cookies.sid) {
            next();
        } else {
            res.redirect('/');
        }
    });




    /*
     * =============================================================
     *                       系统首页 man_first
     * =============================================================
     */



    /*
     * =============================================================
     *                       用户管理 man_user
     * =============================================================
     */

    // 企业管理员查询员工列表
    app.get('/man/user/getUserList', function (req, res) {
        var url = '/p/org/userList?sid=' + req.cookies.sid;
        url += req.query.start ? '&start_page=' + req.query.start : 1;
        url += req.query.length ? '&page_length=' + req.query.length : 10;
        url += req.query.keyword ? '&keyword=' + req.query.keyword : '';
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询用户策略列表
    app.post('/man/user/getPolicyByUserId', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'id': req.body.id
        },
            url = '/p/org/policyByUserId';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 下载导入用户模板
    app.get('/man/user/templateDownload', function (req, res) {
        var url = '/p/org/templateDownload?name=' + req.query.name;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });



    // 企业管理员删除员工
    app.post('/man/user/delUser', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'users': req.body.users
        },
            url = '/p/org/delUser';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员重置员工密码
    app.post('/man/user/updatePwd', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'account': req.body.account,
            'pw': md5('xthinkers' + req.body.newpw)
        },
            url = '/p/org/resetUserPw';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询用户标签列表
    app.get('/man/user/getTagList', function (req, res) {
        var url = '/p/org/userTagList?sid=' + req.cookies.sid;
        url += '&id=' + req.query.id;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询用户已经激活设备列表
    app.get('/man/user/getDeviceList', function (req, res) {
        var url = '/p/org/activeDevList?sid=' + req.cookies.sid;
        url += '&id=' + req.query.id;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员激活用户
    app.post('/admin/user/invite', function (req, res) {
        req.body['sid']=req.cookies.sid;
        chttp.cpost(req.body, '/p/user/activeInvite', function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员根据用户组id获取用户列表
    app.get('/man/user/getUserByDepart', function (req, res) {
        var url = '/p/org/members?sid=' + req.cookies.sid;
        url += '&depart_id=' + req.query.depart_id;
        url += '&start_page=' + req.query.start;
        url += '&page_length=' + req.query.length;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员根据标签id获取用户列表
    app.get('/man/user/getUserByTag', function (req, res) {
        var url = '/p/org/tagManagement?sid=' + req.cookies.sid;
        url += '&tag_id=' + req.query.tag_id;
        url += '&start_page=' + req.query.start;
        url += '&page_length=' + req.query.length;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员根据标签id和用户组id获取用户列表
    app.get('/man/user/getMembers', function (req, res) {
        var url = '/p/user/manage?sid=' + req.cookies.sid;
        url += '&org_id=' + req.cookies.org_id;
        url += '&start_page=' + req.query.start;
        url += '&page_length=' + req.query.length;
        if (req.query.depart_id) {
            url += '&depart_id=' + req.query.depart_id;
        }
        if (req.query.tag_id) {
            url += '&tag_id=' + req.query.tag_id;
        }
        if (req.query.keyword) {
            url += '&keyword=' + req.query.keyword;
        }
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       用户组管理 man_users
     * =============================================================
     */

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
    app.post('/man/users/updateUsers', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'id': req.body.id,
            'name': req.body.name,
            'status': req.body.status,
            'parent_id': req.body.parent_id
        },
            url = '/p/org/updateDepart';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除用户组
    app.post('/man/users/delUsers', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'departs': req.body.departs
        },
            url = '/p/org/delDepart';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 查询用户组里用户和不属于用户组用户
    app.get('/admin/depart/memberManage', function (req, res) {
        req.query['sid']=req.cookies.sid;
        req.query['org_id']=req.cookies.org_id;
        chttp.cget('/p/depart/memberManage?'+querystring.stringify(req.query), function (cont) {
            res.send(cont);
        });
    });
    // 用户组添加用户删除用户
    app.post('/admin/depart/memberManage', function (req, res) {
        req.body['sid']=req.cookies.sid;
        chttp.cpost(req.body, '/p/depart/memberManage', function (cont) {
            res.send(cont);
        });
    });


    // 向用户组添加用户
    app.post('/admin/user/chUserDepart', function (req, res) {
        req.body['sid']=req.cookies.sid;
        chttp.cpost(req.body, '/p/user/chUserDepart', function (cont) {
            res.send(cont);
        });
    });
    // 给用户添加用户标签
    app.post('/admin/user/chUserTag', function (req, res) {
        req.body['sid']=req.cookies.sid;
        chttp.cpost(req.body, '/p/user/chUserTag', function (cont) {
            res.send(cont);
        });
    });


    /*
     * =============================================================
     *                       标签管理 man_tag
     * =============================================================
     */


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
    app.post('/man/tag/updateTag', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'tag_id': req.body.tag_id,
            'name': req.body.name,
            'tag_type': req.body.tag_type,
            'status': req.body.status,
            'description': req.body.description
        },
            url = '/p/org/updateTag';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除标签
    app.post('/man/tag/delTag', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'tag_ids': req.body.tag_ids
        },
            url = '/p/org/deleteTag';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });


    // 查询标签里用户和不属于用户组用户
    app.get('/admin/tag/memberManage', function (req, res) {
        req.query['sid']=req.cookies.sid;
        req.query['org_id']=req.cookies.org_id;
        chttp.cget('/p/tag/memberManage?'+querystring.stringify(req.query), function (cont) {
            res.send(cont);
        });
    });
    
    // 标签用户移动
    app.post('/admin/tag/memberManage', function (req, res) {
        req.body['sid']=req.cookies.sid;
        chttp.cpost(req.body, '/p/tag/memberManage', function (cont) {
            res.send(cont);
        });
    });
    /*
     * =============================================================
     *                       设备管理 man_device
     * =============================================================
     */

    // 查询设备列表
    app.get('/man/dev/getDevList', function (req, res) {
        req.query['sid']=req.cookies.sid;
        req.query['org_id']=req.cookies.org_id;
        chttp.cget('/p/dev/devList?'+querystring.stringify(req.query), function (cont) {
            res.send(cont);
        });
    });

    // 根据ID查询用户策略
    app.post('/man/device/orgGetPolicy', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'id': req.body.id,
            'dev_id': req.body.dev_id
        },
            url = '/p/org/orgGetPolicyById';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员推送指令到设备
    app.post('/man/device/sendCmd', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'opt_type': req.body.opt_type,
            'dev_id': req.body.dev_id
        },
            url = '/p/dev/pushMsg';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询设备定位 
    app.get('/man/dev/location', function (req, res) {
        var url = '/p/dev/uploadLocation?sid=' + req.cookies.sid +
            '&dev_id=' + req.query.dev_id;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    //企业管理员解绑设备
    app.post('/man/device/unlinkDevice', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'dev_id': req.body.dev_id
        },
            url = '/p/dev/unbindDevice';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });
    
    //企业管理员淘汰设备
    app.post('/man/device/weepoutDevice', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'dev_id': req.body.dev_id
        },
            url = '/p/dev/eliminateDevice';
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
    app.get('/man/complicance/getPolicyList', function (req, res) {
        var url = '/p/org/listComPolicy?sid=' + req.cookies.sid;
        url += '&policy_type=complicance';
        url += req.query.start_page ? '&start_page=' + req.query.start_page : 1;
        url += req.query.page_length ? '&page_length=' + req.query.page_length : 10;
        chttp.cget(url, function (cont) {
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
        }
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/uploadComPolicy', function (cont) {
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
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/updateComPolicy', function (cont) {
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




    /*
     * =============================================================
     *                       围栏策略管理 man_railpolicy
     * =============================================================
     */

    // 企业管理员查询策略列表
    app.get('/man/railpolicy/getRailpolicyList', function (req, res) {
        var url = '/p/org/listFencePolicy?sid=' + req.cookies.sid;
        url += req.query.start_page ? '&start_page=' + req.query.start_page : 1;
        url += req.query.page_length ? '&page_length=' + req.query.page_length : 10;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询已启用设备策略和应用策略
    app.post('/policy/dev_app', function (req, res) {
        req.body['sid']=req.cookies.sid;
        req.body['org_id']=req.cookies.org_id;
        chttp.cpost(req.body,'/p/policy/orgAvaiPolicy', function (cont) {
            res.send(cont);
        });
    });


    // 企业管理员添加围栏策略
    app.post('/man/railpolicy/add_policy', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/uploadFencePolicy', function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改围栏策略
    app.post('/man/railpolicy/mod_policy', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/updateFencePolicy', function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除策略
    app.post('/man/railpolicy/del_policy', function (req, res) {
        var postData = {},
            url;
        if (req.body.geoids) {
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
        if (req.body.timeids) {
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
        var postData = {},
            url;
        if (req.body.geoids) {
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
        if (req.body.timeids) {
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





    /*
     * =============================================================
     *                       系统应用策略 man_apppolicy
     * =============================================================
     */

    // 企业管理员查询策略列表
    app.get('/man/apppolicy/getApppolicyList', function (req, res) {
        var url = '/p/org/listAppPolicy?sid=' + req.cookies.sid;
        url += req.query.start_page ? '&start_page=' + req.query.start_page : 1;
        url += req.query.page_length ? '&page_length=' + req.query.page_length : 10;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });




    // 企业管理员查询已启用黑名单
    app.post('/man/apppolicy/onBlackList', function (req, res) {
        chttp.cpost({
            sid: req.cookies.sid,
            org_id: req.cookies.org_id
        },'/p/policy/getBlaWhiList', 
        function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询所有应用列表
    app.post('/man/apppolicy/appList', function (req, res) {
        req.body['sid']=req.cookies.sid;
        req.body['org_id']=req.cookies.org_id;
        chttp.cpost(req.body,'/p/policy/appList', function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员查询已启用策略 0
    app.get('/man/apppolicy/getUsedDevPolicy', function (req, res) {
        var url = '/p/org/onDevPolicy?sid=' + req.cookies.sid;
        url += req.query.start_page ? '&start_page=' + req.query.start_page : 1;
        url += req.query.page_length ? '&page_length=' + req.query.page_length : 10;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });


    // 企业管理员查询应用授权
    app.post('/man/apppolicy/appAuthList', function (req, res) {
        var postData = {},
            url;
        postData = {
            'sid': req.cookies.sid,
            'policy_id': req.body.policy_id * 1,
            'policy_type': req.body.policy_type
        };
        url = '/p/org/appAuthList';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加策略
    app.post('/man/apppolicy/add_policy', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/uploadAppPolicy', function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改策略
    app.post('/man/apppolicy/mod_policy', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/updateAppPolicy', function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除策略
    app.post('/man/apppolicy/del_policy', function (req, res) {
        var postData = {},
            url;
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
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/changeAppPolicyStatus', function (cont) {
            res.send(cont);
        });
    });




    /*
     * =============================================================
     *                       客户端策略管理 man_clientpolicy
     * =============================================================
     */
    // 企业管理员查询策略列表
    app.get('/man/list/clientPolicy', function (req, res) {
        var url = '/p/org/listPolicy?sid=' + req.cookies.sid;
        url += '&policy_type=device';
        url += req.query.start ? '&start_page=' + req.query.start : 1;
        url += req.query.length ? '&page_length=' + req.query.length : 10;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });




    /*
     * =============================================================
     *                       内容管理 man_content
     * =============================================================
     */
    // app.get('/common/org/statistics', function(req, res) {
    //     var url = '/p/org/orgStatistics?sid=' + req.cookies.sid;
    //     chttp.cget(url, function(cont) {
    //         res.send(cont);
    //     });
    // });





    //上传文件
    app.post('/man/file/formSubmit', upTransfer.single('file_data'), function (req, res) {
        req.body['sid'] = req.cookies.sid;
        if (req.file) {
            req.body['file_data'] = JSON.stringify(req.file);
            chttp.cpost(req.body, '/p/file/uploadFile', function (cont) {
                res.send(cont);
            });
        } else {
            chttp.cpost(req.body, '/p/file/updateFile', function (cont) {
                res.send(cont);
            });
        }

    });
    app.post('/man/file/delete', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/file/deleteFile', function (cont) {
            res.send(cont);
        });
    });
    app.get('/man/file/fileInfoBox', function (req, res) {
        req.query['sid'] = req.cookies.sid;
        chttp.cpost(req.query, '/p/file/viewFileStatus', function (cont) {
            res.send(cont);
        });
    });
    // 文件下发与取消下发
    app.post('/man/file/issue', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        if (typeof req.body.state == "string") {
            req.body.state = parseInt(req.body.state);
        }

        chttp.cpost(req.body, '/p/file/authFile', function (cont) {
            res.send(cont);
        });
    });





    /*
     * =============================================================
     *                       应用管理 man_app
     * =============================================================
     */


    // app包更新
    app.post('/man/app/upgrade', upTransfer.single('apk'), function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body['file'] = JSON.stringify(req.file);

        chttp.cpost(req.body, '/p/app/upgrade', function (cont) {
            try {
                if (cont.rt != '0000') {
                    fs.exists(req.file.path, function (exists) {
                        fs.unlinkSync(req.file.path);
                    });
                }
            } catch (err) {
                fs.exists(req.file.path, function (exists) {
                    fs.unlinkSync(req.file.path);
                });
            }
            res.send(cont);
        });
    });

    app.get('/man/app/version', function (req, res) {
        var url = '/p/app/listAppHistory?sid=' + req.cookies.sid
            + '&identify=' + encodeURIComponent(req.query.identify);
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });
    app.post('/mam/app/delVersion', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/app/delAppHistory', function (cont) {
            res.send(cont);
        });
    });

    // 获取app列表
    app.get('/man/app/getAppList', function (req, res) {
        var url = '/p/app/list?sid=' + req.cookies.sid;
        url += req.query.platform ? '&platform=' + req.query.platform : 'all';
        url += req.query.start ? '&start_page=' + req.query.start : 1;
        url += req.query.length ? '&page_length=' + req.query.length : 10;
        url += req.query.keyword ? '&keyword=' + req.query.keyword : '';
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 获取已安装应用的设备列表
    app.get('/man/app/getDeviceList', function (req, res) {
        var url = '/p/app/devByUserId?sid=' + req.cookies.sid +
            '&identify=' + encodeURIComponent(req.query.identify);
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员app授权、取消授权
    app.post('/man/apps/authApp', function (req, res) {
        var postData;
        if (req.body.user_list) {
            postData = {
                'sid': req.cookies.sid,
                'package_name': req.body.package_name,
                'user_list': req.body.user_list,
                'state': req.body.state
            };
        } else if (req.body.depart_list) {
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
    app.post('/man/app/updateApp', function (req, res) {
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
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除app
    app.post('/man/apps/delapps', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'downloads': req.body.downloads
        },
            url = '/p/app/del';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 根据app标签获取对应app列表
    app.get('/man/app/getAppTag', function (req, res) {
        var url = '/p/app/appTagList?sid=' + req.cookies.sid;
        url += '&id=' + req.query.id;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 根据标签获取app列表
    app.get('/man/app/getAppByTag', function (req, res) {
        var url = '/p/org/appInfoByAppTag?sid=' + req.cookies.sid;
        url += '&id=' + req.query.id;
        url += req.query.start ? '&start_page=' + req.query.start : 1;
        url += req.query.length ? '&page_length=' + req.query.length : 10;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    /*
     * =============================================================
     *                       应用黑名单 man_appBlacklist
     * =============================================================
     */

    //上传应用APK
    // app.post('/man/app/upload', upTransfer.single('apk'), function (req, res) {
    //     req.body['sid'] = req.cookies.sid;
    //     req.body['file'] = JSON.stringify(req.file);
    //     chttp.cpost(req.body, '/p/app/upload', function (cont) {
    //         try {
    //             if (cont.rt != '0000') {
    //                 fs.exists(req.file.path, function (exists) {
    //                     fs.unlinkSync(req.file.path);
    //                 });
    //             }
    //         } catch (err) {
    //             fs.exists(req.file.path, function (exists) {
    //                 fs.unlinkSync(req.file.path);
    //             });
    //         }
    //         res.send(cont);
    //     });
    // });



    // 添加应用黑白名单
    app.post('/man/appList/add', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body.package_name = (typeof req.body.package === 'string')
            ? JSON.stringify([req.body.package])
            : JSON.stringify(req.body.package);
        delete req.body.package;
        delete req.body.id;
        if (req.body.phone_func !== undefined && req.body.system_app !== undefined) {
            req.body.phone_func = req.body.phone_func === '1' ? 1 : 0;
            req.body.system_app = req.body.system_app === '1' ? 1 : 0;
        }
        chttp.cpost(req.body, '/p/app/addAppList', function (cont) {
            res.send(cont);
        });
    });
    // 修改应用黑白名单
    app.post('/man/appList/edit', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body.package_name = (typeof req.body.package === 'string')
            ? JSON.stringify([req.body.package])
            : JSON.stringify(req.body.package);
        delete req.body.package;
        if (req.body.phone_func !== undefined && req.body.system_app !== undefined) {
            req.body.phone_func = req.body.phone_func === '1' ? 1 : 0;
            req.body.system_app = req.body.system_app === '1' ? 1 : 0;
        }
        chttp.cpost(req.body, '/p/app/updateAppList', function (cont) {
            res.send(cont);
        });
    });


    // 获取通话和系统应用名单
    app.get('/man/appList/more', function (req, res) {
        req.query['sid']=req.cookies.sid;
        req.query['org_id']=req.cookies.org_id;
        delete req.query.url;
        chttp.cget('/p/app/listRuleMan?'+querystring.stringify(req.query), function (cont) {
            res.send(cont);
        });
    });
    //向通话或系统应用名单中添加应用
    app.post('/man/appList/more/add', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body['org_id'] = req.cookies.org_id;
        chttp.cpost(req.body, '/p/app/listRuleMan', function (cont) {
            res.send(cont);
        });
    });
    //从通话或系统应用名单中删除应用
    app.post('/man/appList/more/del', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body['org_id'] = req.cookies.org_id;
        chttp.cdelete(req.body, '/p/app/listRuleMan', function (cont) {
            res.send(cont);
        });
    });


    // 删除应用黑白名单
    app.post('/man/appList/del', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/app/delAppList', function (cont) {
            res.send(cont);
        });
    });

    // 黑名单禁用/启用
    app.post('/man/appList/updateStatus', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/app/statusAppList', function (cont) {
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
        req.query['sid']=req.cookies.sid;
        var url = '/p/org/appTagList?'+querystring.stringify(req.query);
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 添加应用标签
    app.post('/man/appTag/addAppTag', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'name': req.body.name,
            'description': req.body.description
        },
            url = '/p/org/addAppTag';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 修改应用标签
    app.post('/man/appTag/updateAppTag', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'apptag_id': req.body.apptag_id,
            'name': req.body.name,
            'description': req.body.description
        },
        url = '/p/org/updateAppTag';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 删除应用标签
    app.post('/man/appTag/deleteAppTag', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'apptag_ids': req.body.apptag_ids
        },
            url = '/p/org/deleteAppTag';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });
    // 获取应用标签对应的应用列表
    app.get('/man/appTag/getAppByTag', function (req, res) {
        var url = '/p/org/appTagManagement?sid=' + req.cookies.sid;
        url += '&apptag_id=' + req.query.apptag_id;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 应用标签添加应用
    app.post('/man/appTag/addApp', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'apptag_id': req.body.apptag_id,
            'app_list': req.body.app_list
        },
            url = '/p/org/appTagManagement';
        chttp.cpost(postData, url, function (cont) {
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
        url += req.query.start ? '&start_page=' + req.query.start : 1;
        url += req.query.length ? '&page_length=' + req.query.length : 10;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 获取推送消息列表
    app.get('/man/message/sendMessage', function (req, res) {
        var url = '/p/org/sendMessage?sid=' + req.cookies.sid;
        url += '&message_id=' + req.query.message_id;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员添加消息
    app.post('/man/message/addMessage', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'title': req.body.title,
            'content': req.body.content
        },
            url = '/p/org/addMessage';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除消息
    app.post('/man/message/deleteMessage', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'message_ids': req.body.message_ids
        },
            url = '/p/org/deleteMessage';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改消息
    app.post('/man/message/modifyMessage', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'message_id': req.body.message_id,
            'title': req.body.title,
            'content': req.body.content
        },
            url = '/p/org/modifyMessage';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员推送消息
    app.post('/man/message/sendMessage', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'message_id': req.body.message_id,
            'users': req.body.users
        },
            url = '/p/org/sendMessage';
        chttp.cpost(postData, url, function (cont) {
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
        url += '&start_page=' + req.query.start_page;
        url += '&page_length=' + req.query.page_length;
        url += '&start_time=' + req.query.start_time;
        url += '&end_time=' + req.query.end_time;
        url += '&account=' + req.query.account;
        url += '&operation=' + req.query.operation;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 获取日志列表
    app.get('/man/Log/getLog', function (req, res) {
        req.query['sid']=req.cookies.sid;
        req.query['org_id']=req.cookies.org_id;
        chttp.cget('/p/org/viewLog?'+querystring.stringify(req.query), function (cont) {
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
        url += '&start_page=' + req.query.start_page;
        url += '&page_length=' + req.query.page_length;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员生效取消生效
    app.post('/man/version/authSecspace', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/authSecspace', function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员修改版本
    app.post('/man/version/modifyVersion', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            '_id': req.body._id,
            'name': req.body.name,
            'versioncode': req.body.versioncode,
            'describe': req.body.describe
        },
            url = '/p/org/modifyVersion';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 企业管理员删除版本
    app.post('/man/version/deleteApp', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'versions': req.body.versions
        },
            url = '/p/org/deleteApp';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    //应用商店删除操作入口
    app.post('/man/delete', function (req, res) {
        var pd = null,
            url = req.body.sDelUrl;
        switch (url) {
            case '/p/app/del':    //管理员删除应用接口
                pd = {
                    'sid': req.cookies.sid,
                    'identify': req.body.identify
                };
                break;
            default:
        }
        chttp.cpost(pd, url, function (cont) {
            res.send(cont);
        });
    });

    //编辑应用
    app.post('/app/modify', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/app/modify', function (cont) {
            res.send(cont);
        });
    });


    //上传应用
    app.post('/app/upload', upTransfer.single('app_file'), function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body['file'] = JSON.stringify(req.file);
        delete req.body.id;
        delete req.body.identify;
        chttp.cpost(req.body, '/p/app/upload', function (cont) {
            res.send(cont);
        });
    });





    // 企业管理员授权和下发操作
    app.post('/man/issue', function (req, res) {
        var url = req.body.sIssueUrl,
            pd = {
                'sid': req.cookies.sid,
                'identify': req.body.identify,
                'state': parseInt(req.body.state),
            };
        switch (url) {
            case '/p/org/authApp':    //应用授权    
                if (req.body.user_list) {
                    pd['user_list'] = req.body.user_list;
                } else if (req.body.depart_list) {
                    pd['depart_list'] = req.body.depart_list;
                } else {
                    pd['tag_list'] = req.body.tag_list;
                }
                break;
            default:
        }
        chttp.cpost(pd, url, function (cont) {
            res.send(cont);
        });
    });


    // 获取已安装应用的设备列表
    app.get('/man/more', function (req, res) {
        var url = req.query.sMoreUrl + '?sid=' + req.cookies.sid;
        url += req.query.id ? '&id=' + req.query.id : '';
        url += req.query.identify ? '&identify=' + encodeURIComponent(req.query.identify) : '';
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 所有表格获取列表操作
    app.get('/man/getList', function (req, res) {
        var url = req.query.sListUrl + '?sid=' + req.cookies.sid;
        url += req.query.platform ? '&platform=' + req.query.platform : '';
        url += req.query.start ? '&start_page=' + req.query.start : 1;
        url += req.query.length ? '&page_length=' + req.query.length : 10;
        url += req.query.keyword ? '&keyword=' + req.query.keyword : '';
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    // 所有表格获取列表操作
    app.get('/man/getList', function (req, res) {
        var url = req.query.sListUrl + '?sid=' + req.cookies.sid;
        url += req.query.platform ? '&platform=' + req.query.platform : '';
        url += req.query.start ? '&start_page=' + req.query.start : 1;
        url += req.query.length ? '&page_length=' + req.query.length : 10;
        url += req.query.keyword ? '&keyword=' + req.query.keyword : '';
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });





    //获取不可编辑的默认成员数据  如：获取默认策略
    app.post('/policy/default', function (req, res) {
            req.body['sid']=req.cookies.sid;
            req.body['org_id']=req.cookies.org_id;
        chttp.cpost(req.body,'/p/policy/getDefPolicy', function (cont) {
            res.send(cont);
        });
    })


    //客户端策略-获取权限
    app.get('/getPermissions', function (req, res) {
        var url = req.query.url + '?sid=' + req.cookies.sid;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    })


    //机构内下发或授权
    app.post('/issueByRules', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body['org_id'] = req.cookies.org_id;
        chttp.cpost(req.body, '/p/org/auth', function (cont) {
            res.send(cont);
        });
    });

    //下发/发布至下级机构
    app.post('/isspubSub', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body['org_id'] = req.cookies.org_id;
        chttp.cpost(req.body, '/p/org/polViaOrg', function (cont) {
            res.send(cont);
        });
    });


    //XTree树形组件成员
    app.get('/xtree/item', function (req, res) {
        var url = '/p/depart/manage'
            + '?sid=' + req.cookies.sid
            + '&org_id=' + req.query.org_id;
            + '&depart_id=' + req.query.gid;
        
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });

    //XList列表组件成员
    app.get('/xlist/item', function (req, res) {
        var url = '/p/org/tagList?start_page=1&page_length=1000&sid=' + req.cookies.sid;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });


    app.get('/policy/infoUsedOrIssued', function (req, res) {  //策略使用和下发详情
        var url = '/p/policy/userByPolId?sid=' + req.cookies.sid
            + '&id=' + req.query.id
            + '&policy_type=' + req.query.policy_type;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });



    /*
     * =============================================================
     *                       设备策略管理 man_devpolicy
     * =============================================================
     */

    // 企业管理员查询设备策略列表
    app.get('/man/devpolicy/getDevpolicyList', function (req, res) {
        var url = '/p/org/listPolicy?sid=' + req.cookies.sid;
        url += '&policy_type=device';
        url += req.query.start_page ? '&start_page=' + req.query.start_page : 1;
        url += req.query.page_length ? '&page_length=' + req.query.page_length : 10;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });




    // 企业管理员添加设备策略
    app.post('/man/devpolicy/add_policy', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'name': req.body.name,
            'position_strategy': req.body.position_strategy,
            'dev_limit': req.body.dev_limit, //需预先拼接
            'dev_security': req.body.dev_security,  //需预先拼接
            'policy_type': 'device',
            'wifi': req.body.wifi,
            'vpnlimit': req.body.vpnlimit //需预先拼接
        },
            url = '/p/org/uploadPolicy';
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
            'wifi': req.body.wifi,
            'vpnlimit': req.body.vpnlimit
        };
        var url = '/p/org/updatePolicy';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 移除策略 
    app.post('/policy/unbind', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/unbindPolicy', function (cont) {
            res.send(cont);
        });
    });

};









