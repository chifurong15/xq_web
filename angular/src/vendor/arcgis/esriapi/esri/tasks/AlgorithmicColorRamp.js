// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/tasks/AlgorithmicColorRamp","dojo/_base/declare dojo/_base/lang dojo/has ../kernel ../Color ./ColorRamp".split(" "),function(b,d,e,f,c,g){b=b(g,{declaredClass:"esri.tasks.AlgorithmicColorRamp",type:"algorithmic",fromColor:null,toColor:null,algorithm:null,toJson:function(){var a;switch(this.algorithm&&this.algorithm.toLowerCase()){case "cie-lab":a="esriCIELabAlgorithm";break;case "hsv":a="esriHSVAlgorithm";break;case "lab-lch":a="esriLabLChAlgorithm"}a={type:"algorithmic",algorithm:a};
a.fromColor=c.toJsonColor(this.fromColor);a.toColor=c.toJsonColor(this.toColor);return a}});e("extend-esri")&&d.setObject("tasks.AlgorithmicColorRamp",b,f);return b});