var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var riverUrl = modulePrefix + "/v1/river";
var mdMicroUrl = modulePrefix + '/v1/mdMicro';
var chairmanUrl = modulePrefix + '/v1/reachChairMan';
var microaccessoryUrl = modulePrefix + '/v1/microaccessory';
(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'dataEditCtrl', [
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
				'moduleService',
				function dataEditCtrl($localStorage, $scope,$location, $log, $q, $rootScope,globalParam, $window,routeService, $http,moduleService) {

					//获取当前数据
					var id = globalParam.getter();
					var oldName;
					$scope.files = [];

					detail(id);
					getFile();
					function detail(id){
						$http({
							url: moduleService.getServiceUrl() + mdMicroUrl + "/detail?time="+ new Date().getTime(),
							method: 'GET',
							params:{
								id:id
							}
						}).success(function(res) {
							if(res.resCode == 1){
								$scope.micro = res.data;
								$scope.micro.complete = $scope.micro.complete ? $scope.micro.complete.substring(0,10) : '';
								oldName = $scope.micro.name;
							}else{
								layer.msg('数据获取失败' || res.resMsg);
							}
						}).error(function(error) {});
					}

					function getFile(){
						$http({
							url: moduleService.getServiceUrl() + microaccessoryUrl + "/findByMicroid?time="+ new Date().getTime(),
							method: 'GET',
							params:{
								microId:id
							}
						}).success(function(res) {
							if(res.resCode === 1 && res.data.length > 0){
								angular.forEach(res.data,function(item,index,obj){
									$scope.files.push({
										'url':item.accessoryurl,
										'name': item.accessoryname+'.'+item.accessorytype,
										'extension': '.'+item.accessorytype
									})
								});
							}
						}).error(function(error) {});
					}

					//判断名称是否重复
					$scope.repeatName = function(){
						if($scope.micro.name == oldName){
							return;
						}else if(!$scope.micro.name){
							return;
						}
						$http({
							url: moduleService.getServiceUrl() + mdMicroUrl + "/isRepeatName?time="+ new Date().getTime(),
							method: 'get',
							params:{
								name:$scope.micro.name
							}
						}).success(function(res) {
							if(res.resCode == 1 && res.data > 0){
								layer.msg('水体名称重复，请重新输入！');
								$('#microName').focus();
							}
						}).error(function(error) {});
					}

					//初始化级别
					$scope.getControlType = function(){
						$http({
							url: moduleService.getServiceUrl() + mdMicroUrl + "/getGrade?time="+ new Date().getTime(),
							method: 'GET'
						}).success(function(res) {
							$scope.controls = res.data;
						}).error(function(error) {});
					}
					//初始化类型
					$scope.getMicroType = function(){
						$http({
							url: moduleService.getServiceUrl() + mdMicroUrl + "/getType?time="+ new Date().getTime(),
							method: 'GET'
						}).success(function(res) {
							$scope.categorys = res.data;
						}).error(function(error) {});
					}

                    /*所属区域树模态框*/
                    $scope.regionShow = function(){
                        $scope.modalTreeInfo = {'treeType': 'region'};
                        $("#treeModal").modal('show');
                    };
                    /*水系树模态框*/
                    $scope.waterShow = function() {
                        $scope.modalTreeInfo = {'treeType': 'water'};
                        $("#treeModal").modal('show');
                    }
                    /*河流树模态框*/
                    $scope.riverShow = function() {
                        $scope.modalTreeInfo = {'treeType': 'river', 'treeParam':{type: 'A'}};
                        $("#treeModal").modal('show');
                    }
                    $scope.sectionShow = function() {
                        $scope.modalTreeInfo = {'treeType': 'section'};
                        $("#treeModal").modal('show');
                    }
                    $scope.chairmanShow = function() {
                    	if(!$scope.micro.region){
                    		layer.msg('请先选择行政区划');
                    		return;
                    	}
                        $scope.modalTreeInfo = {'treeType': 'chairman','treeParam':{regionId: $scope.micro.region}};
                        $("#treeModal").modal('show');
                    }
                    $scope.$on('zTreeModalClose', function(event,data) {
                        if($scope.modalTreeInfo.treeType == 'region'){
                            $scope.micro.regionName = data.treeNodeName;
                            $scope.micro.region = data.treeNodeId;
                        }else if($scope.modalTreeInfo.treeType == 'water'){
                            $scope.micro.basinname = data.treeNodeName;
                            $scope.micro.basinid = data.treeNodeId;
                        }else if($scope.modalTreeInfo.treeType == 'river'){
                            $scope.micro.rivername = data.treeNodeName;
                            $scope.micro.riverid = data.treeNodeId;
                        }else if($scope.modalTreeInfo.treeType == 'section'){
                            $scope.micro.sectionName = data.treeNodeName;
                            $scope.micro.sectionid = data.treeNodeId;
                        }else if($scope.modalTreeInfo.treeType == 'chairman'){
                            $scope.micro.userName = data.treeNodeName;
                            $scope.micro.userid = data.treeNodeId;
                        }
                    })

					//开始时间
	                var datepicker1 = $('#datetimepicker1').datetimepicker({
	                    format: 'YYYY-MM-DD',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change',function (e) {
                        var result = new moment(e.date).format('YYYY-MM-DD');
                        $scope.micro.complete = result;
                        $scope.$apply();
                    });

					//校验参数
					function checkParams(){
						if($scope.micro.name == null || $scope.micro.name === ''){
							layer.msg("请输入水体名称");
							return false;
						}else if($scope.micro.longitude != null && $scope.micro.longitude !== ''){
							var re = /^-?((1[0-7]?[0-9]?)(([.][0-9]{1,12})?)|(([0-9]?[0-9]?)([.][0-9]{1,12})?)|180(([.][0]{1,12})?))$/;
							if(isNaN($scope.micro.longitude) || !re.test($scope.micro.longitude)){
								layer.msg('请输入正确经度,最大保留12位小数.<br>经度范围：-180.0000~180.0000');
								return false;
							}
						}else if($scope.micro.latitude != null && $scope.micro.latitude !== ''){
							var re = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,12})?)|90(([.][0]{1,12})?))$/;
							if(isNaN($scope.micro.latitude) || !re.test($scope.micro.latitude)){
								layer.msg('请输入正确纬度,最大保留12位小数.<br>纬度范围：-90.0000~90.0000！');
								return false;
							}
						}
						return true;
					}

					// 返回按钮
					$scope.back = function() {
						routeService.route(115, true);
					}

					//更新
					$scope.update = function(){
						if(! checkParams()){
							return;
						}
						var urls = getUrls();
						$http({
							url: moduleService.getServiceUrl() + mdMicroUrl + "/update?time="+ new Date().getTime(),
							method: 'put',
							data:{
								id:id,
								name:$scope.micro.name,
								region:$scope.micro.region,
								control:$scope.micro.control,
								waterCode:$scope.micro.basinid,
								waterName:$scope.micro.basinName,
								riverCode:$scope.micro.riverid,
								riverName:$scope.micro.rivername,
								category:$scope.micro.category,
								userid:$scope.micro.userid,
								sectionid:$scope.micro.sectionid,
								state:$scope.micro.state,
								complete:$scope.micro.complete,
								factor:$scope.micro.factor,
								reason:$scope.micro.reason,
								plan:$scope.micro.plan,
								longitude:$scope.micro.longitude,
								latitude:$scope.micro.latitude,
								urls:urls
							},
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest:function(obj){return $.param(obj)}
						}).success(function(res) {
							if (res.resCode === 1){
                                layer.msg('修改成功！',{shift:-1},function(){
                                	$scope.back();
                                });
                            } else {
                                layer.msg(res.resMsg || '请求错误,请稍后再试');
                            }
						}).error(function(error) {});
					}

					//打开文件上传
					$scope.upload = function(){
						document.getElementById("fileFrom").reset();
						$("#imgBox").modal('show');
					};

					//上传文件
					$scope.fileInput = function(){
						var fd = new FormData();
						var file = $('#input-file').prop('files')[0];
						if(!file){
							layer.msg("请选择文件");
							return ;
						}
						fd.append('file', file);
						$scope._load = layer.load(3, {shade: [0.3, '#000000']});
						$http({
							method: 'POST',
							url: moduleService.getServiceUrl() + mdMicroUrl + '/upload',
							data: fd,
							headers: {'Content-Type': undefined},
							transformRequest: angular.identity
						}).success(function(res) {
                            if (res.resCode === 1) {
                            	$scope.files.push(res.data);
								layer.msg("上传照片成功！");
                            }else {
                                layer.msg("服务器异常，请稍后重试！");
                            }
						}).error(function(error){
							layer.msg("服务器异常，请稍后重试！");
						});
						$("#imgBox").modal('hide');
					};

					function getUrls(){
						var urls = [];
						for (var i = 0; i < $scope.files.length; i++) {
							urls.push($scope.files[i].url)
						}
						return urls;
					}

					$scope.fileDelete = function($event,index){
                        $scope.files.splice(index,1);
                        $event.stopPropagation();
                    }
				}
			]);

})(window, angular);