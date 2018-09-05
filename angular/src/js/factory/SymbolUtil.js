/**
 * @description:  Symbol符号类
 * @author: HuangSF
 * @date: 2018-7-17 10:38
 */
angular.module('app')
    .factory('SymbolUtil', ['wish', function(wish){
        var that = this;
        var w = wish.get();
        that.map = null;
        //初始化
        var _init = function(map){
            that.map = map;
        };
        //返回点符号
        var _getMarkerSymbol = function(color, size, outline, style){
            var symbol = new w.SimpleMarkerSymbol();
            if(color){
                symbol.setColor(color);
            }
            if(size) {
                symbol.setSize(size);
            }
            if(outline) {
                symbol.setOutline(outline);
            }
            if(style) {
                symbol.setStyle(style);
            }

            return symbol;
        };
        //返回图片点符号
        var _getPictureMarkerSymbol = function(imgPath, width, height){
            var symbol = new w.PictureMarkerSymbol(imgPath, width, height).setOffset(0, 15);
            return symbol;
        };
        //返回点文本符号
        var _getTextSymbol = function(text, font, color){
            var symbol = new w.TextSymbol();
            if(text){
                symbol.setText(text);
            }
            if(font){
                symbol.setFont(font);
            }
            if(color){
                symbol.setColor(color);
            }
        };
        //返回线符号
        var _getLineSymbol = function(style, color, width){
            var symbol = new w.SimpleLineSymbol();
            if(style) symbol.setStyle(style);
            if(color){
                if(Object.prototype.toString.call(color) === '[object Array]'){
                    color = this.getColorByArray(color);
                    symbol.setColor(color);
                }else{
                    symbol.setColor(color);
                }
            }
            if(width) symbol.setWidth(width);

            return symbol;
        };
        //返回面符号
        var _getFillSymbol = function(color, outline, style){
            var symbol = new w.SimpleFillSymbol();
            if(color){
                if(Object.prototype.toString.call(color) === '[object Array]'){
                    color = this.getColorByArray(color);
                }
                symbol.setColor(color);
            }
            if(outline) symbol.setOutline(outline);
            symbol.setStyle(style || "solid");

            return symbol;
        };
        //根据RGB格式获取颜色：[255,0,0]
        var _getColorByArray = function(colorArray){
            return esri.Color.fromArray(colorArray);
        };
        //根据十六进制格式获取颜色: #ff0000
        var _getColorByHex = function(hex){
            return esri.Color.fromHex(hex);
        };
        //字体
        var _getFont = function(size, weight, family, style){
            var symbol = new w.Font();
            if(size) symbol.setSize(size);
            symbol.setWeight(weight || "bold");
            symbol.setFamily(family || "Microsoft YaHei");
            if(style) symbol.setStyle(style);

            return symbol;
        };

        return {
            init: _init,
            getPictureMarkerSymbol: _getPictureMarkerSymbol,
            getMarkerSymbol: _getMarkerSymbol,
            getTextSymbol: _getTextSymbol,
            getLineSymbol: _getLineSymbol,
            getFillSymbol: _getFillSymbol,
            getColorByArray: _getColorByArray,
            getColorByHex: _getColorByHex,
            getFont: _getFont
        };
    }]);