(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'peopleRiverPatrolDetail',
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
                function peopleRiverPatrolDetail($localStorage, $scope,
                                         $location, $log, $q, $rootScope, $window,
                                         routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    // var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    var apiPrefix = 'http://10.0.9.133:7031/analysis';



                    $scope.init = function () {
                        getParams();
                        getList();
                    };

                    // 返回按钮
                    $scope.goBack = function () {
                        clearSessionStorage();
                        routeService.route('5-8', true);
                    };

                    function getList() {
                        $http({
                            url: apiPrefix + '/v1/ProblemAnalysisController/xunHeCountDetail',
                            method: 'get',
                            params: {
                                regionId:$scope.regionId,
                                type:$scope.index,
                                startTime: $scope.startTime,
                                endTime: $scope.endTime
                            },
                        }).success(function (res) {
                            $scope.dataList = res.data;
                        }).error(function (error) {

                        })
                    }

                    function getParams(){
                        $scope.regionId = sessionStorage.getItem('countRegionId');
                        $scope.index = parseInt(sessionStorage.getItem('countIndex'));
                        $scope.startTime = sessionStorage.getItem('countStartTime');
                        $scope.endTime = sessionStorage.getItem('countEndTime');
                    }

                    function clearSessionStorage(){
                        sessionStorage.removeItem('countRegionId');
                        sessionStorage.removeItem('countIndex');
                        sessionStorage.removeItem('countStartTime');
                        sessionStorage.removeItem('countEndTime');
                    }
                }]);
})(window, angular);
