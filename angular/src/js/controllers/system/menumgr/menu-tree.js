var app = angular.module("app");
app.controller('sysMgrMenuAddManageController', function($scope, $timeout, $http, $localStorage, routeService) {
	
    //初始化左侧菜单
    $scope.leftTreeData = [];  
    $scope.leftTreeObj = {}; //左侧树对象,这里对应的就是 zTreeObj
    $scope.leftSelectedNode = [];
	//初始化右侧菜单
    //$scope.rightTreeData = [{ id: 5, pId: 0, name: "根节点", t: "根节点"}];
    $scope.rightTreeData = [];
    $scope.rightTreeObj = {}; //右侧树对象,这里对应的就是 zTreeObj
    $scope.rightSelectedNode = [];
    
    $scope.deleteTreeNodes = [];
    
    //初始化右侧树结构
    $scope.initRightTree = function(){
    	initRightTree();
    }
    //初始化左侧树结构
    //initLeftTree();
    $scope.initLeftTree = function(){
    	initLeftTree();
    }
    function initRightTree(){
    	// // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
    	$http({    
            method: "GET",    
            url:  $localStorage.serviceUrl + "/smMenu/queryMenuTreeByAppId"
        }).success(function(res){
        	debugger;
        	if(res.resCode == 1){
        		//循环删除,zTree问题, 循环删除, 删除不完全
        		while($scope.rightTreeObj.getNodes().length >0){
        			$scope.rightTreeObj.removeNode($scope.rightTreeObj.getNodes()[0])
        		}
        		//重新加载tree数据
        		var resNodes = $scope.rightTreeObj.transformTozTreeNodes(res.data);
        		resetArrayNodeTips(resNodes);
        		$scope.rightTreeObj.addNodes(null, resNodes);
        	}
        }); 
    }
    
    
    function initLeftTree(){
    	//TODO 后续考虑用Angular的Filter 拦截所有Http请求
    	// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
    	$http.get( $localStorage.serviceUrl + "/serviceFunction/queryFunctionTree")
    	    .success(function(response, status, headers, config){  
    	    	if(response.resCode == 1){
    	    		$scope.leftTreeData = response.data;
    	    		//resetTitle($scope.leftTreeData);
    	    		resetArrayNodeTips($scope.leftTreeData);
    	    		$scope.leftTreeObj.addNodes(null,$scope.leftTreeData);
    	    	} 
    	});
    }
    //设置树节点 tips
    function resetTitle(treeNodes){
    	if(treeNodes && treeNodes.length > 0){
    		for(var i=0; i<treeNodes.length; i++){
    			var targetObj = treeNodes[i];
    			targetObj.t = targetObj.name;
    			if(targetObj && targetObj.children && targetObj.children.length >0 ){
    				for(var j=0; j<targetObj.children.length; j++){
    					targetObj.children[j].t = targetObj.children[j].name;
    				}
    			}
    		}
    	}
    }
    function resetArrayNodeTips(treeNodes){
    	if(treeNodes && treeNodes.length > 0){
    		for(var i=0; i<treeNodes.length; i++){
    			resetTips(treeNodes[i]);
    		}
    	}
    }
    
    //设置树节点 Tips
    function resetTips(treeNode){
    	if(treeNode){
    		treeNode.t = treeNode.name;
    		if(treeNode.children && treeNode.children.length >0){
    			for(var i=0; i<treeNode.children.length; i++){
    				resetTips(treeNode.children[i]);
    			}
    		}
    	}
    }
    
    //拆分两种不同类型的菜单功能项
    function getSpecialMenuItem(items){
	    var leftMenuList = [];//保存左侧菜单的功能列表 这里对应的是平台侧的 左侧菜单
	    var selectList = [];//保存下拉形式的菜单，例如：消息通知 和 用户管理
		for(var i=0; i<items.length; i++){
			//过滤一级节点
			if(items[i].level == 1){
				if(items[i].menuType && 2 == items[i].menuType){
					items[i].t = items[i].name; //重新初始化Tips
					selectList.push(items[i]);
				}else{
					items[i].t = items[i].name; //重新初始化Tips
					leftMenuList.push(items[i]);
				}
			}
		}
		return {"leftMenuList":leftMenuList,"selectList":selectList};
    }
    function copyAndResetRightNodeAttr(items){
    	
    	var resData = [];
    	angular.copy(items,resData);
    	for(var i=0; i<resData.length; i++){
    		
    		resData[i].functionId = resData[i].id;
    		resData[i].id = null;
    		resData[i].pId = null;//重置pId
    		resData[i].opertateType = 1;//opertateType:: 1：新增，2：修改，3：删除
    	}
    	return resData;
    }
    //右侧树的单击事件处理, 点击后 设置左侧对应的节点选中
    $scope.rightTreeNodeClick = function(event, treeId, treeNode){
    	//
    	console.log("rightTreeNodeClick---treeId:"+treeId+", treeNode:"+treeNode);
    	var findNodeInLeftTree = false;
    	if(treeNode && treeNode.functionId){
    		var nodes = $scope.leftTreeObj.getNodes();
    		for(var i=0,len=nodes.length; i<len; i++){
    			if(nodes[i] && nodes[i].children){
    				for(var j=0, len2=nodes[i].children.length; j<len2; j++){
    					if(treeNode.functionId == nodes[i].children[j].id){
    						//设置选中
    						$scope.leftTreeObj.selectNode(nodes[i].children[j]);
    						findNodeInLeftTree = true;
    						break;
    					}
    				}
    			}
    			if(findNodeInLeftTree){
    				break;
    			}
    		}
    	}
    	//清空选中状态
    	if(!findNodeInLeftTree){
    		$scope.leftTreeObj.cancelSelectedNode();
    	}
    	
    }
    //左侧树的单击事件处理, 点击后 设置右侧对应的节点选中
    $scope.leftTreeNodeClick = function(event, treeId, treeNode){
    	//
    	debugger;
    	console.log("rightTreeNodeClick---treeId:"+treeId+", treeNode:"+treeNode);
    	var findNodeInLeftRight = false;
    	//如果是二级节点才处理
    	if(treeNode && treeNode.id && treeNode.level == 1){
    		var nodes = $scope.rightTreeObj.getNodes();
    		for(var i=0,len=nodes.length; i<len; i++){
    			//如果是右侧树的一级节点
    			if(nodes[i].functionId == treeNode.id){
    				//表示追加选中，会出现多点同时被选中的情况
    				$scope.rightTreeObj.selectNode(nodes[i], true);
    				findNodeInLeftRight = true;
    				//continue;
    			}
    			//判断二级节点是否匹配 左侧选中的节点数据
    			if(nodes[i].children){
    				for(var j=0, len2=nodes[i].children.length; j<len2; j++){
    					if(nodes[i].children[j].functionId && treeNode.id == nodes[i].children[j].functionId){
    						//设置选中
    						$scope.rightTreeObj.selectNode(nodes[i].children[j], true);
    						findNodeInLeftRight = true;
    						//continue;
    					}
    					//判断三级节点是否匹配
    					if(nodes[i].children[j].children){
    						for(var k=0, len3=nodes[i].children[j].children.length; k<len3; k++){
    							if(nodes[i].children[j].children[k].functionId && treeNode.id == nodes[i].children[j].children[k].functionId){
    	    						//设置选中
    	    						$scope.rightTreeObj.selectNode(nodes[i].children[j].children[k], true);
    	    						findNodeInLeftRight = true;
    	    						continue;
    							}
    							
    						}
    						
    					}
    				}
    			}
    		}
    	}
    	else{
    		//清空选中状态
    		$scope.rightTreeObj.cancelSelectedNode();
    	}
    	//清空选中状态
    	if(!findNodeInLeftRight){
    		$scope.rightTreeObj.cancelSelectedNode();
    	}
    	
    }
    
    
    //添加左侧功能列表到右侧二级菜单
    $scope.addLeftItemToRightTree = function(){

    	debugger;
    	var leftSelectedNode = $scope.leftTreeObj.getCheckedNodes();
    	
    	if(leftSelectedNode && leftSelectedNode.length>0){
			//区分要添加的节点数据
    		var toAddNodes =  getSpecialMenuItem(leftSelectedNode);
			
    		var rightSelectedNodes = $scope.rightTreeObj.getSelectedNodes();
    		
    		//如果没有选择左侧节点， 并且右侧选中节点又不是下拉类型的菜单功能项时，直接返回
    		if(toAddNodes["selectList"].length == 0 && rightSelectedNodes.length == 0){
    			alert("请至少选择一个节点进行挂载！");
    			return 0;
    		}
    		
    		if(rightSelectedNodes.length == 1){
    			//不允许挂载节点到三级节点,当前就只支持最多三级菜单结构。 level 从0 开始
    			if(rightSelectedNodes[0] && rightSelectedNodes[0].level > 1){
    				alert("请选择一级或二级节点进行挂载！");
    				return 0;
    			}
    			//获取原始列表中存在的节点信息
    			var srcNodes = rightSelectedNodes[0].children;
    			//挂载到三级节点 或 二级节点 的 node 列表
    			var monutToThreeLevelNodes = filterSecondNode(toAddNodes["leftMenuList"], srcNodes);
    			if(monutToThreeLevelNodes && monutToThreeLevelNodes.length > 0){
					//添加到三级节点
    				var tmpToAddNodeList = copyAndResetRightNodeAttr(monutToThreeLevelNodes);
					$scope.rightTreeObj.addNodes(rightSelectedNodes[0], tmpToAddNodeList);
    			}
    		}
    		
			//没有选中右侧二级节点的时候，可以添加 左侧的 menuType:2的菜单到右侧树
			//挂载到右侧一级节点的 node列表
			var mountToFirstLevelNodes = filterRootNode(toAddNodes["selectList"]);
			if(mountToFirstLevelNodes && mountToFirstLevelNodes.length>0){
				//添加到根节点,如果在右侧树 不存在 则添加
				var tmpToAddNodeList = copyAndResetRightNodeAttr(mountToFirstLevelNodes);
				//resetRightNodeAttr(monutToThreeLevelNodes);
				$scope.rightTreeObj.addNodes(null, tmpToAddNodeList);
			}
    		
    	}
    	else{
    		alert("请在左侧树中 选择节点进行添加！");
    		return 0;
    	}
    }
    
	$scope.back = function () {
		//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
		 //跳转到菜单设置
		routeService.route(81,true);
    }
    
    
    //过滤右侧树中 已经存在的一级节点
    function filterRootNode(items){
    	var rightTreeRootItems = $scope.rightTreeObj.getNodes();
    	var resNodes = [];
    	for(var i=0; i<items.length; i++){
    		if(!checkFunctionIdExists(rightTreeRootItems, items[i])){
    			resNodes.push(items[i]);
    		}
    	}
    	return resNodes;
    }

    function checkFunctionIdExists(items, node){
    	//items 为 右侧选中的节点下的子节点， node 为 左侧功能树 选中的一个节点
    	if(items && items.length){
        	for(var i=0; i<items.length; i++){
        		if(items[i].functionId == node.id){
        			return true;
        		}
        	}
        	return false;
    	}
    	else{
    		return false;
    	}
    }
    
    //过滤左侧菜单的 一级节点 和 过滤 在右侧选中菜单中出现的节点
    function filterSecondNode(nodes, srcNodes){
    	//nodes 左侧选中的节点， srcNodes 右侧选中的二级节点下的子节点
    	if(nodes && nodes.length >0 ){
    		var resNodes = [];
    		for(var i=0; i<nodes.length; i++){
    			//左侧菜单就两级，只要不是第一级就添加
    			if(nodes[i].level == 0){
    				continue;
    			}
    			else{
    				var tmpNode = nodes[i];
    				if(!checkFunctionIdExists(srcNodes, tmpNode)){
        				resNodes.push(tmpNode);
    				}
    			}
    		}
    		return resNodes;
    	}
    	return [];
    }
    
	//右侧菜单添加子节点
	$scope.addTreeItem = function(){
		var selectNodes = $scope.rightTreeObj.getSelectedNodes();
		if(selectNodes.length == 1){
			var node = [{name:"New Node", opertateType:1, t:"New Node"}];//opertateType:: 1：新增，2：修改，3：删除
			//只能添加一级和二级节点。 level 从0 开始
			//selectNodes[0].menuType != 2  才能添加
			if(selectNodes[0] && selectNodes[0].level ==0 && selectNodes[0].menuType != 2){
				var newNode = $scope.rightTreeObj.addNodes(selectNodes[0], node);
			}else{
				alert("该菜单节点类型，不支持添加子节点！");
			}
		}
		else{
			alert("请选择一个节点进行添加！");
		}
	}
    
	//右侧菜单 添加根节点
	$scope.addTreeRootItem = function(){
		var node = {name:"New Menu", opertateType:1,t:"New Menu"};
		var newNode = $scope.rightTreeObj.addNodes(null, node);
	}
	
	//右侧树节点删除事件处理
	$scope.rigthTreeRemoveNode = function(event, treeId, treeNode){
		//opertateType:: 1：新增，2：修改，3：删除
		if(treeNode && treeNode.opertateType != 1){
			treeNode.opertateType = 3;
			$scope.deleteTreeNodes.push(treeNode);
		}
	}
	
	//右侧树节点重命名事件处理
	$scope.rigthTreeRenameNode = function(event, treeId, treeNode, isCancel){
		if(treeNode && treeNode.opertateType != 1){
			treeNode.opertateType = 2;
		}
	}
	
	//右侧树节点 全部展开或折叠
	$scope.right_tree_expand_collapse_all = function(expandFlagBoolean){
		$scope.rightTreeObj.expandAll(expandFlagBoolean);
	}
	
	//左侧树节点 全部展开或折叠
	$scope.left_tree_expand_collapse_all = function(expandFlagBoolean){
		$scope.leftTreeObj.expandAll(expandFlagBoolean);
	}
	
	//构造POST 树节点信息
	function buildPostNodeItem(node){
		var item = {};
		if(node){
			item.id = node.id ? node.id : null;
			item.name = node.name ? node.name : null;
			item.pId = node.pId ? node.pId : null;
			item.functionId = node.functionId ? node.functionId : null;
			item.menuType = node.menuType ? node.menuType : 1; //默认设置为 1
			item.opertateType = node.opertateType ? node.opertateType : null; //操作类型：1：新增，2：修改，3：删除
			item.children = [];
			return item;
		}else{
			return null;
		}
	}
	
	
	
    //保存菜单操作
    $scope.saveTreeMenu = function(){
    	debugger;
    	var nodes = $scope.rightTreeObj.getNodes();  //获取节点数据
    	var postTree = [];
    	//获得平级节点 获取删除的节点信息，新增 修改的节点数据全部在节点树集合里面
    	if(nodes && nodes.length>0){
    		for(var i=0; i<nodes.length; i++){
    			var rootItem = nodes[i];
    			var firstLevelNode =  buildPostNodeItem(rootItem);//构造一级节点
    			//检查是否存在二级节点
    			if(rootItem.children && rootItem.children.length>0){
    				for(var j=0; j<rootItem.children.length; j++){
    					var secondLevelNode = buildPostNodeItem(rootItem.children[j]);
    					//如果有三级节点
    					if(rootItem.children[j].children && rootItem.children[j].children.length){
        					for(var k=0; k<rootItem.children[j].children.length; k++){
        						var threeLevelNode = buildPostNodeItem(rootItem.children[j].children[k]);
        						secondLevelNode.children.push(threeLevelNode);//添加到二级节点
        					}
    					}
    					else{
    						//如果没有三级节点, 检查二级节点是否 有效，否则抛出提示信息
    						if(!secondLevelNode.functionId){
        						alert("必须为  【" + (secondLevelNode.name) + "】 添加功能！");
        						return 0;
    						}
    					}
    					firstLevelNode.children.push(secondLevelNode);//添加到一级节点
    				}
    			}
    			else{
    				//如果不存在二级节点, 检查一级节点是否 有效，否则抛出提示信息
    				if(!firstLevelNode.functionId){
						alert("必须为  【" + (firstLevelNode.name) + "】 添加功能！");
						return 0;
    				}    				
    			}
    			postTree.push(firstLevelNode);
    		}
    	}
    	//添加删除的元素
    	var deleteNodes = [];
    	if($scope.deleteTreeNodes && $scope.deleteTreeNodes.length>0){
    		for(var i=0; i<$scope.deleteTreeNodes.length; i++){
    			deleteNodes.push(buildPostNodeItem($scope.deleteTreeNodes[i]));
    		}
    	}
    	//调用服务
    	var params = {"postTree": postTree, "deleteNodes":deleteNodes};
    	// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
    	$http({    
            method: "POST",    
            url:  $localStorage.serviceUrl + "/smMenu/saveMenuTree",    
            data: JSON.stringify(params),  
            headers: { 'Content-Type': 'application/json' }  
        }).success(function(data){
        	debugger;
        	
        	if(data.resCode == 1){
        		alert("保存数据成功！");
        		initRightTree();
        	}
        });  
    	
    }
});
