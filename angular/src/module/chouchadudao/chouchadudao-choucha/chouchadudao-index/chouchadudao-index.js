(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'chouchaListCtrl',
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
				function chouchaListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
					
					var apiPrefix = moduleService.getServiceUrl() + '/spotcheck';
					//var apiPrefix = "http://10.0.9.116:7022" + '/spotcheck';

					$scope.init = function () {
                        getList();
                        getAllRegion();
//						$ajaxhttp.myhttp({
//							url: apiPrefix + '/v1/SurfaceWater/userinfo',
//							method: 'get',					
//							callBack: function (res) {
//								$scope.num = res.data;
//
//							}
//						})
					}

					// 获取数据列表
					function getList () {

						let month=new moment($scope.searchTime).format('M')<10 ? '0'+ new moment($scope.searchTime).format('M') : new moment($scope.searchTime).format('M');
						$scope.date=new moment($scope.searchTime).format('YYYY') + '-' + month;

						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/spotcheck/listSpotcheck',
							method: 'get',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
                                status:$scope.status,
								regionName:$scope.region,
                                checkTime:$scope.postTime
							},
							callBack: function (res) {
								$scope.spotcheckList = res.data.list;
                 				$scope.paginationConf.totalItems = res.data.total;
							}
						})
					}

                    $('#J-postTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.postTime = new moment(c.date).format('YYYY-MM-DD');
                        $scope.$apply();
                    });


					// 搜索
	                $scope.search = function () {
                        getList();
	                };


                    //重置搜索条件
                    $scope.reset = function () {
                        $scope.postTime = '';
                        $scope.status = '';
                        $scope.region = '';
                    }


                    // 新建
	                $scope.add = function () {
						globalParam.setter({
							bulletin: {}
						})
						routeService.route('2-2-1', false);
	                }
	                	               
	                 // 查看
	                $scope.view = function (id) {
						if(id){
                            globalParam.setter({
                                bulletin: {
                                	id : id
								}
                            })
						}
						//localStorage.setItem('selectedId',id);
						//localStorage.setItem('detailId',detailId);
						routeService.route('2-2-2', false);
	                }

	                //检查
					$scope.check = function (id) {
                        if(id){
                            globalParam.setter({
                                bulletin: {
                                    id : id
                                }
                            })
                        }
                        routeService.route('2-2-3', false);
                    }

                    //获取所有的区
                    function getAllRegion(){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/listRegion',
                            method: 'get',
                            callBack: function (res) {
                                $scope.RegionList = res.data;
                            }
                        })
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
	                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getList);
			} ]);
})(window, angular);
