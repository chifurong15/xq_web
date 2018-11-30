(function(window, angular) {
		'use strict';
		angular.module("app").controller(
			'imRegion', [
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
		  function imRegion($scope,$localStorage, $location, $log, $q, $rootScope, globalParam, globaltree,$window, routeService,moduleService, $http) {
			  	var modulePrefix = "/information";
			  	var administrativeUrl = modulePrefix + "/v1/administrativeRegion/";
			  	var dictionaryUrl = modulePrefix + "/v1/dictionary/";

                var time_out = 3500,
                	defaultId = "0",
                	defaultName = "无",
                	regionTree,
                	tree_Id;
                	
                var basicUrl = "/v1/administrativeRegion",
				 	regionTree, 
				 	regionTreeUrl = moduleService.getServiceUrl() + administrativeUrl + "/regionTree";
	              $scope.moveStatus = false;
	              $scope.init = function () {
	            	  // $scope.regionId = $localStorage.userLoginInfo.regionId;
	                  regionTreeList();
	              };
              
                /**
				 *行政区域树配置 
				 */
	            var regionTreeSetting = {
	                data: {
	                    simpleData: {enable: true},
	                    keep: {parent: true}
	                },
	                view: {
	                    nameIsHTML: true,
	                    expandSpeed: 'slow',
	                    dblClickExpand: false,
	                    txtSelectedEnable: false
	                },
	                callback: {
	                    beforeExpand: regionTreeOnExpand,
	                    onClick: regionTreeOnClick
	                }
	            };
	
	            /**
	             * 捕获行政区域节点被点击
	             * @param {Object} event
	             * @param {Object} treeId
	             * @param {Object} treeNode
	             */
	            function regionTreeOnClick(event, treeId, treeNode) {
	                  $scope.moveStatus = false;
	                  //清空搜索框
	                  $scope.areaNameSearch = "";
	                  //更新tree_Id,grade
	                  tree_Id = treeNode.id;
	                  console.log(tree_Id)
	                  $scope.grade = treeNode.grade;
	                  $scope.regionName = treeNode.name;
	                  reGetProducts();
	            }
	
	            /**
	             * 用于捕获行政区域父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作
	             * @param {Object} treeId
	             * @param {Object} treeNode
	             */
	            function regionTreeOnExpand(treeId, treeNode) {
	                console.log('===========regionTreeOnExpand===========');
	                var cnodes = treeNode.children;
	                if (cnodes != null && cnodes.length > 0) {
	                    return;
	                }
	                $http({
	                    method: 'get',
	                    url: regionTreeUrl,
	                    params: {
	                        parentCode: treeNode.id
	                    },
	                }).success(
	                    function (res) {
	                        console.log(res);
	                        regionTree.addNodes(treeNode, res.data, true);
	                    }
	                );
	            }
				
	            /**
	             * 区域树获取
	             */
	            var regionTreeList = function () {
	                $http({
	                    method: 'get',
	                    url: regionTreeUrl,
	                    params: {
	                        regionCode: $scope.regionId
	                    }
	                }).success(function (data) {
	                    console.log(data)
	                    if(data.resCode == 1){
	                    	regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, data.data);
	                    	if (data.data.length === 0) {
	                              $scope.grade = 0;
	                              tree_Id = defaultId;
	                  			  console.log(tree_Id)
	                              $scope.regionName = defaultName;
	                          } else {
	                              $scope.grade = data.data[0].grade;
	                              tree_Id = data.data[0].id;
	                              $scope.regionName = data.data[0].name;
	                              //设置被选择的状态
	                              var treeObj = $.fn.zTree.getZTreeObj("regionTreeContainer");
	                              var node = treeObj.getNodeByParam("id", tree_Id);
	                              treeObj.selectNode(node);
	                          }
	                          reGetProducts();
	                    }else{
	                    }
	                }).error(function () {
	                });
	            };
              
              // 分页
              var reGetProducts = function () {
                  var treeIdTmp;
                  //判断搜索的状态
                  if ($scope.moveStatus) {
                      treeIdTmp = 0;
                  } else {
                      treeIdTmp = tree_Id;
                  }
                  $http({
                      url: moduleService.getServiceUrl()+ administrativeUrl + "list",
                      method: 'GET',
                      params: {
                          areaName: $scope.areaNameSearch,
                          parentCode: treeIdTmp,
                          pageNumber: $scope.paginationConf.currentPage,
                          pageSize: $scope.paginationConf.itemsPerPage
                      }
                  }).success(
					  function (resp) {
						  $scope.returnToList();
						  // 变更分页的总数
						  $scope.paginationConf.totalItems = resp.data.total;
						  // 变更产品条目
						  $scope.moduleList = resp.data.list;
					  }).error(function (error) {
                  });

              };

              //搜索
              $scope.find = function () {
                  $scope.paginationConf.currentPage = 1;
                  $scope.moveStatus = true;
                  reGetProducts()
              };


              // 配置分页基本参数
              $scope.paginationConf = {
                  currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                  itemsPerPage: 10,
                  pagesLength: 5,
                  perPageOptions: [5, 10, 20, 50],
                  onChange: function () {
                      $location.search('currentPage', $scope.paginationConf.currentPage);
                  }
              };
              // 通过$watch currentPage和itemperPage,当他们一变化的时候，重新获取数据条目
              $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);
				
              //删除
              $scope.moduleDelete = function (id, areaCode) {
                  var layerIndex = layer.confirm('删除本条数据将删除它和它的所有子行政区域，确定删除本条数据吗？', {
                      btn: ['确定', '取消']
                      // 按钮
                  }, function () {
                      $http({
                          url: moduleService.getServiceUrl()+ administrativeUrl + "delete",
                          method: "post",
                          params: {
                              id: id
                          }
                      }).success(function success(result) {
                          console.log(result);
                          layer.alert("删除成功！", {time: time_out});
                          reGetProducts();
                          var treeObj = $.fn.zTree.getZTreeObj("regionTreeContainer");
                          var node = treeObj.getNodeByParam("id", areaCode);
                          treeObj.removeNode(node);
                          var pNode = treeObj.getNodeByParam("id", node.pId);
                          if (pNode == null) {
                              $scope.regionName = defaultName;
                              tree_Id = defaultId;
                              $scope.grade = 0;
                          } else {
                              if (pNode.children.length === 0) {
                                  pNode.isParent = false;
                                  treeObj.updateNode(pNode);
                              }
                          }
                      }, function failure(result) {
                          console.log(result);
                      });

                      layer.close(layerIndex);
                  }, function () {

                  });
              };
              //当新增省级时显示
              $scope.greadShow = function () {
                  if ($scope.regionName === "无") {
                      $scope.gradeName = "省级";
                      return true;
                  }
                  return false;
              };

              //返回
              $scope.returnToList = function () {
                  $scope.townDetailHide = true;
                  $scope.townTypeName = "";
                  $(".tab1").show();
                  $(".tab2").hide();
                  $(".tab3").hide();
                  $(".tab4").hide();
              };


              /* 新增行政区域 */
              $scope.addRegion = function () {
                  if ($scope.grade == 5) {
                      layer.alert("您不能在村级下面增加子节点,请选择其他节点", {time: time_out});
                      $scope.returnToList()
                      return;
                  }
                  // 显示城乡分类代码
                  if ($scope.grade == 4) {
                      $scope.townHide = false
                  } else {
                      $scope.townHide = true
                  }
                  $(".tab1").hide();
                  $(".tab2").show();
                  //清空输入框
                  $scope.areaName = '';
                  $scope.regionLongitude = '';
                  $scope.regionLatitude = '';
                  $scope.remark = ''

              };

              /* 新增行政区域 */
              $scope.addSuccess = function (res) {
                  layer.alert("新增成功", {time: time_out});
                  //更新树节点
                  var treeObj = $.fn.zTree.getZTreeObj("regionTreeContainer");
                  var node = treeObj.getNodeByParam("id", tree_Id);
                  var jsonObj = {
                      "id": res.data.areaCode,
                      "name": res.data.areaName
                  };
                  if (node == null) {
                      treeObj.addNodes(null, jsonObj);
                      treeObj.selectNode(treeObj.getNodes()[0]);
                      tree_Id = res.data.areaCode;
                      $scope.grade = res.data.grade;
                      $scope.regionName = res.data.areaName;
                  } else {
                      node.isParent = true;
                      if (node.open) {
                          treeObj.addNodes(node, jsonObj);
                      }
                      treeObj.updateNode(node);
                  }
                  $scope.moveStatus = false;
                  $scope.areaNameSearch = ""
                  reGetProducts();
                  $scope.returnToList();
              };

              $scope.townType_Change = function (town_Type) {
                  $scope.townType_Change_name = town_Type.dictName;
                  $scope.townType_Change_value = town_Type.dictValue;
              };
              //城乡分类代码
              $scope.townType = function () {
                  $http({
                      method: "get",
                      url: moduleService.getServiceUrl()+ dictionaryUrl + '/findByPid',
                      params: {
                          pid: 168
                      }
                  }).success(
                      function (res) {
                          console.log(res);
                          $scope.townTypes = res.data.smDictionaries;
                          console.log($scope.townTypes);
                          $scope.town_Type = $scope.townTypes[0];
                          console.log($scope.town_Type)
                      }
                  );
              };

              //校验新增参数
              function addCheck() {
                  if (!$scope.areaName || !jsname.test($scope.areaName) == null) {
                      layer.alert("请您填入行政区域的名称", {time: time_out});
                      return false;
                  }
                  if ($scope.regionLatitude == null || $scope.regionLatitude === ""
                      || $scope.regionLongitude == null || $scope.regionLongitude === "") {
                      layer.alert("请您填写经纬度", {time: time_out});
                      return false;
                  }
                  if (isNaN($scope.regionLatitude) || isNaN($scope.regionLongitude)) {
                      layer.alert("请您检查经纬度是否为数字", {time: time_out});
                      return false;
                  }
                  if ($scope.regionLongitude < 0 || $scope.regionLongitude > 180
                      || $scope.regionLatitude < 0 || $scope.regionLatitude > 90) {
                      layer.alert("请您检查经度是否在0到180之间，纬度是否在0到90之间", {time: time_out});
                      return false;
                  }
                  if ($scope.remark != null && $scope.remark.length > 300) {
                      layer.alert("您填写的描述名称过长，请小于300字符", {time: time_out});
                      return false;
                  }
                  return true;
              }
              
              $scope.getTownTypeByCode = function (code) {
                  if (code == 111) {
                      $scope.townTypeName = "主城区"
                  } else if (code == 112) {
                      $scope.townTypeName = "城乡结合部"
                  } else if (code == 121) {
                      $scope.townTypeName = "镇中心区"
                  } else if (code == 122) {
                      $scope.townTypeName = "镇乡结合区"
                  } else if (code == 123) {
                      $scope.townTypeName = "特殊区域"
                  } else if (code == 210) {
                      $scope.townTypeName = "乡中心区"
                  } else if (code == 220) {
                      $scope.townTypeName = "村庄"
                  }
              };
              $scope.townHide = true;
              var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
              /* 新增行政区域 */
              $scope.add_data = function () {
                  $scope.areaNameSearch = "";
                  if ($scope.townType_Change_value == null) {
                      $scope.townType_Change_value = 111;
                  }
                  if(!addCheck()){
                    return;
                  }
                  //说明当前添加的是第5级，这个时候需要城乡分类代码
                  if ($scope.grade === 4) {
                      $http({
                          method: "post",
                          url: moduleService.getServiceUrl()+ administrativeUrl + 'add',
                          params: {
                              areaName: $scope.areaName,
                              pCode: tree_Id,
                              latitude: $scope.regionLatitude,
                              longitude: $scope.regionLongitude,
                              remark: $scope.remark,
                              category: $scope.townType_Change_value
                          }
                      }).success(
                          function (res) {
                              $scope.add_result(res)
                          }
                      );
                  } else {
                      $http({
                          method: "post",
                          url: moduleService.getServiceUrl()+ administrativeUrl + 'add',
                          params: {
                              areaName: $scope.areaName,
                              pCode: tree_Id,
                              latitude: $scope.regionLatitude,
                              longitude: $scope.regionLongitude,
                              remark: $scope.remark
                          }
                      }).success(
                          function (res) {
                              $scope.add_result(res)
                          }
                      );
                  }

              };


              $scope.add_result = function (res) {
                  if (res.resCode === 1) {
                      $scope.addSuccess(res)
                  } else if (res.resCode === 2) {
                      layer.alert("行政区域名字重复请您检查", {time: time_out});
                  } else if (res.resCode === 3) {
                      layer.alert("对不起，行政区域新增失败请添加行政区域等级（例如：省，市，县）后重新尝试", {time: 10000});
                  }
              };

              /* 查看行政区域详情 */
              var detail_datas;
              $scope.townDetailHide = true;
              $scope.regionDetail = function (model) {

                  $(".tab1").hide();
                  $(".tab2").hide();
                  $(".tab3").show();
                  $(".tab4").hide();
                  if (model.grade == 5) {
                      $scope.townDetailHide = false;
                      $scope.getTownTypeByCode(model.category)
                  }
                  $scope.areaNameDetail = model.areaName;
                  $scope.areaCodeDetail = model.areaCode;
                  $scope.gradeDetail = model.grade;
                  $scope.latitudeDetail = model.latitude;
                  $scope.longitudeDetail = model.longitude;
                  $scope.createTimeDetail = model.createTime;
                  $scope.fullNameDetail = model.fullName;
                  $scope.remarkDetail = model.remark

              };


              /* 修改行政区域 */
              $scope.regionEdit = function (model) {
                  $(".tab1").hide();
                  $(".tab2").hide();
                  $(".tab3").hide();
                  $(".tab4").show();
                  if (model.grade == 5) {
                      $scope.townDetailHide = false;
                      $scope.getTownTypeByCode(model.category)
                  }
                  $scope.updateId = model.id;
                  $scope.areaNameUpdate = model.areaName;
                  $scope.areaCodeUpdate = model.areaCode;
                  $scope.latitudeUpdate = model.latitude;
                  $scope.gradeUpdate = model.grade;
                  $scope.parentCodeUpdate = model.parentCode;
                  $scope.longitudeUpdate = model.longitude;
                  $scope.remarkUpdate = model.remark
              };
              /* 修改行政区域 */
              $scope.update_data = function () {
                  if (!$scope.areaNameUpdate
                      || !jsname.test($scope.areaNameUpdate) == null) {
                      layer.alert("请您填入行政区域的名称", {time: time_out});
                      return;
                  }
                  if ($scope.latitudeUpdate == null || $scope.latitudeUpdate === ""
                      || $scope.longitudeUpdate == null || $scope.longitudeUpdate === "") {
                      layer.alert("请您填写经纬度", {time: time_out});
                      return;
                  }
                  else if (isNaN($scope.latitudeUpdate)
                      || isNaN($scope.longitudeUpdate)) {
                      layer.alert("请您检查经纬度是否为数字", {time: time_out});
                      return;
                  }
                  else if ($scope.longitudeUpdate < 0 || $scope.longitudeUpdate > 180
                      || $scope.latitudeUpdate < 0 || $scope.latitudeUpdate > 90) {
                      layer.alert("请您检查经度是否在0到180之间，纬度是否在0到90之间", {time: time_out});
                      return;
                  }
                  else if ($scope.remarkUpdate != null && $scope.remarkUpdate.length > 300) {
                      layer.alert("您填写的描述名称过长，请小于300字符", {time: time_out});
                      return;
                  }

                  $http({
                      url: moduleService.getServiceUrl()+ administrativeUrl + "update",
                      method: "post",
                      params: {
                          id: $scope.updateId,
                          areaName: $scope.areaNameUpdate,
                          latitude: $scope.latitudeUpdate,
                          longitude: $scope.longitudeUpdate,
                          pCode: $scope.parentCodeUpdate,
                          remark: $scope.remarkUpdate
                      }
                  }).success(
                      function success(res) {
                          if (res.resCode === 2) {
                              layer.alert("行政区域名字重复请您检查！", {time: time_out});
                              return;
                          }
                          reGetProducts();
                          layer.alert("成功更新一条数据！", {time: time_out});
                          //更新树节点
                          var treeObj = $.fn.zTree.getZTreeObj("regionTreeContainer");
                          var node = treeObj.getNodeByParam("id", $scope.areaCodeUpdate);
                          node.name = $scope.areaNameUpdate;
                          treeObj.updateNode(node);
                      });
              };

              $scope.move = function (id, flag, areaCode) {
                  $http({
                      method: "POST",
                      url: moduleService.getServiceUrl()+ administrativeUrl + "changeOrder",
                      dataType: 'json',
                      params: {
                          id: id,
                          flag: flag
                      }
                  }).success(function (res) {
                          //得到右侧表格的列表
                          reGetProducts();
                          var treeObj = $.fn.zTree.getZTreeObj("regionTreeContainer");
                          var node = treeObj.getNodeByParam("id", tree_Id);
                          if (!node.open) {
                              return;
                          }
                          //得到子节点
                          var childList = node.children;
                          if (node.open) {
                              for (var i = 0; i < childList.length; i++) {
                                  if (childList[i].id == areaCode) {
                                      if (i == 0 && flag == 1) {
                                          return;
                                      }
                                      //最后一个元素不能下移
                                      if (i == childList.length - 1 && flag == 0) {
                                          return;
                                      }
                                      //交换子节点元素
                                      if (flag == 1) {
                                          treeObj.moveNode(childList[i - 1], childList[i], "prev");
                                          break
                                      } else {
                                          treeObj.moveNode(childList[i + 1], childList[i], "next");
                                          console.log(123)
                                          break
                                      }
                                  }
                              }
                          }
                      }
                  ).error(function () {
                  });
					 
					 
				}
					
			}
		]);

})(window, angular);