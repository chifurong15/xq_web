(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'fenxintongjiIndexCtrl',
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
				function fenxintongjiIndexCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/resumption';
                    // var apiPrefix = 'http://10.0.9.116:8081/resumption';
                    $scope.regionId = $localStorage.userLoginInfo.userInfo.regionId;
					
	                $scope.init = function () {

						// 区等级
						//$scope.regionGrade = 2;
                    	chartContainer();
	                	getDataList();
	                	regionTreeList();
	                	getGrade();	

	                }
	                var $regionCode, $regionTreeContainer = $('#regionTreeContainer');
	                var regionTree, reachTree, treeNode_find, treeNode_id;
//	                var regionTreeUrl = 'http://117.8.229.5:9000/information/v1/administrativeRegion/regionTree';
	                
	                
	                
	                var regionTreeUrl = 'http://117.8.229.5:9000/information/v1/administrativeRegion/regionTree';
	                
	                
	                //获取用户等级
	                function getGrade(){
	                	$http({
	                        url: apiPrefix + '/v1/resumption/findCurrentUserGrade',
	                        method: 'get'              
	                    }).success(function (res) {
	                        $scope.regionGrade = res.data;	                       
	                    }).error(function (error) {
	
	                    })
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
	                    console.log(treeNode);
	                    $http({
	                        method: 'get',
	                        url: regionTreeUrl
	                    }).success(function (resp) {
	                            console.log(resp);
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
	
	                // 模态框行政区域选择
	                $scope.getRegion = function (id) {
	                    console.log(id);
	                    $('#regionTree').modal('hide');
	                }
	                
					// 单选按钮组
	                $scope.typeList = [
	                    {"id": 1, "typeName": "本年"},
	                    {"id": 2, "typeName": "本月"},
	                    {"id": 3, "typeName": "上月"}
	                ];
	                $scope.isSelected = '2';
	                $scope.radioBtn = function(type){
	                    $scope.type = type;
	                    getDataList();
	                }
	                
	                // 搜索
	                $scope.search = function () {
	                	getDataList(1);
	                }
	                // 查看
	                $scope.view = function (regionId, grade) {
						globalParam.setter({
							fenxiParams: {
								regionId: regionId,
								type: $scope.type,
								grade: grade,
								startTime: $scope.startTime,
								endTime: $scope.endTime
							}
						})
						routeService.route('5-2', false);
	                }

	                // 获取列表
	                var chartList;
	                function getDataList (isSearch) {
	                	var params = {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            regionId: $scope.regionId
	                	};
	                	if (isSearch) {
	                		params.startTime = $scope.startTime;
							params.endTime = $scope.endTime;
	                	} else {
	                		params.type = $scope.type || 2
	                	}
	                	
	                    $http({
	                        url: apiPrefix + '/v1/resumption/listReachPatrolNumStatistic',
	                        method: 'get',
	                        params: params
	                    }).success(function (res) {
	                    	if(res.data.list){
                                $scope.dataList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                                chartList = new patrolMgrChart($scope.dataList);
                                chartList.setChart();
                            }

	                    }).error(function (error) {
	
	                    })
	                };
					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}					
					
					
	                // 河长巡河柱状图
	                function patrolMgrChart(data) {
	                	this.chartInstance = [];
	                	// 区等级
	                	//$scope.regionGrade = data[0] && data[0].regionGrade;
						if ($scope.regionGrade == 2) {
							this.chartInstance[0] = echarts.init($('#chart1')[0]);
	                		this.chartInstance[1] = echarts.init($('#chart2')[0]);
	                		this.chartInstance[2] = echarts.init($('#chart3')[0]);
						}else if ($scope.regionGrade == 3) {
	                		$('#chart1').hide();
	                		this.chartInstance[0] = echarts.init($('#chart2')[0]);
	                		this.chartInstance[1] = echarts.init($('#chart3')[0]);
	                	} else if ($scope.regionGrade == 4) {
	                		$('#chart1').hide();
	                		$('#chart2').hide();
	                		this.chartInstance[0] = echarts.init($('#chart3')[0]);
	                	} else if ($scope.regionGrade == 5) {
	                		$('#chart1').hide();
	                		$('#chart2').hide();
	                		$('#chart3').hide();
	                	}
	                	
//	                	regionGrade == 3 ? 'rgb(85,205,246)' : (regionGrade == 4 ? 'rgb(246,231,126)' : 'rgb(140,151,203)')
	                    this.chartOption = {
						    title: {
						        text: '',
						        left: 'center'						        
						    },	
						    toolbox: {
						        feature: {
						            dataView: {show: true, readOnly: false},
						            restore: {show: true},
						            saveAsImage: {show: true}
						        }
						    },
	    					legend: {
        						top: 40,
						        data: ['已巡查次数', '应巡查次数', '巡查达标率'],
						    },
						    grid: {
								top: '50%'
						    },
						    tooltip: {
						    	trigger:'axis',
						        formatter:'{a0}: {c}<br />{a1}: {c1}<br />{a2}: {c2}%'
						    },
						    xAxis: {
						        data: [],
						        silent: false,
						        axisLine: {onZero: true},
						        splitLine: {show: false},
						        splitArea: {show: false}
						    },
						    yAxis: [
						        {
						            type: 'value',
						            name: '次数',
						            splitLine: {show: false}
						        },
						        {
						            type: 'value',
						            name: '达标率',
						            axisLabel: {
						                formatter: '{value} %'
						            }
						        }
						    ],
						    series: [
						        {
						            name: '已巡查次数',
						            type: 'bar',
						            stack: '总数',
	                                barWidth: 30,
						            data: [],
	                                itemStyle: {
	                                    normal: {
	                                        color: 'rgb(143,195,31)'
	                                    }
	                                },
						        },
						        {
						            name: '应巡查次数',
						            type: 'bar',
						            stack: '总数',
	                                data: [],
	                                barWidth: 30,
	                                itemStyle: {
	                                    normal: {
	                                        color: 'rgb(85,205,246)'
	                                    }
	                                }
						        },
						        {
						            name: '巡查达标率',
						            type: 'line',
	                                yAxisIndex: 1,
	                                data: [],
	                                itemStyle: {
	                                    normal: {
	                                        color: 'rgb(63,182,117)'	                                        
	                                    }	                                     
	                                }
						        }
						    ]
						}
	                    this.setChart = function () {
	                    	
	                        var xAxis = [];
	                        var series = {
	                        	0: {
	                        		title: '村级河长巡河情况',
	                        		series0: [],
	                        		series1: [],
	                        		series2: []
	                        	},
	                        	1: {
	                        		title: '镇级河长巡河情况',
	                        		series0: [],
	                        		series1: [],
	                        		series2: []
	                        	},
	                        	2: {
	                        		title: '区级河长巡河情况',
	                        		series0: [],
	                        		series1: [],
	                        		series2: []
	                        	}
	                        };
														
	                        for (var i = 0; i < $scope.dataList.length; i++) {
	                        	var item = $scope.dataList[i];
	                        	
	                            xAxis.push(item.regionName);	                           
	                           	
	                            if ($scope.regionGrade == 2) {
		                            series[2].series0.push(item.countyHasPatrolNum);
		                            series[2].series1.push(item.countyNeedPatrolNum);		                           
		                            series[2].series2.push(item.countyPatrolRate);
		                            
		                            series[1].series0.push(item.townHasPatrolNum);
		                            series[1].series1.push(item.townNeedPatrolNum);		                            
		                            series[1].series2.push(item.townPatrolRate);
		                            
		                            series[0].series0.push(item.villageHasPatrolNum);
		                            series[0].series1.push(item.villageNeedPatrolNum);		                            
		                            series[0].series2.push(item.villagePatrolRate);
	                            }

	                            if ($scope.regionGrade == 3) {	                            	
		                            series[1].series0.push(item.townHasPatrolNum);
		                            series[1].series1.push(item.townNeedPatrolNum);		                           
		                            series[1].series2.push(item.townPatrolRate);
		                            
		                            series[0].series0.push(item.villageHasPatrolNum);
		                            series[0].series1.push(item.villageNeedPatrolNum);	                            
		                            series[0].series2.push(item.villagePatrolRate);
	                            }
	                            
	                            if ($scope.regionGrade == 4) {	                            	
		                            series[0].series0.push(item.villageHasPatrolNum);
		                            series[0].series1.push(item.villageNeedPatrolNum);		                            
		                            series[0].series2.push(item.villagePatrolRate);
	                            }
	                            
	                        }
	                           
	                        for (var j = 0; j < this.chartInstance.length; j ++) {
	                        	var chartData = JSON.parse(JSON.stringify(this.chartOption));
	                        	chartData.xAxis.data = /*series[j].*/xAxis;
                        		chartData.series[0].data = series[j].series0;
	                        	chartData.series[1].data = series[j].series1;	                        	
	                        	chartData.series[2].data = series[j].series2;	                        	
	                        	chartData.title.text = series[j].title;
	                        	this.chartInstance[j].setOption(chartData);
	                        }
	                    }
	                }
	
	                // 图表自适应
	                function chartContainer () {
	                    var chartWidth = $('.tab-content').width();
	                    var chartHeight = $(window).height() - 240;
	                    //console.log($('.tj-chart-con'))
	                    $('.tj-chart-con').css({
	                    	width: chartWidth,
	                    	height: chartHeight
	                    })
	                }
	
	                window.onresize = function () {
	                    chartContainer();
	                    if(this.chartInstance){
	                    	 for (var i = 0;i < chartList.chartInstance.length; i ++) {
		                    	chartList.chartInstance[i].resize();
		                    }
	                    }
	                   
	                }

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
