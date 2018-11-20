(function(window, angular) {
	'use strict';

	angular
			.module("app")
			.controller(
					'eventBacklog',
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
							'myStorage',
							'globalParam',
							function eventBacklog($localStorage, $scope, $location,
									$log, $q, $rootScope, $window,
									routeService, $http, $ajaxhttp, myStorage, globalParam) {
								var typeTree;
								//问题类型数据
							    var setting = {
							        view:{
							            selectedMulti:true,
							            showLine:true,
							            showIcon:true
							        },
							        data:{
							            simpleData: {enable: true},
							            keep: {parent: true}
							        },
							        callback:{
							            onClick:zTreeOnClick
							        }
							    };
							    function zTreeOnClick(event,treeId,treeNode){
							    	$scope.eventTypeName = treeNode.name;
							        $scope.eventTypeId = treeNode.id;
							        $scope.$apply();
							        // treeList2();
							    };
							    var treeList = function(){
							    	$ajaxhttp.myhttp({
										//url: $localStorage.serviceUrl_eventMgr + 'v1/event/getEventTypes',
										method: 'GET',
										callBack: function(res){
											typeTree = $.fn.zTree.init($('#typeTree'), setting, res.data);
										}
									});
							    };
							    treeList();
								// 配置分页基本参数
								$scope.paginationConf = {
									currentPage : $location.search().currentPage ? $location.search().currentPage : 1,
									itemsPerPage : 10,
									pagesLength : 5,
									perPageOptions : [ 1, 2, 3, 4, 5, 10 ],
									onChange : function() {
										$location.search('currentPage',$scope.paginationConf.currentPage);
									}
								};
								// 开始时间
				                var beginTime = $('#beginTime').datetimepicker({
				                    format: 'YYYY-MM-DD hh:mm:ss',
				                    locale: moment.locale('zh-cn')
				                }).on('dp.change', function (c) {
				                    var result = new moment(c.date).format('YYYY-MM-DD hh:mm:ss');
				                    $scope.beginTime = result;
				                    $scope.$apply();
				                });

				                // 结束时间
				                var endTime = $('#endTime').datetimepicker({
				                    format: 'YYYY-MM-DD hh:mm:ss',
				                    locale: moment.locale('zh-cn')
				                }).on('dp.change', function (c) {
				                    var result = new moment(c.date).format('YYYY-MM-DD hh:mm:ss');
				                    $scope.endTime = result;
				                    $scope.$apply();
				                });
								// 分页
								var reGetProducts = function() {
									$ajaxhttp.myhttp({
										//url: 'http://10.0.9.203:20001/v1/event/toDoTasks',
										url: $localStorage.serviceUrl_eventMgr + '/v1/event/toDoTasks',
										method: 'get',
										params: {
											userId: $localStorage.userLoginInfo.userInfo.id,
											eventResource: $scope.eventResource,
											eventLevel: $scope.eventLevel,
											eventTypeId: $scope.eventTypeId,
											content: $scope.eventContent,
											regionId: $scope.regionId,
											startTime: $scope.beginTime,
											endTime: $scope.endTime,
											status: $scope.status,
											reportPhone: $scope.eventTel,
											pageNum: $scope.paginationConf.currentPage,
                    						pageSize: $scope.paginationConf.itemsPerPage
										},
										callBack: function(resp){
											$scope.paginationConf.totalItems = 1;
											//$scope.paginationConf.totalItems = resp.data.totalNum;
											$scope.moduleList = resp.data;
										}
									});
								};
								// 通过$watch currentPage和itemperPage
								// 当他们一变化的时候，重新获取数据条目
								$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',reGetProducts);
								$scope.searchData = function(){
									reGetProducts();
								};
								$scope.eventDetail = function(id) {
									myStorage._setLocal('id',id);
									routeService.route(69, false);
								};

								//上报来源处理
								$scope.reportRes = function(data){
									var text = '';
									switch(data){
										case 'A':
										text = '河长APP';
										break;
										case 'B':
										text = '电话上报';
										break;
										case 'C':
										text = '公众APP';
										break;
										case 'D':
										text = '微信';
										break;
										case 'F':
										text = '曝光台';
										break;
										case 'G':
										text = '钉钉平台';
										break;
									};
									return text;
								};
								//问题等级处理函数
								$scope.evLevel = function(level){
									var text = '';
									switch(level){
										case '0':
										text = '一般';
										break;
										case '1':
										text = '紧急';
										break;
										case '2':
										text = '特急';
										break;
									};
									return text;
								};
								//问题装太类型
								$scope.statusEvent = function(val){
									var text = '';
									var statusObj = {
									    A: "问题上报",
									    B1: "省级联络员派单",
									    B2: "市级联络员派单",
									    B3: "区级联络员派单",
									    B4: "镇级联络员派单",
									    B5: "村级联络员派单",
									    E1: "省级河长派单 ",
									    E2: "市级河长派单",
									    E3: "区级河长派单",
									    E4: "镇级河长派单",
									    E5: "村级河长派单",
									    H1: "省级河长确认",
									    H2: "市级河长确认",
									    H3: "区级河长确认",
									    H4: "镇级河长确认",
									    H5: "村级河长确认",
									    G1: "省级联络员反馈求助",
									    G2: "市级联络员反馈求助",
									    G3: "区级联络员反馈求助",
									    G4: "镇级联络员反馈求助",
									    G5: "工作人员反馈求助",
									    K1: "省级河长反馈求助",
									    K2: "市级河长反馈求助",
									    K3: "区级河长反馈求助",
									    K4: "镇级河长反馈求助",
									    K5: "工作人员反馈求助",
									    M1: "省级河长助理结案",
									    M2: "市级河长助理结案",
									    M3: "区级河长助理结案",
									    M4: "镇级河长助理结案",
									    N1: "省级委办局处理",
									    N2: "市级委办局处理",
									    N3: "区级委办局处理",
									    N4: "镇级委办局处理",
									    N5: "村级委办局处理",
									    F: "工作人员处理",
									    Z1: "省级河长确认结案",
									    Z2: "市级河长确认结案",
									    Z3: "区级河长确认结案",
									    Z4: "镇级河长确认结案",
									    Z5: "村级河长确认结案",
									    B: "受理",
									    C: "核实",
									    D: "确认",
									    E: "派单",
									    G: "已处理",
									    H: "审核",
									    I: "结案",
									    Z: "已结案",
									    X: "无效问题",
									    T: "事务锁定",
									    J1: "省级河长办审核",
									    J2: "市级河长办审核",
									    J3: "区级河长办审核",
									    J4: "镇级河长办审核",
									    J5: "村级河长办审核",
									    L1: "省级河长办处理",
									    L2: "市级河长办处理",
									    L3: "区级河长办处理",
									    L4: "镇级河长办处理",
									    L5: "村级河长办处理",
									};
									for (let key in statusObj) {
										if(key == val){
											text = statusObj[key];
										};
									};
									return text;
								};
								$scope.moduleDelete = function(modeuleId,
										moduleName) {
									var layerIndex = layer.confirm('确定删除 【'
											+ moduleName + '】 吗？', {
										btn : [ '确定', '取消' ]
									// 按钮
									}, function() {
										$.ajax({
											url : 'http://d.com',
											type : 'post',
											data : {
												moduleId : modeuleId
											}
										}).success(function success(result) {
											reGetProducts();

											layer.alert(result.data.resMsg, {
												skin : 'layui-layer-lan',
												closeBtn : 1,
												anim : 4
											});
										}, function failure(result) {
											layer.alert('删除失败！', {
												skin : 'layui-layer-lan',
												closeBtn : 0,
												anim : 4
											});
										});
										layer.close(layerIndex);
									}, function() {

									});

								};

							} ]);


})(window, angular);
