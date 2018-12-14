;
let oBC = {
    first: {
        "iconClass": "fa fa-home",
        "text": "首页"
    },
    follows: []
}
$.session.set('oBC', JSON.stringify(oBC));

var oBreadCrumb = function() {
    return {
        init: function() {
            this.setBCFirst("fa fa-home", "首页11");
            this.clearBCFollows();
            this.refresh();
        },
        setBCFirst: function(iconClass, text) {
            let oBC = JSON.parse($.session.get('oBC'));
            oBC.first = {
                "iconClass": iconClass,
                "text": text
            };
            $.session.set('oBC', JSON.stringify(oBC));
        },
        addBCFollows: function(txt) {
            let oBC = JSON.parse($.session.get('oBC'));
            oBC.follows.push(txt);
            $.session.set('oBC', JSON.stringify(oBC));
        },
        clearBCFollows: function() {
            let oBC = JSON.parse($.session.get('oBC'));
            oBC.follows = [];
            $.session.set('oBC', JSON.stringify(oBC));
        },
        refresh: function() {
            let oBC = JSON.parse($.session.get('oBC'));
            let $UL = $("ul.breadcrumb"),
                BCFirst = oBC.first,
                BCFollowEles = oBC.follows;
            $UL.html('<li><i class="' + BCFirst.iconClass + '">' + BCFirst.text + '</i></li>');
            if (BCFollowEles.length > 0) {
                for (i in BCFollowEles) {
                    var $li = $("<li></li>");
                    $li.html(BCFollowEles[i]);
                    $UL.append($li);
                }
            }
        }
    }
}();