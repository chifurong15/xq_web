var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var waterUrl = modulePrefix + "/v1/waterSystem";
var riverUrl = modulePrefix + "/v1/river";
var lakesUrl = modulePrefix + "/v1/lakes";
var reservoirUrl = modulePrefix + "/v1/reservoir";
var reachUrl = modulePrefix + "/v1/reach";
var dictionaryUrl = modulePrefix + "/v1/dictionary";
var mdMicroUrl = modulePrefix + '/v1/mdMicro';
(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'dataController', [
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
				'moduleService',
				function dataController($localStorage, $scope,$location, $log, $q, $rootScope,globalParam, $window,routeService, $http,moduleService) {

					// 表单分页
					$scope.moduleList = [];
					var reGetProducts = function() {
						$http({
							url: moduleService.getServiceUrl() + mdMicroUrl + "/list?time="+ new Date().getTime(),
							method: 'GET',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
								regionId : $scope.regionId,
                                name: $scope.find_name,
                                state: $scope.stateType
							}
						}).success(function(resp) {
							$scope.paginationConf.totalItems = resp.data.total;
							$scope.moduleList = resp.data.list;
							cleanArr();
						}).error(function(error) {});
					};

					// 配置分页基本参数
					$scope.paginationConf = {
						currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
						itemsPerPage: $rootScope.tempSize == null ? 10 : $rootScope.tempSize,
						pagesLength: 5,
						perPageOptions: [5,10,20,50],
						onChange: function() {
							$location.search('currentPage', $scope.paginationConf.currentPage);
                            $rootScope.tempSize  = $scope.paginationConf.itemsPerPage;
						}
					};
					// 通过$watch currentPage和itemperPage,当他们一变化的时候，重新获取数据条目
					$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

					//搜索
					$scope.find = function(){
						reGetProducts();
					}
					$('.query-conditions-form').bind("keydown",function(e){
		                var theEvent = e || window.event;
		                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
		                if (code == 13) {
		                    $scope.find();
		                }
		            });

					//重置，清空搜索条件
					$scope.reSet = function(){
                       document.getElementById("formId").reset();
                       $scope.regionId = null;
                       $scope.regionName = null;
                       $scope.find_name = null;
                       $scope.state = null;
                       reGetProducts();
					};

					//初始化状态
					$scope.getStateType = function(){
						$http({
							url: moduleService.getServiceUrl() + mdMicroUrl + "/getStates?time="+ new Date().getTime(),
							method: 'GET'
						}).success(
							function(resp) {
								$scope.states = resp.data;
							}).error(function(error) {});
					}

					/*区域树模态框*/
					$scope.regionShow = function() {
						$scope.modalTreeInfo = {'treeType': 'region'};
						$("#treeModal").modal('show');
					}
				    $scope.$on('zTreeModalClose', function(event,data) {
				    	$scope.regionName = data.treeNodeName;
				    	$scope.regionId= data.treeNodeId;
				    })

					//确认删除
					function sureDelete(idList){
						var layerIndex = layer.confirm('确定删除数据吗？', {
							btn: ['确定', '取消']
							}, function() {
								layer.close(layerIndex);
								moduleDelete(idList);
							}, function() {
								layer.close(layerIndex);
							});
					}

					//删除单个
					$scope.deleteOne = function(id){
						var idList = [];
						idList.push(id);
						sureDelete(idList);
					}

					//删除多个
					$scope.deleteList = function(){
						if($scope.deleteArr.length === 0){
							layer.msg("请至少勾选一个", {time:3000})
						}else{
							sureDelete($scope.deleteArr);
						}
					}

					//选中单选框数组
					$scope.deleteArr = [];
					//全选删除
					$scope.allChecked = false;
					$scope.selectAll = function(check) {
						$scope.deleteArr = [];
						for(var i=0; i < $scope.moduleList.length; i++){
					        if(check === true){
					            $scope.moduleList[i].checked=true;
					            $scope.deleteArr.push($scope.moduleList[i].id);
					        }else {
					            $scope.moduleList[i].checked=false;
					        }
				        }
					};
					$scope.$watch('deleteArr',function(n,o){
						if($scope.moduleList.length == 0){
							$scope.allChecked = false
						}else if(n.length != $scope.moduleList.length){
							$scope.allChecked = false;
						}else{
							$scope.allChecked = true;
						}
					},true)

					/*清空选中框*/
					function cleanArr(){
						$scope.deleteArr = [];
						$scope.allChecked = false;
					}

					//点击单个方框
					$scope.selectOne = function(check,id) {
						if(check){
							$scope.deleteArr.push(id);
						}else{
							arrRemove($scope.deleteArr,id)
						}
					};

					//删除选中框id
					var arrRemove = function (arr,val) {
					    var index = arr.indexOf(val);
					    if (index > -1) {
					        arr.splice(index, 1);
					    }
					};

					//请求删除
					function moduleDelete(idList){
						$http({
							url: moduleService.getServiceUrl() + mdMicroUrl + "/delete?time="+ new Date().getTime(),
							method: 'delete',
							params:{
								idList:idList
							}
						}).success(function(resp) {
							layer.msg("删除成功！", {time:3000});
							$scope.allChecked = false;
							reGetProducts();
						}).error(function(error) {});
					}
					//批量剿灭
					$scope.editList = function(){
						if($scope.deleteArr.length === 0){
							layer.msg("请至少勾选一个", {time:3000})
						}else{
							var layerIndex = layer.confirm('确定剿灭劣V类水体吗？', {
							btn: ['确定', '取消']
							// 按钮
							}, function() {
								layer.close(layerIndex);
								$http({
									url: moduleService.getServiceUrl() + mdMicroUrl + "/updateStates?time="+ new Date().getTime(),
									method: 'put',
									params:{
										ids:$scope.deleteArr
									}
								}).success(function(resp) {
									layer.msg("批量剿灭成功！！", {time:3000});
									reGetProducts();
								}).error(function(error) {});
							}, function() {
								layer.close(layerIndex);
							});
						}
					}
					//新增
					$scope.add = function(){
						routeService.route(1025, false);
					}

					//详情
					$scope.detail = function(id){
						globalParam.setter(id);
						routeService.route(1027, false);
					}

					//更新
					$scope.update = function(id){
						globalParam.setter(id);
						routeService.route(1026, false);
					}
				}
			]);

})(window, angular);