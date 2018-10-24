(function (window, angular) {
	'use strict';

	var app = angular.module("app");
	app.filter("trustHtml", function ($sce) {
		return function (input) {
			return $sce.trustAsHtml(input);
		}
	})

	app.controller(
		'dataShowCtrl', [
			'$localStorage',
			'$scope',
			'$location',
			'$log',
			'$q',
			'$rootScope',
			'globalParam',
			'$window',
			'routeService',
			'$http',
			'esriApiDeps',
			'wish',
			'tiandituFactory',
			'MapTool',
			'MapUtil',
			'ComponentTool',
			"queryAdminregion",
			'componentToolService',
			function dataShowCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
								  esriApiDeps, wish, tiandituFactory, MapTool, MapUtil, ComponentTool, queryAdminregion, componentToolService) {



				var promise = esriApiDeps.query();
				var w = wish.get();

				var showComGraphic = null, t = null;

				$scope.init = function () {
					//gis模块加载
                    MapTool.init($scope.map);
                    MapUtil.init($scope.map, region);
                    ComponentTool.init($scope.map);
                    queryAdminregion.init($scope.map);

                    $('#navbarBtn').show();
				};

				var $regionTreeContainer = $('#regionTreeContainer'),
					$componentTreeContainer = $('#componentTreeContainer');

				$scope.hasRegion = false;
				$scope.regionCode = null;
				$scope.mainClassId = null;
				$scope.conditionVal = null;

				var region = {
					"longitude": 117.19203455803067,
					"latitude": 39.08350838137276,
					"regionlevel": 2
				};

				$scope.map = new w.Map("map", {
					slider: false,
					autoResize: true,
					resizeDelay: 100,
					logo: false
				});
				tiandituFactory.initTianditu($scope.map, region);
				componentToolService.init($scope.map);

				dojo.connect($scope.map, "onClick", function (evt) {
					console.log(evt);
				});

				// 地图工具菜单点击
				var measureTool = null;
				$scope.measureFunc = function (type) {
					console.log(type);
					if (measureTool == null) {
						measureTool = new w.MeasureTools({
							map: $scope.map
						});
					}

					if (type == "area") {
						measureTool._startMeasureArea();
					} else if (type == "distance") {
						measureTool._startMeasureDistance();
					} else {
						measureTool._clearMeasure();
					}
				};

				// 左侧区域收缩
				$scope.treeBodyShow = function (event) {
					if ($('.iconRight').hasClass('fa-angle-left')) {
						$('.iconRight').removeClass('fa-angle-left').addClass('fa-angle-right');
						$('.aside-info').animate({'left': '-200px'}, 1000);
						$('.container-tj').animate({'left': '0'}, 1000);
						$('.tree-body-btn').animate({'left': '0'}, 1000);

					} else {
						$('.iconRight').removeClass('fa-angle-right').addClass('fa-angle-left');
						$('.aside-info').animate({'left': '0'}, 1000);
						$('.container-tj').animate({'left': '200px'}, 1000);
						$('.tree-body-btn').animate({'left': '200px'}, 1000);
					}
				};

				// 右侧区域收缩
				$scope.infoTjShow = function (event) {
					if ($('.iconRight').hasClass('fa-angle-right')) {
						$('.iconRight').removeClass('fa-angle-right').addClass('fa-angle-left');
						$('.infoCon-tj').animate({'right': '-360px'}, 1000);
						$('.container-tj').animate({'right': '0'}, 1000);

					} else {
						$('.iconRight').removeClass('fa-angle-left').addClass('fa-angle-right');
						$('.infoCon-tj').animate({'right': '0'}, 1000);
						$('.container-tj').animate({'right': '360px'}, 1000);
					}
				};


				// 地图工具条收缩
				$scope.toolbarClose = function () {
					if ($('#toolbarClose').hasClass('toolbar-6')) {
						$('#toolbarClose').removeClass('toolbar-6').addClass('toolbar-7');
						$('#measureTools').animate({'width': '40px'}, 1000);
					} else {
						$('#toolbarClose').removeClass('toolbar-7').addClass('toolbar-6');
						$('#measureTools').animate({'width': '240px'}, 1000);
					}
				};

				// 显示地图资源层列表
                $scope.mapResourceShow = function () {
                    $('#mapResource').slideToggle();
                    $('#mapTypes').hide();
                }

                // 显示地图底图列表
                $scope.mapTypeShow = function () {
                    $('#mapTypes').slideToggle();
                    $('#mapResource').hide();
                }

                //资源图切换
                $scope.changeMapResource = function(resourceType){
                	console.log(resourceType);
                    if(resourceType == 'imgAnno'){
                        MapTool.controlLayerVisible("cia", true);
                    }else {
                        MapTool.controlLayerVisible("cva", true);
                    }
                };

				$scope.types = [
					{num: 1, style: 'normal', "background-position": "0 0"},
					{num: 2, style: 'earth', "background-position": "0 -60px"}
				];

				$scope.showMapTypes = function (style) {
					$scope.selected = style;
                    console.log(style);
					if(style == 'earth'){
						MapTool.controlLayerVisible("img", true);
					}else {
                        MapTool.controlLayerVisible("vec", true);
					}
				};

				/**
				 * zTree节点基本设置
				 */
				var setting = {
					async: {
						enable: true,
						type: 'GET',
						dataType: 'json'
					},
					data: {
						key: {
							title: ''
						},
						simpleData: {
							enable: true
						}
					},
					edit: {
						enable: false
					},
					view: {
						nameIsHTML: true,
						expandSpeed: 'slow',
						dblClickExpand: false,
						txtSelectedEnable: false
					}
				};

				/**
				 * 区域 zTree节点补充设置
				 */
				var regionSetting = {
					async: {
						url: asyncGetRegionNodesURL
					},
					callback: {
						onAsyncSuccess: asyncGetRegionNodesSuccess,
						onClick: onClickRegionNodes,
						onExpand: regionNodeExpand
					}
				};

				/**
				 * 部件 zTree节点补充设置
				 */
				var componentSetting = {
					check: {
						enable: true
					},
					callback: {
						onCheck: componentNodeOnCheck
					}
				};

				/**
				 * zTree 节点深拷贝
				 */
				var regionTreeSetting = $.extend(true, {}, setting, regionSetting);
				var componentTreeSetting = $.extend(true, {}, setting, componentSetting);

				/**
				 * 区域节点异步请求数据URL
				 */
				function asyncGetRegionNodesURL(treeId, treeNode) {
					return $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree?parentCode=' + treeNode.id;
				}

				/**
				 * 区域节点点击问题加载部件
				 */
				function onClickRegionNodes(event, treeId, treeNode) {
				    componentToolService.removeAllLayers();
					$scope.regionCode = treeNode.id;
					console.log(treeNode);
					if (MapUtil.isCoordValid(treeNode["longitude"], treeNode["latitude"])) {
						if (treeNode["grade"] != null) {
							MapUtil.center2LongLat(treeNode["longitude"], treeNode["latitude"], treeNode["grade"]);
						}
					} else {
						console.log("无效坐标");
					}

					reachTreeLoading();
				}

				/**
				 * 区域节点展开问题
				 */
				function regionNodeExpand(event, treeId, treeNode) {
					console.log(treeNode);
					queryAdminregion.addPolygonToMap(treeNode, true);
				}

				/**
				 * 区域节点异步请求成功回调函数
				 */
				function asyncGetRegionNodesSuccess(event, treeId, treeNode, res) {
					var treeObj = $.fn.zTree.getZTreeObj(treeId);
					//更新节点数据
					treeObj.addNodes(treeNode, -1, res.data);
					if (treeNode.children[0].resCode) {
						treeObj.removeNode(treeNode.children[0]);
						treeObj.updateNode(treeNode);
					}
				}

				/**
				 * 区域树加载
				 */
				$http({
					method: 'get',
					url:  $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree?regionCode='+$localStorage.userLoginInfo.userInfo.regionId
				}).success(function (data) {
					$.fn.zTree.init($regionTreeContainer, regionTreeSetting, data.data);
					//默认勾选根节点并触发点击问题
					var treeObj = $.fn.zTree.getZTreeObj('regionTreeContainer');
					var nodes = treeObj.getNodes();
					treeObj.selectNode(nodes[0]);
					onClickRegionNodes(null, 'regionTreeContainer', nodes[0]);
				});

				/**
				 * 河道树加载
				 */
				function reachTreeLoading() {

					$http({
						method: 'GET',
						params: {
							regionCode: $scope.regionCode
						},
						url:  $localStorage.gwUrl + '/component/v1/componenttype/findType'
					}).success(function (res) {
						var nodeArr = [];
						$.each(res.data, function (index, value) {
							value.pId = $scope.regionCode;
							value.isParent = false;
							value.nocheck = false;
							value.checked = index === 0;
							nodeArr.push(value)
						});
						//补充跟节点
						// $scope.mainClassId = res.data[0].id;
						nodeArr.push({
							id: $scope.regionCode,
							pId: $scope.regionCode,
							name: '部件',
							title: '部件',
							nocheck: true,
							isRoot: true,
							open: true
						});
						$.fn.zTree.init($componentTreeContainer, componentTreeSetting, nodeArr);
						componentNodeOnCheck(null, 'componentTreeContainer', res.data[0]);
					});
				}

				/**
				 * 部件复选框问题
				 */
				function componentNodeOnCheck(event, treeId, treeNode) {
					//获取全部被勾选节点
					var checkNodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
					$scope.mainClassId = (!!treeNode && treeNode.checked) ? treeNode.id : checkNodes.length === 0 ? null : checkNodes[0].id;

					$.each(checkNodes, function (index, value) {
						if (checkNodes.length === 1) {
							checkNodes[index].isLiHover = true;
							return;
						}
						if (treeNode.checked) {
							checkNodes[index].isLiHover = value === treeNode;
						} else {
							checkNodes[index].isLiHover = index === 0;
						}
					});

					$scope.componentTitleList = checkNodes;
					getComponentList();
					$scope.$apply();

					if (!treeNode.checked) {
						componentToolService.removeLayer(treeNode.id);
					} else {
						$http({
							method: 'GET',
							params: {
								areaCode: $scope.regionCode,
								mainclassids: treeNode.id,
								size: 0
							},
							url: $localStorage.gwUrl + '/component/v1/component/list'
						}).success(function (resp) {
							var data = resp.data.list;
							if (treeNode.id == "10000000000000000000000000000000") {
								//污染源
								componentToolService.loadPollComponents(data, treeNode.id);
							} else {
								var imgPath;
								//污水处理厂
								if (treeNode.id == "80000000000000000000000000000000") {
									imgPath = "img/icon/sewage.png";
								}
								//排污口
								if (treeNode.id == "20000000000000000000000000000000") {
									imgPath = "img/icon/outlet.png";
								}
								//监测断面
								if (treeNode.id == "30000000000000000000000000000000") {
									imgPath = "img/icon/";
								}
								componentToolService.showComponents(data, imgPath, treeNode.id);
							}
						}).error(function (error) {
							console.error(error);
						});
					}
				}

				/**
				 * 指定部件分页查询
				 */
				$scope.getTargetComponentList = function (mainClassId) {
					$scope.mainClassId = mainClassId;
					getComponentList();
				};

				/**
				 * 部件查询分页
				 */
				var getComponentList = function () {
					$http({
						method: 'GET',
						params: {
							name: $scope.conditionVal,
							areaCode: $scope.regionCode,
							mainclassids: $scope.mainClassId,
							size: $scope.paginationConf.itemsPerPage,
							page: $scope.paginationConf.currentPage
						},
						url:$localStorage.gwUrl + '/component/v1/component/list'
					}).success(function (resp) {
						$scope.paginationConf.totalItems = resp.data.total;
						$scope.componentList = resp.data.list;
					}).error(function (error) {
						console.error(error);
					});
				};

				/**
				 * 配置分页基本参数
				 */
				$scope.paginationConf = {
					currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
					itemsPerPage: 10,
					pagesLength: 10,
					perPageOptions: [1, 5, 15, 20, 50, 100],
					onChange: function () {
						//console.log($scope.paginationConf.currentPage);
						$location.search('currentPage', $scope.paginationConf.currentPage);
					}
				};

				/**
				 * 监听 mainClassId 变化
				 */
				$scope.$watch('mainClassId', function (newVal, oldVal) {
					if (newVal === oldVal){
						return;
					}
					$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getComponentList);
				});

				/**
				 * 监听 conditionVal 变化
				 */
				$scope.$watch('conditionVal', function (newVal, oldVal) {
					if (newVal === oldVal){
						return;
					}
					$scope.conditionVal = !newVal ? null : newVal;
					$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getComponentList);
				});

				// 打开部件详情模态框
				$scope.showComponentDetail = function (id) {
					$('#componentDetail').modal('show');
					$http({
						method: 'GET',
						params: {
							id: id
						},
						url: $localStorage.gwUrl + '/component/v1/component/detail'
					}).success(function (resp) {
						console.log(resp);
						$scope.componentDetail = resp.data;
					}).error(function (error) {
						console.error(error);
					});
				};

				$rootScope.$on("evtId", function (evt, evtId) {
					$scope.showComponentDetail(evtId);
				});

				// 定位
				$scope.showComponentInfo = function (list) {
					if (list.longitude != 0.0 || list.latitude != 0.0) {
						if (showComGraphic != null) {
							$scope.map.graphics.remove(showComGraphic);
						}
						if (t != null) {
							clearTimeout(t);
						}
						var point = new w.Point(list.longitude, list.latitude);
						$scope.map.centerAndZoom(point);
						var symbol = new w.PictureMarkerSymbol("img/icon/position.gif", 36, 36);
						showComGraphic = new w.Graphic(point, symbol);
						$scope.map.graphics.add(showComGraphic);
						t = setTimeout($scope.stopShowGraphicGif, 4000);
					}
				};

				$scope.stopShowGraphicGif = function () {
					if (showComGraphic != null) {
						$scope.map.graphics.remove(showComGraphic);
					}
					if (t != null) {
						clearTimeout(t);
					}
				}

			}
		]);

})(window, angular);