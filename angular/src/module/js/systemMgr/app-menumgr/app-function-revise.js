'use strict';
var app = angular.module('app');
app.controller(
    'appFunctionOperateController',
    [
        '$localStorage',
        '$scope',
        '$location',
        '$log',
        '$q',
        '$rootScope',
        'globalParam',
        '$window',
        'routeService',
        '$http',
        'moduleService',
        function appFunctionOperateController($localStorage, $scope, $location, $log,
                                              $q, $rootScope, globalParam, $window, routeService, $http, moduleService) {
            var defaultParentsName = "根节点";
            var defaultFolderName = "AppIcon";
            var editFlag = false;
            var functionUrlPrefix = $localStorage.serviceUrl  + '/appFunction/';
            $scope.appInit = function () {
                if (!$scope.functionType) {
                    $scope.functionType = 'M';
                }
                if (!globalParam) {
                    return;
                }
                var param = globalParam.getter();
                editFlag = param.editFlag;
                $scope.id = param.id;
                //新增
                if (!param.editFlag) {
                    $scope.parentsName = param.parentNode.name ? param.parentNode.name : defaultParentsName;
                    $scope.parents = param.parentNode.parentspath;
                    return;
                }
                initAppFunction();
            }
            /**
             * 修改时，初始化实体属性
             */
            var initAppFunction = function () {
                $http({
                    method: HTTP.METHOD.GET,
                    url: functionUrlPrefix + "detail",
                    params: {id: $scope.id},
                }).success(
                    function (res) {
                        if (HTTP.actionForResCode(res.resCode)) {
                            $scope.name = res.data.name;
                            $scope.parents = res.data.parents;
                            $scope.functionType = res.data.functionType;
                            $scope.imageUrl = res.data.imageUrl;
                            $scope.funcUrl = res.data.funcUrl;
                            $scope.iosFuncUrl = res.data.iosFuncUrl;
                            $scope.remark = res.data.remark;
                            initParentsFunction(res.data.pid);
                        }
                    }
                ).error(function (error) {
                    console.log(error);
                    HTTP.actionForResCode(error.resCode)
                });
            }

            /**
             * 初始化父节点属性
             * @param pid
             */
            var initParentsFunction = function (pid) {
                if (!pid || "0" == pid) {
                    $scope.parentsName = defaultParentsName;
                    return;
                }
                $http({
                    method: HTTP.METHOD.GET,
                    url: functionUrlPrefix + "detail",
                    params: {id: pid},
                }).success(
                    function (res) {
                        if (HTTP.actionForResCode(res.resCode)) {
                            $scope.parentsName = res.data.name;
                        }
                    }
                ).error(function (error) {
                    console.log(error);
                    HTTP.actionForResCode(error.resCode)
                });
            }

            /**
             * 新增或修改
             */
            $scope.operateFunction = function () {
                if (!$scope.name) {
                    alert("请填写功能名称！");
                    return;
                }
                var method, url, msg;
                var params = {
                    name: $scope.name,
                    parents: $scope.parents ? $scope.parents : "",
                    functionType: $scope.functionType ? $scope.functionType : "",
                    imageUrl: $scope.imageUrl ? $scope.imageUrl : "",
                    funcUrl: $scope.funcUrl ? $scope.funcUrl : "",
                    iosFuncUrl: $scope.iosFuncUrl ? $scope.iosFuncUrl : "",
                    remark: $scope.remark ? $scope.remark : ""
                };
                if (editFlag) {
                    method = HTTP.METHOD.PUT;
                    url = functionUrlPrefix + 'update';
                    msg = "修改成功!";
                    params.id = $scope.id;
                } else {
                    method = HTTP.METHOD.POST;
                    url = functionUrlPrefix + "add";
                    msg = "新增成功!";
                }
                console.log(params);

                // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
                $http({
                    method: method,
                    url: url,
                    params: params,
                }).success(
                    function (res) {
                        if (HTTP.actionForResCode(res.resCode)) {
                            layer.msg(msg, {time: 3000});
                            routeService.route(85, true);
                        }
                    }
                ).error(function (error) {
                    console.log(error);
                    HTTP.actionForResCode(error.resCode);
                });
            }
            $scope.back = function () {
                //参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
                //参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
                routeService.route(85, true);
            }

            /**
             * 移除图片
             */
            $scope.removeImage = function () {
                $scope.imageUrl = '';
            }
            $scope.getImageUrl = function (imageUrl) {
                return moduleService.getFileUrl(imageUrl);
            }
            $scope.imgUpload = function () {
                document.getElementById("fileFrom").reset();
                $("#imgBox").modal('show');
            };
            //上传文件
            $scope.fileInput = function () {
                var fd = new FormData();
                var file = document.querySelector('input[type=file]').files[0];
                if (file == null) {
                    layer.msg("请选择文件", {time: 2000});
                    return;
                }
                fd.append('file', file);
                fd.append('folderName', defaultFolderName);
                $scope._load = layer.load(3, {shade: [0.3, '#000000']});
                $http({
                    method: 'POST',
                    url: $localStorage.serviceUrl  + '/fileUpload/upload',
                    data: fd,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).success(
                    function (res) {
                        if (HTTP.actionForResCode(res.resCode)) {
                            $scope.imageUrl = res.data.virtualPath;
                            //$scope.hasImg = true;
                            layer.msg("上传照片成功！", {time: 3000});
                        }
                    }).error(
                    function (error) {
                        layer.msg("服务器异常，请稍后重试！", {time: 2000});

                    });
                layer.close($scope._load);
                $("#imgBox").modal('hide');
            };

        }]);

