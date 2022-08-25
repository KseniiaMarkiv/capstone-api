(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('Thing', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        var service = $resource(APP_CONFIG.server_url + "/api/things/:id", { id: '@id' }, { update: { method: "PUT" } });
        return service;
    }]);

})();