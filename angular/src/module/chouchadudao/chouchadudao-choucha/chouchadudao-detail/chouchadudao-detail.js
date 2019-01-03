(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'chouchaViewCtrl',
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
				function chouchaViewCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/spotcheck';
					// var apiPrefix = 'http://10.0.9.194:7022' + '/spotcheck';


					
					$scope.init = function () {
                        $scope.eventImgUrl = 'http://10.0.0.196/api/download' ;
						var bulletin = globalParam.getter().bulletin || {};
						$scope.id = localStorage.getItem('id');;
                        $scope.showSelect = true;//默认显示输入
                        $scope.flag = false; //默认非录入扣分


                        $ajaxhttp.myhttp({
							url: apiPrefix + '/v1/spotcheck/detailSpotcheck',
							method: 'get',
							params:{
								id: $scope.id
							},
							callBack: function (res) {
                                $scope.detail = res.data;
                                $scope.taskType = res.data.taskType == 0 ? '临时任务' : '常规任务';
							}
						})

						getData ($scope.id);
                        getProblemList ($scope.id);
                        getProblemType ();
						
					}
					
					//返回
					$scope.goBack = function(){
						history.back(-1);
					}

					// 数据详情
					function getData (id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/detailCheckResult',
                            method: 'get',
                            params:{
                                id: id
                            },
                            callBack: function (res) {
                            	$scope.checkTime = res.data.checkDate;
                            	$scope.checkPerson = res.data.sendPerson;
                                $scope.checkList = res.data.problemList;
                                $scope.checkList.map(function(item,index){
                                    if(item.attach){
                                        item.attach = item.attach.split(',');
                                    }
                                })
								// console.log($scope.checkList[1].attach)
                            }
                        })
					}

					//获取问题类型
					function getProblemType (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/listProblemType',
                            method: 'get',
                            callBack: function (res) {
                                $scope.problemTypeList = res.data;
                            }
                        })
					}

					$scope.getChange = function (type) {
                        $scope.problemTypeList.map(function (item){
                        	if(item.problemTypeName == type){
                                if(item.problemDecutionType == '固定'){
                                    $scope.showSelect = false;
                                    $scope.problemScore = item.problemScore;
									$scope.fixedScore = '固定扣分值：' + item.problemScore + '分';
								}else{
                                    $scope.showSelect = true;
								}

                                if(item.problemDecutionType == '录入扣分'){
                                    $scope.flag = true; //表示录入扣分
                                }else{
                                    $scope.flag = false;
                                }
							}
						})
                    }

                    //保存修改
					$scope.save = function (){
                        var params = {
                            spotcheckId:$scope.id,
                            id:$scope.editId,
                            problemDesc:$scope.problemDesc,
                            problemTypeName:$scope.problemType,
                            problemDeduction: $scope.showSelect ? $scope.score : $scope.problemScore,
                            spotcheckRegion:$scope.updateData.spotcheckRegion,
                            spotcheckRiver:$scope.updateData.spotcheckRiver,
                            attach:$scope.assessory ? $scope.assessory.concat($scope.updateData.attach).join(',') : $scope.updateData.attach.join(',')
                        }
                        // console.log(params);
						if($scope.problemType && $scope.problemDesc){
							if($scope.flag){//录入扣分
								if($scope.score > 10 || $scope.score < 0){
                                    layer.alert("录入扣分项范围：0-10", {
                                        skin: 'my-skin',
                                        closeBtn: 1,
                                        anim: 3
                                    })
								}else{
                                    $ajaxhttp.myhttp({
                                        url: apiPrefix + '/v1/spotcheck/update',
                                        method: 'post',
                                        params:params,
                                        callBack: function (res) {
                                            if(res.resCode == 1){
                                                layer.msg('修改成功',{times:500});
                                                getProblemList ($scope.id);
                                                $('#update').modal('hide');
                                            }else{
                                                layer.msg('服务器异常，请稍后再试',{times:500})
                                            }
                                        }
                                    })
								}
							}else{//非录入扣分
                                if($scope.score > 100 || $scope.score < 0){
                                    layer.alert("扣分项范围：0-100", {
                                        skin: 'my-skin',
                                        closeBtn: 1,
                                        anim: 3
                                    })
                                }else{
                                    $ajaxhttp.myhttp({
                                        url: apiPrefix + '/v1/spotcheck/update',
                                        method: 'post',
                                        params:params,
                                        callBack: function (res) {
                                            if(res.resCode == 1){
                                                layer.msg('修改成功',{times:500});
                                                getProblemList ($scope.id);
                                                $('#update').modal('hide');
                                            }else{
                                                layer.msg('服务器异常，请稍后再试',{times:500})
                                            }
                                        }
                                    })
								}
							}

                        }else{
                            layer.alert("输入项不能为空", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            })
						}
					}

					//下发
					$scope.sent = function (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/doDistribute',
                            method: 'PATCH',
                            params:{
                                id: $scope.id
                            },
                            callBack: function (res) {
                               if(res.resCode == 1){
                                   layer.msg('下发成功',{times:500});
                               }else{
                                   layer.msg('服务器异常，请稍后再试',{times:500})
                               }
                            }
                        })
					}

					//获取问题列表
					function getProblemList(id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/findSpotcheckProblemList',
                            method: 'get',
                            params:{
                                id: id
                            },
                            callBack: function (res) {
                                if(res.data){
                                	$scope.problemList = res.data;

								}
                            }
                        })
                    }


                    //查看问题详情
					$scope.view = function (item) {
						$('#view').modal('show');
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/detailSpotcheckProblem',
                            method: 'get',
                            params:{
                                id: item.id
                            },
                            callBack: function (res) {
                                if(res.data){
                                    $scope.problemDetail = res.data;
                                    $scope.problemDetail.creatorName = item.creatorName;
									if($scope.problemDetail.attach){
                                        $scope.problemDetail.attach = $scope.problemDetail.attach.split(',');
									}
                                }
                            }
                        })
                    }

                    //修改问题
					$scope.update = function (item){
                        $scope.assessory = [];
						$('#update').modal('show');
						$scope.updateData = item;
                        $scope.problemType = item.problemTypeName;
                        $scope.problemDesc = item.problemDesc;
                        $scope.problemTypeList.map(function (items){
                            if(items.problemTypeName == $scope.problemType){
                                if(items.problemDecutionType == '固定'){
                                    $scope.showSelect = false;
                                    $scope.problemScore = item.problemDeduction;
                                    $scope.fixedScore = '固定扣分值：' + item.problemDeduction + '分';
                                }else{
                                    $scope.showSelect = true;
                                    $scope.score = item.problemDeduction;
                                }

                                if(items.problemDecutionType == '录入扣分'){
                                    $scope.flag = true; //表示录入扣分
                                }else{
                                    $scope.flag = false;
                                }
                            }
                        })
                        $scope.editId = item.id;
                        if($scope.updateData.attach){
                            $scope.updateData.attach = $scope.updateData.attach.split(',');
                        }
					}

                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/spotcheck/delete',
                                method:'delete',
                                params:{
                                    id:id
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('删除成功',{times:500});
                                        getProblemList($scope.id)
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                            layer.close(layerIndex);
                        }, function () {

                        });
                    }
                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function () {
                        $scope.assessory = [];
                        $('#coverModal').modal('show');
                    }


                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function () {
                        $('#coverModal').modal('hide');
                        var formFile = new FormData();

                        var fileObj = document.querySelector('input[type=file]').files[0];
                        formFile.append("file", fileObj); //加入文件对象

                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/spotcheck/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                layer.msg("上传成功");
                                $scope.assessory.push(res.data.virtualPath);
                                $('#problemFile').fileinput('clear');

                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }
					
					// 获取url参数
					function  getQueryString (params, url) {
				        var url = url || location.href;
				        var search = url.split('?')[1];
				        if (search) {
				            var n = new RegExp("(^|&)" + params + "=([^(&|#)]*)((&|#)|$)", "i"),
				                r = search.match(n);
				            return null != r ? r[2] : null
				        }
				        return null;
				    }
			} ]);
})(window, angular);
