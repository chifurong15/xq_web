/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.filebrowserImageUploadUrl = "http://127.0.0.1:8082/mdDrainageBasin/upload";
    config.language = 'zh-cn'; // 配置语言  
    config.width = 'auto'; // 宽度  
    config.height = '500px'; // 高度  
    config.image_previewText = ' '; //预览区域显示内容  
     config.toolbar_Full = [
       ['Source','-','Save','NewPage','Preview','-','Templates'],
       ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
       ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
       ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
       '/',
       ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
        ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['Link','Unlink','Anchor'],
       ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
       '/',
        ['Styles','Format','Font','FontSize'],
        ['TextColor','BGColor']
    ];
};

//CKEDITOR.on('dialogDefinition', function(ev) {
//	// Take the dialog name and its definition from the event data
//	var dialogName = ev.data.name;
//	var dialogDefinition = ev.data.definition;
//	var editor = ev.editor;
//	if (dialogName == 'image') {
//		dialogDefinition.onOk = function(e) {
//			var imageSrcUrl = e.sender.originalElement.$.src;
//			var imgHtml = CKEDITOR.dom.element.createFromHtml("<img src='" + imageSrcUrl + "' alt='' style='display: block; width: 60%; margin: 10px auto; overflow: hidden'/>");
//			editor.insertElement(imgHtml);
//		};
//	}
//});
//
//CKEDITOR.config.allowedContent = true;