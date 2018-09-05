// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/charts/chartUtils/plots/animation/_DonutAnimation",["dojo/_base/declare","dojo/dom-construct","esri/dijit/geoenrichment/utils/animation/Animator","esri/dijit/geoenrichment/ReportPlayer/ReportPlayerState","./_defaults"],function(c,t,m,n,e){return c(null,{_animationMemo:null,_isAnimating:!1,renderAnimation:function(){!this._isAnimating&&this._animationMemo&&this._renderAnimation(this._animationMemo.run,this._animationMemo.t,this._animationMemo.r,this._animationMemo.s,
this._animationMemo.circle,this._animationMemo.slices)},_renderAnimation:function(c,h,p,b,q,k){function r(){l();b.children.forEach(function(a){a.rawNode&&(a.rawNode.style.display="")});d._isAnimating=!1}function l(){g.forEach(function(a){b.remove(a)});g.length=0}var d=this;if(this._animationInfos.length&&this.opt.animate&&(this._animationMemo={run:c,t:h,r:p,s:b,circle:q,slices:k},!n.isChartAnimationSuspended)){var g=[];(function(){d._dataLabels.forEach(function(a){a.style.opacity=0});b.children.forEach(function(a){a.rawNode&&
(a.rawNode.style.display="none")})})();this._isAnimating=!0;(function(){m.animateProperty({duration:d.opt.animate.duration||e.duration,properties:{slice:{start:0,end:1,easing:e.easingFunc}},progressFunction:function(a,b,c){l();d._dataLabels.forEach(function(a){a.style.opacity=c});var f;d._animationInfos.forEach(function(a,b){var e=a.func(d._getSliceValueAt(k,b,h)*c,f?f.end+f.donutGap:void 0,!0);g.push(e.shape);f=e})},endFunction:r})})()}}})});