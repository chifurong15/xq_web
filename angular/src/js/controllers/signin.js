'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state','$localStorage', 'globalParam','$location','moduleService', function($scope, $http, $state,$localStorage, globalParam,$location,moduleService) {
    $scope.user = {};
    $scope.authError = null;
    $scope.user.username = null;
    $scope.user.password = null;
    $scope.user.code = null;

    $scope.uuid = function(){
        var len=32;//32长度
        var radix=16;//16进制
        var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');var uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];}}}
        return uuid.join('');
    }

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
    ]

}])
;