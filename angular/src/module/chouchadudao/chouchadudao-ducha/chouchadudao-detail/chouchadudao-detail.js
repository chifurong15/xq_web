(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'duchaViewCtrl',
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
				
					var apiPrefix = moduleService.getServiceUrl() + '/inspection';
                    //var apiPrefix = 'http://10.0.9.116:7025' + '/inspection';
                    //var apiPrefix = 'http://10.0.9.203:8081' + '/inspection';

                    var options = {
                        pdfOpenParams: {
                            pagemode: "thumbs",
                            navpanes: 0,
                            toolbar: 0,
                            statusbar: 0,
                            view: "FitV"
                        }
                    };

					$scope.id = localStorage.getItem('id');
					$scope.state = localStorage.getItem('state');
					$scope.oneregion = localStorage.getItem('oneregion');

					$scope.init = function () {
                        $scope.isShow1 = true; //显示通报tab栏
                        $scope.isShow2 = false; //隐藏一区一单tab栏
                        if($scope.oneregion && $scope.oneregion == 1){
                            $scope.isShow2 = true ;
                            $scope.isShow1 = false ;
                        }else{
                            $scope.isShow2 = false ;
                            $scope.isShow1 = true ;
                        }


                        getBasic ();
                        if($scope.state != 1){
                            getConcatList ();
                        }

                        if($scope.state != 1 || $scope.state != 0){
                            getGroupList ();
                        }

                        if($scope.state ==3 || $scope.state == 4){
                            getReport ();
                        }
                        if($scope.state == 4){
                            getDealDetail ();
                        }

                        //getDealDetail ();
                        //getResult ();
                    }

                    //查看附件
                    $scope.viewFile = function () {
                        $('#myModal').modal('show');
                    }
                    //取消查看
                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                    }


                    // 获取基础资料
                    function getBasic () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/Inspection/detail',
                            method: 'get',
                            params:{
                                id:$scope.id
                            },
                            callBack: function (res) {
                                if(res.data){
                                    $scope.resBasic = res.data;
                                    PDFObject.embed(res.data.accessory, "#file", options);
                                }
                            }
                        })
                    }
                    //获取联络员列表
                    function getConcatList () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ComtactPerson/selectList',
                            method: 'get',
                            params:{
                                inspectionid:$scope.id
                            },
                            callBack: function (res) {
                                $scope.contactList = res.data.list;
                            }
                        })
                    }

                    //获取督导组列表
                    function getGroupList () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/Supervise/selectList',
                            method: 'get',
                            params:{
                                inspectionid:$scope.id
                            },
                            callBack: function (res) {
                                $scope.groupList = res.data.list;
                            }
                        })
                    }

                    //获取通报信息
                    function getReport () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/TrafficList/selectById',
                            method: 'get',
                            params:{
                                inspectionId: $scope.id
                            },
                            callBack: function (res) {
                                if(res.data){
                                    $scope.resReport = res.data;
                                    PDFObject.embed(res.data.accessory, "#file", options);
                                }

                            }
                        })
                    }
                    //获取问题处理详情
                    function getDealDetail () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ProblemHandle/selectById',
                            method: 'get',
                            params:{
                                inspectionId: $scope.id
                            },
                            callBack: function (res) {
                                if(res.data){
                                    $scope.resDealDetail = res.data;
                                    PDFObject.embed(res.data.accessory, "#file", options);
                                }
                            }
                        })

                    }

                    //获取结果反馈
                    function getResult () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + 'v1/ProblemHandle/selectById',
                            method: 'get',
                            params:{
                                inspectionId: $scope.id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.resResult = res.data;
                                        PDFObject.embed(res.data.accessory, "#file", options);
                                        if($scope.resResult.whether && $scope.resResult.whether == 1){
                                            $scope.whether = '已处理'
                                        }else{
                                            $scope.whether = '未处理'
                                        }
                                    }
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })

                    }
					// 单选按钮组
	                $scope.typeList = [
	                    {"id": 1, "typeName": "是"},
	                    {"id": 2, "typeName": "否"}
	                ];
	                $scope.radioBtn = function(type){
	                    $scope.type = type;
	                }
	                
					//返回
					$scope.goBack = function(){
						history.back(-1);
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
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getConcatList);

			} ]);
})(window, angular);
