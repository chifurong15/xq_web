// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/analysis/customgp/editorManager","dojo/_base/array dojo/on dojo/aspect dijit/form/Select dijit/form/TextBox dijit/form/CheckBox ./common/dijit/URLInput ./editors/simpleEditors ./editors/DataFileEditor ./editors/RasterLayerEditor ./editors/SelectFeatureSetFromLayer".split(" "),function(l,x,n,p,q,y,r,e,t,u,v){function w(a,d,b){return a.editorName&&0>a.dataType.indexOf("GPMultiValue")?a.editorName:"input"===d?"GPMultiValue:GPFeatureRecordSetLayer"===a.dataType?"UnsupportEditor":-1<
a.dataType.indexOf("GPMultiValue")&&a.choiceList&&0<a.choiceList.length?"MultiValueChooser":-1<a.dataType.indexOf("GPMultiValue")&&(!a.choiceList||0===a.choiceList.length)?"MultiValueEditor":"GPLong"===a.dataType?"LongNumberTextBox":"GPDouble"===a.dataType?"DoubleNumberTextBox":"GPString"===a.dataType?a.choiceList&&0<a.choiceList.length?"Select":"TextBox":"GPBoolean"===a.dataType?"CheckBox":"GPLinearUnit"===a.dataType?"LinerUnitEditor":"GPDate"===a.dataType?"DateTimeEditor":"GPDataFile"===a.dataType?
"DataFileEditor":"GPRasterDataLayer"===a.dataType?"RasterLayerEditor":"GPRecordSet"===a.dataType?"SimpleJsonEditor":"GPFeatureRecordSetLayer"===a.dataType?"setting"===b?"FeatureSetEditorChooser":"draw"===a.featureSetMode?"SelectFeatureSetFromDraw":"layers"===a.featureSetMode?"SelectFeatureSetFromLayer":"url"===a.featureSetMode?"SelectFeatureSetFromUrl":"file"===a.featureSetMode?"SelectFeatureSetFromFile":"UnsupportEditor":"UnsupportEditor":"GPFeatureRecordSetLayer"===a.dataType?"FeatureSetResultEditor":
"GPRecordSet"===a.dataType?"RecordSetEditor":"MapServiceLayer"===a.dataType?"MapServiceLayer":"ShowMessage"}var g={},m,h=[],k;g.createEditor=function(a,d,b,f){var c;d=w(a,d,b);b={param:a,widgetUID:f?f.uid:void 0,widget:f?f.widget:void 0,config:f?f.config:void 0,appConfig:f?f.appConfig:void 0,map:m,nls:k,context:b,editorManager:g,style:{width:"100%"}};"UnsupportEditor"===d?(b.message="type "+a.dataType+" is not supported for now.",c=new e.UnsupportEditor(b)):"ShowMessage"===d?(b.message="GPRecordSet"===
a.dataType?"table":"GPDataFile"===a.dataType||"GPRasterDataLayer"===a.dataType?"link":"text",c=new e.UnsupportEditor(b)):"MapServiceLayer"===d?(b.message=k.useResultMapService,c=new e.UnsupportEditor(b)):"MultiValueChooser"===d?c=new e.MultiValueChooser(b):"MultiValueEditor"===d?c=new e.MultiValueEditor(b):"LongNumberTextBox"===d?c=new e.LongNumberEditor(b):"DoubleNumberTextBox"===d?c=new e.DoubleNumberEditor(b):"Select"===d?(f=[],void 0!==a.defaultValue&&""!==a.defaultValue||f.push({value:"",label:""}),
f=f.concat(l.map(a.choiceList,function(a){return{label:a,value:a}})),b.gEditor=new p({options:f,value:void 0===a.defaultValue||""===a.defaultValue?"":a.defaultValue}),b.editorName="Select",c=new e.GeneralEditorWrapperEditor(b)):"TextBox"===d?(b.gEditor=new q({value:void 0===a.defaultValue?"":a.defaultValue}),c=new e.GeneralEditorWrapperEditor(b)):"CheckBox"===d?c=new e.BooleanEditor(b):"LinerUnitEditor"===d?c=new e.LinerUnitEditor(b):"DateTimeEditor"===d?c=new e.DateTimeEditor(b):"URLInput"===d?(b.gEditor=
new r({value:void 0===a.defaultValue?"":a.defaultValue}),c=new e.GeneralEditorWrapperEditor(b)):"ObjectUrlEditor"===d?(a.defaultValue&&"string"===typeof a.defaultValue&&(b.value=a.defaultValue),c=new e.ObjectUrlEditor(b)):"SimpleJsonEditor"===d?(a.defaultValue&&(b.value=a.defaultValue),c=new e.SimpleJsonEditor(b)):"DataFileEditor"===d?(a.defaultValue&&(b.value=a.defaultValue),c=new t(b)):"RasterLayerEditor"===d?(a.defaultValue&&(b.value=a.defaultValue),c=new u(b)):"SelectFeatureSetFromLayer"===d?
(a.defaultValue&&(b.value=a.defaultValue),c=new v(b)):"GetUrlObjectFromLayer"===d?(a.defaultValue&&(b.value=a.defaultValue),c=new e.GetUrlObjectFromLayer(b)):(b.message="wrong editorName."+d,c=new e.UnsupportEditor(b));a.editorDependParamName&&(c.dependParam=a.editorDependParamName);n.before(c,"destroy",function(){h.splice(h.indexOf(c),1)});c.dependParam&&l.forEach(h,function(a){a.param.name===c.dependParam&&c.update(a.getValue())});h.push(c);return c};g.setMap=function(a){m=a};g.setNls=function(a){k=
a};return g});