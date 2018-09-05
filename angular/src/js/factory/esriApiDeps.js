angular.module('app').factory('esriApiDeps', ['$http', '$q','wish','$rootScope', function($http, $q, wish, $rootScope) {
	return {
		query: function() {
			var deferred = $q.defer(),
				deps = {
					Map: "esri/map",
					Point: "esri/geometry/Point",
					Polyline: "esri/geometry/Polyline",
					Draw: "esri/toolbars/draw",
					Edit: "esri/toolbars/edit",
					Graphic: "esri/graphic",
					SpatialReference: "esri/SpatialReference",
					Font: "esri/symbols/Font",
					GraphicsLayer: "esri/layers/GraphicsLayer",
					FeatureLayer: "esri/layers/FeatureLayer",
					ClusterLayer: "extras/ClusterLayer",
                    TDTLayer: "extras/TDTLayer",
                    MeasureTools: "dijit/MeasureTools",
					Legend: "esri/dijit/Legend",
					InfoTemplate: "esri/InfoTemplate",
					PopupTemplate: "esri/dijit/PopupTemplate",
					Color: "esri/Color",
					array: "dojo/_base/array",
					ClassBreaksRenderer: "esri/renderers/ClassBreaksRenderer",
					TextSymbol: "esri/symbols/TextSymbol",
					PictureMarkerSymbol: "esri/symbols/PictureMarkerSymbol",
					SimpleMarkerSymbol: "esri/symbols/SimpleMarkerSymbol",
					SimpleLineSymbol: "esri/symbols/SimpleLineSymbol",
					SimpleFillSymbol: "esri/symbols/SimpleFillSymbol",
					UniqueValueRenderer: "esri/renderers/UniqueValueRenderer",
					event: "dojo/_base/event",
					parser: "dojo/parser",
					Polygon: "esri/geometry/Polygon",
					Extent: "esri/geometry/Extent",
					registry: "dijit/registry",
					BorderContainer: "dijit/layout/BorderContainer",
					ContentPane: "dijit/layout/ContentPane",
					ToggleButton: "dijit/form/ToggleButton",
					WidgetSet: "dijit/WidgetSet",
					domReady: "dojo/domReady!",
					dom:"dojo/dom",
					Chart2D:"dojox/charting/Chart2D",
					Pie:"dojox/charting/plot2d/Pie",
					dojoxOrange:"dojox/charting/themes/PlotKit/orange",
					dojoxHighlight:"dojox/charting/action2d/Highlight",
					Tooltip:"dojox/charting/action2d/Tooltip",
					MoveSlice:"dojox/charting/action2d/MoveSlice",
					TimeSlider:"esri/dijit/TimeSlider",
					TimeExtent:"esri/TimeExtent",
				};
			wish.loadDependencies(deps, function() {
				deferred.resolve();
				if(!$rootScope.$$phase) {
					$rootScope.$apply();
				}
			});
			
			return deferred.promise;
		}
		
		
		
				
		
	};
}]);