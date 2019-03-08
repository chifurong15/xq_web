(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'patrolDetailMgtCtrl', [
            '$localStorage',
            '$scope',
            '$location',
            '$log',
            '$q',
            '$rootScope',
            'globalParam',
            '$window',
            'routeService',
            '$http',
            '$ajaxhttp',
            'moduleService',
            function patrolDetailMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {

                var apiPrefix = moduleService.getServiceUrl() + '/patrol';
                // var apiPrefix = 'http://10.0.9.110:7027' + '/patrol';

                /**
                 * ==============================================
                 * @name  patrolDetailMgtCtrl
                 * @author  | 2018/10/25
                 * @version
                 * @desc  巡查详情
                 * ==============================================
                 */
                $scope.init = function(){

                    /**
                     * 获取详情
                     */
                    // localStorage.getItem('id');
                    getDetalList();
                }

                /**
                 * 获取详情
                 */
                function getDetalList(){
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/detail',
                        method: 'get',
                        params: {
                            id: localStorage.getItem('detailId')
                        },
                        callBack: function (res) {
                            $scope.problemList = res.data;
                            if(res.data.photoUrl){
                                var urlList = [];
                                $scope.imgUrl = [];
                                urlList = res.data.photoUrl.split(',');
                                $scope.mp3Url = [],$scope.mp4Url = [];

                                urlList.map(function (item,i){
                                    if(item.substring(item.length-3).toLowerCase() == 'mp3'){
                                        $scope.mp3Url.push(urlList[i]);
                                    }else if(item.substring(item.length-3).toLowerCase() == 'mp4'){
                                        $scope.mp4Url.push(urlList[i]);
                                    }else{
                                        $scope.imgUrl.push(item)
                                    }
                                })
                                // console.log('mp3Url',$scope.mp3Url);
                                // console.log('mp4Url',$scope.mp4Url);
                                // console.log('imgUrl',$scope.imgUrl);
                            }
                        }
                    })
                }

                /**
                 * 返回
                 */
                $scope.getBack = function(){
                    routeService.route('3-13', true);
                }


                $scope.openImg = function (item) {
                    console.log(item)
                    $('#openImg').show();
                    $('#imgShade').show();
                    $scope.imgUrl = $scope.fileUrl +  item;
                    $("#openImg img").attr("src", $scope.imgUrl);
                }

                $scope.closeImg = function () {
                    $('#openImg').hide();
                    $('#imgShade').hide();
                }

                // 音视频播放
                $scope.playVideo = function(item){

                    $('#videoBox').show();
                    $('#audioPlayer').css('display','none');
                    $("#videoPlayerBox").css('display','block');
                    $scope.videoUrl = $scope.fileUrl +  item;

                    var sourceDom = $("<video id=\"my-player\" class=\"video-js\"  controls preload=\"auto\" data-setup='{}'>\n" +
                        "</video>");
                    $("#videoPlayerBox #my-player").html('');
                    $("#videoPlayerBox #my-player").append(sourceDom);

                    $("#videoPlayerBox  video").attr("src", $scope.videoUrl);

                    $("#videoPlayerBox  video").trigger("play");

                    // var myPlayer = videojs("videoPlayerBox")
                    // myPlayer.ready(function () {
                    //     myPlayer.play()
                    //
                    // });
                };
                $scope.playAudio = function(item){
                    $('#videoBox').show();
                    $('#audioPlayer').css('display','block');
                    $("#videoPlayerBox").css('display','none');
                    $scope.videoUrl = $scope.fileUrl + item;
                    $("#audioPlayer audio").attr("src", $scope.videoUrl);
                    // var myPlayer = $("#audioPlayer");
                    // myPlayer.play()
                }
                // 停止并关闭视频、
                $scope.closePlayer = function(){
                    $('#videoBox').hide();
                };



            }
        ]);

})(window, angular)