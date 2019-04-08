

(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'socialAccount',
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
                function socialAccount($localStorage, $scope,
                                          $location, $log, $q, $rootScope, $window,
                                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/supervise';
                    // var apiPrefix = 'http://10.0.9.133:7023/supervise';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.init = function () {
                        getRegion ()
                        getList ()
                        $scope.reset ();
                        getStatusList()
                    }

                    /**
                     * 处理状态
                     */
                    function getStatusList(){
                        $scope.statusList = [
                            {
                                'id':1,
                                'name':'未处理'
                            },
                            {
                                'id':2,
                                'name':'处理完成'
                            },
                            {
                                'id':3,
                                'name':'处理中'
                            },
                            {
                                'id':4,
                                'name':'二次处理'
                            },
                            {
                                'id':5,
                                'name':'多次处理中'
                            },
                        ]
                    }
                    //搜索
                    $scope.search = function (){
                        getList();
                    }

                    //重置
                    $scope.reset = function (){
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.status = '';
                    }

                    //获取数据列表
                    function getList () {
                        var params = {
                            statTime: $scope.startTime,
                            endTime:$scope.endTime,
                            processingStatus:$scope.status,
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/socialReport/listReport',
                            method: 'get',
                            params:params ,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.moduleList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;

                                }
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


                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix
                            + '/v1/socialReport/createExcel?statTime='
                            + $scope.startTime
                            + '&endTime='
                            + $scope.endTime
                            + '&processingStatus='
                            + $scope.status
                            + '&pageNumber='
                            + $scope.paginationConf.currentPage
                            + '&pageSize='
                            + $scope.paginationConf.itemsPerPage
                        )
                    }

                    $scope.download = function (path) {
                        window.open($scope.fileUrl + path)
                    }



                    // 开始月份
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime = result;
                        $scope.$apply();
                    });




                    // 结束月份
                    var endTime = $('#endTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.endTime = result;
                        $scope.$apply();
                    });

                    //动态设置最小值
                    startTime.on('dp.change', function (e) {
                        endTime.data('DateTimePicker').minDate(e.date);
                    });
                    //动态设置最大值
                    endTime.on('dp.change', function (e) {
                        startTime.data('DateTimePicker').maxDate(e.date);
                    });



                } ]);
})(window, angular);
