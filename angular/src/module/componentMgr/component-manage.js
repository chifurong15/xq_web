var modulePrefix = "/component";
var componenttypeUrl = modulePrefix + '/v1/componenttype';
var componentUrl = modulePrefix + '/v1/component';

(function(window, angular) {
	'use strict';

	angular
		.module("app")
		.controller(
			'imComponent', [
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
				'myStorage',
				'$http',
				function imComponent($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService,
					moduleService, myStorage, $http) {
					/**
					 * @name  component
					 * @author yuanhaitao | 2018/09/10
					 * @version
					 * @desc  部件管理
					 */

					$scope.init = function() {}

					/*区域树模态框*/
					$scope.regionShow = function() {
						$scope.modalTreeInfo = {
							'treeType': 'region'
						};
						$("#treeModal").modal('show');
					}
					$scope.$on('zTreeModalClose', function(event, data) {
						$scope.regionName = data.treeNodeName;
						$scope.regionCode = data.treeNodeId;
					})

					/*部件大类*/
					$scope.componentBType = function() {
						$http({
							method: "get",
							url: moduleService.getServiceUrl() + componenttypeUrl + "/findMainClass?time=" + new Date().getTime(),
						}).success(function(res) {
							$scope.componentBTypes = res.data;
						}).error(function(res) {
							layer.msg("请求服务器出现异常，请稍后重试！");
						});
					};
					/*部件小类*/
					$scope.componentSType = function() {
						if ($scope.mainclassids == null) {
							$scope.subclassids = '';
							$scope.componentSTypes = [];
							return;
						}
						$http({
							method: "get",
							url: moduleService.getServiceUrl() + componenttypeUrl + "/findSubClass?time=" + new Date().getTime(),
							params: {
								mainClassId: $scope.mainclassids
							}
						}).success(function(res) {
							$scope.componentSTypes = res.data;
						});
					};

					$scope.$watch('mainclassids', function(n, o) {
						if (n == o) {
							return;
						} else {
							$scope.componentSType();
						}
					});

					/*表单分页*/
					var regionCode = $localStorage.userLoginInfo && $localStorage.userLoginInfo.userInfo.regionId ? $localStorage.userLoginInfo
						.userInfo.regionId : null;
					$scope.regionCode = regionCode;
					$scope.moduleList = [];
					var reGetProducts = function() {
						$http({
							url: moduleService.getServiceUrl() + componentUrl + "/list",
							method: 'GET',
							params: {
								name: $scope.componentName,
								mainclassids: $scope.mainclassids,
								subclassids: $scope.subclassids,
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage,
								areaCode: $scope.regionCode
							}
						}).success(
							function(resp) {
								$scope.paginationConf.totalItems = resp.data.total;
								$scope.moduleList = resp.data.list;
								cleanArr();
							}).error(function(error) {});
					};

					/*配置分页基本参数*/
					$scope.paginationConf = {
						currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
						itemsPerPage: $rootScope.comSize == null ? 10 : $rootScope.comSize,
						pagesLength: 5,
						perPageOptions: [5, 10, 20],
						onChange: function() {
							$location.search('currentPage', $scope.paginationConf.currentPage);
							$rootScope.comSize = $scope.paginationConf.itemsPerPage;
						}
					};
					$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

					/*搜索*/
					$scope.find = function() {
						$scope.paginationConf.currentPage = 1;
						$('.page-num').val($scope.paginationConf.currentPage);
						reGetProducts();
					};
					$('.query-conditions-form').bind("keydown", function(e) {
						var theEvent = e || window.event;
						var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
						if (code == 13) {
							$scope.find();
						}
					});

					/*重置，清空搜索条件*/
					$scope.reSet = function() {
						$scope.regionName = '';
						$scope.regionCode = regionCode;
						$scope.mainclassids = '';
						$scope.subclassids = '';
						$scope.componentName = '';
						// reGetProducts();
					};

					/*清空选中框*/
					function cleanArr() {
						$scope.checkedArr = [];
						$scope.allChecked = false;
					}

					/*表单删除*/
					$scope.moduleDelete = function(id) {
						var layerIndex = layer.confirm('确定删除本条数据吗？', {
							btn: ['确定', '取消']
						}, function() {
							$http({
								url: moduleService.getServiceUrl() + componentUrl + "/delete",
								method: "delete",
								params: {
									id: id
								}
							}).success(function success(res) {
								layer.msg('删除成功！', {
									time: 1000
								});
								reGetProducts();
							}, function failure(res) {
								layer.msg('删除失败！', {
									time: 1000
								});
							});
							layer.close(layerIndex);
						}, function() {});
					};

					/*部件新增*/
					$scope.componentAdd = function() {
						routeService.route(1018, false);
					};

					/*查看详情*/
					$scope.componentDetail = function(id) {
						$http({
							method: "GET",
							url: moduleService.getServiceUrl() + componentUrl + "/detail",
							params: {
								id: id
							}
						}).success(function success(res) {
							$localStorage.componentDetailData = res;
							routeService.route(1019, false);
						});
					};

					/*修改部件*/
					$scope.componentEdit = function(id) {
						$http({
							url: moduleService.getServiceUrl() + componentUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(
							function success(res) {
								$localStorage.componentEditData = res;
								routeService.route(1020, false);
							});
					};

					/*选中单选框数组*/
					$scope.checkedArr = [];

					/*点击顶层方框*/
					$scope.allChecked = false;
					$scope.selectAll = function(check) {
						$scope.checkedArr = [];
						for (var i = 0; i < $scope.moduleList.length; i++) {
							if (check === true) {
								$scope.moduleList[i].checked = true;
								$scope.checkedArr.push($scope.moduleList[i].id);
							} else {
								$scope.moduleList[i].checked = false;
							}
						}
					};
					$scope.$watch('checkedArr', function(n, o) {
						if ($scope.moduleList.length == 0) {
							$scope.allChecked = false
						} else if (n.length != $scope.moduleList.length) {
							$scope.allChecked = false;
						} else {
							$scope.allChecked = true;
						}
					}, true)

					/*点击单个方框*/
					$scope.selectOne = function(check, id) {
						if (check) {
							$scope.checkedArr.push(id);
						} else {
							arrRemove($scope.checkedArr, id)
						}
					};

					/*删除选中框id*/
					var arrRemove = function(arr, val) {
						var index = arr.indexOf(val);
						if (index > -1) {
							arr.splice(index, 1);
						}
					};

					/*将选中列表数组用，连接*/
					var concatId = function(arr) {
						var ids = arr.join(',');
						return ids;
					};

					/*批量删除*/
					$scope.componentDelAll = function() {
						var size = $scope.checkedArr.length;
						if (size <= 0) {
							layer.msg('请选择要删除的数据！', {
								time: 1000
							});
						} else {
							var layerIndex = layer.confirm('确定删除' + size + '条数据吗？', {
								btn: ['确定', '取消']
								// 按钮
							}, function() {
								var ids = concatId($scope.checkedArr);
								$http({
									url: moduleService.getServiceUrl() + componentUrl + "/deleteByIds",
									method: "delete",
									params: {
										ids: ids
									}
								}).success(function success(res) {
									layer.msg('删除成功！', {
										time: 1000
									});
									reGetProducts();
									$scope.checkedArr = [];
									$scope.allChecked = false;
								}, function failure(res) {
									layer.msg('删除失败！', {
										time: 1000
									});
									$scope.checkedArr = [];
									$scope.allChecked = false;
									reGetProducts();
								});
								layer.close(layerIndex);
							}, function() {});
						}
					};
					
					/* 初始化模板 */
					$scope.getTempList = function() {
						$scope.tempType = 3;
						$http({
							url: moduleService.getServiceUrl() + "/dataexport/edTemplate/list",
							method: 'GET',
							params: {
								type: $scope.tempType
							}
						}).success(function(res) {
							if (res.resCode == 1) {
								$scope.tempInfo = res.data.list[0];
							} else {
								layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res) {
							layer.msg('服务器异常，请稍后再试');
						});
					};
					
					/* 模板下载 */
					$scope.getTempUrl = function() {
						$scope.downloadUrl = moduleService.getServiceUrl() + '/dataexport/edTemplate/excelExport?templateId=' + $scope.tempInfo.id;
					};
					
					/* 文档设置 */
					$scope.fileSetting = function() {
						$('#importModal .modal-body .fileDivBox .file-input').remove();
						$('#importModal .modal-body .fileDivBox').append('<input id="fileUpLoad" type="file">');
						$("#fileUpLoad").fileinput({
							language: "zh",
							dropZoneEnabled: false,
							minFileCount: 1,
							showPreview: false,
							showUpload: false,
							showCancel: false
						});
					}
					
					/* 导入模态框 */
					$scope.dataImport = function() {
						$scope.getTempList();
						$scope.fileSetting();
						$("#importModal").modal('show');
					}
					
					/*导入*/
					$scope.importCheck = function() {
						var file = $('#fileUpLoad')[0].files[0];
						if (file == null) {
							layer.msg("请选择文件", {
								time: 2000
							});
							return;
						} else {
							var formData = new FormData();
							formData.append('multipartFile', file);
							formData.append('type', 3);
							formData.append('templateId', $scope.tempInfo.id);
							$http({
								url: moduleService.getServiceUrl() + '/dataexport/edTemplate/excelImport',
								method: 'post',
								data: formData,
								headers: {
									'Content-Type': undefined
								},
								transformRequest: angular.identity
							}).success(function success(res) {
								if (res.resCode == 1) {
									layer.msg('导入成功', {
										time: 1000
									});
									$("#fileUpLoad").fileinput('refresh');
									$('#importModal').modal('hide');
									myStorage._setLocal('logId', res.data);
									myStorage._setLocal('templateId', $scope.tempInfo.id);
									myStorage._setLocal('templateType', 'component');
									routeService.route(1180, false);
								} else if (res.resCode == 0) {
									layer.msg(res.resMsg || '导入失败!');
								} else {
									layer.msg(res.resMsg || '请求失败,请稍后再试', {
										time: 1000
									});
								}
							})
						}
					};
				}
			]);

})(window, angular);
