(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'scoreRuleFCtrl',
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
                function scoreRuleFCtrl($localStorage, $scope,
                                       $location, $log, $q, $rootScope, $window,
                                       routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/statistic';
                    // var apiPrefix = 'http://10.0.9.214:7024' + '/statistic';

                    $scope.init = function () {
                        $scope.ruleId = localStorage.getItem('ruleId');
                        getFRule ();
                    }
                    //获取水质评分细则列表 -- F值
                    function getFRule () {
                        var params = {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            paramType: $scope.paramType,
                            waterQualityType: $scope.waterQualityType,
                            ruleId: $scope.ruleId
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/waterAssess/listWaterAssess',
                            method: 'get',
                            params:params,
                            callBack: function (res) {
                                $scope.moduleList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }
                    //搜索查询F值
                    $scope.searchF = function () {
                        getFRule();
                    }



                    // 清空水质评分细则
                    function clearF () {
                        $scope.paramType1 = '';
                        $scope.maxValue = '';
                        $scope.minValue = '';
                        $scope.waterQualityType1 = '';
                        $scope.scoreCoefficient = '';
                        $scope.factorCoefficient = '';
                        $scope.sortOrder1 = '';
                    }

                    //水质评分细则 --F值
                    $scope.add2 = function (item){
                        $('#myModal2').modal('show');
                        if(item){
                            $scope.idF = item.id;
                            $scope.paramType1 = item.paramType;
                            $scope.maxValue = item.maxValue;
                            $scope.minValue = item.minValue;
                            $scope.waterQualityType1 = item.waterQualityType;
                            $scope.scoreCoefficient = item.scoreCoefficient;
                            $scope.factorCoefficient = item.factorCoefficient;
                            $scope.sortOrder1 = item.sortOrder;
                        }else{
                            $scope.idF = '';
                        }
                        //routeService.route('3-11-2', true);
                    }

                    // 水质评分细则-新增
                    $scope.saveF = function () {
                        var params = {
                            ruleId: $scope.ruleId,
                            paramType: $scope.paramType1,
                            maxValue: $scope.maxValue,
                            minValue: $scope.minValue,
                            waterQualityType: $scope.waterQualityType1,
                            scoreCoefficient:$scope.scoreCoefficient,
                            factorCoefficient: $scope.factorCoefficient,
                            sortOrder:$scope.sortOrder1
                        }
                        if(!$scope.idF){
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/waterAssess/addWaterAssess',
                                method: 'post',
                                params:params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('新增成功',{times:2000});
                                        getFRule();
                                        clearF();
                                        $('#myModal2').modal('hide');
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }else{
                            params.id = $scope.idF;
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/waterAssess/updateWaterAssess',
                                method: 'put',
                                params:params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功',{times:2000});
                                        getFRule();
                                        clearF();
                                        $('#myModal2').modal('hide');
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }
                    }

                    //删除评分细则
                    $scope.delF = function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                            // 按钮
                        }, function () {
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/waterAssess/deleteWaterAssess',
                                method: 'DELETE',
                                params: {
                                    id: id
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("删除成功！",{time:2000});
                                        getFRule();
                                    }
                                }
                            })
                        }, function () {});

                    }


                    //关闭模态框
                    $scope.cancel = function (){
                        clearF();
                        $('#myModal2').modal('hide');
                    }

                    //返回
                    $scope.goBack=function(){
                        routeService.route('3-11',true);
                    }

                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                        itemsPerPage: 10,
                        pagesLength: 10,
                        perPageOptions: [1, 2, 3, 4, 5, 10],
                        onChange: function () {
                            //console.log($scope.paginationConf.currentPage);
                            $location.search('currentPage', $scope.paginationConf.currentPage);
                        }
                    };
                    // 当他们一变化的时候，重新获取数据条目
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getFRule);
                } ]);
})(window, angular);
