(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'notificationCtrl',
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
                function notificationCtrl($localStorage, $scope,
                                     $location, $log, $q, $rootScope, $window,
                                     routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl();

                    //var apiPrefix = 'http://10.0.9.194:8066';



                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';
                    var sentUnitUrl = moduleService.getServiceUrl() + '/information/v1/dictionary/list';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {

                        $scope.createPerson = $scope.userInfo.name;

                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false
                        });
                        $scope.isShow = true;
                        $scope.isNeedReply = 2;//默认不答复

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inform/v1/informReport/getRegionAndName',
                            method:'get',
                            callBack:function (res) {
                                if(res.data.region_grade == 1 || res.data.region_grade == 2){ // 1 2市级, 3 区级
                                    $scope.num = 2;//市级
                                }else{
                                    $scope.num = 5;//区级
                                }
                                // console.log($scope.regionAndName);
                            }
                        })

                        getList();

                        getRegion ();
                        getUnit ();

                    }
                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inform/v1/informReport/list',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                title:$scope.title,
                                createDate:$scope.startTime,
                                informType:$scope.informType,
                                readStatus:$scope.readStatus
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
                        $scope.title = '';
                        $scope.innformType = '';
                        $scope.readStatus = '';
                    }

                    //新增弹窗
                    $scope.add = function () {
                        $scope.assessory = [];
                        $('#myModal').modal('show');
                    }

                    $scope.getChange = function(type){
                        if(type == 600101){
                            $scope.isShow = false;
                        }else{
                            $scope.isShow = true;
                        }
                    }

                    //保存
                    $scope.save = function () {
                        // $('#myModal').modal('hide');
                        // $scope.close();
                        var params = {
                            informType: $scope.type,
                            isreply: $scope.isNeedReply,
                            title: $scope.supervisingTitle,
                            createDate: $scope.Time,
                            createPerson: $scope.createPerson,
                            content: $scope.content,
                            acceptArea: $scope.acceptArea ? $scope.acceptArea.join(',') : '',
                            units: $scope.units ? $scope.units.join(',') : '',
                            accessoryURL: $scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        if
                        (
                            $scope.type && $scope.supervisingTitle && $scope.Time && $scope.createPerson && $scope.content
                            && $scope.acceptArea && $scope.units
                        )
                        {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/inform/v1/informReport/add',
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
                        $scope.type = '';
                        $scope.isNeedReply = '';
                        $scope.supervisingTitle = '';
                        $scope.Time = '';
                        $scope.content = '';
                        $scope.assessory = [];
                        $('.selectpicker').selectpicker('val', []);
                        $('.selectpicker').selectpicker('refresh');

                        $('.selectpicker1').selectpicker('val', []);
                        $('.selectpicker1').selectpicker('refresh');
                    }

                    //查看通知通报详情
                    $scope.view = function (module){
                        localStorage.setItem('module',JSON.stringify(module));
                        routeService.route('2-9-1', true);
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inform/v1/informAccept/updateReadStatus',
                            method: 'put',
                            params:{
                                id:module.id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){

                                }else{
                                    layer.msg(res.resMsg, {time:2000});
                                }
                            }
                        })

                    }

                    //查看、答复
                    $scope.answer = function (module) {
                        localStorage.setItem('module',JSON.stringify(module));
                        routeService.route('2-9-2', true);

                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inform/v1/informAccept/updateReadStatus',
                            method: 'put',
                            params:{
                                id:module.id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){

                                }else{
                                    layer.msg(res.resMsg, {time:2000});
                                }
                            }
                        })
                    }



                    //删除通知通报
                    $scope.delete = function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/inform/v1/informReport/delete',
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
                                url: apiPrefix + '/inform/v1/informReport/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                layer.msg("上传成功");
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
                    var Time = $('#Time').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.Time = result;
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
