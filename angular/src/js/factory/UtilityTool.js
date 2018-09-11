/**
 * @description:  公共类
 * @author: hsf
 * @date: 2018-9-3 15:46
 */
angular.module('app')
    .factory('UtilityTool', [function(){
        var getType = Object.prototype.toString;

        var _isOwnProperty = function (o, val) {
            return o.hasOwnProperty(val);
        };
        var _isString = function (o){
            return getType.call(o) === "[object String]";
        };
        var _isNumber = function (o) {
            return getType.call(o) === "[object Number]";
        };
        var _isObj = function (o){
            return getType.call(o) === "[object Object]";
        };
        var _isArray = function (o){
            return getType.call(o) === "[object Array]";
        };
        var _isNULL = function (o){
            return getType.call(o) === "[object Null]";
        };

        return {
            isOwnProperty: _isOwnProperty,
            isString: _isString,
            isNumber: _isNumber,
            isObj: _isObj,
            isArray: _isArray,
            isNULL: _isNULL
        }


    }]);