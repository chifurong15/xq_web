(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'anchaanfangLedgerAddCtrl',
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
                '$ajaxhttp',
                'moduleService',
                'globalParam',
                function anchaanfangLedgerAddCtrl($localStorage, $scope,
                                                  $location, $log, $q, $rootScope, $window,
                                                  routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/template';

                    $scope.init = function () {

                        var bulletin = globalParam.getter().bulletin || {};

                        $scope.id = bulletin.id;
                        console.log(bulletin);

                        // 编辑时获取原数据
                        if (bulletin.id) {
                            $location.search('id', bulletin.id);
                            setData(bulletin);
                        } else if (!bulletin.id && !!getQueryString('id')) {
                            // 根据id查询
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/SurfaceWater/detail',
                                method: 'get',
                                params: {
                                    id: getQueryString('id')
                                },
                                callBack: function (res) {
                                    //console.log('要修改的数据',res.data)
                                    setData(res.data);
                                }
                            })
                        }

                        getDate ();
                    }

                    var id = localStorage.getItem('id');
                    //获取得分条目列表
                    function getScoreList () {
                        $http({
                            url: apiPrefix + '/v1/SurfaceWaterGrade/list?parentid=' + id,
                            method: 'get'
                        }).success(function(data){
                            if(data.resCode == 1){
                                $scope.scoreList = data.data;
                                console.log('得分列表',data.data)
                            }
                        })
                    }



                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime = new moment(c.date).format('YYYY-MM-DD');
                        $scope.$apply();
                    });

                    // 还原编辑数据
                    function setData (data) {
                        $scope.id = data.id;
                        $scope.title = data.title;
                        $scope.searchTime = data.issue;
                        $scope.issuer = data.remark;
                        $scope.author = data.createuser;
                    }

                    //获取当前时间
                    function getDate () {
                        setInterval(function () {
                            var date = new Date(),
                                year = date.getFullYear(),
                                month = date.getMonth() + 1,
                                day = date.getDate(),
                                hour = date.getHours(),
                                min = date.getMinutes(),
                                second = date.getSeconds();

                            $scope.$apply(function () {
                                $scope.currentdate=year + '-' + month  + '-' + day + ' ' +
                                    (hour < 10 ? '0' + hour : hour) + ':' +
                                    (min < 10 ? '0' + min : min) + ':' +
                                    (second < 10 ? '0' + second : second) ;
                            })
                        }, 1000);
                    }

                    //返回
                    $scope.goBack=function(){
                        history.back(-1);
                    }

                    // 保存
                    $scope.submit = function() {
                        var arrCon = [] ;
                        $.each($('input:checkbox:checked'),function(){
                            arrCon.push($(this).val());
                        });

                        console.log('检查内容：',arrCon)
//						if (!$scope.title) {
//                          layer.alert("请输入标题", {
//                              skin: 'my-skin',
//                              closeBtn: 1,
//                              anim: 3
//                          });
//						} else if (!$scope.searchTime) {
//                          layer.alert("请选择期号", {
//                              skin: 'my-skin',
//                              closeBtn: 1,
//                              anim: 3
//                          });
//						} else if (!$scope.author) {
//                          layer.alert("请输入创建人", {
//                              skin: 'my-skin',
//                              closeBtn: 1,
//                              anim: 3
//                          });
//						} else if (!$scope.issuer) {
//                          layer.alert("请输入备注", {
//                              skin: 'my-skin',
//                              closeBtn: 1,
//                              anim: 3
//                          });
//						}

                        // 新增评分管理
                        var params = {
                            title: $scope.title,
                            createtime: $scope.currentdate,
                            issue: $scope.searchTime,
                            createUser: $scope.author,
                            remark: $scope.issuer
                        }
                        if (!$scope.id) {

                        }else{//修改评分报告


                        }
                    }

                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                        clear();
                    }

                    //保存条目
                    $scope.save = function () {
                        if (!$scope.area) {
                            layer.alert("请选择区域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.score) {
                            layer.alert("请输入分数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                        if($scope.type == 2){ //新增
                            console.log($scope.type)

                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/SurfaceWaterGrade/haveDistrict',
                                method: 'get',
                                params: {
                                    parentid: $scope.id,
                                    popedom: $scope.area
                                },
                                callBack: function (res) {
                                    if(res.data == 10){ //可以添加
                                        $ajaxhttp.myhttp({
                                            url: apiPrefix + '/v1/SurfaceWaterGrade/add',
                                            method: 'POST',
                                            params: {
                                                parentid: $scope.id,
                                                popedom: $scope.area,
                                                grade: $scope.score
                                            },
                                            callBack: function (res) {
                                                if(res.resCode == 1){
                                                    layer.msg('新增成功', {time:2000});
                                                    getScoreList();
                                                    clear();//创建成功后清空
                                                    $('#myModal').modal('hide');
                                                }else{
                                                    layer.msg(res.resMsg, {time:2000});
                                                }
                                            }
                                        })
                                    }else{
                                        layer.msg('行政区域不能相同', {time:2000});
                                    }
                                }
                            })

                        }else if($scope.type == 1){ //修改

                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/SurfaceWaterGrade/update',
                                method: 'PUT',
                                params: {
                                    id: $scope.selfId,
                                    popedom: $scope.area,
                                    grade: $scope.score
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功', {time:2000});
                                        clear();//创建成功后清空
                                        getScoreList();
                                        $('#myModal').modal('hide');
                                    }else{
                                        layer.msg(res.resMsg, {time:2000});
                                    }
                                }
                            })
                        }

                    }

                    //取消
                    $scope.back = function () {
                        routeService.route(2, true);
                    }


                    //清空表单
                    var clear = function () {
                        $scope.title = '';
                        $scope.issuer = '';
                        $scope.searchTime = '';
                        $scope.author = '';
                        $scope.area='';
                        $scope.score='';
                    }

                    // 上传文件
                    $scope.uploadFile = function (e) {
                        for (var i = 0; i < e.files.length; i++) {
                            var form = new FormData();
                            var file = e.files[i];
                            $scope.attandName = file.name;
                            form.append('file', file);
                            form.append('fileName', file.name);
                            form.append('parentid', getQueryString('id'));

//							$http({
//				                method: 'POST',
//				                url: apiPrefix + '/v1/SurfaceWaterGrade/upload',
//				                data: form,
//				                headers: {'Content-Type': undefined},
//				                transformRequest: angular.identity
//				            }).success(function (data) {
//				            	if(data.resCode == 1){
//				            		getScoreList()
//				            	}
//				            }).error(function (data) {
//				                 console.log('upload fail');
//				            })

                        }
                    }

                    //获取所有的区
                    function getAllArea () {

                    }

                    // 获取url参数
                    function  getQueryString (params, url) {
                        var url = url || location.href;
                        var search = url.split('?')[1];
                        if (search) {
                            var n = new RegExp("(^|&)" + params + "=([^(&|#)]*)((&|#)|$)", "i"),
                                r = search.match(n);
                            return null != r ? r[2] : null
                        }
                        return null;
                    }
                } ]);
})(window, angular);
