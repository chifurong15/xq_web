//>>built
define("dojox/dtl/contrib/data",["dojo/_base/kernel","dojo/_base/lang","../_base","dojo/_base/array"],function(l,e,f,m){var d=e.getObject("contrib.data",!0,f),g=!0;d._BoundItem=e.extend(function(a,c){this.item=a;this.store=c},{get:function(a){var c=this.store,b=this.item;if("getLabel"==a)return c.getLabel(b);if("getAttributes"==a)return c.getAttributes(b);if("getIdentity"==a)return c.getIdentity?c.getIdentity(b):"Store has no identity API";if(!c.hasAttribute(b,a)&&("s"==a.slice(-1)&&(g&&(g=!1,l.deprecated("You no longer need an extra s to call getValues, it can be figured out automatically")),
a=a.slice(0,-1)),!c.hasAttribute(b,a)))return;if(a=c.getValues(b,a)){if(!e.isArray(a))return new d._BoundItem(a,c);a=m.map(a,function(a){return e.isObject(a)&&c.isItem(a)?new d._BoundItem(a,c):a});a.get=d._get;return a}}});d._BoundItem.prototype.get.safe=!0;d.BindDataNode=e.extend(function(a,c,b,d){this.items=a&&new f._Filter(a);this.query=c&&new f._Filter(c);this.store=new f._Filter(b);this.alias=d},{render:function(a,c){var b=this.items&&this.items.resolve(a),e=this.query&&this.query.resolve(a),
f=this.store.resolve(a);if(!f||!f.getFeatures)throw Error("data_bind didn't receive a store");if(e){var g=!1;f.fetch({query:e,sync:!0,scope:this,onComplete:function(a){g=!0;b=a}});if(!g)throw Error("The bind_data tag only works with a query if the store executed synchronously");}e=[];if(b)for(var h=0,k;k=b[h];h++)e.push(new d._BoundItem(k,f));a[this.alias]=e;return c},unrender:function(a,c){return c},clone:function(){return this}});e.mixin(d,{_get:function(a){if(this.length)return this[0]instanceof
d._BoundItem?this[0].get(a):this[0][a]},bind_data:function(a,c){var b=c.contents.split();if("to"!=b[2]||"as"!=b[4]||!b[5])throw Error("data_bind expects the format: 'data_bind items to store as varName'");return new d.BindDataNode(b[1],null,b[3],b[5])},bind_query:function(a,c){var b=c.contents.split();if("to"!=b[2]||"as"!=b[4]||!b[5])throw Error("data_bind expects the format: 'bind_query query to store as varName'");return new d.BindDataNode(null,b[1],b[3],b[5])}});d._get.safe=!0;f.register.tags("dojox.dtl.contrib",
{data:["bind_data","bind_query"]});return d});