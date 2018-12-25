(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'overseerDetailCtrl',
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
                function overseerDetailCtrl($localStorage, $scope,
                                      $location, $log, $q, $rootScope, $window,
                                      routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl();
                    //var apiPrefix = 'http://10.0.9.203:8080';
                    //var apiPrefix1 = 'http://10.0.9.194:8066';

                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';
                    var regionUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';


                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
                    $scope.id = localStorage.getItem('id');//督查方案的id

                    $scope.init = function () {
                        $scope.showAddNotice = false;
                        $scope.showAddReport = false;
                        $scope.showAddOneRegion = false;
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false
                        });

                        $scope.regionList = [];
                        getBasicDetail ();
                        getContactList ();
                        getSupersingList ();
                        sentNoticeList ();
                        getCheckProblem();
                        getRegion ();
                        sentReportList ();
                        sentOneRegionList ();


                    }

                    //获取天津市所有的区
                    function getRegion (){
                        $ajaxhttp.myhttp({
                            url:regionUrl,
                            method:'get',
                            params:{
                                pageNum:-1,
                                pageSize:-1,
                                grade:3
                            },
                            callBack:function (res) {
                                $scope.regionAllList = res.data.list;
                                // var select = $("#slpk3");
                                // for (var i = 0; i < $scope.regionAllList.length; i++) {
                                //     select.append("<option value='"+$scope.regionAllList[i].areaName+"'>"
                                //         + $scope.regionAllList[i].areaName + "</option>");
                                // }
                                // $('.selectpicker3').selectpicker('val', '');
                                // $('.selectpicker3').selectpicker('refresh');
                            }
                        })
                    }

                    //获取督查方案详情
                    function getBasicDetail () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/Inspection/detail',
                            method:'get',
                            params:{
                                id:$scope.id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.title = res.data.title;
                                    $scope.Time1 = res.data.issue;
                                    $scope.renumber = res.data.renumber;
                                    $scope.printTime1 = res.data.printDate;
                                    $scope.createUser = res.data.initiator;
                                    $scope.title = res.data.title;
                                    $scope.content = res.data.content;
                                    $scope.sentRegion = res.data.regionList;
                                    $scope.sentUnit = res.data.unitList;

                                    $scope.sentRegionList = res.data.regionList.split(','); //区名
                                    $scope.sentRegionCodeList = res.data.sentRegion.split(','); //区code

                                    $scope.sentUnitList = res.data.unitList.split(',');//成员单位名称
                                    $scope.sentUnitCodeList = res.data.sentUnit.split(',');//成员单位code

                                    $scope.regionArr = [];//存储区域
                                    if($scope.sentRegionList.length == $scope.sentRegionCodeList.length){
                                        $scope.sentRegionList.map((item , i)=>{
                                            $scope.regionArr.push({
                                                code:$scope.sentRegionCodeList[i],
                                                name:item
                                            })
                                        })
                                    }

                                    $scope.unitArr = [];//存储成员单位
                                    if($scope.sentUnitList.length == $scope.sentUnitCodeList.length){
                                        $scope.sentUnitList.map((item , i)=>{
                                            $scope.regionArr.push({
                                                code:$scope.sentUnitCodeList[i],
                                                name:item
                                            })
                                        })
                                    }

                                    $scope.regionList = [...$scope.regionArr, ...$scope.unitArr];

                                    //获取新建督导组督导区下拉列表
                                    var select = $("#slpk");
                                    for (var i = 0; i < $scope.regionList.length; i++) {
                                        select.append("<option value='"+$scope.regionList[i].code+"'>"
                                            + $scope.regionList[i].name + "</option>");
                                    }
                                    $('.selectpicker').selectpicker('val', '');
                                    $('.selectpicker').selectpicker('refresh');

                                    if(res.data.fileList){
                                        $scope.accessoryURL = [];
                                        $scope.detailData = res.data;
                                        res.data.fileList.map(function (item){
                                            // console.log(item.substring(item.lastIndexOf('/')+1));
                                            $scope.accessoryURL.push({
                                                name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                previewURL:item.previewURL,
                                                downloadURL:item.downloadURL
                                            })
                                        })
                                    }

                                }
                            }
                        })
                    }




                    //获取联络员列表
                    function getContactList (type) {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/ComtactPerson/selectList',
                            method:'get',
                            params:{
                                inspectionid:$scope.id,
                                type:type
                            },
                            callBack:function (res) {
                                if(res.resCode == 1 && res.data){

                                    if(type == 1){ //带队领导
                                        $scope.leaderList = res.data;
                                    }else if(type == 2){//联络员
                                        $scope.contactPersonList = res.data;
                                    }else{
                                        $scope.contactList = res.data;
                                        var select = $("#slpk1");
                                        for (var i = 0; i < $scope.contactList.length; i++) {
                                            select.append("<option value='"+$scope.contactList[i].name + $scope.contactList[i].phone +"'>"
                                                + $scope.contactList[i].name + "</option>");
                                        }
                                        $('.selectpicker').selectpicker('val', '');
                                        $('.selectpicker').selectpicker('refresh');
                                    }
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }

                        })
                    }

                    //新增 修改联络员弹窗
                    $scope.showContact = function (index,id){
                        $('#addContact').modal('show');
                        if(index == 1){//新增
                            $scope.index = 1;
                        }else {//修改
                            $scope.index = 2;
                            $scope.editContactId = id;
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/inspection/v1/ComtactPerson/detail',
                                method:'get',
                                params:{
                                    id:$scope.editContactId
                                },
                                callBack:function (res) {
                                    if(res.data){
                                        $scope.type = res.data.type;
                                        $scope.name = res.data.name;
                                        $scope.duty = res.data.duty;
                                        $scope.phone = res.data.phone;
                                        $scope.region = res.data.region;
                                        $scope.fillUnit = res.data.fillUnit;
                                    }
                                }
                            })
                        }
                    }

                    //保存新增联络员
                    $scope.saveContact = function (id){
                        var params = {
                            inspectionid:$scope.id,
                            type:$scope.type,
                            name:$scope.name,
                            duty:$scope.duty,
                            phone:$scope.phone,
                            region:$scope.region,
                            fillUnit:$scope.fillUnit
                        };

                        if(
                            $scope.type && $scope.name && $scope.duty && $scope.phone && $scope.region && $scope.fillUnit
                        ){
                            var re=/^1\d{10}$/;
                            if(re.test($scope.phone)) {
                                if(id == 1) {//新增联络员
                                    $ajaxhttp.myhttp({
                                        url: apiPrefix + '/inspection/v1/ComtactPerson/add',
                                        method: 'POST',
                                        params: params,
                                        callBack: function (res) {
                                            if(res.resCode == 1){
                                                layer.msg("新增成功！",{time:2000});
                                                $scope.closeContact();
                                                getContactList ();
                                            }else{
                                                layer.msg('服务器异常，请稍后再试',{times:500})
                                            }
                                        }
                                    })
                                }else if(id == 2){//修改联络员
                                    $ajaxhttp.myhttp({
                                        url: apiPrefix + '/inspection/v1/ComtactPerson/update',
                                        method: 'put',
                                        params: {
                                             id:$scope.editContactId,
                                                type:$scope.type,
                                                name:$scope.name,
                                                duty:$scope.duty,
                                                phone:$scope.phone,
                                                region:$scope.region,
                                                fillUnit:$scope.fillUnit
                                        },
                                        callBack: function (res) {
                                            if(res.resCode == 1){
                                                layer.msg("修改成功！",{time:2000});
                                                $scope.closeContact();
                                                getContactList ();
                                            }else{
                                                layer.msg('服务器异常，请稍后再试',{times:500})
                                            }
                                        }
                                    })
                                }

                            }else {
                                layer.alert("请输入合法的手机号", {
                                    skin: 'my-skin',
                                    closeBtn: 1,
                                    anim: 3
                                });
                            }
                        }else{
                            layer.alert("输入的信息不全", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                    }

                    //关闭联络员弹窗
                    $scope.closeContact = function(){
                        $scope.type = '';
                        $scope.name = '';
                        $scope.duty = '';
                        $scope.phone = '';
                        $scope.region = '';
                        $scope.fillUnit = '';
                        $('#addContact').modal('hide');
                    }

                    //查看联络员详情
                    $scope.viewContact = function (id){
                        $('#viewContact').modal('show');
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/ComtactPerson/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.contactData = res.data;
                                }
                            }
                        })
                    }

                    //删除联络员
                    $scope.delete = function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/inspection/v1/ComtactPerson/delete',
                                method:'delete',
                                params:{
                                    id:id
                                },
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('删除成功',{times:500});
                                        getContactList();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                            layer.close(layerIndex);
                        }, function () {

                        });
                    }





                    //获取督导组列表
                    function getSupersingList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/Supervise/selectList',
                            method:'get',
                            params:{
                                inspectionid:$scope.id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1 && res.data){
                                    $scope.supersingList = res.data;
                                    console.log($scope.supersingList);
                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }

                        })
                    }

                    //显示督导组弹窗
                    $scope.addCheck = function (){
                        $('#addCheckGroup').modal('show');
                        getContactList (1);
                        getContactList (2);
                    }

                    //保存督导组信息
                    $scope.saveCheckGroup = function () {
                        var params = {
                            inspectionid:$scope.id,
                            grouping:$scope.groupName,
                            area:$scope.area.join(','),
                            contact:$scope.contact,
                            groupLeader:$scope.groupLeader,
                            supervisePerson:$scope.supervisePerson.join(',')
                        }
                        if(
                            $scope.groupName && $scope.area && $scope.contact && $scope.groupLeader && $scope.supervisePerson
                        ){
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/inspection/v1/Supervise/add',
                                method: 'POST',
                                params: params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("新增成功！",{time:2000});
                                        $scope.closeCheckGroup();
                                        getSupersingList () ;
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

                    //关闭督导组弹窗
                    $scope.closeCheckGroup = function (){
                        $('#addCheckGroup').modal('hide');
                        $scope.groupName = '';
                        $scope.contact = '';
                        $scope.groupLeader = '';
                        $('.selectpicker').selectpicker('val', []);
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker1').selectpicker('val', []);
                        $('.selectpicker1').selectpicker('refresh');
                    }

                    //导出督查组
                    $scope.export = function () {
                        window.open(apiPrefix + '/inspection/v1/Supervise/createExcel?inspectionid=' + $scope.id)
                    }




                    //获取下发小通知列表
                    function sentNoticeList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/ScLittleNotice/selectList',
                            method:'get',
                            params:{
                                inspectionid:$scope.id,

                            },
                            callBack:function (res) {
                                if(res.resCode == 1 && res.data){
                                    if(res.data.length > 0){
                                        $scope.showAddNotice = false;//隐藏发起按钮
                                        $scope.viewNoticeId = res.data[0];
                                        $ajaxhttp.myhttp({
                                            url:apiPrefix + '/inform/v1/informAccept/list',
                                            method:'get',
                                            params:{
                                                reportId:res.data[0],
                                            },
                                            callBack:function (res) {
                                                if(res.resCode == 1 && res.data){
                                                    $scope.noticeList = res.data;
                                                }else{
                                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                                }
                                            }

                                        })
                                    }else{
                                        $scope.showAddNotice = true;//显示发起按钮
                                    }

                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }

                        })

                    }

                    //显示发起通知的弹窗
                    $scope.addNotice = function (){
                        $scope.assessory = [];
                        $scope.addUser = $scope.userInfo.name;
                        var select = $("#slpk3");
                        for (var i = 0; i < $scope.regionList.length; i++) {
                            select.append("<option value='"+$scope.regionList[i].code+"'>"
                                + $scope.regionList[i].name + "</option>");
                        }
                        $('.selectpicker3').selectpicker('val', '');
                        $('.selectpicker3').selectpicker('refresh');
                        $('#addNotice').modal('show');

                    }

                    //保存通知
                    $scope.saveNotice = function (){
                        var params = {
                            inspectionid:$scope.id,
                            title:$scope.addTitle,
                            createDate:$scope.Time,
                            noticeRegion:$scope.addRegion.join(','),
                            noticeContent:$scope.addContent,
                            initiator:$scope.addUser,
                            accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                        }

                        if(
                            $scope.addTitle && $scope.Time && $scope.addRegion && $scope.addContent && $scope.addUser
                        ){

                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/inspection/v1/ScLittleNotice/add',
                                method: 'POST',
                                params: params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("新增成功！",{time:2000});
                                        $scope.viewNoticeId = res.data.id;
                                        $scope.closeNotice();
                                        sentNoticeList () ;
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

                    //关闭发起通知弹窗
                    $scope.closeNotice = function (){
                        $('#addNotice').modal('hide');
                        $scope.addTitle = '';
                        $scope.Time = '';
                        $scope.addContent = '';
                        $('.selectpicker3').selectpicker('val', []);
                        $('.selectpicker3').selectpicker('refresh');
                    }

                    //查看通知
                    $scope.viewNotice = function (){
                        $('#viewNotice').modal('show');
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inspection/v1/ScLittleNotice/detail',
                            method: 'get',
                            params: {
                                id:$scope.viewNoticeId
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.noticeData = res.data;
                                        if(res.data.fileList){
                                            $scope.accessoryURL = [];
                                            $scope.noticeData = res.data;
                                            res.data.fileList.map(function (item){
                                                $scope.accessoryURL.push({
                                                    name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                    previewURL:item.previewURL,
                                                    downloadURL:item.downloadURL
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





                    //搜索督查问题
                    $scope.searchData = function (){
                        getCheckProblem();
                    }
                    //重置搜索条件
                    $scope.reset = function (){
                        $scope.problemType = '';
                        $scope.regionName = '';
                    }

                    // 获取督查问题数据列表
                    function getCheckProblem () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/ScSuperviseProblem/selectList',
                            method:'get',
                            params:{
                                inspectionId:$scope.id,
                                // pageNumber: $scope.paginationConf.currentPage,
                                // pageSize: $scope.paginationConf.itemsPerPage,
                                problemType:$scope.problemType,
                                area:$scope.regionName,
                            },
                            callBack:function (res) {
                                $scope.moduleList = res.data;
                                // $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    //查看督查问题详情
                    $scope.viewProblem = function (id){
                        $('#viewProblem').modal('show');
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/ScSuperviseProblem/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.problemData = res.data;
                                        if(res.data.fileList){
                                            $scope.accessoryURL = [];
                                            $scope.problemData = res.data;
                                            res.data.fileList.map(function (item){
                                                $scope.accessoryURL.push({
                                                    name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                    previewURL:item.previewURL,
                                                    downloadURL:item.downloadURL
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




                    //显示发起督查通报弹窗
                    $scope.addReport = function (){
                        $scope.assessory = [];
                        var select = $("#slpk4");
                        for (var i = 0; i < $scope.regionList.length; i++) {
                            select.append("<option value='"+$scope.regionList[i].code+"'>"
                                + $scope.regionList[i].name + "</option>");
                        }
                        $('.selectpicker4').selectpicker('val', '');
                        $('.selectpicker4').selectpicker('refresh');
                        $('#addReport').modal('show');
                    }

                    //获取督查通报列表
                    function sentReportList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/ScSuperviseNotification/selectList1',
                            method:'get',
                            params:{
                                inspectionid:$scope.id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1 && res.data){
                                    if(res.data.length > 0){
                                        $scope.showAddReport = false;//隐藏发起按钮
                                        $scope.viewReportId = res.data[0];
                                        $ajaxhttp.myhttp({
                                            url:apiPrefix + '/inform/v1/informAccept/list',
                                            method:'get',
                                            params:{
                                                reportId:res.data[0],
                                            },
                                            callBack:function (res) {
                                                if(res.resCode == 1 && res.data){
                                                    $scope.reportList = res.data;
                                                }else{
                                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                                }
                                            }

                                        })
                                    }else{
                                        $scope.showAddReport = true;//显示发起按钮
                                    }

                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }

                        })

                    }

                    //保存通报
                    $scope.saveReport = function (){
                        var params = {
                            inspectionid:$scope.id,
                            title:$scope.reportName,
                            createTime:$scope.reportStartTime,
                            deadline:$scope.reportEndTime,
                            feedbackRegion:$scope.feedBackRegion ? $scope.feedBackRegion.join(',') :'',
                            notificationExplain:$scope.reportContent,
                            accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                        }

                        if(
                            $scope.reportName && $scope.reportStartTime && $scope.reportEndTime && $scope.feedBackRegion && $scope.reportContent
                        ){

                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/inspection/v1/ScSuperviseNotification/add',
                                method: 'POST',
                                params: params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("新增成功！",{time:2000});
                                        $scope.viewReportId = res.data.id;
                                        $scope.closeReport();
                                        sentReportList () ;
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

                    //关闭督查通报弹窗
                    $scope.closeReport = function (){
                        $('#addReport').modal('hide');
                        $scope.reportName = '';
                        $scope.reportStartTime = '';
                        $scope.reportEndTime = '';
                        $scope.reportContent = '';
                        $('.selectpicker4').selectpicker('val', []);
                        $('.selectpicker4').selectpicker('refresh');
                    }

                    //查看通报
                    $scope.viewReport = function (){
                        $('#viewReport').modal('show');
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inspection/v1/ScSuperviseNotification/detail',
                            method: 'get',
                            params: {
                                id:$scope.viewReportId
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.reportData = res.data;
                                        if(res.data.fileList){
                                            $scope.accessoryURL = [];
                                            $scope.reportData = res.data;
                                            res.data.fileList.map(function (item){
                                                $scope.accessoryURL.push({
                                                    name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                    previewURL:item.previewURL,
                                                    downloadURL:item.downloadURL
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

                    //查看通报反馈
                    $scope.viewReportBack = function (item){
                        $('#viewReportBack').modal('show');
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inform/v1/informReply/detail',
                            method: 'get',
                            params: {
                                acceptId:item.id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.reportBackRegion = item.region_name;
                                        $scope.reportBackData = res.data;
                                        if(res.data.fileList){
                                            $scope.accessoryURL = [];
                                            $scope.reportBackData = res.data;
                                            res.data.fileList.map(function (item){
                                                $scope.accessoryURL.push({
                                                    name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                    previewURL:item.previewURL,
                                                    downloadURL:item.downloadURL
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



                    //显示发起一区一单弹窗
                    $scope.addOneRegion = function (){
                        $scope.assessory = [];
                        $('#addOneRegion').modal('show');
                    }

                    //获取一区一单列表
                    function sentOneRegionList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/ScRegionBill/selectList1',
                            method:'get',
                            params:{
                                inspectionid:$scope.id
                            },
                            callBack:function (res) {
                                if(res.resCode == 1 && res.data){
                                    if(res.data.length > 0){
                                        $scope.showAddOneRegion = false;//隐藏发起按钮
                                        $scope.viewOneRegionId = res.data[0];
                                        $ajaxhttp.myhttp({
                                            url:apiPrefix + '/inform/v1/informAccept/list',
                                            method:'get',
                                            params:{
                                                reportId:res.data[0],
                                            },
                                            callBack:function (res) {
                                                if(res.resCode == 1 && res.data){
                                                    $scope.OneRegionList = res.data;
                                                }else{
                                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                                }
                                            }

                                        })
                                    }else{
                                        $scope.showAddOneRegion = true;//显示发起按钮
                                    }

                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }

                        })

                    }

                    //保存一区一单
                    $scope.saveOneRegion = function (){
                        var params = {
                            inspectionid:$scope.id,
                            title:$scope.OneRegionName,
                            deadline:$scope.endFeedbackTime,
                            region:$scope.OneRegion,
                            billExplain:$scope.OneRegionContent,
                            accessoryUrl:$scope.assessory ? $scope.assessory.join(',') : ''
                        }

                        if(
                            $scope.OneRegionName && $scope.endFeedbackTime && $scope.OneRegion && $scope.OneRegionContent
                        ){

                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/inspection/v1/ScRegionBill/add',
                                method: 'POST',
                                params: params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg("新增成功！",{time:2000});
                                        $scope.viewOneRegionId = res.data.id;
                                        $scope.closeOneRegion();
                                        sentOneRegionList () ;
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

                    //关闭一区一单弹窗
                    $scope.closeOneRegion = function (){
                        $('#addOneRegion').modal('hide');
                        $scope.OneRegionName = '';
                        $scope.endFeedbackTime = '';
                        $scope.OneRegion = '';
                        $scope.OneRegionContent = '';
                    }

                    //查看一区一单
                    $scope.viewOneRegion = function (){
                        $('#viewOneRegion').modal('show');
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inspection/v1/ScRegionBill/detail',
                            method: 'get',
                            params: {
                                id:$scope.viewOneRegionId
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.oneRegionData = res.data;
                                        if(res.data.fileList){
                                            $scope.accessoryURL = [];
                                            $scope.oneRegionData = res.data;
                                            res.data.fileList.map(function (item){
                                                $scope.accessoryURL.push({
                                                    name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                    previewURL:item.previewURL,
                                                    downloadURL:item.downloadURL
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


                    //查看一区一单反馈
                    $scope.viewOneRegionBack = function (item){
                        $('#viewOneRegionBack').modal('show');
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inform/v1/informReply/detail',
                            method: 'get',
                            params: {
                                acceptId:item.id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.oneRegionBackRegion = item.region_name;
                                        $scope.oneRegionBackData = res.data;
                                        if(res.data.fileList){
                                            $scope.accessoryURL = [];
                                            $scope.oneRegionBackData = res.data;
                                            res.data.fileList.map(function (item){
                                                $scope.accessoryURL.push({
                                                    name:item.downloadURL.substring(item.previewURL.lastIndexOf('/')+1),
                                                    previewURL:item.previewURL,
                                                    downloadURL:item.downloadURL
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
                        var formFile = new FormData();

                        var fileObj = document.querySelector('input[type=file]').files[0];
                        formFile.append("files", fileObj); //加入文件对象

                        $http({
                                method: 'post',
                                url: apiPrefix + '/inspection/v1/Inspection/upload',
                                data: formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                layer.msg("上传成功");
                                $scope.assessory.push(res.data[0]);
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
                    }

                    // 期号
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime = result;
                        $scope.$apply();
                    });

                    // 通知发起时间
                    var Time = $('#Time').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.Time = result;
                        $scope.$apply();
                    });

                    // 通报发起时间
                    var reportStartTime = $('#reportStartTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.reportStartTime = result;
                        $scope.$apply();
                    });

                    // 通报截止时间
                    var reportEndTime = $('#reportEndTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.reportEndTime = result;
                        $scope.$apply();
                    });

                    // 一区一单截止时间
                    var endFeedbackTime = $('#endFeedbackTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.endFeedbackTime = result;
                        $scope.$apply();
                    });

                    //返回
                    $scope.goBack=function(){
                        routeService.route('2-10',true);

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
                        //console.log(treeNode);
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
                        //console.log($scope.regionName)
                        //console.log('我是区域树关闭...')
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
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getCheckProblem);
                } ]);
})(window, angular);
