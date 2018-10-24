(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'usageControll', [
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
            function usageControll($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http) {
                //或取图标相关数据
                $http({
                    url: $localStorage.serviceUrl_patrolMgr + '/resumption/v1/appUserStatistic',
                    method: 'get'
                }).success(function(res){
                    var objCountry = {
                        name:'区级人数',
                        type:'bar',
                        stack: '数量',
                        barWidth: '40px',
                        data: [],
                        itemStyle: {
                            normal:{
                                color:'#ffc13c'
                            }
                        }
                    };
                    var townObj = {
                        name:'镇级人数',
                        type:'bar',
                        stack: '数量',
                        barWidth: '40px',
                        itemStyle: {
                            normal:{
                                color:'#f28d2e'
                            }
                        },
                        data:[]
                    };
                    var villageObj = {
                        name:'村级人数',
                        type:'bar',
                        stack: '数量',
                        barWidth: '40px',
                        itemStyle: {
                            normal:{
                                color:'#9d73e2'
                            }
                        },
                        data:[]
                    };
                    var lineObj = {
                        name:'APP使用率',
                        type:'line',
                        yAxisIndex: 1,
                        itemStyle:{
                            normal:{
                                color:'#48cbc2',
                            }
                        },
                        data:[],
                    };
                    $scope.fixedCount = function(num){
                        return (num*100).toFixed(1) + '%';
                    };
                    var regionList = [];
                    if(res.resCode == 1){
                        var datalist = res.data;
                        $scope.tableList = res.data;
                        for(let i = 0;i<datalist.length;i++){
                            objCountry.data.push(datalist[i].countryManNum);
                            townObj.data.push(datalist[i].townManNum);
                            villageObj.data.push(datalist[i].villageManNum);
                            lineObj.data.push(datalist[i].countryUseRate*100);
                            regionList.push(datalist[i].regionName);
                        };
                        var option = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'cross',
                                    crossStyle: {
                                        color: '#999'
                                    }
                                }
                            },
                            legend: {
                                data:['区级人数','镇级人数','村级人数','APP使用率']
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: regionList,
                                    axisPointer: {
                                        type: 'shadow'
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                },
                                {
                                    type: 'value',
                                    name: 'APP使用率',
                                    min: 0,
                                    interval: 10,
                                    axisLabel: {
                                        formatter: '{value} %'
                                    }
                                }
                                
                            ],
                            series: [objCountry,townObj,villageObj,lineObj]
                        };
                        var chartStatistics = document.getElementById('echartBox');
                        //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
                        var resizeChartStatistics = function () {
                            var chartWidth = $('.tab-content').width();
                            var chartHeight = $(window).height() - 200;
                            chartStatistics.style.width = chartWidth +'px';
                            chartStatistics.style.height = chartHeight +'px';
                        };
                        //设置容器高宽
                        resizeChartStatistics();
                         // 基于准备好的dom，初始化echarts实例
                        var myChart = echarts.init(chartStatistics);
                         // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);
                         //用于使chart自适应高度和宽度
                        window.onresize = function () {
                            //重置容器高宽
                            resizeChartStatistics();
                            myChart.resize();
                        };
                    };
                    
                });
                // 行政区域树配置
                var regionTreeSetting = {
                    async: {
                        enable: true,
                        type: 'post',
                        dataType: 'json',
                        url: asyncGetRegionNodesURL
                    },
                    data: {
                        key: {
                            title: 'title'
                        },
                        simpleData: {
                            enable: true
                        }
                    },
                    view: {
                        nameIsHTML: true,
                        expandSpeed: 'slow',
                        dblClickExpand: false,
                        txtSelectedEnable: false
                    },
                    callback: {
                        onAsyncSuccess: asyncGetRegionNodesSuccess,
                        onClick: regionNodeOnClick,
                        onExpand: regionNodeExpand
                    }
                };

                // 区域节点异步请求数据URL
                function asyncGetRegionNodesURL(treeId, treeNode) {
                    return $localStorage.serviceUrl_datashow + '/datashow/region/Ctrl/initTree?treeId=' + treeNode.id;
                };

                // 区域节点展开问题
                function regionNodeExpand(event, treeId, treeNode) {
                    var cnodes = treeNode.children;
                    if (cnodes != null && cnodes.length > 0) {
                        return;
                    };
                    $http({
                        method: 'post',
                        url: $localStorage.serviceUrl_datashow + '/datashow/region/Ctrl/initTree?treeId=' + treeNode.id
                    }).success(function(res){
                         var treeObj = $.fn.zTree.getZTreeObj(treeId);
                        //更新节点数据
                        treeObj.addNodes(treeNode, -1, res.data);
                        if (treeNode.children[0].resCode) {
                            treeObj.removeNode(treeNode.children[0]);
                            treeObj.updateNode(treeNode);
                        };
                    });
                };

                /**
                 * 区域节点点击问题
                 */
                function regionNodeOnClick(event, treeId, treeNode) {
                    // console.log(treeNode);
                    $scope.regionId = treeNode.id;
                    $scope.grade = treeNode.grade;
                };

                /**
                 * 区域节点异步请求成功回调函数
                 */
                function asyncGetRegionNodesSuccess(event, treeId, treeNode, res) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    //更新节点数据
                    treeObj.addNodes(treeNode, -1, res.data);
                    if (treeNode.children[0].resCode) {
                        treeObj.removeNode(treeNode.children[0]);
                        treeObj.updateNode(treeNode);
                    };
                };

                /**
                 * 区域树加载
                 */
                $http({
                    method: 'POST',
                    url: $localStorage.serviceUrl_datashow + '/datashow/region/Ctrl/initTree'
                }).success(function (data) {
                    $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, data.data);
                    //默认勾选根节点并触发点击问题
                    var treeObj = $.fn.zTree.getZTreeObj('regionTreeContainer');
                    var nodes = treeObj.getNodes();
                    treeObj.selectNode(nodes[0]);
                    regionNodeOnClick(event, 'regionTreeContainer', nodes[0])
                });
                //点击搜索按钮搜索数据
                $scope.search = function(){
                    
                };
            }
        ]);

})(window, angular);