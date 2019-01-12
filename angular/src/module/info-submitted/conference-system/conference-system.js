(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'conferenceCtrl',
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
                function conferenceCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    // var apiPrefix = 'http://10.0.9.203:8081' + '/messageSent';

                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $scope.author = $scope.userInfo.name;
                        $scope.isShow = true;
                        $scope.regionName = '';
                        $scope.startTime = '';
                        $scope.endTime = '';

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msMeetingCondition/userinfo',
                            method:'get',
                            callBack:function (res) {
                                $scope.num = res.data;
                            }
                        })


                        getList();
                    }

                    //搜索
                    $scope.searchData = function () {
                        getList();
                    }

                    //重置
                    $scope.reset = function () {
                        $scope.regionName = '';
                        $scope.startTime = '';
                        $scope.endTime = '';
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
                            url:apiPrefix + '/v1/msMeetingCondition/selectList',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                meetingTimeStart:$scope.startTime,
                                meetingTimeEnd:$scope.endTime,
                                region:$scope.regionName,
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

                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix
                            + '/v1/msMeetingCondition/createExcel?meetingTimeStart='
                            + $scope.startTime
                            + '&meetingTimeEnd='
                            + $scope.endTime
                            + '&region='
                            + $scope.regionName
                            + '&userId='
                            + $scope.userInfo.id
                            + '&regionId='
                            + $scope.userInfo.regionId
                        )
                    }

                    //关闭会议模态窗
                    $scope.closeModal = function () {
                        clear();
                        $('#myModal').modal('hide');
                    }

                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }

                    //清除表单
                    function clear () {
                        $scope.topic = '';
                        $scope.remark = '';
                        $scope.time = '';
                        $scope.content = '';
                        $scope.duty = '';
                        $scope.compereRole = '';
                        $scope.compereName = '';
                        $scope.category = '';
                    }

                    //显示发起周动态报送弹窗
                    $scope.add = function (id) {
                        $scope.assessory = [];
                        if(id != 1){
                            $scope.tag = '查看';
                            $scope.isShow = false;
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msMeetingCondition/detail',
                                method:'GET',
                                params:{
                                    id:id
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        $scope.viewData = res.data;
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
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })

                        }else{
                            $scope.tag = '新增';
                            $scope.isShow = true;
                        }
                        $('#myModal').modal('show')
                    }

                    //确认上报
                    $scope.submit =  function () {
                        if($scope.compereRole && $scope.compereName && $scope.time && $scope.topic && $scope.content){
                            var params = {
                                topic:$scope.topic,
                                meetingTime: $scope.time,
                                compereRole:$scope.compereRole,
                                compereName:$scope.compereName,
                                duty:$scope.duty,
                                category:$scope.category,
                                content:$scope.content,
                                remark:$scope.remark,
                                accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                            }
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msMeetingCondition/add',
                                method:'post',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('上报成功',{times:500})
                                        $('#myModal').modal('hide');
                                        getList();
                                        clear();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })

                        }else{
                            layer.alert("请输入必填项", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                    }
                    
                    //保存
                    $scope.save =  function () {
                        if($scope.compereRole && $scope.compereName && $scope.time && $scope.topic && $scope.content){
                            var params = {
                                topic:$scope.topic,
                                meetingTime: $scope.time,
                                compereRole:$scope.compereRole,
                                compereName:$scope.compereName,
                                duty:$scope.duty,
                                category:$scope.category,
                                content:$scope.content,
                                remark:$scope.remark,
                                accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                            }
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msMeetingCondition/addTwo',
                                method:'post',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('新增成功',{times:500})
                                        $('#myModal').modal('hide');
                                        getList();
                                        clear();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })

                        }else{
                            layer.alert("请输入必填项", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }

                    }

                    //上报状态
                    $scope.report =  function (id) {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msMeetingCondition/updateSentState',
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

                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msMeetingCondition/delete',
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
                                url: apiPrefix + '/v1/msMeetingCondition/upload',
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

                    // 会议时间
                    var time = $('#J-Time').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.time = result;
                        $scope.$apply();
                    });

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
                    
                    
                    function  validateRules() {
                        if (!$scope.compereRole) {
                            layer.alert("请输入主持角色", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.compereName) {
                            layer.alert("请输入姓名", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.time) {
                            layer.alert("请选择会议时间", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.topic) {
                            layer.alert("请输入会议议题", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.content) {
                            layer.alert("会议主要研究内容", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
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
                        //console.log(treeNode);
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
