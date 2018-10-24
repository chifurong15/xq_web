'use strict';
var app = angular.module('app');
app.controller(
    'createUserController',
    [
        '$localStorage',
        '$scope',
        '$location',
        '$log',
        '$q',
        '$rootScope',
        '$window',
        'routeService',
        '$http',
        function createUserController($localStorage, $scope, $location, $log,
                                      $q, $rootScope, $window, routeService, $http) {
            $scope.roleType = function () {
                // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
                $http({
                    method: "GET",
                    url: $localStorage.serviceUrl + "/smRole/queryRoleList",
                    params: {pageNumber: -1, pageSize: -1},
                }).success(
                    function (res) {
                        if (res.resCode == 1) {
                            $scope.roles = res.data.records;
                        } else {
                            alert("服务器异常!");
                        }
                    }
                );
            }
            var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
            $scope.findUserName = function (userName) {
                $http({
                    method: "get",
                    url: $localStorage.serviceUrl + "/common/checkUserNameExist",
                    params: {userName: userName},
                }).success(
                    function (res) {
                        console.log(res.resCode)
                        if (res.resCode == 0) {
                            $('#yz').text('该用户名已存在！请重新输入');
                        } else {
                            if (res.resCode == 1) {
                                $('#yz').text("");
                            } else {
                                if (res.resCode == 1009) {
                                    $('#yz').text("用户名不能为空!");
                                } else {
                                    $('#yz').text("服务器异常!");
                                }
                            }
                        }
                    }
                );
            }
            $scope.findCellphone = function (cellphone) {
                if (!myreg.test(cellphone)) {
                    $('#yz1').text("请填写正确的手机号码");
                } else {
                    $http({
                        method: "get",
                        url: $localStorage.serviceUrl + "/common/checkCellphoneExist",
                        params: {cellphone: cellphone},
                    }).success(
                        function (res) {
                            if (res.resCode == 0) {
                                $('#yz1').text('该手机号码已注册！请重新输入')
                            } else {
                                if (res.resCode == 1) {
                                    $('#yz1').text("");
                                } else {
                                    if (res.resCode == 1009) {
                                        $('#yz1').text("手机号不能为空!");
                                    } else {
                                        $('#yz1').text("服务器异常!");
                                    }
                                }
                            }
                        }
                    );
                }
            }
            $scope.roleID = function (x) {
                $scope.roleIds = x.id;
            }
            function checkImage() {
                var file = document.querySelector('input[type=file]').files[0];
                if (file == undefined) {
                    //如果为空，不做检查
                    return true;
                } else {
                    var suffix = "jpg,png";
                    var curSuffix = file.name.split('.')[1];
                    curSuffix = curSuffix.toLowerCase();
                    if (suffix.indexOf(curSuffix) == -1) {
                        alert("图片格式只能是 .png 或 .jpg 格式！");
                        return false;
                    }
                    $scope.userImage = file;
                    return true;
                }
            }

            //所属区域树模态框【show】
            $scope.regionShow = function() {
                $("#region_ztree").modal('show');
                $scope.areaName = '';
                $scope.treeList(regionTreeUrl);
            };
            var regionTree;
            var regionTreeUrl = $localStorage.gwUrl + "/information/v1/administrativeRegion/regionTree";
            //初始化树
            $scope.treeList = function(regionTreeUrl){
                $http({
                    method: "GET",
                    url: regionTreeUrl,
                    params:{
                    	regionCode:120100000000
                    },
                    dataType:'json'
                }).success(
                    function(data) {
                        regionTree = $.fn.zTree.init($("#regionTree"), setting, data.data);
                    }
                ).error(function() {});
            }  ;

            //行政区划树数据
            var setting = {
                view:{
                    selectedMulti:true,
                    showLine:true,
                    showIcon:true
                },
                data:{
                    simpleData:{enable:true},
                    keep: {parent: true},
                    key: {isParent: "Isparent"}
                },
                callback:{
                    beforeExpand:zTreeExpand,
                    onClick:zTreeOnClick
                }
            };

            function zTreeOnCheck(event,treeId,treeNode){};
            //树点击
            function zTreeOnClick(event,treeId,treeNode){
                if(treeNode.id !== 0){
                    $scope.region = treeNode.name;
                    $scope.regionCode = treeNode.id;
                }
            }
            //树扩展
            function zTreeExpand(treeId,treeNode){
                var cnodes = treeNode.children;
                if (cnodes !=null && cnodes.length > 0){
                    return;
                }
                $http({
                    method: "GET",
                    url: regionTreeUrl,
                    params: {
                        parentCode:treeNode.id
                    }
                }).success(
                    function(res) {
                        regionTree.addNodes(treeNode,res.data,true);
                    }
                );
            }
            //区域模态框搜索框
            $scope.select_region = function() {
                if($scope.areaName == null || $scope.areaName === '' ) {
                    $scope.treeList(regionTreeUrl);
                }else{
                    $http({
                        method: "GET",
                        url: regionTreeUrl,
                        params: {
                            regionName: $scope.areaName
                        }
                    }).success(
                        function(res) {
                            if(res.data.length <= 0){
                                var a = {
                                    isParent:false,
                                    id:0,
                                    name:'暂无数据'
                                };
                                res.data = a;
                            }
                            regionTree = $.fn.zTree.init($("#regionTree"), setting, res.data);
                        }
                    );
                }

            };
            //关闭所属区域模态框【确定按钮】
            $scope.region_modalOk = function() {
                $("#region_ztree").modal('hide');
            };

            $scope.createUser = function () {
                var options = $("#xb option:selected");
                if (!checkImage()) {
                    return false;
                }
                $scope.gender = options.val();
                if ($('#yz').text() != '' || $('#yz1').text() != '') {
                    return;
                } else {
                    if (!$scope.roleIds || !$scope.name || !$scope.userName || !$scope.password || !$scope.cellphone || !$scope.gender) {
                        alert("*为必填，请完善信息");
                    } else {
                        var formData = new FormData();
                        formData.append("roleIds", $scope.roleIds);
                        formData.append("name", $scope.name);
                        formData.append("userName", $scope.userName);
                        formData.append("password", $scope.password);
                        formData.append("cellphone", $scope.cellphone);
                        formData.append("gender", $scope.gender);
                        if ($scope.regionId) {
                            formData.append("regionId", $scope.regionId);
                        }
                        if ($scope.email) {
                            formData.append("email", $scope.email);
                        }
                        if ($scope.dateOne) {
                            formData.append("birthday", $scope.dateOne);
                        }
                        if ($scope.weixin) {
                            formData.append("weixin", $scope.weixin);
                        }
                        if ($scope.qq) {
                            formData.append("qq", $scope.qq);
                        }
                        if ($scope.description) {
                            formData.append("description", $scope.description);
                        }
                        if ($scope.position) {
                            formData.append("position", $scope.position);
                        }
                        if ($scope.userImage) {
                            formData.append("userImage", $scope.userImage);
                        }
                        if ($scope.department) {
                            formData.append("department", $scope.department);
                        }
                        if ($scope.regionCode) {
                            formData.append("regionId", $scope.regionCode);
                        }
                        $http({
                            method: "post",
                            //headers: {'Content-Type':"multipart/form-data"},
                            url: $localStorage.serviceUrl + "/smUser/addUser",
                            headers: {'Content-Type': undefined},
                            transformRequest: angular.identity,
                            data: formData
                        }).success(
                            function () {
                                alert('创建成功');
                                routeService.route(74, true);
                            }
                        );
                    }
                }
            }
            $scope.back = function () {
                //参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
                //参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
                routeService.route(74, true);
            }

            var datepicker1 = $('#datetimepicker1')
                .datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                })
                .on(
                    'dp.change',
                    function (e) {
                        var result = new moment(e.date)
                            .format('YYYY-MM-DD');
                        $scope.dateOne = result;
                        $scope.$apply();
                    });

        }]);


