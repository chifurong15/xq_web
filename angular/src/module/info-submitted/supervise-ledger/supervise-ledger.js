(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'superviseLedger',
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
                function ($localStorage, $scope,
                          $location, $log, $q, $rootScope, $window,
                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    // var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    var apiPrefix = 'http://10.0.9.133:7031' + '/analysis';


                    //区域列表
                    $scope.regionList = [];
                    //村镇列表
                    $scope.townList = [];

                    $scope.startTime = '';
                    $scope.endTime = '';
                    $scope.dataList = [];

                    $scope.problemnum = '';
                    $scope.phonenum = '';
                    $scope.dubannum = '';
                    $scope.remark = '';


                    $scope.init = function () {
                        getList();
                        getRegion();
                    };

                    $scope.searchData = function () {
                        getList();
                    };

                    //重置
                    $scope.reset = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                    };

                    //导出
                    $scope.download = function () {
                        window.location.href = apiPrefix
                            + '/v1/DubanAnalysis/createExcel1?startTime='
                            + $scope.startTime
                            + '&endTime='
                            + $scope.endTime;
                    };

                    $scope.edit = function (id) {
                        $scope.id = id;
                        $('#editMyModal').modal('show')
                    };

                    $scope.save = function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanAnalysis/updateDuban',
                            method: 'put',
                            params: {
                                id: $scope.id,
                                problemnum: $scope.problemnum,
                                phonenum: $scope.phonenum,
                                dubannum: $scope.dubannum,
                                remark: $scope.remark,
                            },
                            callBack: function (res) {
                                if (res.resCode===1) {
                                    getList();
                                    layer.msg('修改成功',{time:1000});
                                    setTimeout(function () {
                                        $('#editMyModal').modal('hide');
                                    },1000)
                                }
                            }
                        })
                    };

                    function getList() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanAnalysis/dubanStandingBook',
                            method: 'get',
                            params: {
                                startTime: $scope.startTime,
                                endTime: $scope.endTime,
                            },
                            callBack: function (res) {
                                if (res.resCode===1) {
                                    $scope.dataList = res.data;
                                }
                            }
                        })
                    }

                    function clear() {
                        $scope.problemnum = '';
                        $scope.phonenum = '';
                        $scope.dubannum = '';
                        $scope.remark = '';
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
