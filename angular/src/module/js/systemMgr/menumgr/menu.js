    'use strict';
    var app = angular.module('app');
    app.controller(
        'sysMgrMenuManagerController',
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
            function sysMgrMenuManagerController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope, globalParam, $window, routeService, $http) {


            $scope.reloadRoute = function () {
		    $window.location.reload();
		};
	    $scope.addMenu = function () {
	    	//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId , 
	    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
	    	routeService.route(801, false);
	    }

	    $scope.revise = function (id) {
	    	globalParam.setter(id);
	    	//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId , 
	    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
	    	routeService.route(807, false);
	    }

		$scope.init = function () {
	        $scope.treeList();
	    };
	    $scope.treeNodes = 0;
	    function zTreeOnClick(event, treeId, treeNode) {
	    	// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
	    	$scope.treeNodes = treeNode.id;
			$http({
	            method: "GET",
	            url: $localStorage.serviceUrl+"/smMenu/queryMenuList",
	            params:{pid:treeNode.id},
	    		}).success(
					function (res) {
					$scope.paginationConf.totalItems = res.data.totalNum;
			        $scope.menuList = res.data.records;
			    }
			);
		};
		$scope.treeList = function (id) {
			// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
	    	$http({
	            method: "get",
	            url: $localStorage.serviceUrl+"/smMenu/queryMenuTree"
	    		}).success(
	    				function (res) {
	    					console.log(res);
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
						    //     children:res.data
						    //   }
						    // ];
						$.fn.zTree.init($("#tree1"), setting1,res.data);
						$scope.tree = res.data
				    }
	    		);
	    };
		//分页
	    var reGetProducts = function(){
	    	// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
	        $http({
	        	url:$localStorage.serviceUrl + '/smMenu/queryMenuList',
	        	method:'get',
	        	params:{pid:0,pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage,status:-1},
	        }).success(function(resp){
	        	// 变更分页的总数
	            $scope.paginationConf.totalItems = resp.data.totalNum;
//		            // 变更产品条目
	            $scope.menuList = resp.data.records;
	        }).error(function(error){
	        });
	    };

		// 配置分页基本参数
		$scope.paginationConf = {
				currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
		        itemsPerPage: 10,
		        pagesLength:5,
		        perPageOptions:[5, 10, 15, 20, 25, 50],
		        onChange: function(){
		            console.log($scope.paginationConf.currentPage);
		            $location.search('currentPage', $scope.paginationConf.currentPage);
		        }
		};
		// 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
		$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

		//查询
		$scope.find = function () {
			// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
	    	$http({    
	            method: "GET",    
	            url: $localStorage.serviceUrl + "/smMenu/queryMenuList",
	            params:{name:$scope.name,pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage},
	    		}).success(
					function (res) {
			        $scope.paginationConf.totalItems = res.data.totalNum;
			        $scope.menuList = res.data.records;
			    }
			);
	    }
		//删除
		$scope.deletes = function(id) {
            var layerIndex = layer.confirm('确定删除本条数据吗？', {
                btn : [ '确定', '取消' ]
            // 按钮
            }, function() {
                $http({
                    url : $localStorage.serviceUrl + "/smMenu/deleteById",
                    method: "delete",
                    params : {id:id}
                }).success(function success(result) {
                    reGetProducts();
                    alert("删除成功")
                    layer.alert(result.data.resMsg, {
                        skin : 'layui-layer-lan',
                        closeBtn : 1,
                        anim : 4
                    });
                }, function failure(result) {
                    layer.alert('删除失败！', {
                        skin : 'layui-layer-lan',
                        closeBtn : 0,
                        anim : 4
                    });
                });
                layer.close(layerIndex);
            }, function() {

            });
        };
	    //改变状态
	    var status;
	    $scope.cancel = function (id) {
	    	// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
			$http({
	            method: "get",    
	            url: $localStorage.serviceUrl + "/smMenu/getById",    
	            params: {id:id}
	    		}).success(
					function (res) {
						status = res.data.status;
						if(status == 1){
							status = 2
						}else{
							status = 1
						}
				    	$http({
				            method: "put",    
				            url: $localStorage.serviceUrl + "/smMenu/updateById",    
				            params: {id:id,status:status}
				    		}).success(
								function (){
									reGetProducts();
							    }
				    		);
				    	}
	    		);
	    };


	    $scope.up = function (id) {
			$http({
	            method: "put",
	            url: $localStorage.serviceUrl + "/smMenu/moveUpMenu",
	            params: {id:id}
	    		}).success(
					function (res) {
						alert(res.resMsg)
						$http({
				            method: "GET",
				            url: $localStorage.serviceUrl+"/smMenu/queryMenuList",
				            params:{pid:$scope.treeNodes},
				    		}).success(
								function (res) {
						        $scope.menuList = res.data.records;
						    }
						);
					}
	    		);
	    };

	    $scope.down = function (id) {
			$http({
	            method: "put",
	            url: $localStorage.serviceUrl + "/smMenu/moveDownMenu",
	            params: {id:id}
	    		}).success(
					function (res) {
						alert(res.resMsg)
						$http({
				            method: "GET",
				            url: $localStorage.serviceUrl+"/smMenu/queryMenuList",
				            params:{pid:$scope.treeNodes},
				    		}).success(
								function (res) {
						        $scope.menuList = res.data.records;
						    }
						);
					}
	    		);
	    };



    }]);

