(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'weeklyDetailCtrl',
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
                function weeklyDetailCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    // var apiPrefix = 'http://10.0.9.110:7028' + '/messageSent';

                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $scope.viewId = localStorage.getItem('viewId');

                        $scope.author = $scope.userInfo.name;

                        $scope.fileList = [];

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWeekDynamic/userinfo',
                            method:'get',
                            callBack:function (res) {
                                $scope.num = res.data;
                            }
                        })

                        getList();

                    }
                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentDynamis/selectList',
                            method:'get',
                            params:{
                                reportId:$scope.viewId,
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                acceptState:$scope.acceptState,
                                sentState:$scope.status,
                                region:$scope.regionName,
                            },
                            callBack:function (res) {
                                $scope.moduleList = res.data.list
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    $scope.searchData = function (){
                        getList();
                    }


                    // 查看
                    $scope.view = function (id) {

                        $('#myModal').modal('show');

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentDynamis/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                $scope.detailData = res.data;
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
                        })

                    }

                    //合并周动态
                    $scope.mesh = function () {
                        var layerIndex = layer.confirm('确定要合并吗', {
                            btn: ['合并', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSentDynamis/judge',
                                method:'get',
                                params:{
                                    reportId:$scope.viewId
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        if(res.data == 1){
                                            layer.msg('合并成功',{times:500});
                                            layer.close(layerIndex);
                                        }else{
                                            var layerIndex = layer.confirm('\n' +
                                                '\n' +
                                                '当前还有未上报的区域，是否要合并？\n' +
                                                '\n' +
                                                '\n' +
                                                '重复合并会覆盖上一次的合并文件。', {
                                                btn: ['合并', '取消']
                                            }, function () {
                                                $ajaxhttp.myhttp({
                                                    url:apiPrefix + '/v1/msSentDynamis/judge',
                                                    method:'get',
                                                    params:{
                                                        reportId:$scope.viewId
                                                    },
                                                    callBack:function (res) {
                                                        if(res.resCode == 1){
                                                             layer.msg('合并成功',{times:500});
                                                             layer.close(layerIndex);

                                                        }else{
                                                            layer.msg('服务器异常，请稍后再试',{times:500});
                                                        }
                                                    }
                                                })
                                                layer.close(layerIndex);
                                            }, function () {

                                            });
                                        }
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500});
                                    }
                                }
                            })
                        }, function () {

                        });
                    }

                    //查看合并
                    $scope.viewMesh = function (){
                        window.open(apiPrefix + '/v1/msSentDynamis/pdfView?reportId=' + $scope.viewId )
                    }

                    //下载合并
                    $scope.download = function () {
                        window.open(apiPrefix + '/v1/msSentDynamis/combine?reportId=' + $scope.viewId )
                    }


                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }

                    //返回
                    $scope.goBack=function(){
                        history.back(-1);
                    }
                    //显示修改窗口
                    $scope.edit = function (module) {
                        $scope.assessory = [];
                        $scope.fileList = []
                        $('#myModal2').modal('show');
                        $scope.editId = module.id;
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentDynamis/detail',
                            method:'get',
                            params:{
                                id:module.id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.answerTitle = res.data.title;
                                    $scope.answerTime = res.data.deadline;
                                    $scope.nowRegion = res.data.region;
                                    $scope.patrolCondition = res.data.patrolCondition;
                                    $scope.meetingCondition = res.data.meetingCondition;
                                    $scope.problemSolvingCondition = res.data.problemSolvingCondition;
                                    $scope.otherCondition = res.data.otherCondition;

                                    if(res.data.fileList){
                                        res.data.fileList.map(function (item){
                                            $scope.fileList.push({
                                                fileName:item.downloadURL.substring(item.downloadURL.lastIndexOf('/')+1),
                                                fileUrl:item.downloadURL
                                            });
                                        })
                                        // console.log($scope.fileList);
                                    }

                                }
                            }
                        })

                    }
                    //保存/上报 答复
                    $scope.save = function (id) {
                        var params = {
                            title:$scope.answerTitle,
                            id: $scope.editId,
                            region:$scope.nowRegion,
                            deadline:$scope.answerTime,
                            patrolCondition:$scope.patrolCondition,
                            meetingCondition:$scope.meetingCondition,
                            problemSolvingCondition:$scope.problemSolvingCondition,
                            otherCondition:$scope.otherCondition,
                            accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        if($scope.patrolCondition && $scope.meetingCondition && $scope.problemSolvingCondition &&  $scope.otherCondition){
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSentDynamis/update',
                                method:'put',
                                params: params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('保存成功',{times:2000});
                                        $('#myModal2').modal('hide');
                                        $scope.assessory = [];
                                        getList();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }else{
                            layer.alert("输入框不能为空", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }

                    }

                    $scope.closeModal = function () {
                        $('#myModal2').modal('hide');
                    }



                    //删除附件
                    $scope.deleteFile = function (i) {
                        $scope.fileList.splice(i,1);
                        // console.log($scope.fileList);
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
                        $scope.fileList.map(function (item) {
                            $scope.assessory.push(item.fileUrl)
                        })
                        // console.log($scope.assessory);
                    }


                    // 上传文件
                    $scope.uploadFile = function (e) {

                        for (var i = 0; i < e.files.length; i++) {
                            var form = new FormData();
                            var file = e.files[i];
                            $scope.attandName = file.name;
                            form.append('files', file);
                            $http({
                                method: 'POST',
                                url: apiPrefix + '/v1/msSentReports/upload',
                                data: form,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }).success(function (res) {
                                if(res.resCode == 1){
                                    layer.msg('上传成功',{times:2000})
                                    $scope.attandUrl = res.data[0];
                                    $scope.fileList.push({
                                        fileName:$scope.attandName,
                                        fileUrl:$scope.attandUrl
                                    });
                                    // console.log($scope.fileList);
                                }else{
                                    layer.msg('上传失败',{times:2000})
                                }

                            }).error(function (data) {
                                console.log('upload fail');
                            })
                        }
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
                } ]);
})(window, angular);
