(function(window, angular) {
	'use strict';
    angular.module('app')
//  angular.module('app', ['ui.router'])
     // service that deals w/ our dojo require
    .service('wish', function () {
        // it's not require... it's a wish?
        var wish = {};

        function _loadDependencies(deps, next) {
        	var reqArr=[] ;
              var keysArr=[];
        	angular.forEach(deps, function(value, key) {
        		keysArr.push(key);
        		reqArr.push(value);
        		  //this.push(key + ': ' + value);
        		});
            
            // use the dojo require (required by arcgis + dojo) && save refs
            // to required obs
            require(reqArr, function () {
                var args = arguments;

                angular.forEach(keysArr, function (name, idx) {
                    wish[name] = args[idx];
                });
                next();
            });
        }

        return {
            loadDependencies: function (deps, next) {
                _loadDependencies(deps, next);
            },

            get: function () {
                return wish;
            }
        };
    });
	})(window, angular);