    'use strict';
    var app = angular.module('app');
    app.controller(
        'changeController',
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
            function changeController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope,globalParam, $window, routeService, $http) {
            $scope.names = globalParam.getter().data.name;
			$scope.id = globalParam.getter().data.id;
			$scope.x = globalParam.getter().data.typeId;
			$scope.description = globalParam.getter().data.description;
			$scope.status = globalParam.getter().data.status;
			$scope.typeName = globalParam.getter().data.typeName;
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
			$scope.change = function () {
				if (!$scope.names || !$scope.description){
					alert("请完善信息");
				}else{
					// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
					$http({    
			            method: "put",    
			            url:  $localStorage.serviceUrl + "/smRole/updateById",
			            params:{id:$scope.id,name:$scope.names,description:$scope.description},
			    		}).success(
							function () {
								alert('修改成功');
								routeService.route(72, true);
					    }
					);
				}
		    }
			$scope.back = function () {
				//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
		    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
				routeService.route(72, true);
		    }
     }]);

