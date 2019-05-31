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
                    // var apiPrefix = "http://10.0.9.133:7004" + '/quality';

					$scope.init = function () {						
						
                        $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                        $scope.id = localStorage.getItem('id');
                        $scope.status = localStorage.getItem('status');

                        $scope.type = '';

                        if($scope.type == 2){
                            $scope.showSectionList1 = false;
                            $scope.showRiverList1 = false;
                        }else{
                            $scope.showSectionList = false;
                            $scope.showRiverList = false;
                        }

                        getSection ()

                        getRiver ()

                        getData(getQueryString('id'));
						getDate ();

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
                        getData(getQueryString('id'));
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

					//断面
                    $scope.selectSectionId = function (name) {
                        if (name) {
                            if($scope.type == 2){

                                $scope.showSectionList1 = false;
                                $scope.section = $scope.sectionList1.filter(function (item) {
                                    return item === name
                                })[0]

                            }else{
                                $scope.showSectionList = false;
                                $scope.section1 = $scope.sectionList.filter(function (item) {
                                    return item === name
                                })[0]
                            }

                        }
                    };

					
					//获取所有的断面
					$scope.searchSectionList = function () {
                        if($scope.type == 2){

                            $scope.showSectionList1 = true;
                        }else{
                            $scope.showSectionList = true;
                        }
                        getSection ()
                    }
					function getSection () {
                        var params;
					    if($scope.type == 2){
                            params = {
                                sectionName: $scope.section ? $scope.section  : ''
                            }
                        }else{
                            params ={
                                sectionName: $scope.section1 ? $scope.section1  : ''
                            };
                        }

                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQualityGrade/selectSection',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if (res.resCode === 1) {
                                    var list = res.data;
                                    if (list.length > 10) {
                                        list.length = 10;
                                    }
                                    if($scope.type == 2){
                                        $scope.sectionList1 = list;
                                    }else{
                                        $scope.sectionList = list;
                                    }
                                }
                            }
                        })
                    }

                    //河流
                    $scope.selectRiverId = function (name) {
                        if (name) {
                            if($scope.type == 2){

                                $scope.showRiverList1 = false;
                                $scope.riverName = $scope.riverList1.filter(function (item) {
                                    return item === name
                                })[0]
                            }else{
                                $scope.showRiverList = false;
                                $scope.riverName1 = $scope.riverList.filter(function (item) {
                                    return item === name
                                })[0]
                            }

                        }
                    };

                    //获取所有的河流
                    $scope.searchRiverList = function () {
                        if($scope.type == 2){

                            $scope.showRiverList1 = true;
                        }else{
                            $scope.showRiverList = true;
                        }
                        getRiver ()
                    }

                    function getRiver () {
                        var params;
                        if($scope.type == 2){
                            params = {
                                name: $scope.riverName ? $scope.riverName  : ''
                            }
                        }else{
                            params ={
                                name: $scope.riverName1 ? $scope.riverName1 : ''
                            };
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQualityGrade/selectRiver',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if (res.resCode === 1) {
                                    var list = res.data;
                                    if (list.length > 10) {
                                        list.length = 10;
                                    }
                                    if($scope.type == 2){
                                        $scope.riverList1 = list;
                                    }else{
                                        $scope.riverList = list;
                                    }
                                }
                            }
                        })
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
                        $scope.type = ''
                        $('#myModal').modal('hide');
                        clear();
                    }


                    //保存条目
                    $scope.save = function () {

                        if($scope.samplingTime && $scope.water_temperature && $scope.total_phosphorus && $scope.ammonia_nitrogen && $scope.permanganate_index && $scope.DO){
                            if ($scope.water_temperature >= 0 && $scope.water_temperature <= 100
                                && $scope.total_phosphorus >= 0 && $scope.total_phosphorus <= 100
                                && $scope.ammonia_nitrogen >= 0 && $scope.ammonia_nitrogen <= 100
                                && $scope.permanganate_index >= 0 && $scope.permanganate_index <= 100
                                && $scope.DO >= 0 && $scope.DO <= 100)
                            {

                                if($scope.type == 2){ //新增
                                    //console.log($scope.type)

                                    $ajaxhttp.myhttp({
                                        url: apiPrefix + '/v1/WaterQualityGrade/haveSection',
                                        method: 'get',
                                        params: {
                                            parentid: $scope.id,
                                            name: $scope.section
                                        },
                                        callBack: function (res) {
                                            if(res.data == 10){
                                                //可以添加
                                                $ajaxhttp.myhttp({
                                                    url: apiPrefix + '/v1/WaterQualityGrade/add',
                                                    method: 'POST',
                                                    params: {
                                                        parentid: $scope.id,
                                                        name: $scope.section,
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


                            }else{
                                layer.alert("数据范围是0-100", {
                                    skin: 'my-skin',
                                    closeBtn: 1,
                                    anim: 3
                                });
                            }

                        }else{
                            layer.alert("请输入必填项", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
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
                                                layer.msg('导入成功', {time:2000});
                                                getData($scope.id);
                                            }else if(data.resCode == 0){
                                                layer.msg(data.resMsg, {time:2000});
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
