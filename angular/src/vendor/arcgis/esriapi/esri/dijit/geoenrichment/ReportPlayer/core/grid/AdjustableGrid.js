// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/geoenrichment/ReportPlayer/core/templates/AdjustableGrid.html":"\x3cdiv class\x3d'esriGEAdjustableGrid'\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d'backgroundNode' class\x3d'adjustableGridBackgroundNode'\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d'mainNode' class\x3d'adjustableGridMainNode'\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d'floatingTablesNode' class\x3d'adjustableGridFloatingTablesNode'\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d'foregroundNode' class\x3d'adjustableGridForegroundNode'\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n\r\n\r\n"}});
define("esri/dijit/geoenrichment/ReportPlayer/core/grid/AdjustableGrid","dojo/_base/declare dojo/_base/lang dojo/aspect dojo/on dojo/store/Memory dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dijit/_WidgetBase dijit/_TemplatedMixin ./_GridHighlightSupport ./_GridLocatorPreviewSupport ./ValueField ./coreUtils/GridBackgroundForegroundUtil ./coreUtils/GridFloatingTablesUtil ./coreUtils/GridBorderUtil ./coreUtils/GridDataUtil ./coreUtils/GridQueryUtil ./coreUtils/GridLayoutCalculator ./coreUtils/GridCellRenderer ./coreUtils/GridStyleUtil ./coreUtils/GridSortUtil ./coreUtils/GridLayoutSizer esri/dijit/geoenrichment/utils/DomUtil esri/dijit/geoenrichment/utils/async/AsyncQueue esri/dijit/geoenrichment/ReportPlayer/core/supportClasses/ViewModes dojo/text!../templates/AdjustableGrid.html".split(" "),
function(r,h,J,K,t,g,n,L,u,v,w,x,y,z,p,A,B,f,q,d,C,D,l,k,E,F,m,G){var H={defaultRowHeight:15.33,rowMinHeight:3,columnMinWidth:3,defaultChartRowHeight:150};return r([v,w,x,y],{templateString:G,viewModel:null,theme:null,columns:null,store:null,backgroundSectionJson:null,foregroundSectionJson:null,enableBackgroundForeground:!1,floatingTablesSectionJson:null,isFloatingTable:!1,layoutDefaults:null,stickToRight:!1,looseResize:!1,keepGridSizeWhenResized:!1,parentWidget:null,parentElementInPageInfo:null,
viewPortContainer:null,parentGrid:null,reportContainerPageNode:null,getPreviewValueFunction:null,previewFeatureIndex:null,fixedViewMode:null,fieldCellClass:null,applyThemeStyle:!0,inheritThemeBackground:!0,enableAsyncRendering:!1,noBorderLineStyle:null,previewModeBorderLineStyle:null,editModeBorderLineStyle:null,renderBordersFromTheme:!1,hasRealBorders:!1,allowSorting:!1,trimTextIfOverflows:!1,shouldStayWithinParent:!0,backgroundSection:null,foregroundSection:null,floatingTablesSection:null,_cellRenderer:null,
_fieldCells:null,_dynamicBindings:null,_isBeingResizedFlag:!1,_asyncQueue:null,postCreate:function(){this.inherited(arguments);this.layoutDefaults=h.mixin({},H,this.layoutDefaults)},refresh:function(a){if(this.domNode)return a=a||{},d.markAsDirty(this),a.preserveFocus||a.preserveFocusAll?this.__refreshAndPreserveFocus(a):this.__simpleRefresh(a),l.updateSorting(this,!1!==a.applyCurrentSorting),this.getRenderPromise()},__simpleRefresh:function(a){this.mainNode&&(a=a||{},this.store&&(this._destroyTableContent(),
n.empty(this.mainNode),this.isEmptyTable()?n.create("div",{"class":"adjustableGrid_emptyRow"},this.mainNode):(g[this.isSingleCelledTable()?"add":"remove"](this.domNode,"esriGEAdjustableGridSingleCell"),d.recalcRows(this),void 0===a.stickToRight&&(a.stickToRight=this.stickToRight),d.recalcColumns(this,a),d.autoSnapLayout(this),this._createCellsFromStoreData(),this._renderCells(),d.positionCells(this)),this.refreshBackground(),this._renderFloatingTables(),this.refreshForeground()))},__refreshAndPreserveFocus:function(a){this.__simpleRefresh(a)},
_createCellsFromStoreData:function(){var a=this;this.enableAsyncRendering&&(this._asyncQueue=new F);this.store.data.forEach(function(b){a.columns.forEach(function(c,e){if(!(b.excludedIndexHorizontal&&b.excludedIndexHorizontal[e]||b.excludedIndexVertical&&b.excludedIndexVertical[e])){var d=c.index+(f.getDataColumnSpan(b,c.field)||1)===a.columns.length,I=b.index+(f.getDataRowSpan(b,c.field)||1)===a.store.data.length;a._createField(b,c,d,I)}})})},_getFieldClass:function(){return z},_createField:function(a,
b,c,e){var d="adjustableGridField field-"+b.field+(c?" lastInRow":"")+(e?" lastRow":"");c={viewModel:this.viewModel,fieldStyle:D.combineCellStyle(this,a,b),borderStyle:this._getBorderStyle(a,b,c,e),"class":d,fieldCellClass:this.fieldCellClass,trimTextIfOverflows:this.trimTextIfOverflows,rowId:a.id,columnId:b.id,parentGrid:this,uniqueId:a.id+b.id,gridData:a,column:b,isLastInRow:c,isLastInColumn:e};a=this._doCreateFieldFromParams(c,a,b);a.domNode.style.position="absolute";this._fieldCells.push(a);return a},
_getBorderStyle:function(a,b,c,e){return B.getBorderStyle(this,a,b,c,e)},getRenderPromise:function(){return this._asyncQueue&&this._asyncQueue.getPromise()},_doCreateFieldFromParams:function(a,b,c){return(new this._getFieldClass)(a).placeAt(this.mainNode)},_postCreateFieldCell:function(a){},_preRenderFieldCell:function(a){},_postRenderFieldCell:function(a){},_renderFieldContent:function(a){this._preRenderFieldCell(a);this._getCellRenderer().renderCellContent(a);this._configureRenderedCellContentSpecificStyles(a);
this._postRenderFieldCell(a)},_configureRenderedCellContentSpecificStyles:function(a){g[f.isNumericVariableFieldCell(a)?"add":"remove"](a.domNode,"hasNumericVariableFieldInfo");g[f.isStringVariableFieldCell(a)?"add":"remove"](a.domNode,"hasStringVariableFieldInfo");g[f.getConditionalFormatting(a)?"add":"remove"](a.domNode,"hasConditionalFormatting")},_getCellRenderer:function(){this._cellRenderer||(this._cellRenderer=new C);return this._cellRenderer},_renderCells:function(){function a(a){b._renderFieldContent(a);
b._postCreateFieldCell(a);b._updateCellViewMode(a)}var b=this;this._fieldCells.forEach(function(c){b._asyncQueue?b._asyncQueue.add(a.bind(b,c),{delayAfter:0}):a(c)})},refreshBackground:function(){this.enableBackgroundForeground&&(this.backgroundSection&&this.backgroundSection.destroy(),this.backgroundSection=p.renderBackground(this,this.backgroundSectionJson,this._getBackgroundSectionCreationParams()))},_getBackgroundSectionCreationParams:function(){return this._getContentLoadingParams()},refreshForeground:function(){this.enableBackgroundForeground&&
(this.foregroundSection&&this.foregroundSection.destroy(),this.foregroundSection=p.renderForeground(this,this.foregroundSectionJson,this._getForegroundSectionCreationParams()))},_getForegroundSectionCreationParams:function(){return this._getContentLoadingParams()},_renderFloatingTables:function(){this.floatingTablesSection&&this.floatingTablesSection.destroy();this.floatingTablesSection=A.renderFloatingTables(this,this.floatingTablesSectionJson,this._getFloatingTablesSectionParams())},_getFloatingTablesSectionParams:function(){var a=
this,b={tableParams:h.mixin({isFloatingTable:!0,parentGrid:this,inheritThemeBackground:this.inheritThemeBackground,layoutDefaults:this.layoutDefaults,_preRenderFieldCell:function(b){a._preRenderFieldCell(b)},_postCreateFieldCell:function(b){a._postCreateFieldCell(b)}},this._getContentLoadingParams())};this._addFloatingTablesSectionCreationParams(b);return b},_addFloatingTablesSectionCreationParams:function(a){return a},getVisualState:function(){return{sorting:l.getSorting(this),cells:this.getFieldCells().map(function(a){return a.content&&
a.content.getVisualState&&a.content.getVisualState()}),backgroundSection:this.backgroundSection&&this.backgroundSection.getVisualState(),floatingTablesSection:this.floatingTablesSection&&this.floatingTablesSection.getVisualState(),foregroundSection:this.foregroundSection&&this.foregroundSection.getVisualState()}},setVisualState:function(a){if(a){a.sorting&&l.setSorting(this,a.sorting);if(a.cells){var b=this.getFieldCells();a.cells.length===b.length&&b.forEach(function(b,e){b.content&&b.content.setVisualState&&
b.content.setVisualState(a.cells[e])})}a.backgroundSection&&this.backgroundSection.setVisualState(a.backgroundSection);a.floatingTablesSection&&this.floatingTablesSection.setVisualState(a.floatingTablesSection);a.foregroundSection&&this.foregroundSection.setVisualState(a.foregroundSection)}},_setCellWidth:function(a,b){d.adjustColumnWidth(this,a.gridData,a.column,b);d.positionCells(this)},_setCellHeight:function(a,b){d.adjustRowHeight(this,a.gridData,a.column.field,b);d.positionCells(this)},setCellWidth:function(a,
b){this._setCellWidth(a,b)},setCellHeight:function(a,b){this._setCellHeight(a,b)},_maxWidth:500,_width:500,_height:0,_spaceAfter:0,_maxHeight:0,_left:0,_top:0,_alternatingStyle:null,getMaxHeight:function(a){return this._maxHeight},setMaxHeight:function(a){this._maxHeight=a},getHeight:function(a,b){return this._height+(!1!==b?this._top:0)+(a?this._spaceAfter||0:0)},getMaxWidth:function(){return this._maxWidth},setMaxWidth:function(a,b){var c=0;b&&b.preserveRightOffset&&(d.recalcGridWidth(this),c=this.getAllowedWidth(),
c=(c-this._width)/c);this._maxWidth=a;b&&b.resizeToFitAllowedWidth&&this.resizeToFitAllowedWidth({rightOffsetWeight:b.preserveRightOffset?c:0})},getLeft:function(){return this._left},getTop:function(){return this._top},setSpaceAfter:function(a){this._spaceAfter=a},getAllowedWidth:function(){return this._maxWidth-this._left},getAllowedWidthFromParent:function(){return this.shouldStayWithinParent?u.get(this.domNode.parentNode,"width")-this._left:1E6},getTableBox:function(){var a=this.getSettings().style;
return{l:a.left,t:a.spaceBefore,w:a.width,h:this.getHeight(!1,!1)}},getDomPosition:function(){return E.position(this.domNode)},resizeToFitAllowedWidth:function(a){this.isEmptyTable()||k.resizeToFitAllowedWidth(this,a)},resizeToFitWidth:function(a){this.isEmptyTable()||k.resizeToFitWidth(this,a)},resizeToFitHeight:function(a,b){this.isEmptyTable()||(!1!==b&&(a-=this._top),k.resizeToFitHeight(this,a))},scaleProportionallyWithinParent:function(a){k.scaleProportionallyWithinParent(this,a)},collapseContent:function(){this.getFieldCells().forEach(function(a){a.content&&
a.content.collapseContent&&a.content.collapseContent()})},hasHiddenContent:function(){return this._checkNeedResizeRowHeightToShowCellsContent(!1)},resizeRowHeightToShowCellsContent:function(){this._checkNeedResizeRowHeightToShowCellsContent(!0)},_checkNeedResizeRowHeightToShowCellsContent:function(a){var b=this,c;this.getFieldCells().forEach(function(e){if(e.content&&e.content.getPreferredHeight){var d=e.content.getPreferredHeight();d>e.getHeight()&&(a&&(d&&(d+=10),b._setCellHeight(e,d)),c=!0)}});
return c},_tableAttributes:null,setSettings:function(a){var b,c=this._left;this.columns.forEach(function(a){a.style&&"number"===typeof a.style.width&&(a._wasBeforeRecalc=!0)});if(a.style){void 0!==a.style.left&&this.setGridPosition(a.style.left);void 0!==a.style.spaceBefore&&this.setGridPosition(void 0,a.style.spaceBefore);void 0!==a.style.spaceAfter&&(this._spaceAfter=a.style.spaceAfter);a.style.width&&(this._width=a.style.width);a.style.alternatingStyle&&(this._alternatingStyle=a.style.alternatingStyle);
var e=this._width;this._width=Math.min(this._width,this.getAllowedWidth());if(this._width!==e||c!==this._left)b=!0}a.attributes&&(this._adjustColumnsForSettings(a)&&(b=!0),this._tableAttributes=a.attributes,this._tableAttributes.rowCount&&this._tableAttributes.rowCount!==this.store.data.length&&this._adjustRowsForSettings(a),delete this._tableAttributes.rowCount,delete this._tableAttributes.columnCount);void 0!==a.scaleToFitWidth&&(this._scaleToFitWidth=a.scaleToFitWidth);void 0!==a.scaleToFitHeight&&
(this._scaleToFitHeight=a.scaleToFitHeight);this._tableAttributes=this._tableAttributes||{};var f=[];this.columns.forEach(function(a){a._wasBeforeRecalc&&f.push(a);delete a._wasBeforeRecalc});this.viewModel.dynamicReportInfo&&this.getNumDynamicColumns()?(d.trimColumnsForNumberOfFeatures(this),this.refresh({resetWidth:!0})):this.viewModel.dynamicReportInfo&&this.getNumDynamicRows()?(d.adjustRowsForNumberOfFeatures(this),this.refresh()):b?this.refresh({resetWidth:!0,columnsToPreserve:f}):this.refresh()},
setGridPosition:function(a,b){void 0!==a&&(this._left=a||0,this.domNode.style.left=this._left+"px");void 0!==b&&(this._top=b||0,this.domNode.style.top=this._top+"px")},_adjustColumnsForSettings:function(a){return!1},_adjustRowsForSettings:function(a){},getSettings:function(){d.recalcGridWidth(this);return{style:{width:this._width,left:this._left,spaceBefore:this._top,spaceAfter:this._spaceAfter,alternatingStyle:this._alternatingStyle},attributes:h.mixin(h.clone(this._tableAttributes),{columnCount:this.columns.length,
rowCount:this.store.data.length}),scaleToFitWidth:this._scaleToFitWidth,scaleToFitHeight:this._scaleToFitHeight}},needScaleToFitWidth:function(){return this._scaleToFitWidth},needScaleToFitHeight:function(){return this._scaleToFitHeight},isEmptyTable:function(){return!this.columns||!this.columns.length||!this.store||!this.store.data.length},isSingleCelledTable:function(){return 1===this.store.data.length&&1===this.columns.length},isMultiFeatureTable:function(){return!!this.getNumDynamicColumns()||
!!this.getNumDynamicRows()},isLocatorTable:function(){return!(!this._tableAttributes||!this._tableAttributes.locatorSettings)},getLocatorSettings:function(){return this._tableAttributes&&this._tableAttributes.locatorSettings},setLocatorSettings:function(a){this._tableAttributes=this._tableAttributes||{};this._tableAttributes.locatorSettings=a},isLocatorHeaderTable:function(){return!(!this._tableAttributes||!this._tableAttributes.isLocatorHeader)},isSummarizeTable:function(){return!(!this._tableAttributes||
!this._tableAttributes.summarizeSettings)},getNumFixedColumns:function(){return this._tableAttributes&&this._tableAttributes.fixedColumns||0},setNumFixedColumns:function(a){this._tableAttributes.fixedColumns=a},getNumDynamicColumns:function(){return this._tableAttributes&&this._tableAttributes.dynamicColumns||0},setNumDynamicColumns:function(a){this._tableAttributes.dynamicColumns=a},getNumFixedRows:function(){return this._tableAttributes&&this._tableAttributes.fixedRows||0},setNumFixedRows:function(a){this._tableAttributes.fixedRows=
a},getNumDynamicRows:function(){return this._tableAttributes&&this._tableAttributes.dynamicRows||0},setNumDynamicRows:function(a){this._tableAttributes.dynamicRows=a},collectFieldInfos:function(a){a=a||{};a.onlySelectedCells&&(a.fieldCells=this.getSelectedCells()||[]);return q.collectFieldInfos(this,a)},_viewMode:null,_specificViewMode:null,_viewModeKey:null,getViewMode:function(){return this._viewMode},getSpecificViewMode:function(){return this._specificViewMode},setViewMode:function(a,b){var c=
this;a=this.fixedViewMode||a;var d=a+b;this._viewModeKey!==d&&(this._viewModeKey=d,this._viewMode=a,void 0!==b&&(this._specificViewMode=b),g[this._viewMode===m.EDIT?"add":"remove"](this.domNode,"adjustableGridEditMode"),g[this._viewMode===m.EDIT?"remove":"add"](this.domNode,"adjustableGridPreviewMode"),this._fieldCells&&this._fieldCells.forEach(function(a){c._updateCellViewMode(a)}),this.backgroundSection&&this.backgroundSection.setViewMode(this._viewMode,this._specificViewMode),this.floatingTablesSection&&
this.floatingTablesSection.setViewMode(this._viewMode,this._specificViewMode),this.foregroundSection&&this.foregroundSection.setViewMode(this._viewMode,this._specificViewMode),this.isLocatorTable()&&this._updatePreviewLocatorTables(this._viewMode!==m.EDIT))},_updateCellViewMode:function(a){a.setBorderStyle(this._getBorderStyle(a.gridData,a.column,a.isLastInRow,a.isLastInColumn));a.content&&a.content.setViewMode&&a.content.setViewMode(this._viewMode,this._specificViewMode);this._getCellRenderer().updateViewMode(a)},
_getContentLoadingParams:function(){return{onContentLoadingStart:this.onContentLoadingStart.bind(this),onContentLoadingEnd:this.onContentLoadingEnd.bind(this)}},getFieldCells:function(a){return a&&a.floatingCells?this.getFloatingCells().concat(this._fieldCells):this._fieldCells},queryCells:function(a){return q.queryCells(this,a)},getFirstCell:function(){return this.getFieldCells()[0]},getCellText:function(a){return f.getFieldCellText(a)},renderCell:function(a){this._renderFieldContent(a)},getInfographicJson:function(){var a=
this.getFirstCell();return f.isInfographicCell(a)?f.getFieldInfo(a).infographicJson:null},getFloatingCells:function(a){var b=[];if(!this.floatingTablesSection)return b;this.floatingTablesSection.getTables().forEach(function(a){b=b.concat(a.getFieldCells())});a&&a.topFirst&&b.reverse();return b},getChartJson:function(){var a=this.getFirstCell();return f.isChartCell(a)?f.getFieldInfo(a).chartJson:null},toJson:function(){var a=this.getSettings();a.id="table";a.data={data:this.store.data,columns:this.columns};
["backgroundSection","foregroundSection","floatingTablesSection"].forEach(function(b){var c=this[b];c&&(c=c.toJson(),c.stack.length&&(a[b+"Json"]=c))},this);return h.clone(a)},fromJson:function(a){a&&a.data&&(this.columns=a.data.columns||[],this.store=new t({data:a.data.data||[],idProperty:"id"}),this.backgroundSectionJson=a.backgroundSectionJson,this.foregroundSectionJson=a.foregroundSectionJson,this.refresh())},notifyShown:function(){this.getFieldCells().forEach(function(a){a.content&&a.content.notifyShown&&
a.content.notifyShown()});this.backgroundSection&&this.backgroundSection.notifyShown();this.floatingTablesSection&&this.floatingTablesSection.notifyShown();this.foregroundSection&&this.foregroundSection.notifyShown()},onContentLoadingStart:function(){},onContentLoadingEnd:function(){},onRequestScaleToFitHeight:function(){},_destroyTableContent:function(){this._renderInfo=null;this._fieldCells=this._fieldCells||[];this._fieldCells.forEach(function(a){a.parentGrid=null;a.gridData=null;a.column=null;
a.destroy()});this._fieldCells.length=0;this.backgroundSection&&this.backgroundSection.destroy();this.backgroundSection=null;this.floatingTablesSection&&this.floatingTablesSection.destroy();this.floatingTablesSection=null;this.foregroundSection&&this.foregroundSection.destroy();this.foregroundSection=null;this._asyncQueue&&this._asyncQueue.destroy();this._asyncQueue=null},destroy:function(){this._destroyTableContent();this.inherited(arguments)}})});