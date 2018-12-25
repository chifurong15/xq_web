(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'notificationReplyCtrl',
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
                function notificationReplyCtrl($localStorage, $scope,
                                                $location, $log, $q, $rootScope, $window,
                                                routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl();
                    //var apiPrefix = 'http://10.0.9.194:8066';

                    //var apiPrefix1 = 'http://10.0.9.203:8080';

                    // apiPrefix2 = 'http://10.0.9.133:7026';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;



                    $scope.init = function () {

                        $scope.reportPerson = $scope.userInfo.name;
                        $scope.assessory = [];
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false
                        });

                        $scope.regionList = [];

                        $scope.noticeModule = JSON.parse(localStorage.getItem('module'));
                        $scope.noticeId = $scope.noticeModule.reportId;
                        $scope.informType = $scope.noticeModule.informType;
                        $scope.answerId = $scope.noticeModule.id;
                        $scope.replyStatus = $scope.noticeModule.replyStatus;
                        $scope.isreply = $scope.noticeModule.isreply;
                        getSuperisionDetail ();
                        getSuperisionCheckDetail ();
                        getOneRegionDetail ();

                        if($scope.informType == 600101 || $scope.informType == 600107){

                            $scope.informType_name = '通知';
                            if($scope.informType == 600101){
                                getNoticeDetail();
                            }else{
                                getSmallNotice ();
                            }


                        }else if($scope.informType == 600102){

                            $scope.informType_name = '通报';

                            getNoticeDetail();

                            if($scope.replyStatus == 1){
                                getDetail ();
                            }

                        }else if($scope.informType == 600103){

                            $scope.informType_name = '督查';

                            getSuperisionCheckDetail ();

                            if($scope.replyStatus == 1){
                                getContactList ();
                            }

                        }else if($scope.informType == 600104){

                            $scope.informType_name = '督办';

                            getSuperisionDetail ();

                            if($scope.replyStatus == 1){
                                getDetail ();
                            }

                        }else if($scope.informType == 600109){ //督查

                            $scope.informType_name = '一区一单';

                            getOneRegionDetail ();

                            if($scope.replyStatus == 1){
                                getDetail ();
                            }
                        }else if($scope.informType == 600108){ //督查

                            $scope.informType_name = '督查通报';
                            getSupersionReport ();

                            if($scope.replyStatus == 1){
                                getDetail ();
                            }
                        }

                        // if($scope.informType == 600106){
                        //     $scope.informType_name = '暗查暗访';
                        // }
                    }

                    //获取通知通报详情
                    function getNoticeDetail (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inform/v1/informReport/detail',
                            method: 'get',
                            params:{
                                id:$scope.noticeId
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.detailData = res.data;
                                        if(res.data.fileList){
                                            $scope.accessoryURL = [];
                                            $scope.detailData = res.data;
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
                                    layer.msg(res.resMsg, {time:2000});
                                }
                            }
                        })
                    }

                    //获取小通知详情
                    function getSmallNotice () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inspection/v1/ScLittleNotice/detail',
                            method: 'get',
                            params: {
                                id:$scope.noticeId
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

                    //答复
                    $scope.saveReport = function (){
                        var params = {
                            acceptId: $scope.answerId,
                            replyDate:$scope.reportTime,
                            result:$scope.result,
                            replyPerson:$scope.reportPerson,
                            description:$scope.reportContent,
                            accessoryURL:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        if($scope.reportTime && $scope.reportPerson && $scope.reportContent){
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/inform/v1/informReply/add',
                                method:'post',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        routeService.route('2-9', true);
                                        layer.msg('答复成功',{times:2000});
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

                    //答复详情
                    function getDetail (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inform/v1/informReply/detail',
                            method: 'get',
                            params: {
                                acceptId: $scope.answerId
                            },
                            callBack: function (res) {
                                if (res.resCode == 1) {
                                    $scope.detailData1 = res.data[0];
                                    if (res.data[0].fileList) {
                                        $scope.accessoryURL1 = [];
                                        res.data[0].fileList.map(function (item) {
                                            $scope.accessoryURL1.push({
                                                name: item.downloadURL.substring(item.previewURL.lastIndexOf('/') + 1),
                                                previewURL: item.previewURL,
                                                downloadURL: item.downloadURL
                                            })
                                        })
                                    }

                                } else {
                                    layer.msg('服务器异常，请稍后再试', {times: 500})
                                }
                            }
                        })
                    }





                    //获取督办详情
                    function getSuperisionDetail () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/duban/v1/DubanSupervision/detail',
                            method: 'get',
                            params: {
                                id:$scope.noticeId
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    if(res.data){
                                        $scope.supersionData = res.data;
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

                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })
                    }


                    //获取督查详情
                    function getSuperisionCheckDetail () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/Inspection/detail',
                            method:'get',
                            params:{
                                id:$scope.noticeId
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

                    //获取督查通报详情
                    function getSupersionReport () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inspection/v1/ScSuperviseNotification/detail',
                            method: 'get',
                            params: {
                                id:$scope.noticeId
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



                    //获取一区一单详情
                    function getOneRegionDetail () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/inspection/v1/ScRegionBill/detail',
                            method: 'get',
                            params: {
                                id:$scope.noticeId
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


                    //获取联络员列表
                    function getContactList (type) {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inspection/v1/ComtactPerson/selectList',
                            method:'get',
                            params:{
                                inspectionid:$scope.noticeId,
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
                            inspectionid:$scope.noticeId,
                            type:$scope.type,
                            name:$scope.name,
                            duty:$scope.duty,
                            phone:$scope.phone,
                            region:$scope.region,
                            fillUnit:$scope.fillUnit
                        };
                        console.log(params);
                        if(
                            $scope.type && $scope.name && $scope.duty && $scope.phone && $scope.region && $scope.fillUnit
                        ){
                            var re=/^1\d{10}$/;
                            if(re.test($scope.phone)) {
                                if(id == 1) {//新增联络员
                                    params.feedbackid = $scope.answerId;
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
                                url: apiPrefix + '/inform/v1/informReport/upload',
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

                    // 通知通报答复时间
                    $('#reportTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.reportTime = result;
                        $scope.$apply();
                    });


                    //返回
                    $scope.goBack=function(){
                        routeService.route('2-9', true);
                    }

                } ]);
})(window, angular);