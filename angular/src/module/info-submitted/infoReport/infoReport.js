(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'infoReportCtrl',
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
                function infoReportCtrl($localStorage, $scope,
                                         $location, $log, $q, $rootScope, $window,
                                         routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    // var apiPrefix = 'http://10.0.9.194:7028' + '/messageSent';

                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkBulletin/getRegionAndName',
                            method:'get',
                            callBack:function (res) {
                               $scope.regionAndName = res.data;
                               $scope.name = res.data.name;
                               $scope.region = res.data.region;
                               if(res.data.region_grade == 1 || res.data.region_grade == 2){ // 1 2市级, 3 区级
                                   $scope.num = 2;//市级
                               }else{
                                   $scope.num = 5;//区级
                               }
                               // console.log($scope.regionAndName);
                            }
                        })

                        getList();
                        getAllRegion ();

                    }
                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkBulletin/getList',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                title:$scope.eventContent,
                                acceptState:$scope.acceptState,
                                sentState:$scope.sentState,
                                reportTime:$scope.startTime,
                                column:$scope.column ? $scope.column : '',
                                order:$scope.order ? $scope.order : ''
                            },
                            callBack:function (res) {
                                $scope.moduleList = res.data.list
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    // 表格排序
                    $scope.sort = function (id , name) {
                        $scope.column = name;
                        $scope.order = id;
                        getList ();
                    }

                    //搜索
                    $scope.searchData = function (){
                        getList();
                    }
                    //重置
                    $scope.reset = function (){
                        $scope.eventContent = '';
                        $scope.startTime = '';
                        $scope.acceptState = '';
                        $scope.sentState = '';

                    }

                    //发起工作简报报送
                    $scope.add = function () {
                        $scope.assessory = [];
                        $('#myModal').modal('show')
                    }

                    //保存 上报
                    $scope.save = function (id) {
                        var params = {
                            title:$scope.title,
                            region:$scope.region,
                            reportTime:$scope.reportTime,
                            initiator:$scope.name,
                            content:$scope.content,
                            accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        if(id == 1){//保存
                            params.isReport = 2;

                        }else if (id == 2){//上报
                            params.isReport = 1;
                        }
                        // console.log(params);
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkBulletin/addOReportInfo',
                            method:'post',
                            params:params,
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    if(id == 1){
                                        layer.msg('保存成功',{times:500});
                                    }else if (id == 2){
                                        layer.msg('上报成功',{times:500});
                                    }
                                    getList();
                                    clear();
                                    $('#myModal').modal('hide')
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //查看
                    $scope.view = function (id) {
                        $('#viewMyModal').modal('show');
                        getDetail(id);
                    }

                    //获取工作间报详情
                    function getDetail (id){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkBulletin/getDetailByID',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.detailData = res.data;
                                    $scope.editState = $scope.detailData.sentState;
                                    $scope.editTitle = $scope.detailData.title;
                                    $scope.editRegion = $scope.detailData.region;
                                    $scope.EditReportTime = $scope.detailData.reportTime;
                                    $scope.editInitiator = $scope.detailData.initiator;
                                    $scope.editContent = $scope.detailData.content;
                                    if(res.data.fileList){
                                        $scope.accessoryURL = [];
                                        $scope.detailData = res.data;
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
                    //修改
                    $scope.edit = function (id){
                        $scope.assessory = [];
                        $scope.id = id;
                        getDetail(id);
                        $('#editMyModal').modal('show');
                    }
                    $scope.update = function (){
                        var params = {
                            id:$scope.id,
                            title:$scope.editTitle,
                            region:$scope.editRegion,
                            reportTime:$scope.EditReportTime,
                            initiator:$scope.editInitiator,
                            content:$scope.editContent,
                            isReport:$scope.editState,
                            accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkBulletin/saveChanges',
                            method:'put',
                            params:params,
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('修改成功',{times:500});
                                    getList();
                                    $('#editMyModal').modal('hide')
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //上报
                    $scope.report = function (id){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkBulletin/reportInfo',
                            method:'put',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('报送成功',{times:500});
                                    getList();
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //是否采纳
                    $scope.adopt = function (state ,module) {
                        var params = {
                            id: module.id,
                            reportTime:module.reportTime
                        }
                        if(state == 1){//采纳
                            params.acceptState = 1;
                        }else if (state == 2){//不采纳
                            params.acceptState = 2;
                        }
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkBulletin/acceptInfo',
                            method:'put',
                            params:params,
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    if(res.data.returnCode == 1){
                                        if(state == 1){//采纳
                                            layer.msg(res.data.returnMsg,{times:500});
                                        }else if (state == 2){//不采纳
                                            layer.msg(res.data.returnMsg,{times:500});
                                        }
                                        getList();
                                    }else{
                                        layer.msg(res.data.returnMsg,{times:500});
                                    }
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //退回
                    $scope.sendBack = function (id){
                        $scope.backId = id;
                        $('#backMyModal').modal('show');
                    }

                    $scope.confirmBack = function () {
                        if (!$scope.reason) {
                            layer.alert("请输入退回原因", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                        var params = {
                            id:$scope.backId,
                            reason: $scope.reason
                        }
                        if($scope.reason){
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msWorkBulletin/returnBack',
                                method:'put',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('退回成功',{times:500});
                                        $('#backMyModal').modal('hide');
                                        $scope.reason = '';
                                        getList();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }
                    }

                    //查看退回历史
                    $scope.viewBack = function (id) {
                        $('#viewBackMyModal').modal('show')
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msReturnBack/getList',
                            method:'get',
                            params:{
                                objid:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                   $scope.backList = res.data
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    function clear () {
                        $scope.title = '';
                        $scope.reportTime = '';
                        $scope.content = '';
                        $scope.region = $scope.regionAndName.region;
                        $scope.name = $scope.regionAndName.name;
                    }

                    //关闭发起简报窗口
                    $scope.closeModal = function (){
                        clear();
                        $('#myModal').modal('hide');
                    }

                    //获取所有的区接口
                    function getAllRegion () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkBulletin/getRegionList',
                            method:'get',
                            callBack:function (res) {
                               $scope.regionList = res.data;
                            }
                        })
                    }

                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
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
                                url: apiPrefix + '/v1/msWorkBulletin/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                layer.msg("上传成功");
                                $scope.assessory.push(res.data[0]);
                                $('#problemFile').fileinput('clear');

                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
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

                    // reportTime
                    var reportTime = $('#reportTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.reportTime = result;
                        $scope.$apply();
                    });
                    var editReportTime = $('#EditReportTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.editReportTime = result;
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
