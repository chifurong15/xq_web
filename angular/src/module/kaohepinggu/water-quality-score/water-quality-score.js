(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'waterQualityScore',
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
                function ($localStorage, $scope,
                                         $location, $log, $q, $rootScope, $window,
                                         routeService, $http, $ajaxhttp, moduleService , globalParam) {


                    // var apiPrefix = "http://10.0.9.133:7004" + '/quality';
                    var apiPrefix = moduleService.getServiceUrl() + '/quality';
                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {

                        getDate ();
                        getUserInfo ();
                    }
                    function getUserInfo () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/userinfo1',
                            method: 'get',
                            params:{
                                id: $scope.userInfo.id
                            },
                            callBack: function (res) {
                                $scope.num = res.data;
                                getList();
                            }
                        })
                    }


                    $scope.edit=function (id,status) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/update',
                            method: 'put',
                            params: {
                                id:id,
                                state:1
                            },
                            callBack: function (res) {
                                if(res.resCode===1){
                                    layer.msg('操作成功');
                                    getList();
                                }
                            }
                        })
                    };
                    // 获取数据列表
                    function getList () {
                        var params = {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            issue: $scope.searchTime,
                            status: $scope.type,
                            createUser:$scope.createuser,
                            column:$scope.column ? $scope.column : '',
                            order:$scope.order ? $scope.order : ''
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/scoreList',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.waterQualityList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })

                    }

                    // 表格排序
                    $scope.sort = function (id , name) {
                        $scope.column = name;
                        $scope.order = id;
                        getList ();
                    }

                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime = new moment(c.date).format('YYYY-MM');
                        $scope.$apply();
                    });

                    $('#J-searchTime1').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        // $scope.searchTime1 = result;
                        $("#J-searchTime1").find("input").val(result)
                        $scope.$apply();
                    });

                    //返回
                    $scope.goBack=function(){
                        history.back(-1);
                    }

                    // 搜索
                    $scope.search = function () {
                        getList();
                    };

                    //重置搜索条件
                    $scope.reset = function () {
                        $scope.searchTime = '';
                        $scope.type = '';
                        $scope.createuser = '';
                    }

                    // 新建
                    $scope.add = function () {
                        $('#myModal').modal('show');
                        //routeService.route('3-2-2', false);
                    }

                    // 保存
                    $scope.save = function() {

                        // 新增水质管理
                        var params = {
                            title: $scope.title,
                            createtime: $scope.currentdate,
                            issue: $("#J-searchTime1").find("input").val(),
                            createUser: $scope.author,
                            remark: $scope.issuer
                        }
                        // console.log(params);
                        if($scope.title && $scope.author && $scope.issuer && $("#J-searchTime1").find("input").val()){
                            if (!$scope.id) {
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/v1/WaterQuality/add',
                                    method: 'POST',
                                    params: params,
                                    callBack: function (res) {
                                        if(res.resCode == 1){
                                            $scope.newid = res.data.id;
                                            $scope.pid = res.data.id;
                                            layer.msg('新建成功', {time:2000});
                                            clear();//创建成功后清空
                                            getList();
                                            $('#myModal').modal('hide');
                                        }else{
                                            layer.msg(res.resMsg, {time:2000});
                                        }
                                    }
                                })

                            }else{//修改水质报告
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/v1/WaterQuality/updatelist',
                                    method: 'PUT',
                                    params: {
                                        id: $scope.id,
                                        title: $scope.title,
                                        createtime: $scope.currentdate,
                                        issue: $("#J-searchTime1").find("input").val(),
                                        createUser: $scope.author,
                                        remark: $scope.issuer
                                    },
                                    callBack: function (res) {
                                        if(res.resCode == 1){
                                            layer.msg('修改成功', {time:2000});
                                            clear();//创建成功后清空
                                            $('#myModal').modal('hide');
                                            getList();
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
                    };


                    // 查看
                    $scope.view = function (id,status) {
                        localStorage.setItem('id',id)
                        localStorage.setItem('status',status)
                        routeService.route('3-16-5', true);
                    };

                    $scope.delete=function(id){
                        layer.confirm('确定要删除吗？',{title:'删除'},function () {
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/WaterQuality/delete?id=' + id,
                                method: 'delete',
                                callBack: function (res) {
                                    if(res.resCode===1){
                                        layer.msg('删除成功');
                                        getList();
                                    }
                                }
                            })
                        })
                    };

                    // 上报
                    $scope.report = function (id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/update',
                            method: 'PUT',
                            params: {
                                id: id ,
                                status:0
                            },
                            callBack: function (res) {
                                if(res.resCode === 1){
                                    getList();
                                }
                            }
                        })
                    };

                    // 退回
                    $scope.sendBack = function (id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/update',
                            method: 'PUT',
                            params: {
                                id: id ,
                                status:1
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    getList();
                                }
                            }
                        })
                    };
                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                        clear();
                    };

                    //清空表单
                    var clear = function () {
                        $scope.title = '';
                        $scope.issuer = '';
                        $scope.searchTime1 = '';
                        $scope.author = '';
                    };
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
