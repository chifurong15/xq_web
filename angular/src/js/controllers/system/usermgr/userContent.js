(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'userContentController',
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
            function userContentController($localStorage, $scope, $location, $log,
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
							$scope.userName1 = res.data.userName;
							$scope.cellphone = res.data.cellphone;
							$scope.cellphone1 = res.data.cellphone;
							if (res.data.gender == 1){
								$scope.gender = '男';
							}else{
								if (res.data.gender == 2) {
									$scope.gender = '女';
								}
							}
							$scope.regionId = res.data.regionId;
							$scope.email = res.data.email;
							$scope.birthday = res.data.birthday;
							$scope.weixin = res.data.weixin;
							$scope.qq = res.data.qq;
							$scope.description = res.data.description;
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
							$scope.roleIds = res.data[0].id;
						} else {
							alert("服务器异常!");
						}

				}
	    	);
	    	 $scope.roleType = function () {
				// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
		    	$http({
		            method: "GET",
		            url:  $localStorage.serviceUrl + "/smRole/queryRoleList",
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
							if (res.resCode == 0) {
								$('#yz').text('该用户名已存在！请重新输入');
								$('#btn1').attr("disabled",true);
								if(userName == $scope.userName1){
									$('#yz').text("");
									$('#btn1').attr("disabled",false);
								}
							} else {
								if (res.resCode == 1) {
									$('#yz').text("");
									$('#btn1').attr("disabled",false);
								} else {
									if (res.resCode == 1009) {
										$('#yz').text("用户名不能为空!");
										$('#btn1').attr("disabled",true);
									} else {
										$('#yz').text("服务器异常!");
										$('#btn1').attr("disabled",true);
									}
								}
							}
						}
					);
				}
				$scope.findCellphone = function (cellphone) {
					if(!myreg.test(cellphone)){
						$('#yz1').text("请填写正确的手机号码");
						$('#btn1').attr("disabled",true);
					}else{
						$http({
							method: "get",
							url:  $localStorage.serviceUrl + "/common/checkCellphoneExist",
							params:{cellphone:cellphone},
						}).success(
							function (res) {
							if (res.resCode == 0) {
								$('#yz1').text('该手机号码已注册！请重新输入');
								$('#btn1').attr("disabled",true);
								if(cellphone == $scope.cellphone1){
									$('#yz1').text("");
									$('#btn1').attr("disabled",false);
								}
							} else {
								if (res.resCode == 1) {
									$('#yz1').text("");
									$('#btn1').attr("disabled",false);
								} else {
									if (res.resCode == 1009) {
										$('#yz1').text("手机号不能为空!");
										$('#btn1').attr("disabled",true);
									} else {
										$('#yz1').text("服务器异常!");
										$('#btn1').attr("disabled",true);
									}
								}
							}
						}
					);
				}
			}
			$scope.dis = function () {
        	if (!$scope.name  || !$scope.userName || !$scope.cellphone || !$scope.gender){
					$('#btn1').attr("disabled",true);
				}else{
					$('#btn1').attr("disabled",false);
					}
            }
		    $scope.roleID = function (x) {
				 $scope.roleIds = x.id;
		    }
			$scope.change = function () {
				var options = $("#xb option:selected");
			    $scope.gender1 = options.val();
				if($('#yz').text() != '' || $('#yz1').text() != ''){
					return;
				}else{
					if (!$scope.name || !$scope.roleIds || !$scope.userName || !$scope.cellphone || !$scope.gender){
						alert("请完善信息");
					}else{
						$http({
							method: "put",
							url:  $localStorage.serviceUrl + "/smUser/updateById",
							params:{id:$scope.id,roleIds:$scope.roleIds,name:$scope.name,userName:$scope.userName,gender:$scope.gender1,cellphone:$scope.cellphone,regionId:$scope.regionId,email:$scope.email,birthday:$scope.birthday,weixin:$scope.weixin,qq:$scope.qq,description:$scope.description},
						}).success(
							function () {
								alert('修改成功');
								routeService.route(84, true);
							}
						);
					}
				}
		    }
			$scope.back = function () {
				//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId , 
		    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
				routeService.route(84, true);
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
	                    $scope.birthday = result;
	                    $scope.$apply();
	            });

        }]);
})(window, angular);

