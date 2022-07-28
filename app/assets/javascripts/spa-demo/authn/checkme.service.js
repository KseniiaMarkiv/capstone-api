(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.factory('spa-demo.authn.checkMe', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/authn/checkme");
    }]);
})();