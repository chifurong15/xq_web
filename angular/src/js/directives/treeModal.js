angular.module('app').directive('treeModal', ['$localStorage','$timeout','$http','moduleService',
    function($localStorage,$timeout,$http,moduleService) {
    return {
        restrict: 'E',
        replace : false,
        template:   '<div class="modal fade" id="treeModal" data-backdrop="static" style="z-index:100001">'+
                        '<div class="modal-dialog" role="document">'+
                            '<div class="modal-content">'+
                                '<div class="modal-header">'+
                                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                                    '<h4 class="modal-title">{{treeInfo.title}}</h4>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                '<div class="input-group">'+
                                    '<input type="text" ng-model="searchName" class="form-control" placeholder="{{treeInfo.placeholder}}">'+
                                    '<span class="input-group-btn">'+
                                        '<button class="btn btn-default" type="button" ng-click="search()">查询</button>'+
                                    '</span>'+
                                '</div>'+
                                    '<ul id="modalTree" class="ztree ztree_box_modal"></ul>'+
                                '</div>'+
                                '<div class="modal-footer">'+
                                    '<button type="button" class="btn btn-primary" ng-click="close()">确定</button>'+
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>',
        scope: {
            modalTreeInfo: '@',
        },
        link: function($scope, $element, $attrs) {
            var tree, treeNodeId, treeNodeName;
            var regionCode = $localStorage.userLoginInfo && $localStorage.userLoginInfo.userInfo.regionId ? $localStorage.userLoginInfo.userInfo.regionId : null;
            
            var treeParamList = {
                'region': {
                    title: '选择区域',
                    placeholder: '请输入区域名称',
                    treeUrl: moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree',
                    searchUrl: moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree',
                    treeParam: {
                        regionCode: regionCode
                    },
                    searchParamKey: 'regionName',
                    setting : {
                        view:{},
                        data:{
                            simpleData:{enable:true},
                            keep: {parent: true}
                        },
                        callback:{
                            beforeExpand: zTreeOnExpand,
                            onClick: zTreeOnClick,
                        }
                    }
                },
                'water': {
                    title: '选择水系',
                    placeholder: '请输入水系名称',
                    treeUrl: moduleService.getServiceUrl() + '/watersource/v1/waterSystem/belongWater',
                    searchUrl: moduleService.getServiceUrl() + '/watersource/v1/waterSystem/belongWater',
                    treeParam: {
                        areaCode: null,
                    },
                    searchParamKey: 'waterName',
                    setting : {
                        view: {},
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            // beforeExpand: zTreeOnExpand,
                            beforeClick: zTreeBeforeClick,
                            onClick: zTreeOnClick
                        }
                    }
                },
                'river': {
                    title: '选择河流',
                    placeholder: '请输入河流名称',
                    treeUrl: moduleService.getServiceUrl() + '/watersource/v1/waterSystem/riverLakesReservoir',
                    searchUrl: moduleService.getServiceUrl() + '/watersource/v1/waterSystem/riverLakesReservoir',
                    treeParam: {
                        areaCode: null,
                        waterCode: null,
                        type: 'A',
                    },
                    searchParamKey: 'name',
                    setting : {
                        view: {},
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            // beforeExpand: zTreeOnExpand,
                            beforeClick: zTreeBeforeClick,
                            onClick: zTreeOnClick
                        }
                    }
                },
                'user': {
                    title: '选择人员',
                    placeholder: '请输入人员名称',
                    treeUrl: moduleService.getServiceUrl() + '/watersource/v1/reach/regionAndUserTree',
                    searchUrl: moduleService.getServiceUrl() + '/watersource/v1/reach/findByUser',
                    treeParam: {
                        userType: null
                    },
                    searchParamKey: 'userName',
                    setting : {
                        view: {},
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            beforeExpand: zTreeOnExpand,
                            beforeClick: zTreeBeforeClick,
                            onClick: zTreeOnClick
                        }
                    }
                },
                'reach': {
                    title: '选择河湖库段',
                    placeholder: '请输入河湖库段名称',
                    treeUrl: moduleService.getServiceUrl() + '/component/v1/component/initReachTree',
                    searchUrl: moduleService.getServiceUrl() + '/component/v1/component/fingByReachName',
                    treeParam: {
                    },
                    searchParamKey: 'reachName',
                    setting : {
                        view: {},
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            beforeExpand: zTreeOnExpand,
                            beforeClick: zTreeBeforeClick,
                            onClick: zTreeOnClick
                        }
                    }
                },
                'pollution': {
                    title: '选择污染源',
                    placeholder: '请输入污染源名称',
                    treeUrl: moduleService.getServiceUrl() + '/component/v1/outfall/findPollutionls',
                    searchUrl: moduleService.getServiceUrl() + '/component/v1/outfall/seachPollutionl',
                    treeParam: {
                    },
                    searchParamKey: 'name',
                    setting : {
                        view: {},
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            beforeExpand: zTreeOnExpand,
                            beforeClick: zTreeBeforeClick,
                            onClick: zTreeOnClick
                        }
                    }
                },
                'video': {
                    title: '选择监控摄像',
                    placeholder: '请输入监控摄像名称',
                    treeUrl: moduleService.getServiceUrl() + '/component//v1/rivervideo/videoTree',
                    searchUrl: moduleService.getServiceUrl() + '/component/v1/rivervideo/videoTree',
                    treeParam: {
                    },
                    searchParamKey: 'name',
                    setting : {
                        view: {},
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            // beforeExpand: zTreeOnExpand,
                            beforeClick: zTreeBeforeClick,
                            onClick: zTreeOnClick
                        }
                    }
                },
                'section': {
                    title: '选择所属断面',
                    placeholder: '请输入断面名称',
                    treeUrl: moduleService.getServiceUrl() + '/watersource//v1/mdMicro/findSectionTreeNode',
                    searchUrl: moduleService.getServiceUrl() + '/watersource/v1/mdMicro/findSectionTreeNode',
                    treeParam: {
                    },
                    searchParamKey: 'name',
                    setting : {
                        view: {},
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            // beforeExpand: zTreeOnExpand,
                            beforeClick: zTreeBeforeClick,
                            onClick: zTreeOnClick
                        }
                    }
                },
                'chairman': {
                    title: '选择责任河长',
                    placeholder: '请输入河长名称',
                    treeUrl: moduleService.getServiceUrl() + '/watersource//v1/reachChairMan/findUserNodesByCondition',
                    searchUrl: moduleService.getServiceUrl() + '/watersource/v1/reachChairMan/findUserNodesByCondition',
                    treeParam: {
                        regionId: null,
                        isAllNodes:true,
                    },
                    searchParamKey: 'name',
                    setting : {
                        view: {},
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            // beforeExpand: zTreeOnExpand,
                            beforeClick: zTreeBeforeClick,
                            onClick: zTreeOnClick
                        }
                    }
                },
                'waterbody': {
                    title: '选择水体',
                    placeholder: '请输入水体名称',
                    treeUrl: moduleService.getServiceUrl() + '/watersource/v1/reachChairMan/bindList',
                    searchUrl: moduleService.getServiceUrl() + '/watersource/v1/reachChairMan/bindList',
                    treeParam: {
                        regionCode: regionCode,
                        waterType: null,
                    },
                    searchParamKey: 'name',
                    setting : {
                        view: {},
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            beforeExpand: zTreeOnExpand,
                            beforeClick: zTreeBeforeClick,
                            onClick: zTreeOnClick
                        }
                    }
                },
            }

            $('#treeModal').on('show.bs.modal',function(){
                $scope.searchName = '';
                treeNodeId = '';
                treeNodeName = '';
                $.fn.zTree.destroy("modalTree");
                $timeout(function(){
                    var info = JSON.parse($scope.modalTreeInfo);
                    var treeType = info['treeType'];
                    $scope.treeInfo = $.extend(true, {}, treeParamList[treeType], info);
                    $scope.init();
                },0);
            })

            /*初始化*/
            $scope.init = function(){
                $http({
                    method: "GET",
                    url: $scope.treeInfo.treeUrl,
                    dataType: 'json',
                    params: $scope.treeInfo.treeParam,
                }).success(function(res) {
                    tree = $.fn.zTree.init($("#modalTree"), $scope.treeInfo.setting, res.data);
                }).error(function(res){
                    layer.msg('服务器异常，请稍后再试');
                });
            };
             /*树节点点击前事件*/
            function zTreeBeforeClick(treeId, treeNode ,clickFlag) {
                var info = JSON.parse($scope.modalTreeInfo);
                var treeType = info['treeType'];
                if(treeNode.isParent == true){
                    return false;
                }else if(treeType == 'user'){
                    if(!treeNode.type && !treeNode.usertype){
                        return false
                    }
                }
                return true;
            };

            /*树节点点击事件*/
            function zTreeOnClick(event, treeId, treeNode) {
                if(treeNode.id && treeNode.name){
                    treeNodeId = treeNode.id;
                    treeNodeName =  treeNode.name;
                    $scope.$emit('zTreeOnClick', treeNode);
                }else{
                    layer.msg('节点信息有误');
                }
            };

            /*树节点展开事件*/
            function zTreeOnExpand(treeId, treeNode) {
                var cnodes = treeNode.children;
                if (cnodes != null && cnodes.length > 0){
                    return;
                };
                var info = JSON.parse($scope.modalTreeInfo);
                var userType = null;
                var waterType = null;
                if(info.treeParam && info.treeParam.userType != undefined){
                    userType = info.treeParam.userType;
                }
                if(info.treeParam && info.treeParam.waterType != undefined){
                    waterType = info.treeParam.waterType;
                }
                $http({
                    method: "GET",
                    url: $scope.treeInfo.treeUrl,
                    params: {
                        parentCode: treeNode.id,
                        userType: userType,
                        waterType: waterType,
                    }
                }).success(function (res) {
                    tree.addNodes(treeNode, res.data, true);
                });
            }

            /*区域模态框搜索框*/
            $scope.search = function() {
                var data = $scope.treeInfo.treeParam;
                var key = $scope.treeInfo.searchParamKey;
                data[key] = $scope.searchName;
                $http({
                    method: "GET",
                    url: $scope.treeInfo.searchUrl,
                    params: data
                }).success(function(res) {
                    tree = $.fn.zTree.init($("#modalTree"), $scope.treeInfo.setting, res.data);
                });
            };

            /*搜索框发生变化，触发TreeList事件*/
            var timeout;
            $scope.$watch('searchName',  function(newValue, oldValue) {
                if(timeout){
                    $timeout.cancel(timeout);
                }
                if (newValue === oldValue) {
                    return;
                }else if(!newValue){
                    timeout = $timeout(function() {
                        $scope.init();
                    },800);
                }else{
                    timeout = $timeout(function() {
                        $scope.search();
                    },800);
                }
            });
            /*关闭所属区域模态框*/
            $scope.close = function (){
                if($scope.treeInfo.setting.check && $scope.treeInfo.setting.check.enable == true){
                    var nodes = tree.getCheckedNodes(true);
                    var treeNodeIds = [];
                    var treeNodeNames = [];
                    angular.forEach(nodes,function(each){
                        treeNodeIds.push(each.id);
                        treeNodeNames.push(each.name);
                    })
                    $scope.$emit('zTreeModalClose', {treeNodeIds,treeNodeNames,nodes});
                }else{
                    $scope.$emit('zTreeModalClose', {treeNodeId,treeNodeName});
                }
                $("#treeModal").modal('hide');
            };
        }
    };
}]);
