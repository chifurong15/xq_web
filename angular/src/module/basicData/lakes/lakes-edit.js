var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var waterUrl = modulePrefix + "/v1/waterSystem";
var riverUrl = modulePrefix + "/v1/river";
var lakesUrl = modulePrefix + "/v1/lakes";
var reservoirUrl = modulePrefix + "/v1/reservoir";
var reachUrl = modulePrefix + "/v1/reach";
var dictionaryUrl = modulePrefix + "/v1/dictionary";
(function(window, angular) {
	'use strict';
	angular.module("app").controller(
    	'lakesEditCtrl', ['$localStorage','$scope','routeService','moduleService','$http','MapUtil','OneMapqueryAdminregionFromMysql',
    		function lakesEditCtrl($localStorage, $scope,routeService,moduleService, $http,MapUtil,OneMapqueryAdminregionFromMysql) {
    			if(!$localStorage.lakeEditData){
                    layer.msg('获取数据失败,请重试')
                }
                $scope.lake = $localStorage.lakeEditData;

                //判断名称是否重复
                var oldName = $scope.lake.lakesName;
                $scope.isRepeat = function(){
                    if($scope.lake.lakesName == oldName){
                        return;
                    }else if(!$scope.lake.lakesName){
                        return;
                    }
                    $http({
                        method:'get',
                        url:moduleService.getServiceUrl() +lakesUrl + "/isRepeat",
                        params:{
                            name:$scope.lake.lakesName
                        }
                    }).success(function (res) {
                        if (res.resCode === 0){
                            layer.msg('湖泊名称重复');
                            $scope.lake.lakesName = '';
                        }
                    }).error();
                };

    		    //湖泊类型
    			$scope.lakeTypeList = function() {
    				$http({
    					method: "get",
    					url: moduleService.getServiceUrl() + riverUrl + "/riverType",
    					params: {
    						type: '106'
    					},
    				}).success(function(res) {
    					$scope.lakeTypes = res.data;
    				});
    			}

    			//湖泊岸别
    			$scope.shoreTypeList = function() {
    				$http({
    					method: "get",
    					url: moduleService.getServiceUrl() + riverUrl + "/riverType",
    					params: {
    						type: '112'
    					}
    				}).success(function(res) {
    					$scope.shoreTypes = res.data;
    				});
    			}

    			/*所属区域树模态框*/
                $scope.regionShow = function(type){
                    if(type == 'multiple'){
                        $scope.modalTreeInfo = {'treeType': 'region' ,'setting': {'check': {'enable': true,'chkStyle': "checkbox",'chkboxType': { "Y": "", "N": "" }}}};
                    }else{
                        $scope.modalTreeInfo = {'treeType': 'region'};
                    }
                    $("#treeModal").modal('show');
                };
                /*水系树模态框*/
                $scope.waterShow = function() {
                    $scope.modalTreeInfo = {'treeType': 'water'};
                    $("#treeModal").modal('show');
                }
                /*管理人员树模态框*/
                var user_index;
                $scope.adminTree = function(index) {
                    user_index = index;
                    $scope.modalTreeInfo = {'treeType': 'user','treeParam': {'userType': 1}};
                    $("#treeModal").modal('show');
                }
                $scope.$on('zTreeOnClick', function(event,treeNode) { //点击事件通信 返回treeNode参数
                    if($scope.modalTreeInfo.treeType == 'region'){
                        OneMapqueryAdminregionFromMysql.getRegionData(treeNode.id, treeNode.regionLevel);
                        if(MapUtil.isCoordValid(treeNode["longitude"], treeNode["latitude"])){
                            if ($localStorage.mapType != "arcgisDynamic") {
                                MapUtil.center2LongLat(treeNode["longitude"],treeNode["latitude"],treeNode["grade"]);
                            }
                        }else {
                            console.warn("定位失败！坐标为空！");//父级能得到值
                            // layer.msg('坐标为空！绘制失败');
                        }
                    }
                });
                $scope.$on('zTreeModalClose', function(event,data) { //树弹窗关闭事件通信 返回data = {treeNodeId,treeNodeName}
                    if($scope.modalTreeInfo.treeType == 'region'){
                        if($scope.modalTreeInfo.setting && $scope.modalTreeInfo.setting.check && $scope.modalTreeInfo.setting.check.enable == true){
                            $scope.lake.throughAreaName = data.treeNodeNames.join(',');
                            $scope.lake.throughArea = data.treeNodeIds.join(',');
                        }else{
                            $scope.lake.regionName = data.treeNodeName;
                            $scope.lake.regionCode = data.treeNodeId;
                        }
                    }else if($scope.modalTreeInfo.treeType == 'water'){
                        $scope.lake.waterName = data.treeNodeName;
                        $scope.lake.waterCode = data.treeNodeId;
                    }else if($scope.modalTreeInfo.treeType == 'user'){
                        $scope.reachadmins[user_index].chairmanid = data.treeNodeId;
                        $scope.reachadmins[user_index].chairmanName = data.treeNodeName;
                    }
                })


    			/*编辑*/
    			var jsname = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,16}$/;
                var len =/^\d+$/;
                var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
                var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
    			$scope.submit = function() {
                    var chairmanList = '';
                    $scope.lake.overView = CKEDITOR.instances.editor.getData();
    				if(!$scope.lake.lakesName || !jsname.test($scope.lake.lakesName)) {
                        layer.msg('请完善湖泊名称');
                        return;
                    }else if (!$scope.lake.regionName){
                        layer.msg('请完善所属区域');
                        return;
                    }else if (!$scope.lake.lakesType){
                        layer.msg('请完善湖泊类型');
                        return;
                    }else if (!$scope.lake.lakeshore){
                        layer.msg('请完善湖泊岸别');
                        return;
                    }else if($scope.reachadmins.length != 0){
                        var flag = 1;
                        var reachadmins = $scope.reachadmins;
                        reachadmins = angular.forEach(reachadmins, function (each){
                            if(!each.chairmanid) {
                                layer.msg('请完善履职人员');
                                flag = 0;
                                return false;
                            }else if(!each.chairmanlevel) {
                                layer.msg('请完善履职级别');
                                flag = 0;
                                return false;
                            }else if(!each.chairmanRole) {
                                layer.msg('请完善履职类型');
                                flag = 0;
                                return false
                            }else if(!each.administrationCoast) {
                                layer.msg('请完善管理岸面');
                                flag = 0;
                                return false;
                            }
                            each.isAssess = each.isAssess == true ? 'Y':'N';
                        })
                        if(!flag) return;
                        chairmanList = JSON.stringify(reachadmins);
                    }
                    $http({
                        method: "post",
                        url: moduleService.getServiceUrl() + lakesUrl + "/update",
                        data: {
                            id: $scope.lake.id,
                            lakesName: $scope.lake.lakesName,
                            regionCode: $scope.lake.regionCode,
                            waterCode: $scope.lake.waterCode,
                            lakesType: $scope.lake.lakesType,
                            lakeshore: $scope.lake.lakeshore,
                            longitude: $scope.lake.longitude,
                            latitude: $scope.lake.latitude,
                            acreage: $scope.lake.acreage,
                            capacity: $scope.lake.capacity,
                            location: $scope.lake.location,
                            linePoints: $scope.lake.linePoints,
                            spatialData: $scope.lake.spatialData,
                            overView: $scope.lake.overView,
                            remark: $scope.lake.remark,
                            jsonFiles: JSON.stringify($scope.lake.jsonFiles),
                            jsonImages: JSON.stringify($scope.lake.jsonImages),
                            chairmanList: chairmanList,
                        },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest:function(obj){return $.param(obj)}
                    }).success(function(res) {
                        if(res.resCode == 1){
                            layer.msg('修改成功',{shift:-1},function(){
                                $scope.back();
                            });
                        }else{
                            layer.msg(res.resMsg || '请求失败,请稍后再试');
                        }
                    }).error(function(res){
                        layer.msg('服务器错误,请稍后再试')
                    });
    			};

    			// 返回按钮
    			$scope.back = function() {
    				routeService.route(106, true);
    			}
    		}
    	]);
})(window, angular);