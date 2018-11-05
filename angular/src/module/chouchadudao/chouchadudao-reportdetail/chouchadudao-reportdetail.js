(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'anchaanfangReportViewCtrl',
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
                function anchaanfangReportViewCtrl($localStorage, $scope,
                                             $location, $log, $q, $rootScope, $window,
                                             routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/ancha';


                    $scope.init = function () {
                        var bulletin = globalParam.getter().bulletin || {};

                        //获取台账列表
                        getData();

                        //获取任务列表
                        getTaskList ();

                        //获取反馈信息
                        getFeedback();

                        var selectedId = localStorage.getItem('0');
                        $('.js-tab').find('li').eq(selectedId).addClass('tab-active').siblings().removeClass('tab-active');
                        $(".js-con").find('.con').hide().eq(selectedId).show();

                    }

                    //返回
                    $scope.goBack = function(){
                        history.back(-1);
                    }

                    // 新建台账
                    $scope.addBook = function () {
                        globalParam.setter({
                            bulletin: {}
                        })
                        routeService.route('2-6-1', false);
                    }
                    // 修改台账
                    $scope.editBook = function (id) {
                        globalParam.setter({
                            bulletin: {
                                id:id
                            }
                        })
                        routeService.route('2-6-1', false);
                    }
                    // 获取任务列表
                    function getTaskList () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaInvestigations/list',
                            method: 'get',
                            params: {
                                schemeid:localStorage.getItem('schemeid')
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    $scope.whether = res.data.whether;
                                    $scope.feedbackTime = res.data.feedbackTime;
                                    $scope.describe = res.data.describe;
                                    $scope.assessory = res.data.assessory;

                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })
                    }

                    //获取反馈结果
                    function getFeedback(){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaFeedback/detail',
                            method: 'get',
                            params: {
                                bulletinid:localStorage.getItem('id')
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){

                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })
                    }

                    // 获取台账列表
                    function getData () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaStandingBook/list',
                            method: 'get',
                            params: {
                                bulletinid:localStorage.getItem('id')
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    $scope.bookList = res.data;
                                    //$scope.paginationConf.totalItems = res.data.total;
                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })
                    }

                    //tab栏切换
                    $('.js-tab li').on("click",function (){
                        var index = $(this).index();
                        $(this).addClass('tab-active').siblings().removeClass('tab-active');
                        $(".js-con").find('.con').hide().eq(index).show();
                    });

                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime = new moment(c.date).format('YYYY-MM');
                        $scope.$apply();
                    });

                    $('#J-searchTime1').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime1 = new moment(c.date).format('YYYY-MM');
                        $scope.$apply();
                    });

                    // 获取url参数
                    function  getQueryString (params, url) {
                        var url = url || location.href;
                        var search = url.split('?')[1];
                        if (search) {
                            var n = new RegExp("(^|&)" + params + "=([^(&|#)]*)((&|#)|$)", "i"),
                                r = search.match(n);
                            return null != r ? r[2] : null
                        }
                        return null;
                    }
                } ]);
})(window, angular);
