(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'darkInvestigationCtrl',
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
                function darkInvestigationCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl();
                    //var apiPrefix = 'http://10.0.9.133:7021';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $scope.createUser = $scope.userInfo.name;

                        getList();
                    }

                    //搜索
                    $scope.searchData = function () {
                        getList();
                    }

                    //重置
                    $scope.reset = function () {
                        $scope.issue = '';
                    }

                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/ScAnzhaScheme/list/',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                issue:$scope.issue
                            },
                            callBack:function (res) {
                                $scope.moduleList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }
                    //查看详情
                    $scope.view = function (id){
                        localStorage.setItem('id',id);
                        routeService.route('2-5-1',true);
                    }

                    //显示新增模态框
                    $scope.add = function () {
                        $scope.assessory = [];
                        $('#myModal').modal('show');
                    }
                    //保存新增方案
                    $scope.save = function () {
                        var params = {
                            title:$scope.title,
                            issue:$scope.Time,
                            createuser:$scope.createUser,
                            content:$scope.content,
                            assessoryyuan:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        if
                        (
                            $scope.title && $scope.Time && $scope.createUser && $scope.content
                        )
                        {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/ancha/v1/ScAnzhaScheme/add/',
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

                    //显示修改模态框
                    $scope.edit = function (id){
                        $('#myModaledit').modal('show');
                        $scope.assessory = [];
                        $scope.id = id;
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/ScAnzhaScheme/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.editTitle = res.data.title;
                                    $scope.editTime = res.data.issue;
                                    $scope.editUser = res.data.createuser;
                                    $scope.editContent = res.data.content;
                                    $scope.assessoryEdit = res.data.accessory
                                }
                            }
                        })
                    }

                    //修改
                    $scope.update = function (){
                        var params = {
                            id:$scope.id,
                            title:$scope.editTitle,
                            issue:$scope.editTime,
                            createuser:$scope.editUser,
                            content:$scope.editContent,
                            assessoryyuan:$scope.assessory ? $scope.assessory.join(',') : $scope.assessoryEdit
                        }
                        if
                        (
                            $scope.editTitle && $scope.editTime && $scope.editUser && $scope.editContent
                        )
                        {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/ancha/v1/ScAnzhaScheme/update/',
                                method:'put',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功',{times:2000});
                                        getList();
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


                    //清空新增表单
                    $scope.close = function () {
                        $('#myModal').modal('hide');
                        $scope.title = '';
                        $scope.Time = '';
                        $scope.content = '';
                    }


                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }


                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/ancha/v1/ScAnzhaScheme/delete/',
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
                                url: apiPrefix + '/ancha/v1/AnzhaReport/upload',
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


                    // 期号
                    $('#issue').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.issue = result;
                        $scope.$apply();
                    });

                    // 新增期号
                    $('#Time').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.Time = result;
                        $scope.$apply();
                    });

                    // 修改期号
                    $('#editTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.editTime = result;
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
