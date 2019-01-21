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
                    // var apiPrefix = 'http://10.0.9.110:7028' + '/messageSent';


                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';
                    var regionTreeUrl1 = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';


                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
                    $scope.detailId = localStorage.getItem('id');
                    $scope.init = function () {
                        $scope.author = $scope.userInfo.name;

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkReports/userinfo',
                            method:'get',
                            callBack:function (res) {
                                $scope.num = res.data;
                            }
                        })
                        getList();
                        getRegion ();
                        getReadList ();

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

                    //获取已阅情况列表
                    function getReadList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/MsSentReadStateController/selectList',
                            method:'get',
                            params:{
                                sentId:$scope.detailId,
                            },
                            callBack:function (res) {
                                $scope.readList = res.data
                            }
                        })
                    }

                    $scope.searchData = function () {
                        getList ()
                    }

                    //获取下发区域
                    function getRegion (){
                        $ajaxhttp.myhttp({
                            url:regionTreeUrl1,
                            method:'get',
                            params:{
                                pageNum:-1,
                                pageSize:-1,
                                grade:3
                            },
                            callBack:function (res) {
                                $scope.regionList = res.data.list;
                                $scope.regionList.push({
                                    areaCode: 120100000000,
                                    areaName:'天津市'
                                })
                            }
                        })
                    }

                    //显示发起周动态报送弹窗
                    $scope.add = function () {
                        $('#myModal').modal('show')
                    }
                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
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
                                        if(res.data.fileList){
                                            $scope.accessoryURL = [];
                                            res.data.fileList.map(function (item){
                                                // console.log(item.substring(item.lastIndexOf('/')+1));
                                                $scope.accessoryURL.push({
                                                    name:item.downloadURL.substring(item.downloadURL.lastIndexOf('/')+1),
                                                    previewURL:item.previewURL,
                                                    downloadURL:item.downloadURL
                                                })
                                            })
                                        }
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

                    //修改
                    $scope.edit = function (id) {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentReports/detail',
                            method:'get',
                            params:{
                                id:id,
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.editData = res.data;
                                        $scope.briefDescription = $scope.editData.briefDescription;
                                        if(res.data.fileList){
                                            $scope.accessoryURL1 = [];
                                            res.data.fileList.map(function (item){
                                                // console.log(item.substring(item.lastIndexOf('/')+1));
                                                $scope.accessoryURL1.push({
                                                    name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                    previewURL:item.previewURL,
                                                    downloadURL:item.downloadURL
                                                })
                                            })
                                        }
                                    }
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                        $('#myModal4').modal('show')
                    }

                    //确定
                    $scope.update = function () {
                        var params = {
                            id:$scope.editData.id,
                            briefDescription:$scope.briefDescription
                        }
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentReports/update',
                            method:'put',
                            params:params,
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('修改成功',{times:500});
                                    getList ();
                                    $('#myModal4').modal('hide');
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

                    // 结束时间
                    $('#EditReportTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.EditReportTime = result;
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
