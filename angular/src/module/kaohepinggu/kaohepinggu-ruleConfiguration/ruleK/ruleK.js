(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'scoreRuleKCtrl',
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
                function scoreRuleKCtrl($localStorage, $scope,
                                       $location, $log, $q, $rootScope, $window,
                                       routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/statistic';
                    // var apiPrefix = 'http://10.0.9.214:7024' + '/statistic';

                    $scope.init = function () {
                        $scope.ruleId = localStorage.getItem('ruleId');
                        getKRule ();
                    }


                    //获取水质变化细则列表 -- K值
                    function getKRule (){
                        var params = {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            paramType: $scope.paramType2,
                            ruleId: $scope.ruleId
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/waterQuality/listWaterQuality',
                            method: 'get',
                            params:params,
                            callBack: function (res) {
                                $scope.moduleList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    //搜索查询K值
                    $scope.searchK = function () {
                        getKRule();
                    }


                    // 清空水质变化细则
                    function clearK () {
                        $scope.paramType3 = '';
                        $scope.minValue3 = '';
                        $scope.maxValue3 = '';
                        // $scope.rightMatch = '';
                        $scope.deductValue = '';
                        $scope.sortOrder3 = '';
                    }


                    //水质变化细则
                    $scope.add3 = function (item){
                        $('#myModal3').modal('show');
                        if(item){
                            $scope.idK = item.id;
                            $scope.paramType3 = item.paramType;
                            $scope.maxValue3 = item.maxValue;
                            $scope.minValue3 = item.minValue;
                            // $scope.rightMatch = item.rightMatch;
                            $scope.deductValue = item.deductValue;
                            $scope.sortOrder3 = item.sortOrder;
                        }else{
                            $scope.idK = '';
                        }
                        //routeService.route('3-11-3', true);
                    }

                    // 水质变化细则-新增
                    $scope.saveK = function () {
                        var params = {
                            ruleId: $scope.ruleId,
                            paramType: $scope.paramType3,
                            maxValue: $scope.maxValue3,
                            minValue: $scope.minValue3,
                            // rightMatch: $scope.rightMatch,
                            deductValue:$scope.deductValue,
                            sortOrder:$scope.sortOrder3
                        }
                        if(!$scope.idK){
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/waterQuality/addWaterQuality',
                                method: 'post',
                                params:params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('新增成功',{times:2000});
                                        getKRule();
                                        clearK();
                                        $('#myModal3').modal('hide');
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }else{
                            params.id = $scope.idK;
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/waterQuality/updateWaterQuality',
                                method: 'put',
                                params:params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功',{times:2000});
                                        getKRule();
                                        clearK();
                                        $('#myModal3').modal('hide');
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }
                    }

                    //删除变化细则
                    $scope.delK = function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                            // 按钮
                        }, function () {
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/waterQuality/deleteWaterQuality',
                                method: 'DELETE',
                                params: {
                                    id: id
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("删除成功！",{time:2000});
                                        getKRule();
                                    }
                                }
                            })
                        }, function () {});

                    }

                    //关闭模态框
                    $scope.cancel = function (){
                        clearK();
                        $('#myModal3').modal('hide');
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
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getKRule);

                } ]);
})(window, angular);
