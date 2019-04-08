(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'patrolProblemStandingBookDetail',
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
                function patrolProblemStandingBookDetail($localStorage, $scope,
                                                   $location, $log, $q, $rootScope, $window,
                                                   routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.194:7031' + '/analysis';


                    $scope.init = function () {
                        $scope.level = localStorage.getItem('level');
                        $scope.staData = JSON.parse(localStorage.getItem('staData'));
                        console.log('level',$scope.level);
                        console.log('staData',$scope.staData);
                        if($scope.level == 1){
                            getDataList()
                        }else if ($scope.level == 2) {
                            getProblemList()
                        }

                    }
                    // 返回按钮
                    $scope.goBack = function () {

                       routeService.route('5-17', true);

                    }

                    // 获取镇街列表
                    function getDataList() {
                        var params = {
                            beginDate: $scope.staData.startTime,
                            endDate: $scope.staData.endTime,
                            countryId:$scope.staData.eventBelongCountryId
                        };
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/patrolRiverProblemStatistics/getListTown',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                $scope.dataList = res.data;
                            }
                        })

                    };

                    // 获取问题列表
                    function getProblemList () {
                        var params = {
                            beginDate: $scope.staData.startTime,
                            endDate: $scope.staData.endTime,
                            areaId:$scope.staData.eventBelongCountryId,
                            countryCode:1,
                            problemType:4
                        };
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/patrolRiverProblemStatistics/getListProblem',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                $scope.problemList = res.data;
                            }
                        })

                    };


                    $scope.viewVillage =  function (lst) {
                        lst.startTime = $scope.staData.startTime;
                        lst.endTime = $scope.staData.endTime;
                        localStorage.setItem('lst',JSON.stringify(lst));
                        routeService.route('5-17-2',true);
                    }

                }]);
})(window, angular);
