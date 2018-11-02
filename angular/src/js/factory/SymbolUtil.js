/**
 * @description:  Symbol符号类
 * @author: hsf
 * @date: 2018-9-3 16:33
 */
angular.module('app')
    .factory('SymbolUtil', ['wish', 'UtilityTool', function(wish, UtilityTool){
        var w = wish.get();
        var _map = null;
        var _self = this;
        //初始化
        var _init = function(map){
            _map = map;
        };
        //返回点符号
        var _getMarkerSymbol = function(color, size, outline, style){
            var symbol = new w.SimpleMarkerSymbol();
            if(arguments.length == 0){
                return symbol;
            }

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
            var symbol = new w.PictureMarkerSymbol(imgPath, width, height).setOffset(0, height/2);
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
                if(UtilityTool.isArray(color)){
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
        var _getFillSymbol = function(style, outstyle, outcolor, outsize, fillcolor){
            var symbol = new w.SimpleFillSymbol();
            var outline = new w.SimpleLineSymbol();
            if(style){
                symbol.setStyle(style);
            }
            if(outstyle && outcolor && outsize){
                outline.setStyle(outstyle);
                outline.setColor(outcolor);
                outline.setWidth(outsize);
                symbol.setOutline(outline);
            }
            if(fillcolor){
                symbol.setColor(fillcolor);
            }

            return symbol;
        };
        //根据RGB格式获取颜色：[255,0,0]
        var _getColorByArray = function(colorArray){
            return w.Color.fromArray(colorArray);
        };
        //根据十六进制格式获取颜色: #ff0000
        var _getColorByHex = function(hex){
            return w.Color.fromHex(hex);
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