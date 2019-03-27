(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'patrolStandingBookDetail',
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
                function patrolStandingBookDetail($localStorage, $scope,
                                                 $location, $log, $q, $rootScope, $window,
                                                 routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.194:7031/analysis';



                    $scope.init = function () {

                        $scope.level = localStorage.getItem('level');
                        $scope.staData = JSON.parse(localStorage.getItem('staData'))
                        if ($scope.level == 1) {
                            getData ()
                        }else {
                            getProblems ()
                        }

                    }
                    // 根据河长姓名查询河长的巡查记录
                    function getData () {
                        var params = {
                            chairmanId: $scope.staData.chairmanid,
                            patrolDate:$scope.staData.patrolDate,
                            chairmanName:$scope.staData.chairman_name

                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/patrolRiverStatistics/getPatrolInfo',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.dataList = res.data;
                                }
                            }
                        })
                    }


                    // 查询反馈的问题
                    function getProblems () {
                        var params = {
                            patrolIds: $scope.staData.patrolIds
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/patrolRiverStatistics/getProblemInfo',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.peoblemList = res.data;
                                }
                            }
                        })
                    }









                    // 返回按钮
                    $scope.goBack = function () {
                        routeService.route('5-14', true);
                    }


                }]);
})(window, angular);
