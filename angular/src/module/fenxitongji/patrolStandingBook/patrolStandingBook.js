(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'patrolStandingBook',
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
                function patrolStandingBook($localStorage, $scope,
                                          $location, $log, $q, $rootScope, $window,
                                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.194:7031/analysis';
                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';
                    var regionTreeUrl1 = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.init = function () {
                        // getRegion ()
                        getList ()
                        $scope.reset ();
                    }

                    //搜索
                    $scope.search = function (){
                        getList();
                    }

                    //重置
                    $scope.reset = function (){
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.regionName = '';
                        $scope.chairmanName = '';
                    }

                    //查看详情
                    $scope.viewDetail = function (id , data) {
                        routeService.route('5-14-1',true);
                        localStorage.setItem('level',id);
                        localStorage.setItem('staData',JSON.stringify(data));
                    }


                    //获取数据列表
                    function getList () {
                        var params = {
                            beginDate: $scope.startTime,
                            endDate:$scope.endTime,
                            regionId:$scope.regionId,
                            chairmanName:$scope.chairmanName,
                            pageNum: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,

                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/patrolRiverStatistics/getList',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.dataList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }



                    // //获取行政区域
                    // function getRegion (){
                    //     $ajaxhttp.myhttp({
                    //         url:regionTreeUrl1,
                    //         method:'get',
                    //         params:{
                    //             pageNum:-1,
                    //             pageSize:-1,
                    //             grade:3
                    //         },
                    //         callBack:function (res) {
                    //             $scope.regionList = res.data.list;
                    //         }
                    //     })
                    // }


                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix
                            + '/v1/patrolRiverStatistics/exportData?beginDate='
                            + $scope.startTime
                            + '&endDate='
                            + $scope.endTime
                            + '&chairmanName='
                            + $scope.chairmanName
                            + '&regionId='
                            + $scope.regionId
                        )
                    }

                    /**
                     * 初始化行政区划树
                     */
                    var regionTreeSetting = {
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        view: {
                            nameIsHTML: true,
                            expandSpeed: 'slow',
                            dblClickExpand: false,
                            txtSelectedEnable: false
                        },
                        callback: {
                            beforeExpand: regionTreeOnExpand,
                            onClick: regionTreeOnClick
                        }
                    };


                    /**
                     * 生成区域树
                     */
                    function regionTreeList () {
                        $http({
                            method: 'get',
                            url: regionTreeUrl
                        }).success(function (res) {
                            // console.log(res)
                            if(res.resCode == 1){
                                regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, res.data);
                            }else{
                            }
                        }).error(function () {
                        });
                    };

                    /**
                     * 用于捕获行政区域父节点展开之前的问题回调函数，并且根据返回值确定是否允许展开操作
                     * @param {Object} treeId
                     * @param {Object} treeNode
                     */
                    function regionTreeOnExpand(treeId, treeNode) {
                        var cnodes = treeNode.children;
                        $http({
                            method: 'get',
                            url: regionTreeUrl,
                            params: {
                                parentCode: treeNode.id
                            },
                        }).success(
                            function (res) {
                                //console.log(res);
                                regionTree.addNodes(treeNode, res.data, true);
                            }
                        );
                    }

                    /**
                     * 捕获行政区域节点被点击
                     * @param {Object} event
                     * @param {Object} treeId
                     * @param {Object} treeNode
                     */
                    function regionTreeOnClick(event, treeId, treeNode) {
                        // console.log(treeNode);
                        $scope.regionId = treeNode.id;
                        $scope.regionName = treeNode.name;
                        $scope.grade = treeNode.grade;
                    }

                    /**
                     * 区域树模态框
                     */
                    $scope.getRegionShow = function () {
                        $('#regionTreeModal').modal('show');
                        regionTreeList();
                    }

                    /**
                     * 区域树搜索
                     */
                    $scope.getSelectRegion = function(){
                        //console.log('我是区域树搜索...')
                    }

                    /**
                     * 关闭模态框
                     */
                    $scope.getModalOk = function(){
                        $('#regionTreeModal').modal('hide');
                        //console.log('我是区域树关闭...')
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
