(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'fenxintongjiDetailCtrl',
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
				function fenxintongjiDetailCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/resumption';
                    // var apiPrefix = 'http://10.0.9.116:8081/resumption';
					
	                $scope.init = function () {
	                	$scope.regionId = null;

						var params = globalParam.getter().fenxiParams || {};
	                	$scope.regionId = params.regionId;
	                	$scope.startTime = params.startTime;
	                	$scope.endTime = params.endTime;
	                	$scope.isSelected = params.type || 2;
	                	$scope.type = params.type || 2;
	                	$scope.grade = params.grade;	                	
	                	getDataList();
	                	regionTreeList();
	                }
	                var $regionCode, $regionTreeContainer = $('#regionTreeContainer');
	                var regionTree, reachTree, treeNode_find, treeNode_id;
//	                var regionTreeUrl = 'http://117.8.229.5:9000/information/v1/administrativeRegion/regionTree';
	                
	                
	                
	                var regionTreeUrl = $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree';
	                
	                
	                //返回
					$scope.goBack=function(){
						history.back(-1);
					}	
	                

	                // 开始时间
	                var startTime = $('#startTime').datetimepicker({
	                    format: 'YYYY-MM-DD',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    var result = new moment(c.date).format('YYYY-MM-DD');
	                    $scope.startTime = result;
	                    $scope.$apply();
	                });
	
	                // 结束时间
	                var endTime = $('#endTime').datetimepicker({
	                    format: 'YYYY-MM-DD',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    var result = new moment(c.date).format('YYYY-MM-DD');
	                    $scope.endTime = result;
	                    $scope.$apply();
	                });

	                //动态设置最小值
	                startTime.on('dp.change', function (e) {
	                    endTime.data('DateTimePicker').minDate(e.date);
	                });
	                //动态设置最大值
	                endTime.on('dp.change', function (e) {
	                    startTime.data('DateTimePicker').maxDate(e.date);
	                });

	                // 行政区域树配置
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
	
	                // 捕获行政区域节点被点击
	                function regionTreeOnClick(event, treeId, treeNode) {
	                    $http({
	                        method: 'get',
	                        url: regionTreeUrl
	                    }).success(
	                        function (resp) {
	                            treeNode_find = treeNode.id;
	                            $scope.regionId = treeNode.id;
	                            $scope.regionName = treeNode.name;
	                            $scope.grade = treeNode.grade;
	                        })
	                }
	
	                // 用于捕获行政区域父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作
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
	                    }).success(
	                        function (res) {
	                            console.log(res);
	                            regionTree.addNodes(treeNode, res.data, true);
	                        }
	                    );
	                }
	
	                // 区域树获取
	                var regionTreeList = function () {
	                    $http({
	                        method: 'get',
	                        url: regionTreeUrl,
	                        params: {
	                            regionCode: $scope.regionId || '120100000000'
	                        }
	                    }).success(function (data) {
	                        $scope.regionList = data.data;
	                        regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, $scope.regionList);
	                    }).error(function () {
	                    });
	                };
	
	                $scope.regionTree = function () {
	                    $('#regionTree').modal('show');
	                    regionTreeList(regionCode);
	                    $scope.regionCode = $scope.regionId;
	                }
	
	                // 模态框行政区域选择
	                $scope.getRegion = function (id) {
	                    $('#regionTree').modal('hide');
	                }
	                
					// 单选按钮组
	                $scope.typeList = [
	                    {"id": 1, "typeName": "本年"},
	                    {"id": 2, "typeName": "本月"},
	                    {"id": 3, "typeName": "上月"}
	                ];
	                $scope.radioBtn = function(type){
	                    $scope.type = type;
	                    getDataList();
	                }
	                
	                // 搜索
	                $scope.search = function () {
	                	getDataList(1);
	                }

	                // 获取列表
	                var chartList;
	                function getDataList (isSearch) {
	                	var params = {
	                		pageNumber: $scope.paginationConf.currentPage,
							pageSize: $scope.paginationConf.itemsPerPage,
                            regionId: $scope.regionId,
                            grade: $scope.grade,
                            type: $scope.type
	                	};
	                	if (isSearch) {
	                		params.startTime = $scope.startTime;
							params.endTime = $scope.endTime;
	                	} else {
	                		params.type = $scope.type || 2
	                	}
	                	
	                    $http({
	                        url: apiPrefix + '/v1/resumption/findPersonReachNum',
	                        method: 'get',
	                        params: params
	                    }).success(function (res) {
	                        $scope.dataList = res.data.list;
                    		$scope.paginationConf.totalItems = res.data.total;	                        
	                    }).error(function (error) {
	
	                    })
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
	                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getDataList);
	                
	                

			} ]);
})(window, angular);
