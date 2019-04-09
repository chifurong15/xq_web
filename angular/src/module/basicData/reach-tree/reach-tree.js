(function (window, angular) {
	'use strict';
	var app = angular.module("app");
	app.filter("trustHtml", function ($sce) {
		return function (input) {
			return $sce.trustAsHtml(input);
		}
	});
	app.controller(
		'reachTreeCtrl', [
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
			function reachTreeCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, moduleService, $http) {
				
				/**
				 * ================================
				 * 描述说明
				 * @author yuanhaitao</br>2018/09/11
				 * @module 河道树 
				 * @version 3.0.0
				 * ================================
				 */
				
				
				/**
				 *初始化 
				 */
				var modulePrefix = "/watersource",
				 	reachUrl = "/v1/reach/";
				$scope.init = function(){
                    regionTreeList()
				}
				var basicUrl = "/v1/drainageBasin",
				 	regionTree, 
				 	reachTree,
				 	regionTreeUrl = moduleService.getServiceUrl() + modulePrefix + basicUrl + "/tree";
                
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
                    }).success(function (resp) {
                        $scope.regionId = treeNode.id;
                        $scope.regionName = treeNode.name;
                        $scope.grade = treeNode.grade;
                        reachTreeLoading();
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
                	console.log(132)
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
                var reachTreeSetting = {
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
                 * 河道节点异步请求成功回调函数
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
                        url: moduleService.getServiceUrl() + modulePrefix + '/v1/reach/findReachNodesByCondition',
                        params: {
                            regionId: $scope.regionId,
                            reachId: treeNode.id,
                            isChildrenNodes: true
                        },
                    }).success(function (res) {
                        reachTree.addNodes(treeNode, res.data, true);
                    });
                }
               	/**
               	 * 河道节点异步请求成功回调函数
               	 * @param {Object} event
               	 * @param {Object} treeId
               	 * @param {Object} treeNode
               	 */

                function reachNodesOnClick(event, treeId, treeNode) {
                    var reachId = treeNode.id;
                    $scope.reachId = treeNode.id;
                    $scope.reachLevel = treeNode.reachLevel;
                    reachDetail(reachId);
                    $scope.$apply();
                }
                /**
                 * 河道树加载
                 */
                function reachTreeLoading() {
                    $http({
                        method: 'get',
                        url: moduleService.getServiceUrl() + modulePrefix + '/v1/reach/findReachNodesByCondition',
                        params: {
                            regionId: $scope.regionId
                        },
                    }).success(function (res) {
                        reachTree = $.fn.zTree.init($("#reachTreeContainer"), reachTreeSetting, res.data);
                    });
                }

				/**
				 * 河道详情 | 履职人员
				 */
				function reachDetail(id){
					$http({
						url: moduleService.getServiceUrl() + modulePrefix + reachUrl +"/detail",
						method: 'GET',
						params: {
                            id: id
						},
					}).success( function(res) {
						if(res.resCode == 1){
							$scope.reachInfo  = res.data;
                            $scope.reachDutyList = res.data.userList;
						}else{
							layer.msg('服务器异常，请稍后再试');
						}
					}).error(function(res) {
						layer.msg('服务器异常，请稍后再试');
					});
				}
			}
		]);

})(window, angular);