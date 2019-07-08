(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'otherPoints',
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
                function otherPoints($localStorage, $scope,
                                       $location, $log, $q, $rootScope, $window,
                                       routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.133:7031' + '/analysis';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.fileUploadList = [];

                    //删除附件
                    $scope.deleteFile = function (i) {
                        $scope.fileUploadList.splice(i,1);
                        // console.log($scope.fileUploadList);
                    }


                    //扣分类型
                    $scope.typeList = [
                        {
                            id:1,
                            typeName:'河湖长履职不到位情况'
                        },
                        {
                            id:2,
                            typeName:'重点工作完成情况'
                        },
                        {
                            id:3,
                            typeName:'日常工作完成情况'
                        },
                    ];


                    $scope.init = function () {
                        getRegion ()
                        getType ()

                        $scope.reset();
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

                    //获取详细扣分项下拉列表
                    function getType (){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/saOtherScore/getOption',
                            method:'get',
                            callBack:function (res) {
                                $scope.typeDetailList = res.data;
                            }
                        })
                    }


                    //搜索
                    $scope.searchData = function () {
                        getList();
                    }

                    //重置
                    $scope.reset = function () {
                        $scope.regionName = '';
                        $scope.month = '';
                        $scope.type = '';
                        $scope.typeDetail = '';
                        getList();
                    }

                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/saOtherScore/list',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                choice:$scope.typeDetail,
                                type:$scope.type,
                                issue:$scope.month,
                                regionid:$scope.regionName,
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.moduleList = res.data.list;
                                    $scope.moduleList.map((item) =>{
                                        if(item.accessoryyuan){
                                            item.fileList = item.accessoryyuan.split(',');
                                        }
                                    })
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }

                    $scope.add = function (id,editId) {
                        $scope.id = id;
                        $scope.editId = editId;
                        $scope.assessory = [];
                        $scope.fileUploadList = []

                        $('#myModal').modal('show');

                        if (id == 2 && editId){//修改

                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/saOtherScore/detail',
                                method:'get',
                                params:{
                                    id:editId
                                },
                                callBack:function (res) {
                                    if(res.data){
                                        $scope.region = res.data.regionid;
                                        $scope.pointsDate = res.data.issue;
                                        $scope.addType = res.data.type;
                                        $scope.addTypeDetail = res.data.choice;
                                        $scope.score = res.data.score;
                                        $scope.recordman = res.data.recordman;
                                        $scope.proof = res.data.proof;
                                        $scope.remark = res.data.remark;
                                        $scope.accessoryyuan = res.data.accessoryyuan;
                                        $scope.fileList = [];

                                        if(res.data.accessoryyuan){
                                            var viewUrl = [] ,downUrl = [];
                                            viewUrl = res.data.accessoryyuan.split(',');
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
                                    }
                                }
                            })
                        }else{
                            clear ()
                        }

                    }

                    //清除表单
                    function clear () {
                        $scope.region = '';
                        $scope.remark = '';
                        $scope.addType = '';
                        $scope.addTypeDetail = '';
                        $scope.score = '';
                        $scope.assessory = [];
                        $scope.recordman = ''
                        $scope.proof = ''
                        $scope.pointsDate = ''
                    }


                    //新增
                    $scope.addSave = function () {
                        var params = {
                            regionid:$scope.region,
                            issue:$scope.pointsDate,
                            type:$scope.addType,
                            choice:$scope.addTypeDetail,
                            score:$scope.score,
                            recordman:$scope.recordman,
                            proof:$scope.proof,
                            remark:$scope.remark,
                            accessoryyuan:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        if($scope.id == 1){
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/saOtherScore/add',
                                method:'post',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("新增成功！");
                                        $('#myModal').modal('hide');
                                        clear();
                                        getList();
                                    }else{
                                        layer.msg("服务器异常，请稍后再试");
                                    }
                                }
                            })
                        }else{//修改
                            params.id = $scope.editId;
                            params.accessoryyuan = $scope.assessory ? $scope.assessory.join(',') : $scope.accessoryyuan
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/saOtherScore/update',
                                method:'put',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("修改成功！");
                                        $('#myModal').modal('hide');
                                        getList();
                                    }else{
                                        layer.msg("服务器异常，请稍后再试");
                                    }
                                }
                            })
                        }

                    }


                    //查看
                    $scope.view = function (id) {
                        $('#viewModal').modal('show');
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/saOtherScore/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.detail = res.data;
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
                                }
                            }
                        })
                    }


                    //查看  下载附件
                    $scope.downFile = function (path){
                        // window.open($scope.fileUrl + path);
                        window.open( moduleService.getServiceUrl() + '/fm' + path)
                    }

                    //关闭新增模态窗
                    $scope.closeModal = function () {
                        clear();
                        $('#myModal').modal('hide');
                    }


                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/saOtherScore/delete',
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
                                url: apiPrefix + '/v1/saAbarbeitung/upload',
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


                    // 扣分日期
                    $('#pointsDate').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.pointsDate = result;
                        $scope.$apply();
                    });

                    // 报道时间
                    $('#J-editTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.editTime = result;
                        $scope.$apply();
                    });

                    // 月份
                    $('#month').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.month = result;
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
