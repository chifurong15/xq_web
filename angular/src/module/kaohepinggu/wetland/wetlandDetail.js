(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'wetlandDetail',
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
                function wetlandDetail($localStorage, $scope,
                                              $location, $log, $q, $rootScope, $window,
                                              routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/wetland';
                    // var apiPrefix = "http://10.0.9.133:7032" + '/wetland';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';


                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        var bulletin = globalParam.getter().bulletin || {};
                        $scope.id = localStorage.getItem('id');
                        $scope.status = localStorage.getItem('status');
                        $scope.surTitle = localStorage.getItem('surTitle');

                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/shWetland/userinfo',
                            method: 'get',
                            params:{
                                id: $scope.userInfo.id
                            },
                            callBack: function (res) {
                                $scope.num = res.data;
                                //$scope.num = '';
                            }
                        })
                        getData($scope.id);
                        getAllArea();
                    }

                    //返回
                    $scope.goBack=function(){
                        history.back(-1);
                    }


                    // 数据详情
                    function getData (id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/shWetlandGrade/list',
                            method: 'get',
                            params: {
                                parentid: id
                            },
                            callBack: function (res) {
                                $scope.detailList = res.data.list;
                            }
                        })
                    }

                    //新增得分条目
                    $scope.add = function () {
                        $scope.type = 2 ; //新增
                        $("#myModal").modal('show');
                    }

                    //修改得分条目
                    $scope.edit = function (item) {
                        $scope.type=1;//修改
                        $('#myModal').modal('show');
                        if(item){
                            $scope.area = item.regionid;
                            $scope.qualitygrade = item.qualitygrade;
                            $scope.managegrade = item.managegrade;
                            $scope.ecosystemgrade = item.ecosystemgrade;
                            $scope.protectgrade = item.protectgrade;
                            $scope.totalgrade = item.totalgrade;
                            $scope.selfId = item.id;
                        }

                    }

                    //保存
                    $scope.save = function () {
                        var params = {
                                parentid: $scope.id,
                                regionid: $scope.area,
                                regionname: $scope.regionName,
                                qualitygrade: $scope.qualitygrade,
                                managegrade: $scope.managegrade,
                                ecosystemgrade: $scope.ecosystemgrade,
                                protectgrade: $scope.protectgrade,
                                totalgrade: $scope.totalgrade,
                            };
                        // console.log(params);

                        if($scope.area && $scope.qualitygrade && $scope.managegrade && $scope.ecosystemgrade && $scope.protectgrade && $scope.totalgrade){
                            if($scope.type == 2){ //新增
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/v1/shWetlandGrade/add',
                                    method: 'POST',
                                    params: params,
                                    callBack: function (res) {
                                        if(res.resCode == 1){
                                            layer.msg('新增成功', {time:2000});
                                            getData($scope.id);
                                            clear();//创建成功后清空
                                            $('#myModal').modal('hide');
                                        }else{
                                            layer.msg(res.resMsg, {time:2000});
                                        }
                                    }
                                })

                            }else if($scope.type == 1){ //修改
                                params.id =  $scope.selfId;
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/v1/shWetlandGrade/update',
                                    method: 'PUT',
                                    params: params,
                                    callBack: function (res) {
                                        if(res.resCode == 1){
                                            layer.msg('修改成功', {time:2000});
                                            clear();//创建成功后清空
                                            getData($scope.id);
                                            $('#myModal').modal('hide');
                                        }else{
                                            layer.msg(res.resMsg, {time:2000});
                                        }
                                    }
                                })
                            }


                        }else{
                            layer.alert("请输入必填项", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }


                    }

                    //删除单条得分条目
                    $scope.delete = function (id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/shWetlandGrade/delete',
                            method: 'DELETE',
                            params: {
                                id: id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('删除成功', {time:2000});
                                    getData($scope.id);
                                }
                            }
                        })
                    }



                    //清空表单
                    function clear () {
                        $scope.area='';
                        $scope.score='';
                    }

                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                        clear();
                    }

                    //获取所有的区
                    function getAllArea () {
                        $ajaxhttp.myhttp({
                            url:regionTreeUrl,
                            method:'get',
                            params:{
                                pageNum:-1,
                                pageSize:-1,
                                grade:3
                            },
                            callBack:function (res) {
                                $scope.regionList = res.data.list;
                            }
                        })
                    }

                    $scope.regionListener = function (area) {
                        $scope.regionList.map(function (item) {
                            if(item.areaCode == area){
                                $scope.regionName = item.areaName;
                            }
                        })
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
