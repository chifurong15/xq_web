//>>built
(function(e,a){"object"===typeof exports&&"undefined"!==typeof module&&"function"===typeof require?a(require("../moment")):"function"===typeof define&&define.amd?define("moment/locale/sk",["../moment"],a):a(e.moment)})(this,function(e){function a(a,b,e,c){var d=a+" ";switch(e){case "s":return b||c?"p\u00e1r sek\u00fand":"p\u00e1r sekundami";case "ss":return b||c?d+(1<a&&5>a?"sekundy":"sek\u00fand"):d+"sekundami";case "m":return b?"min\u00fata":c?"min\u00fatu":"min\u00fatou";case "mm":return b||c?
d+(1<a&&5>a?"min\u00faty":"min\u00fat"):d+"min\u00fatami";case "h":return b?"hodina":c?"hodinu":"hodinou";case "hh":return b||c?d+(1<a&&5>a?"hodiny":"hod\u00edn"):d+"hodinami";case "d":return b||c?"de\u0148":"d\u0148om";case "dd":return b||c?d+(1<a&&5>a?"dni":"dn\u00ed"):d+"d\u0148ami";case "M":return b||c?"mesiac":"mesiacom";case "MM":return b||c?d+(1<a&&5>a?"mesiace":"mesiacov"):d+"mesiacmi";case "y":return b||c?"rok":"rokom";case "yy":return b||c?d+(1<a&&5>a?"roky":"rokov"):d+"rokmi"}}return e.defineLocale("sk",
{months:"janu\u00e1r febru\u00e1r marec apr\u00edl m\u00e1j j\u00fan j\u00fal august september okt\u00f3ber november december".split(" "),monthsShort:"jan feb mar apr m\u00e1j j\u00fan j\u00fal aug sep okt nov dec".split(" "),weekdays:"nede\u013ea pondelok utorok streda \u0161tvrtok piatok sobota".split(" "),weekdaysShort:"ne po ut st \u0161t pi so".split(" "),weekdaysMin:"ne po ut st \u0161t pi so".split(" "),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",
LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nede\u013eu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo \u0161tvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[v\u010dera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minul\u00fa nede\u013eu o] LT";case 1:case 2:return"[minul\u00fd] dddd [o] LT";case 3:return"[minul\u00fa stredu o] LT";
case 4:case 5:return"[minul\u00fd] dddd [o] LT";case 6:return"[minul\u00fa sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:a,ss:a,m:a,mm:a,h:a,hh:a,d:a,dd:a,M:a,MM:a,y:a,yy:a},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})});