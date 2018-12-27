(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'accountCtrl',
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
                function accountCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/scstandingbook';
                    //var apiPrefix = 'http://10.0.9.133:7029' + '/scstandingbook';


                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false
                        });

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/scstandingbook/userinfo',
                            method:'get',
                            callBack:function (res) {
                               $scope.num = res.data;
                            }
                        })

                        getList();
                        getObject ();

                    }
                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/scstandingbook/list',
                            method:'get',
                            params:{
                                userid:$scope.userInfo.id,
                                name:$scope.name,
                                statTime:$scope.startTime,
                                endTime:$scope.endTime,
                                accountabilitytype:$scope.accountabilitytype,
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage
                            },
                            callBack:function (res) {
                                $scope.moduleList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    //搜索
                    $scope.searchData = function (){
                        getList();
                    }

                    //重置
                    $scope.reset = function (){
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.name = '';
                        $scope.accountabilitytype = '';
                    }

                    //新增弹窗
                    $scope.add = function () {
                        $scope.assessory = [];
                        $('#myModal').modal('show');
                    }

                    //保存
                    $scope.save = function (){
                        var params = {
                            turnarounddate:$scope.Time,
                            accountabilitytype:$scope.type,
                            objectid:$scope.accoutObjectid,
                            objectname:$scope.regionNameList ? $scope.regionNameList.join(',') : '',
                            name:$scope.userName,
                            duty:$scope.accountDuty,
                            recordmen:$scope.recordMan,
                            content:$scope.accountContent,
                            remark:$scope.accountRemark,
                            assessoryyuan:$scope.assessory ? $scope.assessory.join(',') : ''
                        }

                        if
                        (
                            $scope.Time && $scope.type && $scope.accoutObjectid && $scope.userName && $scope.accountDuty
                            && $scope.recordMan && $scope.accountContent && $scope.accountRemark
                        )
                        {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/scstandingbook/add',
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

                    //关闭并清空新增窗口
                    $scope.close = function () {
                        $('#myModal').modal('hide');
                        $scope.Time = '';
                        $scope.type = '';
                        $scope.accoutObjectid = '';
                        $scope.userName = '';
                        $scope.accountDuty = '';
                        $scope.recordMan = '';
                        $scope.accountContent = '';
                        $scope.accountRemark = '';
                        $scope.assessory = [];
                    }

                    //查看问责详情
                    $scope.view = function (id){
                        $('#myModalView').modal('show');
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/scstandingbook/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.detailData = res.data;
                                    $scope.fileList = [];
                                    $scope.accessoryURL = [];
                                    if(res.data.assessoryyuan){
                                        var viewUrl = [] ,downUrl = [];
                                        viewUrl = res.data.assessory.split(',');
                                        downUrl = res.data.assessoryyuan.split(',');

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
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }

                    //删除问责
                    $scope.delete = function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/scstandingbook/delete',
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

                    //获取问责对象列表
                    function getObject (){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/scstandingbook/regionlist',
                            method:'get',
                            params:{
                                regionid:$scope.userInfo.regionId
                            },
                            callBack:function (res) {
                                $scope.regionList = res.data;
                                // var select = $("#slpk");
                                // for (var i = 0; i < $scope.regionList.length; i++) {
                                //     select.append("<option value='"+$scope.regionList[i].regionId+"'>"
                                //         + $scope.regionList[i].regionName + "</option>");
                                // }
                                // $('.selectpicker').selectpicker('val', '');
                                // $('.selectpicker').selectpicker('refresh');
                            }
                        })
                    }

                    $scope.getChange = function (objectid) {
                        $scope.regionNmeList = [];
                        objectid.map(function (item){
                            $scope.regionList.map(function(val,index){
                                if(item == val.regionId){
                                    $scope.regionNameList.push(val.regionName)
                                }
                            })
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
                                url: apiPrefix + '/v1/scstandingbook/upload',
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
                    // 问责日期
                    $('#Time').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.Time = result;
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
