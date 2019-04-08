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
                        $scope.lst = JSON.parse(localStorage.getItem('lst'));

                        getVillageList($scope.lst.eventBelongTownId)

                    }
                    // 返回按钮
                    $scope.goBack = function () {
                        routeService.route('5-17-1', true);
                    }


                    // 获取村级列表
                    function getVillageList(id) {
                        var params = {
                            beginDate: $scope.lst.startTime,
                            endDate: $scope.lst.endTime,
                            townId:id
                        };
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/patrolRiverProblemStatistics/getListVillage',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                $scope.villageList = res.data;
                            }
                        })

                    };


                }]);
})(window, angular);
