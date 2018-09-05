// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/metadata/types/iso/gmd/metadataEntity/templates/MetadataContact.html":'\x3cdiv data-dojo-attach-point\x3d"containerNode"\x3e\r\n\r\n  \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/iso/ObjectReference"\r\n    data-dojo-props\x3d"target:\'gmd:contact\',minOccurs:1,maxOccurs:\'unbounded\',\r\n      label:\'${i18nIso.MD_Metadata.contact}\'"\x3e\r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/iso/AbstractObject"\r\n      data-dojo-props\x3d"target:\'gmd:CI_ResponsibleParty\',minOccurs:0"\x3e\r\n      \r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n        data-dojo-props\x3d"target:\'gmd:organisationName\',\r\n          label:\'${i18nIso.CI_ResponsibleParty.organisationName}\'"\x3e\r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/iso/GcoElement"\r\n          data-dojo-props\x3d"target:\'gco:CharacterString\'"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element" data-dojo-props\x3d"target:\'gmd:contactInfo\',\r\n        minOccurs:0,showHeader:false"\x3e\r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element" data-dojo-props\x3d"target:\'gmd:CI_Contact\',\r\n          minOccurs:0,showHeader:false"\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element" data-dojo-props\x3d"target:\'gmd:address\',\r\n            minOccurs:0,showHeader:false"\x3e\r\n            \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element" data-dojo-props\x3d"target:\'gmd:CI_Address\',\r\n              minOccurs:0,showHeader:false"\x3e\r\n              \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n                data-dojo-props\x3d"target:\'gmd:electronicMailAddress\',minOccurs:0,maxOccurs:\'unbounded\',\r\n                  label:\'${i18nIso.CI_Address.electronicMailAddress}\'"\x3e\r\n                \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/iso/GcoElement"\r\n                  data-dojo-props\x3d"target:\'gco:CharacterString\'"\x3e\x3c/div\x3e\r\n              \x3c/div\x3e\r\n            \x3c/div\x3e\r\n          \x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/iso/CodeListReference"\r\n        data-dojo-props\x3d"target:\'gmd:role\',\r\n          label:\'${i18nIso.CI_RoleCode.caption}\',minOccurs:1"\x3e\r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/iso/gmd/citation/CI_RoleCode"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n    \r\n\x3c/div\x3e'}});
define("esri/dijit/metadata/types/iso/gmd/metadataEntity/MetadataContact","dojo/_base/declare dojo/_base/lang dojo/has ../../../../base/Descriptor ../../../../form/Element ../../../../form/iso/AbstractObject ../../../../form/iso/CodeListReference ../../../../form/iso/GcoElement ../../../../form/iso/ObjectReference ../citation/CI_RoleCode dojo/text!./templates/MetadataContact.html ../../../../../../kernel".split(" "),function(a,b,c,d,g,h,k,l,m,n,e,f){a=a(d,{templateString:e});c("extend-esri")&&b.setObject("dijit.metadata.types.iso.gmd.metadataEntity.MetadataContact",
a,f);return a});