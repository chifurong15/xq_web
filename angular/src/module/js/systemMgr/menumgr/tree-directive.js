'use strict';
angular.module("uip.ztree",[]).directive('uipztree', [function () {
	//删除前确认弹框
	function beforeRemove(treeId, treeNode){
		if(treeNode.children && treeNode.children.length>0){
			alert("请先删除子节点再删除父节点！");
			return false;
		}
		return confirm("确定删除该节点？");
	}
	
	
	/**移动节点前处理*/
	function zTreeBeforeDrag(treeId, treeNodes) {  
	}  
	 /**拖拽释放之后结束前执行  moveType值类型请参考api */   
	function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {  
	}
	
    return {
        restrict: 'AE', 
        scope: {
            treeData: '=',  //引用传递
            enableEdit: '@',  //值传递
            treeControl: '=', //引用传递
            enbableCheck: '@', //值传递
            treeNodeOnClick: '=', //引用传递, 树节点的单击问题处理
            onRemove: '=',
            onRename: '=',
            onClick: '='
          },
        link: function ($scope, element, attrs) {  
            //var opts = angular.extend({}, $scope.$eval(attrs.nlUploadify));  
            //获取TreeId, tree 必须设置id属性
            var treeId = element.attr("id");
            
            var enbableCheck = false;
            var enableEdit = false;
            if($scope.enbableCheck && $scope.enbableCheck== 'true'){
            	enbableCheck = true;
            }
            if($scope.enableEdit && $scope.enableEdit == 'true'){
            	enableEdit = true;
            }
            
        	var setting = {  
                   treeId:treeId,
                   view: {
                       addHoverDom: false,
                       removeHoverDom: false,
                       selectedMulti: false
                   },
                   check: {  
                       enable: enbableCheck,  
                       nocheckInherit: false  
                   },
                   drag:{//支持拖拽
                	   isCopy: false,
                	   isMove: true
                	   },
            	   data: {  
                        key: {title: "t"  },  
                        simpleData: { enable: true}  
                   }, 
                   edit: {
                       enable: enableEdit
                   },
                   callback:{
                	   beforeRemove:beforeRemove,
                	   beforeDrag: zTreeBeforeDrag,
                	   beforeDrop: zTreeBeforeDrop,
                	   beforeClick: $scope.treeNodeOnClick,
                	   onRemove: $scope.onRemove,
                	   onRename: $scope.onRename,
                	   onClick: $scope.onClick
                   } 
            };

            $.fn.zTree.init(element, setting, $scope.treeData);
            //获取ZTree根节点对象, 引用传递, 赋值给Controller中的操作对象
            $scope.treeControl = $.fn.zTree.getZTreeObj(treeId);
        }  
    };  
}]);

