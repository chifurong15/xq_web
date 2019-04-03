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
		'chiefDirectory', ['$localStorage','$scope','$location','$log','$q','$rootScope','globalParam','$window','routeService','moduleService','$http',
		function chiefDirectory($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService,moduleService, $http) {

			/*页面初始化方法*/
			$scope.init = function() {};

			$scope.regionShow = function() {
				$scope.modalTreeInfo = {'treeType': 'region'};
				$("#treeModal").modal('show');
			}
		    $scope.$on('zTreeModalClose', function(event,data) {
		    	$scope.regionName = data.treeNodeName;
		    	$scope.regionCode = data.treeNodeId;
		    })

		  

			/*表单搜索*/
			$scope.riverSearch = function() {
				
                if (($scope.chiefName === '' || $scope.chiefName == null) && ($scope.regionName === '' || $scope.regionName == null) ){
                    $scope.moveIcon = true;
                } else if ($scope.chiefName || $scope.regionName){
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
                    $scope.riverSearch();
                }
            });

			/*监测所属水系数据*/
			$scope.reSet = function(){
				$scope.chiefName = null;
				$scope.grade = null;
				$scope.regionCode = null;
				$scope.regionName = null;
				reGetProducts();
			}

			/*表单分页*/
			var reGetProducts = function() {
				$http({
					url: moduleService.getServiceUrl() + "/watersource/v1/reachChairMan/list",
					method: 'GET',
					params: {
                        name: $scope.chiefName,
                        grade: $scope.grade,
                        regionCode: $scope.regionCode,
						page: $scope.paginationConf.currentPage,
						size: $scope.paginationConf.itemsPerPage,
					},
				}).success(function(res) {
					// console.log(res,'res')
					if(res.resCode == 1){
						$scope.paginationConf.totalItems = res.data.totalNum;
						$scope.moduleList = res.data.records;
						console.log($scope.moduleList,'moduleList')
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

			/*河长新增*/
			$scope.chiefAdd = function() {
				routeService.route(1028, false);
			}

			/*河长编辑*/
			$scope.chiefEdit = function(id) {
				$http({
					url: moduleService.getServiceUrl() +'/watersource/v1/reachChairMan/detail',
					method: "get",
					params: {
						id: id
					}
				}).success(function(res) {
					if(res.resCode == 1){
						$localStorage.chiefEditData = res.data;
						routeService.route(1029, false);
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

            // 河长删除
            $scope.chiefDelete = function(id) {
				var layerIndex = layer.confirm('确定删除本条数据吗？', {
					title:'提示',
					btn: ['确定', '取消'] // 按钮
				}, function() {
					$http({
						url: moduleService.getServiceUrl() +'watersource/v1/reachChairMan/delete',
						method: "delete",
						params: {
							id: id
						}
					}).success(function success(res) {
						if(res.resCode == 0) {
							layer.msg('该河长下存在下级河长，请先删除下级内容！',{time:1000});
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

            // 河长详情
	         $scope.chiefDetail = function(id) {
				$http({
					url: moduleService.getServiceUrl() +'/watersource/v1/reachChairMan/detail',
					method: "get",
					params: {
						id: id
					}
				}).success(function(res) {
					if(res.resCode == 1){
						$localStorage.chiefDetailData = res.data;
						routeService.route(1030, false);
					}else{
            			layer.msg(res.resMsg || '请求错误,请稍后再试');
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	            });
			}


		}
	]);

})(window, angular);