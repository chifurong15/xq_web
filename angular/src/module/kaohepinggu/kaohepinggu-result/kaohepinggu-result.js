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
                    //var apiPrefix = 'http://10.0.9.116:7024' + '/statistic';

                    $scope.init = function () {
                        var date = new Date();
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        if(month == 0){
                            month = 12;
                            year = year - 1;
                        }
                        month =  month < 10 ? '0' + month : month
                        $scope.searchTime1 = year + '-' + month ;
                        $scope.searchTime2 = year + '-' + month ;
                        getList1();
                        getList2();
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

                    //区考核排名搜索
                    $scope.search1 = function(){
                        getList1 ();
                    }

                    //河湖水生态环境质量排名
                    $scope.search2 = function(){
                        getList2 ();
                    }


                    //tab栏切换
                    $('.js-tab li').on("click",function (){
                        var index = $(this).index();
                        $(this).addClass('tab-active').siblings().removeClass('tab-active');
                        $(".js-con").find('.con').hide().eq(index).show();
                    });
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



                } ]);
})(window, angular);
