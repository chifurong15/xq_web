/**
 * 全局变量,by xiepuyao
 * @author xiepuyao
 * @date 2018/06/04
 */
var HTTP = {
    METHOD: {GET: "get", POST: "post", PUT: "put", DELETE: "delete"},
    RESULTS: {
        RESULT_MSG_SUCCESS: new result(1, "请求成功", function () {
            //请求成功不进行任何操作
            return true;
        }),
        RESULT_MSG_FAILURE: new result(0, "请求失败，请检查服务器", function () {
            alert(this.resMsg);
            return false;
        }),
        RESULT_CODE_EXCEPTION: new result(1002, "服务器异常，请稍后再试", function () {
            alert(this.resMsg);
            return false;
        }),
        RESULT_CODE_NOT_LOGIN: new result(1003, "未登录，请先登录！", function () {
            var r = confirm(this.resMsg);
            if (r) {
                //跳转到登录界面
            }
            return false;
        }),
        RESULT_CODE_NO_EXISTS: new result(1004, "请求接口不存在", function () {
            alert(this.resMsg);
            return false;
        }),
        RESULT_CODE_NOT_AUTHORIZED: new result(1005, "无操作权限", function () {
            var r = confirm(this.resMsg);
            if (r) {
                //跳转到无操作权限界面
            }
            return false;
        }),
        RESULT_CODE_USER_OR_PASSWORD_ERROR: new result(1006, "用户名或密码错误", function () {
            alert(this.resMsg);
            return false;
        }),
        RESULT_CODE_MAX_PASSWORD_ERROR_COUNT: new result(1007, "密码错误次数达到上限", function () {
            alert(this.resMsg);
            return false;
        }),
        RESULT_CODE_ILLEGAL_REQUEST: new result(1008, "非法的请求!", function () {
            var r = confirm(this.resMsg);
            if (r) {
                //跳转到非法请求界面(403)
            }
            return false;
        }),
        RESULT_CODE_PARAMS_EMPTY: new result(1009, "请检查请求参数，必填参数为空", function () {
            alert(this.resMsg);
            return false;
        })
    },

    //针对接口返回码，执行某些操作,默认返回true
    actionForResCode: function (resCode) {
        if (!resCode) {
            return true;
        }
        var flag = true;
        for (var resultName in HTTP.RESULTS) {
            var result = HTTP.RESULTS[resultName];
            if (result.resCode == resCode) {
                flag = result.callback();
                return flag;
            }
        }
        return flag;
    }
};

//请求返回状态
function result(resCode, resMsg, callback) {
    this.resCode = resCode;
    this.resMsg = resMsg;
    this.callback = callback;
}



