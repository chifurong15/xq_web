(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'inspectionRiverConfig',
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
                function inspectionRiverConfig($localStorage, $scope,
                                               $location, $log, $q, $rootScope, $window,
                                               routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/statistic';
                    // var apiPrefix = 'http://10.0.9.133:7024' + '/statistic';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.dataList = [];
                    $scope.riverName = '';
                    $scope.riverId = '';
                    $scope.showRiverList = false;
                    $scope.unitId = '';
                    $scope.showUnitList = false;
                    $scope.riverList = [];
                    $scope.unitList = [];

                    $scope.regionList=[];
                    $scope.region='';

                    //水质考核
                    $scope.isWaterQualityAssess=1;

                    //河段类型
                    $scope.riverType=1;
                    $scope.patrolNumber=0;
                    $scope.patrolUnitName='';

                    //当前选中的那一列数据
                    $scope.currentRecord={};
                    //当前时间戳
                    var current = 0;

                    $scope.init = function () {
                        getList();
                        getUnitList();
                        getRegion();
                    };

                    //模糊查询河湖列表
                    $scope.searchRiverList = function () {
                        $scope.showRiverList = true;
                        var now = (new Date()).getTime();
                        if (now - current > 300) {
                            current = now;
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/reachAssess/listRiver',
                                method: 'get',
                                params: {
                                    river: $scope.riverName
                                },
                                callBack: function (res) {
                                    if (res.resCode === 1) {
                                        var list = res.data;
                                        if (list.length > 10) {
                                            list.length = 10;
                                        }
                                        $scope.riverList = list;
                                    }
                                }
                            })
                        }
                    };

                    $scope.selectRiverId = function (id) {
                        if (id) {
                            $scope.riverId = id;
                            $scope.showRiverList = false;
                            $scope.riverName = $scope.riverList.filter(function (item) {
                                return item.id === id
                            })[0].riverName
                        }
                    };

                    $scope.selectUnitId = function (id) {
                        if (id) {
                            $scope.unitId = id;
                            $scope.showUnitList = false;
                            $scope.unitName = $scope.unitList.filter(function (item) {
                                return item.id === parseInt(id)
                            })[0].dictName
                        }
                    };

                    $scope.search=function(){
                      getList();
                    };

                    $scope.reset = function () {
                        $scope.riverName = '';
                        $scope.riverId = '';
                        $scope.showRiverList = false;
                        $scope.unitId = '';
                        $scope.showUnitList = false;
                        $scope.riverList = [];
                    };

                    $scope.handleTableOperation=function(method,id){
                      if(method&&id){
                        $scope.currentRecord=$scope.dataList.filter(function (item) {
                            return item.id===id
                        })[0];
                        if(method==='detail'){
                            detail();
                        }else if(method==='edit'){
                            edit();
                        }
                      }
                    };

                    $scope.closeEditModal=function () {
                        $('#editModal').modal('hide')
                    };

                    $scope.save=function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/reachAssess/updateReachAssessPatrol',
                            method: 'put',
                            params:{
                                id:$scope.currentRecord.id,
                                isWaterQualityAssess:$scope.isWaterQualityAssess,
                                riverType:$scope.riverType,
                                patrolNumber:$scope.patrolNumber,
                                patrolUnit:$scope.patrolUnitName
                            },
                            callBack: function (res) {
                                if (res.resCode === 1) {
                                    getList();
                                    layer.msg('修改成功',{time:1000});
                                    setTimeout(function () {
                                        $('#editModal').modal('hide');
                                        clear();
                                    },1000);
                                }else {
                                    layer.alert(res.resMsg);
                                }
                            }
                        })
                    };

                    function getUnitList() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/reachAssess/listPatrolUnit',
                            method: 'get',
                            callBack: function (res) {
                                if (res.resCode === 1) {
                                    $scope.unitList = res.data;
                                }
                            }
                        })
                    }

                    function getList() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/reachAssess/listReachAssessPatrol',
                            method: 'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                river:$scope.riverId,
                                region:$scope.region
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.dataList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }

                    //获取行政区域
                    function getRegion (){
                        $ajaxhttp.myhttp({
                            url:regionTreeUrl,
                            method:'get',
                            params:{
                                pageNum:-1,
                                pageSize:-1,
                                grade:3
                            },
                            callBack:function (res) {
                                $scope.regionList = res.data.list;
                            }
                        })
                    }

                    function detail(){
                        $('#detailModal').modal('show')
                    }

                    function edit(){
                        $('#editModal').modal('show');
                        $scope.riverType=$scope.currentRecord.riverType;
                        $scope.isWaterQualityAssess=$scope.currentRecord.isWaterQualityAssess;
                        $scope.patrolNumber=$scope.currentRecord.patrolNumber;
                        $scope.patrolUnitName=$scope.currentRecord.patrolUnitName;
                    }

                    function clear(){
                        //水质考核
                        $scope.isWaterQualityAssess=1;

                        //河段类型
                        $scope.riverType=1;
                        $scope.patrolNumber=0;
                        $scope.patrolUnitName='';
                    }

                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                        itemsPerPage: 10,
                        pagesLength: 10,
                        perPageOptions: [1, 5, 10,15,20],
                        onChange:function () {
                            if ($scope.paginationConf.totalItems) {
                                getList();
                            }
                        }
                    };
                }]);
})(window, angular);
