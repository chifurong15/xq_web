//>>built
define("dstore/db/SQL","dojo/_base/declare dojo/Deferred dojo/when dstore/QueryResults dstore/Store dstore/SimpleQuery dojo/_base/lang dojo/promise/all".split(" "),function(v,w,n,x,y,z,q,p){function r(a,c){for(var k=c.split("."),e=k.length,b=0;b<e;b++)a=a&&a[k[b]];return a}function m(a){return a.replace(/\./g,"_dot_")}function t(a){return a&&a.__extra?q.mixin(a,JSON.parse(a.__extra)):a}var u={and:" AND ",or:" OR ",eq:"\x3d",ne:"!\x3d",lte:"\x3c\x3d",gte:"\x3e\x3d",lt:"\x3c",gt:"\x3e"};return v([y,
z],{constructor:function(a){var c=a.dbConfig;this.database=openDatabase(a.dbName||"dojo-db","1.0","dojo-db",4194304);var k=this.indexPrefix=a.indexPrefix||"idx_",e=a.table||a.storeName;this.table=(a.table||a.storeName).replace(/[^\w]/g,"_");a=[];this.indices=c.stores[e];this.repeatingIndices={};for(var b in this.indices)this.indices[b].multiEntry&&(this.repeatingIndices[b]=!0);if(!c.available){for(e in c.stores){var f=c.stores[e],g=e.replace(/[^\w]/g,"_"),l=f[this.idProperty],d=["__extra",this.idProperty+
" "+(l&&l.autoIncrement?"INTEGER PRIMARY KEY AUTOINCREMENT":"PRIMARY KEY")],l=[this.idProperty];for(b in f)b!=this.idProperty&&d.push(m(b));a.push(this.executeSql("CREATE TABLE IF NOT EXISTS "+g+" ("+d.join(",")+")"));for(b in f)b!=this.idProperty&&(f[b].multiEntry?(l.push(b),d=g+"_repeating_"+m(b),a.push(this.executeSql("CREATE TABLE IF NOT EXISTS "+d+" (id,value)")),a.push(this.executeSql("CREATE INDEX IF NOT EXISTS idx_"+d+"_id ON "+d+"(id)")),a.push(this.executeSql("CREATE INDEX IF NOT EXISTS idx_"+
d+"_value ON "+d+"(value)"))):(a.push(this.executeSql("ALTER TABLE "+g+" ADD "+m(b)).then(null,function(){})),!1!==f[b].indexed&&a.push(this.executeSql("CREATE INDEX IF NOT EXISTS "+k+g+"_"+m(b)+" ON "+g+"("+m(b)+")"))))}c.available=p(a)}this.available=c.available},idProperty:"id",selectColumns:["*"],get:function(a){var c=this;return n(this.executeSql("SELECT "+this.selectColumns.join(",")+" FROM "+this.table+" WHERE "+this.idProperty+"\x3d?",[a]),function(a){return 0<a.rows.length?c._restore(t(a.rows.item(0))):
void 0})},getIdentity:function(a){return a[this.idProperty]},remove:function(a){return this.executeSql("DELETE FROM "+this.table+" WHERE "+this.idProperty+"\x3d?",[a])},identifyGeneratedKey:!0,add:function(a){function c(a,c,d){l.repeatingIndices[d||a]?g.push(function(b){return p(c.map(function(c){return l.executeSql("INSERT INTO "+l.table+"_repeating_"+a+" (value, id) VALUES (?, ?)",[c,b])}))}):(b.push(a),e.push("?"),k.push(c))}var k=[],e=[],b=[],f={},g=[],l=this,d;for(d in a)a.hasOwnProperty(d)&&
(d in this.indices||d==this.idProperty?c(d,a[d]):f[d]=a[d]);for(d in this.indices)-1<d.indexOf(".")&&c(m(d),r(a,d),d);b.push("__extra");e.push("?");k.push(JSON.stringify(f));var h=this.idProperty;this.identifyGeneratedKey&&(k.idColumn=h);f="INSERT INTO "+this.table+" ("+b.join(",")+") VALUES ("+e.join(",")+")";return n(this.executeSql(f,k),function(c){var b=l.indices[h];if(b&&b.autoIncrement){var d=c.insertId;a[h]=d}else d=a[h];return p(g.map(function(a){return a(d)})).then(function(){return d})})},
put:function(a,c){function k(a,c,b){if(f.repeatingIndices[b||a])for(f.executeSql("DELETE FROM "+f.table+"_repeating_"+a+" WHERE id\x3d?",[e]),b=0;b<c.length;b++)f.executeSql("INSERT INTO "+f.table+"_repeating_"+a+" (value, id) VALUES (?, ?)",[c[b],e]);else l.push(a+"\x3d?"),g.push(c)}c=c||{};var e=c.id||a[this.idProperty],b=c.overwrite;if(void 0===b){var f=this;return this.get(e).then(function(b){return(c.overwrite=!!b)?(c.overwrite=!0,f.put(a,c)):f.add(a,c)})}if(!b)return f.add(a,c);var b="UPDATE "+
this.table+" SET ",g=[],l=[],d={},f=this,h;for(h in a)a.hasOwnProperty(h)&&(h in this.indices||h==this.idProperty?k(h,a[h]):d[h]=a[h]);for(h in this.indices)-1<h.indexOf(".")&&k(m(h),r(a,h),h);l.push("__extra\x3d?");g.push(JSON.stringify(d));b+=l.join(",")+" WHERE "+this.idProperty+"\x3d?";g.push(a[this.idProperty]);return n(this.executeSql(b,g),function(){return e})},fetchRange:function(a){return this.fetch(a)},generateSql:function(){function a(a){if(a.match(/[^\w_\.]/))throw new URIError("Illegal column name "+
a);return d+"."+m(a)}function c(b){var f=b.args,e=f[0],g=f[1];switch(b.type){case "eq":case "ne":case "lt":case "lte":case "gt":case "gte":return h.push(g),[a(e),u[b.type]+"?"];case "and":case "or":e=[];for(g=0;g<f.length;g++)e.push(c(f[g]).join(""));return["(",e.join(u[b.type]),")"];case "in":return 0===g.length?"0\x3d1":g.generateSql?(b=g.generateSql(),h.push.apply(h,b.params),[a(e)," IN ("+b.select+b.from+")"]):[a(e)," IN ("+f[1].map(function(a){h.push(a);return"?"}).join(",")+")"];case "contains":var k=
d+"_repeating_"+e;return["(",g.map(function(b){b&&b.type?b="value "+c(b).slice(1).join(""):(h.push(b),b="value\x3d?");return a(l.idProperty)+" IN (SELECT id FROM "+k+" WHERE "+b+")"}).join(" AND "),")"];case "match":g=g.source;if("^"!==g[0]||g.match(/[\{\}\(\)\[\]\.\,\$\*]/))throw Error("The match filter only supports simple prefix matching like /^starts with/");return[d+"."+e," LIKE '"+g.slice(1).replace(/'/g,"''")+"%'"];default:throw new URIError("Invalid query syntax, "+b.type+" not implemented");
}}var k="FROM "+this.table,e="",b="",f="*",g,l=this,d=this.table,h=[];this.queryLog.forEach(function(d){if("filter"===d.type)e=(e?" AND ":"")+c(d.normalizedArguments[0]).join("");else if("sort"===d.type)b=" ORDER BY "+d.normalizedArguments[0].map(function(b){return a(b.property)+" "+(b.descending?"desc":"asc")}).join(",");else if("select"===d.type){var h=d.normalizedArguments[0];if(h instanceof Array){for(var k=0;k<h.length;k++)if(!(h[k]in l.indices)){g=d;return}f=h.map(a).join(", ")}else h in l.indices&&
(f=a(h)),g=d}});e&&(e=" WHERE "+e);return{select:"SELECT "+f+" ",from:k+e+b,params:h,querier:g&&g.querier}},fetch:function(a){a=a||{};var c=this.generateSql(),k=c.from,e=c.params,b=c.querier,c=c.select+" "+k;a.end&&(c+=" LIMIT "+(a.end-(a.start||0)));a.start&&(c+=" OFFSET "+a.start);var f=this;a=q.delegate(this.executeSql(c,e).then(function(a){for(var c=[],d=0;d<a.rows.length;d++)c.push(f._restore(t(a.rows.item(d))));b&&(c=b(c));return c}));f=this;return new x(a,{totalLength:{then:function(a,b){return f.executeSql("SELECT COUNT(*) "+
k,e).then(function(a){return a.rows.item(0)["COUNT(*)"]}).then(a,b)}}})},executeSql:function(a,c){var k=new w,e,b;this.database.transaction(function(f){f.executeSql(a,c,function(a,b){k.resolve(e=b)},function(a,c){k.reject(b=c)})});if(e)return e;if(b)throw b;return k.promise}})});