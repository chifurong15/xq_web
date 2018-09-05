(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'roleController',
        [
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
            function roleController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope,globalParam, $window, routeService, $http) {
            $scope.reloadRoute = function () {
                $window.location.reload();
            };
      //分页
        var reGetProducts = function(){
            // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
            $http({
                url: $localStorage.serviceUrl + '/smRole/queryRoleList',
                method:'get',
                params:{pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage,status:-1},
            }).success(function(resp){
                // 变更分页的总数
                $scope.paginationConf.totalItems = resp.data.totalNum;
    //            // 变更产品条目
                $scope.roleList = resp.data.records;
            }).error(function(error){
            });
        };

        // 配置分页基本参数
        $scope.paginationConf = {
                currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                itemsPerPage: 10,
                pagesLength:5,
                perPageOptions: [1, 2, 3, 4, 5,10],
                onChange: function(){
                    console.log($scope.paginationConf.currentPage);
                    $location.search('currentPage', $scope.paginationConf.currentPage);
                }
        };

        // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);
        
        
        var datas;
        $scope.revise = function (id) {
            // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
            $http({    
                method: "get",    
                url:  $localStorage.serviceUrl + "/smRole/getById",
                params: {id:id}
                }).success(
                    function (res) {
                    datas = res;
                    globalParam.setter(datas)
                    routeService.route(803, false);
                 }      
            );
        };
        var status;
        $scope.cancel = function (id) {
            // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
            $http({
                method: "get",    
                url:  $localStorage.serviceUrl + "/smRole/getById",    
                params: {id:id}
                }).success(
                    function (res) {
                        status = res.data.status;
                        if(status == 1){
                            status = 2
                        }else{
                            status = 1
                        }
                        $http({
                            method: "put",    
                            url:  $localStorage.serviceUrl + "/smRole/updateById",    
                            params: {id:id,status:status}
                            }).success(
                                function (){
                                    reGetProducts();
                                }       
                            );
                        }       
                );
        };



        $scope.deletes = function(id) {
            var layerIndex = layer.confirm('确定删除本条数据吗？', {
                btn : [ '确定', '取消' ]
            // 按钮
            }, function() {
                $http({
                    url : $localStorage.serviceUrl + "/smRole/deleteById",
                    method: "delete",
                    params : {id:id}
                }).success(function success(result) {
                    reGetProducts();
                    alert("删除成功")
                }, function failure(result) {
                    alert("删除失败")
                });
                layer.close(layerIndex);
            }, function() {

            });
        };



        // $scope.deletes = function (id) {
        //     // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
        //     $http({    
        //         method: "delete",    
        //         url:  $localStorage.serviceUrl + "/smRole/deleteById",    
        //         params: {id:id}
        //         }).success(
        //             function () {
        //                 alert("删除成功")
        //                 $scope.reloadRoute();
        //             }       
        //         );
        // };
        $scope.addRole = function () {
            //参数1 ：为 对应 config.json文件的 menus或pages里面的seqId , 
            //参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
            routeService.route(802, false);
        };
        $scope.roleType = function () {
            // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
            $http({    
                method: "GET",    
                url:  $localStorage.serviceUrl + "/smRole/queryRoleTypeList",
                }).success(
                    function (res) {
                    $scope.roles = res.data;
                }
            );
        }
        $scope.roleTypeFind = function (x) {
            // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
            $http({
                method: "GET",
                url:  $localStorage.serviceUrl + "/smRole/queryRoleList",
                params:{typeId:x.id,status:-1},
                }).success(
                    function (res) {
                    $scope.paginationConf.totalItems = res.data.totalNum;
                    $scope.roleList = res.data.records;
                }
            );
        }
        $scope.find = function () {
            // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
            $http({
                method: "GET",
                url:   $localStorage.serviceUrl + "/smRole/queryRoleList",
                params:{name:$scope.name,pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage},
                }).success(
                    function (res) {
                    $scope.paginationConf.totalItems = res.data.totalNum;
                    $scope.roleList = res.data.records;
                }
            );
        }
     }]);
})(window, angular);

