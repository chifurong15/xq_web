(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'systemStatistics',
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
                function systemStatistics($localStorage, $scope,
                                          $location, $log, $q, $rootScope, $window,
                                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.133:7031/analysis';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.init = function () {
                        getRegion ()
                        getList ()
                        $scope.startTime = getCurrentMonthFirst();
                        $scope.endTime = getCurrentMonthLast();

                        // console.log(getCurrentMonthFirst());

                        // console.log(getCurrentMonthLast());
                    }

                    // 获取当前月的第一天
                    function getCurrentMonthFirst(){
                        var date = new Date();
                        date.setDate(1);
                        var month = parseInt(date.getMonth()+1);
                        var day = date.getDate();
                        if (month < 10) {
                            month = '0' + month
                        }
                        if (day < 10) {
                            day = '0' + day
                        }
                        return date.getFullYear() + '-' + month + '-' + day;
                    }

                    // 获取当前月的最后一天
                    function getCurrentMonthLast(){
                        var date=new Date();
                        var currentMonth=date.getMonth();
                        var nextMonth=++currentMonth;
                        var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
                        var oneDay=1000*60*60*24;
                        var lastTime = new Date(nextMonthFirstDay-oneDay);
                        var month = parseInt(lastTime.getMonth()+1);
                        var day = lastTime.getDate();
                        if (month < 10) {
                            month = '0' + month
                        }
                        if (day < 10) {
                            day = '0' + day
                        }
                        return date.getFullYear() + '-' + month + '-' + day ;
                    }


                    //搜索
                    $scope.search = function (){
                        getList();
                    }

                    //重置
                    $scope.reset = function (){
                        $scope.startTime = getCurrentMonthFirst();
                        $scope.endTime = getCurrentMonthLast();
                        $scope.regionName = '';
                    }


                    //获取数据列表
                    function getList () {
                        var params = {
                            statTime: $scope.startTime,
                            endTime:$scope.endTime,
                            regionid:$scope.regionName
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/supervise/meetingList',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.dataList = res.data;
                                }
                            }
                        })
                    }



                    //获取行政区域
                    function getRegion (){
                        $ajaxhttp.myhttp({
                            url:regionTreeUrl,
                            method:'get',
                            params:{
                                pageNum:-1,
                                pageSize:-1,
                                grade:3
                            },
                            callBack:function (res) {
                                $scope.regionList = res.data.list;
                            }
                        })
                    }


                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix
                            + '/v1/supervise/createExcelMeeting?statTime='
                            + $scope.startTime
                            + '&endTime='
                            + $scope.endTime
                            + '&regionid='
                            + $scope.regionName
                        )
                    }




                    // 开始月份
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime = result;
                        $scope.$apply();
                    });




                    // 结束月份
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



                } ]);
})(window, angular);
