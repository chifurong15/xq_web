(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'patrolProblemMgtCtrl', [
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
            function patrolProblemMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {

        		// var apiPrefix = moduleService.getServiceUrl() + '/patrol';
                var apiPrefix = 'http://10.0.9.110:7027' + '/patrol';

                var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';


                /**
				 * ==============================================
				 * @name  patrolDetailMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  巡查详情
				 * ==============================================
				 */
				$scope.init = function(){

                    $('#river').attr('disabled',true)

                    getRegion ();

                    getType()


                    /**
					 * 获取列表
					 */
					getModuleList ();

                    getUnit();

                }

                //搜索
                $scope.getMdSearch = function () {
                    getModuleList();
                }


                //监听区域
                $scope.getChangeRegion = function (r) {
                    if(r){
                        $('#river').attr('disabled',false)
                    }else{
                        $('#river').attr('disabled',true)
                    }
                    getRiver(r);
                    $scope.reachName = '';
                }

                //查询河湖
                function getRiver(r) {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/selectReach',
                        method: 'get',
                        params:{
                            regionId:r
                        },
                        callBack: function (res) {
                            if(res.data){
                                $scope.riverList = res.data;
                            }
                        }
                    })
                }


                //重置
                $scope.getReSet = function () {
                    $scope.reachName = '';
                    $scope.regionName = '';
                    $scope.beginTime = '';
                    $scope.endTime = '';
                    $scope.typeName = '';
                    $scope.unitName = '';
                }

                //获取所属区域
                function getRegion (){
                    $ajaxhttp.myhttp({
                        url:regionTreeUrl,
                        method:'get',
                        params:{
                            pageNum:-1,
                            pageSize:-1,
                            grade:3
                        },
                        callBack:function (res) {
                            $scope.regionList = res.data.list;
                        }
                    })
                }

                //查询考核单位
                function getUnit() {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrolRecord/selectUnit',
                        method: 'get',
                        callBack: function (res) {
                            if(res.data){
                                $scope.unitList = res.data;
                            }
                        }
                    })
                }

                //查询问题类型
                function getType() {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/selectProblem',
                        method: 'get',
                        callBack: function (res) {
                            if(res.data){
                                $scope.typeList = res.data;
                            }
                        }
                    })
                }


                //获取问题列表
                function getModuleList () {

                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/selectList',
                        method: 'get',
                        params: {
                            recordId:localStorage.getItem('id'),
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            // riverId: $scope.riverName,
                            // reachId:$scope.reachName,
                            // unit:$scope.unitName,
                            // regionId:$scope.regionName,
                            // patrolDateStart:$scope.beginTime,
                            // patrolDateEnd:$scope.endTime,
                        },
                        callBack: function (res) {
                            $scope.moduleList = res.data.list;
                            $scope.paginationConf.totalItems = res.data.total;
                        }
                    })

                }



































				
				/**
				 * 获取详情
				 */
				// function getDetalList(){
                 //    $ajaxhttp.myhttp({
                 //        url: apiPrefix + '/v1/ExeAssPatrol/detail',
                 //        method: 'get',
                 //        params: {
                 //            id: localStorage.getItem('id')
                 //        },
                 //        callBack: function (res) {
                 //              $scope.problemList = res.data;
                 //              if(res.data.photoUrl){
                 //                  var urlList = [];
                 //                  $scope.imgUrl = [];
                 //                  urlList = res.data.photoUrl.split(',');
                 //                  $scope.mp3Url = [],$scope.mp4Url = [];
                //
                 //                  urlList.map(function (item,i){
                 //                      if(item.substring(item.length-3).toLowerCase() == 'mp3'){
                 //                          $scope.mp3Url.push(urlList[i]);
                 //                      }else if(item.substring(item.length-3).toLowerCase() == 'mp4'){
                 //                          $scope.mp4Url.push(urlList[i]);
                 //                      }else{
                 //                          $scope.imgUrl.push(item)
                 //                      }
                 //                  })
                 //                  // console.log('mp3Url',$scope.mp3Url);
                 //                  // console.log('mp4Url',$scope.mp4Url);
                 //                  // console.log('imgUrl',$scope.imgUrl);
                 //              }
                 //        }
                 //    })
				// }

                /**
				 * 返回
				 */
				$scope.getBack = function(){
					routeService.route('3-6', true);
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
                    $("#videoPlayerBox source").attr("src", $scope.videoUrl);
                    var myPlayer = videojs("videoPlayerBox")
                    myPlayer.ready(function () {
                        myPlayer.play()
                    });
                };
                $scope.playAudio = function(item){
                    $('#videoBox').show();
                    $('#audioPlayer').css('display','block');
                    $("#videoPlayerBox").css('display','none');
                    $scope.videoUrl = $scope.fileUrl + item;
                    // console.log($("#audioPlayer"))
                    $("#audioPlayer audio").attr("src", $scope.videoUrl);
                    // var myPlayer = $("#audioPlayer");
                    // myPlayer.play()
                }
                // 停止并关闭视频、
                $scope.closePlayer = function(){
                    $('#videoBox').hide();
                };


                // 配置分页基本参数
                $scope.paginationConf = {
                    currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                    itemsPerPage: 10,
                    pagesLength: 10,
                    perPageOptions: [1, 2, 3, 4, 5, 10],
                    onChange: function () {
                        //console.log($scope.paginationConf.currentPage);
                        $location.search('currentPage', $scope.paginationConf.currentPage);
                    }
                };
                // 当他们一变化的时候，重新获取数据条目
                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getModuleList);

                /**
                 * 时间选择
                 */

                var datepicker1 = $('#beginTime').datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (e) {
                    var result = new moment(e.date).format('YYYY-MM-DD');
                    $scope.beginTime = result;
                    $scope.$apply();
                });

                var datepicker2 = $('#endTime').datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (e) {
                    var result = new moment(e.date).format('YYYY-MM-DD');
                    $scope.endTime= result;
                    $scope.$apply();
                });

                /**
                 * 动态设置最小值
                 */
                datepicker1.on('dp.change', function (e) {
                    datepicker2.data('DateTimePicker').minDate(e.date);
                });
                /**
                 * 动态设置最大值
                 */
                datepicker2.on('dp.change', function (e) {
                    datepicker1.data('DateTimePicker').maxDate(e.date);
                });

				
				
            }
        ]);

})(window, angular)