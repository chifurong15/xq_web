
/**
 * @description:  缩放级别对应的缩放比例尺
 * @author: GF
 * @date: 2018-8-24
 */
angular.module('app')
    .service('OneMapMinScaleType', [function(){
        this.Scale6 = 9234299.955338579649305158512;
        this.Scale7 = 4617149.9776692898246525792559;
        this.Scale8 = 2308574.9888346498;
        this.Scale9 = 1154287.4944173226;
        this.Scale10 = 577143.7472086610;
        this.Scale11 = 288571.87360433099;
        this.Scale12 = 144285.936802165;
        this.Scale13 = 72142.968401082704;
        this.Scale14 = 36071.484200541301;
        this.Scale15 = 18035.742100270701;
        this.Scale16 = 9017.8710501353307;
        this.Scale17 = 4508.9355250676663;
        this.Scale18 = 4508.9355250676663 / 2;
        this.Scale19 = 4508.9355250676663 / 4;
        this.Scale20 = 4508.9355250676663 / 8;
        this.ScaleUnKnown = 18468599.910677159298610317023;  //5级的比例尺
    }]);

