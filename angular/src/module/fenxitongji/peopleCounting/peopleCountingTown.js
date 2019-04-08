(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'peopleCountingTown',
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
                function peopleCountingTown($localStorage, $scope,
                                              $location, $log, $q, $rootScope, $window,
                                              routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.133:7031' + '/analysis';

                    $scope.init = function () {
                        var id = localStorage.getItem('regionId');
                        getDataList(id);

                    }

                    // 获取列表
                    function getDataList(id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ProblemAnalysisController/selectUserRoleByQ',
                            method: 'get',
                            params:{
                                regionId:id,
                                type:4
                            },
                            callBack: function (res) {
                                $scope.dataList = res.data;
                            }
                        })

                    };

                    $scope.view = function (id) {
                        localStorage.setItem('regionId',id);
                        routeService.route('5-7-3',true);
                    }

                    // 返回按钮
                    $scope.goBack = function () {

                        routeService.route('5-7-1', true);

                    }


                }]);
})(window, angular);
