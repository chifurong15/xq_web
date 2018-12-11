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
                    //var apiPrefix = 'http://10.0.9.116:7024' + '/statistic';

                    $scope.init = function () {
                        $scope.isShow = false;
                        $scope.isShow1 = false;
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

                    //获取水质评分细则列表 -- F值
                    function getFRule () {
                        var params = {
                            pageNumber: $scope.paginationConf1.currentPage,
                            pageSize: $scope.paginationConf1.itemsPerPage,
                            paramType: $scope.paramType,
                            waterQualityType: $scope.waterQualityType,
                            waterQualityRule: $scope.waterQualityRule
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/waterAssess/listWaterAssess',
                            method: 'get',
                            params:params,
                            callBack: function (res) {
                                $scope.moduleList1 = res.data.list;
                                $scope.paginationConf1.totalItems = res.data.total;
                            }
                        })
                    }


                    //获取水质变化细则列表 -- K值
                    function getKRule (){
                        var params = {
                            pageNumber: $scope.paginationConf2.currentPage,
                            pageSize: $scope.paginationConf2.itemsPerPage,
                            paramType: $scope.paramType2,
                            waterQualityRule: $scope.waterQualityRule1
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/waterQuality/listWaterQuality',
                            method: 'get',
                            params:params,
                            callBack: function (res) {
                                $scope.moduleList2 = res.data.list;
                                $scope.paginationConf2.totalItems = res.data.total;
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
                    $scope.view = function (name ,tab) {
                        if(tab == 1){ //跳转F值明细
                            $scope.isShow = true;

                            $scope.waterQualityRule = name;
                            getFRule ();
                        }else if (tab == 2){//跳转K值明细
                            $scope.isShow1 = true;
                            $scope.waterQualityRule1 = name;
                            getKRule ();
                        }
                        $('.layui-tab-title li').eq(tab).addClass('layui-this').siblings('li').removeClass('layui-this');

                        $('.layui-tab-content .layui-tab-item').eq(tab).addClass('layui-show').siblings('.layui-tab-item').removeClass('layui-show');

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
                    // 清空水质变化细则
                    function clearK () {
                        $scope.paramType3 = '';
                        $scope.minValue3 = '';
                        $scope.maxValue3 = '';
                        // $scope.rightMatch = '';
                        $scope.deductValue = '';
                        $scope.sortOrder3 = '';
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
                            ruleName: $scope.waterQualityRule,
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
                            assessRule: $scope.waterQualityRule1,
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
                    $scope.cancel = function (id){
                        if(id == 1){
                            clearScoreRule();
                            $('#myModal1').modal('hide');
                        }else if(id == 2){
                            clearF();
                            $('#myModal2').modal('hide');
                        }if(id == 3){
                            clearK();
                            $('#myModal3').modal('hide');
                        }

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

                    //评分细则分页
                    if($scope.waterQualityRule){
                        // 配置分页基本参数
                        $scope.paginationConf1 = {
                            currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                            itemsPerPage: 10,
                            pagesLength: 10,
                            perPageOptions: [1, 2, 3, 4, 5, 10],
                            onChange: function () {
                                //console.log($scope.paginationConf.currentPage);
                                $location.search('currentPage', $scope.paginationConf1.currentPage);
                            }
                        };
                        // 当他们一变化的时候，重新获取数据条目
                        $scope.$watch('paginationConf1.currentPage + paginationConf1.itemsPerPage', getFRule);
                    }else{
                        // 配置分页基本参数
                        $scope.paginationConf1 = {
                            currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                            itemsPerPage: 10,
                            pagesLength: 10,
                            perPageOptions: [1, 2, 3, 4, 5, 10],
                            onChange: function () {
                                //console.log($scope.paginationConf.currentPage);
                                $location.search('currentPage', $scope.paginationConf1.currentPage);
                            }
                        };
                        $scope.paginationConf1.totalItems = 0;
                    }

                    //变化细则分页
                    if($scope.waterQualityRule1){
                        // 配置分页基本参数
                        $scope.paginationConf2 = {
                            currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                            itemsPerPage: 10,
                            pagesLength: 10,
                            perPageOptions: [1, 2, 3, 4, 5, 10],
                            onChange: function () {
                                //console.log($scope.paginationConf.currentPage);
                                $location.search('currentPage', $scope.paginationConf2.currentPage);
                            }
                        };
                        // 当他们一变化的时候，重新获取数据条目
                        $scope.$watch('paginationConf2.currentPage + paginationConf2.itemsPerPage', getFRule);
                    }else{
                        // 配置分页基本参数
                        $scope.paginationConf2 = {
                            currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                            itemsPerPage: 10,
                            pagesLength: 10,
                            perPageOptions: [1, 2, 3, 4, 5, 10],
                            onChange: function () {
                                //console.log($scope.paginationConf.currentPage);
                                $location.search('currentPage', $scope.paginationConf2.currentPage);
                            }
                        };
                        $scope.paginationConf2.totalItems = 0;
                    }


                } ]);
})(window, angular);
