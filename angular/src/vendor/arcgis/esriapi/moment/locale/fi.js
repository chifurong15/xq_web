//>>built
(function(d,a){"object"===typeof exports&&"undefined"!==typeof module&&"function"===typeof require?a(require("../moment")):"function"===typeof define&&define.amd?define("moment/locale/fi",["../moment"],a):a(d.moment)})(this,function(d){function a(a,c,d,b){c="";switch(d){case "s":return b?"muutaman sekunnin":"muutama sekunti";case "ss":return b?"sekunnin":"sekuntia";case "m":return b?"minuutin":"minuutti";case "mm":c=b?"minuutin":"minuuttia";break;case "h":return b?"tunnin":"tunti";case "hh":c=b?"tunnin":
"tuntia";break;case "d":return b?"p\u00e4iv\u00e4n":"p\u00e4iv\u00e4";case "dd":c=b?"p\u00e4iv\u00e4n":"p\u00e4iv\u00e4\u00e4";break;case "M":return b?"kuukauden":"kuukausi";case "MM":c=b?"kuukauden":"kuukautta";break;case "y":return b?"vuoden":"vuosi";case "yy":c=b?"vuoden":"vuotta"}return c=(10>a?b?f[a]:e[a]:a)+" "+c}var e="nolla yksi kaksi kolme nelj\u00e4 viisi kuusi seitsem\u00e4n kahdeksan yhdeks\u00e4n".split(" "),f=["nolla","yhden","kahden","kolmen","nelj\u00e4n","viiden","kuuden",e[7],e[8],
e[9]];return d.defineLocale("fi",{months:"tammikuu helmikuu maaliskuu huhtikuu toukokuu kes\u00e4kuu hein\u00e4kuu elokuu syyskuu lokakuu marraskuu joulukuu".split(" "),monthsShort:"tammi helmi maalis huhti touko kes\u00e4 hein\u00e4 elo syys loka marras joulu".split(" "),weekdays:"sunnuntai maanantai tiistai keskiviikko torstai perjantai lauantai".split(" "),weekdaysShort:"su ma ti ke to pe la".split(" "),weekdaysMin:"su ma ti ke to pe la".split(" "),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",
LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[t\u00e4n\u00e4\u00e4n] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s p\u00e4\u00e4st\u00e4",past:"%s sitten",s:a,ss:a,m:a,mm:a,h:a,hh:a,d:a,dd:a,M:a,MM:a,y:a,yy:a},
dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})});