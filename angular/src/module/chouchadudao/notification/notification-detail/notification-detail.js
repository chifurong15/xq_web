(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'notificationDetailCtrl',
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
                function notificationDetailCtrl($localStorage, $scope,
                                         $location, $log, $q, $rootScope, $window,
                                         routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl();
                   // var apiPrefix = 'http://10.0.9.194:8066';

                    $scope.init = function () {
                        $scope.noticeModule = JSON.parse(localStorage.getItem('module'));
                        $scope.isreply = $scope.noticeModule.isreply;


                        if($scope.noticeModule.isStart == 1){//发起方
                            $scope.noticeId = $scope.noticeModule.id;
                        }else{//答复方
                            $scope.noticeId = $scope.noticeModule.reportId;
                        }

                        getNoticeDetail();
                        getReadList ();

                    }

                    //获取通知通报详情
                    function getNoticeDetail (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inform/v1/informReport/detail',
                            method: 'get',
                            params:{
                                id:$scope.noticeId
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                   if(res.data){
                                       $scope.detailData = res.data;
                                       if(res.data.fileList){
                                           $scope.accessoryURL = [];
                                           $scope.detailData = res.data;
                                           res.data.fileList.map(function (item){
                                               $scope.accessoryURL.push({
                                                   name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                   previewURL:item.previewURL,
                                                   downloadURL:item.downloadURL
                                               })
                                           })
                                       }
                                   }
                                }else{
                                    layer.msg(res.resMsg, {time:2000});
                                }
                            }
                        })
                    }

                    //获取已阅/答复情况列表
                    function getReadList (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inform/v1/informAccept/list',
                            method: 'get',
                            params:{
                                reportId:$scope.noticeId
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    $scope.readList = res.data;
                                }else{
                                    layer.msg(res.resMsg, {time:2000});
                                }
                            }
                        })
                    }
                    $scope.view = function (id){
                        $('#myModal').modal('show');
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inform/v1/informReply/detail',
                            method:'get',
                            params:{
                                acceptId:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.detailData1 = res.data[0];
                                    if(res.data[0].fileList){
                                        $scope.accessoryURL1 = [];
                                        res.data[0].fileList.map(function (item){
                                            $scope.accessoryURL1.push({
                                                name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                previewURL:item.previewURL,
                                                downloadURL:item.downloadURL
                                            })
                                        })
                                    }

                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }



                    //返回
                    $scope.goBack=function(){
                        routeService.route('2-9', true);
                    }

                } ]);
})(window, angular);
