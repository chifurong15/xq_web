//>>built
require({cache:{"url:dojox/widget/MultiSelectCalendar/MultiSelectCalendar.html":'\x3ctable cellspacing\x3d"0" cellpadding\x3d"0" class\x3d"dijitCalendarContainer" role\x3d"grid" dojoAttachEvent\x3d"onkeydown: _onKeyDown" aria-labelledby\x3d"${id}_year"\x3e\r\n\t\x3cthead\x3e\r\n\t\t\x3ctr class\x3d"dijitReset dijitCalendarMonthContainer" valign\x3d"top"\x3e\r\n\t\t\t\x3cth class\x3d\'dijitReset dijitCalendarArrow\' dojoAttachPoint\x3d"decrementMonth"\x3e\r\n\t\t\t\t\x3cimg src\x3d"${_blankGif}" alt\x3d"" class\x3d"dijitCalendarIncrementControl dijitCalendarDecrease" role\x3d"presentation"/\x3e\r\n\t\t\t\t\x3cspan dojoAttachPoint\x3d"decreaseArrowNode" class\x3d"dijitA11ySideArrow"\x3e-\x3c/span\x3e\r\n\t\t\t\x3c/th\x3e\r\n\t\t\t\x3cth class\x3d\'dijitReset\' colspan\x3d"5"\x3e\r\n\t\t\t\t\x3cdiv dojoType\x3d"dijit.form.DropDownButton" dojoAttachPoint\x3d"monthDropDownButton"\r\n\t\t\t\t\tid\x3d"${id}_mddb" tabIndex\x3d"-1"\x3e\r\n\t\t\t\t\x3c/div\x3e\r\n\t\t\t\x3c/th\x3e\r\n\t\t\t\x3cth class\x3d\'dijitReset dijitCalendarArrow\' dojoAttachPoint\x3d"incrementMonth"\x3e\r\n\t\t\t\t\x3cimg src\x3d"${_blankGif}" alt\x3d"" class\x3d"dijitCalendarIncrementControl dijitCalendarIncrease" role\x3d"presentation"/\x3e\r\n\t\t\t\t\x3cspan dojoAttachPoint\x3d"increaseArrowNode" class\x3d"dijitA11ySideArrow"\x3e+\x3c/span\x3e\r\n\t\t\t\x3c/th\x3e\r\n\t\t\x3c/tr\x3e\r\n\t\t\x3ctr\x3e\r\n\t\t\t\x3cth class\x3d"dijitReset dijitCalendarDayLabelTemplate" role\x3d"columnheader"\x3e\x3cspan class\x3d"dijitCalendarDayLabel"\x3e\x3c/span\x3e\x3c/th\x3e\r\n\t\t\x3c/tr\x3e\r\n\t\x3c/thead\x3e\r\n\t\x3ctbody dojoAttachEvent\x3d"onclick: _onDayClick, onmouseover: _onDayMouseOver, onmouseout: _onDayMouseOut, onmousedown: _onDayMouseDown, onmouseup: _onDayMouseUp" class\x3d"dijitReset dijitCalendarBodyContainer"\x3e\r\n\t\t\x3ctr class\x3d"dijitReset dijitCalendarWeekTemplate" role\x3d"row"\x3e\r\n\t\t\t\x3ctd class\x3d"dijitReset dijitCalendarDateTemplate" role\x3d"gridcell"\x3e\x3cspan class\x3d"dijitCalendarDateLabel"\x3e\x3c/span\x3e\x3c/td\x3e\r\n\t\t\x3c/tr\x3e\r\n\t\x3c/tbody\x3e\r\n\t\x3ctfoot class\x3d"dijitReset dijitCalendarYearContainer"\x3e\r\n\t\t\x3ctr\x3e\r\n\t\t\t\x3ctd class\x3d\'dijitReset\' valign\x3d"top" colspan\x3d"7"\x3e\r\n\t\t\t\t\x3ch3 class\x3d"dijitCalendarYearLabel"\x3e\r\n\t\t\t\t\t\x3cspan dojoAttachPoint\x3d"previousYearLabelNode" class\x3d"dijitInline dijitCalendarPreviousYear"\x3e\x3c/span\x3e\r\n\t\t\t\t\t\x3cspan dojoAttachPoint\x3d"currentYearLabelNode" class\x3d"dijitInline dijitCalendarSelectedYear" id\x3d"${id}_year"\x3e\x3c/span\x3e\r\n\t\t\t\t\t\x3cspan dojoAttachPoint\x3d"nextYearLabelNode" class\x3d"dijitInline dijitCalendarNextYear"\x3e\x3c/span\x3e\r\n\t\t\t\t\x3c/h3\x3e\r\n\t\t\t\x3c/td\x3e\r\n\t\t\x3c/tr\x3e\r\n\t\x3c/tfoot\x3e\r\n\x3c/table\x3e'}});
define("dojox/widget/MultiSelectCalendar","dojo/main dijit dojo/text!./MultiSelectCalendar/MultiSelectCalendar.html dojo/cldr/supplemental dojo/date dojo/date/stamp dojo/date/locale dijit/_Widget dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dijit/_CssStateMixin dijit/form/DropDownButton dijit/typematic".split(" "),function(c,v,k,y,n,h,z,r,t,u,w,A,B){c.experimental("dojox.widget.MultiSelectCalendar");k=c.declare("dojox.widget.MultiSelectCalendar",[r,t,u,w],{templateString:k,widgetsInTemplate:!0,
value:{},datePackage:"dojo.date",dayWidth:"narrow",tabIndex:"0",returnIsoRanges:!1,currentFocus:new Date,baseClass:"dijitCalendar",cssStateNodes:{decrementMonth:"dijitCalendarArrow",incrementMonth:"dijitCalendarArrow",previousYearLabelNode:"dijitCalendarPreviousYear",nextYearLabelNode:"dijitCalendarNextYear"},_areValidDates:function(a){for(var b in this.value)if(valid=b&&!isNaN(b)&&"object"==typeof a&&b.toString()!=this.constructor.prototype.value.toString(),!valid)return!1;return!0},_getValueAttr:function(){return this.returnIsoRanges?
datesWithRanges=this._returnDatesWithIsoRanges(this._sort()):this._sort()},_setValueAttr:function(a,b){this.value={};if(c.isArray(a))c.forEach(a,function(a,b){if(-1==a.indexOf("/"))this.value[a]=1;else{var c=h.fromISOString(a.substr(0,10)),d=h.fromISOString(a.substr(11,10));this.toggleDate(c,[],[]);0<c-d?this._addToRangeRTL(c,d,[],[]):this._addToRangeLTR(c,d,[],[])}},this),0<a.length&&this.focusOnLastDate(a[a.length-1]);else if(a&&(a=new this.dateClassObj(a)),this._isValidDate(a)&&(a.setHours(1,0,
0,0),!this.isDisabledDate(a,this.lang)&&(dateIndex=h.toISOString(a).substring(0,10),this.value[dateIndex]=1,this.set("currentFocus",a),b||"undefined"==typeof b)))this.onChange(this.get("value")),this.onValueSelected(this.get("value"));this._populateGrid()},focusOnLastDate:function(a){var b;-1==a.indexOf("/")?lastDate=h.fromISOString(a):(b=h.fromISOString(a.substr(0,10)),a=h.fromISOString(a.substr(11,10)),lastDate=0<b-a?b:a);this.set("currentFocus",lastDate)},_isValidDate:function(a){return a&&!isNaN(a)&&
"object"==typeof a&&a.toString()!=this.constructor.prototype.value.toString()},_setText:function(a,b){for(;a.firstChild;)a.removeChild(a.firstChild);a.appendChild(c.doc.createTextNode(b))},_populateGrid:function(){var a=new this.dateClassObj(this.currentFocus);a.setDate(1);var b=a.getDay(),f=this.dateFuncObj.getDaysInMonth(a),d=this.dateFuncObj.getDaysInMonth(this.dateFuncObj.add(a,"month",-1)),e=new this.dateClassObj,g=c.cldr.supplemental.getFirstDayOfWeek(this.lang);g>b&&(g-=7);this.listOfNodes=
c.query(".dijitCalendarDateTemplate",this.domNode);this.listOfNodes.forEach(function(p,n){n+=g;var l=new this.dateClassObj(a),k,m="dijitCalendar",q=0;n<b?(k=d-b+n+1,q=-1,m+="Previous"):n>=b+f?(k=n-b-f+1,q=1,m+="Next"):(k=n-b+1,m+="Current");q&&(l=this.dateFuncObj.add(l,"month",q));l.setDate(k);this.dateFuncObj.compare(l,e,"date")||(m="dijitCalendarCurrentDate "+m);dateIndex=h.toISOString(l).substring(0,10);this.isDisabledDate(l,this.lang)||this._isSelectedDate(l,this.lang)&&(m=this.value[dateIndex]?
"dijitCalendarSelectedDate "+m:m.replace("dijitCalendarSelectedDate ",""));this._isSelectedDate(l,this.lang)&&(m="dijitCalendarBrowsingDate "+m);this.isDisabledDate(l,this.lang)&&(m="dijitCalendarDisabledDate "+m);(k=this.getClassForDate(l,this.lang))&&(m=k+" "+m);p.className=m+"Month dijitCalendarDateTemplate";p.dijitDateValue=l.valueOf();c.attr(p,"dijitDateValue",l.valueOf());m=c.query(".dijitCalendarDateLabel",p)[0];l=l.getDateLocalized?l.getDateLocalized(this.lang):l.getDate();this._setText(m,
l)},this);var p=this.dateLocaleModule.getNames("months","wide","standAlone",this.lang,a);this.monthDropDownButton.dropDown.set("months",p);this.monthDropDownButton.containerNode.innerHTML=(6==c.isIE?"":"\x3cdiv class\x3d'dijitSpacer'\x3e"+this.monthDropDownButton.dropDown.domNode.innerHTML+"\x3c/div\x3e")+"\x3cdiv class\x3d'dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel'\x3e"+p[a.getMonth()]+"\x3c/div\x3e";var n=a.getFullYear()-1,k=new this.dateClassObj;c.forEach(["previous","current","next"],
function(a){k.setFullYear(n++);this._setText(this[a+"YearLabelNode"],this.dateLocaleModule.format(k,{selector:"year",locale:this.lang}))},this)},goToToday:function(){this.set("currentFocus",new this.dateClassObj,!1)},constructor:function(a){this.dateClassObj=c.getObject(a.datePackage&&"dojo.date"!=a.datePackage?a.datePackage+".Date":"Date",!1);this.datePackage=a.datePackage||this.datePackage;this.dateFuncObj=c.getObject(this.datePackage,!1);this.dateLocaleModule=c.getObject(this.datePackage+".locale",
!1)},buildRendering:function(){this.inherited(arguments);c.setSelectable(this.domNode,!1);var a=c.hitch(this,function(a,b){for(var d=c.query(a,this.domNode)[0],f=0;f<b;f++)d.parentNode.appendChild(d.cloneNode(!0))});a(".dijitCalendarDayLabelTemplate",6);a(".dijitCalendarDateTemplate",6);a(".dijitCalendarWeekTemplate",5);var b=this.dateLocaleModule.getNames("days",this.dayWidth,"standAlone",this.lang),f=c.cldr.supplemental.getFirstDayOfWeek(this.lang);c.query(".dijitCalendarDayLabel",this.domNode).forEach(function(a,
c){this._setText(a,b[(c+f)%7])},this);a=new this.dateClassObj(this.currentFocus);this.monthDropDownButton.dropDown=new x({id:this.id+"_mdd",onChange:c.hitch(this,"_onMonthSelect")});this.set("currentFocus",a,!1);var d=this,a=function(a,b,c){d._connects.push(v.typematic.addMouseListener(d[a],d,function(a){0<=a&&d._adjustDisplay(b,c)},.8,500))};a("incrementMonth","month",1);a("decrementMonth","month",-1);a("nextYearLabelNode","year",1);a("previousYearLabelNode","year",-1)},_adjustDisplay:function(a,
b){this._setCurrentFocusAttr(this.dateFuncObj.add(this.currentFocus,a,b))},_setCurrentFocusAttr:function(a,b){var f=this.currentFocus,f=f?c.query("[dijitDateValue\x3d"+f.valueOf()+"]",this.domNode)[0]:null;a=new this.dateClassObj(a);a.setHours(1,0,0,0);this._set("currentFocus",a);var d=h.toISOString(a).substring(0,7);d!=this.previousMonth&&(this._populateGrid(),this.previousMonth=d);d=c.query("[dijitDateValue\x3d'"+a.valueOf()+"']",this.domNode)[0];d.setAttribute("tabIndex",this.tabIndex);(this._focused||
b)&&d.focus();f&&f!=d&&(c.isWebKit?f.setAttribute("tabIndex","-1"):f.removeAttribute("tabIndex"))},focus:function(){this._setCurrentFocusAttr(this.currentFocus,!0)},_onMonthSelect:function(a){this.currentFocus=this.dateFuncObj.add(this.currentFocus,"month",a-this.currentFocus.getMonth());this._populateGrid()},toggleDate:function(a,b,c){var d=h.toISOString(a).substring(0,10);this.value[d]?this.unselectDate(a,c):this.selectDate(a,b)},selectDate:function(a,b){var c=this._getNodeByDate(a),d=c.className,
e=h.toISOString(a).substring(0,10);this.value[e]=1;b.push(e);c.className="dijitCalendarSelectedDate "+d},unselectDate:function(a,b){var c=this._getNodeByDate(a),d=c.className,e=h.toISOString(a).substring(0,10);delete this.value[e];b.push(e);d=d.replace("dijitCalendarSelectedDate ","");c.className=d},_getNodeByDate:function(a){var b=new this.dateClassObj(this.listOfNodes[0].dijitDateValue);a=Math.abs(c.date.difference(b,a,"day"));return this.listOfNodes[a]},_onDayClick:function(a){c.stopEvent(a);for(a=
a.target;a&&!a.dijitDateValue;a=a.parentNode);a&&!c.hasClass(a,"dijitCalendarDisabledDate")&&(value=new this.dateClassObj(a.dijitDateValue),this.rangeJustSelected?(this.rangeJustSelected=!1,this.set("currentFocus",value)):(this.toggleDate(value,[],[]),this.previouslySelectedDay=value,this.set("currentFocus",value),this.onValueSelected([h.toISOString(value).substring(0,10)])))},_onDayMouseOver:function(a){(a=c.hasClass(a.target,"dijitCalendarDateLabel")?a.target.parentNode:a.target)&&(a.dijitDateValue||
a==this.previousYearLabelNode||a==this.nextYearLabelNode)&&(c.addClass(a,"dijitCalendarHoveredDate"),this._currentNode=a)},_setEndRangeAttr:function(a){a=new this.dateClassObj(a);a.setHours(1);this.endRange=a},_getEndRangeAttr:function(){var a=new this.dateClassObj(this.endRange);a.setHours(0,0,0,0);a.getDate()<this.endRange.getDate()&&(a=this.dateFuncObj.add(a,"hour",1));return a},_onDayMouseOut:function(a){!this._currentNode||a.relatedTarget&&a.relatedTarget.parentNode==this._currentNode||(a="dijitCalendarHoveredDate",
c.hasClass(this._currentNode,"dijitCalendarActiveDate")&&(a+=" dijitCalendarActiveDate"),c.removeClass(this._currentNode,a),this._currentNode=null)},_onDayMouseDown:function(a){var b=a.target.parentNode;b&&b.dijitDateValue&&(c.addClass(b,"dijitCalendarActiveDate"),this._currentNode=b);a.shiftKey&&this.previouslySelectedDay?(this.selectingRange=!0,this.set("endRange",b.dijitDateValue),this._selectRange()):(this.selectingRange=!1,this.previousRangeEnd=this.previousRangeStart=null)},_onDayMouseUp:function(a){(a=
a.target.parentNode)&&a.dijitDateValue&&c.removeClass(a,"dijitCalendarActiveDate")},handleKey:function(a){var b=c.keys,f=-1,d,e=this.currentFocus;switch(a.keyCode){case b.RIGHT_ARROW:f=1;case b.LEFT_ARROW:d="day";this.isLeftToRight()||(f*=-1);break;case b.DOWN_ARROW:f=1;case b.UP_ARROW:d="week";break;case b.PAGE_DOWN:f=1;case b.PAGE_UP:d=a.ctrlKey||a.altKey?"year":"month";break;case b.END:e=this.dateFuncObj.add(e,"month",1),d="day";case b.HOME:e=new this.dateClassObj(e);e.setDate(1);break;case b.ENTER:case b.SPACE:a.shiftKey&&
this.previouslySelectedDay?(this.selectingRange=!0,this.set("endRange",e),this._selectRange()):(this.selectingRange=!1,this.toggleDate(e,[],[]),this.previouslySelectedDay=e,this.previousRangeEnd=this.previousRangeStart=null,this.onValueSelected([h.toISOString(e).substring(0,10)]));break;default:return!0}d&&(e=this.dateFuncObj.add(e,d,f));this.set("currentFocus",e);return!1},_onKeyDown:function(a){this.handleKey(a)||c.stopEvent(a)},_removeFromRangeLTR:function(a,b,f,d){difference=Math.abs(c.date.difference(a,
b,"day"));for(var e=0;e<=difference;e++){var g=n.add(a,"day",e);this.toggleDate(g,f,d)}null===this.previousRangeEnd?this.previousRangeEnd=b:0<c.date.compare(b,this.previousRangeEnd,"date")&&(this.previousRangeEnd=b);null===this.previousRangeStart?this.previousRangeStart=b:0<c.date.compare(b,this.previousRangeStart,"date")&&(this.previousRangeStart=b);this.previouslySelectedDay=n.add(g,"day",1)},_removeFromRangeRTL:function(a,b,f,d){difference=Math.abs(c.date.difference(a,b,"day"));for(var e=0;e<=
difference;e++){var g=c.date.add(a,"day",-e);this.toggleDate(g,f,d)}null===this.previousRangeEnd?this.previousRangeEnd=b:0>c.date.compare(b,this.previousRangeEnd,"date")&&(this.previousRangeEnd=b);null===this.previousRangeStart?this.previousRangeStart=b:0>c.date.compare(b,this.previousRangeStart,"date")&&(this.previousRangeStart=b);this.previouslySelectedDay=n.add(g,"day",-1)},_addToRangeRTL:function(a,b,f,d){difference=Math.abs(n.difference(a,b,"day"));for(var e=1;e<=difference;e++){var g=n.add(a,
"day",-e);this.toggleDate(g,f,d)}null===this.previousRangeStart?this.previousRangeStart=b:0>c.date.compare(b,this.previousRangeStart,"date")&&(this.previousRangeStart=b);null===this.previousRangeEnd?this.previousRangeEnd=a:0<c.date.compare(a,this.previousRangeEnd,"date")&&(this.previousRangeEnd=a);this.previouslySelectedDay=g},_addToRangeLTR:function(a,b,f,d){difference=Math.abs(c.date.difference(a,b,"day"));for(var e=1;e<=difference;e++){var g=c.date.add(a,"day",e);this.toggleDate(g,f,d)}null===
this.previousRangeStart?this.previousRangeStart=a:0>c.date.compare(a,this.previousRangeStart,"date")&&(this.previousRangeStart=a);null===this.previousRangeEnd?this.previousRangeEnd=b:0<c.date.compare(b,this.previousRangeEnd,"date")&&(this.previousRangeEnd=b);this.previouslySelectedDay=g},_selectRange:function(){var a=[],b=[],f=this.previouslySelectedDay,d=this.get("endRange");removingFromRange=this.previousRangeStart||this.previousRangeEnd?0>c.date.compare(d,this.previousRangeStart,"date")||0<c.date.compare(d,
this.previousRangeEnd,"date")?!1:!0:!1;!0===removingFromRange?0>c.date.compare(d,f,"date")?this._removeFromRangeRTL(f,d,a,b):this._removeFromRangeLTR(f,d,a,b):0>c.date.compare(d,f,"date")?this._addToRangeRTL(f,d,a,b):this._addToRangeLTR(f,d,a,b);if(0<a.length)this.onValueSelected(a);if(0<b.length)this.onValueUnselected(b);this.rangeJustSelected=!0},onValueSelected:function(a){},onValueUnselected:function(a){},onChange:function(a){},_isSelectedDate:function(a,b){dateIndex=h.toISOString(a).substring(0,
10);return this.value[dateIndex]},isDisabledDate:function(a,b){},getClassForDate:function(a,b){},_sort:function(){if(this.value=={})return[];var a=[],b;for(b in this.value)a.push(b);a.sort(function(a,b){return new Date(a)-new Date(b)});return a},_returnDatesWithIsoRanges:function(a){var b=[];if(1<a.length){for(var c=!1,d=null,e=null,g=h.fromISOString(a[0]),k=1;k<a.length+1;k++)currentDate=h.fromISOString(a[k]),c?(difference=Math.abs(n.difference(g,currentDate,"day")),1==difference?e=currentDate:(range=
h.toISOString(d).substring(0,10)+"/"+h.toISOString(e).substring(0,10),b.push(range),c=!1)):(difference=Math.abs(n.difference(g,currentDate,"day")),1==difference?(c=!0,d=g,e=currentDate):b.push(h.toISOString(g).substring(0,10))),g=currentDate;return b}return a}});var x=k._MonthDropDown=c.declare("dojox.widget._MonthDropDown",[r,t,u],{months:[],templateString:"\x3cdiv class\x3d'dijitCalendarMonthMenu dijitMenu' dojoAttachEvent\x3d'onclick:_onClick,onmouseover:_onMenuHover,onmouseout:_onMenuHover'\x3e\x3c/div\x3e",
_setMonthsAttr:function(a){this.domNode.innerHTML=c.map(a,function(a,c){return a?"\x3cdiv class\x3d'dijitCalendarMonthLabel' month\x3d'"+c+"'\x3e"+a+"\x3c/div\x3e":""}).join("")},_onClick:function(a){this.onChange(c.attr(a.target,"month"))},onChange:function(a){},_onMenuHover:function(a){c.toggleClass(a.target,"dijitCalendarMonthLabelHover","mouseover"==a.type)}});return k});