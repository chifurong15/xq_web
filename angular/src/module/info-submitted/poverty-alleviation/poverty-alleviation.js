(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'povertyAlleviation',
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
                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.133:7031' + '/analysis';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    var currentUser = null;
                    $scope.userLevel = null;

                    //区域列表
                    $scope.regionList = [];

                    $scope.startTime = '';
                    $scope.endTime = '';
                    $scope.dataList = [];

                    $scope.regionid = '';
                    $scope.issued = '';
                    $scope.riverpatrolnum = '';
                    $scope.findproblemnum = '';
                    $scope.convokemeetingnum = '';
                    $scope.createuser = '';

                    $scope.init = function () {
                        currentUser = JSON.parse(localStorage.getItem('ngStorage-userLoginInfo')).userInfo;
                        $scope.userLevel = currentUser.userLevel;
                        getList();
                        getRegion();
                        getAuthCode();
                    };

                    $scope.searchData = function () {
                        getList();
                    };

                    //重置
                    $scope.reset = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                    };

                    $scope.add = function () {
                        $('#modal').modal('show')
                    };

                    //导出
                    $scope.download = function () {
                        window.location.href = apiPrefix
                            + '/v1/saHelpVillage/createExcel?startTime='
                            + $scope.startTime
                            + '&endTime='
                            + $scope.endTime
                            + '&grade='
                            + $scope.userLevel
                            + '&regionId='
                            + currentUser.regionId;
                    };

                    $scope.closeModal = function () {
                        $('#modal').modal('hide');
                        clear();
                    };

                    $scope.save = function () {
                        if ($scope.regionid === '') {
                            layer.alert('请选择行政区域');
                        } else if ($scope.issued === '') {
                            layer.alert('请选择日期');
                        } else if ($scope.riverpatrolnum === '') {
                            layer.alert('请填写河长巡河次数');
                        } else if ($scope.findproblemnum === '') {
                            layer.alert('请填写巡河发现并解决问题次数');
                        } else if ($scope.convokemeetingnum === '') {
                            layer.alert('请填写召开会议次数');
                        } else if ($scope.createuser === '') {
                            layer.alert('请填写创建人');
                        } else {
                            submit();
                        }
                    };

                    function submit() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saHelpVillage/add',
                            method: 'post',
                            params: {
                                regionid: $scope.regionid,
                                issued: $scope.issued,
                                riverpatrolnum: $scope.riverpatrolnum,
                                findproblemnum: $scope.findproblemnum,
                                convokemeetingnum: $scope.convokemeetingnum,
                                createuser: $scope.createuser
                            },
                            callBack: function (res) {
                                if (res.resCode === 1) {
                                    getList();
                                    layer.msg('创建成功', {time: 1000});
                                    setTimeout(function () {
                                        $scope.closeModal();
                                    }, 1000)
                                } else {
                                    layer.alert('创建失败，请稍后再试');
                                }
                            }
                        })
                    }

                    function getList() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saHelpVillage/list',
                            method: 'get',
                            params: {
                                grade:$scope.userLevel,
                                regionId:currentUser.regionId,
                                startTime: $scope.startTime,
                                endTime: $scope.endTime,
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage
                            },
                            callBack: function (res) {
                                if (res.resCode === 1) {
                                    $scope.dataList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }

                    function clear() {
                        $scope.regionid = '';
                        $scope.issued = '';
                        $scope.riverpatrolnum = '';
                        $scope.findproblemnum = '';
                        $scope.convokemeetingnum = '';
                        $scope.createuser = '';
                    }

                    //获取行政区域
                    function getRegion() {
                        $ajaxhttp.myhttp({
                            url: regionTreeUrl,
                            method: 'get',
                            params: {
                                pageNum: -1,
                                pageSize: -1,
                                grade: 3
                            },
                            callBack: function (res) {
                                $scope.regionList = res.data.list;
                            }
                        })
                    }
                    
                    function getAuthCode() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saHelpVillage/userinfo',
                            method: 'get',
                            callBack: function (res) {
                                if (res.resCode === 1) {
                                    $scope.authCode=res.data
                                }
                            }
                        })
                    }

                    // 开始时间
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime = result;
                        $scope.$apply();
                    });

                    // 结束时间
                    var endTime = $('#endTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.endTime = result;
                        $scope.$apply();
                    });

                    var modalTime = $('#modalTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.issued = result;
                        $scope.$apply();
                    });

                    //动态设置最小值
                    startTime.on('dp.change', function (e) {
                        endTime.data('DateTimePicker').minDate(e.date);
                    });
                    //动态设置最大值
                    endTime.on('dp.change', function (e) {
                        startTime.data('DateTimePicker').maxDate(e.date);
                    });

                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: 1,
                        itemsPerPage: 10,
                        pagesLength: 10,
                        perPageOptions: [1, 5, 10, 15, 20],
                        onChange: function () {
                            if ($scope.paginationConf.totalItems) {
                                getList();
                            }
                        }
                    };
                }]);
})(window, angular);
