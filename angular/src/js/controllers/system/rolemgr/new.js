(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'newController',
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
            function newController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope, $window, routeService, $http) {
            $scope.roleType = function () {
				// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
		    	$http({
		            method: "GET",
		            url:  $localStorage.serviceUrl + "/smRole/queryRoleTypeList",
		    		}).success(
						function (res) {
				        $scope.roles = res.data;
				    }
				);
		    }
			$scope.roleTypeFind = function (x) {
				 $scope.typeId = x.id;
		    }
			var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
			$scope.createRole = function () {
				if (!$scope.names || !$scope.description || !$scope.typeId){
					alert("请完善信息");
				}else{
					// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
					$http({    
			            method: "post",    
			            url:  $localStorage.serviceUrl + "/smRole/addRole",
			            params:{name:$scope.names,typeId:$scope.typeId,description:$scope.description},
			    		}).success(
							function () {
								alert('创建成功')
								routeService.route(82, true);
					    }
					);
				}
		    }
			$scope.back = function () {
				//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId , 
		    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
				routeService.route(82, true);
		    }
     }]);
})(window, angular);


