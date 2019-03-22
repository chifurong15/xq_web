(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'monthlyReportCtrl',
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
                function monthlyReportCtrl($localStorage, $scope,
                                           $location, $log, $q, $rootScope, $window,
                                           routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/statistic';
                    // var apiPrefix = 'http://10.0.9.133:7024' + '/statistic';


                    $scope.init = function () {

                        getDataList();

                    }

                    $scope.download = function (path) {
                        window.open($scope.fileUrl + path)
                    }
                    $scope.download1 = function (path) {
                        window.open( '/fm/' + path)
                    }



                    // 获取列表
                    function getDataList() {
                        var params = {
                            startTime: $scope.startTime,
                            endTime: $scope.endTime,
                        };
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/statistic/list',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                $scope.dataList = res.data.list;
                            }
                        })

                    };

                    // 生成
                    $scope.autoCreate = function (lst) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/statistic/monthly',
                            method: 'get',
                            params: {
                                id:lst.id,
                                date:lst.yearmonth
                            },
                            callBack: function (res) {
                               if(res.resCode == 1){
                                   getDataList();
                                   layer.msg("成功生成月报");
                               }else{
                                   layer.msg("服务器异常，请稍后再试");
                               }
                            }
                        })

                    }


                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function (lst) {
                        $('#coverModal').modal('show');
                        $scope.id = lst.id;
                    }


                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function () {
                        $('#coverModal').modal('hide');
                        var formFile = new FormData();

                        var fileObj = document.querySelector('input[type=file]').files[0];
                        formFile.append("file", fileObj); //加入文件对象
                        // console.log(formFile.files);
                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/statistic/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                $scope.assessory = res.data;
                                $('#problemFile').fileinput('clear');
                                layer.msg("上传成功");
                                monthlyReport ($scope.id,res.data);
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }


                    function monthlyReport  (id,path) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/statistic/update',
                            method: 'put',
                            params: {
                                id:id,
                                filePath:path
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    getDataList();
                                }else{
                                    layer.msg("服务器异常，请稍后再试");
                                }
                            }
                        })
                    }


                }]);
})(window, angular);
