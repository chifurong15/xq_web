(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'dubanBasicCtrl',
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
                function dubanBasicCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/duban';
                    //var apiPrefix = 'http://10.0.9.133:7026' + '/duban';

                    var options = {
                        pdfOpenParams: {
                            pagemode: "thumbs",
                            navpanes: 0,
                            toolbar: 0,
                            statusbar: 0,
                            view: "FitV"
                        }
                    };

                    $scope.init = function () {
                        var bulletin = globalParam.getter().bulletin || {};
                        $scope.id = localStorage.getItem('id');
                        $scope.tag = localStorage.getItem('tag');
                        $scope.status = localStorage.getItem('status');

                        if ($scope.tag == 1) {
                            $scope.tags = '回复';
                        } else if ($scope.tag == 2) {
                            $scope.tags = '处理';
                        } else if ($scope.tag == 3) {
                            $scope.tags = '核查';
                            getDeal();
                        }
                        getBasic();
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/userinfo',
                            method: 'get',
                            callBack: function (res) {
                                $scope.num = res.data;
                            }
                        })
                        //$scope.num = 5; //02 市河长办  05 区

                        if ($scope.num == 5 && $scope.status == 5) {
                            getResult();
                        }

                        if ($scope.num == 5 && $scope.status != 0) {
                            getAnswer();
                        }

                        if ($scope.num == 2 && $scope.status == 2) {
                            getAnswer();
                        }

                    }

                    layui.use('laydate', function () {
                        var laydate = layui.laydate;
                        laydate.render({
                            elem: '#test11',
                            type: 'datetime',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            done: (value) => {
                                $scope.searchTime4 = value;
                            }
                        });
                    })
                    layui.use('laydate', function () {
                        var laydate = layui.laydate;
                        laydate.render({
                            elem: '#test13',
                            type: 'datetime',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            done: (value) => {
                                $scope.searchTime3 = value;
                            }
                        });
                    })
                    layui.use('laydate', function () {
                        var laydate = layui.laydate;
                        laydate.render({
                            elem: '#test14',
                            type: 'datetime',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            done: (value) => {
                                $scope.searchTime = value;
                            }
                        });
                    })


                    //查看附件
                    $scope.viewFile = function () {
                        $('#myModal').modal('show');
                    }
                    //取消查看
                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                    }

                    // 单选按钮组
                    $scope.typeList = [
                        {"id": 1, "typeName": "是"},
                        {"id": 2, "typeName": "否"}
                    ];
                    $scope.radioBtn = function (type) {
                        $scope.type = type;
//	                    getDataList();
                    }

                    //返回
                    $scope.goBack = function () {
                        history.back(-1);
                    }

                    //获取基础资料
                    function getBasic() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detail',
                            method: 'get',
                            params: {
                                id: $scope.id
                            },
                            callBack: function (res) {
                                $scope.res = res.data;
                                PDFObject.embed(res.data.assessory, "#file", options);
                            }
                        })
                    }

                    // 回复
                    $scope.answer = function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/addFeedbackhf',
                            method: 'post',
                            params: {
                                supervisionid: $scope.id,
                                feedbacktime: $scope.feedbacktime3,
                                description: $scope.description
                            },
                            callBack: function (res) {
                                if (res.resCode == 1) {
                                    layer.msg("回复成功！", {time: 2000});
                                    routeService.route('2-4', true);
                                }
                            }
                        })
                    }

                    //处理
                    $scope.deal = function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/addFeedbackcl',
                            method: 'post',
                            params: {
                                supervisionid: $scope.id,
                                whether: $scope.type == 1 ? '是' : '否',
                                feedbacktime: $scope.searchTime,
                                description: $scope.dealDescription,
                                assessory: $scope.assessory
                            },
                            callBack: function (res) {
                                if (res.resCode == 1) {
                                    layer.msg("处理成功！", {time: 2000});
                                    routeService.route('2-4', true);
                                }
                            }
                        })
                    }
                    //核查
                    $scope.verification = function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/addFeedbackhc',
                            method: 'post',
                            params: {
                                supervisionid: $scope.id,
                                whether: $scope.type == 1 ? '是' : '否',
                                feedbacktime: $scope.searchTime4,
                                description: $scope.infoDescription,
                                assessory: $scope.assessory
                            },
                            callBack: function (res) {
                                if (res.resCode == 1) {
                                    layer.msg("核查成功！", {time: 2000});
                                    routeService.route('2-4', true);
                                }
                            }
                        })
                    }

                    //取消
                    $scope.back = function () {
                        routeService.route('2-4', true);
                    }

                    //获取回复反馈
                    function getAnswer() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detailFeedbackhf',
                            method: 'get',
                            params: {
                                supervisionid: $scope.id
                            },
                            callBack: function (res) {
                                $scope.resAnswer = res.data;
                            }
                        })
                    }

                    //获取处理反馈
                    function getDeal() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detailFeedbackcl',
                            method: 'get',
                            params: {
                                supervisionid: $scope.id
                            },
                            callBack: function (res) {
                                $scope.resDeal = res.data;
                                PDFObject.embed(res.data.assessory, "#file", options);
                                if ($scope.resDeal.whether == '否') {
                                    $scope.isSelected = '2';
                                } else {
                                    $scope.isSelected = '1';
                                }
                            }
                        })
                    }

                    //获取核查结果
                    function getResult() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detailFeedbackhc',
                            method: 'get',
                            params: {
                                supervisionid: $scope.id
                            },
                            callBack: function (res) {
                                $scope.resResult = res.data;
                                if ($scope.resResult.whether) {
                                    if ($scope.resResult.whether == '否') {
                                        $scope.isSelected = '2';
                                    } else {
                                        $scope.isSelected = '1';
                                    }
                                }
                            }
                        })
                    }

                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function (id) {
                        if (id == 1) {
                            $('#coverModal1').modal('show');
                        } else if (id == 2) {
                            $('#coverModal2').modal('show');
                        } else if (id == 3) {
                            $('#coverModal3').modal('show');
                        }
                    }


                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function (id) {
                        if (id == 1) {
                            $('#coverModal1').modal('hide');
                        } else if (id == 2) {
                            $('#coverModal2').modal('hide');
                        } else if (id == 3) {
                            $('#coverModal3').modal('hide');
                        }
                        var formFile = new FormData();
                        if (id == 1) {
                            var fileObj1 = document.querySelector('input[type=file]').files[0];
                            formFile.append("files", fileObj1); //加入文件对象
                        } else if (id == 2) {
                            var fileObj2 = document.querySelector('#problemFile').files[0];
                            formFile.append("files", fileObj2); //加入文件对象
                        } else if (id == 3) {
                            var fileObj3 = document.querySelector('#oneregion').files[0];
                            formFile.append("files", fileObj3); //加入文件对象
                        }

                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/DubanSupervision/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                //console.log(res);
                                if (id == 1) {
                                    $scope.assessory = res.data[0];
                                } else if (id == 2) {
                                    $scope.assessory = res.data[0];
                                } else if (id == 3) {
                                    $scope.assessory = res.data[0];
                                }
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }

                    //处理
                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM-DD HH:mm:ss',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime = new moment(c.date).format('YYYY-MM-DD HH:mm:ss');
                        $scope.$apply();
                    });

                    //回复
                    $('#J-searchTime3').datetimepicker({
                        format: 'YYYY-MM-DD HH:mm:ss',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.feedbacktime3 = new moment(c.date).format('YYYY-MM-DD HH:mm:ss');
                        $scope.$apply();
                    });

                    //
                    $('#J-searchTime40').datetimepicker({
                        format: 'YYYY-MM-DD HH:mm:ss',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime4 = new moment(c.date).format('YYYY-MM-DD HH:mm:ss');
                        $scope.$apply();
                    });

                    // 获取url参数
                    function getQueryString(params, url) {
                        var url = url || location.href;
                        var search = url.split('?')[1];
                        if (search) {
                            var n = new RegExp("(^|&)" + params + "=([^(&|#)]*)((&|#)|$)", "i"),
                                r = search.match(n);
                            return null != r ? r[2] : null
                        }
                        return null;
                    }
                }]);
})(window, angular);
