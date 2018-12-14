(function () {
    var omEdit = new OrgMind({
        container: 'om_edit',          //'jsmind_container'-- id of the container   
        btnContainer: 'btn_cnter',     //'btn_cnter'
        multiple: false,     //支持多选
        allowUnsel: false,    //允许不选
        disableRoot: false,
        view: {
            hmargin: 40,
            vmargin: 10,
            line_width: 1,
            line_color: '#000'
        },
        layout: {
            hspace: 40,
            vspace: 12,
            pspace: 12
        },
        nodeClick: function (that) {
            console.log(this);
        }
    });
})()