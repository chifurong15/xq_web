// config

var app =
    angular.module('app')
        .config(
            ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
                    // lazy controller, directive and service
                    app.controller = $controllerProvider.register;
                    app.directive = $compileProvider.directive;
                    app.filter = $filterProvider.register;
                    app.factory = $provide.factory;
                    app.service = $provide.service;
                    app.constant = $provide.constant;
                    app.value = $provide.value;
                }
            ]).config(['$sceDelegateProvider', function ($sceDelegateProvider) {

            var allowLoadingDomain = [];
            var allModules = [];
            var omsIpAddress = '';
        var htmlUrl = '';

            $.ajax({
                type: "Get",
                url: 'config/ip.json',
                headers: {"Access-Token": ""},
                async: false
            }).done(function (data) {
                omsIpAddress = data['serviceUrl'];
                htmlUrl = data['htmlUrl'];
                allowLoadingDomain.push[omsIpAddress+"/**"];
                allowLoadingDomain.push[htmlUrl+"/**"];
                $.ajax({
                    type: "Get",
                    url: (omsIpAddress.lastIndexOf('uip') >= 0 ? omsIpAddress : (omsIpAddress + '/uip')) + '/mainmenu/getAllModuleList',
                    headers: {"Access-Token": ""},
                    async: false
                }).done(function (data) {
                    if (data.resCode == 1) {
                        allModules = data.data;

                        for (var i = 0; i < allModules.length; i++) {
                            if (allModules[i].serviceUrl && allModules[i].serviceUrl != "") {
                                allowLoadingDomain.push(allModules[i].serviceUrl + "/**");
                            }
                            if (allModules[i].htmlUrl && allModules[i].htmlUrl != "") {
                                allowLoadingDomain.push(allModules[i].htmlUrl + "/**");
                            }
                        }
                    } else {
                        console.error("get all modules failure.");
                    }
                }).error(function (errData) {
                    console.error("get all modules error.");
                });
            }).error(function (errordata) {
                console.error("get ip config failure.");
            });
            allowLoadingDomain.push('self');
            $sceDelegateProvider.resourceUrlWhitelist(allowLoadingDomain);


        }])
        .config(['$translateProvider', function ($translateProvider) {
            // Register a loader for the static files
            // So, the module will search missing translation tables under the specified urls.
            // Those urls are [prefix][langKey][suffix].
            $translateProvider.useStaticFilesLoader({
                prefix: 'l10n/',
                suffix: '.js'
            });
            // Tell the module what language to use by default
            //$translateProvider.preferredLanguage('en');
            $translateProvider.preferredLanguage('cn');
            // Tell the module to store the language in the local storage
            $translateProvider.useLocalStorage();
        }]);