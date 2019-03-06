(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'patrolMgtCtrl', [
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
            function patrolMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {

        		var apiPrefix = moduleService.getServiceUrl() + '/patrol';
        		// var apiPrefix = 'http://10.0.9.110:7027' + '/patrol';

                var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';



                /**
				 * ==============================================
				 * @name  patrolMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  巡查管理
				 * ==============================================
				 */
				$scope.init = function(){

				    $('#river').attr('disabled',true)
				    $('#reach').attr('disabled',true)

                    $('.selectpicker').selectpicker({
                        noneSelectedText : '请选择',
                        dropupAuto: false,
                        deselectAllText:'取消全选',
                        selectAllText: '全选',
                    });


                    getRegion ();

					
					/**
					 * 获取列表数据
					 */
					getModuleList();
					

                    getUnit ();

                }

                //监听区域
                $scope.getChangeRegion = function (r) {
                    if(r){
                        $('#river').attr('disabled',false)
                        getRiver (r);
                    }else{
                        $('#river').attr('disabled',true)
                        $('#reach').attr('disabled',true)
                    }
                    $scope.riverName = '';
                    $scope.reachName = '';
                }

                //监听河湖
                $scope.getChangeRiver = function (river) {
                    if($scope.regionName && river){
                        $('#reach').attr('disabled',false)
                        getReach (river);
                    }else{
                        $('#reach').attr('disabled',true)
                    }
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

                            var select = $("#slpkRegion");
                            for (var i = 0; i < $scope.regionList.length; i++) {
                                select.append("<option value='"+$scope.regionList[i].areaCode+"'>"
                                    + $scope.regionList[i].areaName + "</option>");
                            }
                            $('.selectpicker').selectpicker('val', '');
                            $('.selectpicker').selectpicker('refresh');

                        }
                    })
                }




			    //搜索
			    $scope.getMdSearch = function () {
                    getModuleList();
                }
				
                //重置
				$scope.getReSet = function () {
					$scope.reachName = '';
					$scope.riverName = '';
					$scope.regionName = '';
					$scope.beginTime = '';
                    $scope.endTime = '';
                    $scope.unitName = '';
                }


				/**
				 * 列表数据
				 */
				function getModuleList(){
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrolRecord/selectList',
                        method: 'get',
                        params: {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            riverId: $scope.riverName,
                            reachId:$scope.reachName,
                            unit:$scope.unitName,
                            regionId:$scope.regionName,
                            patrolDateStart:$scope.beginTime,
                            patrolDateEnd:$scope.endTime,
                        },
                        callBack: function (res) {
                            $scope.moduleList = res.data.list;
                            $scope.paginationConf.totalItems = res.data.total;
                        }
                    })
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
                                var select = $("#slpkRiver");
                                select.html('')
                                if($scope.sentRegion){
                                    for (var i = 0; i < $scope.riverList.length; i++) {
                                        select.append("<option value='"+$scope.riverList[i].reachCode+"'>"
                                            + $scope.riverList[i].reachName + "</option>");
                                    }
                                    $('.selectpicker1').selectpicker('val', '');
                                    $('.selectpicker1').selectpicker('refresh');
                                }
                            }
                        }
                    })
                }

                //查询河段
                function getReach(river) {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/selectReachDetail',
                        method: 'get',
                        params:{
                            regionId:$scope.regionName,
                            riverId:river
                        },
                        callBack: function (res) {
                            if(res.data){
                                $scope.reachList = res.data;
                            }
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

                //修改巡查
                $scope.edit = function (id) {
                    $('#myModal').modal('show');
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrolRecord/detail',
                        method: 'get',
                        params:{
                            id:id
                        },
                        callBack: function (res) {
                            $scope.patrolDetail = res.data;
                            $scope.patrolDetail.mileage = $scope.patrolDetail.mileage.toFixed(3);
                            $scope.sentRegion = $scope.patrolDetail.regionId.split(',')
                            $('.selectpicker').selectpicker('val',$scope.sentRegion);
                            $('.selectpicker').selectpicker('refresh');
                            $('.selectpicker').selectpicker('render');

                            getRiver($scope.patrolDetail.regionId)

                            setTimeout(function (){
                                $scope.sentRiver = $scope.patrolDetail.riverId.split(',')
                                $('.selectpicker1').selectpicker('val',$scope.sentRiver);
                                $('.selectpicker1').selectpicker('refresh');
                                $('.selectpicker1').selectpicker('render');
                            },1000)
                        }
                    })

                }


                $scope.getChangeRegionlistener = function (region) {
                    getRiver(region.join(','))
                }

                //保存修改
                $scope.save = function () {
				    var params = {
				        id: $scope.patrolDetail.id,
                        regionId:$scope.sentRegion.join(','),
                        riverId:$scope.sentRiver.join(',')
                    }

                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrolRecord/update',
                        method: 'put',
                        params:params,
                        callBack: function (res) {
                            if(res.resCode == 1){
                                getModuleList();
                                $('#myModal').modal('hide')
                            }
                        }
                    })
                }



				/**
				 * 查看巡查问题列表
				 */
				$scope.getHydrologicDetail = function(id){
					localStorage.setItem('listId',id);
					routeService.route('3-13', true);
				};
				
				
				/**
				 * 巡查删除
				 */
				
				$scope.getHydrologicDelete = function(id) {
					var layerIndex = layer.confirm('确定删除本条数据吗？', {
	                      btn: ['确定', '取消']
	                      // 按钮
	                  }, function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ExeAssPatrolRecord/delete',
                            method: 'DELETE',
                            params: {
								id: id
                            },
                            callBack: function (res) {
                            	if(res.resCode == 1){
                                    layer.msg("删除成功！",{time:2000});
                                    getModuleList();
                            	}
                            }
                        })
	                 }, function () {});
				}


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