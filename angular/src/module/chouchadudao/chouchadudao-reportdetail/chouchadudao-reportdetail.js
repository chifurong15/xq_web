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

                    //var apiPrefix = 'http://10.0.9.133:7021' + '/ancha';

                    var options = {
                        pdfOpenParams: {
                            pagemode: "thumbs",
                            navpanes: 0,
                            toolbar: 0,
                            statusbar: 0,
                            view: "FitV"
                        }
                    };
                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        var bulletin = globalParam.getter().bulletin || {};
                        $scope.isView = localStorage.getItem('isView');
                        $scope.isShowTask = false;
                        // 05区河长办  02市河长办
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaInvestigations/userinfo1',
                            method: 'get',
                            params:{id:$scope.userInfo.id},
                            callBack: function (res) {
                                $scope.num = res.data;
                                //获取台账列表
                                getData();

                                //获取任务列表
                                getTaskList ();


                                if($scope.isView == 1){
                                    //获取反馈信息
                                    getFeedback();
                                }

                                if($scope.num == 5){
                                    isBack ();
                                }
                            }
                        })

                        getDate ();

                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaBulletin/detail',
                            method: 'get',
                            params: {
                                id: localStorage.getItem('id')
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                   $scope.basicDetail =res.data;
                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })

                    }

                    //查询是否反馈
                    function isBack (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaFeedback/selectHaveyi',
                            method: 'get',
                            params: {
                                bulletinid: localStorage.getItem('id'),
                                objectid: $scope.userInfo.id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data == 1){
                                        $scope.isShowTask = true;
                                    }
                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })
                    }

                    //返回
                    $scope.goBack = function(){
                        routeService.route('2-6', true);
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

                    //查看附件
                    $scope.viewFile = function (path) {
                        $('#myModal').modal('show');
                        PDFObject.embed(path, "#file", options);

                    }
                    //取消查看
                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                    }

                    // 获取任务列表
                    function getTaskList () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaInvestigations/list',
                            method: 'get',
                            params: {
                                schemeid:localStorage.getItem('schemeid'),
                                regionid: $scope.num == 5 ? $scope.userInfo.regionId :''
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    $scope.taskList = res.data.list;
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
                                bulletinid:localStorage.getItem('id'),
                                objectid: $scope.num == 5 ? $scope.userInfo.id : ''
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.backList = res.data;
                                        $scope.whether = res.data.whether;
                                        $scope.feedbackTime = res.data.feedbacktime;
                                        $scope.describe = res.data.describe;
                                        $scope.assessory = res.data.assessory;
                                        PDFObject.embed(res.data.assessory, "#file", options);
                                    }

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

                    //反馈
                    $scope.goReport = function () {

                        var params = {
                            whether: $scope.isFinish == 1 ? '是': '否',
                            feedbackTime:$scope.currentdate,
                            describe:$scope.describe,
                            filePath:$scope.assessory,
                            objectid: $scope.userInfo.id,
                            bulletinid:localStorage.getItem('id'),
                        }
                        // console.log(params);
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaFeedback/add',
                            method: 'post',
                            params:params,
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    routeService.route('2-6',true);
                                    layer.msg('反馈成功',{times:2000});

                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })
                    }
                    //取消反馈
                    $scope.back = function (){
                        routeService.route('2-6',true);

                    }
                    $('#J-searchTime2').datetimepicker({
                        format: 'YYYY-MM-DD HH:mm:ss',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.feedbackTime = new moment(c.date).format('YYYY-MM-DD HH:mm:ss');
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
                                url: apiPrefix + '/v1/AnzhaReport/upload',
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
