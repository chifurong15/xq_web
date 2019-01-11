(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'riverListCtrl',
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
                function riverListCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService , globalParam) {


                    var apiPrefix = moduleService.getServiceUrl() + '/statistic';
                    // var apiPrefix = 'http://10.0.9.214:7024' + '/statistic';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
                    $scope.init = function () {
                        getList ();
                        getAllRegion ();
                        getAllRule ();
                        getAllSection();

                    }

                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/reachAssess/listReachAssess',
                            method: 'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                region: $scope.regionName,
                                isSewage: $scope.isSewageFactory,
                                isCompensation:$scope.isCompensation,
                                ruleId:$scope.scoringRules,
                                isWaterQualityAssess:$scope.isWaterQualityAssess

                            },
                            callBack: function (res) {
                                $scope.moduleList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    // 搜索
                    $scope.search = function () {
                        getList();
                    };

                    $scope.reset = function () {
                        $scope.regionName = '';
                        $scope.isSewageFactory = '';
                        $scope.isCompensation = '';
                        $scope.scoringRules = '';
                        $scope.isWaterQualityAssess = '';
                    }

                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                        //clear();
                    }

                    //修改
                    $scope.save = function () {
                        var params = {
                            id: $scope.id,
                            reachCode:$scope.editData.reachCode,
                            regionCode:$scope.editData.regionCode,
                            riverCode:$scope.editData.riverCode,
                            riverType:$scope.editData.riverType,
                            isWaterQualityAssess:$scope.isWaterQualityAssess1,
                            isCompensation:$scope.isCompensation1,
                            isSewageFactory:$scope.isSewageFactory1,
                            targetWaterQuality:$scope.targetWaterQuality1,
                            yearTargetWaterQuality:$scope.yearTargetWaterQuality1,
                            inputSectionCode: $scope.inputSection,
                            outputSectionCode: $scope.outputSection,
                            scoringRuleId: $scope.scoringRules1,
                            // remark:$scope.remark
                        }
                        // console.log(params);
                        if($scope.targetWaterQuality1 && String($scope.isSewageFactory1) !== '' && String($scope.isCompensation1) !== ''
                            && String($scope.isWaterQualityAssess1)!=='' && $scope.inputSection
                            && $scope.outputSection && $scope.scoringRules1
                        ){

                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/reachAssess/updateReachAssess',
                                method: 'PUT',
                                params: params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功', {time:2000});
                                        $('#myModal').modal('hide');
                                        getList();
                                    }else{
                                        layer.msg(res.resMsg, {time:2000});
                                    }
                                }
                            })

                        }else{
                            layer.alert("可选项不能为空", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                    }

                    //修改
                    $scope.edit = function (item) {
                        $scope.id = item.id;
                        $scope.editData = item;
                        $scope.inputSection = item.inputSectionCode;
                        $scope.outputSection = item.outputSectionCode;
                        $scope.scoringRules1 = item.scoringRuleId;
                        $scope.regionName1 = item.regionName;
                        $scope.riverName1 = item.riverName;
                        $scope.reachName1 = item.reachName;
                        $scope.targetWaterQuality1 = item.targetWaterQuality;
                        $scope.isSewageFactory1 = item.isSewageFactory;
                        $scope.isCompensation1 = item.isCompensation;
                        $scope.isWaterQualityAssess1 = item.isWaterQualityAssess;
                        $scope.isWaterQualityAssess1 = item.isWaterQualityAssess;
                        $scope.yearTargetWaterQuality1 = item.yearTargetWaterQuality;
                        // $scope.remark = item.remark;
                        $('#myModal').modal('show');
                        //routeService.route('3-1-2', false);
                    }

                    //获取水质评分规则
                    function getAllRule () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/reachAssess/waterQualityRuleList',
                            method: 'get',
                            callBack: function (res) {
                                $scope.ruleList = res.data;
                            }
                        })
                    }

                    //获取入境断面
                    function getAllSection () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/reachAssess/listSections',
                            method: 'get',
                            callBack: function (res) {
                                $scope.sectionList = res.data;
                            }
                        })
                    }

                    //获取所有区
                    function getAllRegion () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/reachAssess/regionList',
                            method: 'get',
                            callBack: function (res) {
                                $scope.regionList = res.data;
                            }
                        })
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
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getList);
                } ]);
})(window, angular);
