(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'coordinateSolveProblem',
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
                function coordinateSolveProblem($localStorage, $scope,
                                                $location, $log, $q, $rootScope, $window,
                                                routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://192.168.2.100:7031' + '/analysis';

                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';
                    var townListUrl = moduleService.getServiceUrl() + '/patrolMgr/chairmanOnline/v1/loadRegion';

                    $scope.fileUploadList = [];

                    //区域列表
                    $scope.regionList=[];
                    //村镇列表
                    $scope.townList=[];

                    $scope.startTime = '';
                    $scope.endTime = '';
                    $scope.problemList = [];

                    $scope.solutionTime = '';
                    $scope.coordinationDepartment = '';
                    $scope.countyCode = '';
                    $scope.townCode = '';
                    $scope.recorder = '';
                    $scope.captainName = '';
                    $scope.job = '';
                    $scope.problemSituation = '';
                    $scope.remark = '';

                    $scope.init = function () {
                        getList();
                        getRegion();
                    };

                    $scope.searchData = function () {
                        getList();
                    };

                    //重置
                    $scope.reset = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                    };

                    //新增
                    $scope.add = function () {
                        $scope.assessory = []
                        $scope.fileUploadList = [];

                        $('#addMyModal').modal('show')
                    };

                    //详情
                    $scope.detail=function(id){
                        getDetail(id);
                        $('#detailMyModal').modal('show');
                    };

                    //编辑
                    $scope.edit = function (id) {
                        $scope.assessory = []
                        $scope.editId = id;

                        getDetail(id);
                        $('#editMyModal').modal('show')
                    };

                    //关闭新增窗口
                    $scope.closeAddModal = function () {
                        clear();
                        $('#addMyModal').modal('hide')
                    };

                    //关闭详情窗口
                    $scope.closeDetailModal = function () {
                        clear();
                        $('#detailMyModal').modal('hide')
                    };

                    //关闭编辑窗口
                    $scope.closeEditModal = function () {
                        clear();
                        $('#editMyModal').modal('hide')
                    };

                    $scope.selectCounty=function () {
                        if($scope.countyCode){
                            getTownList();
                        }
                    };

                    function clear() {
                        $scope.solutionTime = '';
                        $scope.coordinationDepartment = '';
                        $scope.countyCode = '';
                        $scope.townCode = '';
                        $scope.recorder = '';
                        $scope.captainName = '';
                        $scope.job = '';
                        $scope.problemSituation = '';
                        $scope.remark = '';
                        $scope.assessory = [];
                    }

                    //新增
                    $scope.save = function () {
                        if (!$scope.solutionTime) {
                            layer.alert("请选择解决问题日期", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        } else if (!$scope.coordinationDepartment) {
                            layer.alert("请输入协调部门", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        } else if (!$scope.countyCode||!$scope.townCode) {
                            layer.alert("请选择解决问题区域", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        }else if (!$scope.captainName) {
                            layer.alert("请输入河湖长姓名", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        }else if(!$scope.problemSituation){
                            layer.alert("请输入问题解决情况", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        }else {
                            var params = {
                                solutionTime:$scope.solutionTime,
                                coordinationDepartment:$scope.coordinationDepartment ,
                                countyCode: $scope.countyCode ,
                                townCode:$scope.townCode ,
                                recorder:$scope.recorder ,
                                captainName:$scope.captainName ,
                                job:$scope.job ,
                                problemSituation:$scope.problemSituation ,
                                remark:$scope.remark ,
                                accessoryYuan: $scope.assessory ? $scope.assessory.join(',') : ''
                            };
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/saCoordinateSolution/add',
                                method: 'post',
                                params: params,
                                callBack: function (res) {
                                    if (res.resCode == 1) {
                                        layer.msg('新增成功', {times: 500});

                                        getList();
                                        clear();
                                        $('#addMyModal').modal('hide')
                                    } else {
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }

                    };

                    //编辑
                    $scope.update = function () {
                        if (!$scope.solutionTime) {
                            layer.alert("请选择解决问题日期", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        } else if (!$scope.coordinationDepartment) {
                            layer.alert("请输入协调部门", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        } else if (!$scope.countyCode||!$scope.townCode) {
                            layer.alert("请选择解决问题区域", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        }else if (!$scope.captainName) {
                            layer.alert("请输入河湖长姓名", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        }else if(!$scope.problemSituation){
                            layer.alert("请输入问题解决情况", {
                                skin: 'my-skin',
                                closeBtn: 1
                            });
                        }else {
                            var params = {
                                id:$scope.editId,
                                solutionTime:$scope.solutionTime,
                                coordinationDepartment:$scope.coordinationDepartment ,
                                countyCode: $scope.countyCode ,
                                townCode:$scope.townCode ,
                                recorder:$scope.recorder ,
                                captainName:$scope.captainName ,
                                job:$scope.job ,
                                problemSituation:$scope.problemSituation ,
                                remark:$scope.remark ,
                                accessoryYuan: $scope.assessory ? $scope.assessory.join(',') : $scope.accessoryDetail
                            };
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/saCoordinateSolution/update',
                                method: 'put',
                                params: params,
                                callBack: function (res) {
                                    if (res.resCode == 1) {
                                        layer.msg('编辑成功', {times: 500});
                                        getList();
                                        clear();
                                        $scope.fileUploadList = []

                                        $('#editMyModal').modal('hide')
                                    } else {
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }

                    }

                    //删除
                    $scope.delete = function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/saCoordinateSolution/delete',
                                method: 'delete',
                                params: {
                                    id: id
                                },
                                callBack: function (res) {
                                    if (res.resCode === 1) {
                                        layer.msg('删除成功', {times: 500});
                                        getList();
                                    } else {
                                        layer.msg('服务器异常，请稍后再试', {times: 500})
                                    }
                                }
                            })
                            layer.close(layerIndex);
                        }, function () {

                        });
                    };

                    //导出
                    $scope.download = function () {
                        window.location.href= apiPrefix
                            + '/v1/saCoordinateSolution/createExcel?startTime='
                            + $scope.startTime
                            + '&endTime='
                            + $scope.endTime;
                    };


                    //删除附件
                    $scope.deleteFile = function (i) {
                        $scope.fileUploadList.splice(i,1);
                        //console.log($scope.fileUploadList);
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
                                url: apiPrefix + '/v1/saCoordinateSolution/upload',
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
                                    // console.log($scope.fileUploadList);
                                }else{
                                    layer.msg('上传失败',{times:2000})
                                }

                            }).error(function (data) {
                                console.log('upload fail');
                            })
                        }
                    }





                    //查看附件
                    $scope.preview = function (path) {
                        window.open($scope.fileUrl + path)
                    };

                    function getList() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saCoordinateSolution/list',
                            method: 'get',
                            params: {
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                startTime: $scope.startTime,
                                endTime: $scope.endTime,
                            },
                            callBack: function (res) {
                                if (res.data) {
                                    $scope.problemList = res.data.list;
                                    $scope.problemList.map(function (item) {
                                        if(item.accessoryYuan){
                                            item.file = item.accessoryYuan.split(',')
                                        }
                                    })
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }



                    //获取工作间报详情
                    function getDetail(id) {
                        $scope.fileUploadList = []

                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saCoordinateSolution/detail',
                            method: 'get',
                            params: {
                                id: id
                            },
                            callBack: function (res) {
                                if (res.resCode === 1) {
                                    $scope.solutionTime = res.data.solutionTime;
                                    $scope.coordinationDepartment = res.data.coordinationDepartment;
                                    $scope.countyCode = res.data.countyCode;
                                    $scope.countyName = res.data.countyName;
                                    $scope.townCode = res.data.townCode;
                                    $scope.townName = res.data.townName;
                                    $scope.recorder = res.data.recorder;
                                    $scope.captainName = res.data.captainName;
                                    $scope.job = res.data.job;
                                    $scope.problemSituation = res.data.problemSituation;
                                    $scope.remark = res.data.remark;
                                    $scope.accessoryDetail = res.data.accessoryYuan;

                                    $scope.fileList = [];

                                    if(res.data.accessoryYuan){
                                        var viewUrl = [] ,downUrl = [];
                                        viewUrl = res.data.accessoryYuan.split(',');
                                        // downUrl = res.data.accessoryYuan.split(',');

                                        if(viewUrl){
                                            viewUrl.map((item,i)=>{
                                                $scope.fileList.push({
                                                    name:viewUrl[i].substring(viewUrl[i].lastIndexOf('/')+1),
                                                    previewURL:item,
                                                    downloadURL:viewUrl[i]
                                                })

                                                $scope.fileUploadList.push({
                                                    fileName:item.substring(item.lastIndexOf('/')+1),
                                                    fileUrl:item
                                                });
                                            })
                                        }
                                    }

                                    // console.log($scope.fileUploadList);


                                } else {
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }


                    //获取行政区域
                    function getRegion (){
                        $ajaxhttp.myhttp({
                            url:regionTreeUrl,
                            method:'get',
                            params:{
                                pageNum:-1,
                                pageSize:-1,
                                grade:3
                            },
                            callBack:function (res) {
                                $scope.regionList = res.data.list;
                            }
                        })
                    }

                    //获取乡镇街道
                    function getTownList() {
                        $ajaxhttp.myhttp({
                            url:townListUrl,
                            method:'get',
                            params:{
                                regionId:$scope.countyCode,
                            },
                            callBack:function (res) {
                                $scope.townList = res.data;
                                $scope.townList.forEach(function (item) {
                                    item.name=item.name.split('(')[0]
                                })
                            }
                        })
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
                    var solutionTime = $('#solutionTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.solutionTime = result;
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
                    function regionTreeList() {
                        $http({
                            method: 'get',
                            url: regionTreeUrl
                        }).success(function (res) {
                            // console.log(res)
                            if (res.resCode == 1) {
                                regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, res.data);
                            } else {
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
                    $scope.getSelectRegion = function () {
                        //console.log('我是区域树搜索...')
                    }

                    /**
                     * 关闭模态框
                     */
                    $scope.getModalOk = function () {
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
                }]);
})(window, angular);
