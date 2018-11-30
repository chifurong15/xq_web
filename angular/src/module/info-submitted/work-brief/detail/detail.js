(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'workBriefDetailCtrl',
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
                function workBriefDetailCtrl($localStorage, $scope,
                                          $location, $log, $q, $rootScope, $window,
                                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    //var apiPrefix = moduleService.getServiceUrl() + '/bulletin';
                    //var apiPrefix = 'http://10.0.9.133:6008' + '/bulletin';

                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $scope.author = $scope.userInfo.userName;
                        getList();
                        getAllRegion ();
                    }
                    // 获取数据列表
                    function getList () {
                        $scope.moduleList = [
                            {
                                title:'28期工作简报',
                                time:'2018-11-05',
                                person:'张三',
                                regionName:'和平区',
                                direction:'发起',
                                status:'1',
                                isAccept:'0'
                            },
                            {
                                title:'27期工作简报',
                                time:'2018-11-10',
                                person:'李四',
                                regionName:'和平区',
                                direction:'发起',
                                status:'3',
                                isAccept:'1'
                            },
                            {
                                title:'26期工作简报',
                                time:'2018-11-24',
                                regionName:'河北区',
                                person:'王五',
                                direction:'发起',
                                status:'2',
                                isAccept:'1'
                            },
                            {
                                title:'25期工作简报',
                                time:'2018-10-25',
                                person:'岑锐',
                                regionName:'津南区',
                                direction:'发起',
                                status:'3',
                                isAccept:'0'
                            },
                        ];
                    }

                    function getAllRegion (){
                        $scope.regionList = [
                            {
                                id:1,
                                region:'天津市',
                            },
                            {
                                id:2,
                                region:'和平区',
                            },
                            {
                                id:3,
                                region:'河东区',
                            },
                            {
                                id:4,
                                region:'河西区',
                            },
                            {
                                id:5,
                                region:'南开区',
                            },
                            {
                                id:6,
                                region:'河北区',
                            },
                            {
                                id:7,
                                region:'红桥区',
                            },
                            {
                                id:8,
                                region:'东丽区',
                            },
                            {
                                id:9,
                                region:'西青区',
                            },
                            {
                                id:10,
                                region:'津南区',
                            },
                            {
                                id:11,
                                region:'北辰区',
                            },
                            {
                                id:12,
                                region:'武清区',
                            },
                            {
                                id:13,
                                region:'宝坻区',
                            },
                            {
                                id:14,
                                region:'滨海新区',
                            },
                            {
                                id:15,
                                region:'宁河区',
                            },
                            {
                                id:16,
                                region:'静海区',
                            },
                            {
                                id:17,
                                region:'蓟州区',
                            }
                        ]
                    }

                    //显示发起周动态报送弹窗
                    $scope.add = function () {
                        $('#myModal').modal('show')
                    }

                    // 查看
                    $scope.view = function () {

                        $('#myModal').modal('show');


                    }

                    //是否采纳
                    $scope.adopt =  function (id) {
                        if(id == 1){
                            layer.msg('接受采纳',{times:500});
                        }else{
                            layer.msg('拒绝采纳',{times:500});
                        }
                    }

                    //删除
                    $scope.delete =  function () {
                        layer.msg('删除成功',{times:500})
                    }

                    //合并周动态
                    $scope.mesh = function () {
                        var layerIndex = layer.confirm('当前还有未上报的区域，是否要合并？\n' +
                            '\n' +
                            '\n' +
                            '重复合并会覆盖上一次的合并文件。', {
                            btn: ['合并', '取消']
                        }, function () {
                            layer.msg('合并成功',{times:500})
                            layer.close(layerIndex);
                        }, function () {

                        });
                    }


                    //返回
                    $scope.goBack=function(){
                        history.back(-1);
                    }



                    // 开始时间
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime = result;
                        $scope.$apply();
                    });

                    // 结束时间
                    var endTime = $('#endTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.endTime = result;
                        $scope.$apply();
                    });
                    // 开始时间
                    var startTime1 = $('#startTime1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime1 = result;
                        $scope.$apply();
                    });

                    // 结束时间
                    var endTime2 = $('#endTime2').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.endTime2 = result;
                        $scope.$apply();
                    });

                    // 结束时间
                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.searchTime = result;
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
                    //动态设置最小值
                    startTime1.on('dp.change', function (e) {
                        endTime1.data('DateTimePicker').minDate(e.date);
                    });
                    //动态设置最大值
                    endTime2.on('dp.change', function (e) {
                        startTime2.data('DateTimePicker').maxDate(e.date);
                    });

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
                        console.log(treeNode);
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
                        console.log($scope.regionName)
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
                } ]);
})(window, angular);
