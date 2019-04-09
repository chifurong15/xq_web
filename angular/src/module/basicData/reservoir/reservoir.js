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
	angular.module("app").controller('reservoirCtrl', ['$localStorage','$scope','$location','$rootScope','routeService','moduleService','$http',
		function reservoirCtrl($localStorage, $scope,$location, $rootScope,routeService, moduleService,$http) {
			$scope.init = function(){}

			/*区域树模态框*/
			$scope.regionShow = function() {
				$scope.modalTreeInfo = {'treeType': 'region'};
				$("#treeModal").modal('show');
			}
		    $scope.$on('zTreeModalClose', function(event,data) {
		    	$scope.regionName = data.treeNodeName;
		    	$scope.regionCode = data.treeNodeId;
		    })

			//水库类型
			$scope.reservoirTypeList = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() + riverUrl + "/riverType",
					params: {
						type: '108'
					},
				}).success(function(res) {
					$scope.reservoirTypes = res.data;
				});
			}

			//向上移动
			$scope.moveUp = function(id){
				$http({
					url: moduleService.getServiceUrl() +reservoirUrl + "/sortOrder",
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
					url: moduleService.getServiceUrl() +reservoirUrl + "/sortOrder",
					method: 'GET',
					params: {
                        id:id,
                        status:1
					},
				}).success(function(res) {
                   if(res.resCode == 1){
						reGetProducts();
                	}else if(res.resCode == 0) {
                        layer.msg('已经是最后一个数据了，不能再向下移动了！');
                        return;
					}else{
						layer.msg(res.resMsg || '请求错误,请稍后再试');
					}
                }).error(function(error) {});
			}

			//重置
			var regionCode =  $localStorage.userLoginInfo && $localStorage.userLoginInfo.userInfo.regionId ? $localStorage.userLoginInfo.userInfo.regionId : null;
			$scope.regionCode = regionCode;
			$scope.reSet = function(){
				$scope.reservoirName = null;
				$scope.reservoirType = null;
				$scope.regionName = null;
				$scope.regionCode = regionCode;
				reGetProducts();
			}
			// 表单分页
			var reGetProducts = function() {
				$http({
					url: moduleService.getServiceUrl() +reservoirUrl + "/list",
					method: 'GET',
					params: {
						page: $scope.paginationConf.currentPage,
						size: $scope.paginationConf.itemsPerPage,
                        reservoirName: $scope.reservoirName,
                        reservoirType: $scope.reservoirType,
                        regionCode: $scope.regionCode

					},
				}).success(function(res) {
					$scope.paginationConf.totalItems = res.data.total;
					$scope.moduleList = res.data.list;
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

			//搜索
            $scope.moveIcon = true;
			$scope.find = function() {
                if (($scope.reservoirType =='' || $scope.reservoirType == null) && $scope.reservoirName =='' && $scope.regionName =='') {
                    $scope.moveIcon = true;
                }else if ($scope.reservoirName || $scope.reservoirType || $scope.regionName) {
                    $scope.moveIcon = false;
                }else {
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

			// 表单删除
			$scope.moduleDelete = function(id) {
				var layerIndex = layer.confirm('确定删除本条数据吗？', {
					title:'提示',
					btn: ['确定', '取消']// 按钮
				}, function() {
					$http({
						url: moduleService.getServiceUrl() +reservoirUrl + "/delete",
						method: "delete",
						params: {
							id: id
						}
					}).success(function(res) {
						if(res.resCode == 0) {
							layer.msg('该水库下存在下级内容，请先删除下级内容！',{time:1000});
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
			// 水库新增
			$scope.reservoirAdd = function() {
				routeService.route(1012, false);
			}
			// 水库详情
			$scope.reservoirDetail = function(id) {
				$http({
					url: moduleService.getServiceUrl() +reservoirUrl + "/detail",
					method: "get",
					params: {
						id: id
					}
				}).success(function(res) {
					if(res.resCode == 1){
						$localStorage.reservoirDatailData = res.data;
						routeService.route(1013, false);
					}else{
            			layer.msg(res.resMsg || '请求错误,请稍后再试');
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	            });
			}
			// 水库编辑
			$scope.reservoirEdit = function(id) {
				$http({
					url: moduleService.getServiceUrl() +reservoirUrl + "/detail",
					method: "get",
					params: {
						id: id
					}
				}).success(function(res) {
					if(res.resCode == 1){
						$localStorage.reservoirEditData = res.data;
						routeService.route(1014, false);
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
						reservoirName: $scope.reservoirName,
                        reservoirType: $scope.reservoirType,
                        regionCode: $scope.regionCode
					}
					params = $.param(params);
					window.location.href = moduleService.getServiceUrl() + reservoirUrl + '/export?'+params;
					layer.close(index);
				});
            }

            $scope.toFileUpload = false;
            $scope.uploadFile = function(id){
            	$scope.waterType = 'reservoir';
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