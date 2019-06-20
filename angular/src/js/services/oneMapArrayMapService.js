/**
 * @description:  Map映射类
 * @author: huangshuifa
 * @date: 2018-7-10 11:35
 */
angular.module('app')
    .service('OneMapArrayMapService',[function(){
        var data = [];
        // 保存map值
        this.put = function(key, value) {
            if(data.length > 0){
                for (var i=0;i<data.length;i++) {
                    // 判断key对应的值是否存在，若存在则修改对应的值
                    if (data[i]._key == key) {
                        return data[i]._value = value;
                    } else {
                        data.push({_key: key,_value: value});
                    }
                }
            }else{
                data.push({_key: key,_value: value});
            }

        };
        // 通过key值获取map值
        this.get = function(key) {
            for (var i=0;i<data.length;i++) {
                if (data[i]._key == key) {
                    return data[i]._value;
                }
            }
        };
        // 通过key值删除map对应的值
        this.remove = function(key) {
            for (var i=0;i<data.length;i++) {
                if (data[i]._key == key) {
                    return data.splice(i, 1);
                }
            }
        };
        // 获取全部数据
        this.all = function() {
            return data;
        };
        // 清空map全部数据
        this.removeAll = function() {
            return data.splice(0, data.length);
        };

}]);