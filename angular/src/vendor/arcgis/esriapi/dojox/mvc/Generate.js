//>>built
define("dojox/mvc/Generate","dojo/_base/array dojo/_base/lang dojo/_base/declare ./_Container ./at ./Group dijit/form/TextBox".split(" "),function(h,e,k,l,m){return k("dojox.mvc.Generate",[l],{_counter:0,_defaultWidgetMapping:{String:"dijit/form/TextBox"},_defaultClassMapping:{Label:"generate-label-cell",String:"generate-dijit-cell",Heading:"generate-heading",Row:"row"},_defaultIdNameMapping:{String:"textbox_t"},children:null,_relTargetProp:"children",startup:function(){this.inherited(arguments);
this._setChildrenAttr(this.children)},_setChildrenAttr:function(a){var c=this.children;this._set("children",a);this.binding!=a&&this.set("ref",a);!this._started||this._builtOnce&&c==a||(this._builtOnce=!0,this._buildContained(a))},_buildContained:function(a){a&&(this._destroyBody(),this._counter=0,this.srcNodeRef.innerHTML=this._generateBody(a),this._createBody())},_generateBody:function(a,c){function b(a,b){if(f?a&&e.isFunction(a.toPlainObject):!e.isFunction(a))e.isArray(a)?d.push(this._generateRepeat(a,
b)):(f?!a.value:null!=a&&"[object Object]"=={}.toString.call(a)||(a||{}).set&&(a||{}).watch)?d.push(this._generateGroup(a,b,c)):d.push(this._generateTextBox(b,f))}if(void 0===a)return"";var d=[],f=e.isFunction(a.toPlainObject);if(e.isArray(a))h.forEach(a,b,this);else for(var g in a)a.hasOwnProperty(g)&&b.call(this,a[g],g);return d.join("")},_generateRepeat:function(a,c){var b=this.classMapping&&this.classMapping.Heading?this.classMapping.Heading:this._defaultClassMapping.Heading;return"\x3cdiv data-dojo-type\x3d\"dojox/mvc/Group\" data-dojo-props\x3d\"target: at('rel:', '"+
c+'\')" + id\x3d"'+this.id+"_r"+this._counter++ +'"\x3e\x3cdiv class\x3d"'+b+'"\x3e'+c+"\x3c/div\x3e"+this._generateBody(a,!0)+"\x3c/div\x3e"},_generateGroup:function(a,c,b){var d=["\x3cdiv data-dojo-type\x3d\"dojox/mvc/Group\" data-dojo-props\x3d\"target: at('rel:', '"+c+'\')" + id\x3d"'+this.id+"_g"+this._counter++ +'"\x3e'];b||d.push('\x3cdiv class\x3d"'+(this.classMapping&&this.classMapping.Heading?this.classMapping.Heading:this._defaultClassMapping.Heading)+'"\x3e'+c+"\x3c/div\x3e");d.push(this._generateBody(a)+
"\x3c/div\x3e");return d.join("")},_generateTextBox:function(a,c){var b=this.idNameMapping?this.idNameMapping.String:this._defaultIdNameMapping.String,b=b+this._counter++;return'\x3cdiv class\x3d"'+(this.classMapping&&this.classMapping.Row?this.classMapping.Row:this._defaultClassMapping.Row)+'"\x3e\x3clabel class\x3d"'+(this.classMapping&&this.classMapping.Label?this.classMapping.Label:this._defaultClassMapping.Label)+'"\x3e'+a+':\x3c/label\x3e\x3cinput class\x3d"'+(this.classMapping&&this.classMapping.String?
this.classMapping.String:this._defaultClassMapping.String)+'" data-dojo-type\x3d"'+(this.widgetMapping?this.widgetMapping.String:this._defaultWidgetMapping.String)+'" data-dojo-props\x3d"name: \''+b+"', "+("value: at('rel:"+(c&&a||"")+"', '"+(c?"value":a)+"')")+'" id\x3d"'+b+'"\x3e\x3c/input\x3e\x3c/div\x3e'}})});