(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'patrolProblemMgtCtrl', [
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
            '$ajaxhttp',
            'moduleService',
            function patrolProblemMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {

                var apiPrefix = moduleService.getServiceUrl() + '/patrol';
                // var apiPrefix = 'http://10.0.9.110:7027' + '/patrol';

                var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';


                /**
                 * ==============================================
                 * @name  patrolDetailMgtCtrl
                 * @author  | 2018/10/25
                 * @version
                 * @desc  巡查详情
                 * ==============================================
                 */
                $scope.init = function(){

                    $('#river').attr('disabled',true)

                    getRegion ();

                    getType()


                    /**
                     * 获取列表
                     */
                    getModuleList ();

                    getUnit();

                }

                //返回
                $scope.goBack=function(){
                    routeService.route('3-6',true)
                }

                //搜索
                $scope.getMdSearch = function () {
                    getModuleList();
                }


                //监听区域
                $scope.getChangeRegion = function (r) {
                    if(r){
                        $('#river').attr('disabled',false)
                    }else{
                        $('#river').attr('disabled',true)
                    }
                    getRiver(r);
                    $scope.reachName = '';
                }

                //查询河湖
                function getRiver(r) {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/selectReach',
                        method: 'get',
                        params:{
                            regionId:r
                        },
                        callBack: function (res) {
                            if(res.data){
                                $scope.riverList = res.data;
                            }
                        }
                    })
                }


                //重置
                $scope.getReSet = function () {
                    $scope.reachName = '';
                    $scope.regionName = '';
                    $scope.beginTime = '';
                    $scope.endTime = '';
                    $scope.typeName = '';
                    $scope.unitName = '';
                    $('#river').attr('disabled',true)
                }

                //获取所属区域
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

                //查询考核单位
                function getUnit() {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrolRecord/selectUnit',
                        method: 'get',
                        callBack: function (res) {
                            if(res.data){
                                $scope.unitList = res.data;
                            }
                        }
                    })
                }

                //查询问题类型
                function getType() {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/selectProblem',
                        method: 'get',
                        callBack: function (res) {
                            if(res.data){
                                $scope.typeList = res.data;
                            }
                        }
                    })
                }


                //获取问题列表
                function getModuleList () {

                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/selectList',
                        method: 'get',
                        params: {
                            recordId:localStorage.getItem('listId'),
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            riverName: $scope.reachName,
                            unit:$scope.unitName,
                            riverQuestion:$scope.typeName,
                            region:$scope.regionName,
                            patrolDateStart:$scope.beginTime,
                            patrolDateEnd:$scope.endTime,
                        },
                        callBack: function (res) {
                            $scope.moduleList = res.data.list;
                            $scope.paginationConf.totalItems = res.data.total;
                        }
                    })

                }


                /**
                 * 查看巡查问题详情
                 */
                $scope.getHydrologicDetail = function(id){
                    localStorage.setItem('detailId',id);
                    routeService.route('3-6-1', false);
                };



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
                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getModuleList);

                /**
                 * 时间选择
                 */

                var datepicker1 = $('#beginTime').datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (e) {
                    var result = new moment(e.date).format('YYYY-MM-DD');
                    $scope.beginTime = result;
                    $scope.$apply();
                });

                var datepicker2 = $('#endTime').datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (e) {
                    var result = new moment(e.date).format('YYYY-MM-DD');
                    $scope.endTime= result;
                    $scope.$apply();
                });

                /**
                 * 动态设置最小值
                 */
                datepicker1.on('dp.change', function (e) {
                    datepicker2.data('DateTimePicker').minDate(e.date);
                });
                /**
                 * 动态设置最大值
                 */
                datepicker2.on('dp.change', function (e) {
                    datepicker1.data('DateTimePicker').maxDate(e.date);
                });



            }
        ]);

})(window, angular)