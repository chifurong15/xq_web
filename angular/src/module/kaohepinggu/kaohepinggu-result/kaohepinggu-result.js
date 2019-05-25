(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'kaoheResultCtrl',
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
                function kaoheResultCtrl($localStorage, $scope,
                                             $location, $log, $q, $rootScope, $window,
                                             routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/statistic';
                    // var apiPrefix = 'http://10.0.9.133:7024' + '/statistic';

                    $scope.init = function () {
                        $scope.searchTime1 = ''
                        $scope.searchTime3 = ''
                        // var date = new Date();
                        // var year = date.getFullYear();
                        // var month = date.getMonth();
                        // if(month == 0){
                        //     month = 12;
                        //     year = year - 1;
                        // }
                        // month =  month < 10 ? '0' + month : month
                        // $scope.searchTime1 = year + '-' + month ;
                        // $scope.searchTime2 = year + '-' + month ;
                        // $scope.searchTime3 = year + '-' + month ;
                        getList1();
                        // getList2();
                        getList3();
                    }

                    // 区考核排名列表
                    function getList1 () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/statistic/regionStatistic',
                            method: 'get',
                            params:{
                                date:$scope.searchTime1
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    $scope.regionSortList = res.data;
                                    $scope.searchTime1 = res.data[0].issue

                                }else{
                                    layer.msg(res.resMsg, {time:2000});
                                }
                            }
                        })
                    }

                    // 河湖水生态环境质量排名列表
                    function getList2 () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/statistic/riverStatistic',
                            method: 'get',
                            params:{
                                date:$scope.searchTime2
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    $scope.envirSortList = res.data;
                                }else{
                                    layer.msg(res.resMsg, {time:2000});
                                }
                            }
                        })
                    }

                    // 其他扣分项排名
                    function getList3 () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/statistic/otherStatistic',
                            method: 'get',
                            params:{
                                date:$scope.searchTime3
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    $scope.otherSortList = res.data;
                                    $scope.searchTime3 = res.data[0].issue
                                }else{
                                    layer.msg(res.resMsg, {time:2000});
                                }
                            }
                        })
                    }


                    $scope.search = function(id){

                        if(id == 1){ ////区考核排名搜索

                            getList1 ();

                        }else if (id == 2){//河湖水生态环境质量排名

                            getList2 ();

                        }else if (id == 3){// 其他扣分项排名

                            getList3 ();

                        }
                    }


                    //默认上个月

                    $('#J-searchTime1').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime1 = moment().subtract(1, 'month').startOf('month').format('YYYY-MM') + ' - ' + moment().subtract(1, 'month').endOf('month').format('YYYY-MM');
                        $scope.searchTime1 = new moment(c.date).format('YYYY-MM');
                        $scope.$apply();
                    });

                    $('#J-searchTime2').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime2 = new moment(c.date).format('YYYY-MM');
                        $scope.$apply();
                    });

                    $('#J-searchTime3').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime3 = new moment(c.date).format('YYYY-MM');
                        $scope.$apply();
                    });



                } ]);
})(window, angular);
