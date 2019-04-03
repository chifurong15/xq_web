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

	angular.module("app").controller('reachDirectory', [
		'$localStorage','$scope','$location','$log','$q','$rootScope','globalParam','$window','routeService','moduleService','$http',
		function reachDirectory($localStorage, $scope, $location, $log, $q, $rootScope, globalParam,$window, routeService, moduleService,$http) {

			$scope.classify = 'A'; //河湖库段 A：河段
			/*区域树模态框*/
			$scope.regionShow = function() {
				$scope.modalTreeInfo = {'treeType': 'region'};
				$("#treeModal").modal('show');
			}
		    $scope.$on('zTreeModalClose', function(event,data) {
		    	$scope.regionName = data.treeNodeName;
		    	$scope.regionCode = data.treeNodeId;
		    })

		    //河湖库级别
			$scope.riverLevel = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() +riverUrl + "/riverType",
					params: {
						type: '116'
					},
				}).success(
					function(res) {
						$scope.riveLevelList = res.data;
						
					}
				);
			}

			//搜索
			$scope.find = function() {
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
            /*重置*/
			$scope.reSet = function(){
				$scope.reachName = null;
				$scope.regionName = null;
				$scope.chairmanName = null;
				$scope.grade = null;
				$scope.regionCode = regionCode;
				reGetProducts();
			}

			// 表单分页
			var regionCode =  $localStorage.userLoginInfo && $localStorage.userLoginInfo.userInfo.regionId ? $localStorage.userLoginInfo.userInfo.regionId : null;
			$scope.regionCode = regionCode;
			var reGetProducts = function() {
				$http({
					url: moduleService.getServiceUrl() +reachUrl + "/list",
					method: 'GET',
					params: {
                        reachName: $scope.reachName,
                        chairmanName: $scope.chairmanName,
                        regionCode: $scope.regionCode,
                        grade: $scope.grade,
                        classify: $scope.classify,
						page: $scope.paginationConf.currentPage,
						size: $scope.paginationConf.itemsPerPage,
						isNext: true,
						isGroupBy: false,
						orderBy:'grade'
					},
				}).success(function(res) {
					$scope.paginationConf.totalItems = res.data.total;
					$scope.moduleList = res.data.list;
					console.log($scope.moduleList,'moduleList')
					console.log($scope.grade,'grade')
				

				}).error(function(error) {});
			};

			// 配置分页基本参数
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
			// 通过$watch currentPage和itemperPage,当他们一变化的时候，重新获取数据条目
			$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

            $scope.dataExport = function(){
            	layer.confirm('是否导出数据？', {
					title:'提示',
					btn: ['确定', '取消'] // 按钮
				}, function(index) {
					var params = {
						isNext: true,
						isGroupBy: false,
                        reachName: $scope.reachName,
                        regionCode: $scope.regionCode,
                        classify: $scope.classify,
                        chairmanName: $scope.chairmanName,
                        grade: $scope.grade,
					}
					params = $.param(params);
					console.log(params,'params')
					// window.location.href = moduleService.getServiceUrl() + reachUrl +'/export?'+params;
					layer.close(index);
				});
            }
		}
	]);
})(window, angular);