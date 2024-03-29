angular.module('app')
    .service('routeService', ['$document', '$q', '$timeout', '$http', '$state','$localStorage', function ($document, $q, $timeout, $http, $state,$localStorage) {

        //平台提供的路由能力，业务侧路由到自己的页面，业务侧需要配置Pages内容
        this.route = function(seqId,isMenu,type){
            //TODO 根据pageId 获取对应的页面跳转。
            //判断isMenuPage为真，则是Menus里面的配置，否则是Pages里面的配置

            var moduleId = $localStorage.platformRouterConfig['moduleId'];
            var targetState = moduleId;
            targetState = type ? ( targetState+"_"+type+"_"+seqId) : (isMenu ? (targetState+"_1_"+seqId): (targetState+"_3_"+seqId));
            // if(isMenu){
            //           targetState = targetState+"_1_"+seqId;
            // }else {
            //           targetState = targetState+"_3_"+seqId;
            // }
            // $localStorage.platformRouterConfig['moduleId']
            // $localStorage.platformRouterConfig['type']
            // $localStorage.platformRouterConfig['serviceUrl']

            //调用路由
            console.log("$state.go :" + targetState);
            $state.go("app.index", {'param' : targetState});
        }
    }]);