'use strict';

/* Controllers */
angular.module('app').controller('AppCtrl', ['$scope', 'routeService', '$location', '$translate', '$localStorage', '$rootScope', 'globaltree', '$window', 'moduleService', '$http', '$timeout', '$ajaxhttp',
    function ($scope, routeService, $location, $translate, $localStorage, $rootScope, globaltree, $window, moduleService, $http, $timeout, $ajaxhttp) {
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass('ie');
        isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

        //UIP基础平台接口，包括系统管理等
        $localStorage.gwUrl = moduleService.getServiceUrl();
        $localStorage.serviceUrl = $localStorage.gwUrl + "/uip";
        $localStorage.serviceUrl_chiefOnline = $localStorage.gwUrl + "/patrolMgr";
        $localStorage.serviceUrl_patrolMgr = $localStorage.gwUrl + "/patrolMgr";
        $localStorage.serviceUrl_reachTree = $localStorage.gwUrl + "/watersource";
        $localStorage.serviceUrl_eventMgr = $localStorage.gwUrl + "/eventMgr/";
        $localStorage.serviceUrl_fileService = $localStorage.gwUrl + '/fm';

        //文件预览地址
        // $scope.fileUrl = 'http://10.0.0.196:8888';//开发环境文件服务器地址
        $scope.fileUrl = 'http://60.28.163.75:6001';//线上环境文件服务器地址


        // logo显示隐藏
        $scope.noblock = false;
        moduleService.getConfig();
        // config
        $scope.app = {
            name: '天津市河(湖)长制管理信息平台',
            version: '3.0.0',
            logoImg: 'img/logo.png',

            // for chart colors
            color: {
                primary: '#7266ba',
                info: '#23b7e5',
                success: '#27c24c',
                warning: '#fad733',
                danger: '#f05050',
                light: '#e8eff0',
                dark: '#3a3f51',
                black: '#1c2b36'
            },
            settings: {
                themeID: 1,
                navbarHeaderColor: '',
                navbarCollapseColor: 'bg-white-only',
                asideColor: '',
                headerFixed: true,
                asideFixed: true,
                asideFolded: false,
                asideDock: false,
                container: false
            }
        }

        $scope.initUserInfo = function () {
            //获取用户信息
            $scope.userInfo = {};
            if ($localStorage.userLoginInfo != undefined) {
                getMessage()
                $scope.userInfo.username = $localStorage.userLoginInfo.userInfo.name;
                $scope.userInfo = $localStorage.userLoginInfo.userInfo;
            } else {
                window.location.href = "#/access/signin";
            }
        }

        $scope.logout = function () {
            var layerIndex = layer.confirm('确定注销当前用户吗？', {
                btn: ['确定', '取消']
                // 按钮
            }, function () {
                if (!$localStorage.userLoginInfo || !$localStorage.userLoginInfo.userInfo) {
                    window.location.href = "#/access/signin";
                    localStorage.clear();
                    return;
                }
                var userId = $localStorage.userLoginInfo.userInfo.id;
                $http({
                    method: 'POST',
                    url: $localStorage.serviceUrl + "/login/logout",
                    params: {userId: userId}
                }).success(
                    function success(result) {
                        if (result.resCode == 1) {
                            window.location.href = "#/access/signin";
                            localStorage.clear();
                        } else {
                        }
                    }, function failure(result) {

                    });
                layer.close(layerIndex);
            }, function () {

            });
        };

        // save settings to local storage
        if (angular.isDefined($localStorage.settings)) {
            $scope.app.settings = $localStorage.settings;
        } else {
            $localStorage.settings = $scope.app.settings;
        }

        $scope.initMenu = function () {
            $rootScope.appConfig = moduleService.getMoudleConfig();
            if ($rootScope.appConfig && $rootScope.appConfig.children) {
                $scope.userMenus = $rootScope.appConfig.children;
                //$scope.$apply();
                //console.info($scope.userMenus);
            }
        }


        /*        if (moduleService.menus && moduleService.menus != '' && moduleService.menus != undefined && moduleService.menus != null) {
         $scope.appConfig = moduleService.getMoudleConfig();
         } else {
         //加载配置信息
         moduleService.getConfig();
         $scope.appConfig = moduleService.getMoudleConfig();
         }
         ;*/
        //moduleService.getIpConfig();
        //获取二级菜单,默认就三级菜单
        /*$scope.getSecondMenu = function (menu) {
         $(".btn-navbar > a").click(function () {
         $(this).addClass("navStyle").parent().siblings().find("a").removeClass("navStyle");
         });
         var menus = moduleService.getMoudleMenus();
         var secondMenu = [];
         for (var i = 0; i < menus.length; i++) {
         if (menus[i].parentId == seqId) {
         menus[i].children = [];
         if (menus[i].url == "") //还有子菜单
         {
         for (var j = 0; j < menus.length; j++) {
         if (menus[i].seqId == menus[j].parentId) {
         menus[i].children.push(menus[j]);
         }
         }
         }
         secondMenu.push(menus[i]);
         }
         }
         $scope.menuObj = secondMenu;
         }*/
        var hideLeft = function () {
            $(".app-aside").hide();
            $(".app-content").css('marginLeft', '0');
            $("#mainBody").css('left', '0');
        }
        var showLeft = function () {
            $(".app-aside").show();
            $(".app-content").css('marginLeft', '200px');
            $("#mainBody").css('left', '200px');
        }
        $scope.clickRootNode = function (event) {
            hideLeft();
        }

        //点击顶部logo时，菜单一级不选中
        $scope.goHome = function () {
            //routeService.route('/app/dashboard-v1', false)
            $('.navbar-right > li').removeClass('active');
        }
        var searchMenuObj = {};
        $scope.getSecondMenu = function (menu) {
            if (!menu) {
                return;
            }

            var eleId = '#menu_' + menu.id;
            $(eleId).parent().addClass('active');
            $(eleId).parent().siblings().removeClass('active');


            var childernList = moduleService.filterByMenusLimit(menu.children);
            showLeft();
            //设置二级菜单：menuObj在页面指令中被引用
            $scope.menuObj = childernList;
            $localStorage.currentMenu = childernList;
            clickFirst(menu);
            if (searchMenuObj.menus) {
                searchMenuObj = {};
            }
        };
        var clickFirst = function (menu) {

            if (!menu) {
                return;
            }
            //一级菜单url不为空
            if (menu.funcUrl && (!menu.children || menu.children.length == 0)) {
                $timeout(function () {
                    angular.element("#menu_" + menu.id).click();
                    $state.go('app.index', {param: menu.moduleId + '_1_' + menu.seqId});
                }, 0, false);
                return;
            }

            if (!menu.children || menu.children.length == 0) {
                return;
            }
            //如果searchMenuObj不为空，则表示搜索
            var targetMenu = (searchMenuObj.menus && searchMenuObj.menus.length > 0) ? searchMenuObj.menus.pop() : menu.children[0];

            if (!menu.funcUrl && !targetMenu.funcUrl) {
                $timeout(function () {
                    angular.element("#menu_" + targetMenu.id).click();
                }, 0, false);
            }
            clickFirst(targetMenu);
        }
        //解决刷新二级菜单丢失问题
        if ($localStorage.currentMenu != undefined) {
            $scope.menuObj = $localStorage.currentMenu;
        }
        $scope.$watch('app.settings', function () {
            if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                // aside dock and fixed must set the header fixed.
                $scope.app.settings.headerFixed = true;
            }
            // save to local storage
            $localStorage.settings = $scope.app.settings;
        }, true);

        // angular translate
        $scope.lang = {
            isopen: false
        };
        $scope.langs =
        {
            en: 'English',
            de_DE: 'German',
            it_IT: 'Italian'
        }
        ;
        $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
        $scope.setLang = function (langKey, $event) {
            // set the current lang
            $scope.selectLang = $scope.langs[langKey];
            // You can change the language during runtime
            $translate.use(langKey);
            $scope.lang.isopen = !$scope.lang.isopen;
        };

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        //我的消息弹窗
        $scope.myMessageInfoModal = function () {
            $('#myMsg_modal').modal('show');
            // routeService.route('64', true);
        }
        $scope.skipProblem = function () {
            $('#myMsg_modal').modal('hide');

            routeService.route('64', true);
        }
        function getMessage() {
            $ajaxhttp.myhttp({
                //url: 'http://10.0.9.133:20001/v1/event/toDoTasks',
                url: $localStorage.serviceUrl_eventMgr + '/v1/event/toDoTasks',
                method: 'get',
                params: {
                    userId: $localStorage.userLoginInfo.userInfo.id,

                    pageNum: 0,
                    pageSize: 0
                },
                callBack: function (resp) {
                    //$scope.paginationConf.totalItems = 1;
                    $scope.myMessageTotal = resp.data.total;
                    $scope.moduleList = resp.data.list;
                }
            });
        }

        //个人信息弹窗
        $scope.editUserInfoModal = function () {
            $scope.editUserInfo = Object.assign({}, $localStorage.userLoginInfo.userInfo);
            $scope.authError = '';
            $("#editUserInfo_modal").modal('show');
            //个人信息弹窗-生日选择  /*此处实例化
            $('#birthdaypicker').datetimepicker({
                format: 'YYYY-MM-DD',
                locale: moment.locale('zh-cn')
            }).on('dp.change', function (e) {
                var result = new moment(e.date).format('YYYY-MM-DD');
            }).on('hide', function (event) {
                event.preventDefault();
                event.stopPropagation();
            });
        }

        //个人信息弹窗-提交
        $scope.userInfoSubmit = function () {
            $http({
                method: 'POST',
                url: $localStorage.serviceUrl + "/smUser/updateById",
                params: {
                    id: $scope.editUserInfo.id,
                    name: $scope.editUserInfo.name,
                    cellphone: $scope.editUserInfo.cellphone,
                    gender: $scope.editUserInfo.gender,
                    email: $scope.editUserInfo.email,
                    birthday: $scope.editUserInfo.birthday,
                    weixin: $scope.editUserInfo.weixin,
                    qq: $scope.editUserInfo.qq,
                    position: $scope.editUserInfo.position,
                    department: $scope.editUserInfo.department
                }
            }).then(function successCallback(resp) {
                if (resp.data.resCode == 1) {
                    getUserInfo();
                    $scope.authError = resp.data.resMsg;
                    setTimeout(function () {
                        $("#editUserInfo_modal").modal('hide');
                    }, 3000)
                } else {
                    $scope.authError = resp.data.resMsg;
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                $scope.authError = '服务器异常！';
            });
        }

        //获取个人信息
        var getUserInfo = function () {
            $http({
                method: 'GET',
                url: $localStorage.serviceUrl + "/smUser/getById",
                params: {
                    id: $scope.editUserInfo.id,
                }
            }).then(function successCallback(resp) {
                if (resp.data.resCode == 1) {
                    //console.log($localStorage.userLoginInfo.userInfo)
                    $localStorage.userLoginInfo.userInfo = resp.data.data;
                    //($localStorage.userLoginInfo.userInfo)
                }
            }, function errorCallback(response) {
            });
        }

        //修改密码弹窗
        $scope.editPwdModal = function () {
            $scope.editPwd = {
                'oldPwd': '',
                'newPwd': '',
                'confirmPwd': '',
                'authError': '',
                'textType': 'text-danger'
            };
            $("#editPwd_modal").modal('show');
            $("#editPwd_modal").on('Hide.bs.modal', function (e) {
                $scope.editPwd = {
                    'oldPwd': '',
                    'newPwd': '',
                    'confirmPwd': '',
                    'authError': '',
                    'textType': 'text-danger'
                };
            })
        }
        $scope.editPwdSubmit = function () {
            var oldPwd = $scope.editPwd.oldPwd;
            var newPwd = $scope.editPwd.newPwd;
            var confirmPwd = $scope.editPwd.confirmPwd;
            if (!oldPwd) {
                $scope.editPwd.authError = '请输入原密码';
                return;
            } else if (!newPwd) {
                $scope.editPwd.authError = '请输入新密码';
                return;
            } else if (!confirmPwd) {
                $scope.editPwd.authError = '请确认新密码';
                return;
            } else if (newPwd != confirmPwd) {
                $scope.editPwd.authError = '两次输入密码不一致';
                return;
            }
            $http({
                method: 'PUT',
                url: $localStorage.serviceUrl + "/smUser/updatePassword",
                params: {
                    id: $localStorage.userLoginInfo.userInfo.id,
                    oldPassword: oldPwd,
                    newPassword: newPwd
                }
            }).then(function successCallback(resp) {
                if (resp.data.resCode == 1) {
                    $scope.editPwd.textType = 'text-success';
                    $scope.editPwd.authError = '密码修改成功';
                    setTimeout(function () {
                        $("#editPwd_modal").modal('hide');
                    }, 1000);
                } else {
                    $scope.editPwd.authError = resp.data.resMsg;
                }
            }, function errorCallback(response) {// 请求失败执行代码
                $scope.authError = '服务器异常！';
            });
        }
    }
]);