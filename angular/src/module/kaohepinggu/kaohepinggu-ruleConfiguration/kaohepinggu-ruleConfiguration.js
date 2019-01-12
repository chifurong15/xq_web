(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'scoreRuleCtrl',
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
                function scoreRuleCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/statistic';
                    // var apiPrefix = 'http://10.0.9.214:7024' + '/statistic';

                    $scope.init = function () {
                        getScoreRule ();
                    }

                    //获取水质评分规则列表
                    function getScoreRule () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/waterQualityRule/listWaterRule',
                            method: 'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage
                            },
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
                    //搜索查询K值
                    $scope.searchK = function () {
                        getKRule();
                    }

                    //查看F/K值明细
                    $scope.view = function (name,tab) {
                        localStorage.setItem('ruleId',name);
                        if(tab == 1){ //跳转F值明细
                            routeService.route('3-11-1',true);
                        }else if (tab == 2){//跳转K值明细
                            routeService.route('3-11-2',true);
                        }
                    }

                    //水质评分规则
                    $scope.add1 = function (item){
                        $('#myModal1').modal('show');
                        if(item){
                            $scope.id = item.id;
                            $scope.ruleName = item.ruleName;
                            $scope.remark = item.remark;
                            $scope.sortOrder = item.sortOrder;
                        }else{
                            $scope.id = ''
                        }
                        //routeService.route('3-11-1', true);
                    }

                    //水质评分规则-新增
                    $scope.saveRule = function () {
                        var params = {
                            ruleName: $scope.ruleName,
                            sortOrder: $scope.sortOrder,
                            remark: $scope.remark
                        }
                        if(!$scope.id){
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/waterQualityRule/addWaterRule',
                                method: 'post',
                                params:params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('新增成功',{times:2000});
                                        getScoreRule();
                                        clearScoreRule();
                                        $('#myModal1').modal('hide');
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }else{
                            params.id = $scope.id;
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/waterQualityRule/updateWaterRule',
                                method: 'put',
                                params:params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功',{times:2000});
                                        getScoreRule();
                                        clearScoreRule();
                                        $('#myModal1').modal('hide');
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }

                    }

                    // 清空水质评分规则
                    function  clearScoreRule(){
                        $scope.remark = '';
                        $scope.sortOrder = '';
                        $scope.ruleName = '';
                    }

                    //关闭模态框
                    $scope.cancel = function (){
                        clearScoreRule();
                        $('#myModal1').modal('hide');
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
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getScoreRule);
                } ]);
})(window, angular);
