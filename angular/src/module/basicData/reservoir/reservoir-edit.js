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
	angular.module("app").controller('reservoirEditCtrl', ['$localStorage','$scope','routeService','moduleService','$http','MapUtil','OneMapqueryAdminregionFromMysql',
		function reservoirEditCtrl($localStorage, $scope,routeService, moduleService,$http,MapUtil,OneMapqueryAdminregionFromMysql) {
			if(!$localStorage.reservoirEditData){
				layer.msg('获取数据失败,请重试');
				return;
			}
			$scope.reservoir = $localStorage.reservoirEditData;

			//判断名称是否重复v
			var oldName = $scope.reservoir.reservoirName;
            $scope.isRepeat = function(){
            	if($scope.reservoir.reservoirName == oldName){
                    return;
                }else if(!$scope.reservoir.reservoirName){
                    return;
                }
                $http({
                    method:'get',
                    url:moduleService.getServiceUrl() +reservoirUrl + "/isRepeat",
                    params:{
                        name:$scope.reservoir.reservoirName
                    }
                }).success(function(res) {
                    if (res.resCode === 0){
                        layer.msg('水库名称重复');
                        $scope.reservoir.reservoirName = '';
                    }
                }).error();
            };

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
                $scope.modalTreeInfo = {'treeType': 'user','treeParam': {'userType': 2}};
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
                        $scope.reservoir.throughAreaName = data.treeNodeNames.join(',');
                        $scope.reservoir.throughArea = data.treeNodeIds.join(',');
                    }else{
                        $scope.reservoir.regionName = data.treeNodeName;
                        $scope.reservoir.regionCode = data.treeNodeId;
                    }
                }else if($scope.modalTreeInfo.treeType == 'water'){
                    $scope.reservoir.waterName = data.treeNodeName;
                    $scope.reservoir.waterCode = data.treeNodeId;
                }else if($scope.modalTreeInfo.treeType == 'user'){
                    $scope.reachadmins[user_index].chairmanid = data.treeNodeId;
                    $scope.reachadmins[user_index].chairmanName = data.treeNodeName;
                }
            })

            //水库类型
            $scope.reservoirTypeList = function() {
                $http({
                    method: "get",
                    url: moduleService.getServiceUrl() + riverUrl + "/riverType",
                    params: {
                        type: '108'
                    },
                }).success(function(res) {
                    $scope.reservoirTypes = res.data;
                });
            }

            //水库岸别
            $scope.watershoreTypeList = function() {
                $http({
                    method: "get",
                    url: moduleService.getServiceUrl() + riverUrl + "/riverType",
                    params: {
                        type: '114'
                    },
                }).success(function(res) {
                    $scope.watershoreTypes = res.data;
                });
            }

			//新增
			var jsname = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,16}$/;
            var len =/^\d+$/;
			$scope.submit = function() {
				var chairmanList = '';
                $scope.reservoir.overView = CKEDITOR.instances.editor.getData();
                if(!$scope.reservoir.reservoirName || !jsname.test($scope.reservoir.reservoirName) == null) {
                    layer.msg('请完善水库名称');
                    return;
                } else if (!$scope.reservoir.regionName){
                    layer.msg('请完善所属区域');
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
					url: moduleService.getServiceUrl() + reservoirUrl + "/update",
					data: {
						id: $scope.reservoir.id,
						reservoirName:$scope.reservoir.reservoirName,
                        regionCode: $scope.reservoir.regionCode,
                        waterCode: $scope.reservoir.waterCode,
                        reservoirType: $scope.reservoir.reservoirType,
                        reservoirBank: $scope.reservoir.reservoirBank,
                        centerLongitude: $scope.reservoir.centerLongitude,
                        centerLatitude: $scope.reservoir.centerLatitude,
                        acreage: $scope.reservoir.acreage,
                        capacity: $scope.reservoir.capacity,
                        location: $scope.reservoir.location,
                        throughArea: $scope.reservoir.throughArea,
                        spatialData: $scope.reservoir.spatialData,
                        LinePoints: $scope.reservoir.linePoints,
                        managementUnit: $scope.reservoir.managementUnit,
                        overView: $scope.reservoir.overView,
                        remark: $scope.reservoir.remark,
                        jsonFiles: JSON.stringify($scope.reservoir.jsonFiles),
                        jsonImages: JSON.stringify($scope.reservoir.jsonImages),
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
				}).error(function(res) {
            		layer.msg('服务器出错，请稍后再试！');
                });
			};

            // 返回按钮
			$scope.back = function() {
				routeService.route(107, true);
			}
		}
	]);
})(window, angular);