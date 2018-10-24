(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'eventTypeCtrl', [
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
            function eventTypeCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http) {
				
				/**
				 * ==============================================
				 * @name eventType
				 * @author YuanHT | 2018/08/20
				 * @version 
				 * @desc  问题类型统计
				 * ==============================================
				 */
				
				/**
				 *初始化 
				 */
				$scope.init = function(){
					$scope.regionId = $localStorage.userLoginInfo.userInfo.regionId;
					initEventType();
                    chartContainer();
                    regionTreeList()
				}
				var $regionCode, $regionTreeContainer = $('#regionTreeContainer');
                var regionTree, reachTree, treeNode_find, treeNode_id;
                var regionTreeUrl = $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree';
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

                // 捕获行政区域节点被点击
                function regionTreeOnClick(event, treeId, treeNode) {
                    console.log(treeNode);
                    $http({
                        method: 'get',
                        url: regionTreeUrl
                    }).success(
                        function (resp) {
                            console.log(resp);
                            treeNode_find = treeNode.id;
                            $scope.regionId = treeNode.id;
                            $scope.regionName = treeNode.name;
                            $scope.grade = treeNode.grade;
                        })
                }

                // 用于捕获行政区域父节点展开之前的问题回调函数，并且根据返回值确定是否允许展开操作
                function regionTreeOnExpand(treeId, treeNode) {
                    console.log('===========regionTreeOnExpand===========');
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
                            regionCode: $scope.regionId
                        }
                    }).success(function (data) {
                        console.log(data)
                        $scope.regionList = data.data;
                        console.log($scope.regionList);
                        regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, $scope.regionList);
                    }).error(function () {
                    });
                };

                $scope.regionTree = function () {
                	$('#regionTree').modal('show');
                    regionTreeList(regionCode);
                    $scope.regionCode = $scope.regionId;                    
                }
				
				/**
				 * 初始化问题类型数据
				 */
                var eventTypeChart;
				function initEventType() {
                	$http({
	                    method: 'get',
	                    url: $localStorage.serviceUrl_eventMgr + 'eventStatistics/eventTypeStatistics',
	                    params:{
	                    	regionId:$scope.regionId,
	                    	timeQuantum:$scope.timeType
	                    }
	                }).success(function (res) {
	                	console.log(res)
	                	if(res.resCode === 1){
	                		$scope.moduleList = res.data;
	                		eventTypeChart = new typeMgrChart('eventTypeChart', $scope.moduleList);
                        	eventTypeChart.setChart();
	                	}
	                	
	                });
                }
				
				/**
				 * 问题类型图表数据渲染
				 */
				function typeMgrChart(id, data) {
					var colors = ['#33cc99', '#ffa500', '#6600cc', '#5793f3'];
					this.chartData = echarts.init(document.getElementById(id));
                    this.chartDataOption = {
					    tooltip : {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c} ({d}%)"
					    },
					    legend: {
					        orient: 'vertical',
        					x: 'left',
        					top:'10%',
					        data: []
					    },
					    series : [
					        {
					            name: '问题类型',
					            type: 'pie',
					            radius : '55%',
					            center: ['50%', '60%'],
					            data:[],
					            itemStyle: {
					                emphasis: {
					                    shadowBlur: 10,
					                    shadowOffsetX: 0,
					                    shadowColor: 'rgba(0, 0, 0, 0.5)'
					                }
					            }
					        }
					    ]
					};
				
					this.setChart = function () {
						this.chartDataOption.legend.data = [];
						this.chartDataOption.series.data = [];
						for (var i = 0; i < $scope.moduleList.length; i++ ){
							var typeName = $scope.moduleList[i].name;
							var seriesData = {
								value:$scope.moduleList[i].count,
								name:$scope.moduleList[i].name
							};
							this.chartDataOption.series[0].data.push(seriesData);
							this.chartDataOption.legend.data.push(typeName);
						}
                        this.chartData.setOption(this.chartDataOption);
					}
	            }
				
				
				// 图表自适应
                var chartContainer = function () {
                    var chartWidth = $('.tab-content').width();
	                var chartHeight = $(window).height() - 270;
	                $('#eventTypeChart').css('width', chartWidth).css('height', chartHeight);
                }

                window.onresize = function () {
                    chartContainer();
                    eventTypeChart.chartData.resize();
                }
				
				
				/**
				 * 根据行政区划筛选数据 
				 */
				
				$scope.getRegion = function (id) {
                    console.log(id);
                    $scope.regionId = id;
                    initEventType();
                    $('#regionTree').modal('hide');
                }
				
				/**
				 * 根据日期条件筛选数据 
				 */
				
				$scope.isSelected = 1;
				$scope.radioBtn = function(type){
					$scope.timeType = type;
					initEventType();
				}
				
				
				
            }
        ]);

})(window, angular);