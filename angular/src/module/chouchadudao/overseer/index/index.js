(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'overseerCtrl',
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
                function overseerCtrl($localStorage, $scope,
                                               $location, $log, $q, $rootScope, $window,
                                               routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl();
                    // var apiPrefix = 'http://10.0.9.110:7025';

                    //var apiPrefix = 'http://10.0.9.203:8080';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';
                    var sentUnitUrl = moduleService.getServiceUrl() + '/information/v1/dictionary/list';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false,
                            deselectAllText:'取消全选',
                            selectAllText: '全选',
                        });

                        $scope.createUser = $scope.userInfo.name;

                        getRegion ();
                        getUnit ();

                        getList();
                    }

                    $scope.fileUploadList = [];

                    //删除附件
                    $scope.deleteFile = function (i) {
                        $scope.fileUploadList.splice(i,1);
                        // console.log($scope.fileUploadList);
                    }

                    // 表格排序
                    $scope.sort = function (id , name) {
                        $scope.column = name;
                        $scope.order = id;
                        getList ();
                    }

                    //搜索
                    $scope.searchData = function () {
                        getList();
                    }

                    //重置
                    $scope.reset = function () {
                        $scope.startTime = '';
                    }

                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/Inspection/selectList',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                issue:$scope.startTime,
                                column:$scope.column ? $scope.column : '',
                                order:$scope.order ? $scope.order : ''
                            },
                            callBack:function (res) {
                                $scope.moduleList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    //查看
                    $scope.view = function (id) {
                        localStorage.setItem('id',id);
                        routeService.route('2-10-1',true);
                    }

                    //显示新增模态框
                    $scope.add = function () {
                        $scope.assessory = [];
                        $scope.fileUploadList = [];

                        $('#myModal').modal('show');
                    }
                    //显示修改模态框
                    $scope.edit = function (id){
                        $('#myModaledit').modal('show');
                        $scope.assessory = [];
                        $scope.id = id;
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/Inspection/detail',
                            method:'get',
                            params:{
                              id:id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.title = res.data.title;
                                    $scope.Time1 = res.data.issue;
                                    $scope.renumber = res.data.renumber;
                                    $scope.printTime1 = res.data.printDate;
                                    $scope.createUser = res.data.initiator;
                                    $scope.title = res.data.title;
                                    $scope.content = res.data.content;
                                    $scope.sentRegion = res.data.regionList;
                                    $scope.sentUnit = res.data.unitList;
                                    $scope.assessoryEdit = res.data.accessory


                                    if(res.data.accessory){
                                        var viewUrl = [] ;
                                        viewUrl = res.data.accessory.split(',');

                                        if(viewUrl){
                                            viewUrl.map((item,i)=>{
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
                    }
                    //修改
                    $scope.update = function (){
                        var params = {
                            id:$scope.id,
                            title:$scope.title,
                            issue:$scope.Time,
                            renumber:$scope.renumber,
                            printDate:$scope.printTime,
                            initiator:$scope.createUser,
                            content:$scope.content,
                            accessory:$scope.assessory ? $scope.assessory.join(',') : $scope.assessoryEdit
                        }
                        if
                        (
                            $scope.title && $scope.Time1 && $scope.renumber && $scope.printTime1 && $scope.createUser
                            && $scope.content
                        )
                        {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/inspection/v1/Inspection/update',
                                method:'put',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功',{times:2000});
                                        getList();
                                        $scope.fileUploadList = [];

                                        $('#myModaledit').modal('hide');
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }else{
                            layer.alert("输入的信息不全", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                    }

                    //关闭修改窗口
                    $scope.updateClose = function () {
                        $('#myModaledit').modal('hide');
                    }

                    //保存新增方案
                    $scope.save = function () {
                        var params = {
                            title:$scope.title,
                            issue:$scope.Time,
                            renumber:$scope.renumber,
                            printDate:$scope.printTime,
                            initiator:$scope.createUser,
                            content:$scope.content,
                            sentRegion: $scope.sentRegion ? $scope.sentRegion.join(',') : '',
                            sentUnit:$scope.sentUnit ? $scope.sentUnit.join(',') : '',
                            accessory:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        if
                        (
                            $scope.title && $scope.Time && $scope.renumber && $scope.printTime && $scope.createUser
                            && $scope.sentRegion && $scope.sentUnit && $scope.content
                        )
                        {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/inspection/v1/Inspection/add',
                                method:'post',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('新增成功',{times:2000});
                                        getList();
                                        $scope.close();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })

                        }else{
                            layer.alert("输入的信息不全", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }

                    }

                    //清空新增表单
                    $scope.close = function () {
                        $('#myModal').modal('hide');
                        $scope.fileUploadList = [];

                        $scope.title = '';
                        $scope.Time = '';
                        $scope.renumber = '';
                        $scope.printTime = '';
                        $scope.content = '';
                        $('.selectpicker').selectpicker('val', []);
                        $('.selectpicker').selectpicker('refresh');

                        $('.selectpicker1').selectpicker('val', []);
                        $('.selectpicker1').selectpicker('refresh');
                    }

                    //删除督查方案
                    $scope.delete = function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/inspection/v1/Inspection/delete',
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

                    //获取下发区域
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
                                var select = $("#slpk");
                                for (var i = 0; i < $scope.regionList.length; i++) {
                                    select.append("<option value='"+$scope.regionList[i].areaCode+"'>"
                                        + $scope.regionList[i].areaName + "</option>");
                                }
                                $('.selectpicker').selectpicker('val', '');
                                $('.selectpicker').selectpicker('refresh');
                            }
                        })
                    }

                    //获取下发单位
                    function getUnit () {
                        $ajaxhttp.myhttp({
                            url:sentUnitUrl,
                            method:'get',
                            params:{
                                pid:6000,
                                pageNum:-1,
                                pageSize:-1
                            },
                            callBack:function (res) {
                                $scope.unitList = res.data.list;
                                var select = $("#slpk1");
                                for (var i = 0; i < $scope.unitList.length; i++) {
                                    select.append("<option value='"+$scope.unitList[i].typeValue+"'>"
                                        + $scope.unitList[i].typeName + "</option>");
                                }
                                $('.selectpicker1').selectpicker('val', '');
                                $('.selectpicker1').selectpicker('refresh');
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
                                url: apiPrefix + '/inspection/v1/Inspection/upload',
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



                    // 期号
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime = result;
                        $scope.$apply();
                    });

                    // 新增期号
                    var Time = $('#Time').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.Time = result;
                        $scope.$apply();
                    });

                    // 印发日期
                    var printTime = $('#printTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.printTime = result;
                        $scope.$apply();
                    });

                    // 期号
                    var Time1 = $('#Time1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.Time1 = result;
                        $scope.$apply();
                    });

                    // 日期
                    var printTime1 = $('#printTime1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.printTime1 = result;
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
