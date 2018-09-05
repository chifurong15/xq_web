//状态管理服务
angular.module('app').factory('myStorage',[function(){
	var workLogState = new Object(); //该变量名需唯一
	if(window.sessionStorage.getItem('workLogState')){
		workLogState = JSON.parse(window.sessionStorage.getItem('workLogState'));
	};
	var _setLocal = function(name,data){
		workLogState[name] = data;
		var turnJson = JSON.stringify(workLogState);
		window.sessionStorage.setItem('workLogState',turnJson)
	};
	var _getLocal = function(name){
		if(name){
			return workLogState[name];
		}else{
			return workLogState;
		};
	};
	return {
		_setLocal: _setLocal,
		_getLocal: _getLocal
	};
}]);
//myStorage._setLocal('first', '2222');设置存储数据
//console.log(myStorage._getLocal('first')) 获取存储数据

