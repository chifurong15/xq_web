(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'dubanAddCtrl',
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
                function dubanAddCtrl($localStorage, $scope,
                                      $location, $log, $q, $rootScope, $window,
                                      routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/duban';
                    //var apiPrefix = 'http://10.0.9.133:7026' + '/duban';


                    $scope.init = function () {
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择'
                        });
                        var bulletin = globalParam.getter().bulletin || {};

                        getSupervisionObject();
                    }

                    //获取督办对象
                    function getSupervisionObject() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/selectPersonnel',
                            method: 'get',
                            callBack: function (res) {
                                $scope.personList = [];
                                res.data.map(function (item, index) {
                                    $scope.personList.push({id: item.id, name: item.name});
                                })
                                var select = $("#slpk");
                                for (var i = 0; i < $scope.personList.length; i++) {
                                    select.append("<option value='"+$scope.personList[i].id+"'>"
                                        + $scope.personList[i].name + "</option>");
                                }
                                $('.selectpicker1').selectpicker('val', '');
                                $('.selectpicker1').selectpicker('refresh');

                            }
                        })
                    }

                    $('#J-searchTime1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.issuedtime = new moment(c.date).format('YYYY-MM-DD');
                        $scope.$apply();
                    });

                    $('#J-searchTime2').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.deadlinedate = new moment(c.date).format('YYYY-MM-DD');
                        $scope.$apply();
                    });

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
                                url: apiPrefix + '/v1/DubanSupervision/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                $scope.assessory = res.data[0];
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }


                    //返回
                    $scope.goBack = function () {
                        history.back(-1);
                    }

                    // 保存
                    $scope.submit = function () {
                        if (!$scope.title) {
                            layer.alert("请输入标题", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.project) {
                            layer.alert("请输入督办项目", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.issuedtime) {
                            layer.alert("请选择下发日期", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                        else if (!$scope.objectid) {
                            layer.alert("请选择督办对象", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                        else if (!$scope.deadlinedate) {
                            layer.alert("请选择回复时间", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }  else if (!$scope.type) {
                            layer.alert("请选择督办类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.reason) {
                            layer.alert("请输入督办原因", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }

                        // 新增评分管理
                        var params = {
                            title: $scope.title,
                            issuedtime: $scope.issuedtime,
                            deadlinedate: $scope.issuedtime,
                            project: $scope.project,
                            type:$scope.type,
                            objectid: $scope.objectid ? $scope.objectid.join(',') : '',
                            assessory: $scope.assessory,
                            reason: $scope.reason
                        }
                        //console.log(params);
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/add',
                            method: 'post',
                            params: params,
                            callBack: function (res) {
                                if (res.resCode == 1) {
                                    clear();
                                    routeService.route('2-4', true);
                                    layer.msg("新增成功！", {time: 2000});
                                } else {
                                    layer.msg("服务器异常，请稍后再试");
                                }

                            }
                        })
                    }


                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                        clear();
                    }

                    //取消新增
                    $scope.back = function () {
                        clear();
                        routeService.route('2-4', true);
                    }


                    //清空表单
                    var clear = function () {
                        $scope.title = '';
                        $scope.project = '';
                        $scope.issuedtime = '';
                        $scope.deadlinedate = '';
                        $scope.objectid = '';
                        $scope.assessory = '';
                        $scope.reason = '';
                    }
                }]);
})(window, angular);
