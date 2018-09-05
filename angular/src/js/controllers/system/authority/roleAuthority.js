	(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'roleAuthorityController',
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
            function roleAuthorityController($localStorage, $scope, $location, $log,
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
			var allRoles = [];
			var authorizedRoles = [];
			var rolesWithAuthorized = [];
			function t2() {
				rolesWithAuthorized =[];
		    	for(var i=0; i< allRoles.length;i++){
		    		var node = {};
		    		node.id =allRoles[i].id;
		    		node.name = allRoles[i].name;
		    		node.checked = false;
		    		for(var j =0;j<authorizedRoles.length;j++){
		    			if(allRoles[i].id == authorizedRoles[j].id){
		    				node.checked = true;
		    				break;
		    			}
		    		}
		    		rolesWithAuthorized.push(node);

		    	}
			};
			$scope.name = '无';
			function zTreeOnClick(event, treeId, treeNode) {
				 data = treeNode.id;
				 $scope.name = treeNode.name;
				 // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
				 $http({
			            method: "GET",
			            url:  $localStorage.serviceUrl + "/smAuthority/queryAuthorityRoleList",
			            params:{roleId:treeNode.id},
			    		}).success(
							function (res) {
								authorizedRoles = res.data;
								t2();
								var setting2 = {
									check: {
										enable: true,
										chkStyle: "checkbox",
										chkboxType: { "Y": "s", "N": "s" }
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
							    //     children:rolesWithAuthorized
							    //   }
							    // ];
	   					       $.fn.zTree.init($("#tree2"), setting2,rolesWithAuthorized);
					    }
					);
			    	$http({    
			            method: "GET",    
			            url:  $localStorage.serviceUrl + "/smAuthority/queryAuthorityRoleList",
			            params:{roleId:treeNode.id},
			    		}).success(
							function (res) {
								var setting3 = {
							    };
							    // var zNodes3 =[
							    //   {
							    //     name: "根节点",icon:"vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
							    //     open:true,
							    //     children:authorizedRoles
							    //   }
							    // ];
							 $.fn.zTree.init($("#tree3"), setting3,authorizedRoles);
					    }
					);
			};
		    $scope.load = function () {
		    	// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
			  $http({    
			         method: "GET",    
			         url:  $localStorage.serviceUrl + "/smRole/queryRoleList",
			         params:{pageNumber:-1,pageSize:-1},
			         // url:  $localStorage.serviceUrl + "/smAuthority/queryUserAuthorizedRoleList",
			  	}).success(
					function (res) {
						allRoles = res.data.records;
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
			            url:  $localStorage.serviceUrl + "/smAuthority/authorizedRole",
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

