(function(window, angular) {
	'use strict';

	angular
			.module("app")
			.controller(
					'instituteSystemListCtrl',
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
							'globalParam',
							function instituteSystemListCtrl($localStorage, $scope, $location, $log, $q, $rootScope, $window, routeService, $http, globalParam) {

								/**
								 * ================================
								 * 描述说明
								 * @author yuanhaitao</br>2018/09/11
								 * @module 制度体系
								 * @version 3.0.0
								 * ================================
								 */
								
								/**
								 * 初始化数据
								 */
								$scope.init = function(){
									/**
									 * 初始化树
									 */
									regionTreeList();
									/**
									 * 初始化TypeID
									 */
									getTypeId();
								}
								
								var modulePrefix = "/watersource",
									basicUrl = "/v1/drainageBasin",
								 	fileTypeId, 
								 	regionTree, 
								 	regionName, 
								 	regionCode, 
								 	regionTreeUrl = $localStorage.gwUrl+ modulePrefix + basicUrl + "/tree";
				                
				                function getTypeId (){
									$http({
										method: "get",
//										url: 'http://10.0.9.125:8085' + modulePrefix + "/v1/doc/getDocType",
										url: $localStorage.gwUrl+ modulePrefix + "/v1/doc/getDocType",
										params:{
											type: 1,
										}
									}).success(function(res) {
										console.log(res);
										if(res.resCode == 1){
											console.log(res);
											fileTypeId = res.data;
											console.log(fileTypeId)
											reGetProducts();
										}else{
					            			layer.msg("服务器异常，请稍后再试");
										}
									}).error(function(res){
						                layer.msg('服务器异常，请稍后再试');
						            });
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
				
				                /**
				                 * 捕获行政区域节点被点击
				                 * @param {Object} event
				                 * @param {Object} treeId
				                 * @param {Object} treeNode
				                 */
				                function regionTreeOnClick(event, treeId, treeNode) {
				                    console.log(treeNode);
				                    regionName = treeNode.name;
				                    regionCode = treeNode.id;
				                }
				
				                /**
				                 * 用于捕获行政区域父节点展开之前的问题回调函数，并且根据返回值确定是否允许展开操作
				                 * @param {Object} treeId
				                 * @param {Object} treeNode
				                 */
				                function regionTreeOnExpand(treeId, treeNode) {
				                    console.log(treeNode);
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
				
				                /**
				                 * 区域树获取
				                 */
				                function regionTreeList () {
				                    $http({
				                        method: 'get',
				                        url: regionTreeUrl,
				                        params: {
				                            regionCode: regionCode
				                        }
				                    }).success(function (res) {
				                        console.log(res)
				                        if(res.resCode == 1){
				                        	regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, res.data);
				                        }else{
				                        }
				                    }).error(function () {
				                    });
				                };
								
								/**
								 * 开启行政区划树模态框
								 */
								$scope.regionShow = function(){
									$("#regionZtree").modal('show');
								}
								
								/**
								 * 关闭行政区划树模态框
								 */
								
								$scope.regionModalOk = function(){
									$("#regionZtree").modal('hide');
									$scope.region = regionName;
								}
								
								/**
								 * 上传文件
								 */
								
								$scope.fileAdd = function(){
//									var loadTips = layer.load(3, {shade: [0.3, '#000000']});
									var formFile = new FormData();
									var fileObj = document.querySelector('input[type=file]').files[0];
					            	
					                formFile.append("file", fileObj); //加入文件对象
					                formFile.append("regionId", regionCode); 
					                formFile.append("type", fileTypeId); 
					                
									var data = formFile;
									
									$http({
										method: 'post',
//										url: 'http://10.0.9.125:8085' + modulePrefix + "/v1/doc/add",
										url: $localStorage.gwUrl+ modulePrefix + "/v1/doc/add",
										data: data,
										headers: {'Content-Type': undefined},
											transformRequest: angular.identity
										}
										).success(function(res) {
											if(res.resCode == 1){
												console.log(res);
												$scope.fileData = res.data;
//												layer.close(loadTips);//关闭加载Loading
//						            			layer.msg("文件上传成功!");
												$("#docList").modal('hide');
												reGetProducts();
											}else{
						            			layer.msg("服务器异常，请稍后再试");
											}
										}).error(function(res){
							                layer.msg('服务器异常，请稍后再试');
						            });
								}
								
								/**
								 * 文档列表
								 */
								function reGetProducts () {
									$http({
//										url: 'http://10.0.9.125:8085' + modulePrefix + "/v1/doc/list",
										url: $localStorage.gwUrl+ modulePrefix + "/v1/doc/list",
										method: 'GET',
										params: {
					                        pageNumber: $scope.paginationConf.currentPage,
					                        pageSize: $scope.paginationConf.itemsPerPage,
											type: 182,
//											type: fileTypeId,
											startTime:$scope.beginTime,
					                        endTime:$scope.endTime,
					                        groupBy:$scope.type
										}
									}).success(
										function(resp) {
											console.log(resp);
											$scope.paginationConf.totalItems = resp.data.total;
											$scope.docList = resp.data.list;
										}).error(function(error) {});
								};
					
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
								/**
								 * 通过$watch currentPage和itemperPage,当他们一变化的时候，重新获取数据条目
								 */
								$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);
								
								/**
								 * 时间段
								 */
				                var datepicker1 = $('#beginTime').datetimepicker({
							        format: 'YYYY-MM-DD',
							        locale: moment.locale('zh-cn')
							    }).on('dp.change', function (e) {
							        var result = new moment(e.date).format('YYYY-MM-DD');
							        $scope.beginTime = result;
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
				 				
				 				/**
				 				 * 动态设置最小值
				 				 */
								datepicker1.on('dp.change', function (e) {
							        datepicker2.data('DateTimePicker').minDate(e.date);
							    });
							    
							    /**
							     * 动态设置最大值
							     */
							    datepicker2.on('dp.change', function (e) {
							        datepicker1.data('DateTimePicker').maxDate(e.date);
							    });
								
                                /**
                                 * 年|月
                                 */
                                $scope.typeList = [
                                    {"id": 'year', "typeName": "按年"},
                                    {"id": 'month', "typeName": "按月"}
                                ];
                                $scope.radioBtn = function(type){
                                    console.log(type);
                                    $scope.type = type;
                                }
								
								/**
								 * 搜索
								 */
								$scope.fileSearch = function(){
									reGetProducts();
								}
								
								/**
								 * 重置
								 */
								$scope.reSet = function(){
									$scope.beginTime = null;
			                        $scope.endTime  = null
			                        $scope.type  = null;
									reGetProducts();
								}

                                /**
                                 * 文档详情
                                 */
                                $scope.docDetail = function (doc) {
                                    console.log(doc);
                                    globalParam.setter(doc);
                                    routeService.route(849, false);
                                }

                                $scope.docDownload = function (filepath) {
                                    console.log(filepath);
                                    window.open(filepath);
                                }

                                // 表单删除
                                $scope.docDelete = function (id) {
                                    var layerIndex = layer.confirm('确定删除本条数据吗？', {
                                        btn: ['确定', '取消']
                                        // 按钮
                                    }, function () {
                                        $http({
                                            url: $localStorage.gwUrl + modulePrefix + "/v1/doc/delete",
                                            method: "delete",
                                            params: {
                                                id: id
                                            }
                                        }).success(function success(result) {
                                            reGetProducts();
                                            layer.msg('删除成功', {
                                                time: 1000
                                            });
                                        }, function failure(result) {
                                            layer.msg('删除失败', {
                                                time: 1000
                                            });
                                        });
                                        layer.close(layerIndex);
                                    }, function () {

                                    });
                                };

			} ]);
	
})(window, angular);
