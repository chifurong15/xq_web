(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'menuAuthorityController',
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
            function menuAuthorityController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope, $window, routeService, $http) {
            //刷新
			$scope.reloadRoute = function () {
			    $window.location.reload();
			};
		    $scope.init = function () {
		    	$scope.load();
			};
			var data;
			var nodes;
			$scope.name = '无';
			function zTreeOnClick(event, treeId, treeNode) {
				 data = treeNode.id;
				 $scope.name = treeNode.name;
				 // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
				 $http({    
			            method: "GET",    
			            url:  $localStorage.serviceUrl + "/smAuthority/queryAuthorityMenuTree",
			            params:{roleId:treeNode.id},
			    		}).success(	
							function (res) {
								console.log(res)
								var setting2 = {
									check: {
										enable: true,
//										chkStyle: "checkbox",
//										chkboxType: { "Y": "s", "N": "s" }
									},
							    	enable: true,
							    	callback: {
							    		onCheck: zTreeOnCheck
							    	}
							    };
							    // var zNodes2 =[
							    //   {
							    //     name: "根节点",icon:"vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
							    //     open:true,
							    //     children:res.data
							    //   }
							    // ];
	   					       $.fn.zTree.init($("#tree2"), setting2,res.data);
					    }
					);
			    	$http({    
			            method: "GET",    
			            url:  $localStorage.serviceUrl + "/smAuthority/queryAuthorityMenuTreeDetail",
			            params:{roleId:treeNode.id},
			    		}).success(
							function (res) {
								var setting3 = {
							    };
							    // var zNodes3 =[
							    //   {
							    //     name: "根节点",icon:"vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
							    //     open:true,
							    //     children:res.data
							    //   }
							    // ];
							 $.fn.zTree.init($("#tree3"), setting3,res.data);
					    }
					);
			};
		    $scope.load = function () {
		    	// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
			  $http({    
			         method: "GET",    
			         // url:  $localStorage.serviceUrl + "/smRole/queryRoleList",
			         url:  $localStorage.serviceUrl + "/smAuthority/queryUserAuthorizedRoleList",
			         params:{pageNumber:-1,pageSize:-1},
			  	}).success(
					function (res) {
						var setting1 = {
						    	enable: true,
						    	callback: {
						    		onClick: zTreeOnClick
						    	}
						    };
						    // var zNodes1 =[
						    //   {
						    //     name: "根节点",icon:"vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
						    //     open:true,
						    //     children:res.data.records
						    //   }
						    // ];
						 $.fn.zTree.init($("#tree1"), setting1,res.data.records);
				   }
				);
			 };
			 function zTreeOnCheck(event, treeId, treeNode) {
				 var trees = $.fn.zTree.getZTreeObj("tree2");
				 nodes = trees.getCheckedNodes(true);
			 };
			 $scope.changess = function () {
				 // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
				 var arr = [];
				 for (var i = 0; i < nodes.length; i++) {
					 arr.push(nodes[i].id)
				}
				 $http({
			            method: "post",
			            url:  $localStorage.serviceUrl + "/smAuthority/authorizedMenu",
			            params:{powers:arr,roleId:data}
			    		}).success(
							function (res) {
								alert("授权成功")
								$scope.reloadRoute();
					    }
				 );
			 }
     }]);
})(window, angular);

