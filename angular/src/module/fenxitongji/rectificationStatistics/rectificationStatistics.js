(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'rectificationCtrl',
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
                function rectificationCtrl($localStorage, $scope,
                                               $location, $log, $q, $rootScope, $window,
                                               routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/rectify';
                    // var apiPrefix = 'http://10.0.9.133:7031/rectify';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.init = function () {
                        getRegion ()
                        getList ()
                    }

                    //搜索
                    $scope.search = function (){
                        getList();
                    }

                    //重置
                    $scope.reset = function (){
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.regionName = '';
                        $scope.isFinished = '';
                    }


                    //获取数据列表
                    function getList () {
                        var params = {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            state: $scope.isFinished,
                            statTime: $scope.statTime,
                            endTime:$scope.endTime,
                            region:$scope.regionName
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saAbarbeitung/list',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.dataList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }

                    //新增弹窗
                    $scope.add = function (id) {
                        $scope.id = id;
                        if($scope.id){//修改
                            getDetail ($scope.id);
                            $scope.Time1 = $scope.detailData.beginTime;
                            $scope.Time2 = $scope.detailData.replyTime;
                            $scope.Time3 = $scope.detailData.deadline;
                            $scope.state = $scope.detailData.state;
                            $scope.region = $scope.detailData.region;
                            $scope.notekeeper = $scope.detailData.notekeeper;
                            $scope.object = $scope.detailData.object;
                            $scope.duty = $scope.detailData.duty;
                            $scope.items = $scope.detailData.items;
                            $scope.remark = $scope.detailData.remark;
                            $scope.assessory = $scope.detailData.accessoryyuan ? $scope.detailData.accessoryyuan.split(',') : ''
                        }else{
                            $scope.assessory = [];
                        }
                        $('#myModal').modal('show');
                    }

                    //保存
                    $scope.save = function () {
                        var params = {
                            begin_time: $scope.Time1,
                            reply_time: $scope.Time2,
                            deadline: $scope.Time3,
                            state: $scope.state,
                            region: $scope.region,
                            notekeeper: $scope.notekeeper,
                            object: $scope.object,
                            duty: $scope.duty,
                            items: $scope.items,
                            remark: $scope.remark,
                            accessoryyuan: $scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        if($scope.Time1 && $scope.Time2 && $scope.Time3 && $scope.state && $scope.region && $scope.notekeeper && $scope.object && $scope.duty && $scope.items){

                            if($scope.id){//修改
                                params.id = $scope.id;
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/v1/saAbarbeitung/update',
                                    method: 'PUT',
                                    params: params,
                                    callBack: function (res) {
                                        if (res.resCode === 1) {
                                            getList();
                                            layer.msg('修改成功', {time:2000});
                                            $('#myModal').modal('hide')
                                        } else {
                                            layer.msg(res.resMsg, {time:2000});
                                        }
                                    }
                                })

                            }else{//新增
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/v1/saAbarbeitung/add',
                                    method: 'post',
                                    params: params,
                                    callBack: function (res) {
                                        if (res.resCode === 1) {
                                            getList();
                                            layer.msg('新增成功', {time:2000});
                                            clear();//创建成功后清空
                                            $('#myModal').modal('hide')
                                        } else {
                                            layer.msg(res.resMsg, {time:2000});
                                            clear();
                                        }
                                    }
                                })
                            }
                        }else{
                            layer.alert("请输入必填项", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                    }

                    function clear () {
                        $scope.assessory = [];
                        $scope.Time1 = '';
                        $scope.Time2 = '';
                        $scope.Time3 = '';
                        $scope.state = '';
                        $scope.region = '';
                        $scope.notekeeper = '';
                        $scope.object = '';
                        $scope.duty = '';
                        $scope.items = '';
                        $scope.remark = '';
                    }
                    //取消
                    $scope.cancel = function () {
                        clear();
                    }



                    //查看详情
                    $scope.view = function (id) {
                        $('#myModalView').modal('show');

                        getDetail (id);
                    }

                    function getDetail (id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saAbarbeitung/detail',
                            method: 'get',
                            params: {
                                id: id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1) {
                                    $scope.detailData = res.data;
                                    $scope.fileList = [];
                                    $scope.accessoryURL = [];
                                    if(res.data.accessoryyuan){
                                        var viewUrl = [] ,downUrl = [];
                                        viewUrl = res.data.accessory.split(',');
                                        downUrl = res.data.accessoryyuan.split(',');

                                        if(viewUrl.length == downUrl.length){
                                            viewUrl.map((item,i)=>{
                                                $scope.fileList.push({
                                                    name:downUrl[i].substring(downUrl[i].lastIndexOf('/')+1),
                                                    previewURL:item,
                                                    downloadURL:downUrl[i]
                                                })
                                            })
                                        }
                                    }
                                } else {
                                    layer.msg(res.resMsg,{time:1000});
                                }
                            }
                        })
                    }

                    // 删除
                    $scope.del = function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/saAbarbeitung/delete',
                                method: 'DELETE',
                                params: {
                                    id: id
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1) {
                                        getList();
                                        layer.msg('删除成功！', {time:1000});
                                    } else {
                                        layer.msg(res.resMsg,{time:1000});
                                    }
                                }
                            })
                            layer.close(layerIndex);
                        }, function () {

                        });
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
                                url: apiPrefix + '/v1/saAbarbeitung/upload',
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



                    // 开始月份
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.startTime = result;
                        $scope.$apply();
                    });




                    // 结束月份
                    var endTime = $('#endTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
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


                    $('#Time1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.Time1 = result;
                        $scope.$apply();
                    });

                    $('#Time2').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.Time2 = result;
                        $scope.$apply();
                    });

                    $('#Time3').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.Time3 = result;
                        $scope.$apply();
                    });





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
