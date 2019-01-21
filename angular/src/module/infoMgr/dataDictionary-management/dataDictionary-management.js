var modulePrefix = "/information";
var dictionaryUrl = modulePrefix + "/v1/dictionary/";
var dictionaryTypeUrl = modulePrefix + "/v1/dictionaryType/";

(function(window, angular) {
		'use strict';
		angular.module("app").controller(
			'dataDictionaryCtrl', [
				'$scope',
				'$localStorage',
				'$location',
				'$log',
				'$q',
				'$rootScope',
				'globalParam',
				'globaltree',
				'$window',
				'routeService',
				'moduleService',
				'$http',
				function dataDictionaryCtrl($scope,$localStorage, $location, $log, $q, $rootScope, globalParam, globaltree,$window, routeService, moduleService,$http) {		

					var update_url;
                    var del_url;
                    var add_url;
                    var moveUrl;
                    
                    var defaultScope = "1";
                    var globalScope = "2";
					$scope.searchScope = defaultScope;
					$scope.searchStatus = false;

					//搜索范围改变
					$scope.changeScope = function(){
						if($scope.searchScope === globalScope){
                            $scope.searchStatus = true;
                            globalSearch();
						}else{
                            $scope.searchStatus = false;
                            reGetProducts();
						}
					};

					//true:从数据字典类型表获取分页数据，false:数据字典表获取分页数据
					var dataFromType = true;

					// 分页
					var reGetProducts = function() {
						if($scope.searchScope === globalScope){
                            globalSearch();
						}else{
                            dataFromType === true ?	findDictType() : findDict();
						}

					};

					//数据字典类型表的分页显示
					function findDictType(){
                        $http({
                            url : moduleService.getServiceUrl() + dictionaryTypeUrl + '/list',
                            method : 'GET',
                            params:{
                                pageNumber:$scope.paginationConf.currentPage,
                                pageSize:$scope.paginationConf.itemsPerPage,
								name:$scope.dictionaryName
                            }
                        }).success(
                            function(res) {
                            	if(res.resCode === 1){
                                    setPage(res)
								}else{
                                    layer.msg(res.resMsg,{time:3000});
								}
                            }).error(function(res) {
                            layer.msg("服务器异常！",{time:3000});
                        });
					}
					//数据字典表的分页显示
					function findDict(){
                        var pid;
                        var typeId;
						if($scope.treeNode_top === '1'){
							typeId = $scope.treeNode_id;
							pid = "0";
						}else{
							pid = $scope.treeNode_id;
                            typeId = "";
						}
                        $http({
                            url : moduleService.getServiceUrl() + dictionaryUrl + '/list',
                            method : 'GET',
                            params:{
                                pageNumber:$scope.paginationConf.currentPage,
                                pageSize:$scope.paginationConf.itemsPerPage,
                                pid:pid,
                                typeId:typeId,
                                name:$scope.dictionaryName
                            }
                        }).success(
                            function(res) {
                            	if($scope.dictionaryName == null){
                                    $scope.dictionaryName = '';
								}
                            	if(res.data.list.length <= 0 && $scope.dictionaryName === ''){
                                    getSelf();
								}else{
                                    setPage(res)
								}
                            }).error(function(error) {
                            layer.msg("服务器异常！",{time:3000});
                        });
					}
					//当前节点没有数据，请求自身
					function getSelf() {
                        $http({
                            url : moduleService.getServiceUrl() + dictionaryUrl + '/findPageById',
                            method : 'GET',
                            params:{
                                pageNumber:$scope.paginationConf.currentPage,
                                pageSize:$scope.paginationConf.itemsPerPage,
                                id:$scope.treeNode_id,
                                top:$scope.treeNode_top
                            }
                        }).success(
                            function(res) {
                                if(res.resCode === 1){
                                    setPage(res)
                                }else{
                                    layer.msg(res.resMsg,{time:3000});
                                }
                            }).error(function(error) {
                            layer.msg("服务器异常！",{time:3000});
                        });
                    }
					//配置总页数
					function setPage(res){
                        // 变更分页的总数
                        $scope.paginationConf.totalItems = res.data.total;
                        // 变更产品条目
                        $scope.moduleList = res.data.list;
					}

                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                        itemsPerPage: $rootScope.tempSize == null ? 10 : $rootScope.tempSize,
                        pagesLength: 5,
                        perPageOptions: [5,10,20,50],
                        onChange: function() {
                            $location.search('currentPage', $scope.paginationConf.currentPage);
                            $rootScope.tempSize  = $scope.paginationConf.itemsPerPage;
                        }
                    };

					// 通过$watch currentPage和itemperPage
					// 当他们一变化的时候，重新获取数据条目
					$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',
									reGetProducts);

                    //搜索
                    $scope.query = function(){
                        $scope.paginationConf.currentPage = 1;
                        $('.page-num').val($scope.paginationConf.currentPage);
                        if($scope.searchScope === defaultScope){
                            reGetProducts();
						}else{
                            globalSearch();
						}
                    };
                    $scope.reSet = function(){
		                $scope.dictionaryName = null;
		                $scope.searchScope = '1';
		                reGetProducts();
		            }
		            $('.query-conditions-form').bind("keydown",function(e){
		                var theEvent = e || window.event;
		                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
		                if (code == 13) {
		                    $scope.query();
		                }
		            });
					//全局搜索
                    function globalSearch(){
                        $http({
                            url : moduleService.getServiceUrl() + dictionaryUrl + '/globalSearch',
                            method : 'GET',
                            params:{
                                pageNumber:$scope.paginationConf.currentPage,
                                pageSize:$scope.paginationConf.itemsPerPage,
                                name:$scope.dictionaryName
                            }
                        }).success(
                            function(res) {
                                if(res.resCode === 1){
                                    setPage(res)
                                }else{
                                    layer.msg(res.resMsg,{time:3000});
                                }
                            }).error(function(error) {
                            layer.msg("服务器异常！",{time:3000});
                        });
					}

					//数据字典树初始化
					var regionTree;
					$scope.init = function(){
                        var regionTreeUrl = moduleService.getServiceUrl() + dictionaryUrl + "/initTree";
						$scope.treeList(regionTreeUrl);
						reGetProducts()
					};
                        
					//数据字典树数据
					var setting = {
						view:{
							selectedMulti:true,
							showLine:true,
							showIcon:true
						},
						data:{
							simpleData:{enable:true},
							keep: {parent: true}

						},
						callback:{
							beforeExpand:zTreeOnExpand,
							onClick:zTreeOnClick
						}
					};
					
					//树点击事件
					function zTreeOnClick(event,treeId,treeNode){
				        $scope.returnToList();
						//判断父节点
                        dataFromType = (treeNode.top == null || treeNode.top === '');
                        $scope.treeNode_id = treeNode.id;
                        $scope.treeNode_top = treeNode.top;
                        $scope.treeNode_name = treeNode.name;
                        $scope.dictionaryName = '';
                        $scope.searchScope = defaultScope;
                        $scope.searchStatus = false;
						reGetProducts();
					}
					
					//树展开
					function zTreeOnExpand(treeId,treeNode){
						var cnodes = treeNode.children;
						if (cnodes !=null && cnodes.length > 0){
							return;
						}	
						var tmpUrl = moduleService.getServiceUrl() + dictionaryUrl + '/findChildNodes';
						$http({
							method: "GET",
							url: tmpUrl,
							params: {
								id:treeNode.id,
                                top:treeNode.top
							}
						}).success(
							function(data) {	
								regionTree.addNodes(treeNode,data.data);
							}	
						);
					}

					//树初始化
					$scope.treeList = function(regionTreeUrl){
						$scope.returnToList();
						$http({
							method: "GET",
							url: regionTreeUrl,
							dataType:'json'
						}).success(
						  function(res) {
							  regionTree = $.fn.zTree.init($("#regionTree"), setting,res.data);
                              $scope.treeNode_id =  res.data.id;
                              $scope.treeNode_name = res.data.name;
							  //选中顶级节点
							  var treeObj = $.fn.zTree.getZTreeObj("regionTree");
							  var node = treeObj.getNodeByParam("id", $scope.treeNode_id);
							  treeObj.selectNode(node);
			             }
						).error(function() {});
					};



					//删除
				 	$scope.delete = function(model){
                        var layerIndex = layer.confirm("确定要删除节点？删除该节点会将其子节点一起删除！", { btn: ['确定', '取消']
                        }, function() {
                            deleteDic(model);
                            layer.close(layerIndex)
                        }, function() {

                        });
					};
				 	//请求后台删除数据
					function deleteDic(model){
                        if(model.pId == null || model.pId === ''){
                            del_url = moduleService.getServiceUrl() + dictionaryTypeUrl + '/delete'
                        }else{
                            del_url = moduleService.getServiceUrl() + dictionaryUrl + '/delete'
                        }
                        $http({
                            method: "delete",
                            url: del_url,
                            params:{
                                id : model.id
                            }
                        }).success(function(res) {
							if(res.resCode === 1){
								layer.msg("删除成功！",{time:2000});
								var treeObj = $.fn.zTree.getZTreeObj("regionTree");
								var node = treeObj.getNodeByParam("id",model.id );
								var pNode = treeObj.getNodeByParam("id",node.pId );
								if(pNode.open){
									treeObj.removeNode(node);
								}
								//判断父节点是否还有元素
								if(pNode.children.length === 0){
									pNode.isParent = false;
									treeObj.updateNode(pNode);
								}
								treeObj.selectNode(pNode);
								dataFromType = (pNode.top == null || pNode.top === '');
								$scope.treeNode_id = pNode.id;
								$scope.treeNode_top = pNode.top;
								$scope.treeNode_name = pNode.name;
								reGetProducts();
							}else {
								layer.msg("服务器异常！",{time:2000});
							}
                         }).error(function() {});
                    }
				 	
				 	//上移
				 	$scope.moveUp = function(module){
                        getMoveUrl(0);
                        move(module.id,0);
					};
					//下移
				 	$scope.moveDown = function(module){
                        getMoveUrl(1);
                        move(module.id,1);
					};
					//获取上下移动的url
				 	function getMoveUrl(flag){
				 		if(flag === 1){
                            flag = "/moveDown";
						}else {
                            flag = "/moveUp";
						}
                        if($scope.treeNode_top == null || $scope.treeNode_top === ""){
                            moveUrl = moduleService.getServiceUrl() + dictionaryTypeUrl + flag;
                        }else {
                            moveUrl = moduleService.getServiceUrl() + dictionaryUrl + flag;
                        }
                    }
                    //调用后台上下移动
					function move(id,upOrDown){
                        $http({
                            method: "put",
                            url: moveUrl,
							params:{
								id:id,
								pid:$scope.treeNode_id,
								top:$scope.treeNode_top
							}
                        }).success(function(res) {
                                if(res.resCode === 1){
                                    reGetProducts();
                                    changeNode(id,res.data,upOrDown);
                                }else{
									layer.msg(res.resMsg || '请求错误,请稍后再试');
								}
                            }
                        ).error(function() {});
					}
					//交换树节点位置
					function changeNode(id1,id2,upOrDown){
                        var treeObj = $.fn.zTree.getZTreeObj("regionTree");
                        var node1 = treeObj.getNodeByParam("id",id1 );
                        var node2 = treeObj.getNodeByParam("id",id2 );
                        //0:上移 1：下移
                        if(upOrDown === 0){
                            treeObj.moveNode(node1, node2, "next");
						}else{
                            treeObj.moveNode(node1, node2, "prev");
						}
					}

					//获取uuid作为类型值的默认值
					 function getUuid(){
						$http({
							method: "GET",
							url: moduleService.getServiceUrl() + dictionaryUrl + '/uuid'
						}).success(function(res) {
						     $scope.value = res.data;
						  }			
						).error(function() {});
					 }


					//新增 tab切换
					$scope.dataDictionaryAdd=function(){
				 	    $('#dataDictionaryAdd').modal('show');
                        add_url = moduleService.getServiceUrl();
                        if($scope.treeNode_top == null || $scope.treeNode_top === ''){
                            add_url = moduleService.getServiceUrl() + dictionaryTypeUrl + "/add";
						}else{
                            add_url = moduleService.getServiceUrl() + dictionaryUrl + "/add";
						}
						$scope.pName = $scope.treeNode_name;
						getUuid();
					};
					
					//详情 tab3切换
					$scope.dataDictionaryDetail=function(model){
                        $('#dataDictionaryDetail').modal('show');
						$scope.detail_name = model.typeName;
                        $scope.detail_pName = model.pName;
                        $scope.detail_typeValue = model.typeValue;
                        $scope.detail_remark = model.remark;
					};
					
					//编辑 tab4切换
					$scope.dataDictionaryEdit=function(model){
                        $('#dataDictionaryEdit').modal('show');
                        $scope.editName = model.typeName;
                        $scope.editValue = model.typeValue;
						$scope.editId = model.id;
						$scope.editRemark = model.remark;
						$scope.editPName = model.pName;
                        if(model.pId == null || model.pId === ''){
                            update_url = moduleService.getServiceUrl() + dictionaryTypeUrl + "/update";
                        }else{
                            update_url = moduleService.getServiceUrl() + dictionaryUrl + "/update";
                        }
					};
					
					//返回
					$scope.returnToList=function(){
						$scope.name = null;
						$scope.value = null;
						$scope.remark = null;
					};

					//新增数据
				   	$scope.add_data=function(){
				   		
				   		if(!$scope.name || $scope.name == null) {
							layer.alert("类型名称不能为空!", {
								skin: 'my-skin',
								closeBtn: 1,
								anim: 3
							});
						}else if(!$scope.value || $scope.value == null){
							layer.alert("类型值不能为空!", {
								skin: 'my-skin',
								closeBtn: 1,
								anim: 3
							});
						
						}else {
				   		
							$http({
								method: "POST",
								url: add_url,
								dataType:'json',
								params:{
									pid : $scope.treeNode_id,
									name : $scope.name,
									remark : $scope.remark,
									value :$scope.value,
									top : $scope.treeNode_top
								}
							}).success(function(res) {
								if(res.resCode === 1){
	                                layer.msg("新增成功！",{time:2000});
	                                $scope.dictionaryName = "";
	                                $scope.name = "";
	                                $scope.remark = "";
	                                var treeObj = $.fn.zTree.getZTreeObj("regionTree");
	                                var node = treeObj.getNodeByParam("id",$scope.treeNode_id);
	                                node.isParent = true;
	                                treeObj.updateNode(node);
	                                if(node.open){
	                                    getNode(treeObj,node,res.data)
	                                }
	                                reGetProducts();
	                                $scope.returnToList();
	                                $('#dataDictionaryAdd').modal('hide');
								}else{
									layer.msg("服务器异常！",{time:2000});
								}
							}).error(function() {});
						}
															
					};

					//根据id请求树节点,并添加到树中
				   	function getNode(tree,node,id){
				   		var url;
                        if($scope.treeNode_top == null || $scope.treeNode_top === ''){
                            url = moduleService.getServiceUrl() + dictionaryTypeUrl + "/getNodeById";
                        }else{
                            url = moduleService.getServiceUrl() + dictionaryUrl + "/getNodeById";
                        }
                        $http({
							method:"get",
							url:url,
							params:{
								id:id
							}
						}).success(
							function(res){
                                tree.addNodes(node , res.data);
                                tree.updateNode(node);
							}
						).error();
					}

					//更新数据
					$scope.update_data=function(){				 	 
						$http({
							method: "put",
							url: update_url,
							params:{
								id : $scope.editId,
								name : $scope.editName,
								remark : $scope.editRemark,
								value:$scope.editValue
							}
						}).success(function(res){
							if(res.resCode === 1){
                                layer.msg("修改成功！",{time:2000});
								//更新树节点
                                var treeObj = $.fn.zTree.getZTreeObj("regionTree");
                                var node = treeObj.getNodeByParam("id",res.data);
                                if(node != null){
                                    node.name = $scope.editName;
                                    treeObj.updateNode(node);
								}
                                reGetProducts();
                                $scope.returnToList();
                                $('#dataDictionaryEdit').modal('hide');
                            }else{
								layer.msg("服务器异常！",{time:3000});
							}
						  }
						).error(function() {});
			
					}
			
			}
		]);

})(window, angular);