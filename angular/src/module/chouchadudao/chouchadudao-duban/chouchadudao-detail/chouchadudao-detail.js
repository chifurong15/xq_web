(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'dubanViewCtrl',
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
                function dubanViewCtrl($localStorage, $scope,
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

                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/userinfo',
                            method: 'get',
                            // params:{
                            //     id:$scope.userInfo.id
                            // },
                            callBack: function (res) {
                                $scope.num = res.data;
                                getDeal();
                                if($scope.status !=1 && $scope.num == 5){
                                    getResult();
                                }
                            }
                        })
                        var bulletin = globalParam.getter().bulletin || {};
                        $scope.id = localStorage.getItem('id');
                        $scope.status = localStorage.getItem('status');
                        getBasic();
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

                    //查看附件
                    $scope.viewFile = function (path) {
                        $('#myModal').modal('show');
                        PDFObject.embed(path, "#file", options);

                    }
                    //取消查看
                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                    }

                    //获取处理反馈详情
                    function getDeal() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detailFeedbackcl',
                            method: 'get',
                            params: {
                                supervisionid: $scope.id,
                                objectid: $scope.num == 5 ? $scope.userInfo.id : ''
                            },
                            callBack: function (res) {
                                if(res.data){
                                        // $scope.resDeal = res.data;
                                        // $scope.detailId = res.data.id;
                                        // $scope.dealDescription = res.data.description;
                                        // $scope.isFinish = $scope.resDeal.whether;
                                        // layui.use('laydate', function () {
                                        //     var laydate = layui.laydate;
                                        //     laydate.render({
                                        //         elem: '#test14'
                                        //         ,value: res.data.feedbacktime
                                        //         ,isInitValue: true //是否允许填充初始值，默认为 true
                                        //         ,formate: 'yyyy-MM-dd HH:mm:ss'
                                        //     });
                                        // })
                                        $scope.clDetailList = res.data;
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

                    //取消
                    $scope.back = function () {
                        routeService.route('2-4', true);
                    }

                }]);
})(window, angular);
