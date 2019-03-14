(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'problemClassifyCtrl',
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
                function problemClassifyCtrl($localStorage, $scope,
                                           $location, $log, $q, $rootScope, $window,
                                           routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.110:7031' + '/analysis';


                    $scope.init = function () {
                        $scope.id = 3;
                        getTypeList(3)
                        getDataList(3);
                    }


                    // 搜索
                    $scope.search = function () {
                        getDataList($scope.id);
                    }

                    $scope.reset = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                    }

                    // 获取列表
                    function getDataList(problemSources) {
                        var params = {
                            startTime: $scope.startTime,
                            endTime: $scope.endTime,
                            problemSources:problemSources
                        };
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ProblemAnalysisController/whichType',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                res.data.map(function (item,i){
                                    item.oneLst = [];
                                    item.total = 0;
                                    item.problemNumber.map(function (val,j) {
                                        for (var s in val) {
                                            val = {
                                                id:s,
                                                count:val[s]
                                            }
                                            item.total += val.count;
                                            item.oneLst.push(val);
                                            // console.log(val.count);
                                        }
                                    })
                                })
                                if(problemSources == 1){
                                    $scope.dataList1 = res.data;
                                }else if(problemSources == 2){
                                    $scope.dataList2 = res.data;
                                }else if(problemSources == 3){
                                    $scope.dataList3 = res.data;
                                }else if(problemSources == 4){
                                    $scope.dataList4 = res.data;
                                }
                                // $scope.dataList = res.data;
                                // console.log($scope.dataList1);


                            }
                        })
                    };

                    // 获取分类
                    function getTypeList(type) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ProblemAnalysisController/idAndName',
                            method: 'get',
                            params: {
                                problemSources:type
                            },
                            callBack: function (res) {
                                if(type == 1){
                                    $scope.typeList1 = res.data;
                                }else if(type == 2){
                                    $scope.typeList2 = res.data;
                                }else if(type == 3){
                                    $scope.typeList3 = res.data;
                                }else if(type == 4){
                                    $scope.typeList4 = res.data;
                                }
                                // console.log($scope.typeList1);
                            }
                        })
                    };

                    //tab切换
                    $scope.tabChange = function (id) {
                        $scope.id = id;
                        getTypeList(id);
                        getDataList(id);
                    }

                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix
                            + '/v1/ProblemAnalysisController/createExcel2?startTime='
                            + $scope.startTime
                            + '&endTime='
                            + $scope.endTime
                            + '&problemSources='
                            + $scope.id
                        )
                    }


                    // 开始时间
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime = result;
                        $scope.$apply();
                    });

                    // 结束时间
                    var endTime = $('#endTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.endTime = result;
                        $scope.$apply();
                    });

                    //动态设置最小值
                    startTime.on('dp.change', function (e) {
                        endTime.data('DateTimePicker').minDate(e.date);
                    });
                    //动态设置最大值
                    endTime.on('dp.change', function (e) {
                        startTime.data('DateTimePicker').maxDate(e.date);
                    });



                }]);
})(window, angular);
