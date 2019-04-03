var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var waterUrl = modulePrefix + "/v1/waterSystem";
var riverUrl = modulePrefix + "/v1/river";
var lakesUrl = modulePrefix + "/v1/lakes";
var reservoirUrl = modulePrefix + "/v1/reservoir";
var reachUrl = modulePrefix + "/v1/reach";
var dictionaryUrl = modulePrefix + "/v1/dictionary";
(function(window, angular) {
	'use strict';
	var app = angular.module("app");
	app.controller(
		'chiefDirectoryDetail', ['$localStorage','$scope','$rootScope','routeService','moduleService','$http',
		function chiefDirectoryEdit($localStorage, $scope, $rootScope, routeService,moduleService, $http) {
            if(!$localStorage.chiefDetailData){
                layer.msg('获取数据失败,请重试');
                return;
            }
            $scope.chief = $localStorage.chiefDetailData;
            $scope.chief.doc ?  $scope.chief.docId = $scope.chief.doc.id : '';
            $scope.chief.doc ?  $scope.chief.docName = $scope.chief.doc.filename: '';
            // $scope.chief.docId = $scope.chief.doc.id || '';
            // $scope.chief.docName = $scope.chief.doc.filename || '';
            $scope.chief.reach = filterName($scope.chief.reachIds);
            $scope.chief.lake = filterName($scope.chief.lakesIds);
            $scope.chief.reservoir = filterName($scope.chief.reservoirIds);
            $scope.chief.pond = filterName($scope.chief.pond);


            $scope.doc = {};
            $scope.file = {};
			/*页面初始化方法*/
			$scope.init = function() {
                let length = $scope.chief.roles.length;
                let rolesArr = [];
                if(length){
                    for(let i = 0; i<length; i++){
                        rolesArr.push($scope.chief.roles[i].name)
                    }
                    $scope.rolesName = rolesArr.join()
                }
            };
            
             function filterName(arr){
                var brr = [];
                if(arr && arr.length != 0){
                    angular.forEach(arr,function(each){
                        brr.push(each.name);
                    })
                }
                return brr;
            }

            $scope.back = function() {
                routeService.route(118, true);
            }
		}
	]);
})(window, angular);