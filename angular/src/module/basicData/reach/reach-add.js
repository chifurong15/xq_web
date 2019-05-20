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
		'imReachAdd',['$localStorage','$scope','$rootScope','routeService','moduleService','$http','MapUtil','OneMapqueryAdminregionFromMysql',
		function imReachAdd($localStorage, $scope, $rootScope, routeService,moduleService, $http,MapUtil,OneMapqueryAdminregionFromMysql) {
            $scope.reach = {};

            /*所属区域树模态框*/
			$scope.regionShow = function(type){
				if(type == 'multiple'){
					$scope.modalTreeInfo = {'treeType': 'region' ,'setting': {'check': {'enable': true,'chkStyle': "checkbox",'chkboxType': { "Y": "", "N": "" }}}};
				}else{
					$scope.modalTreeInfo = {'treeType': 'region'};
				}
				$("#treeModal").modal('show');
			};
			/*河流树模态框*/
			$scope.riverShow = function() {
				$scope.modalTreeInfo = {'treeType': 'river'};
				$("#treeModal").modal('show');
			}
			/*断面模态框*/
			$scope.sectionShow = function(section) {
				$scope.section = section;
                $scope.modalTreeInfo = {'treeType': 'section'};
                $("#treeModal").modal('show');
            }
			/*管理人员树模态框*/
			var user_index;
			$scope.adminTree = function(index) {
				user_index = index;
				$scope.modalTreeInfo = {'treeType': 'user','treeParam': {'userType': 0}};
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
		    			$scope.reach.throughAreaName = data.treeNodeNames.join(',');
		    			$scope.reach.throughArea = data.treeNodeIds.join(',');
		    		}else{
		    			$scope.reach.regionName = data.treeNodeName;
		    			$scope.reach.regionCode = data.treeNodeId;
		    		}
		    	}else if($scope.modalTreeInfo.treeType == 'river'){
		    		$scope.reach.pName = data.treeNodeName;
		    		$scope.reach.theirCode = data.treeNodeId;
		    	}else if($scope.modalTreeInfo.treeType == 'user'){
		    		$scope.reachadmins[user_index].chairmanid = data.treeNodeId;
                    $scope.reachadmins[user_index].chairmanName = data.treeNodeName;
		    	}else if($scope.modalTreeInfo.treeType == 'section'){
		    		if($scope.section == 1){
		    			$scope.reach.startSectionName = data.treeNodeName;
		    			$scope.reach.startSection = data.treeNodeId;
		    		}else if($scope.section == 2){
		    			$scope.reach.endSectionName = data.treeNodeName;
		    			$scope.reach.endSection = data.treeNodeId;
		    		}
		    	}
		    })

            //河湖库名称
			$scope.isRepeat = function() {
				if (!$scope.reach.reachName){
					return;
				}
            	$http({
                    method:'get',
                    url:moduleService.getServiceUrl() + reachUrl + "/isRepeat",
                    params:{
                        name:$scope.reach.reachName
                    }
                }).success(function (res) {
                    if (res.resCode === 0){
                        layer.msg('名称重复');
                        $scope.reach.reachName = '';
                    }
                }).error();
			}
            $scope.$watch('reach.pName+reach.regionName',function(n,o){
            	if(!n || n.indexOf('undefined') > '-1'){
            		return
            	}
				$scope.reach.reachName = n +'段';
			})

			//水质等级
			$scope.waterQuality = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() + riverUrl + "/riverType",
					params: {
						type: '154'
					},
				}).success(
					function(res) {
						$scope.waterQualityList = res.data;
					}
				);
			}

			//淤积情况
			$scope.deposit = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() +riverUrl + "/riverType",
					params: {
						type: '161'
					},
				}).success(
					function(res) {
						$scope.depositList = res.data;
					}
				);
			}

			//河湖库级别
			$scope.rivePart = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() +riverUrl + "/riverType",
					params: {
						type: '116'
					},
				}).success(
					function(res) {
						$scope.rivePartList = res.data;
					}
				);
			}

			//是否位于山区
			$scope.mountain = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() + riverUrl + "/riverType",
					params: {
						type: '165'
					},
				}).success(
					function(res) {
						$scope.mountainList = res.data;
					}
				);
			}

			//是否虚拟
			$scope.virtual = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() +riverUrl + "/riverType",
					params: {
						type: '165'
					},
				}).success(
					function(res) {;
						$scope.virtualList = res.data;
					}
				);
			}

			//河段岸别
			$scope.waterShore = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() + riverUrl + "/riverType",
					params: {
						type: '110'
					},
				}).success(
					function(res) {
						$scope.waterShoreList = res.data;;
					}
				);
			}

			$scope.back = function() {
				// 跳转到菜单页面
				routeService.route(108, true);
			}

			//新增河湖库数据
			var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
            var len =/^\d+(?:\.\d{1,2})?$/;
			$scope.submit = function() {
				var chairmanList = '';
				$scope.reach.overView = CKEDITOR.instances.editor.getData();
				if(!$scope.reach.reachName || !jsname.test($scope.reach.reachName) == null) {
                    layer.msg('请完善河段名称');
                    return;
                }else if(!$scope.reach.regionCode) {
                    layer.msg('请完善所属区域');
                    return;
                }else if($scope.reach.grade == null) {
                    layer.msg('请完善河湖库级别');
                    return;
                }else if($scope.reach.isVirtual == null){
                    layer.msg('请完善虚拟信息');
                    return;
                }else if(!$scope.reach.shore) {
                    layer.msg('请完善河段岸别');
                    return;
                }else if($scope.reachadmins.length != 0){
                    var flag = 1;
                    var reachadmins = $scope.reachadmins;
                    reachadmins = angular.forEach(reachadmins, function (each){
                        if(!each.chairmanid) {
                            flag = 0;
                            layer.msg('请完善履职人员');
                            return false;
                        }else if(!each.chairmanlevel) {
                            flag = 0;
                            layer.msg('请完善履职级别');
                            return false;
                        }else if(!each.chairmanRole) {
                            flag = 0;
                            layer.msg('请完善履职类型');
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
                    url: moduleService.getServiceUrl() +reachUrl + "/add",
                    data: {
                        classify: 'A',
                        reachName: $scope.reach.reachName,
                        alias: $scope.reach.alias,
                        waterGrade: $scope.reach.waterGrade,
                        silty: $scope.reach.silty,
                        regionName: $scope.reach.regionName,
                        regionCode: $scope.reach.regionCode,
                        grade: $scope.reach.grade,
                        startPoint: $scope.reach.startPoint,
                        endPoint: $scope.reach.endPoint,
                        startSection: $scope.reach.startSection,
                        endSection: $scope.reach.endSection,
                        whether: $scope.reach.whether,
                        isVirtual: $scope.reach.isVirtual,
                        length: $scope.reach.length,
                        width: $scope.reach.width,
                        throughArea: $scope.reach.throughArea,
                        parentsCode: $scope.reach.parentsCode,
                        shore: $scope.reach.shore,
                        pName: $scope.reach.pName,
                        theirCode: $scope.reach.theirCode,
                        overView: $scope.reach.overView,
                        linePoints: $scope.reach.linePoints,
                        spatialData: $scope.reach.spatialData,
                        remark: $scope.reach.remark,
                        jsonFiles: JSON.stringify($scope.reach.jsonFiles),
                        jsonImages: JSON.stringify($scope.reach.jsonImages),
                        chairmanList: chairmanList
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
                }).error(function(res) {
            		layer.msg('服务器出错，请稍后再试！');
                });
			}
        }]
    );
})(window, angular);