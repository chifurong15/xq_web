var modulePrefix = "/watersource";
(function(window, angular) {
	'use strict';

	angular.module("app").controller('reachDocCtrl', [
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
		function reachDocCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam,$window, routeService,moduleService, $http) {
			
			/**
			 * ================================
			 * 描述说明
			 * @author yuanhaitao</br>2018/09/11
			 * @module 一河一策（档）
			 * @version 3.0.0
			 * ================================
			 */
			
			/**
			 * 初始化数据
			 */
			$scope.init = function(){
				$scope.reachId = $localStorage.reachId;
				/*文件类型*/
				getFileData();
				/*文件状态*/
				getFileStatusData();
			}

			/**
			 * 初始化表单
			 */
			var getReachDocList = function (){
				$http({
					method: "get",
					url: moduleService.getServiceUrl() + modulePrefix + "/v1/doc/list",
					params:{
						pageNumber: $scope.paginationConf.currentPage,
						pageSize: $scope.paginationConf.itemsPerPage,
						reachId:$scope.reachId
					}
				}).success(function(res) {
					if(res.resCode == 1){
						$scope.paginationConf.totalItems = res.data.total;
						$scope.reachDocList = res.data.list;
					}else{
            			layer.msg("服务器异常，请稍后再试");
					}
				}).error(function(res){
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
			$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getReachDocList);

			/**
			 * 文件类型
			 */
			function getFileData (){
				$http({
					method: "get",
					url: moduleService.getServiceUrl() + modulePrefix +"/v1/doctype/types"
				}).success(function(res) {
					if(res.resCode == 1){
						$scope.fileData = res.data;
					}else{
            			layer.msg("服务器异常，请稍后再试");
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	            });
			}

			/**
			 * 上传文档模态框
			 */
			$scope.reachUploadDoc = function(){
				$("#reachDocModal").modal('show');
			}

			/**
			 * 文件上传
			 */
			var isSubmitting = false;
			$scope.submit = function(){
				var formFile = new FormData();
				var fileObj = $('#uploadfile').prop('files')[0];
				if(!fileObj){
					layer.msg("请选择文件");
					return ;
				}else if(!$scope.fileType){
					layer.msg("请选择文件类别");
					return ;
				}
				if(isSubmitting){
					return;
				}else{
					isSubmitting = true;
				}
                formFile.append("filePath", fileObj); //加入文件对象
				var data = formFile;
				$http({
					method: 'post',
					url: moduleService.getServiceUrl() + modulePrefix +"/v1/doc/upload",
					data: data,
					headers: {'Content-Type': undefined},
					transformRequest: angular.identity
				}).success(function(res) {
					if(res.resCode == 1){
						var jsonFile = [{'name':res.data.name, 'path':res.data.virtualPath, 'type':res.data.extension}];
                        jsonFile = JSON.stringify(jsonFile)
                        $http({
                            url: moduleService.getServiceUrl() +'/watersource/v1/doc/add',
                            method: 'POST',
                            params: {
                                type: $scope.fileType,
                                jsonFile: jsonFile,
                                reachId: $scope.reachId,
                            }
                        }).success(function(res){
                        	if(res.resCode == 1){
                                layer.msg('新增成功',{shift:-1},function(){
                                	getReachDocList();
                                    isSubmitting = false;
                                    $("#uploadfile").fileinput('refresh').fileinput('enable');
                                    $('#reachDocModal').find('.file-preview .close').trigger('click');
                                    $('#reachDocModal').modal('hide');
                                })
                            }else{
                                layer.msg(res.msg || '提交失败，请重试');
                                isSubmitting = false;
                            }
                        }).error(function(){isSubmitting = false;});
					}else{
            			layer.msg(res.msg || '提交失败，请重试');
                        isSubmitting = false;
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	                isSubmitting = false;
	            });
			}

			/**
			 * 文件状态
			 */
			function getFileStatusData (){
				$http({
					method: "get",
					url: moduleService.getServiceUrl() + modulePrefix + "/v1/doc/docStatus"
				}).success(function(res) {
					if(res.resCode == 1){
						$scope.fileStatusData = res.data;
					}else{
            			layer.msg("服务器异常，请稍后再试");
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	            });
			}

			/**
			 * 时间选择
			 */
            var datepicker1 = $('#beginTime').datetimepicker({
		        format: 'YYYY-MM-DD',
		        locale: moment.locale('zh-cn')
		    }).on('dp.change', function (e) {
		        var result = new moment(e.date).format('YYYY-MM-DD');
		        $scope.beginTime = result;
		        $scope.$apply();
			});

			/**
			 * 编辑一河一策（档）
			 */
			$scope.reachDocEdit = function(id,name){
				$scope.docId = id;
				$("#editReachDocModal").modal('show');
			}

			/**
			 * 提交修改
			 */
			$scope.editReachDocSubmit = function(){
				if(!$scope.beginTime){
					layer.msg('请选择开始时间')
					return;
				}
				$http({
					method: "put",
					url: moduleService.getServiceUrl() +modulePrefix + "/v1/doc/update",
					params:{
						docId:$scope.docId,
						status:$scope.fileStatus,
						effectiveTime:$scope.beginTime
					}
				}).success(function(res) {
					if(res.resCode == 1){
						$("#editReachDocModal").modal('hide');
						layer.msg("数据更新成功!");
            			getReachDocList();
					}else{
            			layer.msg("服务器异常，请稍后再试");
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	            });
			}

			/**
			 * 删除一河一策（档）
			 */
			$scope.reachDocDelete = function(id,name){
				var layerIndex = layer.confirm('确定删除本条数据吗？', {
					btn: ['确定', '取消']
					// 按钮
				}, function() {
					$http({
						method: "delete",
						url: moduleService.getServiceUrl() +modulePrefix + "/v1/doc/delete",
						params:{
							id:id
						}
					}).success(function(res) {
						if(res.resCode == 1){
	            			getReachDocList();
						}else{
	            			layer.msg("服务器异常，请稍后再试");
						}
					}).error(function(res){
		                layer.msg('服务器异常，请稍后再试');
		            });
					layer.close(layerIndex);
				}, function() {});
			}

			/**
			 * 返回按钮
			 */
			$scope.back = function(){
				routeService.route(108, true);
			}



		}
	]);

})(window, angular);