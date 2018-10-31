    'use strict';
    var app = angular.module('app');
    app.controller(
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
					    console.log(res)
						if (res.resCode == 1) {
							$scope.name = res.data.name;
							$scope.userName = res.data.userName;
							$scope.userName1 = res.data.userName;
							$scope.cellphone = res.data.cellphone;
							$scope.regionName = res.data.regionName;
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
							//$scope.userImage = res.data.userImage;
							$scope.position = res.data.position;
							$scope.department = res.data.department;
							$scope.oldUserImage = res.data.userImage;
							
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
		    function checkImage(){
                var file = document.querySelector('input[type=file]').files[0];
                if(file == undefined){
                	//如果为空，不做检查
                	return true;
                }else{
                	var suffix = "jpg,png";
                	var curSuffix = file.name.split('.')[1];
                	curSuffix = curSuffix.toLowerCase(); 
                	if(suffix.indexOf(curSuffix)==-1)
                	{
                	   alert("图片格式只能是 .png 或 .jpg 格式！");
                	   return false;
                    }
                	$scope.userImage = file;
                	return true;
                }
		    }
		    
			$scope.change = function () {
				var options = $("#xb option:selected");
			    $scope.gender1 = options.val();
			    if(!checkImage()){
			    	return false;
			    }
				if($('#yz').text() != '' || $('#yz1').text() != ''){
					return;
				}else{
					if (!$scope.name || !$scope.roleIds || !$scope.userName || !$scope.cellphone || !$scope.gender){
						alert("请完善信息");
					}else{
						
						var formData = new FormData();
						formData.append("id",$scope.id);
						formData.append("roleIds",$scope.roleIds);
						formData.append("name",$scope.name);
						formData.append("userName",$scope.userName);
						//formData.append("password",$scope.password);
						formData.append("cellphone",$scope.cellphone);
						formData.append("gender",$scope.gender1);
						if($scope.regionId){
							formData.append("regionId",$scope.regionId);
						}
						if($scope.email){
							formData.append("email",$scope.email);
						}
						if($scope.dateOne){
							formData.append("birthday",$scope.dateOne);
						}
						if($scope.weixin){
							formData.append("weixin",$scope.weixin);
						}
						if($scope.qq){
							formData.append("qq",$scope.qq);
						}
						if($scope.description){
							formData.append("description",$scope.description);
						}
						if($scope.position){
							formData.append("position",$scope.position);
						}
						if($scope.userImage){
							formData.append("userImage",$scope.userImage);
						}
						if($scope.department){
							formData.append("department",$scope.department);
						}
						
						$http({
							method: "post",
							url:  $localStorage.serviceUrl + "/smUser/updateById",
							//params:{id:$scope.id,roleIds:$scope.roleIds,name:$scope.name,userName:$scope.userName,gender:$scope.gender1,cellphone:$scope.cellphone,regionId:$scope.regionId,email:$scope.email,birthday:$scope.birthday,weixin:$scope.weixin,qq:$scope.qq,description:$scope.description},
                            headers: {'Content-Type':undefined},
                            transformRequest: angular.identity,
                            data:formData
						}).success(
							function () {
								alert('修改成功');
								routeService.route(74, true);
							}
						);
					}
				}
		    }
			$scope.back = function () {
				//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId , 
		    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
				routeService.route(74, true);
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

