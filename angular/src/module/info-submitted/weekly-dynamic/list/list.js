(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'weeklyListCtrl',
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
                function weeklyListCtrl($localStorage, $scope,
                                          $location, $log, $q, $rootScope, $window,
                                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    // var apiPrefix = 'http://10.0.9.203:7028' + '/messageSent';

                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $scope.assessory = [];//存储上传附件路径
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false
                        });
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWeekDynamic/userinfo',
                            method:'get',
                            callBack:function (res) {
                                $scope.num = res.data;
                            }
                        })

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentReports/getRegion',
                            method:'get',
                            callBack:function (res) {
                                $scope.nowRegion = res.data;
                            }
                        })
                        $scope.weekList = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
                        $scope.author = $scope.userInfo.name;
                        getList();
                        getAllRegion ();
                    }
                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWeekDynamic/selectList',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                title:$scope.eventContent,
                                beginTime:$scope.startTime,
                                deadline:$scope.endTime,
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
                        ];
                        var select = $("#slpk");
                        for (var i = 0; i < $scope.regionList.length; i++) {
                            select.append("<option value='"+$scope.regionList[i].region+"'>"
                                + $scope.regionList[i].region + "</option>");
                        }
                        $('.selectpicker').selectpicker('val', '');
                        $('.selectpicker').selectpicker('refresh');
                    }

                    //显示发起周动态报送弹窗
                    $scope.add = function () {
                        $('#myModal').modal('show')
                    }

                    //设置定时报送
                    $scope.setTimeAdd = function () {
                        //$('#myModal1').modal('show')
                        var layerIndex = layer.confirm('确定启用设置定时周报吗？', {
                            btn: ['启用', '禁用']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/cron/start',
                                method:'post',
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg(res.data,{times:500});
                                        getList ();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                            layer.close(layerIndex);
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/cron/stop',
                                method:'post',
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg(res.data,{times:500});
                                        getList ();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                            layer.close(layerIndex);
                        });
                    }

                    // 查看
                    $scope.view = function (id) {
                        localStorage.setItem('viewId',id);
                        routeService.route('8-0-1', true);
                    }


                    //确认发起
                    $scope.submit =  function () {
                        var params = {
                            title:$scope.title,
                            sentRegion:$scope.region1.join(','),
                            sentTimeStart:$scope.startTime1,
                            sentTimeEnd:$scope.endTime1,
                            deadline:$scope.searchTime,
                        }
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msWeekDynamic/add',
                            method:'post',
                            params:params,
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('发起成功',{times:2000});
                                    getList();
                                    $scope.close();
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })

                    }


                    //关闭发起模态框
                    $scope.close = function (){
                        $('#myModal').modal('hide');
                        $scope.title = '';
                        $scope.startTime1 = '';
                        $scope.endTime1 = '';
                        $scope.searchTime = '';
                        $('.selectpicker').selectpicker('val', '');
                        $('.selectpicker').selectpicker('refresh');

                    }

                    //上报
                    $scope.report =  function (id) {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/msSentDynamis/updateSentState',
                            method:'put',
                            params: {
                                id:id,
                                sentState:1

                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('上报成功',{times:2000});
                                    getList();
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }

                    //答复
                    $scope.answer =  function (module) {
                        // layer.msg('答复成功',{times:500})
                        $scope.answerTitle = module.title;
                        $scope.answerTime = module.deadline;
                        $scope.answerId = module.id;
                        $scope.replyState = module.replyState;
                        $('#myModal2').modal('show');
                    }
                    function clear () {
                        $scope.patrolCondition = '';
                        $scope.meetingCondition = '';
                        $scope.problemSolvingCondition = '';
                        $scope.otherCondition = '';
                    }
                    //保存/上报 答复
                    $scope.save = function (id) {
                        // if (!$scope.patrolCondition) {
                        //     layer.alert("请输入河长湖长巡河巡湖情况", {
                        //         skin: 'my-skin',
                        //         closeBtn: 1,
                        //         anim: 3
                        //     });
                        // }else if ($scope.meetingCondition) {
                        //     layer.alert("请输入会议情况", {
                        //         skin: 'my-skin',
                        //         closeBtn: 1,
                        //         anim: 3
                        //     });
                        // }if ($scope.problemSolvingCondition) {
                        //     layer.alert("请输入河长协调解决水环境问题情况", {
                        //         skin: 'my-skin',
                        //         closeBtn: 1,
                        //         anim: 3
                        //     });
                        // }
                        var params = {
                            title:$scope.answerTitle,
                            weekId: $scope.answerId,
                            region:$scope.nowRegion,
                            deadline:$scope.answerTime,
                            patrolCondition:$scope.patrolCondition,
                            meetingCondition:$scope.meetingCondition,
                            problemSolvingCondition:$scope.problemSolvingCondition,
                            otherCondition:$scope.otherCondition,
                            accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        if(id == 1){
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSentDynamis/add',
                                method:'post',
                                params: params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('保存成功',{times:2000});
                                        $scope.saveId = res.data.id;
                                        $('#myModal2').modal('hide');
                                        getList();
                                        clear();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }else if(id == 2){
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msSentDynamis/addAndSave',
                                method:'post',
                                params: params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('上报成功',{times:2000});
                                        $('#myModal2').modal('hide');
                                        getList();
                                        clear();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }

                    }

                    $scope.closeModal = function () {
                        $('#myModal2').modal('hide');
                        clear();
                    }


                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/msWeekDynamic/delete',
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
                                url: apiPrefix + '/v1/msSentReports/upload',
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

                    //定时发起时间
                    $('#J-searchTime1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.searchTime1 = result;
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
