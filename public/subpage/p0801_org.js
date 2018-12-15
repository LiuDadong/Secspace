
    
    (function () {
        applyFnsToSubpage();  //渲染当前登录管理员对当前页面的功能点访问权限
        var omEdit = new OrgMind({
            container: 'om_edit',          //'jsmind_container'-- id of the container   
            btnContainer: 'btn_cnter',     //'btn_cnter'
            multiple: false,     //支持多选
            allowUnsel: false,    //允许不选
            disableRoot: false,
            editable: true,
            expandToDepth:1,
            view: {
                hmargin: 40,
                vmargin: 10,
                line_width: 1,
                line_color: '#000'
            },
            layout: {
                hspace: 40,
                vspace: 12,
                pspace: 14
            },
            jmnodeClick: function (that) {
                console.log(this);
            }
        });
    })()