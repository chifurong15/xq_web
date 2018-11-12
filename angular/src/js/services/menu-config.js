angular.module('menu.config', [])
    .service('menuConfig', ['$document', '$q', '$http', '$localStorage', '$state', 'moduleService', function ($document, $q, $http, $localStorage, $state, moduleService) {
        var defaultSeqId = "00000";

        this.targetHTML = function (param) {
            var args = param.split('_');
            //console.log(args)
            if (args.length >= 3 && args[2].length != 10) {
                if ($localStorage.platformRouterConfig) {
                    $localStorage.platformRouterConfig['moduleId'] = args[0];
                    $localStorage.platformRouterConfig['type'] = args[1];
                    $localStorage.platformRouterConfig['seqId'] = args[2];
                } else {
                    $localStorage.platformRouterConfig = {};
                    $localStorage.platformRouterConfig['moduleId'] = args[0];
                    $localStorage.platformRouterConfig['type'] = args[1];
                    $localStorage.platformRouterConfig['seqId'] = args[2];
                }
                $localStorage.pageId = args[2];
                $localStorage.ProjectPageId = args[2];
                var moduleFunctions = moduleService.getMoudleHtmlAndJs();
                var htmlUrl = moduleService.getHtmlUrl();
                var targetHtml = "";
                if (moduleFunctions) {
                    for (var i = 0; i < moduleFunctions.length; i++) {
                        if (args[0] == moduleFunctions[i].module.id) {
                            /*  $localStorage.platformRouterConfig['serviceUrl'] = moduleFunctions[i].module.serviceUrl;
                             moduleService.setServiceUrl(moduleFunctions[i].module.serviceUrl);
                             serviceUrl = moduleFunctions[i].module.serviceUrl;*/
                            /* if (!$localStorage.enabledDebug) {
                             $localStorage.platformRouterConfig['htmlUrl'] = moduleFunctions[i].module.htmlUrl;
                             moduleService.setHtmlUrl(moduleFunctions[i].module.htmlUrl);
                             htmlUrl = moduleFunctions[i].module.htmlUrl;
                             }*/
                            //增加一级菜单直接点击事件
                            if (args[2] == defaultSeqId && moduleFunctions[i].functions && moduleFunctions[i].functions.length > 0) {
                                targetHtml = moduleFunctions[i].functions[0].url;
                                $localStorage.platformRouterConfig['seqId'] = moduleFunctions[i].functions[0].seqId;
                                break;
                            }
                            for (var j = 0; j < moduleFunctions[i].functions.length; j++) {
                                if (args[2] == moduleFunctions[i].functions[j].seqId && args[1] == moduleFunctions[i].functions[j].type) {
                                    targetHtml = moduleFunctions[i].functions[j].url;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                if (htmlUrl && targetHtml) {
                    return htmlUrl + "/" + targetHtml;
                }
                else {
                    if ($localStorage.userLoginInfo) {
                        return moduleService.getHtmlUrl() + "/module/menus/404.html";
                    } else {
//                      return $localStorage.ipAdd + "/tpl/page_signin.html";
                        window.location = "#/access/signin";
                    }
                }
            }
        };

        this.targetJS = function (param) {
            var targetJsArray = [];
            var args = param.split('_');
            if (args.length >= 3 && args[2].length != 10) {
                var moduleFunctions = moduleService.getMoudleHtmlAndJs();
                var htmlUrl = moduleService.getHtmlUrl();
                var targetJS = "";
                if (moduleFunctions) {
                    for (var i = 0; i < moduleFunctions.length; i++) {
                        if (args[0] == moduleFunctions[i].module.id) {
                            for (var j = 0; j < moduleFunctions[i].functions.length; j++) {
                                //增加一级菜单直接点击事件
                                if (args[2] == defaultSeqId) {
                                    targetJS = moduleFunctions[i].functions[0].requirejs;
                                    break;
                                }
                                if (args[2] == moduleFunctions[i].functions[j].seqId && args[1] == moduleFunctions[i].functions[j].type) {
                                    targetJS = moduleFunctions[i].functions[j].requirejs;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    var targetJSList = targetJS ? targetJS.split(",") : [];
                    for (var i = 0; i < targetJSList.length; i++) {
                        targetJsArray.push(htmlUrl + "/" + targetJSList[i]);
                    }
                }
            }

            if (targetJsArray && targetJsArray.length > 0) {
                return targetJsArray;
            }
            return "";

        }
    }]);