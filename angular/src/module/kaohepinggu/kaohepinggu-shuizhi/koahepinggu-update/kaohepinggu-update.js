(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'shuizhiUpdateCtrl',
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
				function shuizhiUpdateCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/quality';
                    //var apiPrefix = "http://10.0.9.116:7004" + '/quality';
					
					$scope.init = function () {						
						
                        $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                        $scope.id = localStorage.getItem('id');
						getData(getQueryString('id'));
						getDate ();
						getAllName();
                        //$scope.num = 1;
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/userinfo1',
                            method: 'get',
                            params:{
                                id: $scope.userInfo.id
                            },
                            callBack: function (res) {
                                $scope.num = res.data;
                            }
                        })
					}
					
					//搜索
					$scope.search = function () {
//						console.log($scope.section+'-----'+$scope.riverName)
						getData();
					}
					
					// 数据详情
					function getData () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/WaterQualityGrade/list?parentid=' + $scope.id,
							method: 'get',
							params: {								
								name:$scope.section1,
								riverName:$scope.riverName1,
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage
							},
							callBack: function (res) {
								$scope.detailList = res.data.list;
                    			$scope.paginationConf.totalItems = res.data.total;
							}
						})
					}
					
					//获取所有的断面  河流
					function getAllName () {
						$http({
			                method: 'GET',
			                url: apiPrefix + '/v1/WaterQualityGrade/selectCascade',				               
			            }).success(function (res) {
		                	
		                	var data = res.data;
		                	//断面
		                	$scope.nameOption = [] ;
		                	//河流
		                	$scope.riverOption = [] ;
		                	data.map(function(item , index){
		                		$scope.nameOption.push({id:index,name:item.name});
		                		$scope.riverOption.push({id:index,riverName:item.mdSection.riverName})
		                	})		                	
//		                	console.log('断面list:', $scope.nameOption);
			            })
					}
					
					
					//监听断面
					$scope.getSectionChange = function(){
						//console.log('断面---',$scope.section + "----河流----"+ $scope.riverName);
					}
					//监听河流					
					$scope.getRiverChange = function(){
						//console.log('断面---',$scope.section + "----和流----"+ $scope.riverName);
					}

                    //新增得分条目
                    $scope.add = function () {
                        $scope.type = 2 ; //新增
                        $("#myModal").modal('show');
                    }

                    //修改得分条目
                    $scope.edit = function (item) {
                        $('#myModal').modal('show');
                        if(item){
                            $scope.type=1;//修改
                            $scope.samplingTime = item.samplingTime;
                            $scope.water_temperature = item.water_temperature;
                            $scope.total_phosphorus = item.total_phosphorus;
                            $scope.ammonia_nitrogen = item.ammonia_nitrogen;
                            $scope.permanganate_index = item.permanganate_index;
                            $scope.DO = item.dO;
                            $scope.selfId = item.id;
                        }

                    }

                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                        clear();
                    }
                    //监听断面
                    $scope.getSectionChange = function(id){
                        //$scope.riverName = $scope.riverOption[$scope.section].riverName ;
                         $scope.sectionType = $scope.nameOption[id].name ;
                         $scope.riverName = $scope.riverOption[id].riverName ;
                        // console.log('断面---',$scope.nameOption[id].name );
                        console.log(id);
                        //console.log('河流---',$scope.riverOption[id].riverName );
                    }

                    //保存条目
                    $scope.save = function () {
                        if (!$scope.samplingTime) {
                            layer.alert("请选择日期", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_temperature) {
                            layer.alert("请输入水温", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.total_phosphorus) {
                            layer.alert("请输入总磷", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.ammonia_nitrogen) {
                            layer.alert("请输入氨氮", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.permanganate_index) {
                            layer.alert("请输入高锰酸盐指数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.DO) {
                            layer.alert("请输入溶解氧", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                        if($scope.type == 2){ //新增
                            //console.log($scope.type)

                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/WaterQualityGrade/haveSection',
                                method: 'get',
                                params: {
                                    parentid: $scope.id,
                                    name: $scope.sectionType
                                },
                                callBack: function (res) {
                                    if(res.data == 10){
                                        //可以添加
                                        $ajaxhttp.myhttp({
                                            url: apiPrefix + '/v1/WaterQualityGrade/add',
                                            method: 'POST',
                                            params: {
                                                parentid: $scope.id,
                                                name: $scope.sectionType,
                                                riverName: $scope.riverName,
                                                samplingTime: $scope.samplingTime,
                                                water_temperature: $scope.water_temperature,
                                                total_phosphorus: $scope.total_phosphorus,
                                                ammonia_nitrogen: $scope.ammonia_nitrogen,
                                                permanganate_index: $scope.permanganate_index,
                                                DO: $scope.DO,
                                            },
                                            callBack: function (res) {
                                                if(res.resCode == 1){
                                                    layer.msg('新增成功', {time:2000});
                                                    getData($scope.id);
                                                    clear();//创建成功后清空
                                                    $('#myModal').modal('hide');
                                                }else{
                                                    layer.msg(res.resMsg, {time:2000});
                                                }
                                            }
                                        })
                                    }else{
                                        layer.msg('不能添加已有的断面', {time:2000});
                                    }
                                }
                            })

                        }else if($scope.type == 1){ //修改

                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/WaterQualityGrade/update',
                                method: 'PUT',
                                params: {
                                    id: $scope.selfId ,
                                    samplingTime: $scope.samplingTime ,
                                    water_temperature: $scope.water_temperature ,
                                    total_phosphorus: $scope.total_phosphorus ,
                                    ammonia_nitrogen: $scope.ammonia_nitrogen ,
                                    permanganate_index: $scope.permanganate_index ,
                                    DO: $scope.DO
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功', {time:2000});
                                        clear();//创建成功后清空
                                        getData($scope.id);
                                        $('#myModal').modal('hide');
                                    }else{
                                        layer.msg(res.resMsg, {time:2000});
                                    }
                                }
                            })
                        }

                    }

                    //删除单条水质条目
                    $scope.delete = function (id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQualityGrade/delete',
                            method: 'DELETE',
                            params: {
                                id: id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('删除成功', {time:2000});
                                    getData($scope.id);
                                }
                            }
                        })
                    }

                    // 上传文件
                    $scope.uploadFile = function (e) {
                        for (var i = 0; i < e.files.length; i++) {
                            var form = new FormData();
                            var file = e.files[i];
                            $scope.attandName = file.name;
                            form.append('file', file);
                            form.append('fileName', file.name);
                            form.append('parentid', $scope.id);
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/WaterQualityGrade/deletelist',
                                method: 'DELETE',
                                params: {
                                    parentid: $scope.id
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        $http({
                                            method: 'POST',
                                            url: apiPrefix + '/v1/WaterQualityGrade/upload',
                                            data: form,
                                            headers: {'Content-Type': undefined},
                                            transformRequest: angular.identity
                                        }).success(function (data) {
                                            if(data.resCode == 1){
                                                getData($scope.id);
                                            }
                                        }).error(function (data) {
                                            console.log('upload fail');
                                        })
                                    }
                                }
                            })
                        }
                    }

                    $('#samplingTime').datetimepicker({
	                    format: 'YYYY-MM-DD',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.samplingTime = new moment(c.date).format('YYYY-MM-DD');
	                    $scope.$apply();
	                });
					
					//获取当前时间
					 function getDate () {
	                    setInterval(function () {
							var date = new Date(),
								year = date.getFullYear(),
								month = date.getMonth() + 1,
								day = date.getDate(),
								hour = date.getHours(),
								min = date.getMinutes(),
								second = date.getSeconds();
								
							$scope.$apply(function () {
								$scope.currentdate=year + '-' + month  + '-' + day + ' ' + 
								(hour < 10 ? '0' + hour : hour) + ':' +
								(min < 10 ? '0' + min : min) + ':' +
								(second < 10 ? '0' + second : second) ;
							})
	                    }, 1000);
					}
									
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}
                    //清空表单
                     function clear() {
                        $scope.section = '',
                        $scope.riverName = '',
                        $scope.samplingTime = '';
                        $scope.water_temperature = '';
                        $scope.total_phosphorus = '';
                        $scope.ammonia_nitrogen = '';
                        $scope.permanganate_index = '';
                        $scope.DO = '';
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
	                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getData);
			} ]);
})(window, angular);
