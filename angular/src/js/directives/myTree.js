angular.module('app')
  .directive('myTree', ['$http','$localStorage', function($http,$localStorage) {
  	function initTree ($scope,ele){
			//行政区划树初始化
	    var regionTree;
	    var treeNode_find;
	    var regionTreeUrl = $localStorage.serviceUrl + "/information/v1/administrativeRegion/regionTree?parentCode=0";
	    //行政区划树数据
	    var setting = {
	        view:{
	            selectedMulti:true,
	            showLine:true,
	            showIcon:true
	        },
	        data:{
	            simpleData: {enable: true},
	            keep: {parent: true}
	        },
	        callback:{
	            beforeExpand:zTreeOnExpand,
	            onClick:zTreeOnClick
	        }
	    };

	    function zTreeOnClick(event,treeId,treeNode){
	        $http({
	            method: "GET",
	            url: $localStorage.serviceUrl + '/information/v1/administrativeRegion/regionTree?parentCode=' + treeNode.id
	        }).success(function(resp) {
	            treeNode_find = treeNode.id;
	        })
	    };

	    function zTreeOnExpand(treeId,treeNode){
	        var cnodes = treeNode.children;
	        if (cnodes !=null && cnodes.length > 0){
	            return;
	        };

	        $http({
	            method: "GET",
	            url: $localStorage.serviceUrl + '/information/v1/administrativeRegion/regionTree?parentCode=' + treeNode.id
	        }).success(function(res) {
                regionTree.addNodes(treeNode,res.data,true);
	        });
	    };

	    var treeList = function(regionTreeUrl){
	        $http({
	            method: "GET",
	            url: regionTreeUrl,
	            dataType:'json'
	        }).success(function(data) {
	            regionTree = $.fn.zTree.init($(ele).children('ul'), setting, data.data);
	        }).error(function() {
	        	layer.open({
	    			title:'提示',
	    			content: '部分服务未启动，请联系管理员'
	    		});
	        });
	    };
	    treeList(regionTreeUrl);
  	};
    return {
	    restrict: 'E',
	    template: '<div><ul class="ztree"></ul></div>',
	    replace: true,
	    link: function($scope, ele){
	    	initTree($scope,ele);
	    }
    };
  }]);
