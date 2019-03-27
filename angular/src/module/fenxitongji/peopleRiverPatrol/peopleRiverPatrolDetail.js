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

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.133:7031/analysis';



                    $scope.init = function () {

                        $scope.level = localStorage.getItem('level');
                        $scope.staData = localStorage.getItem('staData');

                    }


                    // 返回按钮
                    $scope.goBack = function () {
                        routeService.route('5-8', true);
                    }


                }]);
})(window, angular);
