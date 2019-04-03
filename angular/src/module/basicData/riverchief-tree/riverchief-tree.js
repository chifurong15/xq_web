(function (window, angular) {
	'use strict';
	var app = angular.module("app");
	app.filter("trustHtml", function ($sce) {
		return function (input) {
			return $sce.trustAsHtml(input);
		}
	});
	app.controller(
		'chairmanTreeCtrl', [
			'$localStorage',
			'$scope',
			'$location',
			'$log',
			'$q',
			'$rootScope',
			'globalParam',
			'$window',
			'routeService',
			'moduleService',
			'$http',
			function chairmanTreeCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, moduleService, $http) {
				
				/**
				 * ================================
				 * 描述说明
				 * @author yuanhaitao</br>2018/09/11
				 * @module 河长树 
				 * @version 3.0.0
				 * ================================
				 */
				
				
				var modulePrefix = "/watersource",
				 	reachUrl = "/v1/reachChairMan/";
				/**
				 *初始化 
				 */
				$scope.init = function(){
                    regionTreeList()
				}
				var basicUrl = "/information/v1/administrativeRegion",
				 	regionTree, 
				 	riverDutyTree,
				 	regionTreeUrl = moduleService.getServiceUrl()  + basicUrl + "/regionTree";
                
				/**
				 *行政区域树配置 
				 */
                var regionTreeSetting = {
                    data: {
                        simpleData: {enable: true},
                        keep: {parent: true}
                    },
                    view: {
                        nameIsHTML: true,
                        expandSpeed: 'slow',
                        dblClickExpand: false,
                        txtSelectedEnable: false
                    },
                    callback: {
                        beforeExpand: regionTreeOnExpand,
                        onClick: regionTreeOnClick
                    }
                };

                /**
                 * 捕获行政区域节点被点击
                 * @param {Object} event
                 * @param {Object} treeId
                 * @param {Object} treeNode
                 */
                function regionTreeOnClick(event, treeId, treeNode) {
                    $http({
                        method: 'get',
                        url: regionTreeUrl
                    }).success(
                        function (resp) {
                            console.log(resp);
                            $scope.regionId = treeNode.id;
                            $scope.regionName = treeNode.name;
                            $scope.grade = treeNode.grade;
                            riverDutyTreeLoading();
                        })
                }

                /**
                 * 用于捕获行政区域父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作
                 * @param {Object} treeId
                 * @param {Object} treeNode
                 */
                function regionTreeOnExpand(treeId, treeNode) {
                    var cnodes = treeNode.children;
                    if (cnodes != null && cnodes.length > 0) {
                        return;
                    }
                    $http({
                        method: 'get',
                        url: regionTreeUrl,
                        params: {
                            parentCode: treeNode.id
                        },
                    }).success(function (res) {
                        regionTree.addNodes(treeNode, res.data, true);
                    });
                }

                /**
                 * 区域树获取
                 */
                function regionTreeList () {
                    $http({
                        method: 'get',
                        url: regionTreeUrl,
                        params: {
                            regionCode: $scope.regionId
                        }
                    }).success(function (res) {
                        if(res.resCode == 1){
                        	regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, res.data);
                            var node = regionTree.getNodes()[0];
                            regionTree.expandNode(node, true, false, true, true);
                        }else{
                        }
                    }).error(function () {
                    });
                };

				/**
				 * 河道 zTree节点补充设置
				 */
                var riverDutyTreeSetting = {
                    edit: {
                        enable: false
                    },
                    view: {
                        nameIsHTML: true,
                        expandSpeed: 'slow',
                        dblClickExpand: false,
                        txtSelectedEnable: false
                    },
                    callback: {
                        onClick: reachNodesOnClick,
                        onExpand: reachNodeExpand
                    }
                };

                /**
                 * 河长节点异步请求成功回调函数
                 * @param {Object} event
                 * @param {Object} treeId
                 * @param {Object} treeNode
                 */
                function reachNodeExpand(event, treeId, treeNode) {
                    var cnodes = treeNode.children;
                    if (cnodes != null && cnodes.length > 0) {
                        return;
                    }
                    $http({
                        method: "get",
                        url: moduleService.getServiceUrl() + modulePrefix + reachUrl + '/findUserNodesByCondition',
                        params: {
                            regionId: $scope.regionId,
                            roleId: treeNode.id
                        },
                    }).success(function (res) {
                        riverDutyTree.addNodes(treeNode, res.data, true);
                    });
                }
               	/**
               	 * 河道节点异步请求成功回调函数
               	 * @param {Object} event
               	 * @param {Object} treeId
               	 * @param {Object} treeNode
               	 */
                function reachNodesOnClick(event, treeId, treeNode) {
                    if(treeNode.isParent){
                        layer.msg('请选择相关履职人员',{time:2000});
                        return
                    }else{
                        var riverDutyId = treeNode.id;
                        $scope.reachLevel = treeNode.reachLevel;
                        // getDutyDetail(riverDutyId);
                        getDutyOfficer(riverDutyId);
                        $scope.$apply();
                    }
                }
                /**
                 * 河长树加载
                 */
                function riverDutyTreeLoading() {
                    $http({
                        method: 'get',
                        url: moduleService.getServiceUrl() + modulePrefix + reachUrl +'/findRoleNodesByCondition',
                        params: {
                            regionId: $scope.regionId
                        },
                    }).success(function (res) {
                        riverDutyTree = $.fn.zTree.init($("#riverDutyTreeContainer"), riverDutyTreeSetting, res.data);
                    });
                }

				/**
				 * 河长详情
				 */
				// function getDutyDetail(id){
				// 	$http({
				// 		url: moduleService.getServiceUrl() + modulePrefix + reachUrl +"/getUserDetail",
				// 		method: 'GET',
				// 		params: {
    //                         id: id
				// 		},
				// 	}).success( function(res) {
				// 		if(res.resCode == 1){
				// 			console.log(res.data)
				// 			$scope.reachInfo = res.data;
				// 		}else{
				// 			layer.msg('服务器异常，请稍后再试');
				// 		}
				// 	}).error(function(res) {
				// 		layer.msg('服务器异常，请稍后再试');
				// 	});
				// }
				
				/**
				 * 履职人员
				 */
				function getDutyOfficer(id){
					$http({
						url: moduleService.getServiceUrl() + modulePrefix + reachUrl +"/getUserReach",
						method: 'GET',
						params: {
							page: $scope.paginationConf.currentPage,
							size: $scope.paginationConf.itemsPerPage,
                            userId: id
						},
					}).success( function(res) {
						if(res.resCode == 1){
							$scope.paginationConf.totalItems = res.data.total;
							$scope.reachDutyList = res.data.list;
						}else{
							layer.msg('服务器异常，请稍后再试');
						}
					}).error(function(res) {
						layer.msg('服务器异常，请稍后再试');
					});
				}
				
				/**
				 * 配置分页基本参数
				 */
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
				$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getDutyOfficer);
				
			}
		]);

})(window, angular);