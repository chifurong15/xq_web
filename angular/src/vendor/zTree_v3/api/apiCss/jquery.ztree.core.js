/*
 * JQuery zTree core v3.5.30
 * http://treejs.cn/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2017-11-11
 */
(function(q){var H,I,J,K,L,M,u,s={},v={},w={},N={treeId:"",treeObj:null,view:{addDiyDom:null,autoCancelSelected:!0,dblClickExpand:!0,expandSpeed:"fast",fontCss:{},nameIsHTML:!1,selectedMulti:!0,showIcon:!0,showLine:!0,showTitle:!0,txtSelectedEnable:!1},data:{key:{children:"children",name:"name",title:"",url:"url",icon:"icon"},simpleData:{enable:!1,idKey:"id",pIdKey:"pId",rootPId:null},keep:{parent:!1,leaf:!1}},async:{enable:!1,contentType:"application/x-www-form-urlencoded",type:"post",dataType:"text",
url:"",autoParam:[],otherParam:[],dataFilter:null},callback:{beforeAsync:null,beforeClick:null,beforeDblClick:null,beforeRightClick:null,beforeMouseDown:null,beforeMouseUp:null,beforeExpand:null,beforeCollapse:null,beforeRemove:null,onAsyncError:null,onAsyncSuccess:null,onNodeCreated:null,onClick:null,onDblClick:null,onRightClick:null,onMouseDown:null,onMouseUp:null,onExpand:null,onCollapse:null,onRemove:null}},x=[function(b){var a=b.treeObj,c=f.event;a.bind(c.NODECREATED,function(a,c,h){j.apply(b.callback.onNodeCreated,
[a,c,h])});a.bind(c.CLICK,function(a,c,h,k,g){j.apply(b.callback.onClick,[c,h,k,g])});a.bind(c.EXPAND,function(a,c,h){j.apply(b.callback.onExpand,[a,c,h])});a.bind(c.COLLAPSE,function(a,c,h){j.apply(b.callback.onCollapse,[a,c,h])});a.bind(c.ASYNC_SUCCESS,function(a,c,h,k){j.apply(b.callback.onAsyncSuccess,[a,c,h,k])});a.bind(c.ASYNC_ERROR,function(a,c,h,k,g,f){j.apply(b.callback.onAsyncError,[a,c,h,k,g,f])});a.bind(c.REMOVE,function(a,c,h){j.apply(b.callback.onRemove,[a,c,h])});a.bind(c.SELECTED,
function(a,c,h){j.apply(b.callback.onSelected,[c,h])});a.bind(c.UNSELECTED,function(a,c,h){j.apply(b.callback.onUnSelected,[c,h])})}],y=[function(b){var a=f.event;b.treeObj.unbind(a.NODECREATED).unbind(a.CLICK).unbind(a.EXPAND).unbind(a.COLLAPSE).unbind(a.ASYNC_SUCCESS).unbind(a.ASYNC_ERROR).unbind(a.REMOVE).unbind(a.SELECTED).unbind(a.UNSELECTED)}],z=[function(b){var a=g.getCache(b);a||(a={},g.setCache(b,a));a.nodes=[];a.doms=[]}],A=[function(b,a,c,d,e,h){if(c){var k=g.getRoot(b),f=b.data.key.children;
c.level=a;c.tId=b.treeId+"_"+ ++k.zId;c.parentTId=d?d.tId:null;c.open=typeof c.open=="string"?j.eqs(c.open,"true"):!!c.open;c[f]&&c[f].length>0?(c.isParent=!0,c.zAsync=!0):(c.isParent=typeof c.isParent=="string"?j.eqs(c.isParent,"true"):!!c.isParent,c.open=c.isParent&&!b.async.enable?c.open:!1,c.zAsync=!c.isParent);c.isFirstNode=e;c.isLastNode=h;c.getParentNode=function(){return g.getNodeCache(b,c.parentTId)};c.getPreNode=function(){return g.getPreNode(b,c)};c.getNextNode=function(){return g.getNextNode(b,
c)};c.getIndex=function(){return g.getNodeIndex(b,c)};c.getPath=function(){return g.getNodePath(b,c)};c.isAjaxing=!1;g.fixPIdKeyValue(b,c)}}],t=[function(b){var a=b.target,c=g.getSetting(b.data.treeId),d="",e=null,h="",k="",o=null,i=null,l=null;if(j.eqs(b.type,"mousedown"))k="mousedown";else if(j.eqs(b.type,"mouseup"))k="mouseup";else if(j.eqs(b.type,"contextmenu"))k="contextmenu";else if(j.eqs(b.type,"click"))if(j.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+f.id.SWITCH)!==null)d=j.getNodeMainDom(a).id,
h="switchNode";else{if(l=j.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+f.id.A}]))d=j.getNodeMainDom(l).id,h="clickNode"}else if(j.eqs(b.type,"dblclick")&&(k="dblclick",l=j.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+f.id.A}])))d=j.getNodeMainDom(l).id,h="switchNode";if(k.length>0&&d.length==0&&(l=j.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+f.id.A}])))d=j.getNodeMainDom(l).id;if(d.length>0)switch(e=g.getNodeCache(c,d),h){case "switchNode":e.isParent?j.eqs(b.type,"click")||j.eqs(b.type,"dblclick")&&
j.apply(c.view.dblClickExpand,[c.treeId,e],c.view.dblClickExpand)?o=H:h="":h="";break;case "clickNode":o=I}switch(k){case "mousedown":i=J;break;case "mouseup":i=K;break;case "dblclick":i=L;break;case "contextmenu":i=M}return{stop:!1,node:e,nodeEventType:h,nodeEventCallback:o,treeEventType:k,treeEventCallback:i}}],B=[function(b){var a=g.getRoot(b);a||(a={},g.setRoot(b,a));a[b.data.key.children]=[];a.expandTriggerFlag=!1;a.curSelectedList=[];a.noSelection=!0;a.createdNodes=[];a.zId=0;a._ver=(new Date).getTime()}],
C=[],D=[],E=[],F=[],G=[],g={addNodeCache:function(b,a){g.getCache(b).nodes[g.getNodeCacheId(a.tId)]=a},getNodeCacheId:function(b){return b.substring(b.lastIndexOf("_")+1)},addAfterA:function(b){D.push(b)},addBeforeA:function(b){C.push(b)},addInnerAfterA:function(b){F.push(b)},addInnerBeforeA:function(b){E.push(b)},addInitBind:function(b){x.push(b)},addInitUnBind:function(b){y.push(b)},addInitCache:function(b){z.push(b)},addInitNode:function(b){A.push(b)},addInitProxy:function(b,a){a?t.splice(0,0,
b):t.push(b)},addInitRoot:function(b){B.push(b)},addNodesData:function(b,a,c,d){var e=b.data.key.children;a[e]?c>=a[e].length&&(c=-1):(a[e]=[],c=-1);if(a[e].length>0&&c===0)a[e][0].isFirstNode=!1,i.setNodeLineIcos(b,a[e][0]);else if(a[e].length>0&&c<0)a[e][a[e].length-1].isLastNode=!1,i.setNodeLineIcos(b,a[e][a[e].length-1]);a.isParent=!0;c<0?a[e]=a[e].concat(d):(b=[c,0].concat(d),a[e].splice.apply(a[e],b))},addSelectedNode:function(b,a){var c=g.getRoot(b);g.isSelectedNode(b,a)||c.curSelectedList.push(a)},
addCreatedNode:function(b,a){(b.callback.onNodeCreated||b.view.addDiyDom)&&g.getRoot(b).createdNodes.push(a)},addZTreeTools:function(b){G.push(b)},exSetting:function(b){q.extend(!0,N,b)},fixPIdKeyValue:function(b,a){b.data.simpleData.enable&&(a[b.data.simpleData.pIdKey]=a.parentTId?a.getParentNode()[b.data.simpleData.idKey]:b.data.simpleData.rootPId)},getAfterA:function(b,a,c){for(var d=0,e=D.length;d<e;d++)D[d].apply(this,arguments)},getBeforeA:function(b,a,c){for(var d=0,e=C.length;d<e;d++)C[d].apply(this,
arguments)},getInnerAfterA:function(b,a,c){for(var d=0,e=F.length;d<e;d++)F[d].apply(this,arguments)},getInnerBeforeA:function(b,a,c){for(var d=0,e=E.length;d<e;d++)E[d].apply(this,arguments)},getCache:function(b){return w[b.treeId]},getNodeIndex:function(b,a){if(!a)return null;for(var c=b.data.key.children,d=a.parentTId?a.getParentNode():g.getRoot(b),e=0,h=d[c].length-1;e<=h;e++)if(d[c][e]===a)return e;return-1},getNextNode:function(b,a){if(!a)return null;for(var c=b.data.key.children,d=a.parentTId?
a.getParentNode():g.getRoot(b),e=0,h=d[c].length-1;e<=h;e++)if(d[c][e]===a)return e==h?null:d[c][e+1];return null},getNodeByParam:function(b,a,c,d){if(!a||!c)return null;for(var e=b.data.key.children,h=0,k=a.length;h<k;h++){if(a[h][c]==d)return a[h];var f=g.getNodeByParam(b,a[h][e],c,d);if(f)return f}return null},getNodeCache:function(b,a){if(!a)return null;var c=w[b.treeId].nodes[g.getNodeCacheId(a)];return c?c:null},getNodeName:function(b,a){return""+a[b.data.key.name]},getNodePath:function(b,a){if(!a)return null;
var c;(c=a.parentTId?a.getParentNode().getPath():[])&&c.push(a);return c},getNodeTitle:function(b,a){return""+a[b.data.key.title===""?b.data.key.name:b.data.key.title]},getNodes:function(b){return g.getRoot(b)[b.data.key.children]},getNodesByParam:function(b,a,c,d){if(!a||!c)return[];for(var e=b.data.key.children,h=[],k=0,f=a.length;k<f;k++)a[k][c]==d&&h.push(a[k]),h=h.concat(g.getNodesByParam(b,a[k][e],c,d));return h},getNodesByParamFuzzy:function(b,a,c,d){if(!a||!c)return[];for(var e=b.data.key.children,
h=[],d=d.toLowerCase(),k=0,f=a.length;k<f;k++)typeof a[k][c]=="string"&&a[k][c].toLowerCase().indexOf(d)>-1&&h.push(a[k]),h=h.concat(g.getNodesByParamFuzzy(b,a[k][e],c,d));return h},getNodesByFilter:function(b,a,c,d,e){if(!a)return d?null:[];for(var h=b.data.key.children,k=d?null:[],f=0,i=a.length;f<i;f++){if(j.apply(c,[a[f],e],!1)){if(d)return a[f];k.push(a[f])}var l=g.getNodesByFilter(b,a[f][h],c,d,e);if(d&&l)return l;k=d?l:k.concat(l)}return k},getPreNode:function(b,a){if(!a)return null;for(var c=
b.data.key.children,d=a.parentTId?a.getParentNode():g.getRoot(b),e=0,h=d[c].length;e<h;e++)if(d[c][e]===a)return e==0?null:d[c][e-1];return null},getRoot:function(b){return b?v[b.treeId]:null},getRoots:function(){return v},getSetting:function(b){return s[b]},getSettings:function(){return s},getZTreeTools:function(b){return(b=this.getRoot(this.getSetting(b)))?b.treeTools:null},initCache:function(b){for(var a=0,c=z.length;a<c;a++)z[a].apply(this,arguments)},initNode:function(b,a,c,d,e,h){for(var k=
0,f=A.length;k<f;k++)A[k].apply(this,arguments)},initRoot:function(b){for(var a=0,c=B.length;a<c;a++)B[a].apply(this,arguments)},isSelectedNode:function(b,a){for(var c=g.getRoot(b),d=0,e=c.curSelectedList.length;d<e;d++)if(a===c.curSelectedList[d])return!0;return!1},removeNodeCache:function(b,a){var c=b.data.key.children;if(a[c])for(var d=0,e=a[c].length;d<e;d++)g.removeNodeCache(b,a[c][d]);g.getCache(b).nodes[g.getNodeCacheId(a.tId)]=null},removeSelectedNode:function(b,a){for(var c=g.getRoot(b),
d=0,e=c.curSelectedList.length;d<e;d++)if(a===c.curSelectedList[d]||!g.getNodeCache(b,c.curSelectedList[d].tId))c.curSelectedList.splice(d,1),b.treeObj.trigger(f.event.UNSELECTED,[b.treeId,a]),d--,e--},setCache:function(b,a){w[b.treeId]=a},setRoot:function(b,a){v[b.treeId]=a},setZTreeTools:function(b,a){for(var c=0,d=G.length;c<d;c++)G[c].apply(this,arguments)},transformToArrayFormat:function(b,a){if(!a)return[];var c=b.data.key.children,d=[];if(j.isArray(a))for(var e=0,h=a.length;e<h;e++)d.push(a[e]),
a[e][c]&&(d=d.concat(g.transformToArrayFormat(b,a[e][c])));else d.push(a),a[c]&&(d=d.concat(g.transformToArrayFormat(b,a[c])));return d},transformTozTreeFormat:function(b,a){var c,d,e=b.data.simpleData.idKey,h=b.data.simpleData.pIdKey,k=b.data.key.children;if(!e||e==""||!a)return[];if(j.isArray(a)){var f=[],g={};for(c=0,d=a.length;c<d;c++)g[a[c][e]]=a[c];for(c=0,d=a.length;c<d;c++)g[a[c][h]]&&a[c][e]!=a[c][h]?(g[a[c][h]][k]||(g[a[c][h]][k]=[]),g[a[c][h]][k].push(a[c])):f.push(a[c]);return f}else return[a]}},
m={bindEvent:function(b){for(var a=0,c=x.length;a<c;a++)x[a].apply(this,arguments)},unbindEvent:function(b){for(var a=0,c=y.length;a<c;a++)y[a].apply(this,arguments)},bindTree:function(b){var a={treeId:b.treeId},c=b.treeObj;b.view.txtSelectedEnable||c.bind("selectstart",u).css({"-moz-user-select":"-moz-none"});c.bind("click",a,m.proxy);c.bind("dblclick",a,m.proxy);c.bind("mouseover",a,m.proxy);c.bind("mouseout",a,m.proxy);c.bind("mousedown",a,m.proxy);c.bind("mouseup",a,m.proxy);c.bind("contextmenu",
a,m.proxy)},unbindTree:function(b){b.treeObj.unbind("selectstart",u).unbind("click",m.proxy).unbind("dblclick",m.proxy).unbind("mouseover",m.proxy).unbind("mouseout",m.proxy).unbind("mousedown",m.proxy).unbind("mouseup",m.proxy).unbind("contextmenu",m.proxy)},doProxy:function(b){for(var a=[],c=0,d=t.length;c<d;c++){var e=t[c].apply(this,arguments);a.push(e);if(e.stop)break}return a},proxy:function(b){var a=g.getSetting(b.data.treeId);if(!j.uCanDo(a,b))return!0;for(var a=m.doProxy(b),c=!0,d=0,e=a.length;d<
e;d++){var h=a[d];h.nodeEventCallback&&(c=h.nodeEventCallback.apply(h,[b,h.node])&&c);h.treeEventCallback&&(c=h.treeEventCallback.apply(h,[b,h.node])&&c)}return c}};H=function(b,a){var c=g.getSetting(b.data.treeId);if(a.open){if(j.apply(c.callback.beforeCollapse,[c.treeId,a],!0)==!1)return!0}else if(j.apply(c.callback.beforeExpand,[c.treeId,a],!0)==!1)return!0;g.getRoot(c).expandTriggerFlag=!0;i.switchNode(c,a);return!0};I=function(b,a){var c=g.getSetting(b.data.treeId),d=c.view.autoCancelSelected&&
(b.ctrlKey||b.metaKey)&&g.isSelectedNode(c,a)?0:c.view.autoCancelSelected&&(b.ctrlKey||b.metaKey)&&c.view.selectedMulti?2:1;if(j.apply(c.callback.beforeClick,[c.treeId,a,d],!0)==!1)return!0;d===0?i.cancelPreSelectedNode(c,a):i.selectNode(c,a,d===2);c.treeObj.trigger(f.event.CLICK,[b,c.treeId,a,d]);return!0};J=function(b,a){var c=g.getSetting(b.data.treeId);j.apply(c.callback.beforeMouseDown,[c.treeId,a],!0)&&j.apply(c.callback.onMouseDown,[b,c.treeId,a]);return!0};K=function(b,a){var c=g.getSetting(b.data.treeId);
j.apply(c.callback.beforeMouseUp,[c.treeId,a],!0)&&j.apply(c.callback.onMouseUp,[b,c.treeId,a]);return!0};L=function(b,a){var c=g.getSetting(b.data.treeId);j.apply(c.callback.beforeDblClick,[c.treeId,a],!0)&&j.apply(c.callback.onDblClick,[b,c.treeId,a]);return!0};M=function(b,a){var c=g.getSetting(b.data.treeId);j.apply(c.callback.beforeRightClick,[c.treeId,a],!0)&&j.apply(c.callback.onRightClick,[b,c.treeId,a]);return typeof c.callback.onRightClick!="function"};u=function(b){b=b.originalEvent.srcElement.nodeName.toLowerCase();
return b==="input"||b==="textarea"};var j={apply:function(b,a,c){return typeof b=="function"?b.apply(O,a?a:[]):c},canAsync:function(b,a){var c=b.data.key.children;return b.async.enable&&a&&a.isParent&&!(a.zAsync||a[c]&&a[c].length>0)},clone:function(b){if(b===null)return null;var a=j.isArray(b)?[]:{},c;for(c in b)a[c]=b[c]instanceof Date?new Date(b[c].getTime()):typeof b[c]==="object"?j.clone(b[c]):b[c];return a},eqs:function(b,a){return b.toLowerCase()===a.toLowerCase()},isArray:function(b){return Object.prototype.toString.apply(b)===
"[object Array]"},isElement:function(b){return typeof HTMLElement==="object"?b instanceof HTMLElement:b&&typeof b==="object"&&b!==null&&b.nodeType===1&&typeof b.nodeName==="string"},$:function(b,a,c){a&&typeof a!="string"&&(c=a,a="");return typeof b=="string"?q(b,c?c.treeObj.get(0).ownerDocument:null):q("#"+b.tId+a,c?c.treeObj:null)},getMDom:function(b,a,c){if(!a)return null;for(;a&&a.id!==b.treeId;){for(var d=0,e=c.length;a.tagName&&d<e;d++)if(j.eqs(a.tagName,c[d].tagName)&&a.getAttribute(c[d].attrName)!==
null)return a;a=a.parentNode}return null},getNodeMainDom:function(b){return q(b).parent("li").get(0)||q(b).parentsUntil("li").parent().get(0)},isChildOrSelf:function(b,a){return q(b).closest("#"+a).length>0},uCanDo:function(){return!0}},i={addNodes:function(b,a,c,d,e){if(!b.data.keep.leaf||!a||a.isParent)if(j.isArray(d)||(d=[d]),b.data.simpleData.enable&&(d=g.transformTozTreeFormat(b,d)),a){var h=l(a,f.id.SWITCH,b),k=l(a,f.id.ICON,b),o=l(a,f.id.UL,b);if(!a.open)i.replaceSwitchClass(a,h,f.folder.CLOSE),
i.replaceIcoClass(a,k,f.folder.CLOSE),a.open=!1,o.css({display:"none"});g.addNodesData(b,a,c,d);i.createNodes(b,a.level+1,d,a,c);e||i.expandCollapseParentNode(b,a,!0)}else g.addNodesData(b,g.getRoot(b),c,d),i.createNodes(b,0,d,null,c)},appendNodes:function(b,a,c,d,e,h,k){if(!c)return[];var f=[],j=b.data.key.children,l=(d?d:g.getRoot(b))[j],r,P;if(!l||e>=l.length-c.length)e=-1;for(var m=0,q=c.length;m<q;m++){var n=c[m];h&&(r=(e===0||l.length==c.length)&&m==0,P=e<0&&m==c.length-1,g.initNode(b,a,n,d,
r,P,k),g.addNodeCache(b,n));r=[];n[j]&&n[j].length>0&&(r=i.appendNodes(b,a+1,n[j],n,-1,h,k&&n.open));k&&(i.makeDOMNodeMainBefore(f,b,n),i.makeDOMNodeLine(f,b,n),g.getBeforeA(b,n,f),i.makeDOMNodeNameBefore(f,b,n),g.getInnerBeforeA(b,n,f),i.makeDOMNodeIcon(f,b,n),g.getInnerAfterA(b,n,f),i.makeDOMNodeNameAfter(f,b,n),g.getAfterA(b,n,f),n.isParent&&n.open&&i.makeUlHtml(b,n,f,r.join("")),i.makeDOMNodeMainAfter(f,b,n),g.addCreatedNode(b,n))}return f},appendParentULDom:function(b,a){var c=[],d=l(a,b);!d.get(0)&&
a.parentTId&&(i.appendParentULDom(b,a.getParentNode()),d=l(a,b));var e=l(a,f.id.UL,b);e.get(0)&&e.remove();e=i.appendNodes(b,a.level+1,a[b.data.key.children],a,-1,!1,!0);i.makeUlHtml(b,a,c,e.join(""));d.append(c.join(""))},asyncNode:function(b,a,c,d){var e,h;if(a&&!a.isParent)return j.apply(d),!1;else if(a&&a.isAjaxing)return!1;else if(j.apply(b.callback.beforeAsync,[b.treeId,a],!0)==!1)return j.apply(d),!1;if(a)a.isAjaxing=!0,l(a,f.id.ICON,b).attr({style:"","class":f.className.BUTTON+" "+f.className.ICO_LOADING});
var k={};for(e=0,h=b.async.autoParam.length;a&&e<h;e++){var o=b.async.autoParam[e].split("="),p=o;o.length>1&&(p=o[1],o=o[0]);k[p]=a[o]}if(j.isArray(b.async.otherParam))for(e=0,h=b.async.otherParam.length;e<h;e+=2)k[b.async.otherParam[e]]=b.async.otherParam[e+1];else for(var m in b.async.otherParam)k[m]=b.async.otherParam[m];var r=g.getRoot(b)._ver;q.ajax({contentType:b.async.contentType,cache:!1,type:b.async.type,url:j.apply(b.async.url,[b.treeId,a],b.async.url),data:b.async.contentType.indexOf("application/json")>
-1?JSON.stringify(k):k,dataType:b.async.dataType,success:function(h){if(r==g.getRoot(b)._ver){var e=[];try{e=!h||h.length==0?[]:typeof h=="string"?eval("("+h+")"):h}catch(k){e=h}if(a)a.isAjaxing=null,a.zAsync=!0;i.setNodeLineIcos(b,a);e&&e!==""?(e=j.apply(b.async.dataFilter,[b.treeId,a,e],e),i.addNodes(b,a,-1,e?j.clone(e):[],!!c)):i.addNodes(b,a,-1,[],!!c);b.treeObj.trigger(f.event.ASYNC_SUCCESS,[b.treeId,a,h]);j.apply(d)}},error:function(c,d,h){if(r==g.getRoot(b)._ver){if(a)a.isAjaxing=null;i.setNodeLineIcos(b,
a);b.treeObj.trigger(f.event.ASYNC_ERROR,[b.treeId,a,c,d,h])}}});return!0},cancelPreSelectedNode:function(b,a,c){var d=g.getRoot(b).curSelectedList,e,h;for(e=d.length-1;e>=0;e--)if(h=d[e],a===h||!a&&(!c||c!==h))if(l(h,f.id.A,b).removeClass(f.node.CURSELECTED),a){g.removeSelectedNode(b,a);break}else d.splice(e,1),b.treeObj.trigger(f.event.UNSELECTED,[b.treeId,h])},createNodeCallback:function(b){if(b.callback.onNodeCreated||b.view.addDiyDom)for(var a=g.getRoot(b);a.createdNodes.length>0;){var c=a.createdNodes.shift();
j.apply(b.view.addDiyDom,[b.treeId,c]);b.callback.onNodeCreated&&b.treeObj.trigger(f.event.NODECREATED,[b.treeId,c])}},createNodes:function(b,a,c,d,e){if(c&&c.length!=0){var h=g.getRoot(b),k=b.data.key.children,k=!d||d.open||!!l(d[k][0],b).get(0);h.createdNodes=[];var a=i.appendNodes(b,a,c,d,e,!0,k),j,p;d?(d=l(d,f.id.UL,b),d.get(0)&&(j=d)):j=b.treeObj;j&&(e>=0&&(p=j.children()[e]),e>=0&&p?q(p).before(a.join("")):j.append(a.join("")));i.createNodeCallback(b)}},destroy:function(b){b&&(g.initCache(b),
g.initRoot(b),m.unbindTree(b),m.unbindEvent(b),b.treeObj.empty(),delete s[b.treeId])},expandCollapseNode:function(b,a,c,d,e){var h=g.getRoot(b),k=b.data.key.children,o;if(a){if(h.expandTriggerFlag)o=e,e=function(){o&&o();a.open?b.treeObj.trigger(f.event.EXPAND,[b.treeId,a]):b.treeObj.trigger(f.event.COLLAPSE,[b.treeId,a])},h.expandTriggerFlag=!1;if(!a.open&&a.isParent&&(!l(a,f.id.UL,b).get(0)||a[k]&&a[k].length>0&&!l(a[k][0],b).get(0)))i.appendParentULDom(b,a),i.createNodeCallback(b);if(a.open==c)j.apply(e,
[]);else{var c=l(a,f.id.UL,b),h=l(a,f.id.SWITCH,b),p=l(a,f.id.ICON,b);a.isParent?(a.open=!a.open,a.iconOpen&&a.iconClose&&p.attr("style",i.makeNodeIcoStyle(b,a)),a.open?(i.replaceSwitchClass(a,h,f.folder.OPEN),i.replaceIcoClass(a,p,f.folder.OPEN),d==!1||b.view.expandSpeed==""?(c.show(),j.apply(e,[])):a[k]&&a[k].length>0?c.slideDown(b.view.expandSpeed,e):(c.show(),j.apply(e,[]))):(i.replaceSwitchClass(a,h,f.folder.CLOSE),i.replaceIcoClass(a,p,f.folder.CLOSE),d==!1||b.view.expandSpeed==""||!(a[k]&&
a[k].length>0)?(c.hide(),j.apply(e,[])):c.slideUp(b.view.expandSpeed,e))):j.apply(e,[])}}else j.apply(e,[])},expandCollapseParentNode:function(b,a,c,d,e){a&&(a.parentTId?(i.expandCollapseNode(b,a,c,d),a.parentTId&&i.expandCollapseParentNode(b,a.getParentNode(),c,d,e)):i.expandCollapseNode(b,a,c,d,e))},expandCollapseSonNode:function(b,a,c,d,e){var h=g.getRoot(b),k=b.data.key.children,h=a?a[k]:h[k],k=a?!1:d,f=g.getRoot(b).expandTriggerFlag;g.getRoot(b).expandTriggerFlag=!1;if(h)for(var j=0,l=h.length;j<
l;j++)h[j]&&i.expandCollapseSonNode(b,h[j],c,k);g.getRoot(b).expandTriggerFlag=f;i.expandCollapseNode(b,a,c,d,e)},isSelectedNode:function(b,a){if(!a)return!1;var c=g.getRoot(b).curSelectedList,d;for(d=c.length-1;d>=0;d--)if(a===c[d])return!0;return!1},makeDOMNodeIcon:function(b,a,c){var d=g.getNodeName(a,c),d=a.view.nameIsHTML?d:d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");b.push("<span id='",c.tId,f.id.ICON,"' title='' treeNode",f.id.ICON," class='",i.makeNodeIcoClass(a,c),"' style='",
i.makeNodeIcoStyle(a,c),"'></span><span id='",c.tId,f.id.SPAN,"' class='",f.className.NAME,"'>",d,"</span>")},makeDOMNodeLine:function(b,a,c){b.push("<span id='",c.tId,f.id.SWITCH,"' title='' class='",i.makeNodeLineClass(a,c),"' treeNode",f.id.SWITCH,"></span>")},makeDOMNodeMainAfter:function(b){b.push("</li>")},makeDOMNodeMainBefore:function(b,a,c){b.push("<li id='",c.tId,"' class='",f.className.LEVEL,c.level,"' tabindex='0' hidefocus='true' treenode>")},makeDOMNodeNameAfter:function(b){b.push("</a>")},
makeDOMNodeNameBefore:function(b,a,c){var d=g.getNodeTitle(a,c),e=i.makeNodeUrl(a,c),h=i.makeNodeFontCss(a,c),k=[],o;for(o in h)k.push(o,":",h[o],";");b.push("<a id='",c.tId,f.id.A,"' class='",f.className.LEVEL,c.level,"' treeNode",f.id.A,' onclick="',c.click||"",'" ',e!=null&&e.length>0?"href='"+e+"'":""," target='",i.makeNodeTarget(c),"' style='",k.join(""),"'");j.apply(a.view.showTitle,[a.treeId,c],a.view.showTitle)&&d&&b.push("title='",d.replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,
"&gt;"),"'");b.push(">")},makeNodeFontCss:function(b,a){var c=j.apply(b.view.fontCss,[b.treeId,a],b.view.fontCss);return c&&typeof c!="function"?c:{}},makeNodeIcoClass:function(b,a){var c=["ico"];a.isAjaxing||(c[0]=(a.iconSkin?a.iconSkin+"_":"")+c[0],a.isParent?c.push(a.open?f.folder.OPEN:f.folder.CLOSE):c.push(f.folder.DOCU));return f.className.BUTTON+" "+c.join("_")},makeNodeIcoStyle:function(b,a){var c=[];if(!a.isAjaxing){var d=a.isParent&&a.iconOpen&&a.iconClose?a.open?a.iconOpen:a.iconClose:
a[b.data.key.icon];d&&c.push("background:url(",d,") 0 0 no-repeat;");(b.view.showIcon==!1||!j.apply(b.view.showIcon,[b.treeId,a],!0))&&c.push("width:0px;height:0px;")}return c.join("")},makeNodeLineClass:function(b,a){var c=[];b.view.showLine?a.level==0&&a.isFirstNode&&a.isLastNode?c.push(f.line.ROOT):a.level==0&&a.isFirstNode?c.push(f.line.ROOTS):a.isLastNode?c.push(f.line.BOTTOM):c.push(f.line.CENTER):c.push(f.line.NOLINE);a.isParent?c.push(a.open?f.folder.OPEN:f.folder.CLOSE):c.push(f.folder.DOCU);
return i.makeNodeLineClassEx(a)+c.join("_")},makeNodeLineClassEx:function(b){return f.className.BUTTON+" "+f.className.LEVEL+b.level+" "+f.className.SWITCH+" "},makeNodeTarget:function(b){return b.target||"_blank"},makeNodeUrl:function(b,a){var c=b.data.key.url;return a[c]?a[c]:null},makeUlHtml:function(b,a,c,d){c.push("<ul id='",a.tId,f.id.UL,"' class='",f.className.LEVEL,a.level," ",i.makeUlLineClass(b,a),"' style='display:",a.open?"block":"none","'>");c.push(d);c.push("</ul>")},makeUlLineClass:function(b,
a){return b.view.showLine&&!a.isLastNode?f.line.LINE:""},removeChildNodes:function(b,a){if(a){var c=b.data.key.children,d=a[c];if(d){for(var e=0,h=d.length;e<h;e++)g.removeNodeCache(b,d[e]);g.removeSelectedNode(b);delete a[c];b.data.keep.parent?l(a,f.id.UL,b).empty():(a.isParent=!1,a.open=!1,c=l(a,f.id.SWITCH,b),d=l(a,f.id.ICON,b),i.replaceSwitchClass(a,c,f.folder.DOCU),i.replaceIcoClass(a,d,f.folder.DOCU),l(a,f.id.UL,b).remove())}}},scrollIntoView:function(b,a){if(a)if(typeof Element==="undefined"){var c=
b.treeObj.get(0).getBoundingClientRect(),d=a.getBoundingClientRect();(d.top<c.top||d.bottom>c.bottom||d.right>c.right||d.left<c.left)&&a.scrollIntoView()}else{if(!Element.prototype.scrollIntoViewIfNeeded)Element.prototype.scrollIntoViewIfNeeded=function(a){function b(a,c,d,e){return{left:a,top:c,width:d,height:e,right:a+d,bottom:c+e,translate:function(f,k){return b(f+a,k+c,d,e)},relativeFromTo:function(k,g){var i=a,j=c,k=k.offsetParent,g=g.offsetParent;if(k===g)return f;for(;k;k=k.offsetParent)i+=
k.offsetLeft+k.clientLeft,j+=k.offsetTop+k.clientTop;for(;g;g=g.offsetParent)i-=g.offsetLeft+g.clientLeft,j-=g.offsetTop+g.clientTop;return b(i,j,d,e)}}}for(var c,d=this,f=b(this.offsetLeft,this.offsetTop,this.offsetWidth,this.offsetHeight);j.isElement(c=d.parentNode);){var g=c.offsetLeft+c.clientLeft,i=c.offsetTop+c.clientTop,f=f.relativeFromTo(d,c).translate(-g,-i);c.scrollLeft=!1===a||f.left<=c.scrollLeft+c.clientWidth&&c.scrollLeft<=f.right-c.clientWidth+c.clientWidth?Math.min(f.left,Math.max(f.right-
c.clientWidth,c.scrollLeft)):(f.right-c.clientWidth+f.left)/2;c.scrollTop=!1===a||f.top<=c.scrollTop+c.clientHeight&&c.scrollTop<=f.bottom-c.clientHeight+c.clientHeight?Math.min(f.top,Math.max(f.bottom-c.clientHeight,c.scrollTop)):(f.bottom-c.clientHeight+f.top)/2;f=f.translate(g-c.scrollLeft,i-c.scrollTop);d=c}};a.scrollIntoViewIfNeeded()}},setFirstNode:function(b,a){var c=b.data.key.children;if(a[c].length>0)a[c][0].isFirstNode=!0},setLastNode:function(b,a){var c=b.data.key.children,d=a[c].length;
if(d>0)a[c][d-1].isLastNode=!0},removeNode:function(b,a){var c=g.getRoot(b),d=b.data.key.children,e=a.parentTId?a.getParentNode():c;a.isFirstNode=!1;a.isLastNode=!1;a.getPreNode=function(){return null};a.getNextNode=function(){return null};if(g.getNodeCache(b,a.tId)){l(a,b).remove();g.removeNodeCache(b,a);g.removeSelectedNode(b,a);for(var h=0,k=e[d].length;h<k;h++)if(e[d][h].tId==a.tId){e[d].splice(h,1);break}i.setFirstNode(b,e);i.setLastNode(b,e);var j,h=e[d].length;if(!b.data.keep.parent&&h==0)e.isParent=
!1,e.open=!1,h=l(e,f.id.UL,b),k=l(e,f.id.SWITCH,b),j=l(e,f.id.ICON,b),i.replaceSwitchClass(e,k,f.folder.DOCU),i.replaceIcoClass(e,j,f.folder.DOCU),h.css("display","none");else if(b.view.showLine&&h>0){var p=e[d][h-1],h=l(p,f.id.UL,b),k=l(p,f.id.SWITCH,b);j=l(p,f.id.ICON,b);e==c?e[d].length==1?i.replaceSwitchClass(p,k,f.line.ROOT):(c=l(e[d][0],f.id.SWITCH,b),i.replaceSwitchClass(e[d][0],c,f.line.ROOTS),i.replaceSwitchClass(p,k,f.line.BOTTOM)):i.replaceSwitchClass(p,k,f.line.BOTTOM);h.removeClass(f.line.LINE)}}},
replaceIcoClass:function(b,a,c){if(a&&!b.isAjaxing&&(b=a.attr("class"),b!=void 0)){b=b.split("_");switch(c){case f.folder.OPEN:case f.folder.CLOSE:case f.folder.DOCU:b[b.length-1]=c}a.attr("class",b.join("_"))}},replaceSwitchClass:function(b,a,c){if(a){var d=a.attr("class");if(d!=void 0){d=d.split("_");switch(c){case f.line.ROOT:case f.line.ROOTS:case f.line.CENTER:case f.line.BOTTOM:case f.line.NOLINE:d[0]=i.makeNodeLineClassEx(b)+c;break;case f.folder.OPEN:case f.folder.CLOSE:case f.folder.DOCU:d[1]=
c}a.attr("class",d.join("_"));c!==f.folder.DOCU?a.removeAttr("disabled"):a.attr("disabled","disabled")}}},selectNode:function(b,a,c){c||i.cancelPreSelectedNode(b,null,a);l(a,f.id.A,b).addClass(f.node.CURSELECTED);g.addSelectedNode(b,a);b.treeObj.trigger(f.event.SELECTED,[b.treeId,a])},setNodeFontCss:function(b,a){var c=l(a,f.id.A,b),d=i.makeNodeFontCss(b,a);d&&c.css(d)},setNodeLineIcos:function(b,a){if(a){var c=l(a,f.id.SWITCH,b),d=l(a,f.id.UL,b),e=l(a,f.id.ICON,b),h=i.makeUlLineClass(b,a);h.length==
0?d.removeClass(f.line.LINE):d.addClass(h);c.attr("class",i.makeNodeLineClass(b,a));a.isParent?c.removeAttr("disabled"):c.attr("disabled","disabled");e.removeAttr("style");e.attr("style",i.makeNodeIcoStyle(b,a));e.attr("class",i.makeNodeIcoClass(b,a))}},setNodeName:function(b,a){var c=g.getNodeTitle(b,a),d=l(a,f.id.SPAN,b);d.empty();b.view.nameIsHTML?d.html(g.getNodeName(b,a)):d.text(g.getNodeName(b,a));j.apply(b.view.showTitle,[b.treeId,a],b.view.showTitle)&&l(a,f.id.A,b).attr("title",!c?"":c)},
setNodeTarget:function(b,a){l(a,f.id.A,b).attr("target",i.makeNodeTarget(a))},setNodeUrl:function(b,a){var c=l(a,f.id.A,b),d=i.makeNodeUrl(b,a);d==null||d.length==0?c.removeAttr("href"):c.attr("href",d)},switchNode:function(b,a){a.open||!j.canAsync(b,a)?i.expandCollapseNode(b,a,!a.open):b.async.enable?i.asyncNode(b,a)||i.expandCollapseNode(b,a,!a.open):a&&i.expandCollapseNode(b,a,!a.open)}};q.fn.zTree={consts:{className:{BUTTON:"button",LEVEL:"level",ICO_LOADING:"ico_loading",SWITCH:"switch",NAME:"node_name"},
event:{NODECREATED:"ztree_nodeCreated",CLICK:"ztree_click",EXPAND:"ztree_expand",COLLAPSE:"ztree_collapse",ASYNC_SUCCESS:"ztree_async_success",ASYNC_ERROR:"ztree_async_error",REMOVE:"ztree_remove",SELECTED:"ztree_selected",UNSELECTED:"ztree_unselected"},id:{A:"_a",ICON:"_ico",SPAN:"_span",SWITCH:"_switch",UL:"_ul"},line:{ROOT:"root",ROOTS:"roots",CENTER:"center",BOTTOM:"bottom",NOLINE:"noline",LINE:"line"},folder:{OPEN:"open",CLOSE:"close",DOCU:"docu"},node:{CURSELECTED:"curSelectedNode"}},_z:{tools:j,
view:i,event:m,data:g},getZTreeObj:function(b){return(b=g.getZTreeTools(b))?b:null},destroy:function(b){if(b&&b.length>0)i.destroy(g.getSetting(b));else for(var a in s)i.destroy(s[a])},init:function(b,a,c){var d=j.clone(N);q.extend(!0,d,a);d.treeId=b.attr("id");d.treeObj=b;d.treeObj.empty();s[d.treeId]=d;if(typeof document.body.style.maxHeight==="undefined")d.view.expandSpeed="";g.initRoot(d);b=g.getRoot(d);a=d.data.key.children;c=c?j.clone(j.isArray(c)?c:[c]):[];b[a]=d.data.simpleData.enable?g.transformTozTreeFormat(d,
c):c;g.initCache(d);m.unbindTree(d);m.bindTree(d);m.unbindEvent(d);m.bindEvent(d);var e={setting:d,addNodes:function(a,b,c,e){function f(){i.addNodes(d,a,b,l,e==!0)}a||(a=null);if(a&&!a.isParent&&d.data.keep.leaf)return null;var g=parseInt(b,10);isNaN(g)?(e=!!c,c=b,b=-1):b=g;if(!c)return null;var l=j.clone(j.isArray(c)?c:[c]);j.canAsync(d,a)?i.asyncNode(d,a,e,f):f();return l},cancelSelectedNode:function(a){i.cancelPreSelectedNode(d,a)},destroy:function(){i.destroy(d)},expandAll:function(a){a=!!a;
i.expandCollapseSonNode(d,null,a,!0);return a},expandNode:function(a,b,c,e,f){function m(){var b=l(a,d).get(0);b&&e!==!1&&i.scrollIntoView(d,b)}if(!a||!a.isParent)return null;b!==!0&&b!==!1&&(b=!a.open);if((f=!!f)&&b&&j.apply(d.callback.beforeExpand,[d.treeId,a],!0)==!1)return null;else if(f&&!b&&j.apply(d.callback.beforeCollapse,[d.treeId,a],!0)==!1)return null;b&&a.parentTId&&i.expandCollapseParentNode(d,a.getParentNode(),b,!1);if(b===a.open&&!c)return null;g.getRoot(d).expandTriggerFlag=f;!j.canAsync(d,
a)&&c?i.expandCollapseSonNode(d,a,b,!0,m):(a.open=!b,i.switchNode(this.setting,a),m());return b},getNodes:function(){return g.getNodes(d)},getNodeByParam:function(a,b,c){return!a?null:g.getNodeByParam(d,c?c[d.data.key.children]:g.getNodes(d),a,b)},getNodeByTId:function(a){return g.getNodeCache(d,a)},getNodesByParam:function(a,b,c){return!a?null:g.getNodesByParam(d,c?c[d.data.key.children]:g.getNodes(d),a,b)},getNodesByParamFuzzy:function(a,b,c){return!a?null:g.getNodesByParamFuzzy(d,c?c[d.data.key.children]:
g.getNodes(d),a,b)},getNodesByFilter:function(a,b,c,e){b=!!b;return!a||typeof a!="function"?b?null:[]:g.getNodesByFilter(d,c?c[d.data.key.children]:g.getNodes(d),a,b,e)},getNodeIndex:function(a){if(!a)return null;for(var b=d.data.key.children,c=a.parentTId?a.getParentNode():g.getRoot(d),e=0,f=c[b].length;e<f;e++)if(c[b][e]==a)return e;return-1},getSelectedNodes:function(){for(var a=[],b=g.getRoot(d).curSelectedList,c=0,e=b.length;c<e;c++)a.push(b[c]);return a},isSelectedNode:function(a){return g.isSelectedNode(d,
a)},reAsyncChildNodesPromise:function(a,b,c){return new Promise(function(d,f){try{e.reAsyncChildNodes(a,b,c,function(){d(a)})}catch(g){f(g)}})},reAsyncChildNodes:function(a,b,c,e){if(this.setting.async.enable){var j=!a;j&&(a=g.getRoot(d));if(b=="refresh"){for(var b=this.setting.data.key.children,m=0,q=a[b]?a[b].length:0;m<q;m++)g.removeNodeCache(d,a[b][m]);g.removeSelectedNode(d);a[b]=[];j?this.setting.treeObj.empty():l(a,f.id.UL,d).empty()}i.asyncNode(this.setting,j?null:a,!!c,e)}},refresh:function(){this.setting.treeObj.empty();
var a=g.getRoot(d),b=a[d.data.key.children];g.initRoot(d);a[d.data.key.children]=b;g.initCache(d);i.createNodes(d,0,a[d.data.key.children],null,-1)},removeChildNodes:function(a){if(!a)return null;var b=a[d.data.key.children];i.removeChildNodes(d,a);return b?b:null},removeNode:function(a,b){a&&(b=!!b,b&&j.apply(d.callback.beforeRemove,[d.treeId,a],!0)==!1||(i.removeNode(d,a),b&&this.setting.treeObj.trigger(f.event.REMOVE,[d.treeId,a])))},selectNode:function(a,b,c){function e(){if(!c){var b=l(a,d).get(0);
i.scrollIntoView(d,b)}}if(a&&j.uCanDo(d)){b=d.view.selectedMulti&&b;if(a.parentTId)i.expandCollapseParentNode(d,a.getParentNode(),!0,!1,e);else if(!c)try{l(a,d).focus().blur()}catch(f){}i.selectNode(d,a,b)}},transformTozTreeNodes:function(a){return g.transformTozTreeFormat(d,a)},transformToArray:function(a){return g.transformToArrayFormat(d,a)},updateNode:function(a){a&&l(a,d).get(0)&&j.uCanDo(d)&&(i.setNodeName(d,a),i.setNodeTarget(d,a),i.setNodeUrl(d,a),i.setNodeLineIcos(d,a),i.setNodeFontCss(d,
a))}};b.treeTools=e;g.setZTreeTools(d,e);b[a]&&b[a].length>0?i.createNodes(d,0,b[a],null,-1):d.async.enable&&d.async.url&&d.async.url!==""&&i.asyncNode(d);return e}};var O=q.fn.zTree,l=j.$,f=O.consts})(jQuery);
