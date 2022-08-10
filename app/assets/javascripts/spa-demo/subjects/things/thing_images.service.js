(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('ThingImage', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/api/things/:thing_id/thing_images/:id", {
            thing_id: '@thing_id',
            id: '@id'
        }, {
            update: { method: "PUT" }
        });
    }]);

})();