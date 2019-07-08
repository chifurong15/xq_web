(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'infoPublicity',
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
                function infoPublicity($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.158:7031' + '/analysis';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';


                    $scope.fileUploadList = [];


                    $scope.init = function () {
                        getRegion ()

                        $scope.reset();
                    }


                    //删除附件
                    $scope.deleteFile = function (i) {
                        $scope.fileUploadList.splice(i,1);
                        // console.log($scope.fileUploadList);
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

                    //搜索
                    $scope.searchData = function () {
                        getList();
                    }

                    //重置
                    $scope.reset = function () {
                        $scope.regionName = '';
                        $scope.startTime = '';
                        $scope.endTime = '';
                        getList();
                    }

                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/saInfoPublicity/list',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                startTime:$scope.startTime,
                                endTime:$scope.endTime,
                                region:$scope.regionName,
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.moduleList = res.data.list
                                    $scope.moduleList.map(function (item) {
                                        if(item.accessory){
                                            item.file = item.accessory.split(',')
                                        }
                                    })
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }

                    $scope.add = function () {
                        $scope.assessory = [];
                        $('#myModal').modal('show');

                    }

                    //新增
                    $scope.addSave = function () {
                        var params = {
                            replyTime:$scope.time,
                            isNewMedia:$scope.isNewMedia,
                            region:$scope.region,
                            infoReportMedia:$scope.infoReportMedia,
                            infoReportContent:$scope.infoReportContent,
                            remark:$scope.remark,
                            accessory:$scope.assessory ? $scope.assessory.join(',') : ''

                        }
                        // console.log(params);

                        if($scope.time && $scope.isNewMedia && $scope.infoReportMedia && $scope.infoReportContent && $scope.region){

                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/saInfoPublicity/add',
                                method:'post',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("新增成功！");
                                        $('#myModal').modal('hide');
                                        $scope.fileUploadList = [];
                                        clear();
                                        getList();
                                    }else{
                                        layer.msg("服务器异常，请稍后再试");
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

                    //修改
                    $scope.edit = function (id) {
                        $scope.id = id
                        $scope.assessory = [];
                        $scope.fileUploadList = []

                        $('#myModaledit').modal('show');
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/saInfoPublicity/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.detail = res.data;
                                    $scope.editTime = res.data.replyTime;
                                    $scope.editRegion = res.data.region;
                                    $scope.isNewMediaEdit = res.data.isNewMedia;
                                    $scope.infoReportMediaEdit = res.data.infoReportMedia;
                                    $scope.infoReportContentEdit = res.data.infoReportContent;
                                    $scope.remarkEdit = res.data.remark;
                                    $scope.accessoryDetail = res.data.accessory;

                                    if(res.data.accessory){
                                        var downUrl = [];
                                        downUrl = res.data.accessory.split(',');
                                        downUrl.map(function (item,i) {
                                            $scope.fileUploadList.push({
                                                fileName:item.substring(item.lastIndexOf('/')+1),
                                                fileUrl:item
                                            });
                                        })

                                    }

                                    // console.log($scope.fileUploadList);

                                }
                            }
                        })
                    }

                    //修改保存
                    $scope.updateSave = function (){
                        var params = {
                            id:$scope.id,
                            replyTime:$scope.editTime,
                            isNewMedia:$scope.isNewMediaEdit,
                            region:$scope.editRegion,
                            infoReportMedia:$scope.infoReportMediaEdit,
                            infoReportContent:$scope.infoReportContentEdit,
                            remark:$scope.remarkEdit,
                            accessory:$scope.assessory ? $scope.assessory.join(',') : $scope.accessoryDetail
                        }
                        // console.log(params);
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/saInfoPublicity/update',
                            method:'put',
                            params:params,
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg("修改成功！");
                                    $('#myModaledit').modal('hide');
                                    clear();
                                    getList();
                                    $scope.fileUploadList = [];
                                }else{
                                    layer.msg("服务器异常，请稍后再试");
                                }
                            }
                        })

                    }


                    //查看
                    $scope.view = function (id) {
                        $('#viewModal').modal('show');
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/saInfoPublicity/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.detail = res.data;
                                    $scope.fileList = [];
                                    $scope.accessoryURL = [];
                                    if(res.data.accessory){

                                        var viewUrl = [] ,downUrl = [];
                                        viewUrl = res.data.accessory.split(',');
                                        // downUrl = res.data.accessoryYuan.split(',');

                                        if(viewUrl){
                                            viewUrl.map((item,i)=>{
                                                $scope.fileList.push({
                                                    name:viewUrl[i].substring(viewUrl[i].lastIndexOf('/')+1),
                                                    previewURL:item,
                                                    downloadURL:viewUrl[i]
                                                })
                                            })
                                        }
                                    }
                                }
                            }
                        })
                    }

                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix
                            + '/v1/saInfoPublicity/createExcel?startTime='
                            + $scope.startTime
                            + '&endTime='
                            + $scope.endTime
                            + '&region='
                            + $scope.regionName
                        )
                    }

                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }

                    //关闭新增模态窗
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
                        $scope.time = '';
                        $scope.remark = '';
                        $scope.isNewMedia = '';
                        $scope.infoReportContent = '';
                        $scope.infoReportMedia = '';
                        $scope.assessory = [];
                        $scope.region = ''
                    }


                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/saInfoPublicity/delete',
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
                                url: apiPrefix + '/v1/saInfoPublicity/upload',
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


                    // 报道时间
                    $('#J-Time').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.time = result;
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
