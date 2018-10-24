    'use strict';
    var app = angular.module('app');
    app.controller(
        'userDetailsController',
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
            function userDetailsController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope,globalParam, $window, routeService, $http) {
   			// $scope.name = globalParam.getter().data.name;
			// $scope.roleIds = globalParam.getter().data.roleIds;
			// $scope.userName = globalParam.getter().data.userName;
			// $scope.gender = globalParam.getter().data.gender;
			// $scope.cellphone = globalParam.getter().data.cellphone;
			// $scope.password = globalParam.getter().data.password;
			$scope.id = globalParam.getter();
			$http({
	            method: "get",
	            url:  $localStorage.serviceUrl + "/smUser/getById",
	            params: {id:$scope.id}
	    		}).success(
					function (res) {
						if (res.resCode == 1) {
							$scope.name = res.data.name;
							$scope.userName = res.data.userName;
							$scope.cellphone = res.data.cellphone;
							$scope.password = res.data.password;
							if (res.data.gender == 1){
								$scope.gender = '男';
							}else{
								$scope.gender = '女';
							}
							$scope.regionId = res.data.regionId;
							$scope.email = res.data.email;
							$scope.birthday = res.data.birthday;
							$scope.weixin = res.data.weixin;
							$scope.qq = res.data.qq;
							$scope.description = res.data.description;
							$scope.userImage = res.data.userImage;
							$scope.position = res.data.position;
							$scope.department = res.data.department;
						} else {
							alert("服务器异常!");
						}

				}
	    	);
	    	$http({
	            method: "get",
	            url:  $localStorage.serviceUrl + "/smRole/queryRoleListByUserId",
	            params: {userId:$scope.id}
	    		}).success(
					function (res) {
						if (res.resCode == 1) {
							$scope.roleNames = res.data[0].name;
						} else {
							alert("服务器异常!");
						}

				}
	    	);
			$scope.change = function () {
				if (!$scope.name || !$scope.roleIds || !$scope.userName || !$scope.password || !$scope.cellphone || !$scope.gender){
					alert("请完善信息");
				}else{
					// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
					$http({
			            method: "put",
			            url:  $localStorage.serviceUrl + "/smUser/updateById",
			            params:{roleIds:$scope.roleIds,name:$scope.name,userName:$scope.userName,password:$scope.password,gender:$scope.gender,cellphone:$scope.cellphone,regionId:$scope.regionId,email:$scope.email,birthday:$scope.dateOne,weixin:$scope.weixin,qq:$scope.qq,description:$scope.description},
			    		}).success(
							function () {
								alert('修改成功');
								routeService.route(74, true);
					    }
					);
				}
		    }
			$scope.back = function () {
				//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId , 
		    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
				routeService.route(74, true);
		    }

        }]);

