(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'eventStatusCtrl', [
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
            function eventStatusCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http) {

				/**
				 * ==============================================
				 * @name eventType
				 * @author YuanHT | 2018/08/20
				 * @version 
				 * @desc  问题处理统计
				 * ==============================================
				 */
				
				/**
				 *初始化 
				 */
				$scope.init = function(){
					$scope.regionId = $localStorage.userLoginInfo.userInfo.regionId;
					initEventStatus();
                    chartContainer();
                    regionTreeList()
				}
				var $regionCode, $regionTreeContainer = $('#regionTreeContainer');
                var regionTree, reachTree, treeNode_find, treeNode_id;
                var regionTreeUrl = $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree';
				/**
				 *日期条件选择 
				 */
				
				$scope.isSelected = 'y';
				$scope.radioBtn = function(type){
					console.log(type)
				}
				
				/**
				 *时间选择
				 */
                var datepicker1 = $('#startTime').datetimepicker({
			        format: 'YYYY-MM-DD',
			        locale: moment.locale('zh-cn')
			    }).on('dp.change', function (e) {
			        var result = new moment(e.date).format('YYYY-MM-DD');
			        $scope.startTime = result;
			        $scope.$apply();
    			});
    			
    			var datepicker2 = $('#endTime').datetimepicker({
			        format: 'YYYY-MM-DD',
			        locale: moment.locale('zh-cn')
			    }).on('dp.change', function (e) {
			        var result = new moment(e.date).format('YYYY-MM-DD');
			        $scope.endTime= result;
			        $scope.$apply();
			    });
 				
 				//动态设置最小值
				datepicker1.on('dp.change', function (e) {
			        datepicker2.data('DateTimePicker').minDate(e.date);
			    });
			    //动态设置最大值
			    datepicker2.on('dp.change', function (e) {
			        datepicker1.data('DateTimePicker').maxDate(e.date);
			    });
				
				
				/**
				 *列表|图表切换
				 */
				$scope.i = 0;
				$scope.dataToggle = function(index){
					console.log(index)
					$scope.i = index;
					if(index === 0){
						$scope.tableChart = true;
					}else{
						$scope.tableChart = false;
					}
				}
				
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
				 * 初始化问题状态数据
				 */
                var eventStatusChart;
				function initEventStatus() {
                	$http({
	                    method: 'get',
	                    url: $localStorage.serviceUrl_eventMgr + 'eventStatistics/eventHandlingSituation',
	                    params:{
	                    	regionId:$scope.regionId,
	                    	timeQuantum:$scope.timeType
	                    }
	                }).success(function (res) {
	                	console.log(res)
	                	if(res.resCode === 1){
	                		$scope.moduleList = res.data;
							eventStatusChart = new statusMgrChart('eventStatusChart', $scope.moduleList);
                        	eventStatusChart.setChart();
	                	}
	                	
	                });
                }
				
				/**
				 * 问题类型图表数据渲染
				 */
				function statusMgrChart(id, data) {
					var colors = ['#33cc99', '#ffa500', '#6600cc', '#5793f3'];
					this.chartData = echarts.init(document.getElementById(id));
                    this.chartDataOption = {
					    color: colors,
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'shadow'
					        }
					    },
					    grid: {
					        top: '10%',
                            left: '5%',
                            right: '5%',
                            bottom: '5%',
                            containLabel: true
					    },
					    legend: {
	        				data:['结案问题数','问题总数','新增问题数','结案率']
					    },
					    xAxis:{
					            type: 'category',
//					            axisTick: {
//					                alignWithLabel: true
//					            },
								axisLabel: {
	                                textStyle: {
	                                    color: colors[0]
	                                }
	                            },
	                            splitLine: {
	                                show: false //不显示分割线
	                            },
					            data: []
					       },
					    yAxis: [
					        {
					            type: 'value',
					            name: '次数',
                                splitLine: {show: false}
//					            min: 0,
//					            position: 'left'
//					            axisLine: {
//					                lineStyle: {
//					                    color: colors[0]
//					                }
//					            },
//					            axisLabel: {
//					                formatter: '{value} '
//					            }
					        },
					        {
					            type: 'value',
					            name: '结案率',
//					            min: 0,
					            position: 'right',
//					            axisLine: {
//					                lineStyle: {
//					                    color: colors[3]
//					                }
//					            },
					            axisLabel: {
					                formatter: '{value} %'
					            }
					        }
					    ],
					    series: [
					        {
					            name:'结案问题数',
					            type:'bar',
					            data:[],
					            barWidth: 15,
                                itemStyle: {
                                    normal: {
                                        color: colors[0],
                                        barBorderRadius: [10, 10, 0, 0]
                                    }
                                }
					        },
					        {
					            name:'问题总数',
					            type:'bar',
                                data:[],
					            barWidth: 15,
					            itemStyle: {
                                    normal: {
                                        color: colors[1],
                                        barBorderRadius: [10, 10, 0, 0]
                                    }
                                }
					        },
					        {
					            name:'新增问题数',
					            type:'bar',
					            data:[],
					            barWidth: 15,
                                itemStyle: {
                                    normal: {
                                        color: colors[2],
                                        barBorderRadius: [10, 10, 0, 0]
                                    }
                                }
					        },
					        {
					            name:'结案率',
					            type:'line',
					            yAxisIndex: 1,
					            data:[]
					        }
					    ]
					};
				
					this.setChart = function () {
						this.chartDataOption.xAxis.data = [];
						for (var i = 0; i < $scope.moduleList.length; i++ ){
							var regionName = $scope.moduleList[i].region;
							var finishCount = $scope.moduleList[i].finishCount;
							var totalCount = $scope.moduleList[i].totalCount;
							var addCount = $scope.moduleList[i].addCount;
							var percent = $scope.moduleList[i].percent;
							this.chartDataOption.series[0].data.push(finishCount);
							this.chartDataOption.series[1].data.push(totalCount);
							this.chartDataOption.series[2].data.push(addCount);
							this.chartDataOption.series[3].data.push(percent);
							this.chartDataOption.xAxis.data.push(regionName);
						}
                        this.chartData.setOption(this.chartDataOption);
	            	}
	            }
				
				
				// 图表自适应
                var chartContainer = function () {
                    var chartWidth = $('.tab-content').width();
	                var chartHeight = $(window).height() - 270;
	                $('#eventStatusChart').css('width', chartWidth).css('height', chartHeight);
                }

                window.onresize = function () {
                    chartContainer();
                    eventStatusChart.chartData.resize();
                }
				
				/**
				 * 根据行政区划筛选数据 
				 */
				
				$scope.getRegion = function (id) {
                    console.log(id);
                    $scope.regionId = id;
                    initEventStatus();
                    $('#regionTree').modal('hide');
                }
				
				/**
				 * 根据日期条件筛选数据 
				 */
				
				$scope.isSelected = 1;
				$scope.radioBtn = function(type){
					$scope.timeType = type;
					initEventStatus();
				}
				
				
            }
        ]);

})(window, angular);