(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('ImageThing', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {

        return $resource(APP_CONFIG.server_url + "/api/images/:image_id/thing_images");
    }]);

})();