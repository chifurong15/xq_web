(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'superviseEvaluateMgtCtrl', [
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
            function superviseEvaluateMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {

                var apiPrefix = moduleService.getServiceUrl() + '/supervise';
                //var apiPrefix = 'http://10.0.9.116:7023' + '/supervise';


                /**
                 * ==============================================
                 * @name  superviseEvaluateMgtCtrl
                 * @author  | 2018/10/25
                 * @version
                 * @desc  社会监督评价
                 * ==============================================
                 */
                $scope.init = function () {
                    /**
                     * 初始化行政区划树
                     */
                    regionTreeList();

                    /**
                     * 获取列表数据
                     */
                    getModuleList();

                    /**
                     * 获取满意度类型
                     */
                    getAssessList();

                    $scope.showInput = false;

                }

                var jsname = /^[a-zA-Z0-9_-]{4,16}$/,
                    regionTree,
                    regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                /**
                 * 初始化行政区划树
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
                    console.log(treeNode);
                    $scope.regionId = treeNode.id;
                    $scope.regionName = treeNode.name;
                    $scope.grade = treeNode.grade;
                }

                /**
                 * 用于捕获行政区域父节点展开之前的问题回调函数，并且根据返回值确定是否允许展开操作
                 * @param {Object} treeId
                 * @param {Object} treeNode
                 */
                function regionTreeOnExpand(treeId, treeNode) {
                    console.log('===========regionTreeOnExpand===========');
                    var cnodes = treeNode.children;
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
                 * 生成区域树
                 */
                function regionTreeList() {
                    $http({
                        method: 'get',
                        url: regionTreeUrl
                    }).success(function (res) {
                        console.log(res)
                        if (res.resCode == 1) {
                            regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, res.data);
                        } else {
                        }
                    }).error(function () {
                    });
                };

                /**
                 * 区域树模态框
                 */
                $scope.getRegionShow = function () {
                    $('#regionTreeModal').modal('show');
                    regionTreeList();
                }

                /**
                 * 区域树搜索
                 */
                $scope.getSelectRegion = function () {
                    console.log('我是区域树搜索...')
                }

                /**
                 * 关闭模态框
                 */
                $scope.getModalOk = function () {
                    $('#regionTreeModal').modal('hide');
                    console.log('我是区域树关闭...')
                }


                $('#J-searchTime').datetimepicker({
                    format: 'YYYY-MM',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    $scope.searchTime = new moment(c.date).format('YYYY-MM');
                    $scope.$apply();
                });
                $('#J-searchTime1').datetimepicker({
                    format: 'YYYY-MM-DD HH:mm:ss',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    $scope.evaluationDate = new moment(c.date).format('YYYY-MM-DD HH:mm:ss');
                    $scope.$apply();
                });

                //搜索
                $scope.getMdSearch = function () {
                    getModuleList();
                }

                //重置
                $scope.getReSet = function () {
                    $scope.searchTime = '';
                    $scope.reachName = '';
                    $scope.patrolperson = '';
                    $scope.regionName = '';
                    $scope.assess = '';
                    $scope.problemPosition = '';
                }

                //满意度监听
                $scope.getAssessChange = function (id){
                    if(id == 0){
                        $scope.showInput = true;
                    }else {
                        $scope.showInput = false;
                    }

                }


                /**
                 * 列表数据
                 */
                function getModuleList() {

                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/SocialEvaluation/listEvaluation',
                        method: 'get',
                        params: {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            termNumber: $scope.searchTime,
                            riverName: $scope.reachName,
                            supervisor: $scope.patrolperson,
                            regionName: $scope.regionName,
                            isSatisfied: $scope.assess,
                            problemPosition:$scope.problemPosition
                        },
                        callBack: function (res) {
                            $scope.moduleList = res.data.list;
                            $scope.paginationConf.totalItems = res.data.total;
                        }
                    })
                }

                //修改
                $scope.edit = function (module) {
                    $('#myModal').modal('show');
                    $scope.editId = module.id;
                    $scope.evaluationDate = module.evaluationDate;
                    $scope.riverName1 = module.riverName;
                    $scope.problemPosition1 = module.problemPosition;
                    $scope.districtChairman = module.districtChairman;
                    $scope.townChairman = module.townChairman;
                    $scope.supervisor = module.supervisor;
                    $scope.otherReason = module.otherReason;
                }

                //修改评价满意度
                $scope.submit = function (){
                    var params = {
                        id: $scope.editId,
                        termNumber: $scope.evaluationDate,
                        riverName: $scope.riverName1 ,
                        problemPosition: $scope.problemPosition1 ,
                        districtChairman: $scope.districtChairman,
                        townChairman: $scope.townChairman,
                        supervisor: $scope.supervisor,
                        otherReason: $scope.otherReason,
                        isSatisfied:$scope.assess1
                    }
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/SocialEvaluation/updateEvaluation',
                        method: 'put',
                        params:params,
                        callBack: function (res) {
                            if (res.resCode == 1) {
                                layer.msg("修改成功！", {time: 2000});
                                $('#myModal').modal('hide')
                                getModuleList();
                            }
                        }
                    })
                }

                /**
                 * 获取满意度类型
                 */
                function getAssessList() {
                    $scope.assessList = [
                        {
                            'id': 0,
                            'name': '不满意'
                        },
                        {
                            'id': 1,
                            'name': '满意'
                        }
                    ]
                }

                /**
                 * 查看当前列表详情
                 */
                $scope.getHydrologicDetail = function (id) {
                    localStorage.setItem('id', id);
                    routeService.route('3-6-2', false);
                };


                /**
                 * 评价删除
                 */

                $scope.getHydrologicDelete = function (id, name) {
                    var layerIndex = layer.confirm('确定删除本条数据吗？', {
                        btn: ['确定', '取消']
                        // 按钮
                    }, function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/SocialEvaluation/deleteEvaluation',
                            method: 'DELETE',
                            params: {
                                id: id
                            },
                            callBack: function (res) {
                                if (res.resCode == 1) {
                                    layer.msg("删除成功！", {time: 2000});
                                    getModuleList();
                                }
                            }
                        })
                    }, function () {
                    });
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
                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getModuleList);

            }
        ]);

})(window, angular)