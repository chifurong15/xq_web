(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'channelSectionList',
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
                function channelSectionList($localStorage, $scope,
                                       $location, $log, $q, $rootScope, $window,
                                       routeService, $http, $ajaxhttp, moduleService , globalParam) {


                    //var apiPrefix = moduleService.getServiceUrl() + '/statistic';

                    // var apiPrefix = 'http://10.0.9.133:7024' + '/statistic';
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
                    $scope.init = function () {

                        //是否展示选择河道列表
                        $scope.showList = false;
                        $scope.showList1 = false;

                        $scope.isUpdate = false;//默认新增可输入断面编号

                        getList ();
                        getRegion ();


                    }

                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/mdSection/list',
                            method: 'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                region: $scope.regionName,
                                code: $scope.code,
                                name:$scope.name,
                                river:$scope.river,
                                descirption:$scope.descirption
                            },
                            callBack: function (res) {
                                $scope.moduleList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    // 搜索
                    $scope.search = function () {
                        getList();
                    };

                    $scope.reset = function () {
                        $scope.regionName = '';
                        $scope.code = '';
                        $scope.name = '';
                        $scope.river = '';
                        $scope.descirption = '';
                    }

                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                        clear();
                    }



                    //新增河道断面窗口
                    $scope.getRiverAdd = function (id,detailId) {
                        $('#myModal').modal('show');
                        $scope.id = id ;
                        $scope.detailId = detailId ;
                        if( $scope.id == 2 && detailId){
                            $scope.isUpdate = true;
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/mdSection/detail',
                                method: 'get',
                                params: {
                                    id:detailId
                                },
                                callBack: function (res) {
                                    if (res.resCode == 1) {
                                        console.log(res.data);
                                        $scope.sectionCode = res.data.code;
                                        $scope.sectionName = res.data.name;
                                        $scope.region = res.data.countyid;
                                        $scope.longitude = res.data.longitude;
                                        $scope.river1 = res.data.rivername;
                                        $scope.category = res.data.category;
                                        $scope.targetquality = res.data.targetquality;
                                        $scope.desc = res.data.descirption;
                                        $scope.sort = res.data.sort;
                                        $scope.chairman = res.data.chairman;
                                    }
                                }
                            })

                        }
                    }

                    //保存新增
                    $scope.addSave = function () {
                        var params = {
                            code:$scope.sectionCode,
                            name:$scope.sectionName,
                            countyid:$scope.region,
                            longitude:$scope.longitude,
                            rivername:$scope.river1,
                            category:$scope.category,
                            targetquality:$scope.targetquality,
                            descirption:$scope.desc,
                            sort:$scope.sort,
                            chairman:$scope.chairman,
                            createuserid:$scope.userInfo.id
                        }
                        // console.log(params);
                        if($scope.id == 1){//新增
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/mdSection/add',
                                method: 'post',
                                params: params,
                                callBack: function (res) {
                                    if (res.resCode == 1) {
                                        layer.msg('新增成功！', {time:1000});
                                        getList();
                                        $('#myModal').modal('hide');
                                        clear();
                                    }
                                }
                            })
                        }else{//修改
                            params.id = $scope.detailId
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/mdSection/update',
                                method: 'put',
                                params: params,
                                callBack: function (res) {
                                    if (res.resCode == 1) {
                                        layer.msg('修改成功！', {time:1000});
                                        getList();
                                        $('#myModal').modal('hide');
                                        clear();
                                    }
                                }
                            })
                        }
                    }


                    function clear (){
                        $scope.sectionCode = '';
                        $scope.sectionName = '';
                        $scope.region = '';
                        $scope.longitude = '';
                        $scope.river1 = '';
                        $scope.category = '';
                        $scope.targetquality = '';
                        $scope.desc = '';
                        $scope.sort = '';
                        $scope.chairman = '';
                    }



                    //下载导出模板
                    $scope.downTemplate = function (){
                        window.open($scope.fileUrl + '/uhope/infomation/20190522175144992_河道断面表(1)(3).xls')
                    }


                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function (id) {
                        if(id == 1){
                            $('#coverModal').modal('show')
                        }else{
                            $('#coverModal').modal('hide')
                        }
                    }


                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function () {
                        $('#coverModal').modal('hide');
                        var formFile = new FormData();

                        var fileObj = document.querySelector('input[type=file]').files[0];
                        formFile.append("file", fileObj); //加入文件对象
                        formFile.append("userId", $scope.userInfo.id);

                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/mdSection/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                layer.msg("导入成功");
                                $scope.assessory.push(res.data[0]);
                                $('#problemFile').fileinput('clear');

                            } else {
                                layer.msg(res.resMsg);
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }


                    $scope.delete = function (id) {
                        if(id){//删除单条记录
                            var layerIndex = layer.confirm('确定删除本条数据吗？', {
                                btn: ['确定', '取消']
                            }, function () {
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/v1/mdSection/delete',
                                    method: 'DELETE',
                                    params: {
                                        id: id
                                    },
                                    callBack: function (res) {
                                        if(res.resCode == 1) {
                                            getList();
                                            layer.msg('删除成功！', {time:1000});
                                        } else {
                                            layer.msg(res.resMsg,{time:1000});
                                        }
                                    }
                                })
                                layer.close(layerIndex);
                            }, function () {

                            });
                        }else{//清空列表
                            var layerIndex = layer.confirm('确定全部删除吗？', {
                                btn: ['确定', '取消']
                            }, function () {
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/v1/mdSection/deleteAll',
                                    method: 'DELETE',
                                    params: {
                                        id: id
                                    },
                                    callBack: function (res) {
                                        if(res.resCode == 1) {
                                            getList();
                                            layer.msg('删除成功！', {time:1000});
                                        } else {
                                            layer.msg(res.resMsg,{time:1000});
                                        }
                                    }
                                })
                                layer.close(layerIndex);
                            }, function () {

                            });
                        }
                    }


                    //获取河道
                    $scope.getRiver1 = function (river) {
                        if (river !== '') {
                            $scope.showList1 = true;
                            var params = {
                                river: river
                            };
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/reachAssess/listRiver',
                                method: 'get',
                                params: params,
                                callBack: function (res) {
                                    if (res.data) {
                                        if (res.data.length > 10) {
                                            res.data.length = 10;
                                        }
                                        $scope.riverList1 = res.data;
                                    }
                                }
                            })
                        }
                    }

                    $scope.selectRiverName1 = function (name) {
                        if (name) {
                            $scope.river1 = name;
                            $scope.showList1 = false;
                        }
                    }

                    //获取行政区域
                    function getRegion (){
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


                    //获取河道
                    $scope.getRiver = function (river) {
                        if (river !== '') {
                            $scope.showList = true;
                            var params = {
                                river: river
                            };
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/reachAssess/listRiver',
                                method: 'get',
                                params: params,
                                callBack: function (res) {
                                    if (res.data) {
                                        if (res.data.length > 10) {
                                            res.data.length = 10;
                                        }
                                        $scope.riverList = res.data;
                                    }
                                }
                            })
                        }
                    }

                    $scope.selectRiverName = function (name) {
                        if (name) {
                            $scope.river = name;
                            $scope.showList = false;
                        }
                    }


                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                        itemsPerPage: 10,
                        pagesLength: 10,
                        perPageOptions: [1, 2, 3, 4, 5, 10],
                        onChange: function () {
                            //console.log($scope.paginationConf.currentPage);
                            $location.search('currentPage', $scope.paginationConf.currentPage);
                        }
                    };
                    // 当他们一变化的时候，重新获取数据条目
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getList);
                } ]);
})(window, angular);
