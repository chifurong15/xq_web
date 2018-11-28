(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'anchaReportListCtrl',
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
                function anchaReportListCtrl($localStorage, $scope,
                                       $location, $log, $q, $rootScope, $window,
                                       routeService, $http, $ajaxhttp, moduleService , globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/ancha';
                    //var apiPrefix = 'http://10.0.9.133:7021' + '/ancha';
                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        getStatus ();
                        getRegion ();
                        //$scope.num = '2'; // 05区河长办  02市河长办
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/AnzhaInvestigations/userinfo1',
							method: 'get',
                            params:{id:$scope.userInfo.id},
							callBack: function (res) {
							    $scope.qu = res.data;
								if(res.data == 5){
                                    $scope.num = 0;
                                }else if(res.data == 2){
								    $scope.permission = 2;
                                }else {
								    $scope.num = '';
                                }
								getList();
							}
						})

                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false
                        });
                    }

                    $('#J-searchTime1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.deadlinetime = new moment(c.date).format('YYYY-MM-DD');
                        $scope.$apply();
                    });


                    // 获取数据列表
                    function getList () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/AnzhaBulletin/list',
							method: 'get',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
								month: $scope.searchTime,
								status: $scope.status,
								num: $scope.num,
								title:$scope.name,
                                objectid:$scope.userInfo.id,
                                regionid:$scope.qu == 5 ? $scope.userInfo.regionId : ''
							},
							callBack: function (res) {
							    if(res.resCode == 1){
                                    $scope.reportList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
							}
						})
                    }

                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime = new moment(c.date).format('YYYY-MM');
                        $scope.$apply();
                    });

                    //修改待通报通报内容
                    $scope.edit = function (item) {
                        $('#myModal').modal('show');
                        $scope.editId = item.id;
                        $scope.content = item.content;
                        $scope.title = item.title;
                        $scope.deadlinetime = item.deadlinetime;
                        // $scope.region = item.feedbackareaname;
                        $('.selectpicker').selectpicker('val',item.feedbackareaname.split(','));
                        $('.selectpicker').selectpicker('refresh');

                    }
                    // 获取所有区
                    function getRegion() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaInvestigations/districtlist',
                            method: 'get',
                            callBack: function (res) {
                                $scope.regionList = res.data;
                                $scope.regionNameList = [];
                                //$scope.regionIdList = [];
                                res.data.map(function (item,index){
                                    $scope.regionNameList.push(item.regionName);
                                    //$scope.regionIdList.push(item.regionId);
                                })
                                var select = $("#slpk");
                                for (var i = 0; i <res.data.length; i++) {
                                    select.append("<option value='"+res.data[i].regionName+"'>"
                                        + res.data[i].regionName + "</option>");
                                }
                                $('.selectpicker').selectpicker('val', '');
                                $('.selectpicker').selectpicker('refresh');
                            }
                        })
                    }

                    $scope.getChangeRegion = function (region){
                        // console.log('区',region);
                        $scope.regionIdList = [];
                        region.map(function (item){
                            $scope.regionList.map(function(val,index){
                                if(item == val.regionName){
                                    $scope.regionIdList.push(val.regionId)
                                }
                            })
                        })
                        // console.log('区id',$scope.regionIdList)

                    }

                    //保存修改通报信息
                    $scope.submit = function (){

                        var params = {
                            id:$scope.editId,
                            title:$scope.title,
                            deadlinetime:$scope.deadlinetime,
                            feedbackareaid:$scope.regionIdList ? $scope.regionIdList.join(',') : '',
                            feedbackareaname:$scope.region ? $scope.region.join(',') : '',
                            assessory:$scope.assessory,
                            content:$scope.content,
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaBulletin/update',
                            method: 'put',
                            params:params,
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('修改成功', {time:2000});
                                    $('#myModal').modal('hide');
                                    getList();
                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })
                    }

                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function () {
                        $('#coverModal').modal('show');
                    }

                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function () {

                        $('#coverModal').modal('hide');

                        var formFile = new FormData();
                        var fileObj = document.querySelector('input[type=file]').files[0];

                        formFile.append("files", fileObj); //加入文件对象
                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/AnzhaReport/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                $scope.assessory = res.data[0];
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }

                    //获取通报状态
                    function getStatus () {
                        $scope.statusList = [
                            {
                                id: 0,
                                status: '待通报'
                            },
                            {
                                id: 1,
                                status: '已下发'
                            },
                            {
                                id: 2,
                                status: '已反馈'
                            },
                            {
                                id: 3,
                                status: '未按期'
                            }
                        ]
                    }

                    // 搜索
                    $scope.search = function () {
                        getList();
                    };

                    //重置
                    $scope.reset = function () {
                        $scope.status = '';
                        $scope.searchTime = '';
                        $scope.name = '';
                    }

                    // 新建
                    $scope.add = function () {
                        globalParam.setter({
                            bulletin: {}
                        })
                        routeService.route('2-6-1', false);
                    }

                    // 查看   反馈
                    $scope.view = function (id , schemeid ,isView) {
                        localStorage.setItem('id',id);
                        localStorage.setItem('schemeid',schemeid);
                        localStorage.setItem('isView',isView);
                        routeService.route('2-6-2', false);
                    }


                    //点击计划方案
                    $scope.viewReport = function () {
                        routeService.route('2-1', true);
                    }


                    //下发并通报
                    $scope.report = function (id){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaBulletin/updatestatus',
                            method: 'put',
                            params: {
                                id: id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('下发成功');
                                    getList();
                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })
                    }

                    //返回
                    $scope.goBack=function(){
                        history.back(-1);
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
