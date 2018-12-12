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
                        $scope.userInfo = $localStorage.userLoginInfo.userInfo;
                        var bulletin = globalParam.getter().bulletin || {};
                        $scope.id = localStorage.getItem('id');
                        $scope.tag = localStorage.getItem('tag');
                        $scope.status = localStorage.getItem('status');

                        getDate ();

                        if ($scope.tag == 2) {
                            $scope.tags = '处理';
                        } else if ($scope.tag == 3) {
                            $scope.tags = '核查';
                        }
                        //获取基础资料
                        getBasic();



                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/userinfo',
                            method: 'get',
                            // params:{
                            //     id:$scope.userInfo.id
                            // },
                            callBack: function (res) {
                                $scope.num = res.data;
                                //获取处理反馈详情
                                getDeal();

                                if ($scope.num == 5 && $scope.status == 5) {
                                    getResult();
                                }
                            }
                        })
                        //$scope.num = 2; //02 市河长办  05 区

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
                    $scope.viewFile = function (path) {
                        // $('#myModal').modal('show');
                        // PDFObject.embed(path, "#file", options);
                        window.open(path)

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
                        //$scope.type = type;
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
                                if(res.data){
                                    $scope.res = res.data;

                                    if(res.data.type == 1 ){
                                        $scope.res.type = '普通督办'
                                    }else if(res.data.type == 2 ){
                                        $scope.res.type = '现场督办'
                                    }else if(res.data.type == 3 ){
                                        $scope.res.type = '挂牌督办'
                                    }
                                    PDFObject.embed(res.data.assessory, "#file", options);
                                }
                            }
                        })
                    }

                    //处理
                    $scope.deal = function () {
                       // alert($('#is').val())
                        var params = {
                                id: $scope.detailId,
                                whether: $('#is').val() == 1 ? '是' : '否',
                                feedbacktime: $scope.currentdate,
                                //description: $scope.dealDescription,
                                description:$('#deblock_udid4').val(),
                                assessory: $scope.assessory
                        }
                        // console.log(params);
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/updateFeedbackcl',
                            method: 'put',
                            params: params,
                            callBack: function (res) {
                                if (res.resCode == 1) {
                                    layer.msg("处理成功！", {time: 2000});
                                    routeService.route('2-4', true);
                                }
                            }
                        })
                    }

                    //是否现场核查
                    $scope.changeType = function (type){
                        $scope.type = type
                    }
                    //是否达标
                    $scope.changeType1 = function (type){
                        $scope.type1 = type
                    }

                    //核查
                    $scope.verification = function () {
                        console.log($scope.type);
                        var params = {
                                supervisionid: $scope.id,
                                objectid:$scope.userInfo.id,
                                whetherlocale:$scope.type == 1 ? '是' : '否',
                                whether: $scope.type1 == 1 ? '是' : '否',
                                feedbacktime: $scope.currentdate,
                                description: $('#deblock_udid60').val(),
                                assessory: $scope.assessory
                        };
                        // console.log(params);
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/addFeedbackhc',
                            method: 'post',
                            params: params,
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


                    //获取处理反馈详情
                    function getDeal() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detailFeedbackcl',
                            method: 'get',
                            params: {
                                supervisionid: $scope.id,
                                objectid: $scope.num == 5 ? $scope.userInfo.regionId : ''
                            },
                            callBack: function (res) {
                                if(res.data){
                                    $scope.clDetailList = res.data;

                                        // $scope.resDeal = res.data;
                                         $scope.detailId = res.data[0].id;
                                         $scope.dealDescription = res.data[0].description;
                                         $scope.isFinish = res.data[0].whether == '是' ? 1 : 2;
                                         $scope.currentdate = res.data[0].feedbacktime;
                                        // layui.use('laydate', function () {
                                        //     var laydate = layui.laydate;
                                        //     laydate.render({
                                        //         elem: '#test14'
                                        //         ,value: res.data.feedbacktime
                                        //         ,isInitValue: true //是否允许填充初始值，默认为 true
                                        //         ,formate: 'yyyy-MM-dd HH:mm:ss'
                                        //     });
                                        // })
                                        PDFObject.embed(res.data.assessory, "#problemFile", options);
                                }

                            }
                        })
                    }

                    //获取核查结果详情
                    function getResult() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detailFeedbackhc',
                            method: 'get',
                            params: {
                                supervisionid: $scope.id
                            },
                            callBack: function (res) {
                                if(res.data){
                                    $scope.resResult = res.data;
                                }

                            }
                        })
                    }


                    //获取当前时间
                    function getDate () {
                        setInterval(function () {
                            var date = new Date(),
                                year = date.getFullYear(),
                                month = date.getMonth() + 1,
                                day = date.getDate(),
                                hour = date.getHours(),
                                min = date.getMinutes(),
                                second = date.getSeconds();

                            $scope.$apply(function () {
                                $scope.currentdate=year + '-' + month  + '-' + day + ' ' +
                                    (hour < 10 ? '0' + hour : hour) + ':' +
                                    (min < 10 ? '0' + min : min) + ':' +
                                    (second < 10 ? '0' + second : second) ;
                            })
                        }, 1000);
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
                                layer.msg("上传成功");

                                if (id == 1) {
                                    $scope.assessory = res.data[0];
                                } else if (id == 2) {
                                    $scope.assessory = res.data[0];
                                } else if (id == 3) {
                                    $scope.assessory = res.data[0];
                                }
                            } else {
                                layer.msg("上传失败");
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
