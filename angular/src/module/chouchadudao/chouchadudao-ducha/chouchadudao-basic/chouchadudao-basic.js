(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'duchaBasicCtrl',
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
                function duchaBasicCtrl($localStorage, $scope,
                                         $location, $log, $q, $rootScope, $window,
                                         routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/inspection';
                    //var apiPrefix = 'http://10.0.9.116:7025' + '/inspection';

                    var options = {
                        pdfOpenParams: {
                            pagemode: "thumbs",
                            navpanes: 0,
                            toolbar: 0,
                            statusbar: 0,
                            view: "FitV"
                        }
                    };

                    $scope.init = function () {
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择'
                        });
                        $scope.isShow1 = true; //显示通报tab栏
                        $scope.isShow2 = false; //隐藏一区一单tab栏

                        $scope.tag = localStorage.getItem('tag');
                        $scope.id = localStorage.getItem('id');
                        $scope.state = localStorage.getItem('state');
                        $scope.oneregion = localStorage.getItem('oneregion');
                        if($scope.oneregion && $scope.oneregion == 1){
                            $scope.isShow2 = true ;
                            $scope.isShow1 = false ;
                        }else{
                            $scope.isShow2 = false ;
                            $scope.isShow1 = true ;
                        }

                        if($scope.tag == 1){
                            $scope.title ='上报';
                        }else if($scope.tag == 2){
                            $scope.title ='建组';
                        }else if($scope.tag == 3){
                            $scope.title ='通报';
                        }else if($scope.tag == 4){
                            $scope.title ='处理';
                        }else if($scope.tag == 5){
                            $scope.title ='一区一单';
                        }

                        getBasic ();
                        getConcatList ();
                        getGroupList ();
                        getAllRegion ();
                        getReport ();

                    }

                    layui.use('laydate', function(){
                        var laydate = layui.laydate;
                        laydate.render({
                            elem: '#test11',
                            format: 'yyyy-MM-dd',
                            done:(value) =>{
                                $scope.sentDate = value ;
                            }
                        });
                    })

                    layui.use('laydate', function(){
                        var laydate = layui.laydate;
                        laydate.render({
                            elem: '#test12',
                            format: 'yyyy-MM-dd',
                            done:(value) =>{
                                $scope.trafficDate = value ;
                            }
                        });
                    })

                    layui.use('laydate', function(){
                        var laydate = layui.laydate;
                        laydate.render({
                            elem: '#test13',
                            format: 'yyyy-MM-dd',
                            done:(value) =>{
                                $scope.searchTime3 = value ;
                            }
                        });
                    })


                    //查看附件
                    $scope.viewFile = function () {
                        $('#myModal2').modal('show');
                    }
                    //取消查看
                    $scope.cancel = function () {
                        $('#myModal2').modal('hide');
                    }

                    // 单选按钮组
                    $scope.typeList = [
                        {"id": 1, "typeName": "是"},
                        {"id": 2, "typeName": "否"}
                    ];
                    $scope.radioBtn = function(type){
                        $scope.types = type;
                    }

                    //返回
                    $scope.goBack = function(){
                        history.back(-1);
                    }

                    //取消
                    $scope.back = function () {
                        routeService.route('2-3', true);
                    }

                    //新增弹框
                    $scope.add = function (id){
                        if(id == 1){//联络员
                            $scope.type = 1;
                            $('#myModal').modal('show')
                        }else if (id == 2){//督导组
                            $scope.type = 3;
                            $('#myModal1').modal('show')
                        }
                    }
                    //修改联络员弹框
                    $scope.update = function (item) {
                        $scope.type = 2;
                        $('#myModal').modal('show')
                        $scope.username = item.name;
                        $scope.duty = item.duty;
                        $scope.phoneNum = item.phone;
                        $scope.editId = item.id;
                    }

                    //删除联络员
                    $scope.delete = function (id) {
                        var layerIndex = layer.confirm('确定删除该联络员吗？', {
                            btn: ['确定', '取消']
                            // 按钮
                        }, function () {
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/ComtactPerson/delete',
                                method: 'DELETE',
                                params: {
                                    id: id
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("删除成功！",{time:2000});
                                        getConcatList();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }, function () {});
                    }

                    //新增联络员
                    $scope.save = function () {

                        if (!$scope.username) {
                            layer.alert("请输入姓名", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.duty) {
                            layer.alert("请输入职务", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.phoneNum) {
                            layer.alert("请输入手机号码", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                        var params = {
                            inspectionid:$scope.id,
                            name:$scope.username,
                            duty:$scope.duty,
                            phone:$scope.phoneNum
                        }
                        if($scope.type == 1){
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/ComtactPerson/add',
                                method: 'post',
                                params:params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        getConcatList ();
                                        clear();
                                        layer.msg('新增成功',{times:2000});
                                        $('#myModal').modal('hide');
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }else{
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/ComtactPerson/update',
                                method: 'put',
                                params:{
                                    id: $scope.editId,
                                    name:$scope.username,
                                    duty:$scope.duty,
                                    phone:$scope.phoneNum
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        getConcatList ();
                                        clear();
                                        layer.msg('修改成功',{times:2000});
                                        $('#myModal').modal('hide');
                                    }else{
                                        layer.msg('服务器异常，请稍后再试')
                                    }
                                }
                            })
                        }
                    }

                    //关闭联络员弹框
                    $scope.close =function (id) {
                        if(id == 1){
                            $('#myModal').modal('hide')
                            clear ();
                        }else if(id == 2){
                            $('#myModal1').modal('hide')
                            clearGroup ();
                        }
                    }

                    //清空联络员表单信息
                    function clear () {
                        $scope.username = '';
                        $scope.duty = '';
                        $scope.phoneNum = '';
                    }

                    //清空督导组表单信息
                    function clearGroup () {
                        $scope.groupLeader = '';
                        $scope.grouping = '';
                        $scope.contact = '';
                        $scope.phone = '';
                        $scope.area = [];
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择'
                        });
                        $('.selectpicker').selectpicker('refresh');
                        $scope.department = '';
                    }

                    //新建督导组
                    $scope.saveGroup = function () {

                        if (!$scope.groupLeader) {
                            layer.alert("请输入组长姓名", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.grouping) {
                            layer.alert("请输入分组名称", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.contact) {
                            layer.alert("请输入联络员名称", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.phone) {
                            layer.alert("请输入联系电话", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.area) {
                            layer.alert("请选择督导区", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.department) {
                            layer.alert("请输入组成部门", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }

                        var params = {
                            inspectionid: $scope.id,
                            groupLeader: $scope.groupLeader,
                            grouping: $scope.grouping,
                            contact: $scope.contact,
                            phone: $scope.phone,
                            area: $scope.area,
                            department: $scope.department
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/Supervise/add',
                            method: 'post',
                            params:params,
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    getGroupList ();
                                    clearGroup ();
                                    layer.msg('新增成功',{times:2000});
                                    $('#myModal1').modal('hide');
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //确定通报
                    $scope.confirmReport = function () {
                        var params = {
                            trafficDate: $scope.trafficDate,
                            accessory: $scope.accessory,
                            inspectionId: $scope.id,
                            trafficContent: $scope.trafficContent,
                            oneregion: $scope.types
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/TrafficList/add',
                            method: 'post',
                            params:params,
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('通报成功',{times:2000});
                                    routeService.route('2-3', true);
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //处理并上报
                    $scope.deal = function () {
                        var params = {
                            sentDate: $scope.sentDate,
                            accessory: $scope.accessory,
                            inspectionid: $scope.id,
                            state: $scope.types
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ProblemHandle/add',
                            method: 'POST',
                            params:params,
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('上报成功',{times:2000});
                                    routeService.route('2-3', true);
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //一区一单处理上报
                    $scope.oneRegionReport = function () {
                        var params = {
                            trafficDate: $scope.searchTime3,
                            accessory: $scope.accessory,
                            inspectionId: $scope.id,
                            oneregion: $scope.types
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/TrafficList/add',
                            method: 'POST',
                            params:params,
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('上报成功',{times:2000});
                                    routeService.route('2-3', true);
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //上报
                    $scope.report = function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/Inspection/updateStatus0',
                            method: 'PUT',
                            params:{
                                id:$scope.id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('上报成功',{times:2000});
                                    routeService.route('2-3', true);
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }

                    //下发通知
                    $scope.notice = function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/Inspection/updateStatus2',
                            method: 'PUT',
                            params:{
                                id:$scope.id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('下发通知成功',{times:2000});
                                    routeService.route('2-3', true);
                                }else{
                                    layer.msg('服务器异常，请稍后再试')
                                }
                            }
                        })
                    }
                    
                    // 获取基础资料
                    function getBasic () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/Inspection/detail',
                            method: 'get',
                            params:{
                                id:$scope.id
                            },
                            callBack: function (res) {
                                $scope.resBasic = res.data;
                                PDFObject.embed(res.data.accessory, "#file", options);
                            }
                        })
                    }

                    //获取联络员列表
                    function getConcatList () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ComtactPerson/selectList',
                            method: 'get',
                            params:{
                                inspectionid:$scope.id
                            },
                            callBack: function (res) {
                                $scope.contactList = res.data.list;
                            }
                        })
                    }

                    //获取督导组列表
                    function getGroupList () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/Supervise/selectList',
                            method: 'get',
                            params:{
                                inspectionid:$scope.id
                            },
                            callBack: function (res) {
                                $scope.groupList = res.data.list;
                            }
                        })
                    }

                    //获取所有的区
                    function getAllRegion(){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/Supervise/selectArea',
                            method: 'get',
                            callBack: function (res) {
                                $scope.RegionList = res.data;
                                var select = $("#slpk");
                                for (var i = 0; i < res.data.length; i++) {
                                    select.append("<option value='"+res.data[i]+"'>"
                                        + res.data[i] + "</option>");
                                }
                                $('.selectpicker').selectpicker('val', '');
                                $('.selectpicker').selectpicker('refresh');
                            }
                        })
                    }

                    //获取通报信息
                    function getReport () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/TrafficList/selectById',
                            method: 'get',
                            params:{
                                inspectionId: $scope.id
                            },
                            callBack: function (res) {
                                $scope.resReport = res.data;
                                PDFObject.embed(res.data.accessory, "#file", options);
                            }
                        })

                    }

                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function(id){
                        if( id == 1 ){
                            $('#coverModal1').modal('show');
                        }else if( id == 2 ) {
                            $('#coverModal2').modal('show');
                        }else if ( id == 3 ) {
                            $('#coverModal3').modal('show');
                        }
                    }


                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function(id){
                        if( id == 1 ){
                            $('#coverModal1').modal('hide');
                        }else if( id == 2 ) {
                            $('#coverModal2').modal('hide');
                        }else if ( id == 3 ) {
                            $('#coverModal3').modal('hide');
                        }
                        var formFile = new FormData();
                        if(id == 1){
                            var fileObj1 = document.querySelector('input[type=file]').files[0];
                            formFile.append("files", fileObj1); //加入文件对象
                        }else if (id == 2){
                            var fileObj2 = document.querySelector('#problemFile').files[0];
                            formFile.append("files", fileObj2); //加入文件对象
                        }else if (id == 3){
                            var fileObj3 = document.querySelector('#oneregion').files[0];
                            formFile.append("files", fileObj3); //加入文件对象
                        }

                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/Inspection/upload',
                                data:formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                //console.log(res);
                                if(id == 1){
                                    $scope.accessory = res.data[0];
                                }else if(id == 2) {
                                    $scope.accessory = res.data[0];
                                }else if (id == 3){
                                    $scope.accessory = res.data[0];
                                }
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
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
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getConcatList);

                } ]);
})(window, angular);
