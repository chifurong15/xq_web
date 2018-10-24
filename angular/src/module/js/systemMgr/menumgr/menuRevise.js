    'use strict';
    var app = angular.module('app');
    app.controller(
        'menuReviseController',
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
            function menuReviseController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope,globalParam, $window, routeService, $http) {
			$scope.id = globalParam.getter();
			$http({
	            method: "get",
	            url:  $localStorage.serviceUrl + "/smMenu/getById",
	            params: {id:$scope.id}
	    		}).success(
					function (res) {
						$scope.name = res.data.name;
						$scope.parents = res.data.parents;
						$scope.funcurl = res.data.funcurl;
						$scope.ico = res.data.ico;
						$scope.sortOrder = res.data.sortOrder;
						$scope.requireJS = res.data.requireJS;
						$scope.description = res.data.description;
				}
	    	);
			$scope.change = function () {
				$http({
		            method: "put",
		            url:  $localStorage.serviceUrl + "/smMenu/updateById",
		            params:{id:$scope.id,name:$scope.name,parents:$scope.parents,funcurl:$scope.funcurl,ico:$scope.ico,sortOrder:$scope.sortOrder,requireJS:$scope.requireJS,description:$scope.description},
		    		}).success(
						function () {
							alert('修改成功');
							routeService.route(71, true);
				    }
				);
		    }
			$scope.back = function () {
				//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId , 
		    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
				routeService.route(71, true);
		    }
        }]);

