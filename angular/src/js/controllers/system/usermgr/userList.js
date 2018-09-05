(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'userListController',
        [
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
            function userListController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope,globalParam, $window, routeService, $http) {
            //刷新
		$scope.reloadRoute = function () {
		    $window.location.reload();
            
		};

		//分页
	    var reGetProducts = function(){
	    	// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
	        $http({
	        	url:  $localStorage.serviceUrl + '/smUser/queryUserList',
	        	method:'get',
	        	params:{pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage},
	        }).success(function(res){
                if (res.resCode == 1) {
                    $scope.paginationConf.totalItems = res.data.totalNum;
//		            // 变更产品条目
                    $scope.userList = res.data.records;
                } else {
                    alert("服务器异常!");
                }
	        	}).error(function(error){
	        });
	    };

		// 配置分页基本参数
		$scope.paginationConf = {
				currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
		        itemsPerPage: 10,
		        pagesLength:5,
		        perPageOptions: [1, 2, 3, 4, 5,10],
		        onChange: function(){
		            console.log($scope.paginationConf.currentPage);
		            $location.search('currentPage', $scope.paginationConf.currentPage);
		        }
		};

		// 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
		$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

		var datas;
		//修改
	    $scope.revise = function (id) {
	    	globalParam.setter(id);
	    	routeService.route(805, false);
	    	// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
	   //  	$http({
	   //          method: "get",
	   //          url:  $localStorage.serviceUrl + "/smUser/getById",
	   //          params: {id:id}
	   //  		}).success(
				// 	function (res) {
				// 	datas = res;
				// 	globalParam.setter(datas)
				// 	routeService.route(805, false);
				// }
	   //  	);
	    };
	    //详情
		$scope.details = function (id) {
	    	globalParam.setter(id);
	    	routeService.route(806, false);

	    };
		//删除
        $scope.deletes = function(id) {
            var layerIndex = layer.confirm('确定删除本条数据吗？', {
                btn : [ '确定', '取消' ]
            // 按钮
            }, function() {
                $http({
                    url : $localStorage.serviceUrl + "/smUser/deleteById",
                    method: "delete",
                    params:{id:id}
                }).success(function success(result) {
                    reGetProducts();
                    alert("删除成功")
                }, function failure(result) {
                	alert("删除失败！")
                });
                layer.close(layerIndex);
            }, function() {

            });
        };
        //重置密码
        $scope.reset = function(id) {
            var layerIndex = layer.confirm('确定重置当前密码吗？', {
                btn : [ '确定', '取消' ]
                // 按钮
            }, function() {
                $http({
                    url : $localStorage.serviceUrl + "/smUser/resetPassword",
                    method: "put",
                    params:{id:id}
                }).success(function success(result) {

                    alert("重置成功")
                }, function failure(result) {
                    alert("重置失败！")
                });
                layer.close(layerIndex);
            }, function() {

            });
        };
	    //注销启用
	    // $scope.cancel = function (id) {
     //        // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
     //        $http({
     //            method: "get",    
     //            url:  $localStorage.serviceUrl + "/smUser/getById",    
     //            params: {id:id}
     //            }).success(
     //                function (res) {
     //                    status = res.data.status;
     //                    if(status == 1){
     //                        status = 2
     //                    }else{
     //                        status = 1
     //                    }
     //                    $http({
     //                        method: "put",    
     //                        url:  $localStorage.serviceUrl + "/smUser/updateById",    
     //                        params: {id:id,status:status}
     //                        }).success(
     //                            function (){
     //                                reGetProducts();
     //                            }
     //                        );
     //                    }
     //            );
     //    };
	    $scope.addUser = function () {
	    	//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
	    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
	    	routeService.route(804, false);
	    };

	    $scope.userType = function () {
            // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
            $http({
                method: "GET",
                url:  $localStorage.serviceUrl + "/smRole/queryRoleList",
                params:{pageNumber:-1,pageSize:-1},
                }).success(
                    function (res) {
                        if (res.resCode == 1) {
                            $scope.users = res.data.records;
                        } else {
                            alert("服务器异常!");
                        }
                    }
                );
            }
        $scope.userTypeFind = function (x) {
            if(x == null){
                $http({
                    url:  $localStorage.serviceUrl + '/smUser/queryUserList',
                    method:'get',
                    params:{pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage},
                }).success(function(res){
                    if (res.resCode == 1) {
                        $scope.paginationConf.totalItems = res.data.totalNum;
//		            // 变更产品条目
                        $scope.userList = res.data.records;
                    } else {
                        alert("服务器异常!");
                    }
                }).error(function(error){
                });
            }else{
                $http({
                    method: "GET",
                    url:  $localStorage.serviceUrl + "/smUser/queryUserList",
                    params:{roleId:x.id},
                }).success(
                    function (res) {
                        if (res.resCode == 1) {
                            $scope.paginationConf.totalItems = res.data.totalNum;
                            $scope.userList = res.data.records;
                        } else {
                            alert("服务器异常!");
                        }
                    }
                );
            }
        }

	  //   $scope.find = function () {
			// // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
	  //   	$http({
	  //           url:  $localStorage.serviceUrl + "/smUser/queryUserList",
	  //           method:'get',
	  //           params:{name:$scope.name,pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage},
	  //   		}).success(
			// 		function (res) {
			// 		   $scope.paginationConf.totalItems = res.data.totalNum;
			//         $scope.userList = res.data.records;
			//     }
			// );
	  //   }
     }]);
})(window, angular);

