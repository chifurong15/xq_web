(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'anchaanfangSchemeAddCtrl',
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
                '$ajaxhttp',
                'moduleService',
                'globalParam',
                function anchaanfangSchemeAddCtrl($localStorage, $scope,
                                            $location, $log, $q, $rootScope, $window,
                                            routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/ancha';
                    //var apiPrefix = 'http://10.0.9.133:7021' + '/ancha';

                    $scope.init = function () {

                        var bulletin = globalParam.getter().bulletin || {};
                    }

                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime = new moment(c.date).format('YYYY-MM');
                        $scope.$apply();
                    });

                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function(){
                       $('#coverModal').modal('show');
                    }

                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function(){
                        $('#coverModal').modal('hide');
                        var formFile = new FormData();
                        var fileObj = document.querySelector('input[type=file]').files[0];
                        $scope.fileName = fileObj.name;
                        formFile.append("files", fileObj); //加入文件对象
                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/AnzhaReport/upload',
                                data:formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if(res.resCode == 1) {
                                layer.msg('上传成功', {times: 2000})
                                $scope.assessory = res.data;
                            }else{
                                layer.msg('上传失败', {times: 2000})
                            }

                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }

                    //返回
                    $scope.goBack=function(){
                        history.back(-1);
                    }

                    // 新增方案
                    $scope.submit = function() {

                        if (!$scope.title) {
                            layer.alert("请输入标题", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.createuser) {
                            layer.alert("请输入创建人", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.searchTime) {
                            layer.alert("请选择期号", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.content) {
                            layer.alert("请输入内容", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                        // 新增方案
                        var params = {
                            title: $scope.title,
                            issue: $scope.searchTime,
                            createuser: $scope.createuser,
                            assessory: $scope.assessory,
                            content:$scope.content
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaScheme/selectHave',
                            method: 'get',
                            params: {
                                issue: $scope.searchTime
                            },
                            callBack: function (res) {
                                console.log(res)
                                if (res.resCode == 1) {
                                    if(res.data == '没有'){
                                        $http({
                                            method: 'POST',
                                            url: apiPrefix + '/v1/AnzhaScheme/add',
                                            params:params
                                        }).success(
                                            function (res) {
                                                if (res.resCode == 1) {
                                                    layer.msg('新增成功',{time:2000});
                                                    clear();
                                                    routeService.route(2, true);
                                                }else{
                                                       layer.msg('服务器异常，请稍后再试');
                                                }
                                            }
                                        );
                                    }else{
                                        layer.msg('一个月只能新增一次方案');
                                    }
                                } else {
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })

                    }

                    //取消
                    $scope.back = function () {
                        routeService.route(2, true);
                    }

                    //清空表单
                    var clear = function () {
                        $scope.title = '';
                        $scope.searchTime = '';
                        $scope.createuser = '';
                        $scope.fileName='';
                        $scope.content = ''
                    }

                } ]);
})(window, angular);
