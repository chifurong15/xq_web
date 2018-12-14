(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'supervisionCtrl',
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
                function supervisionCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    //var apiPrefix = 'http://10.0.9.114:8080' + '/messageSent';

                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        // $scope.num = 5;
                        $scope.author = $scope.userInfo.userName;
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.regionName = '';
                        $scope.status = '';

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSupervisionCondition/userinfo',
                            method:'get',
                            callBack:function (res) {
                                $scope.num = res.data;
                                getList();
                            }
                        })
                    }
                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSupervisionCondition/selectList',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                superviseTimeStart:$scope.startTime,
                                superviseTimeEnd:$scope.endTime,
                                region:$scope.regionName,
                                rectifyState:$scope.status
                            },
                            callBack:function (res) {
                                $scope.moduleList = res.data.list
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }
                    //搜索
                    $scope.searchData = function (){
                        getList();
                    }

                    //重置
                    $scope.reset = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.regionName = '';
                        $scope.status = '';
                    }
                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }

                    //查看详情
                    $scope.view = function (id) {
                        $('#myModal').modal('show');
                        getDetail(id);
                    }

                    //获取工作间报详情
                    function getDetail (id){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSupervisionCondition/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.detailData = res.data;
                                    $scope.ReportTime = $scope.detailData.superviseTime;
                                    if(res.data.fileList){
                                        $scope.accessoryURL = [];
                                        res.data.fileList.map(function (item){
                                            // console.log(item.substring(item.lastIndexOf('/')+1));
                                            $scope.accessoryURL.push({
                                                name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                previewURL:item.previewURL,
                                                downloadURL:item.downloadURL
                                            })
                                        })
                                    }
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //新增
                    $scope.add = function (){
                        $scope.assessory = [];
                        $('#addMyModal').modal('show')
                    }
                    function clear (){
                        $scope.superviseTime = '';
                        $scope.superviseWay = '';
                        $scope.leadName = '';
                        $scope.rectifyState = '';
                        $scope.superviseContent = ''
                    }

                    //新增 保存 上报
                    $scope.save = function (id){
                        if($scope.superviseTime && $scope.leadName && $scope.superviseContent){
                            var params = {
                                superviseTime:$scope.superviseTime,
                                superviseWay:$scope.superviseWay,
                                leadName:$scope.leadName,
                                rectifyState:$scope.rectifyState,
                                superviseContent:$scope.superviseContent,
                                accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''

                            }
                            // console.log(params);
                            if(id == 1){//保存
                                $ajaxhttp.myhttp({
                                    url:apiPrefix + '/v1/msSupervisionCondition/addTwo',
                                    method:'post',
                                    params:params,
                                    callBack:function (res) {
                                        if(res.resCode == 1){
                                           layer.msg('保存成功',{times:500});
                                            getList();
                                            clear();
                                            $('#addMyModal').modal('hide')
                                        }else{
                                            layer.msg('服务器异常，请稍后再试')
                                        }
                                    }
                                })
                            }else if (id == 2){//上报
                                $ajaxhttp.myhttp({
                                    url:apiPrefix + '/v1/msSupervisionCondition/add',
                                    method:'post',
                                    params:params,
                                    callBack:function (res) {
                                        if(res.resCode == 1){
                                            layer.msg('上报成功',{times:500});
                                            getList();
                                            clear();
                                            $('#addMyModal').modal('hide')
                                        }else{
                                            layer.msg('服务器异常，请稍后再试')
                                        }
                                    }
                                })
                            }
                        }else if (!$scope.superviseTime) {
                            layer.alert("请选择督导时间", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.leadName) {
                            layer.alert("请输入督导人员", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.superviseContent) {
                            layer.alert("请输入督导检查内容", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }

                    }

                    //上报
                    $scope.report = function (id){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSupervisionCondition/updateSentState',
                            method:'put',
                            params:{
                                id:id,
                                sentState: 1
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('上报成功',{times:500});
                                    getList();
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }
                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSupervisionCondition/delete',
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

                    //导出
                    $scope.download = function (){
                        window.open(
                            apiPrefix
                            + '/v1/msSupervisionCondition/createExcel?superviseTimeStart='
                            + $scope.startTime
                            + '&superviseTimeEnd='
                            + $scope.endTime
                            + '&region='
                            + $scope.regionName
                            + '&rectifyState='
                            + $scope.status)
                     }


                    //关闭新增窗口
                    $scope.closeAddModal = function (){
                        clear();
                        $('#addMyModal').modal('hide')
                    }

                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function () {
                        $('#coverModal').modal('show');
                    }


                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function () {
                        $('#coverModal').modal('hide');
                        var formFile = new FormData();

                        var fileObj = document.querySelector('input[type=file]').files[0];
                        formFile.append("files", fileObj); //加入文件对象

                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/msSupervisionCondition/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                layer.msg("上传成功");
                                $scope.assessory.push(res.data[0]);
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }


                    //查看附件
                    $scope.viewFile = function (path) {

                        window.open($scope.fileUrl + path)
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

                    //动态设置最小值
                    startTime.on('dp.change', function (e) {
                        endTime.data('DateTimePicker').minDate(e.date);
                    });
                    //动态设置最大值
                    endTime.on('dp.change', function (e) {
                        startTime.data('DateTimePicker').maxDate(e.date);
                    });

                    // 督导时间
                    var superviseTime = $('#superviseTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.superviseTime = result;
                        $scope.$apply();
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
