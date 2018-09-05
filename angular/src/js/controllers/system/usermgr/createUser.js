(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'createUserController',
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
            function createUserController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope, $window, routeService, $http) {
            $scope.roleType = function () {
				// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
		    	$http({
		            method: "GET",
		            url:  $localStorage.serviceUrl + "/smRole/queryRoleList",
		            params:{pageNumber:-1,pageSize:-1},
		    		}).success(
						function (res) {
							if (res.resCode == 1) {
								$scope.roles = res.data.records;
							} else {
								alert("服务器异常!");
							}
				    }
				);
		    }
			var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
	        $scope.findUserName = function (userName) {
				 $http({
			            method: "get",
			            url:  $localStorage.serviceUrl + "/common/checkUserNameExist",
			            params:{userName:userName},
			    		}).success(
							function (res) {
								console.log(res.resCode)
								if (res.resCode == 0) {
									$('#yz').text('该用户名已存在！请重新输入');
								} else {
									if (res.resCode == 1) {
										$('#yz').text("");
									} else {
										if (res.resCode == 1009) {
											$('#yz').text("用户名不能为空!");
										} else {
											$('#yz').text("服务器异常!");
										}
									}
								}
					    }
					);
		    }
		    $scope.findCellphone = function (cellphone) {
				if(!myreg.test(cellphone)){
					$('#yz1').text("请填写正确的手机号码");
				}else{
				 $http({
			            method: "get",
			            url:  $localStorage.serviceUrl + "/common/checkCellphoneExist",
			            params:{cellphone:cellphone},
			    		}).success(
							function (res) {
								if (res.resCode == 0) {
									$('#yz1').text('该手机号码已注册！请重新输入')
								} else {
									if (res.resCode == 1) {
										$('#yz1').text("");
									} else {
										if (res.resCode == 1009) {
											$('#yz1').text("手机号不能为空!");
										} else {
											$('#yz1').text("服务器异常!");
										}
									}
								}
					    }
					);
				}
		    }
		    $scope.roleID = function (x) {
				 $scope.roleIds = x.id;
		    }
			$scope.createUser = function () {
			    var options = $("#xb option:selected");
			    $scope.gender = options.val();
				if($('#yz').text() != '' || $('#yz1').text() != ''){
					return;
				}else{
					if (!$scope.roleIds || !$scope.name ||  !$scope.userName || !$scope.password || !$scope.cellphone || !$scope.gender){
						alert("*为必填，请完善信息");
					}else{
						$http({
							method: "post",
							url:  $localStorage.serviceUrl + "/smUser/addUser",
							params:{roleIds:$scope.roleIds,name:$scope.name,userName:$scope.userName,password:$scope.password,gender:$scope.gender,cellphone:$scope.cellphone,regionId:$scope.regionId,email:$scope.email,birthday:$scope.dateOne,weixin:$scope.weixin,qq:$scope.qq,description:$scope.description},
						}).success(
							function () {
								alert('创建成功');
								routeService.route(84,true);
							}
						);
					}
				}
		    }
			$scope.back = function () {
				//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
		    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
				routeService.route(84,true);
		    }

		    var datepicker1 = $('#datetimepicker1')
	            .datetimepicker({
	                format: 'YYYY-MM-DD',
	                locale: moment.locale('zh-cn')
	            })
	            .on(
	                'dp.change',
	                function (e) {
	                    var result = new moment(e.date)
	                        .format('YYYY-MM-DD');
	                    $scope.dateOne = result;
	                    $scope.$apply();
	            });

            }]);
})(window, angular);


