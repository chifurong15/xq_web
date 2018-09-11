angular.module('app').factory('httpInterceptor', [ '$q','$localStorage','$injector','$window', function($q,$localStorage,$injector,$window){
    return {
        // 请求发出之前，可以用于添加各种身份验证信息
        request: function(config){
        	var rootScope = $injector.get('$rootScope');
        	rootScope.loading = true;
            if($localStorage.userLoginInfo) {
                config.headers['Access-Token'] = $localStorage.userLoginInfo.token;
            }
            return config;
        },
        // 请求发出时出错
        requestError: function(err){
        	var rootScope = $injector.get('$rootScope');
            rootScope.loading = false;
            return $q.reject(err);
        },
        // 成功返回了响应
        response: function(res){
        	var rootScope = $injector.get('$rootScope');
            rootScope.loading = false;
            return res;
        },
        // 返回的响应出错，包括后端返回响应时，设置了非 200 的 http 状态码
        responseError: function(err){
            var rootScope = $injector.get('$rootScope');
            rootScope.loading = false;
            
            if(err.status == 400){
                //alert("用户未登录，请登录！");
                localStorage.clear();
                rootScope.$state.go("access.signin");
            }
            if(err.status == 401){
            	alert("请求模块未分配权限，请联系管理员！" + err.config.url);
            }
            if(err.status == 402){
//                alert("该用户已在其他地方登陆，您被迫下线！");
                localStorage.clear();
                $window.location.reload();
                // rootScope.$state.go("access.signin");
            }
/*            if(err.status == 404){
            	alert("请求模块地址不正确，请联系管理员！" + err.config.url);
            }
            if(err.status == 0){
            	alert("请求模块未启动，请联系管理员！" + err.config.url);
            }*/
            return $q.reject(err);
        }
    };
}]).config([ '$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor'); //添加拦截器
}]);
