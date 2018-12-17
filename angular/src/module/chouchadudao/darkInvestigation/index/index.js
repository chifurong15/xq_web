(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'darkInvestigationCtrl',
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
                function darkInvestigationCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    //var apiPrefix = 'http://10.0.9.203:8080' + '/messageSent';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        //
                        // $ajaxhttp.myhttp({
                        //     url:apiPrefix + '/v1/msMeetingCondition/userinfo',
                        //     method:'get',
                        //     callBack:function (res) {
                        //         $scope.num = res.data;
                        //     }
                        // })


                        getList();
                    }

                    //搜索
                    $scope.searchData = function () {
                        getList();
                    }

                    //重置
                    $scope.reset = function () {
                        $scope.startTime = '';
                    }

                    // 获取数据列表
                    function getList () {
                        // $ajaxhttp.myhttp({
                        //     url:apiPrefix + '/v1/msMeetingCondition/selectList',
                        //     method:'get',
                        //     params:{
                        //         pageNumber: $scope.paginationConf.currentPage,
                        //         pageSize: $scope.paginationConf.itemsPerPage,
                        //         meetingTimeStart:$scope.startTime,
                        //         meetingTimeEnd:$scope.endTime,
                        //         region:$scope.regionName
                        //     },
                        //     callBack:function (res) {
                        //         $scope.moduleList = res.data.list;
                        //         $scope.paginationConf.totalItems = res.data.total;
                        //     }
                        // })
                    }

                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }


                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            // $ajaxhttp.myhttp({
                            //     url:apiPrefix + '/v1/msMeetingCondition/delete',
                            //     method:'delete',
                            //     params:{
                            //         id:id
                            //     },
                            //     callBack:function (res) {
                            //         if(res.resCode == 1){
                            //             layer.msg('删除成功',{times:500});
                            //             getList();
                            //         }else{
                            //             layer.msg('服务器异常，请稍后再试',{times:500})
                            //         }
                            //     }
                            // })
                            layer.close(layerIndex);
                        }, function () {

                        });
                    }
                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function () {
                        $('#coverModal').modal('show');
                    }


                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function () {
                        $('#coverModal').modal('hide');
                        var formFile = new FormData();

                        var fileObj = document.querySelector('input[type=file]').files[0];
                        formFile.append("files", fileObj); //加入文件对象

                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/msMeetingCondition/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                layer.msg("上传成功");
                                $scope.assessory.push(res.data[0]);
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }

                    // 开始时间
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.startTime = result;
                        $scope.$apply();
                    });


                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                        itemsPerPage: 10,
                        pagesLength: 10,
                        perPageOptions: [1, 2, 3, 4, 5, 10],
                        onChange: function () {
                            //console.log($scope.paginationConf.currentPage);
                            $location.search('currentPage', $scope.paginationConf.currentPage);
                        }
                    };

                    // 当他们一变化的时候，重新获取数据条目
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getList);
                } ]);
})(window, angular);
