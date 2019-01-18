(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'workBriefListCtrl',
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
                function workBriefListCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    // var apiPrefix = 'http://10.0.9.110:7028' + '/messageSent';


                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';
                    var regionTreeUrl1 = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    var options = {
                        pdfOpenParams: {
                            pagemode: "thumbs",
                            navpanes: 0,
                            toolbar: 0,
                            statusbar: 0,
                            view: "FitV"
                        }
                    };
                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false,
                            'deselectAllText':'取消全选',
                            'selectAllText': '全选',
                        });
                        $scope.author = $scope.userInfo.name;
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkReports/userinfo',
                            method:'get',
                            callBack:function (res) {
                                $scope.num = res.data;
                            }
                        })
                        getRegion ()

                        getList();

                    }

                    //关闭模态框清空表单
                    $scope.closeModal = function () {
                        $scope.title = '';
                        $('.selectpicker').selectpicker('val', '');
                        $('.selectpicker').selectpicker('refresh');
                        $scope.startTime1 = '';
                        $scope.endTime1 = '';
                        $scope.searchTime = '';
                        $scope.briefDescription1 = '';
                    }

                    //搜索
                    $scope.searchData = function (){
                        getList ();
                    }

                    //重置搜索条件
                    $scope.reset = function () {
                        $scope.eventContent = '';
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.regionName = '';
                        $scope.status = '';
                        $scope.direction = '';
;                    }


                    // 获取数据列表
                    function getList () {

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkReports/selectList',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                title:$scope.eventContent,
                                sentTimeStart:$scope.startTime,
                                sentTimeEnd:$scope.endTime,
                                sentRegion:$scope.regionName,
                                sentState:$scope.status,
                                direction:$scope.direction,
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

                    // 表格排序
                    $scope.sort = function (id , name) {
                        $scope.column = name;
                        $scope.order = id;
                        getList ();
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
                                var select = $("#slpk");
                                for (var i = 0; i < $scope.regionList.length; i++) {
                                    select.append("<option value='"+$scope.regionList[i].areaName+"'>"
                                        + $scope.regionList[i].areaName + "</option>");
                                }
                                $('.selectpicker').selectpicker('val', '');
                                $('.selectpicker').selectpicker('refresh');
                            }
                        })
                    }

                    //显示发起周动态报送弹窗
                    $scope.add = function () {
                        $scope.assessory = [];
                        $('#myModal2').modal('show')
                    }

                    //发起信息报送
                    $scope.confirm = function () {
                        var params = {
                            title:$scope.title,
                            sentRegion:$scope.region1.join(','),
                            sentTimeStart:$scope.startTime1,
                            sentTimeEnd:$scope.endTime1,
                            deadline:$scope.searchTime,
                            briefDescription:$scope.briefDescription1,
                            accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkReports/add',
                            method:'post',
                            params:params,
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('发起成功',{times:2000});
                                    $('#myModal2').modal('hide');
                                    getList();
                                    clear();
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })

                    }

                    // 查看
                    $scope.view = function (id) {
                        localStorage.setItem('id',id);
                        routeService.route('8-1-1', true);
                        changeState(id);
                    }

                    //修改阅读状态
                    function changeState (id){
                        if($scope.num == 5){
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/MsSentReadStateController/update',
                                method:'put',
                                params:{
                                    sentId:id
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){

                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }
                    }

                    //清空新增工作简报表单
                    function clear () {
                        $scope.title = '';
                        $scope.startTime1 = '';
                        $scope.endTime1 = '';
                        $scope.searchTime = '';
                        $scope.briefDescription = '';
                        $scope.briefDescription1 = '';
                        $('.selectpicker').selectpicker('val', '');
                        $('.selectpicker').selectpicker('refresh');
                    }

                    $scope.cancel = function (){
                        clear();
                        $('#myModal').modal('hide');
                    }
                    //确认答复
                    $scope.save = function (id) {
                        var params = {
                            reportId:$scope.answerId,
                            briefDescription:$scope.briefDescription,
                            accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : '',
                        }
                        //console.log(params);
                        if(id == 1){//保存
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSentReports/add',
                                method:'post',
                                params: params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        getList();
                                        layer.msg('答复成功',{times:2000});
                                        $('#myModal').modal('hide');
                                        clear();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }else if (id == 2){//保存并上报
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSentReports/addAndSave',
                                method:'post',
                                params: params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        getList();
                                        layer.msg('保存并上报成功',{times:2000});
                                        $('#myModal').modal('hide');
                                        clear();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }

                    }


                    //上报
                    $scope.report =  function (id) {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentReports/updateSentState',
                            method:'put',
                            params:{
                                id:id,
                                sentState:1
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('上报成功',{times:500});
                                    getList();
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }

                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }
                    //展示答复模态框
                    $scope.answer =  function (module) {
                        $scope.assessory = [];
                        $scope.briefDescription = '';
                        $('#myModal').modal('show');
                        $scope.answerId = module.id;

                        changeState(module.id);

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWorkReports/detail',
                            method:'get',
                            params: {
                                id:module.id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.resDetail = res.data;

                                    if(res.data.fileList){
                                        $scope.accessoryURL = [];
                                        $scope.fileList = res.data.fileList;
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
                                    layer.msg('服务器异常，请稍后再试',{times:500})
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
                                url:apiPrefix + '/v1/msWorkReports/delete',
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

                    //查看附件
                    $scope.viewFile = function (path) {
                        window.open($scope.fileUrl + path)
                        //$('#myModal1').modal('show');
                        //PDFObject.embed(path, "#file", options);
                    }
                    //取消查看
                    $scope.cancel1 = function () {
                        $('#myModal1').modal('hide');
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
                                url: apiPrefix + '/v1/msSentReports/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                $scope.assessory.push(res.data[0]);
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
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
                    var endTime1 = $('#endTime1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.endTime1 = result;
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
                    endTime1.on('dp.change', function (e) {
                        startTime1.data('DateTimePicker').maxDate(e.date);
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
                        //console.log($scope.regionName)
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
