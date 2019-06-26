(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'superviseReportExamineMgtCtrl', [
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
            function superviseReportDetailMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {

                var apiPrefix = moduleService.getServiceUrl() + '/supervise';
                // var apiPrefix = 'http://10.0.9.133:7023' + '/supervise';

                /**
                 * ==============================================
                 * @name  superviseReportDetailMgtCtrl
                 * @author  | 2018/10/25
                 * @version
                 * @desc  社会监督举报详情
                 * ==============================================
                 */

                var options = {
                    pdfOpenParams: {
                        pagemode: "thumbs",
                        navpanes: 0,
                        toolbar: 0,
                        statusbar: 0,
                        view: "FitV"
                    }
                };


                $scope.init = function(){
                    $scope.eventImgUrl = 'http://10.0.0.196/api/download' ;
                    $scope.showImg = false;
                    /**
                     * 获取详情
                     */
                    getDetalList();

                    getStatusList()

                    $scope.showBut = true;

                    $('#select').attr('disabled',false);
                }

                /**
                 * 处理状态
                 */
                function getStatusList(){
                    $scope.statusList = [
                        {
                            'id':1,
                            'name':'未处理'
                        },
                        {
                            'id':2,
                            'name':'处理完成'
                        },
                        {
                            'id':3,
                            'name':'处理中'
                        },
                        {
                            'id':4,
                            'name':'二次处理'
                        },
                        {
                            'id':5,
                            'name':'多次处理中'
                        },
                    ]
                }

                //查看  下载附件
                $scope.downFile = function (path){
                    window.open(path);
                }

                /**
                 * 获取详情
                 */
                function getDetalList(){
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/socialReport/detailReport',
                        method: 'get',
                        params: {
                            id: localStorage.getItem('id')
                        },
                        callBack: function (res) {
                            if(res.data){
                                $scope.reportList = res.data;
                                $scope.fileList = [] , $scope.fileList1 = [], $scope.fileList2 = [];
                                if(res.data.problemAttant) {
                                    var downUrl = [] ;
                                    downUrl = res.data.problemAttant.split(',');
                                    downUrl.map((item, i) => {
                                        $scope.fileList.push({
                                            name: downUrl[i].substring(downUrl[i].lastIndexOf('/') + 1),
                                            previewURL: item,
                                            downloadURL: downUrl[i]
                                        })
                                    })
                                }

                                if(res.data.proposedTreatment) {
                                    var downUrl = [];
                                    downUrl = res.data.proposedTreatment.split(',');
                                    downUrl.map((item, i) => {
                                        $scope.fileList1.push({
                                            name: downUrl[i].substring(downUrl[i].lastIndexOf('/') + 1),
                                            previewURL: item,
                                            downloadURL: downUrl[i]
                                        })
                                    })
                                }

                                if(res.data.processingResults) {
                                    var downUrl = [];
                                    downUrl = res.data.processingResults.split(',');
                                    downUrl.map((item, i) => {
                                        $scope.fileList2.push({
                                            name: downUrl[i].substring(downUrl[i].lastIndexOf('/') + 1),
                                            previewURL: item,
                                            downloadURL: downUrl[i]
                                        })
                                    })
                                }


                                $scope.status = $scope.reportList.processingStatus;
                                if($scope.reportList.processingStatus == '处理完成'){
                                    $scope.showBut = false;
                                    $('#select').attr('disabled',true);
                                }else{
                                    $scope.showBut = true;
                                    $('#select').attr('disabled',false);
                                }
                                // console.log($scope.status)
                            }

                        }
                    })
                }

                /*批处理意见*/
                $scope.countNum = 512;
                $scope.checkRemark = function () {
                    $scope.countNum = 512 - $scope.processingContent.length;
                    if ($scope.processingContent.length >= 512) {
                        layui.use('layer', function(){
                            var layer = layui.layer //获得layer模块
                            layer.msg("你好，描述字数控制在255字以内！",{time:2000});
                        });
                        $scope.processingContent = $scope.processingContent.substr(0, 512);
                        $scope.countNum = 0;
                    }
                };

                /**
                 * 上传附件
                 */
                $scope.getUploadFile = function(id){
                    if( id == 1 ){
                        $('#coverModal1').modal('show');
                    }
                }

                //查看  下载附件
                $scope.downFile = function (path){
                    window.open($scope.fileUrl + path);
                }

                /**
                 * 关闭上传附件
                 */
                $scope.getUpload = function(id){
                    var formFile = new FormData();
                    if( id == 1 ){
                        $('#coverModal1').modal('hide');
                        var domFiles = document.querySelector('#uploadfile1').files;
                        for (var i = 0; i < domFiles.length; i ++) {
                            formFile.append("file", domFiles[i]);
                        }
                    }

                    $http({
                            method: 'post',
                            url: apiPrefix + '/v1/socialReport/upload',
                            data:formFile,
                            headers: {'Content-Type': undefined},
                            transformRequest: angular.identity
                        }
                    ).success(function (res) {
                        if (res.resCode == 1) {
                            layer.msg("上传成功！");

                            //console.log(res);
                            if(id == 1){
                                $scope.proposedTreatment = res.data;
                            }
                        } else {
                            layer.msg("服务器异常，请稍后再试");
                        }
                    }).error(function (res) {
                        layer.msg('服务器异常，请稍后再试');
                    });
                }

                /**
                 * 查看附件
                 */
                $scope.viewFile = function(id){
                    $('#myModal').modal('show');
                    if(id ==1){
                        if($scope.reportList.problemAttant){
                            var str = $scope.reportList.problemAttant.substring($scope.reportList.problemAttant.length-3);
                            var str1 = $scope.reportList.problemAttant.substring($scope.reportList.problemAttant.length-4);
                            if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'  || str1.toLowerCase() == 'jpeg'){
                                $scope.showImg = true;
                                $scope.imgUrl = $scope.reportList.problemAttant;
                            }else{
                                $scope.showImg = false;
                            }
                        }
                        PDFObject.embed($scope.reportList.problemAttant, "#file", options);
                    }else if(id ==2){
                        $scope.showImg = false;
                        if($scope.reportList.proposedTreatment){
                            var str = $scope.reportList.proposedTreatment.substring($scope.reportList.proposedTreatment.length-3);
                            var str1 = $scope.reportList.proposedTreatment.substring($scope.reportList.proposedTreatment.length-4);
                            if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'  || str1.toLowerCase() == 'jpeg'){
                                $scope.showImg = true;
                                $scope.imgUrl = $scope.reportList.proposedTreatment;
                            }else{
                                $scope.showImg = false;
                            }
                        }
                        PDFObject.embed($scope.reportList.proposedTreatment, "#file", options);
                    }else if(id ==3){
                        $scope.showImg = false;
                        if($scope.reportList.processingResults){
                            var str = $scope.reportList.processingResults.substring($scope.reportList.processingResults.length-3);
                            var str1 = $scope.reportList.processingResults.substring($scope.reportList.processingResults.length-4);
                            if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'  || str1.toLowerCase() == 'jpeg'){
                                $scope.showImg = true;
                                $scope.imgUrl = $scope.reportList.processingResults;
                            }else{
                                $scope.showImg = false;
                            }
                        }
                        PDFObject.embed($scope.reportList.processingResults, "#file", options);
                    }
                }

                //取消查看
                $scope.cancel = function () {
                    $('#myModal').modal('hide');
                }

                $scope.getSubmit = function(){
                    var params = {
                        id: localStorage.getItem('id'),
                        processingContent: $scope.processingContent,
                        proposedTreatment: $scope.proposedTreatment.join(','),
                        feedback: 1,
                        processingStatus: 3,
                    }
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/socialReport/updateReport',
                        method: 'put',
                        params: params,
                        callBack: function (res) {
                            if(res.resCode == 1){
                                layer.msg("审核成功！",{time:2000});
                                routeService.route('3-8', true);
                            }
                        }
                    })
                }

                /**
                 * 返回
                 */
                $scope.getBack = function(){
                    routeService.route('3-8', true);
                }



            }
        ]);

})(window, angular)