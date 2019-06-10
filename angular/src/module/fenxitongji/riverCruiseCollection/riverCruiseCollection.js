(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'riverCruiseCollection',
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
                function riverCruiseCollection($localStorage, $scope,
                                            $location, $log, $q, $rootScope, $window,
                                            routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.133:7031/analysis';
                    var regionTree;
                    var regionTreeUrl1 = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';


                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;



                    $scope.fchat = new Object();
                    $scope.fchat.replies = [{key: 0, position: "",desc:""}];
                    // 初始化时由于只有1条回复，所以不允许删除
                    $scope.fchat.canDescReply = false;

                    // 增加回复数
                    $scope.fchat.incrReply = function($index) {
                        $scope.fchat.replies.splice($index + 1, 0,
                            {key: new Date().getTime(), position: "",desc:""});   // 用时间戳作为每个item的key
                        // 增加新的回复后允许删除
                        $scope.fchat.canDescReply = true;
                    }

                    // 减少回复数
                    $scope.fchat.decrReply = function($index) {


                        // 如果回复数大于1，删除被点击回复
                        if ($scope.fchat.replies.length > 1) {
                            $scope.fchat.replies.splice($index, 1);
                        }
                        // 如果回复数为1，不允许删除
                        if ($scope.fchat.replies.length == 1) {
                            $scope.fchat.canDescReply = false;
                        }
                    }

                    $scope.fchat.combineReplies = function() {
                        var cr = [];
                        for (var i = 0; i < $scope.fchat.replies.length; i++) {
                            cr.push({
                                id:i,
                                position:$scope.fchat.replies[i].position,
                                desc:$scope.fchat.replies[i].desc,
                            })
                            // cr += "#" + $scope.fchat.replies[i].value;
                        }
                        //cr = cr.substring(1);
                        // $log.debug("Combined replies: " + cr);
                        return cr;
                    }

                    // $scope.getData = function () {
                    //     $scope.fchat.replies = [{key: 1, position: "111",desc:"1111111"},{key: 2, position: "2222",desc:"22222222222"}]
                    //     console.log($scope.fchat.combineReplies());
                    // }



                    //河长级别
                    $scope.riverLevel = [
                        {
                            id:1,
                            level:'省级'
                        },
                        {
                            id:2,
                            level:'市级'
                        },
                        {
                            id:3,
                            level:'区级'
                        },
                        {
                            id:4,
                            level:'镇级'
                        },
                        {
                            id:5,
                            level:'村级'
                        }
                    ]






                    $scope.init = function () {
                        getRegion ()
                        getList ()
                        $scope.reset ();

                    }

                    //搜索
                    $scope.search = function (){
                        getList();
                    }

                    //重置
                    $scope.reset = function (){
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.regionName = '';
                        $scope.chairmanName = '';
                        $scope.reachname = '';
                        $scope.level = '';
                    }


                    //获取数据列表
                    function getList () {
                        var params = {
                            startTime: $scope.startTime,
                            endTime:$scope.endTime,
                            regionid:$scope.regionId,
                            chairmanname:$scope.chairmanName,
                            reachname:$scope.reachname,
                            level:$scope. level,
                            pageNum: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,

                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saXunhe/list',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if(res.data){
                                    $scope.dataList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }


                    //新增河道断面窗口
                    $scope.add = function (id,detailId) {
                        clear()
                        $('#myModal').modal('show');
                        $scope.fchat.replies = [{key: 1, position: "",desc:""}]

                        $scope.id = id ;
                        $scope.detailId = detailId ;
                        if( $scope.id == 2 && detailId){
                            $scope.isUpdate = true;
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/saXunhe/detail',
                                method:'get',
                                params:{
                                    id:detailId
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1 && res.data){
                                        $scope.region = res.data.regionid;

                                        getManList( $scope.region )

                                        $scope.manName = res.data.chairmanid;
                                        $scope.riverName = res.data.reachid;
                                        // $scope.LevelRiver = res.data.chairmanlevel;
                                        $scope.patrolDate = res.data.patroltime;
                                        $scope.patrolArea = res.data.address;
                                        $scope.patrolTime = res.data.duration;
                                        $scope.mileage = res.data.mileage;
                                        $scope.problemnum = res.data.problemnum;
                                        $scope.content = res.data.content;
                                        $scope.fchat.replies = JSON.parse(res.data.problemaddress);
                                        $scope.accessoryyuan = res.data.accessoryyuan;

                                    }
                                }
                            })

                        }
                    }




                    //保存
                    $scope.addSave = function () {
                        var params = {
                            regionid:$scope.region,
                            chairmanid:$scope.manName,
                            chairmanname:$scope.chairName,
                            reachid:$scope.riverName,
                            reachname:$scope.reachName,
                            patroltime:$scope.patrolDate,
                            duration:$scope.patrolTime,
                            address:$scope.patrolArea,
                            mileage:$scope.mileage,
                            problemnum:$scope.problemnum,
                            content:$scope.content,
                            problemaddress:JSON.stringify($scope.fchat.combineReplies()),
                            accessoryyuan:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        console.log(params);
                        if($scope.id == 1){//新增
                            // var reg = /^[0-9]*[1-9][0-9]*$/;
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/saXunhe/add',
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

                                // if( $scope.patrolTime > 0
                                //     && reg.test($scope.patrolTime) && $scope.problemnum > 0 && reg.test($scope.problemnum))
                                // {
                                //
                                // }else{
                                //     layer.alert("巡河时长和巡河数量只能输入正整数", {
                                //         skin: 'my-skin',
                                //         closeBtn: 1,
                                //         anim: 3
                                //     });
                                // }


                        }else{//修改
                            params.id = $scope.detailId
                            params.accessoryyuan = $scope.assessory ? $scope.assessory.join(',') : $scope.accessoryyuan
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/saXunhe/update',
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
                        $scope.region = '';
                        $scope.manName = '';
                        $scope.riverName = '';
                        $scope.patrolDate = '';
                        $scope.patrolTime = '';
                        $scope.patrolArea = '';
                        $scope.mileage = '';
                        $scope.problemnum = '';
                        $scope.content = '';
                        $scope.fchat.replies = []
                        $scope.assessory = [];
                    }

                    //查看
                    $scope.view = function (id) {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/saXunhe/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1 && res.data){
                                    $('#viewModal').modal('show');
                                    $scope.detail = res.data;
                                    $scope.detail.list = [];
                                    $scope.detail.list.push(JSON.parse($scope.detail.problemaddress));

                                    $scope.fileList = [];
                                    $scope.accessoryURL = [];
                                    if(res.data.accessoryyuan){
                                        var viewUrl = [] ,downUrl = [];
                                        viewUrl = res.data.accessory.split(',');
                                        downUrl = res.data.accessoryyuan.split(',');

                                        if(viewUrl.length == downUrl.length){
                                            viewUrl.map((item,i)=>{
                                                $scope.fileList.push({
                                                    name:downUrl[i].substring(downUrl[i].lastIndexOf('/')+1),
                                                    previewURL:item,
                                                    downloadURL:downUrl[i]
                                                })
                                            })
                                        }
                                    }
                                }
                            }
                        })
                    }

                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }


                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/saXunhe/delete',
                                method:'delete',
                                params:{
                                    id:id
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('删除成功',{times:500});
                                        getList();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                            layer.close(layerIndex);
                        }, function () {

                        });
                    }


                    //监听区域选择
                    $scope.regionListener = function ( region ) {
                        getManList( region )
                    }

                    //根据选择区域获取河长、河段列表
                    function getManList( region ) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saXunhe/getChairmanAndReach',
                            method: 'get',
                            params: {
                                regionid:region
                            },
                            callBack: function (res) {
                                if (res.resCode == 1) {
                                   $scope.manList = res.data.chairman;
                                   $scope.reachList = res.data.reach;
                                }
                            }
                        })
                    }

                    //监听河长选择
                    $scope.chairmanListener = function ( chairmanid ) {
                        $scope.manList.map(function (item,i) {
                            if(item.chairmanid === chairmanid){
                                $scope.chairName = item.chairmanName;
                            }
                        })
                    }

                    //监听河段选择
                    $scope.reachListener = function ( reachid ) {
                        $scope.reachList.map(function (item,i) {
                            if(item.reachid === reachid){
                                $scope.reachName = item.reachName;
                            }
                        })
                    }





                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function () {
                        $scope.assessory = [];
                        $('#coverModal').modal('show')

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
                                url: apiPrefix + '/v1/saAbarbeitung/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                layer.msg("上传成功");
                                $scope.assessory.push(res.data[0]);
                                $('#problemFile').fileinput('clear');

                            } else {
                                layer.msg(res.resMsg);
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }


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
                     * 生成区域树
                     */
                    function regionTreeList () {
                        $http({
                            method: 'get',
                            url: regionTreeUrl
                        }).success(function (res) {
                            // console.log(res)
                            if(res.resCode == 1){
                                regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, res.data);
                            }else{
                            }
                        }).error(function () {
                        });
                    };

                    /**
                     * 用于捕获行政区域父节点展开之前的问题回调函数，并且根据返回值确定是否允许展开操作
                     * @param {Object} treeId
                     * @param {Object} treeNode
                     */
                    function regionTreeOnExpand(treeId, treeNode) {
                        var cnodes = treeNode.children;
                        $http({
                            method: 'get',
                            url: regionTreeUrl,
                            params: {
                                parentCode: treeNode.id
                            },
                        }).success(
                            function (res) {
                                //console.log(res);
                                regionTree.addNodes(treeNode, res.data, true);
                            }
                        );
                    }

                    /**
                     * 捕获行政区域节点被点击
                     * @param {Object} event
                     * @param {Object} treeId
                     * @param {Object} treeNode
                     */
                    function regionTreeOnClick(event, treeId, treeNode) {
                        // console.log(treeNode);
                        $scope.regionId = treeNode.id;
                        $scope.regionName = treeNode.name;
                        $scope.grade = treeNode.grade;
                    }

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
                    $scope.getSelectRegion = function(){
                        //console.log('我是区域树搜索...')
                    }

                    /**
                     * 关闭模态框
                     */
                    $scope.getModalOk = function(){
                        $('#regionTreeModal').modal('hide');
                        //console.log('我是区域树关闭...')
                    }







                    //获取行政区域
                    function getRegion (){
                        $ajaxhttp.myhttp({
                            url:regionTreeUrl1,
                            method:'get',
                            params:{
                                pageNum:-1,
                                pageSize:-1,
                                parents:$scope.userInfo.regionId
                            },
                            callBack:function (res) {
                                $scope.regionList = res.data.list;
                            }
                        })
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


                    // 巡河日期
                    $('#patrolDate').datetimepicker({
                        format: 'YYYY-MM-DD HH:mm',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD HH:mm');
                        $scope.patrolDate = result;
                        $scope.$apply();
                    });




                    // 开始月份
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime = result;
                        $scope.$apply();
                    });




                    // 结束月份
                    var endTime = $('#endTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.endTime = result;
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



                } ]);
})(window, angular);
