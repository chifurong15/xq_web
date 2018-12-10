(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'superviseReportAddMgtCtrl', [
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
			'$ajaxhttp',
			'moduleService',
            function superviseReportAddMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {

        	    var apiPrefix = moduleService.getServiceUrl() + '/supervise';
                //var apiPrefix = 'http://10.0.9.116:7023' + '/supervise';

				/**
				 * ==============================================
				 * @name  superviseReportAddMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  监督举报新增
				 * ==============================================
				 */
				$scope.init = function(){
					
					/**
					 * 初始化行政区划树
					 */
					regionTreeList();
					
					/**
					 * 处理状态
					 */
					getStatusList();
					
					/**
					 * 举报人评价
					 */
					getAssessList();
				}
				
				var jsname = /^[a-zA-Z0-9_-]{4,16}$/,
					regionTree,
					regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';
					
				/**
				 * 初始化行政区划树
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
                    $scope.regionId = treeNode.id;
                    $scope.regionName = treeNode.name;
                    $scope.grade = treeNode.grade;
                }

                /**
                 * 用于捕获行政区域父节点展开之前的问题回调函数，并且根据返回值确定是否允许展开操作
                 * @param {Object} treeId
                 * @param {Object} treeNode
                 */
                function regionTreeOnExpand(treeId, treeNode) {
                    console.log('===========regionTreeOnExpand===========');
	                var cnodes = treeNode.children;
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
                 * 生成区域树
                 */
                function regionTreeList () {
	                $http({
	                    method: 'get',
	                    url: regionTreeUrl
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
                 * 区域树模态框
                 */
                $scope.getRegionShow = function () {
                	$('#regionTreeModal').modal('show');
                    regionTreeList();
                }
				
				/**
				 * 区域树搜索
				 */
				$scope.getSelectRegion = function(){
					console.log('我是区域树搜索...')	
				}
				
				/*举报问题*/
                $scope.countNum = 512;
			    $scope.checkRemark = function () {
			    	$scope.countNum = 512 - $scope.reportProblem.length;
			        if ($scope.reportProblem.length >= 512) {
			        	layui.use('layer', function(){
						  	var layer = layui.layer //获得layer模块
							    layer.msg("你好，描述字数控制在255字以内！",{time:2000});
						});      
			            $scope.reportProblem = $scope.reportProblem.substr(0, 512);
			            $scope.countNum = 0;
			        }
			    };
				
				/**
				 * 关闭模态框
				 */
				$scope.getModalOk = function(){
                	$('#regionTreeModal').modal('hide');
					console.log('我是区域树关闭...')	
				}
				
				/**
				 * 时间选择
				 */
                var datepicker1 = $('#beginTime').datetimepicker({
			        format: 'YYYY-MM-DD hh:mm',
			        locale: moment.locale('zh-cn')
			    }).on('dp.change', function (e) {
			        var result = new moment(e.date).format('YYYY-MM-DD hh:mm');
			        $scope.beginTime = result;
			        $scope.$apply();
    			});
                var datepicker1 = $('#overtime').datetimepicker({
                    format: 'YYYY-MM-DD hh:mm',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (e) {
                    var result = new moment(e.date).format('YYYY-MM-DD hh:mm');
                    $scope.overtime = result;
                    $scope.$apply();
                });
				
				/**
				 * 处理状态
				 */
				function getStatusList(){
					$scope.statusList = [
                        {
                            'id':1,
                            'name':'未处理'
                        },
                        {
                            'id':2,
                            'name':'处理完成'
                        },
                        {
                            'id':3,
                            'name':'处理中'
                        },
                        {
                            'id':4,
                            'name':'二次处理'
                        },
                        {
                            'id':5,
                            'name':'多次处理中'
                        },
					]
				}
				
				/**
				 * 举报人评价
				 */
				function getAssessList(){
					$scope.assessList = [
						{
							'id':1,
							'name':'满意'
						},
						{
							'id':2,
							'name':'不满意'
						}
					]
				}
				
				/**
				 * 上传附件
				 */
				$scope.getUploadFile = function(id){
					if( id == 1 ){
                        $('#coverModal1').modal('show');
                    }else if( id == 2 ) {
                        $('#coverModal2').modal('show');
					}else if ( id == 3 ) {
                        $('#coverModal3').modal('show');
					}
				}
				
				/**
				 * 关闭上传附件
				 */
				$scope.getUpload = function(id){
                    var formFile = new FormData();
                    if( id == 1 ){
                        $('#coverModal1').modal('hide');
                        // var fileObj = document.querySelector('input[type=file]').files[0];
                        var fileObj = document.querySelector('#uploadfile1').files[0];
                        formFile.append("file", fileObj); //加入文件对象
                    }else if( id == 2 ) {
                        $('#coverModal2').modal('hide');
                        var fileObj = document.querySelector('#uploadfile2').files[0];
                        formFile.append("file", fileObj); //加入文件对象
                    }else if ( id == 3 ) {
                        $('#coverModal3').modal('hide');
                        var fileObj = document.querySelector('#uploadfile3').files[0];
                        formFile.append("file", fileObj); //加入文件对象
                    }

                    $http({
                            method: 'post',
                            url: apiPrefix + '/v1/socialReport/upload',
                            data:formFile,
                            headers: {'Content-Type': undefined},
                            transformRequest: angular.identity
                        }
                    ).success(function (res) {
                        if (res.resCode == 1) {
                            //console.log(res);
                            if(id == 1){
                                $scope.problemAttant = res.data;
                            }else if(id == 2) {
                                $scope.proposedTreatment = res.data;

                            }else if (id == 3){
                                $scope.processingResults = res.data;
                            }
                        } else {
                            layer.msg("服务器异常，请稍后再试");
                        }
                    }).error(function (res) {
                        layer.msg('服务器异常，请稍后再试');
                    });
                }
				
				/**
				 * 新增
				 */
				$scope.getSubmit = function(){
					var params = {
                            reportDate: $scope.beginTime,
                        	regionName: $scope.regionName,
                        	riverName: $scope.riverName,
							reportor: $scope.reportor,
							contactType: $scope.contactType,
							problemPosition: $scope.problemPosition,
							reportProblem: $scope.reportProblem,
                        	processingStatus: $scope.status.name,
							reportEvaluate:$scope.assess,
                        	problemAttant:$scope.problemAttant,
                        	proposedTreatment:$scope.proposedTreatment,
                            processingResults: $scope.processingResults,
                        	reportSource: $scope.source,
							overTime: $scope.overtime

					}
                    //console.log(params);
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/socialReport/addReport',
                        method: 'POST',
                        params: params,
                        callBack: function (res) {
                            if(res.resCode == 1){
                                layer.msg("新增成功！",{time:2000});
                                clear();
                                routeService.route('3-8', true);
                            }
                        }
                    })
				}
				
				
				/**
				 * 返回
				 */
				$scope.getBack = function(){
                    clear();
					routeService.route('3-8', true);
				}

				function clear() {
                    $scope.problemAttant = '';
                    $scope.proposedTreatment = '';
                    $scope.processingResults = '';
                    $scope.source = '';
                    $scope.overtime = '';
                }
				
				
            }
        ]);

})(window, angular)