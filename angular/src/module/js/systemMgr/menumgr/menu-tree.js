'use strict';
var app = angular.module('app');
app.controller(
    'sysMgrMenuAddManageController',
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
        function sysMgrMenuAddManageController($localStorage, $scope, $location, $log,
                                               $q, $rootScope, $window, routeService, $http) {

            // 重做js代码----------------------------------------------------------------------------------------------------------------
            // 获取左侧菜单树
            var leftMenuTreeSetting = {
                check: {
                    enable: true,
                    autoCheckTrigger: true,
                    chkboxType: { "Y": "", "N": "" }
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: zTreeOnCheck
                },
                view: {
                    selectedMulti: false
                }
            };
            var changedNodes;
            // //左侧树节点 全部展开或折叠
            $scope.left_tree_expand_collapse_all = function(expandFlagBoolean){
                $scope.leftTreeObj.expandAll(expandFlagBoolean);
            }
            $scope.changeArr = [];
            function zTreeOnCheck(event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("leftMenuTree");
                changedNodes = zTree.getCheckedNodes(true);
                // console.log(changedNodes)
                $scope.changeArr = [];
                for (var i = 0; i < changedNodes.length; i++) {
                    var obj= {};
                    obj.id = changedNodes[i].id;
                    obj.name = changedNodes[i].name;
                    obj.pId = changedNodes[i].pId;
                    obj.open = changedNodes[i].open;
                    obj.isParent = changedNodes[i].isParent;
                    obj.functionId = changedNodes[i].functionId;
                    obj.menuType = changedNodes[i].menuType;
                    obj.opertateType = changedNodes[i].opertateType;
                    obj.funcUrl = changedNodes[i].funcUrl;
                    obj.requireJS = changedNodes[i].requireJS;
                    $scope.changeArr.push(obj);
                }
            };
            function getLeftMenuTree (){
                $http.get($localStorage.serviceUrl + "/serviceFunction/queryFunctionTree")
                    .success(function(response, status, headers, config){
                        if(response.resCode == 1){
                            $scope.leftTreeData = response.data;
                            $scope.leftTreeObj = $.fn.zTree.init($("#leftMenuTree"), leftMenuTreeSetting, $scope.leftTreeData);
                        }
                    });
            }
            getLeftMenuTree();
            // 右侧菜单树--------------------------------------------------------------------------------------------------------------------
            var rightMenuTreeSetting = {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                edit: {
                    enable: true,
                    editNameSelectAll:true,
                    removeTitle:'删除',
                    renameTitle:'重命名',
                    showRemoveBtn: true,
                    showRenameBtn: true
                },
                callback: {
                    beforeRemove:beforeRemove,//点击删除时触发，用来提示用户是否确定删除（可以根据返回值 true|false 确定是否可以删除）
                    beforeEditName: beforeEditName,//点击编辑时触发，用来判断该节点是否能编辑
                    beforeRename:beforeRename,//编辑结束时触发，用来验证输入的数据是否符合要求(也是根据返回值 true|false 确定是否可以编辑完成)
                    onRemove:onRemove,//(beforeRemove返回true之后可以进行onRemove)删除节点后触发，用户后台操作
                    onRename:onRename,//编辑后触发，用于操作后台
                    onClick: ztreeOnclick
                },
                view: {
                    selectedMulti: false
                }
            };
            function getRightMenuTree (){
                $http.get( $localStorage.serviceUrl + "/smMenu/queryMenuTreeByAppId")
                    .success(function(response, status, headers, config){
                        if(response.resCode == 1){
                            $scope.rightTreeData = response.data;
                            $scope.rightTreeObj = $.fn.zTree.init($("#rightMenuTree"), rightMenuTreeSetting, $scope.rightTreeData);
                            $scope.originalTreeData = $scope.rightTreeObj.transformToArray($scope.rightTreeObj.getNodes())
                        };
                    });
            };
            function ztreeOnclick(){

            }
            //右侧树节点 全部展开或折叠
            $scope.right_tree_expand_collapse_all = function(expandFlagBoolean){
                $scope.rightTreeObj.expandAll(expandFlagBoolean);
            }
            function beforeRemove(e,treeId,treeNode){
                return confirm("你确定要删除吗？");
            }
            function onRemove(e,treeId,treeNode){
                if(treeNode.isParent){
                    var childNodes = $scope.rightTreeObj.removeChildNodes(treeNode);
                    var paramsArray = new Array();
                    for(var i = 0; i < childNodes.length; i++){
                        paramsArray.push(childNodes[i].id);
                    }
                    // alert("删除父节点的id为："+treeNode.id+"\r\n他的子节点有："+paramsArray.join(","));
                    return;
                }
                // alert("你点击要删除的节点的名称为："+treeNode.name+"\r\n"+"节点id为："+treeNode.id);
            }
            function beforeEditName(treeId,treeNode){
                return true;
            }
            function beforeRename(treeId,treeNode,newName,isCancel){
                if(newName.length < 3){
                    layer.msg('名称不能少于3个字符！', {
                        time: 1000
                    });
                    return false;
                }
                return true;
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
                        layer.msg('该菜单节点类型，不支持添加子节点！', {
                            time: 1000
                        });
                    }
                }
                else{
                    layer.msg('请选择一个节点进行添加！', {
                        time: 1000
                    });
                }
            };
            //右侧菜单 添加根节点
            $scope.addTreeRootItem = function(){
                var node = {name:"New Menu", opertateType:1,t:"New Menu"};
                var newNode = $scope.rightTreeObj.addNodes(null, node);
            }
            function onRename(e,treeId,treeNode,isCancel){
                // alert("修改节点的id为："+treeNode.id+"\n修改后的名称为："+treeNode.name);
            }
            getRightMenuTree();
            //
            // 将左侧选中节点添加到右侧选中节点下
            $scope.addLeftItemToRightTree = function(){
                var selectedNode = $scope.rightTreeObj.getSelectedNodes();
                var nodes = $scope.rightTreeObj.transformToArray($scope.rightTreeObj.getNodes());
                var flag = true;
                if($scope.changeArr.length>0){
                    for (var i = 0; i<nodes.length;i++) {
                        for (var j = 0;j<$scope.changeArr.length;j++) {
                            if(nodes[i].name == $scope.changeArr[j].name){
                                flag = false
                            }
                        }
                    }
                    $scope.rightTreeObj.addNodes(selectedNode[0], $scope.changeArr);
                }else{
                    layer.msg('请先选择菜单！', {
                        time: 1000
                    });
                }



            };
            $scope.back = function () {
                //参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
                //参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
                //跳转到菜单设置
                window.history.back();
            }
            // 保存修改
            $scope.saveTreeMenu = function(){
                // console.log($scope.originalTreeData)
                var obj = {
                    // originalMenus: $scope.originalTreeData,
                    newMenus: $scope.rightTreeObj.transformToArray($scope.rightTreeObj.getNodes())
                }
                $http({
                    method: "POST",
                    url:  $localStorage.serviceUrl + "/smMenu/saveMenuTree",
                    data: JSON.stringify(obj),
                    headers: { 'Content-Type': 'application/json' }
                }).success(function(data){
                    if(data.resCode == 1){
                        layer.msg('保存数据成功！', {
                            time: 1000
                        });
                        getRightMenuTree();
                    }
                });
            }
        }]);

