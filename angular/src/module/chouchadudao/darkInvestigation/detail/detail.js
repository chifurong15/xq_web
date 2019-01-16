(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'darkInvestigationDetailCtrl',
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
                function darkInvestigationDetailCtrl($localStorage, $scope,
                                               $location, $log, $q, $rootScope, $window,
                                               routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl();
                    // var apiPrefix = 'http://10.0.9.133:7021';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
                    $scope.schemeId = localStorage.getItem('id');
                    $scope.init = function () {
                        $scope.createUser = $scope.userInfo.name;

                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false,
                            'deselectAllText':'取消全选',
                            'selectAllText': '全选',
                        });
                        $scope.reachList = [];
                        $scope.status = 1;

                        getRegion ();
                        getPerson ();

                        //获取暗查方案详情
                        getDetail ();

                        //获取暗查台账列表
                        getCountList ();

                        //暗查暗访统计
                        getStatistics ();

                        //通报详情
                        getReportDetail ();

                        //获取发现问题列表
                        getProblem ();
                    }

                    //搜索
                    $scope.searchData = function () {
                        getProblem ();
                    }


                    //获取发现问题列表
                    function getProblem () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/AnzhaReport/list',
                            method:'get',
                            params:{
                                anzhaid:$scope.schemeId,
                                status:$scope.status
                            },
                            callBack:function (res) {
                                $scope.problemList = res.data;
                                //console.log($scope.problemList);
                            }
                        })
                    }
                    
                    //下发一区一单
                    $scope.sentOneRegion = function () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/AnzhaReport/issue',
                            method:'get',
                            params:{
                                anzhaid:$scope.schemeId,
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    layer.msg('下发成功',{times:500})
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }

                    //查看发现问题详情
                    $scope.view = function (id) {
                        $('#viewProblem').modal('show')
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/AnzhaReport/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        // console.log(res.data);
                                        $scope.problemDetail = res.data;
                                        $scope.fileList1 = [];
                                        $scope.accessoryURL1 = [];
                                        if(res.data.assessoryyuan){
                                            var viewUrl = [] ,downUrl = [];
                                            viewUrl = res.data.assessoryyuan.split(',');
                                            downUrl = res.data.assessoryyuan.split(',');
                                            if(viewUrl.length == downUrl.length){
                                                viewUrl.map((item,i)=>{
                                                    $scope.fileList1.push({
                                                        name:downUrl[i].substring(downUrl[i].lastIndexOf('/')+1),
                                                        previewURL:item,
                                                        downloadURL:downUrl[i]
                                                    })
                                                })
                                            }
                                        }




                                    }
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }



                    //获取暗查方案详情
                    function getDetail () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/ScAnzhaScheme/detail',
                            method:'get',
                            params:{
                                id:$scope.schemeId
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.editTitle = res.data.title;
                                    $scope.editTime = res.data.issue;
                                    $scope.editUser = res.data.createuser;
                                    $scope.editContent = res.data.content;
                                    $scope.assessoryEdit = res.data.accessory;

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
                                }
                            }
                        })
                    }
                    // 表格排序
                    $scope.sort = function (id , name) {
                        $scope.column = name;
                        $scope.order = id;
                        getCountList ();
                    }

                    //获取暗查台账列表
                    function  getCountList () {
                        var params = {
                            anzhaid:$scope.schemeId,
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            column:$scope.column ? $scope.column : '',
                            order:$scope.order ? $scope.order : ''
                        }
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/ScAnzhaInvestigations/list',
                            method:'get',
                            params:params,
                            callBack:function (res) {
                                if(res.data){
                                    $scope.countList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }

                    //获取所有的区域
                    function getRegion (){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/ScAnzhaInvestigations/districtlist',
                            method:'get',
                            callBack:function (res) {
                                $scope.regionList = res.data;
                                var select = $("#slpk1");
                                for (var i = 0; i < $scope.regionList.length; i++) {
                                    select.append("<option value='"+$scope.regionList[i].regionId+"'>"
                                        + $scope.regionList[i].regionName + "</option>");
                                }
                                $('.selectpicker1').selectpicker('val', '');
                                $('.selectpicker1').selectpicker('refresh');

                                var select1 = $("#slpk4");
                                for (var i = 0; i < $scope.regionList.length; i++) {
                                    select1.append("<option value='"+$scope.regionList[i].regionId+"'>"
                                        + $scope.regionList[i].regionName + "</option>");
                                }
                                $('.selectpicker4').selectpicker('val', '');
                                $('.selectpicker4').selectpicker('refresh');
                            }
                        })
                    }

                    //监听区域选择框
                    $scope.getRegionListener = function (region){
                        $scope.sentRegion = region;
                        $('.selectpicker2').selectpicker('val', []);
                        $('.selectpicker2').selectpicker('refresh');
                        $('.selectpicker2').selectpicker('render');

                        getReach ($scope.sentRegion);
                    }

                    //监听河段选择框
                    $scope.getReachListener = function (reach){
                        $scope.sentReach = reach;
                        // console.log($scope.sentReach);
                    }



                    //获取区下面的河道
                    function getReach (regionStr){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/ScAnzhaInvestigations/reachlist',
                            method:'get',
                            params:{
                                regionStr:regionStr ? regionStr.join(',') : ''
                            },
                            callBack:function (res) {
                                $scope.reachList = res.data;
                                var select = $("#slpk2");
                                select.html('');
                                for (var i = 0; i < res.data.length; i++) {
                                    select.append("<option value='"+res.data[i].reachname+"'>"
                                        + res.data[i].reachname + "</option>");
                                }

                                $('.selectpicker2').selectpicker('val', '');
                                $('.selectpicker2').selectpicker('refresh');
                                $('.selectpicker2').selectpicker('render');
                            }
                        })

                    }

                    //获取暗查人员
                    function getPerson (){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/ScAnzhaInvestigations/selectPersonnel',
                            method:'get',
                            callBack:function (res) {
                                $scope.personList = res.data.records;
                                // console.log($scope.personList);
                                var select = $("#slpk3");
                                for (var i = 0; i < $scope.personList.length; i++) {
                                    select.append("<option value='"+$scope.personList[i].id+"'>"
                                        + $scope.personList[i].name + "</option>");
                                }
                                $('.selectpicker3').selectpicker('val', '');
                                $('.selectpicker3').selectpicker('refresh');
                            }
                        })
                    }

                    //新增 修改暗查台账
                    $scope.showCount = function (index,id){
                        $scope.assessory = [];
                        if(index == 1){//新增
                            $scope.index = 1;
                            $scope.sentReach = [];
                            $('#addCount').modal('show');
                        }else {//修改
                            $scope.index = 2;
                            $scope.editCountId = id;
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/ancha/v1/ScAnzhaInvestigations/detail',
                                method:'get',
                                params:{
                                    id:$scope.editCountId
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        $('#addCount').modal('show');
                                        if(res.data){
                                            $scope.editData = res.data;
                                            $scope.schemeTitle = res.data.title;
                                            $scope.darkTime = res.data.inspecttime;

                                            $scope.sentRegion = res.data.regionid.split(',');

                                            $scope.regionList.map((item,i)=>{
                                                $scope.sentRegion.map((val,j)=>{
                                                    if(item.regionId == val){
                                                        $scope.regionList[i].selected=true;
                                                        $('.selectpicker1').selectpicker('refresh');
                                                    }
                                                })
                                            })

                                            $('.selectpicker1').selectpicker('val',$scope.sentRegion);
                                            $('.selectpicker1').selectpicker('refresh');
                                            $('.selectpicker1').selectpicker('render');

                                            $scope.reachList = [];

                                            setTimeout(function (){
                                                $ajaxhttp.myhttp({
                                                url:apiPrefix + '/ancha/v1/ScAnzhaInvestigations/reachlist',
                                                method:'get',
                                                params:{
                                                    regionStr:$scope.sentRegion.join(',')
                                                },
                                                callBack:function (res) {
                                                    $scope.reachList = res.data;

                                                    var select = $("#slpk2");
                                                    select.html('');
                                                    for (var i = 0; i < res.data.length; i++) {
                                                        select.append("<option value='"+res.data[i].reachname+"'>"
                                                            + res.data[i].reachname + "</option>");
                                                    }

                                                    $scope.sentReach = $scope.editData.reachname.split(',');
                                                    res.data.map((item,i)=>{
                                                        $scope.sentReach.map((val,j)=>{
                                                            if(item == val){
                                                                res.data[i].selected=true;
                                                                $('.selectpicker2').selectpicker('refresh');
                                                            }
                                                        })
                                                    })

                                                    $('.selectpicker2').selectpicker('val',$scope.sentReach);
                                                    $('.selectpicker2').selectpicker('refresh');
                                                    $('.selectpicker2').selectpicker('render');
                                                }
                                            })
                                            },1000)

                                            $scope.personnel = res.data.personnel.split(',');
                                            $scope.personList.map((item,i)=>{
                                                $scope.personnel.map((val,j)=>{
                                                    if(item.name == val){
                                                        $scope.personList[i].selected=true;
                                                        $('.selectpicker3').selectpicker('refresh');
                                                    }
                                                })
                                            })

                                            $('.selectpicker3').selectpicker('val', $scope.personnel);
                                            $('.selectpicker3').selectpicker('refresh');
                                            $('.selectpicker3').selectpicker('render');

                                            $scope.assessoryEdit = res.data.assessoryyuan;


                                        }
                                    }else{

                                    }

                                }
                            })
                        }
                    }

                    //保存暗查台账
                    $scope.saveCount = function (id){
                        var params = {
                            schemeid:$scope.schemeId,
                            title:$scope.schemeTitle,
                            inspecttime:$scope.darkTime,
                            regionid:$scope.sentRegion ? $scope.sentRegion.join(',') : '',
                            // regionname:$scope.regionNameList ? $scope.regionNameList.join(',') : '',
                            reachname:$scope.sentReach ? $scope.sentReach.join(',') : ''　,
                            personnel:$scope.personnel ? $scope.personnel.join(',') : ''　,
                            assessoryyuan:$scope.assessory ? $scope.assessory.join(',') : ''　
                        };
                        if(
                            $scope.schemeTitle && $scope.darkTime && $scope.sentRegion && $scope.sentReach && $scope.personnel
                        ){

                            if(id == 1) {//新增暗查台账
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/ancha/v1/ScAnzhaInvestigations/add',
                                    method: 'POST',
                                    params: params,
                                    callBack: function (res) {
                                        if(res.resCode == 1){
                                            layer.msg("新增成功！",{time:2000});
                                            $scope.closeCount();
                                            getCountList ();
                                        }else{
                                            layer.msg('服务器异常，请稍后再试',{times:500})
                                        }
                                    }
                                })
                            }else if(id == 2){//修改暗查台账
                                $ajaxhttp.myhttp({
                                    url: apiPrefix + '/ancha/v1/ScAnzhaInvestigations/update',
                                    method: 'put',
                                    params: {
                                        id:$scope.editCountId,
                                        title:$scope.schemeTitle,
                                        inspecttime:$scope.darkTime,
                                        regionid:$scope.sentRegion ? $scope.sentRegion.join(',') : '',
                                        reachname:$scope.sentReach ? $scope.sentReach.join(',') : ''　,
                                        personnel:$scope.personnel ? $scope.personnel.join(',') : ''　,
                                        assessoryyuan:$scope.assessory ? $scope.assessory.join(',') : $scope.assessoryEdit
                                    },
                                    callBack: function (res) {
                                        if(res.resCode == 1){
                                            layer.msg("修改成功！",{time:2000});
                                            $scope.closeCount();
                                            getCountList ();
                                        }else{
                                            layer.msg('服务器异常，请稍后再试',{times:500})
                                        }
                                    }
                                })
                            }

                        }else{
                            layer.alert("输入的信息不全", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                    }

                    //关闭暗查台账弹窗
                    $scope.closeCount = function(){
                        $scope.schemeTitle = '';
                        $scope.darkTime = '';

                        $('.selectpicker1').selectpicker('val', []);
                        $('.selectpicker1').selectpicker('refresh');

                        $('.selectpicker2').selectpicker('val', []);
                        $('.selectpicker2').selectpicker('refresh');

                        $('.selectpicker3').selectpicker('val', []);
                        $('.selectpicker3').selectpicker('refresh');
                        $('#addCount').modal('hide');
                    }

                    //查看台账详情
                    $scope.viewCount = function (id) {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/ScAnzhaInvestigations/detail',
                            method:'get',
                            params:{
                                id: id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.detailCount = res.data;
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
                                        // console.log($scope.fileList);
                                    }
                                }
                            }
                        })
                        $('#viewCount').modal('show');
                    }

                    //删除暗查台账
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/ancha/v1/ScAnzhaInvestigations/delete',
                                method:'delete',
                                params:{
                                    id:id
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('删除成功',{times:500});
                                        getCountList ();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                            layer.close(layerIndex);
                        }, function () {

                        });
                    }


                    //获取暗查统计列表
                    function getStatistics () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/ancha/v1/AnzhaReport/list',
                            method:'get',
                            params:{
                                anzhaid:$scope.schemeId
                            },
                            callBack:function (res) {
                                $scope.statisticsList = res.data;
                            }
                        })
                    }

                    //通报详情
                    function getReportDetail () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/ancha/v1/AnzhaBulletin/detail',
                            method: 'GET',
                            params: {
                                id:$scope.schemeId
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(Array.isArray(res.data)){
                                        if(res.data.length <= 0){//显示新增按钮 、隐藏修改按钮
                                            $scope.showButton = true;
                                        }else{//隐藏新增按钮 、显示修改按钮
                                            $scope.showButton = false;
                                            $scope.reportId = res.data[0].id;
                                            $scope.reportTitle = res.data[0].title;
                                            $scope.reportStartTime = res.data[0].issuetime;
                                            $scope.reportEndTime = res.data[0].deadlinetime;
                                            $scope.reportContent = res.data[0].content;
                                            $scope.reportFileUrl = res.data[0].assessoryyuan;
                                            $scope.reportRegion = res.data[0].feedbackareaid.split(',');

                                            $('.selectpicker4').selectpicker('val', res.data[0].feedbackareaid.split(','));
                                            $('.selectpicker4').selectpicker('refresh');
                                            $('.selectpicker4').selectpicker('render');

                                            $scope.fileList2 = [];
                                            $scope.accessoryURL2 = [];
                                            if(res.data[0].assessoryyuan){
                                                var viewUrl = [] ,downUrl = [];
                                                viewUrl = res.data[0].assessory.split(',');
                                                downUrl = res.data[0].assessoryyuan.split(',');
                                                if(viewUrl.length == downUrl.length){
                                                    viewUrl.map((item,i)=>{
                                                        $scope.fileList2.push({
                                                            name:downUrl[i].substring(downUrl[i].lastIndexOf('/')+1),
                                                            previewURL:item,
                                                            downloadURL:downUrl[i]
                                                        })
                                                    })
                                                }
                                            }

                                        }
                                    }else{
                                        $scope.showButton = true;
                                    }


                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }

                    //新增暗访通报
                    $scope.addReport = function () {
                        var params = {
                            schemeid:$scope.schemeId,
                            title:$scope.reportTitle,
                            issuetime:$scope.reportStartTime,
                            deadlinetime:$scope.reportEndTime,
                            feedbackareaid:$scope.reportRegion ? $scope.reportRegion.join(',') : '',
                            content:$scope.reportContent,
                            assessoryyuan:$scope.assessory ? $scope.assessory.join(',') : ''
                        }


                        if(
                            $scope.reportTitle && $scope.reportStartTime && $scope.reportEndTime && $scope.reportRegion && $scope.reportContent
                        ){
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/ancha/v1/AnzhaBulletin/add',
                                method: 'POST',
                                params: params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("新增成功！",{time:2000});
                                        getReportDetail();
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

                    //修改暗访通报
                    $scope.editReport = function (){
                        var params = {
                            id:$scope.reportId,
                            title:$scope.reportTitle,
                            issuetime:$scope.reportStartTime,
                            deadlinetime:$scope.reportEndTime,
                            feedbackareaid:$scope.reportRegion ? $scope.reportRegion.join(',') : '',
                            content:$scope.reportContent,
                            assessoryyuan:$scope.assessory ? $scope.assessory.join(',') : $scope.reportFileUrl
                        }
                        // console.log(params);

                        if(
                            $scope.reportTitle && $scope.reportStartTime && $scope.reportEndTime && $scope.reportRegion && $scope.reportContent
                        ){
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/ancha/v1/AnzhaBulletin/update',
                                method: 'put',
                                params: params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("修改成功！",{time:2000});
                                        getReportDetail();
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

                    //清空通报表单
                    function clear () {
                        $scope.reportTitle = '';
                        $scope.reportStartTime = '';
                        $scope.reportEndTime = '';
                        $scope.reportContent = '';
                        $('.selectpicker4').selectpicker('val', []);
                        $('.selectpicker4').selectpicker('refresh');
                    }


                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }

                    //返回
                    $scope.goBack=function(){
                        routeService.route('2-5',true);
                    }



                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function () {
                        $scope.assessory = [];
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
                            url: apiPrefix + '/ancha/v1/AnzhaReport/upload',
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
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }


                    // 期号
                    $('#issue').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.issue = result;
                        $scope.$apply();
                    });

                    // 新增期号
                    $('#Time').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.Time = result;
                        $scope.$apply();
                    });

                    // 修改期号
                    $('#editTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.editTime = result;
                        $scope.$apply();
                    });

                    // 暗查时间
                    $('#darkTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.darkTime = result;
                        $scope.$apply();
                    });

                    // 通报开始时间
                    $('#reportStartTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.reportStartTime = result;
                        $scope.$apply();
                    });

                    // 通报截止时间
                    $('#reportEndTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.reportEndTime = result;
                        $scope.$apply();
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
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getCountList);
                } ]);
})(window, angular);
