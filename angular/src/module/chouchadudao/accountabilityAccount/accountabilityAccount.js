(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'accountCtrl',
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
                function accountCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/scstandingbook';
                    // var apiPrefix = 'http://10.0.9.133:7029' + '/scstandingbook';


                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false
                        });

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/scstandingbook/userinfo',
                            method:'get',
                            callBack:function (res) {
                               $scope.num = res.data;
                            }
                        })

                        getList();
                        getObject ();
                        getTypes ();

                    }

                    $scope.fileUploadList = [];

                    //删除附件
                    $scope.deleteFile = function (i) {
                        $scope.fileUploadList.splice(i,1);
                        // console.log($scope.fileUploadList);
                    }
                    //获取问责类型
                    function getTypes (){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/scstandingbook/selectDictionary',
                            method:'get',
                            callBack:function (res) {
                                $scope.typeList = res.data;
                            }
                        })

                    }

                    // 表格排序
                    $scope.sort = function (id , name) {
                        $scope.column = name;
                        $scope.order = id;
                        getList ();
                    }
                    // 获取数据列表
                    function getList () {
                        var params  = {
                            userid:$scope.userInfo.id,
                            name:$scope.name,
                            statTime:$scope.startTime,
                            endTime:$scope.endTime,
                            accountabilitytype:$scope.accountabilitytype,
                            column:$scope.column ? $scope.column : '',
                            order:$scope.order ? $scope.order : '',
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage
                        }
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/scstandingbook/list',
                            method:'get',
                            params:params,
                            callBack:function (res) {
                                $scope.moduleList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    //搜索
                    $scope.searchData = function (){
                        getList();
                    }

                    //重置
                    $scope.reset = function (){
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.name = '';
                        $scope.accountabilitytype = '';
                    }

                    //新增弹窗
                    $scope.add = function () {
                        $scope.assessory = [];
                        $('#myModal').modal('show');
                    }

                    //保存
                    $scope.save = function (){
                        var params = {
                            turnarounddate:$("#Time").find("input").val(),
                            accountabilitytype:$scope.type,
                            objectid:$scope.accoutObjectid,
                            objectname:$scope.regionNameList,
                            name:$scope.userName,
                            duty:$scope.accountDuty,
                            recordmen:$scope.recordMan,
                            content:$scope.accountContent,
                            remark:$scope.accountRemark,
                            assessoryyuan:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        // console.log(params);
                        if
                        (
                            $("#Time").find("input").val() && $scope.type && $scope.accoutObjectid && $scope.userName && $scope.accountDuty
                            && $scope.recordMan && $scope.accountContent && $scope.accountRemark
                        )
                        {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/scstandingbook/add',
                                method:'post',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('新增成功',{times:2000});
                                        getList();
                                        $scope.close();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })

                        }else{
                            layer.alert("输入的信息不全", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                    }

                    //关闭并清空新增窗口
                    $scope.close = function () {
                        $('#myModal').modal('hide');
                        // $scope.Time = '';
                        $("#Time").find("input").val('');
                        $scope.type = '';
                        $scope.accoutObjectid = '';
                        $scope.userName = '';
                        $scope.accountDuty = '';
                        $scope.recordMan = '';
                        $scope.accountContent = '';
                        $scope.accountRemark = '';
                        $scope.assessory = [];
                        $scope.fileUploadList = [];
                    }

                    //查看问责详情
                    $scope.view = function (id){
                        $('#myModalView').modal('show');
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/scstandingbook/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.detailData = res.data;
                                    $scope.fileList = [];
                                    $scope.accessoryURL = [];
                                    if(res.data.assessoryyuan){
                                        var viewUrl = [] ,downUrl = [];
                                        viewUrl = res.data.assessory.split(',');
                                        downUrl = res.data.assessoryyuan.split(',');

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
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }

                    //删除问责
                    $scope.delete = function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/v1/scstandingbook/delete',
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

                    //获取问责对象列表
                    function getObject (){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/scstandingbook/regionlist',
                            method:'get',
                            params:{
                                regionid:$scope.userInfo.regionId
                            },
                            callBack:function (res) {
                                $scope.regionList = res.data;
                                // var select = $("#slpk");
                                // for (var i = 0; i < $scope.regionList.length; i++) {
                                //     select.append("<option value='"+$scope.regionList[i].regionId+"'>"
                                //         + $scope.regionList[i].regionName + "</option>");
                                // }
                                // $('.selectpicker').selectpicker('val', '');
                                // $('.selectpicker').selectpicker('refresh');
                            }
                        })
                    }

                    $scope.getChange = function (objectid) {
                        $scope.regionList.map(function(val){
                            if(objectid == val.regionId){
                                $scope.regionNameList= val.regionName;
                            }
                        })
                    }

                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
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
                        $scope.fileUploadList.map(function (item) {
                            $scope.assessory.push(item.fileUrl)
                        })
                        // console.log($scope.assessory);
                    }


                    // 上传文件
                    $scope.uploadFile = function (e) {

                        for (var i = 0; i < e.files.length; i++) {
                            var form = new FormData();
                            var file = e.files[i];
                            $scope.attandName = file.name;
                            form.append('files', file);
                            $http({
                                method: 'POST',
                                url: apiPrefix + '/v1/scstandingbook/upload',
                                data: form,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }).success(function (res) {
                                if(res.resCode == 1){
                                    layer.msg('上传成功',{times:2000})
                                    $scope.attandUrl = res.data[0];
                                    $scope.fileUploadList.push({
                                        fileName:$scope.attandName,
                                        fileUrl:$scope.attandUrl
                                    });
                                    // console.log($scope.fileUploadList);
                                }else{
                                    layer.msg('上传失败',{times:2000})
                                }

                            }).error(function (data) {
                                console.log('upload fail');
                            })
                        }
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
                    //问责日期
                    $('#Time').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        // $scope.Time = result;
                        $("#Time").find("input").val(result)
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
