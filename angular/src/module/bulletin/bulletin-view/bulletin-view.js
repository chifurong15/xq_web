(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'bulletinViewCtrl',
			[
				'$sce',
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
				function bulletinViewCtrl($sce,$localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/bulletin';
                    // var apiPrefix = 'http://10.0.9.133:6008' + '/bulletin';

                    $scope.getServiceUrl= moduleService.getServiceUrl();
					$scope.init = function () {

                        $scope.showImg = false;

						var bulletin = globalParam.getter().bulletin || {};
						if (!!getQueryString('id')) {
							bulletin.id = getQueryString('id');
						}
						
						// 编辑时获取原数据
						if (bulletin.id) {
							$location.search('id', bulletin.id);
						}
						getData(bulletin.id);
					}
					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}
					// 数据详情
					function getData (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/bulletin/detail',
							method: 'get',
							params: {
								id: id
							},
							callBack: function (res) {
								$scope.bulletin = res.data;
                                if($scope.bulletin.detail){
                                    $scope.bulletin.detail = $sce.trustAsHtml($scope.bulletin.detail)
                                }
								if($scope.bulletin.ren){
									var i = $scope.bulletin.ren.indexOf('.');
									var str = $scope.bulletin.ren.slice(i+1);
									// console.log(str)
									if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'){
										$scope.showImg = true;
									}else{

									}
								}
                                var index = $scope.bulletin.attand_url.lastIndexOf("\/");
                                $scope.attandName = $scope.bulletin.attand_url.substring(index+1);
                                // var options = {
                                //     pdfOpenParams: {
                                //         pagemode: "thumbs",
                                //         navpanes: 0,
                                //         toolbar: 0,
                                //         statusbar: 0,
                                //         view: "FitV"
                                //     }
                                // };
                                // PDFObject.embed($scope.bulletin.detail_url, "#pdfOb", options);
							}
						})
					}

                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
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
