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

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    //var apiPrefix = 'http://10.0.9.203:8080' + '/messageSent';


                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
                    $scope.detailId = localStorage.getItem('id');
                    $scope.init = function () {
                        $scope.author = $scope.userInfo.userName;

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkReports/userinfo',
                            method:'get',
                            callBack:function (res) {
                                $scope.num = res.data;
                            }
                        })
                        getList();
                        getAllRegion ();

                    }
                    // 获取数据列表
                    function getList () {

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentReports/selectList',
                            method:'get',
                            params:{
                                reportId:$scope.detailId,
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                acceptState:$scope.acceptState,
                                sentState:$scope.sentState,
                                region:$scope.regionName,
                            },
                            callBack:function (res) {
                                $scope.moduleList = res.data.list
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
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
                    $scope.view = function (id) {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentReports/detail',
                            method:'get',
                            params:{
                                id:id,
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.detailData = res.data;
                                        $scope.briefDescription = $scope.detailData.briefDescription;
                                        var options = {
                                            pdfOpenParams: {
                                                pagemode: "thumbs",
                                                navpanes: 0,
                                                toolbar: 0,
                                                statusbar: 0,
                                                view: "FitV"
                                            }
                                        };
                                        PDFObject.embed($scope.detailData.accessoryUrl, "#pdfOb", options);
                                    }
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                        $('#myModal').modal('show');

                    }

                    $scope.download = function (path) {
                        window.open(path)
                    }

                    //退回
                    $scope.sendBack = function (id) {
                        $('#myModal2').modal('show');
                        $scope.backId = id;
                    }
                    //添加退回原因
                    $scope.sendBackSave = function () {
                        if (!$scope.backReason) {
                            layer.alert("请输入退回原因", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                        var params = {
                            sentReportsId:$scope.backId,
                            returnReason:$scope.backReason
                        }

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkReturn/add',
                            method:'post',
                            params:params,
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('退回成功',{times:500});
                                    $('#myModal2').modal('hide');
                                    $scope.backReason = '';
                                    getList();
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }

                    //获取退回历史列表
                    $scope.viewBack = function (id) {
                        $('#myModal3').modal('show');
                        getBackList (id);
                    }
                    function getBackList (id){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkReturn/selectList',
                            method:'get',
                            params:{
                                sentReportsId:id,
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.backList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }


                    //是否采纳
                    $scope.adopt =  function (isAdopt,id) {
                        if(isAdopt == 1){
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSentReports/updateAcceptState',
                                method:'put',
                                params:{
                                    id:id,
                                    acceptState:1
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('接受采纳',{times:500});
                                        getList();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }else{
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSentReports/updateAcceptState',
                                method:'put',
                                params:{
                                    id:id,
                                    acceptState:2
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('拒绝采纳',{times:500});
                                        getList();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }
                    }

                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSentReports/delete',
                                method:'delete',
                                params:{
                                    id:id
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('删除成功',{times:500});
                                        getList();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
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
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getBackList);
                } ]);
})(window, angular);
