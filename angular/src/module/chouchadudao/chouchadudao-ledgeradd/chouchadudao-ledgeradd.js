(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'anchaanfangLedgerAddCtrl',
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
                function anchaanfangLedgerAddCtrl($localStorage, $scope,
                                                  $location, $log, $q, $rootScope, $window,
                                                  routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/ancha';

                    $scope.init = function () {

                        var bulletin = globalParam.getter().bulletin || {};

                        $scope.id = bulletin.id;

                        if( $scope.id){
                            $http({
                                url: apiPrefix + '/v1/AnzhaStandingBook/detail',
                                method: 'get',
                                params:{
                                    id:$scope.id
                                }
                            }).success(function(data){
                                if(data.resCode == 1){
                                    setData(data.data);
                                    //console.log('得分列表',data.data)
                                }
                            })
                        }

                    }

                    //还原编辑数据
                    function setData (data) {
                        $scope.name = data.name;
                        $scope.duty = data.duty;
                        $scope.searchTime = data.turnarounddate;
                        $scope.object = data.object;
                        $scope.content = data.content;
                        $scope.accountabilitytype = data.accountabilitytype;
                        $scope.remark = data.remark;
                        $scope.accessory = data.accessory;
                    }

                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM-DD hh:mm:ss',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime = new moment(c.date).format('YYYY-MM-DD hh:mm:ss');
                        $scope.$apply();
                    });

                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function(){
                        $('#coverModal').modal('show');
                    }

                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function(){
                        $('#coverModal').modal('hide');
                        var formFile = new FormData();
                        var fileObj = document.querySelector('input[type=file]').files[0];
                        $scope.fileName = fileObj.name;
                        formFile.append("files", fileObj); //加入文件对象
                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/AnzhaReport/upload',
                                data:formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            $scope.accessory = res.data[0];

                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }


                    //返回
                    $scope.goBack=function(){
                        history.back(-1);
                    }

                    // 保存
                    $scope.submit = function() {

						if (!$scope.name) {
                         layer.alert("请输入添加人姓名", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.duty) {
                            layer.alert("请输入职务", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.searchTime) {
                         layer.alert("请选择约谈时间", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.object) {
                         layer.alert("请输入约谈对象", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.content) {
                         layer.alert("请输入约谈内容", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.accountabilitytype) {
                            layer.alert("请输入问责类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.remark) {
                            layer.alert("请输入备注", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }

                        // 新增台账
                        var params = {
                            bulletinid: localStorage.getItem('id'),
                            name: $scope.name,
                            duty: $scope.duty,
                            turnarounddate: $scope.searchTime,
                            object: $scope.object ,
                            content: $scope.content,
                            accountabilitytype: $scope.accountabilitytype,
                            remark: $scope.remark,
                            accessory: $scope.accessory
                        }
                        console.log(params);
						if(!$scope.id){
                            $http({
                                method: 'post',
                                url: apiPrefix + '/v1/AnzhaStandingBook/add',
                                params:params
                            }).success(
                                function (res) {
                                    if (res.resCode == 1) {
                                        layer.msg('新增成功',{time:2000});
                                        clear();
                                        routeService.route('2-6', true);
                                    }else{
                                        layer.msg('服务器异常，请稍后再试');
                                    }
                                }
                            );
                        }else{
                            $http({
                                method: 'put',
                                url: apiPrefix + '/v1/AnzhaStandingBook/update',
                                params:{
                                    id: $scope.id,
                                    name: $scope.name,
                                    duty: $scope.duty,
                                    turnarounddate: $scope.searchTime,
                                    object: $scope.object ,
                                    content: $scope.content,
                                    accountabilitytype: $scope.accountabilitytype,
                                    remark: $scope.remark,
                                    accessory: $scope.accessory
                                }
                            }).success(
                                function (res) {
                                    if (res.resCode == 1) {
                                        layer.msg('修改成功',{time:2000});
                                        clear();
                                        routeService.route('2-6', true);
                                    }else{
                                        layer.msg('服务器异常，请稍后再试');
                                    }
                                }
                            );
                        }


                    }

                    //取消
                    $scope.back = function () {
                        routeService.route('2-6', true);
                    }


                    //清空表单
                    var clear = function () {
                        $scope.name = '';
                        $scope.duty = '';
                        $scope.searchTime = '';
                        $scope.object = '';
                        $scope.content='';
                        $scope.accountabilitytype='';
                        $scope.remark='';
                        $scope.fileName='';
                    }

                } ]);
})(window, angular);
