/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * =================================================================
 *                              超级管理员特有路由
 * =================================================================
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
var fs = require('fs'),
    path = require('path'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();

module.exports = function (app, chttp) {
    
    /*
     * =============================================================
     *                       设置 man_setting
     * =============================================================
     */

    // 企业管理员获取设置信息
    app.get('/super/setting/getSettings', function (req, res) {
        var url = '/p/super/getSettings?sid=' + req.cookies.sid;
        chttp.cget(url, function (cont) {
            try {
                var json = JSON.parse(cont);
                for (k in json.doc.permissionItems) {
                    json.doc[k] = json.doc.permissionItems[k] + '';
                }
                delete json.doc.permissionItems;
                cont = JSON.stringify(json);
            } catch (err) {

            }
            res.send(cont);
        });
    });

    // 企业管理员测试邮箱服务器地址
    app.post('/super/setting/testEmail', function (req, res) {
        var postData = {
            'sid': req.cookies.sid,
            'email_server': req.body.email_server,
            'send_user': req.body.send_user,
            'send_pwd': req.body.send_pwd,
            'recv_user': req.body.recv_user
        },
            url = '/p/super/testEmail';
        chttp.cpost(postData, url, function (cont) {
            res.send(cont);
        });
    });

    // 超级管理员系统设置
    app.post('/super/setting/updateSettings', multipartMiddleware, function (req, res) {
        if(req.files&&req.files['icon']){
            const file_data = req.files['icon'];
            const newPath = path.join(path.dirname(file_data.path), file_data.originalFilename);
            fs.rename(file_data.path, newPath, function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    req.body['file'] = fs.createReadStream(newPath);
                    chttp.cFormData(req.body, '/p/super/updateSettings', function (cont) {
                        res.send(cont);
                    });
                }
            })
        }else{
            delete req.body['icon'];
            req.body['sid'] = req.cookies.sid;
            req.body['em_ip'] = req.cookies.em_ip;
            chttp.cpost(req.body, '/p/super/updateSettings', function (cont) {
                res.send(cont);
            });
        }
    });



    // license上传更新
    app.post('/licenseUpload',multipartMiddleware, function (req, res) {
        const file_data = req.files['file_data'];
        const newPath = path.join(path.dirname(file_data.path), file_data.originalFilename);
        fs.rename(file_data.path, newPath, function (err) {
            if (err) {
                res.send(err);
            }
            else {
                req.body['file'] = fs.createReadStream(newPath)
                chttp.cFormData(req.body, '/p/org/licenseUpload', function (cont) {
                    res.send(cont);
                });
            }
        })
    });
};

