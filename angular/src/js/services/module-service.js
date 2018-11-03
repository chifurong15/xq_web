angular.module('app')
    .service('moduleService', ['$localStorage', '$document', '$q', '$timeout', '$http', '$state', function ($localStorage, $document, $q, $timeout, $http, $state) {


        function findRoot(menus) {
            if (menus) {
                var root = [];
                for (var i = 0; i < menus.length; i++) {
                    if (menus[i].isRoot == true) {
                        root.push(menus[i]);
                    }
                }
                return root;
            }
        };

        function loadTree(menus) {
            if (!menus) {
                return;
            }
            console.log(menus)
            var root = findRoot(menus);
            loadMenuTree(root, menus);
            return root;
        };


        function loadMenuTree(node, menus) {

            for (var i = 0; i < menus.length; i++) {

                if (node.seqId == menus[i].parentId) {
                    //找到子节点
                    if (menus[i].isRoot == false && menus[i].isLeaf == false) {
                        //二级节点
                        pushItem(node, menus[i]);
                        loadMenuTree(menus[i], menus);
                    }
                    else if (menus[i].isRoot == false && menus[i].isLeaf == true) {
                        //子节点
                        pushItem(node, menus[i]);

                    } else {
                        //即是根节点又是叶子节点？
                        pushItem(node, menus[i]);
                    }

                }
            }
        };
        function pushItem(node, ele) {
            if (node.children && node.children.length > 0) {
                node.children.push(ele);
            }
            else {
                node.children = [];
                node.children.push(ele);
            }
        };
        return {
            menus: '',
            htmlAndJs: '',
            serviceUrl: '',
            htmlUrl: '',
            fileUrl: '',
            getConfig: function () {
                var _this = this;
                if (!_this.htmlUrl) {
                    _this.getIpConfig();
                }
                //未登录，则跳转到登录界面
                if (!$localStorage.userLoginInfo || !$localStorage.userLoginInfo.userInfo) {
                    //window.location.href = "#/access/signin";
                    return;
                }
                console.log($)
                $.ajax({
                    type: "Get",
                    url: (_this.getServiceUrl().lastIndexOf('uip') >= 0 ? _this.getServiceUrl() : (_this.getServiceUrl() + '/uip')) + "/smAuthority/queryUserAuthorizedMenuTree?userId=" + $localStorage.userLoginInfo.userInfo.id,
                    async: false
                }).done(function (data) {
                    _this.menus = data.data;
                }).error(function (errordata) {
                    console.log(errordata);
                });
            },
            getIpConfig: function () {
                var _this = this;
                $.ajax({
                    type: "Get",
                    url: "config/ip.json",
                    async: false
                }).done(function (data) {
                    _this.serviceUrl = data['serviceUrl'];
                    _this.htmlUrl = data['htmlUrl'];
                }).error(function (errordata) {

                });
            },
            getMoudleMenus: function () {
                return this.menus;
            },
            getMoudleConfig: function () {
                var _this = this;
                if (!_this.menus) {
                    _this.getConfig();
                }
                return loadTree(this.menus);
            },
            getMoudleHtmlAndJs: function () {
                var _this = this;
                if (_this.htmlAndJs) {
                    return _this.htmlAndJs;
                }

                $.ajax({
                    method: 'GET',
                    url: (_this.getServiceUrl().lastIndexOf('uip') >= 0 ? _this.getServiceUrl() : (_this.getServiceUrl() + '/uip')) + '/moduleManage/querySmModuleAndFunctions',
                    async: false
                }).done(function (resp) {
                    // 请求成功执行代码
                    if (resp.resCode == 1) {
                        //这里保存当前App挂载的用户角色 模块和功能列表
                        _this.htmlAndJs = resp.data;
                    }
                }).error(function (errorData) {

                });
                return _this.htmlAndJs;
            },
            getHtmlUrl: function () {
                var _this = this;
                if (_this.htmlUrl) {
                    return _this.htmlUrl;
                }
                _this.getIpConfig();
                return _this.htmlUrl;
            },
            getServiceUrl: function () {
                var _this = this;
                if (_this.serviceUrl) {
                    return _this.serviceUrl;
                }
                _this.getIpConfig();
                return _this.serviceUrl;
            },
            getFileUrl: function (fileUri) {
                fileUri = fileUri ? fileUri : "";
                var _this = this;
                if (_this.fileUrl) {
                    return _this.fileUrl + fileUri;
                }
                if (!_this.serviceUrl) {
                    _this.getIpConfig();
                }
                var _fileUrl = "";
                $.ajax({
                    type: "get",
                    url: (_this.getServiceUrl().lastIndexOf('uip') >= 0 ? _this.getServiceUrl() : (_this.getServiceUrl() + '/uip')) + "/common/getFileUrl",
                    async: false
                }).done(function (data) {
                    if (data.resCode == 1) {
                        _fileUrl = data.data;
                    }
                }).error(function (errorData) {

                });
                this.fileUrl = _fileUrl;
                return this.fileUrl + fileUri;
            }
        }


    }]);