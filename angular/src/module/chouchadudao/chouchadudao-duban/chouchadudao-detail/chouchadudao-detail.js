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
                        var bulletin = globalParam.getter().bulletin || {};
                        $scope.id = localStorage.getItem('id');
                        $scope.status = localStorage.getItem('status');
                        getBasic();
                        getAnswer();
                        getDeal();
                        getResult();

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

                    //查看附件
                    $scope.viewFile = function () {
                        $('#myModal').modal('show');
                    }
                    //取消查看
                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
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
                                PDFObject.embed(res.data.assessory, "#file", options);
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
                                PDFObject.embed(res.data.assessory, "#file", options);
                            }
                        })
                    }

                    //取消
                    $scope.back = function () {
                        routeService.route('2-4', true);
                    }

                }]);
})(window, angular);
