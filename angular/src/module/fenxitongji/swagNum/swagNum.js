(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'swagNum',
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
                function swagNum($localStorage, $scope,
                                     $location, $log, $q, $rootScope, $window,
                                     routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.133:7031/analysis';


                    $scope.init = function () {
                        getList ()
                    }


                    //获取数据列表
                    function getList () {
                        var params = {
                            statTime: $scope.startTime,
                            endTime:$scope.endTime,
                            regionid:$scope.regionName
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/supervise/riverLakePondList',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.dataList = res.data;
                                }
                            }
                        })
                    }



                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix  + '/v1/supervise/createExcelRiverLakePond'
                        )
                    }



                } ]);
})(window, angular);
