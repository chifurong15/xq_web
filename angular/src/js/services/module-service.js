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

                $http({
                    method: 'GET',
                    url: (_this.getServiceUrl().lastIndexOf('uip') >= 0 ? _this.getServiceUrl() : (_this.getServiceUrl() + '/uip')) + '/moduleManage/querySmModuleAndFunctions',
                }).then(function successCallback(resp) {
                    // 请求成功执行代码
                    if (resp.data.resCode == 1) {
                        //$scope.allModuleList = resp.data.data;
                        //这里保存当前App挂载的用户角色 模块和功能列表
                        _this.htmlAndJs = resp.data.data;
                        //$scope.leftMenus = [];
                        //$scope.selectMenus = [];
                        //$scope.getLeftMenusAndSelectMenus(response.data.data, $scope.leftMenus, $scope.selectMenus);
                    }
                }, function errorCallback(response) {
                    // 请求失败执行代码
                });
                return _this.htmlAndJs;
            },
            getHtmlUrl: function () {
                return this.htmlUrl;
            },
            getServiceUrl: function () {
                return this.serviceUrl;
            }
        }

    }]);