var UITree = function () {

    return {
        //main function to initiate the module
        init: function () {

            var DataSourceTree = function (options) {
                this._data = options.data;
                this._delay = options.delay;
            };

            DataSourceTree.prototype = {

                data: function (options, callback) {
                    var self = this;

                    setTimeout(function () {
                        var data = $.extend(true, [], self._data);

                        callback({ data: data });

                    }, this._delay)
                }
            };

            var treeDataSource2 = new DataSourceTree({
                data: [
                    { name: 'System Logs <div class="tree-actions"></div>', type: 'folder', additionalParameters: { id: 'F11' } },
                    { name: 'Notifications <div class="tree-actions"></div>', type: 'folder', additionalParameters: { id: 'F12' } },
                    { name: '<i class="fa fa-bell gold"></i> Alerts', type: 'item', additionalParameters: { id: 'I11' } },
                    { name: '<i class="fa fa-bar-chart-o darkorange"></i> Tasks', type: 'item', additionalParameters: { id: 'I12' } }
                ],
                delay: 400
            });

            $('#MyTree2').tree({
                dataSource: treeDataSource2,
                multiSelect: true,
                loadingHTML: '<div class="tree-loading"><i class="fa fa-rotate-right fa-spin"></i></div>'
            });
          
        }

    };

}();