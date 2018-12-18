/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * =================================================================
 *                              超级管理员和业务管理员共用路由
 * =================================================================
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
var fs = require('fs'),
    path = require('path'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();

var md5 = require('md5');
var multer = require('multer');
var querystring = require("querystring");
var path = require('path');
var arrTypedUrls=[  //采用请求类型识别操作类型的新式接口
    '/p/role/roleManage',   //管理员角色
    '/p/org/adminMan',      //管理员
    '/p/user/manage',       //用户
    '/p/depart/manage',     //用户组
    '/p/tag/manage',         //用户标签
    '/p/policy/deviceMan',      //设备策略
    '/p/policy/comPolicyMan',   //合规策略
    '/p/policy/fenceMan',       //围栏策略
    '/p/policy/appPolicyMan',   //应用策略
    '/p/policy/customerMan',    //客户端策略
    '/p/app/listMan'            //客户端策略
    ];
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
     *                      登录身份 
     * =============================================================
     */

    // 查询首页数据
    app.get('/common/org/statistics', function (req, res) {
        var url = '/p/org/orgStatistics?sid=' + req.cookies.sid+'&org_id=' + req.cookies.org_id;
        chttp.cget(url, function (cont) {
            res.send(cont);
        });
    });


    // 自助修改密码
    app.post('/common/pw/selfmod', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body.old_passwd = md5('xthinkers' + req.body.old_passwd);
        req.body.new_passwd = md5('xthinkers' + req.body.new_passwd);
        delete req.body.url;
        chttp.cpost(req.body, '/p/org/admUpdatePw', function (cont) {
            res.send(cont);
        });
    });
    // 重置业务管理员密码
    app.post('/common/admin/resetpw', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body['passwd'] = md5('xthinkers' + req.body.pw);
        delete req.body.pw;
        console.log(req.body);
        chttp.cpost(req.body, '/p/org/resetAdmPw', function (cont) {
            res.send(cont);
        });
    });
    // 重置用户密码
    app.post('/common/user/resetpw', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body.pw = md5('xthinkers' + req.body.pw);
        chttp.cpost(req.body, '/p/user/resetUserPw', function (cont) {
            res.send(cont);
        });
    });


    /*
     * =============================================================
     *                      机构管理 
     * =============================================================
     */

    //获取机构树节点，sid中包含当前请求的身份信息，服务端会自动返回当前身份有访问权限的所有机构
    app.get('/common/orgtree/nodes', function (req, res) {
        chttp.cget('/p/org/orgManage?sid=' + req.cookies.sid, function (cont) {
            res.send(cont);
        });
    });

    app.post('/common/orgtree/add', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/org/orgManage', function (cont) {
            res.send(cont);
        });
    });

    app.post('/common/orgtree/mod', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cput(req.body, '/p/org/orgManage', function (cont) {
            res.send(cont);
        });
    });

    app.post('/common/orgtree/del', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cdelete(req.body, '/p/org/orgManage', function (cont) {
            res.send(cont);
        });
    });



    /*
     * =============================================================
     *                      角色管理
     * =============================================================
     */
    app.post('/common/adminRoleInfo', function (req, res) {   //管理员获取自己的角色信息
        req.body['sid'] = req.cookies.sid;
        req.body['userId'] = req.cookies.userId;
        chttp.cpost(req.body, '/p/org/getAdmRoleInfo', function (cont) {
            res.send(cont);
        });
    });

    // 成员详情信息
    app.get('/common/item/info', function (req, res) {   //会自动添加org_id
        var url = req.query.url;
        req.query['sid']=req.cookies.sid;
        console.log(req.query);
        delete req.query.url;
        switch (url){
            case '/p/policy/userByPolId':
                req.query['org_id']=req.cookies.org_id;
            case '/p/user/policyByUserId':
                chttp.cpost(req.query,url, function (cont) {
                    res.send(cont);
                });
                break;
            default:
                url = url + '?'+ querystring.stringify(req.query);
                chttp.cget(url, function (cont) {
                    res.send(cont);
                });
        }
    });


    // 机构内列表呈现类成员的获取
    app.get('/common/org/list', function (req, res) {   //会自动添加org_id
        var url = req.query.url + '?';
        req.query['sid']=req.cookies.sid;
        req.query['org_id']=req.cookies.org_id;
        delete req.query.url;
        url+=querystring.stringify(req.query);
        chttp.cget(url, function (cont) {
            if (cont.indexOf('"rt":') == -1) {
                res.send('{"rt":"error"}');
            } else {
                res.send(cont);
            }
        });
    });

    // 机构内列表呈现类成员的获取
    app.post('/common/org/list', function (req, res) {   //会自动添加org_id
        var url = req.body.url;
        req.body['sid']=req.cookies.sid;
        req.body['org_id']=req.cookies.org_id;
        delete req.body.url;
        chttp.cpost(req.body ,url, function (cont) {
            res.send(cont);            
        });
    });


    // 机构内列表呈现类成员的获取
    app.get('/common/list', function (req, res) {   //会自动添加org_id
        var url = req.query.url + '?';
        req.query['sid']=req.cookies.sid;
        delete req.query.url;
        url+=querystring.stringify(req.query);
        chttp.cget(url, function (cont) {
            if (cont.indexOf('"rt":') == -1) {
                res.send('{"rt":"error"}');
            } else {
                res.send(cont);
            }
        });
    });


    // 机构内列表呈现类成员的添加操作  
    app.post('/common/org_add', upTransfer.single('file_data'), function (req, res) {
        var url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        if(!req.body['org_id']){
            req.body['org_id'] = req.cookies.org_id; //（该中间件会给请求添加所属机构标识org_id）
        }
        if (req.file) {
            req.body['file_data'] = JSON.stringify(req.file);
        }
        if (req.body.pw) {
            req.body.pw = md5('xthinkers' + req.body.pw);
        }

        delete req.body.url;        
        switch(url){
            case '/p/role/roleManage':
                delete req.body.org_id;
                break;
            case '/p/org/adminMan':
                break;
            default:
                req.body['org_id'] = req.cookies.org_id;
        }
        chttp.cpost(req.body, url, function (cont) {
            res.send(cont);
        });
    })

    // 机构内列表呈现类成员的添加操作  
    app.post('/common/add', upTransfer.single('file_data'), function (req, res) {
        var url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        if (req.file) {
            req.body['file_data'] = JSON.stringify(req.file);
        }
        if (req.body.pw) {
            req.body.pw = md5('xthinkers' + req.body.pw);
        }
        delete req.body.url;
        switch(url){
            case '/p/role/roleManage':
                delete req.body.org_id;
                break;
            case '/p/org/adminMan':
                break;
            default:
                req.body['org_id'] = req.cookies.org_id;
        }
        chttp.cpost(req.body, url, function (cont) {
            res.send(cont);
        });
    })

    //机构内列表呈现类成员的修改操作
    app.post('/common/mod', function (req, res) {
        var url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        delete req.body.url;
        if(arrTypedUrls.indexOf(url)!==-1){
            chttp.cput(req.body, url, function (cont) { //采用delete请求方式进行删除操作的业务
                res.send(cont);
            });
        }else{
            chttp.cpost(req.body, url, function (cont) {
                res.send(cont);
            });
        }
    });


    // 机构内列表呈现类成员的删除操作
    app.post('/common/del', function (req, res) {
        var url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        delete req.body.url;
        if(arrTypedUrls.indexOf(url)!==-1){
            chttp.cdelete(req.body, url, function (cont) { //采用delete请求方式进行删除操作的业务
                res.send(cont);
            });
        }else{
            chttp.cpost(req.body, url, function (cont) {
                res.send(cont);
            });
        }
    });


    // 机构内列表呈现类成员的禁用/启用操作
    app.post('/common/toggle', function (req, res) {
        var url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        delete req.body.url;
        chttp.cpost(req.body, url, function (cont) {
            res.send(cont);
        });
    });


    // 机构内列表呈现类成员的添加操作  
    app.post('/common/upload', multipartMiddleware, function (req, res) {
        var url=req.body.url;
        delete req.body.url;
        const avatar = req.files['avatar'];
        if(avatar){
            const newPath = path.join(path.dirname(avatar.path), avatar.originalFilename);
            fs.rename(avatar.path, newPath, function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    req.body['file'] = fs.createReadStream(newPath)
                    chttp.cFormData(req.body, url, function (cont) {
                        res.send(cont);
                    });
                }
            })
        }else{
            chttp.cpost(req.body, url, function (cont) {
                res.send(cont);
            });
        }
        
    });
};