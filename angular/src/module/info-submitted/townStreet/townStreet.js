(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'townStreetCtrl',
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
                function townStreetCtrl($localStorage, $scope,
                                          $location, $log, $q, $rootScope, $window,
                                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    //var apiPrefix = 'http://10.0.9.114:8080' + '/messageSent';


                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;


                    $scope.fileUploadList = [];

                    //删除附件
                    $scope.deleteFile = function (i) {
                        $scope.fileUploadList.splice(i,1);
                        console.log($scope.fileUploadList);
                    }


                    $scope.init = function () {
                        // $scope.num = 5;
                        $scope.author = $scope.userInfo.name;
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.regionName = '';
                        $scope.status = '';
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msTownstreetCondition/userinfo',
                            method:'get',
                            callBack:function (res) {
                                $scope.num = res.data;
                                getList();
                            }
                        })
                    }

                    // 表格排序
                    $scope.sort = function (id , name) {
                        $scope.column = name;
                        $scope.order = id;
                        getList ();
                    }
                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msTownstreetCondition/selectList',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                sentTimeStart:$scope.startTime,
                                sentTimeEnd:$scope.endTime,
                                region:$scope.regionName,
                                informationSystem:$scope.status,
                                column:$scope.column ? $scope.column : '',
                                order:$scope.order ? $scope.order : ''
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.moduleList = res.data.list
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
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

                    //获取详情
                    function getDetail (id){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msTownstreetCondition/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.detailData = res.data;
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
                        $scope.informationSystem = '';
                        $scope.executeCircumstance = '';
                        $scope.remark = '';
                    }

                    //新增 保存 上报
                    $scope.save = function (id){
                        if($scope.informationSystem && $scope.executeCircumstance){
                            var params = {
                                informationSystem:$scope.informationSystem,
                                executeCircumstance:$scope.executeCircumstance,
                                remark:$scope.remark,
                                accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                            }
                            // console.log(params);
                            if(id == 1){//保存
                                $ajaxhttp.myhttp({
                                    url:apiPrefix + '/v1/msTownstreetCondition/addTwo',
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
                                    url:apiPrefix + '/v1/msTownstreetCondition/add',
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
                        }else if (!$scope.informationSystem) {
                            layer.alert("请选择制度类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.executeCircumstance) {
                            layer.alert("请输入执行情况", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }

                    }

                    //关闭新增窗口
                    $scope.closeAddModal = function (){
                        clear();
                        $('#addMyModal').modal('hide')
                    }

                    //上报
                    $scope.report = function (id){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msTownstreetCondition/updateSentState',
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
                                url:apiPrefix + '/v1/msTownstreetCondition/delete',
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
                            + '/v1/msTownstreetCondition/createExcel?sentTimeStart='
                            + $scope.startTime
                            + '&sentTimeEnd='
                            + $scope.endTime
                            + '&region='
                            + $scope.regionName
                            + '&informationSystem='
                            + $scope.status
                            + '&userId='
                            + $scope.userInfo.id
                            + '&regionId='
                            + $scope.userInfo.regionId
                        )
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
                        $scope.fileUploadList.map(function (item) {
                            $scope.assessory.push(item.fileUrl)
                        })
                        console.log($scope.assessory);
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
                                url: apiPrefix + '/v1/msTownstreetCondition/upload',
                                data: form,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }).success(function (res) {
                                if(res.resCode == 1){
                                    layer.msg('上传成功',{times:2000})
                                    $scope.attandUrl = res.data[0];
                                    $scope.fileUploadList.push({
                                        fileName:$scope.attandName,
                                        fileUrl:$scope.attandUrl
                                    });
                                    console.log($scope.fileUploadList);
                                }else{
                                    layer.msg('上传失败',{times:2000})
                                }

                            }).error(function (data) {
                                console.log('upload fail');
                            })
                        }
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
