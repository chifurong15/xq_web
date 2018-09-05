angular.module('app')
.factory('$ajaxhttp', ['$http', function($http){
    return {
        myhttp: function(opts){ 
            $http(opts).success(function(res){
                if(res.resCode == 1){
                    opts.callBack(res);
                }else if(res.resCode == 0){
                    if(res.resMsg != '' && res.resMsg != null){
                        layer.open({
                            title:'提示',
                            content: res.resMsg
                        });
                    }else{
                        layer.open({
                            title:'提示',
                            content: "请求失败，请检查服务器"
                        });
                    };
                }else if(res.resCode == 1002){
                    if(res.resMsg != '' && res.resMsg != null){
                        layer.open({
                            title:'提示',
                            content: res.resMsg
                        });
                    }else{
                        layer.open({
                            title:'提示',
                            content: "服务器异常，请稍后再试"
                        });
                    };
                }else if(res.resCode == 1003){
                    if(res.resMsg != '' && res.resMsg != null){
                        layer.open({
                            title:'提示',
                            content: res.resMsg
                        });
                    }else{
                        layer.open({
                            title:'提示',
                            content: "未登录，请先登录！"
                        });
                    };
                }else if(res.resCode == 1004){
                    if(res.resMsg != '' && res.resMsg != null){
                        layer.open({
                            title:'提示',
                            content: res.resMsg
                        });
                    }else{
                        layer.open({
                            title:'提示',
                            content: "请求资源不存在"
                        });
                    };
                }else if(res.resCode == 1005){
                    if(res.resMsg != '' && res.resMsg != null){
                        layer.open({
                            title:'提示',
                            content: res.resMsg
                        });
                    }else{
                        layer.open({
                            title:'提示',
                            content: "无操作权限"
                        });
                    };
                }else if(res.resCode == 1008){
                    if(res.resMsg != '' && res.resMsg != null){
                        layer.open({
                            title:'提示',
                            content: res.resMsg
                        });
                    }else{
                        layer.open({
                            title:'提示',
                            content: "非法的请求"
                        });
                    };
                }else if(res.resCode == 1009){
                    if(res.resMsg != '' && res.resMsg != null){
                        layer.open({
                            title:'提示',
                            content: res.resMsg
                        });
                    }else{
                        layer.open({
                            title:'提示',
                            content: "请检查请求参数，必填参数为空"
                        });
                    };
                }else if(res.resCode == 1006){
                    if(res.resMsg != '' && res.resMsg != null){
                        layer.open({
                            title:'提示',
                            content: res.resMsg
                        });
                    }else{
                        layer.open({
                            title:'提示',
                            content: "用户名或密码错误"
                        });
                    };
                }else if(res.resCode == 1007){
                    if(res.resMsg != '' && res.resMsg != null){
                        layer.open({
                            title:'提示',
                            content: res.resMsg
                        });
                    }else{
                        layer.open({
                            title:'提示',
                            content: "密码错误次数达到上限"
                        });
                    };
                };
            }).error(function(res){
                console.log(res);
                alert('服务器异常，请稍后再试');
            });
        }
    }
}]);
/*
调用方法
在对应模块中引入该服务
angular.module('app').controller(
'你的controller'，
[
$ajaxhttp,
function($ajaxhttp){
    $ajaxhttp.myhttp({
        url: baseUrl + '你的对应地址',
        type: 'get', 请求的方法，不传默认为get
        params: params,//请求需要的参数
        callBack: function(res){//请求结果的回调
            console.log(res);
        }
    });
}])
*/