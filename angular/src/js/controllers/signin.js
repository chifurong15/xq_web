'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state','$localStorage', 'globalParam','$location','moduleService','$ajaxhttp', function($scope, $http, $state,$localStorage, globalParam,$location,moduleService,$ajaxhttp) {

    var apiPrefix = moduleService.getServiceUrl() + '/bulletin';
    var apiPrefix2 = moduleService.getServiceUrl() + '/statistic';
    var apiPrefix3 = moduleService.getServiceUrl() + '/quality';

    $scope.user = {};
    $scope.authError = null;
    $scope.user.username = null;
    $scope.user.password = null;
    $scope.user.code = null;

    //是否是门户网站
    $scope.isPortals=false;

    $scope.uuid = function(){
        var len=32;//32长度
        var radix=16;//16进制
        var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');var uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];}}}
        return uuid.join('');
    };

    /* $.ajax({
         type : "Get",
         url : "config/ip.json",
         async : false
     }).done(function(data){
 //  	  if($localStorage.ipAdd == undefined){
         $localStorage.ipAdd = data['ip'];
         console.log("the oms address valid.");
 //  	  }
     });*/

    $scope.login = function() {

        $scope.authError = null;
        $localStorage.userLoginInfo = {};
        $http({
            method: 'POST',
            url: $localStorage.serviceUrl + "/login/login",
            params: {loginName:$scope.user.username,password:$scope.user.password,imageCode:$scope.user.code,imageCodeId:uuid},
        }).then(function successCallback(resp) {
            if(resp.data.resCode == 0)
            {
                $scope.authError = resp.data.resMsg;
                $scope.user.password = null;
                $scope.user.code = null;
                $localStorage.userLoginInfo = null;
                $scope.freshCode();
            }else{
                globalParam.setter({"accessToken":resp.data.data.tokenInfo.token});
                $localStorage.userLoginInfo.token = resp.data.data.tokenInfo.token;
                $localStorage.userLoginInfo.userInfo = resp.data.data.userDTO;
                $localStorage.userLoginInfo.roleInfo = resp.data.data.smRoleDTO;
                $state.go('app.dashboard-v1');
                //重新加載用戶權限
                moduleService.getConfig();
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            $scope.authError = '服务器异常！';
        });

    }

    var uuid = $scope.uuid();
    var requestUrl = $localStorage.serviceUrl.replace("http:","") + "/randImage/imageCode?imageCodeId="+uuid;
    $scope.validecode = {'background': 'url('+requestUrl+') no-repeat'};
    $scope.freshCode = function()
    {
        $scope.validecode = {'background': 'url('+requestUrl+'&date=' + new Date().getSeconds() + ') no-repeat'};
    }

    $scope.initPlatformInfo = function () {
        // $scope.authError = "初始化平台信息失败!";
        if($localStorage.platformInfo)
        {
            $scope.app.name = $localStorage.platformInfo.name;
            $scope.app.logo = $localStorage.platformInfo.logoPath;
            $scope.app.support = $localStorage.platformInfo.technicalSupport;
            $scope.app.hotline = $localStorage.platformInfo.serviceHotline;
            $scope.authError = null;
        }else{
            // $scope.authError = "初始化平台信息失败!";
        }

        //支持智慧水利单点登陆
        var singleUrl = $location.absUrl();
        if(singleUrl.includes('singlesignon')){
            var token = singleUrl.split('?singlesignon=')[1];
        }

        if(token){
            $scope.authError = null;
            $localStorage.userLoginInfo = {};

            $.ajax({
                type : "POST",
                url: $localStorage.serviceUrl + "/login/singleLogin",
                async : false,
                data: {token:token}
            }).done(function(resp){
                if(resp.resCode == 0)
                {
                    $scope.authError = resp.resMsg;
                    $scope.user.password = null;
                    $scope.user.code = null;
                    $localStorage.userLoginInfo = null;
                    $scope.freshCode();
                }else{
                    globalParam.setter({"accessToken":token});
                    $localStorage.userLoginInfo.token = token;
                    $localStorage.userLoginInfo.userInfo = resp.data.userDTO;
                    $localStorage.userLoginInfo.roleInfo = resp.data.smRoleDTO;
                    $state.go('app.dashboard-v1');
                }
            })
        }

//        if(token){
//        	$scope.authError = null;
//            $localStorage.userLoginInfo = {};
//            $http({
//                method: 'POST',
//                url: $localStorage.ipAdd + "/login/singleLogin",
//                params: {token:token},
//            }).then(function successCallback(resp) {
//                if(resp.data.resCode == 0)
//                {
//                    $scope.authError = resp.data.resMsg;
//                    $scope.user.password = null;
//                    $scope.user.code = null;
//                    $localStorage.userLoginInfo = null;
//                    $scope.freshCode();
//                }else{
//                	globalParam.setter({"accessToken":token});
//                    $localStorage.userLoginInfo.token = token;
//                    $localStorage.userLoginInfo.userInfo = resp.data.data.userDTO;
//                    $localStorage.userLoginInfo.roleInfo = resp.data.data.smRoleDTO;
//                    $state.go('app.dashboard-v1');
//                }
//            }, function errorCallback(response) {
//                // 请求失败执行代码
//            });
//        }


    }

    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [];
    $scope.addSlide = function () {
//        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: 'img/login/1.jpg',
            text: '1'
        });
        slides.push({
            image: 'img/login/2.jpg',
            text: '2'
        })/*;
        slides.push({
            image: 'img/login/3.jpg',
            text: '3'
        });
        slides.push({
            image: 'img/login/4.jpg',
            text: '4'
        })*/
    };
    $scope.addSlide();

    $scope.codeList = [
        {
            'id': '1',
            'name': '安卓专业',
            'scan': '下载Android专业版APP',
            'src': 'img/login/android_ZY.png'
        },
        {
            'id': '2',
            'name': '苹果专业',
            'scan': '下载iOS专业版APP',
            'src': 'img/login/ios_ZY.png'
        }
    ];

    $scope.portalsInit=function(){
        $scope.isPortals=true;
        $scope.getBulletin();
        $scope.getRegionSort();
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day=date.getDate();
        if(month == 0){
            month = 12;
            year = year - 1;
        }
        $scope.month= day<16 ? month-1:month;
        $scope.month =  month < 10 ? '0' + month : month;
        $scope.year = year;
    };

    // 区考核排名列表
    $scope.getRegionSort=function() {
        $ajaxhttp.myhttp({
            url: apiPrefix2 + '/v1/statistic/regionStatistic',
            method: 'get',
            params:{
                // date:$scope.defaultTime
                // date:'2018-11'
            },
            callBack: function (res) {
                if(res.resCode == 1){
                    $scope.regionSortList = res.data;
                    $scope.sortRegion = [],$scope.sortRegionScore = [];

                    if(Array.isArray(res.data) && res.data.length == 0){
                        $scope.sortRegion = ['蓟州区', '静海区', '宁河区', '滨海新区', '宝坻区',
                            '武清区', '北辰区', '津南区', '西青区', '东丽区', '红桥区', '河北区',
                            '南开区', '河西区', '河东区', '和平区']
                        $scope.sortRegionScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }else{
                        $scope.regionSortList.map(function (item){
                            $scope.sortRegion.push(item.regionName)
                            $scope.sortRegionScore.push(Number(item.resultScore))
                        })
                    }
                    // console.log($scope.sortRegion);
                    // console.log($scope.sortRegionScore);

                    getInitCharts()
                }else{
                    layer.msg(res.resMsg, {time:2000});
                }
            }
        })

        $ajaxhttp.myhttp({
            url: apiPrefix3 + '/v1/WaterQualityGrade/selectWaterQualityPercent',
            method: 'get',
            callBack: function (res) {
                if(res.resCode == 1){
                    $scope.waterList = res.data;
                    $scope.waterType1 = ['Ⅰ-Ⅲ类','Ⅳ类', 'Ⅴ类'];
                    $scope.waterType2 = [ 'Ⅵ-Ⅶ类', 'Ⅷ-Ⅸ类','河干'];

                    getInitCharts()
                    // console.log('dddd',$scope.waterList);
                }else{
                    layer.msg(res.resMsg, {time:2000});
                }
            }
        })
    }

    function getInitCharts(){
        var myChart = echarts.init(document.getElementById('main'));
        var myChart1 = echarts.init(document.getElementById('main1'));
        var option = {
            tooltip: {
                trigger: 'item',
                confine: true,
                formatter: function (params) {
                    return params.name + ' </br> ' + params.value + '个' +'(' + params.percent + '%)';
                }
            },
            color: ['#72a7f5', '#1153b5', '#20d850','#d2d820', '#e92432', '#3b3636'],
            legend: [
                {
                    orient: 'vertical',
                    icon: "circle",
                    x: '65%',
                    y: '25%',
                    itemWidth: 10,  // 设置宽度
                    itemHeight: 10, // 设置高度
                    itemGap: 5 ,// 设置间距
                    bottom: '15%',
                    data:$scope.waterType1,
                },
                {
                    orient: 'vertical',
                    icon: "circle",
                    x: '80%',
                    y: '25%',
                    itemWidth: 10,  // 设置宽度
                    itemHeight: 10, // 设置高度
                    itemGap: 5 ,// 设置间距
                    bottom: '15%',
                    data: $scope.waterType2,
                }
            ],
            series: [{
                name: '',
                type: 'pie',
                radius: ['30%', '50%'],
                center: ['30%', '35%'],
                data: [
                    {
                        value: $scope.waterList ? $scope.waterList.one : 0,
                        percent:$scope.waterList ? $scope.waterList.onePercent : 0,
                        name: 'Ⅰ-Ⅲ类'
                    },
                    {
                        value: $scope.waterList ? $scope.waterList.two : 0,
                        percent:$scope.waterList ? $scope.waterList.twoPercent : 0,
                        name: 'Ⅳ类'
                    },
                    {
                        value: $scope.waterList ? $scope.waterList.three : 0,
                        percent:$scope.waterList ? $scope.waterList.threePercent : 0,
                        name: 'Ⅴ类'

                    },
                    {
                        value: $scope.waterList ? $scope.waterList.four : 0,
                        percent:$scope.waterList ? $scope.waterList.fourPercent : 0,
                        name: 'Ⅵ-Ⅶ类'
                    },
                    {
                        value: $scope.waterList ? $scope.waterList.five : 0,
                        percent:$scope.waterList ? $scope.waterList.fivePercent : 0,
                        name: 'Ⅷ-Ⅸ类'
                    },
                    {
                        value: $scope.waterList ? $scope.waterList.six : 0,
                        percent:$scope.waterList ? $scope.waterList.sixPercent : 0,
                        name: '河干'
                    }
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    normal: {
                        textStyle: {
                            color: '#333'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                }
            }]
        };
        // 使用刚指定的配置项和数据显示图表。

        var option1 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
                formatter: function (params) {
                    return params[0].name + ' : ' + params[0].value;
                }

            },
            color: ['#ff0000', '#000000', '#000099', '#008000', '#00dd88'],
            grid: {
                top: '3%',
                left: '15%',
                height: '110'
            },
            xAxis: [{
                type: 'value',
                position: 'bottom',
                data: [],
                axisTick: {
                    alignWithLabel: false
                }
            }],
            yAxis: {
                type: 'category',
                data:$scope.sortRegion,
                nameLocation: 'start',
                nameTextStyle: {
                    fontSize: 10
                },
            },
            series: [{
                name: '',
                type: 'bar',
                data:$scope.sortRegionScore,
                barWidth: '30%',
                barGap: '1%',
                itemStyle: {   //配置样式，设置每个柱子的颜色
                    normal: {
                        color: function (params) {
                            var colorList = ['#60a6ec', '#0473e2', '#00ae4f', '#ffc000', '#de1414', '#60a6ec', '#0473e2', '#00ae4f', '#ffc000', '#de1414', '#60a6ec', '#0473e2', '#00ae4f', '#ffc000', '#de1414', '#00ae4f'];
                            return colorList[params.dataIndex];
                        }
                    }
                }
            }]
        };
        myChart.setOption(option);
        myChart1.setOption(option1);
    }

    $scope.getBulletin=function(){

        //工作简报
        $http({
            url: apiPrefix + '/v1/bulletin/selectByFirst?type=3',
            method: 'get'
        }).success(function (res) {
            $scope.bulletin3 = res;
        });

        //督导检查
        $http({
            url: apiPrefix + '/v1/bulletin/selectByFirst?type=5',
            method: 'get'
        }).success(function (res) {
            $scope.bulletin4 = res;
        });
    };

    // 通报预览
    $scope.viewBulletin = function (id) {

        globalParam.setter({
            bulletin: {
                id: id
            }
        })
        getData(id);
        $scope.shrink();
        $('#myModal').modal('show');
    }

    // 数据详情
    function getData(id) {
        $ajaxhttp.myhttp({
            url: apiPrefix + '/v1/bulletin/detail',
            method: 'get',
            params: {
                id: id
            },
            callBack: function (res) {
                $scope.bulletin = res.data;
                //var attandNamePart = res.data.attandUrl.split('_');
                if($scope.bulletin.detail){
                    $scope.bulletin.detail = $sce.trustAsHtml($scope.bulletin.detail)
                }
                if($scope.bulletin.ren){
                    var i = $scope.bulletin.ren.indexOf('.');
                    var str = $scope.bulletin.ren.slice(i+1);
                    // console.log(str)
                    if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'){
                        $scope.showImg = true;
                    }else{
                        $scope.showImg = false;
                        var options = {
                            pdfOpenParams: {
                                pagemode: "thumbs",
                                navpanes: 0,
                                toolbar: 0,
                                statusbar: 0,
                                view: "FitV"
                            }
                        };
                        PDFObject.embed($scope.bulletin.attand_url, "#pdfOb", options);
                    }
                }
            }
        })
    }

    $scope.enlarge = function () {
        $('.modal-dialog').addClass('enlarge');
        $('.modal-body').addClass('enlarge');
    }
    $scope.shrink = function () {
        $('.modal-dialog').removeClass('enlarge');
        $('.modal-body').removeClass('enlarge');
    }
    $scope.cancel = function () {
        $('#myModal').modal('hide');
    }
}])
;