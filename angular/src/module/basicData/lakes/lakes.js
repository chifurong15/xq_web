var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var waterUrl = modulePrefix + "/v1/waterSystem";
var riverUrl = modulePrefix + "/v1/river";
var lakesUrl = modulePrefix + "/v1/lakes";
var reservoirUrl = modulePrefix + "/v1/reservoir";
var reachUrl = modulePrefix + "/v1/reach";
var dictionaryUrl = modulePrefix + "/v1/dictionary";
(function(window, angular) {
	'use strict';

	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input); 
		   } 
		})
		app.controller(
			'lakesCtrl', ['$localStorage','$scope','$location','$q','$rootScope','routeService','moduleService','$http',
				function lakesCtrl($localStorage, $scope,$location, $q, $rootScope,routeService,moduleService, $http) {

					/*页面初始化方法*/
					$scope.init = function() {
						console.log($scope.lakesName,'$scope.lakesName')					};

					/*湖泊类型*/
					$scope.lakeTypeList = function() {
						$http({
							method: "get",
							url: moduleService.getServiceUrl() + riverUrl + "/riverType",
                            params:{
                                type: '106'
                            }
						}).success(function(res) {
							if(res.resCode == 1){
								$scope.lakeTypes = res.data;
							}else{
                    			layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res){
			                layer.msg('服务器异常，请稍后再试');
			            });
					}

					/*水系选择模态框*/
					$scope.waterShow = function() {
						$scope.modalTreeInfo = {'treeType': 'water'};
						$("#treeModal").modal('show');
					};
					$scope.$on('zTreeModalClose', function(event,data) {
				    	$scope.waterName = data.treeNodeName;
				    	$scope.waterCode = data.treeNodeId;
				    })

					/*重置*/
					$scope.reSet = function(){
						$scope.lakesName = null;
						$scope.lakesType = null;
						$scope.waterName = null;
						$scope.waterCode = null;
						reGetProducts();
					}

					/*表单分页*/
					var reGetProducts = function() {
						$http({
							url: moduleService.getServiceUrl() +lakesUrl + "/list",
							method: 'GET',
							params: {
                                lakesName: $scope.lakesName,
                                lakesType: $scope.lakesType,
                                waterCode: $scope.waterCode,
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage,
								status: -1
							},
						}).success(function(res) {
							if(res.resCode == 1){
								$scope.paginationConf.totalItems = res.data.total;
								$scope.moduleList = res.data.list;
								$('.page-num').val($scope.paginationConf.currentPage);
							}else{
								layer.msg('服务器异常，请稍后再试');
							}
						}).error(function(res) {
							layer.msg('服务器异常，请稍后再试');
						});
					};

					/*配置分页基本参数*/
					$scope.paginationConf = {
						currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
						itemsPerPage: $rootScope.tempSize == null ? 10 : $rootScope.tempSize,
						pagesLength: 5,
						perPageOptions: [5, 10, 20, 50],
						onChange: function() {
							$location.search('currentPage', $scope.paginationConf.currentPage);
                            $rootScope.tempSize  = $scope.paginationConf.itemsPerPage;
						}
					};
					$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

					$scope.overView = function(id){
						$("#overViewBox").modal('show');
						$http({
							url: moduleService.getServiceUrl() +lakesUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function(res) {;
							$scope.detailContent = res.data.overView;
						});
					};

					// 表单删除
					$scope.moduleDelete = function(id) {
						var layerIndex = layer.confirm('确定删除本条数据吗？', {
							title:'提示',
							btn: ['确定', '取消'] // 按钮
						}, function() {
							$http({
								url: moduleService.getServiceUrl() +lakesUrl + "/delete",
								method: "delete",
								params: {
									id: id
								}
							}).success(function success(res) {
								if(res.resCode == 0) {
									layer.msg('该湖泊下存在下级湖泊，请先删除下级内容！',{time:1000});
								} else {
									layer.msg('删除成功！', {time:1000});
								}
								reGetProducts();
							}, function failure(res) {
								layer.msg('删除失败！', {time:1000});
							});
							layer.close(layerIndex);
						}, function() {});
					};

					//向上移动
					$scope.moveUp = function(id){
						$http({
							url: moduleService.getServiceUrl() +lakesUrl + "/sortOrder",
							method: 'GET',
							params: {
                                id:id,
                                status:0
							},
						}).success(function(res) {
							if(res.resCode == 1){
								reGetProducts();
							}else if(res.resCode == 0) {
								layer.msg('已经是第一个数据了，不能再向上移动了！');
								return;
							}else{
								layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(error) {});
					}

					//向下移动
					$scope.moveDown = function(id){
						$http({
							url: moduleService.getServiceUrl() +lakesUrl + "/sortOrder",
							method: 'GET',
							params: {
                                id:id,
                                status:1
							},
						}).success(function(res) {
							if(res.resCode == 1){
								reGetProducts();
							}else if(res.resCode == 0){
                                layer.msg('已经是最后一个数据了，不能再向下移动了！');
                                return;
							}else{
								layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
                        }).error(function(error) {});
					}

                    $scope.moveIcon = true;
                    $scope.lakesName = '';
                    $scope.lake_type = '';
                    $scope.belongWater = '';
					//搜索
					$scope.find = function() {
                        if (($scope.lake_type =='' || $scope.lake_type == null) && $scope.lakesName =='' && $scope.belongWater == ''){
                            $scope.moveIcon = true;
                        } else if ($scope.lakesName || $scope.lake_type || $scope.belongWater){
                            $scope.moveIcon = false;
                        } else {
                            $scope.moveIcon = false;
                        }
                        reGetProducts();
                        $scope.paginationConf.currentPage = 1;
                        $('.page-num').val($scope.paginationConf.currentPage);
					}
				    $('.query-conditions-form').bind("keydown",function(e){
		                var theEvent = e || window.event;
		                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
		                if (code == 13) {
		                    $scope.find();
		                }
		            });

					// 湖泊新增
					$scope.lakesAdd = function() {
						routeService.route(1009, false);
					}
					// 湖泊详情
					$scope.lakesDetail = function(id) {
						$http({
							url: moduleService.getServiceUrl() +lakesUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function(res) {
							if(res.resCode == 1){
								$localStorage.lakeDetailData = res.data;
								routeService.route(1010, false);
							}else{
                    			layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res){
			                layer.msg('服务器异常，请稍后再试');
			            });

					}
					// 湖泊编辑
					$scope.lakesEdit = function(id) {
						$http({
							url: moduleService.getServiceUrl() +lakesUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function(res) {
							if(res.resCode == 1){
								$localStorage.lakeEditData = res.data;
								routeService.route(1011, false);
							}else{
                    			layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res){
			                layer.msg('服务器异常，请稍后再试');
			            });
					}

					$scope.dataExport = function(){
		            	layer.confirm('是否导出数据？', {
							title:'提示',
							btn: ['确定', '取消'] // 按钮
						}, function(index) {
							var params = {
								lakesName: $scope.lakesName,
                                lakesType: $scope.lakesType,
                                waterCode: $scope.waterCode,
							}
							params = $.param(params);
							window.location.href = moduleService.getServiceUrl() + lakesUrl + '/export?'+params;
							console.log(moduleService.getServiceUrl() + lakesUrl + '/export?'+params,'window.location.href')
							layer.close(index);
						});
		            }

		            $scope.toFileUpload = false;
		            $scope.uploadFile = function(id){
		            	$scope.waterType = 'lakes';
		            	$scope.objId = id;
		            	$scope.toFileUpload = true;
		            }

		            $scope.$on('toFileUpload', function(event,data){
		            	if(data == false){
		            		$scope.toFileUpload = false;
		            	}
		            });
				}
			]);

})(window, angular);