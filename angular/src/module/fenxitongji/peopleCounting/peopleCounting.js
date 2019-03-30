(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'peopleCountingCtrl',
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
                function peopleCountingCtrl($localStorage, $scope,
                                           $location, $log, $q, $rootScope, $window,
                                           routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.133:7031' + '/analysis';

                    $scope.init = function () {

                        getDataList();

                    }

                    // 获取列表
                    function getDataList() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ProblemAnalysisController/selectUserRole',
                            method: 'get',
                            callBack: function (res) {
                                $scope.dataList = res.data;
                            }
                        })

                    };

                    $scope.view = function (id) {
                        localStorage.setItem('regionId',id);
                        routeService.route('5-7-1',true);
                    }

                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix
                            + '/v1/ProblemAnalysisController'
                        )
                    }

                }]);
})(window, angular);
