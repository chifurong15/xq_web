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
		'pondAddCtrl', ['$localStorage','$scope','routeService','moduleService','$http','MapUtil','OneMapqueryAdminregionFromMysql',
				function pondAddCtrl($localStorage, $scope, routeService,moduleService, $http, MapUtil, OneMapqueryAdminregionFromMysql) {
					$scope.pond = {};

					$scope.pondTypeList = function() {
						$http({
							method: "get",
							url: moduleService.getServiceUrl() + '/watersource/v1/pond/pondType',
						}).success(function(res) {
							$scope.pondTypes = res.data;
						});
					}

					/*所属区域树模态框*/
					$scope.regionShow = function(){
						$scope.modalTreeInfo = {'treeType': 'region'};
						$("#treeModal").modal('show');
					};

					/*管理人员树模态框*/
					var user_index;
					$scope.adminTree = function(index) {
						user_index = index;
						$scope.modalTreeInfo = {'treeType': 'user','treeParam': {'userType': 3}};
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
				    		$scope.pond.regionName = data.treeNodeName;
				    		$scope.pond.regionCode = data.treeNodeId;
				    	}else if($scope.modalTreeInfo.treeType == 'user'){
				    		$scope.reachadmins[user_index].chairmanid = data.treeNodeId;
                            $scope.reachadmins[user_index].chairmanName = data.treeNodeName;
				    	}
				    })

					/*新增*/
					var jsname = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,16}$/;
                    var len =/^\d+$/;
                    var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
                    var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
					$scope.submit = function() {
						var chairmanList = '';
						$scope.pond.overView = CKEDITOR.instances.editor.getData();
						if(!$scope.pond.pondName || !jsname.test($scope.pond.pondName)) {
							layer.msg('请完善坑塘名称');
                    		return;
						}else if (!$scope.pond.regionName){
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
							url: moduleService.getServiceUrl() + '/watersource/v1/pond/add',
							data: {
								pondName: $scope.pond.pondName,
								pondType: $scope.pond.pondType,
								regionCode: $scope.pond.regionCode,
								acreage: $scope.pond.acreage,
								longitude: $scope.pond.longitude,
                                latitude: $scope.pond.latitude,
                                location: $scope.pond.location,
                                linePoints: $scope.pond.linePoints,
                        		spatialData: $scope.pond.spatialData,
								overView: $scope.pond.overView,
								remark: $scope.pond.remark,
								chairmanList: chairmanList,
							},
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest:function(obj){return $.param(obj)}
						}).success(function(res) {
                            if(res.resCode == 1){
                                layer.msg('新增成功',{shift:-1},function(){
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
						routeService.route(120, true);
					}
				}
			]);

})(window, angular);