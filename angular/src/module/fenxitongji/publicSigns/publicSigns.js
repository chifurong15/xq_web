(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'publicSigns',
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
                function publicSigns($localStorage, $scope,
                                          $location, $log, $q, $rootScope, $window,
                                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.133:7031/analysis';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.init = function () {
                        // getList ()

                        $scope.dataList = [
                            {
                                regionName:'和平区',
                                num:4,
                                count:7,
                                total:11
                            },
                            {
                                regionName:'和东区',
                                num:2,
                                count:3,
                                total:5
                            },
                            {
                                regionName:'和西区',
                                num:4,
                                count:5,
                                total:9
                            },
                            {
                                regionName:'南开区',
                                num:4,
                                count:1,
                                total:5
                            },
                            {
                                regionName:'河北区',
                                num:2,
                                count:7,
                                total:9
                            },
                            {
                                regionName:'红桥区',
                                num:1,
                                count:7,
                                total:8
                            },
                            {
                                regionName:'东丽区',
                                num:2,
                                count:4,
                                total:6
                            },
                            {
                                regionName:'西青区',
                                num:8,
                                count:5,
                                total:13
                            },
                            {
                                regionName:'津南区',
                                num:6,
                                count:8,
                                total:14
                            },
                            {
                                regionName:'北辰区',
                                num:9,
                                count:2,
                                total:11
                            },
                            {
                                regionName:'武清区',
                                num:10,
                                count:12,
                                total:22
                            },
                            {
                                regionName:'宝坻区',
                                num:13,
                                count:12,
                                total:25
                            },
                            {
                                regionName:'滨海新区',
                                num:9,
                                count:12,
                                total:21
                            },
                            {
                                regionName:'宁河区',
                                num:7,
                                count:12,
                                total:19
                            },
                            {
                                regionName:'静海区',
                                num:16,
                                count:2,
                                total:18
                            },
                            {
                                regionName:'蓟州区',
                                num:17,
                                count:13,
                                total:30
                            },
                        ]
                    }


                    //获取数据列表
                    function getList () {
                        var params = {
                            statTime: $scope.startTime,
                            endTime:$scope.endTime,
                            regionid:$scope.regionName
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/supervise/meetingList',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.dataList = res.data;
                                }
                            }
                        })
                    }


                    //
                    // //导出
                    // $scope.export = function (){
                    //     window.open(
                    //         apiPrefix
                    //         + '/v1/supervise/createExcelMeeting?statTime='
                    //         + $scope.startTime
                    //         + '&endTime='
                    //         + $scope.endTime
                    //         + '&regionid='
                    //         + $scope.regionName
                    //     )
                    // }



                } ]);
})(window, angular);
