(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'supervisingListCtrl',
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
                function supervisingListCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl();
                    // var apiPrefix = 'http://10.0.9.133:7026';
                    var apiPrefix1 = 'http://10.0.9.194:8066';

                    var regionTree;
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/regionTree';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false,
                            'deselectAllText':'取消全选',
                            'selectAllText': '全选',
                        });
                        $scope.isShow = false; //控制现场核查时，重新办理按钮显示  默认不显示

                        getList();
                        getAllRegion ();
                    }

                    // 表格排序
                    $scope.sort = function (id , name) {
                        $scope.column = name;
                        $scope.order = id;
                        getList ();
                    }
                    // 获取数据列表
                    function getList () {
                        var params = {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            project:$scope.project,
                            statTime:$scope.startTime,
                            endTime:$scope.endTime,
                            objectid:$scope.region,
                            proof:$scope.proof,
                            status:$scope.status,
                            type:$scope.type,
                            column:$scope.column ? $scope.column : '',
                            order:$scope.order ? $scope.order : ''
                        }
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/duban/v1/DubanSupervision/list',
                            method:'get',
                            params:params,
                            callBack:function (res) {
                                $scope.moduleList = res.data.list
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    //搜索
                    $scope.searchData = function (){
                        getList ();
                    }

                    //重置搜索条件
                    $scope.reset = function () {
                        $scope.project = '';
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.region = '';
                        $scope.status = '';
                        $scope.proof = '';
                        $scope.type = '';
                    }

                    // //导出
                    // $scope.export = function (){
                    //     window.open(
                    //         apiPrefix
                    //         + '/v1/msMeetingCondition/createExcel?meetingTimeStart='
                    //         + $scope.startTime
                    //         + '&meetingTimeEnd='
                    //         + $scope.endTime
                    //         + '&region='
                    //         + $scope.regionName
                    //         + '&userId='
                    //         + $scope.userInfo.id
                    //         + '&regionId='
                    //         + $scope.userInfo.regionId
                    //     )
                    // }

                    //查看  下载附件
                    $scope.downFile = function (path){
                        window.open($scope.fileUrl + path);
                    }

                    function getAllRegion (){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/duban/v1/DubanSupervision/selectPersonnel',
                            method:'get',
                            callBack:function (res) {
                                $scope.regionList = res.data;
                                var select = $("#slpk");
                                for (var i = 0; i < $scope.regionList.length; i++) {
                                    select.append("<option value='"+$scope.regionList[i].regionId+"'>"
                                        + $scope.regionList[i].regionName + "</option>");
                                }
                                $('.selectpicker').selectpicker('val', '');
                                $('.selectpicker').selectpicker('refresh');
                            }
                        })

                    }


                    $scope.getChange = function (objectid) {
                        $scope.regionNameList = [];
                        objectid.map(function (item){
                            $scope.regionList.map(function(val,index){
                                if(item == val.regionId){
                                    $scope.regionNameList.push(val.regionName)
                                }
                            })
                        })
                    }

                    //显示发起督办弹窗
                    $scope.add = function () {
                        $scope.assessory = [];
                        $('#myModal').modal('show')
                    }


                    // 查看
                    $scope.view = function (id) {
                        $('#myModalView').modal('show');
                        getDetail(id);
                    }
                    function getDetail(id){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/duban/v1/DubanSupervision/detail',
                            method:'get',
                            params:{
                                id:id
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.detailData = res.data;
                                    $scope.enddingTime = $scope.detailData.deadlinedate;
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

                    //查看督办反馈
                    $scope.feedback = function (module){
                        $scope.feedbackId = module.id;
                        $scope.dealStatus = module.status;
                        $scope.selectChange($scope.dealStatus);

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/inform/v1/informAccept/list',
                            method:'get',
                            params:{
                                reportId:module.id,
                                replyStatus: 1
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    if(res.data.length > 0){
                                       $('#myModal2').modal('show');
                                       $scope.feedbackList = res.data;
                                       res.data.map((item)=>{
                                           if(item.replyList[0].fileList){
                                               item.replyList[0].accessoryURL = [];
                                               item.replyList[0].fileList.map(function (val){
                                                   // console.log(item.substring(item.lastIndexOf('/')+1));
                                                   item.replyList[0].fileList.concat()
                                                   item.replyList[0].accessoryURL.push({
                                                       name:val.downloadURL.substring(val.previewURL.lastIndexOf('/')+1),
                                                       previewURL:val.previewURL,
                                                       downloadURL:val.downloadURL
                                                   })
                                               })
                                           }
                                       })

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
                                   }else{
                                       layer.msg('暂无反馈结果',{times:500})
                                   }

                               }else{
                                   layer.msg('服务器异常，请稍后再试',{times:500})
                               }
                            }
                        })

                    }

                    //督办反馈 重新办理 现场核查
                    $scope.save = function (id){
                        if($scope.dealStatus){
                            var params = {
                                id : $scope.feedbackId,
                                status:$scope.dealStatus
                            }
                            if(id == 2){ //现场核查
                                params.whetherinspect = 1
                            }

                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/duban/v1/DubanSupervision/update',
                                method:'put',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        if(id == 1){//重新办理
                                            getDetail($scope.feedbackId);
                                            $('#myModalView1').modal('show');
                                        }else if (id == 3){//保存
                                            layer.msg('保存成功',{times:500})
                                            $('#myModal2').modal('hide');
                                            getList();
                                            $scope.dealStatus = ''
                                        }else{//现场核查
                                            layer.msg('已发起现场核查',{times:500})
                                            $('#myModal2').modal('hide');
                                            getList();
                                            $scope.dealStatus = ''
                                        }
                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }else{
                            layer.alert("请选择处理结果", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            })
                        }

                    }

                    //反馈重新办理
                    $scope.reSave = function (){
                        if($scope.enddingTime){
                            var params =  $scope.detailData;
                            params.resule = '';
                            params.status = '';
                            params.whetherinspect = '';
                            params.deadlinedate = $scope.enddingTime;
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/duban/v1/DubanSupervision/add',
                                method:'post',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('重新发起成功',{times:2000});
                                        $('#myModalView1').modal('hide');
                                        $('#myModal2').modal('hide');
                                        $('#myModal3').modal('hide');
                                        $('#myModalView').modal('hide');
                                        getList();
                                        $scope.enddingTime = '';
                                        $scope.dealStatus = '';

                                    }else{
                                        layer.msg('服务器异常，请稍后再试',{times:500})
                                    }
                                }
                            })
                        }else{
                            layer.alert("请选择截止日期", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            })
                        }
                    }

                    $scope.openImg = function (item) {
                        console.log(item)
                        $('#openImg').show();
                        $('#imgShade').show();
                        $scope.imgUrl = $scope.fileUrl +  item;
                        $("#openImg img").attr("src", $scope.imgUrl);
                    }

                    $scope.closeImg = function () {
                        $('#openImg').hide();
                        $('#imgShade').hide();
                    }

                    // 音视频播放
                    $scope.playVideo = function(item){
                        $('#videoBox').show();
                        $('#audioPlayer').css('display','none');
                        $("#videoPlayerBox").css('display','block');
                        $scope.videoUrl = $scope.fileUrl +  item;
                        $("#videoPlayerBox source").attr("src", $scope.videoUrl);
                        var myPlayer = videojs("videoPlayerBox")
                        myPlayer.ready(function () {
                            myPlayer.play()
                        });
                    };
                    $scope.playAudio = function(item){
                        $('#videoBox').show();
                        $('#audioPlayer').css('display','block');
                        $("#videoPlayerBox").css('display','none');
                        $scope.videoUrl = $scope.fileUrl + item;
                        console.log($("#audioPlayer"))
                        $("#audioPlayer audio").attr("src", $scope.videoUrl);
                        // var myPlayer = $("#audioPlayer");
                        // myPlayer.play()
                    }
                    // 停止并关闭视频、
                    $scope.closePlayer = function(){
                        $('#videoBox').hide();
                    };




                    //现场核查
                    $scope.check = function (module) {
                        $scope.assessory = [];
                        $scope.checkId = module.id;
                        $('#myModal3').modal('show');

                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/duban/v1/DubanSupervision/detailFeedbackhc',
                            method:'get',
                            params:{
                                supervisionid:$scope.checkId
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.checkData = res.data[0];
                                    $scope.checkStatus = $scope.checkData.status;
                                    $scope.selectChange($scope.checkStatus);
                                    $scope.fileList1= [];
                                    $scope.accessoryURL1 = [];
                                    if(res.data[0].assessoryyuan){
                                        var viewUrl = [] ,downUrl = [];
                                        var viewUrl1 = [] ,downUrl1 = [];
                                        $scope.mp3Url = [],$scope.mp4Url = [];
                                        viewUrl1 = res.data[0].assessory.split(',');
                                        downUrl1 = res.data[0].assessoryyuan.split(',');

                                        // console.log(viewUrl1);

                                        viewUrl1.map(function (item,i){
                                            if(item.substring(item.length-3).toLowerCase() == 'mp3'){
                                                $scope.mp3Url.push(viewUrl1[i]);
                                            }else if(item.substring(item.length-3).toLowerCase() == 'mp4'){
                                                $scope.mp4Url.push(viewUrl1[i]);
                                            }else{
                                                viewUrl.push(item)
                                            }
                                        })
                                        downUrl1.map(function (item,i){
                                            if(item.substring(item.length-3).toLowerCase() == 'mp3'){
                                                downUrl.splice(i,1);
                                            }else if(item.substring(item.length-3).toLowerCase() == 'mp4'){
                                                downUrl.splice(i,1);
                                            }else{
                                                downUrl.push(item)
                                            }
                                        })
                                        // console.log('vviewUrl',viewUrl);
                                        // console.log('downUrl',downUrl);
                                        // console.log('mp3Url',$scope.mp3Url);
                                        // console.log('mp4Url',$scope.mp4Url);

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

                                }else{
                                    layer.msg('服务器异常，请稍后再试',{times:500})
                                }
                            }
                        })

                    }

                    //监听现场核查 核查结果
                    $scope.selectChange = function (status){
                        if(status == 3){ //已办结 不显示
                            $scope.isShow = false;
                        }else{
                            $scope.isShow = true;
                        }
                    }
                    //核查保存 、核查重新办理
                    $scope.checkSave = function (id) {
                        var assessory = [];
                        if($scope.assessory){
                            assessory = [...$scope.checkData.assessoryyuan.split(','),...$scope.assessory];
                        }
                        var params = {
                            id:$scope.checkData.id,
                            supervisionid:$scope.checkId,
                            feedbacktime:$scope.checkData.feedbacktime,
                            objectname:$scope.checkData.objectname,
                            description:$scope.checkData.description,
                            status:$scope.checkStatus,
                            assessoryyuan:assessory
                        }
                        if($scope.checkData.feedbacktime && $scope.checkData.objectname && $scope.checkData.description && $scope.checkStatus){
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/duban/v1/DubanSupervision/updateFeedbackhc',
                                method:'put',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        if(id == 1){//重新办理
                                            getDetail($scope.checkId);
                                            $('#myModalView1').modal('show');
                                        }else if(id == 2){//保存
                                            layer.msg('保存成功',{times:2000});
                                            getList();
                                            $('#myModal3').modal('hide');
                                            $scope.checkStatus = '';
                                        }
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
                            })
                        }
                    }

                    // //核查重新办理
                    // $scope.reStartCheck = function (){
                    //     var params = {
                    //         supervisionid:$scope.checkData.id,
                    //         status:$scope.checkStatus
                    //     }
                    //     if($scope.checkStatus){
                    //         $ajaxhttp.myhttp({
                    //             url:apiPrefix + '/duban/v1/DubanSupervision/update',
                    //             method:'put',
                    //             params:params,
                    //             callBack:function (res) {
                    //                 if(res.resCode == 1){
                    //                     layer.msg('已重新办理',{times:2000});
                    //                     getList();
                    //                     $('#myModal3').modal('hide');
                    //                     $scope.checkStatus = '';
                    //                 }else{
                    //                     layer.msg('服务器异常，请稍后再试',{times:500})
                    //                 }
                    //             }
                    //         })
                    //
                    //     }else{
                    //         layer.alert("请选择督办结果", {
                    //             skin: 'my-skin',
                    //             closeBtn: 1,
                    //             anim: 3
                    //         })
                    //     }
                    // }

                    //确认发起
                    $scope.submit =  function () {
                        var params = {
                            title:$scope.supervisingTitle,
                            project:$scope.supervisingProject,
                            proof:$scope.supervisingProof,
                            type:$scope.supervisingType,
                            issuedtime:$("#startTime1").find("input").val(),
                            deadlinedate:$("#endTime1").find("input").val(),
                            reason:$scope.supervisingReason,
                            objectid:$scope.supervisingObjectid ? $scope.supervisingObjectid.join(',') : '',
                            objectname:$scope.regionNameList ? $scope.regionNameList.join(',') : '',
                            address:$scope.supervisingAddress,
                            assessoryyuan:$scope.assessory ? $scope.assessory.join(',') : ''
                        }
                        // console.log(params);
                        if(
                            $scope.supervisingTitle && $scope.supervisingProject
                            && $scope.supervisingProof && $scope.supervisingType
                            && $("#startTime1").find("input").val() && $("#endTime1").find("input").val()
                            && $scope.supervisingReason && $scope.supervisingObjectid
                            && $scope.supervisingAddress
                        )
                        {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/duban/v1/DubanSupervision/add',
                                method:'post',
                                params:params,
                                callBack:function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('发起成功',{times:2000});
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


                    //关闭发起模态框
                    $scope.close = function (){
                        $('#myModal').modal('hide');
                        $scope.supervisingTitle = '';
                        $scope.supervisingProject = '';
                        $scope.supervisingProof = '';
                        $scope.supervisingType = '';
                        $("#startTime1").find("input").val('');
                        $("#endTime1").find("input").val('');
                        $scope.supervisingReason = '';
                        $scope.supervisingAddress = '';
                        $('.selectpicker').selectpicker('val', []);
                        $('.selectpicker').selectpicker('refresh');

                    }

                    //关闭督办结果模态框
                    $scope.closeModal = function () {

                        $('#myModal2').modal('hide');
                    }
                    //关闭核查结果模态框
                    $scope.closeCheckModal = function () {
                        $scope.assessory = [];
                        $('#myModal3').modal('hide');
                        $scope.checkStatus = '';
                        $scope.isShow = false;
                    }


                    //删除
                    $scope.delete =  function (id) {
                        var layerIndex = layer.confirm('确定删除本条数据吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            $ajaxhttp.myhttp({
                                url:apiPrefix + '/duban/v1/msWeekDynamic/delete',
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
                                url: apiPrefix + '/duban/v1/DubanSupervision/upload',
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
                    // 开始时间
                    var startTime1 = $('#startTime1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        // $scope.startTime1 = result;
                        $("#startTime1").find("input").val('');
                        $scope.$apply();
                    });

                    // 结束时间
                    var endTime1 = $('#endTime1').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        // $scope.endTime1 = result;
                        $("#endTime1").find("input").val('');
                        $scope.$apply();
                    });


                    // 结束时间
                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.searchTime = result;
                        $scope.$apply();
                    });

                    //核查时间
                    $('#checkTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.checkData.feedbacktime = result;
                        $scope.$apply();
                    });

                    //核查时间
                    $('#enddingTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.enddingTime = result;
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
                    //动态设置最小值
                    startTime1.on('dp.change', function (e) {
                        endTime1.data('DateTimePicker').minDate(e.date);
                    });
                    //动态设置最大值
                    endTime1.on('dp.change', function (e) {
                        startTime1.data('DateTimePicker').maxDate(e.date);
                    });
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
                        console.log(treeNode);
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
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getList);
                } ]);
})(window, angular);
