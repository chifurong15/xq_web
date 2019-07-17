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
		app.controller('imRiver', ['$localStorage','$scope','$location','$log','$q','$rootScope','globalParam','$window','routeService','moduleService','$http',
			function imRiver($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService,moduleService, $http) {
				/*页面初始化方法*/
				$scope.init = function() {};

				/*河流类型*/
				$scope.riverTypeList = function() {
					$http({
						method: "get",
						url: moduleService.getServiceUrl() + riverUrl + "/riverType",
                        params:{
						    type: '104'
                        }
					}).success(function(res) {
						if(res.resCode == 1){
							$scope.riverTypes = res.data;
						}else{
                			layer.msg(res.resMsg || '请求错误,请稍后再试');
						}
					}).error(function(res){
		                layer.msg('服务器异常，请稍后再试');
		            });
				}

				/*水系树模态框*/
				// $scope.waterShow = function() {
				// 	$scope.modalTreeInfo = {'treeType': 'water'};
				// 	$("#treeModal").modal('show');
				// }

				/*区域选择模态框*/
				 $scope.regionShow = function(type){
                    if(type == 'multiple'){
                        $scope.modalTreeInfo = {'treeType': 'region' ,'setting': {'check': {'enable': true,'chkStyle': "checkbox",'chkboxType': { "Y": "", "N": "" }}}};
                    }else{
                        $scope.modalTreeInfo = {'treeType': 'region'};
                    }
                    $("#treeModal").modal('show');
                };
			    $scope.$on('zTreeModalClose', function(event,data) {
			    	$scope.regionName = data.treeNodeName;
			    	$scope.waterCode = data.treeNodeId;
			    })

				/*查看详情*/
				$scope.viewDetailFuc = function(id){
					$("#viewDetailModal").modal('show');
					$http({
						url: moduleService.getServiceUrl() +riverUrl + "/detail",
						method: "get",
						params: {
							id: id
						}
					}).success(function(res) {
						if(res.resCode == 1){
							$scope.detailContent=res.data.overView;
						}else{
                			layer.msg("服务器异常，请稍后再试");
						}
					}).error(function(res){
			                layer.msg("服务器异常，请稍后再试");
		            });
				};

				/*向上移动*/
				$scope.riverMoveUp = function(id){
					$http({
						url: moduleService.getServiceUrl() +riverUrl + "/sortOrder",
						method: 'put',
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
					}).error(function(res) {
						layer.msg('服务器异常，请稍后再试');
					});
				}

				/*向下移动*/
				$scope.riverMoveDown = function(id){
					$http({
						url: moduleService.getServiceUrl() +riverUrl + "/sortOrder",
						method: 'put',
						params: {
                            id:id,
                            status:1
						},
					}).success( function(res) {
						if(res.resCode == 1){
							reGetProducts();
	                	}else if(res.resCode == 0) {
                            layer.msg('已经是最后一个数据了，不能再向下移动了！');
                            return;
						}else{
							layer.msg(res.resMsg || '请求错误,请稍后再试');
						}
					}).error(function(res) {
						layer.msg('服务器异常，请稍后再试');
					});
				}


				/*表单搜索*/
                $scope.moveIcon = true;
				$scope.riverSearch = function() {
                    if (($scope.riverType == '' || $scope.riverType == null) && $scope.riverName == '' && $scope.waterName == ''){
                        $scope.moveIcon = true;
                    } else if ($scope.riverName || $scope.riverType || $scope.waterName) {
                        $scope.moveIcon = false;
                    }else {
                        $scope.moveIcon = false;
                    }
                    reGetProducts();
                    $scope.paginationConf.currentPage = 1;
           		}
			    $('.query-conditions-form').bind("keydown",function(e){
	                var theEvent = e || window.event;
	                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
	                if (code == 13) {
	                    $scope.riverSearch();
	                }
	            });

				/*监测所属水系数据*/
				$scope.reSet = function(){
					$scope.riverName = null;
					$scope.riverType = null;
					$scope.waterName = null;
					$scope.waterCode = null;
					$scope.regionName = null;
					reGetProducts();
				}

				var regionCode =  $localStorage.userLoginInfo && $localStorage.userLoginInfo.userInfo.regionId ? $localStorage.userLoginInfo.userInfo.regionId : null;

				/*表单分页*/
				var reGetProducts = function() {
					$http({
						url: moduleService.getServiceUrl() + riverUrl + "/list",
						method: 'GET',
						params: {
                            riverName: $scope.riverName,
                            riverType: $scope.riverType,
                            // waterCode: $scope.waterCode,
							page: $scope.paginationConf.currentPage,
							regionCode:$scope.waterCode == null ? regionCode : $scope.waterCode,
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

				/*表单删除*/
				$scope.riverDelete = function(id) {
					var layerIndex = layer.confirm('确定删除本条数据吗？', {
						title:'提示',
						btn: ['确定', '取消']
					}, function() {
						$http({
							url: moduleService.getServiceUrl() + riverUrl + "/delete",
							method: "delete",
							params: {
								id: id
							}
						}).success(function success(res) {
							if(res.resCode == 0) {
								layer.msg('该河流下存在下级河流或河段，请先删除下级内容！',{time:1000});
							} else {
								layer.msg('删除成功！', {time:1000});
							}
							reGetProducts();
						}, function failure(res) {
							layer.alert('api=>err', {
								skin: 'my-skin',
								closeBtn: 0,
								anim: 4
							});
						});
						layer.close(layerIndex);
					}, function() {

					});
				};

				/*河流新增*/
				$scope.riverAdd = function() {
					routeService.route(1000, false);
				}

				/*河流详情*/
				$scope.riverDetail = function(id) {
					$http({
						url: moduleService.getServiceUrl() +riverUrl + "/detail",
						method: "get",
						params: {
							id: id
						}
					}).success(function(res) {
						if(res.resCode == 1){
							$localStorage.riverDetailData = res.data;
							routeService.route(1001, false);
						}else{
                			layer.msg(res.resMsg || '请求错误,请稍后再试');
						}
					}).error(function(res){
		                layer.msg('服务器异常，请稍后再试');
		            });
				}

				/*河流编辑*/
				$scope.riverEdit = function(id) {
					$http({
						url: moduleService.getServiceUrl() +riverUrl + "/detail",
						method: "get",
						params: {
							id: id
						}
					}).success(function(res) {
						if(res.resCode == 1){
							$localStorage.riverEditData = res.data;
							routeService.route(1002, false);
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
							riverName: $scope.riverName,
                            riverType: $scope.riverType,
                            waterCode: $scope.waterCode,
						}
						params = $.param(params);
						window.location.href = moduleService.getServiceUrl() + riverUrl + '/export?'+params;
						layer.close(index);
					});
	            }

	            $scope.toFileUpload = false;
	            $scope.uploadFile = function(id){
	            	$scope.waterType = 'river';
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