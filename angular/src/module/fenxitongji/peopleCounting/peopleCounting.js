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

                    $scope.peopleList=[];

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

                    }

                    $scope.view = function (id) {
                        localStorage.setItem('regionId',id);
                        routeService.route('5-7-1',true);
                    };

                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix
                            + '/v1/ProblemAnalysisController'
                        )
                    };

                    $scope.getPeopleList=function (regionId,index) {
                        $scope.regionId=regionId;
                        $scope.currentIndex=index;
                        requestPeopleList();
                        $('#peopleModal').modal('show')
                    };

                    $scope.closeModal=function () {
                        $scope.peopleList =[];
                        $scope.paginationConf.totalItems=0;
                        $scope.paginationConf.currentPage=1;
                        $scope.paginationConf.itemsPerPage=10;
                        $('#peopleModal').modal('hide')
                    };

                    function requestPeopleList(){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ProblemAnalysisController/selectUserRoleDetail',
                            method: 'get',
                            params:{
                                regionId:$scope.regionId,
                                type:$scope.currentIndex,
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage
                            },
                            callBack: function (res) {
                                if(res.resCode===1){
                                    $scope.peopleList = res.data.list;
                                    $scope.paginationConf.totalItems=res.data.total;
                                }
                            }
                        })
                    }

                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: 1,
                        itemsPerPage: 10,
                        pagesLength: 10,
                        perPageOptions: [1, 2, 3, 4, 5, 10],
                        onChange: function () {
                            if ($scope.paginationConf.totalItems) {
                                requestPeopleList();
                            }
                        }
                    };


                }]);
})(window, angular);
