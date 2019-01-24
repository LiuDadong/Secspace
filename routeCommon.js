/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * =================================================================
 *                              超级管理员和业务管理员共用路由
 * =================================================================
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
"use strict";
let fs = require('fs'),
    path = require('path'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    md5 = require('md5'),
    multer = require('multer'),
    querystring = require("querystring"),
    upTransfer = multer({
        storage: multer.diskStorage({
            //设置上传后文件路径，uploads文件夹会自动创建。
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, 'uploads'))
            },
            filename: function (req, file, cb) {
                //let fileFormat = (file.originalname).split(".");
                //cb(null,fileFormat[0] + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
                cb(null, file.originalname);
            }
        })
    }),
    arrTypedUrls = [  //采用请求类型识别操作类型的新式接口
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
        '/p/app/listMan'            //黑白名单
    ],
    pathConfman=path.join(__dirname.replace('secspace_server_web','secspace_server_api'),'confman');

module.exports = function (app, chttp) {
    /*
     * =============================================================
     *                      登录身份 
     * =============================================================
     */

    // 查询首页数据
    app.get('/common/org/statistics', function (req, res) {
        let url = '/p/org/orgStatistics?' + querystring.stringify({
            sid: req.cookies.sid,
            org_id: req.cookies.org_id
        })
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
        console.log(req.body);
        chttp.cpost(req.body, '/p/org/admUpdatePw', function (cont) {
            console.log(cont);
            res.send(cont);
        });
    });
    // 重置业务管理员密码
    app.post('/common/admin/resetpw', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        req.body['passwd'] = md5('xthinkers' + req.body.pw);
        delete req.body.pw;
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
        req.query['sid'] = req.cookies.sid;
        chttp.cget('/p/org/orgManage?' + querystring.stringify(req.query), function (cont) {
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
        let url = req.query.url;
        req.query['sid'] = req.cookies.sid;
        delete req.query.url;
        switch (url) {
            case '/p/policy/userByPolId':
                req.query['org_id'] = req.cookies.org_id;
            case '/p/user/policyByUserId':
                chttp.cpost(req.query, url, function (cont) {
                    res.send(cont);
                });
                break;
            default:
                url = url + '?' + querystring.stringify(req.query);
                chttp.cget(url, function (cont) {
                    res.send(cont);
                });
        }
    });

    // 机构内列表呈现类成员的获取
    app.get('/common/org/list', function (req, res) {   //会自动添加org_id
        switch (req.query.url){
            case '/p/config/filelist':
                let files=[],
                    filePath=path.join(pathConfman,req.query.org_code);
                fs.readdirSync(filePath).forEach(function(filename){
                    var fl=fs.statSync(path.join(filePath, filename));
                    fl['name']=filename;
                    fl['birth_time']=fl.birthtime.toLocaleString();
                    fl['upload_time']=fl.ctime.toLocaleString();
                    files.push(fl);
                });
                res.send({
                    rt:'0000',
                    files:files
                })
                break;
            default:
                let url = req.query.url + '?';
                req.query['sid'] = req.cookies.sid;
                req.query['org_id'] = req.cookies.org_id;
                delete req.query.url;
                url += querystring.stringify(req.query);
                chttp.cget(url, function (cont) {
                    if (cont.indexOf('"rt":') == -1) {
                        res.send('{"rt":"error"}');
                    } else {
                        res.send(cont);
                    }
                });
        }

    });

    // 机构内列表呈现类成员的获取
    app.post('/common/org/list', function (req, res) {   //会自动添加org_id

        let url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        req.body['org_id'] = req.cookies.org_id;
        delete req.body.url;
        chttp.cpost(req.body, url, function (cont) {
            res.send(cont);
        });
        
    });


    // 机构内列表呈现类成员的获取
    app.get('/common/list', function (req, res) {   //不自动添加org_id
        let url = req.query.url + '?';
            req.query['sid'] = req.cookies.sid;
            delete req.query.url;
            url += querystring.stringify(req.query);
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
        let url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        if (!req.body['org_id']) {
            req.body['org_id'] = req.cookies.org_id; //（该中间件会给请求添加所属机构标识org_id）
        }
        if (req.file) {
            req.body['file_data'] = JSON.stringify(req.file);
        }
        if (req.body.pw) {
            req.body.pw = md5('xthinkers' + req.body.pw);
        }

        delete req.body.url;
        switch (url) {
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
        let url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        if (req.file) {
            req.body['file_data'] = JSON.stringify(req.file);
        }
        if (req.body.pw) {
            req.body.pw = md5('xthinkers' + req.body.pw);
        }
        delete req.body.url;
        switch (url) {
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
        let url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        delete req.body.url;
        if (arrTypedUrls.indexOf(url) !== -1) {
            chttp.cput(req.body, url, function (cont) { //采用delete请求方式进行删除操作的业务
                res.send(cont);
            });
        } else {
            chttp.cpost(req.body, url, function (cont) {
                res.send(cont);
            });
        }
    });


    // 机构内列表呈现类成员的删除操作
    app.post('/common/del', function (req, res) {
        let url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        delete req.body.url;
        if (arrTypedUrls.indexOf(url) !== -1) {
            chttp.cdelete(req.body, url, function (cont) { //采用delete请求方式进行删除操作的业务
                res.send(cont);
            });
        } else {
            chttp.cpost(req.body, url, function (cont) {
                res.send(cont);
            });
        }
    });


    // 机构内列表呈现类成员的禁用/启用操作
    app.post('/common/toggle', function (req, res) {
        let url = req.body.url;
        req.body['sid'] = req.cookies.sid;
        delete req.body.url;
        chttp.cpost(req.body, url, function (cont) {
            res.send(cont);
        });
    });


    // 机构内列表呈现类成员的添加操作  
    app.post('/common/upload', multipartMiddleware, function (req, res) {
        let url = req.body.url, uploadFile = '';
        req.body['sid'] = req.cookies.sid;
        delete req.body.url;
        for (i in req.files) {
            uploadFile = req.files[i];
        }
        if (uploadFile) {
            const newPath = path.join(path.dirname(uploadFile.path), uploadFile.originalFilename);
            fs.rename(uploadFile.path, newPath, function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    req.body['file'] = fs.createReadStream(newPath);
                    chttp.cFormData(req.body, url, function (cont) {
                        fs.unlink(newPath);
                        res.send(cont);
                    });
                }
            })
        } else {
            chttp.cpost(req.body, url, function (cont) {
                res.send(cont);
            });
        }
    });

    // 获取平台license
    app.post('/common/license', function (req, res) {
        req.body['sid'] = req.cookies.sid;
        chttp.cpost(req.body, '/p/super/license', function (cont) {
            res.send(cont);
        });
    });

    // 上传配置文件  
    app.post('/common/upload_config_files', multipartMiddleware, function (req, res) {
        if(req.cookies.sid){
            let uploadFiles = req.files['config_files'];
            if(!(uploadFiles instanceof Array)){
                uploadFiles=[uploadFiles];
            }
            if (uploadFiles.length > 0) {
                for (let i = 0; i < uploadFiles.length; i++) {
                    let source = fs.createReadStream(uploadFiles[i].path),
                        dest = fs.createWriteStream(path.join(
                            pathConfman,
                            req.body.org_code, 
                            uploadFiles[i].originalFilename
                        ));
                    source.pipe(dest);
                    source.on('end', function () {
                        fs.unlink(uploadFiles[i].path, function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                    });   //delete
                    source.on('error', function (err) { });
                }
                res.send({ rt: '0000', desc: '成功' });
            } else {
                res.send({ rt: 'null', desc: '请选择文件' });
            }
        }
    });

    
    // 删除配置文件  
    app.post('/common/config_files/delete', function (req, res) {
        if(req.cookies.sid){
            let deleteFilenames = req.body['deleteFilenames'];
            for (let i = 0; i < deleteFilenames.length; i++) {
                fs.unlink(path.join(
                    pathConfman,
                    req.body.org_code, 
                    deleteFilenames[i]
                ), function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
            res.send({ rt: '0000', desc: '成功' });
        }
    });
    // 上传配置文件  
    app.post('/common/config_file/download', function (req, res) {
        if(req.cookies.sid){
            var p=path.join(
                pathConfman,
                req.body.org_code, 
                req.body.filename
            );
            res.download(p);
            // res.writeHead(200, {
            //   'Content-Type': 'application/force-download',
            //   'Content-Disposition': 'attachment; filename='+req.body.filename
            // });
            // fs.createReadStream(p).pipe(res);
        }
    });
};