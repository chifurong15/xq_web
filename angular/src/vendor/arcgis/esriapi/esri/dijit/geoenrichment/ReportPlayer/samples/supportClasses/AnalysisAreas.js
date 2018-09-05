// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/samples/supportClasses/AnalysisAreas",["dojo/Deferred","require","../../dataProvider/supportClasses/AnalysisAreaJsonUtil"],function(f,g,h){var e={},k=[[[-1.080010701591563E7,3862641.714572819],[-1.0716918351420047E7,4636712.237704219],[-9901669.439363334,4969050.952364072],[-9909988.305812893,4278585.037050734],[-1.080010701591563E7,3862641.714572819]],[[-1.080010701591563E7,3962641.714572819],[-1.0716918351420047E7,4536712.237704219],[-9901669.439363334,
4769050.952364072],[-9909988.305812893,4078585.037050734],[-1.080010701591563E7,3962641.714572819]]],l=[[[-8238372.646123883,4971599.356069453],[-8236117.753789412,4970600.8973874515],[-8235730.791333708,4968556.206880769],[-8240211.912117044,4969607.216019718],[-8238372.646123883,4971599.356069453]],[[-1.303230266381737E7,3851406.1422664886],[-1.3046519951078394E7,3860043.526462702],[-1.303501617832149E7,3868451.59957406],[-1.303230266381737E7,3851406.1422664886]],[[-8230561.737296041,4970041.951618072],
[-8217605.661001721,4967137.344543238],[-8231746.5112344595,4958347.086290455],[-8230561.737296041,4970041.951618072]],[[-1.3031433192620628E7,3862145.544740542],[-1.302411434716233E7,3860005.3079485595],[-1.3031719831476696E7,3855113.338138315],[-1.3031433192620628E7,3862145.544740542]]];e.getAreas=function(b){for(var a=[],c=0;c<b.numAreas;c++){var d=b.big?k:l,d=d[c]||d[0];a.push(b.isGeographyId?{name:"Area name",shortName:"Area name (short)",description:"Area description",address:"Area address",
latitude:"Area Lat.",longitude:"Area Long.",geographies:[{id:"32",levelId:"US.States"},{id:"06",levelId:"US.States"}]}:{name:"Area name "+(c+1),shortName:"Area name (short)",description:"Area description",address:"Area address",latitude:"Area Lat.",longitude:"Area Long.",feature:{geometry:{rings:[d],spatialReference:{wkid:102100}},attributes:{ATTR_1:1000.12345,ATTR_2:2000.12345,ATTR_3:3000.12345},symbol:{color:[255*Math.random(),255*Math.random(),255*Math.random(),50],outline:{color:[255*Math.random(),
255*Math.random(),255*Math.random(),255],width:1.5,type:"esriSLS",style:"esriSLSSolid"},type:"esriSFS",style:"esriSFSSolid"},infoTemplate:{fieldInfos:[{fieldName:"ATTR_1",label:"Attribute 1",format:{places:1},visible:!0},{fieldName:"ATTR_2",label:"Attribute 2",format:{places:2},visible:!0},{fieldName:"ATTR_3",label:"Attribute 3",format:{places:3},visible:!0}]}}})}b.initialize&&(a=h.areasFromJson(a),a.forEach(function(a){a.feature&&(a.feature.getLayer=function(){return{hasAttachments:!0,queryAttachmentInfos:function(){var a=
new f;g(["../../core/supportClasses/images/DefaultAttachment"],function(b){a.resolve([{url:b}])});return a.promise}}})}));return a};return e});